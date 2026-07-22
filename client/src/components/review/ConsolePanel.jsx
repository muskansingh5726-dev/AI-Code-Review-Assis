import "./ConsolePanel.css";

function ConsolePanel({
  output = "Ready. Click 'Run Code' to execute your program.",
  executionTime = "--",
  memory = "--",
  status = "Idle",
}) {
  return (
    <div className="console-panel">

      <div className="console-header">

        <h3>🖥 Terminal</h3>

        <span className={`status ${status.toLowerCase()}`}>
          {status}
        </span>

      </div>

      <div className="console-output">

<pre>{`> Compiling...
> Running...

${output}`}</pre>

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