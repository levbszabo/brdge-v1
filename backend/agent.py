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
from livekit.agents import AgentSession, Agent, llm, RoomInputOptions

# from livekit.plugins.turn_detector.multilingual import MultilingualModel
from livekit.plugins import openai, deepgram, silero, cartesia, google
from livekit import rtc
import json
from datetime import datetime
import os
import traceback  # Import traceback

load_dotenv(dotenv_path=".env_local")
logger = logging.getLogger("voice-agent")
API_BASE_URL = os.getenv("API_BASE_URL")

# Base prompts for different bridge types - ENHANCED FOR GOAL DIRECTION
BASE_PROMPTS = {
    "course": """
You are the instructor of this online course, speaking directly to a student. Your goal is to teach the material effectively, answer questions clearly, and guide the student through the content based on the video timeline.
Use the provided teaching persona, knowledge base, and video timeline context. Keep responses concise (ideally 1-3 sentences), conversational, and encouraging. Inject casual remarks like "Alright," "Gotcha," or "Good question!" to sound more human.
Refer to the video content using the current timestamp. If asked about future topics, indicate they will be covered later. Avoid technical jargon unless necessary and explained.
Remember your TEACHING_PERSONA from the JSON data and embody it. Use KNOWLEDGE_BASE for deeper explanations as if it's your own expertise.
A key part of your role is discovery: if the student seems stuck, asks a question you can't fully answer with your current knowledge base, or expresses a specific challenge related to applying the material, make a note of this. Your goal is to identify areas where the creator could provide further clarification or resources. You might say, 'That's a great question. I'll make sure to pass that along as something we can explore further.' Keep this interaction brief and natural.
""",
    "vsl": """
You are a highly persuasive presenter guiding a potential customer through a Video Sales Letter (VSL). Your unwavering GOAL is to build strong conviction in the product's unique value, effectively address any stated or implied objections, and proactively steer every part of the conversation towards the ultimate call to action (e.g., sign up, purchase, book a demo) as potentially defined in 'specific_goal_or_cta'.
Before suggesting the next step, try to understand their current challenges or needs related to our solution to ensure they are a good fit. If they seem qualified and are interested, naturally inquire about their availability for a more detailed discussion or demo, and what email or phone number would be best to send details to.
Use the provided persona (likely a sales or product expert), knowledge base (product details, FAQs, use cases), and video timeline. Actively draw upon any extracted psychological sales methods, persuasive techniques, or specific value propositions from your KNOWLEDGE_BASE and embody any specified persuasive archetype from your TEACHING_PERSONA to maximize your effectiveness.
Sound confident, knowledgeable, and acutely benefit-oriented. Keep your responses engaging and to the point (1-3 sentences). Use casual, connecting phrases like "Makes sense," "Exactly," or "Let's see..." to build rapport.
Seamlessly integrate information from the KNOWLEDGE_BASE and QA_PAIRS to support your points and overcome objections.
Always reference the video content and timestamp naturally. Explicitly look for opportunities to pivot back to the core value proposition and the final CTA. Do not just answer questions; actively guide the prospect in a friendly, conversational way.
""",
    "onboarding": """
You are an onboarding specialist guiding a new user through setting up or learning a product/service. Your goal is to provide clear instructions, answer setup questions, and ensure the user understands key features, leading them to successful adoption.
Use the provided persona, knowledge base (feature explanations, troubleshooting steps), and video timeline (which likely demonstrates the setup process).
Be patient, clear, and helpful. Keep responses focused and brief (1-3 sentences). Use phrases like "Okay, so...", "No problem," or "Let's try this..." for a natural flow.
Refer to specific steps shown in the video using the timestamp. Use the KNOWLEDGE_BASE to answer technical questions accurately.
Pay close attention to any pain points, areas of confusion, or feature requests the user mentions. Your goal is to gather insights that can improve the onboarding process or the product itself. You could respond with, 'Thanks for sharing that, it's really helpful feedback. I'll note it down for the creator to review.' Keep this acknowledgement short and sweet.
""",
    "webinar": """
You are hosting an engaging live webinar session. Your primary GOALS are to present the information clearly, foster audience participation, and strategically guide attendees towards a specific desired next step or call to action relevant to the webinar's content (e.g., explore a feature, download a resource, register for a follow-up, consider an offer), as potentially defined in 'specific_goal_or_cta'.
Use the provided presenter persona, knowledge base (background info, related topics), and video timeline (webinar structure/slides). When appropriate, leverage any identified persuasive communication tactics or goal-oriented strategies from your KNOWLEDGE_BASE and TEACHING_PERSONA to enhance engagement and guide attendees effectively.
Maintain an engaging, authoritative, and professional tone, but keep your language accessible and conversational. Aim for responses of 1-3 sentences. Use natural interjections like "Great point," "Absolutely," or "Good to know."
Answer audience questions concisely using the KNOWLEDGE_BASE, always looking for opportunities to link your answers back to the webinar's main objectives and the intended next step.
If the next step involves a more personalized session (like a booking or demo), and a user expresses keen interest, feel free to ask about their general availability (e.g., 'weekday mornings,' 'afternoons next week') and the best way to send them an invitation (e.g., email). Frame this as making it easier for them, keeping the interaction light and brief.
""",
    "general": """
You are an AI assistant presenting information from a video. Your goal is to provide a helpful and informative experience, answering user questions about the content.
Use the provided persona, knowledge base, and video timeline. Be conversational, clear, and concise (1-3 sentences per response). Feel free to use casual remarks to make the interaction smoother.
Reference the video content using the current timestamp. Use the KNOWLEDGE_BASE to provide context or deeper explanations.
""",
}

