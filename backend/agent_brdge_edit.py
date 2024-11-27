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

SYSTEM_PROMPT = """You are a Brdge Learning Assistant, an AI that learns from presenters by analyzing their slides and asking insightful questions when needed.
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
        self.load_or_create_walkthrough()

    def load_or_create_walkthrough(self):
        """Load existing walkthroughs and create new entry"""
        file_path = f"data/walkthroughs/brdge_{self.brdge_id}.json"

        # Load existing walkthroughs
        if os.path.exists(file_path):
            try:
                with open(file_path, "r") as f:
                    self.walkthroughs = json.load(f)
                    if not isinstance(self.walkthroughs, list):
                        logger.warning(
                            "Corrupted walkthrough file, resetting to empty list"
                        )
                        self.walkthroughs = []
            except json.JSONDecodeError as e:
                logger.error(f"Error decoding walkthrough file: {e}")
                self.walkthroughs = []
            except Exception as e:
                logger.error(f"Error loading walkthrough file: {e}")
                self.walkthroughs = []

        # Create new walkthrough entry
        self.current_walkthrough = initialize_walkthrough(
            self.brdge_id, self.total_slides
        )

        # If walkthroughs exist, append to them
        if isinstance(self.walkthroughs, list):
            self.walkthroughs.append(self.current_walkthrough)
        else:
            self.walkthroughs = [self.current_walkthrough]

        self.save()

    def add_message(self, slide_number: int, role: str, content: str):
        """Add a message to the current slide's transcript"""
        try:
            if not self.current_walkthrough:
                logger.error("No current walkthrough available")
                return

            slide_key = str(slide_number)
            if slide_key not in self.current_walkthrough["slides"]:
                logger.error(f"Invalid slide number: {slide_key}")
                return

            # Ensure content is serializable
            if hasattr(content, "__iter__") and not isinstance(
                content, (str, dict, list)
            ):
                logger.warning(
                    f"Converting non-serializable content type: {type(content)}"
                )
                content = str(content)

            # Clean and validate content
            content = str(content).strip() if content else ""
            if not content:
                logger.warning("Empty content received, skipping message")
                return

            message = {
                "role": role,
                "content": content,
                "timestamp": datetime.utcnow().isoformat(),
            }

            logger.debug(f"Adding message to slide {slide_key}: {json.dumps(message)}")
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
        """Mark the current walkthrough as completed"""
        try:
            if self.current_walkthrough:
                self.current_walkthrough["metadata"]["status"] = "completed"
                self.current_walkthrough["metadata"][
                    "completed_at"
                ] = datetime.utcnow().isoformat()
                self.save()
                logger.info(f"Completed walkthrough for brdge {self.brdge_id}")
        except Exception as e:
            logger.error(f"Error completing walkthrough: {e}", exc_info=True)


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect()

    participant = await ctx.wait_for_participant()
    logger.info(f"starting learning assistant for participant {participant.identity}")

    initial_ctx = llm.ChatContext().append(role="system", text=SYSTEM_PROMPT)
    log_queue = asyncio.Queue()
    initial_slide_received = asyncio.Event()
    walkthrough_manager = None

    # Track current slide with better initialization
    current_slide = {
        "number": None,
        "url": None,
        "total_slides": 0,
        "api_base_url": None,
        "brdge_id": None,
        "initialized": False,
        "last_processed": None,
    }
    # Create the LLM instance
    llm_instance = openai.LLM(model="gpt-4o-mini")

    # Define the callback with correct signature and return type
    async def before_llm_callback(
        agent: VoicePipelineAgent, chat_ctx: llm.ChatContext
    ) -> Optional[llm.LLMStream]:
        logger.info("before_llm_callback invoked!")
        try:
            nonlocal walkthrough_manager
            if walkthrough_manager and current_slide["number"]:
                # Get the last message content safely
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

            # Only process the image if this is a new slide
            if (
                current_slide["initialized"]
                and current_slide["number"] != current_slide["last_processed"]
            ):

                logger.info(f"Processing new slide: {current_slide['number']}")

                if current_slide["brdge_id"] and current_slide["number"]:
                    image_path = f"/tmp/brdge/slides_{current_slide['brdge_id']}/slide_{current_slide['number']}.png"

                    if os.path.exists(image_path):
                        base64_image = image_to_base64(image_path)
                        if base64_image:
                            # Create ChatImage with proper data URL format
                            slide_image = llm.ChatImage(
                                image=f"data:image/png;base64,{base64_image}"
                            )
                            # Create message with images list
                            image_message = llm.ChatMessage.create(
                                role="user",
                                text=f"New slide {current_slide['number']} - Please analyze this slide and be ready to discuss it.",
                                images=[slide_image],
                            )
                            # Add the image message to context
                            chat_ctx.messages.append(image_message)
                            logger.debug("Added new slide image to chat context")

                            # Update last processed slide
                            current_slide["last_processed"] = current_slide["number"]

        except Exception as e:
            logger.error(f"Error in before_llm_callback: {e}", exc_info=True)

        # Return chat stream
        return agent.llm.chat(chat_ctx=chat_ctx)

    # Create and start the assistant with the callback
    assistant = VoicePipelineAgent(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=llm_instance,
        tts=cartesia.TTS(voice="41f3c367-e0a8-4a85-89e0-c27bae9c9b6d"),
        chat_ctx=initial_ctx,
        before_llm_cb=before_llm_callback,
    )

    # Verify the callback is set
    logger.info(
        f"Assistant created with before_llm_cb: {assistant._opts.before_llm_cb is not None}"
    )

    # Start the assistant and chat manager
    assistant.start(ctx.room, participant)
    chat = rtc.ChatManager(ctx.room)

    # @assistant.on()
    @assistant.on("agent_speech_committed")
    def on_agent_speech_committed(msg: llm.ChatMessage):
        logger.info(f"Agent speech committed: {msg.content}")
        # save to walkthrough
        try:
            nonlocal walkthrough_manager
            if walkthrough_manager and current_slide["number"]:
                walkthrough_manager.add_message(
                    current_slide["number"], "assistant", msg.content
                )
                walkthrough_manager.save()
        except Exception as e:
            logger.error(
                f"Error saving agent speech to walkthrough: {e}", exc_info=True
            )

    # Handle chat messages
    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        cleaned_message = " ".join(msg.message.split()).strip()
        if cleaned_message:
            logger.info(f"Received chat message: {cleaned_message}")
            # Add message to assistant's chat context
            assistant.chat_ctx.append(role="user", text=cleaned_message)

            # Create a separate async function for handling the message
            async def process_message():
                # Create LLM stream using callback
                stream = await before_llm_callback(assistant, assistant.chat_ctx)
                # Pass the stream to say()
                await assistant.say(
                    stream,
                    allow_interruptions=False,
                )

            # Create task to handle the async processing
            asyncio.create_task(process_message())

    async def get_slide_image(url: str, brdge_id: str, slide_number: int) -> str:
        """Get slide image path, checking local tmp first before downloading"""
        # Define the expected local path
        tmp_dir = f"/tmp/brdge/slides_{brdge_id}"
        file_path = f"{tmp_dir}/slide_{slide_number}.png"

        # Check if file exists locally first
        if os.path.exists(file_path):
            logger.debug(f"Found existing slide in tmp directory: {file_path}")
            return file_path

        # If not found locally, download it
        try:
            logger.info(f"Slide not found locally, downloading from {url}")
            response = requests.get(url, timeout=10)
            response.raise_for_status()

            # Create directory if it doesn't exist
            os.makedirs(tmp_dir, exist_ok=True)

            # Save the image
            with open(file_path, "wb") as f:
                f.write(response.content)

            logger.info(f"Successfully downloaded and saved slide to {file_path}")
            return file_path
        except requests.RequestException as e:
            logger.error(f"Network error downloading slide: {e}")
            return None
        except Exception as e:
            logger.error(f"Error handling slide: {e}", exc_info=True)
            return None

    def image_to_base64(image_path: str) -> str:
        """Convert image to base64 string"""
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if needed
                if img.mode != "RGB":
                    img = img.convert("RGB")

                # Save to bytes buffer
                buffer = io.BytesIO()
                img.save(buffer, format="PNG")

                # Convert to base64
                return base64.b64encode(buffer.getvalue()).decode("utf-8")
        except Exception as e:
            logger.error(f"Error converting image to base64: {e}")
            return None

    @ctx.room.on("data_received")
    def on_data_received(data_packet: DataPacket):
        nonlocal walkthrough_manager
        try:
            decoded_message = data_packet.data.decode("utf-8")
            json_data = json.loads(decoded_message)

            if json_data.get("currentSlide") is not None:
                # Check if this is a new slide
                new_slide = current_slide["number"] != json_data["currentSlide"]

                # Update current slide info
                current_slide.update(
                    {
                        "number": json_data["currentSlide"],
                        "total_slides": json_data["numSlides"],
                        "api_base_url": json_data["apiBaseUrl"],
                        "brdge_id": json_data["brdgeId"],
                        "url": json_data.get("slideUrl"),
                        "initialized": True,
                        "agent_type": json_data.get("agentType"),
                    }
                )

                # Initialize walkthrough manager if needed
                if (
                    not walkthrough_manager
                    and json_data.get("brdgeId")
                    and json_data.get("numSlides")
                ):
                    walkthrough_manager = WalkthroughManager(
                        json_data["brdgeId"], json_data["numSlides"]
                    )

                # Get or download the slide if it's new and URL is provided
                if new_slide and current_slide["url"]:
                    asyncio.create_task(
                        get_slide_image(
                            current_slide["url"],
                            current_slide["brdge_id"],
                            current_slide["number"],
                        )
                    )

                if not initial_slide_received.is_set():
                    initial_slide_received.set()

        except Exception as e:
            logger.error(f"Error processing data received: {e}", exc_info=True)

    # Send a brief initial greeting only after slide info is received
    await initial_slide_received.wait()
    agent_type = current_slide.get("agent_type", "")
    await assistant.say(
        f"I'm listening...{agent_type}",
        allow_interruptions=False,
    )

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
