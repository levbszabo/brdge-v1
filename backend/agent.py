import logging
from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
    ConversationItemAddedEvent,
    function_tool,
    RunContext,
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

IMPORTANT: Your responses will be spoken aloud via text-to-speech. Use natural, conversational language without any formatting characters like asterisks, underscores, or mathematical symbols. Speak numbers and percentages naturally.
""",
    "vsl": """
You are a highly persuasive presenter guiding a potential customer through a Video Sales Letter (VSL). Your unwavering GOAL is to build strong conviction in the product's unique value, effectively address any stated or implied objections, and proactively steer every part of the conversation towards the ultimate call to action (e.g., sign up, purchase, book a demo) as potentially defined in 'specific_goal_or_cta'.
Before suggesting the next step, try to understand their current challenges or needs related to our solution to ensure they are a good fit. If they seem qualified and are interested, naturally inquire about their availability for a more detailed discussion or demo, and what email or phone number would be best to send details to.
Use the provided persona (likely a sales or product expert), knowledge base (product details, FAQs, use cases), and video timeline. Actively draw upon any extracted psychological sales methods, persuasive techniques, or specific value propositions from your KNOWLEDGE_BASE and embody any specified persuasive archetype from your TEACHING_PERSONA to maximize your effectiveness.
Sound confident, knowledgeable, and acutely benefit-oriented. Keep your responses engaging and to the point (1-3 sentences). Use casual, connecting phrases like "Makes sense," "Exactly," or "Let's see..." to build rapport.
Seamlessly integrate information from the KNOWLEDGE_BASE and QA_PAIRS to support your points and overcome objections.
Always reference the video content and timestamp naturally. Explicitly look for opportunities to pivot back to the core value proposition and the final CTA. Do not just answer questions; actively guide the prospect in a friendly, conversational way.

IMPORTANT: Your responses will be spoken aloud via text-to-speech. Use natural, conversational language without any formatting characters like asterisks, underscores, or mathematical symbols. Speak numbers and percentages naturally.
""",
    "onboarding": """
You are an onboarding specialist guiding a new user through setting up or learning a product/service. Your goal is to provide clear instructions, answer setup questions, and ensure the user understands key features, leading them to successful adoption.
Use the provided persona, knowledge base (feature explanations, troubleshooting steps), and video timeline (which likely demonstrates the setup process).
Be patient, clear, and helpful. Keep responses focused and brief (1-3 sentences). Use phrases like "Okay, so...", "No problem," or "Let's try this..." for a natural flow.
Refer to specific steps shown in the video using the timestamp. Use the KNOWLEDGE_BASE to answer technical questions accurately.
Pay close attention to any pain points, areas of confusion, or feature requests the user mentions. Your goal is to gather insights that can improve the onboarding process or the product itself. You could respond with, 'Thanks for sharing that, it's really helpful feedback. I'll note it down for the creator to review.' Keep this acknowledgement short and sweet.

IMPORTANT: Your responses will be spoken aloud via text-to-speech. Use natural, conversational language without any formatting characters like asterisks, underscores, or mathematical symbols. Speak numbers and percentages naturally.
""",
    "webinar": """
You are hosting an engaging live webinar session. Your primary GOALS are to present the information clearly, foster audience participation, and strategically guide attendees towards a specific desired next step or call to action relevant to the webinar's content (e.g., explore a feature, download a resource, register for a follow-up, consider an offer), as potentially defined in 'specific_goal_or_cta'.
Use the provided presenter persona, knowledge base (background info, related topics), and video timeline (webinar structure/slides). When appropriate, leverage any identified persuasive communication tactics or goal-oriented strategies from your KNOWLEDGE_BASE and TEACHING_PERSONA to enhance engagement and guide attendees effectively.
Maintain an engaging, authoritative, and professional tone, but keep your language accessible and conversational. Aim for responses of 1-3 sentences. Use natural interjections like "Great point," "Absolutely," or "Good to know."
Answer audience questions concisely using the KNOWLEDGE_BASE, always looking for opportunities to link your answers back to the webinar's main objectives and the intended next step.
If the next step involves a more personalized session (like a booking or demo), and a user expresses keen interest, feel free to ask about their general availability (e.g., 'weekday mornings,' 'afternoons next week') and the best way to send them an invitation (e.g., email). Frame this as making it easier for them, keeping the interaction light and brief.

IMPORTANT: Your responses will be spoken aloud via text-to-speech. Use natural, conversational language without any formatting characters like asterisks, underscores, or mathematical symbols. Speak numbers and percentages naturally.
""",
    "general": """
You are an AI assistant presenting information from a video. Your goal is to provide a helpful and informative experience, answering user questions about the content.
Use the provided persona, knowledge base, and video timeline. Be conversational, clear, and concise (1-3 sentences per response). Feel free to use casual remarks to make the interaction smoother.
Reference the video content using the current timestamp. Use the KNOWLEDGE_BASE to provide context or deeper explanations.

IMPORTANT: Your responses will be spoken aloud via text-to-speech. Use natural, conversational language without any formatting characters like asterisks, underscores, or mathematical symbols. Speak numbers and percentages naturally.
""",
}

# SYSTEM_PROMPT_SUFFIX - ENHANCED FOR GOAL ADHERENCE AND PERSONALIZATION
SYSTEM_PROMPT_SUFFIX = """
# HOW TO RESPOND USING THE DATA BELOW
You have access to the following context in JSON format. Use it to inform your responses:
- `teaching_persona` / `agent_personality`: Adopt this persona in your speaking style. Pay close attention to all detailed characteristics, including any specified persuasive styles, emotional patterns, or goal-oriented tactics, to make your persona highly convincing and effective for the bridge_type.
- `knowledge_base`: Use this for deeper context, facts, and explanations, including any identified persuasion techniques, value propositions, objection handling strategies, or psychological sales methods relevant to the interaction's goal. Refer to it as your own knowledge.
- `qa_pairs`: Use these to answer common questions directly.
- `video_timeline`: Understand where you are in the presentation using `current_timestamp`. Refer to past or future segments based on this timeline.
- `engagement_opportunities`: You may be asked to initiate these based on the timeline.
- `specific_goal_or_cta`: If this field is present and non-empty in the JSON context, it outlines THE PRIMARY OBJECTIVE or desired user action for this entire interaction. All your responses, while natural and conversational, should subtly and strategically work towards guiding the user to achieve this goal or take this call to action. This objective should be your top priority in shaping your replies, especially if the bridge_type is 'vsl' or 'webinar'.
- `viewer_personalization`: If present, this contains specific information about the viewer. USE THIS DATA TO CREATE A HIGHLY PERSONALIZED EXPERIENCE:
  - Address them by name naturally (but not excessively - use their name 1-2 times max in a conversation)
  - Reference their company, role, or industry when giving examples or explanations
  - Tailor analogies and use cases to their specific context
  - Address their specific challenges or interests directly
  - Make recommendations that align with their goals or budget
  - Adjust your language complexity based on their experience level
  - Create a feeling that this content was specifically crafted for them

