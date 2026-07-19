import "../styles/Result.css";
import { useLocation, useNavigate } from "react-router-dom";
import generatePDF from "../utils/generatePDF";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const { language, score, suggestions } = location.state || {};

  const downloadReport = () => {
    generatePDF({
      language,
      score,
      suggestions,
    });
  };

  return (
    <div className="result-page">
      <div className="result-header">
        <h1>🤖 AI Code Review Report</h1>

        <button
          className="back-btn"
          onClick={() => navigate("/review")}
        >
          New Review
        </button>
      </div>

      <div className="result-card">

        <div className="info-row">
          <h3>Programming Language</h3>
          <p>{language}</p>
        </div>

        <div className="info-row">
          <h3>Review Status</h3>
          <p className="success">Completed ✅</p>
        </div>

        <div className="info-row">
          <h3>AI Review Score</h3>
          <p>
            <strong>{score}</strong>/100
          </p>
        </div>

        <hr />

        <h2>💡 AI Suggestions</h2>

        {Array.isArray(suggestions) &&
        suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <div
              key={index}
              className="suggestion-card"
            >
              <h4>
                {index + 1}. {item.category}
              </h4>

              <p>{item.message}</p>
            </div>
          ))
        ) : (
          <div className="suggestion-card">
            <h4>AI</h4>
            <p>No suggestions generated.</p>
          </div>
        )}

        <button
          className="download-btn"
          onClick={downloadReport}
        >
          📄 Download AI Report
        </button>

      </div>
    </div>
  );
}

export default Result;