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
import requests
import asyncio
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import openai, deepgram, silero, cartesia
from livekit.agents.llm import ChatImage
from livekit import rtc
from livekit.rtc import VideoFrame, DataPacket
from livekit.rtc._proto import video_frame_pb2
import json
from datetime import datetime
import os

load_dotenv(dotenv_path=".env_local")
logger = logging.getLogger("voice-agent")
os.getenv("API_BASE_URL")
# Enhanced system prompt that incorporates personality, knowledge base and transcript
SYSTEM_PROMPT_BASE = """
You are both the creator and a real-time co-presenter of this content. You are speaking naturally to your audience as if they are right here with you.

You have three key resources:
1) Personality: your personal speaking style, tone, and mannerisms.
2) Knowledge Base: deeper background or supporting facts, as if it's your own expertise.
3) Presentation Transcript: an ongoing record of what has been covered so far (and what's left).

Your goals:
- Provide a smooth, conversational experience as if you are personally guiding the audience.
- Weave in relevant details from your knowledge base naturally, without explicitly naming it.
- Continuously reflect the personality described.
- Sound genuine, concise, and coherent.

When Responding:
• Use a relaxed, first-person, natural speaking tone.  
• Keep responses concise: A few words if possible, or up to 1-2 short paragraphs or a few sentences if necessary.
• Reference previously covered points with phrases like "I mentioned earlier..." or "We recently looked at...".  
• If asked about future topics you have not yet covered, say "We'll explore that soon," or "I'll be covering that in a bit."  
• Never overuse the phrase "in this presentation"—speak as if you're chatting in real-time.  
• Avoid lengthy or repetitive explanations; aim for brevity.  
• If knowledge base info is relevant, weave it in as if it's your personal expertise.  
• Always maintain a sense of direct conversation with the audience—like a casual yet informed talk.

IMPORTANT: 
- You are the actual presenter. 
- Do not disclaim yourself as an AI model. 
- Do not reveal the knowledge base explicitly.
- Keep it human, short, and friendly.

Let's begin.
"""


def prewarm(proc: JobProcess):
    """Prewarm function to load models once"""
    try:
        logger.info("Starting prewarm function...")
        proc.userdata["vad"] = silero.VAD.load()
        logger.info("Prewarmed VAD model loaded successfully")
    except Exception as e:
        logger.error(f"Error loading VAD model in prewarm: {e}")
        proc.userdata["prewarm_failed"] = True


class ChatAssistant(VoicePipelineAgent):
    """Enhanced voice assistant that handles chat interactions with personality and knowledge base"""

    def __init__(self, vad):
        self.personality = ""
        self.knowledge_content = ""
        self.transcript_read = []
        self.transcript_remaining = []
        self.current_position = 0  # Track current position in seconds
        self.agent_config_received = False  # Add this flag
        # Add new attributes for user and brdge IDs
        self.user_id = None
        self.brdge_id = None
        self.api_base_url = os.getenv("API_BASE_URL")
        self.current_speech = {
            "started_at": None,
            "message": None,
            "was_interrupted": False,
        }

        super().__init__(
            vad=vad,
            stt=deepgram.STT(model="nova-2-conversationalai"),
            llm=openai.LLM(model="gpt-4o"),
            tts=cartesia.TTS(
                model="sonic",
                voice="85100d63-eb8a-4225-9750-803920c3c8d3",
            ),
            chat_ctx=llm.ChatContext().append(role="system", text=SYSTEM_PROMPT_BASE),
            interrupt_speech_duration=0.1,
            preemptive_synthesis=True,
        )
        self._setup_event_handlers()

    def _setup_event_handlers(self):
        @self.on("agent_started_speaking")
        def on_agent_speaking():
            print("Agent started speaking")
            self.current_speech = {
                "started_at": datetime.utcnow(),
                "message": None,
                "was_interrupted": False,
            }
            try:
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

                if not self.api_base_url:
                    logger.error("API_BASE_URL environment variable is not set")
                    return

                if not self.brdge_id:
                    logger.error("brdge_id is not set")
                    return

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
                logger.info(
                    f"Created usage log with ID: {self.current_speech['log_id']}"
                )

            except requests.exceptions.RequestException as e:
                logger.error(f"HTTP Error creating usage log: {e}")
            except Exception as e:
                logger.error(f"Error creating usage log: {e}")

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
                        logger.info(
                            f"Updated usage log {self.current_speech['log_id']} with interruption"
                        )
                except requests.exceptions.RequestException as e:
                    logger.error(f"HTTP Error updating usage log: {e}")
                except Exception as e:
                    logger.error(f"Error updating usage log: {e}")

                # Reset current speech tracking
                self.current_speech = {
                    "started_at": None,
                    "message": None,
                    "was_interrupted": False,
                }

        @self.on("agent_speech_committed")
        def on_agent_speech_completed(msg: llm.ChatMessage):
            """Track when agent's speech completes normally"""
            logger.info(f"Agent speech completed: {msg.content}")

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
                        logger.info(
                            f"Updated usage log {self.current_speech['log_id']} with completion"
                        )
                except requests.exceptions.RequestException as e:
                    logger.error(f"HTTP Error updating usage log: {e}")
                except Exception as e:
                    logger.error(f"Error updating usage log: {e}")

                # Reset current speech tracking
                self.current_speech = {
                    "started_at": None,
                    "message": None,
                    "was_interrupted": False,
                }

    def update_agent_config(
        self, config_data: dict, user_id: str = None, brdge_id: str = None
    ):
        """Update the agent's configuration from received data"""
        try:
            if (
                not self.agent_config_received
            ):  # Only process the first config we receive
                # Store user and brdge IDs
                self.user_id = user_id
                self.brdge_id = brdge_id
                logger.info(
                    f"Configured agent for user_id: {user_id}, brdge_id: {brdge_id}"
                )

                personality = config_data.get("personality", "")
                knowledge_base = config_data.get("knowledgeBase", [])

                # Build knowledge base string
                knowledge_content = ""
                for entry in knowledge_base:
                    if (
                        isinstance(entry, dict)
                        and "name" in entry
                        and "content" in entry
                    ):
                        knowledge_content += (
                            f"\n# {entry['name']}\n{entry['content']}\n"
                        )

                self.personality = personality
                self.knowledge_content = knowledge_content
                self._rebuild_system_prompt()

                self.agent_config_received = True
                logger.info("Agent configuration updated successfully")
        except Exception as e:
            logger.error(f"Error updating agent config: {e}")

    def _rebuild_system_prompt(self):
        """Rebuild the system prompt incorporating all current context"""
        # Find the most recent context from transcript
        recent_context = ""
        if self.transcript_read:
            # Get the last few segments for immediate context
            recent_segments = self.transcript_read[-3:]  # Last 3 segments for context
            recent_context = " ".join(recent_segments)

        merged_system_text = f"""{SYSTEM_PROMPT_BASE}

Agent Personality:
{self.personality}

Knowledge Base:
{self.knowledge_content}

Current Presentation Context:
You are currently at a point where you've just discussed: {recent_context}

Full Transcript Coverage:
Already Covered: {' '.join(self.transcript_read)}
Upcoming Topics: {' '.join(self.transcript_remaining[:2]) if self.transcript_remaining else "End of presentation"}
"""
        # Replace the system prompt in the chat context
        if self.chat_ctx.messages:
            self.chat_ctx.messages[0] = llm.ChatMessage.create(
                role="system",
                text=merged_system_text,
            )
        else:
            self.chat_ctx.append(role="system", text=merged_system_text)

    def update_transcript_position(self, read_segments, remaining_segments):
        """Update the assistant's knowledge of what content has been covered"""
        self.transcript_read = read_segments
        self.transcript_remaining = remaining_segments
        # Rebuild system prompt to include newly read transcript
        self._rebuild_system_prompt()