# SPEECH OUTPUT FORMATTING RULES
CRITICAL: Your responses will be converted to speech using Text-to-Speech technology. Follow these formatting rules strictly:
- NO asterisks (*), underscores (_), backticks (`), or other markdown formatting characters
- NO mathematical notation with symbols - spell out equations in words
- Use natural speech patterns: "first", "second", "third" instead of numbered lists
- For percentages, say "two to five percent" instead of "2% to 5%"
- Replace mathematical expressions like "New Rent = Current Rent * (1 + 0.02 to 0.05)" with spoken language like "Your new rent would be your current rent multiplied by one point zero two to one point zero five"
- Use natural pauses and transitions like "First,", "Additionally,", "Most importantly," instead of bullet points
- Spell out numbers and percentages in a speech-friendly way

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
    def __init__(
        self,
        brdge_id: str = None,
        room: rtc.Room = None,
        personalization_id: str = None,
    ) -> None:
        self.brdge_id = brdge_id
        self.room = room
        self.api_base_url = API_BASE_URL
        self.personalization_id = personalization_id
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
        self.voice_id = "95f07ec4-376e-40bc-a9f6-074beefb2f15"  # Default voice ID
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
        self.active_quizzes = (
            {}
        )  # For storing context of active multiple-choice quizzes

        # Add idle timeout tracking
        self.last_interaction_time = asyncio.get_event_loop().time()
        self.idle_timeout_seconds = 5 * 60  # 5 minutes
        self.idle_check_task = None

        self.initialize()

        super().__init__(instructions=self.system_prompt)

    def initialize(self):
        if not self.brdge_id or not self.api_base_url:
            logger.error("Missing brdge_id or API_BASE_URL")
            return False

        try:
            # Check if we have a personalization ID to include
            url = f"{self.api_base_url}/brdges/{self.brdge_id}/agent-config"
            if hasattr(self, "personalization_id") and self.personalization_id:
                url += f"?personalization_id={self.personalization_id}"
                logger.info(
                    f"🎯 Agent: Using personalization ID {self.personalization_id} in agent-config request"
                )
            else:
                logger.info(
                    "⚠️ Agent: No personalization ID available for agent-config request"
                )

            logger.info(f"🌐 Agent: Fetching config from: {url}")
            response = requests.get(url)
            response.raise_for_status()
            config_data = response.json()
            logger.debug(f"Fetched agent-config: {json.dumps(config_data, indent=2)}")

            # Log personalization data if present
            if config_data.get("personalization_data"):
                logger.info(
                    f"✅ Agent: Received personalization data with keys: {list(config_data['personalization_data'].keys())}"
                )
            else:
                logger.info("❌ Agent: No personalization data in config response")

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

            # Store personalization data if available
            self.personalization_data = config_data.get("personalization_data")
            self.personalization_record_id = config_data.get(
                "personalization_record_id"
            )

            # Initialize resume analysis data
            self.resume_analysis_data = None

            # If we have personalization data with resume_analysis_id, fetch the full analysis
            if self.personalization_data and self.personalization_data.get(
                "resume_analysis_id"
            ):
                resume_analysis_id = self.personalization_data.get("resume_analysis_id")
                self._fetch_resume_analysis(resume_analysis_id)

            default_voice = "95f07ec4-376e-40bc-a9f6-074beefb2f15"
            self.voice_id = self.brdge.get("voice_id", default_voice)
            if not self.voice_id:
                self.voice_id = default_voice
            logger.info(f"Using voice_id: {self.voice_id}")

            # Store model configuration for later use
            self.model_config = config_data.get("model_config", {})

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

    def _fetch_resume_analysis(self, resume_analysis_id):
        """Fetch resume analysis data including extracted text"""
        try:
            logger.info(
                f"🔍 Agent: Fetching resume analysis data for ID {resume_analysis_id}"
            )
            response = requests.get(
                f"{self.api_base_url}/resume-analysis/{resume_analysis_id}"
            )

            if response.ok:
                analysis_data = response.json()
                self.resume_analysis_data = analysis_data.get("analysis_results", {})
                logger.info(
                    f"✅ Agent: Loaded resume analysis data for ID {resume_analysis_id}"
                )

                # Log what we got (without logging the full text for brevity)
                if self.resume_analysis_data.get("raw_resume_text"):
                    text_length = len(self.resume_analysis_data["raw_resume_text"])
                    logger.info(
                        f"📄 Agent: Resume text extracted, length: {text_length} characters"
                    )
                else:
                    logger.warning(f"⚠️ Agent: No resume text found in analysis data")

            else:
                logger.warning(
                    f"⚠️ Agent: Could not fetch resume analysis {resume_analysis_id}: {response.status_code}"
                )

        except Exception as e:
            logger.error(f"❌ Agent: Error fetching resume analysis: {e}")
            self.resume_analysis_data = None

    def build_personalized_context(self):
        """Build a rich, natural personalization context from viewer data"""
        if not self.personalization_data:
            return None

        # Get metadata if available
        metadata = self.personalization_data.get("_metadata", {})
        columns_info = metadata.get("columns", [])

        # Create a mapping of field names to their usage notes
        field_context = {}
        for col_info in columns_info:
            field_context[col_info["name"]] = {
                "usage_note": col_info.get("usage_note", ""),
                "example": col_info.get("example", ""),
            }

        # Build natural language context
        context_parts = []

        # Priority fields for natural introduction
        priority_fields = [
            "name",
            "first_name",
            "full_name",
            "company",
            "role",
            "title",
            "industry",
        ]

        # Handle name variations
        viewer_name = None
        for name_field in ["name", "first_name", "full_name"]:
            if (
                name_field in self.personalization_data
                and self.personalization_data[name_field]
            ):
                viewer_name = self.personalization_data[name_field]
                break

        if viewer_name:
            context_parts.append(f"The viewer's name is {viewer_name}")

        # Handle company and role
        company = self.personalization_data.get(
            "company"
        ) or self.personalization_data.get("organization")
        role = (
            self.personalization_data.get("role")
            or self.personalization_data.get("title")
            or self.personalization_data.get("position")
        )

        if company and role:
            context_parts.append(f"They work as {role} at {company}")
        elif company:
            context_parts.append(f"They work at {company}")
        elif role:
            context_parts.append(f"They work as {role}")

        # Handle industry
        industry = self.personalization_data.get(
            "industry"
        ) or self.personalization_data.get("sector")
        if industry:
            context_parts.append(f"in the {industry} industry")

        # Handle location
        location = (
            self.personalization_data.get("location")
            or self.personalization_data.get("city")
            or self.personalization_data.get("country")
        )
        if location:
            context_parts.append(f"They are based in {location}")

        # Process remaining fields intelligently
        processed_fields = set(
            priority_fields
            + [
                "company",
                "organization",
                "title",
                "position",
                "industry",
                "sector",
                "location",
                "city",
                "country",
                "email",
                "_metadata",
            ]
        )

        for field, value in self.personalization_data.items():
            if field not in processed_fields and value:
                # Get the usage note for this field
                field_info = field_context.get(field, {})
                usage_note = field_info.get("usage_note", "")

                # Create contextual sentences based on field type and usage note
                if "interest" in field.lower() or "interested" in usage_note.lower():
                    context_parts.append(f"They are interested in {value}")
                elif "challenge" in field.lower() or "pain" in field.lower():
                    context_parts.append(f"They face challenges with {value}")
                elif "goal" in field.lower() or "objective" in field.lower():
                    context_parts.append(f"Their goal is {value}")
                elif "experience" in field.lower() or "years" in field.lower():
                    context_parts.append(f"They have {value} of experience")
                elif "size" in field.lower() or "employees" in field.lower():
                    context_parts.append(f"Their organization has {value}")
                elif "budget" in field.lower():
                    context_parts.append(f"They have a budget of {value}")
                elif usage_note:
                    # Use the usage note to create context
                    context_parts.append(f"{usage_note}: {value}")
                else:
                    # Generic handling
                    context_parts.append(f"{field.replace('_', ' ').title()}: {value}")

        # Add resume content if available
        if hasattr(self, "resume_analysis_data") and self.resume_analysis_data:
            raw_resume_text = self.resume_analysis_data.get("raw_resume_text")
            if raw_resume_text and len(raw_resume_text.strip()) > 0:
                # Truncate resume text if it's very long (keep first 3000 chars to avoid token limits)
                if len(raw_resume_text) > 3000:
                    resume_text_to_use = (
                        raw_resume_text[:3000] + "... [resume continues]"
                    )
                else:
                    resume_text_to_use = raw_resume_text

                context_parts.append(
                    f"""

RESUME CONTENT:
The following is the user's actual resume text:
---
{resume_text_to_use}
---

INSTRUCTIONS FOR USING RESUME CONTENT:
- Reference specific companies, roles, and achievements from their resume
- Quote exact phrases when relevant (e.g., "I see you mentioned '[specific achievement]' in your experience")
- Use their actual job titles and company names in examples
- Build on the specific skills and experiences they've listed
- Make references feel natural and conversational
- Connect their resume details to career advice and opportunities"""
                )

        # Join all parts into a coherent context
        if context_parts:
            personalized_context = (
                "VIEWER PERSONALIZATION DATA:\n" + ". ".join(context_parts) + "."
            )

            # Add instructions for using the personalization data
            personalized_context += """

PERSONALIZATION INSTRUCTIONS:
- Use this information naturally throughout the conversation
- Reference their specific context when relevant
- Tailor examples and analogies to their industry/role
- Address their specific challenges or interests when appropriate
- Make the conversation feel personally crafted for them
- Don't force personalization - use it where it flows naturally
- Remember you're speaking to a specific person, not a generic audience"""

            return personalized_context

        return None

    def _build_enhanced_system_prompt(self):
        try:
            base_instructions = BASE_PROMPTS.get(
                self.bridge_type, BASE_PROMPTS["general"]
            )

            # Add personalization context if available
            personalized_context = self.build_personalized_context()
            if personalized_context:
                base_instructions = personalized_context + "\n\n" + base_instructions

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

            # Add personalization data to context if available
            if hasattr(self, "personalization_data") and self.personalization_data:
                # Remove metadata before including in context
                clean_personalization = {
                    k: v
                    for k, v in self.personalization_data.items()
                    if k != "_metadata"
                }
                context_data["viewer_personalization"] = clean_personalization

            formatted_json = json.dumps(context_data, indent=2)
            final_prompt = f"{base_instructions}\\n{SYSTEM_PROMPT_SUFFIX.format(json_context=formatted_json)}"

            logger.info(f"Generated system prompt for bridge_type '{self.bridge_type}'")
            # logger.debug(f"System Prompt: {final_prompt}")

            # Append type-specific conversational strategies
            conversational_strategy_prompt = ""
            if self.bridge_type in ["vsl", "webinar"]:
                # Enhanced VSL/Webinar strategy with personalization
                personalized_sales_strategy = """

    # Lead Nurturing & Soft Booking Strategy:
    Your primary goal remains to guide the user towards the `specific_goal_or_cta`.
    As you converse, listen for cues of strong interest or questions about next steps. Keep your interactions brief and friendly. Actively apply relevant persuasive techniques, communication patterns, or persona archetypes (e.g., 'Consultative Seller', 'Challenger') identified in your KNOWLEDGE_BASE and TEACHING_PERSONA to build rapport and effectively guide the user.
    """

                # Add personalization-specific strategies for sales contexts
                if hasattr(self, "personalization_data") and self.personalization_data:
                    personalized_sales_strategy += """
    
    # PERSONALIZED SALES APPROACH:
    You have specific information about this viewer. Use it strategically:
    - If you know their company size or budget, tailor your value proposition accordingly
    - If you know their industry, use industry-specific examples and terminology
    - If you know their role, speak to the specific challenges and metrics they care about
    - If you know their pain points or goals, address them directly in your responses
    - Create urgency by referencing their specific situation (e.g., "For a company in [industry] like yours...")
    - Make the conversation feel like a 1-on-1 consultation, not a generic pitch
    """

                personalized_sales_strategy += """
    If the user seems like a qualified lead (e.g., their needs align with the solution, they express positive sentiment towards the offering):
    1.  Subtly try to understand their specific needs or pain points that the product/service can address. A quick, "So, what are you hoping to achieve with something like this?" can work well. Keep it to one or two short questions.
    2.  If they are positive and ask "what's next?", "how do I sign up?", or similar, or if it feels like a natural transition after addressing their main points, you can suggest a more detailed discussion, demo, consultation, or the direct CTA. Make your suggestion concise.
    3.  If they agree to a follow-up that requires scheduling (like a demo or consultation), try to get a sense of their general availability (e.g., "Great! Are mornings or afternoons generally better for you?", "Any preferred days next week?"). Keep this part quick and easy for them.
    4.  Then, naturally ask for the best email address or phone number to send the confirmation, calendar invite, and any preparatory materials. For example: "Perfect! What's the best email for me to send a calendar invite to?" or "Got it. To send you the details for that, could I get your email?" Keep the ask simple.
    5.  Avoid being pushy. If they are hesitant to share contact info or schedule, acknowledge that briefly and offer to provide more information or answer more questions first. ("No problem at all. Happy to answer any other questions you have.") Your aim is to be a helpful guide, not a high-pressure salesperson.
    Remember to use the `knowledge_base` and `qa_pairs` to address objections or provide more details, always keeping responses short and to the point.
    """
                conversational_strategy_prompt = personalized_sales_strategy
            elif self.bridge_type in [
                "course",
                "onboarding",
            ]:  # Assuming quiz falls under course/onboarding context for discovery
                # Enhanced learning strategy with personalization
                personalized_learning_strategy = """

    # Discovery & Feedback Collection Strategy:
    Your primary goal is to facilitate learning and successful adoption by being an effective instructor or guide. Keep your interactions helpful and concise.
    """

                # Add personalization-specific strategies for educational contexts
                if hasattr(self, "personalization_data") and self.personalization_data:
                    personalized_learning_strategy += """
    
    # PERSONALIZED LEARNING APPROACH:
    You have specific information about this learner. Use it to enhance their experience:
    - If you know their experience level, adjust your explanations accordingly (beginner vs advanced)
    - If you know their role or industry, use relevant examples from their field
    - If you know their learning goals, connect the material to those specific objectives
    - If you know their company or use case, relate concepts to their actual work scenarios
    - Reference their background when introducing new concepts (e.g., "Since you work in [industry]...")
    - Acknowledge their specific context to build rapport (e.g., "As someone in [role], you'll find this particularly useful...")
    """

                personalized_learning_strategy += """
    As you interact:
    1.  Pay close attention to questions that indicate confusion, a gap in understanding, or a need for more detailed explanation than your current `knowledge_base` provides.
    2.  Listen for any expressions of frustration, pain points with the current process/material, or suggestions for improvement.
    3.  If a user asks a particularly insightful question, highlights a significant challenge, or offers feedback, acknowledge it positively and briefly (e.g., "That's a really good point," or "Gotcha, I can see why that might be tricky.", "Thanks for sharing, that's helpful.").
    4.  Your objective is to identify these key moments. You should then inform the user that this feedback is valuable and will be noted for the creator/team to review. For example: "I'll make sure to note that down for the creator." or "Good question, I'll flag that." Keep it short.
    5.  Do NOT try to collect personal contact information for escalation unless it is explicitly part of a defined `specific_goal_or_cta`. The focus is on improving the content/product itself based on user interaction.
    """
                conversational_strategy_prompt = personalized_learning_strategy

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

    @function_tool()
    async def show_link_to_user(
        self, context: RunContext, url: str, message: str = "Check this out!"
    ):
        """Call this tool to display a clickable link popup to the user in the frontend interface.
        Use this when you need to share an external URL, a reference, or a call to action that involves navigating to a web page.

        Best practices:
        - Keep the message short and specific (e.g., "Apollo.io" or "Documentation")
        - The URL will be shown separately, so don't repeat URL details in the message
        - Use a clear action-oriented message when appropriate

        Args:
            url: The fully qualified URL to be opened when the user clicks the link.
            message: An optional short message to display above the link in the popup.
        """
        logger.info(
            f"LLM tool 'show_link_to_user' called with URL: {url}, Message: {message}"
        )
        await self.send_link_popup_command(url=url, message=message)
        # Tools should typically return a string or dict that can be sent back to the LLM
        # For an action that purely affects the frontend, confirming the action is good practice.
        return json.dumps(
            {"status": "success", "message": f"Link popup command sent for URL: {url}"}
        )

    async def send_link_popup_command(self, url: str, message: str = None):
        """Sends an RPC command to the frontend to display a link popup."""
        if not self.room or not self.room.local_participant:
            logger.warning(
                "Cannot send link popup command: room or local participant not available."
            )
            return

        payload_data = {"action": "show_link", "url": url, "message": message}
        payload_str = json.dumps(payload_data)
        remote_participants = list(self.room.remote_participants.values())
        if not remote_participants:
            logger.info("No remote participants to send link popup command to.")
            return

        logger.info(
            f"Sending triggerLinkPopup RPC to {len(remote_participants)} participant(s) with URL: {url}"
        )
        tasks = []
        for participant in remote_participants:
            tasks.append(
                self.room.local_participant.perform_rpc(
                    destination_identity=participant.identity,
                    method="triggerLinkPopup",
                    payload=payload_str,
                    response_timeout=3.0,
                )
            )
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(
                    f"Error calling triggerLinkPopup RPC for participant {remote_participants[i].identity}: {result}"
                )
            else:
                logger.info(
                    f"triggerLinkPopup RPC response from {remote_participants[i].identity}: {result}"
                )

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

            # Check if we're in realtime mode
            is_realtime_mode = (
                hasattr(self, "model_config")
                and self.model_config.get("mode") == "realtime"
            )

            # 1. Pause the video via RPC (works for both modes)
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

            # COMPLETELY DIFFERENT APPROACH FOR REALTIME MODE
            if is_realtime_mode:
                await self._handle_realtime_engagement(opportunity)
                return

            # STANDARD MODE - Keep existing structured approach
            await self._handle_standard_engagement(opportunity)

        except Exception as e:
            logger.error(
                f"Error triggering engagement opportunity: {e}\n{traceback.format_exc()}"
            )

    async def _handle_realtime_engagement(self, opportunity):
        """Handle engagement for realtime models using natural conversation flow"""
        engagement_type = opportunity.get("engagement_type", "")

        # Extract key information from the opportunity
        quiz_items = opportunity.get("quiz_items", [])
        if quiz_items:
            quiz_item = quiz_items[0]
            question = quiz_item.get("question", "")
            correct_answer = quiz_item.get(
                "correct_option", quiz_item.get("expected_answer", "")
            )
            explanation = quiz_item.get("explanation", "")
            if_correct = quiz_item.get("follow_up", {}).get(
                "if_correct", "That's right!"
            )
            if_incorrect = quiz_item.get("follow_up", {}).get(
                "if_incorrect", "Let me help you think about this differently."
            )
        else:
            question = ""
            correct_answer = ""
            explanation = ""
            if_correct = "Good thinking!"
            if_incorrect = "Let's explore this a bit more."

        # Build a natural conversation starter based on what just happened in the video
        timestamp = self.current_timestamp
        concepts = opportunity.get("concepts_addressed", [])

        # IMPORTANT: Create a clear interruption and transition to engagement
        # This is critical - we need to clearly signal the agent to STOP talking about video content
        interruption_and_transition = f"""
IMPORTANT: The video has PAUSED at {timestamp} for an engagement opportunity. 
STOP discussing the video content and START a natural conversation check-in.

You must now:
1. First, acknowledge the pause naturally (e.g., "Let me pause here for a moment...")
2. Then transition to discussing: "{question}"
3. Have a natural 2-3 turn conversation
4. After the discussion, suggest continuing with the video

Context for the discussion:
- Concepts just covered: {', '.join(concepts) if concepts else 'the previous content'}
- Key point to explore: {question}
- If user understands correctly (mentions ideas related to '{correct_answer}'): {if_correct}
- If user needs guidance: {if_incorrect}
- Additional context: {explanation}

PERSONALIZATION: If you have viewer personalization data, use it naturally in your question or discussion. For example, reference their company, role, or specific context when asking the question or discussing the concept.

Remember: This is a CONVERSATION PAUSE, not a continuation of the video narration.

YOUR IMMEDIATE TASK:
1. Say something like "Actually, let me pause here for a moment..."
2. Then ASK THE QUESTION: "{question}" (personalize if possible)
3. WAIT for the user to respond (do not continue speaking)
4. Only after they respond, have a natural discussion

DO NOT continue describing the video. ASK THE QUESTION and WAIT.
"""

        # Create a strong system message that interrupts the current flow
        interrupt_message = llm.ChatMessage(
            role="system", content=[interruption_and_transition]
        )

        # Also add a user message to help trigger the conversation
        user_trigger = llm.ChatMessage(
            role="user",
            content=[
                "[SYSTEM: Video paused for discussion. Please start the engagement conversation now.]"
            ],
        )

        current_messages = list(self.chat_ctx.items)
        current_messages.extend([interrupt_message, user_trigger])

        await self.update_chat_ctx(llm.ChatContext(current_messages))

        # Let the realtime model start the conversation
        await self.session.generate_reply()

        # Add a follow-up context to ensure the agent waits for user response
        await asyncio.sleep(0.5)  # Brief pause

        follow_up_context = llm.ChatMessage(
            role="system",
            content=[
                f"Now wait for the user to respond to your question about '{question}'. When they do, have a natural discussion based on their answer."
            ],
        )

        current_messages = list(self.chat_ctx.items)
        current_messages.append(follow_up_context)
        await self.update_chat_ctx(llm.ChatContext(current_messages))

        logger.info(
            f"Realtime engagement initiated with strong interruption and conversation flow"
        )

    async def _handle_standard_engagement(self, opportunity):
        """Handle engagement for standard models using structured approach"""
        # ... existing code ...
        # [Move all the existing structured engagement code here]

        # 3. Prepare engagement prompt and guiding context
        initial_prompt = ""
        system_context_for_next_turn = (
            ""  # Context to guide processing of user's *next* input
        )
        quiz_id = opportunity.get(
            "id", f"quiz_{datetime.utcnow().timestamp()}"
        )  # Ensure a unique ID for all quiz types

        engagement_type = opportunity.get("engagement_type", "")

        if engagement_type == "quiz":
            quiz_item = opportunity.get("quiz_items", [{}])[0]
            question_text = quiz_item.get("question", "What do you think?")
            options = quiz_item.get("options", [])
            correct_option = quiz_item.get("correct_option")
            explanation = quiz_item.get("explanation", "")
            if_correct = quiz_item.get("follow_up", {}).get(
                "if_correct", "That's correct!"
            )
            if_incorrect = quiz_item.get("follow_up", {}).get(
                "if_incorrect", "Not quite."
            )
            question_type = quiz_item.get(
                "question_type", "discussion"
            )  # Default to discussion if not specified

            if question_type == "multiple_choice" and options:
                logger.info(
                    f"Preparing multiple-choice quiz: {quiz_id} - {question_text}"
                )

                # Agent speaks only the question or a lead-in
                initial_prompt = (
                    f"{question_text}"  # Or "Let's try a question: {question_text}"
                )

                # Store context for evaluation
                self.active_quizzes[quiz_id] = {
                    "correct_option": correct_option,
                    "explanation": explanation,
                    "if_correct": if_correct,
                    "if_incorrect": if_incorrect,
                    "original_question": question_text,
                    "options": options,  # Store options for context if needed later
                }

                # Send RPC to frontend to display options
                rpc_payload = {
                    "action": "show_multiple_choice_quiz",
                    "quiz_id": quiz_id,
                    "question": question_text,
                    "options": options,
                    "message": f"Quiz: {question_text}",  # Message for the popup title/header
                }
                if self.room and self.room.local_participant:
                    remote_participants = list(self.room.remote_participants.values())
                    if remote_participants:
                        tasks = []
                        for participant in remote_participants:
                            logger.info(
                                f"Sending displayMultipleChoiceQuiz RPC to {participant.identity} for quiz {quiz_id}"
                            )
                            tasks.append(
                                self.room.local_participant.perform_rpc(
                                    destination_identity=participant.identity,
                                    method="displayMultipleChoiceQuiz",  # New RPC method name
                                    payload=json.dumps(rpc_payload),
                                    response_timeout=3.0,
                                )
                            )
                        await asyncio.gather(
                            *tasks, return_exceptions=True
                        )  # Consider logging results/errors
                        logger.info(
                            f"Sent displayMultipleChoiceQuiz RPCs for quiz_id: {quiz_id}"
                        )
                    else:
                        logger.warning(
                            f"No remote participants to send displayMultipleChoiceQuiz RPC for quiz {quiz_id}"
                        )
                else:
                    logger.warning(
                        f"Room or local_participant not available for displayMultipleChoiceQuiz RPC for quiz {quiz_id}"
                    )

                system_context_for_next_turn = f"""
A multiple-choice question ('{question_text}') has been presented to the user with clickable options.
Wait for their selection to come via a data channel message. Do not attempt to answer or evaluate based on their speech right now.
Once their selection is processed, you will be given specific instructions on how to respond with feedback.
"""
            else:  # Existing logic for spoken quizzes/discussion questions
                initial_prompt = f"{question_text}"
                if (
                    options and question_type != "multiple_choice"
                ):  # Only list options if not handled by UI
                    initial_prompt += "\nOptions: " + ", ".join(options)

                system_context_for_next_turn = f"""
You are currently in QUIZ mode. You just asked: "{question_text}" {'Options: ' + ', '.join(options) if options and question_type != "multiple_choice" else ''}
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

Generate a natural, conversational follow-up. Your primary task is to execute the specific persuasive or goal-oriented strategy defined in the matched path's instruction (`agent_followup_strategy`). Embody your persona, leveraging any specified `persuasive_archetype` or detailed communication tactics from your TEACHING_PERSONA and relevant insights from your KNOWLEDGE_BASE. 

PERSONALIZATION: If you have viewer personalization data available, incorporate it naturally into your response where relevant. Reference their specific context, company, role, or challenges to make the conversation feel tailored to them personally.

After delivering this single follow-up response, you should return to the normal interaction flow.
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

        # Speak the initial prompt FIRST
        if initial_prompt:
            # Standard mode - existing approach that works well
            logger.info(f"Standard mode: Agent will ask the engagement question")

            # Add personalization hint if we have personalization data
            personalization_hint = ""
            if hasattr(self, "personalization_data") and self.personalization_data:
                personalization_hint = " If possible, naturally personalize this based on what you know about the viewer."

            instruction_for_llm = f"System: Please now say the following to the user '{initial_prompt}'{personalization_hint}"

            current_messages = list(self.chat_ctx.items)
            new_system_message = llm.ChatMessage(
                role="system", content=[instruction_for_llm]
            )
            current_messages.append(new_system_message)

            new_context = llm.ChatContext(current_messages)
            await self.update_chat_ctx(new_context)
            await self.session.generate_reply()
            await asyncio.sleep(0.2)
        else:
            logger.warning("No initial prompt generated for engagement.")

        # 5. Now, add the system context to guide the processing of the user's *response*
        # (Standard mode only)
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

        # Example of how to trigger the link popup from an engagement
        # You would add specific conditions or data fields to your engagement opportunity structure
        # if opportunity.get("type") == "custom_link_trigger": # Example condition
        #     link_url = opportunity.get("link_url", "https://default.example.com")
        #     link_message = opportunity.get("link_message", "Check this out!")
        #     await self.send_link_popup_command(url=link_url, message=link_message)

        # Agent now waits for user input...

    async def _finalize_usage_log(self, message_content: str, interrupted: bool):
        """Helper to update the usage log."""
        if self.current_speech.get("started_at") and self.current_speech.get("log_id"):
            ended_at = datetime.utcnow()
            duration_seconds = (
                ended_at - self.current_speech["started_at"]
            ).total_seconds()
            duration_minutes = duration_seconds / 60.0
            log_id = self.current_speech["log_id"]
            try:
                # CORRECTED: Use await asyncio.to_thread
                response = await asyncio.to_thread(
                    requests.put,
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

    async def _log_conversation(
        self, message_content: str, role: str, interrupted: bool
    ):
        """Helper to log conversation turns."""
        duration_seconds = 0
        # Calculate duration only if it's agent speech ending/interrupted
        if role == "agent" and self.current_speech.get("started_at"):
            duration_seconds = (
                datetime.utcnow() - self.current_speech["started_at"]
            ).total_seconds()
            logger.info(
                f"AGENT_LOG: Attempting to log conversation for agent. Message: '{message_content[:50]}...' Log ID: {self.current_speech.get('log_id')}"
            )  # Added for debugging

        elif role == "user":
            logger.info(
                f"USER_LOG: Attempting to log conversation for user. Message: '{message_content[:50]}...'"
            )

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

            duration_minutes = duration_seconds / 60.0

            # Include personalization ID if available
            conversation_data = {
                "brdge_id": self.brdge_id,
                "viewer_user_id": viewer_user_id,
                "anonymous_id": anonymous_id,
                "role": role,
                "message": message_content,
                "timestamp": datetime.utcnow().isoformat(),
                "was_interrupted": interrupted,
                "duration_minutes": round(duration_minutes, 2),
            }

            # Add personalization ID if we have it
            if hasattr(self, "personalization_id") and self.personalization_id:
                conversation_data["personalization_id"] = self.personalization_id

            # CORRECTED: Use await asyncio.to_thread
            response = await asyncio.to_thread(
                requests.post,
                f"{self.api_base_url}/brdges/{self.brdge_id}/conversation-logs",
                json=conversation_data,
            )
            response.raise_for_status()
            logger.info(
                f"Successfully logged conversation for role: {role}. Message: '{message_content[:50]}...'"
            )  # Confirmation
        except requests.exceptions.RequestException as e:
            logger.error(f"HTTP Error creating conversation log for role {role}: {e}")
        except Exception as e:
            logger.error(f"Error creating conversation log for role {role}: {e}")

    async def handle_agent_speech_started(self):
        self.current_speech = {
            "started_at": datetime.utcnow(),
            "message": None,
            "was_interrupted": False,
            "log_id": None,
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

            response = await asyncio.to_thread(
                requests.post,
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
            logger.info(f"Created usage log with ID: {self.current_speech['log_id']}")

        except requests.exceptions.RequestException as e:
            logger.error(f"HTTP Error creating usage log: {e}")
        except Exception as e:
            logger.error(f"Error creating usage log: {e}")

    def _reset_current_speech(self):
        self.current_speech = {
            "started_at": None,
            "message": None,
            "was_interrupted": False,
            "log_id": None,
        }

    def update_activity_time(self):
        """Update the last interaction time"""
        self.last_interaction_time = asyncio.get_event_loop().time()
        logger.debug(f"Updated activity time for user {self.user_id}")

    async def check_idle_timeout(self):
        """Check if the user has been idle and disconnect if necessary"""
        while True:
            try:
                current_time = asyncio.get_event_loop().time()
                time_since_last_activity = current_time - self.last_interaction_time

                if time_since_last_activity >= self.idle_timeout_seconds:
                    logger.info(
                        f"User {self.user_id} has been idle for {time_since_last_activity:.0f} seconds, disconnecting"
                    )
                    # Gracefully disconnect - the room will handle cleanup
                    if self.room:
                        await self.room.disconnect()
                    break

                # Check every 30 seconds
                await asyncio.sleep(30)

            except asyncio.CancelledError:
                logger.info("Idle timeout check cancelled")
                break
            except Exception as e:
                logger.error(f"Error in idle timeout check: {e}")
                await asyncio.sleep(30)  # Continue checking even if there's an error

    def start_idle_monitoring(self):
        """Start the idle timeout monitoring task"""
        if self.idle_check_task is None:
            self.idle_check_task = asyncio.create_task(self.check_idle_timeout())
            logger.info(
                f"Started idle monitoring for user {self.user_id} with {self.idle_timeout_seconds}s timeout"
            )

    def stop_idle_monitoring(self):
        """Stop the idle timeout monitoring task"""
        if self.idle_check_task:
            self.idle_check_task.cancel()
            self.idle_check_task = None
            logger.info(f"Stopped idle monitoring for user {self.user_id}")


async def get_model_config(agent, brdge_id):
    """Fetch model configuration for the given brdge"""
    try:
        response = await asyncio.to_thread(
            requests.get, f"{agent.api_base_url}/brdges/{brdge_id}/model-config"
        )
        response.raise_for_status()
        config = response.json()
        logger.info(f"Fetched model config: {config}")
        return config
    except Exception as e:
        logger.error(f"Error fetching model config: {e}")
        # Return default configuration
        return {
            "mode": "standard",
            "standard_model": "gpt-4.1",
            "realtime_model": "gemini-2.0-flash-live-001",
            "voice_id": None,
        }


async def entrypoint(ctx: JobContext):
    logger.info("Entrypoint started")
    await ctx.connect()

    participant = await ctx.wait_for_participant()
    logger.info(f"Starting assistant for participant {participant.identity}")
    logger.info(f"Full participant identity: {participant.identity}")

    # Extract user_id, brdge_id, and personalization_id
    user_id = None
    brdge_id = None
    personalization_id = None
    try:
        identity_parts = participant.identity.split("-")
        logger.info(
            f"🔍 Agent: Parsing participant identity: '{participant.identity}' into parts: {identity_parts}"
        )
        if len(identity_parts) >= 3:
            brdge_id = identity_parts[1]
            user_id = identity_parts[2]
            # Check if there's a personalization ID in the identity
            # UUIDs contain hyphens, so we need to join all parts after the user_id
            if len(identity_parts) >= 4:
                # Join all remaining parts to reconstruct the full UUID
                personalization_id = "-".join(identity_parts[3:])
                logger.info(
                    f"🎯 Agent: Found personalization ID in identity: {personalization_id}"
                )
            logger.info(
                f"✅ Agent: Extracted brdge_id: {brdge_id}, user_id: {user_id}, personalization_id: {personalization_id}"
            )
        elif len(identity_parts) >= 2:
            brdge_id = identity_parts[1]
            logger.info(f"⚠️ Agent: Extracted brdge_id: {brdge_id}, no user_id found")
        else:
            logger.warning(
                f"❌ Agent: Could not parse brdge_id from identity: {participant.identity}"
            )
            # Attempt to get brdge_id and personalization_id from room metadata if available
            try:
                metadata = json.loads(ctx.room.metadata or "{}")
                brdge_id = metadata.get("brdge_id")
                personalization_id = metadata.get("personalization_id")
                logger.info(f"Extracted brdge_id from room metadata: {brdge_id}")
                if personalization_id:
                    logger.info(
                        f"Extracted personalization_id from room metadata: {personalization_id}"
                    )
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
    logger.info(
        f"🚀 Agent: Creating Assistant with brdge_id={brdge_id}, personalization_id={personalization_id}"
    )
    agent = Assistant(
        brdge_id=brdge_id, room=ctx.room, personalization_id=personalization_id
    )
    agent.user_id = user_id

    # Fetch model configuration from agent config
    model_config = await get_model_config(agent, brdge_id)
    agent.model_config = model_config  # Store in agent for access during execution

    # Create appropriate session based on model configuration
    if model_config.get("mode") == "realtime":
        # Realtime mode session
        realtime_model = model_config.get("realtime_model", "gemini-2.0-flash-live-001")
        logger.info(f"Using realtime mode with model: {realtime_model}")

        if realtime_model == "gemini-2.0-flash-live-001":
            # realtime_model = "gemini-2.5-flash-preview-native-audio-dialog"
            session = AgentSession(
                llm=google.beta.realtime.RealtimeModel(
                    model=realtime_model, voice="Orus"
                ),
                # Note: Realtime models handle voice internally, no separate TTS needed
            )
        else:
            # Fallback to OpenAI realtime if other models are added later
            session = AgentSession(
                llm=openai.realtime.RealtimeModel(voice="alloy"),
            )
    else:
        # Standard mode session (default)
        standard_model = model_config.get("standard_model", "gpt-4.1")
        voice_id = model_config.get("voice_id") or agent.voice_id
        logger.info(
            f"Using standard mode with model: {standard_model}, voice: {voice_id}"
        )

        if standard_model == "gemini-2.0-flash":
            llm_instance = google.LLM(model="gemini-2.0-flash-exp")
        elif standard_model == "gemini-2.5-pro":
            llm_instance = google.LLM(model="gemini-2.5-pro-preview-05-06")
        elif standard_model == "gemini-2.5-flash":
            llm_instance = google.LLM(model="gemini-2.5-flash-preview-05-20")
        else:
            # Default to GPT-4.1
            llm_instance = openai.LLM(model="gpt-4.1")

        session = AgentSession(
            stt=deepgram.STT(),
            llm=llm_instance,
            tts=cartesia.TTS(voice=voice_id),
            vad=vad,
        )

    @session.on("speech_created")
    def on_speech_created_sync(
        event: object,
    ):  # Renamed to indicate it's the sync wrapper
        # This callback itself is synchronous
        logger.info(f"Agent speech_created event received. Type: {type(event)}")
        if hasattr(
            event, "source"
        ):  # Basic check, actual attributes depend on SpeechCreatedEvent
            logger.info(f"Source: {event.source}")
        if hasattr(event, "user_initiated"):
            logger.info(f"User initiated: {event.user_initiated}")

        # Create a task to run the async part of the handler
        asyncio.create_task(agent.handle_agent_speech_started())

    @session.on("conversation_item_added")
    def on_conversation_item_added_sync(
        event: ConversationItemAddedEvent,
    ):  # Renamed
        # This callback is synchronous
        item = event.item
        logger.info(
            f"Conversation item added from {item.role}: {item.text_content}, interrupted: {item.interrupted}"
        )

        # Update activity time on any conversation item
        agent.update_activity_time()

        # Define an async inner function to handle the async logic
        async def handle_async_logging():
            if item.role == "user":
                await agent._log_conversation(
                    message_content=item.text_content,
                    role="user",
                    interrupted=False,  # Or item.interrupted
                )
            elif item.role == "assistant":
                await agent._log_conversation(
                    message_content=item.text_content,
                    role="agent",
                    interrupted=item.interrupted,
                )
                await agent._finalize_usage_log(
                    message_content=item.text_content,
                    interrupted=item.interrupted,
                )
                agent._reset_current_speech()  # This can remain synchronous if it doesn't await

        # Create a task to run the async inner function
        asyncio.create_task(handle_async_logging())

    # Start the session and idle monitoring
    session_task = asyncio.create_task(
        session.start(
            room=ctx.room,
            agent=agent,
        )
    )

    # Start idle monitoring
    agent.start_idle_monitoring()

    # Wait for session to complete
    await session_task

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
        message_str = data_packet.data.decode("utf-8")  # Moved decode up for logging

        # Update activity time on any data received
        agent.update_activity_time()

        try:
            # logger.debug(f"Received data packet from {sender} on topic: {topic}, data: {message_str[:200]}") # More context in log

            if topic == "agent-control":
                message = json.loads(message_str)  # Parse message for agent-control
                if message.get("type") == "interrupt":
                    logger.info(f"Received interrupt command from {sender}")
                    if session:
                        session.interrupt()

            elif topic == "video-timestamp":
                message = json.loads(message_str)  # Parse only if this topic
                if message.get("type") == "timestamp" and "time" in message:
                    raw_seconds = message["time"]
                    hours = int(raw_seconds // 3600)
                    minutes = int((raw_seconds % 3600) // 60)
                    seconds = int(raw_seconds % 60)
                    formatted_timestamp = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

                    if agent:
                        if abs(agent.current_timestamp_seconds - raw_seconds) > 0.1:
                            agent.current_timestamp_seconds = raw_seconds
                            agent.current_timestamp = formatted_timestamp
                            # System prompt is rebuilt dynamically if needed or context is added.
                            # No direct update here unless specifically required.

                            asyncio.create_task(
                                agent.check_engagement_opportunities(raw_seconds)
                            )

            elif topic == "quiz_answer":
                logger.info(f"Received data on 'quiz_answer' topic from {sender}")
                try:
                    answer_data = json.loads(message_str)
                    quiz_id_received = answer_data.get("quiz_id")
                    selected_option = answer_data.get("selected_option")
                    logger.info(
                        f"Quiz answer for ID {quiz_id_received}: '{selected_option}'"
                    )

                    if agent and quiz_id_received in agent.active_quizzes:
                        quiz_context = agent.active_quizzes.pop(
                            quiz_id_received
                        )  # Retrieve and remove
                        is_correct = selected_option == quiz_context["correct_option"]

                        feedback_intro = ""
                        if is_correct:
                            feedback_intro = quiz_context["if_correct"]
                        else:
                            feedback_intro = quiz_context["if_incorrect"]

                        explanation_text = quiz_context.get("explanation", "")
                        full_feedback_message = feedback_intro
                        if explanation_text:
                            full_feedback_message += (
                                f" Here's a bit more information: {explanation_text}"
                            )

                        # Different feedback strategies for realtime vs standard
                        is_realtime_mode = (
                            hasattr(agent, "model_config")
                            and agent.model_config.get("mode") == "realtime"
                        )

                        async def update_llm_for_feedback():
                            if is_realtime_mode:
                                # For realtime mode, since we're in natural conversation,
                                # we don't need structured quiz feedback
                                # The conversation will flow naturally
                                logger.info(
                                    f"Realtime mode: Skipping structured quiz feedback for {quiz_id_received}"
                                )
                                # The realtime conversation handler will manage this naturally
                                return
                            else:
                                # Standard mode - existing approach
                                instruction_for_llm = (
                                    f"System: The user was asked: '{quiz_context['original_question']}'. "
                                    f"They selected the option: '{selected_option}'. "
                                    f"This selection was {'correct' if is_correct else 'incorrect'}. "
                                    f"Please now respond to the user with the following feedback, naturally incorporating it into your persona: '{full_feedback_message}' "
                                    f"After providing this feedback, resume the normal {agent.bridge_type} interaction flow."
                                )

                                current_messages = list(agent.chat_ctx.items)
                                new_system_message = llm.ChatMessage(
                                    role="system", content=[instruction_for_llm]
                                )
                                current_messages.append(new_system_message)
                                await agent.update_chat_ctx(
                                    llm.ChatContext(current_messages)
                                )
                                await session.generate_reply()

                        logger.info(
                            f"Processing quiz feedback for {quiz_id_received} ({'realtime' if is_realtime_mode else 'standard'} mode)"
                        )
                        asyncio.create_task(update_llm_for_feedback())

                    elif agent:
                        logger.warning(
                            f"Received answer for unknown or expired quiz_id: {quiz_id_received}. Active quizzes: {list(agent.active_quizzes.keys())}"
                        )
                    else:
                        logger.warning("Agent not available to process quiz_answer.")

                except json.JSONDecodeError:
                    logger.error(
                        f"Failed to decode JSON from quiz_answer: {message_str}"
                    )
                except Exception as e_quiz:
                    logger.error(
                        f"Error processing quiz_answer: {e_quiz}\n{traceback.format_exc()}"
                    )

            # else: logger.info(f"Received other data from {sender} on {topic}: {message_str[:200]}") # Log other messages
        except json.JSONDecodeError:
            # This general except block is now less likely to be hit for quiz_answer or video-timestamp
            # as they parse their JSON inside their specific blocks.
            # It would catch errors if a message on another topic was expected to be JSON but wasn't.
            logger.error(
                f"Failed to decode JSON from data packet (topic: {topic}): {message_str}"
            )
        except Exception as e:
            logger.error(
                f"Error processing data packet (topic: {topic}): {e}\n{traceback.format_exc()}"
            )

    disconnect_event = asyncio.Event()

    @ctx.room.on("disconnected")
    def on_disconnect(*args):
        logger.info("Room disconnected")
        # Stop idle monitoring when disconnecting
        agent.stop_idle_monitoring()
        disconnect_event.set()

    try:
        await disconnect_event.wait()
    finally:
        logger.info("Cleaning up agent...")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
