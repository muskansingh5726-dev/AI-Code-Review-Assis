import express from "express";

import { analyzeJava } from "../analyzers/javaAnalyzer.js";
import { analyzePython } from "../analyzers/pythonAnalyzer.js";
import { analyzeJavaScript } from "../analyzers/jsAnalyzer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { language, code } = req.body;

    console.log("=================================");
    console.log("🚀 Run Request Received");
    console.log("Language:", language);
    console.log("Code:\n");
    console.log(code);
    console.log("=================================");

    let result;

    switch (language) {
      case "java":
        result = await analyzeJava(code);
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
          message: "Language not supported",
        });
    }

    console.log("✅ Execution Result:");
    console.log(result);

    res.json({
      success: true,
      output: result.output,
      status: result.status,
      executionTime: "0.12 sec",
      memory: "8 MB",
    });

  } catch (err) {
    console.error("❌ Run Route Error:");
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Execution Failed",
    });
  }
});

export default router;