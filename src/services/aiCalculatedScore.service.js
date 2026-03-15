const path = require("path");
require("dotenv").config({ 
  path: path.resolve(__dirname, "../../.env") 
});

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-2.5-flash";

/**
 * Calculates ATS scoring for a resume using Gemini AI
 * @param {string} resumeText - Full extracted resume text
 * @param {string} jdText - Full Job Description text
 * @param {Array} resumeSkills - normalized skills array from resume
 * @param {Array} jdSkills - normalized skills array from JD
 * @param {Object} resumeMeta - other resume info (experience, projects, jobTitle, education)
 */
exports.getGeminiCalculatedScore = async (
  resumeText,
  jdText,
  resumeSkills = [],
  jdSkills = [],
  resumeMeta = {}
) => {
  if (!resumeText || !jdText) return { finalScore: 0 };

  const { totalExperience = 0, projects = [], jobTitle = "", highestEducation = "" } = resumeMeta;

  // Construct prompt with embedded logic
  const prompt = `
You are an AI ATS scoring engine. 
Compare the candidate's resume to the job description and calculate all scores based on the following system:

1️⃣ HYBRID SKILL SCORE:
1️ Exact Match:
- Count how many JD skills are exactly present in the candidate's resume.
- Exact match score = (exactly matched skills / total JD skills) * 100

2️ Fuzzy Match:
- For JD skills not exactly matched, calculate string similarity with resume skills.
- If similarity > 0.55, consider it matched (fuzzy match).
- Fuzzy score = (number of fuzzy matches / total JD skills) * 100

3️ Semantic Match (AI):
- For remaining unmatched JD skills, estimate semantic similarity using AI.
- Semantic score = percentage match (0-100)

4️ Keyword Score:
- Keyword score = Exact score + Fuzzy score, capped at 100

5️ Final Hybrid Skill Score:
- Hybrid Skill Score = (keywordScore * 0.6) + (semanticScore * 0.4)

2️⃣ EXPERIENCE SCORE:
- Use resume experience vs required experience in JD
- Follow ratio logic:
  > 100% or more = 95-100
  > 80%-100% = 85
  > 60%-80% = 75
  > 40%-60% = 60
  > 20%-4
  0% = 45
  > 0-20% = 30
  > none = 20

3️⃣ PROJECT RELEVANCE SCORE:
- Compare resume projects tech stack with JD skills
- Use semantic similarity logic

4️⃣ TITLE SIMILARITY SCORE:
- Compare resume job title vs required title using semantic similarity

5️⃣ EDUCATION SCORE:
- PhD/Masters/Bachelors/Diploma hierarchy
- Calculate as % of required level

6️⃣ RESUME QUALITY SCORE:
- Based on:
  - extractedText length (>400 chars = +20)
  - at least 5 skills = +20
  - 2+ projects = +20
  - totalExperience > 0 = +20
  - action verbs presence in text (developed, built, designed, implemented, led) = +20
- Max 100

7️⃣ FINAL ATS SCORE:
- Weighted sum:
  - hybridSkillScore * 0.35
  - experienceScore * 0.20
  - projectRelevanceScore * 0.15
  - titleSimilarityScore * 0.10
  - educationScore * 0.10
  - resumeQualityScore * 0.10

INPUTS:
Resume Text: ${resumeText}
Job Description Text: ${jdText}
Resume Skills: ${resumeSkills.join(", ")}
JD Skills: ${jdSkills.join(", ")}
Resume Experience: ${totalExperience}
Projects (tech stacks): ${projects.map(p => p.tech || []).flat().join(", ")}
Job Title: ${jobTitle}
Highest Education: ${highestEducation}

Rules for matchedSkills and missingSkills:

DEFINITIONS:
- matchedSkills: Skills that appear in BOTH the resume skills list AND the JD skills list.
  → Source: Intersection of [Resume Skills] ∩ [JD Skills]
  → These confirm the candidate meets a stated requirement.

- missingSkills: Skills that appear in the JD skills list but are ABSENT from the resume skills list.
  → Source: Difference of [JD Skills] - [Resume Skills]
  → These represent gaps between the candidate's profile and the job requirements.

STRICT CONSTRAINTS:
- Only evaluate skills that are explicitly present in the provided JD skills list.
- Never invent, infer, or assume skills not present in either list.
- Never add a skill to matchedSkills unless it exists in BOTH lists.
- Never add a skill to missingSkills unless it exists in the JD list but NOT the resume list.
- Skills present in the resume but NOT in the JD must be completely ignored — do not include them in either list.
- Matching should be case-insensitive and account for common aliases (e.g. "JS" = "JavaScript", "Node" = "Node.js").

OUTPUT FORMAT:
- matchedSkills: string[] → e.g. ["React", "Node.js", "MongoDB"]
- missingSkills: string[] → e.g. ["Docker", "Kubernetes"]
- Both arrays must only contain skill names as plain strings.
- Both arrays must be mutually exclusive — a skill cannot appear in both lists.
- If no skills match, return matchedSkills as an empty array []. Same for missingSkills.

OUTPUT:
Return ONLY valid JSON.

{
  "hybridSkillScore": 0,
  "experienceScore": 0,
  "projectRelevanceScore": 0,
  "titleSimilarityScore": 0,
  "educationScore": 0,
  "resumeQualityScore": 0,
  "finalScore": 0,
  "matchedSkills": [],
  "missingSkills": []
}


`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 1500
      }
    });

    const text =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    // Clean the response
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse JSON
    const scores = JSON.parse(cleaned);

    return {
  hybridSkillScore: scores.hybridSkillScore || 0,
  experienceScore: scores.experienceScore || 0,
  projectRelevanceScore: scores.projectRelevanceScore || 0,
  titleSimilarityScore: scores.titleSimilarityScore || 0,
  educationScore: scores.educationScore || 0,
  resumeQualityScore: scores.resumeQualityScore || 0,
  finalScore: scores.finalScore || 0,
  matchedSkills: Array.isArray(scores.matchedSkills) ? scores.matchedSkills : [],  // ← ADD
  missingSkills: Array.isArray(scores.missingSkills) ? scores.missingSkills : []   // ← ADD
};

  } catch (err) {
    console.error("Gemini AI scoring error:", err.message);
    return {
      hybridSkillScore: 0,
      experienceScore: 0,
      projectRelevanceScore: 0,
      titleSimilarityScore: 0,
      educationScore: 0,
      resumeQualityScore: 0,
      finalScore: 0
    };
  }
};