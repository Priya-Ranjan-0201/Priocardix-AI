import pandas as pd
import numpy as np
import os

print("\n=======================================================")
print("[Digital Twin AI] STARTING DATA SYNTHESIS PIPELINE")
print("=======================================================\n")

N_SAMPLES = 500000

# 1. Base Demographics
np.random.seed(42)  # Locking seed for reproducible clinical data
age = np.random.normal(55, 15, N_SAMPLES)
age = np.clip(age, 25, 90).astype(int)
gender = np.random.choice([0, 1], size=N_SAMPLES, p=[0.45, 0.55]) # 1: Male, 0: Female

# 2. Vitals & Clinical Distributions
# Blood Pressure organically increases with biological age
resting_bp = np.random.normal(120 + (age - 40) * 0.4, 15)
resting_bp = np.clip(resting_bp, 90, 200).astype(int)

# Cholesterol modeling
cholesterol = np.random.normal(190 + (age - 40) * 0.5, 30)
cholesterol = np.clip(cholesterol, 120, 400).astype(int)

# 3. Lifestyles & Immersive Metrics
bmi = np.random.normal(27, 5, N_SAMPLES)
bmi = np.clip(bmi, 16, 45).round(1)

sleep = np.random.normal(7, 1.5, N_SAMPLES)
sleep = np.clip(sleep, 3, 10).round(1)

stress = np.random.randint(1, 11, N_SAMPLES) # Stress index 1-10
steps = np.random.normal(7000, 3000, N_SAMPLES)
steps = np.clip(steps, 1000, 20000).astype(int)
water = np.random.normal(2.0, 0.5, N_SAMPLES)
water = np.clip(water, 0.5, 4.0).round(1)

# Extraneous Habits
smoking = np.random.choice([0, 1], size=N_SAMPLES, p=[0.8, 0.2])
alcohol = np.random.choice([0, 1, 2], size=N_SAMPLES, p=[0.5, 0.4, 0.1]) # 0: None, 1: Moderate, 2: Heavy
family_history = np.random.choice([0, 1], size=N_SAMPLES, p=[0.7, 0.3])
diet_score = np.random.randint(1, 100, N_SAMPLES)
activity_score = np.random.randint(1, 100, N_SAMPLES)

# 4. Heart Specific Pathological Indicators
chest_pain_type = np.random.choice([0, 1, 2, 3], size=N_SAMPLES, p=[0.45, 0.25, 0.2, 0.1])
blood_sugar = np.random.choice([0, 1], size=N_SAMPLES, p=[0.85, 0.15]) # >120mg/dl

# Max Heart rate drops with age naturally
max_heart_rate = np.random.normal(200 - age * 0.9, 15)
max_heart_rate = np.clip(max_heart_rate, 70, 210).astype(int)

angina = np.random.choice([0, 1], size=N_SAMPLES, p=[0.7, 0.3])
oldpeak = np.random.exponential(1.0, N_SAMPLES)
oldpeak = np.clip(oldpeak, 0.0, 6.0).round(1)
st_slope = np.random.choice([0, 1, 2], size=N_SAMPLES, p=[0.4, 0.4, 0.2])

print("[Digital Twin AI] Injecting Covariant Multi-Collinear Rulesets...")

# 5. Core Mathematical Formulation of Heart Risk Probability
# Creating highly realistic correlated risk variables so SHAP explains it accurately
risk_prob = (
    (age / 90) * 0.18 +
    (resting_bp / 200) * 0.10 +
    (cholesterol / 400) * 0.12 +
    (bmi / 45) * 0.08 +
    (stress / 10) * 0.08 +
    smoking * 0.10 +
    (family_history * 0.05) +
    blood_sugar * 0.05 +
    angina * 0.08 +
    (chest_pain_type / 3) * 0.07 +
    (oldpeak / 6.0) * 0.04
)

# Deductions for good habits (Simulating Digital Twin "What-If" potentials)
risk_prob -= (
    (steps / 20000) * 0.07 +
    (sleep / 10) * 0.03 +
    (diet_score / 100) * 0.06 +
    (activity_score / 100) * 0.06
)

# Smooth noise
noise = np.random.normal(0, 0.06, N_SAMPLES)
risk_prob += noise

# Normalize risk
risk_prob = np.clip(risk_prob, 0, 1)

# Generate Labels based on median-offset for balance
threshold = np.median(risk_prob)
heart_disease = (risk_prob > threshold).astype(int)

print(f"[Digital Twin AI] Formulating schema for {N_SAMPLES} synthetic patients...")

df = pd.DataFrame({
    'Age': age,
    'Gender': gender,
    'ChestPainType': chest_pain_type,
    'RestingBP': resting_bp,
    'Cholesterol': cholesterol,
    'FastingBloodSugar': blood_sugar,
    'MaxHeartRate': max_heart_rate,
    'ExerciseAngina': angina,
    'Oldpeak': oldpeak,
    'ST_Slope': st_slope,
    'BMI': bmi,
    'Sleep_Hours': sleep,
    'Stress_Level': stress,
    'Steps_Per_Day': steps,
    'Water_Intake_L': water,
    'Smoking': smoking,
    'Alcohol': alcohol,
    'Family_History': family_history,
    'Diet_Score': diet_score,
    'Activity_Score': activity_score,
    'HeartDisease': heart_disease
})

os.makedirs('data', exist_ok=True)
csv_path = 'data/synthetic_cardio_500k.csv'
df.to_csv(csv_path, index=False)
print(f"✅ Success! 500,000 realistic clinical records injected into -> {csv_path}\n")
