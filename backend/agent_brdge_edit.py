import logging
from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
)
import asyncio
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import openai, deepgram, silero, cartesia
from livekit.agents.llm import ChatImage
from livekit import rtc
from livekit.rtc import VideoFrame, DataPacket
from livekit.rtc._proto import video_frame_pb2
import json
from datetime import datetime
import io
from PIL import Image
import base64
import os
import requests
from typing import Optional
import os.path
from typing import Dict, List, Any

load_dotenv(dotenv_path=".env_local")
logger = logging.getLogger("voice-agent")

# First, let's modify the SYSTEM_PROMPT to be specific to the edit mode
EDIT_SYSTEM_PROMPT = """You are a Brdge Learning Assistant, an AI that learns from presenters by analyzing their slides and asking insightful questions when needed.
Core Behaviors:
1. Listen First: Let the presenter speak freely. Don't interrupt their flow unless necessary.

2. Strategic Questions: Only interject when:
   - A critical concept needs clarification
   - You notice a unique presentation pattern worth capturing
   - There's a natural pause and you need essential context

3. When You Speak:
   - Keep it ultra-brief (under 20 words)
   - Use gentle interjections like "Quick question..." or "Could you clarify..."
   - Time your questions during natural pauses

4. Capture Style:
   - Pay attention to their pacing
   - Note their unique phrases and explanations
   - Observe their transition patterns

Remember: Your presence should feel like a thoughtful observer rather than an active participant. The presenter should almost forget you're there.
"""

# Add a new system prompt for the view mode
VIEW_SYSTEM_PROMPT = """You are a Brdge Presentation Assistant, an AI that presents slides while being helpful and engaging.
Core Behaviors:
1. Content Accuracy:
   - Stay strictly within the information provided in the current slide and script
   - Never reference or promise information about "next slides" unless explicitly in your script
   - If corrected by a user, acknowledge the correction and maintain the accurate information
   - If unsure about something, admit it rather than making assumptions

2. Adaptive Communication:
   - Adjust your explanation style based on user requests (e.g., "explain like I'm 5" or "explain like a VC")
   - Keep responses focused on the current context
   - Provide one-sentence summaries when requested
   - Translate content when asked, but only for the specific request

3. Presentation Control:
   - Don't automatically continue to "next topics" without user prompting
   - When interrupted with questions, focus fully on answering them
   - Only return to the presentation when the user's questions are fully addressed
   - Be clear about your limitations (e.g., cannot change voice or accent)

4. Response Style:
   - Keep answers concise and directly relevant to questions
   - Avoid unnecessary transitions or forced continuations
   - When corrected, gracefully acknowledge and adjust
   - Don't add speculative information beyond what's in your script

Remember: Your primary role is to accurately deliver information and respond to questions. Focus on being helpful and precise rather than trying to control the flow of the conversation.
"""

# At the top of the file, add these logging configurations
import logging

logging.basicConfig(level=logging.DEBUG)  # Set root logger to DEBUG
livekit_logger = logging.getLogger("livekit")
livekit_logger.setLevel(logging.DEBUG)
rtc_logger = logging.getLogger("livekit.rtc")
rtc_logger.setLevel(logging.DEBUG)


def initialize_walkthrough(brdge_id: str, total_slides: int) -> Dict[str, Any]:
    """Create a new walkthrough entry"""
    return {
        "brdge_id": brdge_id,
        "timestamp": datetime.utcnow().isoformat(),
        "slides": {str(i): [] for i in range(1, total_slides + 1)},
        "metadata": {
            "total_slides": total_slides,
            "status": "in_progress",
            "created_at": datetime.utcnow().isoformat(),
            "completed_at": None,
        },
    }


def load_walkthrough_file(brdge_id: str) -> List[Dict[str, Any]]:
    """Load existing walkthrough file or return empty list"""
    file_path = f"data/walkthroughs/brdge_{brdge_id}.json"
    try:
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Error loading walkthrough file: {e}")
    return []


def save_walkthrough(brdge_id: str, walkthroughs: List[Dict[str, Any]]) -> bool:
    """Save walkthroughs to file"""
    file_path = f"data/walkthroughs/brdge_{brdge_id}.json"
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w") as f:
            json.dump(walkthroughs, f, indent=2)
        return True
    except Exception as e:
        logger.error(f"Error saving walkthrough: {e}")
        return False


