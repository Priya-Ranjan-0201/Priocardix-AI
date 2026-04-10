/**
 * Generates a structured, risk-level-specific health plan.
 * riskScore: number 0–100
 * formData: { age, resting_bp, cholesterol, max_heart_rate }
 * topFeature: string (the main contributing factor)
 * riskCategory: string (from ML model)
 */
export function generateHealthPlan(riskScore, formData, topFeature, riskCategory) {
  const age  = parseInt(formData?.age)           || 45;
  const bp   = parseInt(formData?.resting_bp)    || 120;
  const chol = parseInt(formData?.cholesterol)   || 200;

  // ── Risk level buckets ─────────────────────────────────────────────────
  const isHigh   = riskScore > 70;
  const isMedium = riskScore > 40 && riskScore <= 70;
  const isLow    = riskScore <= 40;

  // ─────────────────────────────────────────────────────────────────────────
  // DIET PLAN
  // ─────────────────────────────────────────────────────────────────────────
  const mustEat   = [];
  const mustAvoid = [];

  if (isHigh) {
    mustEat.push('Oats with no sugar every morning — 1 bowl compulsory');
    mustEat.push('Steamed or boiled vegetables only — spinach, broccoli, bottle gourd');
    mustEat.push('Brown rice or 2 whole wheat chapati max per meal — no white rice');
    mustEat.push('Moong dal soup — easy on the heart, reduces inflammation');
    mustEat.push('10 raw almonds and 5 walnuts every morning before breakfast');
    mustEat.push('Pomegranate juice (fresh, no sugar) — improves blood flow');
    mustEat.push('Garlic: 2 raw cloves on empty stomach daily — lowers BP and cholesterol');
    mustEat.push('Flaxseeds 1 tsp in curd or food — reduces bad cholesterol (LDL)');
    mustEat.push('Green tea (no sugar) — 2 cups daily for antioxidants');
    mustEat.push('Minimum 10 glasses of plain water daily — keeps blood thin');

    mustAvoid.push('STOP all fried food immediately — no samosa, puri, pakoda, chips');
    mustAvoid.push('STOP adding salt to food — use lemon and herbs instead');
    mustAvoid.push('No pickles, papad, or any packaged/processed food');
    mustAvoid.push('No full-fat dairy — switch to skimmed milk and low-fat curd only');
    mustAvoid.push('No red meat, pork, or organ meats (liver, kidney)');
    mustAvoid.push('No egg yolk — egg white is ok (max 1 per day)');
    mustAvoid.push('No sugar or sweets — no mithai, biscuits, cake, cold drinks');
    mustAvoid.push('No coffee or energy drinks — switch to herbal tea or water');
    mustAvoid.push('No alcohol — even one drink significantly raises heart risk at this level');
    mustAvoid.push('No smoking — consult doctor for nicotine replacement therapy');
  } else if (isMedium) {
    mustEat.push('Oats or whole wheat upma every morning');
    mustEat.push('2–3 servings of fresh vegetables per day — mix of raw and cooked');
    mustEat.push('Fruits with low sugar — apple, guava, papaya — 2 per day');
    mustEat.push('Dal or legumes (rajma, chana, moong) once daily for protein');
    mustEat.push('Low-fat dairy — toned milk, curd, paneer in moderation');
    mustEat.push('Nuts — 8 almonds and 3 walnuts daily');
    mustEat.push('Fish (rohu, mackerel, tuna) 2–3 times per week — Omega-3 for heart');
    mustEat.push('8–9 glasses of water daily');
    mustEat.push('Olive oil instead of refined oil for cooking — small amounts');

    mustAvoid.push('Reduce fried food to maximum 1–2 times per week');
    mustAvoid.push('Cut salt to less than 5g/day — avoid extra salt at the table');
    mustAvoid.push('Avoid packaged snacks, instant noodles, ready-to-eat meals');
    mustAvoid.push('Limit sweets and sugar to 2–3 times per week maximum');
    mustAvoid.push('Limit alcohol to 1 unit on weekends only (not recommended for heart)');
    mustAvoid.push('Reduce red meat to once a week — prefer chicken or fish');
    mustAvoid.push('Avoid coconut oil, vanaspati ghee, and palm oil in cooking');
  } else {
    mustEat.push('Maintain your current healthy eating — balanced meals are working!');
    mustEat.push('Continue with whole grains, fruits, and vegetables daily');
    mustEat.push('Include Omega-3 rich foods — fish, walnuts, flaxseeds 3×/week');
    mustEat.push('Plenty of colourful vegetables — aim for 5 different colours per day');
    mustEat.push('Stay hydrated — 8 glasses of water daily');
    mustEat.push('Include berries and antioxidant-rich fruits regularly');

    mustAvoid.push('Occasional indulgences are fine — maintain moderation');
    mustAvoid.push('Avoid making fried or junk food a daily habit');
    mustAvoid.push('Keep alcohol minimal — wine OK occasionally if any');
    mustAvoid.push('Watch sugar intake — no need to cut out but avoid excess');
  }

  // Extra based on specific factors
  if (bp > 130) {
    mustEat.push('Potassium-rich foods: banana, sweet potato — lowers blood pressure');
    mustAvoid.push('No extra salt — target less than 2g sodium per day if BP > 140');
  }
  if (chol > 200) {
    mustEat.push('Isabgol (psyllium husk) — 1 tsp in warm water before sleep — cuts LDL');
    mustAvoid.push('Avoid ghee, butter, cream — maximum 1 tsp ghee per day if at all');
  }

  // Meal plan based on risk level
  const mealPlan = isHigh ? {
    'Morning (6:30 AM)':    '1 glass warm water + 2 raw garlic cloves + soaked fenugreek seeds',
    'Breakfast (8 AM)':     '1 bowl oats (no sugar) + 5 almonds + 1 glass skimmed milk',
    'Mid-morning (10 AM)':  '1 glass pomegranate or amla juice — no sugar',
    'Lunch (1 PM)':         '1 bowl moong dal + 1–2 whole wheat chapati + steamed vegetables + salad (no dressing)',
    'Afternoon (4 PM)':     'Green tea + 5 walnuts — NO biscuits or tea-snacks',
    'Dinner (6:30–7 PM)':   '1 bowl vegetable soup + 1 chapati + dal + light sabzi — EAT EARLY',
    'Before Bed':           '1 glass warm skimmed milk + pinch of turmeric',
  } : isMedium ? {
    'Morning (7 AM)':       'Warm water with lemon + 8 soaked almonds',
    'Breakfast (8:30 AM)':  'Oats / poha / daliya with vegetables + 1 glass toned milk',
    'Mid-morning (11 AM)':  '1 fruit (apple/guava/papaya) — avoid mango and banana if sugar is high',
    'Lunch (1–2 PM)':       '2 chapati + 1 bowl dal + 1 bowl sabzi + salad + curd',
    'Evening (5 PM)':       'Green tea + roasted chana or sprouts — avoid chips/namkeen',
    'Dinner (7–8 PM)':      '2 chapati + light sabzi + dal or soup — avoid heavy rice at night',
    'Before Bed':           '1 glass warm milk',
  } : {
    'Morning':       'Warm water + fruits or light breakfast of your choice',
    'Breakfast':     'Whole grain options — oats, multigrain toast, eggs — balanced',
    'Lunch':         'Balanced plate: 50% vegetables, 25% grain, 25% protein',
    'Evening':       'Healthy snack — nuts, fruits, yogurt — avoid mindless junk',
    'Dinner':        'Light and early — lean protein + vegetables + small serving of grain',
    'Before Bed':    'Warm milk or herbal tea — avoid heavy meals after 8 PM',
  };

  const diet = { mustEat, mustAvoid, mealPlan };

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISE PLAN
  // ─────────────────────────────────────────────────────────────────────────
  let dailyGoal, routine, warning;

  if (isHigh) {
    dailyGoal = '⚠️ LIGHT ACTIVITY ONLY — 15–20 minutes per day max — no heavy exercise until cardiologist approves';
    routine = [
      { day: 'Monday',    activity: '15 min SLOW walk on flat ground — stop if breathless or dizzy', duration: '15 min' },
      { day: 'Tuesday',   activity: 'Chair yoga + gentle stretching — no floor exercises',           duration: '20 min' },
      { day: 'Wednesday', activity: '15 min slow walk + Breathing exercise (Anulom Vilom)',           duration: '20 min' },
      { day: 'Thursday',  activity: 'Complete REST — only mild movement around the house',            duration: 'Rest' },
      { day: 'Friday',    activity: '15 min slow walk — morning preferred (cooler temperature)',      duration: '15 min' },
      { day: 'Saturday',  activity: 'Light stretching + meditation — 10 min diaphragm breathing',    duration: '20 min' },
      { day: 'Sunday',    activity: 'Rest day — short 5 min walk after each meal only',              duration: 'Light' },
    ];
    warning = '🚨 DO NOT: Run, use gym equipment, climb stairs fast, swim vigorously, or play sports until cardiologist says OK. Monitor pulse during any activity.';
  } else if (isMedium) {
    dailyGoal = '30–40 minutes of moderate activity, 5 days a week — you must not skip this';
    routine = [
      { day: 'Monday',    activity: '35 min brisk walking (at a pace where you can talk but feel warm)', duration: '35 min' },
      { day: 'Tuesday',   activity: 'Yoga (Surya namaskar x 5) + breathing + light stretching',          duration: '40 min' },
      { day: 'Wednesday', activity: '30 min cycling (low speed) or 30 min swimming (slow laps)',         duration: '30 min' },
      { day: 'Thursday',  activity: 'REST — 10 min walk after dinner is fine',                           duration: 'Rest' },
      { day: 'Friday',    activity: '35 min brisk walk + bodyweight squats and lunges (2 sets of 10)',   duration: '40 min' },
      { day: 'Saturday',  activity: 'Dance aerobics / Zumba / group class or 40 min cycling',           duration: '40 min' },
      { day: 'Sunday',    activity: 'Light leisure walk with family — 20–25 min',                       duration: '20 min' },
    ];
    warning = '⚠️ Avoid heavy gym lifting, HIIT, or strenuous sports without doctor clearance. Always warm up for 5 min before and cool down after exercise.';
  } else {
    dailyGoal = '45–60 minutes of active exercise, 5–6 days a week — maintain your excellent health!';
    routine = [
      { day: 'Monday',    activity: '45 min jogging or brisk walk + 10 min stretching',         duration: '55 min' },
      { day: 'Tuesday',   activity: 'Strength training — moderate weights, full body circuit',    duration: '50 min' },
      { day: 'Wednesday', activity: 'Swimming laps or 45 min cycling',                          duration: '45 min' },
      { day: 'Thursday',  activity: 'Yoga / Pilates + core workout',                            duration: '45 min' },
      { day: 'Friday',    activity: '40 min jog + 15 min bodyweight circuit (HIIT optional)',   duration: '55 min' },
      { day: 'Saturday',  activity: 'Sport: badminton, football, cricket, dance, fitness class', duration: '60 min' },
      { day: 'Sunday',    activity: 'Active rest — nature walk, light cycling, or family sport', duration: '30 min' },
    ];
    warning = '✅ You are in good shape! Keep varying your workouts to avoid plateau. Consider running events, sport leagues, or swimming clubs to stay motivated.';
  }

  const exercise = { dailyGoal, routine, warning };

  // ─────────────────────────────────────────────────────────────────────────
  // LIFESTYLE TIPS
  // ─────────────────────────────────────────────────────────────────────────
  const lifestyle = isHigh ? [
    { icon: '😴', title: 'Sleep', tip: 'Sleep EXACTLY 7–8 hours — not more, not less. Bad sleep releases cortisol which spikes BP and heart rate. Go to bed by 10 PM.' },
    { icon: '🧘', title: 'Stress Control', tip: 'THIS IS URGENT. Stress triggers adrenaline which can cause a heart attack. Practice Anulom Vilom breathing (10 min), twice daily. Avoid arguments and news overload.' },
    { icon: '🚬', title: 'Stop Smoking', tip: 'If you smoke — STOP IMMEDIATELY. Each cigarette raises your heart rate by 10–20 BPM and narrows arteries for 1 hour. Ask your doctor for nicotine patches.' },
    { icon: '🍺', title: 'Zero Alcohol', tip: 'No alcohol at this risk level. Alcohol weakens the heart muscle and raises triglycerides. It can trigger dangerous irregular heartbeats (arrhythmia).' },
    { icon: '⚖️', title: 'Weight', tip: 'If overweight: losing even 3–5% of body weight significantly reduces heart strain. Focus on diet first — exercise only within safe limits right now.' },
    { icon: '📱', title: 'Monitor Daily', tip: 'Measure blood pressure at the same time every morning. Log it in a notebook. Share the record with your doctor. Buy a digital BP monitor.' },
    { icon: '💊', title: 'Medications', tip: 'Take ALL prescribed medicines exactly as told. Never skip or self-adjust dose. Set phone alarm if you forget. Some heart medicines are time-sensitive.' },
    { icon: '⛔', title: 'Avoid Triggers', tip: 'Avoid: very cold water/showers, heavy meals, extreme temperatures, intense emotions, sexual exertion until approved by doctor.' },
  ] : isMedium ? [
    { icon: '😴', title: 'Sleep', tip: '7–8 hours of sleep is non-negotiable. Poor sleep raises inflammation markers linked to heart disease. Try to sleep and wake at the same time daily.' },
    { icon: '🧘', title: 'Stress', tip: 'Practice 10–15 min daily meditation. Use apps like Headspace or just sit quietly. Chronic stress is as dangerous as high cholesterol for your heart.' },
    { icon: '🚬', title: 'Smoking', tip: 'Cut down immediately and quit within 3 months. Join a cessation program if needed. Quitting reduces heart disease risk by 50% within 1 year.' },
    { icon: '🍺', title: 'Alcohol', tip: 'Maximum 1–2 drinks per week. Red wine in very small amounts has some benefit but any more cancels it out with raised BP and calories.' },
    { icon: '⚖️', title: 'Weight', tip: 'Target healthy BMI (18.5–24.9). Use a diet + exercise combination. Even 5kg weight loss can reduce BP by 5 mmHg and cholesterol by 5–10%.' },
    { icon: '🩺', title: 'Monitoring', tip: 'Check BP weekly. Get blood tests every 6 months: lipid profile, blood glucose, kidney function. Keep a health diary.' },
    { icon: '💊', title: 'Medication Compliance', tip: 'If prescribed any medicines, take them religiously. Missing doses of BP or cholesterol tablets can cause rapid rebounds.' },
    { icon: '📵', title: 'Sitting Less', tip: 'Stand up and move for 2–5 minutes every 30 minutes at work. Prolonged sitting slows circulation. Set a timer if needed.' },
  ] : [
    { icon: '😴', title: 'Sleep', tip: '7–8 hours of quality sleep keeps your heart healthy. Maintain a consistent sleep schedule even on weekends.' },
    { icon: '🧘', title: 'Stress', tip: 'Your stress levels appear manageable — keep it that way! Light yoga or walks are great for maintaining mental and cardiac health.' },
    { icon: '🚬', title: 'Non-Smoking', tip: 'If you do not smoke — excellent! If you occasionally smoke — this is the time to stop completely before risk builds up.' },
    { icon: '🍺', title: 'Alcohol', tip: 'Keep it minimal. Moderate drinking (1–2 times/week) has low impact at your level but habit formation is the risk to watch.' },
    { icon: '⚖️', title: 'Weight', tip: 'You are in a healthy range — continue what you are doing. Avoid dramatic weight gain which is the number 1 early risk factor.' },
    { icon: '🩺', title: 'Annual Checks', tip: 'Annual health check-up is sufficient. Continue routine blood tests once a year to catch any early changes proactively.' },
    { icon: '🌞', title: 'Vitamin D', tip: 'Deficiency in Vitamin D is linked to heart disease. Get 15–20 min of sunlight daily or consider a supplement after blood test.' },
    { icon: '🫀', title: 'Prevention', tip: 'Heart disease builds quietly over decades. Your healthy habits now are your best investment against future risk.' },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // DOCTOR'S ADVICE
  // ─────────────────────────────────────────────────────────────────────────
  const doctorAdvice = isHigh ? [
    '🏥 See a CARDIOLOGIST within 7 days — do not delay, this is urgent.',
    '📋 Request an ECG (electrocardiogram) and 2D Echocardiogram at your first visit.',
    '🧪 Get these blood tests done ASAP: Lipid profile (LDL/HDL/Triglycerides), HbA1c (diabetes), CRP (inflammation), Kidney function (creatinine), Thyroid (TSH).',
    '💊 Your doctor is very likely to prescribe: Statin (for cholesterol), ACE inhibitor or beta-blocker (for BP), Aspirin (blood thinner) — take exactly as prescribed.',
    '🩺 If you feel chest pain, left arm heaviness, jaw pain, or sudden breathlessness — go to emergency IMMEDIATELY. Do not drive yourself.',
    '📵 Avoid all strenuous activity, heavy lifting, and high-stress situations until your cardiologist reviews your case.',
    '📓 Log your blood pressure morning and evening every day — share this log with your doctor.',
    '🧬 Ask your doctor about cardiac stress test (TMT) to assess your heart function under exertion.',
  ] : isMedium ? [
    '🩺 Schedule an appointment with your GP or cardiologist within 4 weeks.',
    '🧪 Get a full lipid profile + blood glucose test done. Ask for a Vitamin D level check too.',
    '📋 Request a baseline ECG — useful for comparison in future visits.',
    '💊 If prescribed medicines (antihypertensives, statins) — take them exactly as told. Do not skip.',
    '⚠️ Tell your doctor if you experience: chest tightness during exertion, unusual breathlessness, heart palpitations, or ankle swelling.',
    '📓 Monitor your blood pressure weekly and keep a log — bring it to your appointment.',
    '💉 If over 45 years: ask your doctor about aspirin therapy and whether a stress test is needed.',
    '🗣️ Be honest with your doctor about your diet, smoking, alcohol, and stress — they need the full picture.',
  ] : [
    '✅ Your heart risk is currently LOW — this is excellent and shows your healthy habits are working!',
    '🩺 Annual check-up with your GP is sufficient — no urgent tests needed.',
    '🧪 Routine blood tests once a year: lipid profile, blood glucose, CBC — good for baseline tracking.',
    '💡 Continue your current lifestyle — this result is a confirmation that you are on the right track.',
    '📋 If you have a family history of heart disease, discuss with your doctor about an early ECG baseline.',
    '🌟 Consider joining a heart health screening program annually — great way to stay aware.',
  ];

  if (bp > 140) doctorAdvice.push('🩸 Your blood pressure reading is critically high — anti-hypertensive medication should be discussed immediately.');
  if (chol > 240) doctorAdvice.push('⚠️ Very high cholesterol (>240) — statin medication is almost certainly needed. Ask your doctor about Atorvastatin or Rosuvastatin.');
  if (age > 60)   doctorAdvice.push('👴 Age is a non-modifiable risk factor — more frequent cardiac screening (every 6 months) is recommended after age 60.');

  // ─────────────────────────────────────────────────────────────────────────
  // EMERGENCY DANGER SIGNS
  // ─────────────────────────────────────────────────────────────────────────
  const dangerSigns = [
    'Chest pain or tightness — especially on the left side or centre',
    'Pain spreading to the left arm, jaw, neck, or upper back',
    'Sudden shortness of breath even without exertion',
    'Sudden severe dizziness, fainting, or loss of consciousness',
    'Irregular, very fast, or very slow heartbeat (palpitations)',
    'Cold sweating with nausea or vomiting with no clear reason',
  ];

  return { diet, exercise, lifestyle, doctorAdvice, dangerSigns, riskLevel: isHigh ? 'HIGH' : isMedium ? 'MEDIUM' : 'LOW' };
}
