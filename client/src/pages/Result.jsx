import "../styles/Result.css";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {

    const navigate = useNavigate();
    const location = useLocation();

    const { language, review } = location.state || {};

    const copyOutput = () => {

        const outputMatch = review.match(/Output:\s*([\s\S]*)/i);

        const output = outputMatch
            ? outputMatch[1].trim()
            : "";

        navigator.clipboard.writeText(output);

        toast.success("Output Copied!");

    };

    const getSection = (title) => {

        const regex = new RegExp(
            `${title}:([\\s\\S]*?)(?=Language:|Status:|Errors:|AI Suggestions:|Output:|$)`,
            "i"
        );

        const match = review.match(regex);

        return match ? match[1].trim() : "";

    };

    const status = getSection("Status");
    const errors = getSection("Errors");
    const suggestions = getSection("AI Suggestions");
    const output = getSection("Output");

    return (

        <div className="result-page">

            <div className="result-header">

                <h1>🤖 AI Review</h1>

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

                    <p
                        className={
                            status.toLowerCase().includes("failed")
                                ? "failed"
                                : "success"
                        }
                    >
                        {status}
                    </p>

                </div>

                <hr />

                <h2>❌ Errors</h2>

                <pre className="error-box">

                    {errors || "No Errors Found"}

                </pre>

                <hr />

                <h2>💡 AI Suggestions</h2>

                <pre className="suggestion-box">

                    {suggestions}

                </pre>

                <hr />

                <h2>🖥 Output</h2>

                <pre className="output-box">

                    {output}

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