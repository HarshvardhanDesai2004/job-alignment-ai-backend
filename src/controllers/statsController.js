const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");
const Analysis = require("../models/Analysis");
const { Types: { ObjectId } } = require("mongoose");

exports.getStats = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user._id; // Already a valid ID string

    const resumesUploaded = await Resume.countDocuments({ userId });
    const jobDescriptions = await JobDescription.countDocuments({ userId });
    const analysisCompleted = await Analysis.countDocuments({ userId });
     const aiSuggestionsData = await Analysis.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$aiSuggestionsCount" } } }
    ]);

    const aiSuggestionsGenerated = aiSuggestionsData[0]?.total || 0;
  

    res.json({
      resumesUploaded,
      jobDescriptions,
      analysisCompleted,
      aiSuggestionsGenerated
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};