import { create } from 'zustand';

const useTwinStore = create((set) => ({
  features: {
    Age: 45,
    Gender: 1,
    ChestPainType: 0,
    RestingBP: 120,
    Cholesterol: 190,
    FastingBloodSugar: 0,
    MaxHeartRate: 150,
    ExerciseAngina: 0,
    Oldpeak: 0.0,
    ST_Slope: 1,
    BMI: 24.5,
    Sleep_Hours: 7.5,
    Stress_Level: 3,
    Steps_Per_Day: 8000,
    Water_Intake_L: 2.5,
    Smoking: 0,
    Alcohol: 0,
    Family_History: 0,
    Diet_Score: 80,
    Activity_Score: 75,
    Sodium_mg: 2300,
    Caffeine_mg: 200,
    Meditation_min: 15
  },
  metrics: {
    risk_score: 12,
    health_score: 88,
    actual_age: 45,
    biological_heart_age: 43,
    forecasts: { "1_Month": 12, "3_Month": 12, "6_Month": 13, "1_Year": 14 }
  },
  
  updateFeature: (key, value) => {
      set((state) => ({
         features: { ...state.features, [key]: Number(value) }
      }));
  },
  
  setMetrics: (data) => set({ metrics: data })
}));

export default useTwinStore;
