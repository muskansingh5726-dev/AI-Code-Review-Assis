import "../styles/Hero.css";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Hero() {

    const navigate = useNavigate();

    const handleStartReview = () => {

        const token = localStorage.getItem("token");

        if (token) {

            navigate("/review");

        } else {

            navigate("/login");

        }

    };

    const handleLiveDemo = () => {

        const features = document.getElementById("features");

        if (features) {

            features.scrollIntoView({
                behavior: "smooth"
            });

        }

    };

    return (

        <section className="hero">

            <div className="hero-left">

                <span className="badge">
                    🚀 AI Powered Code Review
                </span>

                <h1>
                    Review Your Code
                    <br />
                    Like a Senior Developer
                </h1>

                <p>
                    Upload your source code or paste code snippets to receive
                    AI-powered reviews, bug detection, performance tips,
                    security suggestions and code quality analysis.
                </p>

                <div className="hero-buttons">

                    <button
                        className="start-btn"
                        onClick={handleStartReview}
                    >

                        Start Reviewing <FaArrowRight />

                    </button>

                    <button
                        className="demo-btn"
                        onClick={handleLiveDemo}
                    >

                        Live Demo

                    </button>

                </div>

                <div className="hero-stats">

                    <div>
                        <h2>10K+</h2>
                        <p>Reviews</p>
                    </div>

                    <div>
                        <h2>15+</h2>
                        <p>Languages</p>
                    </div>

                    <div>
                        <h2>99%</h2>
                        <p>Accuracy</p>
                    </div>

                </div>

            </div>

            <div className="hero-right">

    <div className="hero-process">

        <h2>⚡ How It Works</h2>

        <div className="step">
            1️⃣ Paste Code / Upload File
        </div>

        <div className="step">
            2️⃣ AI Reviews Your Code
        </div>

        <div className="step">
            3️⃣ Detect Errors
        </div>

        <div className="step">
            4️⃣ Improve Your Code
        </div>

    </div>

</div>

        </section>

    );

}

export default Hero;