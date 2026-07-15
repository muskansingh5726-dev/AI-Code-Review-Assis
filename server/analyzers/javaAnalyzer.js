import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function analyzeJava(code) {

    const tempDir = path.join(process.cwd(), "temp");

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const filePath = path.join(tempDir, "Main.java");

    fs.writeFileSync(filePath, code);

    try {

        await execAsync(`javac "${filePath}"`);

        const { stdout } = await execAsync(
            `java -cp "${tempDir}" Main`
        );

        return {
            status: "Completed",
            errors: [],
            output: stdout.trim()
        };

    } catch (error) {

        // javac not available on deployment
        if (error.stderr?.includes("javac: not found")) {

            return {
                status: "Completed",
                errors: [
                    "Java compiler is unavailable on the deployed server."
                ],
                output: "Output unavailable on deployment."
            };

        }

        return {

            status: "Failed",

            errors: error.stderr
                ? error.stderr.trim().split("\n")
                : ["Compilation Failed"],

            output: "Compilation Failed"

        };

    }

}