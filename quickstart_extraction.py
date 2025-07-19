#!/usr/bin/env python3
"""
DotBridge Knowledge Extraction Quickstart

This script demonstrates the sophisticated multimodal content analysis system
that powers DotBridge's knowledge extraction capabilities.

Perfect for:
- Alternative data processing in quantitative finance
- Research paper and conference presentation analysis
- Earnings call and document analysis
- Academic content knowledge extraction

Usage:
    python quickstart_extraction.py --video /path/to/video.mp4 --document /path/to/doc.pdf
"""

import os
import sys
import json
import argparse
from datetime import datetime
from pathlib import Path

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

try:
    from backend.gemini import create_brdge_knowledge, configure_genai
except ImportError:
    print(
        "❌ Error: Could not import backend modules. Make sure you're running from the project root."
    )
    sys.exit(1)


def load_environment():
    """Load environment variables from .env file"""
    try:
        from dotenv import load_dotenv

        load_dotenv(os.path.join("backend", ".env"))
    except ImportError:
        print("⚠️  python-dotenv not installed. Using system environment variables.")

    # Check for required API key
    if not os.getenv("GOOGLE_API_KEY"):
        print("❌ Error: GOOGLE_API_KEY not found in environment.")
        print("Please set up your .env file in the backend/ directory.")
        print("Copy backend/.env.example to backend/.env and add your API keys.")
        sys.exit(1)


def create_sample_content():
    """Create sample content if no files provided"""
    sample_dir = Path("sample_content")
    sample_dir.mkdir(exist_ok=True)

    # Create a sample text file to simulate document content
    sample_doc = sample_dir / "sample_document.txt"
    if not sample_doc.exists():
        sample_content = """
# Sample Research Document

## Introduction
This is a sample document demonstrating the multimodal knowledge extraction capabilities 
of the DotBridge system. In a real scenario, this could be:

- An earnings call transcript
- A research paper PDF
- A financial filing (10-K, 10-Q)
- An academic conference paper

## Key Concepts
- Multimodal AI analysis
- Knowledge graph construction
- Temporal synchronization
- Alternative data processing

## Methodology
The system performs multi-pass analysis to extract:
1. Structural components and organization
2. Core concepts and relationships
3. Timeline and temporal elements
4. Interactive opportunities and Q&A potential

## Results
The extracted knowledge graph enables sophisticated downstream applications
including real-time conversational AI and automated analysis workflows.

## Conclusion
This demonstrates production-ready knowledge extraction suitable for
quantitative finance, research, and enterprise applications.
"""
        sample_doc.write_text(sample_content)
        print(f"📄 Created sample document: {sample_doc}")

    return str(sample_doc)


def print_knowledge_summary(knowledge_data):
    """Print a formatted summary of extracted knowledge"""
    print("\n" + "=" * 60)
    print("📊 KNOWLEDGE EXTRACTION SUMMARY")
    print("=" * 60)

    # Timeline Data
    if "timeline_data" in knowledge_data:
        timeline = knowledge_data["timeline_data"]
        print(f"\n📅 Timeline Analysis:")
        if "video_segments" in timeline:
            print(f"   • Video segments: {len(timeline.get('video_segments', []))}")
        if "document_sections" in timeline:
            print(
                f"   • Document sections: {len(timeline.get('document_sections', []))}"
            )

    # Knowledge Data
    if "knowledge_data" in knowledge_data:
        knowledge = knowledge_data["knowledge_data"]
        print(f"\n🧠 Knowledge Graph:")
        if "core_concepts" in knowledge:
            print(f"   • Core concepts: {len(knowledge.get('core_concepts', []))}")
        if "key_insights" in knowledge:
            print(f"   • Key insights: {len(knowledge.get('key_insights', []))}")

    # Persona Data
    if "persona_data" in knowledge_data:
        persona = knowledge_data["persona_data"]
        print(f"\n👤 Teaching Persona:")
        if "expertise_areas" in persona:
            areas = persona.get("expertise_areas", [])
            print(f"   • Expertise areas: {len(areas)}")
            if areas:
                print(f"     - {', '.join(areas[:3])}{'...' if len(areas) > 3 else ''}")

    # Engagement Data
    if "engagement_data" in knowledge_data:
        engagement = knowledge_data["engagement_data"]
        print(f"\n🎯 Engagement Opportunities:")
        if "interaction_opportunities" in engagement:
            print(
                f"   • Interaction points: {len(engagement.get('interaction_opportunities', []))}"
            )
        if "q_and_a_potential" in engagement:
            print(
                f"   • Q&A opportunities: {len(engagement.get('q_and_a_potential', []))}"
            )


def save_results(knowledge_data, output_path):
    """Save extraction results to JSON file"""
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(knowledge_data, f, indent=2, ensure_ascii=False)
    print(f"\n💾 Full results saved to: {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description="DotBridge Knowledge Extraction Quickstart"
    )
    parser.add_argument("--video", type=str, help="Path to video file (MP4, MOV, etc.)")
    parser.add_argument(
        "--document", type=str, help="Path to document file (PDF, TXT, etc.)"
    )
    parser.add_argument(
        "--type",
        type=str,
        default="course",
        choices=[
            "course",
            "vsl",
            "webinar",
            "onboarding",
        ],
        help="Type of content analysis (course=educational, vsl=sales, webinar=presentation, onboarding=user training)",
    )
    parser.add_argument(
        "--instructions",
        type=str,
        default="",
        help="Additional instructions for the extraction process",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="extraction_results.json",
        help="Output file for results",
    )

    args = parser.parse_args()

    print("🚀 DotBridge Knowledge Extraction Quickstart")
    print("=" * 50)

    # Load environment
    load_environment()

    # Handle sample content
    if not args.video and not args.document:
        print("📝 No content files provided. Creating sample content...")
        args.document = create_sample_content()
        print("💡 For real usage, provide --video and/or --document paths")

    # Validate files
    if args.video and not os.path.exists(args.video):
        print(f"❌ Error: Video file not found: {args.video}")
        sys.exit(1)

    if args.document and not os.path.exists(args.document):
        print(f"❌ Error: Document file not found: {args.document}")
        sys.exit(1)

    # Prepare extraction parameters
    extraction_params = {
        "video_path": args.video,
        "document_path": args.document,
        "bridge_type": args.type,
        "additional_instructions": args.instructions,
    }

    print(f"\n📋 Extraction Configuration:")
    print(f"   • Video: {args.video or 'None'}")
    print(f"   • Document: {args.document or 'None'}")
    print(f"   • Analysis Type: {args.type}")
    if args.instructions:
        print(f"   • Instructions: {args.instructions[:100]}...")

    print(f"\n⚡ Starting multipass knowledge extraction...")
    print(f"   This may take 30-120 seconds depending on content size...")

    try:
        # Configure Gemini
        configure_genai()

        # Run extraction
        start_time = datetime.now()

        knowledge_data = create_brdge_knowledge(**extraction_params)

        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        print(f"\n✅ Extraction completed in {duration:.1f} seconds")

        # Display summary
        print_knowledge_summary(knowledge_data)

        # Save results
        save_results(knowledge_data, args.output)

        print("\n🎉 Knowledge extraction completed successfully!")
        print("\n💡 Next Steps:")
        print("   • Examine the generated JSON for detailed knowledge graph")
        print("   • Use the knowledge for agent creation or analysis")
        print("   • Try the real-time agent quickstart: python quickstart_agent.py")

    except Exception as e:
        print(f"\n❌ Error during extraction: {str(e)}")
        print("   Check your API keys and file permissions")
        sys.exit(1)


if __name__ == "__main__":
    main()
