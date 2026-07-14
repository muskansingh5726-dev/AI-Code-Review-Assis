import pool from "../config/db.js";

export const getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        const totalResult = await pool.query(
            "SELECT COUNT(*) FROM reviews WHERE user_id=$1",
            [userId]
        );

        const languageResult = await pool.query(
            `
            SELECT language, COUNT(*) AS total
            FROM reviews
            WHERE user_id=$1
            GROUP BY language
            ORDER BY total DESC
            LIMIT 1
            `,
            [userId]
        );

        const latestResult = await pool.query(
            `
            SELECT created_at
            FROM reviews
            WHERE user_id=$1
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [userId]
        );

        const weekResult = await pool.query(
            `
            SELECT COUNT(*)
            FROM reviews
            WHERE user_id=$1
            AND created_at >= NOW() - INTERVAL '7 days'
            `,
            [userId]
        );

        const recentReviews = await pool.query(
            `
            SELECT id, language, created_at
            FROM reviews
            WHERE user_id=$1
            ORDER BY created_at DESC
            LIMIT 5
            `,
            [userId]
        );

        res.json({
            success: true,
            totalReviews: Number(totalResult.rows[0].count),
            mostUsedLanguage:
                languageResult.rows.length
                    ? languageResult.rows[0].language
                    : "N/A",
            latestReview:
                latestResult.rows.length
                    ? latestResult.rows[0].created_at
                    : null,
            weeklyReviews: Number(weekResult.rows[0].count),
            recentReviews: recentReviews.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};