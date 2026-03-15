# Job Alignment AI — API Documentation

**Base URL:** `http://localhost:5000`  
**API Prefix:** `/api`  
**Content-Type:** `application/json` (all requests and responses)  
**Authentication:** Bearer Token (JWT) — include in header for all protected routes

```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Resumes](#2-resumes)
3. [Job Descriptions](#3-job-descriptions)
4. [Analysis](#4-analysis)
5. [AI Suggestions](#5-ai-suggestions)
6. [Cover Letter](#6-cover-letter)
7. [Stats](#7-stats)
8. [Dashboard](#8-dashboard)
9. [User Profile](#9-user-profile)
10. [Health Check](#10-health-check)
11. [Error Reference](#11-error-reference)
12. [Rate Limiting](#12-rate-limiting)

---

## 1. Authentication

Base path: `/api/auth`  
All auth routes are **public** (no token required).

---

### 1.1 Register

**POST** `/api/auth/register`

Creates a new user account and returns a JWT token.

**Request Body**

```json
{
  "name": "Rahul Desai",
  "email": "rahul@example.com",
  "password": "password123"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | Yes | Non-empty |
| `email` | string | Yes | Valid email, must be unique |
| `password` | string | Yes | Min 6 characters |

**Success Response — 201 Created**

```json
{
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Rahul Desai",
    "email": "rahul@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 400 | `"User already exists"` | Email already registered |
| 500 | `"Server error"` | Internal error |

---

### 1.2 Login

**POST** `/api/auth/login`

Authenticates an existing user and returns a JWT token.

**Request Body**

```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

| Field | Type | Required |
|---|---|---|
| `email` | string | Yes |
| `password` | string | Yes |

**Success Response — 200 OK**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Rahul Desai",
    "email": "rahul@example.com"
  }
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 401 | `"Invalid credentials"` | Email not found or wrong password |
| 500 | `"Login failed"` | Internal error |

---

### 1.3 Forgot Password

**POST** `/api/auth/forgot-password`

Sends a password reset link to the user's registered email address. Link expires in 10 minutes.

**Request Body**

```json
{
  "email": "rahul@example.com"
}
```

**Success Response — 200 OK**

