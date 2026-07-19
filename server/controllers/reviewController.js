import fs from "fs";
import pool from "../config/db.js";
import { reviewWithAI } from "../services/aiReviewService.js";

export const reviewCode = async (req, res) => {
  try {
    let { code, language } = req.body;

    if (req.file) {
      code = fs.readFileSync(req.file.path, "utf8");

      if (!language) {
        const ext = req.file.originalname.split(".").pop().toLowerCase();

        const map = {
          java: "java",
          py: "python",
          js: "javascript",
          cpp: "cpp",
          c: "c",
        };

        language = map[ext] || "java";
      }

      fs.unlinkSync(req.file.path);
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Please enter some code.",
      });
    }

    const aiReview = await reviewWithAI({
      language,
      code,
    });

    await pool.query(
      `
      INSERT INTO reviews
      (
        user_id,
        language,
        code,
        review,
        score
      )
      VALUES
      ($1,$2,$3,$4,$5)
      `,
      [
        req.user.id,
        language,
        code,
        JSON.stringify(aiReview),
        aiReview.score || 0,
      ]
    );

    return res.json({
      success: true,
      language,
      compilerStatus: "Not Executed",
      stdout: "",
      stderr: "",
      compileOutput: "",
      executionTime: "0",
      memory: "0",
      score: aiReview.score,
      suggestions: aiReview.suggestions,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success:false,
      message:"Code Review Failed"
    });

  }
};