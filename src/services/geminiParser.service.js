const path = require("path");
require("dotenv").config({ 
  path: path.resolve(__dirname, "../../.env") 
});

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-2.5-flash";

function buildResumePrompt(resumeText) {
  return `
You are an advanced ATS resume parser.

Extract structured information from the resume.

Return ONLY valid JSON.

JSON FORMAT:

{
"name": "",
"email": "",
"phone": "",
"job_title": "",
"total_experience_years": 0,
"skills": [],
"tools": [],
"projects": [
  {
    "name": "",
    "technologies": []
  }
],
"work_experience": [
  {
    "company": "",
    "role": "",
    "duration": ""
  }
],
"education": [],
"highest_education": "",
"certifications": [],
"languages": []
}

Rules:

1. job_title:
- If a clear job title is present, extract it.
- If not, infer a professional title from skills, projects and experience.
Examples:
Software Developer, Full Stack Developer, AI/ML Engineer, Backend Developer.

2. total_experience_years:
- Calculate from work_experience durations.
- Convert months into years.
Example:
8 months = 0.7 years
12 months = 1 year

3. skills:

Extract ALL relevant professional skills from the resume.

The resume may belong to:
- Software Engineers
- Data Scientists
- Product Managers
- Project Managers
- Business Analysts
- MBA graduates
- Management Consultants
- Marketing Professionals
- Operations Managers
- Finance Professionals

Identify both technical and functional skills depending on the resume domain.

-------------------------------------

TECHNICAL SKILLS may include:

Programming Languages:
JavaScript, Python, Java, C++, Go, Rust

Frameworks & Libraries:
React, Angular, Vue, Django, Flask, Spring, Express

Databases:
MongoDB, MySQL, PostgreSQL, Redis

Cloud & DevOps:
AWS, Azure, Google Cloud, Docker, Kubernetes, CI/CD

AI / Data Tools:
TensorFlow, PyTorch, Pandas, NumPy, Scikit-learn

Web Technologies:
HTML, CSS, REST APIs, GraphQL

Mobile Development:
Android, Kotlin, Swift, Flutter

Testing Tools:
Jest, Selenium, Cypress

Developer Tools:
Git, GitHub, VS Code, Postman

-------------------------------------

BUSINESS / FUNCTIONAL SKILLS may include:

Product Management:
Product Strategy, Roadmapping, Product Lifecycle Management, Feature Prioritization

Project Management:
Project Planning, Risk Management, Agile, Scrum, Kanban, Waterfall

Business Analysis:
Requirement Gathering, Stakeholder Management, Business Process Modeling

Consulting Skills:
Market Analysis, Competitive Analysis, Strategy Development, Business Transformation

Operations:
Process Optimization, Supply Chain Management, Operational Efficiency

Marketing:
SEO, SEM, Digital Marketing, Campaign Management, Brand Strategy

Finance:
Financial Analysis, Budgeting, Forecasting, P&L Management

Customer & Stakeholder Management:
Client Management, Stakeholder Communication, Customer Success

Data & Analytics:
Data Analysis, Tableau, Power BI, Excel, SQL

Tools commonly used by functional roles:
JIRA, Confluence, Salesforce, SAP, HubSpot, Asana, Trello, Notion

-------------------------------------

SOFT / LEADERSHIP SKILLS (include only if strongly implied by experience):

Leadership
Team Management
Strategic Thinking
Decision Making
Problem Solving
Cross-functional Collaboration

-------------------------------------

Rules:

1. Extract skills that are clearly supported by the resume content.
2. Normalize abbreviations:
   JS → JavaScript
   ReactJS → React
   Node → Node.js
3. Merge duplicate skills.
4. Do NOT include vague phrases like:
   "hardworking", "motivated", "team player".
5. Prefer industry-recognized skill names.

Return skills as a clean array of strings.

Example Output:

"skills": [
"Product Strategy",
"Agile",
"Stakeholder Management",
"JIRA",
"SQL",
"Python",
"Tableau"
]

4. tools:
- Development tools, cloud tools, or software platforms.

5. education:
- Extract all education entries.

6. highest_education:
- Return the most advanced degree only.

7. Convert abbreviations:
JS → JavaScript
Node → Node.js

8. If information is missing return empty values.

STRICT RULES:
- Return ONLY JSON
- No explanation
- No markdown
- No comments

Resume Text:
${resumeText}
`;
}

/* ======================================================
   JOB DESCRIPTION PROMPT
====================================================== */

