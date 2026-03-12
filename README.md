# LexAI — AI Legal Assistant for India

An AI-powered legal support platform that helps users understand Indian law. Describe your situation in plain language and get relevant IPC sections, possible court outcomes, precautions, recommended actions, and a downloadable professional report — all in seconds.

---

## What It Does

- **Legal Case Analysis** — Describe your situation in plain English or speak it aloud. Five specialized AI agents powered by Google Gemini process your query sequentially and return a structured legal breakdown.
- **IPC Section Identification** — Retrieves the most relevant Indian Penal Code sections with descriptions, punishments, fines, and Indian Kanoon reference links.
- **Outcome Prediction** — Lists realistic possible legal outcomes based on the applicable sections.
- **Precaution Advice** — Tells you what to do and not do to protect your legal position.
- **Recommended Actions** — Step-by-step guidance on what to do next.
- **Case History** — Every analysis is saved to your account. Delete individual cases or clear all history.
- **Report Downloads** — Download your full legal analysis as a professionally formatted PDF or DOCX file.
- **Voice Input** — Speak your case description directly into the microphone; text is transcribed in real time.
- **User Accounts** — Signup, login, persistent JWT sessions, password visibility toggle.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python), SQLAlchemy, SQLite (default) |
| AI | Google Gemini 1.5 Flash (5-agent pipeline) |
| Auth | JWT (python-jose), bcrypt password hashing |
| Reports | ReportLab (PDF), python-docx (DOCX) |

---

## Project Structure

```
ai-legal-assistant/
├── backend/
│   ├── main.py               # FastAPI app entry, CORS, router registration
│   ├── database.py           # SQLAlchemy engine, session, Base
│   ├── models.py             # DB models: User, UserQuery
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── auth_utils.py         # JWT creation, verification, bcrypt
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variable template
│   ├── routers/
│   │   ├── auth.py           # POST /signup, POST /login, GET /me
│   │   ├── query.py          # POST /analyze, GET /history, GET /{id}, DELETE /{id}, DELETE /history
│   │   └── report.py         # GET /download/{id}/{format}
│   └── agents/
│       └── orchestrator.py   # 5-agent Gemini pipeline
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # Landing page
│       │   ├── login/page.tsx     # Sign in
│       │   ├── signup/page.tsx    # Create account
│       │   ├── dashboard/page.tsx # Query input + case history sidebar
│       │   └── case/[id]/page.tsx # Full analysis result + download
│       ├── components/ui/
│       │   └── aurora.tsx         # Animated aurora background
│       └── lib/
│           └── api.ts             # Axios client, token helpers, all API calls
│
├── setup_windows.bat         # One-click setup for Windows
├── setup_mac_linux.sh        # One-click setup for Mac/Linux
├── start_backend.bat         # Start FastAPI server
└── start_frontend.bat        # Start Next.js dev server
```

---

## The 5-Agent Pipeline

When you submit a query, five agents run in sequence:

| Agent | Job |
|---|---|
| Agent 1 — Case Understanding | Classifies legal domain, extracts keywords, assesses severity |
| Agent 2 — Legal Retrieval | Fetches 3–4 most relevant IPC sections with punishments and links |
| Agent 3 — Outcome Prediction | Predicts 4–5 realistic legal outcomes |
| Agent 4 — Precaution Advisor | Lists specific precautions for the user's situation |
| Agent 5 — Summary Writer | Writes a plain-English case summary and recommended actions |

If no Gemini API key is provided, all five agents fall back to intelligent mock responses so the app still works for development and testing.

---

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the repo

```bash
git clone https://github.com/Arsh-J/AI-Legal-Assistant.git
cd AI-Legal-Assistant
```

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
copy .env.example .env       # Windows
cp .env.example .env         # Mac/Linux
```

Open `backend/.env` and fill in:

```env
SECRET_KEY=any-long-random-string
GEMINI_API_KEY=your_key_from_aistudio.google.com   # optional but recommended
```

Get a free Gemini key at [aistudio.google.com](https://aistudio.google.com).

Start the backend:

```bash
uvicorn main:app --reload
# Runs at http://localhost:8000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:3000
```

### Windows one-click setup

Run `setup_windows.bat` once to install everything, then use `start_backend.bat` and `start_frontend.bat` to start each server.

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user |
| POST | `/api/query/analyze` | ✓ | Run 5-agent analysis |
| GET | `/api/query/history` | ✓ | Get user's case history |
| GET | `/api/query/{id}` | ✓ | Get single case result |
| DELETE | `/api/query/{id}` | ✓ | Delete a single case |
| DELETE | `/api/query/history` | ✓ | Delete all history |
| GET | `/api/report/download/{id}/pdf` | ✓ | Download PDF report |
| GET | `/api/report/download/{id}/docx` | ✓ | Download DOCX report |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | No | Defaults to SQLite. Use PostgreSQL URL for production. |
| `SECRET_KEY` | Yes | JWT signing secret. Use a long random string. |
| `GEMINI_API_KEY` | No | If omitted, mock AI responses are used. |

---

## Disclaimer

This tool is for informational purposes only. It does not constitute legal advice. For serious legal matters, consult a qualified advocate.


---

## 🗂️ Project Structure

```
ai-legal-assistant/
├── backend/                  # FastAPI Python backend
│   ├── main.py               # App entry point
│   ├── database.py           # SQLAlchemy DB config
│   ├── models.py             # DB models (User, IPCSection, UserQuery)
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── auth_utils.py         # JWT authentication utilities
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variable template
│   ├── routers/
│   │   ├── auth.py           # Signup / Login endpoints
│   │   ├── query.py          # Legal query analysis endpoint
│   │   └── report.py         # PDF / DOCX report generation
│   └── agents/
│       └── orchestrator.py   # 5 AI agents (Gemini-powered)
│
└── frontend/                 # Next.js 14 React frontend
    ├── src/app/
    │   ├── page.tsx           # Landing page
    │   ├── login/page.tsx     # Login
    │   ├── signup/page.tsx    # Signup
    │   ├── dashboard/page.tsx # Query dashboard
    │   └── case/[id]/page.tsx # Case result + download
    ├── src/lib/api.ts         # Axios API client
    └── package.json
