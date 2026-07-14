import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {

    console.log("🔥 SIGNUP HIT");
    console.log("Request Body:", req.body);

    try {

        const { name, email, password } = req.body;
        console.log("Signup Data:", { name, email, password });

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });
        }

      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
            [name, email, hashedPassword]
        );
        console.log("User inserted successfully!");

        res.status(201).json({
            success: true,
            message: "User registered successfully!"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });
        }

        // Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = result.rows[0];

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });
        }
        const token = jwt.sign(
    {
        id: user.id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

      res.status(200).json({
    success: true,
    message: "Login Successful 🎉",
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email
    }
});  

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};