class WalkthroughManager:
    def __init__(self, brdge_id: str, total_slides: int):
        self.brdge_id = brdge_id
        self.total_slides = total_slides
        self.current_walkthrough = None
        self.walkthroughs = []
        self.api_base_url = "http://localhost:5000/api"  # Configure as needed
        self.load_or_create_walkthrough()

    def load_or_create_walkthrough(self):
        """Load existing walkthroughs and create new entry"""
        try:
            # Create new walkthrough via API
            response = requests.post(
                f"{self.api_base_url}/walkthroughs",
                json={"brdge_id": self.brdge_id, "total_slides": self.total_slides},
            )
            response.raise_for_status()
            walkthrough_data = response.json()

            # Initialize walkthrough data
            self.current_walkthrough = {
                "id": walkthrough_data["id"],
                "brdge_id": self.brdge_id,
                "timestamp": walkthrough_data["created_at"],
                "slides": {str(i): [] for i in range(1, self.total_slides + 1)},
                "metadata": {
                    "total_slides": self.total_slides,
                    "status": walkthrough_data["status"],
                    "created_at": walkthrough_data["created_at"],
                    "completed_at": None,
                },
            }

            # Handle local file storage as before
            file_path = f"data/walkthroughs/brdge_{self.brdge_id}.json"
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            if os.path.exists(file_path):
                try:
                    with open(file_path, "r") as f:
                        self.walkthroughs = json.load(f)
                        if not isinstance(self.walkthroughs, list):
                            self.walkthroughs = []
                except Exception as e:
                    logger.error(f"Error loading walkthrough file: {e}")
                    self.walkthroughs = []

            self.walkthroughs.append(self.current_walkthrough)
            self.save()

        except Exception as e:
            logger.error(f"Error creating walkthrough: {e}", exc_info=True)
            raise

    def add_message(self, slide_number: int, role: str, content: str):
        """Add message via API"""
        try:
            response = requests.post(
                f"{self.api_base_url}/walkthroughs/{self.current_walkthrough['id']}/messages",
                json={"slide_number": slide_number, "role": role, "content": content},
            )
            response.raise_for_status()
            message_data = response.json()

            # Update local storage
            slide_key = str(slide_number)
            if slide_key not in self.current_walkthrough["slides"]:
                logger.error(f"Invalid slide number: {slide_key}")
                return

            message = {
                "role": role,
                "content": content,
                "timestamp": message_data["timestamp"],
            }
            self.current_walkthrough["slides"][slide_key].append(message)
            self.save()

        except Exception as e:
            logger.error(f"Error adding message: {e}", exc_info=True)

    def save(self):
        """Save current state to file"""
        try:
            file_path = f"data/walkthroughs/brdge_{self.brdge_id}.json"

            # Validate data before saving
            if not isinstance(self.walkthroughs, list):
                logger.error("Invalid walkthroughs data structure")
                return

            # Ensure the directory exists
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            # Verify JSON serialization before writing
            try:
                json_data = json.dumps(self.walkthroughs, indent=2)
            except TypeError as e:
                logger.error(f"JSON serialization error: {e}")
                return

            # Write to file
            with open(file_path, "w") as f:
                f.write(json_data)

            logger.debug(f"Successfully saved walkthrough to {file_path}")

        except Exception as e:
            logger.error(f"Error saving walkthrough: {e}", exc_info=True)

    def complete_walkthrough(self):
        """Complete walkthrough via API"""
        try:
            response = requests.post(
                f"{self.api_base_url}/walkthroughs/{self.current_walkthrough['id']}/complete"
            )
            response.raise_for_status()
            completion_data = response.json()

            # Update local storage
            self.current_walkthrough["metadata"]["status"] = "completed"
            self.current_walkthrough["metadata"]["completed_at"] = completion_data[
                "completed_at"
            ]
            self.save()
            logger.info(f"Completed walkthrough for brdge {self.brdge_id}")

        except Exception as e:
            logger.error(f"Error completing walkthrough: {e}", exc_info=True)


