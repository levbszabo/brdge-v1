# DotBridge Research Framework

**A research framework for multipass knowledge extraction and structured knowledge graph construction from multimodal content**

![DotBridge Demo](https://img.shields.io/badge/demo-live-brightgreen) ![Python](https://img.shields.io/badge/python-3.8+-blue) ![React](https://img.shields.io/badge/react-18+-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Quick Start

[**Try the Live Demo**](https://your-demo-url.com) | [**Creator Portfolio**](https://journeymanai.io)

## What is DotBridge?

DotBridge is an open-source research framework that demonstrates advanced multimodal AI techniques for systematic knowledge extraction and interactive agent construction. Originally developed as a commercial product, it's now open-sourced to advance research in:

- **Systematic knowledge extraction** from unstructured multimodal content
- **Structured knowledge graph construction** from diverse content sources
- **Real-time AI agent architectures** with contextual awareness
- **Production deployment** of multimodal AI research systems

## 🧠 Core Innovation: Research Methodology

### 1. **Multipass Content Analysis**
Sequential extraction pipeline analyzing content structure, temporal components, and semantic relationships across modalities.

### 2. **Knowledge Graph Construction**
Structured representation including teaching personas, engagement opportunities, timeline mappings, and Q&A derivations.

### 3. **Agent Instantiation Framework**
Dynamic agent configuration utilizing extracted knowledge graphs for contextually-aware conversational interfaces.

### 4. **Temporal Engagement Mapping**
Time-synchronized interaction opportunities derived from content analysis and embedded within agent response patterns.

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

### Backend
- **Python 3.8+** - Core application logic
- **Flask** - Web framework
- **OpenAI API** - Language model integration
- **LiveKit** - Real-time communication
- **AWS Services** - S3, Lambda, CloudWatch

### Frontend
- **React 18+** - User interface
- **Material-UI** - Component library
- **Framer Motion** - Animations
- **LiveKit Components** - Real-time UI

### AI/ML
- **LangChain** - LLM orchestration
- **Sentence Transformers** - Text embeddings
- **Whisper** - Speech-to-text
- **TTS Services** - Text-to-speech (Cartesia, OpenAI)

### Real-time Communication
- **LiveKit Agents** - Real-time voice AI agents ([separate repo](https://github.com/levbszabo/livekit-agents))
- **WebRTC** - Real-time communication protocol
- **Voice Activity Detection** - Intelligent conversation flow

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, for vector storage)

### Required Repositories
This project requires two repositories to run the complete system:

1. **Main Application** (this repo): [https://github.com/levbszabo/brdge-v1](https://github.com/levbszabo/brdge-v1)
2. **LiveKit Agents Framework**: [https://github.com/levbszabo/livekit-agents](https://github.com/levbszabo/livekit-agents)

The LiveKit agents repository contains the real-time voice AI system built on the LiveKit agents framework. You'll need to set up both repositories for full functionality.

### Installation

1. **Clone the repositories**
   ```bash
   # Main application
   git clone https://github.com/levbszabo/brdge-v1.git
   cd brdge-v1
   
   # LiveKit agents (in a separate directory)
   cd ..
   git clone https://github.com/levbszabo/livekit-agents.git
   ```

2. **Backend Setup**
   ```bash
   cd brdge-v1/backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   ```bash
   # Backend (.env)
   OPENAI_API_KEY=your_openai_key
   LIVEKIT_API_KEY=your_livekit_key
   LIVEKIT_API_SECRET=your_livekit_secret
   DATABASE_URL=your_database_url
   
   # Frontend (.env.local)
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-url
   ```

### Run the Application
To run the full application, you will need to run four separate services across the `brdge-v1` and `livekit-agents` repositories.

```bash
# Terminal 1 - brdge-v1: Frontend (React)
cd brdge-v1/frontend
npm start

# Terminal 2 - brdge-v1: Backend (Flask)
cd brdge-v1/backend
source venv/bin/activate # On Windows: venv\Scripts\activate
python3 app.py

# Terminal 3 - brdge-v1: Backend (LiveKit Agent)
cd brdge-v1/backend
source venv/bin/activate # On Windows: venv\Scripts\activate
python3 agent.py dev

# Terminal 4 - livekit-agents: Frontend (Next.js Playground)
# See the livekit-agents repo for specific setup instructions.
cd livekit-agents
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📚 Documentation

### Key Concepts

- **Bridges**: Interactive AI agents created from source content
- **Extraction Pipeline**: Multi-pass content analysis system
- **Knowledge Graph**: Structured representation of content with concepts, timelines, and relationships to power the AI.
- **Personalization**: User-specific conversation customization

### API Endpoints

```
POST /api/bridges          - Create new bridge
GET  /api/bridges/:id      - Get bridge details
POST /api/extract          - Extract knowledge from content
GET  /api/conversations    - Get conversation history
```

### Creating Your First Bridge

1. Upload content (video, PDF, or text)
2. Configure extraction parameters
3. Set up AI agent personality
4. Test the interactive experience
5. Share with users

## 🔬 Research Applications

This system demonstrates techniques directly applicable to:

### Alternative Data Processing
- Earnings call sentiment analysis
- News article impact scoring
- Social media signal extraction
- Document classification pipelines

### Quantitative Finance
- Real-time market signal generation
- Research automation workflows
- Risk model development
- Portfolio optimization research

### AI Engineering
- Production ML system design
- Real-time conversation systems
- Knowledge graph construction from multimodal data
- Multimodal AI architectures

## 🤝 Contributing

We welcome contributions! This project is ideal for:

- **Researchers** exploring multimodal AI
- **Engineers** building production AI systems
- **Students** learning about AI architectures
- **Practitioners** in quantitative finance and alternative data

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📊 Performance & Research Metrics

- **Extraction Speed**: ~30 seconds per 10-minute video
- **Response Latency**: <200ms for typical queries
- **Concurrent Users**: 100+ (with proper scaling)
- **Knowledge Graph**: Optimized structured representation

## 🛡️ Security & Privacy

- No data persistence in demo mode
- Configurable data retention policies
- API rate limiting
- User authentication system

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ About the Creator

Built by [Levente Szabo](https://journeymanai.io), an AI engineer with experience in:
- Production ML systems
- Quantitative finance
- Alternative data processing
- Real-time AI architectures

**Current Focus**: Applying these techniques to alternative data in quantitative finance.

## 🔗 Links

- **Main Repository**: [https://github.com/levbszabo/brdge-v1](https://github.com/levbszabo/brdge-v1)
- **LiveKit Agents**: [https://github.com/levbszabo/livekit-agents](https://github.com/levbszabo/livekit-agents)
- **Creator Portfolio**: [journeymanai.io](https://journeymanai.io)
- **Documentation**: [Coming Soon]
- **Research Papers**: [Coming Soon]

## 📈 Research Roadmap

- [ ] Enhanced knowledge graph construction algorithms
- [ ] Multi-language content analysis
- [ ] Advanced analytics dashboard for research insights
- [ ] Plugin architecture for extensibility
- [ ] Cloud deployment templates
- [ ] Performance optimization guides for large-scale research

---

**Star this repo if you find it useful for your research or projects!** ⭐

*This project represents the evolution from a commercial product to an open-source research contribution. The techniques demonstrated here are applicable to a wide range of AI engineering challenges, particularly in multimodal content analysis and structured knowledge extraction.*