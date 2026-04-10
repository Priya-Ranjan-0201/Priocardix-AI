from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

app = FastAPI(title="PulseIQ AI Cardio Digital Twin Gateway")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

digital_twin_engine = None
scaler = None
expected_features = []

def load_engine():
    global digital_twin_engine, scaler, expected_features
    try:
        with open("app/models/digital_twin_model.pkl", "rb") as f:
            payload = pickle.load(f)
            digital_twin_engine = payload['model']
            scaler = payload['scaler']
            expected_features = payload['features']
        return True
    except FileNotFoundError:
        return False

# Try loading once on boot
load_engine()

class LegacyPatientData(BaseModel):
    age: int
    resting_bp: int
    cholesterol: int
    max_heart_rate: int = 150 # Optional for legacy

class PatientTwinData(BaseModel):
    Age: int
    Gender: int = 1
    RestingBP: int
    Cholesterol: int
    Smoking: int = 0
    Alcohol: int = 0
    Diabetes: int = 0
    BMI: float = 25.0
    Stress_Level: int = 5
    Sleep_Hours: float = 7.0
    Family_History: int = 0

@app.get("/")
def health_check():
    return {"status": "PulseIQ Master Fusion Engine Active...", "model_loaded": digital_twin_engine is not None, "features": expected_features}

@app.post("/api/predict")
def predict_legacy(data: LegacyPatientData):
    if digital_twin_engine is None:
        load_engine()
        
    mapped_data = {
        'Age': data.age,
        'Gender': 1,
        'RestingBP': data.resting_bp,
        'Cholesterol': data.cholesterol,
        'Smoking': 1 if data.age > 60 else 0, # Heuristic fallback
        'Alcohol': 0,
        'Diabetes': 1 if data.cholesterol > 250 else 0,
        'BMI': 28.0 if data.resting_bp > 150 else 24.0,
        'Stress_Level': 7 if data.resting_bp > 165 else 4,
        'Sleep_Hours': 6.0 if data.resting_bp > 160 else 7.5,
        'Family_History': 1 if data.cholesterol > 260 else 0
    }
    
    df = pd.DataFrame([mapped_data])
    df = df[expected_features]
    scaled = scaler.transform(df)
    
    risk_prob = float(digital_twin_engine.predict_proba(scaled)[0][1] * 100)
    
    # MASTER CLINICAL OVERRIDE
    if data.resting_bp >= 180: risk_prob = max(risk_prob, 95.0)
    elif data.resting_bp >= 160: risk_prob = max(risk_prob, 72.0)
    
    # SHAP-inspired explanation
    explanation = {
        "Blood Pressure": float(2.2 * (data.resting_bp - 120)),
        "Cholesterol": float(1.5 * (data.cholesterol - 190)),
        "Age": float(1.2 * (data.age - 45))
    }
    
    return {
        "risk_score": round(risk_prob, 2),
        "risk_category": "CRITICAL" if risk_prob > 80 else "HIGH" if risk_prob > 55 else "ELEVATED" if risk_prob > 30 else "STABLE",
        "top_contributing_feature": max(explanation, key=lambda k: abs(explanation[k])),
        "feature_impacts": explanation
    }

@app.post("/api/simulate")
def simulate_twin(data: PatientTwinData):
    if digital_twin_engine is None:
        load_engine()
            
    # Map input directly to expected features
    mapped_dict = data.model_dump()
    df = pd.DataFrame([mapped_dict])
    
    # Fill any missing expected features from the store
    for col in expected_features:
        if col not in df.columns:
            df[col] = 0 # Default fallback
            
    df = df[expected_features]
    scaled_features = scaler.transform(df)
    
    risk_prob = float(digital_twin_engine.predict_proba(scaled_features)[0][1] * 100)
    
    # Real-World Sensitivity Adjustments
    if data.RestingBP > 175: risk_prob = max(risk_prob, 88.5)
    
    bpm_penalty = max(0, data.RestingBP - 120) * 0.4
    stress_penalty = data.Stress_Level * 0.8
    bio_age = float(data.Age + bpm_penalty + stress_penalty - (data.Sleep_Hours * 0.4))
    
    forecasts = {
        "1_Month": float(max(0, min(100, risk_prob + (data.Stress_Level * 0.5)))),
        "3_Month": float(max(0, min(100, risk_prob + (data.Stress_Level * 2.5)))),
        "6_Month": float(max(0, min(100, risk_prob + (data.Stress_Level * 5.0)))),
        "1_Year": float(max(0, min(100, risk_prob + (data.Stress_Level * 9.0)))),
    }
    
    # Calculate Simulated Impacts for UX
    explanation = {
        "Blood Pressure": float(2.5 * (data.RestingBP - 120)),
        "Cholesterol": float(1.8 * (data.Cholesterol - 190)),
        "Age": float(1.4 * (data.Age - 45))
    }
    
    return {
        "risk_score": round(risk_prob, 2),
        "health_score": round(float(100 - risk_prob), 1),
        "biological_heart_age": round(bio_age, 1),
        "forecasts": {k: round(v, 1) for k,v in forecasts.items()},
        "top_contributing_feature": max(explanation, key=lambda k: abs(explanation[k])),
        "feature_impacts": explanation,
        "risk_category": "CRITICAL" if risk_prob > 80 else "HIGH" if risk_prob > 55 else "ELEVATED" if risk_prob > 30 else "STABLE"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
