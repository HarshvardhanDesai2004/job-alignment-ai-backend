// backend/src/routes/resumeRoutes.js

const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume
} = require("../controllers/resumeController");

const router = express.Router();

/* ======================================================
   UPLOAD RESUME
====================================================== */
router.post("/upload", protect, upload.single("resume"), uploadResume);

/* ======================================================
   GET ALL RESUMES
====================================================== */
router.get("/", protect, getResumes);

/* ======================================================
   GET RESUME BY ID
====================================================== */
router.get("/:id", protect, getResumeById);

/* ======================================================
   DELETE RESUME
====================================================== */
router.delete("/:id", protect, deleteResume);

module.exports = router;