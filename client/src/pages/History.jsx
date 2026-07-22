import "../styles/History.css";
import { useEffect, useState } from "react";
import API from "../api/api";
import Sidebar from "../components/Sidebar";

function History() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(response.data.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReview = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchHistory();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Sidebar />

      <div className="history-page">
        <h1>📜 Review History</h1>

        <p className="history-subtitle">
          All your previous AI Code Reviews.
        </p>

        {reviews.length === 0 ? (
          <div className="empty-history">
            <h2>No Reviews Found 😕</h2>
            <p>Start reviewing your code to build your history.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div className="history-card" key={review.id}>
              <div className="history-header">
                <div>
                  <h2>{review.language}</h2>

                  <small>
                    {new Date(review.created_at).toLocaleString()}
                  </small>
                </div>

                <div className="score-box">
                  ⭐ {review.score}/100
                </div>
              </div>

              <div className="status-row">
                <span>
                  <strong>Status:</strong>{" "}
                  {review.compiler_status}
                </span>

                <span>
                  <strong>Execution:</strong>{" "}
                  {review.execution_time}s
                </span>

                <span>
                  <strong>Memory:</strong>{" "}
                  {review.memory} KB
                </span>
              </div>

              <h3>💻 Submitted Code</h3>

              <pre className="code-block">
                {review.code}
              </pre>

              <h3>🤖 AI Suggestions</h3>

              {review.review?.suggestions?.length ? (
                review.review.suggestions.map((item, index) => (
                  <div
                    className="suggestion-card"
                    key={index}
                  >
                    <h4>{item.category}</h4>

                    <p>{item.message}</p>
                  </div>
                ))
              ) : (
                <p>No Suggestions Available.</p>
              )}

              <button
                className="delete-btn"
                onClick={() => deleteReview(review.id)}
              >
                🗑 Delete Review
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default History;