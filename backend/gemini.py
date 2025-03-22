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


# Initialize the model
def get_model(model_name="gemini-2.0-flash"):
    """Get configured Gemini model instance"""
    start_time = time.time()
    model = genai.GenerativeModel(
        model_name, generation_config={"response_mime_type": "application/json"}
    )
    duration = time.time() - start_time
    print_timing("Model Initialization", duration)
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
    
    Divide the content into logical sections based on topic transitions, slide changes, or teaching approach shifts.
    
    For each section, identify:
    1. Start and end timestamps (HH:MM:SS format)
    2. Teaching approach used (explanation, demonstration, example, etc.)
    3. Visual content (slides, demos, diagrams)
    4. Spoken content (transcribe key portions)
    5. Key points covered
    
    The sections must be a full partition of the video, and must not overlap.

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

    Be precise with timestamps and section boundaries.
    Ensure each section has a clear pedagogical purpose.
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
    video_file, document_file, timeline_data, model, log_collector=None
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

    knowledge_prompt = f"""
    Analyze this video (and document if provided) to extract a comprehensive knowledge base.
    
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
    video_file, timeline_data, knowledge_data, model, log_collector=None
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

    persona_prompt = f"""
    Analyze this video to extract the teaching persona and communication style of {instructor_info}.
    
    Pay particular attention to:
    1. Speaking style, tone, pacing, and accent characteristics
    2. Explanation techniques and teaching approaches
    3. How examples are presented and stories are told
    4. Emotional patterns when teaching different concepts
    5. Interaction patterns and question handling
    6. Terminology and vocabulary usage
    
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
          "communication_clarity": "str"
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
          ]
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
            "knowledge_check": "str"
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

    engagement_prompt = f"""
    Analyze this video to identify ideal moments for student engagement, quizzes, and interactive elements.
    
    Consider these key concepts: {concepts_list}
    
    The instructor's teaching approach is:
    ```
    {teaching_approach_json}
    ```
    
    The video timeline structure is:
    ```
    {sections_json}
    ```
    
    Identify 5-8 strategic points where:
    1. A concept has just been explained
    2. A natural pause or transition occurs
    3. A knowledge check would reinforce learning
    4. A potential confusion point needs clarification
    
    For each point, create varied quiz items including multiple choice, short answer, and discussion questions.

    Return ONLY a JSON object with this structure:
    {{
      "engagement_opportunities": [
        {{
          "id": "engagement-1",
          "timestamp": "HH:MM:SS",
          "section_id": "section-id",
          "engagement_type": "quiz/discussion/reflection/application",
          "concepts_addressed": ["concept-id"],
          "rationale": "str",
          "quiz_items": [
            {{
      "question": "str",
              "question_type": "multiple_choice/short_answer/discussion",
              "options": ["option A", "option B", "option C", "option D"],
              "correct_option": "option A",
              "explanation": "Explanation of why option A is correct",
              "expected_answer": "str",
              "alternative_phrasings": ["str"],
              "follow_up": {{
                "if_correct": "str",
                "if_incorrect": "str"
              }}
            }}
          ]
        }}
      ]
    }}
    
    IMPORTANT: For multiple-choice questions, provide 4 options with 1 correct answer and 3 plausible distractors.
    
    Examples of good quiz items:
    
    1. Multiple-choice example:
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
    
    2. Short-answer example:
    {{
      "question": "Explain the concept of 'continuous compounding' in your own words.",
      "question_type": "short_answer",
      "expected_answer": "Continuous compounding is when interest is calculated and added to the principal continuously (at every moment) rather than at fixed intervals. It represents the mathematical limit of compounding frequency approaching infinity, and uses the formula A = P*e^(rt).",
      "alternative_phrasings": [
        "Continuous compounding means interest is added at every instant.",
        "It's when the number of compounding periods approaches infinity."
      ],
      "follow_up": {{
        "if_correct": "Excellent explanation! You've captured the key distinction between discrete and continuous compounding.",
        "if_incorrect": "Let's clarify. Continuous compounding means interest is calculated at every possible moment (infinity times per year), not just at fixed intervals."
      }}
    }}
    
    3. Discussion example:
    {{
      "question": "Consider the ethical implications of compound interest in the context of student loans. How might compounding affect students differently based on their socioeconomic background?",
      "question_type": "discussion",
      "expected_answer": "This is an open-ended question, but good responses would address how compound interest on student loans can disproportionately affect students who take longer to repay due to lower starting salaries or less family support. Some may mention how interest capitalization during deferment periods can significantly increase loan balances.",
      "follow_up": {{
        "if_correct": "That's a thoughtful analysis. You've identified how compound interest can sometimes amplify existing inequalities in higher education financing.",
        "if_incorrect": "Consider how the exponential nature of compound interest might affect students differently based on their ability to make payments soon after graduation."
      }}
    }}
    
    Ensure questions match the instructor's style and complexity level.
    Create questions that genuinely test understanding rather than simple recall.
    Provide variations of expected answers to handle different phrasings.
    Design follow-up responses that mimic the instructor's teaching approach.
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

    # Simple combination of all extracted data
    unified_data = {
        # Add metadata for identification
        "extraction_metadata": {
            "timestamp": datetime.now().isoformat(),
            "components": [
                "video_timeline",
                "knowledge_base",
                "teaching_persona",
                "document_knowledge",
                "engagement_opportunities",
            ],
        },
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
    video_path, document_path=None, brdge_id=None, callback=None
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
            video_file, document_file, timelines, model, log_collector
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
        log_message = f"�� EXTRACTION PASS 3: Extracting teaching persona and communication style..."
        print(log_message)
        log_collector.add_log(log_message, status="info")

        persona_data = extract_teaching_persona(
            video_file, timelines, knowledge_data, model, log_collector
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


# If run directly, execute a test extraction
if __name__ == "__main__":
    # Test the extraction pipeline with sample files
    sample_video = "module_0.mp4"
    sample_document = "module_0.pdf"

    if os.path.exists(sample_video):
        print(f"Running test extraction on {sample_video}")
        result = create_brdge_knowledge(
            sample_video, sample_document if os.path.exists(sample_document) else None
        )

        # Save results to a file
        with open("extraction_results.json", "w") as f:
            json.dump(result, f, indent=2)

        print(f"Results saved to extraction_results.json")
    else:
        print(
            f"Sample video {sample_video} not found. Add a video file to test the extraction."
        )
