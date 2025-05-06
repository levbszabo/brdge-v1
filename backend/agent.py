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
import traceback  # Import traceback

load_dotenv(dotenv_path=".env_local")
logger = logging.getLogger("voice-agent")
API_BASE_URL = os.getenv("API_BASE_URL")

# Base prompts for different bridge types
BASE_PROMPTS = {
    "course": """
You are the instructor of this online course, speaking directly to a student. Your goal is to teach the material effectively, answer questions clearly, and guide the student through the content based on the video timeline.
Use the provided teaching persona, knowledge base, and video timeline context. Keep responses concise, conversational, and encouraging.
Refer to the video content using the current timestamp. If asked about future topics, indicate they will be covered later. Avoid technical jargon unless necessary and explained.
Remember your TEACHING_PERSONA from the JSON data and embody it. Use KNOWLEDGE_BASE for deeper explanations as if it's your own expertise.
""",
    "vsl": """
You are a persuasive presenter guiding a potential customer through a Video Sales Letter (VSL). Your goal is to highlight the product's benefits, address potential objections, and encourage the customer towards the desired action (e.g., sign up, purchase).
Use the provided persona (likely a sales or product expert), knowledge base (product details, FAQs, use cases), and video timeline.
Sound confident, knowledgeable, and benefit-oriented. Keep responses focused and address user questions or objections directly using the KNOWLEDGE_BASE and QA_PAIRS.
Reference the video content and timestamp naturally. Steer the conversation towards the value proposition and the final call to action.
""",
    "onboarding": """
You are an onboarding specialist guiding a new user through setting up or learning a product/service. Your goal is to provide clear instructions, answer setup questions, and ensure the user understands key features.
Use the provided persona, knowledge base (feature explanations, troubleshooting steps), and video timeline (which likely demonstrates the setup process).
Be patient, clear, and helpful. Refer to specific steps shown in the video using the timestamp. Use the KNOWLEDGE_BASE to answer technical questions accurately.
""",
    "webinar": """
You are hosting a live webinar session. Your goal is to present the information clearly, engage the audience, and answer questions related to the webinar content.
Use the provided presenter persona, knowledge base (background info, related topics), and video timeline (webinar structure/slides).
Maintain an engaging and professional tone. Answer audience questions concisely using the KNOWLEDGE_BASE. Refer to the webinar content using the timestamp.
""",
    "general": """
You are an AI assistant presenting information from a video. Your goal is to provide a helpful and informative experience, answering user questions about the content.
Use the provided persona, knowledge base, and video timeline. Be conversational, clear, and concise.
Reference the video content using the current timestamp. Use the KNOWLEDGE_BASE to provide context or deeper explanations.
""",
}

