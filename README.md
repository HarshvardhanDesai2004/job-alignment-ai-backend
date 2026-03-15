# Job Alignment AI — Backend

An intelligent ATS (Applicant Tracking System) backend that analyzes resumes against job descriptions using a hybrid scoring engine powered by **Gemini AI**, **semantic embeddings**, and **fuzzy matching**.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Scoring System](#scoring-system)
- [AI Services](#ai-services)
- [Known Limitations](#known-limitations)

---

## Overview

This backend powers a resume-to-job-description matching platform. It:

- Parses uploaded resumes (PDF / DOCX) using Gemini AI with a regex fallback
- Parses job descriptions and extracts structured data (skills, experience, education, etc.)
- Runs a hybrid ATS scoring pipeline — exact match + fuzzy match + semantic similarity
- Generates AI-powered resume improvement suggestions and cover letters
- Stores all analysis history per user

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (Express 5) |
| Database | MongoDB (Mongoose 8) |
| AI Scoring | Google Gemini 2.5 Flash (`@google/genai`) |
| Semantic AI | FastAPI + `sentence-transformers` (`all-MiniLM-L6-v2`) |
| Fuzzy Matching | `string-similarity` |
| File Parsing | `pdf-parse`, `mammoth` |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Email | Resend |
| File Upload | Multer (5MB limit, PDF/DOCX only) |

---

## Project Structure

```
backend/
├── server.js                        # Entry point — MongoDB connect + server start
├── .env                             # Environment variables (never commit)
├── .gitignore
├── package.json
│
├── ai-service/                      # Python FastAPI semantic engine
│   └── app.py                       # /semantic-skill-match + /generate-embeddings
│
├── uploads/                         # Uploaded resume files (auto-created)
│
└── src/
    ├── app.js                       # Express app setup, routes, CORS, rate limiting
    │
    ├── controllers/
    │   ├── analysisController.js    # POST /analyze, GET /history, GET /:id
    │   ├── resumeController.js      # Upload, fetch, delete resumes
    │   ├── jobController.js         # Create, fetch, delete job descriptions
    │   ├── authController.js        # Register, login, forgot/reset password
    │   ├── aiSuggestion.controller.js  # Generate AI resume suggestions
    │   ├── coverLetter.controller.js   # Generate cover letters
    │   ├── dashboardController.js   # Recent activity feed
    │   └── statsController.js       # User stats (uploads, analyses, AI suggestions)
    │
    ├── middlewares/
    │   ├── authMiddleware.js        # JWT protect + role-based authorization
    │   ├── errorMiddleware.js       # Global error handler
    │   └── uploadMiddleware.js      # Multer config (5MB, PDF/DOCX only)
    │
    ├── models/
    │   ├── User.js                  # name, email, password, role, resetToken
    │   ├── Resume.js                # skills, experience, projects, embeddings
    │   ├── JobDescription.js        # extractedSkills, preferredSkills, responsibilities
    │   └── Analysis.js              # scores, matchedSkills, missingSkills, source
    │
    ├── routes/
    │   ├── authRoutes.js            # /api/auth
    │   ├── resumeRoutes.js          # /api/resumes
    │   ├── jobRoutes.js             # /api/jobs
    │   ├── analysisRoutes.js        # /api/analysis
    │   ├── aiSuggestion.routes.js   # /api/ai
    │   ├── coverLetter.routes.js    # /api/cover-letter
    │   ├── statsRoutes.js           # /api/stats
    │   ├── dashboardRoutes.js       # /api/dashboard
    │   └── userRoutes.js            # /api/users
    │
    ├── services/
    │   ├── geminiParser.service.js       # Resume + JD parsing via Gemini
    │   ├── matchService.js               # Hybrid skill matching pipeline
    │   ├── semanticAI.service.js         # Bridge to FastAPI semantic engine
    │   ├── advancedScoring.service.js    # Experience, education, title, quality scores
    │   ├── aiCalculatedScore.service.js  # Gemini ATS fallback scorer
    │   ├── aiSuggestion.service.js       # Gemini resume improvement suggestions
    │   ├── coverLetter.service.js        # Gemini cover letter generator
    │   ├── skillNormalizer.service.js    # Skill alias normalization (300+ mappings)
    │   └── emailService.js              # Password reset emails via Resend
    │   └── skillExtractor.js        # Regex-based skill/education/experience extractor
    └── utils/
        ├── ApiError.js              # Custom error class with statusCode
        ├── fileParser.js            # PDF + DOCX text extraction
        
```

---

## Features

- **Resume Parsing** — Gemini AI extracts skills, experience, education, projects, and job title. Falls back to regex if Gemini fails.
- **JD Parsing** — Extracts required skills, preferred skills, responsibilities, experience, education, domain, employment type, and work mode.
- **Hybrid ATS Scoring** — Three-stage skill matching: exact → fuzzy (string similarity > 0.55) → semantic (cosine similarity via `all-MiniLM-L6-v2`).
- **Advanced Scoring** — Separate scores for experience, project relevance, title similarity, education level, and resume quality.
- **Gemini Fallback Scorer** — If system score ≤ 10, Gemini recalculates all scores independently.
- **AI Suggestions** — Actionable resume improvement recommendations across 6 categories.
- **Cover Letter Generator** — Tailored cover letters based on resume + JD content.
- **Auth** — JWT-based auth with 7-day tokens, forgot password, and secure reset flow via email.
- **Rate Limiting** — AI endpoints limited to 20 requests per 15 minutes per IP.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- Python >= 3.9 (for the semantic AI service)
- A Gemini API key (Google AI Studio)
- A Resend API key (for password reset emails)

### 1. Clone and install

```bash
git clone https://github.com/your-username/job-alignment-ai-backend.git
cd job-alignment-ai-backend
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Fill in all values — see Environment Variables section below
```

### 3. Start the Python semantic AI service

```bash
cd ai-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install fastapi uvicorn sentence-transformers numpy torch
uvicorn app:app --host 127.0.0.1 --port 8001 --reload
```

Verify it's running:
```bash
curl http://127.0.0.1:8001/health
# { "status": "ok", "message": "Semantic AI service running" }
```

### 4. Start the backend

```bash
npm run dev
# Server running on port 5000
# MongoDB connected
```

---

## Environment Variables

Create a `.env` file in the `backend/` root:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/job-alignment

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Resend (email service)
RESEND_API_KEY=your_resend_api_key_here

# Frontend URL (for CORS + password reset links)
FRONTEND_URL=http://localhost:3000

# Python Semantic AI Service
SEMANTIC_AI_URL=http://127.0.0.1:8001
```

> Never commit `.env` to version control. It is already in `.gitignore`.

---

## API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login and receive JWT |
| POST | `/forgot-password` | No | Send password reset email |
| POST | `/reset-password/:token` | No | Reset password with token |

### Resumes — `/api/resumes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/upload` | Yes | Upload PDF/DOCX resume (multipart/form-data, field: `resume`) |
| GET | `/` | Yes | Get all resumes for current user |
| GET | `/:id` | Yes | Get a single resume by ID |
| DELETE | `/:id` | Yes | Delete a resume |

### Job Descriptions — `/api/jobs`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Create a job description (body: `{ text }`) |
| GET | `/` | Yes | Get all JDs for current user |
| GET | `/:id` | Yes | Get a single JD by ID |
| DELETE | `/:id` | Yes | Delete a JD |

### Analysis — `/api/analysis`

| Method | Endpoint | Auth | Rate Limited | Description |
|---|---|---|---|---|
| POST | `/analyze` | Yes | Yes | Run ATS analysis (body: `{ resumeId, jdId }`) |
| GET | `/history` | Yes | No | Get all analyses for current user |
| GET | `/:id` | Yes | No | Get a single analysis by ID |

### AI Features — `/api/ai` and `/api/cover-letter`

| Method | Endpoint | Auth | Rate Limited | Description |
|---|---|---|---|---|
| POST | `/ai/generate` | Yes | Yes | Generate resume suggestions (body: `{ resumeId, jdId }`) |
| POST | `/cover-letter/generate` | Yes | Yes | Generate cover letter (body: `{ resumeId, jdId }`) |

### Stats & Dashboard — `/api/stats`, `/api/dashboard`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/stats` | Yes | Get user stats (uploads, analyses, AI suggestions) |
| GET | `/dashboard/activity` | Yes | Get recent activity feed (last 5 items) |

---

## Scoring System

Every analysis produces 7 scores, each out of 100:

| Score | Weight | Description |
|---|---|---|
| `hybridSkillScore` | 35% | Exact + fuzzy + semantic skill match |
| `experienceScore` | 20% | Resume years vs JD required years |
| `projectRelevanceScore` | 15% | Project tech stack vs JD skills (semantic) |
| `titleSimilarityScore` | 10% | Resume job title vs JD required title (semantic) |
| `educationScore` | 10% | Education level hierarchy match |
| `resumeQualityScore` | 10% | Length, skills count, projects, action verbs |
| **`finalScore`** | — | Weighted sum of all above |

**Hybrid skill matching pipeline:**

```
1. Exact match    → skill in resume Set exactly matches JD skill
2. Fuzzy match    → string-similarity rating > 0.55
3. Semantic match → cosine similarity via all-MiniLM-L6-v2 FastAPI service
Final = (exactScore + fuzzyScore) * 0.6 + semanticScore * 0.4
```

**Fallback:** If `systemFinalScore <= 10` (insufficient data), Gemini recalculates all scores independently and its results are used instead.

---

## AI Services

### Gemini Parser (`geminiParser.service.js`)

Used for both resume and JD parsing. Sends structured prompts to `gemini-2.5-flash` and returns clean JSON. Has `safeJSONParse` with auto-repair for minor JSON formatting issues. Retries up to 2 times on failure.

### Semantic AI Service (`ai-service/app.py`)

A FastAPI microservice running locally on port 8001. Uses `sentence-transformers` with the `all-MiniLM-L6-v2` model to:

- **`POST /semantic-skill-match`** — Takes resume skills + JD skills, returns a semantic match score (0–100) and a list of semantically missing skills.
- **`POST /generate-embeddings`** — Generates a single embedding vector for a text string. Used to store resume embeddings for faster future matching.

Supports GPU (`cuda`) automatically if available, falls back to CPU.

### Skill Normalizer (`skillNormalizer.service.js`)

Maps 300+ skill aliases to canonical forms before any comparison:

```
"reactjs" → "react"
"nodejs"  → "node.js"
"k8s"     → "kubernetes"
"mba"     → "business administration"
"p&l"     → "p&l management"
```

Covers: tech, business, finance, HR, healthcare, legal, engineering, marketing, education, and more.

---

## Known Limitations

- The semantic AI service must be running locally for full scoring — if it is down, the system falls back to keyword-only matching (no semantic score).
- Resume files are stored on disk in `uploads/`. For production, use cloud storage (S3, Cloudinary) instead.
- Gemini API has token limits — resumes and JDs are truncated to 6000 and 8000 characters respectively before being sent.
- Rate limiting (20 req / 15 min) applies per IP, not per user — shared IPs (offices, universities) may hit limits faster.