```

---

## 🚀 STEP-BY-STEP SETUP GUIDE

### Prerequisites – Install These First

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10+ | https://python.org/downloads |
| Node.js | 18+ | https://nodejs.org |
| Git | Any | https://git-scm.com |

---

### STEP 1 – Get Your Gemini API Key (FREE)

1. Go to **https://aistudio.google.com**
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API key"**
4. Copy the key (looks like: `AIzaSy...`)
5. Keep it safe — you'll need it in Step 3

> 💡 **Note:** If you skip this step, the app still works using mock AI responses!

---

### STEP 2 – Set Up the Backend

Open a terminal and run:

```bash
# Navigate to backend folder
cd ai-legal-assistant/backend

# Create a virtual environment
python -m venv venv

# Activate it:
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install all dependencies
pip install -r requirements.txt
```

---

### STEP 3 – Configure Environment Variables

```bash
# In the backend/ folder, copy the example file
cp .env.example .env
```

Now open `.env` in any text editor and fill in:

```env
DATABASE_URL=sqlite:///./legal_assistant.db
SECRET_KEY=my-super-secret-key-12345-change-this
GEMINI_API_KEY=AIzaSy_YOUR_KEY_HERE
```

> ✅ SQLite is used by default — no database installation needed!

---

### STEP 4 – Start the Backend Server

```bash
# Make sure you're in backend/ with venv activated
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

✅ Backend is running! Visit **http://localhost:8000/docs** to see the API documentation.

---

### STEP 5 – Set Up the Frontend

Open a **new terminal window**:

```bash
# Navigate to frontend folder
cd ai-legal-assistant/frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local
```

The `.env.local` file should contain:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### STEP 6 – Start the Frontend

```bash
# In the frontend/ folder
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

✅ Frontend is running!

---

### STEP 7 – Open the App

Go to **http://localhost:3000** in your browser.

**Test it:**
1. Click **"Get Started"** → Create an account
2. On the dashboard, type a legal question like:
   > *"Someone cheated me online by taking money but never delivered the product"*
3. Click **"Analyze Case"**
4. Wait 10-15 seconds for the 5 AI agents to analyze
5. View the full analysis with IPC sections, outcomes, and advice
6. Download the report as **PDF** or **DOCX**

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/query/analyze` | Submit legal query for analysis |
| GET | `/api/query/history` | Get user's query history |
| GET | `/api/query/{id}` | Get specific query result |
| GET | `/api/report/download/{id}/pdf` | Download PDF report |
| GET | `/api/report/download/{id}/docx` | Download DOCX report |

📖 Full interactive docs: **http://localhost:8000/docs**

---

## 🤖 AI Agent Architecture

| Agent | Role |
|-------|------|
| **Agent 1** – Case Understanding | Analyzes legal domain, keywords, severity |
| **Agent 2** – Legal Retrieval | Identifies relevant IPC sections |
| **Agent 3** – Outcome Prediction | Predicts punishments and consequences |
| **Agent 4** – Precaution Advisor | Suggests protective steps |
| **Agent 5** – Case Summarizer | Generates plain-language summary |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TailwindCSS |
| Backend | FastAPI, Python 3.10+ |
| Auth | JWT (python-jose) + bcrypt |
| Database | SQLite (dev) / PostgreSQL (prod) |
| AI | Google Gemini 1.5 Flash |
| Reports | ReportLab (PDF), python-docx (DOCX) |

---

## 🐘 Switching to PostgreSQL (Optional)

1. Install PostgreSQL from https://postgresql.org
2. Create a database: `createdb legal_assistant`
3. Update `.env`:
   ```
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/legal_assistant
   ```
4. Install driver: `pip install psycopg2-binary`
5. Restart the backend

---

## 🛠️ Troubleshooting

**❌ "ModuleNotFoundError"**
→ Make sure your virtual environment is activated: `source venv/bin/activate`

**❌ "Connection refused" on frontend**
→ Make sure the backend is running on port 8000

**❌ "Invalid API Key" for Gemini**
→ Check your `.env` file has the correct `GEMINI_API_KEY` value
→ Or leave it empty to use mock responses

**❌ npm install fails**
→ Make sure Node.js 18+ is installed: `node --version`

**❌ Port already in use**
→ Backend: `uvicorn main:app --reload --port 8001`
→ Frontend: `npm run dev -- --port 3001`

---

## 📜 Disclaimer

This application is for **informational purposes only** and does not constitute legal advice. Always consult a qualified advocate for matters requiring professional legal guidance.
