import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

export const reviewWithAI = async ({
  language,
  code,
  compilerResult,
}) => {

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {

    const prompt = `
You are a senior software engineer and code reviewer.

The code has ALREADY been compiled.

Do NOT predict program output.

Use the compiler results below to review the code.

Language:
${language}

Compiler Status:
${compilerResult.status}

Compiler Errors:
${compilerResult.compile_output || compilerResult.stderr || "None"}

Program Output:
${compilerResult.stdout || "No Output"}

Execution Time:
${compilerResult.time} sec

Memory Used:
${compilerResult.memory} KB

Review ONLY the code quality.

Return ONLY valid JSON.

{
  "score":95,
  "suggestions":[
      {
          "category":"Readability",
          "message":"..."
      },
      {
          "category":"Performance",
          "message":"..."
      },
      {
          "category":"Security",
          "message":"..."
      },
      {
          "category":"Best Practice",
          "message":"..."
      }
  ]
}

Code:

${code}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You are an expert code reviewer. Never execute or predict output. Use the supplied compiler result.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let response = completion.choices[0].message.content;

    response = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const ai = JSON.parse(response);

    if (!Array.isArray(ai.suggestions)) {
      ai.suggestions = [];
    }

    return ai;

  } catch (error) {

    console.error("AI Review Error:", error);

    return {
      score: 0,
      suggestions: [
        {
          category: "AI",
          message: "Unable to generate AI review.",
        },
      ],
    };
  }
};