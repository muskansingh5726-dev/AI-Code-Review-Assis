
import "./ReviewSummary.css";

function Metric({ title, value }) {
  const number = Number(value);
  const safeValue = Number.isFinite(number)
    ? Math.max(0, Math.min(100, number))
    : 0;

  return (
    <div className="metric">
      <div className="metric-header">
        <span>{title}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="progress">
        <div
          className="progress-fill"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function ReviewSummary({ reviewData }) {
  if (!reviewData) {
    return (
      <div className="review-summary">
        <h2>AI Review Summary</h2>
        <p>Run AI Review to see your results.</p>
      </div>
    );
  }

  const suggestions = Array.isArray(reviewData.suggestions)
    ? reviewData.suggestions
    : [];

  return (
    <section className="review-summary">
      <div className="summary-title">
        <h2>AI Review Summary</h2>
        <div className="score-circle">
          <h1>{reviewData.score ?? "--"}</h1>
          <span>Overall / 100</span>
        </div>
      </div>

      <Metric title="Performance" value={reviewData.performance} />
      <Metric title="Readability" value={reviewData.readability} />
      <Metric title="Security" value={reviewData.security} />
      <Metric
        title="Maintainability"
        value={reviewData.maintainability}
      />

      <div className="suggestions">
        <h3>AI Findings ({suggestions.length})</h3>

        {suggestions.length === 0 ? (
          <div className="suggestion-card">
            No findings were returned for this review.
          </div>
        ) : (
          suggestions.map((item, index) => {
            const category =
              typeof item === "string"
                ? "Suggestion"
                : item?.category || "General";

            const message =
              typeof item === "string"
                ? item
                : item?.message || "No explanation provided.";

            const severity = ["high", "medium", "low"].includes(
              String(item?.severity).toLowerCase()
            )
              ? String(item.severity).toLowerCase()
              : "low";

            const evidence =
              typeof item === "object" && item
                ? item.evidence
                : "";

            return (
              <article
                key={index}
                className="suggestion-card"
              >
                <div className="finding-header">
                  <strong>{category}</strong>
                  <span className={`severity-badge severity-${severity}`}>
                    {severity.toUpperCase()}
                  </span>
                </div>

                <p>{message}</p>

                {evidence && (
                  <div className="finding-evidence">
                    <strong>Code evidence</strong>
                    <pre>
                      <code>{String(evidence)}</code>
                    </pre>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default ReviewSummary;
