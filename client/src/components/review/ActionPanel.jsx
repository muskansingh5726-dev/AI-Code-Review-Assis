
import "./ActionPanel.css";

function ActionPanel({
  language,
  setLanguage,
  handleReview,
  handleRun,
  handleReset,
  handleFile,
  loading = false,
  isRunning = false,
  isReviewing = false,
  file,
}) {
  const busy = isRunning || isReviewing;

  return (
    <div className="action-panel">
      <h2>Quick Actions</h2>

      <div className="panel-group">
        <label>Programming Language</label>

        <select
          value={language}
          disabled={busy}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>
      </div>

      <div className="panel-group">
        <label>Upload Source File</label>

        <input
          type="file"
          accept=".java,.py,.js,.cpp,.c"
          disabled={busy}
          onChange={handleFile}
        />

        {file && (
          <small className="file-name">{file.name}</small>
        )}
      </div>

      <button
        type="button"
        className="run-btn"
        onClick={handleRun}
        disabled={busy}
      >
        {isRunning ? "Running Code..." : "Run Code"}
      </button>

      <button
        type="button"
        className="review-btn"
        onClick={handleReview}
        disabled={busy || loading}
      >
        {isReviewing || loading
          ? "Analyzing Code..."
          : "AI Review"}
      </button>

      <button type="button" className="fix-btn" disabled>
        Fix Code
        <span>Coming Soon</span>
      </button>

      <button
        type="button"
        className="reset-btn"
        onClick={handleReset}
        disabled={busy}
      >
        Reset Workspace
      </button>
    </div>
  );
}

export default ActionPanel;
