import { useState } from "react";
import axios from "axios";

export default function FileUpload({ onUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    setLoading(true);
    setStatus("Ingesting...");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post("http://localhost:8000/upload", form);
      setStatus(`✅ ${res.data.message}`);
      onUploaded?.();
    } catch {
      setStatus("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
      <label
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 18px",
          border: `1px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 12, cursor: "pointer",
          background: dragging ? "rgba(124,106,255,0.05)" : "transparent",
          transition: "all 0.2s",
        }}>
        <span style={{ fontSize: 20 }}>📎</span>
        <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
          {loading ? "Processing..." : "Drop PDF/TXT to add to knowledge base"}
        </span>
        <input type="file" accept=".pdf,.txt" hidden
          onChange={e => handleFile(e.target.files[0])} />
      </label>
      {status && (
        <p style={{ marginTop: 8, fontSize: "0.78rem", color: "var(--text-dim)", paddingLeft: 4 }}>
          {status}
        </p>
      )}
    </div>
  );
}