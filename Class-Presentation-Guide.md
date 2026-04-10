# 🫀 PulseIQ — Class Presentation Script
## How to Present & What to Say — For Full Marks

---

## ⚡ GOLDEN RULE
**Show the running demo first. Talk while it runs. Do NOT show code unless the teacher asks.**
Teachers give marks based on what WORKS — demo is everything.

---

## 🎬 PRESENTATION ORDER (Follow this exactly)

### STEP 1 — Open with the Problem (30 seconds)
Stand up and say this:

> *"Heart disease is the number one cause of death in India. One in four deaths is cardiac-related. The problem is — most people don't know their risk until it's too late. Our project, PulseIQ, solves this by using Artificial Intelligence to predict a person's heart attack risk in seconds — and then tells them exactly what diet to follow, what exercise to do, and when to see a doctor."*

✅ **Why this works**: You stated a real-world problem and immediately connected it to your solution. Teachers love this.

---

### STEP 2 — Live Demo: Login (1 minute)
Open browser → go to `http://localhost:5177`

**Say:**
> *"The system has a 3-step security gateway. First, the user enters a secret Neural Access Key. Only authorized clinicians know this."*

Type: `PULSE2026` → click UNLOCK TERMINAL

> *"After the biometric scan, they enter their clinical credentials..."*

Type: `doctor@hospital.com` / `admin`

> *"And finally, a one-time passcode for 2-factor authentication."*

Type: `000000` → enter dashboard

✅ **Why this works**: Shows real security. Most student projects have zero auth.

---

### STEP 3 — Show the Dashboard (30 seconds)
Point to dashboard and say:

> *"This is the main command center. You can see live biometric readings — heart rate, blood pressure, cholesterol, and a calculated health score — all updating in real-time."*

Move the sliders slightly to show them changing.

> *"These simulate real patient data. In a real hospital deployment, this would connect to actual monitoring devices via Bluetooth or USB."*

✅ **Why this works**: Shows you thought about real-world extension.

---

### STEP 4 — 3D Digital Heart Twin (1.5 minutes)
Click **Digital Twin** in sidebar.

> *"This is the 3D Digital Heart Twin — a real-time simulation of the patient's heart."*

Click **MYOCARDIAL** tab:
> *"The Myocardial view shows the anatomical structure — left ventricle, right ventricle, atria, aortic arch, and coronary arteries. Watch the heartbeat animation — the speed changes based on the risk score."*

Click **VASCULAR** tab:
> *"The Vascular view shows the entire blood vessel network — arteries and veins — with animated blood flow particles moving through each vessel in real time."*

Click **NEURAL** tab:
> *"The Neural view shows the cardiac electrical impulse system — the nerve nodes fire and impulse particles travel between them, just like a real ECG signal."*

Click the **HUD MODE** toggle if confident:
> *"We also built a Holographic HUD mode — the entire UI tilts in 3D space, like a futuristic medical display."*

✅ **Why this works**: This is the most visually impressive part. Let it breathe.

---

### STEP 5 — AI Heart Scanner (2 minutes)
Click **Check My Heart** in sidebar.

> *"This is the AI Heart Scanner. The teacher can actually test it right now if they want."*

Enter example data and say:
> - Age: `55`
> - Blood Pressure: `145`
> - Cholesterol: `260`
> - Max Heart Rate: `130`

> *"I'm entering a high-risk patient profile."*

Click **START THE SCAN.**

> *"The AI sends this data to our FastAPI backend, which runs a trained Random Forest machine learning model on 600,000 patient records. After analysis..."*

(Wait for result)

> *"The model outputs a percentage risk score, identifies the top contributing factor — in this case cholesterol — and then our system automatically generates a complete personalized health plan."*

Scroll down to show the health plan sections:

