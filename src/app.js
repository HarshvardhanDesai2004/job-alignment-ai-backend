const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const aiSuggestionRoutes = require("./routes/aiSuggestion.routes");
const errorHandler = require("./middlewares/errorMiddleware");
const statsRoutes = require("./routes/statsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const coverLetterRoutes = require("./routes/coverLetter.routes");



const app = express();
app.set("trust proxy", 1);

/* CORS FIX */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  })
);



/* Body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/ai", aiSuggestionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cover-letter", coverLetterRoutes);


/* Health check */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running 🚀"
  });
});

app.use(errorHandler);

module.exports = app;