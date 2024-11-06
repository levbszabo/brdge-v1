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
import asyncio

load_dotenv(dotenv_path=".env.local")
logger = logging.getLogger("voice-agent")


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    participant = await ctx.wait_for_participant()
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
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=cartesia.TTS(voice="3a7e284d-ee6d-459d-91e3-405d8dadfbdf"),
        chat_ctx=initial_ctx,
    )

    # Set up transcript handler for user speech
    async def on_transcript(text: str):
        try:
            message = {
                "type": "chat_message",
                "content": text,
                "sender": "user",
                "timestamp": None,  # LiveKit will add this
            }
            await ctx.room.local_participant.publish_message(json.dumps(message))
            logger.info(f"Published user message: {text}")
        except Exception as e:
            logger.error(f"Error publishing user message: {e}")

    # Set up assistant response handler
    async def on_assistant_response(text: str):
        try:
            message = {
                "type": "chat_message",
                "content": text,
                "sender": "assistant",
                "timestamp": None,  # LiveKit will add this
            }
            await ctx.room.local_participant.publish_message(json.dumps(message))
            logger.info(f"Published assistant message: {text}")
        except Exception as e:
            logger.error(f"Error publishing assistant message: {e}")

    # Hook up the handlers
    assistant.on("transcript", on_transcript)
    assistant.on("say", on_assistant_response)

    # Handle slide changes
    async def handle_chat_message(msg):
        try:
            data = json.loads(msg.message)

            if data.get("type") == "slide_change":
                slide_number = data.get("slide_number")
                slide_url = data.get("slide_url")

                chat_image = ChatImage(image=slide_url)
                new_context = assistant.chat_ctx.append(
                    role="system",
                    text=f"The user has moved to slide {slide_number}. Help them describe this slide.",
                    images=[chat_image],
                )
                await assistant.update_context(new_context)

                # Send a system message about slide change
                system_message = {
                    "type": "chat_message",
                    "content": f"Moved to slide {slide_number}",
                    "sender": "system",
                    "timestamp": None,
                }
                await ctx.room.local_participant.publish_message(
                    json.dumps(system_message)
                )

                await assistant.say(
                    f"I see we're now on slide {slide_number}. Could you tell me about what we're looking at?"
                )
        except Exception as e:
            logger.error(f"Error handling chat message: {e}")

    ctx.room.on("message_received", handle_chat_message)

    assistant.start(ctx.room, participant)

    try:
        await assistant.say("Hello! I'm ready to help you present your slides.")
    except Exception as e:
        logger.error(f"Error in initial greeting: {e}")

    # Keep the connection alive
    try:
        while True:
            await asyncio.sleep(1)
    except Exception as e:
        logger.error(f"Error in main loop: {e}")
    finally:
        assistant.stop()


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
