const path = require("path");
require("dotenv").config({ 
  path: path.resolve(__dirname, "../../.env") 
});

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-2.5-flash";

exports.generateCoverLetter = async ({ resume, jd, user }) => {

const prompt = `
You are an expert career assistant that writes professional cover letters.

INPUTS:

Candidate Name: ${user?.name || ""}
Email: ${user?.email || ""}


Resume Text:
${resume.extractedText}

Job Description:
${jd.text}

INSTRUCTIONS:
strats with:
[candidate name]
[candidate emial]

- Write a professional and concise cover letter tailored to the job description.
- Highlight the candidate's most relevant skills and experience from the resume.
- Keep the tone professional and confident.
- The cover letter should be around 150–250 words.
- Structure the letter with:
  1. Introduction
  2. Relevant experience and skills
  3. Closing paragraph expressing interest

Return only the cover letter text.
Do not include markdown, JSON, or explanations.

End with:
Sincerely,
[Candidate Name]
`;

try {

const response = await ai.models.generateContent({
  model: MODEL,
  contents: prompt,
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 1200
  }
});

const text =
  response.text ||
  response.candidates?.[0]?.content?.parts?.[0]?.text;

return text.trim();

} catch (error) {

console.error("Gemini cover letter error:", error.message);

throw new Error("Failed to generate cover letter");

}
};