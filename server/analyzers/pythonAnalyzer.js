import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function analyzePython(code) {
  if (typeof code !== "string" || !code.trim()) {
    return {
      status: "Failed",
      errors: ["Please enter Python code."],
      output: ""
    };
  }

  try {
    const { stdout, stderr } = await execFileAsync(
      "python",
      ["-c", code],
      {
        timeout: 3000,
        windowsHide: true,
        maxBuffer: 1024 * 1024
      }
    );

    return {
      status: "Completed",
      errors: stderr ? [stderr.trim()] : [],
      output: stdout.trimEnd()
    };
  } catch (error) {
    return {
      status: "Failed",
      errors: [
        error.killed
          ? "Execution timed out after 3 seconds."
          : (error.stderr || error.message).trim()
      ],
      output: error.stdout || ""
    };
  }
}
