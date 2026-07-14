import "../styles/HowItWorks.css";
import { FaUpload, FaRobot, FaChartBar } from "react-icons/fa";

function HowItWorks() {
  return (
    <section className="how">
      <h2>How It Works</h2>
      <p>Review your code in just 3 simple steps.</p>

      <div className="how-grid">

        <div className="how-card">
          <FaUpload />
          <h3>Upload Code</h3>
          <p>Paste your code or upload a source code file.</p>
        </div>

        <div className="how-card">
          <FaRobot />
          <h3>AI Analysis</h3>
          <p>Our AI checks bugs, security, performance and best practices.</p>
        </div>

        <div className="how-card">
          <FaChartBar />
          <h3>Get Report</h3>
          <p>Receive a complete report with score and suggestions.</p>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;