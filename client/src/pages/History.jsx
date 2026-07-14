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

            <p>Your previous code reviews.</p>

            {

                reviews.length === 0 ?

                    <h3>No reviews yet.</h3>

                    :

                    reviews.map((review) => (

                        <div
                            className="history-card"
                            key={review.id}
                        >

                            <h3>{review.language}</h3>

                            <p>
                                {new Date(
                                    review.created_at
                                ).toLocaleString()}
                            </p>

                            <pre>
                                {review.review}
                            </pre>

                            <button
                                onClick={() =>
                                    deleteReview(review.id)
                                }
                            >
                                Delete
                            </button>

                        </div>

                    ))

            }

        </div>

    );

}

export default History;