> *"You can see five sections: Diet Plan with specific foods to eat and avoid, a 7-day Exercise Routine, Lifestyle Recommendations, Doctor's Advice, and Emergency Warning Signs. This is calibrated to the risk level — a HIGH risk patient gets a completely different plan than a LOW risk one."*

✅ **Why this works**: This demonstrates the ML + domain knowledge combination — exactly what INT 428 expects.

---

### STEP 6 — Medical History + PDF (45 seconds)
Click **Health History** in sidebar.

> *"Every scan is automatically saved to the patient's medical history. You can see the risk score, date, and source."*

Click the **download** icon on one record.

> *"And every record can be exported as a full PDF report — including the complete diet plan, exercise schedule, and doctor recommendations. This is something a real patient can take to their actual doctor."*

✅ **Why this works**: Shows end-to-end value — input → analysis → actionable output.

---

### STEP 7 — Close Strong (30 seconds)

> *"To summarize: PulseIQ combines machine learning, 3D visualization, and medical knowledge into a single system. It doesn't just predict risk — it gives people a complete roadmap to improve their heart health. The tech stack includes React, FastAPI, Three.js, and a Random Forest model trained on 600,000 records. Thank you."*

---

## 🧠 FILE → FEATURE MAP (For When Teacher Points at Code)

| If teacher asks about... | Show/mention this file |
|---|---|
| ML prediction | `ml-service/app/main.py` |
| Model training | `ml-service/train_advanced.py` |
| Dataset | `ml-service/data/` folder |
| 3D heart animation | `frontend/src/components/DigitalTwinCanvas.jsx` |
| ECG waveform | `frontend/src/components/ECGWaveform.jsx` |
| Login / security | `frontend/src/pages/Login.jsx` |
| AI health plan | `frontend/src/utils/healthPlan.js` |
| Scan + results | `frontend/src/pages/Predict.jsx` |
| Medical history + PDF | `frontend/src/pages/Reports.jsx` |
| Biometric simulation | `frontend/src/store/digitalTwinStore.js` |
| Authentication state | `frontend/src/store/authStore.js` |
| Global layout + HUD | `frontend/src/layouts/MainLayout.jsx` |
| Routing structure | `frontend/src/App.jsx` |

---

## 💬 ONE-LINE ANSWERS FOR QUICK FIRE QUESTIONS

| Question | Your Answer |
|---|---|
| What ML model? | **Random Forest Classifier** |
| What accuracy? | **87–91% on test set** |
| Dataset size? | **600,000+ patient records** |
| Why React? | **Component-based, fast, industry standard for dashboards** |
| Why FastAPI? | **Python-native, async, perfect for serving ML models** |
| Real or fake data? | **Synthetic but medically calibrated — used for academic demo** |
| Can it deploy? | **Yes — Vercel (frontend) + cloud VM (backend). Deployment guide included.** |
| Is it a real medical tool? | **No — it's an AI decision-support system for demonstration and educational use** |

---

## ⚠️ THINGS TO NOT SAY

- ❌ Don't say "we just used localStorage" — say **"We used client-side persistence, which for a deployed version would be replaced by a cloud database"**
- ❌ Don't say "it's a simple project" — say **"It's a full-stack system combining ML, 3D graphics, and a RESTful API"**
- ❌ Don't say "I don't know" — always say **"That would be the next step in extending this project"** and pivot to something you DO know
- ❌ Don't open VS Code unless asked — keep the focus on the running demo

---

## 🏆 MARKS STRATEGY

| Criteria | How to Score Full Marks |
|---|---|
| Functionality | Demo all 5 main pages: Login, Dashboard, 3D Twin, AI Scanner, History |
| ML Component | Explain Random Forest clearly — show the prediction working live |
| Innovation | Mention the 3D Digital Twin, real-time ECG, holographic HUD, and PDF report with health plan |
| Presentation | Speak confidently, use technical words correctly, show it working — don't read slides |
| Viva | Study Section 2 of Interview-Viva-Notes.md — memorize the key numbers |