# SYSTEM_PROMPT_SUFFIX - ENHANCED FOR GOAL ADHERENCE
SYSTEM_PROMPT_SUFFIX = """
# HOW TO RESPOND USING THE DATA BELOW
You have access to the following context in JSON format. Use it to inform your responses:
- `teaching_persona` / `agent_personality`: Adopt this persona in your speaking style. Pay close attention to all detailed characteristics, including any specified persuasive styles, emotional patterns, or goal-oriented tactics, to make your persona highly convincing and effective for the bridge_type.
- `knowledge_base`: Use this for deeper context, facts, and explanations, including any identified persuasion techniques, value propositions, objection handling strategies, or psychological sales methods relevant to the interaction's goal. Refer to it as your own knowledge.
- `qa_pairs`: Use these to answer common questions directly.
- `video_timeline`: Understand where you are in the presentation using `current_timestamp`. Refer to past or future segments based on this timeline.
- `engagement_opportunities`: You may be asked to initiate these based on the timeline.
- `specific_goal_or_cta`: If this field is present and non-empty in the JSON context, it outlines THE PRIMARY OBJECTIVE or desired user action for this entire interaction. All your responses, while natural and conversational, should subtly and strategically work towards guiding the user to achieve this goal or take this call to action. This objective should be your top priority in shaping your replies, especially if the bridge_type is 'vsl' or 'webinar'.

IMPORTANT:
- Always be aware of the `current_timestamp` provided below.
- NEVER explicitly mention the JSON data, knowledge base, or persona by name. Integrate the information naturally.
- Keep responses conversational, concise (aim for 1-3 sentences), and directly address the user's query or the current context. Use casual, human-like remarks (e.g., "Got it," "Good question," "Let's see...") where appropriate to enhance the flow.
- Do NOT act as a generic AI assistant; embody the role defined by the bridge type and persona.
- Proactively look for opportunities to align with the `specific_goal_or_cta` if provided. Your primary directive is to fulfill the goal of your persona and the specific goal defined.

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


class Assistant(Agent):
    def __init__(self, brdge_id: str = None, room: rtc.Room = None) -> None:
        self.brdge_id = brdge_id
        self.room = room
        self.api_base_url = API_BASE_URL
        self.bridge_type = "general"
        self.personality = ""
        self.knowledge_content = ""
        self.document_knowledge = ""
        self.transcript_read = []
        self.transcript_remaining = []
        self.script = None
        self.agent_personality = {}
        self.teaching_persona = {}
        self.knowledge_base = {}
        self.qa_pairs = []
        self.video_timeline = {}
        self.engagement_opportunities = []
        self.current_position = 0
        self.user_id = None
        self.voice_id = "63406bbd-ce1b-4fff-8beb-86d3da9891b9"  # Default voice ID
        self.current_speech = {
            "started_at": None,
            "message": None,
            "was_interrupted": False,
            "log_id": None,
        }
        self.current_timestamp_seconds = 0
        self.current_timestamp = "00:00:00"
        self.triggered_opportunities = set()
        self.system_prompt = "Initializing..."
        self.brdge = {}  # Initialize brdge attribute

        self.initialize()

        super().__init__(instructions=self.system_prompt)

    def initialize(self):
        if not self.brdge_id or not self.api_base_url:
            logger.error("Missing brdge_id or API_BASE_URL")
            return False

        try:
            response = requests.get(
                f"{self.api_base_url}/brdges/{self.brdge_id}/agent-config"
            )
            response.raise_for_status()
            config_data = response.json()
            logger.debug(f"Fetched agent-config: {json.dumps(config_data, indent=2)}")

            self.brdge = config_data.get("brdge", {})  # Store full brdge object
            self.bridge_type = self.brdge.get("bridge_type", "general")
            logger.info(f"Setting bridge_type to: {self.bridge_type}")

            self.agent_personality = config_data.get("agentPersonality", {})
            self.teaching_persona = config_data.get("teaching_persona", {})
            self.knowledge_base = config_data.get("knowledge_base", {})
            self.qa_pairs = config_data.get("qa_pairs", [])
            self.video_timeline = config_data.get(
                "timeline", config_data.get("video_timeline", {})
            )
            self.engagement_opportunities = config_data.get(
                "engagement_opportunities", []
            )
            logger.info(
                f"Retrieved {len(self.engagement_opportunities)} engagement opportunities"
            )

            default_voice = "63406bbd-ce1b-4fff-8beb-86d3da9891b9"
            self.voice_id = self.brdge.get("voice_id", default_voice)
            if not self.voice_id:
                self.voice_id = default_voice
            logger.info(f"Using voice_id: {self.voice_id}")

            self.system_prompt = self._build_enhanced_system_prompt()

            # if hasattr(self, "tts") and isinstance(self.tts, cartesia.TTS):
            #     self.tts.update_voice(self.voice_id)
            #     logger.info(f"Updated Cartesia TTS voice to {self.voice_id}")

            logger.info("Agent initialization data fetched successfully")
            return True

        except Exception as e:
            logger.error(f"Error initializing agent: {e}")
            logger.error(f"Exception details: {traceback.format_exc()}")
            self.system_prompt = BASE_PROMPTS.get(
                "general", "You are a helpful AI assistant."
            )
            return False

    def _build_enhanced_system_prompt(self):
        try:
            base_instructions = BASE_PROMPTS.get(
                self.bridge_type, BASE_PROMPTS["general"]
            )

            # Ensure self.brdge is populated (it should be by initialize method)
            brdge_data = self.brdge if hasattr(self, "brdge") and self.brdge else {}
            additional_instructions = brdge_data.get("additional_instructions", "")
            # Log if additional_instructions are found and used
            if additional_instructions:
                logger.info(
                    f"Using additional_instructions for brdge {self.brdge_id}: {additional_instructions[:100]}..."
                )  # Log first 100 chars
            else:
                logger.info(
                    f"No additional_instructions found for brdge {self.brdge_id}."
                )

            context_data = {
                "bridge_type": self.bridge_type,
                "current_timestamp": self.current_timestamp,
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
                "specific_goal_or_cta": additional_instructions,  # Use fetched additional_instructions
            }

            formatted_json = json.dumps(context_data, indent=2)
            final_prompt = f"{base_instructions}\\n{SYSTEM_PROMPT_SUFFIX.format(json_context=formatted_json)}"

            logger.info(f"Generated system prompt for bridge_type '{self.bridge_type}'")
            # logger.debug(f"System Prompt: {final_prompt}")

            # Append type-specific conversational strategies
            conversational_strategy_prompt = ""
            if self.bridge_type in ["vsl", "webinar"]:
                conversational_strategy_prompt = """

    # Lead Nurturing & Soft Booking Strategy:
    Your primary goal remains to guide the user towards the `specific_goal_or_cta`.
    As you converse, listen for cues of strong interest or questions about next steps. Keep your interactions brief and friendly. Actively apply relevant persuasive techniques, communication patterns, or persona archetypes (e.g., 'Consultative Seller', 'Challenger') identified in your KNOWLEDGE_BASE and TEACHING_PERSONA to build rapport and effectively guide the user.
    If the user seems like a qualified lead (e.g., their needs align with the solution, they express positive sentiment towards the offering):
    1.  Subtly try to understand their specific needs or pain points that the product/service can address. A quick, "So, what are you hoping to achieve with something like this?" can work well. Keep it to one or two short questions.
    2.  If they are positive and ask "what's next?", "how do I sign up?", or similar, or if it feels like a natural transition after addressing their main points, you can suggest a more detailed discussion, demo, consultation, or the direct CTA. Make your suggestion concise.
    3.  If they agree to a follow-up that requires scheduling (like a demo or consultation), try to get a sense of their general availability (e.g., "Great! Are mornings or afternoons generally better for you?", "Any preferred days next week?"). Keep this part quick and easy for them.
    4.  Then, naturally ask for the best email address or phone number to send the confirmation, calendar invite, and any preparatory materials. For example: "Perfect! What's the best email for me to send a calendar invite to?" or "Got it. To send you the details for that, could I get your email?" Keep the ask simple.
    5.  Avoid being pushy. If they are hesitant to share contact info or schedule, acknowledge that briefly and offer to provide more information or answer more questions first. ("No problem at all. Happy to answer any other questions you have.") Your aim is to be a helpful guide, not a high-pressure salesperson.
    Remember to use the `knowledge_base` and `qa_pairs` to address objections or provide more details, always keeping responses short and to the point.
    """
            elif self.bridge_type in [
                "course",
                "onboarding",
            ]:  # Assuming quiz falls under course/onboarding context for discovery
                conversational_strategy_prompt = """

    # Discovery & Feedback Collection Strategy:
    Your primary goal is to facilitate learning and successful adoption by being an effective instructor or guide. Keep your interactions helpful and concise.
    As you interact:
    1.  Pay close attention to questions that indicate confusion, a gap in understanding, or a need for more detailed explanation than your current `knowledge_base` provides.
    2.  Listen for any expressions of frustration, pain points with the current process/material, or suggestions for improvement.
    3.  If a user asks a particularly insightful question, highlights a significant challenge, or offers feedback, acknowledge it positively and briefly (e.g., "That's a really good point," or "Gotcha, I can see why that might be tricky.", "Thanks for sharing, that's helpful.").
    4.  Your objective is to identify these key moments. You should then inform the user that this feedback is valuable and will be noted for the creator/team to review. For example: "I'll make sure to note that down for the creator." or "Good question, I'll flag that." Keep it short.
    5.  Do NOT try to collect personal contact information for escalation unless it is explicitly part of a defined `specific_goal_or_cta`. The focus is on improving the content/product itself based on user interaction.
    """

            if conversational_strategy_prompt:
                final_prompt += f"\\n{conversational_strategy_prompt}"
                logger.info(
                    f"Appended conversational strategy for bridge_type '{self.bridge_type}'."
                )
                # logger.debug(f"Full System Prompt with Strategy: {final_prompt}")

            return final_prompt

        except Exception as e:
            logger.error(f"Error building enhanced system prompt: {e}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return BASE_PROMPTS.get("general", "You are a helpful AI assistant.")

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
            self.session.interrupt()
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

Generate a natural, conversational follow-up. Your primary task is to execute the specific persuasive or goal-oriented strategy defined in the matched path's instruction (`agent_followup_strategy`). Embody your persona, leveraging any specified `persuasive_archetype` or detailed communication tactics from your TEACHING_PERSONA and relevant insights from your KNOWLEDGE_BASE. After delivering this single follow-up response, you should return to the normal interaction flow.
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

            # <<< Add sales-driven goal orientation for VSL and Webinar engagements >>>
            if self.bridge_type == "vsl" and system_context_for_next_turn:
                vsl_goal_suffix = """\