SYSTEM_PROMPT_SUFFIX = """
# HOW TO RESPOND USING THE DATA BELOW
You have access to the following context in JSON format. Use it to inform your responses:
- `teaching_persona` / `agent_personality`: Adopt this persona in your speaking style.
- `knowledge_base`: Use this for deeper context, facts, and explanations. Refer to it as your own knowledge.
- `qa_pairs`: Use these to answer common questions directly.
- `video_timeline`: Understand where you are in the presentation using `current_timestamp`. Refer to past or future segments based on this timeline.
- `engagement_opportunities`: You may be asked to initiate these based on the timeline.

IMPORTANT:
- Always be aware of the `current_timestamp` provided below.
- NEVER explicitly mention the JSON data, knowledge base, or persona by name. Integrate the information naturally.
- Keep responses conversational, concise, and directly address the user's query or the current context.
- Do NOT act as a generic AI assistant; embody the role defined by the bridge type and persona.

Current Context JSON:
```json
{json_context}
```
"""

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

    def __init__(self, vad, brdge_id: str = None, room: rtc.Room = None):
        self.brdge_id = brdge_id
        self.room = room
        self.api_base_url = API_BASE_URL
        self.bridge_type = "general"  # Default bridge type
        self.personality = ""
        self.knowledge_content = ""
        self.document_knowledge = ""
        self.transcript_read = []
        self.transcript_remaining = []
        self.script = None  # Initialize script properly
        self.agent_personality = {}
        self.teaching_persona = {}
        self.knowledge_base = {}
        self.qa_pairs = []
        self.video_timeline = {}
        self.engagement_opportunities = []
        self.current_position = 0
        self.user_id = None
        self.voice_id = "c99d36f3-5ffd-4253-803a-535c1bc9c306"  # Default voice ID
        self.current_speech = {
            "started_at": None,
            "message": None,
            "was_interrupted": False,
            "log_id": None,  # Ensure log_id is initialized
        }
        self.current_timestamp_seconds = 0
        self.current_timestamp = "00:00:00"
        self.triggered_opportunities = set()
        self.system_prompt = "Initializing..."  # Initial placeholder prompt

        # Initialize agent data immediately
        self.initialize()  # Fetch data and set initial system prompt

        # Now initialize the VoicePipelineAgent with the fetched config
        super().__init__(
            vad=vad,
            stt=deepgram.STT(model="nova-3-general"),
            llm=openai.LLM(model="gpt-4o"),
            tts=cartesia.TTS(
                model="sonic-2", voice=self.voice_id
            ),  # Use fetched voice_id
            chat_ctx=llm.ChatContext().append(
                role="system", text=self.system_prompt
            ),  # Use generated prompt
            interrupt_speech_duration=0.2,
            # No longer need before_llm_cb for simple timestamp update
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
            logger.debug(f"Fetched agent-config: {json.dumps(config_data, indent=2)}")

            # Extract data from the agent-config response
            self.brdge = config_data.get("brdge", {})
            # *** Store bridge_type ***
            self.bridge_type = self.brdge.get("bridge_type", "general")
            logger.info(f"Setting bridge_type to: {self.bridge_type}")

            self.agent_personality = config_data.get("agentPersonality", {})
            self.teaching_persona = config_data.get("teaching_persona", {})
            self.knowledge_base = config_data.get(
                "knowledge_base", {}
            )  # Changed from knowledge_base
            self.qa_pairs = config_data.get("qa_pairs", [])

            # Get timeline data
            self.video_timeline = config_data.get(
                "timeline", config_data.get("video_timeline", {})
            )

            # Extract engagement opportunities
            self.engagement_opportunities = config_data.get(
                "engagement_opportunities", []
            )
            logger.info(
                f"Retrieved {len(self.engagement_opportunities)} engagement opportunities"
            )

            # Set voice ID based on brdge settings
            default_voice = "c99d36f3-5ffd-4253-803a-535c1bc9c306"  # Moved default here
            self.voice_id = self.brdge.get(
                "voice_id", default_voice
            )  # Use default if not found
            if not self.voice_id:  # If voice_id was explicitly null/empty
                self.voice_id = default_voice
            logger.info(f"Using voice_id: {self.voice_id}")

            # Build the initial system prompt based on fetched data
            self.system_prompt = self._build_enhanced_system_prompt()

            # Update TTS voice if Cartesia TTS plugin is used
            if hasattr(self, "tts") and isinstance(self.tts, cartesia.TTS):
                self.tts.update_voice(self.voice_id)
                logger.info(f"Updated Cartesia TTS voice to {self.voice_id}")

            logger.info("Agent initialization data fetched successfully")
            return True

        except Exception as e:
            logger.error(f"Error initializing agent: {e}")
            logger.error(f"Exception details: {traceback.format_exc()}")
            self.system_prompt = BASE_PROMPTS.get(
                "general", "You are a helpful AI assistant."
            )  # Fallback prompt
            return False

    def _build_enhanced_system_prompt(self):
        """Build an enhanced system prompt based on bridge_type and available data."""
        try:
            # Select base instructions based on bridge type
            base_instructions = BASE_PROMPTS.get(
                self.bridge_type, BASE_PROMPTS["general"]
            )

            # Prepare the context JSON, ensuring all expected keys exist even if empty
            context_data = {
                "bridge_type": self.bridge_type,
                "current_timestamp": self.current_timestamp,  # Use the formatted string
                "teaching_persona": (
                    self.teaching_persona if hasattr(self, "teaching_persona") else {}
                ),
                "agent_personality": (
                    self.agent_personality if hasattr(self, "agent_personality") else {}
                ),
                "knowledge_base": (
                    self.knowledge_base if hasattr(self, "knowledge_base") else {}
                ),
                "qa_pairs": self.qa_pairs if hasattr(self, "qa_pairs") else [],
                "video_timeline": (
                    self.video_timeline if hasattr(self, "video_timeline") else {}
                ),
                # Engagement opportunities are handled differently, not usually needed in base prompt
            }

            formatted_json = json.dumps(context_data, indent=2)

            # Combine base instructions and the JSON context suffix
            final_prompt = f"{base_instructions}\n{SYSTEM_PROMPT_SUFFIX.format(json_context=formatted_json)}"

            logger.info(f"Generated system prompt for bridge_type '{self.bridge_type}'")
            # logger.debug(f"System Prompt: {final_prompt}") # Optionally log the full prompt for debugging
            return final_prompt

        except Exception as e:
            logger.error(f"Error building enhanced system prompt: {e}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            # Provide a basic fallback prompt
            return BASE_PROMPTS.get("general", "You are a helpful AI assistant.")

    def _update_chat_context_system_prompt(self):
        """Updates the system prompt in the chat context."""
        new_prompt = self._build_enhanced_system_prompt()
        if hasattr(self, "chat_ctx") and self.chat_ctx and self.chat_ctx.messages:
            self.chat_ctx.messages[0] = llm.ChatMessage.create(
                role="system", text=new_prompt
            )
            logger.info("Updated system prompt in chat context.")
        else:
            # If chat_ctx doesn't exist yet (e.g., called before super().__init__ finishes)
            # store it to be used when super().__init__ runs
            self.system_prompt = new_prompt
            logger.info("Stored updated system prompt for agent initialization.")

    def _setup_event_handlers(self):
        @self.on("agent_started_speaking")
        def on_agent_speaking():
            print("Agent started speaking")
            # Reset current_speech, ensuring log_id is included
            self.current_speech = {
                "started_at": datetime.utcnow(),
                "message": None,
                "was_interrupted": False,
                "log_id": None,  # Initialize log_id
            }
            try:
                viewer_user_id = None
                anonymous_id = None
                user_id_str = str(self.user_id) if self.user_id is not None else None
                if user_id_str:
                    if user_id_str.startswith("anon_"):
                        anonymous_id = user_id_str
                    else:
                        try:
                            viewer_user_id = int(user_id_str)
                        except ValueError:
                            logger.error(f"Invalid user_id format: {self.user_id}")

                if not self.api_base_url or not self.brdge_id:
                    logger.error("API_BASE_URL or brdge_id is not set for usage log")
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
                # *** Store the log_id ***
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
            logger.info(f"Agent speech interrupted: {msg.content}")
            self._finalize_usage_log(msg.content, interrupted=True)
            self._log_conversation(msg.content, role="agent", interrupted=True)
            self._reset_current_speech()

        @self.on("agent_speech_committed")
        def on_agent_speech_completed(msg: llm.ChatMessage):
            logger.info(f"Agent speech completed: {msg.content}")
            self._finalize_usage_log(msg.content, interrupted=False)
            self._log_conversation(msg.content, role="agent", interrupted=False)
            self._reset_current_speech()

        @self.on("user_speech_committed")
        def on_user_speech_completed(msg: llm.ChatMessage):
            logger.info(f"User speech completed: {msg.content}")
            # Only log conversation here, not usage log
            self._log_conversation(msg.content, role="user", interrupted=False)

    def _finalize_usage_log(self, message_content: str, interrupted: bool):
        """Helper to update the usage log."""
        if self.current_speech.get("started_at") and self.current_speech.get("log_id"):
            ended_at = datetime.utcnow()
            duration_seconds = (
                ended_at - self.current_speech["started_at"]
            ).total_seconds()
            duration_minutes = duration_seconds / 60.0
            log_id = self.current_speech["log_id"]
            try:
                response = requests.put(
                    f"{self.api_base_url}/brdges/{self.brdge_id}/usage-logs/{log_id}",
                    json={
                        "ended_at": ended_at.isoformat(),
                        "duration_minutes": round(duration_minutes, 2),
                        "was_interrupted": interrupted,
                        "agent_message": message_content,
                    },
                )
                response.raise_for_status()
                logger.info(
                    f"Updated usage log {log_id} with {'interruption' if interrupted else 'completion'}"
                )
            except requests.exceptions.RequestException as e:
                logger.error(f"HTTP Error updating usage log {log_id}: {e}")
            except Exception as e:
                logger.error(f"Error updating usage log {log_id}: {e}")

    def _log_conversation(self, message_content: str, role: str, interrupted: bool):
        """Helper to log conversation turns."""
        duration_seconds = 0
        # Calculate duration only if it's agent speech ending/interrupted
        if role == "agent" and self.current_speech.get("started_at"):
            duration_seconds = (
                datetime.utcnow() - self.current_speech["started_at"]
            ).total_seconds()

        try:
            viewer_user_id = None
            anonymous_id = None
            user_id_str = str(self.user_id) if self.user_id is not None else None
            if user_id_str:
                if user_id_str.startswith("anon_"):
                    anonymous_id = user_id_str
                else:
                    try:
                        viewer_user_id = int(user_id_str)
                    except ValueError:
                        logger.error(f"Invalid user_id format: {self.user_id}")

            # Convert seconds to minutes before sending
            duration_minutes = duration_seconds / 60.0

            response = requests.post(
                f"{self.api_base_url}/brdges/{self.brdge_id}/conversation-logs",
                json={
                    "brdge_id": self.brdge_id,
                    "viewer_user_id": viewer_user_id,
                    "anonymous_id": anonymous_id,
                    "role": role,
                    "message": message_content,
                    "timestamp": datetime.utcnow().isoformat(),
                    "was_interrupted": interrupted,
                    "duration_seconds": round(
                        duration_minutes, 2
                    ),  # We're sending minutes now, but keeping the field name
                },
            )
            response.raise_for_status()  # Raise exception for bad status codes
        except requests.exceptions.RequestException as e:
            logger.error(f"HTTP Error creating conversation log: {e}")
        except Exception as e:
            logger.error(f"Error creating conversation log: {e}")

    def _reset_current_speech(self):
        """Resets the state tracking the current speech segment."""
        self.current_speech = {
            "started_at": None,
            "message": None,
            "was_interrupted": False,
            "log_id": None,
        }

    # ... (interrupt method remains the same) ...

    async def check_engagement_opportunities(self, current_time_seconds):
        """Check if there are any engagement opportunities near the current timestamp"""
        if (
            not hasattr(self, "engagement_opportunities")
            or not self.engagement_opportunities
        ):
            # logger.info("No engagement opportunities available to check")
            return False

        threshold = 1.0  # 1 second proximity

        for opportunity in self.engagement_opportunities:
            try:
                opp_timestamp_str = opportunity.get("timestamp", "00:00:00")
                h, m, s = map(int, opp_timestamp_str.split(":"))
                opp_time_seconds = h * 3600 + m * 60 + s

                if abs(current_time_seconds - opp_time_seconds) <= threshold:
                    opp_id = opportunity.get("id")
                    if opp_id in self.triggered_opportunities:
                        # logger.info(f"Opportunity {opp_id} already triggered, skipping")
                        continue  # Check next opportunity

                    logger.info(
                        f"Found engagement opportunity {opp_id} at {opp_timestamp_str}"
                    )
                    await self.trigger_engagement_opportunity(opportunity)
                    self.triggered_opportunities.add(opp_id)
                    return True  # Triggered one, stop checking for this timestamp
            except Exception as e:
                logger.error(
                    f"Error checking opportunity {opportunity.get('id', 'N/A')}: {e}"
                )

        return False

    async def trigger_engagement_opportunity(self, opportunity):
        """Present an engagement opportunity to the user"""
        try:
            engagement_type = opportunity.get("engagement_type", "")
            concepts = opportunity.get("concepts_addressed", [])
            logger.info(
                f"Triggering {engagement_type} engagement about {', '.join(concepts)}"
            )

            # 1. Pause the video via RPC
            try:
                if self.room and self.room.local_participant:
                    remote_participants = list(
                        self.room.remote_participants.values()
                    )  # Get list
                    logger.info(
                        f"Found {len(remote_participants)} remote participants to pause"
                    )
                    pause_command = json.dumps(
                        {
                            "action": "pause",
                            "reason": "engagement",
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    )
                    tasks = []
                    for participant in remote_participants:
                        logger.info(f"Sending pause RPC to {participant.identity}")
                        tasks.append(
                            self.room.local_participant.perform_rpc(
                                destination_identity=participant.identity,
                                method="controlVideoPlayer",
                                payload=pause_command,
                                response_timeout=3.0,  # Shorter timeout
                            )
                        )
                    # Wait for all RPC calls to complete (or timeout)
                    results = await asyncio.gather(*tasks, return_exceptions=True)
                    for i, result in enumerate(results):
                        if isinstance(result, Exception):
                            logger.error(
                                f"Error calling RPC for participant {remote_participants[i].identity}: {result}"
                            )
                        else:
                            logger.info(
                                f"RPC response from {remote_participants[i].identity}: {result}"
                            )
                else:
                    logger.warning(
                        "Cannot pause video: room or local participant not available"
                    )
            except Exception as e:
                logger.error(
                    f"Error pausing video via RPC: {e}\n{traceback.format_exc()}"
                )

            # 2. Interrupt any current agent speech
            self.interrupt(interrupt_all=True)
            await asyncio.sleep(0.1)  # Small delay

            # 3. Prepare engagement prompt and guiding context
            initial_prompt = ""
            system_context_for_next_turn = (
                ""  # Context to guide processing of user's *next* input
            )

            if engagement_type == "quiz":
                quiz_item = opportunity.get("quiz_items", [{}])[0]
                question = quiz_item.get("question", "What do you think?")
                options = quiz_item.get("options", [])
                correct_option = quiz_item.get("correct_option")
                explanation = quiz_item.get("explanation", "")
                if_correct = quiz_item.get("follow_up", {}).get(
                    "if_correct", "That's correct!"
                )
                if_incorrect = quiz_item.get("follow_up", {}).get(
                    "if_incorrect", "Not quite."
                )

                initial_prompt = f"{question}"
                if options:
                    initial_prompt += "\nOptions: " + ", ".join(options)

                # Guide LLM on how to evaluate the *next* user response
                system_context_for_next_turn = f"""
You are currently in QUIZ mode. You just asked: "{question}" {'Options: ' + ', '.join(options) if options else ''}
Listen to the user's upcoming answer.
- If they choose '{correct_option}' or similar, your response should convey: "{if_correct}"
- Otherwise, your response should convey: "{if_incorrect}"
- You can optionally add this explanation: "{explanation}"
Generate a natural response based on their answer and these instructions, then return to the normal {self.bridge_type} flow.
"""

            elif engagement_type == "discussion":
                quiz_item = opportunity.get("quiz_items", [{}])[0]
                question = quiz_item.get("question", "Let's discuss:")
                expected_answer = quiz_item.get("expected_answer", "")
                if_correct = quiz_item.get("follow_up", {}).get(
                    "if_correct", "Interesting point!"
                )
                if_incorrect = quiz_item.get("follow_up", {}).get(
                    "if_incorrect", "Let's think a bit more about..."
                )

                initial_prompt = question
                # Guide LLM on how to evaluate the *next* user response
                system_context_for_next_turn = f"""
You are currently in DISCUSSION mode. You just asked: "{question}"
Listen to the user's upcoming response.
- If they mention ideas related to '{expected_answer}', your goal is to respond positively, conveying: "{if_correct}"
- If their response seems brief or off-topic, your goal is to prompt further thought, conveying: "{if_incorrect}"
Generate a natural response guiding the discussion based on their input. Keep it brief (1 follow-up turn), then return to the normal {self.bridge_type} flow.
"""
            elif engagement_type == "guided_conversation":
                convo_flow = opportunity.get("conversation_flow")
                if convo_flow:
                    initial_prompt = convo_flow.get(
                        "agent_initiator", "Let's talk about something."
                    )
                    goal = convo_flow.get("goal", "Have a guided conversation.")
                    fallback = convo_flow.get("fallback", "Okay, let's move on.")
                    # *** Rephrase fallback as an instruction/goal ***
                    fallback_intent = f"Your goal is to gently move the conversation forward, conveying: {fallback}"

                    # *** Rephrase strategies as instructions/goals ***
                    responses_guide_intent_list = []
                    for resp in convo_flow.get("user_responses", []):
                        response_type = resp.get("type", "unknown")
                        # Use the strategy text as the *instruction* for the LLM's goal
                        strategy_instruction = resp.get(
                            "agent_followup_strategy", "Continue the conversation."
                        )
                        intent_line = f"- If the user's response indicates '{response_type}', your goal is to: {strategy_instruction}."
                        responses_guide_intent_list.append(intent_line)
                    responses_guide_intent = "\n".join(responses_guide_intent_list)

                    # This context guides the LLM on how to process the *next* user input
                    system_context_for_next_turn = f"""
You are currently in a GUIDED CONVERSATION engagement. Your overall goal for this interaction is: {goal}.
You just initiated by asking the user: "{initial_prompt}"

Now, listen carefully to the user's upcoming response. Analyze it based on the following guidelines:
{responses_guide_intent}

If the response doesn't clearly fit any defined type, use the fallback approach: {fallback_intent}

Generate a natural, conversational follow-up that achieves the goal of the matched path's instruction (or the fallback). Maintain your {self.bridge_type} persona. After delivering this single follow-up response, you should return to the normal interaction flow.
"""
                else:
                    # Fallback if convo_flow is missing
                    logger.warning(
                        f"Guided conversation {opportunity.get('id')} missing 'conversation_flow'."
                    )
                    initial_prompt = "Let's discuss this..."
                    system_context_for_next_turn = (
                        "Handle the user response briefly and return to the main flow."
                    )
            else:
                # Fallback for unknown types
                logger.warning(
                    f"Unknown engagement type: {engagement_type}, using default prompt"
                )
                initial_prompt = opportunity.get("quiz_items", [{}])[0].get(
                    "question", "What are your thoughts on this?"
                )  # Assumes quiz_items might exist
                system_context_for_next_turn = "Engage the user briefly about the current topic, then return to the main flow."

            # 4. Speak the initial prompt FIRST
            if initial_prompt:
                logger.info(f"Speaking engagement initiator: {initial_prompt}")
                await self.say(initial_prompt, allow_interruptions=True)
                # Optional brief pause allows user to potentially interrupt or TTS to catch up
                await asyncio.sleep(0.2)
            else:
                logger.warning("No initial prompt generated for engagement.")

            # 5. Now, add the system context to guide the processing of the user's *response*
            if system_context_for_next_turn:
                self.chat_ctx.append(role="system", text=system_context_for_next_turn)
                logger.info(
                    f"Added engagement context for next user turn (Type: {engagement_type})"
                )

            # Agent now waits for user input...

        except Exception as e:
            logger.error(
                f"Error triggering engagement opportunity: {e}\n{traceback.format_exc()}"
            )

    async def process_user_input(self, text: str):
        """Processes user text input (from chat or STT)"""
        logger.info(f"Processing user input: {text}")
        self.chat_ctx.append(role="user", text=text)

        # Add current timestamp context BEFORE the LLM call
        self.chat_ctx.append(
            role="system", text=f"Current video timestamp: {self.current_timestamp}"
        )
        logger.debug(
            f"Appended timestamp {self.current_timestamp} to chat context for LLM."
        )

        # Check if the previous system message was an engagement guide
        is_engagement_follow_up = False
        if len(self.chat_ctx.messages) >= 3:
            # The engagement context would be the message before the user's input & the timestamp message
            if self.chat_ctx.messages[-3].role == "system" and (
                "You are currently in QUIZ mode." in self.chat_ctx.messages[-3].content
                or "You are currently in DISCUSSION mode."
                in self.chat_ctx.messages[-3].content
                or "You are currently in a GUIDED CONVERSATION engagement."
                in self.chat_ctx.messages[-3].content
            ):
                is_engagement_follow_up = True
                logger.info("Processing user response to an engagement prompt.")

        try:
            # Get response stream from LLM
            # The LLM will use the chat context, including the temporary engagement guide if present
            stream = self.llm.chat(
                chat_ctx=self.chat_ctx,
                fnc_ctx=self.fnc_ctx,  # Include function context if using tools
            )

            # Speak the response stream
            await self.say(stream, allow_interruptions=True)

        except Exception as e:
            logger.error(
                f"Error during LLM processing or TTS: {e}\n{traceback.format_exc()}"
            )
            await self.say(
                "Sorry, I encountered an issue. Could you please repeat that?",
                allow_interruptions=False,
            )
        finally:  # Use finally to ensure context cleanup happens even if say() fails
            # Remove the temporary timestamp message we added for this turn
            if (
                self.chat_ctx.messages
                and self.chat_ctx.messages[-1].role == "system"
                and "Current video timestamp:" in self.chat_ctx.messages[-1].content
            ):
                self.chat_ctx.messages.pop()
                logger.debug("Removed temporary timestamp system message.")

            # If this was a follow-up to an engagement, remove the engagement system context as well
            if is_engagement_follow_up:
                # It should be the last message now after popping the timestamp
                if (
                    self.chat_ctx.messages
                    and self.chat_ctx.messages[-1].role == "system"
                    and (
                        "You are currently in QUIZ mode."
                        in self.chat_ctx.messages[-1].content
                        or "You are currently in DISCUSSION mode."
                        in self.chat_ctx.messages[-1].content
                        or "You are currently in a GUIDED CONVERSATION engagement."
                        in self.chat_ctx.messages[-1].content
                    )
                ):
                    self.chat_ctx.messages.pop()
                    logger.info("Removed engagement system context after follow-up.")
                else:
                    # This indicates a logic error or unexpected context state
                    logger.warning(
                        "Expected engagement system context at end of messages after follow-up, but not found. Context might be incorrect."
                    )


async def entrypoint(ctx: JobContext):
    logger.info("Entrypoint started")
    await ctx.connect()

    participant = await ctx.wait_for_participant()
    logger.info(f"Starting assistant for participant {participant.identity}")
    logger.info(f"Full participant identity: {participant.identity}")

    # Extract user_id and brdge_id
    user_id = None
    brdge_id = None
    try:
        identity_parts = participant.identity.split("-")
        logger.info(f"Identity parts: {identity_parts}")
        if len(identity_parts) >= 3:
            brdge_id = identity_parts[1]
            user_id = identity_parts[2]
            logger.info(f"Extracted brdge_id: {brdge_id}, user_id: {user_id}")
        elif len(identity_parts) >= 2:
            brdge_id = identity_parts[1]
            logger.info(f"Extracted brdge_id: {brdge_id}, no user_id found")
        else:
            logger.warning(
                f"Could not parse brdge_id from identity: {participant.identity}"
            )
            # Attempt to get brdge_id from room metadata if available
            try:
                metadata = json.loads(ctx.room.metadata or "{}")
                brdge_id = metadata.get("brdge_id")
                logger.info(f"Extracted brdge_id from room metadata: {brdge_id}")
            except Exception as meta_e:
                logger.error(f"Could not get brdge_id from metadata: {meta_e}")

        if not brdge_id:
            logger.error("Failed to determine brdge_id. Aborting agent.")
            return  # Cannot proceed without brdge_id

    except Exception as e:
        logger.error(f"Error parsing participant identity: {e}")
        return

    # Get VAD model
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
        return  # Cannot proceed without VAD

    # *** Pass ctx.room to ChatAssistant constructor ***
    agent = ChatAssistant(vad=vad, brdge_id=brdge_id, room=ctx.room)
    agent.user_id = user_id
    logger.info(f"Set agent.user_id to: {user_id}")

    chat = rtc.ChatManager(ctx.room)

    @ctx.room.on("data_received")
    def on_data_received(data_packet: rtc.DataPacket):
        """Handle incoming data channel message."""
        sender = (
            data_packet.participant.identity if data_packet.participant else "server"
        )
        topic = getattr(data_packet, "topic", "unknown")
        # logger.debug(f"Received data packet from {sender} on topic: {topic}") # Less verbose logging

        try:
            message_str = data_packet.data.decode("utf-8")
            message = json.loads(message_str)

            if topic == "agent-control" and message.get("type") == "interrupt":
                logger.info(f"Received interrupt command from {sender}")
                if agent:
                    agent.interrupt(interrupt_all=True)

            elif (
                topic == "video-timestamp"
                and message.get("type") == "timestamp"
                and "time" in message
            ):
                raw_seconds = message["time"]
                hours = int(raw_seconds // 3600)
                minutes = int((raw_seconds % 3600) // 60)
                seconds = int(raw_seconds % 60)
                formatted_timestamp = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

                # logger.debug(f"Received timestamp: {raw_seconds}s -> {formatted_timestamp}") # Less verbose

                if agent:
                    # Only update if the timestamp has actually changed significantly
                    if abs(agent.current_timestamp_seconds - raw_seconds) > 0.1:
                        agent.current_timestamp_seconds = raw_seconds
                        agent.current_timestamp = formatted_timestamp
                        # Update the system prompt in the context *only when timestamp changes*
                        agent._update_chat_context_system_prompt()
                        # Check for engagements asynchronously
                        asyncio.create_task(
                            agent.check_engagement_opportunities(raw_seconds)
                        )

            # else: logger.info(f"Received other data from {sender} on {topic}: {message}")
        except json.JSONDecodeError:
            logger.error(f"Failed to decode JSON from data packet: {message_str}")
        except Exception as e:
            logger.error(f"Error processing data packet: {e}\n{traceback.format_exc()}")

    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        if not agent:
            logger.warning("Agent not initialized, cannot process chat message")
            return

        cleaned_message = " ".join(msg.message.split()).strip()
        if not cleaned_message:
            return

        logger.info(f"Received chat message: {cleaned_message}")
        agent.interrupt(interrupt_all=True)  # Interrupt agent before processing
        # Log conversation turn
        agent._log_conversation(cleaned_message, role="user", interrupted=False)
        # Process the message using the refactored method
        asyncio.create_task(agent.process_user_input(cleaned_message))

    # Start the agent pipeline
    agent.start(ctx.room, participant)
    logger.info(f"Agent started for brdge {brdge_id}, type {agent.bridge_type}")

    # Keep the connection alive
    disconnect_event = asyncio.Event()

    @ctx.room.on("disconnected")
    def on_disconnect(*args):
        logger.info("Room disconnected")
        disconnect_event.set()

    try:
        await disconnect_event.wait()
    finally:
        logger.info("Cleaning up agent...")
        await agent.aclose()  # Ensure agent resources are cleaned up


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
