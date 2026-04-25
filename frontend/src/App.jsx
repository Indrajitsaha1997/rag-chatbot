import { useState, useRef, useEffect } from "react";
import axios from "axios";
import MessageBubble from "./components/MessageBubble";
import FileUpload from "./components/FileUpload";
import "./index.css";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! Upload a document and ask me anything about it. I'm powered by **Llama 3.2** with RAG. 🚀" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);

    // Add loading bubble
    setMessages(prev => [...prev, { role: "ai", content: "", loading: true }]);

    try {
      const res = await axios.post("http://localhost:8000/chat", { question: q });
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "ai", content: res.data.answer, sources: res.data.sources }
      ]);
    } catch {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "ai", content: "⚠️ Error reaching the backend. Is it running?" }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function resetChat() {
    await axios.delete("http://localhost:8000/reset").catch(() => {});
    setMessages([{ role: "ai", content: "Memory cleared! Start a fresh conversation. 🔄" }]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <header style={{
        padding: "18px 28px",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #7c6aff, #ff6a9b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>⚡</div>
          <div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              RAG Chatbot
            </h1>
            <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
              llama3.2 · mxbai-embed-large · langchain
            </p>
          </div>
        </div>
        <button onClick={resetChat} style={{
          padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border)",
          background: "transparent", color: "var(--text-dim)", cursor: "pointer",
          fontSize: "0.8rem", fontFamily: "'Syne', sans-serif",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => e.target.style.borderColor = "var(--accent)"}
        onMouseLeave={e => e.target.style.borderColor = "var(--border)"}>
          🔄 Reset
        </button>
      </header>

      {/* File Upload */}
      <FileUpload />

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "24px 28px",
        display: "flex", flexDirection: "column",
      }}>
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "16px 24px",
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
        display: "flex", gap: 12,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask anything about your documents..."
          style={{
            flex: 1, padding: "14px 20px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 14, color: "var(--text)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.875rem", outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
          padding: "14px 22px", borderRadius: 14,
          background: loading ? "var(--border)" : "linear-gradient(135deg, #7c6aff, #5a4fcf)",
          border: "none", color: "#fff", cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem",
          boxShadow: "0 4px 20px rgba(124,106,255,0.3)",
          transition: "all 0.2s",
        }}>
          {loading ? "..." : "Send →"}
        </button>
      </div>
    </div>
  );
}