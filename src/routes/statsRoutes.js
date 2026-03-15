const express = require("express");
const { getStats } = require("../controllers/statsController");
const { protect } = require("../middlewares/authMiddleware"); // your JWT auth middleware
const router = express.Router();

// GET /api/stats
router.get("/", protect, getStats);

module.exports = router;