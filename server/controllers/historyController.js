import pool from "../config/db.js";

// Save Review
export const saveReview = async (req, res) => {
  try {
    const {
      language,
      code,
      compilerStatus,
      stdout,
      stderr,
      compileOutput,
      executionTime,
      memory,
      review,
      score,
    } = req.body;

    const userId = req.user.id;

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
        userId,
        language,
        code,
        compilerStatus,
        stdout,
        stderr,
        compileOutput,
        executionTime,
        memory,
        JSON.stringify(review),
        score,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Review Saved Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get History
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM reviews
      WHERE user_id=$1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const reviews = result.rows.map((review) => ({
      ...review,
      review:
        typeof review.review === "string"
          ? JSON.parse(review.review)
          : review.review,
    }));

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM reviews
      WHERE id=$1
      AND user_id=$2
      `,
      [id, req.user.id]
    );

    res.json({
      success: true,
      message: "Review Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};