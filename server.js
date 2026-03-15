const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const app = require("./src/app");

dotenv.config();

const PORT = process.env.PORT || 5000;

/* ✅ Ensure uploads folder exists */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });