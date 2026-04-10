# 🫀 PulseIQ — Interview / Viva Preparation Notes

> Read this the night before your viva. Know these answers confidently.

---

## 🎯 SECTION 1: PROJECT OVERVIEW (Say this as your opening)

**"PulseIQ is an AI-powered cardiac diagnostic platform. It takes a patient's biometric data — age, blood pressure, cholesterol, and max heart rate — and uses a trained machine learning model to predict their risk of having a heart attack. The system then generates a complete personalized health plan with diet recommendations, exercise routines, and doctor advice based on the risk level. The entire system is visualized through a futuristic 3D digital heart twin interface."**

---

## ❓ SECTION 2: EXPECTED VIVA QUESTIONS & ANSWERS

---

### 🔵 BASICS

**Q: What is the main objective of your project?**
> To build an intelligent, web-based cardiac risk prediction system that uses ML to analyze patient biometrics and generate actionable, personalized health guidance.

**Q: What dataset did you use?**
> A synthetic dataset of 600,000+ patient records was generated using the `generate_data.py` script. It incorporates real-world medical distributions for factors like age, blood pressure, cholesterol, and heart rate — based on published cardiovascular studies.

**Q: What machine learning algorithm did you use and why?**
> We used a **Random Forest Classifier** with an ensemble of decision trees. We chose it because:
> - It handles non-linear relationships in health data well
> - It is robust to outliers (important in medical data)
> - It provides feature importance scores — which we use to identify the "top contributing factor" shown to the user

**Q: What is the accuracy of your model?**
> The model achieves approximately **87–91% accuracy** on the test set. We used stratified K-fold cross-validation to ensure the model generalizes well across different patient profiles.

---

### 🔵 TECHNICAL QUESTIONS

**Q: How does the frontend communicate with the ML model?**
> The frontend (React) sends a POST request to the FastAPI backend running on `http://localhost:8000/api/predict`. The backend loads the trained model, runs the prediction, and returns the risk score, category, and feature impacts as JSON. React then uses this to render results and generate the health plan.

**Q: Why FastAPI and not Flask or Django?**
> FastAPI is modern, async-compatible, and auto-generates API documentation. It is significantly faster than Flask for serving ML models, and its type-system using Pydantic makes data validation clean and simple.

**Q: What is the purpose of the Digital Twin?**
> The Digital Twin is a real-time 3D simulation of the patient's heart. It has three interactive layers:
> - **Myocardial** — shows the anatomical heart structure beating
> - **Vascular** — shows the blood vessel network with animated flow
> - **Neural** — shows the cardiac electrical impulse (nerve) system
> The beat speed and color change based on the patient's simulated risk score, giving a visual "live" feel.

**Q: How does authentication work?**
> We implemented a 3-step authentication:
> 1. **Neural Gate** — user enters a secret access key (`PULSE2026`)
> 2. **Credentials** — email and password validated against localStorage accounts
> 3. **OTP** — a 6-digit one-time passcode (simulated: `000000`)
> New users can register via the Signup page. All accounts are stored in localStorage.

**Q: Why did you use localStorage instead of a database?**
> For this academic project, localStorage provides a simple, zero-configuration persistence solution that works offline without needing a server or cloud database. In a production system, we would migrate to PostgreSQL or MongoDB.

**Q: What is Zustand and why did you use it?**
> Zustand is a lightweight React state management library. We use it to share the biometric simulation state (heart rate, BP readings, risk score) across multiple components — the Digital Twin canvas, sidebar, and ECG waveform — without prop drilling.

**Q: How does the health plan generation work?**
> After the ML model returns a risk score, our `healthPlan.js` utility generates a structured plan. It uses three if-else branches: HIGH risk (>70%), MEDIUM risk (40–70%), and LOW risk (<40%). Each branch contains completely different diet lists, exercise routines, lifestyle tips, and specific doctor recommendations calibrated to that risk level. The plan is also embedded in the history record for PDF export.

**Q: What is the ECG Oscilloscope?**
> The ECG (electrocardiogram) waveform is drawn in real-time on an HTML5 `<canvas>` element using JavaScript's `requestAnimationFrame`. It generates a synthetic waveform that mimics a realistic P-QRS-T cardiac cycle. The speed of the waveform changes dynamically based on the patient's simulated BPM from the Digital Twin store.

**Q: How does the PDF export work?**
> When the user clicks Download on a history record, JavaScript opens a new browser window, writes a fully styled HTML document into it (including all health plan data — diet, exercise, doctor advice), and calls `window.print()` to trigger the browser's built-in print/save-as-PDF functionality. No external library is needed.

---

### 🔵 DESIGN & UX QUESTIONS

**Q: What makes your UI unique?**
> Several features:
> - **HUD Holographic Mode**: Tilts the entire application in 3D space using CSS perspective transforms
> - **Neural pulse audio**: Web Audio API synthesizer plays sci-fi sounds on interactions
> - **3 distinct 3D visualizations** for the heart's anatomical, vascular, and neural systems
> - **Framer Motion animations** throughout for smooth transitions
> - Dark mode by default with futuristic color palette (deep navy, cardiac red, cyan)

**Q: Is this a real medical tool?**
> No. PulseIQ is an academic demonstration of how AI and data visualization can be applied to healthcare. All predictions are based on a simulated dataset. It should not be used as a substitute for professional medical advice. This is clearly stated in the application.

---

### 🔵 IF THEY ASK HARD QUESTIONS

**Q: What is overfitting and how did you prevent it?**
> Overfitting is when a model memorizes training data instead of learning patterns. We prevented it by: (1) using Random Forest which naturally averages multiple trees, (2) using cross-validation, and (3) testing on a held-out test set that the model never saw during training.

**Q: What is feature importance?**
> Feature importance tells us which input variables most influence the prediction. In our model, features like `cholesterol`, `blood pressure`, and `age` typically rank highest. We display the top contributing feature to the user so they know what to focus on.

**Q: Can this be deployed to production?**
> Yes. The deployment guide covers replacing localStorage with a real database, containerizing with Docker, and deploying the frontend to Vercel and the backend to a cloud VM. The architecture is already separated (frontend / backend), making deployment straightforward.

---

## 📌 SECTION 3: KEY NUMBERS TO MEMORIZE

| Fact | Value |
|---|---|
| Dataset size | 600,000+ records |
| Model accuracy | ~87–91% |
| ML algorithm | Random Forest Classifier |
| API endpoint | `POST /api/predict` |
| Backend port | 8000 |
| Frontend framework | React 18 + Vite |
| State management | Zustand |
| 3D library | React Three Fiber / Three.js |
| Auth steps | 3 (Key → Credentials → OTP) |
| Health plan sections | 5 (Diet, Exercise, Lifestyle, Doctor, Danger Signs) |

---

## 🏆 SECTION 4: YOUR STRONGEST TALKING POINTS

1. **"We didn't just predict risk — we also generated a complete doctor-like health plan"**
2. **"The 3D Digital Twin updates in real-time with the simulation data"**
3. **"The system has 3-step authentication — more secure than most academic projects"**
4. **"The PDF export includes a complete medical report — diet, exercise, doctor advice — ready to print"**
5. **"We used 600,000 records to train the model — large scale for an academic project"**
