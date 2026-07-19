import "../styles/Review.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "../api/api";

function Review() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleReview = async () => {
    if (!code.trim()) {
      alert("Please enter code.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("language", language);
      formData.append("code", code);

      if (file) {
        formData.append("file", file);
      }

      const { data } = await API.post(
        "/review",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/result", {
        state: {
          language: data.language,
          compilerStatus: data.compilerStatus,
          stdout: data.stdout,
          stderr: data.stderr,
          compileOutput: data.compileOutput,
          executionTime: data.executionTime,
          memory: data.memory,
          score: data.score,
          suggestions: data.suggestions,
        },
      });
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Review Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-page">
      <h1>AI Code Review</h1>

      <p>
        Paste code or upload a source file for AI review.
      </p>

      <div className="review-container">
        <div className="editor-section">
          <label>Source Code</label>

          <Editor
            height="600px"
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

        <div className="options-section">
          <label>Programming Language</label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>

          <label>Upload Source File</label>

          <input
            type="file"
            accept=".java,.py,.js,.cpp,.c"
            onChange={handleFile}
          />

          {file && (
            <p>
              📄 <strong>{file.name}</strong>
            </p>
          )}

          <button
            disabled={loading}
            onClick={handleReview}
          >
            {loading
              ? "Reviewing..."
              : "Review Code"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Review;