import { useState } from "react";
import "./ChatPanel.css";

function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi! I'm your AI Coding Assistant. Ask me anything about your code.",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input },
      {
        sender: "ai",
        text: "🚧 AI Chat integration is coming in the next part...",
      },
    ]);

    setInput("");
  };

  return (
    <div className="chat-panel">

      <div className="chat-header">
        🤖 AI Assistant
      </div>

      <div className="chat-body">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user"
                ? "message user"
                : "message ai"
            }
          >
            {msg.text}
          </div>
        ))}

      </div>

      <div className="chat-footer">

        <input
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button onClick={handleSend}>
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatPanel;