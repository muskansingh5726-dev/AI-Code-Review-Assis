import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import API from "../api/api";
import Sidebar from "../components/Sidebar";

function Dashboard() {

    const [stats, setStats] = useState({
        totalReviews: 0,
        mostUsedLanguage: "N/A",
        latestReview: null,
        weeklyReviews: 0,
        recentReviews: []
    });

    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get("/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setStats(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {
        return <h2>Loading Dashboard...</h2>;
    }

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-page">

                <h1>Welcome, {user?.name} 👋</h1>

                <p>Here's your coding activity.</p>

                <div className="dashboard-grid">

                    <div className="dashboard-card">
                        <h3>Total Reviews</h3>
                        <h2>{stats.totalReviews}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Favourite Language</h3>
                        <h2>{stats.mostUsedLanguage}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Reviews This Week</h3>
                        <h2>{stats.weeklyReviews}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Latest Review</h3>
                        <h2>
                            {stats.latestReview
                                ? new Date(stats.latestReview).toLocaleDateString()
                                : "No Reviews"}
                        </h2>
                    </div>

                </div>

                <div className="recent-section">

                    <h2>Recent Reviews</h2>

                    {stats.recentReviews.length === 0 ? (

                        <p>No reviews yet.</p>

                    ) : (

                        stats.recentReviews.map((review) => (

                            <div
                                className="recent-card"
                                key={review.id}
                            >

                                <h3>{review.language}</h3>

                                <p>
                                    {new Date(review.created_at).toLocaleString()}
                                </p>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );

}

export default Dashboard;