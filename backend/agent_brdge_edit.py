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
import base64
import os
import requests
from typing import Optional
import os.path
from typing import Dict, List, Any
from prompts import edit_agent_prompt
from PIL import Image

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

# Update the VIEW_SYSTEM_PROMPT section
VIEW_SYSTEM_PROMPT = """You are a Brdge Presentation Assistant, an AI that presents slides while being helpful, engaging, and responsive to user inquiries.

Core Behaviors:

Presentation Flow:
- Present one slide at a time, focusing on the current slide's content
- When presenting, use a natural, conversational tone
- If interrupted, pause presentation, address the question fully, then smoothly return to where you left off
- Don't move to the next slide until explicitly instructed

Content Management:
- You have access to scripts for all slides, but focus on presenting the current slide
- Use knowledge of other slides only when answering broader questions
- If a user asks about future content, acknowledge that it will be covered later
- When returning to the presentation after an interruption, briefly remind the context before continuing

Question Handling:
- When interrupted with questions:
  1. Stop presenting immediately
  2. Answer the question comprehensively using knowledge from all available scripts
  3. After answering, smoothly transition back to where you left off with a phrase like:
     "Now, returning to what we were discussing..." or "To continue with our current slide..."
  4. Resume the presentation from the point of interruption

  

Content Accuracy and Style:
- Stay accurate to the provided scripts
- Provide thoughtful, contextual answers drawing from your knowledge of the entire presentation
- If corrected by a user, acknowledge and maintain the accurate information
- If unsure about something, admit it rather than making assumptions

Communication Guidelines:
- Adjust explanation style based on user requests (e.g., "explain like I'm 5")
- Provide additional context or examples when helpful
- Keep responses focused and relevant
- Avoid using special characters (no "@" or "#") - use plain text
- Use natural speech patterns (e.g., "hmm", "okay", "right")


IMPORTANT GUIDELINES:
1. Focus primarily on the current slide's content
2. Only reference other slides if the question explicitly requires broader context
3. If the user asks about future content, politely suggest waiting for those slides
4. After answering, return focus to the current slide
5. If all current slide content is covered, suggest moving to the next slide


----USE THE ENTIRE SCRIPT AS CONTEXT FOR YOUR RESPONSE---
{entire_script}

Remember: Your primary role is to deliver a clear, engaging presentation while handling interruptions gracefully. Focus on maintaining flow while ensuring every question is fully addressed before continuing.
"""

# At the top of the file, add these logging configurations
import logging

logging.basicConfig(level=logging.DEBUG)  # Set root logger to DEBUG
livekit_logger = logging.getLogger("livekit")
livekit_logger.setLevel(logging.DEBUG)
rtc_logger = logging.getLogger("livekit.rtc")
rtc_logger.setLevel(logging.DEBUG)


def prewarm(proc: JobProcess):
    """Prewarm function to load models once"""
    try:
        logger.info("Starting prewarm function...")
        proc.userdata["vad"] = silero.VAD.load()
        logger.info(
            f"Prewarmed VAD model loaded successfully. Userdata keys: {proc.userdata.keys()}"
        )
    except Exception as e:
        logger.error(f"Error loading VAD model in prewarm: {e}")
        proc.userdata["prewarm_failed"] = True
        logger.error(f"Prewarm failed. Userdata keys: {proc.userdata.keys()}")


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
                                image=f"data:image/jpeg;base64,{base64_image}"
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


