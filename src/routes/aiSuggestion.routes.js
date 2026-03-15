const express = require("express");
const router = express.Router();

const { getAISuggestions } = require("../controllers/aiSuggestion.controller");
const { protect } = require("../middlewares/authMiddleware"); // ✅ destructure protect

router.post("/generate", protect, getAISuggestions);

module.exports = router;