```json
{
  "message": "Password reset email sent"
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 404 | `"User not found"` | Email not registered |
| 500 | `"Failed to send reset email"` | Email service error |

---

### 1.4 Reset Password

**POST** `/api/auth/reset-password/:token`

Resets the user's password using the token received via email.

**URL Parameter**

| Parameter | Type | Description |
|---|---|---|
| `token` | string | Reset token from the email link |

**Request Body**

```json
{
  "password": "newpassword456"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `password` | string | Yes | Min 6 characters |

**Success Response — 200 OK**

```json
{
  "message": "Password reset successful"
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 400 | `"Invalid or expired token"` | Token not found or expired (>10 min) |
| 500 | `"Password reset failed"` | Internal error |

---

## 2. Resumes

Base path: `/api/resumes`  
All routes are **protected** — requires Bearer token.

---

### 2.1 Upload Resume

**POST** `/api/resumes/upload`

Uploads a resume file (PDF or DOCX). Parses it using Gemini AI (fallback: regex) and extracts skills, experience, projects, education, and embeddings. File size limit: **5MB**.

**Request**

```
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|---|---|---|---|
| `resume` | file | Yes | PDF or DOCX only, max 5MB |

**Success Response — 201 Created**

```json
{
  "message": "Resume uploaded and parsed successfully",
  "resumeId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "skills": ["React", "Node.js", "MongoDB", "Python"],
  "educationKeywords": ["bachelor", "computer science"],
  "highestEducation": "bachelor",
  "experience": [
    {
      "company": "Tech Corp",
      "role": "Software Engineer",
      "duration": "2021 - 2023"
    }
  ],
  "totalExperience": 2,
  "jobTitle": "full stack developer",
  "projects": [
    {
      "name": "E-Commerce Platform",
      "tech": ["React", "Node.js", "MongoDB"]
    }
  ]
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 400 | `"No file uploaded"` | No file in request |
| 400 | `"Could not extract text from resume"` | File too short or unreadable |
| 401 | `"Not authorized, no token"` | Missing auth token |
| 500 | `"Resume processing failed"` | Parsing or DB error |

> **Note:** Uploaded file is automatically deleted from disk if processing fails.

---

### 2.2 Get All Resumes

**GET** `/api/resumes`

Returns all resumes uploaded by the current user, sorted by newest first.

**Success Response — 200 OK**

```json
{
  "success": true,
  "count": 2,
  "resumes": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "originalFileName": "rahul_resume.pdf",
      "skills": ["React", "Node.js", "MongoDB"],
      "jobTitle": "full stack developer",
      "totalExperience": 2,
      "highestEducation": "bachelor",
      "createdAt": "2024-08-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2.3 Get Resume by ID

**GET** `/api/resumes/:id`

Returns a single resume with all parsed data.

**URL Parameter**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | MongoDB ObjectId of the resume |

**Success Response — 200 OK**

```json
{
  "success": true,
  "resume": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "originalFileName": "rahul_resume.pdf",
    "extractedText": "Rahul Desai...",
    "skills": ["React", "Node.js", "MongoDB", "Python"],
    "educationKeywords": ["bachelor", "computer science"],
    "highestEducation": "bachelor",
    "experience": [
      {
        "company": "Tech Corp",
        "role": "Software Engineer",
        "duration": "2021 - 2023"
      }
    ],
    "totalExperience": 2,
    "jobTitle": "full stack developer",
    "projects": [
      {
        "name": "E-Commerce Platform",
        "tech": ["React", "Node.js"]
      }
    ],
    "embeddings": [0.023, -0.145, ...],
    "createdAt": "2024-08-15T10:30:00.000Z"
  }
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 404 | `"Resume not found"` | ID doesn't exist |
| 500 | `"Failed to fetch resume"` | Internal error |

---

### 2.4 Delete Resume

**DELETE** `/api/resumes/:id`

Permanently deletes a resume from the database.

**URL Parameter**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | MongoDB ObjectId of the resume |

**Success Response — 200 OK**

```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 404 | `"Resume not found"` | ID doesn't exist |
| 500 | `"Failed to delete resume"` | Internal error |

---

## 3. Job Descriptions

Base path: `/api/jobs`  
All routes are **protected** — requires Bearer token.

---

### 3.1 Create Job Description

**POST** `/api/jobs`

Saves a job description and parses it using Gemini AI (fallback: regex) to extract skills, responsibilities, experience, and education requirements.

**Request Body**

```json
{
  "text": "We are looking for a Senior Backend Engineer with 3+ years of experience in Node.js, Express.js, and MongoDB. The ideal candidate must have strong knowledge of REST APIs, Docker, and AWS. Experience with Redis and Kubernetes is preferred..."
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `text` | string | Yes | Min 20 characters |

**Success Response — 201 Created**

```json
{
  "message": "Job description saved",
  "jdId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "extractedSkills": ["Node.js", "Express.js", "MongoDB", "REST API", "Docker", "AWS"],
  "requiredExperience": 3,
  "requiredEducation": "Bachelor's Degree",
  "requiredTitle": "Backend Engineer"
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 400 | `"Job description text too short"` | Text under 20 characters |
| 401 | `"User not found in request"` | Auth issue |
| 500 | `"Failed to save job description"` | Parsing or DB error |

---

### 3.2 Get All Job Descriptions

**GET** `/api/jobs`

Returns all job descriptions created by the current user.

**Success Response — 200 OK**

```json
{
  "success": true,
  "count": 3,
  "jobs": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "jobTitle": "Senior Backend Engineer",
      "extractedSkills": ["Node.js", "Express.js", "MongoDB"],
      "preferredSkills": ["Redis", "Kubernetes"],
      "requiredExperience": 3,
      "requiredEducation": "Bachelor's Degree",
      "requiredTitle": "Backend Engineer",
      "responsibilities": [
        "Design and maintain RESTful APIs",
        "Optimize database queries and performance"
      ],
      "createdAt": "2024-08-15T11:00:00.000Z"
    }
  ]
}
```

---

### 3.3 Get Job Description by ID

**GET** `/api/jobs/:id`

Returns a single job description with all parsed data.

**URL Parameter**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | MongoDB ObjectId of the job description |

**Success Response — 200 OK**

```json
{
  "success": true,
  "job": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "text": "We are looking for a Senior Backend Engineer...",
    "jobTitle": "Senior Backend Engineer",
    "extractedSkills": ["Node.js", "Express.js", "MongoDB", "REST API", "Docker", "AWS"],
    "preferredSkills": ["Redis", "Kubernetes"],
    "responsibilities": [
      "Design and maintain RESTful APIs",
      "Lead code reviews for backend team"
    ],
    "requiredExperience": 3,
    "requiredEducation": "Bachelor's Degree",
    "requiredTitle": "Backend Engineer",
    "domain": "SaaS",
    "employmentType": "Full-Time",
    "workMode": "Hybrid",
    "createdAt": "2024-08-15T11:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 404 | `"Job not found"` | ID doesn't exist |
| 500 | `"Failed to fetch job"` | Internal error |

---

### 3.4 Delete Job Description

**DELETE** `/api/jobs/:id`

Permanently deletes a job description.

**URL Parameter**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | MongoDB ObjectId of the job description |

**Success Response — 200 OK**

```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 404 | `"Job not found"` | ID doesn't exist |
| 500 | `"Failed to delete job"` | Internal error |

---

## 4. Analysis

Base path: `/api/analysis`  
All routes are **protected** — requires Bearer token.  
`POST /analyze` is **rate limited** — 20 requests per 15 minutes per IP.

---

### 4.1 Run Analysis

**POST** `/api/analysis/analyze`

Runs the full ATS analysis pipeline comparing a resume against a job description. Returns matched skills, missing skills, and 7 individual scores.

**Request Body**

```json
{
  "resumeId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "jdId": "64f1a2b3c4d5e6f7a8b9c0d3"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `resumeId` | string | Yes | MongoDB ObjectId of an uploaded resume |
| `jdId` | string | Yes | MongoDB ObjectId of a saved job description |

**How the scoring pipeline works**

```
1. Normalize skills from both resume and JD
2. Exact match  → skills that appear in both sets
3. Fuzzy match  → string similarity > 0.55 on remaining JD skills
4. Semantic match → cosine similarity via FastAPI (all-MiniLM-L6-v2)
5. Hybrid skill score = (exactScore + fuzzyScore) * 0.6 + semanticScore * 0.4
6. Experience score   = ratio of resume years vs JD required years
7. Project relevance  = semantic similarity of project tech vs JD skills
8. Title similarity   = semantic similarity of resume title vs JD title
9. Education score    = hierarchy-based (PhD > Masters > Bachelors > Diploma)
10. Quality score     = text length + skill count + projects + action verbs
11. Final score       = weighted sum of all 6 scores
12. If final score <= 10, Gemini recalculates all scores as fallback
```

**Success Response — 200 OK**

```json
{
  "success": true,
  "analysis": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "resumeId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "jdId": "64f1a2b3c4d5e6f7a8b9c0d3",
    "matchedSkills": ["Node.js", "Express.js", "MongoDB", "REST API"],
    "missingSkills": ["Docker", "AWS", "Kubernetes"],
    "hybridSkillScore": 72,
    "experienceScore": 85,
    "projectRelevanceScore": 68,
    "titleSimilarityScore": 90,
    "educationScore": 100,
    "resumeQualityScore": 80,
    "finalScore": 79,
    "source": "system",
    "createdAt": "2024-08-15T12:00:00.000Z"
  }
}
```

**Score Weights**

| Score Field | Weight | Description |
|---|---|---|
| `hybridSkillScore` | 35% | Skill match quality |
| `experienceScore` | 20% | Years of experience match |
| `projectRelevanceScore` | 15% | Project tech vs JD skills |
| `titleSimilarityScore` | 10% | Job title alignment |
| `educationScore` | 10% | Education level hierarchy |
| `resumeQualityScore` | 10% | Resume completeness and formatting |

**`source` field values**

| Value | Meaning |
|---|---|
| `"system"` | All scores calculated by the local hybrid pipeline |
| `"gemini"` | Gemini AI recalculated scores (fallback when system score ≤ 10) |

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 404 | `"Resume or JD not found"` | Invalid ID(s) |
| 429 | `"Too many requests, please try again later"` | Rate limit exceeded |
| 500 | `"Analysis failed"` | Pipeline error |

---

### 4.2 Get Analysis History

**GET** `/api/analysis/history`

Returns all analyses run by the current user, sorted newest first. Populates resume and JD details.

**Success Response — 200 OK**

```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "resumeId": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "originalFileName": "rahul_resume.pdf",
      "jobTitle": "full stack developer"
    },
    "jdId": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "jobTitle": "Senior Backend Engineer"
    },
    "matchedSkills": ["Node.js", "MongoDB"],
    "missingSkills": ["Docker", "AWS"],
    "finalScore": 79,
    "source": "system",
    "createdAt": "2024-08-15T12:00:00.000Z"
  }
]
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 401 | `"Not authorized"` | Missing or invalid token |
| 500 | `"Failed to fetch analysis history"` | Internal error |

