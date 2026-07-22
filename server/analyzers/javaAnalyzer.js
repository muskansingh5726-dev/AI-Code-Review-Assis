import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function analyzeJava(code) {
    const tempDir = path.join(process.cwd(), "temp");

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // Detect public class name
    const match = code.match(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/);

    const className = match ? match[1] : "Main";

    const filePath = path.join(tempDir, `${className}.java`);

    // Remove old files so they don't interfere
    fs.readdirSync(tempDir).forEach(file => {
        if (file.endsWith(".java") || file.endsWith(".class")) {
            fs.unlinkSync(path.join(tempDir, file));
        }
    });

    fs.writeFileSync(filePath, code);

    try {
        // Compile
        await execAsync(`javac "${filePath}"`);

        // Execute
        const { stdout } = await execAsync(
            `java -cp "${tempDir}" ${className}`
        );

        return {
            status: "Completed",
            errors: [],
            output: stdout.trim(),
        };

    } catch (error) {

        if (
            error.stderr &&
            (error.stderr.includes("javac: not found") ||
             error.stderr.includes("'javac' is not recognized"))
        ) {
            return {
                status: "Failed",
                errors: ["Java JDK is not installed or javac is not available."],
                output: "Compilation Failed",
            };
        }

        return {
            status: "Failed",
            errors: error.stderr
                ? error.stderr.trim().split("\n")
                : ["Compilation Failed"],
            output: "Compilation Failed",
        };
    }
}