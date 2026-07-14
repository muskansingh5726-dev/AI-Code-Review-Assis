import fs from "fs";
import pool from "../config/db.js";
import Groq from "groq-sdk";

// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY,
// });

export const reviewCode = async (req, res) => {

    try {
        const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

        let { code, language } = req.body;

        // Read uploaded file
        if (req.file) {

            code = fs.readFileSync(req.file.path, "utf-8");

            if (!language) {

                const extension = req.file.originalname
                    .split(".")
                    .pop()
                    .toLowerCase();

                const map = {
                    java: "Java",
                    py: "Python",
                    js: "JavaScript",
                    cpp: "C++",
                    c: "C"
                };

                language = map[extension] || "Unknown";
            }
        }

        if (!code) {

            return res.status(400).json({
                success: false,
                message: "Please paste code or upload a file."
            });

        }

        const prompt = `
You are an expert software engineer.

Analyze the following ${language} code.

Return ONLY in the exact format below.

Language:
${language}

Status:
Completed OR Failed

Errors:
- Mention syntax errors.
- Mention logical errors.
- Mention bad coding practices.
- If none, write "No Errors Found"

AI Suggestions:
- Give 3-5 concise suggestions.

Output:
- If code is correct, predict the output.
- If code has errors write:
Compilation Failed

Do NOT write introductions.
Do NOT explain everything.
Do NOT write paragraphs.

Code:

${code}
`;

        const completion = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [

                {
                    role: "system",
                    content:
                        "You are an expert code reviewer."
                },

                {
                    role: "user",
                    content: prompt
                }

            ],

            temperature: 0.3,

        });

        const aiReview = completion.choices[0].message.content.trim();

        // Save review
        await pool.query(

            `
            INSERT INTO reviews
            (user_id, language, code, review, score)
            VALUES ($1,$2,$3,$4,$5)
            `,

            [
                req.user.id,
                language,
                code,
                aiReview,
                90
            ]

        );

       res.json({
    success: true,
    language,
    review: aiReview,
    code
});

    } catch (error) {

        console.log("GROQ ERROR:");
        console.log(error);

        res.status(500).json({

            success: false,
            message: "AI Review Failed"

        });

    }

};