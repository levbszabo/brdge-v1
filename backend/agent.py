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
import requests
import asyncio
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import openai, deepgram, silero, cartesia
from livekit.agents.llm import ChatImage
from livekit import rtc
from livekit.rtc import VideoFrame, DataPacket
from livekit.rtc._proto import video_frame_pb2
import json
from datetime import datetime
import os

load_dotenv(dotenv_path=".env_local")
logger = logging.getLogger("voice-agent")
API_BASE_URL = os.getenv("API_BASE_URL")

# Enhanced system prompt that incorporates personality, knowledge base and transcript
SYSTEM_PROMPT_BASE = """
You are both the creator and a real-time co-presenter of this content. You are speaking naturally to your audience as if they are right here with you.
You have three key resources:
1) Personality: your personal speaking style, tone, and mannerisms.
2) Knowledge Base: deeper background or supporting facts, as if it's your own expertise.
3) Presentation Transcript: an ongoing record of what's said in the content.
Your goals:
- Provide a smooth, conversational experience as if you are personally guiding the audience.
- Weave in relevant details from your knowledge base naturally, without explicitly naming it.
- Continuously reflect the personality described.
- Sound genuine, concise, and coherent.
When Responding:
• Use a relaxed, first-person, natural speaking tone.  
• Keep responses concise: A few words if possible, or up to 1-2 short paragraphs or a few sentences if necessary.
• Reference previously covered points with phrases like "I mentioned earlier..." or "We recently looked at...".  
• If asked about future topics you have not yet covered, say "We'll explore that soon," or "I'll be covering that in a bit."  
• Never overuse the phrase "in this presentation"—speak as if you're chatting in real-time.  
• Avoid lengthy or repetitive explanations; aim for brevity.  
• If knowledge base info is relevant, weave it in as if it's your personal expertise.  
• Always maintain a sense of direct conversation with the audience—like a casual yet informed talk.
IMPORTANT: 
- You are the actual presenter. 
- Do not disclaim yourself as an AI model. 
- Do not reveal the knowledge base explicitly.
- Keep it human, short, and friendly.
Let's begin.
"""


def prewarm(proc: JobProcess):
    """Prewarm function to load models once"""
    try:
        logger.info("Starting prewarm function...")
        proc.userdata["vad"] = silero.VAD.load()
        logger.info("Prewarmed VAD model loaded successfully")
    except Exception as e:
        logger.error(f"Error loading VAD model in prewarm: {e}")
        proc.userdata["prewarm_failed"] = True


