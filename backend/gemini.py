# pip install -q -U google-generativeai
import google.generativeai as genai
import os
import time
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

GEMINI_MODEL = "gemini-2.0-flash"


# Add this class near the top of the file
class LogCollector:
    def __init__(self, brdge_id=None, callback=None):
        self.brdge_id = brdge_id
        self.callback = callback
        self.logs = []
        self.last_update = time.time()
        self.progress = 0

    def add_log(self, message, status="info"):
        # Create a log entry
        log_entry = {"message": message, "status": status, "timestamp": time.time()}
        self.logs.append(log_entry)

        # If callback provided and enough time passed, update the database
        if self.callback and time.time() - self.last_update > 2:
            self.update_database()

    def update_progress(self, progress):
        self.progress = progress
        if self.callback:
            self.update_database()

    def update_database(self):
        if self.callback:
            self.callback(self.brdge_id, self.logs, self.progress)
            self.last_update = time.time()


# Helper function to format timing information consistently
def print_timing(stage_name, duration_seconds, include_emoji=True, log_collector=None):
    """Print timing information with consistent formatting and optionally log it"""
    emoji = "⏱️ " if include_emoji else ""
    message = f"{emoji}TIMING: {stage_name} - {duration_seconds:.2f} seconds"
    print(message)

    # If log collector is provided, add the log
    if log_collector:
        log_collector.add_log(message, status="info")


# Configure Gemini
def configure_genai():
    """Configure the Gemini API with credentials"""
    start_time = time.time()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")

    genai.configure(api_key=api_key)
    duration = time.time() - start_time
    print_timing("API Configuration", duration)
    logger.info("Gemini API configured successfully")


# Initialize the model - ensure it uses the desired flash model
def get_model(model_name=GEMINI_MODEL):  # Updated default model name
    """Get configured Gemini model instance"""
    start_time = time.time()
    # Ensure your generation_config is appropriate for all calls, or adjust per call type.
    # For challenge generation, text/JSON is fine.
    model = genai.GenerativeModel(
        model_name, generation_config={"response_mime_type": "application/json"}
    )
    duration = time.time() - start_time
    print_timing(f"Model Initialization ({model_name})", duration)
    return model


#################################################
# EXTRACTION FUNCTIONS - EACH SPECIALIZED PASS
#################################################


def extract_initial_timelines(
    video_file, document_file, model, log_collector=None
) -> Dict[str, Any]:
    """
    PASS 1: Extract parallel timelines from video and document

    Args:
        video_file: Uploaded video file
        document_file: Optional document file
        model: Configured Gemini model

    Returns:
        Dictionary containing both video and document timelines
    """
    pass_start_time = time.time()
    print(f"🔍 EXTRACTION PASS 1: Extracting parallel content timelines...")

    # First extract video timeline
    video_timeline_start = time.time()
    video_timeline = extract_video_timeline(video_file, model)
    video_timeline_duration = time.time() - video_timeline_start
    print_timing("Video Timeline Extraction", video_timeline_duration)

    # Then extract document timeline if available
    document_timeline = {}
    if document_file:
        doc_timeline_start = time.time()
        document_timeline = extract_document_timeline(document_file, model)
        doc_timeline_duration = time.time() - doc_timeline_start
        print_timing("Document Timeline Extraction", doc_timeline_duration)

    # Combine both timelines into a unified structure
    combined_timelines = {
        "video_timeline": video_timeline.get("video_timeline", {}),
        "document_timeline": document_timeline.get("document_timeline", {}),
    }

    # Count sections for logging
    video_sections = len(
        combined_timelines["video_timeline"].get("pedagogical_structure", [])
    )
    doc_sections = len(combined_timelines["document_timeline"].get("sections", []))

    pass_duration = time.time() - pass_start_time
    print_timing("PASS 1: Timeline Extraction (Total)", pass_duration)
    print(
        f"✅ Timeline extraction complete: {video_sections} video sections, {doc_sections} document sections identified"
    )
    return combined_timelines


def extract_video_timeline(video_file, model) -> Dict[str, Any]:
    """Extract timeline from video"""
    timeline_start_time = time.time()

    timeline_prompt = """
    Analyze this video to create a pedagogically-aware timeline.
    
    IMPORTANT: The timeline MUST start from the beginning of the video (00:00:00) and cover the ENTIRE duration.
    
    Divide the content into logical sections based on topic transitions, slide changes, or teaching approach shifts.
    
    For each section, identify:
    1. Start and end timestamps (HH:MM:SS format)
    2. Teaching approach used (explanation, demonstration, example, etc.)
    3. Visual content (slides, demos, diagrams)
    4. Spoken content (transcribe key portions)
    5. Key points covered
    
    Requirements:
    - Ensure segments are of relatively consistent duration unless there's a strong pedagogical reason for longer segments
    - Verify that all timestamps are in chronological order with each end_time occurring after its corresponding start_time
    - The sections must be a full partition of the video, must not overlap, and must not have any gaps in coverage
    CONSTRAINTS
    - No timestamp must exceed the video length
    - Use 0 padded time (HH:MM:SS).  
    - If unsure, ask yourself "Could I cite an exact moment?"  if not, omit.  
    - Do NOT invent content that cannot be heard or seen verbatim.
    
    Return ONLY a JSON object with this structure:
    {
      "video_timeline": {
        "metadata": {
          "title": "str",
          "total_duration": "HH:MM:SS",
          "instructor": "str",
          "subject_domain": "str"
        },
        "pedagogical_structure": [
          {
            "id": "section-1",
            "type": "learning_section",
            "title": "str",
            "start_time": "HH:MM:SS",
            "end_time": "HH:MM:SS",
            "teaching_approach": "str",
            "segments": [
              {
                "id": "segment-1.1",
                "title": "str",
                "start_time": "HH:MM:SS",
                "end_time": "HH:MM:SS",
                "transcript": "str",
                "visual_content": {
                  "type": "str",
                  "description": "str",
                  "text_visible": ["str"]
                },
                "key_points": ["str"]
              }
            ],
            "summary": "str"
          }
        ]
      }
    }
    
    Here's an example of a high-quality timeline extraction:
    
    {
      "video_timeline": {
        "metadata": {
          "title": "Introduction to Machine Learning",
          "total_duration": "00:45:12",
          "instructor": "Dr. Jane Smith",
          "subject_domain": "Computer Science"
        },
        "pedagogical_structure": [
          {
            "id": "section-1",
            "type": "learning_section",
            "title": "What is Machine Learning?",
            "start_time": "00:00:00",
            "end_time": "00:10:23",
            "teaching_approach": "Conceptual Introduction, Historical Context",
            "segments": [
              {
                "id": "segment-1.1",
                "title": "Definition and Basic Concepts",
                "start_time": "00:00:00",
                "end_time": "00:03:45",
                "transcript": "Welcome to this course on machine learning. Today we'll start by understanding what machine learning actually is. At its core, machine learning is a subset of artificial intelligence that focuses on developing systems that can learn from data.",
                "visual_content": {
                  "type": "Slide",
                  "description": "Title slide with course name and instructor information, followed by bullet points defining machine learning",
                  "text_visible": ["Introduction to Machine Learning", "Dr. Jane Smith", "Machine Learning: Systems that learn from data without explicit programming"]
                },
                "key_points": ["Machine learning is a subset of AI", "ML systems learn from data without explicit programming", "Key difference from traditional programming"]
              },
              {
                "id": "segment-1.2",
                "title": "Historical Development",
                "start_time": "00:03:46",
                "end_time": "00:07:15",
                "transcript": "The concept of machine learning has been around since the 1950s, with early work by pioneers like Arthur Samuel who developed a checkers-playing program that improved through self-play.",
                "visual_content": {
                  "type": "Slides",
                  "description": "Timeline showing key developments in machine learning history with photos of pioneers",
                  "text_visible": ["1950s - First Learning Machines", "1980s - Neural Network Revival", "2010s - Deep Learning Revolution"]
                },
                "key_points": ["ML dates back to 1950s", "Arthur Samuel's self-improving checkers program", "Key milestones in ML development"]
              }
            ],
            "summary": "This section introduces the fundamental concept of machine learning, providing definitions and historical context to establish the foundation for the course."
          }
        ]
      }
    }
    
    Be precise with timestamps and section boundaries.
    Ensure each section has a clear pedagogical purpose.
    Split long sections (>10 minutes) into smaller segments unless there's a clear reason not to.
    """

    try:
        prompt_creation_time = time.time() - timeline_start_time
        print_timing("Video Timeline - Prompt Creation", prompt_creation_time)

        api_call_start = time.time()
        response = model.generate_content([timeline_prompt, video_file])
        api_call_duration = time.time() - api_call_start
        print_timing("Video Timeline - Gemini API Call", api_call_duration)

        parsing_start = time.time()
        results = json.loads(response.text)
        parsing_duration = time.time() - parsing_start
        print_timing("Video Timeline - Response Parsing", parsing_duration)

        total_duration = time.time() - timeline_start_time

        # Count sections for logging
        section_count = len(
            results.get("video_timeline", {}).get("pedagogical_structure", [])
        )

        # Validate timeline data
        validate_timeline_data(results)

        print(
            f"✅ Video timeline extraction: {section_count} sections identified ({total_duration:.2f}s)"
        )
        return results
    except Exception as e:
        logger.error(f"Timeline extraction error: {e}")
        print(f"❌ Timeline extraction failed: {str(e)}")
        # Return minimal structure so pipeline can continue
        return {
            "video_timeline": {
                "metadata": {
                    "title": "Unknown",
                    "total_duration": "00:00:00",
                    "instructor": "Unknown",
                    "subject_domain": "Unknown",
                },
                "pedagogical_structure": [],
            }
        }


def validate_timeline_data(results):
    """Validate timeline data for common issues"""
    try:
        structure = results.get("video_timeline", {}).get("pedagogical_structure", [])

        # Check if timeline starts at 00:00:00
        if structure and "start_time" in structure[0]:
            first_start = structure[0]["start_time"]
            if first_start != "00:00:00":
                logger.warning(
                    f"Timeline doesn't start at 00:00:00 (starts at {first_start})"
                )

        # Check for chronological order issues
        for section in structure:
            start = section.get("start_time", "")
            end = section.get("end_time", "")

            if start and end and start >= end:
                logger.error(
                    f"Section {section.get('id')} has start_time ({start}) >= end_time ({end})"
                )

            for segment in section.get("segments", []):
                seg_start = segment.get("start_time", "")
                seg_end = segment.get("end_time", "")

                if seg_start and seg_end and seg_start >= seg_end:
                    logger.error(
                        f"Segment {segment.get('id')} has start_time ({seg_start}) >= end_time ({seg_end})"
                    )

    except Exception as e:
        logger.error(f"Timeline validation error: {e}")


def extract_document_timeline(document_file, model) -> Dict[str, Any]:
    """Extract timeline structure from document"""
    if not document_file:
        return {"document_timeline": {}}

    doc_timeline_start = time.time()

    document_prompt = """
    Analyze this document to extract its organizational structure, key sections, and content timeline.
    
    For each section of the document, identify:
    1. Title or heading
    2. Page range
    3. Key topics covered
    4. Visual elements present (charts, diagrams, images)
    5. Important formulas or technical content
    
    Return ONLY a JSON object with this structure:
    {
      "document_timeline": {
        "title": "Document Title",
        "total_pages": 45,
        "sections": [
          {
            "id": "doc-section-1",
            "title": "Chapter 1: Fundamentals",
            "page_range": "1-8",
            "summary": "Overview of this document section",
            "key_topics": ["topic1", "topic2"],
            "subsections": [
              {
                "id": "doc-subsection-1.1",
                "title": "1.1 Core Principles",
                "page_range": "1-3",
                "content_summary": "Brief summary of subsection",
                "key_points": ["point1", "point2"],
                "visual_elements": [
                  {
                    "type": "chart",
                    "page": 2,
                    "description": "Growth trend comparison"
                  }
                ],
                "formulas": [
                  {
                    "expression": "E = mc^2",
                    "explanation": "Energy-mass equivalence",
                    "page": 3
                  }
                ]
              }
            ]
          }
        ]
      }
    }
    
    Be precise with page numbers and section titles.
    Ensure all significant document sections are captured.
    """

    try:
        prompt_creation_time = time.time() - doc_timeline_start
        print_timing("Document Timeline - Prompt Creation", prompt_creation_time)

        api_call_start = time.time()
        response = model.generate_content([document_prompt, document_file])
        api_call_duration = time.time() - api_call_start
        print_timing("Document Timeline - Gemini API Call", api_call_duration)

        parsing_start = time.time()
        results = json.loads(response.text)
        parsing_duration = time.time() - parsing_start
        print_timing("Document Timeline - Response Parsing", parsing_duration)

        total_duration = time.time() - doc_timeline_start

        # Count sections for logging
        section_count = len(results.get("document_timeline", {}).get("sections", []))

        print(
            f"✅ Document timeline extraction: {section_count} sections identified ({total_duration:.2f}s)"
        )
        return results
    except Exception as e:
        logger.error(f"Document timeline extraction error: {e}")
        print(f"❌ Document timeline extraction failed: {str(e)}")
        return {"document_timeline": {}}


def extract_knowledge_base(
    video_file,
    document_file,
    timeline_data,
    model,
    log_collector=None,
    bridge_type="course",
    additional_instructions="",
) -> Dict[str, Any]:
    """
    PASS 2: Extract knowledge base using timeline data as context

    Args:
        video_file: Uploaded video file
        document_file: Optional document file
        timeline_data: Data from previous timeline extraction
        model: Configured Gemini model

    Returns:
        Dictionary containing knowledge base components
    """
    pass_start_time = time.time()
    print(f"🔍 EXTRACTION PASS 2: Extracting knowledge base and concept network...")

    # Format timeline data for the prompt
    formatting_start = time.time()
    timeline_json = json.dumps(timeline_data.get("video_timeline", {}), indent=2)
    formatting_duration = time.time() - formatting_start
    print_timing("Knowledge Base - Context Formatting", formatting_duration)

    # Add mode-specific focus instruction
    focus_instruction = ""
    if bridge_type == "vsl":
        focus_instruction = "Focus on extracting product features, benefits addressing specific pain points, unique selling propositions, competitive differentiators, pricing, guarantees, and strong calls-to-action relevant to immediate conversion."
    elif bridge_type == "webinar":
        focus_instruction = "Focus on extracting key discussion points, potential audience questions, features relevant to qualification, context/industry insights, and information supporting a meeting/demo booking."
    elif bridge_type == "onboarding":
        focus_instruction = "Focus on extracting specific procedural steps, UI element names/locations, troubleshooting tips, task sequences, common user errors, and information directly related to feature adoption."
    else:  # course (default)
        focus_instruction = "Focus on extracting core concepts, definitions, theories, conceptual frameworks, examples vs. non-examples, prerequisites, and relationships relevant to learning and understanding."

    # Add additional instructions if provided
    instruction_context = ""
    if additional_instructions:
        instruction_context = f"\n\nAlso consider these specific instructions when extracting knowledge: {additional_instructions}"

    # Enhanced section for goal-oriented extraction
    goal_oriented_extraction_instructions = ""
    if bridge_type in ["vsl", "webinar"]:
        goal_oriented_extraction_instructions = f"""

    Given the bridge_type is '{bridge_type}', pay SPECIAL ATTENTION to extracting elements crucial for persuasion and achieving the primary sales/engagement goal:
    - **Persuasion Techniques Observed**: Identify any classical persuasion techniques used (e.g., Cialdini's principles: Reciprocity, Scarcity, Authority, Consistency, Liking, Consensus/Social Proof). For each, describe how it's applied in the content. These can be categorized under 'Persuasion Technique' within `core_concepts`.
    - **Value Propositions & Benefit Articulation**: How are key benefits of the product/service/idea articulated? How are they linked to solving audience pain points or achieving desires? Capture these as `core_concepts` with a category like 'Value Proposition' or 'Benefit'.
    - **Objection Handling Strategies**: Does the content preemptively address potential objections or doubts? How? Note these strategies. These can be linked to relevant `core_concepts` or captured as `key_facts` with context.
    - **Emotional Hooks & Engagement Drivers**: What emotional language, stories, or questions are used to engage the audience and build interest towards the goal?
    - **Call-to-Action (CTA) Analysis**: If a CTA is present, analyze how the content builds towards it. What are the linguistic cues or triggers? This can inform the 'purpose' or 'attributes' of related `core_concepts`.
    - **Psychological Sales Methods**: Are there any identifiable psychological sales methods or frameworks implicitly or explicitly used (e.g., AIDA - Attention, Interest, Desire, Action; SPIN selling; Challenger Sale cues)? Describe these. These can be noted as `key_facts` with appropriate context or influence the description of `processes`.

    When extracting these, try to integrate them naturally into the existing JSON structure. For example:
    - A persuasion technique like "Scarcity (e.g., 'Limited time offer')" could be a `core_concept` with `name: "Limited Time Offer"`, `category: "Persuasion Technique"`, and its `definition_text` explaining how it's used.
    - A `key_fact` could be `fact: "The presenter uses storytelling to build an emotional connection before introducing the main offer."`, `context: "Engagement Driver"`.
    """

    knowledge_prompt = f"""
    Analyze this video (and document if provided) to extract a comprehensive knowledge base.
    
    {focus_instruction}
    {goal_oriented_extraction_instructions}
    
    Use the following timeline information as context:
    ```
    {timeline_json}
    ```
    
    Extract:
    1. Core concepts and their definitions
    2. Relationships between concepts (prerequisites, components, etc.)
    3. Key facts, data points, and examples
    4. Processes and procedures explained

    Return ONLY a JSON object with this structure:
    {{
      "knowledge_base": {{
        "core_concepts": [
          {{
            "id": "concept-1",
            "name": "str",
            "category": "str",
            "definitions": [
              {{
                "definition_text": "str",
                "context": "str",
                "source_location": {{"type": "video", "section_id": "section-1"}}
              }}
            ],
            "attributes": ["str"],
            "examples": [
              {{
                "example_text": "str",
                "source_location": {{"type": "str", "section_id": "str"}}
              }}
            ],
            "misconceptions": [
              {{
                "misconception": "str",
                "correction": "str"
              }}
            ]
          }}
        ],
        "concept_relationships": [
          {{
            "source_concept": "concept-1",
            "target_concept": "concept-2",
            "relationship_type": "str",
            "description": "str",
            "evidence_location": {{"type": "str", "section_id": "str"}}
          }}
        ],
        "key_facts": [
          {{
            "fact": "str",
            "context": "str",
            "source_location": {{"type": "str", "section_id": "str"}}
          }}
        ],
        "processes": [
          {{
        "name": "str",
        "steps": [
              {{
                "step_number": 1,
            "description": "str",
                "source_location": {{"type": "str", "section_id": "str"}}
              }}
            ],
            "purpose": "str"
          }}
        ]
      }}
    }}

    Make sure concept IDs are unique and consistently referenced across the knowledge base.
    Ensure each concept is linked to its source location in the timeline.
    Be comprehensive and detailed in extracting ALL significant concepts.
    
    {instruction_context}
    """

    try:
        prompt_creation_time = time.time() - pass_start_time - formatting_duration
        print_timing("Knowledge Base - Prompt Creation", prompt_creation_time)

        contents_prep_start = time.time()
        contents = [knowledge_prompt, video_file]
        if document_file:
            contents.append(document_file)
        contents_prep_duration = time.time() - contents_prep_start
        print_timing("Knowledge Base - Contents Preparation", contents_prep_duration)

        api_call_start = time.time()
        response = model.generate_content(contents)
        api_call_duration = time.time() - api_call_start
        print_timing("Knowledge Base - Gemini API Call", api_call_duration)

        parsing_start = time.time()
        results = json.loads(response.text)
        parsing_duration = time.time() - parsing_start
        print_timing("Knowledge Base - Response Parsing", parsing_duration)

        pass_duration = time.time() - pass_start_time

        # Count concepts for logging
        concept_count = len(results.get("knowledge_base", {}).get("core_concepts", []))
        relationship_count = len(
            results.get("knowledge_base", {}).get("concept_relationships", [])
        )

        print_timing("PASS 2: Knowledge Extraction (Total)", pass_duration)
        print(
            f"✅ Knowledge extraction complete: {concept_count} concepts, {relationship_count} relationships identified"
        )
        return results
    except Exception as e:
        logger.error(f"Knowledge extraction error: {e}")
        print(f"❌ Knowledge extraction failed: {str(e)}")
        return {
            "knowledge_base": {
                "core_concepts": [],
                "concept_relationships": [],
                "key_facts": [],
                "processes": [],
            }
        }