class ViewerAgent(VoicePipelineAgent):
    """Agent that presents slides and responds to viewer questions"""

    def __init__(
        self,
        brdge_id: str,
        vad,
        api_base_url: str = None,
        user_id: str = None,
    ):
        self.brdge_id = brdge_id
        self.api_base_url = api_base_url or os.getenv(
            "API_BASE_URL", "http://localhost:5000"
        )
        self.user_id = user_id
        self.current_slide_number = None
        self.total_slides = 0
        self.waiting_for_next = False

        # Load scripts from database
        self.scripts = self._load_scripts()
        if self.scripts:
            self.total_slides = len(self.scripts)
            logger.info(f"Loaded {self.total_slides} slides worth of scripts")

        # Get voice ID from database
        voice_id = get_brdge_voice_id(brdge_id, self.api_base_url)
        logger.info(f"Using voice ID for ViewerAgent: {voice_id}")

        # Initialize with refined system prompt
        view_system_prompt = """
        You are a Brdge Presentation Assistant guiding users through a presentation. You have access to all slides' content and agent prompts, which allows you to:

        1. Present Current Slide:
           - ONLY present the script for the current slide being viewed
           - Never read scripts from other slides, even if asked
           - Use the current slide's agent prompt to guide your interaction style
           - Encourage questions and discussion about current topics

        2. Answer Questions:
           - Use knowledge from ALL slides to give informed answers to questions
           - If a question relates to other slides' content, you can reference that knowledge
           - When referencing future content, say something like "That's a great question! We'll cover more about that in upcoming slides, but I can briefly explain..."
           - When referencing past content, say "As we saw earlier..."

        3. Maintain Focus:
           - Keep the conversation centered on the current slide's topics
           - Use your knowledge of other slides only to enhance answers, not to present their content
           - If users are very interested in future content, you can suggest "Would you like to move to the next slide to learn more about that?"

        4. Navigation:
           - You can suggest moving to the next slide when appropriate
           - Use phrases like "Would you like to move to the next slide?" or "Shall we continue to the next slide?"
           - Remember that only users can actually change slides by clicking Next/Previous
           - Make sure each slide's discussion feels complete before suggesting progression

        Current Presentation Scripts and Prompts:
        {entire_script}

        Remember: Your role is to make each slide's discussion valuable while using your knowledge of the entire presentation to give informed answers. You can suggest progression, but the user controls the pace.
        """

        # Initialize speech tracking
        self.current_speech = {
            "started_at": None,
            "message": None,
            "was_interrupted": False,
        }

        # Add current_slide tracking similar to EditAgent
        self.current_slide = {
            "number": None,
            "url": None,
            "initialized": False,
            "last_processed": None,
            "image_processed": False,
            "brdge_id": brdge_id,
        }

        super().__init__(
            vad=vad,
            stt=deepgram.STT(model="nova-2-conversationalai"),
            llm=openai.LLM(model="gpt-4o"),
            tts=cartesia.TTS(model="sonic", voice=voice_id),
            chat_ctx=llm.ChatContext().append(
                role="system",
                text=view_system_prompt.format(
                    entire_script=json.dumps(self.scripts, indent=2)
                ),
            ),
            preemptive_synthesis=True,
        )

        # Set up event handlers
        self._setup_event_handlers()

    def _setup_event_handlers(self):
        """Set up event handlers for speech events and usage tracking"""

        @self.on("agent_started_speaking")
        def on_agent_speech_started():
            """Track when agent starts speaking"""
            self.current_speech = {
                "started_at": datetime.utcnow(),
                "message": None,
                "was_interrupted": False,
            }

            try:
                # Create usage log entry without agent_message
                viewer_user_id = None
                anonymous_id = None

                # Convert user_id to string for checking
                user_id_str = str(self.user_id) if self.user_id is not None else None

                if user_id_str:
                    if user_id_str.startswith("anon_"):
                        anonymous_id = user_id_str
                    else:
                        try:
                            viewer_user_id = int(user_id_str)
                        except ValueError:
                            logger.error(f"Invalid user_id format: {self.user_id}")

                response = requests.post(
                    f"{self.api_base_url}/brdges/{self.brdge_id}/usage-logs",
                    json={
                        "brdge_id": self.brdge_id,
                        "viewer_user_id": viewer_user_id,
                        "anonymous_id": anonymous_id,
                        "started_at": self.current_speech["started_at"].isoformat(),
                        "was_interrupted": False,
                    },
                )
                response.raise_for_status()
                self.current_speech["log_id"] = response.json().get("id")
            except Exception as e:
                logger.error(f"Error creating usage log: {e}")

        @self.on("agent_speech_committed")
        def on_agent_speech_committed(msg: llm.ChatMessage):
            """Track when agent finishes speaking normally"""
            logger.info(f"Agent speech committed: {msg.content}")

            if self.current_speech["started_at"]:
                ended_at = datetime.utcnow()
                duration = (
                    ended_at - self.current_speech["started_at"]
                ).total_seconds() / 60.0

                try:
                    # Update usage log with completion and agent_message
                    if self.current_speech.get("log_id"):
                        response = requests.put(
                            f"{self.api_base_url}/brdges/{self.brdge_id}/usage-logs/{self.current_speech['log_id']}",
                            json={
                                "ended_at": ended_at.isoformat(),
                                "duration_minutes": round(duration, 2),
                                "was_interrupted": False,
                                "agent_message": msg.content,
                            },
                        )
                        response.raise_for_status()
                except Exception as e:
                    logger.error(f"Error updating usage log: {e}")

                # Reset current speech tracking
                self.current_speech = {
                    "started_at": None,
                    "message": None,
                    "was_interrupted": False,
                }

        @self.on("agent_speech_interrupted")
        def on_agent_speech_interrupted(msg: llm.ChatMessage):
            """Track when agent's speech is interrupted"""
            logger.info(f"Agent speech interrupted: {msg.content}")

            if self.current_speech["started_at"]:
                ended_at = datetime.utcnow()
                duration = (
                    ended_at - self.current_speech["started_at"]
                ).total_seconds() / 60.0

                try:
                    # Update usage log with interruption and agent_message
                    if self.current_speech.get("log_id"):
                        response = requests.put(
                            f"{self.api_base_url}/brdges/{self.brdge_id}/usage-logs/{self.current_speech['log_id']}",
                            json={
                                "ended_at": ended_at.isoformat(),
                                "duration_minutes": round(duration, 2),
                                "was_interrupted": True,
                                "agent_message": msg.content,
                            },
                        )
                        response.raise_for_status()
                except Exception as e:
                    logger.error(f"Error updating usage log: {e}")

                # Reset current speech tracking
                self.current_speech = {
                    "started_at": None,
                    "message": None,
                    "was_interrupted": False,
                }

    def get_brdge_owner_id(self) -> int:
        """Get the owner ID for the current brdge"""
        try:
            response = requests.get(f"{self.api_base_url}/brdges/{self.brdge_id}")
            response.raise_for_status()
            return response.json().get("user_id")
        except Exception as e:
            logger.error(f"Error getting brdge owner ID: {e}")
            return None

    def _load_scripts(self) -> dict:
        """Load scripts using API request"""
        try:
            response = requests.get(
                f"{self.api_base_url}/brdges/{self.brdge_id}/scripts", timeout=10
            )
            response.raise_for_status()

            data = response.json()
            if data.get("has_scripts"):
                scripts = data["scripts"]
                logger.info(f"Found scripts for brdge {self.brdge_id}")
                # Validate and format scripts
                formatted_scripts = {}
                for slide_num, content in scripts.items():
                    if isinstance(content, dict):
                        formatted_scripts[str(slide_num)] = {
                            "script": content.get("script", ""),
                            "agent": content.get("agent", ""),
                        }
                    else:
                        # Handle legacy format
                        formatted_scripts[str(slide_num)] = {
                            "script": str(content),
                            "agent": "",
                        }
                return formatted_scripts
            else:
                logger.warning(f"No scripts found for brdge {self.brdge_id}")
                return {}
        except Exception as e:
            logger.error(f"Error loading scripts: {e}", exc_info=True)
            return {}

    async def present_slide(self, slide_number: str):
        """Present the script for the current slide"""
        logger.info(f"Attempting to present slide {slide_number}")
        self.waiting_for_next = False

        try:
            if slide_number != self.current_slide_number:
                self.current_slide_number = slide_number
                slide_content = self.scripts.get(str(slide_number))

                # Add image processing here
                image_path = (
                    f"/tmp/brdge/slides_{self.brdge_id}/slide_{slide_number}.png"
                )
                if os.path.exists(image_path):
                    base64_image = image_to_base64(image_path)
                    if base64_image:
                        slide_image = llm.ChatImage(
                            image=f"data:image/jpeg;base64,{base64_image}"
                        )
                        image_message = llm.ChatMessage.create(
                            role="user",
                            text=f"""Examining slide {slide_number}. 
                                Please analyze this slide's visual content as you present it:
                                - Key visual elements and their significance
                                - Any diagrams, charts, or graphics
                                - How the visuals support the script content
                                Present the content naturally while incorporating these visual elements.""",
                            images=[slide_image],
                        )
                        self.chat_ctx.messages.append(image_message)
                        logger.info(f"Added slide {slide_number} image to context")

                if slide_content and isinstance(slide_content, dict):
                    script = slide_content.get("script", "")
                    agent_prompt = slide_content.get("agent", "")

                    context_message = llm.ChatMessage.create(
                        role="system",
                        text=f"""
                        Current Slide: {slide_number} of {self.total_slides}
                        
                        Current Agent Guidelines:
                        {agent_prompt}

                        Remember:
                        1. Present this slide's content clearly
                        2. Use the agent guidelines to shape interaction
                        3. Reference other slides when relevant
                        4. You can suggest moving forward, but WAIT for user to click 'Next'
                        5. Do not attempt to change slides yourself
                        """,
                    )
                    self.chat_ctx.messages.insert(-1, context_message)

                    if script:
                        await self.say(script, allow_interruptions=True)
                    else:
                        await self.say(
                            "I don't have specific content for this slide. Would you like to discuss what you see here?",
                            allow_interruptions=True,
                        )

        except Exception as e:
            logger.error(f"Error presenting slide: {e}", exc_info=True)
            await self.say(
                "I encountered an error while presenting this slide.",
                allow_interruptions=True,
            )

    def add_message(self, slide_number: int, role: str, message: str):
        """Log messages to the conversation history"""
        if not self.brdge_id:
            logger.error("No brdge id")
            return

        try:
            response = requests.post(
                f"{self.api_base_url}/brdges/{self.brdge_id}/viewer-conversations",
                json={
                    "slide_number": slide_number,
                    "role": role,
                    "message": message,
                    "user_id": self.user_id,
                },
            )
            response.raise_for_status()
        except Exception as e:
            logger.error(f"Error adding message: {e}", exc_info=True)


