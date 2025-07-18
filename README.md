# DotBridge - Open Source Multimodal AI Framework

**Transform any video or document into an intelligent, interactive AI agent**

![DotBridge Demo](https://img.shields.io/badge/demo-live-brightgreen) ![Python](https://img.shields.io/badge/python-3.8+-blue) ![React](https://img.shields.io/badge/react-18+-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Quick Start

[**Try the Live Demo**](https://your-demo-url.com) | [**Creator Portfolio**](https://journeymanai.io)

## What is DotBridge?

DotBridge is an open-source framework that demonstrates advanced multimodal AI techniques for transforming static content into intelligent, interactive experiences. Originally developed as a commercial product, it's now open-sourced to advance research in:

- **Systematic knowledge extraction** from unstructured content
- **Real-time AI agent architectures** with memory and context
- **Vector database optimization** for conversational AI
- **Production deployment** of multimodal AI systems

## 🧠 Core Innovation: The "Bridge" System

### 1. **Multipass Extraction**
Systematically extract knowledge from video, audio, and documents using advanced NLP and content analysis pipelines.

### 2. **Vector Knowledge Base**
Store and retrieve information using semantic search with optimized vector databases (FAISS, Pinecone, etc.).

### 3. **Real-time AI Agents**
Interactive voice and text agents with memory, context awareness, and personalized conversation flows.

### 4. **Personalization Engine**
Adapt interactions based on user profiles, conversation history, and contextual data.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Content       │    │   Extraction     │    │   Knowledge     │
│   Input         │───▶│   Pipeline       │───▶│   Base          │
│   (Video/Docs)  │    │   (Multi-pass)   │    │   (Vector DB)   │
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
- **Vector Databases** - FAISS, Pinecone, PGVector
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

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, for vector storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/dotbridge.git
   cd dotbridge
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
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

5. **Run the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python app.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

Visit `http://localhost:3000` to see the application.

## 📚 Documentation

### Key Concepts

- **Bridges**: Interactive AI agents created from source content
- **Extraction Pipeline**: Multi-pass content analysis system
- **Knowledge Base**: Vector-stored information with semantic search
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
- Vector database optimization
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

## 📊 Performance & Scalability

- **Extraction Speed**: ~30 seconds per 10-minute video
- **Response Latency**: <200ms for typical queries
- **Concurrent Users**: 100+ (with proper scaling)
- **Storage**: Optimized vector compression

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

- **Live Demo**: [Try DotBridge](https://your-demo-url.com)
- **Creator Portfolio**: [journeymanai.io](https://journeymanai.io)
- **Documentation**: [Coming Soon]
- **Research Papers**: [Coming Soon]

## 📈 Roadmap

- [ ] Enhanced vector database integrations
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Plugin architecture
- [ ] Cloud deployment templates
- [ ] Performance optimization guides

---

**Star this repo if you find it useful for your research or projects!** ⭐

*This project represents the evolution from a commercial product to an open-source research contribution. The techniques demonstrated here are applicable to a wide range of AI engineering challenges, particularly in financial technology and alternative data processing.*