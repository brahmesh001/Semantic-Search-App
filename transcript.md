# Transcript: Semantic Transcript Navigator

## 🎯 Project Title
**Semantic Transcript Navigator using Deep Learning and Vector Similarity**

---

## 📝 Objective

The primary goal of this project is to build a tool that allows users to search through a video/audio transcript using **natural language queries**, and retrieve the **most semantically relevant chunk** of the transcript along with its **timestamp**. It intelligently decides whether to use traditional TF-IDF or a modern language model (LLM2) for understanding the query context.

---

## 🔧 Tools and Technologies Used

- **Python** for backend logic
- **FastAPI** for serving the model as an API
- **Next.js** for the frontend user interface
- **scikit-learn** for TF-IDF vectorization
- **Sentence Transformers / HuggingFace Transformers** for semantic embeddings
- **cosine_similarity** for ranking transcript chunks
- **Render.com** for deployment

---


---

## 🔍 Step-by-Step Process

### 1. **Transcript Preprocessing**

- The transcript is loaded from a `.txt` file.
- It is segmented into chunks (e.g., every 2–3 sentences) along with associated timestamps.
- Text is cleaned: removing filler words, stopwords, extra whitespace, and punctuation.

### 2. **Query Vectorization: TF-IDF vs. LLM2**

- When a user enters a query, a custom logic determines:
  - **Use TF-IDF** if the query is keyword-based or factual.
  - **Use LLM2** if the query is contextual, vague, or semantically rich.
- This decision can be made using simple heuristics (word count, presence of verbs) or a classifier.

### 3. **Semantic Search**

- Transcript chunks are vectorized using the selected method.
- The user query is also converted into a vector.
- **Cosine similarity** is calculated between the query and each transcript chunk.
- The top-matching chunk is selected as the answer.

### 4. **Output Generation**

- The system outputs:
  - Most relevant chunk text
  - Corresponding timestamp
  - Optional similarity score (for debugging or confidence)

---

## 🌐 Web App Functionality (Frontend)

- The frontend is built using **Next.js**.
- Users can:
  - Input their natural language question.
  - View the most relevant part of the transcript.
  - See the **exact timestamp** to jump in the video/audio.

---

## 🔄 Deployment

- The webpage and model were deployed locally because the computational resources provided by 'render' were too less to help run the hugging face model but tfidf model ran fine .