function buildJDPrompt(jdText) {
  return `
You are an expert ATS (Applicant Tracking System) job description parser.
Your job is to extract structured, normalized information from the job description provided.

Return ONLY valid JSON. No explanation. No markdown. No text outside the JSON object.

═══════════════════════════════════════════════
JSON OUTPUT FORMAT:
═══════════════════════════════════════════════

{
  "job_title": "",
  "required_skills": [],
  "preferred_skills": [],
  "experience_required": 0,
  "education_required": "",
  "required_title": "",
  "responsibilities": [],
  "domain": "",
  "employment_type": "",
  "work_mode": ""
}

═══════════════════════════════════════════════
FIELD-BY-FIELD EXTRACTION RULES:
═══════════════════════════════════════════════

1. job_title
   - Extract the single primary job title exactly as written in the JD.
   - If multiple titles exist (e.g. "Engineer / Developer"), pick the most specific one.
   - Do not abbreviate, paraphrase, or infer.
   - Example output: "Senior Backend Engineer", "ML Engineer – NLP Specialization"

2. required_skills
   - Extract ONLY skills explicitly stated as mandatory or must-have.
   - Trigger phrases: "required", "must have", "must know", "essential", 
     "mandatory", "minimum requirement", "you must".
   - Cover ALL of the following categories where applicable:
       → Programming languages        (e.g. Python, Java, TypeScript, C++)
       → Frameworks & libraries       (e.g. React, Django, Spring Boot, Express.js)
       → Databases                    (e.g. PostgreSQL, MongoDB, Redis, MySQL)
       → Cloud platforms & services   (e.g. AWS, GCP, Azure, S3, Lambda, EC2)
       → DevOps & infrastructure      (e.g. Docker, Kubernetes, Terraform, CI/CD, Jenkins)
       → AI/ML tools & frameworks     (e.g. TensorFlow, PyTorch, LangChain, HuggingFace)
       → Testing tools                (e.g. Jest, Selenium, Pytest, Mocha)
       → APIs & protocols             (e.g. REST, GraphQL, gRPC, WebSockets)
       → Version control              (e.g. Git, GitHub, GitLab, Bitbucket)
       → Security & auth standards    (e.g. OAuth2, JWT, SSL/TLS, SAML)
   - Normalize all skill names to canonical industry-standard form (see NORMALIZATION RULES).
   - Do NOT include soft skills (e.g. communication, teamwork, leadership).
   - Return as: string[]

3. preferred_skills
   - Extract ONLY skills explicitly stated as optional or nice-to-have.
   - Trigger phrases: "preferred", "nice to have", "bonus", "plus", "good to have",
     "advantage", "familiarity with", "exposure to", "ideally", "desirable".
   - Apply the same category coverage and normalization rules as required_skills.
   - NEVER duplicate a skill that already appears in required_skills.
   - Return as: string[]

4. experience_required
   - Extract the MINIMUM years of professional experience required.
   - Trigger patterns: "X+ years", "at least X years", "minimum X years", "X-Y years".
   - If a range is given (e.g. "3–5 years"), always extract the LOWER bound (3).
   - If experience is not mentioned anywhere, return 0.
   - Return as: number (integer only — e.g. 3, not "3+" or "3 years")

5. education_required
   - Extract the minimum academic qualification explicitly required.
   - Standardize strictly to one of these values:
       "High School Diploma"
       "Associate's Degree"
       "Bachelor's Degree"
       "Master's Degree"
       "PhD"
       "Not Specified"
   - If stated as "Bachelor's or equivalent experience", return "Bachelor's Degree".
   - If multiple degrees are listed, return the MINIMUM acceptable one.
   - Append field of study if explicitly mentioned 
     (e.g. "Bachelor's Degree in Computer Science").
   - Return as: string

6. required_title
   - Extract the job title or role the employer expects the candidate to currently 
     hold or have previously held.
   - This is the CANDIDATE's background title, not the role being hired for.
   - Trigger phrases: "you are a...", "currently working as", "background as",
     "coming from", "previous experience as".
   - If not explicitly stated, infer reasonably from context 
     (e.g. hiring a "Tech Lead" → infer "Senior Software Engineer").
   - Return as: string

7. responsibilities
   - Extract the core day-to-day duties and deliverables of the role.
   - Look under sections: "Responsibilities", "What you'll do", "Your role",
     "Key duties", "Job scope", "You will".
   - Write each as a concise action-oriented phrase starting with a verb.
     (e.g. "Design and maintain RESTful APIs", "Lead backend code reviews")
   - Include maximum 7 most specific and prominent responsibilities.
   - OMIT generic filler such as:
     "Work in a fast-paced environment", "Be a team player", "Other duties as assigned".
   - Return as: string[]

8. domain
   - Identify the primary industry or business domain of the role.
   - Examples: "FinTech", "HealthTech", "E-Commerce", "EdTech", "Cybersecurity",
     "Gaming", "SaaS", "Enterprise Software", "Data & Analytics", "AI/ML", "Logistics".
   - If not explicitly stated, infer from company description or product context in the JD.
   - Return as: string

9. employment_type
   - Extract the type of employment being offered.
   - Standardize strictly to one of:
       "Full-Time" | "Part-Time" | "Contract" | "Freelance" | "Internship" | "Not Specified"
   - Return as: string

10. work_mode
    - Extract the work arrangement.
    - Standardize strictly to one of:
        "On-Site" | "Remote" | "Hybrid" | "Not Specified"
    - Return as: string

═══════════════════════════════════════════════
NORMALIZATION RULES (apply to ALL skill fields):
═══════════════════════════════════════════════

Always convert abbreviations and shorthand to canonical form:

  JS / Javascript        → JavaScript
  TS                     → TypeScript
  Node / NodeJS          → Node.js
  ReactJS / React.js     → React
  NextJS / Next.js       → Next.js
  VueJS                  → Vue.js
  AngularJS              → Angular
  Express / ExpressJS    → Express.js
  Mongo / Mongoose       → MongoDB
  Postgres / PG          → PostgreSQL
  My SQL                 → MySQL
  Py                     → Python
  K8s                    → Kubernetes
  TF                     → TensorFlow
  HF                     → HuggingFace
  GCP                    → Google Cloud Platform (GCP)
  AWS Lambda / S3 / EC2  → treat each as a separate skill under AWS umbrella

- Matching is case-insensitive.
- Treat common aliases as the same skill 
  (e.g. "Artificial Intelligence" = "AI", "Machine Learning" = "ML").
- Do NOT split a compound skill into parts 
  (e.g. "CI/CD" stays as "CI/CD", not "CI" and "CD").

═══════════════════════════════════════════════
GLOBAL STRICT CONSTRAINTS:
═══════════════════════════════════════════════

- Return ONLY valid JSON. No markdown, no backticks, no explanation, no extra text.
- Never invent, assume, or hallucinate values not present or reasonably inferable.
- If a field cannot be determined, return its default: "" for strings, [] for arrays, 0 for numbers.
- Do not copy raw sentences from the JD — extract, normalize, and distill only.
- required_skills and preferred_skills must be fully mutually exclusive.
- All skill names must be plain strings in their canonical form only.
- Soft skills (communication, teamwork, etc.) must NEVER appear in any skill array.

═══════════════════════════════════════════════
Job Description:
═══════════════════════════════════════════════
${jdText}
`;
}

