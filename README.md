# 🫀 PulseIQ — AI-Powered Cardiac Diagnostic Platform

> A futuristic, AI-driven heart health dashboard that predicts cardiac risk, simulates a 3D Digital Heart Twin, and generates personalized medical health plans.

---

## 🚀 What is PulseIQ?

PulseIQ is a full-stack web application that acts as a **personal cardiac diagnostic command center**. It uses a trained Machine Learning model to predict heart attack risk from biometric data, then generates a complete personalized health plan including diet, exercise, and doctor advice — all inside a stunning, futuristic UI.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **3-Step Secure Login** | Secret Neural Key → Email/Password → OTP (2FA) |
| 🫀 **3D Digital Heart Twin** | 3 distinct 3D views: Anatomical Heart, Vascular Network, Neural Network |
| 🤖 **AI Heart Scanner** | Predicts heart attack risk % from age, BP, cholesterol, heart rate |
| 📋 **Full Health Plan** | Personalized diet plan, 7-day exercise routine, doctor recommendations |
| 📂 **Medical History** | Persistent scan records with PDF download (includes full health plan) |
| 💬 **AI Chatbot** | Keyword-based health assistant for questions |
| 💓 **Live ECG Monitor** | Real-time canvas-based oscilloscope synced to heart rate |
| 🌌 **HUD Holographic Mode** | 3D-tiliting futuristic UI mode with scan-line overlay |
| 🔊 **Sci-Fi Audio Engine** | Web Audio API neural pulse sounds on layer switching |
| ⚙️ **Settings / BIOS Panel** | Voice control, theme, biological encryption toggle |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — fast build tool
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — animations
- **React Three Fiber + Three.js** — 3D heart visualization
- **Recharts** — data charts
- **Zustand** — state management
- **Lucide React** — icons
- **Web Audio API** — sound effects
- **Web Speech API** — voice announcements

### Backend (ML Engine)
- **FastAPI** (Python) — REST API
- **Scikit-learn** — ML model (Random Forest / Logistic Regression)
- **Uvicorn** — ASGI server
- **Pandas / NumPy** — data processing

### Storage
- **localStorage** — user accounts, scan history, settings (no external database needed)

---

## 📂 Project Structure

```
int 428 project/
├── frontend/                   ← React web application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx       ← 3-step auth gateway
│   │   │   ├── Signup.jsx      ← New user registration
│   │   │   ├── DigitalTwin.jsx ← 3D heart + live biometrics
│   │   │   ├── Predict.jsx     ← AI scanner + health plan
│   │   │   ├── Reports.jsx     ← Medical history + PDF export
│   │   │   ├── Chatbot.jsx     ← AI health assistant
│   │   │   └── Settings.jsx    ← System configuration
│   │   ├── components/
│   │   │   ├── DigitalTwinCanvas.jsx  ← Three.js 3D heart
│   │   │   └── ECGWaveform.jsx        ← Live ECG canvas
│   │   ├── store/
│   │   │   ├── authStore.js           ← Authentication state
│   │   │   └── digitalTwinStore.js    ← Biometric simulation state
│   │   ├── utils/
│   │   │   └── healthPlan.js          ← Health plan generator
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx         ← Sidebar + HUD mode
│   │   └── App.jsx                    ← Routes & navigation
│   └── package.json
│
├── ml-service/                 ← Python FastAPI ML backend
│   ├── app/
│   │   ├── main.py             ← API endpoints (/predict, /simulate)
│   │   └── models/             ← Trained ML model files
│   ├── data/                   ← Training datasets
│   ├── train_advanced.py       ← Model training script
│   ├── generate_data.py        ← Synthetic data generator
│   └── requirements.txt        ← Python dependencies
│
├── README.md
├── DeploymentGuide.md
├── Interview-Viva-Notes.md
└── Presentation-Slides.md
```

---

## ⚡ Quick Start (Run Locally)

### Requirements
- Node.js 18+
- Python 3.9+
- pip

### Step 1 — Start the AI Backend
```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# Runs at: http://localhost:8000
```

### Step 2 — Start the Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
# Runs at: http://localhost:5173 (or next available port)
```

### Step 3 — Open in browser
Visit the URL shown by Vite (e.g. `http://localhost:5177`)

---

## 🔑 Login Credentials

| Step | Value |
|---|---|
| Neural Gate Key | `PULSE2026` |
| Email | `doctor@hospital.com` |
| Password | `admin` |
| OTP | `000000` |

---

## 🤖 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/predict` | POST | Predicts heart attack risk from biometric data |
| `/api/simulate` | POST | Simulates real-time digital twin metrics |

### Example Request (`/api/predict`)
```json
{
  "age": 55,
  "resting_bp": 145,
  "cholesterol": 280,
  "max_heart_rate": 140
}
```

### Example Response
```json
{
  "risk_score": 74,
  "risk_category": "High Risk",
  "top_contributing_feature": "cholesterol",
  "feature_impacts": { "cholesterol": -8.5, "age": -4.2, ... }
}
```

---

## 📄 License
Academic Project — INT 428 | For educational and demonstration purposes only.
Not intended as a real medical diagnostic tool.
