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

    # Create log queue at the start of entrypoint
    log_queue = asyncio.Queue()

    assistant = VoicePipelineAgent(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),  # Using vision model for chart analysis
        tts=cartesia.TTS(
            voice="5a367280-c921-421c-980e-fa6cc48e9a38"  # Professional voice
        ),
        chat_ctx=initial_ctx,
    )

    assistant.start(ctx.room, participant)
    chat = rtc.ChatManager(ctx.room)

    # Track current slide with better initialization
    current_slide = {
        "number": 1,
        "url": None,
        "total_slides": 0,
        "api_base_url": None,
        "brdge_id": None,
        "initialized": False,
    }

    # Track last processed message to prevent duplicates
    last_processed_message = {"slide": None, "timestamp": None}

    # Handle data received events - using the correct event structure
    @ctx.room.on("data_received")
    def on_data_received(data_packet: DataPacket):
        try:
            logger.info("=== START: Data Received Event ===")
            logger.info(f"Data packet details:")
            logger.info(f"- Data length: {len(data_packet.data)}")
            logger.info(f"- Kind: {data_packet.kind}")
            logger.info(f"- Topic: {data_packet.topic}")
            if data_packet.participant:
                logger.info(f"- From participant: {data_packet.participant.identity}")

            # Decode and parse first
            try:
                decoded_message = data_packet.data.decode("utf-8")
                logger.info(f"- Decoded message: {decoded_message}")
                json_data = json.loads(decoded_message)
                logger.info(f"- Parsed JSON: {json.dumps(json_data, indent=2)}")
            except (UnicodeDecodeError, json.JSONDecodeError) as e:
                logger.error(f"Failed to decode/parse message: {e}")
                return

            # Only process SLIDE_UPDATE messages
            if json_data.get("type") != "SLIDE_UPDATE":
                logger.info("Not a SLIDE_UPDATE message, skipping")
                return

            current_slide_num = json_data.get("currentSlide")

            # Check if this is a duplicate message
            if (
                last_processed_message["slide"] == current_slide_num
                and last_processed_message["timestamp"]
                and (
                    datetime.now() - last_processed_message["timestamp"]
                ).total_seconds()
                < 1
            ):
                logger.info(
                    f"Skipping duplicate slide update for slide {current_slide_num}"
                )
                logger.info(
                    f"- Last processed: {last_processed_message['timestamp'].isoformat()}"
                )
                logger.info(
                    f"- Time since last: {(datetime.now() - last_processed_message['timestamp']).total_seconds():.2f}s"
                )
                return

            logger.info(f"Processing new SLIDE_UPDATE for slide {current_slide_num}")
            logger.info("Current state:")
            logger.info(f"- Was initialized: {current_slide.get('initialized', False)}")
            logger.info(f"- Previous slide: {current_slide.get('number')}")
            logger.info(f"- New slide info: {json.dumps(json_data, indent=2)}")

            was_initialized = current_slide.get("initialized", False)

            # Update slide info
            current_slide.update(
                {
                    "number": current_slide_num,
                    "total_slides": json_data.get("numSlides", 0),
                    "api_base_url": json_data.get("apiBaseUrl"),
                    "brdge_id": json_data.get("brdgeId"),
                    "initialized": True,
                }
            )

            # Update last processed message
            last_processed_message.update(
                {"slide": current_slide_num, "timestamp": datetime.now()}
            )

            logger.info("After update:")
            logger.info(f"- Current slide state: {json.dumps(current_slide, indent=2)}")
            logger.info(
                f"- Last processed: {last_processed_message['timestamp'].isoformat()}"
            )

            # Only send greeting on first initialization
            if not was_initialized:
                logger.info("Sending initial greeting (first initialization)")
                initial_greeting = f"""Hello! I'm your Brdge Learning Assistant. I'll help create your AI presentation by asking questions about each slide. 
We're starting with slide {current_slide['number']} of {current_slide['total_slides']}. Please walk me through this slide, and I'll ask questions to better understand your content and style."""
                create_task(assistant.say(initial_greeting, allow_interruptions=True))

            logger.info("=== END: Data Received Event ===\n")

        except Exception as e:
            logger.error(f"Error processing data received: {e}", exc_info=True)
            logger.error(f"Data that caused error: {data_packet.data}")

    # Helper function to create tasks
    def create_task(coro):
        try:
            asyncio.create_task(coro)
        except Exception as e:
            logger.error(f"Error creating task: {e}", exc_info=True)

    # Remove the slide update handling from chat messages
    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        try:
            # Only handle regular chat messages
            asyncio.create_task(answer_from_text(msg.message))
        except Exception as e:
            logger.error(f"Error processing chat message: {e}", exc_info=True)

    # Start log processing task
    async def process_logs():
        while True:
            try:
                log_entry = await log_queue.get()
                logger.info(f"LOG: {log_entry}")
                log_queue.task_done()
            except Exception as e:
                logger.error(f"Error processing log: {e}")

    # Start the log processing task
    asyncio.create_task(process_logs())

    async def process_input_with_slide(
        txt: str, chat_ctx: llm.ChatContext
    ) -> llm.ChatContext:
        """Process input along with the current slide image"""
        try:
            if current_slide["api_base_url"] and current_slide["brdge_id"]:
                slide_url = f"{current_slide['api_base_url']}/brdges/{current_slide['brdge_id']}/slides/{current_slide['number']}"
                logger.info(f"Processing with slide URL: {slide_url}")

                # Add slide image to context
                chat_ctx.append(role="user", images=[ChatImage(url=slide_url)])
                # Add the user's input with context about the slide
                chat_ctx.append(
                    role="user",
                    text=f"Looking at slide {current_slide['number']} of {current_slide['total_slides']}, the presenter said: {txt}",
                )
            else:
                logger.info("No slide URL available, processing without image")
                chat_ctx.append(role="user", text=txt)
        except Exception as e:
            logger.error(f"Error processing with slide: {e}")
            chat_ctx.append(role="user", text=txt)

        return chat_ctx

    async def answer_from_text(txt: str):
        chat_ctx = assistant.chat_ctx.copy()
        chat_ctx = await process_input_with_slide(txt, chat_ctx)
        stream = assistant.llm.chat(chat_ctx=chat_ctx)
        await assistant.say(stream)

    @assistant.on("user_transcript")
    def on_user_transcript(transcript: str):
        logger.info(f"Received user transcript: {transcript}")
        asyncio.create_task(answer_from_text(transcript))

    @assistant.on("user_speech_committed")
    def on_user_speech_committed(msg: llm.ChatMessage):
        if isinstance(msg.content, list):
            text_content = "\n".join(
                (
                    str(x)
                    if not isinstance(x, llm.ChatImage)
                    else f"[Slide {current_slide['number']}]"
                )
                for x in msg.content
            )
        else:
            text_content = str(msg.content)
        # Use the log_queue defined in the outer scope
        log_queue.put_nowait(f"[{datetime.now()}] PRESENTER:\n{text_content}\n\n")

    @assistant.on("agent_speech_committed")
    def on_agent_speech_committed(msg: llm.ChatMessage):
        # Use the log_queue defined in the outer scope
        log_queue.put_nowait(f"[{datetime.now()}] ASSISTANT:\n{msg.content}\n\n")

    # Initial greeting
    await assistant.say(
        "Hello.",
        allow_interruptions=True,
    )

    # Replace wait_for_disconnect with a simple event wait
    disconnect_event = asyncio.Event()

    @ctx.room.on("disconnected")
    def on_disconnect(*args):
        logger.info("Room disconnected")
        disconnect_event.set()

    # Keep the connection alive
    try:
        await disconnect_event.wait()
    finally:
        logger.info("Cleaning up...")
        # Clean up any resources if needed


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
