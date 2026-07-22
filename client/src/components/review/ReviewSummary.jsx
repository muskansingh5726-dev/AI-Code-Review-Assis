import "./ReviewSummary.css";

function Metric({ title, value }) {
  return (
    <div className="metric">
      <div className="metric-header">
        <span>{title}</span>
        <span>{value}%</span>
      </div>

      <div className="progress">
        <div
          className="progress-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ReviewSummary({ reviewData }) {

  if (!reviewData) {
    return (
      <div className="review-summary">

        <h2>🤖 AI Review Summary</h2>

        <p style={{color:"#94A3B8"}}>
          Run an AI Review to see analysis and suggestions.
        </p>

      </div>
    );
  }

  return (
    <div className="review-summary">

      <div className="summary-title">

        <h2>🤖 AI Review Summary</h2>

        <div className="score-circle">

          <h1>{reviewData.score}</h1>

          <span>Overall</span>

        </div>

      </div>

      <Metric
        title="Performance"
        value={reviewData.performance}
      />

      <Metric
        title="Readability"
        value={reviewData.readability}
      />

      <Metric
        title="Security"
        value={reviewData.security}
      />

      <Metric
        title="Maintainability"
        value={reviewData.maintainability}
      />

      <div className="suggestions">

        <h3 style={{color:"#F8FAFC"}}>
          💡 AI Suggestions
        </h3>

        {reviewData.suggestions.length === 0 ? (

          <div className="suggestion-card">
            No suggestions. Great job! 🎉
          </div>

        ) : (

          reviewData.suggestions.map((item,index)=>(
            <div
              key={index}
              className="suggestion-card"
            >
              ✅ {item}
            </div>
          ))

        )}

      </div>

    </div>
  );
}

export default ReviewSummary;