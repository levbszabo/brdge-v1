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

load_dotenv(dotenv_path=".env_crypto")
logger = logging.getLogger("voice-agent")

SYSTEM_PROMPT = """You are a Brdge Learning Assistant, an AI that learns from presenters by analyzing their slides and asking insightful questions when needed.

Your role:
1. Understand each slide by identifying key messages, purpose, and context.
2. Ask clarifying questions only when necessary to deepen understanding, such as:
   - Clarify complex points
   - Request examples or applications
   - Explore important concepts further
3. Maintain professionalism by keeping questions clear, focused, and relevant to each slide.
4. Use a supportive tone: be encouraging, show active listening, and keep responses brief (under 100 tokens).

Your goal is to gather knowledge and understand the presenter’s style using slide content efficiently.
"""

# At the top of the file, add these logging configurations
import logging

logging.basicConfig(level=logging.DEBUG)  # Set root logger to DEBUG
livekit_logger = logging.getLogger("livekit")
livekit_logger.setLevel(logging.DEBUG)
rtc_logger = logging.getLogger("livekit.rtc")
rtc_logger.setLevel(logging.DEBUG)


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect()

    participant = await ctx.wait_for_participant()
    logger.info(f"starting learning assistant for participant {participant.identity}")

    initial_ctx = llm.ChatContext().append(role="system", text=SYSTEM_PROMPT)
    log_queue = asyncio.Queue()
    initial_slide_received = asyncio.Event()

    # Track current slide with better initialization
    current_slide = {
        "number": None,
        "url": None,
        "total_slides": 0,
        "api_base_url": None,
        "brdge_id": None,
        "initialized": False,
    }

    last_processed_message = {"slide": None, "timestamp": None}

    # Create and start the assistant first
    assistant = VoicePipelineAgent(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=cartesia.TTS(voice="5265a761-5cf5-4b35-9055-adfd541e591c"),
        chat_ctx=initial_ctx,
    )

    # Start the assistant and chat manager
    assistant.start(ctx.room, participant)
    chat = rtc.ChatManager(ctx.room)

    # Add a lock to prevent concurrent responses
    response_lock = asyncio.Lock()

    async def answer_from_text(txt: str, is_voice: bool = False):
        # Use lock to prevent concurrent responses
        async with response_lock:
            chat_ctx = assistant.chat_ctx.copy()

            # Add current slide context
            if current_slide["initialized"]:
                slide_info = f"Looking at slide {current_slide['number']} of {current_slide['total_slides']}"
                user_input = (
                    f"{slide_info}\nUser {('said' if is_voice else 'wrote')}: {txt}"
                )
            else:
                user_input = txt

            logger.info(
                f"Processing {'voice' if is_voice else 'text'} input: {user_input}"
            )

            chat_ctx.append(role="user", text=user_input)
            stream = assistant.llm.chat(chat_ctx=chat_ctx)
            await assistant.say(
                stream, allow_interruptions=False
            )  # Prevent interruptions during response

    # Handle voice transcripts
    @assistant.on("user_speech_committed")
    def on_speech_committed(msg: llm.ChatMessage):
        if isinstance(msg.content, str):
            logger.info(f"Received voice input: {msg.content}")
            # Deduplicate whitespace and check for empty messages
            cleaned_input = " ".join(msg.content.split()).strip()
            if cleaned_input:  # Only process non-empty messages
                asyncio.create_task(answer_from_text(cleaned_input, is_voice=True))

    # Handle chat messages
    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        # Deduplicate whitespace and check for empty messages
        cleaned_message = " ".join(msg.message.split()).strip()
        if cleaned_message:  # Only process non-empty messages
            logger.info(f"Received chat message: {cleaned_message}")
            asyncio.create_task(answer_from_text(cleaned_message, is_voice=False))

    @ctx.room.on("data_received")
    def on_data_received(data_packet: DataPacket):
        try:
            decoded_message = data_packet.data.decode("utf-8")
            json_data = json.loads(decoded_message)
            logger.info(f"Received slide data: {json.dumps(json_data, indent=2)}")

            if json_data.get("currentSlide") is not None:
                current_slide.update(
                    {
                        "number": json_data["currentSlide"],
                        "total_slides": json_data["numSlides"],
                        "api_base_url": json_data["apiBaseUrl"],
                        "brdge_id": json_data["brdgeId"],
                        "initialized": True,
                    }
                )

                logger.info(
                    f"Updated slide state: {json.dumps(current_slide, indent=2)}"
                )

                if not initial_slide_received.is_set():
                    initial_slide_received.set()
                    # Send the proper greeting with slide info
                    # asyncio.create_task(
                    #     assistant.say(initial_greeting, allow_interruptions=True)
                    # )

        except Exception as e:
            logger.error(f"Error processing data received: {e}", exc_info=True)

    # Send a brief initial greeting only after slide info is received
    await initial_slide_received.wait()
    await assistant.say(
        "Walk me through your presentation. I may ask a few questions so I can effectively share this with others.",
        allow_interruptions=False,
    )

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
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
