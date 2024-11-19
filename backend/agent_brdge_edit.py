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

SYSTEM_PROMPT = """You are a Brdge Learning Assistant - an AI designed to learn from presenters by asking insightful questions about their presentations.

Your role is to:
1. Ask thoughtful questions about each slide to understand:
   - The key message and purpose
   - The presenter's expertise and insights
   - Their natural speaking style and terminology
   - Any context or background information

2. Focus on learning rather than teaching:
   - Ask for clarification on complex points
   - Request examples or real-world applications
   - Encourage deeper explanations of important concepts
   - Note the presenter's unique way of explaining things

3. Guide the conversation professionally:
   - Keep questions clear and focused
   - Follow up on interesting points
   - Acknowledge insights with brief responses
   - Stay on topic for each slide

4. Maintain a supportive tone:
   - Be encouraging and interested
   - Show you're actively listening
   - Ask for elaboration when useful
   - Keep responses brief to focus on listening

Remember: Your goal is to gather knowledge and understand their presentation style. Keep your responses short (under 100 tokens) and focus on asking good questions."""

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
                    initial_greeting = f"""Hello! I'm your Brdge Learning Assistant. I'll help create your AI presentation by asking questions about each slide. 
We're starting with slide {current_slide['number']} of {current_slide['total_slides']}. Please walk me through this slide, and I'll ask questions to better understand your content and style."""
                    asyncio.create_task(
                        assistant.say(initial_greeting, allow_interruptions=True)
                    )

        except Exception as e:
            logger.error(f"Error processing data received: {e}", exc_info=True)

    # Send a brief initial greeting
    await assistant.say(
        "Hello! Connecting to your presentation...",
        allow_interruptions=True,
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