class ChatAssistant(VoicePipelineAgent):
    """Enhanced voice assistant that handles chat interactions with personality and knowledge base"""

    def __init__(self, vad, brdge_id: str = None):
        self.brdge_id = brdge_id
        self.api_base_url = API_BASE_URL
        self.personality = ""
        self.knowledge_content = ""
        self.document_knowledge = ""
        self.transcript_read = []
        self.transcript_remaining = []
        self.script = (None,)
        self.current_position = 0
        self.user_id = None
        self.voice_id = "4c74993b-be03-4436-8ef0-10586550b5f2"  # Default voice ID
        self.current_speech = {
            "started_at": None,
            "message": None,
            "was_interrupted": False,
        }
        self.system_prompt = None

        # Initialize agent with data from the script endpoint
        self.initialize()

        # Initialize with configured TTS voice
        super().__init__(
            vad=vad,
            stt=deepgram.STT(model="nova-2-conversationalai"),
            llm=openai.LLM(model="gpt-4o"),
            tts=cartesia.TTS(model="sonic", voice=self.voice_id),
            chat_ctx=llm.ChatContext().append(role="system", text=self.system_prompt),
            interrupt_speech_duration=0.1,
            preemptive_synthesis=True,
        )
        logger.info(f"Agent initialized with API base URL: {self.api_base_url}")
        self._setup_event_handlers()

    def initialize(self):
        """Initialize the agent by fetching script data directly"""
        if not self.brdge_id or not self.api_base_url:
            logger.error("Missing brdge_id or API_BASE_URL")
            return False

        try:
            # Fetch script data directly - this has everything we need
            response = requests.get(
                f"{self.api_base_url}/brdges/{self.brdge_id}/script"
            )
            response.raise_for_status()
            self.script_data = response.json()

            # Extract the full brdge script content
            self.brdge = self.script_data.get("brdge", {})
            self.agent_personality = self.script_data.get("content", {}).get(
                "agent_personality", {}
            )
            self.knowledge_base = self.script_data.get("content", {}).get(
                "knowledge_base", {}
            )
            self.qa_pairs = self.script_data.get("content", {}).get("qa_pairs", [])
            self.timeline = self.script_data.get("content", {}).get("timeline", [])
            self.engagement_opportunities = self.script_data.get("content", {}).get(
                "engagement_opportunities", []
            )

            # Log brdge object structure for debugging
            logger.info(f"Brdge object structure: {json.dumps(self.brdge, indent=2)}")

            # Set voice ID based on brdge settings, fallback to default if null
            default_voice = "4c74993b-be03-4436-8ef0-10586550b5f2"

            # Try to get voice ID from the brdge object directly
            self.voice_id = self.brdge.get("voice_id")
            logger.info(f"Retrieved voice_id from brdge object: {self.voice_id}")

            # If the voice_id is not found on the brdge object, make a direct API call
            if not self.voice_id:
                logger.info(
                    "No voice_id in brdge object, fetching directly from the brdge API"
                )
                try:
                    brdge_response = requests.get(
                        f"{self.api_base_url}/brdges/{self.brdge_id}"
                    )
                    brdge_response.raise_for_status()
                    brdge_data = brdge_response.json()
                    self.voice_id = brdge_data.get("voice_id")
                    logger.info(
                        f"Retrieved voice_id directly from API: {self.voice_id}"
                    )
                except Exception as e:
                    logger.error(f"Error fetching brdge data directly: {e}")

            # If we still don't have a voice_id, use default
            if not self.voice_id:
                logger.info(f"No voice_id found, using default: {default_voice}")
                self.voice_id = default_voice

            # Update TTS voice if needed
            if hasattr(self, "tts") and self.tts and self.voice_id:
                self.tts.update_voice(self.voice_id)
                logger.info(f"Updated TTS voice to {self.voice_id}")

            # Build system prompt with enriched data
            self.system_prompt = self._build_enhanced_system_prompt()

            # Log the full system prompt for debugging
            logger.info(
                "====================== FULL SYSTEM PROMPT ======================"
            )
            logger.info(self.system_prompt)
            logger.info(
                "================================================================"
            )

            # Update the chat context with new system prompt if already initialized
            if hasattr(self, "chat_ctx") and self.chat_ctx and self.chat_ctx.messages:
                self.chat_ctx.messages[0] = llm.ChatMessage.create(
                    role="system", text=self.system_prompt
                )

            logger.info("Agent initialization completed successfully")
            return True
        except Exception as e:
            logger.error(f"Error initializing agent: {e}")
            return False

    def _build_knowledge_content(self, knowledge_base):
        """Build knowledge content string from knowledge base entries"""
        content = ""
        for entry in knowledge_base:
            if isinstance(entry, dict) and "name" in entry and "content" in entry:
                content += f"\n# {entry['name']}\n{entry['content']}\n"
        return content

    def _process_transcript(self, transcript_data):
        """Process transcript data into read and remaining segments"""
        # Implementation depends on your transcript data structure
        # This is a placeholder implementation
        if "segments" in transcript_data:
            segments = transcript_data.get("segments", [])
            current_position = transcript_data.get("current_position", 0)

            # Split segments into read and remaining based on current_position
            self.transcript_read = [
                seg["text"]
                for seg in segments
                if seg.get("start", 0) < current_position
            ]
            self.transcript_remaining = [
                seg["text"]
                for seg in segments
                if seg.get("start", 0) >= current_position
            ]

    def _rebuild_system_prompt(self):
        """Rebuild the system prompt incorporating all current context"""
        recent_context = ""
        if self.transcript_read:
            recent_segments = self.transcript_read[-3:]
            recent_context = " ".join(recent_segments)

        merged_system_text = f"""{SYSTEM_PROMPT_BASE}
Agent Personality:
{self.personality}
Knowledge Base:
{self.knowledge_content}
Document Knowledge:
{self.document_knowledge}
Current Presentation Context:
You are currently at a point where you've just discussed: {recent_context}
Full Transcript Coverage:
Already Covered: {' '.join(self.transcript_read)}
Upcoming Topics: {' '.join(self.transcript_remaining[:2]) if self.transcript_remaining else "End of presentation"}
"""
        if self.chat_ctx.messages:
            self.chat_ctx.messages[0] = llm.ChatMessage.create(
                role="system",
                text=merged_system_text,
            )
        else:
            self.chat_ctx.append(role="system", text=merged_system_text)

    def _build_enhanced_system_prompt(self):
        """Build an enhanced system prompt that includes the raw JSON data with instructions on how to use it"""
        try:
            # Extract basic personality info for the identity section
            name = "Brdge AI Assistant"
            expertise = []
            persona_background = ""
            communication_style = "friendly"
            common_phrases = []

            # Safely extract agent personality data if available
            if isinstance(self.agent_personality, dict):
                name = self.agent_personality.get("name", name)
                expertise = self.agent_personality.get("expertise", expertise)
                persona_background = self.agent_personality.get(
                    "persona_background", persona_background
                )
                communication_style = self.agent_personality.get(
                    "communication_style", communication_style
                )

                # Get voice characteristics for common phrases
                voice_chars = self.agent_personality.get("voice_characteristics", {})
                if isinstance(voice_chars, dict):
                    common_phrases = voice_chars.get("common_phrases", [])

            # Start with core identity and interaction guidelines
            prompt = f"""
# CORE IDENTITY AND ROLE

You are {name}, an expert on the content being presented in this video. You embody the presenter's knowledge, style, and expertise.

## Your Expertise Areas:
{', '.join(expertise) if isinstance(expertise, list) and expertise else "General knowledge"}

## Your Background:
{persona_background}

## Your Communication Style:
Your tone is {communication_style}. You speak naturally and conversationally, as if explaining concepts to a friend or colleague.
{f"You often use phrases like {', '.join(common_phrases[:3])}" if common_phrases and len(common_phrases) > 0 else ""}

# INTERACTION GUIDELINES

1. CONVERSATIONAL TONE: Speak naturally using contractions (I'm, we'll, that's) and casual phrases.

2. CONCISE RESPONSES: Prefer shorter answers (1-3 sentences) unless detailed explanation is requested. Get to the point quickly.

3. FIRST-PERSON PERSPECTIVE: You ARE the presenter. Use "I" and "my" when referencing content or opinions in the video.

4. KEEP IT NATURAL: Never mention AI, knowledge bases, or that you're an assistant. You're simply the presenter answering questions.

5. NO DISCLAIMERS: Don't use phrases like "based on the video" or "according to the content." Speak as the authoritative source.

6. AUTHENTIC GAPS: If you don't know something specific from the video, say "I haven't covered that in detail" instead of claiming AI limitations.

# COMPLETE VIDEO CONTENT DATA

Below is the complete JSON data containing everything you need to know about the video content. Use this data to answer questions accurately:

## HOW TO USE THIS DATA:

- METADATA: Contains basic information about the video like title, summary, and key topics
- QA_PAIRS: Pre-answered questions and answers about the content - use these directly when relevant
- TIMELINE: Chronological breakdown of what happens in the video, with timestamps, spoken text, and visuals
- KNOWLEDGE_BASE: Additional information and context about topics in the video
- KNOWLEDGE_GRAPH: Shows relationships between key entities mentioned in the video
- AGENT_PERSONALITY: Your personality traits, communication style, and expertise areas
- ENGAGEMENT_OPPORTUNITIES: Key moments where you should provide more detailed information

## RAW JSON CONTENT:
"""

            # Include the complete content data as JSON to ensure nothing is lost
            if (
                hasattr(self, "script_data")
                and self.script_data
                and "content" in self.script_data
            ):
                content_data = self.script_data.get("content", {})
                # Format the JSON to be more readable in the prompt
                formatted_json = json.dumps(content_data, indent=2)
                prompt += f"""
```json
{formatted_json}
```
"""
            else:
                # If for some reason we don't have the complete content data, add what we have
                available_data = {}

                if hasattr(self, "agent_personality") and self.agent_personality:
                    available_data["agent_personality"] = self.agent_personality

                if hasattr(self, "knowledge_base") and self.knowledge_base:
                    available_data["knowledge_base"] = self.knowledge_base

                if hasattr(self, "qa_pairs") and self.qa_pairs:
                    available_data["qa_pairs"] = self.qa_pairs

                if hasattr(self, "timeline") and self.timeline:
                    available_data["timeline"] = self.timeline

                if (
                    hasattr(self, "engagement_opportunities")
                    and self.engagement_opportunities
                ):
                    available_data["engagement_opportunities"] = (
                        self.engagement_opportunities
                    )

                formatted_json = json.dumps(available_data, indent=2)
                prompt += f"""
```json
{formatted_json}
```
"""

            # Add specific instructions on how to use the data
            prompt += """
# HOW TO RESPOND USING THE DATA

When answering questions:
1. First check QA_PAIRS for direct matches to the question
2. If not found, use TIMELINE to locate relevant information by timestamp
3. Use KNOWLEDGE_BASE for deeper context and explanations
4. Reference KNOWLEDGE_GRAPH to understand relationships between concepts
5. Maintain your personality from AGENT_PERSONALITY in all responses

Important tips:
- Use METADATA to understand the overall context of the video
- Cite specific TIMELINE timestamps when relevant to answer questions
- Never mention that you're looking up information in a JSON structure
- Respond as if you're the presenter who created the video
- Always maintain a friendly, conversational tone

# FINAL REMINDER

Remember: You are engaging directly with someone who's watching this video. Be helpful, engaging, and authentic. Your goal is to make them feel like they're having a direct conversation with the presenter.
"""

            return prompt

        except Exception as e:
            logger.error(f"Error building enhanced system prompt: {e}")
            logger.error(f"Exception details: {str(e)}")
            # Log the traceback for more detailed debugging
            import traceback

            logger.error(f"Traceback: {traceback.format_exc()}")
            # Provide a basic fallback prompt
            return SYSTEM_PROMPT_BASE

    def _setup_event_handlers(self):
        @self.on("agent_started_speaking")
        def on_agent_speaking():
            print("Agent started speaking")
            self.current_speech = {
                "started_at": datetime.utcnow(),
                "message": None,
                "was_interrupted": False,
            }
            try:
                viewer_user_id = None
                anonymous_id = None

                # Convert user_id to string for checking
                user_id_str = str(self.user_id) if self.user_id is not None else None
                if user_id_str:
                    if user_id_str.startswith("anon_"):
                        anonymous_id = user_id_str
                    else:
                        try:
                            viewer_user_id = int(user_id_str)
                        except ValueError:
                            logger.error(f"Invalid user_id format: {self.user_id}")

                if not self.api_base_url:
                    logger.error("API_BASE_URL environment variable is not set")
                    return

                if not self.brdge_id:
                    logger.error("brdge_id is not set")
                    return

                response = requests.post(
                    f"{self.api_base_url}/brdges/{self.brdge_id}/usage-logs",
                    json={
                        "brdge_id": self.brdge_id,
                        "viewer_user_id": viewer_user_id,
                        "anonymous_id": anonymous_id,
                        "started_at": self.current_speech["started_at"].isoformat(),
                        "was_interrupted": False,
                    },
                )
                response.raise_for_status()
                self.current_speech["log_id"] = response.json().get("id")
                logger.info(
                    f"Created usage log with ID: {self.current_speech['log_id']}"
                )

            except requests.exceptions.RequestException as e:
                logger.error(f"HTTP Error creating usage log: {e}")
            except Exception as e:
                logger.error(f"Error creating usage log: {e}")

        @self.on("agent_speech_interrupted")
        def on_agent_speech_interrupted(msg: llm.ChatMessage):
            """Track when agent's speech is interrupted"""
            logger.info(f"Agent speech interrupted: {msg.content}")

            if self.current_speech["started_at"]:
                ended_at = datetime.utcnow()
                duration = (
                    ended_at - self.current_speech["started_at"]
                ).total_seconds() / 60.0

                try:
                    if self.current_speech.get("log_id"):
                        response = requests.put(
                            f"{self.api_base_url}/brdges/{self.brdge_id}/usage-logs/{self.current_speech['log_id']}",
                            json={
                                "ended_at": ended_at.isoformat(),
                                "duration_minutes": round(duration, 2),
                                "was_interrupted": True,
                                "agent_message": msg.content,
                            },
                        )
                        response.raise_for_status()
                        logger.info(
                            f"Updated usage log {self.current_speech['log_id']} with interruption"
                        )
                except requests.exceptions.RequestException as e:
                    logger.error(f"HTTP Error updating usage log: {e}")
                except Exception as e:
                    logger.error(f"Error updating usage log: {e}")

                self.current_speech = {
                    "started_at": None,
                    "message": None,
                    "was_interrupted": False,
                }

        @self.on("agent_speech_committed")
        def on_agent_speech_completed(msg: llm.ChatMessage):
            """Track when agent's speech completes normally"""
            logger.info(f"Agent speech completed: {msg.content}")

            if self.current_speech["started_at"]:
                ended_at = datetime.utcnow()
                duration = (
                    ended_at - self.current_speech["started_at"]
                ).total_seconds() / 60.0

                try:
                    if self.current_speech.get("log_id"):
                        response = requests.put(
                            f"{self.api_base_url}/brdges/{self.brdge_id}/usage-logs/{self.current_speech['log_id']}",
                            json={
                                "ended_at": ended_at.isoformat(),
                                "duration_minutes": round(duration, 2),
                                "was_interrupted": False,
                                "agent_message": msg.content,
                            },
                        )
                        response.raise_for_status()
                        logger.info(
                            f"Updated usage log {self.current_speech['log_id']} with completion"
                        )
                except requests.exceptions.RequestException as e:
                    logger.error(f"HTTP Error updating usage log: {e}")
                except Exception as e:
                    logger.error(f"Error updating usage log: {e}")

                self.current_speech = {
                    "started_at": None,
                    "message": None,
                    "was_interrupted": False,
                }

    def _rebuild_system_prompt(self):
        """Rebuild the system prompt incorporating all current context"""
        recent_context = ""
        if self.transcript_read:
            recent_segments = self.transcript_read[-3:]
            recent_context = " ".join(recent_segments)

        merged_system_text = f"""{SYSTEM_PROMPT_BASE}
Agent Personality:
{self.personality}
Knowledge Base:
{self.knowledge_content}
Document Knowledge:
{self.document_knowledge}
Current Presentation Context:
You are currently at a point where you've just discussed: {recent_context}
Full Transcript Coverage:
Already Covered: {' '.join(self.transcript_read)}
Upcoming Topics: {' '.join(self.transcript_remaining[:2]) if self.transcript_remaining else "End of presentation"}
"""
        if self.chat_ctx.messages:
            self.chat_ctx.messages[0] = llm.ChatMessage.create(
                role="system",
                text=merged_system_text,
            )
        else:
            self.chat_ctx.append(role="system", text=merged_system_text)

    # def interrupt(self, interrupt_all: bool = False):
    #     """Interrupt the current speech"""
    #     logger.info("Interrupting current speech")
    #     return super().interrupt(interrupt_all=interrupt_all)


