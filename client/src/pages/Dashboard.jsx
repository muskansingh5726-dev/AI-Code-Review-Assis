import "../styles/Dashboard.css";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalReviews: 0,
    averageScore: 0,
    mostUsedLanguage: "N/A",
    weeklyReviews: 0,
    recentReviews: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your dashboard.");
        return;
      }

      const { data } = await API.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboard({
        totalReviews: Number(data.totalReviews) || 0,
        averageScore: Number(data.averageScore) || 0,
        mostUsedLanguage: data.mostUsedLanguage || "N/A",
        weeklyReviews: Number(data.weeklyReviews) || 0,
        recentReviews: Array.isArray(data.recentReviews)
          ? data.recentReviews
          : [],
      });
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <>
      <Sidebar />

      <main className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>AI Code Review Dashboard</h1>
            <p>
              Welcome back! Here's an overview of your coding activity.
            </p>
          </div>

          <div className="dashboard-buttons">
            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("/review")}
            >
              + New Review
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/history")}
            >
              Review History
            </button>
          </div>
        </div>

        {error && (
          <div className="empty-state" role="alert">
            <h3>Dashboard unavailable</h3>
            <p>{error}</p>
            <button
              type="button"
              className="primary-btn"
              onClick={loadDashboard}
            >
              Try Again
            </button>
          </div>
        )}

        {!error && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Reviews</h3>
                <h1>
                  {loading ? "..." : dashboard.totalReviews}
                </h1>
              </div>

              <div className="stat-card">
                <h3>Average Review Score</h3>
                <h1>
                  {loading ? "..." : `${dashboard.averageScore}%`}
                </h1>
              </div>

              <div className="stat-card">
                <h3>Reviews This Week</h3>
                <h1>
                  {loading ? "..." : dashboard.weeklyReviews}
                </h1>
              </div>

              <div className="stat-card">
                <h3>Most Used Language</h3>
                <h1>
                  {loading ? "..." : dashboard.mostUsedLanguage}
                </h1>
              </div>
            </div>

            <section className="dashboard-section">
              <h2>Recent Reviews</h2>

              {loading ? (
                <div className="empty-state">
                  <p>Loading your recent reviews...</p>
                </div>
              ) : dashboard.recentReviews.length === 0 ? (
                <div className="empty-state">
                  <h3>No Reviews Yet</h3>
                  <p>
                    Start your first AI code review to see your
                    statistics and recent activity here.
                  </p>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => navigate("/review")}
                  >
                    Start Your First Review
                  </button>
                </div>
              ) : (
                dashboard.recentReviews.map((review) => (
                  <div className="review-item" key={review.id}>
                    <div className="review-info">
                      <h3>{review.language || "Unknown language"}</h3>
                      <p>
                        {review.created_at
                          ? new Date(review.created_at).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </div>

                    <div className="review-details">
                      <span className="review-status">
                        {review.compiler_status || "AI Reviewed"}
                      </span>

                      <span className="review-score">
                        {review.score == null
                          ? "--"
                          : `${review.score}/100`}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {!loading && dashboard.recentReviews.length > 0 && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => navigate("/history")}
                >
                  View All Reviews
                </button>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default Dashboard;