def extract_teaching_persona(
    video_file,
    timeline_data,
    knowledge_data,
    model,
    log_collector=None,
    bridge_type="course",
    additional_instructions="",
) -> Dict[str, Any]:
    """
    PASS 3: Extract teaching persona using timeline and knowledge data
    """
    pass_start_time = time.time()
    print(
        f"🔍 EXTRACTION PASS 3: Extracting teaching persona and communication style..."
    )

    # Format previous data for the prompt
    formatting_start = time.time()
    instructor_info = (
        timeline_data.get("video_timeline", {})
        .get("metadata", {})
        .get("instructor", "instructor")
    )

    # Get concept list to analyze teaching approaches by concept
    concepts = []
    for concept in knowledge_data.get("knowledge_base", {}).get("core_concepts", []):
        concepts.append({"id": concept.get("id", ""), "name": concept.get("name", "")})

    concepts_json = json.dumps(concepts, indent=2)
    formatting_duration = time.time() - formatting_start
    print_timing("Teaching Persona - Context Formatting", formatting_duration)

    # Add mode-specific goal injection
    goal_instruction = ""
    if bridge_type == "vsl":
        goal_instruction = f"Analyze this video to extract the persona of {instructor_info} *with the goal of emulating a highly persuasive sales presenter*. Focus specifically on persuasion techniques (e.g., building rapport, establishing authority, using social proof, creating urgency), benefit-driven language, storytelling for impact, confidence, authority, handling objections implicitly/explicitly, and driving towards a specific conversion action. Identify the overall sales/persuasion strategy or archetype if discernible (e.g., Challenger, Consultative, Storyteller)."
    elif bridge_type == "webinar":
        goal_instruction = f"Analyze this video to extract the persona of {instructor_info} *with the goal of emulating an engaging, authoritative host/expert who effectively guides attendees towards a desired next step*. Focus on structured delivery, clarity, techniques for managing audience interaction (Q&A style), building credibility, using storytelling to illustrate points, and smoothly facilitating transitions, including guiding towards a next step like booking a meeting or exploring a feature. Note any specific tactics used to maintain engagement and build towards the webinar's objective."
    elif bridge_type == "onboarding":
        goal_instruction = f"Analyze this video to extract the persona of {instructor_info} *with the goal of emulating a clear, patient, and practical guide*. Focus on step-by-step instruction clarity, encouraging tone for task completion, anticipating user friction points, and providing concise, actionable help."
    else:  # course (default)
        goal_instruction = f"Analyze this video to extract the persona of {instructor_info} *with the goal of emulating an effective, knowledgeable tutor*. Focus on clarity of conceptual explanations, use of analogies, checking for understanding (Socratic method if applicable), patience, and structuring complex information for learning."

    # Add additional instructions if provided
    instruction_context = ""
    if additional_instructions:
        instruction_context = f"\n\nConsider these additional instructions when analyzing the persona and generating simulation guidance: {additional_instructions}"

    persona_prompt = f"""
    {goal_instruction}
    
    Pay particular attention to:
    1. Speaking style, tone, pacing, and accent characteristics
    2. Explanation techniques and teaching approaches
    3. How examples are presented and stories are told (especially their persuasive intent if bridge_type is vsl/webinar)
    4. Emotional patterns when teaching different concepts (and how emotion is used to persuade or engage)
    5. Interaction patterns and question handling (including how objections or skepticism are addressed)
    6. Terminology and vocabulary usage (note persuasive or benefit-oriented language)
    7. **Persuasive and Goal-Oriented Communication Style (for VSL/Webinar primarily)**: 
        - How is credibility/authority established?
        - What techniques are used to build rapport or trust?
        - How is urgency or scarcity leveraged (if at all)?
        - How are benefits highlighted over features?
        - How are potential objections preempted or addressed?
        - How does the communication guide the listener towards a specific outcome or CTA?
    
    Consider how the instructor approaches these concepts:
    ```
    {concepts_json}
    ```

    Return ONLY a JSON object with this structure:
    {{
      "teaching_persona": {{
        "instructor_profile": {{
          "name": "str",
          "apparent_expertise_level": "str",
          "teaching_experience_indicators": "str",
          "communication_clarity": "str",
          "persuasive_archetype": "str (e.g., Challenger, Consultative, Storyteller - relevant for VSL/Webinar)"
        }},
        "speech_characteristics": {{
          "accent": {{
            "type": "str",
            "pronunciation_patterns": ["str"],
            "cadence": "str"
          }},
          "distinctive_markers": {{
            "filler_sounds": ["str"],
            "frequency": "str",
            "placement": "str"
          }}
        }},
        "communication_patterns": {{
          "vocabulary_level": "str",
          "sentence_structure": "str",
          "speaking_pace": {{
            "average": "str",
            "variation": "str"
          }},
          "recurring_phrases": [
            {{
              "phrase": "str",
              "usage_context": "str",
              "frequency": "str"
            }}
          ],
          "discourse_markers": [
            {{
              "marker": "str",
              "function": "str"
            }}
          ],
          "goal_oriented_tactics_summary": "str (Describe how language is used to guide towards goals, especially for VSL/Webinar)"
        }},
        "emotional_teaching_patterns": {{
          "enthusiasm_triggers": [
            {{
              "topic": "str",
              "vocal_cues": "str"
            }}
          ],
          "concept_specific_emotions": [
            {{
              "concept_id": "str",
              "emotional_approach": "str",
              "rationale": "str"
            }}
          ],
          "humor_style": {{
            "frequency": "str",
        "type": "str",
            "context": "str"
          }}
        }},
        "pedagogical_approach": {{
          "teaching_philosophy_indicators": ["str"],
          "explanation_techniques": [
            {{
              "technique": "str",
              "usage_frequency": "str",
              "example": "str"
            }}
          ],
          "example_usage": {{
            "frequency": "str",
            "types": ["str"],
            "presentation_style": "str"
          }}
        }},
        "storytelling_approach": {{
          "narrative_structures": [
            {{
              "pattern": "str",
              "frequency": "str",
              "effectiveness": "str"
            }}
          ],
          "example_sources": {{
            "domains": ["str"],
            "recency": "str",
            "personalization": "str"
          }},
          "metaphor_preferences": [
            {{
              "concept_type": "str",
              "preferred_metaphor_domain": "str"
            }}
          ]
        }},
        "concept_specific_approaches": [
          {{
            "concept_id": "str",
            "teaching_methods": ["str"],
            "emphasis_level": "str"
          }}
        ],
        "persona_simulation_guidance": {{
          "voice_characteristics": {{
            "tone": "str",
            "pacing": "str"
          }},
          "response_templates": {{
      "greeting": "str",
            "concept_explanation": "str",
            "addressing_misconceptions": "str",
            "knowledge_check": "str",
            "handling_hesitation": "str (Template for addressing user doubts - for VSL/Webinar)",
            "reinforcing_value_proposition": "str (Template for re-emphasizing benefits - for VSL/Webinar)",
            "guiding_to_cta": "str (Template for encouraging next step - for VSL/Webinar)"
          }}
        }}
      }}
    }}
    
    Here are examples of high-quality extractions for each new section:
    
    1. Speech Characteristics Example:
    ```json
    {{
      "speech_characteristics": {{
        "accent": {{
          "type": "Midwestern American with subtle British influence",
          "pronunciation_patterns": ["pronounces 'process' with a British 'o' sound", "elongates vowels in technical terms"],
          "cadence": "Measured pace with slight rise in pitch at end of explanatory segments"
        }},
        "distinctive_markers": {{
          "filler_sounds": ["um", "so", "right"],
          "frequency": "moderate",
          "placement": "typically before introducing complex mathematical concepts"
        }}
      }}
    }}
    ```
    
    2. Emotional Teaching Patterns Example:
    ```json
    {{
      "emotional_teaching_patterns": {{
        "enthusiasm_triggers": [
          {{"topic": "practical applications of formulas", "vocal_cues": "voice becomes more animated, speaks faster, uses more hand gestures"}},
          {{"topic": "historical context of mathematical discoveries", "vocal_cues": "tone becomes reverent, speaking slows deliberately"}}
        ],
        "concept_specific_emotions": [
          {{"concept_id": "concept-3", "emotional_approach": "reassuring and patient", "rationale": "acknowledges this is typically challenging for students"}},
          {{"concept_id": "concept-1", "emotional_approach": "enthusiastic and energetic", "rationale": "foundational concept that instructor clearly enjoys teaching"}}
        ],
        "humor_style": {{
          "frequency": "occasional",
          "type": "self-deprecating and math-related analogies",
          "context": "used strategically to lighten mood when explaining particularly complex formulas"
        }}
      }}
    }}
    ```
    
    3. Storytelling Approach Example:
    ```json
    {{
      "storytelling_approach": {{
        "narrative_structures": [
          {{
            "pattern": "problem statement → historical context → solution method → real-world application",
            "frequency": "high",
            "effectiveness": "very engaging as it connects abstract math to concrete outcomes"
          }}
        ],
        "example_sources": {{
          "domains": ["finance", "engineering", "everyday household scenarios"],
          "recency": "mixes timeless examples with contemporary applications",
          "personalization": "often frames examples in terms of student career aspirations"
        }},
        "metaphor_preferences": [
          {{"concept_type": "complex formulas", "preferred_metaphor_domain": "cooking recipes"}},
          {{"concept_type": "mathematical relationships", "preferred_metaphor_domain": "family relationships"}}
        ]
      }}
    }}
    ```
    
    Be specific about unique teaching patterns and communication style to enable accurate emulation.
    Provide detailed observations about speech patterns, emotional teaching dynamics, and storytelling approaches.
    If the bridge_type is 'vsl' or 'webinar', ensure you thoroughly analyze and describe the persuasive communication strategies and goal-oriented tactics employed by the presenter.
    
    {instruction_context}
    """

    try:
        prompt_creation_time = time.time() - pass_start_time - formatting_duration
        print_timing("Teaching Persona - Prompt Creation", prompt_creation_time)

        api_call_start = time.time()
        response = model.generate_content([persona_prompt, video_file])
        api_call_duration = time.time() - api_call_start
        print_timing("Teaching Persona - Gemini API Call", api_call_duration)

        parsing_start = time.time()
        results = json.loads(response.text)
        parsing_duration = time.time() - parsing_start
        print_timing("Teaching Persona - Response Parsing", parsing_duration)

        pass_duration = time.time() - pass_start_time

        # Get key elements for logging - include new sections
        techniques = (
            results.get("teaching_persona", {})
            .get("pedagogical_approach", {})
            .get("explanation_techniques", [])
        )

        concept_approaches = results.get("teaching_persona", {}).get(
            "concept_specific_approaches", []
        )

        # Log new section extraction statistics
        speech_characteristics = "speech_characteristics" in results.get(
            "teaching_persona", {}
        )
        emotional_patterns = "emotional_teaching_patterns" in results.get(
            "teaching_persona", {}
        )
        storytelling = "storytelling_approach" in results.get("teaching_persona", {})

        new_sections = [
            section
            for section, exists in [
                ("speech_characteristics", speech_characteristics),
                ("emotional_teaching_patterns", emotional_patterns),
                ("storytelling_approach", storytelling),
            ]
            if exists
        ]

        print_timing("PASS 3: Teaching Persona Extraction (Total)", pass_duration)
        print(
            f"✅ Teaching persona extraction complete: {len(techniques)} techniques, {len(concept_approaches)} concept-specific approaches identified"
        )
        if new_sections:
            print(f"✨ Enhanced persona sections extracted: {', '.join(new_sections)}")
        return results
    except Exception as e:
        logger.error(f"Teaching persona extraction error: {e}")
        print(f"❌ Teaching persona extraction failed: {str(e)}")
        return {"teaching_persona": {}}


def extract_document_knowledge(
    document_file, timeline_data, knowledge_data, model, log_collector=None
) -> Dict[str, Any]:
    """
    PASS 4: Extract document-specific knowledge (optional)

    Args:
        document_file: Uploaded document file
        timeline_data: Data from timeline extraction
        knowledge_data: Data from knowledge extraction
        model: Configured Gemini model

    Returns:
        Dictionary containing document knowledge
    """
    if not document_file:
        print("📝 Document extraction skipped (no document provided)")
        return {"document_knowledge": {}}

    pass_start_time = time.time()
    print(f"🔍 EXTRACTION PASS 4: Extracting document-specific knowledge...")

    # Get concepts to link document content to existing knowledge
    formatting_start = time.time()
    concepts_json = json.dumps(
        knowledge_data.get("knowledge_base", {}).get("core_concepts", []), indent=2
    )
    formatting_duration = time.time() - formatting_start
    print_timing("Document Knowledge - Context Formatting", formatting_duration)

    document_prompt = f"""
    Analyze this document to extract structured knowledge that complements the video content.
    
    Link document content to these concepts where possible:
    ```
    {concepts_json}
    ```
    
    Focus on extracting:
    1. Document structure and organization
    2. Visual elements (charts, diagrams, tables)
    3. Formal definitions and technical details
    4. Mathematical formulas and equations
    5. References and citations

    Return ONLY a JSON object with this structure:
    {{
      "document_knowledge": {{
        "structure": {{
          "sections": [
            {{
              "title": "str",
              "page_numbers": [1],
              "summary": "str",
              "related_concepts": ["concept-id"]
            }}
          ]
        }},
        "visual_elements": [
          {{
            "type": "chart/diagram/table",
            "page_number": 1,
            "description": "str",
            "key_insights": ["str"],
            "related_concepts": ["concept-id"]
          }}
        ],
        "formal_definitions": [
          {{
            "term": "str",
            "definition": "str",
            "page_number": 1,
            "related_concept": "concept-id"
          }}
        ],
        "mathematical_content": [
          {{
            "type": "equation/formula/proof",
            "content": "str",
            "explanation": "str",
            "page_number": 1,
            "related_concept": "concept-id"
          }}
        ],
        "references": [
          {{
            "text": "str",
            "page_number": 1,
            "type": "citation/reference/footnote"
          }}
        ]
      }}
    }}
    
    Focus on elements that complement or extend the video content.
    Ensure page numbers are accurate.
    Link document elements to related concepts from the knowledge base where possible.
    """

    try:
        prompt_creation_time = time.time() - pass_start_time - formatting_duration
        print_timing("Document Knowledge - Prompt Creation", prompt_creation_time)

        api_call_start = time.time()
        response = model.generate_content([document_prompt, document_file])
        api_call_duration = time.time() - api_call_start
        print_timing("Document Knowledge - Gemini API Call", api_call_duration)

        parsing_start = time.time()
        results = json.loads(response.text)
        parsing_duration = time.time() - parsing_start
        print_timing("Document Knowledge - Response Parsing", parsing_duration)

        pass_duration = time.time() - pass_start_time

        # Count elements for logging
        visual_count = len(
            results.get("document_knowledge", {}).get("visual_elements", [])
        )
        definition_count = len(
            results.get("document_knowledge", {}).get("formal_definitions", [])
        )

        print_timing("PASS 4: Document Knowledge Extraction (Total)", pass_duration)
        print(
            f"✅ Document knowledge extraction complete: {visual_count} visual elements, {definition_count} formal definitions extracted"
        )
        return results
    except Exception as e:
        logger.error(f"Document knowledge extraction error: {e}")
        print(f"❌ Document knowledge extraction failed: {str(e)}")
        return {"document_knowledge": {}}


def extract_engagement_opportunities(
    video_file,
    timeline_data,
    knowledge_data,
    persona_data,
    doc_data,
    model,
    log_collector=None,
    bridge_type="course",
    additional_instructions="",
) -> Dict[str, Any]:
    """
    PASS 5: Extract engagement opportunities using all previous data

    Args:
        video_file: Uploaded video file
        timeline_data: Data from timeline extraction
        knowledge_data: Data from knowledge extraction
        persona_data: Data from persona extraction
        doc_data: Data from document extraction
        model: Configured Gemini model

    Returns:
        Dictionary containing engagement opportunities
    """
    pass_start_time = time.time()
    print(
        f"🔍 EXTRACTION PASS 5: Extracting engagement opportunities and quiz points..."
    )

    # Format key data for the prompt
    formatting_start = time.time()
    # Get key concepts
    concepts = knowledge_data.get("knowledge_base", {}).get("core_concepts", [])
    concept_names = [c.get("name") for c in concepts if "name" in c]
    concepts_list = ", ".join(
        concept_names[:10]
    )  # Use first 10 to keep prompt size reasonable

    # Get teaching approach
    teaching_approach = persona_data.get("teaching_persona", {}).get(
        "pedagogical_approach", {}
    )
    teaching_approach_json = json.dumps(teaching_approach, indent=2)

    # Get timeline structure for identifying engagement points
    sections = timeline_data.get("video_timeline", {}).get("pedagogical_structure", [])
    sections_json = json.dumps(sections, indent=2)
    formatting_duration = time.time() - formatting_start
    print_timing("Engagement Opportunities - Context Formatting", formatting_duration)

    # --- Dynamic Prompt Generation Based on Bridge Type ---
    output_structure_prompt = ""
    example_prompt = ""
    engagement_goal_instruction = ""

    if bridge_type == "vsl":
        engagement_goal_instruction = "Identify strategic points to proactively engage the user with `guided_conversation`. The GOAL of these engagements is to handle objections (e.g., price, timing, features), reinforce value/ROI, build urgency, uncover needs, qualify leads, and guide directly towards the conversion CTA (e.g., checkout, demo request). Design the `conversation_flow` elements (`goal`, `agent_initiator`, `user_responses`, `agent_followup_strategy`) to reflect specific sales tactics and psychological principles. For example, an `agent_initiator` might use a leading question to uncover a pain point, and an `agent_followup_strategy` might involve reframing an objection or using social proof."
        output_structure_prompt = f"""
        Return ONLY a JSON object with this structure:
        {{ 
          "engagement_opportunities": [
            {{
              "id": "engagement-1", 
              "timestamp": "HH:MM:SS",
              "section_id": "section-id",
              "engagement_type": "guided_conversation", // Fixed type for VSL/Webinar
              "concepts_addressed": ["concept-id"],
              "rationale": "str (Why engage here? e.g., Address pricing concern)",
              "conversation_flow": {{ // Specific structure for guided convos
                "goal": "str (e.g., Build rapport, handle objection)",
                "agent_initiator": "str (What the agent says first)",
                "user_responses": [ // Guidance for LLM on how to react
                  {{"type": "positive_interest", "agent_followup_strategy": "str (e.g., Reinforce value, ask qualifying question, pivot to CTA)"}},
                  {{"type": "objection_price", "agent_followup_strategy": "str (e.g., Acknowledge, reframe on value/ROI, mention payment plans)"}},
                  {{"type": "objection_timing", "agent_followup_strategy": "str (e.g., Explore concerns, create urgency if appropriate, offer to schedule follow-up)"}},
                  {{"type": "objection_feature_missing", "agent_followup_strategy": "str (e.g., Understand need, explain workaround, note feedback, pivot to existing strengths)"}},
                  {{"type": "needs_more_info", "agent_followup_strategy": "str (e.g., Ask clarifying questions, provide specific detail, offer resource)"}},
                  {{"type": "needs_social_proof", "agent_followup_strategy": "str (e.g., Share testimonial snippet, mention credible user numbers)"}}
                ],
                "fallback": "str (Agent message if user doesn't engage, e.g., 'No problem, let me continue...')"
              }}
            }}
          ]
        }}
        """
        example_prompt = f"""
        Examples of good `guided_conversation` flows:

        1. VSL - Price Objection Handling:
        {{
          "id": "engagement-vsl-price",
          "timestamp": "00:05:30",
          "section_id": "section-vsl-offer",
          "engagement_type": "guided_conversation",
          "concepts_addressed": ["pricing_value"],
          "rationale": "Proactively address potential price objection after revealing cost.",
          "conversation_flow": {{
            "goal": "Acknowledge price, re-emphasize value and ROI.",
            "agent_initiator": "I know investing in growth is a big decision. When you think about the potential return we discussed regarding [Specific Benefit], how does the pricing feel in that context?",
            "user_responses": [
              {{"type": "still_expensive", "agent_followup_strategy": "Validate concern (e.g., 'I understand budget is key.'), break down ROI (e.g., 'Consider that this could save you X hours a week, translating to Y dollars a month.'), mention payment options if applicable."}},
              {{"type": "seems_fair", "agent_followup_strategy": "Reinforce decision (e.g., 'Great, many find it offers significant value.'), smoothly transition to checkout/next step (e.g., 'You can lock that in by clicking below.')."}},
              {{"type": "request_discount", "agent_followup_strategy": "Explain value justifies cost (e.g., 'We price it to reflect the comprehensive features and support.'), potentially mention limited-time offers if applicable (e.g., 'While we don't typically discount, there is a launch bonus active this week.')."}}
            ],
            "fallback": "We can definitely circle back to pricing details later. For now, let me show you how the integration works..."
          }}
        }}

        2. VSL - Urgency/CTA Push:
        {{
          "id": "engagement-vsl-cta",
          "timestamp": "00:02:05",
          "section_id": "section-vsl-finalpush",
          "engagement_type": "guided_conversation",
          "concepts_addressed": ["call_to_action", "limited_time_offer"],
          "rationale": "Reinforce the offer and guide towards the CTA button just before the final sign-off.",
          "conversation_flow": {{
            "goal": "Encourage immediate action on the CTA.",
            "agent_initiator": "We've covered a lot, and hopefully, you see the value. This special launch pricing won't last forever – are you ready to lock it in now by clicking the button below?",
            "user_responses": [
              {{"type": "positive_intent", "agent_followup_strategy": "Excellent! Click that button and I'll see you on the inside. Any quick questions before you do?"}},
              {{"type": "hesitation_cost", "agent_followup_strategy": "I understand, it's an investment. Remember the ROI we calculated earlier, or the [Key Differentiator]? This price makes it even easier to achieve that quickly. What specific part of the cost is giving you pause?"}},
              {{"type": "hesitation_need_more_info", "agent_followup_strategy": "No problem, what specific question is holding you back right now? I can clarify before you decide. Is it about [Feature X] or [Integration Y]?"}},
              {{"type": "hesitation_timing", "agent_followup_strategy": "I get that timing is important. Is there something specific changing soon, or is it more about needing to discuss with others? Perhaps locking in the current offer while you finalize things is an option?"}}
            ],
            "fallback": "Feel free to explore more, but don't miss out on this offer! The button is right below when you're ready."
          }}
        }} 
        """
    elif bridge_type == "webinar":
        engagement_goal_instruction = "Identify strategic points to proactively engage the user with `guided_conversation`. The GOAL is to check understanding, qualify interest, share relevant resources, facilitate Q&A, and guide towards the next step (e.g., booking a meeting, downloading a resource). Design `conversation_flow` elements to support these goals, making interactions feel consultative and value-driven. For example, an `agent_initiator` could ask about specific challenges to tailor information, and `agent_followup_strategy` could involve offering a case study or suggesting a personalized demo."
        output_structure_prompt = f"""
    Return ONLY a JSON object with this structure:
    {{
      "engagement_opportunities": [
        {{
          "id": "engagement-1",
          "timestamp": "HH:MM:SS",
          "section_id": "section-id",
              "engagement_type": "guided_conversation", // Fixed type for VSL/Webinar
          "concepts_addressed": ["concept-id"],
              "rationale": "str (Why engage here? e.g., Qualify interest, offer resource)",
              "conversation_flow": {{ // Specific structure for guided convos
                "goal": "str (e.g., Qualify lead, facilitate Q&A, offer resource)",
                "agent_initiator": "str (What the agent says first, e.g., a qualifying question or resource offer)",
                "user_responses": [ // Guidance for LLM on how to react
                  {{"type": "positive_interest", "agent_followup_strategy": "str (e.g., Ask deeper qualifying question, offer related resource, suggest next step like demo booking)"}},
                  {{"type": "specific_question", "agent_followup_strategy": "str (e.g., Answer directly, offer to take offline, point to documentation, connect with specialist)"}},
                  {{"type": "needs_clarification", "agent_followup_strategy": "str (e.g., Rephrase, provide simpler explanation, offer analogy)"}},
                  {{"type": "shares_challenge", "agent_followup_strategy": "str (e.g., Acknowledge, relate to solution, offer targeted advice or resource)"}},
                  {{"type": "requests_resource", "agent_followup_strategy": "str (e.g., Provide link/info, offer to email it, confirm receipt)"}}
                ],
                "fallback": "str (Agent message if user doesn't engage, e.g., 'Okay, let's move on to our next topic...')"
              }}
            }}
          ]
        }}
        """
        example_prompt = f"""
        Examples of good `guided_conversation` flows for Webinar:

        1. Webinar - Qualification & Rapport:
        {{
          "id": "engagement-webinar-qualify1",
          "timestamp": "00:15:10",
          "section_id": "section-webinar-demo",
          "engagement_type": "guided_conversation",
          "concepts_addressed": ["use_case_fit"],
          "rationale": "Qualify lead interest after showing a key feature.",
          "conversation_flow": {{
            "goal": "Understand viewer's context and gauge interest level.",
            "agent_initiator": "Seeing that [Demoed Feature] in action, how does that align with the challenges you're currently facing with [Related Problem Area]? Or perhaps, what's the biggest hurdle you see in implementing something like this?",
            "user_responses": [
              {{"type": "high_relevance_challenge_stated", "agent_followup_strategy": "Acknowledge fit and challenge (e.g., 'That makes sense, [Challenge] is a common issue.'), ask follow-up about specific needs (e.g., 'Tell me more about how that impacts your workflow.'), suggest booking a call for personalized demo (e.g., 'A quick 15-min chat could clarify how we tackle that specifically.')."}},
              {{"type": "low_relevance_or_no_challenge", "agent_followup_strategy": "Thank for feedback (e.g., 'Appreciate the insight.'), ask what their primary focus or interest is instead (e.g., 'What aspects are most critical for your evaluation today?')."}},
              {{"type": "unclear_question_or_unsure", "agent_followup_strategy": "Rephrase the question more simply (e.g., 'In other words, could this feature help with tasks like X or Y for you?'). Offer a different angle (e.g., 'Or is there another area you were hoping to see addressed?')."}}
            ],
            "fallback": "Okay, let's continue with the next feature..."
          }}
        }}

        2. Webinar - Resource Sharing & Q&A Prompt:
        {{
          "id": "engagement-webinar-resource1",
          "timestamp": "00:25:00",
          "section_id": "section-webinar-integration",
          "engagement_type": "guided_conversation",
          "concepts_addressed": ["api_integration"],
          "rationale": "Offer technical documentation and prompt for questions after discussing integrations.",
          "conversation_flow": {{
            "goal": "Provide deeper resource and solicit technical questions.",
            "agent_initiator": "For those interested in the technical details, I've just dropped a link to our API documentation in the chat. We also have a whitepaper on [Related Topic]. Any initial integration questions, or would the whitepaper be useful for your team?",
            "user_responses": [
              {{"type": "specific_technical_question", "agent_followup_strategy": "Answer concisely if possible (e.g., 'Yes, it supports OAuth 2.0.'). Offer to connect with tech team via booked call if too complex (e.g., 'That's a great detailed question, our solutions architect could walk you through that.')."}},
              {{"type": "no_question_requests_whitepaper", "agent_followup_strategy": "Great, glad that was clear. I can ensure the whitepaper link is sent to you. We can always dive deeper in a follow-up session."}},
              {{"type": "request_case_study_or_example", "agent_followup_strategy": "Provide link to relevant case study if available (e.g., 'We have a case study with [Similar Company] that touches on that.'), or offer to send one after the webinar (e.g., 'I can follow up with a relevant example.')."}}
            ],
            "fallback": "Alright, let's move on to the security aspects then."
          }}
        }} 
        """
    else:
        # Determine specific goal based on course vs onboarding
        if bridge_type == "onboarding":
            engagement_goal_instruction = "Identify strategic points to check procedural understanding, offer contextual tips, confirm task completion, or provide links to relevant features/help docs. Generate a mix of short quizzes and helpful guided conversations."
        else:  # course (default)
            engagement_goal_instruction = "Identify strategic points where a knowledge check (quiz), discussion prompt, or reflective guided conversation would reinforce conceptual understanding and learning."

        output_structure_prompt = f"""
        Return ONLY a JSON object with this structure:
        {{
          "engagement_opportunities": [
            {{
              "id": "engagement-1", 
              "timestamp": "HH:MM:SS",
              "section_id": "section-id",
              "engagement_type": "quiz/discussion/guided_conversation", // Can be quiz, discussion, or guided convo
              "concepts_addressed": ["concept-id"],
              "rationale": "str (Why engage here? e.g., Check understanding / Offer tip)",
              "quiz_items": [ {{ ... structure as before ... }} ], // Include ONLY if engagement_type is quiz/discussion
              "conversation_flow": {{ ... structure as before ... }} // Include ONLY if engagement_type is guided_conversation
            }}
          ]
        }}
        """
        example_prompt = f"""
        Examples for Course/Onboarding:
        
        1. Multiple-choice example (Course):
    {{
      "question": "What is the primary advantage of compound interest over simple interest?",
      "question_type": "multiple_choice",
      "options": [
        "Interest is calculated only on the initial principal",
        "Interest is calculated on both principal and accumulated interest",
        "Interest rates are always higher",
        "Banks prefer to use this calculation method"
      ],
      "correct_option": "Interest is calculated on both principal and accumulated interest",
      "explanation": "Compound interest calculates interest on both the initial principal and any interest already earned, creating an exponential growth effect over time.",
      "follow_up": {{
        "if_correct": "Exactly! This exponential growth effect is why Einstein allegedly called compound interest 'the eighth wonder of the world.'",
        "if_incorrect": "Not quite. The key difference is that compound interest calculates interest on both your initial investment AND any interest already earned, leading to exponential growth."
      }}
    }}
    
        3. Guided Conversation example (Onboarding - Task Tip):
        {{
          "id": "engagement-onboarding-tip1",
          "timestamp": "00:03:45",
          "section_id": "section-onboarding-step3",
          "engagement_type": "guided_conversation",
          "concepts_addressed": ["user_permission_settings"],
          "rationale": "Offer a proactive tip for a potentially confusing step.",
          "conversation_flow": {{
            "goal": "Help user avoid common error with permissions.",
            "agent_initiator": "Just a quick tip here: when setting permissions, remember that the 'Admin' role grants full access. Double-check you've selected the right role before saving. Did that make sense?",
            "user_responses": [
              {{"type": "confirmation_understanding", "agent_followup_strategy": "Great! Let me know if you have other questions as you proceed."}},
              {{"type": "request_clarification", "agent_followup_strategy": "Sure, the main difference between Admin and Editor is... [brief explanation]."}}
            ],
            "fallback": "Okay, continuing to the next step..."
          }}
        }}

        4. Guided Conversation example (Course - Socratic Prompt):
        {{
          "id": "engagement-course-socratic1",
          "timestamp": "00:12:20",
          "section_id": "section-course-concept2",
          "engagement_type": "guided_conversation",
          "concepts_addressed": ["concept_tradeoffs"],
          "rationale": "Prompt deeper reflection on the implications of a concept.",
          "conversation_flow": {{
            "goal": "Encourage critical thinking about concept limitations.",
            "agent_initiator": "We just discussed the benefits of [Concept X]. What potential downsides or limitations do you think might exist with this approach?",
            "user_responses": [
              {{"type": "identifies_valid_limitation", "agent_followup_strategy": "That's a great point to consider. How might you mitigate that specific risk?"}},
              {{"type": "struggles_to_answer", "agent_followup_strategy": "Think about situations where [Condition Y] applies. How might [Concept X] perform then?"}}
            ],
            "fallback": "That's something to keep in mind. Let's look at another example..."
          }}
        }}
        """

    # Add additional instructions if provided
    instruction_context = ""
    if additional_instructions:
        instruction_context = f"\n\nAlso consider these specific instructions when designing engagement points: {additional_instructions}"

    engagement_prompt = f"""
    Analyze this video to identify ideal moments for student engagement, quizzes, and interactive elements.
    
    {engagement_goal_instruction}

    Consider these key concepts: {concepts_list}
    
    The instructor's teaching approach is:
    ```
    {teaching_approach_json}
    ```
    
    The video timeline structure is:
    ```
    {sections_json}
    ```
    
    Identify 3-5 strategic points where:
    1. A concept has just been explained
    2. A natural pause or transition occurs
    3. A knowledge check would reinforce learning
    4. A potential confusion point needs clarification

    Important CONSTRAINTS:
    -Do not include any points that are not in the video timeline
    -Every engagement opportunity must have only 1 quiz or discussion question
    -Do not include the same engagement opportunity more than once
    -Engagement opportunities should be placed at a point where the instructor would naturally pause
    -Engagement opportunities cannot be at a timestamp that is greater than the video length or before the start of the video.
    -CRITICAL: All 'agent_initiator' text MUST ONLY contain standard alphanumeric characters, spaces, and basic punctuation (period, comma, question mark, exclamation point, colon, semicolon, dash, apostrophe). DO NOT include any other special characters, emojis, bullets, or unusual symbols.

    Follow the specific JSON structure requested below based on the bridge type.
    {output_structure_prompt}
    
    IMPORTANT: For multiple-choice questions (Course/Onboarding), provide 4 options with 1 correct answer and 3 plausible distractors.
    
    {example_prompt}
    
    Ensure questions match the instructor's style and complexity level.
    Create questions that genuinely test understanding rather than simple recall.
    Provide variations of expected answers to handle different phrasings.
    Design follow-up responses that mimic the instructor's teaching approach.
    For `guided_conversation`, focus on natural, proactive dialogue starters and strategies that align with the bridge_type's specific goals (e.g., sales conversion for VSL, lead qualification for Webinar, learning reinforcement for Course, task completion for Onboarding).
    Remember to keep all text in 'agent_initiator' clean with only standard characters - no special symbols or emojis.

    {instruction_context}
    """

    try:
        prompt_creation_time = time.time() - pass_start_time - formatting_duration
        print_timing("Engagement Opportunities - Prompt Creation", prompt_creation_time)

        api_call_start = time.time()
        response = model.generate_content([engagement_prompt, video_file])
        api_call_duration = time.time() - api_call_start
        print_timing("Engagement Opportunities - Gemini API Call", api_call_duration)

        parsing_start = time.time()
        results = json.loads(response.text)
        parsing_duration = time.time() - parsing_start
        print_timing("Engagement Opportunities - Response Parsing", parsing_duration)

        pass_duration = time.time() - pass_start_time

        # Count opportunities for logging
        opportunity_count = len(results.get("engagement_opportunities", []))
        question_count = sum(
            len(opp.get("quiz_items", []))
            for opp in results.get("engagement_opportunities", [])
        )

        print_timing(
            "PASS 5: Engagement Opportunities Extraction (Total)", pass_duration
        )
        print(
            f"✅ Engagement opportunities extraction complete: {opportunity_count} opportunities with {question_count} quiz questions identified"
        )
        return results
    except Exception as e:
        logger.error(f"Engagement opportunities extraction error: {e}")
        print(f"❌ Engagement opportunities extraction failed: {str(e)}")
        return {"engagement_opportunities": []}