async def entrypoint(ctx: JobContext):
    logger.info("Entrypoint started")
    await ctx.connect()

    participant = await ctx.wait_for_participant()
    logger.info(f"Starting assistant for participant {participant.identity}")

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
    except Exception as e:
        logger.error(f"Error loading VAD model: {e}")
        vad = silero.VAD.load()

    agent = ChatAssistant(vad)
    chat = rtc.ChatManager(ctx.room)

    @ctx.room.on("data_received")
    def on_data_received(data_packet: DataPacket):
        try:
            decoded_message = data_packet.data.decode("utf-8")
            json_data = json.loads(decoded_message)
            logger.debug(f"Received data packet: {json_data}")

            # Handle agent configuration updates
            if "agent_config" in json_data:
                logger.info("Received agent configuration")
                # Extract user_id and brdge_id from the payload
                user_id = json_data.get("user_id")
                brdge_id = json_data.get("brdge_id")
                agent.update_agent_config(
                    json_data["agent_config"], user_id=user_id, brdge_id=brdge_id
                )

            # Handle transcript position updates
            if "transcript_position" in json_data:
                read_segments = json_data["transcript_position"].get("read", [])
                remaining_segments = json_data["transcript_position"].get(
                    "remaining", []
                )

                if not isinstance(read_segments, list) or not isinstance(
                    remaining_segments, list
                ):
                    logger.error("Invalid transcript position format")
                    return

                logger.info(
                    f"Updating transcript position. Read segments: {len(read_segments)}, Remaining: {len(remaining_segments)}"
                )
                agent.update_transcript_position(read_segments, remaining_segments)

        except json.JSONDecodeError:
            logger.error("Failed to decode JSON from data packet")
        except Exception as e:
            logger.error(f"Error processing data packet: {str(e)}")
            logger.exception(e)  # Log full traceback for debugging

    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        if not agent:
            logger.warning("Agent not initialized, cannot process chat message")
            return

        cleaned_message = " ".join(msg.message.split()).strip()
        if cleaned_message:
            logger.info(f"Received chat message: {cleaned_message}")

            # Add message to agent's chat context
            agent.chat_ctx.append(role="user", text=cleaned_message)

            # Create and run the coroutine using create_task
            async def process_message():
                try:
                    response = await agent.say(
                        agent.llm.chat(chat_ctx=agent.chat_ctx),
                        allow_interruptions=True,
                    )
                    logger.info(f"Agent response: {response}")
                except Exception as e:
                    logger.error(f"Error processing chat message: {e}")
                    await agent.say(
                        "I apologize, but I encountered an error processing your message.",
                        allow_interruptions=False,
                    )

            # Schedule the coroutine to run
            asyncio.create_task(process_message())

    # Start the agent pipeline
    agent.start(ctx.room, participant)

    # Keep the connection alive
    disconnect_event = asyncio.Event()

    @ctx.room.on("disconnected")
    def on_disconnect(*args):
        logger.info("Room disconnected")
        disconnect_event.set()

    try:
        await disconnect_event.wait()
    finally:
        logger.info("Cleaning up...")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
