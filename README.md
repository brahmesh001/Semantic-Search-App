# 🧠 Transcript Navigator

Transcript Navigator is a semantic search application that allows users to ask natural-language questions about video or audio transcripts and receive **timestamped** relevant responses using either **TF-IDF** or **LLM-based embeddings** depending on context.



---

## 🚀 Features

* 🔍 Intelligent transcript search
* 🧠 Chooses TF-IDF or LLM automatically
* 🕓 Timestamped responses
* 📡 REST API with FastAPI
* 💡 Clean and responsive UI (Next.js + Tailwind CSS)

---

## 🔧 Setup Instructions

### Backend (FastAPI)

1. Navigate to backend:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start server:

   ```bash
   uvicorn DL_model:app --reload
   ```

4. Access it at:

   ```
   http://localhost:8000
   ```

---

### Frontend (Next.js)

1. Navigate to frontend:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build and export:

   ```bash
   npm run build
   ```

4. Serve the static site:

   ```bash
   npx serve out
   ```

5. Open in browser:

   ```
   http://localhost:3000
   ```

---

## 🧪 Output

* ✅ You can find a sample result in [`output.txt`](./backend/output.txt)
* 📸 Screenshots are provided in `screenshots/` (add your screenshot files if you haven't yet)

---

## 📄 Documentation

See [`Transcript.md`](./Transcript.md) for a detailed explanation of how the system works and how the logic was implemented.

---

## ☁️ Deployment on Render

Render uses `render.yaml` for deploying both frontend and backend:

```yaml
services:
  - type: web
    name: semantic-search-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/out

  - type: web
    name: semantic-search-fastapi
    env: python
    buildCommand: cd backend && pip install -r requirements.txt
    startCommand: uvicorn DL_model:app --host 0.0.0.0 --port $PORT
    workingDir: backend
```

Make sure the `next.config.js` file in frontend includes:

```js
module.exports = {
  output: 'export',
};
```

---

## ✅ TODO

* [ ] Add streaming audio input support
* [ ] Improve LLM model efficiency
* [ ] UI enhancements

---

## 📬 Contact

For questions or issues, please open an Issue or connect via LinkedIn.

---