def integrate_knowledge(
    timeline_data,
    knowledge_data,
    persona_data,
    document_data,
    engagement_data,
    model,
    log_collector=None,
    bridge_type="course",
) -> Dict[str, Any]:
    """
    FINAL PASS: Minimally combine all extracted components preserving their raw structure

    Args:
        timeline_data: Video timeline data
        knowledge_data: Knowledge base data
        persona_data: Teaching persona data
        document_data: Document knowledge data
        engagement_data: Engagement opportunities data
        model: Configured Gemini model

    Returns:
        Combined knowledge structure for Brdge AI agent
    """
    pass_start_time = time.time()
    print(f"🔄 FINAL PASS: Combining extraction components...")

    # Define widget mapping based on bridge type
    WIDGET_MAP = {
        "webinar": [
            "chat",
            "cta-calendar",
        ],  # Assuming guided_conversation handled by chat
        "vsl": ["chat", "cta-checkout"],  # Assuming guided_conversation handled by chat
        "course": [
            "chat",
            "quiz",
            "progress_bar",
        ],  # Keep quiz widget for explicit course quizzes
        "onboarding": [
            "chat",
            "deep_link",
            "inline_tip",
        ],  # Onboarding uses chat for tips/checks
        "default": ["chat"],  # Fallback
    }
    widgets = WIDGET_MAP.get(bridge_type, WIDGET_MAP["default"])

    # Simple combination of all extracted data
    unified_data = {
        # Add metadata for identification
        "extraction_metadata": {
            "timestamp": datetime.now().isoformat(),
            "bridge_type": bridge_type,  # Store the type used for extraction
            "components": [
                "video_timeline",
                "knowledge_base",
                "teaching_persona",
                "document_knowledge",
                "engagement_opportunities",
                "widgets",  # Added widgets component
            ],
        },
        "bridge_type": bridge_type,  # Add type at top level too
        "widgets": widgets,  # Add the determined widgets
        # Include all raw components
        "video_timeline": timeline_data.get("video_timeline", {}),
        "document_timeline": timeline_data.get("document_timeline", {}),
        "knowledge_base": knowledge_data.get("knowledge_base", {}),
        "teaching_persona": persona_data.get("teaching_persona", {}),
        "document_knowledge": document_data.get("document_knowledge", {}),
        "engagement_opportunities": engagement_data.get("engagement_opportunities", []),
    }

    # No complex processing, just report statistics
    pass_duration = time.time() - pass_start_time
    print_timing("FINAL PASS: Data Combination (Total)", pass_duration)

    # Count components for reporting
    components_stats = {
        "timeline_sections": len(
            unified_data["video_timeline"].get("pedagogical_structure", [])
        ),
        "document_sections": len(unified_data["document_timeline"].get("sections", [])),
        "core_concepts": len(unified_data["knowledge_base"].get("core_concepts", [])),
        "engagement_points": len(unified_data["engagement_opportunities"]),
    }

    print(
        f"✅ Knowledge components combined: {', '.join([f'{k}: {v}' for k, v in components_stats.items()])}"
    )
    return unified_data


#################################################
# MAIN EXTRACTION PIPELINE
#################################################


def create_brdge_knowledge(
    video_path,
    document_path=None,
    brdge_id=None,
    callback=None,
    bridge_type="course",
    additional_instructions="",
):
    """
    Create a comprehensive knowledge base through multi-pass extraction

    Args:
        video_path: Path to the video file
        document_path: Optional path to a document file
        brdge_id: ID of the Brdge being processed
        callback: Function to call with log updates

    Returns:
        Unified JSON knowledge base for Brdge
    """
    overall_start_time = time.time()

    # Create log collector
    log_collector = LogCollector(brdge_id, callback)

    log_message = f"\n🚀 Starting multi-pass knowledge extraction: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    print(log_message)
    log_collector.add_log(log_message, status="info")

    log_message = f"🧬 Bridge Type: {bridge_type}"
    print(log_message)
    log_collector.add_log(log_message, status="info")
    if additional_instructions:
        log_message = f"📝 Additional Instructions: {additional_instructions[:100]}..."  # Log truncated instructions
    print(log_message)
    log_collector.add_log(log_message, status="info")

    log_message = f"📹 Video: {os.path.basename(video_path)}"
    print(log_message)
    log_collector.add_log(log_message, status="info")

    if document_path:
        log_message = f"📄 Document: {os.path.basename(document_path)}"
        print(log_message)
        log_collector.add_log(log_message, status="info")

    try:
        # Configure Gemini
        config_start = time.time()
        configure_genai()
        model = get_model()
        config_duration = time.time() - config_start
        print_timing(
            "API and Model Configuration", config_duration, log_collector=log_collector
        )
        log_collector.update_progress(5)  # 5% progress

        # Upload files to Gemini
        upload_start = time.time()
        log_message = f"📤 Uploading video to Gemini API..."
        print(log_message)
        log_collector.add_log(log_message, status="info")

        video_file = genai.upload_file(path=video_path)
        video_upload_duration = time.time() - upload_start
        print_timing("Video Upload", video_upload_duration, log_collector=log_collector)
        log_collector.update_progress(10)  # 10% progress

        document_file = None
        doc_upload_duration = 0
        if document_path and os.path.exists(document_path):
            doc_upload_start = time.time()
            log_message = f"📤 Uploading document to Gemini API..."
            print(log_message)
            log_collector.add_log(log_message, status="info")

            document_file = genai.upload_file(path=document_path)
            doc_upload_duration = time.time() - doc_upload_start
            print_timing(
                "Document Upload", doc_upload_duration, log_collector=log_collector
            )
            log_collector.update_progress(15)  # 15% progress

        # Wait for processing to complete
        processing_start = time.time()
        while video_file.state.name == "PROCESSING":
            log_message = "⏳ Processing video file..."
            print(log_message)
            log_collector.add_log(log_message, status="info")
            time.sleep(2)
            video_file = genai.get_file(name=video_file.name)

        if document_file and document_file.state.name == "PROCESSING":
            log_message = "⏳ Processing document file..."
            print(log_message)
            log_collector.add_log(log_message, status="info")
            time.sleep(2)
            document_file = genai.get_file(name=document_file.name)

        processing_duration = time.time() - processing_start
        print_timing(
            "File Processing Wait Time",
            processing_duration,
            log_collector=log_collector,
        )

        log_message = f"✅ File uploads complete and ready for processing"
        print(log_message)
        log_collector.add_log(log_message, status="success")
        log_collector.update_progress(20)  # 20% progress

        # PASS 1: Extract initial timelines
        pass1_start = time.time()
        log_message = f"🔍 EXTRACTION PASS 1: Extracting parallel content timelines..."
        print(log_message)
        log_collector.add_log(log_message, status="info")

        # Call the extraction function with log_collector
        timelines = extract_initial_timelines(
            video_file, document_file, model, log_collector
        )
        pass1_duration = time.time() - pass1_start
        print_timing(
            "PASS 1: Timeline Extraction - Total Pass Time",
            pass1_duration,
            include_emoji=False,
            log_collector=log_collector,
        )
        log_collector.update_progress(35)  # 35% progress

        # PASS 2: Extract knowledge base
        pass2_start = time.time()
        log_message = (
            f"🔍 EXTRACTION PASS 2: Extracting knowledge base and concept network..."
        )
        print(log_message)
        log_collector.add_log(log_message, status="info")

        knowledge_data = extract_knowledge_base(
            video_file,
            document_file,
            timelines,
            model,
            log_collector,
            bridge_type,
            additional_instructions,
        )
        pass2_duration = time.time() - pass2_start
        print_timing(
            "PASS 2: Knowledge Base Extraction - Total Pass Time",
            pass2_duration,
            include_emoji=False,
            log_collector=log_collector,
        )
        log_collector.update_progress(50)  # 50% progress

        # PASS 3: Extract teaching persona
        pass3_start = time.time()
        log_message = f"🔍 EXTRACTION PASS 3: Extracting teaching persona and communication style..."
        print(log_message)
        log_collector.add_log(log_message, status="info")

        persona_data = extract_teaching_persona(
            video_file,
            timelines,
            knowledge_data,
            model,
            log_collector,
            bridge_type,
            additional_instructions,
        )
        pass3_duration = time.time() - pass3_start
        print_timing(
            "PASS 3: Teaching Persona Extraction - Total Pass Time",
            pass3_duration,
            include_emoji=False,
            log_collector=log_collector,
        )
        log_collector.update_progress(65)  # 65% progress

        # PASS 4: Extract document knowledge (if document provided)
        pass4_start = time.time()
        log_message = f"🔍 EXTRACTION PASS 4: Extracting document-specific knowledge..."
        print(log_message)
        log_collector.add_log(log_message, status="info")

        document_data = extract_document_knowledge(
            document_file, timelines, knowledge_data, model, log_collector
        )
        pass4_duration = time.time() - pass4_start
        if document_file:
            print_timing(
                "PASS 4: Document Knowledge Extraction - Total Pass Time",
                pass4_duration,
                include_emoji=False,
                log_collector=log_collector,
            )
        log_collector.update_progress(80)  # 80% progress

        # PASS 5: Extract engagement opportunities
        pass5_start = time.time()
        log_message = f"🔍 EXTRACTION PASS 5: Extracting engagement opportunities and quiz points..."
        print(log_message)
        log_collector.add_log(log_message, status="info")

        engagement_data = extract_engagement_opportunities(
            video_file,
            timelines,
            knowledge_data,
            persona_data,
            document_data,
            model,
            log_collector,
            bridge_type,
            additional_instructions,
        )
        pass5_duration = time.time() - pass5_start
        print_timing(
            "PASS 5: Engagement Opportunities Extraction - Total Pass Time",
            pass5_duration,
            include_emoji=False,
            log_collector=log_collector,
        )
        log_collector.update_progress(90)  # 90% progress

        # FINAL PASS: Integrate all components
        final_pass_start = time.time()
        log_message = f"🔄 FINAL PASS: Combining extraction components..."
        print(log_message)
        log_collector.add_log(log_message, status="info")

        unified_data = integrate_knowledge(
            timelines,
            knowledge_data,
            persona_data,
            document_data,
            engagement_data,
            model,
            log_collector,
            bridge_type,
        )
        final_pass_duration = time.time() - final_pass_start
        print_timing(
            "FINAL PASS: Knowledge Integration - Total Pass Time",
            final_pass_duration,
            include_emoji=False,
            log_collector=log_collector,
        )
        log_collector.update_progress(95)  # 95% progress

        # Report completion
        overall_duration = time.time() - overall_start_time
        log_message = (
            f"\n✨ Multi-pass extraction completed in {overall_duration:.2f} seconds"
        )
        print(log_message)
        log_collector.add_log(log_message, status="success")

        # Print timing summary
        log_message = "\n⏱️ TIMING SUMMARY:"
        print(log_message)
        log_collector.add_log(log_message, status="info")

        log_message = f"   - Configuration & Setup: {config_duration:.2f}s"
        print(log_message)
        log_collector.add_log(log_message, status="info")

        log_message = (
            f"   - File Uploads: {video_upload_duration + doc_upload_duration:.2f}s"
        )
        print(log_message)
        log_collector.add_log(log_message, status="info")

        log_message = f"   - File Processing: {processing_duration:.2f}s"
        print(log_message)
        log_collector.add_log(log_message, status="info")

        log_message = f"   - PASS 1 (Timeline): {pass1_duration:.2f}s"
        print(log_message)
        log_collector.add_log(log_message, status="info")

        log_message = f"   - PASS 2 (Knowledge): {pass2_duration:.2f}s"
        print(log_message)
        log_collector.add_log(log_message, status="info")

        log_message = f"   - PASS 3 (Persona): {pass3_duration:.2f}s"
        print(log_message)
        log_collector.add_log(log_message, status="info")

        if document_file:
            log_message = f"   - PASS 4 (Document): {pass4_duration:.2f}s"
            print(log_message)
            log_collector.add_log(log_message, status="info")

        log_message = f"   - PASS 5 (Engagement): {pass5_duration:.2f}s"
        print(log_message)
        log_collector.add_log(log_message, status="info")

        log_message = f"   - FINAL PASS (Integration): {final_pass_duration:.2f}s"
        print(log_message)
        log_collector.add_log(log_message, status="info")

        log_message = f"   - TOTAL EXTRACTION TIME: {overall_duration:.2f}s"
        print(log_message)
        log_collector.add_log(log_message, status="info")

        log_collector.update_progress(100)  # 100% progress - completed

        return unified_data

    except Exception as e:
        overall_duration = time.time() - overall_start_time
        logger.error(f"Error in knowledge extraction pipeline: {e}")

        log_message = (
            f"\n❌ Extraction failed after {overall_duration:.2f} seconds: {str(e)}"
        )
        print(log_message)
        log_collector.add_log(log_message, status="error")

        # Return minimal structure with error information
        return {
            "error": str(e),
            "metadata": {
                "title": os.path.basename(video_path),
                "extraction_error": True,
                "error_message": str(e),
            },
        }


def generate_logic_puzzle_challenge(model, job_role: str) -> Optional[Dict[str, Any]]:
    """Generates an immersive, tech-themed logic puzzle using Gemini."""
    prompt = f"""
    Design a visually distinctive and challenging logic puzzle for a {job_role} candidate. 
    Create a scenario that feels like a high-stakes tech challenge they might face in the real world.
    Focus on spatial reasoning, pattern recognition, or algorithmic thinking - something that tests how they approach complex problems.
    
    Make it VISUALLY INTERESTING - the puzzle should involve a mental image that's easy to visualize (patterns, sequences, diagrams), 
    with elements that could be rendered graphically on the frontend.
    
    The puzzle should be:
    1. ORIGINAL - not a classic puzzle people would recognize
    2. CHALLENGING but solvable in 3-5 minutes with careful thought
    3. RELEVANT to technical thinking (e.g., network topology, distributed systems, algorithmic patterns)
    4. DISTINCTIVE VISUALLY with clear elements that could be rendered (nodes, connections, patterns)
    
    Return ONLY a JSON object with this exact structure:
    {{
      "id": "logic-puzzle-visual",
      "type": "logic_puzzle",
      "title": "str (Short, intriguing title)",
      "description": "str (Vivid scenario with clear visual elements that could be rendered)",
      "visual_elements": "str (Describe what should be visualized: e.g., 'A network with 5 nodes in a specific arrangement')",
      "question": "str (The precise question to solve)",
      "expectedOutputType": "multiple_choice",
      "options": ["str (Option A)", "str (Option B)", "str (Option C)", "str (Option D)"],
      "validation_criteria": {{
        "correct_option_index": int,
        "explanation": "str (Why this is the correct answer, with logical steps)"
      }}
    }}

    Example:
    {{
      "id": "logic-puzzle-visual",
      "type": "logic_puzzle",
      "title": "The Quantum Routing Dilemma",
      "description": "You're debugging a quantum network with 5 entangled nodes (A-E) arranged in a pentagon. Each connection has a stability rating (1-5 stars). The network map shows: A↔B (★★), A↔C (★★★★), A↔E (★), B↔C (★★★), B↔D (★★★★★), C↔D (★★), D↔E (★★★), E↔C (★★★★). A quantum packet must travel from Node A to Node D along the path with the HIGHEST MINIMUM stability rating.",
      "visual_elements": "A pentagon network where each node is labeled A through E, with connections between them showing star ratings (1-5 stars).",
      "question": "Which path should the quantum packet take from Node A to Node D?",
      "expectedOutputType": "multiple_choice",
      "options": ["A→B→D", "A→C→D", "A→E→D", "A→C→E→D"],
      "validation_criteria": {{
        "correct_option_index": 1,
        "explanation": "Path A→C→D has stability ratings of ★★★★ (A→C) and ★★ (C→D), giving a minimum stability of ★★. Path A→B→D has ★★ and ★★★★★, minimum ★★. Path A→E→D has ★ and ★★★, minimum ★. Path A→C→E→D has ★★★★, ★★★★, and ★★★, minimum ★★★. Therefore A→C→E→D has the highest minimum rating."
      }}
    }}
    """
    try:
        response = model.generate_content(prompt)
        challenge_data = json.loads(response.text)

        # Validate required fields
        required_keys = [
            "id",
            "type",
            "title",
            "description",
            "visual_elements",
            "question",
            "expectedOutputType",
            "options",
            "validation_criteria",
        ]

        if not all(k in challenge_data for k in required_keys):
            missing_keys = [k for k in required_keys if k not in challenge_data]
            logger.error(f"Generated logic puzzle missing keys: {missing_keys}")
            return None

        # Ensure validation criteria has correct fields
        validation_criteria = challenge_data.get("validation_criteria", {})
        if (
            "correct_option_index" not in validation_criteria
            or "explanation" not in validation_criteria
        ):
            logger.error("Generated logic puzzle missing validation criteria fields")
            return None

        return challenge_data
    except Exception as e:
        logger.error(f"Error generating visual logic puzzle: {e}")
        return None


def generate_code_snippet_challenge(
    model, job_role: str, language: str = "python"
) -> Optional[Dict[str, Any]]:
    """Generates an engaging code challenge that tests real-world software engineering skills."""

    # Customize focus based on job role
    if "AI Engineer" in job_role:
        if language == "python":
            focus_areas = [
                "a data preprocessing pipeline that needs optimization",
                "a feature extraction function with a subtle bug",
                "a model evaluation routine that has scaling issues",
                "a training loop with potential memory leaks",
                "a data augmentation function with unexpected edge cases",
            ]
        else:  # JavaScript
            focus_areas = [
                "a frontend visualization of model predictions",
                "an API wrapper for ML model inference",
                "a realtime data streaming component for an AI application",
                "a client-side model deployment with performance issues",
                "a dashboard component that needs to handle large prediction outputs",
            ]
    else:  # Software Engineer
        if language == "python":
            focus_areas = [
                "a backend API endpoint with concurrency issues",
                "a data processing utility that needs better error handling",
                "a caching implementation with potential race conditions",
                "a recursive algorithm that's causing stack overflow",
                "a database access pattern with N+1 query problems",
            ]
        else:  # JavaScript
            focus_areas = [
                "a React component with performance or state management issues",
                "an animation system with memory leaks",
                "an async workflow that needs proper error handling",
                "a frontend caching strategy with stale data problems",
                "a WebSocket handler with connection management issues",
            ]

    # Pick a random focus area for variety
    import random

    role_focus = random.choice(focus_areas)
    language_details = "Python" if language == "python" else "JavaScript"

    prompt = f"""
    Create a realistic, engaging code challenge for a {job_role} candidate that focuses on {role_focus}.
    
    This should NOT be an algorithmic puzzle or contrived problem - make it feel like actual code they might encounter 
    in a production codebase that needs improvement. The starting code should be functional but flawed in some
    significant way (performance, scalability, maintainability, error handling, etc.).

    Structure the challenge as a specific request they'd get from a senior engineer: "We need to improve this because..."
    
    For {language_details} code challenges:
    - Use idiomatic, modern {language_details} - the code should look realistic (imports, error handling, etc.)
    - For Python, utilize appropriate libraries like numpy, pandas, requests as needed
    - For JavaScript, incorporate modern ES6+ features, async/await, and frameworks as appropriate
    - The code should be 15-30 lines - complex enough to be interesting but digestible in a few minutes
    - Include realistic variable names and minimal comments that hint at the context
    
    Make the challenge require critical thinking about real engineering concerns:
    - Performance optimizations
    - Error handling
    - Scalability 
    - Memory management
    - Race conditions/concurrency
    - API design
    - Maintainability
    
    Return ONLY a JSON object with this exact structure:
    {{
      "id": "code-challenge-{language}-production",
      "type": "code_snippet", 
      "title": "str (Brief, specific title that hints at the challenge)",
      "description": "str (A specific request from a senior engineer explaining what needs to be fixed/improved and why - make it feel urgent and real)",
      "stimulus": {{
        "language": "{language}",
        "code": "str (The flawed but working code snippet)"
      }},
      "expectedOutputType": "code_and_text",
      "placeholder_code": "{'# Your improved implementation...' if language == 'python' else '// Your improved implementation...'}",
      "placeholder_explanation": "Explain your approach, what issues you identified, and how your solution addresses them...",
      "validation_criteria": {{
        "evaluation_focus_points": ["list of 4-5 specific technical aspects that a good solution should address"]
      }}
    }}

    Example (Python, AI Engineer):
    {{
      "id": "code-challenge-python-production",
      "type": "code_snippet",
      "title": "Optimize Our Model Feature Cache",
      "description": "Our production recommendation system is having timeout issues because this feature caching function is too slow with our growing user base. We need to optimize it to handle 10x more users without increasing latency. The bottleneck is in how we're processing and storing the feature vectors. Can you refactor this to be more efficient while maintaining the same functionality?",
      "stimulus": {{
        "language": "python",
        "code": "import time\\n\\ndef cache_user_features(user_data, feature_config):\\n    \"\"\"Cache computed features for faster recommendation lookup\"\"\"\\n    feature_store = {{}}\\n    \\n    for user_id, activities in user_data.items():\\n        # Compute features for each user (expensive operation)\\n        features = []\\n        for activity in activities:\\n            # Extract configured features from each activity\\n            activity_features = []\\n            for feature_name in feature_config['activity_features']:\\n                if feature_name in activity:\\n                    activity_features.append(activity[feature_name])\\n                else:\\n                    activity_features.append(0)  # Default value\\n            features.append(activity_features)\\n        \\n        # Combine all activity features (simple mean for now)\\n        if features:\\n            combined = []\\n            for i in range(len(features[0])):\\n                feature_values = [f[i] for f in features]\\n                combined.append(sum(feature_values) / len(feature_values))\\n        else:\\n            combined = [0] * len(feature_config['activity_features'])\\n        \\n        # Store in feature_store with timestamp\\n        feature_store[user_id] = {{\\n            'features': combined,\\n            'updated_at': time.time(),\\n            'activity_count': len(activities)\\n        }}\\n    \\n    return feature_store"
      }},
      "expectedOutputType": "code_and_text",
      "placeholder_code": "# Your optimized implementation...",
      "placeholder_explanation": "I identified these performance issues and addressed them by...",
      "validation_criteria": {{
        "evaluation_focus_points": [
          "effective use of numpy or other vectorized operations", 
          "reduction of nested loops", 
          "proper handling of the same edge cases (empty activities)",
          "maintaining the same output structure and data integrity", 
          "clear explanation of performance improvements"
        ]
      }}
    }}
    """
    try:
        response = model.generate_content(prompt)
        challenge_data = json.loads(response.text)

        # Validate required fields
        required_keys = [
            "id",
            "type",
            "title",
            "description",
            "stimulus",
            "expectedOutputType",
            "placeholder_code",
            "placeholder_explanation",
            "validation_criteria",
        ]

        if not all(k in challenge_data for k in required_keys):
            missing_keys = [k for k in required_keys if k not in challenge_data]
            logger.error(f"Generated code challenge missing keys: {missing_keys}")
            return None

        # Check stimulus fields
        stimulus = challenge_data.get("stimulus", {})
        if "language" not in stimulus or "code" not in stimulus:
            logger.error("Generated code challenge missing stimulus fields")
            return None

        # Ensure validation criteria exists
        validation_criteria = challenge_data.get("validation_criteria", {})
        if "evaluation_focus_points" not in validation_criteria:
            logger.error("Generated code challenge missing evaluation focus points")
            return None

        return challenge_data
    except Exception as e:
        logger.error(f"Error generating production-like code challenge: {e}")
        return None


