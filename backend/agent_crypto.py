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
from livekit.rtc import VideoFrame
from livekit.rtc._proto import video_frame_pb2
import json
from datetime import datetime
from livekit.plugins import browser
import io
from PIL import Image
import base64

WIDTH = 1920
HEIGHT = 1080
load_dotenv(dotenv_path=".env_crypto")
logger = logging.getLogger("voice-agent")


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect()

    participant = await ctx.wait_for_participant()
    # browser_ctx = browser.BrowserContext(dev_mode=True)
    # print(participant.track_publications)

    # await browser_ctx.initialize()
    # page = await browser_ctx.new_page(
    #     url="https://cointelegraph.com/bitcoin-price",
    #     width=WIDTH,
    #     height=HEIGHT,
    #     framerate=1,
    # )
    # source = rtc.VideoSource(WIDTH, HEIGHT)
    # track = rtc.LocalVideoTrack.create_video_track("single-color", source)
    # options = rtc.TrackPublishOptions(source=rtc.TrackSource.SOURCE_CAMERA)
    # publication = await ctx.room.local_participant.publish_track(track, options)

    # @page.on("paint")
    # def on_paint(paint_data):
    #     try:
    #         source.capture_frame(paint_data.frame)
    #     except Exception as e:
    #         logger.error(f"Frame capture error: {e}")

    logger.info(f"starting voice assistant for participant {participant.identity}")

    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "You are a helpful AI assistant that will help users describe and present their slides. "
            "When a new slide appears, help guide the user to describe what's on the slide and "
            "ask relevant questions to help them elaborate on the content."
        ),
    )

    assistant = VoicePipelineAgent(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=cartesia.TTS(voice="3a7e284d-ee6d-459d-91e3-405d8dadfbdf"),
        chat_ctx=initial_ctx,
    )

    # Set up data message handler for slide changes
    # async def handle_data_message(msg):
    #     try:
    #         data = json.loads(msg.payload.decode())
    #         if data.get("type") == "slide_change":
    #             slide_number = data.get("slide_number")
    #             slide_url = data.get("slide_url")

    #             # Update context with new slide
    #             chat_image = ChatImage(image=slide_url)
    #             new_context = assistant.chat_ctx.append(
    #                 role="system",
    #                 text=f"The user has moved to slide {slide_number}. Help them describe this slide.",
    #                 images=[chat_image],
    #             )
    #             await assistant.update_context(new_context)

    #             # Prompt the user about the new slide
    #             await assistant.say(
    #                 f"I see we're now on slide {slide_number}. Could you tell me about what we're looking at?",
    #                 allow_interruptions=True,
    #             )
    #     except Exception as e:
    #         logger.error(f"Error handling data message: {e}")

    # Subscribe to data messages
    # ctx.room.on("data_received", handle_data_message)

    assistant.start(ctx.room, participant)

    chat = rtc.ChatManager(ctx.room)

    async def capture_screen_frame(participant) -> str:
        """Capture a frame from the screen share track and return as base64"""
        try:
            # Find screen share track
            screen_track = next(
                (
                    pub.track
                    for pub in participant.track_publications.values()
                    if pub.kind == rtc.TrackKind.KIND_VIDEO
                    and pub.source == rtc.TrackSource.SOURCE_SCREENSHARE
                    and pub.track is not None
                ),
                None,
            )

            if screen_track:
                # Create video stream from track
                video_stream = rtc.VideoStream.from_track(
                    track=screen_track, format=video_frame_pb2.RGB24
                )

                # Get first frame from stream
                async for frame_event in video_stream:
                    frame = frame_event.frame

                    # Create PIL Image from frame data
                    image = Image.frombytes(
                        "RGB", (frame.width, frame.height), bytes(frame.data)
                    )

                    # Convert to base64
                    img_byte_arr = io.BytesIO()
                    image.save(img_byte_arr, format="PNG")
                    img_byte_arr.seek(0)

                    # Convert to base64 string with data URL prefix
                    base64_image = base64.b64encode(img_byte_arr.getvalue()).decode(
                        "utf-8"
                    )
                    data_url = f"data:image/png;base64,{base64_image}"

                    # Close the stream
                    await video_stream.aclose()

                    return data_url

                await video_stream.aclose()
                return None

            logger.error("No screen share track found")
            return None
        except Exception as e:
            logger.error(f"Error capturing screen frame: {e}")
            import traceback

            logger.error(f"Traceback: {traceback.format_exc()}")
            return None

    async def answer_from_text(txt: str):
        chat_ctx = assistant.chat_ctx.copy()
        chat_ctx.append(role="user", text=txt)

        # Capture screen image if requested
        logger.info("Screen capture requested")
        try:
            # Get frame from screen share
            image_data = await capture_screen_frame(participant)
            if image_data:
                logger.info("Successfully captured screen frame")
                # Create ChatImage with the data URL string
                chat_image = ChatImage(
                    image=image_data
                )  # Now passing a data URL string
                chat_ctx.append(role="user", images=[chat_image])
                chat_ctx.append(
                    role="user",
                    text="Utilize the image to help you answer the question.",
                )
            else:
                logger.error("No screen frame captured")
        except Exception as e:
            logger.error(f"Error in screen capture process: {e}")
            import traceback

            logger.error(f"Traceback: {traceback.format_exc()}")

        stream = assistant.llm.chat(chat_ctx=chat_ctx)
        await assistant.say(stream)

    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        if msg.message:
            asyncio.create_task(answer_from_text(msg.message))

    log_queue = asyncio.Queue()

    @assistant.on("user_speech_committed")
    def on_user_speech_committed(msg: llm.ChatMessage):
        # convert string lists to strings, drop images
        if isinstance(msg.content, list):
            msg.content = "\n".join(
                "[image]" if isinstance(x, llm.ChatImage) else x for x in msg
            )
        log_queue.put_nowait(f"[{datetime.now()}] USER:\n{msg.content}\n\n")

    @assistant.on("agent_speech_committed")
    def on_agent_speech_committed(msg: llm.ChatMessage):
        log_queue.put_nowait(f"[{datetime.now()}] AGENT:\n{msg.content}\n\n")

    # Initial greeting
    await assistant.say(
        "Howdy mate, its Levi here",
        allow_interruptions=True,
    )

    # Keep the connection alive by waiting for the room to close


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
