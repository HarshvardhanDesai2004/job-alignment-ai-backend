// backend/src/controllers/resumeController.js

const Resume = require("../models/Resume"); // use lowercase to match filename
const { extractTextFromFile } = require("../utils/fileParser");
const fs = require("fs");

const {
  extractSkills,
  extractEducation,
  extractExperience,
} = require("../services/skillExtractor");

const { normalizeSkills } = require("../services/skillNormalizer.service");
const { generateEmbeddings } = require("../services/semanticAI.service");
const { parseResumeWithGemini } = require("../services/geminiParser.service");

/* ======================================================
   TECH KEYWORDS
====================================================== */
const TECH_KEYWORDS = [
  "javascript","node.js","express","react","angular","vue",
  "python","django","flask","java","spring",
  "c++","c","mysql","mongodb","firebase",
  "aws","azure","html","css","bootstrap"
];

/* ======================================================
   ESCAPE REGEX SPECIAL CHARACTERS
====================================================== */
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ======================================================
   PROJECT EXTRACTION (Fallback)
====================================================== */
function extractProjects(resumeText) {
  if (!resumeText) return [];

  const sectionMatch = resumeText.match(
    /(projects|projects undertaken|projects completed)([\s\S]*?)(education|skills|experience|certifications|$)/i
  );
  if (!sectionMatch) return [];

  const section = sectionMatch[2];
  const projectBlocks = section
    .split(/•|●|▪|◦|\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  return projectBlocks.map(block => {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const name = lines[0] || "";
    const description = lines.slice(1).join(" ");
    const tech = TECH_KEYWORDS.filter(kw => {
      const safeKeyword = escapeRegex(kw);
      return new RegExp(`\\b${safeKeyword}\\b`, "i").test(description);
    });
    return { name, tech };
  });
}

/* ======================================================
   JOB TITLE EXTRACTION
====================================================== */
function extractJobTitle(text) {
  const titles = [
    "developer",
    "engineer",
    "data scientist",
    "software engineer",
    "full stack developer",
    "android developer"
  ];

  const lowerText = text.toLowerCase();
  for (const title of titles) if (lowerText.includes(title)) return title;
  return "";
}

/* ======================================================
   EXPERIENCE CALCULATION
====================================================== */
function calculateTotalExperience(experienceArray) {
  let total = 0;
  for (const exp of experienceArray) {
    const years = exp.match(/(\d{4})/g);
    if (years && years.length >= 2) total += parseInt(years[1]) - parseInt(years[0]);
  }
  return total;
}

/* ======================================================
   EDUCATION PRIORITY
====================================================== */
function extractHighestEducation(educationArray) {
  if (!educationArray || educationArray.length === 0) return "";

  const priority = ["phd","master","bachelor","diploma","hsc","ssc"];
  const lower = educationArray.map(e => e.toLowerCase());

  for (const deg of priority) if (lower.some(e => e.includes(deg))) return deg;
  return educationArray[0];
}

/* ======================================================
   UPLOAD RESUME
====================================================== */
exports.uploadResume = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const extractedText = await extractTextFromFile(file.path);
    if (!extractedText || extractedText.length < 30)
      return res.status(400).json({ message: "Could not extract text from resume" });

    let skills = [], educationKeywords = [], experience = [], projects = [];
    let jobTitle = "", totalExperience = 0, highestEducation = "", parsedData = null;

    // ======================================================
    // GEMINI AI PARSER
    // ======================================================
    try {
      const aiData = await parseResumeWithGemini(extractedText.slice(0, 6000));
      if (!aiData || !aiData.skills || aiData.skills.length === 0)
        throw new Error("Gemini returned weak data");

      parsedData = aiData;
      skills = normalizeSkills(aiData.skills || []);
      educationKeywords = aiData.education || [];
      experience = aiData.work_experience || [];
      jobTitle = aiData.job_title || "";
      totalExperience = aiData.total_experience_years || 0;
      highestEducation = extractHighestEducation(educationKeywords);
      projects = (aiData.projects || []).map(p => ({ name: p.name || "", tech: p.technologies || [] }));

      console.log("✅ Gemini extraction successful");
    } catch (error) {
      console.log("⚠️ Gemini failed → switching to regex parser");
      skills = normalizeSkills(extractSkills(extractedText));
      educationKeywords = extractEducation(extractedText);
      experience = extractExperience(extractedText);
      projects = extractProjects(extractedText);
      jobTitle = extractJobTitle(extractedText);
      highestEducation = extractHighestEducation(educationKeywords);
      totalExperience = calculateTotalExperience(experience);
    }

    // ======================================================
    // GENERATE EMBEDDINGS
    // ======================================================
    let embeddings = [];
    try {
      const cleanSkills = skills.filter(Boolean).map(s => s.toString().toLowerCase());
      const projectNames = projects.map(p => p.name).join(" ");
      const textForEmbedding = `
        Skills: ${cleanSkills.join(", ")}
        Job Title: ${jobTitle}
        Projects: ${projectNames}
      `;
      if (textForEmbedding.trim().length > 10) embeddings = await generateEmbeddings(textForEmbedding);
    } catch (err) {
      console.warn("Embedding generation failed:", err.message);
    }
    // ======================================================
// SANITIZE EXPERIENCE DATA (IMPORTANT FIX)
// ======================================================

if (!Array.isArray(experience)) {
  experience = [];
}

experience = experience.map(exp => {
  if (typeof exp === "string") {
    return { company: "", role: "", duration: exp };
  }

  return {
    company: exp.company || "",
    role: exp.role || "",
    duration: exp.duration || ""
  };
});

    // ======================================================
    // SAVE RESUME
    // ======================================================
    const resume = await Resume.create({
      userId: req.user._id,
      originalFileName: file.originalname,
      filePath: file.path,
      extractedText,
      skills,
      educationKeywords,
      highestEducation,
      experience,
      totalExperience,
      jobTitle,
      projects,
      embeddings,
      parsedData
    });

    res.status(201).json({
      message: "Resume uploaded and parsed successfully",
      resumeId: resume._id,
      skills,
      educationKeywords,
      highestEducation,
      experience,
      totalExperience,
      jobTitle,
      projects
    });

  } catch (error) {
  console.error("Resume Upload Error:", error);

  // ✅ Clean uploaded file if processing fails
  if (req.file) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn("File cleanup failed:", e.message);
    }
  }

  res.status(500).json({
    message: "Resume processing failed",
    error: error.message
  });
}
};

/* ======================================================
   GET ALL RESUMES
====================================================== */
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    console.error("Fetch resumes error:", error);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};

/* ======================================================
   GET RESUME BY ID
====================================================== */
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ success: true, resume });
  } catch (error) {
    console.error("Fetch resume by ID error:", error);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};

/* ======================================================
   DELETE RESUME
====================================================== */
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};