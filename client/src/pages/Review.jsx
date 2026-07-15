import "../styles/Review.css";
import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Review() {

    const [language, setLanguage] = useState("Java");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleReview = async () => {

        if (!code.trim()) {
            alert("Please paste your code.");
            return;
        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

           const response = await API.post(
    "/review",
    {
        language,
        code
    },
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
);

console.log("Backend Response:", response.data);

navigate("/result", {
    state: {
        language: response.data.language,
        status: response.data.status,
        errors: response.data.errors,
        output: response.data.output,
        suggestions: response.data.suggestions
    }
});

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Review Failed."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="review-page">

            <h1>New Code Review</h1>

            <p>
                Paste your code below to receive an AI review.
            </p>

            <div className="review-container">

                <div className="editor-section">

                    <label>Paste Code</label>

                    <textarea
                        rows="18"
                        placeholder="Paste your code here..."
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                </div>

                <div className="options-section">

                    <label>Select Language</label>

                    <select
                        value={language}
                        onChange={(e) =>
                            setLanguage(e.target.value)
                        }
                    >

                        <option>Java</option>
                        <option>Python</option>
                        <option>JavaScript</option>
                        <option>C++</option>
                        <option>C</option>

                    </select>

                    <button
                        onClick={handleReview}
                        disabled={loading}
                    >

                       {loading ? (
    <>
        🤖 Reviewing...
    </>
) : (
    "Review Code"
)}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Review;