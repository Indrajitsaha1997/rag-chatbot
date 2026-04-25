# 🤖 RAG Chatbot — Llama 3.2 + LangChain + FastAPI + React

A fully local, privacy-first Retrieval-Augmented Generation (RAG) chatbot. Upload your documents and chat with them using **Llama 3.2** running entirely on your machine via Ollama — no API keys, no cloud, no data leaving your device.

---

## ✨ Features

- 📄 **Document ingestion** — Upload PDF or TXT files and query them instantly
- 🧠 **RAG pipeline** — Retrieves relevant chunks before answering, grounded in your documents
- 💬 **Conversational memory** — Remembers chat history within a session
- 🔍 **Source attribution** — Every answer shows which document it came from
- ⚡ **Fully local** — Llama 3.2 + mxbai-embed-large run on your machine via Ollama
- 🔄 **Session reset** — Clear memory and start fresh anytime

---

## 🗂️ Project Structure

```
rag-chatbot/
├── backend/
│   ├── main.py              # FastAPI app & API routes
│   ├── rag.py               # LangChain RAG pipeline
│   ├── requirements.txt     # Python dependencies
│   ├── docs/                # Uploaded documents stored here
│   └── chroma_db/           # Persisted vector embeddings (auto-created)
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main chat UI
    │   ├── components/
    │   │   ├── ChatWindow.jsx
    │   │   ├── MessageBubble.jsx
    │   │   └── FileUpload.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| LLM | Llama 3.2 (via Ollama) |
| Embeddings | mxbai-embed-large (via Ollama) |
| Vector Store | ChromaDB (persisted locally) |
| RAG Framework | LangChain v0.3 (LCEL) |
| Backend | FastAPI + Uvicorn |
| Frontend | React + Vite |

---

## ⚙️ Prerequisites

Make sure you have the following installed before starting:

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Ollama](https://ollama.com/download)

---

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rag-chatbot.git
cd rag-chatbot
```

### 2. Pull the required Ollama models

```bash
ollama pull llama3.2
ollama pull mxbai-embed-large
```

### 3. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv chatbot
source chatbot/bin/activate        # Mac/Linux
# chatbot\Scripts\activate         # Windows

# Install dependencies
pip install --upgrade pip
pip install langchain==0.3.25 \
            langchain-core==0.3.59 \
            langchain-community==0.3.23 \
            langchain-ollama \
            langchain-text-splitters \
            fastapi \
            uvicorn \
            chromadb \
            pypdf \
            python-multipart
```

### 4. Frontend setup

```bash
cd frontend
npm install
```

---

## ▶️ Running the App

You need **three terminals** running simultaneously.

**Terminal 1 — Ollama:**
```bash
ollama serve
```

**Terminal 2 — Backend:**
```bash
cd backend
source chatbot/bin/activate
python -m uvicorn main:app --port 8000
```

> ⚠️ Always use `python -m uvicorn` (not just `uvicorn`) to ensure the correct Python environment is used, especially if Anaconda is installed.

**Terminal 3 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser. 🎉

---

## 📖 How to Use

1. **Start all three services** (Ollama, backend, frontend)
2. **Upload a document** — drag and drop a PDF or TXT file into the upload area
3. **Wait for ingestion** — you'll see a confirmation with the number of chunks processed
4. **Ask questions** — type anything about your document in the chat input
5. **See sources** — each answer shows which file it pulled context from
6. **Reset** — click the 🔄 Reset button to clear conversation memory

---

## 🔌 API Reference

The FastAPI backend exposes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/upload` | Upload and ingest a PDF or TXT file |
| `POST` | `/chat` | Send a question, get an answer + sources |
| `DELETE` | `/reset` | Clear conversation memory |

Interactive API docs available at **http://localhost:8000/docs** when the backend is running.

### Example `/chat` request

```json
POST /chat
{
  "question": "What are the main topics covered in this document?",
  "session_id": "default"
}
```

### Example `/chat` response

```json
{
  "answer": "The document covers three main topics: ...",
  "sources": ["docs/my-document.pdf"]
}
```

---

## 🏗️ How It Works

```
User uploads PDF/TXT
        ↓
PyPDFLoader / TextLoader → splits into 500-token chunks
        ↓
mxbai-embed-large → vector embeddings → ChromaDB (persisted)
        ↓
User asks a question
        ↓
Question embedded → top 4 relevant chunks retrieved from ChromaDB
        ↓
LangChain history-aware retriever rephrases question with chat context
        ↓
Llama 3.2 generates answer grounded in retrieved chunks
        ↓
Answer + source filenames returned to React UI
```

---

## 🐛 Common Issues & Fixes

### `ModuleNotFoundError` on startup
Always activate your venv before running, and use `python -m uvicorn`:
```bash
source chatbot/bin/activate
python -m uvicorn main:app --port 8000
```

### Anaconda overrides venv Python
Disable conda auto-activation permanently:
```bash
conda config --set auto_activate_base false
```
Then restart your terminal.

### Ollama models not found
Make sure Ollama is running and models are pulled:
```bash
ollama serve
ollama pull llama3.2
ollama pull mxbai-embed-large
ollama list    # verify both appear
```

### ChromaDB errors on first run
The `chroma_db/` folder is created automatically on first document upload. Make sure you upload a document before chatting.

---

## 📁 Environment Variables (Optional)

You can create a `.env` file in the `backend/` folder to override defaults:

```env
CHROMA_PATH=./chroma_db
OLLAMA_BASE_URL=http://localhost:11434
LLM_MODEL=llama3.2
EMBED_MODEL=mxbai-embed-large
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- [Ollama](https://ollama.com) — for making local LLMs effortless
- [LangChain](https://langchain.com) — for the RAG framework
- [ChromaDB](https://www.trychroma.com) — for the vector store
- [FastAPI](https://fastapi.tiangolo.com) — for the backend framework
