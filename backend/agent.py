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
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import openai, deepgram, silero, cartesia
from PIL import Image
import base64
import io
from livekit.agents.llm import ChatImage


load_dotenv(dotenv_path=".env.local")
logger = logging.getLogger("voice-agent")


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


def load_and_resize_image(image_path, size=(100, 100)):
    with Image.open(image_path) as img:
        img = img.resize(size, Image.LANCZOS)
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode("utf-8")


async def entrypoint(ctx: JobContext):
    # Use the example URL for the image
    image_url = "https://t1.gstatic.com/images?q=tbn:ANd9GcQQn6_Hz9zTckXYuOa1biiMhulnHv6pKtadAFcdg79yocrL3Y29"

    # Create a ChatImage instance with the URL
    chat_image = ChatImage(image=image_url)

    initial_ctx = (
        llm.ChatContext()
        .append(
            role="system",
            text=("Chat with the user in a friendly way"),
        )
        .append(
            role="user",
            text="Here is an image for context.",
            images=[chat_image],
        )
    )

    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Wait for the first participant to connect
    participant = await ctx.wait_for_participant()
    logger.info(f"starting voice assistant for participant {participant.identity}")

    assistant = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=cartesia.TTS(voice="3a7e284d-ee6d-459d-91e3-405d8dadfbdf"),
        chat_ctx=initial_ctx,
    )

    assistant.start(ctx.room, participant)

    await assistant.say(
        "Hey bro hows it going? Happy to see what you have for me today",
        allow_interruptions=True,
    )


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
