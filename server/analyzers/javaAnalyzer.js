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
            output: stdout

        };

    }

    catch (error) {

        return {

            status: "Failed",

            errors: error.stderr,

            output: "Compilation Failed"

        };

    }

}