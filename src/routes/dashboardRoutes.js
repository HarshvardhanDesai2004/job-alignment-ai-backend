const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { getRecentActivity } = require("../controllers/dashboardController");

router.get("/activity", protect, getRecentActivity);

module.exports = router;