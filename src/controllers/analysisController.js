const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");
const Analysis = require("../models/Analysis");

const { calculateMatch } = require("../services/matchService");
const { normalizeSkills } = require("../services/skillNormalizer.service");

const {
  calculateExperienceScore,
  calculateProjectRelevance,
  calculateTitleSimilarity,
  calculateEducationScore,
  calculateResumeQualityScore
} = require("../services/advancedScoring.service");

const { getGeminiCalculatedScore } = require("../services/aiCalculatedScore.service");

// POST /api/analysis/analyze
exports.analyzeResumeAgainstJD = async (req, res) => {
  try {
    const { resumeId, jdId } = req.body;

    const resume = await Resume.findById(resumeId);
    const jd = await JobDescription.findById(jdId);

    if (!resume || !jd) {
      return res.status(404).json({ message: "Resume or JD not found" });
    }

    // 1️⃣ Normalize Skills
// ✅ Normalize both sides before comparison
const resumeSkills = normalizeSkills(resume.skills || []);
const jdSkills = normalizeSkills([
  ...(jd.extractedSkills || []),
  ...(jd.preferredSkills || [])
]);



    // 2️⃣ Hybrid Skill Matching
    const result = await calculateMatch(resumeSkills, jdSkills);

    // 3️⃣ Skill Coverage Calculation
   // ✅ Clean and clear
const totalSkills = result.matchedSkills.length + result.missingSkills.length;
const skillCoverage = totalSkills > 0 ? result.matchedSkills.length / totalSkills : 0;
    // 4️⃣ Final Hybrid Skill Score
    let hybridSkillScore = result.matchScore;
    if (skillCoverage < 0.3) hybridSkillScore *= 0.7;
    else if (skillCoverage < 0.5) hybridSkillScore *= 0.85;
    hybridSkillScore = Math.round(Math.min(hybridSkillScore, 100));

    // 5️⃣ Experience Score
    const experienceScore = calculateExperienceScore(resume.totalExperience || 0, jd.requiredExperience || 0);

    // 6️⃣ Project Relevance Score
    const projectTech = normalizeSkills(
      (resume.projects || []).flatMap(p => Array.isArray(p.technologies) ? p.technologies : [])
    );
    const projectRelevanceScore = await calculateProjectRelevance(projectTech, jdSkills);

    // 7️⃣ Title Similarity Score
    const titleSimilarityScore = await calculateTitleSimilarity(resume.jobTitle || "", jd.requiredTitle || "");

    // 8️⃣ Education Score
    const educationScore = calculateEducationScore(resume.highestEducation || "", jd.requiredEducation || "");

    // 9️⃣ Resume Quality Score
    const resumeQualityScore = calculateResumeQualityScore(resume);

    // 🔟 System Final Score
    const systemFinalScore = Math.round(
      hybridSkillScore * 0.35 +
      experienceScore * 0.20 +
      projectRelevanceScore * 0.15 +
      titleSimilarityScore * 0.10 +
      educationScore * 0.10 +
      resumeQualityScore * 0.10
    );

    // 1️⃣1️⃣ Get Gemini AI Score
    const aiScores = await getGeminiCalculatedScore(
      resume.extractedText,
      jd.text,
      resume.skills,
      jd.extractedSkills,
      {
        totalExperience: resume.totalExperience,
        job_req_Experiance:jd.requiredExperience,
        projectsTech: projectTech,
        jobTitle: resume.jobTitle,
        requiredTileJob:jd.requiredTitle,
        reqEduationJob:jd.requiredEducation,
        highestEducation: resume.highestEducation,
      }
    );



    // 1️⃣2️⃣ Compare Final Scores
    // ✅ Always use system skill lists (reliable), blend scores intelligently
const skillsData = {
  matchedSkills: result.matchedSkills,
  missingSkills: result.missingSkills,
};
const scoreDifference = Math.abs(systemFinalScore - aiScores.finalScore);
let finalAnalysis;
if (scoreDifference < 15) {
  finalAnalysis = {
    ...skillsData,
    hybridSkillScore,
    experienceScore,
    projectRelevanceScore,
    titleSimilarityScore,
    educationScore,
    resumeQualityScore,
    finalScore: systemFinalScore,
    source: "system"
  };
} else {
  finalAnalysis = {
   matchedSkills:aiScores.matchedSkills,                                      
   missingSkills:aiScores.missingSkills,
   hybridSkillScore: aiScores.hybridSkillScore,
    experienceScore: aiScores.experienceScore,
    projectRelevanceScore: aiScores.projectRelevanceScore,
    titleSimilarityScore: aiScores.titleSimilarityScore,
    educationScore: aiScores.educationScore,
    resumeQualityScore: aiScores.resumeQualityScore,
    finalScore: aiScores.finalScore,
    source: "gemini"
  };
}

    // 1️⃣3️⃣ Save Analysis
    const analysis = await Analysis.create({
      userId: req.user._id,
      resumeId,
      jdId,
      ...finalAnalysis
    });

    return res.json({ success: true, analysis });

  } catch (error) {
    console.error("Analyze error:", error);
    return res.status(500).json({ message: "Analysis failed" });
  }
};

// GET /api/analysis/:id
exports.getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await Analysis.findById(id)
      .populate("resumeId")
      .populate("jdId");

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    console.error("Fetch analysis by ID error:", error);
    res.status(500).json({ message: "Failed to fetch analysis" });
  }
};

// GET /api/analysis/history
exports.getAnalysisHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const analyses = await Analysis.find({ userId: req.user._id })
      .populate("resumeId")
      .populate("jdId")
      .sort({ createdAt: -1 });

    res.status(200).json(analyses);
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ message: "Failed to fetch analysis history" });
  }
};