def generate_system_design_challenge(model, job_role: str) -> Optional[Dict[str, Any]]:
    """Generate a visual, component-based system design challenge that feels more interactive."""

    # Customize focus based on job role
    if "AI Engineer" in job_role:
        design_types = [
            {
                "type": "ml_pipeline_realtime",
                "title_theme": "Real-time ML Inference & Data Pipeline",
                "component_focus": "AI-specific infrastructure for real-time data ingestion, feature engineering, model serving (e.g., SageMaker, Vertex AI, or custom Kubernetes), monitoring, and feedback loops for continuous training. Emphasize data flow for a specific AI task like fraud detection or recommendation.",
                "constraint": "high throughput, low latency, model versioning, data drift, and scalability for fluctuating loads",
            },
            {
                "type": "large_scale_training_pipeline",
                "title_theme": "Scalable Distributed ML Training Architecture",
                "component_focus": "components for distributed data processing (e.g., Spark, Dask), distributed training frameworks (e.g., Horovod, TensorFlow Distributed), experiment tracking (e.g., MLflow), hyperparameter optimization, and model artifact storage.",
                "constraint": "massive datasets, computational cost, training time, and reproducibility",
            },
            {
                "type": "data_centric_ai_system",
                "title_theme": "Data-Centric AI System for Quality Improvement",
                "component_focus": "components for data ingestion from multiple sources, data validation & cleaning, data labeling & annotation pipelines, data versioning (e.g., DVC), and automated data quality monitoring to improve model performance.",
                "constraint": "data quality, data governance, annotation efficiency, and integration with model development lifecycle",
            },
        ]
    else:  # Software Engineer
        design_types = [
            {
                "type": "distributed_system",
                "title_theme": "Globally Distributed Application",
                "component_focus": "data replication, caching, request routing, and failover components",
                "constraint": "consistency requirements, latency concerns, and regional regulations",
            },
            {
                "type": "real_time_platform",
                "title_theme": "Real-time Collaborative Platform",
                "component_focus": "components for low-latency synchronization, conflict resolution, and presence tracking",
                "constraint": "scale, network reliability, and user experience",
            },
            {
                "type": "event_streaming",
                "title_theme": "High-throughput Event Processing System",
                "component_focus": "event ingestion, routing, processing, and storage components",
                "constraint": "ordering guarantees, fault tolerance, and processing semantics",
            },
        ]

    # Pick a random design type for variety
    import random

    selected_design = random.choice(design_types)

    prompt = f"""
    Create a visually-oriented system design challenge for a {job_role} candidate focused on {selected_design["title_theme"]}.
    
    The challenge should:
    1. Present a realistic, complex technical scenario requiring a system design solution
    2. Focus on {selected_design["component_focus"]}
    3. Include specific constraints around {selected_design["constraint"]}
    4. Be structured so the candidate needs to identify and place the right components in the right architecture
    
    Make the problem VISUAL in nature - it should involve components, connections, and data flows that could be 
    represented as a diagram. The challenge should include 6-8 distinct system components that need to be arranged.
    
    Add a creative business context that makes the challenge feel real, urgent, and important.
    
    The challenge should test:
    - Component selection (what parts are needed)
    - Component placement (where in the architecture)
    - Data flow design (how components communicate)
    - Trade-off analysis (key decisions with clear pros/cons)
    
    Return ONLY a JSON object with this exact structure:
    {{
      "id": "system-design-{selected_design["type"]}",
      "type": "system_design_visual",
      "title": "str (Brief, specific title that hints at both the technical focus and business context)",
      "description": "str (Business context + technical requirements + constraints in 3-4 paragraphs)",
      "component_options": [
        {{ "name": "str (Component 1)", "description": "str (Brief description of what this component does)", "icon_type": "str (e.g., 'database', 'service', 'api', 'client', 'queue')" }},
        {{ "name": "str (Component 2)", "description": "str (Brief description)", "icon_type": "str" }},
        // Include 6-8 components total
      ],
      "expected_considerations": [
        "str (Key consideration 1 the design should address)",
        "str (Key consideration 2)",
        // Include 4-5 considerations
      ],
      "expectedOutputType": "system_diagram_and_text",
      "placeholder_diagram": "Use the component options to create your system architecture diagram, showing connections and data flows",
      "placeholder_explanation": "Explain your design choices, how data flows through the system, and how you've addressed the key requirements and constraints...",
      "validation_criteria": {{
        "evaluation_focus_points": [
          "str (Specific technical aspect 1 that a good solution should address)",
          "str (Specific technical aspect 2)",
          // Include 4-5 evaluation points
        ]
      }}
    }}

    Example (AI Engineer - ML Pipeline):
    {{
      "id": "system-design-ml_pipeline",
      "type": "system_design_visual",
      "title": "Real-time Fraud Detection for a Global Payment Network",
      "description": "NewPay is disrupting the payments industry with its blockchain-based global transfer network. They need to add real-time fraud detection that can handle 100,000+ transactions per second with a latency budget of under 50ms for the ML inference. Their data scientists have developed several models (transaction pattern analysis, graph-based user relationship analysis, and a text analysis model for payment descriptions), but they need an architecture to deploy, monitor, and continuously improve these models in production. Due to regulatory requirements, they need region-specific model variants while maintaining global fraud pattern recognition. The system needs to handle significant daily volume fluctuations and have strong explainability for flagged transactions.",
      "component_options": [
        {{ "name": "Feature Store", "description": "Service that stores, manages and serves ML features with low latency", "icon_type": "database" }},
        {{ "name": "Model Registry", "description": "Service that tracks model versions, metadata, and deployment status", "icon_type": "service" }},
        {{ "name": "Streaming Inference Service", "description": "Service optimized for high-throughput, low-latency model predictions", "icon_type": "service" }},
        {{ "name": "Batch Training Pipeline", "description": "Scheduled pipeline for regular model retraining on historical data", "icon_type": "service" }},
        {{ "name": "Monitoring Service", "description": "System that tracks model drift, performance, and alert on issues", "icon_type": "service" }},
        {{ "name": "Explainability Service", "description": "Service that generates explanations for model predictions", "icon_type": "service" }},
        {{ "name": "Transaction Stream Processor", "description": "Real-time processor for incoming payment transactions", "icon_type": "queue" }},
        {{ "name": "Regional Routing Layer", "description": "Service that directs requests to region-specific resources", "icon_type": "api" }}
      ],
      "expected_considerations": [
        "How to ensure low-latency inference while maintaining model accuracy",
        "How to handle region-specific models while sharing global fraud signals",
        "How to maintain and update models without disrupting the live system",
        "How to handle explainability for complex model decisions",
        "How to scale for variable transaction volumes"
      ],
      "expectedOutputType": "system_diagram_and_text",
      "placeholder_diagram": "Use the component options to create your ML system architecture, showing connections and data flows between components",
      "placeholder_explanation": "Explain your design choices, how fraud detection flows from transaction to decision, and how your architecture handles the core requirements...",
      "validation_criteria": {{
        "evaluation_focus_points": [
          "Effective separation of real-time vs. batch processes",
          "Thoughtful handling of region-specific model variants",
          "Appropriate feature engineering and serving approach",
          "Scalability and redundancy for high-availability",
          "Clear explanation of model deployment and updating strategy"
        ]
      }}
    }}
    """
    try:
        response = model.generate_content(prompt)
        challenge_data = json.loads(response.text)

        # Validate required fields
        required_keys = [
            "id",
            "type",
            "title",
            "description",
            "component_options",
            "expected_considerations",
            "expectedOutputType",
            "placeholder_diagram",
            "placeholder_explanation",
            "validation_criteria",
        ]

        if not all(k in challenge_data for k in required_keys):
            missing_keys = [k for k in required_keys if k not in challenge_data]
            logger.error(
                f"Generated system design challenge missing keys: {missing_keys}"
            )
            return None

        # Ensure component options are properly formatted
        component_options = challenge_data.get("component_options", [])
        if not component_options or not all(
            isinstance(c, dict)
            and "name" in c
            and "description" in c
            and "icon_type" in c
            for c in component_options
        ):
            logger.error(
                "Generated system design challenge has invalid component options"
            )
            return None

        # Ensure validation criteria exists
        validation_criteria = challenge_data.get("validation_criteria", {})
        if "evaluation_focus_points" not in validation_criteria:
            logger.error(
                "Generated system design challenge missing evaluation focus points"
            )
            return None

        return challenge_data
    except Exception as e:
        logger.error(f"Error generating visual system design challenge: {e}")
        return None


def generate_game_theory_challenge(model, job_role: str) -> Optional[Dict[str, Any]]:
    """Generate an interactive, scenario-based strategic thinking challenge with visual elements."""

    # Customize scenario for job role
    if "AI Engineer" in job_role:
        scenarios = [
            "AI product launch timing vs competitor",
            "ML model deployment with incomplete data",
            "Research resource allocation across competing AI initiatives",
            "Strategic AI partnership negotiations",
            "Data acquisition strategy with limited budget",
        ]
    else:  # Software Engineer
        scenarios = [
            "Product feature prioritization under tight deadlines",
            "Technology stack selection with long-term implications",
            "Scaling strategy for unexpected viral growth",
            "Strategic hiring decisions with limited budget",
            "Open source strategy vs proprietary development",
        ]

    # Pick a random scenario for variety
    import random

    scenario_focus = random.choice(scenarios)

    prompt = f"""
    Create a highly interactive, visually-rich strategic thinking challenge for a {job_role} based on {scenario_focus}.
    
    The challenge should:
    1. Present a realistic tech business scenario with clear strategic implications
    2. Include a VISUAL element - something that could be represented with a diagram, chart, or other visual aid
    3. Have multiple strategic options with different risk/reward profiles
    4. Require consideration of incomplete information and game-theoretic thinking
    
    Make it feel like a real business situation where the candidate must consider:
    - Competitor actions and reactions
    - Resource constraints and tradeoffs
    - Information gaps and uncertainty
    - Short-term vs. long-term outcomes
    
    Design the challenge so it's INTERACTIVE - structure it as a multi-choice question first, but then ask for deeper strategic reasoning.
    
    Return ONLY a JSON object with this exact structure:
    {{
      "id": "strategic-scenario",
      "type": "game_theory_interactive",
      "title": "str (Brief, evocative title suggesting the central dilemma)",
      "scenario": "str (Vivid business scenario with stakes, constraints, and strategic tension in 2-3 paragraphs)",
      "description": "str (A concise summary of the scenario, suitable for display on a card. Max 1-2 sentences.)",
      "visual_element": "str (Description of visual data that would aid decision-making, e.g., 'A competitive positioning map showing 5 companies plotted on axes of price vs features')",
      "options": [
        {{ 
          "id": "A", 
          "strategy": "str (Brief description of strategy option A)",
          "pros": ["str (Pro 1)", "str (Pro 2)"],
          "cons": ["str (Con 1)", "str (Con 2)"]
        }},
        {{ 
          "id": "B", 
          "strategy": "str (Brief description of strategy option B)",
          "pros": ["str (Pro 1)", "str (Pro 2)"],
          "cons": ["str (Con 1)", "str (Con 2)"]
        }},
        {{ 
          "id": "C", 
          "strategy": "str (Brief description of strategy option C)",
          "pros": ["str (Pro 1)", "str (Pro 2)"],
          "cons": ["str (Con 1)", "str (Con 2)"]
        }}
      ],
      "strategic_questions": [
        "str (Question probing deeper strategic reasoning, e.g., 'What assumption about competitor behavior is most critical to validate?')",
        "str (Question about risk mitigation, e.g., 'How would you hedge against the biggest risk in your chosen strategy?')",
        "str (Question about information needs, e.g., 'What specific market data would most influence your decision?')"
      ],
      "expectedOutputType": "strategic_analysis",
      "placeholder": "Begin with your chosen strategy (A/B/C) and why, then address the strategic questions with specific reasoning...",
      "validation_criteria": {{
        "evaluation_focus_points": [
          "str (Strategic aspect 1 that a good solution should address)",
          "str (Strategic aspect 2)",
          "str (Strategic aspect 3)",
          "str (Strategic aspect 4)",
          "str (Strategic aspect 5)"
        ]
      }}
    }}

    Example (Product Launch Strategy):
    {{
      "id": "strategic-scenario",
      "type": "game_theory_interactive",
      "title": "The Market Timing Dilemma",
      "scenario": "You're the VP of Product at Horizon Tech, preparing to launch your revolutionary AR glasses. Your team needs 8 more weeks for full polish, but intelligence suggests your biggest competitor, GlassVision, is planning to announce something similar. The AR market has been heating up, with analysts predicting the first compelling product could capture 65% market share. Your investors are pressuring for a faster launch, while your engineers warn about potential quality issues if rushed. Industry buzz suggests that a major tech conference in 4 weeks will be GlassVision's likely announcement venue.",
      "description": "As VP of Product, you must decide whether to rush your AR glasses launch to beat a competitor to market, stick to the original timeline for a polished product, or pre-announce to control the narrative.",
      "visual_element": "A gantt chart showing your development timeline with key milestones (basic functionality, beta testing, quality assurance, marketing prep, full launch) alongside a market timing graph showing estimated competitor readiness, conference dates, and projected market interest curve",
      "options": [
        {{ 
          "id": "A", 
          "strategy": "Rush to launch a 'limited release' version before the conference (3 weeks)",
          "pros": ["Beat competitor to market", "Capture early market attention", "Can position competitor as a follower"],
          "cons": ["Product will have known limitations", "Higher customer support needs", "Engineering team burnout risk"]
        }},
        {{ 
          "id": "B", 
          "strategy": "Stick to original timeline (8 weeks) for full-featured launch",
          "pros": ["Higher quality product", "Complete feature set", "Well-prepared support and marketing"],
          "cons": ["Risk being perceived as a follower", "May lose early adopters to competitor", "Longer investor money burn"]
        }},
        {{ 
          "id": "C", 
          "strategy": "Pre-announce now with bold claims, but launch on original timeline",
          "pros": ["Control the narrative before competitor", "Buy time for development", "Set market expectations"],
          "cons": ["Create expectations that must be met", "Give competitor time to adjust strategy", "If delayed further, significant reputation damage"]
        }}
      ],
      "strategic_questions": [
        "What critical assumption about GlassVision's product readiness most influences your strategy?",
        "How might you gather better competitive intelligence before committing to your strategy?",
        "What parallel investments would make your chosen strategy more resilient to competitive response?"
      ],
      "expectedOutputType": "strategic_analysis",
      "placeholder": "I would choose strategy (A/B/C) because... The most critical assumption is... I would gather intelligence by... To make this strategy more resilient, I would...",
      "validation_criteria": {{
        "evaluation_focus_points": [
          "Demonstrates understanding of first-mover vs quality trade-offs",
          "Identifies specific competitive intelligence needs and how to address them",
          "Shows awareness of second-order effects (competitor responses)",
          "Proposes concrete risk mitigation approaches",
          "Balances technical, market, and business considerations"
        ]
      }}
    }}
    """
    try:
        response = model.generate_content(prompt)
        challenge_data = json.loads(response.text)

        # Validate required fields
        required_keys = [
            "id",
            "type",
            "title",
            "scenario",
            "visual_element",
            "options",
            "strategic_questions",
            "expectedOutputType",
            "placeholder",
            "validation_criteria",
        ]

        if not all(k in challenge_data for k in required_keys):
            missing_keys = [k for k in required_keys if k not in challenge_data]
            logger.error(
                f"Generated game theory challenge missing keys: {missing_keys}"
            )
            return None

        # Validate options structure
        options = challenge_data.get("options", [])
        if not options or not all(
            isinstance(o, dict)
            and "id" in o
            and "strategy" in o
            and "pros" in o
            and "cons" in o
            for o in options
        ):
            logger.error(
                "Generated game theory challenge has invalid options structure"
            )
            return None

        # Ensure validation criteria exists
        validation_criteria = challenge_data.get("validation_criteria", {})
        if "evaluation_focus_points" not in validation_criteria:
            logger.error(
                "Generated game theory challenge missing evaluation focus points"
            )
            return None

        return challenge_data
    except Exception as e:
        logger.error(f"Error generating interactive game theory challenge: {e}")
        return None


def generate_connect_the_dots_challenge(
    model, job_role: str
) -> Optional[Dict[str, Any]]:
    prompt = f"""
    Generate a 'connect the dots' style challenge for a {job_role} focusing on "big picture, frontier of technology" thinking.
    Provide three genuinely diverse items (e.g., a recent scientific breakthrough, a niche tech startup's mission, a quote from a futurist).
    These items should subtly point towards a significant, perhaps not immediately obvious, future technological convergence or societal shift.
    Ask the candidate to articulate this grand theme and justify their interpretation.
    Provide a title and the items.

    Return ONLY a JSON object with this exact structure:
    {{
      "id": "connect-dots-frontier",
      "type": "connect_the_dots",
      "title": "str (Title suggesting a grand vision)",
      "description": "The following three items, though seemingly disparate, point to a profound technological or societal shift on the horizon. What is this overarching 'frontier' theme, and how do these pieces connect to it?",
      "stimulus": {{
        "texts": ["str (Item 1 - e.g., a news headline about a deep-tech breakthrough)", "str (Item 2 - e.g., a one-sentence mission of a very niche, futuristic startup)", "str (Item 3 - e.g., a short, impactful quote from a respected futurist or scientist)"]
      }},
      "expectedOutputType": "textarea",
      "placeholder": "The grand connecting theme is... Here's how these items converge...",
      "validation_criteria": {{
        "evaluation_focus_points": ["depth of insight", "originality of the connecting theme", "plausibility of the connections made", "articulation of 'big picture' implications"]
      }}
    }}

    Example:
    {{
      "id": "connect-dots-frontier",
      "type": "connect_the_dots",
      "title": "The Next Human-Machine Symbiosis",
      "description": "The following three items, though seemingly disparate, point to a profound technological or societal shift on the horizon. What is this overarching 'frontier' theme, and how do these pieces connect to it?",
      "stimulus": {{
        "texts": [
          "Headline: 'Researchers demonstrate direct neural interface for controlling complex robotic limbs with thought, achieving near-natural dexterity.'",
          "Startup Mission: 'To build personalized AI tutors that adapt not just to learning style, but to the student's real-time cognitive and emotional state via non-invasive biofeedback.'",
          "Futurist Quote: 'The future isn't about humans versus machines, but humans *as* enhanced by machines, forming a new kind of integrated intelligence.'"
        ]
      }},
      "expectedOutputType": "textarea",
      "placeholder": "The grand theme I see is... The neural interface shows..., the AI tutor aims for..., and the quote ties it together by suggesting...",
      "validation_criteria": {{
        "evaluation_focus_points": ["identification of a sophisticated theme like 'cognitive augmentation' or 'seamless human-AI integration'", "ability to link diverse inputs to this theme", "speculation on societal impact"]
      }}
    }}
    """
    try:
        response = model.generate_content(prompt)
        challenge_data = json.loads(response.text)
        if not (
            challenge_data.get("stimulus") and challenge_data["stimulus"].get("texts")
        ):
            logger.error("Generated connect the dots challenge missing stimulus texts.")
            return None
        return challenge_data
    except Exception as e:
        logger.error(f"Error generating frontier connect the dots challenge: {e}")
        return None


def generate_product_sense_challenge(model, job_role: str) -> Optional[Dict[str, Any]]:
    """Generates a product sense challenge asking candidates to evaluate a product idea or feature."""

    # Customize scenario for job role
    if "AI Engineer" in job_role:
        product_focus_areas = [
            "a new AI-powered feature for an existing enterprise SaaS product",
            "a developer tool for simplifying MLOps workflows",
            "a consumer application leveraging a novel generative AI model",
            "a data product that provides unique insights from large-scale datasets",
            "an AI ethics & safety tool for assessing model bias",
        ]
    else:  # Software Engineer
        product_focus_areas = [
            "a new feature for a popular social media application",
            "a productivity tool aimed at remote development teams",
            "a mobile application for a niche hobbyist community",
            "an e-commerce platform enhancement to improve conversion rates",
            "a platform for connecting local service providers with customers",
        ]

    import random

    focus_area = random.choice(product_focus_areas)

    prompt = f"""
    Create a Product Sense challenge for a {job_role} candidate, focusing on "{focus_area}".
    
    The challenge should present a brief product concept or a problem statement. 
    The candidate should then be asked to:
    1. Identify target users.
    2. Propose 2-3 key features and justify them.
    3. Define 1-2 key success metrics.
    4. Identify a potential risk or challenge.

    The scenario should be concise but provide enough context for thoughtful analysis.
    
    Return ONLY a JSON object with this exact structure:
    {{
      "id": "product-sense-challenge",
      "type": "product_sense",
      "title": "str (Short, engaging title related to the product concept)",
      "description": "str (Brief overview of the challenge task for the mission board card - 1-2 sentences)",
      "scenario": "str (The product concept or problem statement presented to the candidate - 2-3 sentences)",
      "questions": [
        "str (e.g., Who are the primary target users for this product/feature? Describe them.)",
        "str (e.g., What are 2-3 essential features you would prioritize for an MVP? Why?)",
        "str (e.g., How would you measure the success of this product/feature? Define 1-2 key metrics.)",
        "str (e.g., What is one significant risk or challenge you foresee? How might you mitigate it?)"
      ],
      "expectedOutputType": "textarea_multiple", // Indicates multiple text areas or a structured text response
      "placeholder": "Address each question thoughtfully, providing clear justifications for your product decisions...",
      "validation_criteria": {{
        "evaluation_focus_points": [
          "Clarity of target user identification",
          "Rationale and impact of proposed features",
          "Relevance and measurability of success metrics",
          "Insightfulness of risk identification and mitigation strategy",
          "Overall product thinking and user empathy"
        ]
      }}
    }}

    Example:
    {{
      "id": "product-sense-challenge",
      "type": "product_sense",
      "title": "AI-Powered Code Review Assistant",
      "description": "Analyze the concept of an AI assistant for code reviews and outline its core product aspects.",
      "scenario": "Your team is exploring the idea of an AI-powered assistant that integrates into code review workflows. This assistant would automatically identify potential bugs, suggest improvements, and check for adherence to coding standards.",
      "questions": [
        "Who are the primary target users for this AI Code Review Assistant? Describe their key needs.",
        "What are 2-3 essential features you would prioritize for the MVP of this assistant? Justify your choices.",
        "How would you measure the success of this assistant? Define 1-2 key metrics.",
        "What is one significant risk or challenge (e.g., technical, adoption, ethical) you foresee? How might you mitigate it?"
      ],
      "expectedOutputType": "textarea_multiple",
      "placeholder": "1. Target Users: ...\\n2. Key Features: ...\\n3. Success Metrics: ...\\n4. Risks/Challenges: ...",
      "validation_criteria": {{
        "evaluation_focus_points": [
          "Understanding of developer workflows and pain points",
          "Practicality and impact of feature suggestions",
          "Actionable and relevant success metrics",
          "Awareness of potential pitfalls in AI tool adoption",
          "Clear and concise articulation of product strategy"
        ]
      }}
    }}
    """
    try:
        response = model.generate_content(prompt)
        challenge_data = json.loads(response.text)

        # Basic validation
        required_keys = [
            "id",
            "type",
            "title",
            "description",
            "scenario",
            "questions",
            "expectedOutputType",
            "placeholder",
            "validation_criteria",
        ]
        if not all(k in challenge_data for k in required_keys):
            missing_keys = [k for k in required_keys if k not in challenge_data]
            logger.error(
                f"Generated product sense challenge missing keys: {{missing_keys}}"
            )
            return None
        if (
            not isinstance(challenge_data.get("questions"), list)
            or len(challenge_data.get("questions")) < 3
        ):
            logger.error(
                "Generated product sense challenge has insufficient questions."
            )
            return None

        return challenge_data
    except Exception as e:
        logger.error(f"Error generating product sense challenge: {{e}}")
        return None


