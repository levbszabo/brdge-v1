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
    # Create the LLM instance
    llm_instance = openai.LLM(model="gpt-4o-mini")

    # Define the callback with correct signature and return type
    async def before_llm_callback(
        agent: VoicePipelineAgent, chat_ctx: llm.ChatContext
    ) -> Optional[llm.LLMStream]:
        logger.info("before_llm_callback invoked!")
        try:
            if current_slide["initialized"]:
                logger.info(f"Current slide state: {current_slide}")

                if current_slide["brdge_id"] and current_slide["number"]:
                    image_path = f"/tmp/brdge/slides_{current_slide['brdge_id']}/slide_{current_slide['number']}.png"
                    logger.info(f"Checking image path: {image_path}")

                    if os.path.exists(image_path):
                        logger.debug(f"Loading image from {image_path}")
                        base64_image = image_to_base64(image_path)
                        if base64_image:
                            # Create ChatImage with proper data URL format
                            slide_image = llm.ChatImage(
                                image=f"data:image/png;base64,{base64_image}"  # Add data URL prefix
                            )
                            # Create message with images list
                            image_message = llm.ChatMessage.create(
                                role="user", text="", images=[slide_image]
                            )
                            # Add the image message to context
                            chat_ctx.messages.append(image_message)
                            logger.debug("Added image to chat context")
                            logger.info(
                                f"Chat context after adding image: {len(chat_ctx.messages)} messages"
                            )

        except Exception as e:
            logger.error(f"Error in before_llm_callback: {e}", exc_info=True)

        # Always return a chat stream
        return agent.llm.chat(chat_ctx=chat_ctx)

    # Create and start the assistant with the callback
    assistant = VoicePipelineAgent(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=llm_instance,
        tts=cartesia.TTS(voice="5265a761-5cf5-4b35-9055-adfd541e591c"),
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
        try:
            decoded_message = data_packet.data.decode("utf-8")
            json_data = json.loads(decoded_message)
            # logger.info(f"Received slide data: {json.dumps(json_data, indent=2)}")

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
                    }
                )

                # Get or download the slide if URL is provided
                if current_slide["url"]:
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
