// backend/src/controllers/jobController.js

const JobDescription = require("../models/JobDescription");
const { extractSkills } = require("../services/skillExtractor");
const { parseJDWithGemini } = require("../services/geminiParser.service");

/* ======================================================
   CREATE JOB DESCRIPTION
====================================================== */
exports.createJobDescription = async (req, res) => {
  try {
    const {
      text,
      requiredExperience = 0,
      requiredEducation = "",
      requiredTitle = "",
    } = req.body;

    if (!text || text.trim().length < 20) {
      return res
        .status(400)
        .json({ message: "Job description text too short" });
    }

    if (!req.user) {
      console.log("❌ req.user is undefined");
      return res.status(401).json({ message: "User not found in request" });
    }

    let extractedSkills = [];
    let jobTitle = requiredTitle;
    let responsibilities = [];
    let experience = requiredExperience;
    let education = requiredEducation;

    // STEP 1 — TRY GEMINI AI
    try {
      const aiData = await parseJDWithGemini(text.slice(0, 8000));

      if (!aiData) throw new Error("Empty Gemini response");

      extractedSkills = aiData.required_skills || [];
      jobTitle = aiData.job_title || requiredTitle;
      responsibilities = aiData.responsibilities || [];
      experience = aiData.experience_required || requiredExperience;
      education = aiData.education_required || requiredEducation;

      console.log("✅ Gemini JD parsing successful");
    } catch (err) {
      console.log("⚠️ Gemini failed → using regex fallback");

      extractedSkills = extractSkills(text);
      jobTitle = requiredTitle;
      responsibilities = [];
      experience = requiredExperience;
      education = requiredEducation;
    }

    // STEP 2 — SAVE JD
    const jd = await JobDescription.create({
      userId: req.user._id,
      text,
      jobTitle,
      extractedSkills,
      responsibilities,
      requiredExperience: experience,
      requiredEducation: education,
      requiredTitle
    });

    // STEP 3 — RESPONSE
    res.status(201).json({
      message: "Job description saved",
      jdId: jd._id,
      extractedSkills,
      requiredExperience: experience,
      requiredEducation: education,
      requiredTitle
    });

  } catch (error) {
    console.error("JD Controller Error:", error);
    res.status(500).json({
      message: "Failed to save job description",
      error: error.message
    });
  }
};

/* ======================================================
   GET ALL JOB DESCRIPTIONS
====================================================== */
exports.getJobDescriptions = async (req, res) => {
  try {
    const jobs = await JobDescription.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    console.error("Fetch jobs error:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

/* ======================================================
   GET JOB DESCRIPTION BY ID
====================================================== */
exports.getJobDescriptionById = async (req, res) => {
  try {
    const job = await JobDescription.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    console.error("Fetch job by ID error:", err);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

/* ======================================================
   DELETE JOB DESCRIPTION
====================================================== */
exports.deleteJobDescription = async (req, res) => {
  try {
    const job = await JobDescription.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await JobDescription.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ message: "Failed to delete job" });
  }
};