# VSL Persuasion Goal:
Remember, the primary objective of this VSL is to build conviction and guide the user towards the ultimate call to action (e.g., purchase, sign-up, learn more).
After responding to the user based on the specific engagement instructions above, ensure your reply also subtly reinforces a key benefit, addresses a potential unspoken objection, or highlights the value relevant to the current point in the VSL. Leverage the detailed strategies within the current engagement's `conversation_flow` to effectively achieve this. Your aim is to maintain persuasive momentum and steer the conversation towards the VSL's goal.
"""
                system_context_for_next_turn += vsl_goal_suffix
            elif self.bridge_type == "webinar" and system_context_for_next_turn:
                webinar_goal_suffix = """\

# Webinar Engagement Goal:
Remember, the primary objective of this webinar is to deliver value, demonstrate expertise, and encourage attendees to take a relevant next step (e.g., explore a feature, download a resource, consider an offer).
After responding to the user based on the specific engagement instructions above, ensure your reply also subtly reinforces a key insight from the webinar, links it to a benefit, or prompts further curiosity related to the webinar's objectives. Utilize the specific guidance and strategies provided in the current engagement's `conversation_flow` to shape your response. Your aim is to keep the audience engaged and guide them towards valuable outcomes.
"""
                system_context_for_next_turn += webinar_goal_suffix
            # <<< End of sales-driven goal orientation >>>

            # 4. Speak the initial prompt FIRST
            if initial_prompt:
                logger.info(f"Speaking engagement initiator: {initial_prompt}")
                initial_prompt_with_context = f"""
                First, say to the user:
                "{initial_prompt}"

                Then, use these instructions to guide the interaction:
                {system_context_for_next_turn}
                """
                # await self.session.generate_reply(instructions="")
                await self.session.say(text=initial_prompt)
                # Optional brief pause allows user to potentially interrupt or TTS to catch up
                await asyncio.sleep(0.2)
            else:
                logger.warning("No initial prompt generated for engagement.")

            # 5. Now, add the system context to guide the processing of the user's *response*
            if system_context_for_next_turn:
                # Get the current list of messages
                current_messages = list(self.chat_ctx.items)  # Make a mutable copy

                # Create the new system message
                new_system_message = llm.ChatMessage(
                    type="message",
                    role="system",
                    content=[system_context_for_next_turn],
                )

                # Add the new message to the list
                current_messages.append(new_system_message)

                # Create a new ChatContext with the updated list of messages
                new_context = llm.ChatContext(current_messages)

                # Update the agent's internal context with the new one
                await self.update_chat_ctx(new_context)
                logger.info(
                    f"Added engagement context for next user turn (Type: {engagement_type})"
                )

            # Agent now waits for user input...

        except Exception as e:
            logger.error(
                f"Error triggering engagement opportunity: {e}\n{traceback.format_exc()}"
            )


class ChatAssistant(Agent):
    """Enhanced voice assistant that handles chat interactions with personality and knowledge base"""

    def __init__(self, vad, brdge_id: str = None, room: rtc.Room = None):
        self.brdge_id = brdge_id
        self.room = room
        self.api_base_url = API_BASE_URL
        self.bridge_type = "general"
        self.personality = ""
        self.knowledge_content = ""
        self.document_knowledge = ""
        self.transcript_read = []
        self.transcript_remaining = []
        self.script = None
        self.agent_personality = {}
        self.teaching_persona = {}
        self.knowledge_base = {}
        self.qa_pairs = []
        self.video_timeline = {}
        self.engagement_opportunities = []
        self.current_position = 0
        self.user_id = None
        self.voice_id = "352af1eb-9cf0-4284-85e0-17f3b29110b9"  # Default voice ID
        self.current_speech = {
            "started_at": None,
            "message": None,
            "was_interrupted": False,
            "log_id": None,
        }
        self.current_timestamp_seconds = 0
        self.current_timestamp = "00:00:00"
        self.triggered_opportunities = set()
        self.system_prompt = "Initializing..."
        self.brdge = {}  # Initialize brdge attribute

        self.initialize()

        super().__init__(
            vad=vad,
            stt=deepgram.STT(model="nova-3-general"),
            llm=openai.LLM(model="gpt-4o"),
            tts=cartesia.TTS(model="sonic-2", voice=self.voice_id),
            chat_ctx=llm.ChatContext().append(role="system", text=self.system_prompt),
            interrupt_speech_duration=0.2,
        )
        logger.info(f"Agent initialized with API base URL: {self.api_base_url}")
        self._setup_event_handlers()

    def initialize(self):
        if not self.brdge_id or not self.api_base_url:
            logger.error("Missing brdge_id or API_BASE_URL")
            return False

        try:
            response = requests.get(
                f"{self.api_base_url}/brdges/{self.brdge_id}/agent-config"
            )
            response.raise_for_status()
            config_data = response.json()
            logger.debug(f"Fetched agent-config: {json.dumps(config_data, indent=2)}")

            self.brdge = config_data.get("brdge", {})  # Store full brdge object
            self.bridge_type = self.brdge.get("bridge_type", "general")
            logger.info(f"Setting bridge_type to: {self.bridge_type}")

            self.agent_personality = config_data.get("agentPersonality", {})
            self.teaching_persona = config_data.get("teaching_persona", {})
            self.knowledge_base = config_data.get("knowledge_base", {})
            self.qa_pairs = config_data.get("qa_pairs", [])
            self.video_timeline = config_data.get(
                "timeline", config_data.get("video_timeline", {})
            )
            self.engagement_opportunities = config_data.get(
                "engagement_opportunities", []
            )
            logger.info(
                f"Retrieved {len(self.engagement_opportunities)} engagement opportunities"
            )

            default_voice = "352af1eb-9cf0-4284-85e0-17f3b29110b9"
            self.voice_id = self.brdge.get("voice_id", default_voice)
            if not self.voice_id:
                self.voice_id = default_voice
            logger.info(f"Using voice_id: {self.voice_id}")

            self.system_prompt = self._build_enhanced_system_prompt()

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
            )
            return False

    def _build_enhanced_system_prompt(self):
        try:
            base_instructions = BASE_PROMPTS.get(
                self.bridge_type, BASE_PROMPTS["general"]
            )

            # Ensure self.brdge is populated (it should be by initialize method)
            brdge_data = self.brdge if hasattr(self, "brdge") and self.brdge else {}
            additional_instructions = brdge_data.get("additional_instructions", "")
            # Log if additional_instructions are found and used
            if additional_instructions:
                logger.info(
                    f"Using additional_instructions for brdge {self.brdge_id}: {additional_instructions[:100]}..."
                )  # Log first 100 chars
            else:
                logger.info(
                    f"No additional_instructions found for brdge {self.brdge_id}."
                )

            context_data = {
                "bridge_type": self.bridge_type,
                "current_timestamp": self.current_timestamp,
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
                "specific_goal_or_cta": additional_instructions,  # Use fetched additional_instructions
            }

            formatted_json = json.dumps(context_data, indent=2)
            final_prompt = f"{base_instructions}\\n{SYSTEM_PROMPT_SUFFIX.format(json_context=formatted_json)}"

            logger.info(f"Generated system prompt for bridge_type '{self.bridge_type}'")
            # logger.debug(f"System Prompt: {final_prompt}")

            # Append type-specific conversational strategies
            conversational_strategy_prompt = ""
            if self.bridge_type in ["vsl", "webinar"]:
                conversational_strategy_prompt = """

