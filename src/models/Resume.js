const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalFileName: { type: String, required: true },

    filePath: { type: String, required: true },

    extractedText: { type: String, required: true },

    skills: {
      type: [String],
      default: []
    },

    educationKeywords: {
      type: [String],
      default: []
    },

    highestEducation: {
      type: String,
      default: ""
    },

    experience: [
      {
        company: { type: String, default: "" },
        role: { type: String, default: "" },
        duration: { type: String, default: "" }
      }
    ],

    totalExperience: {
      type: Number,
      default: 0
    },

    jobTitle: {
      type: String,
      default: ""
    },

    projects: [
  {
    name: String,
    tech: [String]
  }
],

   embeddings: {
  type: [Number],
  default: []
},

    parsedData: {
      type: Object,
      default: null
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);