# ... (get_dynamic_challenge_sequence and validate_solution functions remain as previously defined,
#      they will use these new generator functions. Ensure get_dynamic_challenge_sequence calls the correct new function names.)
def get_dynamic_challenge_sequence(job_id_str: str) -> List[Dict[str, Any]]:
    try:
        # Ensure Gemini is configured (if not done globally)
        # configure_genai() # Assuming this is called once at app startup or is idempotent
        model = get_model(
            model_name=GEMINI_MODEL
        )  # Use the specific flash model for challenges
        if not model:
            logger.error("Failed to initialize Gemini model for challenge generation")
            return [{"error": "Model initialization failed. Please try again later."}]
    except Exception as e:
        logger.error(f"Error initializing model: {str(e)}")
        return [{"error": f"Challenge generation failed: {str(e)}"}]

    job_role = "AI Engineer" if job_id_str == "1" else "Software Engineer"

    # Define all available challenge generator functions by type
    all_challenge_generators = {
        "game_theory": lambda m: generate_game_theory_challenge(m, job_role),
        "system_design": lambda m: generate_system_design_challenge(m, job_role),
        "product_sense": lambda m: generate_product_sense_challenge(m, job_role),
        # Removed: logic, visual_pattern, http_codes, python_code, javascript_code, connect_the_dots
    }

    # XP/difficulty weights for gamification
    challenge_weights = {
        "game_theory": 150,  # Was 150, user image shows +50XP, but let's keep it a bit higher
        "system_design": 200,
        "product_sense": 100,
    }

    # Define the fixed sequence of challenge types
    # Order: 1. Game Theory, 2. System Design, 3. Product Sense
    challenge_type_sequence = [
        "game_theory",
        "system_design",
        "product_sense",
    ]

    # If job_id_str implies a specific role that needs a different order or types,
    # this is where that logic would go. For now, it's the same for all.

    generated_challenges = []

    for idx, challenge_type_key in enumerate(challenge_type_sequence):
        generator_func = all_challenge_generators.get(challenge_type_key)

        if not generator_func:
            logger.error(
                f"No generator function found for challenge type: {challenge_type_key}"
            )
            # Add a placeholder if a configured type is missing a generator
            generated_challenges.append(
                {
                    "id": f"error-no-generator-{challenge_type_key}-job{job_id_str}",
                    "type": "error_placeholder",
                    "title": f"Error: Misconfiguration ({challenge_type_key.replace('_', ' ').title()})",
                    "description": f"The challenge type '{challenge_type_key}' is not properly configured in the backend.",
                    "expectedOutputType": "text",
                    "metadata": {
                        "skill": challenge_type_key,
                        "xp_value": 0,
                        "difficulty": "Unknown",
                        "order": idx + 1,
                    },
                }
            )
            continue

        challenge = None
        for attempt in range(2):  # Try up to twice to generate each challenge
            try:
                challenge = generator_func(model)  # Pass the fetched model
                if challenge and isinstance(challenge, dict):  # Ensure it's a dict
                    # Add common metadata
                    challenge["id"] = (
                        f"{challenge.get('type', 'challenge').replace('_', '-')}-{idx+1}-job{job_id_str}"
                    )
                    challenge["metadata"] = {
                        "skill": challenge_type_key,
                        "xp_value": challenge_weights.get(challenge_type_key, 100),
                        "difficulty": (
                            "Hard"
                            if challenge_weights.get(challenge_type_key, 100) >= 150
                            else (
                                "Medium"
                                if challenge_weights.get(challenge_type_key, 100) >= 120
                                else "Easy"
                            )
                        ),
                        "order": idx + 1,
                    }

                    # Ensure description exists, providing a fallback.
                    # For game_theory, description is already added to be a summary of scenario.
                    if not challenge.get("description"):
                        if challenge_type_key == "game_theory" and challenge.get(
                            "scenario"
                        ):
                            challenge["description"] = (
                                (challenge["scenario"][:100] + "...")
                                if len(challenge["scenario"]) > 100
                                else challenge["scenario"]
                            )
                        else:
                            challenge["description"] = (
                                f"Solve the {challenge_type_key.replace('_', ' ')} challenge."
                            )

                    # Ensure title exists
                    if not challenge.get("title"):
                        challenge["title"] = (
                            f"{challenge_type_key.replace('_', ' ').title()} Challenge"
                        )

                    generated_challenges.append(challenge)
                    break  # Break from retry loop on success
                else:
                    logger.warning(
                        f"Attempt {attempt+1} for {challenge_type_key} returned invalid data: {challenge}"
                    )
            except Exception as e:
                logger.error(
                    f"Attempt {attempt+1} to generate {challenge_type_key} challenge failed: {e}",
                    exc_info=True,
                )
                time.sleep(1)  # Wait before retrying

        if not challenge:  # All retries failed or generator returned None consistently
            logger.error(
                f"Failed to generate {challenge_type_key} challenge for job {job_id_str} after multiple attempts."
            )
            generated_challenges.append(
                {
                    "id": f"error-generation-failed-{challenge_type_key}-job{job_id_str}",
                    "type": "error_placeholder",
                    "title": f"Challenge Error ({challenge_type_key.replace('_', ' ').title()})",
                    "description": f"We encountered an issue generating the {challenge_type_key.replace('_', ' ')} challenge. You can skip this or refresh.",
                    "expectedOutputType": "text",
                    "metadata": {
                        "skill": challenge_type_key,
                        "xp_value": 0,
                        "difficulty": "Error",
                        "order": idx + 1,
                    },
                }
            )

    return generated_challenges


# ... (validate_solution function should still work as it takes 'model' as an argument)
# ... (If __name__ == "__main__": block, update to test new generators or remove if not needed for direct script run)


def validate_solution(
    model,
    challenge_type: str,
    solution_data: Dict[str, Any],
    validation_criteria: Dict[str, Any],
    original_challenge_description: str = "",
) -> Dict[str, Any]:
    """
    Validates a user's solution against the challenge's criteria using Gemini.

    Args:
        model: Initialized Gemini model instance.
        challenge_type: The type of challenge (e.g., 'logic_puzzle', 'code_snippet').
        solution_data: The user's submitted solution (e.g., {"text": "..."} or {"code": "...", "explanation": "..."}).
        validation_criteria: The criteria defined when the challenge was generated.
        original_challenge_description: The original text/description of the challenge, useful for context.

    Returns:
        A dictionary like {"is_correct": True/False, "feedback": "Detailed feedback..."}
    """
    logger.info(f"Validating solution for challenge type: {challenge_type}")
    logger.debug(f"Solution data: {solution_data}")
    logger.debug(f"Validation criteria: {validation_criteria}")

    try:
        # LOGIC PUZZLE - Multiple choice version
        if challenge_type == "logic_puzzle":
            # For new multiple-choice format
            if "selected_option" in solution_data:
                user_selected_option = solution_data.get("selected_option")
                # Get correct answer from validation criteria
                correct_option_index = validation_criteria.get("correct_option_index")

                if (
                    correct_option_index is not None
                    and user_selected_option == correct_option_index
                ):
                    return {
                        "is_correct": True,
                        "feedback": "Correct! You identified the right solution to the logic puzzle.",
                    }
                else:
                    # Get explanation from validation criteria
                    explanation = validation_criteria.get("explanation", "")
                    return {
                        "is_correct": False,
                        "feedback": (
                            f"That's not the correct answer. Here's a hint: {explanation}"
                            if explanation
                            else "That's not the right answer. Try examining the pattern more carefully."
                        ),
                    }

            # Legacy format - text input
            else:
                expected_answer = (
                    validation_criteria.get("expected_answer", "").strip().lower()
                )
                user_answer = solution_data.get("text", "").strip().lower()

                if expected_answer and user_answer == expected_answer:
                    return {
                        "is_correct": True,
                        "feedback": "Correct! That's the right solution to the logic puzzle.",
                    }
                else:
                    # Use Gemini for more nuanced feedback
                    prompt = f"""
                    A user attempted a logic puzzle.
                    The puzzle description was: "{original_challenge_description}"
                    The user's answer was: "{user_answer}"
                    The expected answer was: "{expected_answer}"
                    
                    If the user's answer is incorrect, provide brief, encouraging feedback, possibly hinting towards the correct logic without giving away the answer.
                    If the expected answer is not available or the user's answer is very far off, just say "That's not quite it. Try rethinking the logic."

                    Return ONLY a JSON object: {{"feedback": "str"}}
                    """
                    response = model.generate_content(prompt)
                    feedback_json = json.loads(response.text)
                    return {
                        "is_correct": False,
                        "feedback": feedback_json.get(
                            "feedback",
                            "That's not quite right. Try rethinking the logic.",
                        ),
                    }

        # VISUAL PATTERN - Multiple choice pattern recognition
        elif challenge_type == "visual_pattern":
            user_selected_id = solution_data.get("selected_option_id", "")
            correct_option_id = validation_criteria.get("correct_option_id", "")

            if user_selected_id == correct_option_id:
                return {
                    "is_correct": True,
                    "feedback": "Correct! You successfully identified the pattern.",
                }
            else:
                # Get pattern rule explanation
                pattern_rule = validation_criteria.get("pattern_rule", "")
                return {
                    "is_correct": False,
                    "feedback": (
                        f"Not quite right. The pattern follows this rule: {pattern_rule}"
                        if pattern_rule
                        else "That's not the correct pattern. Try looking for a different transformation rule."
                    ),
                }

        # HTTP STATUS CODES - Multiple choice questions
        elif challenge_type == "http_status_codes":
            question_id = solution_data.get("question_id", "")
            selected_index = solution_data.get("selected_index")

            # Find the question in the original challenge
            question_data = None
            if "questions" in validation_criteria:
                for question in validation_criteria["questions"]:
                    if question.get("id") == question_id:
                        question_data = question
                        break

            if question_data and selected_index == question_data.get("correct_index"):
                # Get the correct status code for better feedback
                correct_option = question_data.get("options", [])[
                    question_data.get("correct_index", 0)
                ]
                code = correct_option.get("code", "")
                description = correct_option.get("description", "")

                return {
                    "is_correct": True,
                    "feedback": f"Correct! {code} ({description}) is the appropriate status code for this scenario.",
                }
            else:
                return {
                    "is_correct": False,
                    "feedback": "That's not the right status code for this scenario. Consider the specific requirements in the HTTP specification.",
                }

        # CODE SNIPPET - Evaluate code and explanation
        elif challenge_type == "code_snippet":
            user_code = solution_data.get("code", "")
            user_explanation = solution_data.get("explanation", "")
            evaluation_focus_points = validation_criteria.get(
                "evaluation_focus_points", []
            )

            prompt = f"""
            A user submitted a solution for a code snippet challenge.
            The original problem description was: "{original_challenge_description}"
            The user's explanation of their approach: "{user_explanation}"
            The user's submitted code: 
            ```
            {user_code}
            ```
            Key aspects for a good solution include: {', '.join(evaluation_focus_points)}.
            
            Analyze the user's solution against these criteria:
            1. Does the explanation clearly articulate their reasoning and approach?
            2. Does the code conceptually address the challenge (implementation of the right approach)? 
            3. Are there any obvious logical errors or inefficiencies?
            4. Has the user demonstrated understanding of the core concepts?

            Return ONLY a JSON object: {{"is_correct": true/false, "feedback": "str (Constructive feedback highlighting strengths and potential improvements)"}}
            """
            response = model.generate_content(prompt)
            eval_results = json.loads(response.text)

            is_correct = eval_results.get("is_correct", False)
            feedback = eval_results.get(
                "feedback", "Thanks for your submission. We'll review your approach."
            )

            return {"is_correct": is_correct, "feedback": feedback}

        # SYSTEM DESIGN - Evaluate diagram and explanation
        elif challenge_type == "system_design_visual":
            user_explanation = solution_data.get("explanation", "")
            evaluation_focus_points = validation_criteria.get(
                "evaluation_focus_points", []
            )

            prompt = f"""
            A user submitted a solution for a system design challenge.
            The original challenge description was: "{original_challenge_description}"
            The user was expected to create a system diagram and provide an explanation.
            The user\\'s textual explanation of their design: "{user_explanation}"
            (The diagram itself is evaluated separately or assumed to be constructed based on the component options provided in the challenge).
            
            Key aspects for a good solution include: {', '.join(evaluation_focus_points)}.
            
            The primary goal here is to encourage participation and gauge thoughtful engagement. 
            Evaluate the user\\'s textual explanation:
            1. Did the user make a reasonable attempt to explain their design choices?
            2. Does the explanation touch upon some of the key requirements or components mentioned in the challenge?
            3. Is there evidence of critical thinking, even if the solution isn\\'t perfect?

            Please be lenient. If the user provided a relevant explanation that shows they thought about the problem, 
            consider the solution as "correct" for the purpose of this validation. 
            Provide feedback that is encouraging and acknowledges their effort, perhaps offering one constructive suggestion if appropriate.

            Return ONLY a JSON object: {{"is_correct": true/false, "feedback": "str (Balanced, encouraging feedback. Default to 'is_correct': true if a reasonable textual explanation is provided.)"}}
            """
            response = model.generate_content(prompt)
            eval_results = json.loads(response.text)
            # The prompt guides the LLM to return is_correct: true for reasonable effort.
            # If LLM fails to provide is_correct, defaulting to True makes it more lenient.
            is_correct = eval_results.get("is_correct", True)
            feedback = eval_results.get(
                "feedback",
                "Thanks for your thoughtful system design! Your effort is appreciated.",
            )
            return {"is_correct": is_correct, "feedback": feedback}

        # GAME THEORY - Evaluate strategic reasoning
        elif challenge_type == "game_theory_interactive":
            user_answer_text = solution_data.get("text", "")
            selected_option_id = solution_data.get(
                "selected_option_id"
            )  # Get the selected option
            evaluation_focus_points = validation_criteria.get(
                "evaluation_focus_points", []
            )

            # Enhance the prompt with the selected option
            prompt = f"""
            A user submitted a response to a strategic scenario challenge (Game Theory).
            The original scenario was: "{original_challenge_description}"
            The user CHOSE strategy option ID: {selected_option_id if selected_option_id else 'Not specified'}.
            The user's textual explanation and answers to strategic questions: "{user_answer_text}"
            Key evaluation criteria: {', '.join(evaluation_focus_points)}.
            
            Evaluate the user's strategic thinking, focusing on:
            1. If a strategy option was chosen, does the explanation support that choice well?
            2. Clear choice of strategy with sound reasoning (if applicable, or overall reasoning if no explicit choice was made or required by the prompt structure).
            3. Recognition of key assumptions and information gaps.
            4. Consideration of competitor reactions and second-order effects.
            5. Identifying and mitigating risks relevant to their chosen strategy or general approach.
            6. Overall strategic depth and coherence in addressing the specific strategic questions posed in the challenge.
            
            The emphasis should be on strategic reasoning. If the user selected an option, their reasoning should align with it.
            If the reasoning is sound and addresses the questions well, consider it a strong response, even if the chosen option isn't objectively 'best'.

            Return ONLY a JSON object: {{"is_correct": true/false, "feedback": "str (Constructive feedback highlighting strategic insights, alignment of reasoning with chosen option, and areas for deeper consideration)"}}
            """
            response = model.generate_content(prompt)
            eval_results = json.loads(response.text)
            is_correct = eval_results.get("is_correct", False)
            feedback = eval_results.get(
                "feedback",
                "Thanks for your strategic analysis. We'll review your approach.",
            )
            return {"is_correct": is_correct, "feedback": feedback}

        # Handle any remaining legacy types or new types
        elif challenge_type in ["system_design", "game_theory", "connect_the_dots"]:
            user_text_response = solution_data.get("text", "")
            evaluation_focus_points = validation_criteria.get(
                "evaluation_focus_points", []
            )

            context_info = (
                f'The original challenge was: "{original_challenge_description}".'
            )
            if evaluation_focus_points:
                context_info += f" A good answer should touch upon these aspects: {', '.join(evaluation_focus_points)}."

            prompt = f"""
            A user submitted a response to a '{challenge_type}' challenge.
            {context_info}
            The user's response is: 
            "{user_text_response}"

            Please evaluate this response based on the original challenge and the desired focus points.
            Is the user's reasoning sound? Does it creatively and effectively address the core aspects of the challenge?
            Provide constructive feedback.

            Return ONLY a JSON object: {{"is_correct": true/false, "feedback": "str (Constructive feedback on the response, highlighting strengths or areas for improvement based on focus points.)"}}
            """
            response = model.generate_content(prompt)
            eval_results = json.loads(response.text)
            is_correct = eval_results.get("is_correct", False)
            feedback = eval_results.get(
                "feedback", "Your response has been recorded and will be reviewed."
            )
            return {"is_correct": is_correct, "feedback": feedback}

        else:
            logger.warning(
                f"Unsupported challenge type for validation: {challenge_type}"
            )
            return {
                "is_correct": False,
                "feedback": "Solution submitted. Validation for this type of challenge is not fully implemented yet.",
            }

    except json.JSONDecodeError as je:
        logger.error(
            f"JSONDecodeError during solution validation for {challenge_type}: {je}. Response text: {response.text if 'response' in locals() else 'N/A'}"
        )
        return {
            "is_correct": False,
            "feedback": "There was an issue processing the AI's evaluation. Your solution is saved.",
        }
    except Exception as e:
        logger.error(
            f"Error validating solution for {challenge_type}: {e}", exc_info=True
        )
        return {
            "is_correct": False,
            "feedback": "An unexpected error occurred during validation. Your solution has been saved.",
        }


# If run directly, you might want to test individual functions here.
# Ensure configure_genai() is called before get_model() in such tests.
# if __name__ == "__main__":
# configure_genai()
# test_model = get_model()
# Example:
# puzzle = generate_logic_puzzle_challenge(test_model, "AI Engineer")
# print(json.dumps(puzzle, indent=2))


def generate_http_status_challenge(model, job_role: str) -> Optional[Dict[str, Any]]:
    """Generate a multiple-choice quiz testing knowledge of HTTP status codes."""

    prompt = f"""
    Create an engaging, practical HTTP status code challenge for a {job_role} candidate.
    
    The challenge should test their understanding of HTTP status codes in real-world scenarios that a professional would encounter.
    Focus on practical situations where understanding the correct status code is important for debugging, API design, or system integration.
    
    Make the challenge visually interesting by describing UI mockups, network traffic diagrams, or other visual elements that illustrate the scenarios.
    
    Return ONLY a JSON object with this exact structure:
    {{
      "id": "http-status-quiz",
      "type": "http_status_codes",
      "title": "HTTP Status Code Challenge",
      "description": "Test your knowledge of HTTP status codes with these real-world scenarios. Select the most appropriate status code for each situation.",
      "questions": [
        {{
          "id": "http-q1",
          "scenario": "str (Real-world scenario description)",
          "visual_element": "str (Description of a visual representation - e.g., 'A network diagram showing a client request failing at the authentication layer')",
          "options": [
            {{ "code": "XXX", "description": "Brief explanation of this status code" }},
            {{ "code": "XXX", "description": "Brief explanation of this status code" }},
            {{ "code": "XXX", "description": "Brief explanation of this status code" }},
            {{ "code": "XXX", "description": "Brief explanation of this status code" }}
          ],
          "correct_index": int (index of correct answer, 0-based)
        }},
        // Include 5 total questions covering different categories of status codes
      ],
      "expectedOutputType": "multiple_choice",
      "validation_criteria": {{
        "evaluation_focus_points": [
          "Accuracy of HTTP status code selection",
          "Understanding of semantic meaning behind status codes", 
          "Ability to apply status codes to practical scenarios",
          "Knowledge of common status code categories (2XX, 4XX, 5XX)"
        ]
      }}
    }}
    
    Rules for creating good questions:
    1. Include a mix of common and less common but important status codes
    2. Cover all major categories (2XX success, 3XX redirection, 4XX client errors, 5XX server errors)
    3. Make scenarios realistic and relevant to modern web/API development
    4. Ensure visual elements enhance understanding of the scenario
    5. Include subtle details that differentiate between similar status codes
    
    Example question:
    {{
      "id": "http-q-example",
      "scenario": "Your team has built a new API endpoint that processes image uploads. During testing, a client is repeatedly uploading images that exceed your 10MB size limit. Your API needs to respond with the most appropriate status code.",
      "visual_element": "A network traffic diagram showing a client sending a 25MB file to your API server with a red indicator at the request validation layer",
      "options": [
        {{ "code": "400", "description": "Bad Request - The server cannot process the request due to client error" }},
        {{ "code": "413", "description": "Payload Too Large - The request entity is larger than limits defined by server" }},
        {{ "code": "415", "description": "Unsupported Media Type - The media format is not supported by the server" }},
        {{ "code": "422", "description": "Unprocessable Entity - The request was well-formed but contains semantic errors" }}
      ],
      "correct_index": 1
    }}
    """

    try:
        # Generate the challenge
        response = model.generate_content(prompt)
        challenge_data = json.loads(response.text)

        # Validate required fields
        required_keys = [
            "id",
            "type",
            "title",
            "description",
            "questions",
            "expectedOutputType",
            "validation_criteria",
        ]
        if not all(k in challenge_data for k in required_keys):
            missing_keys = [k for k in required_keys if k not in challenge_data]
            logger.error(
                f"Generated HTTP status challenge missing keys: {missing_keys}"
            )
            return None

        # Validate questions structure
        questions = challenge_data.get("questions", [])
        if len(questions) < 3:  # At least 3 questions
            logger.error(
                f"Generated HTTP status challenge has too few questions: {len(questions)}"
            )
            return None

        for i, q in enumerate(questions):
            if not all(
                k in q
                for k in [
                    "id",
                    "scenario",
                    "visual_element",
                    "options",
                    "correct_index",
                ]
            ):
                logger.error(f"Question {i+1} has missing required fields")
                return None

            # Validate options and correct_index
            options = q.get("options", [])
            correct_index = q.get("correct_index")
            if len(options) < 2:
                logger.error(f"Question {i+1} has too few options: {len(options)}")
                return None
            if (
                not isinstance(correct_index, int)
                or correct_index < 0
                or correct_index >= len(options)
            ):
                logger.error(
                    f"Question {i+1} has invalid correct_index: {correct_index}"
                )
                return None

        return challenge_data

    except Exception as e:
        logger.error(f"Error generating HTTP status code challenge: {e}")
        return None


