
import "./ConsolePanel.css";

function ConsolePanel({
  output = "Ready. Click 'Run Code' to execute your program.",
  executionTime = "--",
  memory = "--",
  status = "Idle",
}) {
  const normalizedStatus = String(status).toLowerCase();

  const isRunning =
    normalizedStatus.includes("running") ||
    normalizedStatus.includes("compiling");

  return (
    <div className="console-panel">
      <div className="console-header">
        <h3>Terminal</h3>

        <span className={`status ${normalizedStatus.replace(/\s+/g, "-")}`}>
          {status}
        </span>
      </div>

      <div className="console-output">
        <pre>
          {isRunning
            ? `> Compiling...\n> Running...\n\n${output}`
            : output}
        </pre>
      </div>

      <div className="console-footer">
        <div>
          <strong>Status</strong>
          <span>{status}</span>
        </div>

        <div>
          <strong>Execution Time</strong>
          <span>{executionTime}</span>
        </div>

        <div>
          <strong>Memory Usage</strong>
          <span>{memory}</span>
        </div>
      </div>
    </div>
  );
}

export default ConsolePanel;
