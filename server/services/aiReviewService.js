import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

export const reviewWithAI = async ({
  language,
  code,
}) => {

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {

    const prompt = `
You are an expert code reviewer.

Review the following code.

Give:
- Score out of 100
- Readability suggestions
- Performance suggestions
- Best practices
- Security issues

Return ONLY JSON.

{
 "score":90,
 "suggestions":[
   {
      "category":"Readability",
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
      "You are an expert software engineer. Return ONLY valid JSON.",
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