const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  createJobDescription,
  getJobDescriptions,
  getJobDescriptionById,
  deleteJobDescription
} = require("../controllers/jobController");

const router = express.Router();

router.post("/", protect, createJobDescription);
router.get("/", protect, getJobDescriptions);
router.get("/:id", protect, getJobDescriptionById);
router.delete("/:id", protect, deleteJobDescription);

module.exports = router;