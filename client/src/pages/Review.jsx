
import "../styles/Review.css";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import API from "../api/api";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import ActionPanel from "../components/review/ActionPanel";
import ChatPanel from "../components/review/ChatPanel";
import ConsolePanel from "../components/review/ConsolePanel";
import ReviewSummary from "../components/review/ReviewSummary";

function Review() {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);

  // Keep execution and AI review independent.
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const [programInput, setProgramInput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState(
    "Ready. Enter your code and click Run Code."
  );

  const [executionTime, setExecutionTime] = useState("--");
  const [memory, setMemory] = useState("--");
  const [status, setStatus] = useState("Idle");

  const [reviewData, setReviewData] = useState({
    score: 0,
    performance: 0,
    readability: 0,
    security: 0,
    maintainability: 0,
    suggestions: [],
  });

  const handleFile = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    const reader = new FileReader();

    reader.onload = (event) => {
      setCode(String(event.target?.result ?? ""));

      const extension = selected.name.split(".").pop().toLowerCase();
      const map = {
        java: "java",
        py: "python",
        js: "javascript",
        cpp: "cpp",
        c: "c",
      };

      setLanguage(map[extension] || "java");
    };

    reader.readAsText(selected);
  };

  const handleReset = () => {
    setCode("");
    setFile(null);
    setProgramInput("");
    setConsoleOutput("Ready. Enter your code and click Run Code.");
    setExecutionTime("--");
    setMemory("--");
    setStatus("Idle");

    setReviewData({
      score: 0,
      performance: 0,
      readability: 0,
      security: 0,
      maintainability: 0,
      suggestions: [],
    });
  };

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code.");
      return;
    }

    if (isRunning || isReviewing) return;

    setIsRunning(true);
    setStatus("Running");
    setConsoleOutput("Compiling and running your code...");
    setExecutionTime("--");
    setMemory("--");

    try {
      const { data } = await API.post("/run", {
        language,
        code,
        input: programInput,
      });

      setConsoleOutput(
        data.output ||
          (Array.isArray(data.errors) ? data.errors.join("\n") : "") ||
          "Execution finished with no output."
      );

      setExecutionTime(data.executionTime ?? "--");
      setMemory(data.memory ?? "--");
      setStatus(data.status || "Completed");

      if (data.status === "Completed" || data.status === "Accepted") {
        toast.success("Execution finished.");
      } else {
        toast.error("Execution did not complete successfully.");
      }
    } catch (err) {
      console.error("Run Code error:", err);
      setStatus("Error");
      setConsoleOutput(
        err.response?.data?.message || "Execution failed. Check the server terminal."
      );
      toast.error("Execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleReview = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code.");
      return;
    }

    if (isRunning || isReviewing) return;

    setIsReviewing(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("language", language);
      formData.append("code", code);

      if (file) {
        formData.append("file", file);
      }

      const { data } = await API.post("/review", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setReviewData({
        score: data.score ?? 0,
        performance: data.metrics?.performance ?? data.performance ?? 0,
        readability: data.metrics?.readability ?? data.readability ?? 0,
        security: data.metrics?.security ?? data.security ?? 0,
        maintainability:
          data.metrics?.maintainability ?? data.maintainability ?? 0,
        suggestions: data.suggestions || [],
      });

      toast.success("AI review completed.");
    } catch (err) {
      console.error("AI Review error:", err);
      toast.error(err.response?.data?.message || "Review failed.");
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="review-layout">
      <Sidebar />

      <main className="workspace">
        <div className="workspace-header">
          <div>
            <h1>AI Code Review Workspace</h1>
            <p>Review, analyze and improve your code with AI.</p>
          </div>
        </div>

        <div className="workspace-grid">
          <div className="editor-area">
            <div className="editor-card">
              <div className="editor-topbar">
                <span className="editor-file">
                  {file
                    ? file.name
                    : `Main.${
                        language === "python"
                          ? "py"
                          : language === "javascript"
                          ? "js"
                          : language
                      }`}
                </span>

                <span className="editor-language">
                  {language.toUpperCase()}
                </span>
              </div>

              <Editor
                height="650px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  automaticLayout: true,
                  fontSize: 15,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <div style={{ margin: "16px 0" }}>
              <label
                htmlFor="program-input"
                style={{ display: "block", marginBottom: 8 }}
              >
                Program Input (for Scanner, input(), etc.)
              </label>

              <textarea
                id="program-input"
                value={programInput}
                onChange={(e) => setProgramInput(e.target.value)}
                placeholder={"Enter input, one value per line. Example:\nMuskan\n22"}
                rows={4}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: 12,
                  borderRadius: 8,
                  resize: "vertical",
                  background: "#0b1020",
                  color: "#ffffff",
                  border: "1px solid #30394f",
                }}
              />
            </div>

            <ConsolePanel
              output={consoleOutput}
              executionTime={executionTime}
              memory={memory}
              status={status}
            />

            <ReviewSummary reviewData={reviewData} />
          </div>

          <div className="side-panels">
            <ActionPanel
              language={language}
              setLanguage={setLanguage}
              handleReview={handleReview}
              handleRun={handleRun}
              handleReset={handleReset}
              handleFile={handleFile}
              loading={isReviewing}
              isRunning={isRunning}
              isReviewing={isReviewing}
              file={file}
            />

            <ChatPanel
              code={code}
              language={language}
              reviewData={reviewData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Review;
