const { getSemanticScore } = require("./semanticAI.service");
const { normalizeSkills } = require("./skillNormalizer.service");

/* ======================================================
   1️⃣ EXPERIENCE SCORE
====================================================== */

exports.calculateExperienceScore = (resumeExp = 0, requiredExp = 0) => {

  resumeExp = Number(resumeExp) || 0;
  requiredExp = Number(requiredExp) || 0;

  /* ======================================================
     1️⃣ If JD does not specify experience
  ====================================================== */

  if (!requiredExp) return 70;

  /* ======================================================
     2️⃣ Exact or higher experience
  ====================================================== */

  if (resumeExp >= requiredExp) {

    const excess = resumeExp - requiredExp;

    if (excess >= requiredExp * 2) return 100;

    if (excess >= requiredExp) return 98;

    return 95;
  }

  /* ======================================================
     3️⃣ Slightly below requirement (very common case)
  ====================================================== */

  const ratio = resumeExp / requiredExp;

  if (ratio >= 0.8) return 85;

  if (ratio >= 0.6) return 75;

  if (ratio >= 0.4) return 60;

  if (ratio >= 0.2) return 45;

  /* ======================================================
     4️⃣ Very low experience
  ====================================================== */

  if (resumeExp > 0) return 30;

  return 20;
};


/* ======================================================
   2️⃣ PROJECT RELEVANCE SCORE (Semantic AI)
====================================================== */

exports.calculateProjectRelevance = async (
  projectTech = [],
  jdSkills = []
) => {

  const resumeTechArray = Array.isArray(projectTech)
    ? projectTech
    : [projectTech];

  if (!jdSkills.length) return 70;
  if (!resumeTechArray.length) return 40;

  const normalizedProjectTech = normalizeSkills(resumeTechArray);
  const normalizedJDSkills = normalizeSkills(jdSkills);

  const semanticResult = await getSemanticScore(
    normalizedProjectTech,
    normalizedJDSkills
  );

  return semanticResult?.semanticMatchScore || 0;
};


/* ======================================================
   3️⃣ JOB TITLE SIMILARITY (Semantic AI)
====================================================== */

exports.calculateTitleSimilarity = async (
  resumeTitle = "",
  jdTitle = ""
) => {

  if (!jdTitle) return 70;

  if (!resumeTitle) return 40;

  const semanticResult = await getSemanticScore(
    [resumeTitle],
    [jdTitle]
  );

  return semanticResult?.semanticMatchScore || 0;
};


/* ======================================================
   4️⃣ EDUCATION SCORE (Hierarchy Based)
====================================================== */

const educationLevels = {
  phd: 5,
  doctorate: 5,
  masters: 4,
  mtech: 4,
  mba: 4,
  bachelors: 3,
  btech: 3,
  be: 3,
  diploma: 2,
  "12th": 1
};

exports.calculateEducationScore = (
  resumeEdu = "",
  requiredEdu = ""
) => {

  if (!requiredEdu) return 70;

  if (!resumeEdu) return 40;

  const resumeLevel =
    educationLevels[String(resumeEdu).toLowerCase()] || 0;

  const requiredLevel =
    educationLevels[String(requiredEdu).toLowerCase()] || 0;

  if (!requiredLevel) return 70;

  if (resumeLevel >= requiredLevel) return 100;

  return Math.round((resumeLevel / requiredLevel) * 100);
};


/* ======================================================
   5️⃣ RESUME QUALITY SCORE
====================================================== */

exports.calculateResumeQualityScore = (resume = {}) => {

  let score = 0;

  if (resume.extractedText && resume.extractedText.length > 400)
    score += 20;

  if (resume.skills && new Set(resume.skills).size >= 5)
    score += 20;

  if (resume.projects && resume.projects.length >= 2)
    score += 20;

  if (resume.totalExperience && resume.totalExperience > 0)
    score += 20;

  const actionVerbs = [
    "developed",
    "built",
    "designed",
    "implemented",
    "led"
  ];

  if (
    resume.extractedText &&
    actionVerbs.some((verb) =>
      resume.extractedText.toLowerCase().includes(verb)
    )
  ) {
    score += 20;
  }

  return score; // Max 100
};