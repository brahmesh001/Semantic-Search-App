from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import os
import uvicorn  # add this import

app = FastAPI()

# Allow requests from frontend (adjust if deployed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### -----------------------
### Utility Functions
### -----------------------

def load_transcript_from_text(raw_text: str) -> List[Tuple[str, str]]:
    lines = raw_text.strip().split('\n')
    chunks = []
    for line in lines:
        match = re.match(r'^\[(.*?)\]\s*(.*)', line.strip())
        if match:
            timestamp, text = match.groups()
            chunks.append((timestamp, text))
    return chunks

def tfidf_search(chunks: List[Tuple[str, str]], query: str) -> Tuple[str, str]:
    texts = [chunk[1] for chunk in chunks]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(texts + [query])
    cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()
    best_index = int(np.argmax(cosine_sim))
    return chunks[best_index]

def prepare_huggingface_embeddings(chunks: List[Tuple[str, str]]):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    texts = [chunk[1] for chunk in chunks]
    embeddings = model.encode(texts, normalize_embeddings=True)
    return model, embeddings

def huggingface_embedding_search(model, embeddings, chunks: List[Tuple[str, str]], query: str) -> Tuple[str, str]:
    query_embedding = model.encode([query], normalize_embeddings=True)[0]
    similarities = np.dot(embeddings, query_embedding)
    best_index = int(np.argmax(similarities))
    return chunks[best_index]

### -----------------------
### FastAPI Schema & Endpoint
### -----------------------

class QARequest(BaseModel):
    transcript: str   # Full transcript text with timestamps like: [00:01:00] This is a line
    question: str
    method: str       # "tfidf" or "llm2"

class QAResponse(BaseModel):
    timestamp: str
    chunk: str
    method_used: str

@app.post("/answer", response_model=QAResponse)
async def get_answer(request: QARequest):
    try:
        chunks = load_transcript_from_text(request.transcript)
        if not chunks:
            return {"timestamp": "", "chunk": "Invalid or empty transcript format.", "method_used": request.method}

        if request.method.lower() == "tfidf":
            timestamp, chunk = tfidf_search(chunks, request.question)
        elif request.method.lower() == "llm2":
            model, embeddings = prepare_huggingface_embeddings(chunks)
            timestamp, chunk = huggingface_embedding_search(model, embeddings, chunks, request.question)
        else:
            return {"timestamp": "", "chunk": "Unsupported method. Use 'tfidf' or 'llm2'.", "method_used": request.method}

        return {"timestamp": timestamp, "chunk": chunk, "method_used": request.method}
    except Exception as e:
        return {"timestamp": "", "chunk": f"Error: {str(e)}", "method_used": request.method}

if __name__ == "__main__":
    import sys

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))

    uvicorn.run("DL_model:app", host=host, port=port, reload=True)