async def entrypoint(ctx: JobContext):
    logger.info("Entrypoint started")
    await ctx.connect()

    participant = await ctx.wait_for_participant()
    logger.info(f"Starting assistant for participant {participant.identity}")

    # Extract brdge_id from participant identity
    try:
        # Expected format: "brdge_<brdge_id>_<user_id>"
        identity_parts = participant.identity.split("-")
        brdge_id = identity_parts[1]
    except Exception as e:
        logger.error(f"Error parsing participant identity: {e}")
        return

    logger.info(f"Extracted brdge_id: {brdge_id}")

    # Get the prewarmed VAD model with fallback
    try:
        if ctx.proc.userdata.get("prewarm_failed"):
            logger.warning("Prewarm failed, loading VAD model directly")
            vad = silero.VAD.load()
        else:
            vad = ctx.proc.userdata.get("vad")
            if vad is None:
                logger.warning("VAD not found in userdata, loading directly")
                vad = silero.VAD.load()
    except Exception as e:
        logger.error(f"Error loading VAD model: {e}")
        vad = silero.VAD.load()

    # Initialize agent with brdge_id
    agent = ChatAssistant(vad, brdge_id)

    chat = rtc.ChatManager(ctx.room)

    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        if not agent:
            logger.warning("Agent not initialized, cannot process chat message")
            return

        # Interrupt current speech if any
        agent.interrupt(interrupt_all=True)

        cleaned_message = " ".join(msg.message.split()).strip()
        if not cleaned_message:
            return

        logger.info(f"Received chat message: {cleaned_message}")

        # Process with LLM
        async def process_message():
            try:
                # Add message to agent's chat context
                agent.chat_ctx.append(role="user", text=cleaned_message)

                # Get response from LLM
                response = await agent.say(
                    agent.llm.chat(chat_ctx=agent.chat_ctx),
                    allow_interruptions=True,
                )
                logger.info(f"Agent response: {response}")
            except Exception as e:
                logger.error(f"Error processing chat message: {e}")
                await agent.say(
                    "I apologize for the confusion. Let's try that again.",
                    allow_interruptions=False,
                )

        asyncio.create_task(process_message())

    # Start the agent pipeline
    agent.start(ctx.room, participant)

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
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