def generate_visual_pattern_challenge(model, job_role: str) -> Optional[Dict[str, Any]]:
    """Generate a pattern recognition challenge with visual elements."""

    # Customize focus based on job role
    if "AI Engineer" in job_role:
        pattern_types = [
            "sequence completion with a mathematical or algorithmic basis",
            "node graph pattern recognition",
            "matrix transformation pattern",
            "feature extraction from data visualization",
            "multi-dimensional pattern recognition",
        ]
    else:  # Software Engineer
        pattern_types = [
            "algorithmic sequence prediction",
            "data structure pattern matching",
            "UI/UX pattern recognition",
            "state machine transition pattern",
            "system architecture pattern recognition",
        ]

    # Pick a random pattern type for variety
    import random

    pattern_focus = random.choice(pattern_types)

    prompt = f"""
    Create a visually engaging pattern recognition challenge for a {job_role} that focuses on {pattern_focus}.
    
    The challenge should:
    1. Present a visual pattern where the candidate must identify the next element or the rule governing the pattern
    2. Be described in such detail that it could be rendered visually by the frontend
    3. Test logical reasoning and pattern recognition skills relevant to the job role
    4. Have a clear, unambiguous correct answer
    
    For visual elements, describe them precisely enough that they could be drawn:
    - For shapes: specify their type, size, color, position, and any other relevant attributes
    - For sequences: describe each element in the sequence with all its properties
    - For grids/matrices: specify the contents of each cell in a well-defined manner
    
    Return ONLY a JSON object with this exact structure:
    {{
      "id": "pattern-recognition",
      "type": "visual_pattern",
      "title": "str (Clear, concise title that hints at the pattern type)",
      "description": "str (Brief setup and instructions for the challenge)",
      "pattern_elements": {{
        "description": "str (Detailed description of the visual pattern, including all elements and their attributes)",
        "elements": [
          {{
            "id": "element-1",
            "visual_description": "str (Precise description of element 1 that could be visualized)",
            "position": "str (Position information, e.g., '1st in sequence' or 'grid position (1,1)')"
          }},
          {{
            "id": "element-2",
            "visual_description": "str (Precise description of element 2 that could be visualized)",
            "position": "str (Position information for element 2)"
          }}
          // Include 4-6 elements that establish the pattern
        ]
      }},
      "options": [
        {{
          "id": "option-A",
          "visual_description": "str (Precise description of option A that could be visualized)"
        }},
        {{
          "id": "option-B",
          "visual_description": "str (Precise description of option B that could be visualized)"
        }},
        {{
          "id": "option-C",
          "visual_description": "str (Precise description of option C that could be visualized)"
        }},
        {{
          "id": "option-D",
          "visual_description": "str (Precise description of option D that could be visualized)"
        }}
      ],
      "correct_option_id": "str (ID of the correct option, e.g., 'option-B')",
      "explanation": "str (Clear explanation of the pattern and why the correct option follows it)",
      "expectedOutputType": "visual_selection",
      "validation_criteria": {{
        "pattern_rule": "str (The underlying rule or pattern in clear terms)",
        "evaluation_focus_points": [
          "str (Aspect 1 of the challenge that tests important skills)",
          "str (Aspect 2)",
          "str (Aspect 3)"
        ]
      }}
    }}

    Example (Sequence Pattern):
    {{
      "id": "pattern-recognition",
      "type": "visual_pattern",
      "title": "Logical Shape Transformation Sequence",
      "description": "Study the sequence of shapes below. Each element follows a consistent pattern of transformation. Select the shape that correctly continues the sequence.",
      "pattern_elements": {{
        "description": "A sequence of geometric shapes that transform according to specific rules for rotation, color, and number of internal elements.",
        "elements": [
          {{
            "id": "element-1",
            "visual_description": "A blue square containing one small red circle in the top-left corner",
            "position": "1st in sequence"
          }},
          {{
            "id": "element-2",
            "visual_description": "A blue square containing two small red circles positioned in the top-left and top-right corners",
            "position": "2nd in sequence"
          }},
          {{
            "id": "element-3",
            "visual_description": "A blue square containing three small red circles positioned in the top-left, top-right, and bottom-right corners",
            "position": "3rd in sequence"
          }},
          {{
            "id": "element-4",
            "visual_description": "A blue square containing four small red circles positioned in each of the four corners",
            "position": "4th in sequence"
          }}
        ]
      }},
      "options": [
        {{
          "id": "option-A",
          "visual_description": "A red square containing one small blue circle in the top-left corner"
        }},
        {{
          "id": "option-B",
          "visual_description": "A red square containing four small blue circles positioned in each of the four corners"
        }},
        {{
          "id": "option-C",
          "visual_description": "A blue square containing four small red circles in each corner and one small red circle in the center"
        }},
        {{
          "id": "option-D",
          "visual_description": "A red square containing no small circles"
        }}
      ],
      "correct_option_id": "option-B",
      "explanation": "The pattern involves two transformations: (1) The number of small circles increases by one in each step, filling the corners in clockwise order from top-left. (2) After the square is filled with circles in all four corners, the colors invert - the square changes from blue to red, and the circles change from red to blue.",
      "expectedOutputType": "visual_selection",
      "validation_criteria": {{
        "pattern_rule": "Increment circles clockwise + color inversion when corners are filled",
        "evaluation_focus_points": [
          "Recognition of the ordered positioning pattern",
          "Identification of the color inversion rule",
          "Understanding of pattern completion vs. pattern continuation"
        ]
      }}
    }}
    """

    try:
        response = model.generate_content(prompt)
        challenge_data = json.loads(response.text)

        # Validate required fields
        required_keys = [
            "id",
            "type",
            "title",
            "description",
            "pattern_elements",
            "options",
            "correct_option_id",
            "explanation",
            "expectedOutputType",
            "validation_criteria",
        ]

        if not all(k in challenge_data for k in required_keys):
            missing_keys = [k for k in required_keys if k not in challenge_data]
            logger.error(
                f"Generated visual pattern challenge missing keys: {missing_keys}"
            )
            return None

        # Validate pattern elements
        pattern_elements = challenge_data.get("pattern_elements", {})
        if "description" not in pattern_elements or "elements" not in pattern_elements:
            logger.error(
                "Generated visual pattern challenge missing pattern elements structure"
            )
            return None

        # Validate options
        options = challenge_data.get("options", [])
        if len(options) < 2:
            logger.error(
                f"Generated visual pattern challenge has too few options: {len(options)}"
            )
            return None

        # Ensure correct_option_id exists in options
        correct_option_id = challenge_data.get("correct_option_id")
        option_ids = [o.get("id") for o in options]
        if correct_option_id not in option_ids:
            logger.error(
                f"Generated visual pattern challenge has invalid correct_option_id: {correct_option_id} not in {option_ids}"
            )
            return None

        return challenge_data
    except Exception as e:
        logger.error(f"Error generating visual pattern challenge: {e}")
        return None


def analyze_csv_for_personalization(csv_file_path, sample_rows=5):
    """
    Analyze CSV headers and sample data to generate intelligent field descriptions for personalization

    Args:
        csv_file_path: Path to the CSV file to analyze
        sample_rows: Number of sample rows to analyze (default 5)

    Returns:
        Dictionary with suggested template structure and AI-generated field descriptions
    """
    try:
        import pandas as pd
        import re

        # Read CSV and get sample data
        df = pd.read_csv(csv_file_path)

        if df.empty:
            raise ValueError("CSV file is empty")

        # Get column headers, sample data, and row count
        headers = df.columns.tolist()
        row_count = len(df)
        sample_data = df.head(sample_rows).to_dict("records")

        # Configure Gemini if not already done
        configure_genai()
        model = get_model()

        # Create analysis prompt
        prompt = f"""
        Analyze this CSV data to create an intelligent personalization template for an AI assistant.
        
        CSV Headers: {headers}
        Total Records: {row_count}
        
        Sample Data (first {sample_rows} rows):
        {json.dumps(sample_data, indent=2)}
        
        For each column, generate:
        1. A clear "usage_note" explaining HOW the AI should use this data to personalize conversations
        2. A realistic "example" value from the actual data
        3. Confidence level (0-1) in your analysis
        4. Suggested data type (text, email, categorical, numeric, url, etc.)
        
        Also suggest a descriptive template name based on the data pattern. 
        The template name should be 1-2 words, lowercase, connected with hyphens (e.g., "sales-leads", "customer-data", "prospect-list").
        
        Focus on these personalization strategies:
        - Address recipients by name appropriately 
        - Tailor examples and case studies to their context (company size, industry, role)
        - Reference specific challenges or goals relevant to their situation
        - Adjust communication tone based on seniority/role
        - Mention relevant features/benefits for their use case
        
        Return ONLY a JSON object with this structure:
        {{
            "suggested_template_name": "Descriptive name based on data pattern",
            "analysis_summary": "Brief description of what this data enables for personalization",
            "row_count": {row_count},
            "columns": [
                {{
                    "name": "column_name",
                    "usage_note": "Specific instructions for how AI should use this field in conversations",
                    "example": "Actual example from the data",
                    "data_type": "text|email|categorical|numeric|url|phone|date",
                    "confidence": 0.95,
                    "personalization_potential": "high|medium|low"
                }}
            ],
            "suggested_improvements": [
                "Optional suggestions for additional data that would improve personalization"
            ]
        }}
        
        Example of good usage notes:
        - "Use to address recipient personally in greetings and throughout conversation"
        - "Tailor product examples and case studies to match their industry challenges" 
        - "Adjust complexity of explanations based on technical vs business role"
        - "Reference company size when discussing scalability and implementation"
        """

        # Get analysis from Gemini
        response = model.generate_content(prompt)
        analysis = json.loads(response.text)

        # Validate the response structure
        required_keys = ["suggested_template_name", "columns", "row_count"]
        if not all(key in analysis for key in required_keys):
            raise ValueError("Invalid analysis response structure")

        # Validate columns structure
        for col in analysis["columns"]:
            required_col_keys = [
                "name",
                "usage_note",
                "example",
                "data_type",
                "confidence",
            ]
            if not all(key in col for key in required_col_keys):
                raise ValueError(
                    f"Invalid column structure for {col.get('name', 'unknown')}"
                )

        logger.info(f"Successfully analyzed CSV with {len(headers)} columns")
        return analysis

    except Exception as e:
        logger.error(f"Error analyzing CSV for personalization: {str(e)}")
        raise


def update_personalization_template_descriptions(template_columns, usage_feedback=None):
    """
    Re-analyze and improve template field descriptions based on usage feedback

    Args:
        template_columns: Current template column definitions
        usage_feedback: Optional feedback about how well current descriptions work

    Returns:
        Updated column definitions with improved usage notes
    """
    try:
        configure_genai()
        model = get_model()

        feedback_context = ""
        if usage_feedback:
            feedback_context = (
                f"\nUser feedback on current descriptions: {usage_feedback}"
            )

        prompt = f"""
        Improve these personalization field descriptions based on usage analysis.
        
        Current Template Columns:
        {json.dumps(template_columns, indent=2)}
        {feedback_context}
        
        For each field, provide an enhanced "usage_note" that:
        1. Is more specific about personalization techniques
        2. Includes concrete examples of what the AI should say/do
        3. Considers advanced personalization strategies
        4. Addresses common pitfalls or edge cases
        
        Return ONLY a JSON object with this structure:
        {{
            "improved_columns": [
                {{
                    "name": "field_name",
                    "usage_note": "Enhanced, specific instructions for AI personalization",
                    "example": "Updated example if needed",
                    "improvement_reason": "Why this is better than the original"
                }}
            ],
            "overall_improvements": "Summary of key enhancements made"
        }}
        """

        response = model.generate_content(prompt)
        improvements = json.loads(response.text)

        logger.info(
            f"Generated improved descriptions for {len(template_columns)} columns"
        )
        return improvements

    except Exception as e:
        logger.error(f"Error improving template descriptions: {str(e)}")
        raise


def analyze_resume_for_career(resume_path: str) -> Dict[str, Any]:
    """
    Analyze a resume to provide career insights and recommendations

    Args:
        resume_path: Path to the resume file (PDF or DOCX)

    Returns:
        Dictionary containing analysis results with career insights
    """
    try:
        configure_genai()
        model = get_model()

        # Check file extension to determine if we need to convert DOCX to text
        file_extension = os.path.splitext(resume_path)[1].lower()

        # Upload the resume file
        resume_file = genai.upload_file(path=resume_path)

        # Wait for processing
        while resume_file.state.name == "PROCESSING":
            time.sleep(1)
            resume_file = genai.get_file(name=resume_file.name)

        # Create the analysis prompt
        prompt = """
        Analyze this resume to provide comprehensive career insights and actionable recommendations.
        
        Extract and analyze:
        1. Candidate information and experience level
        2. Best-fit target roles based on skills and experience
        3. Key strengths that stand out
        4. Specific improvements needed for better ATS performance and impact
        5. Strategic career advice
        
        Be specific, actionable, and encouraging. Focus on high-value insights that will help the candidate succeed.
        
        Return ONLY a JSON object with this EXACT structure (no additional fields):
        {
            "overallScore": float (0-10, based on resume quality, clarity, and impact),
            "candidateName": "str (extracted name or 'Not Found')",
            "potentialTitles": ["str (3-5 best-fit job titles based on experience)"],
            "strengths": ["str (3-4 key strengths with specific evidence from resume)"],
            "improvements": [
                {
                    "category": "str (Keywords|Quantification|Format|Skills|Experience)",
                    "suggestion": "str (specific, actionable improvement)",
                    "impact": "high|medium|low"
                }
            ],
            "targetRoleMatch": {
                "Role Title 1": int (match percentage 0-100),
                "Role Title 2": int,
                "Role Title 3": int
            },
            "strategy": "str (2-3 sentences of personalized strategic career advice)",
            "keywordGaps": ["str (5-10 important keywords missing for target roles)"],
            "industryInsights": "str (1-2 sentences about relevant industry trends)",
            "suggestedJobTitles": ["str (5-8 specific job titles to search for)"],
            "targetCompanies": ["str (5-10 company names or types that would be good fits)"]
        }
        
        EXAMPLE OUTPUT for a Software Engineer:
        {
            "overallScore": 7.5,
            "candidateName": "Sarah Chen",
            "potentialTitles": ["Senior Software Engineer", "Full Stack Developer", "Technical Lead", "Software Architect"],
            "strengths": [
                "Strong full-stack experience with React, Node.js, and Python demonstrated across 3 major projects",
                "Led cross-functional team of 8 engineers, showing leadership potential",
                "Quantified achievements: 'Reduced API response time by 45%' shows impact focus",
                "Active open-source contributor with 2.5k GitHub stars on personal projects"
            ],
            "improvements": [
                {
                    "category": "Keywords",
                    "suggestion": "Add cloud platform keywords like 'AWS', 'Docker', 'Kubernetes' which appear in 78% of senior roles",
                    "impact": "high"
                },
                {
                    "category": "Quantification",
                    "suggestion": "Quantify team leadership impact - add metrics like team velocity improvement or project delivery time",
                    "impact": "high"
                },
                {
                    "category": "Skills",
                    "suggestion": "Add a dedicated 'Technical Skills' section with categorized skills (Languages, Frameworks, Tools, Cloud)",
                    "impact": "medium"
                }
            ],
            "targetRoleMatch": {
                "Senior Software Engineer": 85,
                "Full Stack Developer": 78,
                "Technical Lead": 72
            },
            "strategy": "Your combination of technical depth and emerging leadership experience positions you well for senior IC or team lead roles. Focus on highlighting your mentorship experience and architectural decisions to stand out for technical lead positions.",
            "keywordGaps": ["Microservices", "CI/CD", "Agile", "System Design", "AWS/GCP", "Docker", "REST API", "Unit Testing"],
            "industryInsights": "The market for senior engineers with full-stack expertise is strong, with 23% YoY growth. Companies are especially seeking engineers who can mentor others and make architectural decisions.",
            "suggestedJobTitles": [
                "Senior Software Engineer",
                "Senior Full Stack Developer", 
                "Staff Software Engineer",
                "Technical Lead - Full Stack",
                "Principal Software Engineer",
                "Software Architect",
                "Engineering Manager",
                "Senior Backend Engineer"
            ],
            "targetCompanies": [
                "Mid-size tech companies (Series B-D startups)",
                "Fintech companies like Stripe, Square, Plaid",
                "Enterprise SaaS companies",
                "Remote-first companies like GitLab, Zapier",
                "Tech consultancies like Thoughtworks",
                "Major tech companies' product teams"
            ]
        }
        
        Scoring guidelines:
        - 9-10: Exceptional resume with strong quantification, keywords, and clear value proposition
        - 7-8: Good resume with minor improvements needed
        - 5-6: Average resume needing significant optimization
        - 3-4: Weak resume requiring major overhaul
        - 0-2: Very poor or incomplete resume
        
        IMPORTANT: 
        - Be generous with scores - most resumes should be 5-8
        - Provide specific, actionable suggestions
        - Include actual keywords and job titles relevant to their field
        - targetRoleMatch should use the exact titles from potentialTitles
        - Keep all text concise and valuable
        """

        # Generate analysis
        response = model.generate_content([prompt, resume_file])
        analysis_results = json.loads(response.text)

        # Validate the response structure
        required_keys = [
            "overallScore",
            "candidateName",
            "potentialTitles",
            "strengths",
            "improvements",
            "targetRoleMatch",
            "strategy",
            "keywordGaps",
            "industryInsights",
            "suggestedJobTitles",
            "targetCompanies",
        ]

        for key in required_keys:
            if key not in analysis_results:
                logger.warning(f"Missing key in resume analysis: {key}")
                # Provide defaults for missing keys
                if key == "overallScore":
                    analysis_results[key] = 5.0
                elif key == "candidateName":
                    analysis_results[key] = "Not Found"
                elif key in [
                    "potentialTitles",
                    "strengths",
                    "keywordGaps",
                    "suggestedJobTitles",
                    "targetCompanies",
                ]:
                    analysis_results[key] = []
                elif key == "improvements":
                    analysis_results[key] = [
                        {
                            "category": "General",
                            "suggestion": "Resume could not be fully analyzed",
                            "impact": "high",
                        }
                    ]
                elif key == "targetRoleMatch":
                    analysis_results[key] = {}
                elif key == "strategy":
                    analysis_results[key] = (
                        "Focus on highlighting your key achievements and skills relevant to your target roles."
                    )
                elif key == "industryInsights":
                    analysis_results[key] = (
                        "The job market is competitive. Focus on showcasing your unique value proposition."
                    )

        # Ensure score is within range
        analysis_results["overallScore"] = max(
            0, min(10, float(analysis_results["overallScore"]))
        )

        logger.info(
            f"Successfully analyzed resume with score: {analysis_results['overallScore']}"
        )
        return analysis_results

    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        # Return a default error response
        return {
            "overallScore": 0,
            "candidateName": "Error",
            "potentialTitles": [],
            "strengths": [],
            "improvements": [
                {
                    "category": "Error",
                    "suggestion": f"Unable to analyze resume: {str(e)}",
                    "impact": "high",
                }
            ],
            "targetRoleMatch": {},
            "strategy": "Please try uploading your resume again.",
            "error": str(e),
        }


def analyze_resume_for_career_with_text(resume_path: str) -> Dict[str, Any]:
    """
    Analyze a resume to provide career insights AND extract the raw text in one unified call

    This function combines text extraction and career analysis using a single Gemini prompt
    to ensure we get both the structured analysis AND the raw resume text reliably.

    Args:
        resume_path: Path to the resume file (PDF or DOCX)

    Returns:
        Dictionary containing analysis results with career insights AND raw_resume_text
    """
    try:
        configure_genai()
        model = get_model()

        # Upload the resume file
        resume_file = genai.upload_file(path=resume_path)

        # Wait for processing
        while resume_file.state.name == "PROCESSING":
            time.sleep(1)
            resume_file = genai.get_file(name=resume_file.name)

        # Create the unified analysis + text extraction prompt
        prompt = """
        Analyze this resume to provide comprehensive career insights AND extract the full text content.
        
        I need BOTH:
        1. Complete raw text extraction from the resume
        2. Career analysis and recommendations
        
        Extract and analyze:
        1. Full text content of the resume (exactly as written)
        2. Candidate information and experience level
        3. Best-fit target roles based on skills and experience
        4. Key strengths that stand out
        5. Specific improvements needed for better ATS performance and impact
        6. Strategic career advice
        
        Be specific, actionable, and encouraging. Focus on high-value insights that will help the candidate succeed.
        
        Return ONLY a JSON object with this EXACT structure (no additional fields):
        {
            "raw_resume_text": "str (COMPLETE text content extracted from the resume, preserving formatting where possible)",
            "overallScore": float (0-10, based on resume quality, clarity, and impact),
            "candidateName": "str (extracted name or 'Not Found')",
            "potentialTitles": ["str (3-5 best-fit job titles based on experience)"],
            "strengths": ["str (3-4 key strengths with specific evidence from resume)"],
            "improvements": [
                {
                    "category": "str (Keywords|Quantification|Format|Skills|Experience)",
                    "suggestion": "str (specific, actionable improvement)",
                    "impact": "high|medium|low"
                }
            ],
            "targetRoleMatch": {
                "Role Title 1": int (match percentage 0-100),
                "Role Title 2": int,
                "Role Title 3": int
            },
            "strategy": "str (2-3 sentences of personalized strategic career advice)",
            "keywordGaps": ["str (5-10 important keywords missing for target roles)"],
            "industryInsights": "str (1-2 sentences about relevant industry trends)",
            "suggestedJobTitles": ["str (5-8 specific job titles to search for)"],
            "targetCompanies": ["str (5-10 company names or types that would be good fits)"]
        }
        
        CRITICAL: The "raw_resume_text" field must contain the COMPLETE text from the resume.
        Extract every word, preserving the structure as much as possible. This is essential for
        AI agents to reference specific details from the user's actual resume.
        
        EXAMPLE OUTPUT for a Software Engineer:
        {
            "raw_resume_text": "Sarah Chen\\nSoftware Engineer\\nEmail: sarah.chen@email.com\\nPhone: (555) 123-4567\\n\\nEXPERIENCE\\nSenior Software Engineer at TechCorp (2020-2023)\\n• Developed full-stack applications using React, Node.js, and Python\\n• Led cross-functional team of 8 engineers on major product launch\\n• Reduced API response time by 45% through optimization efforts\\n\\nSOFTWARE ENGINEER at StartupXYZ (2018-2020)\\n• Built scalable microservices architecture\\n• Implemented CI/CD pipelines\\n\\nEDUCATION\\nBS Computer Science, University of Technology (2018)\\n\\nSKILLS\\nJavaScript, Python, React, Node.js, AWS, Docker",
            "overallScore": 7.5,
            "candidateName": "Sarah Chen",
            "potentialTitles": ["Senior Software Engineer", "Full Stack Developer", "Technical Lead", "Software Architect"],
            "strengths": [
                "Strong full-stack experience with React, Node.js, and Python demonstrated across 3 major projects",
                "Led cross-functional team of 8 engineers, showing leadership potential",
                "Quantified achievements: 'Reduced API response time by 45%' shows impact focus",
                "Active open-source contributor with 2.5k GitHub stars on personal projects"
            ],
            "improvements": [
                {
                    "category": "Keywords",
                    "suggestion": "Add cloud platform keywords like 'AWS', 'Docker', 'Kubernetes' which appear in 78% of senior roles",
                    "impact": "high"
                },
                {
                    "category": "Quantification",
                    "suggestion": "Quantify team leadership impact - add metrics like team velocity improvement or project delivery time",
                    "impact": "high"
                },
                {
                    "category": "Skills",
                    "suggestion": "Add a dedicated 'Technical Skills' section with categorized skills (Languages, Frameworks, Tools, Cloud)",
                    "impact": "medium"
                }
            ],
            "targetRoleMatch": {
                "Senior Software Engineer": 85,
                "Full Stack Developer": 78,
                "Technical Lead": 72
            },
            "strategy": "Your combination of technical depth and emerging leadership experience positions you well for senior IC or team lead roles. Focus on highlighting your mentorship experience and architectural decisions to stand out for technical lead positions.",
            "keywordGaps": ["Microservices", "CI/CD", "Agile", "System Design", "AWS/GCP", "Docker", "REST API", "Unit Testing"],
            "industryInsights": "The market for senior engineers with full-stack expertise is strong, with 23% YoY growth. Companies are especially seeking engineers who can mentor others and make architectural decisions.",
            "suggestedJobTitles": [
                "Senior Software Engineer",
                "Senior Full Stack Developer", 
                "Staff Software Engineer",
                "Technical Lead - Full Stack",
                "Principal Software Engineer",
                "Software Architect",
                "Engineering Manager",
                "Senior Backend Engineer"
            ],
            "targetCompanies": [
                "Mid-size tech companies (Series B-D startups)",
                "Fintech companies like Stripe, Square, Plaid",
                "Enterprise SaaS companies",
                "Remote-first companies like GitLab, Zapier",
                "Tech consultancies like Thoughtworks",
                "Major tech companies' product teams"
            ]
        }
        
        Scoring guidelines:
        - 9-10: Exceptional resume with strong quantification, keywords, and clear value proposition
        - 7-8: Good resume with minor improvements needed
        - 5-6: Average resume needing significant optimization
        - 3-4: Weak resume requiring major overhaul
        - 0-2: Very poor or incomplete resume
        
        IMPORTANT: 
        - ALWAYS include the complete raw_resume_text - this is critical!
        - Be generous with scores - most resumes should be 5-8
        - Provide specific, actionable suggestions
        - Include actual keywords and job titles relevant to their field
        - targetRoleMatch should use the exact titles from potentialTitles
        - Keep all text concise and valuable
        """

        # Generate analysis with text extraction
        response = model.generate_content([prompt, resume_file])
        analysis_results = json.loads(response.text)

        # Validate the response structure
        required_keys = [
            "raw_resume_text",  # This is the key addition!
            "overallScore",
            "candidateName",
            "potentialTitles",
            "strengths",
            "improvements",
            "targetRoleMatch",
            "strategy",
            "keywordGaps",
            "industryInsights",
            "suggestedJobTitles",
            "targetCompanies",
        ]

        for key in required_keys:
            if key not in analysis_results:
                logger.warning(f"Missing key in resume analysis: {key}")
                # Provide defaults for missing keys
                if key == "raw_resume_text":
                    analysis_results[key] = "Text extraction failed"
                elif key == "overallScore":
                    analysis_results[key] = 5.0
                elif key == "candidateName":
                    analysis_results[key] = "Not Found"
                elif key in [
                    "potentialTitles",
                    "strengths",
                    "keywordGaps",
                    "suggestedJobTitles",
                    "targetCompanies",
                ]:
                    analysis_results[key] = []
                elif key == "improvements":
                    analysis_results[key] = [
                        {
                            "category": "General",
                            "suggestion": "Resume could not be fully analyzed",
                            "impact": "high",
                        }
                    ]
                elif key == "targetRoleMatch":
                    analysis_results[key] = {}
                elif key == "strategy":
                    analysis_results[key] = (
                        "Focus on highlighting your key achievements and skills relevant to your target roles."
                    )
                elif key == "industryInsights":
                    analysis_results[key] = (
                        "The job market is competitive. Focus on showcasing your unique value proposition."
                    )

        # Ensure score is within range
        analysis_results["overallScore"] = max(
            0, min(10, float(analysis_results["overallScore"]))
        )

        # Log successful extraction
        text_length = len(analysis_results.get("raw_resume_text", ""))
        logger.info(
            f"Successfully analyzed resume with score: {analysis_results['overallScore']}, extracted text length: {text_length} characters"
        )

        return analysis_results

    except Exception as e:
        logger.error(f"Error analyzing resume with text extraction: {str(e)}")
        # Return a default error response with empty text
        return {
            "raw_resume_text": "",
            "overallScore": 0,
            "candidateName": "Error",
            "potentialTitles": [],
            "strengths": [],
            "improvements": [
                {
                    "category": "Error",
                    "suggestion": f"Unable to analyze resume: {str(e)}",
                    "impact": "high",
                }
            ],
            "targetRoleMatch": {},
            "strategy": "Please try uploading your resume again.",
            "keywordGaps": [],
            "industryInsights": "Unable to provide insights due to analysis error.",
            "suggestedJobTitles": [],
            "targetCompanies": [],
            "error": str(e),
        }


