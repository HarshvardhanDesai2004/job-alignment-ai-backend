const path = require("path");
require("dotenv").config({ 
  path: path.resolve(__dirname, "../../.env") 
});

const { GoogleGenAI } = require("@google/genai");
const JobDescription = require("../models/JobDescription");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-2.5-flash";

exports.generateResumeSuggestions = async ({ resume, jd, analysis }) => {

const prompt = `
You are an AI ATS resume analyzer. Compare the resume to the job description and provide actionable improvement suggestions.

INPUTS:
Resume Text:
${resume.extractedText}

Job Description Text:
${jd.text}

Resume Analysis Scores:
- Hybrid Skill Score: ${analysis.hybridSkillScore || 0}
- Experience Score: ${analysis.experienceScore || 0}
- Project Relevance Score: ${analysis.projectRelevanceScore || 0}
- Title Similarity Score: ${analysis.titleSimilarityScore || 0}
- Education Score: ${analysis.educationScore || 0}
- Resume Quality Score: ${analysis.resumeQualityScore || 0}
- Final Score: ${analysis.finalScore || 0}


INSTRUCTIONS:
- Return concise, actionable suggestions.
- Use **short bullet points only**, no long paragraphs.
- Always return valid JSON with the following keys:
{
  "skillsToAdd": [],
  "experienceImprovements": [],
  "keywordsToInclude": [],
  "formattingSuggestions": [],
  "summaryRewrite": [],
  "achievementSuggestions": []
}
- Each array item must be a short sentence (1-2 lines max).
- If nothing to suggest for a key, return an empty array.
- Return **JSON only**, no extra text or markdown.

OUTPUT EXAMPLE:
{
  "skillsToAdd": ["Add React skills", "Include TypeScript knowledge"],
  "experienceImprovements": ["Quantify achievements", "Clarify leadership experience"],
  "keywordsToInclude": ["Agile", "REST API"],
  "formattingSuggestions": ["Use consistent bullet points", "Align section headings"],
  "summaryRewrite": ["Make summary more concise"],
  "achievementSuggestions": ["Add measurable metrics for project X"]
}
`;

  try {

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500
      }
    });

    const text =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text;
      

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Invalid JSON returned from Gemini:", cleaned);
      throw new Error("AI returned invalid JSON");
    }

  } catch (error) {

    console.error("Gemini suggestion error:", error.message);

    throw new Error("Failed to generate resume suggestions");
  }
};