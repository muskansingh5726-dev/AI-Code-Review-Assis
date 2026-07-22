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
  const [loading, setLoading] = useState(false);

  const [consoleOutput, setConsoleOutput] = useState(
    "Ready. Click 'Run Code' to execute your program."
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
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);

    const reader = new FileReader();

    reader.onload = (event) => {
      setCode(event.target.result);

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

    setConsoleOutput(
      "Ready. Click 'Run Code' to execute your program."
    );

    setExecutionTime("--");
    setMemory("--");
    setStatus("Idle");
    setLoading(false);

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

  try {
    setLoading(true);
    setStatus("Running");
    setConsoleOutput("⚡ Running your code...");

    const { data } = await API.post("/run", {
      language,
      code,
    });

    setConsoleOutput(data.output);
    setExecutionTime(data.executionTime);
    setMemory(data.memory);
    setStatus(data.status);

    toast.success("Code executed successfully!");

  } catch (err) {
    setStatus("Error");
    setConsoleOutput("Execution Failed");
    toast.error("Execution Failed");
    console.error(err);

  } finally {
    setLoading(false);
  }
};

  const handleReview = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Reviewing...");
setConsoleOutput("🤖 AI is analyzing your code...");

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
  score: data.score,
  performance: data.performance ?? 90,
  readability: data.readability ?? 91,
  security: data.security ?? 88,
  maintainability: data.maintainability ?? 94,
  suggestions: data.suggestions || [],
});

setConsoleOutput(
  data.stdout ||
  data.compileOutput ||
  "✅ AI Review completed successfully."
);

setStatus("Completed");

setExecutionTime(data.executionTime || "--");
setMemory(data.memory || "--");
toast.success("AI Review completed successfully!");
    } catch (err) {
      console.error(err);

      toast.error(
  err.response?.data?.message ||
  "Review Failed"
);
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="review-layout">
      <Sidebar />

      <main className="workspace">
        <div className="workspace-header">
          <div>
            <h1>🚀 AI Code Review Workspace</h1>
            <p>Review, analyze and improve your code with AI.</p>
          </div>
        </div>

        <div className="workspace-grid">
          {/* LEFT SIDE */}
          <div className="editor-area">
            <div className="editor-card">
              <div className="editor-topbar">
               <span className="editor-file">
  🟢 🟡 🔴
  &nbsp;&nbsp;
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
                  minimap: {
                    enabled: false,
                  },
                  automaticLayout: true,
                  fontSize: 15,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <ConsolePanel
              output={consoleOutput}
              executionTime={executionTime}
              memory={memory}
              status={status}
            />

            <ReviewSummary
              score={reviewData.score}
              performance={reviewData.performance}
              readability={reviewData.readability}
              security={reviewData.security}
              maintainability={reviewData.maintainability}
              suggestions={reviewData.suggestions}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="side-panels">
            <ActionPanel
              language={language}
              setLanguage={setLanguage}
              handleReview={handleReview}
              handleRun={handleRun}
              handleReset={handleReset}
              handleFile={handleFile}
              loading={loading}
              file={file}
            />

            <ChatPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Review;