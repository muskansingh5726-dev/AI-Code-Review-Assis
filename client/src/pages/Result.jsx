import "../styles/Result.css";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {

    const navigate = useNavigate();
    const location = useLocation();

    const {
        language,
        status,
        errors,
        output,
        suggestions
    } = location.state || {};

    const copyOutput = () => {

        navigator.clipboard.writeText(output || "");

        toast.success("Output Copied!");

    };

    return (

        <div className="result-page">

            <div className="result-header">

                <h1>🤖 AI Review Result</h1>

                <button
                    className="back-btn"
                    onClick={() => navigate("/review")}
                >
                    New Review
                </button>

            </div>

            <div className="result-card">

                <div className="info-row">

                    <h3>Language</h3>

                    <p>{language}</p>

                </div>

                <div className="info-row">

                    <h3>Status</h3>

                    <p className={status === "Failed" ? "failed" : "success"}>
                        {status === "Failed"
                            ? "🔴 Failed"
                            : "🟢 Completed"}
                    </p>

                </div>

                <hr />

                <h2>🚨 Static Analysis</h2>

                <pre className="error-box">

                    {Array.isArray(errors)
    ? errors.length === 0
        ? "No Errors Found"
        : errors.map(
              (e) => `Line ${e.line}: ${e.message}`
          ).join("\n")
    : errors || "No Errors Found"}

                </pre>

                <hr />

                <h2>🤖 AI Suggestions</h2>

                <pre className="suggestion-box">

                    {suggestions || "No Suggestions"}

                </pre>

                <hr />

                <h2>🖥 Output</h2>

                <pre className="output-box">

                    {output || "No Output"}

                </pre>

                <button
                    className="copy-btn"
                    onClick={copyOutput}
                >
                    📋 Copy Output
                </button>

            </div>

        </div>

    );

}

export default Result;