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
from livekit.agents.llm import ChatImage, ChatContext, LLMStream
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
        self.current_timestamp_seconds = 0
        self.current_timestamp = "00:00:00"
        self.triggered_opportunities = (
            set()
        )  # Track which opportunities have been triggered
        self.system_prompt = None

        # Initialize agent with data from the script endpoint
        self.initialize()

        def _my_default_before_llm_cb(self, chat_ctx: ChatContext) -> LLMStream:
            print("current_timestamp", self.current_timestamp)
            chat_ctx.append(
                role="system",
                text=f"Current video timestamp: {self.current_timestamp}",
            )
            return self.llm.chat(
                chat_ctx=chat_ctx,
                fnc_ctx=self.fnc_ctx,
            )

        # Initialize with configured TTS voice
        super().__init__(
            vad=vad,
            stt=deepgram.STT(model="nova-3-general"),
            llm=openai.LLM(model="gpt-4o"),
            tts=cartesia.TTS(model="sonic-2", voice=self.voice_id),
            chat_ctx=llm.ChatContext().append(role="system", text=self.system_prompt),
            interrupt_speech_duration=0.2,
            before_llm_cb=_my_default_before_llm_cb,
        )
        logger.info(f"Agent initialized with API base URL: {self.api_base_url}")
        self._setup_event_handlers()

    def initialize(self):
        """Initialize the agent by fetching script data directly"""
        if not self.brdge_id or not self.api_base_url:
            logger.error("Missing brdge_id or API_BASE_URL")
            return False

        try:
            # Fetch script data from the agent-config endpoint
            response = requests.get(
                f"{self.api_base_url}/brdges/{self.brdge_id}/agent-config"
            )
            response.raise_for_status()
            config_data = response.json()

            # Extract data from the agent-config response
            self.brdge = config_data.get("brdge", {})
            self.agent_personality = config_data.get("agentPersonality", {})
            self.teaching_persona = config_data.get("teaching_persona", {})
            self.knowledge_base = config_data.get("knowledge_base", {})
            self.qa_pairs = config_data.get("qa_pairs", [])

            # Get timeline data from either the dedicated field or from video_timeline
            self.video_timeline = config_data.get("timeline", {})

            # Extract engagement opportunities
            self.engagement_opportunities = config_data.get(
                "engagement_opportunities", []
            )

            # Log retrieved data for debugging
            logger.info(
                f"Retrieved {len(self.engagement_opportunities)} engagement opportunities"
            )
            if self.video_timeline:
                logger.info(f"Timeline data retrieved successfully")

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

            # Update the chat context with new system prompt if already initialized
            if hasattr(self, "chat_ctx") and self.chat_ctx and self.chat_ctx.messages:
                self.chat_ctx.messages[0] = llm.ChatMessage.create(
                    role="system", text=self.system_prompt
                )

            logger.info("Agent initialization completed successfully")
            return True
        except Exception as e:
            logger.error(f"Error initializing agent: {e}")
            logger.error(f"Exception details: {str(e)}")
            return False

    # def _before_llm_cb(self, agent):
    #     """Callback function to modify the system prompt before LLM calls"""
    #     logger.info(
    #         f"_before_llm_cb called with current_timestamp: {self.current_timestamp}"
    #     )
    #     await agent.chat_ctx.append(
    #         role="system", text=f"Current timestamp: {agent.current_timestamp}"
    #     )

    def _build_enhanced_system_prompt(self):
        """Build an enhanced system prompt that includes the raw JSON data with instructions on how to use it"""
        try:
            # Use pre-formatted timestamp string
            timestamp_str = self.current_timestamp

            # Start with core identity and interaction guidelines
            content_data = {
                "teaching_persona": (
                    self.teaching_persona if hasattr(self, "teaching_persona") else {}
                ),
                "knowledge_base": (
                    self.knowledge_base if hasattr(self, "knowledge_base") else {}
                ),
                "qa_pairs": self.qa_pairs if hasattr(self, "qa_pairs") else [],
                "video_timeline": (
                    self.video_timeline if hasattr(self, "video_timeline") else {}
                ),
                "engagement_opportunities": (
                    self.engagement_opportunities
                    if hasattr(self, "engagement_opportunities")
                    else []
                ),
                "agent_personality": (
                    self.agent_personality if hasattr(self, "agent_personality") else {}
                ),
                "current_timestamp": timestamp_str,
            }

            # Format the JSON to be more readable in the prompt
            formatted_json = json.dumps(content_data, indent=2)

            # Start with an explicit timestamp mention
            prompt = f"""
IMPORTANT: The current video timestamp can change throughout your interaction with the user,
ensure you are always using the most up to date timestamp.

```json
{formatted_json}
```
"""

            # Add specific instructions on how to use the data
            prompt += """
# HOW TO RESPOND USING THE DATA
IMPORTANT: The current video timestamp is shown above. When asked about the current time or timestamp, 
always reference this exact value.

Always consider the current_timestamp when answering questions since that will give you 
some important context about where you are in the video. 

When answering questions:
1. If not found, use VIDEO TIMELINE to locate relevant information by timestamp
2. Use KNOWLEDGE_BASE for deeper context and explanations
3. Reference relationships between concepts if available
4. Maintain your personality from TEACHING_PERSONA in all responses
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

    async def check_engagement_opportunities(self, current_time_seconds):
        """Check if there are any engagement opportunities near the current timestamp"""
        if (
            not hasattr(self, "engagement_opportunities")
            or not self.engagement_opportunities
        ):
            logger.info("No engagement opportunities available to check")
            return False

        # Define proximity threshold (1 second)
        threshold = 1.0

        for opportunity in self.engagement_opportunities:
            try:
                # Get timestamp from opportunity
                opp_timestamp_str = opportunity.get("timestamp", "00:00:00")

                # Convert HH:MM:SS to seconds for comparison
                h, m, s = map(int, opp_timestamp_str.split(":"))
                opp_time_seconds = h * 3600 + m * 60 + s

                # Check if we're within threshold of this opportunity
                if abs(current_time_seconds - opp_time_seconds) <= threshold:
                    logger.info(f"Found engagement opportunity at {opp_timestamp_str}")

                    # Check if this opportunity has been triggered already
                    opp_id = opportunity.get("id")
                    if (
                        hasattr(self, "triggered_opportunities")
                        and opp_id in self.triggered_opportunities
                    ):
                        logger.info(f"Opportunity {opp_id} already triggered, skipping")
                        return False

                    # Trigger this opportunity
                    await self.trigger_engagement_opportunity(opportunity)

                    # Mark this opportunity as triggered
                    if not hasattr(self, "triggered_opportunities"):
                        self.triggered_opportunities = set()
                    self.triggered_opportunities.add(opp_id)

                    return True
            except Exception as e:
                logger.error(f"Error checking opportunity: {e}")

        return False

    async def trigger_engagement_opportunity(self, opportunity):
        """Present an engagement opportunity to the user"""
        try:
            # Extract details from the opportunity
            engagement_type = opportunity.get("engagement_type", "")
            concepts = opportunity.get("concepts_addressed", [])
            quiz_items = opportunity.get("quiz_items", [])

            logger.info(
                f"Triggering {engagement_type} engagement about {', '.join(concepts)}"
            )

            if not quiz_items:
                logger.warning("No quiz items found in opportunity")
                return

            # Take the first quiz item
            quiz_item = quiz_items[0]
            question = quiz_item.get("question", "")

            # Interrupt any current speech
            self.interrupt(interrupt_all=True)

            # Format the engagement based on type
            if engagement_type == "quiz":
                options = quiz_item.get("options", [])
                correct_option = quiz_item.get("correct_option")
                explanation = quiz_item.get("explanation", "")

                # Build quiz prompt
                prompt = f"I'd like to check your understanding with a quick question: {question}"

                if options:
                    prompt += "\n\nOptions:"
                    for i, option in enumerate(options):
                        prompt += f"\n{i+1}. {option}"

                # Use different quote style to avoid backslash issues
                if_correct = quiz_item.get("follow_up", {}).get(
                    "if_correct", "That's correct!"
                )
                if_incorrect = quiz_item.get("follow_up", {}).get(
                    "if_incorrect", "Not quite."
                )

                # Add context for the LLM with fixed f-string
                self.chat_ctx.append(
                    role="system",
                    text=f"""
