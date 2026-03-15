const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  analyzeResumeAgainstJD,
  getAnalysisById,
  getAnalysisHistory
} = require("../controllers/analysisController");

// Protected routes
router.post("/analyze", protect, analyzeResumeAgainstJD);
router.get("/history", protect, getAnalysisHistory);

// Dynamic route
router.get("/:id", protect, getAnalysisById);

module.exports = router;