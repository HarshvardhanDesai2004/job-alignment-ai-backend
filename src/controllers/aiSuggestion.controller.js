const { generateResumeSuggestions } = require("../services/aiSuggestion.service");
const Resume = require("../models/resume");
const JobDescription = require("../models/JobDescription");
const Analysis = require("../models/Analysis");

exports.getAISuggestions = async (req, res) => {
  try {

    const { resumeId, jdId } = req.body;

    const resume = await Resume.findById(resumeId);
    const jd = await JobDescription.findById(jdId);

    const analysis = await Analysis.findOne({
      resumeId,
      jdId,
      userId: req.user._id
    });

    if (!resume || !jd || !analysis) {
      return res.status(404).json({
        success: false,
        message: "Resume, Job Description, or Analysis not found"
      });
    }

    const suggestions = await generateResumeSuggestions({
      resume,
      jd,
      analysis
    });
    await Analysis.findByIdAndUpdate(
  analysis._id,
  { $inc: { aiSuggestionsCount: 1 } }
);


    res.json({
      success: true,
      suggestions
    });

  } catch (error) {

    console.error("AI suggestion error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI suggestions"
    });

  }
};