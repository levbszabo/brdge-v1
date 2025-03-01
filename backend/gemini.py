# pip install -q -U google-generativeai
import google.generativeai as genai  # type: ignore
import os
import time
import json
from IPython.display import display, Markdown, HTML

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(
    "gemini-2.0-flash", generation_config={"response_mime_type": "application/json"}
)


# Function to analyze video-only content
def analyze_video(video_path, video_display_name=None):
    """
    Analyze video content without accompanying documents

    Args:
        video_path: Path to the video file
        video_display_name: Optional display name for the video

    Returns:
        JSON response with comprehensive video analysis in the standard Brdge schema
    """
    if video_display_name is None:
        video_display_name = os.path.basename(video_path)

    video_file = genai.upload_file(path=video_path, display_name=video_display_name)

    video_only_prompt = """Analyze this video presentation thoroughly and extract comprehensive information to create a detailed JSON response.

{
  "metadata": {
    "title": "str",
    "duration": "str",
    "total_scenes": int,
    "key_topics": ["str"],
    "summary": "str"
  },
  "timeline": [
    {
      "timestamp": "str",
      "scene_type": "str",  // e.g., "slide_presentation", "demo", "conversation", "ui_interaction"
      "visual_description": "str",  // detailed description of what's visible
      "spoken_text": "str",  // transcribed speech
      "key_points": ["str"],  // bullet points of important information
      "ui_elements": [  // if applicable
        {
          "element_type": "str",  // e.g., "button", "menu", "form", "chart"
          "description": "str",
          "position": "str",  // e.g., "top-left", "center"
          "action": "str"  // what happens when interacted with
        }
      ],
      "visual_content": {
        "text_on_screen": ["str"],  // any visible text in the scene (slides, UI text, etc.)
        "graphics_description": "str",  // description of charts, slides, images shown
        "notable_elements": ["str"]  // important visual elements to highlight
      },
      "related_document_content": null  // Always null for video-only analysis
    }
  ],
  "knowledge_base": {  // Standard knowledge section that works for both video-only and combined analysis
    "key_concepts": [  // important concepts mentioned or shown
      {
        "concept": "str",
        "explanation": "str",
        "timestamps": ["str"],  // when this concept appears in the video
        "document_references": []  // Empty for video-only
      }
    ],
    "processes_workflows": [  // any step-by-step processes demonstrated
      {
        "name": "str",
        "steps": [
          {
            "step_number": int,
            "description": "str",
            "timestamp": "str",
            "document_reference": null  // Null for video-only
          }
        ]
      }
    ],
    "data_points": [  // any statistics, numbers, or factual information
      {
        "data": "str",
        "context": "str",
        "source": "video",
        "location": "str"  // timestamp
      }
    ],
    "document_structure": [],  // Empty for video-only
    "document_visuals": []     // Empty for video-only
  },
  "knowledge_graph": {
    "entities": [
      {
        "name": "str",
        "type": "str",  // e.g., "person", "product", "feature", "concept"
        "mentions": [
          {
            "source": "video",
            "location": "str",  // timestamp
            "context": "str"
          }
        ],
        "relationships": [
          {
            "related_entity": "str",
            "relationship_type": "str",
            "evidence": "str"
          }
        ]
      }
    ]
  },
  "agent_personality": {
    "name": "str",
    "expertise": ["str"],
    "communication_style": "str",  // e.g., "professional", "friendly", "technical"
    "knowledge_areas": [
      {
        "topic": "str",
        "confidence_level": "str",  // e.g., "high", "medium", "low"
        "key_talking_points": ["str"]
      }
    ],
    "voice_characteristics": {  // analyze the speaker's voice and speaking style
      "pace": "str",  // e.g., "fast", "measured", "deliberate"
      "tone": "str",  // e.g., "enthusiastic", "authoritative", "conversational"
      "common_phrases": ["str"],  // recurring phrases or speech patterns
      "emphasis_patterns": "str"  // how the speaker emphasizes important points
    },
    "response_templates": {
      "greeting": "str",
      "not_sure": "str",
      "follow_up_questions": ["str"]
    },
    "persona_background": "str"  // brief backstory for the agent
  },
  "engagement_opportunities": [  // identify moments where viewers might want to interact
    {
      "timestamp": "str",
      "potential_question_trigger": "str",  // what might prompt a question
      "suggested_interaction": "str"  // how the agent should engage at this point
    }
  ],
  "qa_pairs": [  // anticipated questions and answers
    {
      "question": "str",
      "answer": "str",
      "sources": [
        {
          "type": "video",
          "location": "str"  // timestamp
        }
      ]
    }
  ]
}

Focus on extracting maximum knowledge from the video:
1. Pay special attention to text on screen, charts, graphs, and other visual information
2. Capture all text visible in slides or UI elements
3. Describe visual scenes in detail
4. Note any step-by-step processes or workflows demonstrated
5. Analyze the presenter's voice, tone, and speaking style for the agent personality
6. Make sure to follow the exact schema provided, including leaving document-related fields empty or null as specified

Here's an example of effective video analysis:

```json
{
  "metadata": {
    "title": "CRM Software Demo with Feature Overview",
    "duration": "00:15:32",
    "total_scenes": 8,
    "key_topics": ["Customer Management", "Sales Pipeline", "Reporting Dashboard", "Mobile Integration"],
    "summary": "A comprehensive demonstration of the XYZ CRM software, showcasing its main features including customer management, sales pipeline tracking, and reporting capabilities. The presenter walks through real-world use cases and highlights integration with mobile devices."
  },
  "timeline": [
    {
      "timestamp": "00:01:15",
      "scene_type": "ui_interaction",
      "visual_description": "The presenter is showing the login screen of the CRM software with the dashboard visible after login. The interface has a dark blue header with navigation menu on the left side.",
      "spoken_text": "After logging in, you'll see this intuitive dashboard that gives you an immediate overview of your sales pipeline and customer interactions.",
      "key_points": ["Secure login process", "Dashboard provides immediate business overview", "Navigation is accessible from left panel"],
      "ui_elements": [
        {
          "element_type": "menu",
          "description": "Left-side navigation panel with icons for Dashboard, Customers, Sales, Reports",
          "position": "left",
          "action": "Allows navigation between main sections of the application"
        }
      ],
      "visual_content": {
        "text_on_screen": ["Dashboard", "Welcome back, John", "Sales Pipeline: $1.2M", "Recent Activity"],
        "graphics_description": "Bar chart showing sales performance by region with North America leading",
        "notable_elements": ["Red notification badge on Messages icon", "Green upward trend line on sales graph"]
      },
      "related_document_content": null
    }
  ]
}
```

Generate at least 15 anticipated Q&A pairs based on the content. Ensure all timestamps are in HH:MM:SS format."""
    time.sleep(60)
    response = model.generate_content(contents=[video_only_prompt, video_file])

    # Ensure the response is properly formatted for Brdge's expected schema
    try:
        response_json = json.loads(response.text)
        # Add any post-processing here if needed
        return response_json
    except:
        # Return raw response if parsing fails
        return response


