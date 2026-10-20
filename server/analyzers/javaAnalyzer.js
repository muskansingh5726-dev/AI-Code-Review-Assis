
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timeout = setTimeout(() => {
      child.kill();
      finish(
        new Error("Execution timed out. Check whether your program needs more input.")
      );
    }, options.timeout ?? 10000);

    function finish(error, result) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);

      if (error) reject(error);
      else resolve(result);
    }

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      finish(error);
    });

    child.on("close", (code, signal) => {
      finish(null, { code, signal, stdout, stderr });
    });

    child.stdin.on("error", () => {
    });

    child.stdin.end(options.input ?? "");
  });
}

export async function analyzeJava(code, input = "") {
  let tempDir;

  try {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "code-review-java-"));

    const match = code.match(
      /public\s+class\s+([A-Za-z_$][A-Za-z0-9_$]*)/
    );
    const className = match?.[1] || "Main";
    const filePath = path.join(tempDir, `${className}.java`);

    await fs.writeFile(filePath, code, "utf8");

    const compile = await runProcess(
      "javac",
      [filePath],
      { timeout: 15000 }
    );

    if (compile.code !== 0) {
      return {
        status: "Compilation Failed",
        errors: [compile.stderr.trim() || "Java compilation failed."],
        output: compile.stderr.trim() || "Compilation Failed",
      };
    }

    const execution = await runProcess(
      "java",
      ["-cp", tempDir, className],
      {
        timeout: 10000,
        input: String(input ?? ""),
      }
    );

    if (execution.code !== 0) {
      return {
        status: execution.signal ? "Timed Out" : "Runtime Error",
        errors: [
          execution.stderr.trim() ||
            "Program exited with a non-zero status.",
        ],
        output:
          execution.stdout +
          (execution.stderr ? `\n${execution.stderr}` : ""),
      };
    }

    return {
      status: "Completed",
      errors: [],
      output: execution.stdout,
    };
  } catch (error) {
    const message = error.message || "Java execution failed.";

    if (error.code === "ENOENT") {
      return {
        status: "Failed",
        errors: ["Java JDK is not installed or javac/java is not on PATH."],
        output: "Java JDK not found. Install a JDK and configure PATH.",
      };
    }

    return {
      status: "Failed",
      errors: [message],
      output: message,
    };
  } finally {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
