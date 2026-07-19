import "../styles/Result.css";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import generatePDF from "../utils/generatePDF";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    language,
    compilerStatus,
    stdout,
    stderr,
    compileOutput,
    executionTime,
    memory,
    score,
    suggestions,
  } = location.state || {};

  const copyOutput = () => {
    navigator.clipboard.writeText(stdout || "");
    toast.success("Output Copied!");
  };

  const downloadReport = () => {
    generatePDF({
      language,
      score,
      compilerStatus,
      executionTime,
      memory,
      stdout,
      stderr,
      compileOutput,
      suggestions,
    });
  };

  return (
    <div className="result-page">
      <div className="result-header">
        <h1>🤖 AI Code Review Result</h1>

        <button
          className="back-btn"
          onClick={() => navigate("/review")}
        >
          New Review
        </button>
      </div>

      <div className="result-card">
        {/* Language */}
        <div className="info-row">
          <h3>Language</h3>
          <p>{language}</p>
        </div>

        {/* Compiler Status */}
        <div className="info-row">
          <h3>Compiler Status</h3>

          <p
            className={
              compilerStatus === "Accepted"
                ? "success"
                : "failed"
            }
          >
            {compilerStatus}
          </p>
        </div>

        {/* Score */}
        <div className="info-row">
          <h3>AI Review Score</h3>
          <p>{score}/100</p>
        </div>

        {/* Execution Time */}
        <div className="info-row">
          <h3>Execution Time</h3>
          <p>{executionTime} sec</p>
        </div>

        {/* Memory */}
        <div className="info-row">
          <h3>Memory Used</h3>
          <p>{memory} KB</p>
        </div>

        <hr />

        {/* Program Output */}
        <h2>🖥 Program Output</h2>

        <pre className="output-box">
          {stdout || "No Output"}
        </pre>

        <button
          className="copy-btn"
          onClick={copyOutput}
        >
          📋 Copy Output
        </button>

        <hr />

        {/* Compilation Errors */}
        <h2>🚨 Compilation Errors</h2>

        <pre className="error-box">
          {compileOutput || "No Compilation Errors"}
        </pre>

        <hr />

        {/* Runtime Errors */}
        <h2>⚠ Runtime Errors</h2>

        <pre className="error-box">
          {stderr || "No Runtime Errors"}
        </pre>

        <hr />

        {/* AI Suggestions */}
        <h2>🤖 AI Suggestions</h2>

        {Array.isArray(suggestions) &&
        suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <div
              key={index}
              className="suggestion-card"
            >
              <h4>{item.category}</h4>

              <p>{item.message}</p>
            </div>
          ))
        ) : (
          <p>No Suggestions</p>
        )}

        {/* Download PDF */}
        <button
          className="download-btn"
          onClick={downloadReport}
        >
          📄 Download PDF Report
        </button>
      </div>
    </div>
  );
}

export default Result;