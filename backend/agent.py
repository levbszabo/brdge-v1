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
import json
from datetime import datetime

load_dotenv(dotenv_path=".env.local")
logger = logging.getLogger("voice-agent")


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

    async def answer_from_text(txt: str):
        chat_ctx = assistant.chat_ctx.copy()
        chat_ctx.append(role="user", text=txt)
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

    async def write_transcription():
        async with open("transcription.txt", "w") as f:
            while True:
                msg = await log_queue.get()
                if msg is None:
                    break
                await f.write(msg)

    write_task = asyncio.create_task(write_transcription())

    async def finish_queue():
        log_queue.put_nowait(None)
        await write_task

    ctx.add_shutdown_callback(finish_queue)

    # Initial greeting
    await assistant.say(
        "Howdy mate, its Levi here",
        allow_interruptions=True,
    )

    # Keep the connection alive by waiting for the room to close


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