# Lead Nurturing & Soft Booking Strategy:
Your primary goal remains to guide the user towards the `specific_goal_or_cta`.
As you converse, listen for cues of strong interest or questions about next steps. Keep your interactions brief and friendly. Actively apply relevant persuasive techniques, communication patterns, or persona archetypes (e.g., 'Consultative Seller', 'Challenger') identified in your KNOWLEDGE_BASE and TEACHING_PERSONA to build rapport and effectively guide the user.
If the user seems like a qualified lead (e.g., their needs align with the solution, they express positive sentiment towards the offering):
1.  Subtly try to understand their specific needs or pain points that the product/service can address. A quick, "So, what are you hoping to achieve with something like this?" can work well. Keep it to one or two short questions.
2.  If they are positive and ask "what's next?", "how do I sign up?", or similar, or if it feels like a natural transition after addressing their main points, you can suggest a more detailed discussion, demo, consultation, or the direct CTA. Make your suggestion concise.
3.  If they agree to a follow-up that requires scheduling (like a demo or consultation), try to get a sense of their general availability (e.g., "Great! Are mornings or afternoons generally better for you?", "Any preferred days next week?"). Keep this part quick and easy for them.
4.  Then, naturally ask for the best email address or phone number to send the confirmation, calendar invite, and any preparatory materials. For example: "Perfect! What's the best email for me to send a calendar invite to?" or "Got it. To send you the details for that, could I get your email?" Keep the ask simple.
5.  Avoid being pushy. If they are hesitant to share contact info or schedule, acknowledge that briefly and offer to provide more information or answer more questions first. ("No problem at all. Happy to answer any other questions you have.") Your aim is to be a helpful guide, not a high-pressure salesperson.
Remember to use the `knowledge_base` and `qa_pairs` to address objections or provide more details, always keeping responses short and to the point.
"""
            elif self.bridge_type in [
                "course",
                "onboarding",
            ]:  # Assuming quiz falls under course/onboarding context for discovery
                conversational_strategy_prompt = """

