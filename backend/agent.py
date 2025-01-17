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

# Basic system prompt for the chat assistant
SYSTEM_PROMPT = """You are a helpful voice assistant that can engage in conversation about the content being discussed.
Your role is to:
1. Answer questions about the content you've heard so far
2. Acknowledge when a question refers to content you haven't heard yet
3. Be concise and clear in your responses
4. Stay focused on the content being discussed

Remember: You only have knowledge of the transcript segments marked as 'read'. If asked about future content, politely explain that you haven't heard that part yet."""


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
    """Simple voice assistant that handles chat interactions"""

    def __init__(self, vad):
        self.transcript_read = []  # Segments already processed
        self.transcript_remaining = []  # Segments yet to be processed

        super().__init__(
            vad=vad,
            stt=deepgram.STT(model="nova-2-conversationalai"),
            llm=openai.LLM(model="gpt-4o"),
            tts=cartesia.TTS(
                model="sonic",
                voice="85100d63-eb8a-4225-9750-803920c3c8d3",  # example voice
            ),
            chat_ctx=llm.ChatContext().append(role="system", text=SYSTEM_PROMPT),
            interrupt_speech_duration=0.1,
            preemptive_synthesis=True,
        )

    def update_transcript_position(self, read_segments, remaining_segments):
        """Update the assistant's knowledge of what content has been covered"""
        self.transcript_read = read_segments
        self.transcript_remaining = remaining_segments

        # Update context with current transcript position
        context_message = llm.ChatMessage.create(
            role="system",
            text=f"""Current transcript context:
            Content covered so far: {' '.join(self.transcript_read)}
            
            Remember: You only have knowledge of the content covered so far. 
            If asked about future content, explain that you haven't heard that part yet.""",
        )

        # Replace the second message (after SYSTEM_PROMPT) with updated context
        if len(self.chat_ctx.messages) > 1:
            self.chat_ctx.messages[1] = context_message
        else:
            self.chat_ctx.messages.append(context_message)


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

            if "transcript_position" in json_data:
                # Update agent's knowledge of transcript position
                agent.update_transcript_position(
                    json_data["transcript_position"]["read"],
                    json_data["transcript_position"]["remaining"],
                )
        except Exception as e:
            logger.error(f"Error processing data packet: {e}")

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
