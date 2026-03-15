const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    jdId: { type: mongoose.Schema.Types.ObjectId, ref: "JobDescription", required: true },
    matchedSkills: [String],
    missingSkills: [String],
    aiSuggestionsCount: {type: Number,default: 0},

    // NEW SCORES
    hybridSkillScore: Number,
    experienceScore: Number,
    projectRelevanceScore: Number,
    titleSimilarityScore: Number,
    educationScore: Number,
    resumeQualityScore: Number,
    finalScore: Number,

    source: {
      type: String,
      enum: ["system", "gemini"],
      default: "system"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);