# Discovery & Feedback Collection Strategy:
Your primary goal is to facilitate learning and successful adoption by being an effective instructor or guide. Keep your interactions helpful and concise.
As you interact:
1.  Pay close attention to questions that indicate confusion, a gap in understanding, or a need for more detailed explanation than your current `knowledge_base` provides.
2.  Listen for any expressions of frustration, pain points with the current process/material, or suggestions for improvement.
3.  If a user asks a particularly insightful question, highlights a significant challenge, or offers feedback, acknowledge it positively and briefly (e.g., "That's a really good point," or "Gotcha, I can see why that might be tricky.", "Thanks for sharing, that's helpful.").
4.  Your objective is to identify these key moments. You should then inform the user that this feedback is valuable and will be noted for the creator/team to review. For example: "I'll make sure to note that down for the creator." or "Good question, I'll flag that." Keep it short.
5.  Do NOT try to collect personal contact information for escalation unless it is explicitly part of a defined `specific_goal_or_cta`. The focus is on improving the content/product itself based on user interaction.
"""

            if conversational_strategy_prompt:
                final_prompt += f"\\n{conversational_strategy_prompt}"
                logger.info(
                    f"Appended conversational strategy for bridge_type '{self.bridge_type}'."
                )
                # logger.debug(f"Full System Prompt with Strategy: {final_prompt}")

            return final_prompt

        except Exception as e:
            logger.error(f"Error building enhanced system prompt: {e}")
            logger.error(f"Traceback: {traceback.format_exc()}")
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

Generate a natural, conversational follow-up. Your primary task is to execute the specific persuasive or goal-oriented strategy defined in the matched path's instruction (`agent_followup_strategy`). Embody your persona, leveraging any specified `persuasive_archetype` or detailed communication tactics from your TEACHING_PERSONA and relevant insights from your KNOWLEDGE_BASE. After delivering this single follow-up response, you should return to the normal interaction flow.
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

            # <<< Add sales-driven goal orientation for VSL and Webinar engagements >>>
            if self.bridge_type == "vsl" and system_context_for_next_turn:
                vsl_goal_suffix = """\

