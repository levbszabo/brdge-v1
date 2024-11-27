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
VIEW_SYSTEM_PROMPT = """You are a Brdge Presentation Assistant, an AI that helps present slides using pre-written scripts.
Core Behaviors:
1. Clear Presentation: Present the script for each slide clearly and professionally.

2. Stay On Script: 
   - Stick to the provided script for each slide
   - Maintain consistent pacing and tone
   - Don't add or modify the content

3. Transition Smoothly:
   - Acknowledge slide changes
   - Use professional transitions between slides
   - Keep the presentation flowing naturally

4. Professional Tone:
   - Speak with clarity and confidence
   - Maintain an engaging presentation style
   - Use appropriate pauses for emphasis

Remember: Your role is to deliver the pre-written content professionally and clearly. Think of yourself as a skilled presenter delivering a polished presentation.
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


class ViewerAgent(VoicePipelineAgent):
    def __init__(self, brdge_id: str):
        self.brdge_id = brdge_id
        logger.info(f"Initializing ViewerAgent for brdge_id: {brdge_id}")
        self.scripts = self._load_scripts()
        self.current_slide = None
        super().__init__(
            vad=silero.VAD.load(),
            stt=deepgram.STT(),
            llm=openai.LLM(model="gpt-4o-mini"),
            tts=cartesia.TTS(voice="41f3c367-e0a8-4a85-89e0-c27bae9c9b6d"),
            chat_ctx=llm.ChatContext().append(role="system", text=VIEW_SYSTEM_PROMPT),
        )

    def _load_scripts(self) -> Dict[str, str]:
        """Load and validate scripts"""
        scripts = load_slide_scripts(self.brdge_id)
        logger.info(f"ViewerAgent loaded scripts for brdge {self.brdge_id}: {scripts}")
        return scripts

    async def present_slide(self, slide_number: str):
        """Present the script for the current slide"""
        logger.info(f"Attempting to present slide {slide_number}")
        logger.info(f"Available scripts: {self.scripts}")

        if slide_number != self.current_slide:
            self.current_slide = slide_number
            script = self.scripts.get(str(slide_number))
            if script:
                logger.info(f"Found script for slide {slide_number}: {script}")
                await self.say(script, allow_interruptions=False)
            else:
                logger.warning(
                    f"No script found for slide {slide_number} in available scripts: {self.scripts}"
                )
                await self.say(
                    "No script available for this slide.", allow_interruptions=False
                )


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect()

    participant = await ctx.wait_for_participant()
    logger.info(f"starting learning assistant for participant {participant.identity}")

    # Add the missing initial_slide_received event
    initial_slide_received = asyncio.Event()

    # Track current slide with better initialization
    current_slide = {
        "number": None,
        "url": None,
        "total_slides": 0,
        "api_base_url": None,
        "brdge_id": None,
        "initialized": False,
        "last_processed": None,
        "agent_type": None,
    }

    # Create a placeholder for the agent
    agent = None
    walkthrough_manager = None

    @ctx.room.on("data_received")
    def on_data_received(data_packet: DataPacket):
        nonlocal walkthrough_manager, agent, current_slide
        try:
            decoded_message = data_packet.data.decode("utf-8")
            json_data = json.loads(decoded_message)

            if json_data.get("currentSlide") is not None:
                # Update current slide info
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

                # Set the initial_slide_received event
                if not initial_slide_received.is_set():
                    initial_slide_received.set()

                # Initialize the appropriate agent if not already done
                if not agent:
                    if current_slide["agent_type"] == "view":
                        logger.info(
                            f"Initializing ViewerAgent for brdge {current_slide['brdge_id']}"
                        )
                        agent = ViewerAgent(current_slide["brdge_id"])
                        agent.start(ctx.room, participant)

                        # Log the loaded scripts for debugging
                        logger.info(f"Loaded scripts: {agent.scripts}")
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
                        agent.start(ctx.room, participant)

                # For view mode, present the script
                if current_slide["agent_type"] == "view" and isinstance(
                    agent, ViewerAgent
                ):
                    logger.info(
                        f"Presenting script for slide {current_slide['number']}"
                    )
                    asyncio.create_task(
                        agent.present_slide(str(current_slide["number"]))
                    )

        except Exception as e:
            logger.error(f"Error processing data received: {e}", exc_info=True)

    # Send initial greeting
    await initial_slide_received.wait()
    agent_type = current_slide.get("agent_type", "edit")
    greeting = "I'm ready to present..." if agent_type == "view" else "I'm listening..."
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