# Add a function to load scripts for a specific brdge
def load_slide_scripts(brdge_id: str) -> Dict[str, str]:
    """Load scripts for a specific brdge"""
    # Get the absolute path to the data directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(
        current_dir, "data", "slides", f"brdge_{brdge_id}_slides.json"
    )

    logger.info(f"Attempting to load scripts from: {file_path}")

    try:
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                data = json.load(f)
                scripts = data.get("slide_scripts", {})
                logger.info(f"Successfully loaded scripts: {scripts}")
                return scripts
        else:
            logger.warning(f"Script file not found at: {file_path}")
            # Log the directory contents to help debug
            slides_dir = os.path.join(current_dir, "data", "slides")
            if os.path.exists(slides_dir):
                logger.info(
                    f"Available files in slides directory: {os.listdir(slides_dir)}"
                )
            else:
                logger.warning(f"Slides directory not found: {slides_dir}")
    except Exception as e:
        logger.error(f"Error loading scripts: {e}", exc_info=True)
    return {}


def get_brdge_voice_id(brdge_id: str) -> str:
    """Get the voice ID for a brdge, falling back to default if none found"""
    DEFAULT_VOICE = "85100d63-eb8a-4225-9750-803920c3c8d3"

    try:
        voices_dir = "data/voices"
        voice_file_path = os.path.join(voices_dir, f"brdge_{brdge_id}_voices.json")

        if not os.path.exists(voice_file_path):
            logger.info(f"No voices found for brdge {brdge_id}, using default")
            return DEFAULT_VOICE

        with open(voice_file_path, "r") as f:
            voices = json.load(f)
            if not voices:
                return DEFAULT_VOICE

            # Get the first voice from the list or the single voice object
            if isinstance(voices, list):
                return voices[0].get("id", DEFAULT_VOICE)
            return voices.get("id", DEFAULT_VOICE)

    except Exception as e:
        logger.error(f"Error getting voice ID: {e}")
        return DEFAULT_VOICE


class EditAgent(VoicePipelineAgent):
    def __init__(self, brdge_id: str):
        voice_id = get_brdge_voice_id(brdge_id)
        logger.info(f"Using voice ID for EditAgent: {voice_id}")

        super().__init__(
            vad=silero.VAD.load(),
            stt=deepgram.STT(),
            llm=openai.LLM(model="gpt-4o-mini"),
            tts=cartesia.TTS(voice=voice_id),
            chat_ctx=llm.ChatContext().append(role="system", text=EDIT_SYSTEM_PROMPT),
        )


class ViewerAgent(VoicePipelineAgent):
    def __init__(self, brdge_id: str):
        self.brdge_id = brdge_id
        logger.info(f"Initializing ViewerAgent for brdge_id: {brdge_id}")
        self.scripts = self._load_scripts()
        self.current_slide = None

        voice_id = get_brdge_voice_id(brdge_id)
        logger.info(f"Using voice ID for ViewerAgent: {voice_id}")

        super().__init__(
            vad=silero.VAD.load(),
            stt=deepgram.STT(),
            llm=openai.LLM(model="gpt-4o-mini"),
            tts=cartesia.TTS(voice=voice_id),
            chat_ctx=llm.ChatContext().append(role="system", text=VIEW_SYSTEM_PROMPT),
        )

    def _load_scripts(self):
        """Load scripts for this brdge"""
        return load_slide_scripts(self.brdge_id)

    async def present_slide(self, slide_number: str):
        """Present the script for the current slide"""
        logger.info(f"Attempting to present slide {slide_number}")

        try:
            if slide_number != self.current_slide:
                self.current_slide = slide_number
                script = self.scripts.get(str(slide_number))

                if script:
                    logger.info(f"Found script for slide {slide_number}: {script}")
                    await self.say(script, allow_interruptions=True)
                else:
                    logger.warning(f"No script found for slide {slide_number}")
                    await self.say(
                        "I don't have any content for this slide.",
                        allow_interruptions=True,
                    )
        except Exception as e:
            logger.error(f"Error presenting slide: {e}", exc_info=True)
            await self.say(
                "I encountered an error while presenting this slide.",
                allow_interruptions=True,
            )


