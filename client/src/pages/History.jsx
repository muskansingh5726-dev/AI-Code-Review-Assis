
import "../styles/History.css";
import { useCallback, useEffect, useState } from "react";
import API from "../api/api";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";

function History() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please log in to view review history.");
        setReviews([]);
        return;
      }

      const response = await API.get("/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews(
        Array.isArray(response.data.reviews)
          ? response.data.reviews
          : []
      );
    } catch (error) {
      console.error("Fetch history error:", error);
      toast.error(
        error.response?.data?.message || "Unable to load review history."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const deleteReview = async (id) => {
    const confirmed = window.confirm(
      "Delete this review permanently?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");

      await API.delete(`/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews((current) =>
        current.filter((review) => review.id !== id)
      );

      toast.success("Review deleted.");
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error(
        error.response?.data?.message || "Unable to delete review."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
  return (
    <div className="history-layout">
      <Sidebar />
      <main className="history-page">
        <h1>Review History</h1>
        <p>Loading your saved reviews...</p>
      </main>
    </div>
  );
}

  return (
  <div className="history-layout">
    <Sidebar />

    <main className="history-page">
        <div className="history-title-row">
          <div>
            <h1>Review History</h1>
            <p className="history-subtitle">
              Revisit your previous AI code reviews.
            </p>
          </div>

          <span className="history-count">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="empty-history">
            <h2>No reviews yet</h2>
            <p>
              Run an AI code review to start building your history.
            </p>
          </div>
        ) : (
          <div className="history-list">
            {reviews.map((entry) => {
              const savedReview =
                typeof entry.review === "string"
                  ? (() => {
                      try {
                        return JSON.parse(entry.review);
                      } catch {
                        return {};
                      }
                    })()
                  : entry.review || {};

              const suggestions = Array.isArray(savedReview.suggestions)
                ? savedReview.suggestions
                : [];

              const metrics = savedReview.metrics || {};

              const score = entry.score ?? savedReview.score ?? "--";
              const isExpanded = expandedId === entry.id;

              return (
                <article className="history-card" key={entry.id}>
                  <div className="history-header">
                    <div>
                      <h2>{entry.language || "Unknown language"}</h2>
                      <small>
                        {entry.created_at
                          ? new Date(entry.created_at).toLocaleString()
                          : "Date unavailable"}
                      </small>
                    </div>

                    <div className="score-box">
                      {score}/100
                    </div>
                  </div>

                  <div className="history-metrics">
                    {[
                      ["Performance", metrics.performance],
                      ["Readability", metrics.readability],
                      ["Security", metrics.security],
                      ["Maintainability", metrics.maintainability],
                    ].map(([label, value]) => (
                      <div className="history-metric" key={label}>
                        <span>{label}</span>
                        <strong>
                          {Number.isFinite(Number(value)) &&
                          value !== null
                            ? `${value}%`
                            : "--"}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <p className="history-findings-count">
                    {suggestions.length}{" "}
                    {suggestions.length === 1 ? "finding" : "findings"}
                  </p>

                  <button
                    type="button"
                    className="history-toggle-btn"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : entry.id)
                    }
                  >
                    {isExpanded ? "Hide details" : "View details"}
                  </button>

                  {isExpanded && (
                    <div className="history-details">
                      <h3>Submitted Code</h3>
                      <pre className="code-block">
                        {entry.code || "Code unavailable"}
                      </pre>

                      <h3>AI Findings</h3>

                      {suggestions.length === 0 ? (
                        <p>No findings were saved for this review.</p>
                      ) : (
                        suggestions.map((item, index) => {
                          const category =
                            typeof item === "string"
                              ? "Suggestion"
                              : item?.category || "General";

                          const message =
                            typeof item === "string"
                              ? item
                              : item?.message || "No details available.";

                          const severity =
                            typeof item === "object" && item
                              ? item.severity
                              : null;

                          const evidence =
                            typeof item === "object" && item
                              ? item.evidence
                              : "";

                          return (
                            <div
                              className="suggestion-card"
                              key={index}
                            >
                              <div className="finding-header">
                                <h4>{category}</h4>
                                {severity && (
                                  <span
                                    className={`severity-badge severity-${severity}`}
                                  >
                                    {severity.toUpperCase()}
                                  </span>
                                )}
                              </div>

                              <p>{message}</p>

                              {evidence && (
                                <pre className="code-block">
                                  {evidence}
                                </pre>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    className="delete-btn"
                    disabled={deletingId === entry.id}
                    onClick={() => deleteReview(entry.id)}
                  >
                    {deletingId === entry.id
                      ? "Deleting..."
                      : "Delete Review"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
          </main>
  </div>
);
}

export default History;
