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
from livekit.agents.llm import ChatImage
import json

load_dotenv(dotenv_path=".env.local")
logger = logging.getLogger("voice-agent")


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Wait for the first participant to connect
    participant = await ctx.wait_for_participant()
    logger.info(f"starting voice assistant for participant {participant.identity}")

    # Initialize with empty context
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "You are a helpful AI assistant that will help users describe and present their slides. "
            "When a new slide appears, help guide the user to describe what's on the slide and "
            "ask relevant questions to help them elaborate on the content."
        ),
    )

    assistant = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=cartesia.TTS(voice="3a7e284d-ee6d-459d-91e3-405d8dadfbdf"),
        chat_ctx=initial_ctx,
    )

    # Set up data message handler for slide changes
    async def handle_data_message(msg):
        try:
            data = json.loads(msg.payload.decode())
            if data.get("type") == "slide_change":
                slide_number = data.get("slide_number")
                slide_url = data.get("slide_url")

                # Update context with new slide
                chat_image = ChatImage(image=slide_url)
                new_context = assistant.chat_ctx.append(
                    role="system",
                    text=f"The user has moved to slide {slide_number}. Help them describe this slide.",
                    images=[chat_image],
                )
                await assistant.update_context(new_context)

                # Prompt the user about the new slide
                await assistant.say(
                    f"I see we're now on slide {slide_number}. Could you tell me about what we're looking at?",
                    allow_interruptions=True,
                )
        except Exception as e:
            logger.error(f"Error handling data message: {e}")

    # Subscribe to data messages
    ctx.room.on("data_received", handle_data_message)

    assistant.start(ctx.room, participant)

    # Initial greeting
    await assistant.say(
        "Hello! I'm ready to help you present your slides. When you're ready, "
        "please navigate through your slides and I'll help you describe them.",
        allow_interruptions=True,
    )

    # Keep the connection alive
    await ctx.wait_for_disconnect()


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
