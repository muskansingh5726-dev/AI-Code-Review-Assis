
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const starterCode = `function calculateTotal(price, quantity) {
  let total = price * quantity;
  console.log("Total:", total);
  return total;
}

calculateTotal(100, 3);`;

export default function Demo() {
  const navigate = useNavigate();
  const [code, setCode] = useState(starterCode);
  const [activeTab, setActiveTab] = useState("editor");
  const [ran, setRan] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const runCode = () => {
    setRan(true);
    setReviewed(false);
    setActiveTab("output");
  };

  const reviewCode = () => {
    setReviewed(true);
    setActiveTab("analysis");
  };

  const resetDemo = () => {
    setCode(starterCode);
    setRan(false);
    setReviewed(false);
    setActiveTab("editor");
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.brand}>AI CODE REVIEW ASSISTANT</div>
          <h1 style={styles.title}>See your code get smarter.</h1>
          <p style={styles.subtitle}>
            Try the workflow: write, run, review and analyze.
          </p>
        </div>
        <button style={styles.secondary} onClick={() => navigate("/")}>
          Back to Home
        </button>
      </header>

      <div style={styles.notice}>
        Interactive product preview · Uses sample execution and review results
      </div>

      <section style={styles.workspace}>
        <div style={styles.toolbar}>
          <div>
            <span style={styles.dot} />
            <span style={styles.fileName}>main.js</span>
            <span style={styles.language}>JavaScript</span>
          </div>
          <button style={styles.secondary} onClick={resetDemo}>
            Reset
          </button>
        </div>

        <label style={styles.label} htmlFor="demo-code">
          YOUR CODE
        </label>
        <textarea
          id="demo-code"
          spellCheck={false}
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setRan(false);
            setReviewed(false);
            setActiveTab("editor");
          }}
          style={styles.editor}
        />

        <div style={styles.actions}>
          <button style={styles.runButton} onClick={runCode}>
            ▶ Run Code
          </button>
          <button style={styles.reviewButton} onClick={reviewCode}>
            ✦ Review Code
          </button>
        </div>

        <div style={styles.tabs}>
          <button
            style={activeTab === "editor" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("editor")}
          >
            Workflow
          </button>
          <button
            style={activeTab === "output" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("output")}
          >
            Console
          </button>
          <button
            style={activeTab === "analysis" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("analysis")}
          >
            AI Analysis
          </button>
        </div>

        <div style={styles.result}>
          {activeTab === "editor" && (
            <>
              <h3>Ready to try it?</h3>
              <p>
                1. Edit the sample code above.
                <br />
                2. Select Run Code to see the example output.
                <br />
                3. Select Review Code to explore the sample analysis.
              </p>
            </>
          )}

          {activeTab === "output" && (
            ran ? (
              <>
                <div style={styles.success}>● Example run completed</div>
                <pre style={styles.output}>Total: 300{"\n\n"}Process finished with exit code 0.</pre>
                <p style={styles.muted}>
                  Preview output for the sample program. This demo does not
                  execute the edited code on a real runtime.
                </p>
              </>
            ) : (
              <p>Click Run Code to view the example output.</p>
            )
          )}

          {activeTab === "analysis" && (
            reviewed ? (
              <>
                <div style={styles.success}>✦ Sample code review complete</div>
                <div style={styles.metrics}>
                  <div style={styles.metric}>
                    <strong>Good</strong>
                    <span>Readability</span>
                  </div>
                  <div style={styles.metric}>
                    <strong>Low</strong>
                    <span>Complexity</span>
                  </div>
                  <div style={styles.metric}>
                    <strong>2</strong>
                    <span>Suggestions</span>
                  </div>
                </div>
                <h3>Review findings</h3>
                <div style={styles.finding}>
                  <strong>Maintainability</strong>
                  <p>
                    Consider validating price and quantity before calculating
                    the total.
                  </p>
                </div>
                <div style={styles.finding}>
                  <strong>Code quality</strong>
                  <p>
                    Consider using a descriptive return value and keeping
                    logging separate from calculation logic.
                  </p>
                </div>
                <p style={styles.muted}>
                  These are illustrative sample findings, not results from a
                  live AI request.
                </p>
                <button
                  style={styles.reviewButton}
                  onClick={() => navigate("/login")}
                >
                  Try the full application →
                </button>
              </>
            ) : (
              <p>Click Review Code to explore the sample analysis report.</p>
            )
          )}
        </div>
      </section>

      <p style={styles.footer}>
        Want to review your own project?{" "}
        <button style={styles.link} onClick={() => navigate("/login")}>
          Sign in to get started
        </button>
      </p>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b1020",
    color: "#eef2ff",
    padding: "36px 20px",
    fontFamily: "Inter, system-ui, sans-serif",
    boxSizing: "border-box",
  },
  header: {
    maxWidth: 1000,
    margin: "0 auto 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  brand: {
    color: "#a78bfa",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2,
  },
  title: { fontSize: "clamp(28px, 5vw, 42px)", margin: "10px 0" },
  subtitle: { color: "#aab4cc", margin: 0 },
  notice: {
    maxWidth: 1000,
    margin: "0 auto 16px",
    padding: 12,
    borderRadius: 10,
    background: "#1b2540",
    color: "#c4b5fd",
    fontSize: 13,
    boxSizing: "border-box",
  },
  workspace: {
    maxWidth: 1000,
    margin: "0 auto",
    background: "#121a2d",
    border: "1px solid #303b55",
    borderRadius: 16,
    overflow: "hidden",
  },
  toolbar: {
    padding: "14px 18px",
    background: "#1b2540",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    display: "inline-block",
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: "#a78bfa",
    marginRight: 10,
  },
  fileName: { fontWeight: 700, fontSize: 14 },
  language: {
    marginLeft: 12,
    fontSize: 12,
    color: "#aab4cc",
  },
  label: {
    display: "block",
    padding: "16px 18px 0",
    color: "#aab4cc",
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: 700,
  },
  editor: {
    display: "block",
    width: "100%",
    minHeight: 250,
    resize: "vertical",
    boxSizing: "border-box",
    padding: 20,
    border: 0,
    outline: "none",
    background: "#0e1527",
    color: "#d8c7ff",
    font: '14px/1.8 "Consolas", monospace',
    tabSize: 2,
  },
  actions: {
    padding: 16,
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    borderBottom: "1px solid #303b55",
  },
  runButton: {
    border: 0,
    borderRadius: 9,
    padding: "12px 20px",
    background: "#16a34a",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  reviewButton: {
    border: 0,
    borderRadius: 9,
    padding: "12px 20px",
    background: "#7c3aed",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondary: {
    border: "1px solid #46516b",
    borderRadius: 8,
    padding: "10px 14px",
    background: "transparent",
    color: "#eef2ff",
    cursor: "pointer",
  },
  tabs: {
    display: "flex",
    gap: 4,
    padding: "12px 16px 0",
    borderBottom: "1px solid #303b55",
    flexWrap: "wrap",
  },
  tab: {
    border: 0,
    padding: "12px 14px",
    background: "transparent",
    color: "#aab4cc",
    cursor: "pointer",
  },
  activeTab: {
    border: 0,
    borderBottom: "2px solid #a78bfa",
    padding: "12px 14px",
    background: "transparent",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  result: { padding: 22, minHeight: 160, lineHeight: 1.7 },
  success: { color: "#86efac", fontWeight: 700 },
  output: {
    padding: 16,
    borderRadius: 8,
    background: "#080d18",
    color: "#86efac",
    whiteSpace: "pre-wrap",
  },
  muted: { color: "#9ca9c2", fontSize: 12 },
  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 12,
    margin: "18px 0",
  },
  metric: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    padding: 14,
    borderRadius: 10,
    background: "#1b2540",
  },
  finding: {
    margin: "12px 0",
    padding: 14,
    borderLeft: "3px solid #a78bfa",
    background: "#1b2540",
    borderRadius: "0 8px 8px 0",
  },
  footer: {
    maxWidth: 1000,
    margin: "24px auto 0",
    color: "#aab4cc",
    textAlign: "center",
  },
  link: {
    background: "none",
    border: 0,
    color: "#c4b5fd",
    textDecoration: "underline",
    cursor: "pointer",
  },
};
