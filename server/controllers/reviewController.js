import fs from "fs";
import pool from "../config/db.js";
import Groq from "groq-sdk";
import { analyzeJava } from "../analyzers/javaAnalyzer.js";
import { analyzePython } from "../analyzers/pythonAnalyzer.js";
import { analyzeJavaScript } from "../analyzers/jsAnalyzer.js";

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

        let analysis;

switch (language) {

    case "Java":
        analysis = await analyzeJava(code);
        break;

    case "Python":
        analysis = await analyzePython(code);
        break;

    case "JavaScript":
        analysis = await analyzeJavaScript(code);
        break;

    default:
        analysis = {
            status: "Completed",
            errors: [],
            output: ""
        };

}

      const prompt = `
You are a senior software engineer.

The compiler has already analyzed this code.

Compiler Status:
${analysis.status}

Compiler Errors:
${analysis.errors}

Compiler Output:
${analysis.output}

Now review ONLY the code quality.

Return ONLY this format.

AI Suggestions:
- Suggest improvements.
- Better naming.
- Best practices.
- Performance improvements.
- Security improvements if needed.

Do not repeat compiler errors.
Do not predict output.

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

      const suggestions = completion.choices[0].message.content.trim();
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
        suggestions,
        90
    ]
);
       res.json({
    success: true,

    language,

    status: analysis.status,

    errors: analysis.errors,

    output: analysis.output,

    suggestions,

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