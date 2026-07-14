import pool from "../config/db.js";

// Save Review
export const saveReview = async (req, res) => {

    try {

        const { language, code, review } = req.body;

        const userId = req.user.id;

        await pool.query(
            `
            INSERT INTO reviews
            (user_id, language, code, review)
            VALUES ($1,$2,$3,$4)
            `,
            [userId, language, code, review]
        );

        res.status(201).json({
            success: true,
            message: "Review Saved Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
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

        res.json({
            success: true,
            reviews: result.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// Delete Review

export const deleteReview = async (req, res) => {

    try {

        const { id } = req.params;

        const userId = req.user.id;

        await pool.query(
            `
            DELETE FROM reviews
            WHERE id=$1
            AND user_id=$2
            `,
            [id, userId]
        );

        res.json({
            success: true,
            message: "Review Deleted Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};