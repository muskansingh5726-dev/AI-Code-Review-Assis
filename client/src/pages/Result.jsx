import "../styles/Result.css";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        language,
        code,
        fileName,
        review
    } = location.state || {};

    const copyReview = () => {

        navigator.clipboard.writeText(review);

        toast.success("Review copied successfully!");

    };

    return (

        <div className="result-page">

            <div className="result-header">

                <h1>🤖 AI Code Review</h1>

                <button
                    onClick={() => navigate("/review")}
                    className="back-btn"
                >
                    + New Review
                </button>

            </div>

            <div className="summary-grid">

                <div className="summary-card">

                    <h3>Language</h3>

                    <p>{language}</p>

                </div>

                <div className="summary-card">

                    <h3>Source</h3>

                    <p>{fileName}</p>

                </div>

                <div className="summary-card">

                    <h3>Status</h3>

                    <p className="success">Completed ✅</p>

                </div>

            </div>

            <div className="result-container">

                <div className="code-box">

                    <h2>Submitted Code</h2>

                    <pre>{code}</pre>

                </div>

                <div className="review-box">

                    <div className="review-top">

                        <h2>AI Review</h2>

                        <button onClick={copyReview}>
                            Copy
                        </button>

                    </div>

                    <pre>{review}</pre>

                </div>

            </div>

        </div>

    );

}

export default Result;