---

### 4.3 Get Analysis by ID

**GET** `/api/analysis/:id`

Returns a single analysis with fully populated resume and JD data.

**URL Parameter**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | MongoDB ObjectId of the analysis |

**Success Response — 200 OK**

```json
{
  "success": true,
  "analysis": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "resumeId": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "originalFileName": "rahul_resume.pdf",
      "skills": ["React", "Node.js", "MongoDB"],
      "jobTitle": "full stack developer",
      "totalExperience": 2
    },
    "jdId": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "jobTitle": "Senior Backend Engineer",
      "extractedSkills": ["Node.js", "Express.js", "MongoDB", "Docker", "AWS"],
      "requiredExperience": 3
    },
    "matchedSkills": ["Node.js", "Express.js", "MongoDB", "REST API"],
    "missingSkills": ["Docker", "AWS"],
    "hybridSkillScore": 72,
    "experienceScore": 85,
    "projectRelevanceScore": 68,
    "titleSimilarityScore": 90,
    "educationScore": 100,
    "resumeQualityScore": 80,
    "finalScore": 79,
    "source": "system",
    "aiSuggestionsCount": 1,
    "createdAt": "2024-08-15T12:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 404 | `"Analysis not found"` | ID doesn't exist |
| 500 | `"Failed to fetch analysis"` | Internal error |

---

## 5. AI Suggestions

Base path: `/api/ai`  
**Protected** — requires Bearer token.  
**Rate limited** — 20 requests per 15 minutes per IP.

---

### 5.1 Generate AI Suggestions

**POST** `/api/ai/generate`

Generates actionable resume improvement suggestions by comparing the resume against the job description using Gemini AI. Requires an existing analysis to be run first. Increments `aiSuggestionsCount` on the analysis record.

**Request Body**

```json
{
  "resumeId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "jdId": "64f1a2b3c4d5e6f7a8b9c0d3"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `resumeId` | string | Yes | Must have an existing analysis for this resume + JD pair |
| `jdId` | string | Yes | Must have an existing analysis for this resume + JD pair |

**Success Response — 200 OK**

```json
{
  "success": true,
  "suggestions": {
    "skillsToAdd": [
      "Add Docker containerization skills to your profile",
      "Learn AWS core services — EC2, S3, Lambda are most in demand"
    ],
    "experienceImprovements": [
      "Quantify your achievements — add metrics like response time improvements or user growth",
      "Clarify your leadership experience in the Tech Corp role"
    ],
    "keywordsToInclude": [
      "Microservices",
      "CI/CD",
      "RESTful API design"
    ],
    "formattingSuggestions": [
      "Use consistent bullet points across all experience sections",
      "Move skills section above education for engineering roles"
    ],
    "summaryRewrite": [
      "Make the professional summary more concise — aim for 2-3 sentences focused on backend impact"
    ],
    "achievementSuggestions": [
      "Add a measurable metric to the E-Commerce Platform project (e.g. reduced load time by 40%)",
      "Mention team size managed or number of APIs built"
    ]
  }
}
```

**Suggestion Categories**

| Category | Description |
|---|---|
| `skillsToAdd` | Missing skills from the JD that should be added to the resume |
| `experienceImprovements` | How to better describe work experience |
| `keywordsToInclude` | ATS keywords found in JD but missing from resume |
| `formattingSuggestions` | Structural and visual improvements |
| `summaryRewrite` | How to improve the professional summary |
| `achievementSuggestions` | How to quantify and strengthen accomplishments |

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 404 | `"Resume, Job Description, or Analysis not found"` | No existing analysis for this pair |
| 429 | `"Too many requests, please try again later"` | Rate limit exceeded |
| 500 | `"Failed to generate AI suggestions"` | Gemini error |

---

## 6. Cover Letter

Base path: `/api/cover-letter`  
**Protected** — requires Bearer token.  
**Rate limited** — 20 requests per 15 minutes per IP.

---

### 6.1 Generate Cover Letter

**POST** `/api/cover-letter/generate`

Generates a tailored, professional cover letter based on the candidate's resume and the job description using Gemini AI.

**Request Body**

```json
{
  "resumeId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "jdId": "64f1a2b3c4d5e6f7a8b9c0d3"
}
```

| Field | Type | Required |
|---|---|---|
| `resumeId` | string | Yes |
| `jdId` | string | Yes |

**Success Response — 200 OK**

```json
{
  "success": true,
  "coverLetter": "Rahul Desai\nrahul@example.com\n\nDear Hiring Manager,\n\nI am writing to express my interest in the Senior Backend Engineer position at your company. With 2 years of professional experience building scalable Node.js applications and a strong foundation in MongoDB and REST API design, I am confident in my ability to contribute effectively to your team.\n\nIn my most recent role at Tech Corp, I designed and maintained RESTful APIs serving over 10,000 daily active users, optimized database query performance by 35%, and collaborated closely with frontend teams to deliver full-stack features. My project experience with React and Node.js aligns directly with your technology stack.\n\nI am particularly excited about the opportunity to work on your SaaS platform and grow my skills in containerization and cloud infrastructure — areas I am actively developing.\n\nThank you for considering my application. I would welcome the opportunity to discuss how my background aligns with your team's goals.\n\nSincerely,\nRahul Desai"
}
```

> The cover letter is returned as a plain string (150–250 words), structured with an introduction, relevant experience and skills, and a closing paragraph.

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 404 | `"Resume or Job Description not found"` | Invalid ID(s) |
| 429 | `"Too many requests, please try again later"` | Rate limit exceeded |
| 500 | `"Failed to generate cover letter"` | Gemini error |

---

## 7. Stats

Base path: `/api/stats`  
**Protected** — requires Bearer token.

---

### 7.1 Get User Stats

**GET** `/api/stats`

Returns dashboard statistics for the current user.

**Success Response — 200 OK**

```json
{
  "resumesUploaded": 4,
  "jobDescriptions": 7,
  "analysisCompleted": 12,
  "aiSuggestionsGenerated": 5
}
```

**Response Fields**

| Field | Description |
|---|---|
| `resumesUploaded` | Total resumes uploaded by this user |
| `jobDescriptions` | Total job descriptions created by this user |
| `analysisCompleted` | Total analyses run by this user |
| `aiSuggestionsGenerated` | Total AI suggestion sessions across all analyses |

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 401 | `"Not authorized"` | Missing or invalid token |
| 500 | `"Failed to fetch stats"` | Internal error |

---

## 8. Dashboard

Base path: `/api/dashboard`  
**Protected** — requires Bearer token.

---

### 8.1 Get Recent Activity

**GET** `/api/dashboard/activity`

Returns the 5 most recent activities across resumes, job descriptions, and analyses for the current user.

**Success Response — 200 OK**

```json
[
  {
    "type": "analysis",
    "title": "Analysis completed (Score: 79%)",
    "date": "2024-08-15T12:00:00.000Z"
  },
  {
    "type": "job",
    "title": "Job description added",
    "date": "2024-08-15T11:00:00.000Z"
  },
  {
    "type": "resume",
    "title": "Resume uploaded: rahul_resume.pdf",
    "date": "2024-08-15T10:30:00.000Z"
  }
]
```

**`type` field values**

| Value | Description |
|---|---|
| `"resume"` | A resume was uploaded |
| `"job"` | A job description was added |
| `"analysis"` | An analysis was completed |

**Error Responses**

| Status | Message | Reason |
|---|---|---|
| 500 | `"Failed to fetch activity"` | Internal error |

---

## 9. User Profile

Base path: `/api/users`  
**Protected** — requires Bearer token.

---

### 9.1 Get Profile

**GET** `/api/users/profile`

Returns the authenticated user's profile data.

**Success Response — 200 OK**

```json
{
  "message": "Protected route accessed successfully",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Rahul Desai",
    "email": "rahul@example.com",
    "role": "user",
    "createdAt": "2024-08-10T09:00:00.000Z"
  }
}
```

---

## 10. Health Check

**GET** `/health`

Checks whether the backend server is running. No auth required.

**Success Response — 200 OK**

```json
{
  "status": "OK",
  "message": "Backend is running 🚀"
}
```

---

## 11. Error Reference

All error responses follow this structure:

```json
{
  "message": "Human-readable error description"
}
```

Or for the global error handler:

```json
{
  "success": false,
  "message": "Error description"
}
```

**HTTP Status Codes Used**

| Code | Meaning | When Used |
|---|---|---|
| `200` | OK | Successful GET / DELETE / POST (non-create) |
| `201` | Created | Successful resource creation |
| `400` | Bad Request | Invalid input, missing fields, validation failure |
| `401` | Unauthorized | Missing token, invalid token, wrong credentials |
| `403` | Forbidden | Valid token but insufficient role/permissions |
| `404` | Not Found | Resource ID doesn't exist |
| `429` | Too Many Requests | Rate limit exceeded on AI endpoints |
| `500` | Internal Server Error | Unexpected server-side failure |

---

## 12. Rate Limiting

The following endpoints are rate limited to **20 requests per 15 minutes per IP address**:

| Route Prefix | Affected Endpoints |
|---|---|
| `/api/analysis` | `POST /analyze` |
| `/api/ai` | `POST /generate` |
| `/api/cover-letter` | `POST /generate` |

**Rate limit exceeded response — 429**

```json
{
  "message": "Too many requests, please try again later"
}
```

> Rate limiting is applied per IP address, not per user. Shared IPs (office networks, university Wi-Fi) share the same quota across all users on that IP.

---

## Quick Reference

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | No | Register |
| POST | `/api/auth/login` | No | No | Login |
| POST | `/api/auth/forgot-password` | No | No | Request reset email |
| POST | `/api/auth/reset-password/:token` | No | No | Reset password |
| POST | `/api/resumes/upload` | Yes | No | Upload resume |
| GET | `/api/resumes` | Yes | No | Get all resumes |
| GET | `/api/resumes/:id` | Yes | No | Get resume by ID |
| DELETE | `/api/resumes/:id` | Yes | No | Delete resume |
| POST | `/api/jobs` | Yes | No | Create JD |
| GET | `/api/jobs` | Yes | No | Get all JDs |
| GET | `/api/jobs/:id` | Yes | No | Get JD by ID |
| DELETE | `/api/jobs/:id` | Yes | No | Delete JD |
| POST | `/api/analysis/analyze` | Yes | **Yes** | Run analysis |
| GET | `/api/analysis/history` | Yes | No | Get all analyses |
| GET | `/api/analysis/:id` | Yes | No | Get analysis by ID |
| POST | `/api/ai/generate` | Yes | **Yes** | AI suggestions |
| POST | `/api/cover-letter/generate` | Yes | **Yes** | Generate cover letter |
| GET | `/api/stats` | Yes | No | User stats |
| GET | `/api/dashboard/activity` | Yes | No | Recent activity |
| GET | `/api/users/profile` | Yes | No | User profile |
| GET | `/health` | No | No | Health check |
