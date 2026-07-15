import fs from "fs";
import pool from "../config/db.js";
import Groq from "groq-sdk";

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
Review this ${language} code.

Return ONLY a JSON object.

{
  "status":"Completed",
  "errors":[],
  "suggestions":[
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ],
  "output":""
}

IMPORTANT:

- suggestions MUST contain at least 3 items.
- Never return an empty suggestions array.
- If the code is already good, still give best-practice suggestions.
- Output should be the exact console output.
- Return ONLY JSON.

Code:

${code}
`;

        const completion = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [

                {
                    role: "system",
                    content: "You are an expert code reviewer."
                },

                {
                    role: "user",
                    content: prompt
                }

            ],

            temperature: 0

        });

        let ai;

try {
   let response = completion.choices[0].message.content;

// Remove ```json
response = response.replace(/```json/g, "");

// Remove ```
response = response.replace(/```/g, "");

// Remove spaces
response = response.trim();

ai = JSON.parse(response);

if (!Array.isArray(ai.suggestions)) {

    ai.suggestions = [];

}

while (ai.suggestions.length < 4) {

    const defaults = [

        "Use meaningful variable names.",

        "Improve code readability.",

        "Handle exceptions properly.",

        "Follow language coding standards."

    ];

    ai.suggestions.push(defaults[ai.suggestions.length]);

}
} catch {

    ai = {
        status: "Completed",
        errors: [],
        suggestions: [
            completion.choices[0].message.content
        ],
        output: ""
    };

}
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

                JSON.stringify(ai),

                90

            ]

        );
        console.log("AI RESPONSE:", ai);

        return res.json({

            success: true,

            language,

            status: ai.status,

            errors: ai.errors,

            suggestions: ai.suggestions,

            output: ai.output

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "AI Review Failed"

        });

    }

};