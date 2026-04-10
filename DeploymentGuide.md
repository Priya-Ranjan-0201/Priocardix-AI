# 🫀 PulseIQ — Deployment Guide

---

## Overview

PulseIQ has two parts that need to run simultaneously:
1. **Frontend** — React app (Vite) → Deploy to **Vercel** or **Netlify**
2. **ML Backend** — FastAPI (Python) → Deploy to **Railway**, **Render**, or a **VPS**

---

## 🖥️ LOCAL DEVELOPMENT (Offline / Laptop Demo)

### Requirements
- Node.js 18+ (`node --version` to check)
- Python 3.9+ (`python --version` to check)
- pip (`pip --version` to check)

### Start Backend
```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
✅ Backend running at: `http://localhost:8000`
✅ API docs at: `http://localhost:8000/docs`

### Start Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running at: `http://localhost:5173` (or 5174/5175/5176/5177 if ports busy)

### Login Credentials
| Field | Value |
|---|---|
| Neural Gate Key | `PULSE2026` |
| Email | `doctor@hospital.com` |
| Password | `admin` |
| OTP | `000000` |

---

## ☁️ PRODUCTION DEPLOYMENT

### Step 1 — Deploy Backend to Render.com (free tier)

1. Push project to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo → set root directory to `ml-service`
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Copy the deployed URL (e.g. `https://pulseiq-api.onrender.com`)

### Step 2 — Update Frontend API URL

In `frontend/src/pages/Predict.jsx`, change:
```js
// FROM:
const response = await fetch('http://localhost:8000/api/predict', ...);
// TO:
const response = await fetch('https://pulseiq-api.onrender.com/api/predict', ...);
```

Do the same in `DigitalTwin.jsx` for the `/api/simulate` endpoint.

### Step 3 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set root directory to `frontend`
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy → get your live URL

### Step 4 — Add CORS to Backend

In `ml-service/app/main.py`, ensure CORS allows your Vercel domain:
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.vercel.app", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🐳 DOCKER (Optional — for advanced deployment)

### Backend Dockerfile (`ml-service/Dockerfile`)
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Run with Docker
```bash
cd ml-service
docker build -t pulseiq-api .
docker run -p 8000:8000 pulseiq-api
```

---

## 🔧 ENVIRONMENT VARIABLES (for production)

Create `.env` in frontend root:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

Then in code, replace hardcoded URLs:
```js
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
fetch(`${API}/api/predict`, ...)
```

---

## 📦 BUILD FOR PRODUCTION

```bash
cd frontend
npm run build
# Creates optimized files in /dist folder
```

---

## 🗄️ DATABASE MIGRATION (Future)

Currently using localStorage. To upgrade:

1. Install PostgreSQL / MongoDB
2. Create user schema, history schema
3. Replace `localStorage.setItem/getItem` calls with:
   - REST API calls to a new `/api/users` and `/api/history` endpoint
   - Add JWT token authentication instead of localStorage-based auth
4. Update `authStore.js` to use token from API response

---

## ✅ PRE-DEMO CHECKLIST

Before any presentation or demo:

- [ ] Backend running (`python -m uvicorn app.main:app --reload`)
- [ ] Frontend running (`npm run dev`) and URL noted
- [ ] Both terminals left OPEN (don't close them)
- [ ] Browser open to the frontend URL
- [ ] Test login works: `PULSE2026` → `doctor@hospital.com/admin` → `000000`
- [ ] Test one scan: enter Age=55, BP=145, Chol=260, HR=130 and confirm result appears
- [ ] History page shows records
- [ ] 3D Twin loads and all 3 layers switch correctly

---

## ❗ TROUBLESHOOTING

| Problem | Solution |
|---|---|
| "System Error" on scan | Backend is offline — restart `uvicorn` command |
| Port already in use | Vite will auto-switch to next port — check terminal output |
| 3D heart not loading | Wait 3–5 seconds for Three.js to initialize on first load |
| History not showing | Open browser DevTools → Application → localStorage → delete `pulseiq_scan_history_v2` → refresh |
| Can't log in | Clear localStorage in DevTools → refresh → try again |
