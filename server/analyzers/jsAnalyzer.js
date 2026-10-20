import vm from "node:vm";

export async function analyzeJavaScript(code) {
  if (typeof code !== "string" || !code.trim()) {
    return {
      status: "Failed",
      errors: ["Please enter JavaScript code."],
      output: ""
    };
  }

  const lines = [];
  const fakeConsole = {};

  for (const method of ["log", "info", "warn", "error", "debug"]) {
    fakeConsole[method] = (...args) => {
      lines.push(args.map(value => {
        if (typeof value === "string") return value;
        if (value instanceof Error) return value.stack || value.message;
        try {
          return typeof value === "undefined"
            ? "undefined"
            : JSON.stringify(value);
        } catch {
          return String(value);
        }
      }).join(" "));
    };
  }

  try {
    const context = vm.createContext({ console: fakeConsole });

    new vm.Script(code, { filename: "main.js" }).runInContext(context, {
      timeout: 2000
    });

    return {
      status: "Completed",
      errors: [],
      output: lines.join("\n")
    };
  } catch (error) {
    return {
      status: "Failed",
      errors: [error.message],
      output: lines.join("\n")
    };
  }
}
