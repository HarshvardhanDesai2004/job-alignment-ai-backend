const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

exports.extractTextFromFile = async (filePath) => {
  const ext = filePath.split(".").pop().toLowerCase();

  if (ext === "pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error("Unsupported file format");
};