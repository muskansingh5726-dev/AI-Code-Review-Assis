
import express from "express";
import { performance } from "node:perf_hooks";

import { analyzeJava } from "../analyzers/javaAnalyzer.js";
import { analyzePython } from "../analyzers/pythonAnalyzer.js";
import { analyzeJavaScript } from "../analyzers/jsAnalyzer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const startedAt = performance.now();

  try {
    const { language, code, input = "" } = req.body ?? {};

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide code to execute.",
      });
    }

    console.log("---------------------------------");
    console.log("Run request received");
    console.log("Language:", language);
    console.log("Code length:", code.length, "characters");
    console.log("---------------------------------");

    let result;

    switch (language) {
      case "java":
        result = await analyzeJava(code, String(input ?? ""));
        break;

      case "python":
        result = await analyzePython(code);
        break;

      case "javascript":
        result = await analyzeJavaScript(code);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Language not supported.",
        });
    }

    const executionTime =
      `${((performance.now() - startedAt) / 1000).toFixed(2)} sec`;

    console.log("Execution status:", result.status);
    console.log("Execution time:", executionTime);

    return res.json({
      success: result.status === "Completed" ||
        result.status === "Accepted",
      output: result.output ?? "",
      errors: result.errors ?? [],
      status: result.status ?? "Unknown",
      executionTime,
      // Actual memory usage is not measured by the current runner.
      memory: "--",
    });
  } catch (err) {
    console.error("Run route error:", err);

    return res.status(500).json({
      success: false,
      message: "Execution failed on the server.",
    });
  }
});

export default router;
