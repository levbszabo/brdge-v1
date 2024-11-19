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

    # Start the assistant
    assistant.start(ctx.room, participant)
    chat = rtc.ChatManager(ctx.room)

    async def answer_from_text(txt: str):
        chat_ctx = assistant.chat_ctx.copy()
        slide_info = f"We are on slide {current_slide['number']} out of {current_slide['total_slides']} total slides."
        chat_ctx.append(
            role="user", text=f"{slide_info}\nWhat slide are we on and how many slides?"
        )
        stream = assistant.llm.chat(chat_ctx=chat_ctx)
        await assistant.say(stream)

    # @assistant.on("user_transcript")
    # def on_user_transcript(transcript: str):
    #     logger.info(f"Received user transcript: {transcript}")
    #     asyncio.create_task(answer_from_text(transcript))

    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        asyncio.create_task(answer_from_text(msg.message))

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

    # Send a brief initial greeting
    await assistant.say(
        "Walk me through your presentation. I may ask a few questions so I can effectively share this with others. ",
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
