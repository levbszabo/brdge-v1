#!/usr/bin/env python3
"""
DotBridge Real-time Agent Quickstart

This script demonstrates the production-ready real-time conversational AI system
with voice interaction, multi-LLM support, and sophisticated state management.

Perfect for:
- Interactive financial document analysis
- Real-time research consultation
- Voice-enabled knowledge exploration
- Production conversational AI deployment

Usage:
    python quickstart_agent.py --demo
    python quickstart_agent.py --knowledge /path/to/knowledge.json
"""

import os
import sys
import json
import argparse
import asyncio
from datetime import datetime
from pathlib import Path

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

try:
    from backend.agent import Assistant
    from backend.models import User, Brdge
    import backend.app as app
except ImportError as e:
    print(f"❌ Error: Could not import backend modules: {e}")
    print(
        "Make sure you're running from the project root and dependencies are installed."
    )
    sys.exit(1)


def load_environment():
    """Load and validate environment variables"""
    try:
        from dotenv import load_dotenv

        load_dotenv(os.path.join("backend", ".env"))
    except ImportError:
        print("⚠️  python-dotenv not installed. Using system environment variables.")

    # Required for basic functionality
    required_basic = ["GOOGLE_API_KEY"]
    missing_basic = [key for key in required_basic if not os.getenv(key)]

    # Required for full real-time functionality
    required_realtime = [
        "LIVEKIT_API_KEY",
        "LIVEKIT_API_SECRET",
        "LIVEKIT_URL",
        "DEEPGRAM_API_KEY",
        "CARTESIA_API_KEY",
    ]
    missing_realtime = [key for key in required_realtime if not os.getenv(key)]

    if missing_basic:
        print("❌ Error: Required API keys missing:")
        for key in missing_basic:
            print(f"   • {key}")
        print("Please set up your .env file in the backend/ directory.")
        sys.exit(1)

    if missing_realtime:
        print("⚠️  Warning: Real-time features require additional API keys:")
        for key in missing_realtime:
            print(f"   • {key}")
        print("Agent will run in text-only mode without voice capabilities.")
        return False

    return True


def create_demo_knowledge():
    """Create demo knowledge base for testing"""
    demo_knowledge = {
        "timeline_data": {
            "video_segments": [
                {
                    "start_time": 0,
                    "end_time": 180,
                    "title": "Introduction to Quantitative Finance",
                    "key_points": [
                        "Risk management",
                        "Portfolio optimization",
                        "Market analysis",
                    ],
                },
                {
                    "start_time": 180,
                    "end_time": 360,
                    "title": "Alternative Data Applications",
                    "key_points": [
                        "Earnings call analysis",
                        "Social sentiment",
                        "Satellite data",
                    ],
                },
            ],
            "document_sections": [
                {
                    "section": "Executive Summary",
                    "key_concepts": [
                        "Risk-adjusted returns",
                        "Alpha generation",
                        "Factor models",
                    ],
                },
                {
                    "section": "Methodology",
                    "key_concepts": [
                        "Machine learning",
                        "NLP analysis",
                        "Time series modeling",
                    ],
                },
            ],
        },
        "knowledge_data": {
            "core_concepts": [
                "Quantitative finance strategies",
                "Alternative data processing",
                "Risk management frameworks",
                "Portfolio optimization techniques",
            ],
            "key_insights": [
                "Multi-factor models improve risk-adjusted returns",
                "Alternative data provides edge in alpha generation",
                "Real-time analysis enables better decision making",
            ],
            "relationships": [
                {
                    "concept_a": "Alternative data",
                    "concept_b": "Alpha generation",
                    "relationship": "enables",
                },
                {
                    "concept_a": "Risk management",
                    "concept_b": "Portfolio optimization",
                    "relationship": "constrains",
                },
            ],
        },
        "persona_data": {
            "expertise_areas": [
                "Quantitative Finance",
                "Machine Learning",
                "Risk Management",
            ],
            "communication_style": {
                "tone": "Professional yet approachable",
                "depth": "Technical with clear explanations",
                "approach": "Socratic questioning and guided discovery",
            },
            "teaching_approach": {
                "style": "Interactive consultation",
                "strengths": [
                    "Complex concept simplification",
                    "Practical applications",
                ],
                "specializations": [
                    "Alternative data",
                    "Risk modeling",
                    "Portfolio construction",
                ],
            },
        },
        "engagement_data": {
            "interaction_opportunities": [
                {
                    "trigger_time": 60,
                    "type": "concept_check",
                    "content": "Would you like to explore how this applies to your portfolio?",
                },
                {
                    "trigger_time": 240,
                    "type": "deep_dive",
                    "content": "This is a great point to discuss implementation details.",
                },
            ],
            "q_and_a_potential": [
                {
                    "topic": "Risk Management",
                    "sample_questions": [
                        "How do you measure tail risk in your models?",
                        "What's your approach to correlation breakdown during crises?",
                    ],
                },
                {
                    "topic": "Alternative Data",
                    "sample_questions": [
                        "Which alternative data sources provide the best signal?",
                        "How do you validate new data sources?",
                    ],
                },
            ],
        },
    }

    # Save demo knowledge
    demo_path = "demo_knowledge.json"
    with open(demo_path, "w", encoding="utf-8") as f:
        json.dump(demo_knowledge, f, indent=2, ensure_ascii=False)

    print(f"📄 Created demo knowledge base: {demo_path}")
    return demo_path


