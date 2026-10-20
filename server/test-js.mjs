import { analyzeJavaScript } from "./analyzers/jsAnalyzer.js";

const result = await analyzeJavaScript(`
console.log("Hello World");
console.log(2 + 3);
`);

console.log(result);