You are now in engagement mode. Present this quiz to the user exactly as formatted below.
Don't say "here's a quiz" or similar prefacing - just present it naturally as if you decided to ask this.

QUIZ QUESTION: {question}

{"OPTIONS: " + ", ".join(options) if options else ""}

When the user responds:
- If they select {correct_option} or give an answer similar to it, respond with: "{if_correct}"
- If they give a different answer, respond with: "{if_incorrect}"
- If appropriate, you can add: "{explanation}"

After handling their response, continue the conversation normally.
""",
                )

            elif engagement_type == "discussion":
                expected_answer = quiz_item.get("expected_answer", "")

                # Get follow-up responses separately to avoid backslash issues
                if_correct = quiz_item.get("follow_up", {}).get(
                    "if_correct", "That's a great point!"
                )
                if_incorrect = quiz_item.get("follow_up", {}).get(
                    "if_incorrect", "Consider also..."
                )

                # Build discussion prompt
                prompt = f"Let's discuss something: {question}"

                # Add context for the LLM with fixed f-string
                self.chat_ctx.append(
                    role="system",
                    text=f"""
You are now in engagement mode. Present this discussion question to the user:

DISCUSSION QUESTION: {question}

Evaluate their response based on these guidelines:
- A good response should include points like: {expected_answer}
- If their response is thoughtful and covers key points, respond with: "{if_correct}"
- If their response seems incomplete, respond with: "{if_incorrect}"

