# DotBridge Research Framework

**A research framework for multipass knowledge extraction and structured knowledge graph construction from multimodal content**

![Python](https://img.shields.io/badge/python-3.8+-blue) ![React](https://img.shields.io/badge/react-18+-blue) ![License](https://img.shields.io/badge/license-MIT-green)

> **📝 Note**: This framework demonstrates sophisticated multimodal AI techniques. We are actively working to **condense and simplify** the functionality for easier adoption while maintaining the core innovation.

## 🚀 Quick Start

[**View Repository**](https://github.com/levbszabo/dotbridge) | [**Creator Portfolio**](https://journeymanai.io)

## What is DotBridge?

DotBridge is an open-source research framework that demonstrates advanced multimodal AI techniques for systematic knowledge extraction and interactive agent construction. Originally developed as a commercial product, it's now open-sourced to advance research in:

- **Systematic knowledge extraction** from unstructured multimodal content
- **Structured knowledge graph construction** from diverse content sources
- **Real-time AI agent architectures** with contextual awareness
- **Production deployment** of multimodal AI research systems

> **🔧 Simplification Roadmap**: Future versions will provide simpler entry points while preserving the sophisticated underlying analysis capabilities.

## 🧠 Core Innovation

### **Multipass Content Analysis**
Sequential extraction pipeline analyzing content structure, temporal components, and semantic relationships across modalities.

### **Knowledge Graph Construction** 
Structured representation including teaching personas, engagement opportunities, timeline mappings, and Q&A derivations.

### **Agent Instantiation Framework**
Dynamic agent configuration utilizing extracted knowledge graphs for contextually-aware conversational interfaces.

### **Temporal Engagement Mapping**
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

**📋 For Complete System Design**: See our detailed [**System Design Document**](SYSTEM_DESIGN.md) which includes:
- Comprehensive microservices architecture diagram
- Data flow analysis across all components  
- Production deployment configurations
- Performance characteristics and scaling considerations

## 💡 Applications

**Financial Services** • **Research & Education** • **Enterprise Knowledge Systems**

- Interactive earnings call analysis and Q&A
- Academic paper interaction and discussion  
- Real-time document interrogation and insights
- Automated knowledge base creation from multimodal content

## 🛠️ Tech Stack

**Core:** Python 3.8+ • Flask • Google Gemini 2.0/2.5 • OpenAI GPT-4 • Custom Knowledge Extraction Pipeline  
**Real-time:** LiveKit • Deepgram STT • Cartesia TTS • WebRTC  
**Frontend:** React 18+ • LiveKit Components  
**Infrastructure:** PostgreSQL/SQLite • AWS S3 • Docker

> **⚡ Performance**: Processes 10-minute videos in ~30 seconds with sophisticated multimodal analysis.

## 🚀 Quick Start Options

> **💡 Start Simple**: We recommend beginning with Option A to understand the core capabilities.

### Option A: Knowledge Extraction (5 minutes)
**Perfect for:** Data scientists, researchers, developers

   ```bash
# Clone and setup
git clone https://github.com/levbszabo/dotbridge.git
cd dotbridge
python -m venv venv && source venv/bin/activate
pip install -r backend/requirements.txt

# Configure (see SETUP.md for details)
cp config.txt backend/.env
# Edit backend/.env with your GOOGLE_API_KEY

# Extract knowledge from your content
python quickstart_extraction.py --video /path/to/your/video.mp4 --document /path/to/your/document.pdf
```

### Option B: Real-time Voice AI Agent (15 minutes)
**Perfect for:** ML engineers, conversational AI developers

   ```bash
# Complete Option A first, then add real-time services to backend/.env:
# LIVEKIT_*, DEEPGRAM_*, CARTESIA_* keys (see config.txt template)

# Test interactive agent
python quickstart_agent.py --demo
```

### Option C: Full Production System (30+ minutes)
**Perfect for:** System architects, full-stack developers

See the complete [SETUP.md](SETUP.md) guide for full system deployment.

## 📚 Knowledge Extraction Quickstart

> **🔍 Core Innovation**: This 5,600-line system (`gemini.py`) demonstrates sophisticated multimodal content analysis with applications across research, finance, and enterprise domains.

### Content Types Supported

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

# Output: Comprehensive knowledge graph with timeline, concepts, personas, and engagement data
```

### Advanced Examples

```python
# Financial earnings call analysis
earnings_knowledge = create_brdge_knowledge(
    video_path="./q3_earnings_call.mp4",
    document_path="./q3_earnings_slides.pdf",
    bridge_type="course", 
    additional_instructions="Focus on forward guidance, risk factors, and competitive positioning"
)

# Sales presentation analysis  
sales_knowledge = create_brdge_knowledge(
    video_path="./product_demo.mp4",
    document_path="./sales_deck.pdf",
    bridge_type="vsl",
    additional_instructions="Extract value propositions and competitive advantages"
)
```

> **📈 Optimization Note**: Current extraction generates comprehensive data. Future versions will offer lightweight extraction modes for specific use cases.

## 🎙️ Real-time Agent Quickstart

> **🎯 Production Ready**: This 1,800-line system (`agent.py`) demonstrates production-ready conversational AI with sophisticated state management and multi-LLM support.

### Features
- **Multi-LLM Support**: Gemini 2.0 Flash Live, OpenAI Realtime with dynamic switching
- **Voice AI Integration**: Deepgram STT, Cartesia TTS with voice cloning
- **Production Architecture**: Rate limiting, error recovery, usage tracking

### Usage

```python
# Run interactive demo
python quickstart_agent.py --demo

# Production deployment
from backend.agent import Assistant

assistant = Assistant(brdge_id="financial_analyst", personalization_id="user_001")
await assistant.initialize()
# Handles real-time voice conversation, context-aware responses, knowledge integration
```

> **🔧 Complexity Note**: The current agent system is highly sophisticated. We're working on simplified deployment options for common use cases.

## 🔧 Environment Setup

```bash
# Copy template and configure
cp config.txt backend/.env
# Edit backend/.env with your API keys (minimum: GOOGLE_API_KEY)
```

**Service Setup:**
- **Google Gemini**: [Get API key](https://aistudio.google.com/app/apikey)
- **LiveKit**: [Sign up](https://livekit.io/) for real-time features
- **Deepgram**: [Get API key](https://console.deepgram.com/) for speech-to-text
- **Cartesia**: [Get API key](https://cartesia.ai/) for voice synthesis

See `config.txt` for complete template with all options.

> **📦 Dependencies**: Current system has 90+ dependencies. We're working to reduce this for simpler deployments.

## 🔬 Research Applications

> **🎯 Target Applications**: Particularly valuable for financial analysis, research automation, and alternative data processing.

**Alternative Data Processing** • **Financial Analysis** • **AI Engineering**

- Earnings call sentiment analysis and insight extraction
- Real-time market signal generation from multimodal content
- Research automation workflows for investment analysis
- Production ML system design patterns and architectures

## 🤝 Contributing

> **🚀 Contribution Focus**: We welcome contributions that help simplify the system while maintaining sophisticated capabilities.

**Ideal for:** Researchers exploring multimodal AI • Financial developers building data systems • ML engineers working on conversational AI • System architects designing real-time applications

**Priority Areas:**
- **Simplification**: Reducing complexity while maintaining functionality
- **Performance**: Optimization of extraction and agent systems
- **Documentation**: Clearer setup and usage guides
- **Testing**: Comprehensive test coverage for reliability

## 📊 Performance Metrics

- **Knowledge Extraction**: ~30 seconds per 10-minute video with document
- **Agent Response**: <200ms latency via Gemini 2.0 Flash
- **Concurrent Users**: 100+ with proper LiveKit scaling
- **Memory Efficiency**: Optimized for large documents (up to 50MB PDFs)
- **Real-time Performance**: <50ms audio latency

> **⚡ Performance Goals**: Working toward sub-10-second extraction for common use cases and simplified deployment options.

## 🙋‍♂️ About

Built by [Levente Szabo](https://journeymanai.io), an AI engineer with experience in production ML systems, real-time AI architectures, financial analysis and data processing, and multimodal AI systems.

**Current Focus**: Applying these multimodal AI techniques to alternative data analysis and financial research.

## 🔗 Links

- **Main Repository**: [https://github.com/levbszabo/dotbridge](https://github.com/levbszabo/dotbridge)
- **Creator Portfolio**: [journeymanai.io](https://journeymanai.io)
- **Setup Guide**: [SETUP.md](SETUP.md)

## 📈 Roadmap

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