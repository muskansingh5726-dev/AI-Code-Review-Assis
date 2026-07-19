import axios from "axios";

const LANGUAGE_MAP = {
  java: 62,
  python: 71,
  javascript: 63,
  c: 50,
  cpp: 54,
};

function prepareJavaCode(code) {
  if (!code) return code;

  // Rename the first public class to Main so Judge0 can compile it.
  const publicClassRegex = /public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/;

  if (publicClassRegex.test(code)) {
    return code.replace(publicClassRegex, "public class Main");
  }

  return code;
}

export const compileCode = async (language, code) => {
  try {
    const lang = language.toLowerCase();

    if (lang === "java") {
      code = prepareJavaCode(code);
    }

    const languageId = LANGUAGE_MAP[lang];

    if (!languageId) {
      throw new Error("Unsupported language.");
    }

    // Submit source code
    const submit = await axios.post(
      `https://${process.env.RAPIDAPI_HOST}/submissions?base64_encoded=false&wait=false`,
      {
        language_id: languageId,
        source_code: code,
        stdin: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
        },
      }
    );

    const token = submit.data.token;

    // Poll until execution finishes
    let result;

    while (true) {
      const response = await axios.get(
        `https://${process.env.RAPIDAPI_HOST}/submissions/${token}?base64_encoded=false`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
          },
        }
      );

      const statusId = response.data.status.id;

      // 1 = In Queue, 2 = Processing
      if (statusId !== 1 && statusId !== 2) {
        result = response.data;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return {
      success: true,
      status: result.status.description,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compile_output: result.compile_output || "",
      time: result.time || "0",
      memory: result.memory || "0",
    };
  } catch (error) {
    console.error("Judge0 Error:", error.response?.data || error.message);

    return {
      success: false,
      status: "Compilation Failed",
      stdout: "",
      stderr: "",
      compile_output:
        error.response?.data?.message ||
        "Unable to compile the submitted code.",
      time: "0",
      memory: "0",
    };
  }
};