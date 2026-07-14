import "../styles/DashboardPreview.css";

function DashboardPreview() {
  return (
    <section className="dashboard-preview">
      <div className="preview-left">
        <h2>See Your AI Code Review Instantly</h2>

        <p>
          Upload your code or paste a snippet and receive an instant
          AI-powered report with bug detection, performance analysis,
          security suggestions and code quality score.
        </p>

        <button>Try Demo</button>
      </div>

      <div className="preview-right">

        <div className="review-card">

          <h3>AI Review Report</h3>

          <div className="score">
            <span>Overall Score</span>
            <strong>92 / 100</strong>
          </div>

          <div className="review-item">
            🐞 Bugs
            <span>5</span>
          </div>

          <div className="review-item">
            ⚡ Performance
            <span>Excellent</span>
          </div>

          <div className="review-item">
            🔒 Security
            <span>2 Warnings</span>
          </div>

          <div className="review-item">
            🧠 AI Suggestions
            <span>12</span>
          </div>

          <div className="review-item">
            📄 Complexity
            <span>Low</span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default DashboardPreview;