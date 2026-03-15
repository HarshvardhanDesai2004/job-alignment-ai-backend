const express = require("express");
const router = express.Router();

const { generateCoverLetterController } = require("../controllers/coverLetter.controller");
const { protect } = require("../middlewares/authMiddleware");

router.post("/generate", protect, generateCoverLetterController);

module.exports = router;