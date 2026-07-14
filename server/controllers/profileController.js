import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        // User Details
        const userResult = await pool.query(
            `
            SELECT id, name, email
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Total Reviews
        const reviewResult = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM reviews
            WHERE user_id = $1
            `,
            [userId]
        );

        // Favourite Language
        const languageResult = await pool.query(
            `
            SELECT language, COUNT(*) AS total
            FROM reviews
            WHERE user_id = $1
            GROUP BY language
            ORDER BY total DESC
            LIMIT 1
            `,
            [userId]
        );

        res.json({
            success: true,
            user: userResult.rows[0],
            totalReviews: Number(reviewResult.rows[0].total),
            favouriteLanguage:
                languageResult.rows.length > 0
                    ? languageResult.rows[0].language
                    : "N/A"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
export const updateProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const { name, email } = req.body;

        if (!name || !email) {

            return res.status(400).json({
                success: false,
                message: "Name and Email are required."
            });

        }

        const existingUser = await pool.query(
            `
            SELECT id
            FROM users
            WHERE email = $1
            AND id != $2
            `,
            [email, userId]
        );

        if (existingUser.rows.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });

        }

        await pool.query(
            `
            UPDATE users
            SET name = $1,
                email = $2
            WHERE id = $3
            `,
            [name, email, userId]
        );

        res.json({
            success: true,
            message: "Profile updated successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
export const changePassword = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                success: false,
                message: "Both passwords are required."
            });

        }

        const result = await pool.query(
            `
            SELECT password
            FROM users
            WHERE id=$1
            `,
            [userId]
        );

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });

        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await pool.query(
            `
            UPDATE users
            SET password=$1
            WHERE id=$2
            `,
            [hashedPassword, userId]
        );

        res.json({
            success: true,
            message: "Password updated successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};