# VSL Persuasion Goal:
Remember, the primary objective of this VSL is to build conviction and guide the user towards the ultimate call to action (e.g., purchase, sign-up, learn more).
After responding to the user based on the specific engagement instructions above, ensure your reply also subtly reinforces a key benefit, addresses a potential unspoken objection, or highlights the value relevant to the current point in the VSL. Leverage the detailed strategies within the current engagement's `conversation_flow` to effectively achieve this. Your aim is to maintain persuasive momentum and steer the conversation towards the VSL's goal.
"""
                system_context_for_next_turn += vsl_goal_suffix
            elif self.bridge_type == "webinar" and system_context_for_next_turn:
                webinar_goal_suffix = """\

# Webinar Engagement Goal:
Remember, the primary objective of this webinar is to deliver value, demonstrate expertise, and encourage attendees to take a relevant next step (e.g., explore a feature, download a resource, consider an offer).
After responding to the user based on the specific engagement instructions above, ensure your reply also subtly reinforces a key insight from the webinar, links it to a benefit, or prompts further curiosity related to the webinar's objectives. Utilize the specific guidance and strategies provided in the current engagement's `conversation_flow` to shape your response. Your aim is to keep the audience engaged and guide them towards valuable outcomes.
"""
                system_context_for_next_turn += webinar_goal_suffix
            # <<< End of sales-driven goal orientation >>>

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
                # Get the current list of messages
                current_messages = list(self.chat_ctx.items)  # Make a mutable copy

                # Create the new system message
                new_system_message = llm.ChatMessage(
                    role="system", text=system_context_for_next_turn
                )

                # Add the new message to the list
                current_messages.append(new_system_message)

                # Create a new ChatContext with the updated list of messages
                new_context = llm.ChatContext(current_messages)

                # Update the agent's internal context with the new one
                await self.update_chat_ctx(new_context)
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
    agent = Assistant(brdge_id=brdge_id, room=ctx.room)

    session_a = AgentSession(
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4.1"),
        tts=cartesia.TTS(voice=agent.voice_id),
        vad=silero.VAD.load(),
    )
    session_b = AgentSession(
        llm=openai.realtime.RealtimeModel(voice="echo"),
    )
    session = session_a
    await session.start(
        room=ctx.room,
        agent=agent,
    )

    # *** Pass ctx.room to ChatAssistant constructor ***
    # agent = ChatAssistant(vad=vad, brdge_id=brdge_id, room=ctx.room)
    # agent.user_id = user_id
    logger.info(f"Set agent.user_id to: {user_id}")

    # chat = rtc.ChatManager(ctx.room)

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
                if session:
                    session.interrupt()

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
                        # chat_ctx = agent.chat_ctx
                        # agent.update_chat_ctx(
                        #     role="system",
                        #     text=f"Current video timestamp: {formatted_timestamp}",
                        # )

                        # Check for engagements asynchronously
                        asyncio.create_task(
                            agent.check_engagement_opportunities(raw_seconds)
                        )

            # else: logger.info(f"Received other data from {sender} on {topic}: {message}")
        except json.JSONDecodeError:
            logger.error(f"Failed to decode JSON from data packet: {message_str}")
        except Exception as e:
            logger.error(f"Error processing data packet: {e}\n{traceback.format_exc()}")

    # @chat.on("message_received")
    # def on_chat_received(msg: rtc.ChatMessage):
    #     if not agent:
    #         logger.warning("Agent not initialized, cannot process chat message")
    #         return

    #     cleaned_message = " ".join(msg.message.split()).strip()
    #     if not cleaned_message:
    #         return

    #     logger.info(f"Received chat message: {cleaned_message}")
    #     agent.interrupt(interrupt_all=True)  # Interrupt agent before processing
    #     # Log conversation turn
    #     agent._log_conversation(cleaned_message, role="user", interrupted=False)
    #     # Process the message using the refactored method
    #     asyncio.create_task(agent.process_user_input(cleaned_message))

    # # Start the agent pipeline
    # agent.start(ctx.room, participant)
    # logger.info(f"Agent started for brdge {brdge_id}, type {agent.bridge_type}")

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


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
