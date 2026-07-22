import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(data.reviews);
    } catch (err) {
      console.log(err);
    }
  };

  const totalReviews = reviews.length;

  const averageScore =
    totalReviews === 0
      ? 0
      : (
          reviews.reduce((sum, review) => sum + (review.score || 0), 0) /
          totalReviews
        ).toFixed(1);

  const successfulReviews = reviews.filter(
    (review) => review.compiler_status === "Accepted"
  ).length;

  const favoriteLanguage =
    reviews.length > 0
      ? reviews
          .map((r) => r.language)
          .sort(
            (a, b) =>
              reviews.filter((x) => x.language === b).length -
              reviews.filter((x) => x.language === a).length
          )[0]
      : "-";

  return (
    <>
      <Sidebar />

      <div className="dashboard">

        <div className="dashboard-header">

          <div>

            <h1>🚀 AI Code Review Dashboard</h1>

            <p>
              Welcome back! Here's an overview of your coding activity.
            </p>

          </div>

          <div className="dashboard-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/review")}
            >
              ➕ New Review
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/history")}
            >
              📜 Review History
            </button>

          </div>

        </div>

        <div className="stats-grid">

          <div className="stat-card">

            <h3>Total Reviews</h3>

            <h1>{totalReviews}</h1>

          </div>

          <div className="stat-card">

            <h3>Average Score</h3>

            <h1>{averageScore}%</h1>

          </div>

          <div className="stat-card">

            <h3>Successful Runs</h3>

            <h1>{successfulReviews}</h1>

          </div>

          <div className="stat-card">

            <h3>Most Used Language</h3>

            <h1>{favoriteLanguage}</h1>

          </div>

        </div>

        <div className="dashboard-section">

          <h2>📄 Recent Reviews</h2>

          {reviews.length === 0 ? (

            <div className="empty-state">

              <h3>No Reviews Yet</h3>

              <p>
                Start your first AI Code Review to see analytics here.
              </p>

            </div>

          ) : (

            reviews.slice(0, 5).map((review) => (

              <div
                className="review-item"
                key={review.id}
              >

                <div className="review-info">

                  <h3>{review.language}</h3>

                  <p>

                    {new Date(
                      review.created_at
                    ).toLocaleString()}

                  </p>

                </div>

                <div className="review-details">

                  <span className="review-status">

                    {review.compiler_status}

                  </span>

                  <span className="review-score">

                    {review.score}/100

                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>
    </>
  );
}

export default Dashboard;