# Function to analyze video + document content
def analyze_video_and_document(
    video_path, document_path, video_display_name=None, document_display_name=None
):
    """
    Analyze video and document content together

    Args:
        video_path: Path to the video file
        document_path: Path to the document file (PDF, DOCX, etc.)
        video_display_name: Optional display name for the video
        document_display_name: Optional display name for the document

    Returns:
        JSON response with comprehensive analysis of both video and document in the standard Brdge schema
    """
    if video_display_name is None:
        video_display_name = os.path.basename(video_path)
    if document_display_name is None:
        document_display_name = os.path.basename(document_path)

    video_file = genai.upload_file(path=video_path, display_name=video_display_name)
    document_file = genai.upload_file(
        path=document_path, display_name=document_display_name
    )

    video_document_prompt = """Analyze this video and accompanying document together as a unified presentation. Extract comprehensive information and create a detailed JSON response.

The document could be any type (PDF, DOCX, PPTX, etc.) - analyze it based on its content rather than assuming a specific format.

{
  "metadata": {
    "title": "str",
    "duration": "str",
    "total_scenes": int,
    "key_topics": ["str"],
    "summary": "str"
  },
  "timeline": [
    {
      "timestamp": "str",
      "scene_type": "str",  // e.g., "slide_presentation", "demo", "conversation", "ui_interaction"
      "visual_description": "str",  // detailed description of what's visible
      "spoken_text": "str",  // transcribed speech
      "key_points": ["str"],  // bullet points of important information
      "ui_elements": [  // if applicable
        {
          "element_type": "str",  // e.g., "button", "menu", "form", "chart"
          "description": "str",
          "position": "str",  // e.g., "top-left", "center"
          "action": "str"  // what happens when interacted with
        }
      ],
      "visual_content": {  // Same as in video-only for consistency
        "text_on_screen": ["str"],  // any visible text in the scene (slides, UI text, etc.)
        "graphics_description": "str",  // description of charts, slides, images shown
        "notable_elements": ["str"]  // important visual elements to highlight
      },
      "related_document_content": {  // connections to document content
        "page_or_section_numbers": [int],
        "sections": ["str"],
        "quotes": ["str"]
      }
    }
  ],
  "knowledge_base": {  // Standard knowledge section that works for both video-only and combined analysis
    "key_concepts": [  // important concepts mentioned or shown
      {
        "concept": "str",
        "explanation": "str",
        "timestamps": ["str"],  // when this concept appears in the video
        "document_references": [  // references to where this appears in the document
          {
            "page_or_section": "str",
            "context": "str"
          }
        ]
      }
    ],
    "processes_workflows": [  // any step-by-step processes demonstrated
      {
        "name": "str",
        "steps": [
          {
            "step_number": int,
            "description": "str",
            "timestamp": "str",
            "document_reference": {  // reference to related document content
              "page_or_section": "str",
              "context": "str"
            }
          }
        ]
      }
    ],
    "data_points": [  // any statistics, numbers, or factual information
      {
        "data": "str",
        "context": "str",
        "source": "str",  // "video" or "document" or "both"
        "location": "str"  // timestamp or page reference
      }
    ],
    "document_structure": [  // outline of the document
      {
        "section": "str",
        "page_or_section_numbers": [int],
        "key_points": ["str"]
      }
    ],
    "document_visuals": [  // images, diagrams, charts in the document
      {
        "type": "str",
        "location": "str",
        "description": "str"
      }
    ]
  },
  "knowledge_graph": {
    "entities": [
      {
        "name": "str",
        "type": "str",  // e.g., "person", "product", "feature", "concept"
        "mentions": [
          {
            "source": "str",  // "video" or "document"
            "location": "str",  // timestamp or page/section reference
            "context": "str"
          }
        ],
        "relationships": [
          {
            "related_entity": "str",
            "relationship_type": "str",
            "evidence": "str"
          }
        ]
      }
    ]
  },
  "agent_personality": {
    "name": "str",
    "expertise": ["str"],
    "communication_style": "str",  // e.g., "professional", "friendly", "technical"
    "knowledge_areas": [
      {
        "topic": "str",
        "confidence_level": "str",  // e.g., "high", "medium", "low"
        "key_talking_points": ["str"]
      }
    ],
    "voice_characteristics": {  // analyze the speaker's voice and speaking style
      "pace": "str",  // e.g., "fast", "measured", "deliberate"
      "tone": "str",  // e.g., "enthusiastic", "authoritative", "conversational"
      "common_phrases": ["str"],  // recurring phrases or speech patterns
      "emphasis_patterns": "str"  // how the speaker emphasizes important points
    },
    "response_templates": {
      "greeting": "str",
      "not_sure": "str",
      "follow_up_questions": ["str"]
    },
    "persona_background": "str"  // brief backstory for the agent
  },
  "engagement_opportunities": [  // identify moments where viewers might want to interact
{
  "timestamp": "str",
      "potential_question_trigger": "str",  // what might prompt a question
      "suggested_interaction": "str"  // how the agent should engage at this point
    }
  ],
  "qa_pairs": [  // anticipated questions and answers
    {
      "question": "str",
      "answer": "str",
      "sources": [
        {
          "type": "str",  // "video" or "document"
          "location": "str"  // timestamp or page/section reference
        }
      ]
    }
  ]
}

Focus on creating connections between the video and document:
1. Match document sections to specific video timestamps
2. Cross-reference information between both sources
3. Identify complementary information (where document provides details missing from video)
4. Create a unified knowledge representation that combines both sources
5. Note any discrepancies or contradictions between sources
6. Make sure to follow the exact schema provided, with all fields populated appropriately

Here's an example of effective video and document analysis:

```json
{
  "metadata": {
    "title": "Luxury Beachfront Property Tour",
    "duration": "00:08:45",
    "total_scenes": 12,
    "key_topics": ["Property Features", "Neighborhood Amenities", "Investment Potential", "Financing Options"],
    "summary": "A virtual tour of a luxury beachfront property featuring 5 bedrooms and 4 bathrooms. The presentation covers interior and exterior features, nearby amenities, and investment considerations including potential rental income."
  },
  "timeline": [
    {
      "timestamp": "00:03:22",
      "scene_type": "property_tour",
      "visual_description": "Aerial drone footage showing the property's oceanfront location with panoramic views of the coastline. The property has a large infinity pool that appears to blend with the ocean horizon.",
      "spoken_text": "The infinity pool creates a seamless transition to the ocean beyond, giving you that perfect Instagram-worthy backdrop for sunset cocktails.",
      "key_points": ["Oceanfront location", "Infinity pool feature", "Panoramic coastal views"],
      "ui_elements": [],
      "visual_content": {
        "text_on_screen": ["Infinity Edge Pool", "Ocean View"],
        "graphics_description": "Aerial footage of coastline with property centered in frame",
        "notable_elements": ["Infinity pool with ocean backdrop", "Large deck area with loungers"]
      },
      "related_document_content": {
        "page_or_section_numbers": [2],
        "sections": ["Exterior Features"],
        "quotes": ["2,500 sq ft of outdoor living space including an award-winning infinity pool design"]
      }
    }
  ]
}
```

Generate at least 15 anticipated Q&A pairs based on the content. Ensure all timestamps are in HH:MM:SS format and all information is accurately cross-referenced between the video and document."""

    time.sleep(60)  # Wait at least 1 minute before generating content
    response = model.generate_content(
        contents=[video_document_prompt, video_file, document_file]
    )

    # Ensure the response is properly formatted for Brdge's expected schema
    try:
        response_json = json.loads(response.text)
        # Add any post-processing here if needed
        return response_json
    except:
        # Return raw response if parsing fails
        return response


# Helper function to create a standardized Brdge knowledge response
def create_brdge_knowledge(video_path, document_path=None):
    """
    Create a standardized knowledge base for Brdge by analyzing video and optional document

    Args:
        video_path: Path to the video file
        document_path: Optional path to a document file

    Returns:
        Standardized JSON knowledge base for Brdge
    """
    if document_path and os.path.exists(document_path):
        return analyze_video_and_document(video_path, document_path)
    else:
        return analyze_video(video_path)


# combined_analysis = analyze_video_and_document(
#     "0225.mp4", "property-details (1).pdf", "real-estate-video", "real-estate-doc"
# )
