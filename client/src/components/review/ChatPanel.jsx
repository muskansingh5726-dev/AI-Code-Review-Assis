import { useEffect, useRef, useState } from "react";
import API from "../../api/api";
import "./ChatPanel.css";

function ChatPanel({ code = "", language = "unknown", reviewData = {} }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm your AI Coding Assistant. Ask me about your code, bugs, or review suggestions.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (event) => {
    event?.preventDefault();

    const question = input.trim();

    if (!question || loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to use the AI assistant.");
      return;
    }

    const previousMessages = messages
      .filter((item) => item.sender === "user" || item.sender === "ai")
      .slice(-10)
      .map((item) => ({
        role: item.sender === "user" ? "user" : "assistant",
        content: item.text,
      }));

    const updatedMessages = [
      ...messages,
      { sender: "user", text: question },
    ];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post(
        "/chat",
        {
          message: question,
          code,
          language,
          history: previousMessages,
          review: {
            score: reviewData?.score ?? null,
            performance: reviewData?.performance ?? null,
            readability: reviewData?.readability ?? null,
            security: reviewData?.security ?? null,
            maintainability: reviewData?.maintainability ?? null,
            suggestions: Array.isArray(reviewData?.suggestions)
              ? reviewData.suggestions.slice(0, 20)
              : [],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((current) => [
        ...current,
        {
          sender: "ai",
          text: data.reply || "The assistant returned an empty response.",
        },
      ]);
    } catch (err) {
      console.error("Chat request failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to contact the AI assistant. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chat-panel">
      <div className="chat-header">
        <div>
          <h3>AI Assistant</h3>
          <p>Ask questions about your code</p>
        </div>
        <span className="chat-status">AI</span>
      </div>

      <div className="chat-body" ref={bodyRef} aria-live="polite">
        {messages.map((msg, index) => (
          <div
            key={`${index}-${msg.sender}`}
            className={`message ${msg.sender}`}
          >
            <span className="message-label">
              {msg.sender === "user" ? "You" : "Assistant"}
            </span>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="message ai">
            <span className="message-label">Assistant</span>
            <div className="message-text chat-typing">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="chat-error" role="alert">
          {error}
        </p>
      )}

      <form className="chat-footer" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Ask about your code..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={loading}
          maxLength={2000}
          aria-label="Ask the AI assistant"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}

export default ChatPanel;