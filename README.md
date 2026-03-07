# Career Craft: AI-Powered Career Application Co-Pilot

<p align="center">
  <img src="https://img.shields.io/badge/AI-PoweredCareerAssistant-blue?style=for-the-badge&logo=ai&logoColor=white" alt="AI-Powered">
  <img src="https://img.shields.io/badge/FYP-Project-purple?style=for-the-badge" alt="FYP Project">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
</p>

---

## 📋 Introduction & Background

Many applicants reuse generic cover letters or fail to highlight relevant skills, which often leads to rejection by recruiters or Applicant Tracking Systems (ATS). In today's competitive job market, candidates must tailor their resumes and cover letters according to each job description to improve their chances of being shortlisted. However, writing personalized and professional cover letters for every job application is time-consuming and challenging, especially for students and fresh graduates who have limited industry experience.

**Career Craft** is an intelligent system that analyzes, writes, evaluates, and optimizes job applications, making it a complete AI-powered career application assistant. The system uses pre-trained AI APIs (such as OpenAI) for intelligent text generation and analysis.

---

## 🎯 Problem Statement

Job seekers face multiple challenges in the current job market:

- ❌ They submit generic cover letters that do not match job requirements
- ❌ They do not know how well their CV aligns with a specific job
- ❌ They are unaware of missing skills required by employers
- ❌ Their applications are often rejected by Applicant Tracking Systems (ATS)
- ❌ They lack guidance on how to improve their cover letters

Existing tools either generate text or provide limited keyword analysis. There is no integrated system that both generates and analyzes job applications intelligently.

---

## 💡 Proposed Solution

Career Craft solves this problem by combining AI-based generation with analytical evaluation:

- ✅ **Measures job compatibility** with a detailed match score
- ✅ **Identifies missing skills** through gap analysis
- ✅ **Suggests improvements** for CV health and optimization
- ✅ **Generates multiple optimized versions** of cover letters
- ✅ **Helps users increase their interview chances**

---

## ✨ Key Features

### Phase 1 (FYP-1): Core Features

| Feature | Description |
|---------|-------------|
| **Match Score & Gap Analysis** | Compares CV and job description, calculates Fit Score (%), and highlights strengths and missing skills |
| **Intelligent Cover Letter Generation** | Generates personalized letters in multiple styles (Technical, Achievement-focused) with downloadable formats (.docx, .pdf, text) |
| **Keyword Optimization** | Identifies important hard and soft skills and suggests their integration for ATS compatibility |
| **CV Health Check** | Evaluates CV for grammar accuracy, optimal length, use of active voice, clarity, and presence of measurable achievements |
| **User Account & History Management** | Allows users to save and manage different application versions - cover letter history |
| **Manual Job Matching** | Users can manually enter a job description for analysis |

### Phase 2 (FYP-2): Advanced Features

| Feature | Description |
|---------|-------------|
| **Automatic Job Fetching** | Fetches relevant job posts from multiple job portals based on CV skills |
| **Proactive Job Notification** | Automatically monitors multiple job platforms and sends real-time email or WhatsApp alerts when a high-fit job is detected |
| **Dynamic Career Roadmap** | Generates a personalized learning plan based on missing skills identified in gap analysis |
| **AI-Based Learning Resources** | Automatically fetches relevant YouTube courses, GitHub repositories, certifications, and documentation links |
| **Skill Progress Tracking** | Tracks skill improvement over time and shows match score growth trends |
| **Career Analytics Dashboard** | Visualizes match score growth, jobs applied count, interview probability, and skill gap reduction |

---

## 🔬 Literature Review

| System | Description | Gaps & Limitations |
|--------|-------------|-------------------|
| **ChatGPT** | Generates text based on user prompts | No match scoring; no direct resume-to-job comparison |
| **Skill Syncer** | Provides keyword matching and ATS compatibility scoring | Primarily focuses on keyword density; lacks advanced features |
| **Zety** | Provides AI-assisted writing and formatting | Focuses on document creation rather than evaluation |
| **Career Craft** | A complete co-pilot that generates, evaluates, and optimizes | Provides Fit Score (%), highlights missing skills, fetches jobs, and suggests improvements |

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js with Vite |
| **Backend** | Python FastAPI |
| **Database** | (Configurable - SQL/NoSQL) |
| **AI Services** | OpenAI GPT API |
| **Job Integration** | Job portal APIs |
| **Notifications** | Email, WhatsApp (Twilio) |

---

## 📂 Project Structure

```
careercraft-AI/
├── backend/                 # Backend API and server code
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables
│
├── frontend/               # Frontend application (UI)
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── App.css        # Component styles
│   │   ├── index.css       # Global styles
│   │   └── main.jsx       # React entry point
│   ├── index.html         # HTML template
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
│
├── public/                 # Static assets
└── README.md              # Project documentation
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js (v16+) and npm
- Python (v3.8+)
- OpenAI API Key

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt

# Create .env file (copy from .env.example)
# Configure your API keys:
# - OPENAI_API_KEY=your-openai-api-key
# - PORT=5000
# - DATABASE_URL=your-db-connection-string

python -m uvicorn main:app --reload --port 5000
```

### Running Both Services

1. Start the backend first (port 5000)
2. Start the frontend (typically port 5173)
3. Open your browser and navigate to the frontend URL

### Environment Variables

**Backend (.env):**
```env
PORT=5000
DATABASE_URL=your-db-connection-string
OPENAI_API_KEY=your-openai-api-key
FRONTEND_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000
```

---

## 📅 Project Plan

### FYP-1: AI API-Based Intelligent System Development

| Phase | Task | Duration |
|-------|------|----------|
| 1.0 | Requirement Analysis | Weeks 1-2 |
| 2.0 | System Design | Weeks 3-4 |
| 3.0 | CV & JD Processing Module | Weeks 5-7 |
| 4.0 | Basic Job Fetching Module | Week 8 |
| 5.0 | AI-Based Cover Letter Module | Weeks 9-10 |
| 6.0 | CV Health Check Module | Week 11 |
| 7.0 | Frontend Integration | Weeks 12-13 |
| 8.0 | Testing & Deployment | Week 14 |

### FYP-2: Advanced Features & Proactive System

| Phase | Task |
|-------|------|
| 1.0 | Advanced Multi-Platform Job Fetching |
| 2.0 | Proactive Fitment Notification System |
| 3.0 | Intelligent Gap-to-Roadmap Engine |
| 4.0 | AI-Based Learning Resource Fetching |
| 5.0 | Personalized Career Path Generator |
| 6.0 | Skill Progress Tracking System |
| 7.0 | Career Analytics Dashboard |
| 8.0 | Research Evaluation & Optimization |

---

## ⚠️ Constraints & Limitations

- 🤖 AI-generated content may still require manual review and editing before submission
- 📊 Keyword-based match scoring may not completely reflect human recruiter evaluation
- 🔗 Integration with job portals may be limited due to API access restrictions
- ⏱️ The system will rely on free or open-source AI APIs, which may have usage limits
- 🌐 Internet connectivity is required for accessing cloud-based AI services
- 🔒 Data privacy and security must be carefully managed
- 📈 System performance depends on the quality and structure of the uploaded CV
- ⌛ The project must be completed within the university semester timeline

---

## 🔧 Troubleshooting

### "Failed to fetch" Error

1. **Ensure backend is running:**
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 5000
   # Test: curl http://localhost:5000/health
   ```

2. **Ensure frontend points to backend:**
   - Set `VITE_API_URL=http://localhost:5000` in frontend/.env
   - Restart Vite after changing env vars

3. **Check CORS settings:**
   - Backend reads `FRONTEND_ORIGIN` (comma-separated allowed origins)
   - Example: `FRONTEND_ORIGIN=http://localhost:5173`

---

## 📄 License

This project is developed as a Final Year Project (FYP).

---

## 👥 Authors

- Final Year Project - Computer Science/Software Engineering