Guide the discussion naturally without being overly evaluative.
""",
                )

            # Say the engagement prompt
            logger.info(f"Presenting engagement: {prompt}")
            await self.say(prompt, allow_interruptions=True)

        except Exception as e:
            logger.error(f"Error triggering engagement opportunity: {e}")


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

    # Add handler for data channel messages
    @ctx.room.on("data_received")
    def on_data_received(data_packet: rtc.DataPacket):
        """Handle incoming data channel message."""
        sender = data_packet.participant.identity
        topic = getattr(data_packet, "topic", "unknown")

        logger.info(
            f"Received data packet from {sender} on topic: {topic}, payload size: {len(data_packet.data)} bytes"
        )

        try:
            # Decode bytes to string
            message_str = data_packet.data.decode("utf-8")

            # Parse JSON
            message = json.loads(message_str)

            # Look for timestamp messages
            if message.get("type") == "timestamp" and "time" in message:
                # Store raw seconds value
                raw_seconds = message["time"]

                # Convert to HH:MM:SS format immediately
                hours = int(raw_seconds // 3600)
                minutes = int((raw_seconds % 3600) // 60)
                seconds = int(raw_seconds % 60)
                formatted_timestamp = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

                logger.info(
                    f"Received video timestamp from {sender}: {raw_seconds} → {formatted_timestamp}"
                )

                # Store both values in the agent instance
                if agent:
                    agent.current_timestamp_seconds = raw_seconds
                    agent.current_timestamp = formatted_timestamp
                    logger.info(
                        f"Updated agent current_timestamp to {formatted_timestamp}"
                    )

                    # Check for engagement opportunities at this timestamp
                    asyncio.create_task(
                        agent.check_engagement_opportunities(raw_seconds)
                    )

                    # Log additional context
                    if hasattr(data_packet, "kind"):
                        logger.debug(f"Data packet kind: {data_packet.kind}")
            else:
                # Other message types can be handled separately if needed
                logger.info(f"Received non-timestamp data from {sender}: {message}")
        except Exception as e:
            logger.error(f"Error processing data packet: {e}", exc_info=True)

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
        # agent._before_llm_cb(agent, agent.chat_ctx)

        # Process with LLM
        async def process_message():
            try:
                # Add message to agent's chat context
                agent.chat_ctx.append(role="user", text=cleaned_message)
                agent.chat_ctx.append(
                    role="system", text=f"Current timestamp: {agent.current_timestamp}"
                )
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