async def get_slide_image(url: str, brdge_id: str, slide_number: int) -> str:
    """Get slide image path, checking local tmp first before downloading"""
    tmp_dir = f"/tmp/brdge/slides_{brdge_id}"
    file_path = f"{tmp_dir}/slide_{slide_number}.png"

    if os.path.exists(file_path):
        logger.debug(f"Found existing slide in tmp directory: {file_path}")
        return file_path

    try:
        logger.info(f"Slide not found locally, downloading from {url}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        os.makedirs(tmp_dir, exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(response.content)

        logger.info(f"Successfully downloaded and saved slide to {file_path}")
        return file_path
    except Exception as e:
        logger.error(f"Error handling slide: {e}", exc_info=True)
        return None


def image_to_base64(image_path: str) -> str:
    """Convert image to base64 string"""
    try:
        with Image.open(image_path) as img:
            if img.mode != "RGB":
                img = img.convert("RGB")
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            return base64.b64encode(buffer.getvalue()).decode("utf-8")
    except Exception as e:
        logger.error(f"Error converting image to base64: {e}")
        return None


# Modify the entrypoint function to handle both modes
async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect()

    participant = await ctx.wait_for_participant()
    logger.info(f"starting assistant for participant {participant.identity}")

    initial_slide_received = asyncio.Event()
    walkthrough_manager = None
    current_slide = {
        "number": None,
        "url": None,
        "total_slides": 0,
        "api_base_url": None,
        "brdge_id": None,
        "initialized": False,
        "last_processed": None,
        "agent_type": None,
        "image_processed": False,
    }

    # Define the LLM callback for edit mode
    async def before_llm_callback(
        agent: VoicePipelineAgent, chat_ctx: llm.ChatContext
    ) -> Optional[llm.LLMStream]:
        logger.info("before_llm_callback invoked!")
        try:
            nonlocal walkthrough_manager
            if walkthrough_manager and current_slide["number"]:
                if chat_ctx.messages and len(chat_ctx.messages) > 0:
                    last_message = chat_ctx.messages[-1]
                    content = getattr(last_message, "content", None)
                    if content:
                        content = (
                            str(content) if not isinstance(content, str) else content
                        )
                        walkthrough_manager.add_message(
                            current_slide["number"], "user", content
                        )

            # Only process image if it's a new slide and hasn't been processed yet
            if (
                current_slide["initialized"]
                and current_slide["number"] != current_slide["last_processed"]
                and not current_slide["image_processed"]
            ):
                if current_slide["brdge_id"] and current_slide["number"]:
                    image_path = f"/tmp/brdge/slides_{current_slide['brdge_id']}/slide_{current_slide['number']}.png"

                    if os.path.exists(image_path):
                        base64_image = image_to_base64(image_path)
                        if base64_image:
                            slide_image = llm.ChatImage(
                                image=f"data:image/png;base64,{base64_image}"
                            )
                            image_message = llm.ChatMessage.create(
                                role="user",
                                text=f"New slide {current_slide['number']} - Please analyze this slide and be ready to discuss it.",
                                images=[slide_image],
                            )
                            chat_ctx.messages.append(image_message)
                            current_slide["last_processed"] = current_slide["number"]
                            current_slide["image_processed"] = True  # Mark as processed
                            logger.info(
                                f"Processed image for slide {current_slide['number']}"
                            )

        except Exception as e:
            logger.error(f"Error in before_llm_callback: {e}", exc_info=True)

        return agent.llm.chat(chat_ctx=chat_ctx)

    agent = None
    chat = rtc.ChatManager(ctx.room)

    @ctx.room.on("data_received")
    def on_data_received(data_packet: DataPacket):
        nonlocal walkthrough_manager, agent, current_slide
        try:
            decoded_message = data_packet.data.decode("utf-8")
            json_data = json.loads(decoded_message)

            if json_data.get("currentSlide") is not None:
                new_slide = current_slide["number"] != json_data["currentSlide"]

                # Reset image_processed flag if it's a new slide
                if new_slide:
                    current_slide["image_processed"] = False

                current_slide.update(
                    {
                        "number": json_data["currentSlide"],
                        "total_slides": json_data["numSlides"],
                        "api_base_url": json_data["apiBaseUrl"],
                        "brdge_id": json_data["brdgeId"],
                        "url": json_data.get("slideUrl"),
                        "initialized": True,
                        "agent_type": json_data.get("agentType", "edit"),
                    }
                )

                # Initialize the appropriate agent if not already done
                if not agent:
                    if current_slide["agent_type"] == "view":
                        logger.info(
                            f"Initializing ViewerAgent for brdge {current_slide['brdge_id']}"
                        )
                        agent = ViewerAgent(current_slide["brdge_id"])
                    else:  # edit mode
                        initial_ctx = llm.ChatContext().append(
                            role="system", text=EDIT_SYSTEM_PROMPT
                        )
                        agent = VoicePipelineAgent(
                            vad=silero.VAD.load(),
                            stt=deepgram.STT(),
                            llm=openai.LLM(model="gpt-4o-mini"),
                            tts=cartesia.TTS(
                                voice="41f3c367-e0a8-4a85-89e0-c27bae9c9b6d"
                            ),
                            chat_ctx=initial_ctx,
                            before_llm_cb=before_llm_callback,
                        )

                        @agent.on("agent_speech_committed")
                        def on_agent_speech_committed(msg: llm.ChatMessage):
                            logger.info(f"Agent speech committed: {msg.content}")
                            if (
                                current_slide["number"]
                                and walkthrough_manager
                                and current_slide["agent_type"] == "edit"
                            ):
                                walkthrough_manager.add_message(
                                    current_slide["number"], "assistant", msg.content
                                )

                    agent.start(ctx.room, participant)

                # Initialize walkthrough manager for edit mode
                if current_slide["agent_type"] == "edit" and not walkthrough_manager:
                    if json_data.get("brdgeId") and json_data.get("numSlides"):
                        walkthrough_manager = WalkthroughManager(
                            json_data["brdgeId"], json_data["numSlides"]
                        )

                # Handle new slide image for edit mode
                if (
                    current_slide["agent_type"] == "edit"
                    and new_slide
                    and current_slide["url"]
                ):
                    asyncio.create_task(
                        get_slide_image(
                            current_slide["url"],
                            current_slide["brdge_id"],
                            current_slide["number"],
                        )
                    )

                if not initial_slide_received.is_set():
                    initial_slide_received.set()

                # For view mode, present the script
                if current_slide["agent_type"] == "view" and isinstance(
                    agent, ViewerAgent
                ):
                    asyncio.create_task(
                        agent.present_slide(str(current_slide["number"]))
                    )

        except Exception as e:
            logger.error(f"Error processing data received: {e}", exc_info=True)

    # Handle chat messages
    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        if not agent:
            logger.warning("Agent not initialized, cannot process chat message")
            return

        cleaned_message = " ".join(msg.message.split()).strip()
        if cleaned_message:
            logger.info(f"Received chat message: {cleaned_message}")

            # Log user message to walkthrough
            if current_slide["number"] and walkthrough_manager:
                walkthrough_manager.add_message(
                    current_slide["number"], "user", cleaned_message
                )

            # Add message to agent's chat context
            agent.chat_ctx.append(role="user", text=cleaned_message)

            async def process_message():
                try:
                    if current_slide["agent_type"] == "view":
                        # For view mode, get current slide's script as context
                        if isinstance(agent, ViewerAgent):
                            current_script = agent.scripts.get(
                                str(agent.current_slide), ""
                            )
                            # Create a new chat context with the script context
                            context_message = llm.ChatMessage.create(
                                role="system",
                                text=f"""
                                Current slide: {agent.current_slide}
                                Current script: {current_script}
                                
                                Please respond to the user's question in the context of the current slide and its script.
                                Keep responses concise and relevant to the presentation content.
                                """,
                            )
                            # Add context message to chat context
                            temp_ctx = agent.chat_ctx.copy()
                            temp_ctx.messages.insert(-1, context_message)

                            # Don't await the chat call, just pass the stream directly to say()
                            await agent.say(
                                agent.llm.chat(chat_ctx=temp_ctx),
                                allow_interruptions=False,
                            )
                    else:
                        # For edit mode, use the callback
                        stream = await before_llm_callback(agent, agent.chat_ctx)
                        response = await agent.say(stream, allow_interruptions=False)

                        # Log assistant's response to walkthrough
                        if current_slide["number"] and walkthrough_manager:
                            walkthrough_manager.add_message(
                                current_slide["number"], "assistant", response
                            )
                except Exception as e:
                    logger.error(f"Error processing chat message: {e}", exc_info=True)
                    await agent.say(
                        "I apologize, but I encountered an error processing your message.",
                        allow_interruptions=False,
                    )

            # Create task to handle the async processing
            asyncio.create_task(process_message())

    # Send initial greeting
    await initial_slide_received.wait()
    greeting = (
        "I'm ready to present..."
        if current_slide["agent_type"] == "view"
        else "I'm listening..."
    )
    await agent.say(greeting, allow_interruptions=False)

    # Keep the connection alive
    disconnect_event = asyncio.Event()

    @ctx.room.on("disconnected")
    def on_disconnect(*args):
        nonlocal walkthrough_manager
        if walkthrough_manager:
            walkthrough_manager.complete_walkthrough()
        logger.info("Room disconnected")
        disconnect_event.set()

    try:
        await disconnect_event.wait()
    finally:
        logger.info("Cleaning up...")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
