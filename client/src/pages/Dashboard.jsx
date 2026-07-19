import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

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
          reviews.reduce(
            (sum, review) => sum + (review.score || 0),
            0
          ) / totalReviews
        ).toFixed(1);

  const successfulReviews = reviews.filter(
    (review) => review.compiler_status === "Accepted"
  ).length;

  const favoriteLanguage =
    reviews.length > 0
      ? reviews.sort((a, b) => a.language.localeCompare(b.language))[0]
          ?.language
      : "-";

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      <p>Welcome back! Here's your review summary.</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>{totalReviews}</h2>
          <p>Total Reviews</p>
        </div>

        <div className="dashboard-card">
          <h2>{averageScore}</h2>
          <p>Average Score</p>
        </div>

        <div className="dashboard-card">
          <h2>{successfulReviews}</h2>
          <p>Successful Runs</p>
        </div>

        <div className="dashboard-card">
          <h2>{favoriteLanguage}</h2>
          <p>Language Used</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => navigate("/review")}>
          New Review
        </button>

        <button onClick={() => navigate("/history")}>
          View History
        </button>
      </div>

      <h2 style={{ marginTop: "50px" }}>
        Recent Reviews
      </h2>

      {reviews.slice(0, 5).map((review) => (
        <div
          key={review.id}
          className="recent-card"
        >
          <h3>{review.language}</h3>

          <p>
            Score: {review.score}/100
          </p>

          <p>
            Status: {review.compiler_status}
          </p>

          <small>
            {new Date(
              review.created_at
            ).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;