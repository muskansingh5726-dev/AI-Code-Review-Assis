import "../styles/History.css";
import { useEffect, useState } from "react";
import API from "../api/api";

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
    <div className="history-page">
      <h1>Review History</h1>

      <p>All your previous AI code reviews.</p>

      {reviews.length === 0 ? (
        <h3>No reviews found.</h3>
      ) : (
        reviews.map((review) => (
          <div className="history-card" key={review.id}>
            <div className="history-header">
              <h3>{review.language}</h3>

              <span>{review.score}/100</span>
            </div>

            <p>
              {new Date(review.created_at).toLocaleString()}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {review.compiler_status}
            </p>

            <p>
              <strong>Execution Time:</strong>{" "}
              {review.execution_time} sec
            </p>

            <p>
              <strong>Memory:</strong>{" "}
              {review.memory} KB
            </p>

            <h4>Program Output</h4>

            <pre>{review.stdout || "No Output"}</pre>

            <h4>Compilation Errors</h4>

            <pre>
              {review.compile_output ||
                "No Compilation Errors"}
            </pre>

            <h4>Runtime Errors</h4>

            <pre>
              {review.stderr || "No Runtime Errors"}
            </pre>

            <h4>AI Suggestions</h4>

            {review.review?.suggestions?.length ? (
              review.review.suggestions.map((item, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                >
                  <strong>{item.category}</strong>

                  <p>{item.message}</p>
                </div>
              ))
            ) : (
              <p>No Suggestions</p>
            )}

            <button
              onClick={() => deleteReview(review.id)}
            >
              Delete Review
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default History;