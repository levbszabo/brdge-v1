# DotBridge Setup Guide

This guide will help you set up DotBridge for different use cases, from basic knowledge extraction to full real-time voice AI.

## 🎯 Choose Your Setup Path

### Path A: Knowledge Extraction Only
**For:** Data scientists, researchers, developers  
**Time:** 5 minutes  
**Requirements:** Google Gemini API key only

### Path B: Real-time Agent System  
**For:** ML engineers, conversational AI developers  
**Time:** 15 minutes  
**Requirements:** Multiple API keys (LiveKit, Deepgram, Cartesia, etc.)

### Path C: Full Production System
**For:** System architects, full-stack developers  
**Time:** 30+ minutes  
**Requirements:** All APIs, database, frontend setup

## 📋 Prerequisites

- **Python 3.8+** (3.10+ recommended)
- **Git** for cloning the repository
- **Terminal/Command Prompt** access

### System Requirements
- **Memory:** 4GB+ RAM (8GB+ recommended for large documents)
- **Storage:** 2GB+ free space
- **Network:** Stable internet for API calls

## 🚀 Quick Start (Path A: Knowledge Extraction)

Perfect for exploring the multimodal analysis capabilities:

### 1. Clone and Setup
```bash
git clone https://github.com/levbszabo/brdge-v1.git
cd brdge-v1

# Create virtual environment
python -m venv venv

# Activate environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 2. Environment Configuration
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit the .env file and add your Google API key:
# GOOGLE_API_KEY=your_api_key_here
```

**Get your Google API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

### 3. Test the System
```bash
# Run the knowledge extraction quickstart
python quickstart_extraction.py --demo

# Or with your own content:
python quickstart_extraction.py --video your_video.mp4 --document your_doc.pdf
```

## 🎙️ Real-time Agent Setup (Path B)

For full conversational AI capabilities:

### 1. Complete Path A First
Follow all steps in Path A above.

### 2. Additional API Keys Required

Add these to your `backend/.env` file:

```bash
# LiveKit (Real-time infrastructure)
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_secret
LIVEKIT_URL=wss://your_livekit_url

# Deepgram (Speech-to-Text)
DEEPGRAM_API_KEY=your_deepgram_api_key

# Cartesia (Text-to-Speech)
CARTESIA_API_KEY=your_cartesia_api_key

# OpenAI (Alternative LLM)
OPENAI_API_KEY=your_openai_api_key
```

### 3. Get Required API Keys

