# DotBridge Research Framework

**A research framework for multipass knowledge extraction and structured knowledge graph construction from multimodal content**

![Python](https://img.shields.io/badge/python-3.8+-blue) ![React](https://img.shields.io/badge/react-18+-blue) ![License](https://img.shields.io/badge/license-MIT-green)

> **📝 Note**: This framework demonstrates sophisticated multimodal AI techniques. We are actively working to **condense and simplify** the functionality for easier adoption while maintaining the core innovation.

## 🚀 Quick Start

[**View Repository**](https://github.com/levbszabo/brdge-v1) | [**Creator Portfolio**](https://journeymanai.io)

## What is DotBridge?

DotBridge is an open-source research framework that demonstrates advanced multimodal AI techniques for systematic knowledge extraction and interactive agent construction. Originally developed as a commercial product, it's now open-sourced to advance research in:

- **Systematic knowledge extraction** from unstructured multimodal content
- **Structured knowledge graph construction** from diverse content sources  
- **Real-time AI agent architectures** with contextual awareness
- **Production deployment** of multimodal AI research systems

> **🔧 Simplification Roadmap**: Future versions will provide simpler entry points while preserving the sophisticated underlying analysis capabilities.

## 🧠 Core Innovation: Research Methodology

### 1. **Multipass Content Analysis**
Sequential extraction pipeline analyzing content structure, temporal components, and semantic relationships across modalities.

### 2. **Knowledge Graph Construction** 
Structured representation including teaching personas, engagement opportunities, timeline mappings, and Q&A derivations.

### 3. **Agent Instantiation Framework**
Dynamic agent configuration utilizing extracted knowledge graphs for contextually-aware conversational interfaces.

### 4. **Temporal Engagement Mapping**
Time-synchronized interaction opportunities derived from content analysis and embedded within agent response patterns.

> **📊 Current State**: The system contains ~7,400 lines of sophisticated AI logic. We're identifying opportunities to create simplified interfaces while maintaining production capabilities.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Content       │    │   Extraction     │    │   Knowledge     │
│   Input         │───▶│   Pipeline       │───▶│   Base          │
│   (Video/Docs)  │    │   (Multi-pass)   │    │   (Knowledge Graph)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐             │
│   User          │    │   Real-time      │             │
│   Interface     │◀───│   AI Agent       │◀────────────┘
│   (Web/Voice)   │    │   (LiveKit)      │
└─────────────────┘    └──────────────────┘
```

## 💡 Use Cases & Applications

### Financial Services
- **Earnings call analysis and Q&A**: Interactive analysis of quarterly earnings calls
- **SEC filing interrogation**: Query complex financial documents  
- **Investment research automation**: Automated research workflows
- **Risk assessment conversations**: Interactive risk modeling

### Research & Education
- **Academic paper interaction**: Query and discuss research papers
- **Documentation Q&A systems**: Internal knowledge systems
- **Training content delivery**: Interactive learning experiences
- **Knowledge base creation**: Automated knowledge extraction

### Enterprise
- **Internal knowledge systems**: Company-wide knowledge repositories
- **Customer support automation**: AI-powered support agents
- **Training and onboarding**: Interactive employee training
- **Document analysis workflows**: Automated document processing

## 🛠️ Tech Stack

### Backend Core
- **Python 3.8+** - Core application logic
- **Flask** - Web framework with SQLAlchemy ORM
- **Google Gemini 2.0/2.5** - Primary multimodal AI models
- **OpenAI GPT-4** - Secondary language model support
- **Custom Knowledge Extraction** - Sophisticated multipass analysis pipeline

### Real-time Communication  
- **LiveKit** - WebRTC infrastructure for real-time communication
- **LiveKit Agents Framework** - Custom voice AI agent implementation
- **Deepgram** - High-performance speech-to-text
- **Cartesia** - Neural voice synthesis and voice cloning

### Frontend
- **React 18+** - User interface
- **LiveKit Components** - Real-time UI components
- **WebRTC** - Browser-based real-time communication

### Infrastructure
- **AWS Services** - S3 for storage, optional cloud deployment
- **PostgreSQL/SQLite** - Structured data storage
- **Docker** - Containerized deployment

> **⚡ Performance Note**: Current system processes 10-minute videos in ~30 seconds. Optimization opportunities exist for faster processing.

## 🚀 Quick Start Options

> **💡 Start Simple**: We recommend beginning with Option A to understand the core capabilities before exploring the full system.

### Option A: Knowledge Extraction Pipeline
**Perfect for:** Data scientists, researchers working with multimodal content analysis  
**Time:** 5 minutes

```bash
# Clone and navigate to project
git clone https://github.com/levbszabo/brdge-v1.git
cd brdge-v1

# Setup Python environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r backend/requirements.txt

# Configure environment (see SETUP.md for details)
cp backend/.env.example backend/.env
# Edit backend/.env with your GOOGLE_API_KEY

# Test with demo content
python quickstart_extraction.py --demo
```

[📖 **Detailed Knowledge Extraction Guide**](#knowledge-extraction-quickstart)

### Option B: Real-time Voice AI Agent
**Perfect for:** ML engineers, conversational AI developers  
**Time:** 15 minutes (requires multiple API keys)

```bash
# Complete Option A first, then add real-time services
# Edit backend/.env with LIVEKIT_*, DEEPGRAM_*, CARTESIA_* keys

# Test interactive agent
python quickstart_agent.py --demo
```

[📖 **Detailed Real-time Agent Guide**](#real-time-agent-quickstart)

### Option C: Full Production System
**Perfect for:** System architects, full-stack developers  
**Time:** 30+ minutes

See the complete [SETUP.md](SETUP.md) guide for full system deployment.

## 📚 Core Component Guides

## Knowledge Extraction Quickstart

> **🔍 Core Innovation**: This 5,600-line system (`gemini.py`) demonstrates sophisticated multimodal content analysis with applications across research, finance, and enterprise domains.

The knowledge extraction system demonstrates sophisticated multimodal content analysis techniques with applications across research, finance, and enterprise domains.

### Key Features
- **Multipass Analysis**: Sequential extraction of structure, content, and relationships
- **Temporal Synchronization**: Timeline mapping across video and document content  
- **Knowledge Graph Construction**: Structured representation for downstream applications
- **Production-Ready**: Handles large files, rate limiting, error recovery

### Content Types Supported

The system supports four content types, each with specialized extraction algorithms:

- **`course`** (default): Educational content - extracts concepts, definitions, frameworks
- **`vsl`**: Video Sales Letters - extracts features, benefits, pricing, CTAs
- **`webinar`**: Presentations - extracts discussion points, Q&A opportunities  
- **`onboarding`**: User training - extracts procedural steps, UI elements

### Basic Usage

```python
from backend.gemini import create_brdge_knowledge, configure_genai

# Configure Gemini AI
configure_genai()

# Extract knowledge from multimodal content
knowledge_graph = create_brdge_knowledge(
    video_path="./content/earnings_call.mp4",
    document_path="./content/10k_filing.pdf", 
    bridge_type="course",  # Educational content analysis
    additional_instructions="Focus on risk factors and forward guidance"
)

# Knowledge graph contains:
# - timeline_data: Temporal structure and key moments
# - knowledge_data: Core concepts and relationships
# - persona_data: Communication patterns and expertise areas  
# - engagement_data: Interactive opportunities and Q&A potential
```

### Advanced Applications

```python
# Financial earnings call analysis (educational approach)
earnings_knowledge = create_brdge_knowledge(
    video_path="./q3_earnings_call.mp4",
    document_path="./q3_earnings_slides.pdf",
    bridge_type="course",  # Treat as educational content
    additional_instructions="""
    Focus on:
    - Forward guidance and outlook statements
    - Management confidence indicators  
    - Risk factor discussions
    - Competitive positioning
    """
)

# Sales presentation analysis  
sales_knowledge = create_brdge_knowledge(
    video_path="./product_demo.mp4",
    document_path="./sales_deck.pdf",
    bridge_type="vsl",  # Video sales letter analysis
    additional_instructions="Extract value propositions and competitive advantages"
)

# Research paper interaction system
research_knowledge = create_brdge_knowledge(
    video_path="./conference_presentation.mp4", 
    document_path="./research_paper.pdf",
    bridge_type="course",  # Educational content
    additional_instructions="Extract methodology, findings, and limitations"
)
```

### Output Structure

The system produces a comprehensive knowledge graph:

```json
{
  "timeline_data": {
    "video_segments": [...],
    "document_sections": [...], 
    "synchronized_timeline": [...]
  },
  "knowledge_data": {
    "core_concepts": [...],
    "relationships": [...],
    "key_insights": [...]
  },
  "persona_data": {
    "expertise_areas": [...],
    "communication_style": {...},
    "teaching_approach": {...}
  },
  "engagement_data": {
    "interaction_opportunities": [...],
    "q_and_a_potential": [...],
    "follow_up_topics": [...]
  }
}
```

> **📈 Optimization Note**: Current extraction generates comprehensive data. Future versions will offer lightweight extraction modes for specific use cases.

## Real-time Agent Quickstart

> **🎯 Production Ready**: This 1,800-line system (`agent.py`) demonstrates production-ready conversational AI with sophisticated state management and multi-LLM support.

The real-time agent system demonstrates production-ready conversational AI with sophisticated state management, multi-LLM support, and real-time voice interaction.

### Key Features
- **Multi-LLM Support**: Gemini 2.0 Flash Live, OpenAI Realtime, with dynamic switching
- **Voice AI Integration**: Deepgram STT, Cartesia TTS with voice cloning
- **Production Architecture**: Rate limiting, error recovery, usage tracking
- **LiveKit Framework**: WebRTC-based real-time communication

### Basic Usage (Text Demo)

```python
# Run the interactive demo
python quickstart_agent.py --demo

# The demo provides:
# - Text-based conversation interface  
# - Sample financial knowledge base
# - Interactive Q&A about financial concepts
# - Demonstration of context awareness
```

### Advanced Configuration (Production)

```python
from backend.agent import Assistant

# Create agent with custom knowledge
assistant = Assistant(
    brdge_id="financial_analyst",
    personalization_id="portfolio_manager_001"
)

# Initialize with knowledge base
await assistant.initialize()

# The agent handles:
# - Real-time voice conversation
# - Context-aware responses
# - Knowledge base integration
# - Multi-turn conversation state
```

### Production Features

```python
# Usage tracking and analytics
await assistant._log_conversation(
    message_content="What are the key risks mentioned?",
    role="user",
    interrupted=False
)

# Dynamic engagement opportunities  
await assistant.check_engagement_opportunities(current_time_seconds=120)

# Voice customization
assistant.voice_id = "custom_cloned_voice_id"
```

> **🔧 Complexity Note**: The current agent system is highly sophisticated. We're working on simplified deployment options for common use cases.

## Full System Setup

For complete development environment setup including frontend, database, and all services, see the comprehensive [SETUP.md](SETUP.md) guide.

Key components:
- **Backend API** (Flask) - Knowledge management and processing
- **Frontend Interface** (React) - User interaction and file uploads  
- **Real-time Agents** (LiveKit) - Voice AI conversations
- **Database** (PostgreSQL/SQLite) - Structured data storage

## 🔧 Environment Setup

### Required Environment Variables

Create a `backend/.env` file:

```bash
# Core AI Services (Required)
GOOGLE_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Real-time Services (Optional, for voice features)
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_secret
LIVEKIT_URL=wss://your_livekit_url
DEEPGRAM_API_KEY=your_deepgram_api_key
CARTESIA_API_KEY=your_cartesia_api_key

# Database (Optional, defaults to SQLite)
DATABASE_URL=sqlite:///./instance/brdges.db
```

### Service Setup

1. **Google Gemini**: Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **LiveKit**: Sign up at [LiveKit Cloud](https://livekit.io/) for real-time features
3. **Deepgram**: Get API key from [Deepgram Console](https://console.deepgram.com/) for speech-to-text
4. **Cartesia**: Get API key from [Cartesia](https://cartesia.ai/) for voice synthesis

### Dependencies

```bash
# Install core dependencies  
pip install google-generativeai>=0.8.0  # Gemini AI models
pip install livekit-agents>=0.8.0       # Real-time agent framework
pip install deepgram-sdk>=3.0.0         # Speech-to-text
pip install openai>=1.0.0               # OpenAI models
pip install flask>=3.0.0                # Web framework
```

> **📦 Dependency Note**: Current system has 90+ dependencies. We're working to reduce this for simpler deployments.

## 🔬 Research Applications

> **🎯 Target Application**: These techniques are particularly valuable for financial analysis, research automation, and alternative data processing.

This system demonstrates techniques directly applicable to:

### Alternative Data Processing
- Earnings call sentiment analysis and key insight extraction
- News article impact scoring and relationship mapping
- Social media signal extraction from multimodal content
- Document classification pipelines for financial documents

### Financial Analysis  
- Real-time market signal generation from earnings calls
- Research automation workflows for investment analysis
- Risk model development from multimodal data sources
- Portfolio optimization research with interactive analysis

### AI Engineering
- Production ML system design patterns
- Real-time conversation system architecture
- Knowledge graph construction from multimodal data
- Multimodal AI pipeline optimization

## 🤝 Contributing

> **🚀 Contribution Focus**: We welcome contributions that help simplify the system while maintaining its sophisticated capabilities.

We welcome contributions! This project is ideal for:

- **Researchers** exploring multimodal AI and knowledge extraction
- **Financial Developers** building data processing systems  
- **ML Engineers** working on production conversational AI
- **System Architects** designing real-time AI applications

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Set up development environment:
   ```bash
   cd brdge-v1
   python -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   ```
4. Make your changes with tests
5. Submit a pull request

### Priority Areas for Contribution
- **Simplification**: Reducing complexity while maintaining functionality
- **Documentation**: Clearer setup and usage guides
- **Performance**: Optimization of extraction and agent systems
- **Testing**: Comprehensive test coverage for reliability

## 📊 Performance & Research Metrics

- **Knowledge Extraction**: ~30 seconds per 10-minute video with document
- **Agent Response Latency**: <200ms for typical queries via Gemini 2.0 Flash
- **Concurrent Users**: 100+ with proper LiveKit scaling
- **Memory Efficiency**: Optimized for large document processing (up to 50MB PDFs)
- **Real-time Performance**: <50ms audio latency with Cartesia + Deepgram

> **⚡ Performance Goals**: Working toward sub-10-second extraction for common use cases and simplified deployment options.

## 🛡️ Security & Privacy

- Environment-based configuration for all sensitive keys
- No data persistence in demo mode
- Configurable data retention policies
- Rate limiting and usage tracking
- User authentication and session management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ About the Creator

Built by [Levente Szabo](https://journeymanai.io), an AI engineer with experience in:
- Production ML systems and real-time AI architectures
- Financial analysis and data processing
- Multimodal AI and knowledge extraction systems
- Full-stack AI application development

**Current Focus**: Applying these multimodal AI techniques to alternative data analysis and financial research.

## 🔗 Links

- **Main Repository**: [https://github.com/levbszabo/brdge-v1](https://github.com/levbszabo/brdge-v1)
- **Creator Portfolio**: [journeymanai.io](https://journeymanai.io)
- **Setup Guide**: [SETUP.md](SETUP.md)
- **Technical Deep Dive**: [Coming Soon]

## 📈 Research Roadmap

### Immediate (Simplification Focus)
- [ ] **Lightweight extraction modes** for specific use cases
- [ ] **Simplified deployment** options with fewer dependencies
- [ ] **Streamlined quickstart** with minimal configuration
- [ ] **Reduced complexity** while maintaining core capabilities

### Advanced Features
- [ ] Enhanced multimodal fusion algorithms for financial data
- [ ] Real-time knowledge graph updates during live conversations
- [ ] Multi-language content analysis for global markets
- [ ] Advanced analytics dashboard for research insights
- [ ] Integration with automated research workflows
- [ ] Cloud deployment templates for production scaling

---

**Star this repo if you find it useful for your research or applications!** ⭐

*This project represents the evolution from a commercial product to an open-source research contribution. The techniques demonstrated here are particularly valuable for alternative data processing, multimodal content analysis, and production AI system design.*

> **🎯 Next Steps**: We're actively working to make this powerful system more accessible while preserving its sophisticated analytical capabilities. Your feedback and contributions help guide this simplification process.