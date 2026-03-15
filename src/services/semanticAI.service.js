const axios = require("axios");
const { normalizeSkills } = require("./skillNormalizer.service");

const SEMANTIC_AI_BASE_URL = process.env.SEMANTIC_AI_URL || "http://127.0.0.1:8001";

const SEMANTIC_MATCH_ENDPOINT = `${SEMANTIC_AI_BASE_URL}/semantic-skill-match`;
const EMBEDDING_ENDPOINT = `${SEMANTIC_AI_BASE_URL}/generate-embeddings`;


/* ======================================================
   1️⃣ Retry Wrapper for Semantic AI Calls
====================================================== */

async function callWithRetry(payload, retries = 1) {

  try {

    const response = await axios.post(
      SEMANTIC_MATCH_ENDPOINT,
      payload,
      { timeout: 7000 }
    );

    return response.data;

  } catch (error) {

    if (retries > 0) {

      console.warn(`Retrying Semantic AI call, attempts left: ${retries}`);

      return callWithRetry(payload, retries - 1);
    }

    console.error(
      "Semantic AI service unavailable:",
      error.response?.data || error.message
    );

    return {
      semanticMatchScore: 0,
      semanticMissingSkills: payload.jd_skills || []
    };
  }
}


/* ======================================================
   2️⃣ Get Semantic Score
====================================================== */

exports.getSemanticScore = async (
  resumeSkills = [],
  jdSkills = [],
  resumeEmbeddings = null
) => {

  try {

    if (!Array.isArray(jdSkills) || jdSkills.length === 0) {
      return {
        semanticMatchScore: 0,
        semanticMissingSkills: []
      };
    }

    // Normalize skills before sending to AI
   const normalizedResumeSkills = normalizeSkills(resumeSkills);

    const normalizedJDSkills = normalizeSkills(jdSkills);

    const payload = {
      resume_skills: normalizedResumeSkills,
      jd_skills: normalizedJDSkills
    };

    return await callWithRetry(payload, 1);

  } catch (error) {

    console.error("Semantic scoring error:", error.message);

    return {
      semanticMatchScore: 0,
      semanticMissingSkills: jdSkills
    };
  }
};



/* ======================================================
   3️⃣ Generate Embeddings
====================================================== */

exports.generateEmbeddings = async function (text) {

  if (!text) return [];

  try {

    const response = await axios.post(
      EMBEDDING_ENDPOINT,
      { text },
      { timeout: 15000 }
    );

    return response.data.embeddings || [];

  } catch (err) {

    console.warn("Retrying embedding generation...");

    try {

      const response = await axios.post(
        EMBEDDING_ENDPOINT,
        { text },
        { timeout: 15000 }
      );

      return response.data.embeddings || [];

    } catch (error) {

      console.error("Embedding generation failed:", error.message);

      return [];
    }
  }
};