#### LiveKit
1. Sign up at [LiveKit Cloud](https://livekit.io/)
2. Create a new project
3. Copy API Key, Secret, and WebSocket URL

#### Deepgram
1. Sign up at [Deepgram Console](https://console.deepgram.com/)
2. Create a new API key
3. Copy the key

#### Cartesia
1. Sign up at [Cartesia](https://cartesia.ai/)
2. Generate an API key
3. Copy the key

#### OpenAI (Optional)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key

### 4. Test Real-time Agent
```bash
# Run the agent quickstart
python quickstart_agent.py --demo --realtime
```

## 🏗️ Full System Setup (Path C)

For complete development environment:

### 1. Complete Paths A & B
Follow all previous setup steps.

### 2. Database Setup

#### Option 1: SQLite (Default)
No additional setup required. Uses local file storage.

#### Option 2: PostgreSQL (Recommended for production)
```bash
# Install PostgreSQL locally or use cloud service
# Update .env file:
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

### 3. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Backend API Server
```bash
# In backend directory with activated virtual environment
cd backend
python app.py
```

### 5. Real-time Agent Service
```bash
# In another terminal, backend directory
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python agent.py dev
```

### 6. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Agent Service:** Running on LiveKit infrastructure

## 🔧 Environment Variables Reference

### Core Services (Required for basic functionality)
```bash
# Google Gemini AI
GOOGLE_API_KEY=your_gemini_api_key

# OpenAI (alternative/backup)
OPENAI_API_KEY=your_openai_api_key
OPENAI_ORG_ID=your_org_id
```

### Real-time Services (Required for voice features)
```bash
# LiveKit infrastructure
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_secret
LIVEKIT_URL=wss://your_livekit_url

# Speech services
DEEPGRAM_API_KEY=your_deepgram_key
CARTESIA_API_KEY=your_cartesia_key

# Alternative TTS (optional)
ELEVENLABS_API_KEY=your_elevenlabs_key
```

### Application Configuration
```bash
# Flask settings
SECRET_KEY=your_flask_secret_key
JWT_SECRET_KEY=your_jwt_secret
API_BASE_URL=http://localhost:5000/api

# Database
DATABASE_URL=sqlite:///./instance/brdges.db

# Development settings
FLASK_ENV=development
FLASK_DEBUG=true
```

### Storage & Cloud (Optional)
```bash
# AWS S3 storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_bucket
```

## 🧪 Testing Your Setup

### 1. Knowledge Extraction Test
```bash
# Test with sample content
python quickstart_extraction.py --demo

# Expected output: JSON knowledge graph
```

### 2. Agent Interaction Test
```bash
# Test conversational capabilities
python quickstart_agent.py --demo

# Expected: Interactive text conversation
```

### 3. API Server Test
```bash
# Start the backend
cd backend && python app.py

# In another terminal, test the API
curl http://localhost:5000/api/health

# Expected: {"status": "healthy"}
```

## 🚨 Troubleshooting

### Common Issues

#### ImportError: Module not found
```bash
# Make sure you're in the right directory and virtual environment is activated
cd brdge-v1
source venv/bin/activate  # or venv\Scripts\activate
pip install -r backend/requirements.txt
```

#### API Key Error
```bash
# Check your .env file exists and has the right keys
ls backend/.env
cat backend/.env | grep API_KEY
```

#### Permission Denied
```bash
# On macOS/Linux, you might need:
chmod +x quickstart_extraction.py
chmod +x quickstart_agent.py
```

#### Port Already in Use
```bash
# Kill existing processes
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Getting Help

1. **Check the logs** - Most errors are displayed in terminal output
2. **Verify API keys** - Ensure all required keys are properly set
3. **Check file paths** - Make sure input files exist and are readable
4. **Review requirements** - Ensure all dependencies are installed

## 📊 Performance Tips

### For Large Files
- **Video files:** Keep under 100MB for faster processing
- **Documents:** PDFs under 50MB work best
- **Memory:** Increase if processing very large content

### For Production
- Use PostgreSQL instead of SQLite
- Set up proper logging configuration
- Configure rate limiting for API calls
- Use cloud storage for file uploads

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different API keys** for development/production
3. **Rotate API keys** regularly
4. **Set up proper database permissions**
5. **Use HTTPS** in production
6. **Implement rate limiting** for public APIs

## 📈 Scaling Considerations

### For Higher Throughput
- Use multiple LiveKit instances
- Implement Redis for session storage
- Set up load balancing
- Use cloud storage (S3, GCS)

### For Multiple Environments
- Separate `.env` files for dev/staging/prod
- Use container orchestration (Docker, Kubernetes)
- Implement proper monitoring and logging

## 🎯 Next Steps

After successful setup:

1. **Explore the quickstarts** to understand core capabilities
2. **Try with your own content** (videos, documents)
3. **Customize the knowledge extraction** for your domain
4. **Build custom applications** using the extracted knowledge
5. **Deploy to production** with proper infrastructure

## 💡 Use Case Examples

### Content Type Reference

The system supports four content types, each optimized for different extraction focuses:

- **`course`** (default): Educational content - extracts concepts, definitions, frameworks, learning objectives
- **`vsl`**: Video Sales Letters - extracts product features, benefits, USPs, pricing, calls-to-action  
- **`webinar`**: Presentation/discussion content - extracts key points, audience questions, qualification insights
- **`onboarding`**: User training - extracts procedural steps, UI elements, troubleshooting, task sequences

**Using `--instructions`**: Add specific guidance for what to focus on during extraction. This gets passed as `additional_instructions` to fine-tune the multipass analysis for your domain or use case.

### Financial Analysis (Educational Content)
```bash
# Analyze earnings calls or financial training content
python quickstart_extraction.py \
  --video earnings_call_q3.mp4 \
  --document 10k_filing.pdf \
  --type course \
  --instructions "Focus on forward guidance, risk factors, financial metrics, and key insights for investment analysis"
```

### Research Paper Analysis
```bash
# Process conference presentations or research content
python quickstart_extraction.py \
  --video conference_talk.mp4 \
  --document research_paper.pdf \
  --type course \
  --instructions "Extract methodology, key findings, limitations, and practical applications"
```

### Sales/Marketing Content
```bash
# Analyze video sales letters or product demonstrations
python quickstart_extraction.py \
  --video product_demo.mp4 \
  --document sales_materials.pdf \
  --type vsl \
  --instructions "Focus on value propositions and competitive advantages"
```

### Webinar Content
```bash
# Process webinar recordings for lead qualification insights
python quickstart_extraction.py \
  --video webinar_recording.mp4 \
  --document presentation_slides.pdf \
  --type webinar \
  --instructions "Extract key discussion points and audience engagement strategies"
```

### User Onboarding
```bash
# Create onboarding knowledge from training materials
python quickstart_extraction.py \
  --video software_demo.mp4 \
  --document user_manual.pdf \
  --type onboarding \
  --instructions "Focus on step-by-step processes and common user issues"
```

---

**Questions?** Check the main README.md or create an issue on GitHub. 