class EditAgent(VoicePipelineAgent):
    """Agent that helps edit and improve presentations"""

    def __init__(
        self,
        brdge_id: str,
        vad,
        api_base_url: str = None,
        current_slide=None,
        walkthrough_manager=None,
    ):
        self.brdge_id = brdge_id
        self.api_base_url = api_base_url or os.getenv(
            "API_BASE_URL", "http://localhost:5000"
        )
        self.current_slide = current_slide or {
            "number": None,
            "url": None,
            "initialized": False,
            "last_processed": None,
            "image_processed": False,
        }
        self.walkthrough_manager = walkthrough_manager

        # Get voice ID from database
        voice_id = get_brdge_voice_id(brdge_id, self.api_base_url)
        logger.info(f"Using voice ID for EditAgent: {voice_id}")
        super().__init__(
            vad=vad,
            stt=deepgram.STT(model="nova-2-conversationalai"),
            llm=openai.LLM(model="gpt-4o"),
            tts=cartesia.TTS(
                model="sonic", voice="8c030da1-fcf4-49a5-b20f-9e116156ded4"
            ),
            chat_ctx=llm.ChatContext().append(role="system", text=edit_agent_prompt),
            interrupt_speech_duration=0.1,
            preemptive_synthesis=True,
        )

        # Set up event handlers
        self._setup_event_handlers()

    def _setup_event_handlers(self):
        """Set up event handlers for speech events"""

        @self.on("agent_speech_committed")
        def on_agent_speech_committed(msg: llm.ChatMessage):
            logger.info(f"Agent speech committed: {msg.content}")
            if self.current_slide["number"] and self.walkthrough_manager:
                self.walkthrough_manager.add_message(
                    self.current_slide["number"], "assistant", msg.content
                )

        @self.on("user_speech_committed")
        def on_user_speech_committed(msg: llm.ChatMessage):
            logger.info(f"User speech committed: {msg.content}")
            if self.current_slide["number"] and self.walkthrough_manager:
                self.walkthrough_manager.add_message(
                    self.current_slide["number"], "user", msg.content
                )

    async def process_new_slide(self, slide_number: int, slide_url: str):
        """Process a new slide including downloading and analyzing the image"""
        try:
            # Download and process slide image
            image_path = await get_slide_image(slide_url, self.brdge_id, slide_number)
            if image_path and os.path.exists(image_path):
                base64_image = image_to_base64(image_path)
                if base64_image:
                    self._add_slide_image_to_context(base64_image, slide_number)
                    self.current_slide.update(
                        {
                            "number": slide_number,
                            "last_processed": slide_number,
                            "image_processed": True,
                        }
                    )
        except Exception as e:
            logger.error(f"Error processing new slide: {e}", exc_info=True)

    def _add_slide_image_to_context(self, base64_image: str, slide_number: int):
        """Add slide image to the chat context"""
        slide_image = llm.ChatImage(image=f"data:image/jpeg;base64,{base64_image}")
        image_message = llm.ChatMessage.create(
            role="user",
            text=f"""Slide:{slide_number}. 
                As we discuss this slide, observe and analyze:
                - Key messages and themes
                - Technical terms or concepts that might need clarification
                - The overall structure and flow
                - Any visuals, diagrams, or data presented
                You can refer to these as you analyze the slide.""",
            images=[slide_image],
        )
        self.chat_ctx.messages.append(image_message)
        logger.info(f"Added slide {slide_number} image to context")

    async def handle_user_input(self, user_message: str):
        """Handle user input during editing session"""
        try:
            self.chat_ctx.append(role="user", text=user_message)
            response = await self.say(
                self.llm.chat(chat_ctx=self.chat_ctx), allow_interruptions=True
            )

            # Log response to walkthrough
            if self.current_slide["number"] and self.walkthrough_manager:
                self.walkthrough_manager.add_message(
                    self.current_slide["number"], "assistant", response
                )
        except Exception as e:
            logger.error(f"Error handling user input: {e}", exc_info=True)
            await self.say(
                "I apologize, but I encountered an error processing your message.",
                allow_interruptions=False,
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
    """Convert image to base64 string with size optimization"""
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if needed
            if img.mode != "RGB":
                img = img.convert("RGB")

            # Calculate new dimensions while maintaining aspect ratio
            # Using a smaller size for optimization
            max_size = 512  # Reduced from 1024 for better performance
            ratio = min(max_size / float(img.size[0]), max_size / float(img.size[1]))
            new_size = tuple(int(dim * ratio) for dim in img.size)

            # Resize image
            img = img.resize(new_size, Image.Resampling.LANCZOS)

            # Compress image with higher compression
            buffer = io.BytesIO()
            img.save(
                buffer, format="JPEG", quality=60, optimize=True
            )  # Reduced quality for smaller size
            return base64.b64encode(buffer.getvalue()).decode("utf-8")
    except Exception as e:
        logger.error(f"Error converting image to base64: {e}")
        return None


# Modify the entrypoint function to handle both modes
async def entrypoint(ctx: JobContext):
    logger.info(
        f"Entrypoint started. Process userdata keys: {ctx.proc.userdata.keys()}"
    )
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect()

    participant = await ctx.wait_for_participant()
    logger.info(f"starting assistant for participant {participant.identity}")

    # Get the prewarmed VAD model with fallback
    try:
        if ctx.proc.userdata.get("prewarm_failed"):
            logger.warning("Prewarm failed, loading VAD model directly")
            vad = silero.VAD.load()
        else:
            vad = ctx.proc.userdata.get("vad")
            if vad is None:
                logger.warning("VAD not found in userdata, loading directly")
                vad = silero.VAD.load()
            else:
                logger.info("Using prewarmed VAD model")
    except Exception as e:
        logger.error(f"Error loading VAD model: {e}")
        # Fallback to creating a new VAD instance
        logger.info("Falling back to new VAD instance")
        vad = silero.VAD.load()

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

                # Update current_slide with all data including userId
                current_slide.update(
                    {
                        "number": json_data["currentSlide"],
                        "total_slides": json_data["numSlides"],
                        "api_base_url": json_data["apiBaseUrl"],
                        "brdge_id": json_data["brdgeId"],
                        "url": json_data.get("slideUrl"),
                        "initialized": True,
                        "agent_type": json_data.get("agentType", "edit"),
                        "user_id": json_data.get(
                            "userId"
                        ),  # Add user_id to current_slide
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
                            vad=vad,
                            api_base_url=current_slide["api_base_url"],
                            user_id=current_slide["user_id"],
                        )

                    else:  # edit mode
                        logger.info(
                            f"Initializing EditAgent for brdge {current_slide['brdge_id']}"
                        )
                        agent = EditAgent(
                            brdge_id=current_slide["brdge_id"],
                            vad=vad,
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

                        @agent.on("user_speech_committed")
                        def on_user_speech_committed(msg: llm.ChatMessage):
                            logger.info(f"User speech committed: {msg.content}")
                            if (
                                current_slide["number"]
                                and walkthrough_manager
                                and current_slide["agent_type"] == "edit"
                            ):
                                walkthrough_manager.add_message(
                                    current_slide["number"], "user", msg.content
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

                # Handle new slide image for both edit and view modes
                if new_slide and current_slide["url"]:
                    asyncio.create_task(
                        get_slide_image(
                            current_slide["url"],
                            current_slide["brdge_id"],
                            current_slide["number"],
                        )
                    )

                    # Process image for either agent type
                    image_path = f"/tmp/brdge/slides_{current_slide['brdge_id']}/slide_{current_slide['number']}.png"
                    if os.path.exists(image_path):
                        base64_image = image_to_base64(image_path)
                        if base64_image:
                            slide_image = llm.ChatImage(
                                image=f"data:image/jpeg;base64,{base64_image}"
                            )
                            image_message = llm.ChatMessage.create(
                                role="user",
                                text=f"""Slide:{current_slide['number']}. 
                                    As we discuss this slide, observe and analyze:
                                    - Key messages and themes
                                    - Visual elements and their significance
                                    - How the visuals support the content
                                    You can refer to these as you present the slide.""",
                                images=[slide_image],
                            )
                            agent.chat_ctx.messages.append(image_message)
                            if hasattr(agent, "current_slide"):
                                agent.current_slide["last_processed"] = current_slide[
                                    "number"
                                ]
                                agent.current_slide["image_processed"] = True
                            logger.info(
                                f"Processed image for slide {current_slide['number']}"
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
            logger.error(f"Error processing data packet: {e}", exc_info=True)
            # If there's an error, try to send an error message to the client
            try:
                error_message = {
                    "type": "error",
                    "message": "Failed to process slide data",
                    "details": str(e),
                }
                ctx.room.local_participant.publish_data(
                    json.dumps(error_message).encode("utf-8")
                )
            except Exception as send_error:
                logger.error(
                    f"Failed to send error message to client: {send_error}",
                    exc_info=True,
                )

    # Handle chat messages
    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        if not agent:
            logger.warning("Agent not initialized, cannot process chat message")
            return

        cleaned_message = " ".join(msg.message.split()).strip()
        if cleaned_message:
            logger.info(f"Received chat message: {cleaned_message}")

            # Log viewer conversation
            if current_slide.get("user_id"):
                try:
                    response = requests.post(
                        f"{current_slide['api_base_url']}/brdges/{current_slide['brdge_id']}/viewer-conversations",
                        json={
                            "user_id": current_slide["user_id"],
                            "message": cleaned_message,
                            "role": "user",
                            "slide_number": current_slide["number"],
                        },
                    )
                    response.raise_for_status()
                    logger.info(f"Logged viewer message: {response.json()}")
                except Exception as e:
                    logger.error(f"Error logging viewer message: {e}")

            # Log user message to walkthrough
            if current_slide["number"] and walkthrough_manager:
                walkthrough_manager.add_message(
                    current_slide["number"], "user", cleaned_message
                )

            # Add message to agent's chat context
            agent.chat_ctx.append(role="user", text=cleaned_message)
            # agent.emit("user_speech_committed", msg)
            agent.emit(
                "user_speech_committed", rtc.ChatMessage(message=cleaned_message)
            )

            # Create and run the coroutine using create_task
            async def process_message():
                try:
                    if current_slide["agent_type"] == "view":
                        response = await agent.say(
                            agent.llm.chat(chat_ctx=agent.chat_ctx),
                            allow_interruptions=True,
                        )
                        logger.info(f"View agent response: {response}")
                    else:
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

            # Schedule the coroutine to run using the current event loop
            loop = asyncio.get_event_loop()
            loop.create_task(process_message())

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
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
