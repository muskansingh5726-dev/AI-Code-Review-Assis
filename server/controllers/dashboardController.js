import pool from "../config/db.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalResult,
      averageResult,
      languageResult,
      weekResult,
      recentResult,
    ] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) AS total
         FROM reviews
         WHERE user_id = $1`,
        [userId]
      ),

      pool.query(
        `SELECT COALESCE(ROUND(AVG(score)::numeric, 1), 0) AS average
         FROM reviews
         WHERE user_id = $1 AND score IS NOT NULL`,
        [userId]
      ),

      pool.query(
        `SELECT language, COUNT(*) AS total
         FROM reviews
         WHERE user_id = $1
         GROUP BY language
         ORDER BY COUNT(*) DESC, language ASC
         LIMIT 1`,
        [userId]
      ),

      pool.query(
        `SELECT COUNT(*) AS total
         FROM reviews
         WHERE user_id = $1
         AND created_at >= NOW() - INTERVAL '7 days'`,
        [userId]
      ),

      pool.query(
        `SELECT id, language, created_at, score, compiler_status
         FROM reviews
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 5`,
        [userId]
      ),
    ]);

    res.json({
      success: true,
      totalReviews: Number(totalResult.rows[0].total),
      averageScore: Number(averageResult.rows[0].average),
      mostUsedLanguage: languageResult.rows.length
        ? languageResult.rows[0].language
        : "N/A",
      weeklyReviews: Number(weekResult.rows[0].total),
      recentReviews: recentResult.rows,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load dashboard statistics.",
    });
  }
};