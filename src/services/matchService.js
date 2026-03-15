const stringSimilarity = require("string-similarity");
const { getSemanticScore } = require("./semanticAI.service");
const { normalizeSkills } = require("./skillNormalizer.service"); // your normalizer

exports.calculateMatch = async (
  resumeSkills = [],
  jdSkills = [],
  resumeEmbeddings = null
) => {
  try {

    /* ======================================================
       1️⃣ Safety Checks
    ====================================================== */

    if (!Array.isArray(resumeSkills) || !Array.isArray(jdSkills)) {
      return {
        matchScore: 0,
        exactMatchScore: 0,
        semanticMatchScore: 0,
        matchedSkills: [],
        missingSkills: jdSkills || []
      };
    }

    if (jdSkills.length === 0) {
      return {
        matchScore: 70,
        exactMatchScore: 70,
        semanticMatchScore: 0,
        matchedSkills: [],
        missingSkills: []
      };
    }

    /* ======================================================
       2️⃣ Normalize Skills (IMPORTANT FIX)
    ====================================================== */

    resumeSkills = normalizeSkills(resumeSkills);
    jdSkills = normalizeSkills(jdSkills);

    const resumeSet = new Set(resumeSkills);
    const jdSet = new Set(jdSkills);

    let matchedSkills = [];
    let missingSkills = [];

    /* ======================================================
       3️⃣ Exact Matching
    ====================================================== */

    for (const jdSkill of jdSet) {
      if (resumeSet.has(jdSkill)) {
        matchedSkills.push(jdSkill);
      } else {
        missingSkills.push(jdSkill);
      }
    }

    const exactScore = Math.round(
      (matchedSkills.length / jdSet.size) * 100
    );

    /* ======================================================
       4️⃣ Fuzzy Matching
    ====================================================== */

    const fuzzyMatches = [];

    for (const missing of [...missingSkills]) {

      const { bestMatch } = stringSimilarity.findBestMatch(
        missing,
        resumeSkills
      );

      if (bestMatch.rating > 0.55) {

        fuzzyMatches.push(missing);
        matchedSkills.push(missing);

        missingSkills = missingSkills.filter(
          skill => skill !== missing
        );
      }
    }

    const fuzzyScore = Math.round(
      (fuzzyMatches.length / jdSet.size) * 100
    );

    /* ======================================================
       5️⃣ Semantic Matching (AI)
    ====================================================== */

    let semanticScore = 0;
    let semanticMissingSkills = [];

    try {

      if (missingSkills.length > 0) {

        const semanticResult = await getSemanticScore(
          resumeSkills,
          missingSkills,
          resumeEmbeddings
        );

        semanticScore =
          semanticResult?.semanticMatchScore || 0;

        semanticMissingSkills =
          semanticResult?.semanticMissingSkills || missingSkills;

      } else {

        /* IMPORTANT FIX
           If no missing skills → semantic score should equal keyword score
        */

        semanticScore = 100;
        semanticMissingSkills = [];

      }

    } catch (err) {

      console.warn(
        "Semantic scoring failed — using keyword match only",
        err.message
      );

      semanticScore = 0;
      semanticMissingSkills = missingSkills;
    }

    /* ======================================================
       6️⃣ Hybrid Score Calculation
    ====================================================== */

    const keywordScore = Math.min(
      exactScore + fuzzyScore,
      100
    );

    const finalScore = Math.round(
      keywordScore * 0.6 + semanticScore * 0.4
    );


    /* ======================================================
       7️⃣ Clean Missing Skills
    ====================================================== */

    const finalMissingSkills = semanticMissingSkills.filter(
      skill => !matchedSkills.includes(skill)
    );

    /* ======================================================
       8️⃣ Return Result
    ====================================================== */

    return {
      matchScore: finalScore,
      exactMatchScore: exactScore,
      semanticMatchScore: semanticScore,
      matchedSkills: [...new Set(matchedSkills)],
      missingSkills: [...new Set(finalMissingSkills)]
    };

  } catch (error) {

    console.error("Match Service Error:", error);

    return {
      matchScore: 0,
      exactMatchScore: 0,
      semanticMatchScore: 0,
      matchedSkills: [],
      missingSkills: jdSkills
    };
  }
};