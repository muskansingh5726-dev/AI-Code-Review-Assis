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
You are an expert ${language} software engineer.

Analyze the following code.

Return ONLY valid JSON.

{
  "status":"Completed",
  "errors":[
      {
          "line":1,
          "message":""
      }
  ],
  "suggestions":[
      "",
      "",
      "",
      ""
  ],
  "output":""
}

Rules:

1. Detect syntax errors.
2. Detect logical errors.
3. Mention exact line numbers whenever possible.
4. If no errors return an empty array [].
5. Predict the actual output of the program.
6. If the code has syntax errors return:
   "Compilation Failed"
7. Suggestions should be short.
8. Never generate improved code.
9. Never explain.
10. Never use markdown.
11. Return ONLY JSON.

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

            ai = JSON.parse(
                completion.choices[0].message.content
            );

        } catch {

            return res.status(500).json({

                success: false,
                message: "AI returned an invalid response."

            });

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