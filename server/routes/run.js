
import express from "express";
import { performance } from "node:perf_hooks";

import { analyzeJava } from "../analyzers/javaAnalyzer.js";
import { analyzePython } from "../analyzers/pythonAnalyzer.js";
import { analyzeJavaScript } from "../analyzers/jsAnalyzer.js";

const router = express.Router();

const MAX_CODE_LENGTH = 20_000;
const MAX_INPUT_LENGTH = 10_000;
const MAX_CONCURRENT_RUNS = 3;

let activeRuns = 0;

router.post("/", async (req, res) => {
    if (process.env.ENABLE_CODE_EXECUTION !== "true") {
    return res.status(503).json({
      success: false,
      message: "Code execution is temporarily unavailable."
    });
  }
  const startedAt = performance.now();

  try {
    const { language, code, input = "" } = req.body ?? {};

    // Validate the submitted code.
    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide code to execute.",
      });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return res.status(413).json({
        success: false,
        message: `Code must not exceed ${MAX_CODE_LENGTH} characters.`,
      });
    }

    // Validate language and optional program input.
    const supportedLanguages = ["java", "python", "javascript"];

    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Language not supported.",
      });
    }

    if (
      typeof input !== "string" ||
      input.length > MAX_INPUT_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message: "Input must be text within the allowed length.",
      });
    }

    // Limit concurrent executions within this server process.
    if (activeRuns >= MAX_CONCURRENT_RUNS) {
      return res.status(429).json({
        success: false,
        message: "The code runner is busy. Please try again shortly.",
      });
    }

    activeRuns++;

    try {
      console.log(
        `Run request: ${language}, ${code.length} characters`
      );

      let result;

      switch (language) {
        case "java":
          result = await analyzeJava(code, input);
          break;

        case "python":
          result = await analyzePython(code);
          break;

        case "javascript":
          result = await analyzeJavaScript(code);
          break;
      }

      const executionTime =
        `${((performance.now() - startedAt) / 1000).toFixed(2)} sec`;

      console.log(
        `Execution status: ${result.status}; time: ${executionTime}`
      );

      return res.json({
        success:
          result.status === "Completed" ||
          result.status === "Accepted",
        output: result.output ?? "",
        errors: result.errors ?? [],
        status: result.status ?? "Unknown",
        executionTime,
        memory: "--",
      });
    } finally {
      activeRuns--;
    }
  } catch (err) {
    console.error("Run route error:", err);

    return res.status(500).json({
      success: false,
      message: "Execution failed on the server.",
    });
  }
});

export default router;
