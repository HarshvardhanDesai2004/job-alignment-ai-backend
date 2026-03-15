const { generateCoverLetter } = require("../services/coverLetter.service");

const Resume = require("../models/resume");
const JobDescription = require("../models/JobDescription");
const User = require("../models/User");




exports.generateCoverLetterController = async (req, res) => {
  try {

    const { resumeId, jdId } = req.body;

    const resume = await Resume.findById(resumeId);
    const jd = await JobDescription.findById(jdId);

    if (!resume || !jd) {
      return res.status(404).json({
        success: false,
        message: "Resume or Job Description not found"
      });
    }
    const user = await User.findById(resume.userId); 

    const coverLetter = await generateCoverLetter({
  resume,
  jd,
  user
});

    res.json({
      success: true,
      coverLetter
    });

  } catch (error) {

    console.error("Cover letter generation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate cover letter"
    });

  }
};