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
from prompts import edit_agent_prompt

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
VIEW_SYSTEM_PROMPT = """You are a Brdge Presentation Assistant, an AI that presents slides while being helpful, engaging, and responsive to user inquiries.

Core Behaviors:

Content Accuracy and Insightful Responses:

Stay accurate to the information provided in the current slide and script.
When users ask broader or deeper questions (e.g., "What is the impact of this?" or "How could this idea work for medical applications?"), provide thoughtful, contextually relevant answers based on your knowledge.
If corrected by a user, acknowledge the correction and maintain the accurate information.
If unsure about something, admit it rather than making assumptions.
Adaptive Communication:

Adjust your explanation style based on user requests (e.g., "explain like I'm 5" or "explain like a VC").
Provide additional context, examples, or analogies to enhance understanding when appropriate.
Translate content when asked, but only for the specific request.
Engaging Interaction:

Encourage user engagement by being open to questions and discussions.
Offer insights and draw connections to real-world applications when relevant and helpful.
Maintain a balance between delivering the presentation and addressing user interests.
Presentation Control:

Don't automatically continue to "next topics" without user prompting.
When interrupted with questions, focus fully on answering them.
Only return to the presentation when the user's questions are fully addressed.
Be clear about your limitations (e.g., cannot change voice or accent).
Response Style:

Keep answers informative and directly relevant to questions.
Avoid unnecessary transitions or forced continuations.
When corrected, gracefully acknowledge and adjust.
Provide thoughtful, evidence-based responses without unwarranted speculation.
DO NOT USE characters like "@" or "#" in your responses, it should all be plain text. You can use human
like ways to emphasize points like 'hmmm' or 'oh' or 'okay' etc. We are feeding this into a TTS engine so the text 
should be as plain as possible (regarding special characters)
Remember: Your primary role is to accurately deliver information and respond helpfully to user questions. Focus on being engaging, insightful, and precise, enhancing the user's understanding and interest in the topic.
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
        self.api_base_url = os.getenv("API_BASE_URL", "http://localhost:5000/api")
        self.walkthrough_id = None
        self._initialize_walkthrough()

    def _initialize_walkthrough(self):
        """Initialize a new walkthrough in the database"""
        try:
            response = requests.post(
                f"{self.api_base_url}/walkthroughs",
                json={"brdge_id": self.brdge_id, "total_slides": self.total_slides},
            )
            response.raise_for_status()
            data = response.json()

            # Check for walkthrough_id in response
            if "id" in data:  # Update this based on your API response
                self.walkthrough_id = data["id"]
                logger.info(
                    f"Created new walkthrough {self.walkthrough_id} for brdge {self.brdge_id}"
                )
            else:
                logger.error(f"No walkthrough ID in response: {data}")
                raise ValueError("No walkthrough ID in response")

        except Exception as e:
            logger.error(f"Error initializing walkthrough: {e}", exc_info=True)
            raise

    def add_message(self, slide_number: int, role: str, content: str):
        """Add a message to the current walkthrough"""
        if not self.walkthrough_id:
            logger.error("No active walkthrough")
            return

        try:
            response = requests.post(
                f"{self.api_base_url}/walkthroughs/{self.walkthrough_id}/messages",
                json={"slide_number": slide_number, "role": role, "content": content},
            )
            response.raise_for_status()
            response_data = response.json()
            logger.info(
                f"Added message to walkthrough {self.walkthrough_id}, slide {slide_number}: {response_data}"
            )
        except Exception as e:
            logger.error(f"Error adding message: {e}", exc_info=True)

    def complete_walkthrough(self):
        """Mark the current walkthrough as completed"""
        if not self.walkthrough_id:
            logger.error("No active walkthrough")
            return

        try:
            response = requests.post(
                f"{self.api_base_url}/walkthroughs/{self.walkthrough_id}/complete"
            )
            response.raise_for_status()
            response_data = response.json()
            logger.info(f"Completed walkthrough {self.walkthrough_id}: {response_data}")
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


def get_brdge_voice_id(brdge_id: str, api_base_url: str) -> str:
    """Get the voice ID for a brdge from database, falling back to default if none found"""
    DEFAULT_VOICE = "85100d63-eb8a-4225-9750-803920c3c8d3"

    try:
        # Log the URL we're trying to access
        url = f"{api_base_url}/brdges/{brdge_id}/voices"
        logger.info(f"Attempting to fetch voices from: {url}")

        # Get voices from API endpoint
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        logger.info(f"API Response: {data}")

        # Check if we have voices and the voices array is not empty
        if data.get("has_voices") and data.get("voices"):
            voices = data["voices"]
            if voices:  # Make sure we have at least one voice
                voice = voices[0]  # Get the first voice (most recent)
                voice_id = voice.get("id")  # The ID is directly in the voice object
                if voice_id:
                    logger.info(f"Using custom voice ID: {voice_id}")
                    return voice_id

        logger.info(f"No custom voices found for brdge {brdge_id}, using default voice")
        return DEFAULT_VOICE

    except Exception as e:
        logger.error(f"Error getting voice ID from API: {e}")
        logger.info(f"Falling back to default voice")
        return DEFAULT_VOICE


# Move the callback outside of entrypoint to make it globally accessible
async def before_llm_callback(
    agent: VoicePipelineAgent, chat_ctx: llm.ChatContext
) -> Optional[llm.LLMStream]:
    logger.info("before_llm_callback invoked!")
    try:
        # Get the current slide and walkthrough_manager from the agent instance
        if hasattr(agent, "current_slide") and hasattr(agent, "walkthrough_manager"):
            if agent.walkthrough_manager and agent.current_slide["number"]:
                if chat_ctx.messages and len(chat_ctx.messages) > 0:
                    last_message = chat_ctx.messages[-1]
                    content = getattr(last_message, "content", None)
                    if content:
                        content = (
                            str(content) if not isinstance(content, str) else content
                        )
                        agent.walkthrough_manager.add_message(
                            agent.current_slide["number"], "user", content
                        )

            # Only process image if it's a new slide and hasn't been processed yet
            if (
                agent.current_slide["initialized"]
                and agent.current_slide["number"]
                != agent.current_slide["last_processed"]
                and not agent.current_slide["image_processed"]
            ):
                if agent.current_slide["brdge_id"] and agent.current_slide["number"]:
                    image_path = f"/tmp/brdge/slides_{agent.current_slide['brdge_id']}/slide_{agent.current_slide['number']}.png"

                    if os.path.exists(image_path):
                        base64_image = image_to_base64(image_path)
                        if base64_image:
                            slide_image = llm.ChatImage(
                                image=f"data:image/png;base64,{base64_image}"
                            )
                            image_message = llm.ChatMessage.create(
                                role="user",
                                text=f"""Examining slide {agent.current_slide['number']}. 
                                    As we discuss this slide, observe and analyze:
                                    - Key messages and themes
                                    - Technical terms or concepts that might need clarification
                                    - The overall structure and flow
                                    - Any visuals, diagrams, or data presented
                                    You can refer to these as you analyze the slide.""",
                                images=[slide_image],
                            )
                            chat_ctx.messages.append(image_message)
                            agent.current_slide["last_processed"] = agent.current_slide[
                                "number"
                            ]
                            agent.current_slide["image_processed"] = True
                            logger.info(
                                f"Processed image for slide {agent.current_slide['number']}"
                            )

    except Exception as e:
        logger.error(f"Error in before_llm_callback: {e}", exc_info=True)

    return agent.llm.chat(chat_ctx=chat_ctx)


class EditAgent(VoicePipelineAgent):
    def __init__(
        self,
        brdge_id: str,
        api_base_url: str = None,
        current_slide=None,
        walkthrough_manager=None,
    ):
        self.api_base_url = api_base_url or os.getenv(
            "API_BASE_URL", "http://localhost:5000"
        )
        self.current_slide = current_slide or {}
        self.walkthrough_manager = walkthrough_manager

        # Pass api_base_url to get_brdge_voice_id
        voice_id = get_brdge_voice_id(brdge_id, self.api_base_url)
        logger.info(f"Using voice ID for EditAgent: {voice_id}")

        super().__init__(
            vad=silero.VAD.load(),
            stt=deepgram.STT(),
            llm=openai.LLM(model="gpt-4o", temperature=0.5),
            tts=cartesia.TTS(voice=voice_id),
            chat_ctx=llm.ChatContext().append(role="system", text=edit_agent_prompt),
            interrupt_speech_duration=0.1,
        )


class ViewerAgent(VoicePipelineAgent):
    def __init__(self, brdge_id: str, api_base_url: str = None):
        self.brdge_id = brdge_id
        self.api_base_url = api_base_url or os.getenv(
            "API_BASE_URL", "http://localhost:5000"
        )
        logger.info(f"ViewerAgent initialized with API URL: {self.api_base_url}")

        # Load scripts from database
        self.scripts = self._load_scripts()
        self.current_slide = None

        # Get voice ID from database
        logger.info(
            f"Fetching voice ID from {self.api_base_url}/brdges/{brdge_id}/voices"
        )
        voice_id = get_brdge_voice_id(brdge_id, self.api_base_url)
        logger.info(f"Using voice ID for ViewerAgent: {voice_id}")

        super().__init__(
            vad=silero.VAD.load(),
            stt=deepgram.STT(),
            llm=openai.LLM(model="gpt-4o-mini"),
            tts=cartesia.TTS(voice=voice_id),
            chat_ctx=llm.ChatContext().append(role="system", text=VIEW_SYSTEM_PROMPT),
        )

    def _load_scripts(self) -> dict:
        """Load scripts using API request"""
        try:
            import requests

            # Get scripts from API endpoint using same pattern as walkthrough manager
            response = requests.get(
                f"{self.api_base_url}/brdges/{self.brdge_id}/scripts", timeout=10
            )
            response.raise_for_status()

            data = response.json()
            if data.get("has_scripts"):
                scripts = data["scripts"]
                logger.info(f"Found scripts for brdge {self.brdge_id}: {scripts}")
                # Convert string keys to slide numbers if needed
                return {str(k): v for k, v in scripts.items()}
            else:
                logger.warning(f"No scripts found for brdge {self.brdge_id}")
                return {}

        except requests.RequestException as e:
            logger.error(f"Error fetching scripts from API: {e}", exc_info=True)
            return {}
        except Exception as e:
            logger.error(f"Error loading scripts: {e}", exc_info=True)
            return {}

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
                        agent = ViewerAgent(
                            brdge_id=current_slide["brdge_id"],
                            api_base_url=current_slide["api_base_url"],
                        )
                    else:  # edit mode
                        logger.info(
                            f"Initializing EditAgent for brdge {current_slide['brdge_id']}"
                        )
                        agent = EditAgent(
                            brdge_id=current_slide["brdge_id"],
                            api_base_url=current_slide["api_base_url"],
                            current_slide=current_slide,
                            walkthrough_manager=walkthrough_manager,
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
                        try:
                            walkthrough_manager = WalkthroughManager(
                                json_data["brdgeId"], json_data["numSlides"]
                            )
                            logger.info(
                                f"Successfully created walkthrough manager for brdge {json_data['brdgeId']}"
                            )
                        except Exception as e:
                            logger.error(
                                f"Failed to create walkthrough manager: {e}",
                                exc_info=True,
                            )
                            # Maybe send an error message to the client here

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
                    image_path = f"/tmp/brdge/slides_{agent.current_slide['brdge_id']}/slide_{agent.current_slide['number']}.png"

                    if os.path.exists(image_path):
                        base64_image = image_to_base64(image_path)
                        if base64_image:
                            slide_image = llm.ChatImage(
                                image=f"data:image/png;base64,{base64_image}"
                            )
                            image_message = llm.ChatMessage.create(
                                role="user",
                                text=f"""Slide:{agent.current_slide['number']}. 
                                    As we discuss this slide, observe and analyze:
                                    - Key messages and themes
                                    - Technical terms or concepts that might need clarification
                                    - The overall structure and flow
                                    - Any visuals, diagrams, or data presented
                                    You can refer to these as you analyze the slide.""",
                                images=[slide_image],
                            )
                            agent.chat_ctx.messages.append(image_message)
                            agent.current_slide["last_processed"] = agent.current_slide[
                                "number"
                            ]
                            agent.current_slide["image_processed"] = True
                            logger.info(
                                f"Processed image for slide {agent.current_slide['number']}"
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
                        # For edit mode, use the callback -- need to fix this
                        # stream = await before_llm_callback(agent, agent.chat_ctx)
                        # response = await agent.say(stream, allow_interruptions=True)
                        response = await agent.say(
                            agent.llm.chat(chat_ctx=agent.chat_ctx),
                            allow_interruptions=True,
                        )
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

    # Keep the connection alive
    disconnect_event = asyncio.Event()

    @ctx.room.on("disconnected")
    def on_disconnect(*args):
        nonlocal walkthrough_manager
        try:
            if walkthrough_manager:
                walkthrough_manager.complete_walkthrough()
                # Send a message to the frontend to trigger refresh
                refresh_message = {
                    "type": "WALKTHROUGH_COMPLETED",
                    "message": "Walkthrough completed successfully",
                }
                # Convert to bytes and send via data channel
                encoded_message = json.dumps(refresh_message).encode("utf-8")
                ctx.room.local_participant.publish_data(encoded_message, "reliable")
                logger.info("Sent walkthrough completion message to frontend")

            logger.info("Room disconnected")
            disconnect_event.set()
        except Exception as e:
            logger.error(f"Error in disconnect handler: {e}")

    try:
        await disconnect_event.wait()
    finally:
        logger.info("Cleaning up...")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
