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
import os

load_dotenv(dotenv_path=".env_local")
logger = logging.getLogger("voice-agent")

# Enhanced system prompt that incorporates personality, knowledge base and transcript
SYSTEM_PROMPT_BASE = """You are the creator and presenter of this content, speaking directly to your audience. 
You must incorporate:
1) The Agent Personality - This defines your speaking style and presentation manner
2) The Knowledge Base - Your deep understanding of the topic and additional context
3) The Presentation Transcript - What you've covered so far in your presentation

When responding:
- Speak naturally as if you're the actual presenter explaining your own content
- Stay in character and maintain the flow of the presentation
- Use phrases like "As I mentioned earlier..." or "We'll get to that later in the presentation" when appropriate
- If asked about something you haven't covered yet, say something like "I'll be covering that in more detail later" or "We'll get to that point shortly"
- Draw from your knowledge base to provide richer context, but present it as if it's your own expertise
- Keep the conversational flow natural, as if you're having a real-time discussion during your presentation

Remember: You are the creator of this content. Make your responses feel like a natural part of the presentation experience.
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

    def update_agent_config(self, personality: str, knowledge_base: str):
        """Update the agent's personality and knowledge base"""
        self.personality = personality
        self.knowledge_content = knowledge_base
        self._rebuild_system_prompt()

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

            # Handle agent configuration updates
            if "agent_config" in json_data:
                config = json_data["agent_config"]
                personality = config.get("personality", "")
                kb_items = config.get("knowledgeBase", [])

                if not isinstance(kb_items, list):
                    logger.error("Invalid knowledge base format")
                    return

                # Build knowledge base string with better formatting
                knowledge_base_str = ""
                for entry in kb_items:
                    if not all(k in entry for k in ["name", "content"]):
                        logger.warning(
                            f"Skipping invalid knowledge base entry: {entry}"
                        )
                        continue
                    knowledge_base_str += f"\n# {entry['name']}\n{entry['content']}\n"

                logger.info(
                    f"Updating agent config. Personality length: {len(personality)}, KB items: {len(kb_items)}"
                )
                agent.update_agent_config(personality, knowledge_base_str)

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