class DemoAssistant:
    """Simplified assistant for demonstration purposes"""

    def __init__(self, knowledge_path=None):
        self.knowledge_path = knowledge_path
        self.knowledge = {}
        self.conversation_history = []

    def load_knowledge(self):
        """Load knowledge base from file"""
        if self.knowledge_path and os.path.exists(self.knowledge_path):
            with open(self.knowledge_path, "r", encoding="utf-8") as f:
                self.knowledge = json.load(f)
            print(f"✅ Loaded knowledge base from {self.knowledge_path}")
        else:
            print("⚠️  No knowledge base provided, using minimal configuration")

    def get_response(self, user_input):
        """Generate response based on knowledge and conversation history"""
        # This is a simplified version - the full agent uses sophisticated LLM integration

        context = []

        # Add knowledge context
        if "knowledge_data" in self.knowledge:
            concepts = self.knowledge["knowledge_data"].get("core_concepts", [])
            context.append(f"Core expertise: {', '.join(concepts[:3])}")

        if "persona_data" in self.knowledge:
            style = self.knowledge["persona_data"].get("communication_style", {})
            tone = style.get("tone", "professional")
            context.append(f"Communication style: {tone}")

        # Simple pattern matching for demo
        user_lower = user_input.lower()

        if any(word in user_lower for word in ["risk", "portfolio", "finance"]):
            response = "That's an excellent question about quantitative finance. Based on the knowledge I have, I can discuss risk management frameworks, portfolio optimization techniques, and how alternative data can enhance your investment process. What specific aspect would you like to explore?"

        elif any(word in user_lower for word in ["data", "alternative", "source"]):
            response = "Alternative data is fascinating! I can help you understand different data sources like earnings call transcripts, satellite imagery, social sentiment, and credit card transactions. The key is finding data that provides genuine alpha while managing the noise. Which data sources are you most curious about?"

        elif any(word in user_lower for word in ["model", "machine learning", "ai"]):
            response = "Machine learning in finance is all about finding signal in noisy data. I can discuss various approaches from traditional factor models to modern deep learning techniques. The critical aspects are feature engineering, regime awareness, and proper validation. What modeling challenges are you facing?"

        else:
            response = "I'm here to help with quantitative finance, alternative data, and AI applications in investment management. Feel free to ask about risk modeling, portfolio optimization, or any specific challenges you're working on!"

        # Add to conversation history
        self.conversation_history.append(
            {
                "user": user_input,
                "assistant": response,
                "timestamp": datetime.now().isoformat(),
            }
        )

        return response


def run_demo_conversation(assistant):
    """Run an interactive demo conversation"""
    print("\n🤖 DotBridge Assistant Demo")
    print("=" * 40)
    print("Type 'exit' to quit, 'help' for suggestions")
    print()

    # Suggest some questions
    suggestions = [
        "What are the best alternative data sources for equity analysis?",
        "How do you handle portfolio risk during market stress?",
        "Can you explain factor model construction?",
        "What's your approach to backtesting trading strategies?",
    ]

    print("💡 Try asking about:")
    for i, suggestion in enumerate(suggestions, 1):
        print(f"   {i}. {suggestion}")
    print()

    while True:
        try:
            user_input = input("👤 You: ").strip()

            if user_input.lower() in ["exit", "quit"]:
                break

            if user_input.lower() == "help":
                print("\n💡 Suggested questions:")
                for i, suggestion in enumerate(suggestions, 1):
                    print(f"   {i}. {suggestion}")
                print()
                continue

            if not user_input:
                continue

            response = assistant.get_response(user_input)
            print(f"\n🤖 Assistant: {response}\n")

        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break

    # Show conversation summary
    if assistant.conversation_history:
        print(f"\n📊 Conversation Summary:")
        print(f"   • {len(assistant.conversation_history)} exchanges")
        print(f"   • Duration: {datetime.now().strftime('%H:%M:%S')}")


def main():
    parser = argparse.ArgumentParser(description="DotBridge Real-time Agent Quickstart")
    parser.add_argument(
        "--demo", action="store_true", help="Run interactive demo with sample knowledge"
    )
    parser.add_argument(
        "--knowledge", type=str, help="Path to knowledge base JSON file"
    )
    parser.add_argument(
        "--realtime",
        action="store_true",
        help="Enable full real-time voice capabilities (requires all API keys)",
    )

    args = parser.parse_args()

    print("🚀 DotBridge Real-time Agent Quickstart")
    print("=" * 50)

    # Load environment
    has_realtime_keys = load_environment()

    if args.realtime and not has_realtime_keys:
        print(
            "❌ Error: Real-time mode requires LiveKit, Deepgram, and Cartesia API keys"
        )
        sys.exit(1)

    # Prepare knowledge
    knowledge_path = None

    if args.demo:
        print("🎭 Running in demo mode with sample knowledge...")
        knowledge_path = create_demo_knowledge()
    elif args.knowledge:
        if os.path.exists(args.knowledge):
            knowledge_path = args.knowledge
            print(f"📚 Using knowledge base: {args.knowledge}")
        else:
            print(f"❌ Error: Knowledge file not found: {args.knowledge}")
            sys.exit(1)
    else:
        print("💡 No knowledge base provided. Run with --demo for sample content.")
        print("   Or generate knowledge with: python quickstart_extraction.py")

    # Create assistant
    print(f"\n⚡ Initializing assistant...")
    assistant = DemoAssistant(knowledge_path)
    assistant.load_knowledge()

    if args.realtime:
        print("\n🎙️  Real-time voice mode would be enabled with full LiveKit setup")
        print("   This demo shows the text-based interaction capabilities")

    # Run demo conversation
    run_demo_conversation(assistant)

    print("\n🎉 Agent demo completed!")
    print("\n💡 Next Steps:")
    print("   • Set up LiveKit for real-time voice interaction")
    print("   • Create custom knowledge bases with quickstart_extraction.py")
    print("   • Explore the full agent.py for production deployment")
    print("   • Check out the web interface in frontend/")


if __name__ == "__main__":
    main()
