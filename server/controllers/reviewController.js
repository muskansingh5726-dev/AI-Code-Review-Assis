import fs from "fs";
import pool from "../config/db.js";
import { compileCode } from "../services/compilerService.js";
import { reviewWithAI } from "../services/aiReviewService.js";

export const reviewCode = async (req, res) => {
  try {
    let { code, language } = req.body;

    // Read uploaded file
    if (req.file) {
      code = fs.readFileSync(req.file.path, "utf8");

      if (!language) {
        const extension = req.file.originalname
          .split(".")
          .pop()
          .toLowerCase();

        const map = {
          java: "java",
          py: "python",
          js: "javascript",
          cpp: "cpp",
          c: "c",
        };

        language = map[extension] || "java";
      }

      // Delete uploaded temp file
      fs.unlinkSync(req.file.path);
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Please paste code or upload a file.",
      });
    }

    // -----------------------------
    // Step 1 : Compile using Judge0
    // -----------------------------
    const compilerResult = await compileCode(language, code);

    // -----------------------------
    // Step 2 : AI Review
    // -----------------------------
    const aiReview = await reviewWithAI({
      language,
      code,
      compilerResult,
    });

    // -----------------------------
    // Step 3 : Save to Database
    // -----------------------------
   await pool.query(
  `
  INSERT INTO reviews
  (
    user_id,
    language,
    code,
    compiler_status,
    stdout,
    stderr,
    compile_output,
    execution_time,
    memory,
    review,
    score
  )
  VALUES
  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
  `,
  [
    req.user.id,
    language,
    code,
    compilerResult.status,
    compilerResult.stdout,
    compilerResult.stderr,
    compilerResult.compile_output,
    compilerResult.time,
    compilerResult.memory,
    JSON.stringify(aiReview),
    aiReview.score || 0,
  ]
);
    // -----------------------------
    // Step 4 : Send Response
    // -----------------------------
    return res.json({
      success: true,

      language,

      compilerStatus: compilerResult.status,

      stdout: compilerResult.stdout,

      stderr: compilerResult.stderr,

      compileOutput: compilerResult.compile_output,

      executionTime: compilerResult.time,

      memory: compilerResult.memory,

      score: aiReview.score,

      suggestions: aiReview.suggestions,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Code Review Failed",
    });
  }
};