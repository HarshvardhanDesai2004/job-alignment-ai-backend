const Resume = require("../models/resume");
const JobDescription = require("../models/JobDescription");
const Analysis = require("../models/Analysis");

exports.getRecentActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    const jobs = await JobDescription.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    const analyses = await Analysis.find({ userId })
      .populate("resumeId")
      .populate("jdId")
      .sort({ createdAt: -1 })
      .limit(3);

    const activity = [];

    resumes.forEach(r => {
      activity.push({
        type: "resume",
        title: `Resume uploaded: ${r.originalFileName}`,
        date: r.createdAt
      });
    });

    jobs.forEach(j => {
      activity.push({
        type: "job",
        title: `Job description added`,
        date: j.createdAt
      });
    });

    analyses.forEach(a => {
      activity.push({
        type: "analysis",
        title: `Analysis completed (Score: ${a.finalScore}%)`,
        date: a.createdAt
      });
    });

    // sort all activities together
    activity.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(activity.slice(0, 5));
  } catch (error) {
    console.error("Activity fetch error:", error);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};