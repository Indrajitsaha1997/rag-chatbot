import ReactMarkdown from "react-markdown";

export default function MessageBubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "16px",
      gap: "10px",
      alignItems: "flex-end",
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #7c6aff, #ff6a9b)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>🤖</div>
      )}

      <div style={{
        maxWidth: "70%",
        background: isUser
          ? "linear-gradient(135deg, #1e1b4b, #2d1f6e)"
          : "var(--surface2)",
        border: `1px solid ${isUser ? "#3730a3" : "var(--border)"}`,
        borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
        padding: "14px 18px",
        boxShadow: isUser
          ? "0 4px 20px rgba(124,106,255,0.15)"
          : "0 4px 20px rgba(0,0,0,0.3)",
      }}>
        {msg.loading ? (
          <TypingDots />
        ) : (
          <>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.875rem",
              lineHeight: 1.7,
              color: "var(--text)",
            }}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
            {msg.sources?.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: 600 }}>
                  SOURCES: {msg.sources.map((s, i) => (
                    <span key={i} style={{
                      background: "var(--surface)", padding: "2px 8px",
                      borderRadius: 4, marginLeft: 4, fontSize: "0.7rem",
                    }}>{s.split("/").pop()}</span>
                  ))}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #1e1b4b, #7c6aff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>👤</div>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "var(--accent)",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
      <style>{`@keyframes bounce {
        0%,80%,100%{transform:translateY(0);opacity:.4}
        40%{transform:translateY(-6px);opacity:1}
      }`}</style>
    </div>
  );
}