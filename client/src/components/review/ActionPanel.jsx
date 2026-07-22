import "./ActionPanel.css";

function ActionPanel({
  language,
  setLanguage,
  handleReview,
  handleRun,
  handleReset,
  handleFile,
  loading,
  file,
}) {
  return (
    <div className="action-panel">

      <h2>Quick Actions</h2>

      <div className="panel-group">
       <label>💻 Programming Language</label>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="java">☕ Java</option>
          <option value="python">🐍 Python</option>
          <option value="javascript">🟨 JavaScript</option>
          <option value="cpp">💙 C++</option>
          <option value="c">⚙ C</option>
        </select>
      </div>

      <div className="panel-group">

       <label>📂 Upload Source File</label>

        <input
          type="file"
          accept=".java,.py,.js,.cpp,.c"
          onChange={handleFile}
        />

        {file && (
          <small className="file-name">
            📄 {file.name}
          </small>
        )}

      </div>

      <button
        className="run-btn"
        onClick={handleRun}
      >
        🚀 Run Code
      </button>

      <button
        className="review-btn"
        disabled={loading}
        onClick={handleReview}
      >
        {loading ? "🧠 Analyzing Code..." : "🧠 AI Review"}
      </button>

      <button
        className="fix-btn"
        disabled
      >
        ✨ Fix Code
        <span>Coming Soon</span>
      </button>

      <button
        className="reset-btn"
        onClick={handleReset}
      >
        🗑 Reset Workspace
      </button>

    </div>
  );
}

export default ActionPanel;