const mongoose = require("mongoose");

const jobDescriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    // Skills used by ATS matching
    extractedSkills: {
      type: [String],
      default: [],
    },

    // Preferred skills from Gemini
    preferredSkills: {
      type: [String],
      default: [],
    },

    // Responsibilities extracted from Gemini
    responsibilities: {
      type: [String],
      default: [],
    },

    // ATS required experience
    requiredExperience: {
      type: Number,
      default: 0,
    },

    // ATS required education
    requiredEducation: {
      type: String,
      default: "",
    },

    // ATS required title
    requiredTitle: {
      type: String,
      default: "",
    },

    // Gemini parsed job title
    jobTitle: {
      type: String,
      default: "",
    },

    // Store raw Gemini output for debugging
    parsedData: {
      type: Object,
      default: null,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobDescription", jobDescriptionSchema);