/* ======================================================
   JSON CLEANER
====================================================== */

function cleanJSON(text) {
  if (!text) return null;

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, " ")
    .trim();
}

/* ======================================================
   SAFE JSON PARSER
====================================================== */

function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {

    try {
      const repaired = text
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");

      return JSON.parse(repaired);
    } catch (e) {
      return null;
    }
  }
}

/* ======================================================
   GEMINI SDK CALL
====================================================== */

async function callGemini(prompt, retries = 2) {
  try {

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048
      }
    });

    const text = response.text;

    if (!text) throw new Error("Empty Gemini response");

    return text;

  } catch (error) {

    console.error("Gemini SDK Error:", error.message);

    if (retries > 0) {
      console.warn("Retrying Gemini...");
      return callGemini(prompt, retries - 1);
    }

    throw error;
  }
}
/* ======================================================
   RESUME PARSER
====================================================== */

exports.parseResumeWithGemini = async (resumeText) => {

  if (!resumeText || resumeText.length < 50) {
    throw new Error("Resume text too short");
  }

  const safeText = resumeText.slice(0, 12000);

  const prompt = buildResumePrompt(safeText);

  const rawResponse = await callGemini(prompt);

  const cleaned = cleanJSON(rawResponse);

  const parsed = safeJSONParse(cleaned);

  if (!parsed) {
    throw new Error("Invalid JSON from Gemini");
  }

  return parsed;
};

/* ======================================================
   JOB DESCRIPTION PARSER
====================================================== */

exports.parseJDWithGemini = async (jdText) => {

  if (!jdText || jdText.length < 20) {
    throw new Error("Job description too short");
  }

  const safeText = jdText.slice(0, 8000);

  const prompt = buildJDPrompt(safeText);

  const rawResponse = await callGemini(prompt);

  const cleaned = cleanJSON(rawResponse);

  const parsed = safeJSONParse(cleaned);

  if (!parsed) {
    throw new Error("Invalid JSON from Gemini");
  }

  return parsed;
};