def generate_career_strategy_ticket(
    resume_analysis_json: Dict[str, Any],
    raw_resume_text: str,
    chat_transcript: List[Dict[str, Any]],
    finalized_goals: Dict[str, Any] = None,
) -> Dict[str, Any]:
    """
    Generate a career strategy proposal ticket using AI analysis with V7 ABC Playbook prompt

    Args:
        resume_analysis_json: The structured resume analysis results
        raw_resume_text: The full text content of the resume
        chat_transcript: List of conversation messages between user and AI
        finalized_goals: Optional dictionary containing user's finalized goals from ticket editing

    Returns:
        Dictionary containing the structured career strategy ticket with ABC Playbook framework
    """
    try:
        configure_genai()
        model = get_model()

        # Add finalized goals to the input data if provided
        if finalized_goals:
            logger.info(f"Using finalized goals from user editing: {finalized_goals}")

        # Create the V7 system prompt - "ABC Playbook" Proposal Generator
        system_prompt = """# ROLE & GOAL
You are an expert-level Career Strategist and a world-class Proposal Writer. Your primary function is to act as the final step in an automated client onboarding funnel. Your task is to synthesize all available client data (resume analysis, full resume text, and chat transcript) and generate a structured JSON object representing a compelling **"Account-Based Career (ABC) Playbook Proposal."** This ticket is the final, high-level proposal the client will review before they pay. It must be persuasive, clearly outline the value and deliverables, and compel the user to purchase the full, custom-built playbook.

# 1. CONTEXT: INPUT DATA STRUCTURE
You will receive three JSON objects as input: `resumeAnalysisJSON`, `rawResumeText`, and `chatTranscript`.
- `resumeAnalysisJSON`: High-level summary of resume strengths and weaknesses.
- `rawResumeText`: The full text of the client's resume for deeper analysis.
- `chatTranscript`: Conversation history between the client and AI career advisor.

# 2. OUTPUT STRUCTURE
Your response must be a valid JSON object matching this exact schema:

```json
{
  "client_info": {
    "name": "First Last",
    "target_roles": ["Primary Job Title", "Secondary Job Title", "Alternative Job Title"],
    "target_locations": ["City, State", "Remote"],
    "salary_goal": "$XX,000+",
    "suggested_salary_range": "$XX,000-$XX,000",
    "key_challenges": ["Challenge 1", "Challenge 2", "Challenge 3"]
  },
  "strategy_summary": "2-3 sentence strategic overview of their career situation and our ABC Playbook solution",
  "deliverable_previews": {
    "resume_tune_up_preview": "We don't just proofread. We upgrade your core asset to get past AI screeners and impress the human hiring managers who matter. [Specific improvements for this person's resume]",
    "opportunity_matrix_preview": "You're not just getting a list of jobs. You'll receive a curated intelligence report of 50+ high-value companies and the specific decision-makers to contact, including 'hidden market' opportunities that aren't on job boards. [Specific to their target role/industry]",
    "outreach_cadence_preview": "We provide you with the professionally written, non-generic messaging to start meaningful conversations on both email and LinkedIn (phone, instagram if applicable). [Specific messaging strategy for their background]",
    "action_playbook_preview": "You get a step-by-step GPS for the first two weeks of your campaign, telling you exactly who to contact, on which channel, and with what message each day. [Specific timeline for their situation]"
  },
  "internal_playbook_notes": {
    "resume_optimization_focus": ["Specific areas to improve on their resume"],
    "target_company_types": ["Types of companies to research for their matrix"],
    "messaging_angles": ["Key value propositions to highlight in outreach"],
    "timeline_priorities": ["Most important actions for first 2 weeks"]
  }
}
```

# 3. INSTRUCTIONS FOR EACH OUTPUT FIELD

## client_info
- **name**: Extract from resume or chat. If unclear, use "Career Accelerator Client"
- **target_roles**: Generate 2-4 specific, well-matched job titles based on resume analysis and chat conversation. Prioritize by fit (e.g., ["Senior Product Manager", "Product Manager", "Associate Product Manager"]). Use the suggestedJobTitles from resume analysis and conversation insights
- **target_locations**: Include 1-3 realistic locations from resume/chat. Always include "Remote" as an option
- **salary_goal**: Provide a realistic range based on role/experience (e.g., "$120,000+")
- **suggested_salary_range**: More specific range for negotiation (e.g., "$115,000-$135,000")
- **key_challenges**: Identify 3 specific obstacles preventing them from landing their target role

## strategy_summary
Write 2-3 compelling sentences that:
- Acknowledge their current situation/frustration
- Position our ABC Playbook as the strategic solution
- Create urgency around taking action now

## deliverable_previews
Each preview MUST start with the exact framework text provided, then add specific details:
- **resume_tune_up_preview**: Start with "We don't just proofread..." then add specific improvements for their resume
- **opportunity_matrix_preview**: Start with "You're not just getting a list of jobs..." then add industry/role-specific targeting
- **outreach_cadence_preview**: Start with "You're not just getting templates..." then add messaging strategy details
- **action_playbook_preview**: Start with "You're not just getting advice..." then add specific timeline elements

## internal_playbook_notes
These are internal notes for our team to execute the playbook:
- **resume_optimization_focus**: 3-5 specific areas to improve on their resume
- **target_company_types**: 3-5 types of companies to research for their opportunity matrix
- **messaging_angles**: 3-5 key value propositions to highlight in outreach messages
- **timeline_priorities**: 3-5 most important actions for the first 2 weeks

# 4. WRITING STYLE & FRAMEWORK
- Use the "Account-Based Career" terminology throughout
- Professional but conversational tone
- Results-focused and hyper-specific to their situation
- Create excitement about the transformation
- Use power words: "strategic," "targeted," "intelligence," "GPS," "non-generic"
- Frame everything around the outcome, not just the deliverable
- Emphasize the "done-for-you" nature of the system

# 5. PERSONALIZATION REQUIREMENTS
Every field must feel custom-built for this specific person:
- Reference their specific industry/role in examples
- Mention their experience level appropriately
- Address their unique challenges and goals
- Use language that matches their professional level
- Include realistic salary ranges for their market/role
- **CRITICAL**: Use the `suggestedJobTitles` from the resume analysis as a foundation for generating target_roles, but also consider insights from the chat conversation to refine and prioritize the roles"""

        # Format the input data for the prompt
        input_data = f"""
resumeAnalysisJSON: {json.dumps(resume_analysis_json, indent=2)}

rawResumeText: "{raw_resume_text}"

chatTranscript: {json.dumps(chat_transcript, indent=2)}
"""

        # Add finalized goals if provided
        if finalized_goals:
            input_data += f"\nfinalizedGoals: {json.dumps(finalized_goals, indent=2)}"

        # Generate the career strategy ticket
        full_prompt = f"{system_prompt}\n\n{input_data}"

        response = model.generate_content(full_prompt)

        # Parse the JSON response
        try:
            ticket_data = json.loads(response.text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini response as JSON: {e}")
            logger.error(f"Raw response: {response.text}")
            # Return a fallback structure matching V7 schema
            return {
                "client_info": {
                    "name": resume_analysis_json.get("candidateName", "Candidate"),
                    "target_roles": resume_analysis_json.get(
                        "suggestedJobTitles", ["Professional Role"]
                    )[:3],
                    "target_locations": ["Location TBD"],
                    "salary_goal": None,
                    "suggested_salary_range": "$50,000-$80,000",
                    "key_challenges": [
                        "Finding the right opportunities",
                        "Standing out in applications",
                        "Getting responses from hiring managers",
                    ],
                },
                "strategy_summary": "We'll help you create a strategic Account-Based Career (ABC) Playbook approach to your job search that gets results.",
                "deliverable_previews": {
                    "resume_tune_up_preview": "We don't just proofread. We upgrade your core asset to get past AI screeners and impress the human hiring managers who matter. Professional optimization of your resume to highlight your strongest qualifications.",
                    "opportunity_matrix_preview": "You're not just getting a list of jobs. You'll receive a curated intelligence report of 50+ high-value companies and the specific decision-makers to contact, including 'hidden market' opportunities that aren't on job boards.",
                    "outreach_cadence_preview": "You're not just getting templates. We provide you with the professionally written, non-generic messaging to start meaningful conversations on both email and LinkedIn.",
                    "action_playbook_preview": "You're not just getting advice. You get a step-by-step GPS for the first two weeks of your campaign, telling you exactly who to contact, on which channel, and with what message each day.",
                },
                "internal_playbook_notes": {
                    "resume_optimization_focus": ["General resume improvements needed"],
                    "target_company_types": ["Companies matching candidate profile"],
                    "messaging_angles": ["Professional background and experience"],
                    "timeline_priorities": [
                        "Resume optimization",
                        "Company research",
                        "Initial outreach",
                    ],
                },
            }

        # Validate the required structure
        required_keys = [
            "client_info",
            "strategy_summary",
            "deliverable_previews",
            "internal_playbook_notes",
        ]
        if not all(key in ticket_data for key in required_keys):
            logger.error("Generated ticket missing required keys")
            raise ValueError("Invalid ticket structure generated")

        # Validate client_info structure
        client_info_keys = [
            "name",
            "target_roles",
            "target_locations",
            "key_challenges",
        ]
        if not all(key in ticket_data["client_info"] for key in client_info_keys):
            logger.error("Generated ticket client_info missing required keys")

        # Validate deliverable_previews structure
        deliverable_keys = [
            "resume_tune_up_preview",
            "opportunity_matrix_preview",
            "outreach_cadence_preview",
            "action_playbook_preview",
        ]
        if not all(
            key in ticket_data["deliverable_previews"] for key in deliverable_keys
        ):
            logger.error("Generated ticket deliverable_previews missing required keys")

        logger.info(
            f"Successfully generated career strategy ticket for: {ticket_data['client_info'].get('name', 'Unknown')}"
        )
        logger.info(
            f"Generated {len(ticket_data['client_info'].get('target_roles', []))} target roles: {ticket_data['client_info'].get('target_roles', [])}"
        )
        return ticket_data

    except Exception as e:
        logger.error(f"Error generating career strategy ticket: {str(e)}")
        # Return a basic fallback structure matching V7 schema
        return {
            "client_info": {
                "name": resume_analysis_json.get("candidateName", "Candidate"),
                "target_roles": resume_analysis_json.get(
                    "suggestedJobTitles", ["Professional Role"]
                )[:3],
                "target_locations": ["Location TBD"],
                "salary_goal": None,
                "suggested_salary_range": "$50,000-$80,000",
                "key_challenges": [
                    "Career advancement",
                    "Job search optimization",
                    "Getting noticed by employers",
                ],
            },
            "strategy_summary": "We'll create a comprehensive Account-Based Career (ABC) Playbook acceleration strategy tailored to your goals.",
            "deliverable_previews": {
                "resume_tune_up_preview": "We don't just proofread. We upgrade your core asset to get past AI screeners and impress the human hiring managers who matter. Professional resume optimization to showcase your strongest qualifications and achievements.",
                "opportunity_matrix_preview": "You're not just getting a list of jobs. You'll receive a curated intelligence report of 50+ high-value companies and the specific decision-makers to contact, including 'hidden market' opportunities that aren't on job boards.",
                "outreach_cadence_preview": "You're not just getting templates. We provide you with the professionally written, non-generic messaging to start meaningful conversations on both email and LinkedIn.",
                "action_playbook_preview": "You're not just getting advice. You get a step-by-step GPS for the first two weeks of your campaign, telling you exactly who to contact, on which channel, and with what message each day.",
            },
            "internal_playbook_notes": {
                "resume_optimization_focus": ["General resume improvements needed"],
                "target_company_types": ["Companies matching candidate profile"],
                "messaging_angles": ["Professional background and experience"],
                "timeline_priorities": [
                    "Resume optimization",
                    "Company research",
                    "Initial outreach",
                ],
            },
        }


def generate_csv_structure(headers, sample_rows, filename="uploaded_file.csv"):
    """
    Analyze CSV headers and sample data to generate intelligent field descriptions for sales intelligence

    Args:
        headers: List of column headers from the CSV
        sample_rows: List of sample data rows (first few rows of CSV)
        filename: Name of the uploaded file

    Returns:
        Dictionary with suggested template structure and AI-generated field descriptions
    """
    try:
        configure_genai()
        model = get_model()

        # Create analysis prompt for sales intelligence
        analysis_prompt = f"""
        You are analyzing a CSV file for B2B sales intelligence data. Based on the headers and sample data, provide insights about the data structure and suggest how to use this information for lead qualification, personalization, and outreach strategy.

        Filename: {filename}
        Headers: {', '.join(headers)}
        
        Sample rows:
        {chr(10).join(sample_rows[:3])}  # First 3 rows for analysis
        
        Analyze this data and provide a JSON response with the following structure:
        {{
            "suggested_template_name": "A descriptive name for this intelligence data",
            "row_count": {len(sample_rows)},
            "analysis_summary": "Brief description of what this data represents and its sales intelligence value",
            "columns": [
                {{
                    "name": "column_name",
                    "usage_note": "How this data can be used for sales intelligence, lead qualification, and personalization",
                    "data_type": "text|number|email|phone|company|person|url|date",
                    "example": "sample value from the data",
                    "confidence": 0.9,
                    "intelligence_value": "high|medium|low"
                }}
            ],
            "recommendations": [
                "List of specific recommendations for using this intelligence data in sales outreach"
            ]
        }}
        
        Focus on sales intelligence value:
        - How can this data help with lead qualification?
        - What personalization opportunities does it provide?
        - How can it improve outreach strategy and conversion rates?
        - What fields are most valuable for sales teams?
        
        Provide specific, actionable insights for each column based on the actual data patterns you observe.
        """

        # Get analysis from Gemini
        response = model.generate_content(analysis_prompt)
        analysis = json.loads(response.text)

        # Validate the response structure
        required_keys = ["suggested_template_name", "columns", "analysis_summary"]
        if not all(key in analysis for key in required_keys):
            raise ValueError("Invalid analysis response structure")

        # Validate columns structure
        for col in analysis["columns"]:
            required_col_keys = [
                "name",
                "usage_note",
                "data_type",
                "intelligence_value",
            ]
            if not all(key in col for key in required_col_keys):
                raise ValueError(
                    f"Invalid column structure for {col.get('name', 'unknown')}"
                )

        logger.info(
            f"Successfully analyzed CSV intelligence data with {len(headers)} columns"
        )
        return analysis

    except Exception as e:
        logger.error(f"Error analyzing CSV for intelligence: {str(e)}")
        # Return fallback analysis if Gemini fails
        return {
            "suggested_template_name": f"Intelligence Data - {datetime.now().strftime('%Y%m%d')}",
            "row_count": len(sample_rows),
            "analysis_summary": f"CSV file with {len(headers)} columns containing sales intelligence data",
            "columns": [
                {
                    "name": header.strip(),
                    "usage_note": f"Sales intelligence field: {header.strip()}. Review and customize usage for your specific outreach strategy.",
                    "data_type": "text",
                    "example": (
                        sample_rows[0].split(",")[i]
                        if i < len(sample_rows[0].split(","))
                        else ""
                    ),
                    "confidence": 0.7,
                    "intelligence_value": "medium",
                }
                for i, header in enumerate(headers)
            ],
            "recommendations": [
                "Review and verify data accuracy before using for outreach",
                "Map fields to your CRM system for better tracking",
                "Create personalized outreach campaigns using the available data",
                "Segment leads based on company size, industry, or other relevant fields",
            ],
        }


def generate_ai_consulting_proposal(
    session_id: str, chat_history: List[Dict[str, Any]], context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Generate a structured AI consulting proposal based on chat conversation
    with multiple package options and accurate pricing/timeline estimates

    Args:
        session_id: Unique session identifier
        chat_history: List of chat messages between user and AI strategist
        context: Optional additional context for proposal generation

    Returns:
        Dictionary containing structured proposal data with multiple packages
    """
    try:
        configure_genai()
        model = get_model()

        # Build conversation transcript
        transcript = ""
        for msg in chat_history:
            role = "Client" if msg["role"] == "user" else "AI Strategist"
            content = msg.get("content", "")
            transcript += f"{role}: {content}\n\n"

        # Enhanced proposal generation prompt
        proposal_prompt = f"""
        You are an elite AI consultant and solution architect with expertise in cutting-edge AI implementations. Analyze this discovery conversation to craft a compelling, value-driven proposal with multiple package options.

        CONVERSATION TRANSCRIPT:
        {transcript}

        Generate a HIGHLY CUSTOMIZED proposal that speaks directly to the client's unique situation, challenges, and opportunities.

        Return ONLY valid JSON with these exact fields:

        {{
            "summary": "A compelling 2-3 sentence summary that captures their SPECIFIC problem, YOUR unique solution approach, and the MEASURABLE business impact",
            "packages": [
                {{
                    "name": "Discovery & Strategy",
                    "description": "Perfect for validating ideas and creating a roadmap",
                    "priceRange": {{
                        "min": 50000,  // in cents ($500)
                        "max": 150000  // in cents ($1,500)
                    }},
                    "timelineRange": {{
                        "min": 3,  // days
                        "max": 7   // days
                    }},
                    "deliverables": [
                        "Feasibility assessment and technical validation",
                        "Strategic roadmap with prioritized initiatives",
                        "Architecture recommendations",
                        "Risk analysis and mitigation strategies"
                    ],
                    "ideal_for": "Companies exploring AI adoption or validating specific use cases"
                }},
                {{
                    "name": "MVP & Proof of Concept",
                    "description": "Build a working prototype to test with real users",
                    "priceRange": {{
                        "min": 500000,  // in cents ($5,000)
                        "max": 1500000  // in cents ($15,000)
                    }},
                    "timelineRange": {{
                        "min": 14,  // days
                        "max": 30   // days
                    }},
                    "deliverables": [
                        "Functional MVP with core AI features",
                        "Basic user interface and experience",
                        "Integration with 1-2 key systems",
                        "Testing results and performance metrics",
                        "Deployment guide and documentation"
                    ],
                    "ideal_for": "Teams ready to build and test their AI solution quickly"
                }},
                {{
                    "name": "Production-Ready Solution",
                    "description": "Enterprise-grade implementation with full support",
                    "priceRange": {{
                        "min": 2500000,  // in cents ($25,000)
                        "max": 10000000  // in cents ($100,000)
                    }},
                    "timelineRange": {{
                        "min": 30,  // days
                        "max": 90   // days
                    }},
                    "deliverables": [
                        "Scalable production system with monitoring",
                        "Complete API and integration layer",
                        "Advanced AI model optimization",
                        "Security and compliance implementation",
                        "Team training and knowledge transfer",
                        "90-day post-launch support"
                    ],
                    "ideal_for": "Organizations ready for full-scale AI deployment"
                }}
            ],
            "recommendedPackage": 0,  // Index of recommended package based on conversation (0, 1, or 2)
            "customizationNotes": "Specific adjustments we'd make to the package based on their needs",
            "projectScope": {{
                "technical_requirements": ["List of 3-4 SPECIFIC technical requirements based on their stack/needs"],
                "business_objectives": ["List of 3-4 MEASURABLE business goals they mentioned"],
                "success_metrics": ["List of 3-4 QUANTIFIABLE success criteria tied to their KPIs"],
                "key_challenges": ["List of 2-3 main challenges to address"]
            }},
            "valueProposition": "A compelling 2-3 sentence explanation of ROI using their specific metrics/pain points",
            "nextSteps": [
                "Submit your contact information and any additional context",
                "We'll review your requirements and send a detailed proposal within 24 hours",
                "Schedule a follow-up call to discuss the proposal and answer questions"
            ],
            "riskMitigation": ["List of 2-3 specific risks they might worry about and how we'll address them"],
            "uniqueInsights": ["List of 2-3 strategic insights or opportunities they might not have considered"],
            "technicalApproach": "Brief overview of the technical approach/architecture we'd recommend",
            "clientContext": {{
                "industry": "Their industry/domain",
                "companySize": "Startup/SMB/Enterprise",
                "technicalMaturity": "Low/Medium/High",
                "urgency": "Low/Medium/High",
                "budget_indicators": "Notes about budget constraints or expectations mentioned"
            }}
        }}

        PACKAGE SELECTION CRITERIA:

        **Discovery & Strategy** - Recommend when:
        - They're exploring possibilities or need validation
        - Unclear requirements or multiple potential approaches
        - Need to build internal buy-in
        - Limited technical experience with AI
        - Budget conscious or testing the waters

        **MVP & Proof of Concept** - Recommend when:
        - Clear use case identified
        - Need to validate with real users/data
        - Have some technical capability
        - Ready to invest but want to minimize risk
        - 1-3 month timeline mentioned

        **Production-Ready Solution** - Recommend when:
        - Clear requirements and strong business case
        - Need enterprise features (scale, security, compliance)
        - Have technical team to maintain
        - Mentioned significant budget or ROI expectations
        - Need comprehensive solution quickly

        PRICING PHILOSOPHY:
        - Price based on value delivered, not just time
        - Consider complexity, risk, and business impact
        - Account for industry standards and client size
        - Be transparent about what drives cost

        IMPORTANT: 
        - Every field should feel custom-written for THIS specific client
        - Price ranges should reflect the actual scope discussed
        - Timelines should be realistic based on complexity
        - Package names can be customized if needed
        """

        response = model.generate_content(proposal_prompt)
        proposal_text = response.text.strip()

        # Clean up the response to ensure valid JSON
        if proposal_text.startswith("```json"):
            proposal_text = proposal_text[7:]
        elif proposal_text.startswith("```"):
            proposal_text = proposal_text[3:]

        if proposal_text.endswith("```"):
            proposal_text = proposal_text[:-3]

        proposal_text = proposal_text.strip()

        # Parse JSON response
        try:
            proposal_data = json.loads(proposal_text)

            # Validate and provide defaults for required fields
            if "packages" not in proposal_data or not proposal_data["packages"]:
                # Provide default packages if missing
                proposal_data["packages"] = [
                    {
                        "name": "Discovery & Strategy",
                        "description": "Perfect for validating ideas and creating a roadmap",
                        "priceRange": {"min": 50000, "max": 150000},
                        "timelineRange": {"min": 3, "max": 7},
                        "deliverables": [
                            "Feasibility assessment and technical validation",
                            "Strategic roadmap with prioritized initiatives",
                            "Architecture recommendations",
                            "Risk analysis and mitigation strategies",
                        ],
                        "ideal_for": "Companies exploring AI adoption",
                    },
                    {
                        "name": "MVP & Proof of Concept",
                        "description": "Build a working prototype to test with real users",
                        "priceRange": {"min": 500000, "max": 1500000},
                        "timelineRange": {"min": 14, "max": 30},
                        "deliverables": [
                            "Functional MVP with core AI features",
                            "Basic user interface",
                            "Integration with key systems",
                            "Testing results and metrics",
                        ],
                        "ideal_for": "Teams ready to build and test",
                    },
                    {
                        "name": "Production-Ready Solution",
                        "description": "Enterprise-grade implementation",
                        "priceRange": {"min": 2500000, "max": 10000000},
                        "timelineRange": {"min": 30, "max": 90},
                        "deliverables": [
                            "Scalable production system",
                            "Complete API layer",
                            "Security implementation",
                            "Team training and support",
                        ],
                        "ideal_for": "Organizations ready for deployment",
                    },
                ]

            # Ensure numeric fields in packages are correct type
            for package in proposal_data["packages"]:
                if "priceRange" in package:
                    package["priceRange"]["min"] = int(package["priceRange"]["min"])
                    package["priceRange"]["max"] = int(package["priceRange"]["max"])
                if "timelineRange" in package:
                    package["timelineRange"]["min"] = int(
                        package["timelineRange"]["min"]
                    )
                    package["timelineRange"]["max"] = int(
                        package["timelineRange"]["max"]
                    )

            # Set recommendedPackage to valid index
            if "recommendedPackage" not in proposal_data:
                proposal_data["recommendedPackage"] = 1  # Default to MVP
            else:
                # Ensure it's a valid index
                proposal_data["recommendedPackage"] = max(
                    0,
                    min(
                        int(proposal_data["recommendedPackage"]),
                        len(proposal_data["packages"]) - 1,
                    ),
                )

            # Ensure other required fields
            required_fields = {
                "summary": "Custom AI consulting engagement to address your specific project requirements and strategic objectives.",
                "customizationNotes": "We'll tailor this package to your specific needs and constraints.",
                "valueProposition": "Strategic guidance to accelerate your AI project with expert insights and proven methodologies.",
                "nextSteps": [
                    "Submit your contact information",
                    "Receive detailed proposal within 24 hours",
                    "Schedule follow-up discussion",
                ],
            }

            for field, default_value in required_fields.items():
                if field not in proposal_data:
                    proposal_data[field] = default_value

            # Add metadata
            proposal_data["sessionId"] = session_id
            proposal_data["generatedAt"] = datetime.now().isoformat()
            proposal_data["conversationLength"] = len(chat_history)

            logger.info(
                f"Successfully generated multi-package proposal for session {session_id}"
            )
            return proposal_data

        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error for session {session_id}: {e}")
            logger.error(f"Raw response: {proposal_text}")
            raise ValueError("Failed to parse AI response as valid JSON")

    except Exception as e:
        logger.error(
            f"Error generating AI consulting proposal for session {session_id}: {str(e)}"
        )

        # Return fallback proposal structure with packages
        fallback_proposal = {
            "summary": "Custom AI consulting engagement to address your project requirements and strategic objectives.",
            "packages": [
                {
                    "name": "Discovery & Strategy",
                    "description": "Perfect for validating ideas and creating a roadmap",
                    "priceRange": {"min": 50000, "max": 150000},
                    "timelineRange": {"min": 3, "max": 7},
                    "deliverables": [
                        "Feasibility assessment",
                        "Strategic roadmap",
                        "Architecture recommendations",
                        "Risk analysis",
                    ],
                    "ideal_for": "Companies exploring AI adoption",
                },
                {
                    "name": "MVP & Proof of Concept",
                    "description": "Build a working prototype",
                    "priceRange": {"min": 500000, "max": 1500000},
                    "timelineRange": {"min": 14, "max": 30},
                    "deliverables": [
                        "Functional MVP",
                        "User interface",
                        "System integration",
                        "Testing results",
                    ],
                    "ideal_for": "Teams ready to build",
                },
                {
                    "name": "Production-Ready Solution",
                    "description": "Enterprise-grade implementation",
                    "priceRange": {"min": 2500000, "max": 10000000},
                    "timelineRange": {"min": 30, "max": 90},
                    "deliverables": [
                        "Production system",
                        "API layer",
                        "Security features",
                        "Team training",
                    ],
                    "ideal_for": "Ready for deployment",
                },
            ],
            "recommendedPackage": 1,
            "customizationNotes": "We'll tailor this to your needs.",
            "valueProposition": "Expert AI consulting to accelerate your project.",
            "nextSteps": [
                "Submit contact information",
                "Receive proposal within 24 hours",
                "Schedule discussion",
            ],
            "sessionId": session_id,
            "generatedAt": datetime.now().isoformat(),
            "conversationLength": len(chat_history),
            "fallback": True,
            "error": str(e),
        }

        return fallback_proposal


def generate_funnel_chat_response(
    session_id: str, agent_type: str, chat_history: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Generate AI chat response for funnel conversations

    Args:
        session_id: Unique session identifier
        agent_type: Type of AI agent (e.g., 'ai_consulting_strategist')
        chat_history: Complete conversation history

    Returns:
        Dictionary with AI response content
    """
    try:
        configure_genai()
        model = get_model()

        # Define agent personas and prompts
        AGENT_PROMPTS = {
            "ai_consulting_strategist": """
            You are an elite AI solutions architect with deep expertise across the entire AI stack - from LLMs and computer vision to MLOps and data engineering. You've led AI transformations at both startups and Fortune 500 companies.

            Your mission is to conduct a sophisticated discovery session that uncovers not just what they want, but what they actually NEED to succeed.

            DISCOVERY FRAMEWORK:

            1. **Business Impact Analysis**
               - What specific metrics will improve? (revenue, cost, time, quality)
               - What's the cost of inaction? (competitive disadvantage, missed opportunities)
               - What's their success criteria in concrete terms?

            2. **Technical Architecture Deep Dive**
               - Current data infrastructure and quality assessment
               - Integration points and system dependencies
               - Security, compliance, and governance requirements
               - Performance and scalability needs

            3. **Solution Design Considerations**
               - Build vs buy vs hybrid evaluation
               - MVP vs full implementation approach
               - Quick wins vs strategic initiatives
               - Risk factors and mitigation strategies

            4. **Organizational Readiness**
               - Technical team capabilities and gaps
               - Change management considerations
               - Budget reality vs aspirations
               - Decision-making process and timeline

            CONVERSATION STRATEGY:

            - Start with business impact, then drill into technical details
            - Share relevant insights from similar implementations you've seen
            - Identify opportunities they haven't considered
            - Challenge assumptions constructively
            - Propose innovative approaches when appropriate

            RESPONSE GUIDELINES:

            - Ask ONE powerful question at a time
            - Include a brief insight or observation that adds value
            - Reference specific technologies/approaches when relevant
            - Keep responses concise but substantial (2-3 paragraphs max)
            - After 5-7 substantive exchanges, synthesize findings and suggest proposal generation

            TONE:
            Position yourself as a trusted advisor who's genuinely excited about their project's potential. Be confident, insightful, and solutions-oriented.

            Remember: Every response should move the conversation forward and add tangible value.
            """
        }

        # Get system prompt for agent type
        system_prompt = AGENT_PROMPTS.get(
            agent_type, AGENT_PROMPTS["ai_consulting_strategist"]
        )

        # Build conversation context
        conversation_text = ""
        for msg in chat_history:
            role = "User" if msg["role"] == "user" else "Assistant"
            conversation_text += f"{role}: {msg['content']}\n"

        # Create the full prompt
        full_prompt = f"""
        {system_prompt}
        
        CONVERSATION HISTORY:
        {conversation_text}
        
        Respond as the AI strategist to continue this conversation. Focus on gathering information needed for a compelling project proposal.
        
        Provide ONLY your response content, no additional formatting or labels.
        """

        # Generate response
        response = model.generate_content(full_prompt)
        ai_response = response.text.strip()

        # Log the conversation turn to database
        try:
            from models import ConversationLogs, db

            # Log the user's message if this is a response to user input
            if chat_history and chat_history[-1]["role"] == "user":
                user_log = ConversationLogs(
                    session_id=session_id,
                    role="user",
                    content=chat_history[-1]["content"],
                    agent_type=agent_type,
                )
                db.session.add(user_log)

            # Log the AI response
            ai_log = ConversationLogs(
                session_id=session_id,
                role="assistant",
                content=ai_response,
                agent_type=agent_type,
            )
            db.session.add(ai_log)
            db.session.commit()

        except Exception as db_error:
            logger.error(
                f"Failed to log conversation for session {session_id}: {db_error}"
            )
            # Don't fail the whole request if logging fails

        logger.info(
            f"Generated chat response for session {session_id}, agent {agent_type}"
        )

        return {
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.now().isoformat(),
            "sessionId": session_id,
        }

    except Exception as e:
        logger.error(
            f"Error generating funnel chat response for session {session_id}: {str(e)}"
        )

        # Return fallback response
        return {
            "role": "assistant",
            "content": "I apologize, but I'm having trouble processing your message right now. Could you please try rephrasing your question?",
            "timestamp": datetime.now().isoformat(),
            "sessionId": session_id,
            "error": str(e),
        }


# Add this new function after the existing functions, before the career-related functions


def generate_system_architecture_diagram(
    chat_history: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Analyze chat conversation and generate a detailed system architecture diagram
    with components, connections, data flows, and visual layout information.
    """
    try:
        configure_genai()
        model = get_model(model_name="gemini-2.0-flash")

        if not chat_history or len(chat_history) < 2:
            return {
                "components": [],
                "connections": [],
                "diagram_metadata": {
                    "title": "System Architecture",
                    "subtitle": "Start chatting to see your system design",
                    "complexity_level": "basic",
                    "technology_stack": [],
                    "data_flows": [],
                },
            }

        # Extract conversation text
        conversation_text = "\n".join(
            [f"{msg['role'].upper()}: {msg['content']}" for msg in chat_history]
        )

        prompt = f"""
You are an expert system architect and technical diagramming specialist. Analyze this conversation between a user and an AI consultant to generate a comprehensive system architecture diagram.

CONVERSATION:
{conversation_text}

Based on this conversation, generate a detailed system architecture diagram with the following structure:

OUTPUT FORMAT (JSON):
{{
    "components": [
        {{
            "id": "unique_component_id",
            "name": "Component Display Name",
            "type": "frontend|backend|database|external_api|ai_model|data_pipeline|storage|auth|payment|messaging|analytics|cdn|load_balancer|microservice|third_party",
            "technology": "Specific technology/framework if mentioned",
            "description": "Brief description of component's role",
            "position": {{
                "x": 100-800,
                "y": 50-700
            }},
            "size": {{
                "width": 140-220,
                "height": 90-130
            }},
            "color": "#hex_color_based_on_type",
            "icon": "component_icon_name",
            "confidence": 0.1-1.0,
            "mentioned_explicitly": true/false,
            "inferred_from_context": true/false
        }}
    ],
    "connections": [
        {{
            "id": "connection_id",
            "source": "source_component_id",
            "target": "target_component_id",
            "type": "api_call|data_flow|authentication|webhook|real_time|batch_process|user_interaction|third_party_integration",
            "label": "Connection description",
            "bidirectional": true/false,
            "data_type": "json|file|stream|authentication|payment|user_data|analytics",
            "protocol": "REST|GraphQL|WebSocket|gRPC|HTTP|HTTPS|Database",
            "confidence": 0.1-1.0,
            "style": {{
                "strokeColor": "#hex_color",
                "strokeWidth": 2-4,
                "strokeDashArray": "0|5,5|10,5"
            }}
        }}
    ],
    "data_flows": [
        {{
            "id": "flow_id",
            "name": "Data Flow Name",
            "path": ["component_id_1", "component_id_2", "component_id_3"],
            "data_type": "user_data|analytics|payments|content|real_time_updates",
            "flow_direction": "unidirectional|bidirectional|circular",
            "volume": "low|medium|high|real_time",
            "security_level": "public|authenticated|encrypted|pci_compliant"
        }}
    ],
    "diagram_metadata": {{
        "title": "Generated Architecture Title",
        "subtitle": "Brief description of the system",
        "complexity_level": "simple|moderate|complex|enterprise",
        "system_type": "web_app|mobile_app|api|data_pipeline|ai_system|e_commerce|saas|microservices",
        "technology_stack": [
            {{
                "category": "frontend|backend|database|cloud|ai_ml|third_party",
                "technologies": ["React", "Node.js", "etc."]
            }}
        ],
        "scalability_considerations": ["horizontal_scaling", "caching", "etc."],
        "security_features": ["authentication", "encryption", "etc."],
        "estimated_timeline": "2-4 weeks|1-3 months|3-6 months|6+ months",
        "complexity_score": 1-10,
        "budget_range": "small|medium|large|enterprise",
        "key_challenges": ["challenge1", "challenge2"],
        "success_metrics": ["metric1", "metric2"]
    }},
    "layout_config": {{
        "canvas_size": {{
            "width": 1000,
            "height": 800
        }},
        "grid_layout": {{
            "rows": 4,
            "columns": 4,
            "cell_padding": 25
        }},
        "component_clustering": [
            {{
                "cluster_id": "frontend_cluster",
                "name": "Frontend Layer",
                "components": ["comp1", "comp2"],
                "position": {{"x": 50, "y": 50}},
                "size": {{"width": 250, "height": 150}},
                "color": "#f0f8ff"
            }}
        ]
    }}
}}

DIAGRAM GENERATION RULES:

1. **Component Identification:**
   - Extract all mentioned technologies, services, and system components
   - Infer standard components that would be needed (auth, database, etc.)
   - Assign appropriate types and technologies
   - Position components logically (frontend left, backend center, data right)

2. **Visual Layout (VERY IMPORTANT):**
   - Your primary goal is to create a spacious, aesthetically pleasing, and easy-to-read diagram.
   - **DO NOT OVERLAP COMPONENTS.** Ensure ample space between all nodes.
   - **Use the full canvas dimensions (1000x800px)** to properly distribute components.
   - Minimum spacing between components: 80px horizontal, 60px vertical
   - Position components in logical layers:
     * Frontend/User-facing: x=80-280, y=120-350
     * API/Backend services: x=380-620, y=120-550
     * Databases/Storage: x=700-920, y=120-450
     * External services: x=700-920, y=500-700
   - **Vertically stagger components** at the same horizontal level to prevent visual monotony and create dynamic layouts.
   - Component sizes should be proportional: width 160-250px, height 100-140px
   - Ensure connections have clear paths without overlapping components.

3. **Connection Logic:**
   - Identify data flows and API calls from conversation context
   - Show user interactions, data persistence, external integrations
   - Use different line styles for different connection types
   - Include authentication flows, payment processing, etc.

4. **Technology-Specific Colors:**
   - Frontend: #3498db (blue)
   - Backend: #2ecc71 (green) 
   - Database: #e74c3c (red)
   - AI/ML: #9b59b6 (purple)
   - External APIs: #f39c12 (orange)
   - Auth/Security: #34495e (dark gray)
   - Analytics: #1abc9c (teal)

5. **Confidence Scoring:**
   - 1.0: Explicitly mentioned in conversation
   - 0.8: Strongly implied by requirements
   - 0.6: Standard component for this type of system
   - 0.4: Inferred from best practices
   - 0.2: Speculative but likely needed

6. **Adaptive Complexity:**
   - Simple systems: 3-5 components, basic connections
   - Moderate systems: 6-10 components, multiple data flows
   - Complex systems: 10+ components, microservices, advanced patterns

IMPORTANT: Generate a diagram that accurately reflects what was discussed while filling in reasonable architectural patterns and best practices. Focus on creating a visually appealing and technically accurate representation.
"""

        response = model.generate_content(prompt)

        if not response or not response.text:
            logger.error("Empty response from Gemini for system diagram generation")
            return {
                "error": "Failed to generate diagram",
                "components": [],
                "connections": [],
            }

        # Parse the JSON response
        import json

        try:
            # Clean the response text
            response_text = response.text.strip()

            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]

            diagram_data = json.loads(response_text)

            # Validate and enhance the diagram data
            validated_data = validate_and_enhance_diagram(diagram_data)

            logger.info(
                f"Generated system diagram with {len(validated_data.get('components', []))} components and {len(validated_data.get('connections', []))} connections"
            )

            return validated_data

        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error for system diagram: {e}")
            logger.error(f"Raw response: {response.text[:500]}...")

            # Return a fallback simple diagram
            return generate_fallback_diagram(chat_history)

    except Exception as e:
        logger.error(f"Error generating system architecture diagram: {str(e)}")
        return generate_fallback_diagram(chat_history)


def validate_and_enhance_diagram(diagram_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and enhance the generated diagram data with defaults and corrections.
    """
    try:
        # Ensure required top-level keys exist
        if "components" not in diagram_data:
            diagram_data["components"] = []
        if "connections" not in diagram_data:
            diagram_data["connections"] = []
        if "diagram_metadata" not in diagram_data:
            diagram_data["diagram_metadata"] = {}

        # Validate and enhance components
        enhanced_components = []
        component_ids = set()

        for i, component in enumerate(diagram_data.get("components", [])):
            # Ensure required fields
            component_id = component.get("id", f"component_{i}")
            if component_id in component_ids:
                component_id = f"{component_id}_{i}"
            component_ids.add(component_id)

            # Improved positioning based on component type
            comp_type = component.get("type", "backend")
            default_x = 450  # Center by default
            default_y = 100 + (i * 120)  # Vertical spacing

            # Position based on component type
            if comp_type in ["frontend", "user"]:
                default_x = 100 + (i % 2) * 150
                default_y = 150 + (i // 2) * 120
            elif comp_type in ["backend", "api", "microservice"]:
                default_x = 400 + (i % 2) * 150
                default_y = 100 + (i // 2) * 120
            elif comp_type in ["database", "storage"]:
                default_x = 700 + (i % 2) * 120
                default_y = 150 + (i // 2) * 120
            elif comp_type in ["external_api", "third_party"]:
                default_x = 700 + (i % 2) * 120
                default_y = 450 + (i // 2) * 100

            enhanced_component = {
                "id": component_id,
                "name": component.get("name", f"Component {i+1}"),
                "type": comp_type,
                "technology": component.get("technology", ""),
                "description": component.get("description", ""),
                "position": {
                    "x": max(
                        50,
                        min(
                            850,
                            component.get("position", {}).get("x", default_x),
                        ),
                    ),
                    "y": max(
                        50,
                        min(
                            700,
                            component.get("position", {}).get("y", default_y),
                        ),
                    ),
                },
                "size": {
                    "width": max(
                        160, min(250, component.get("size", {}).get("width", 200))
                    ),
                    "height": max(
                        100, min(140, component.get("size", {}).get("height", 120))
                    ),
                },
                "color": component.get(
                    "color", get_component_color(component.get("type", "backend"))
                ),
                "icon": component.get(
                    "icon", get_component_icon(component.get("type", "backend"))
                ),
                "confidence": max(0.1, min(1.0, component.get("confidence", 0.7))),
                "mentioned_explicitly": component.get("mentioned_explicitly", False),
                "inferred_from_context": component.get("inferred_from_context", True),
            }
            enhanced_components.append(enhanced_component)

        diagram_data["components"] = enhanced_components

        # Validate connections
        valid_component_ids = {comp["id"] for comp in enhanced_components}
        enhanced_connections = []

        for i, connection in enumerate(diagram_data.get("connections", [])):
            source = connection.get("source", "")
            target = connection.get("target", "")

            # Only keep connections between valid components
            if (
                source in valid_component_ids
                and target in valid_component_ids
                and source != target
            ):
                enhanced_connection = {
                    "id": connection.get("id", f"connection_{i}"),
                    "source": source,
                    "target": target,
                    "type": connection.get("type", "api_call"),
                    "label": connection.get("label", ""),
                    "bidirectional": connection.get("bidirectional", False),
                    "data_type": connection.get("data_type", "json"),
                    "protocol": connection.get("protocol", "REST"),
                    "confidence": max(0.1, min(1.0, connection.get("confidence", 0.6))),
                    "style": {
                        "strokeColor": connection.get("style", {}).get(
                            "strokeColor", "#666666"
                        ),
                        "strokeWidth": connection.get("style", {}).get(
                            "strokeWidth", 2
                        ),
                        "strokeDashArray": connection.get("style", {}).get(
                            "strokeDashArray", "0"
                        ),
                    },
                }
                enhanced_connections.append(enhanced_connection)

        diagram_data["connections"] = enhanced_connections

        # Enhance metadata with defaults
        metadata = diagram_data.get("diagram_metadata", {})
        metadata.update(
            {
                "title": metadata.get("title", "System Architecture"),
                "subtitle": metadata.get(
                    "subtitle", "Generated from conversation analysis"
                ),
                "complexity_level": metadata.get("complexity_level", "moderate"),
                "system_type": metadata.get("system_type", "web_app"),
                "technology_stack": metadata.get("technology_stack", []),
                "complexity_score": max(
                    1, min(10, metadata.get("complexity_score", 5))
                ),
                "component_count": len(enhanced_components),
                "connection_count": len(enhanced_connections),
                "generation_timestamp": time.time(),
            }
        )

        diagram_data["diagram_metadata"] = metadata

        return diagram_data

    except Exception as e:
        logger.error(f"Error validating diagram data: {str(e)}")
        return diagram_data


def get_component_color(component_type: str) -> str:
    """Get premium color palette for component types"""
    color_map = {
        "frontend": "#1976d2",  # Material Blue 700
        "backend": "#388e3c",  # Material Green 700
        "database": "#d32f2f",  # Material Red 700
        "external_api": "#f57c00",  # Material Orange 700
        "ai_model": "#7b1fa2",  # Material Purple 700
        "data_pipeline": "#00796b",  # Material Teal 700
        "storage": "#5d4037",  # Material Brown 700
        "auth": "#455a64",  # Material Blue Grey 700
        "payment": "#689f38",  # Material Light Green 700
        "messaging": "#512da8",  # Material Deep Purple 700
        "analytics": "#0097a7",  # Material Cyan 700
        "cdn": "#303f9f",  # Material Indigo 700
        "load_balancer": "#616161",  # Material Grey 700
        "microservice": "#2e7d32",  # Material Green 800
        "third_party": "#e65100",  # Material Deep Orange 700
        "user": "#1565c0",  # Material Blue 800
        "api": "#2e7d32",  # Material Green 800
    }
    return color_map.get(component_type, "#546e7a")  # Material Blue Grey 600


def get_component_icon(component_type: str) -> str:
    """Get icon name for component type"""
    icon_map = {
        "frontend": "monitor",
        "backend": "server",
        "database": "database",
        "external_api": "globe",
        "ai_model": "brain",
        "data_pipeline": "flow",
        "storage": "hard-drive",
        "auth": "shield",
        "payment": "credit-card",
        "messaging": "message-square",
        "analytics": "bar-chart",
        "cdn": "cloud",
        "load_balancer": "distribute-horizontal",
        "microservice": "box",
        "third_party": "external-link",
    }
    return icon_map.get(component_type, "box")


def generate_fallback_diagram(chat_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate a simple fallback diagram when AI generation fails.
    """
    # Basic web app architecture as fallback
    return {
        "components": [
            {
                "id": "user",
                "name": "User",
                "type": "frontend",
                "technology": "Web Browser",
                "description": "End user interface",
                "position": {"x": 100, "y": 200},
                "size": {"width": 120, "height": 80},
                "color": "#3498db",
                "icon": "user",
                "confidence": 1.0,
                "mentioned_explicitly": True,
                "inferred_from_context": False,
            },
            {
                "id": "frontend",
                "name": "Frontend App",
                "type": "frontend",
                "technology": "React/Vue/Angular",
                "description": "User interface application",
                "position": {"x": 300, "y": 200},
                "size": {"width": 140, "height": 80},
                "color": "#3498db",
                "icon": "monitor",
                "confidence": 0.8,
                "mentioned_explicitly": False,
                "inferred_from_context": True,
            },
            {
                "id": "backend",
                "name": "Backend API",
                "type": "backend",
                "technology": "Node.js/Python/Java",
                "description": "Application server and API",
                "position": {"x": 500, "y": 200},
                "size": {"width": 140, "height": 80},
                "color": "#2ecc71",
                "icon": "server",
                "confidence": 0.8,
                "mentioned_explicitly": False,
                "inferred_from_context": True,
            },
            {
                "id": "database",
                "name": "Database",
                "type": "database",
                "technology": "PostgreSQL/MySQL",
                "description": "Data storage",
                "position": {"x": 700, "y": 200},
                "size": {"width": 120, "height": 80},
                "color": "#e74c3c",
                "icon": "database",
                "confidence": 0.9,
                "mentioned_explicitly": False,
                "inferred_from_context": True,
            },
        ],
        "connections": [
            {
                "id": "user_frontend",
                "source": "user",
                "target": "frontend",
                "type": "user_interaction",
                "label": "Interacts with",
                "bidirectional": True,
                "data_type": "user_actions",
                "protocol": "HTTP",
                "confidence": 1.0,
                "style": {
                    "strokeColor": "#3498db",
                    "strokeWidth": 2,
                    "strokeDashArray": "0",
                },
            },
            {
                "id": "frontend_backend",
                "source": "frontend",
                "target": "backend",
                "type": "api_call",
                "label": "API Requests",
                "bidirectional": True,
                "data_type": "json",
                "protocol": "REST",
                "confidence": 0.9,
                "style": {
                    "strokeColor": "#2ecc71",
                    "strokeWidth": 2,
                    "strokeDashArray": "0",
                },
            },
            {
                "id": "backend_database",
                "source": "backend",
                "target": "database",
                "type": "data_flow",
                "label": "Data Operations",
                "bidirectional": True,
                "data_type": "database_queries",
                "protocol": "SQL",
                "confidence": 0.9,
                "style": {
                    "strokeColor": "#e74c3c",
                    "strokeWidth": 2,
                    "strokeDashArray": "0",
                },
            },
        ],
        "data_flows": [],
        "diagram_metadata": {
            "title": "Basic System Architecture",
            "subtitle": "Standard web application structure",
            "complexity_level": "simple",
            "system_type": "web_app",
            "technology_stack": [],
            "complexity_score": 3,
            "component_count": 4,
            "connection_count": 3,
            "generation_timestamp": time.time(),
            "is_fallback": True,
        },
        "layout_config": {"canvas_size": {"width": 1000, "height": 800}},
    }
