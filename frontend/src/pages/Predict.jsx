import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, ShieldCheck, Database, Zap, Heart, Utensils, Dumbbell, Stethoscope, AlertCircle, ChevronDown } from 'lucide-react';
import { generateHealthPlan } from '../utils/healthPlan';
import useAuthStore from '../store/authStore';

const Predict = () => {
  const user = useAuthStore(state => state.user);

  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [healthPlan, setHealthPlan] = useState(null);
  const [error, setError]       = useState(null);
  const [scanning, setScanning] = useState(false);
  const [openSection, setOpenSection] = useState('diet');
  const [formData, setFormData] = useState({
    age: '',
    resting_bp: '',
    cholesterol: '',
    max_heart_rate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) || '' });
  };

  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.name.includes('Google UK English Male')) || voices[0];
  };

  const getAdvice = (feature) => {
    const adviceMap = {
      'age':           'You cannot change your age, but you can improve your heart age with daily walking and good sleep.',
      'resting_bp':    'Avoid salty foods and caffeine. Try to meditate or do deep breathing for 10 minutes every day.',
      'cholesterol':   'Limit oily fried foods. Eat more green vegetables and high-fiber foods like oats.',
      'max_heart_rate':'Engage in moderate cardio exercise like brisk walking. Avoid sudden high-intensity stress.',
    };
    return adviceMap[feature?.toLowerCase()] || 'Maintain a balanced diet and regular exercise routine.';
  };

  const announceResult = (category, score, feature) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance();
      msg.voice = getVoice();
      msg.text  = `Analysis complete. Result: ${category}. Your heart risk is ${score} percent. The main issue is ${feature?.replace('_', ' ')}. ${getAdvice(feature)}`;
      msg.rate  = 1.0;
      msg.pitch = 0.9;
      window.speechSynthesis.speak(msg);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setScanning(true);
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('System Error');
      const data = await response.json();

      setTimeout(() => {
        const plan = generateHealthPlan(data.risk_score, formData, data.top_contributing_feature, data.risk_category);
        setResult(data);
        setHealthPlan(plan);
        setLoading(false);
        setScanning(false);

        // Save to history with embedded plan
        const savedHistory = JSON.parse(localStorage.getItem('pulseiq_scan_history_v2') || '[]');
        const newEntry = {
          id:     `SC-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          date:   new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          risk:   data.risk_score,
          status: data.risk_category,
          source: 'AI Heart Scanner',
          plan,
          formData,
          topFeature: data.top_contributing_feature,
          patientId: user?.uniqueId || 'UNKNOWN_ID',
          patientName: user?.name || 'UNKNOWN_NAME',
        };
        localStorage.setItem('pulseiq_scan_history_v2', JSON.stringify([newEntry, ...savedHistory].slice(0, 15)));

        if (localStorage.getItem('voice_enabled') !== 'false') {
          announceResult(data.risk_category, data.risk_score, data.top_contributing_feature);
        }
      }, 3000);

    } catch (err) {
      console.error(err);
      setError('⚠️ AI Engine is offline. Make sure the backend server is running on port 8000.');
      setLoading(false);
      setScanning(false);
    }
  };

  const riskColor = result ? (result.risk_score > 70 ? '#ff3366' : result.risk_score > 40 ? '#f59e0b' : '#00f0ff') : 'var(--pulse-accent)';

  const Section = ({ id, icon: Icon, title, children }) => (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setOpenSection(openSection === id ? null : id)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/3 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10">
            <Icon size={20} className="text-accent" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform ${openSection === id ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {openSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full pb-20 relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--pulse-accent) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* HEADER */}
      <header className="mb-10 flex justify-between items-end relative z-10">
        <div>
          <h1 className="text-5xl font-heading font-black tracking-tight mb-2 uppercase">Heart Health Scanner</h1>
          <p className="text-gray-400 font-medium">AI-powered cardiac risk prediction + full health plan</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center space-x-2">
            <Database size={16} className="text-accent" />
            <span className="text-xs font-bold text-gray-300">DATASET: 600K</span>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center space-x-2">
            <Zap size={16} className="text-accent" />
            <span className="text-xs font-bold text-gray-300">AI ACTIVE</span>
          </div>
        </div>
      </header>

      {/* SCANNER FORM + RESULT SIDE BY SIDE */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10 relative z-10">
        {/* INPUT FORM */}
        <div className="glass-panel p-10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity text-accent">
            <Heart size={200} />
          </div>

          <div>
            <h3 className="text-2xl font-heading font-bold mb-8 flex items-center">
              <Activity className="mr-3 text-accent" /> Enter Your Data
            </h3>
            <form className="space-y-8" onSubmit={handlePredict}>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { id: 'age',           label: 'Age',              unit: 'yrs' },
                  { id: 'resting_bp',    label: 'Blood Pressure',   unit: 'mmHg' },
                  { id: 'cholesterol',   label: 'Cholesterol',      unit: 'mg/dL' },
                  { id: 'max_heart_rate',label: 'Max Heart Rate',   unit: 'bpm' },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="block text-[9px] font-black uppercase tracking-[3px] text-gray-500 mb-1">{field.label}</label>
                    <input
                      type="number"
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className="w-full bg-white/5 border-b-2 border-white/10 hover:border-accent focus:border-accent outline-none py-3 text-2xl font-black transition-all placeholder:text-gray-700"
                      placeholder="0"
                      required
                    />
                    <p className="text-[9px] text-gray-600 mt-1 font-mono">{field.unit}</p>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className={`w-full py-6 rounded-2xl font-black text-xl tracking-widest transition-all duration-500 transform active:scale-95 ${scanning ? 'bg-white/10 text-gray-500 border border-white/5 cursor-not-allowed' : 'bg-accent text-black shadow-[0_0_20px_var(--pulse-accent)] hover:brightness-110'}`}
                disabled={scanning}
              >
                {scanning ? 'CHECKING...' : '🔬 START THE SCAN'}
              </button>
            </form>
          </div>

          <div className="mt-8 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl flex items-start space-x-4">
            <AlertTriangle className="text-yellow-400 shrink-0 mt-1" size={20} />
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              NOTE: This is an AI prediction tool for educational purposes. Always consult a qualified doctor for medical decisions.
            </p>
          </div>
        </div>

        {/* RESULT PANEL */}
        <div className="glass-panel relative flex flex-col items-center justify-center overflow-hidden border-2 border-white/5 min-h-[500px]">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-10">
                <div className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center mb-6 mx-auto relative">
                  <div className="absolute inset-0 rounded-full border border-white/5 animate-ping" />
                  <Heart size={64} className="text-white opacity-20" />
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Fill the form and start scan</p>
              </motion.div>
            )}

            {loading && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-10">
                <div className="relative w-44 h-44">
                  <div className="absolute inset-0 border-4 border-accent/10 rounded-[40px] rotate-45" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 border-t-2 border-r-2 border-accent rounded-full shadow-[0_0_30px_var(--pulse-accent)]"
                  />
                  <motion.div
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Activity size={52} className="text-accent" />
                  </motion.div>
                </div>
                <h3 className="mt-10 text-xl font-black tracking-[0.6em] text-accent animate-pulse uppercase ml-2">Neural_Mapping</h3>
                <div className="mt-4 w-64">
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5 }} className="h-full bg-accent" />
                  </div>
                  <p className="text-[10px] text-gray-500 text-center mt-2 uppercase tracking-widest italic">Analyzing Biometric Vectors...</p>
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full p-6 flex flex-col items-center gap-6">
                <div className="w-full flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Report ID</p>
                    <p className="font-mono text-white text-sm">#ID-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                  </div>
                  <button onClick={() => { setResult(null); setHealthPlan(null); }} className="px-3 py-1.5 rounded-full border font-black text-[10px] tracking-tighter border-accent text-accent bg-accent/10 hover:bg-accent hover:text-black transition-all">
                    DONE
                  </button>
                </div>

                {/* Risk Circle */}
                <div className="relative">
                  <div className="absolute -inset-6 rounded-full blur-3xl opacity-25" style={{ background: riskColor }} />
                  <div className="w-52 h-52 rounded-full border-4 flex flex-col items-center justify-center relative" style={{ borderColor: riskColor, boxShadow: `0 0 40px ${riskColor}66` }}>
                    <p className="text-[9px] font-bold text-gray-400 absolute top-8 uppercase tracking-widest">Final Result</p>
                    <span className="text-7xl font-black font-heading" style={{ color: riskColor }}>{result.risk_score}</span>
                    <span className="text-sm font-bold text-white tracking-widest">% RISK</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="w-full p-5 rounded-2xl border" style={{ background: `${riskColor}10`, borderColor: `${riskColor}33` }}>
                  <h4 className="text-xl font-black uppercase mb-2" style={{ color: riskColor }}>{result.risk_category}</h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                    Main issue: <strong className="text-white">{result.top_contributing_feature?.replace(/_/g, ' ')}</strong>.
                    {' '}{getAdvice(result.top_contributing_feature)}
                  </p>
                </div>

                <p className="text-[10px] text-gray-500 text-center">↓ Scroll down for your full Diet, Exercise & Doctor Plan ↓</p>

                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all text-gray-400 hover:text-white" onClick={() => { setResult(null); setHealthPlan(null); }}>
                  Clear and Start Over
                </button>
              </motion.div>
            )}

            {error && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 text-center">
                <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
                <p className="text-red-400 font-bold text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── FULL HEALTH PLAN (shown after scan) ────────────────────────────── */}
      <AnimatePresence>
        {healthPlan && result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 relative z-10"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-black uppercase tracking-tight mb-2">Your Personal Health Plan</h2>
              <p className="text-gray-400 text-sm">Based on your scan results — curated like a real doctor's prescription</p>
            </div>

            {/* DIET PLAN */}
            <Section id="diet" icon={Utensils} title="🥗 Daily Diet Plan">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-3">✅ Foods to Eat Daily</h4>
                    <ul className="space-y-2">
                      {healthPlan.diet.mustEat.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                          <span className="text-green-400 mt-0.5 shrink-0">▸</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">❌ Foods to Strictly Avoid</h4>
                    <ul className="space-y-2">
                      {healthPlan.diet.mustAvoid.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                          <span className="text-red-400 mt-0.5 shrink-0">▸</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-accent uppercase tracking-widest mb-3">📅 Sample Meal Plan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(healthPlan.diet.mealPlan).map(([time, meal]) => (
                      <div key={time} className="bg-white/5 rounded-xl p-4">
                        <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">{time}</p>
                        <p className="text-xs text-gray-300">{meal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* EXERCISE PLAN */}
            <Section id="exercise" icon={Dumbbell} title="💪 Weekly Exercise Plan">
              <div className="space-y-4">
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Daily Goal</p>
                  <p className="text-sm font-bold text-white">{healthPlan.exercise.dailyGoal}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {healthPlan.exercise.routine.map((day, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{day.day}</p>
                        <p className="text-xs text-white mt-1">{day.activity}</p>
                      </div>
                      <span className="text-[9px] font-black text-accent bg-accent/10 px-2 py-1 rounded-full ml-3 shrink-0">{day.duration}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <p className="text-xs text-yellow-400 font-bold">{healthPlan.exercise.warning}</p>
                </div>
              </div>
            </Section>

            {/* LIFESTYLE */}
            <Section id="lifestyle" icon={Zap} title="🌿 Lifestyle Recommendations">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthPlan.lifestyle.map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4">
                    <p className="text-base mb-2">{item.icon} <span className="text-[10px] font-black uppercase tracking-widest text-accent">{item.title}</span></p>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.tip}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* DOCTOR ADVICE */}
            <Section id="doctor" icon={Stethoscope} title="🩺 Doctor's Recommendations">
              <ul className="space-y-3">
                {healthPlan.doctorAdvice.map((advice, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl text-sm text-gray-300">
                    {advice}
                  </li>
                ))}
              </ul>
            </Section>

            {/* DANGER SIGNS */}
            <Section id="danger" icon={AlertTriangle} title="🚨 Emergency Warning Signs — Call Doctor Immediately">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {healthPlan.dangerSigns.map((sign, i) => (
                  <div key={i} className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                    <span className="text-red-400 shrink-0 mt-0.5">⚠️</span>
                    <p className="text-xs text-red-300 font-medium">{sign}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-4 text-center">If you experience ANY of these signs — call emergency services (112) or go to ER immediately. Do not wait.</p>
            </Section>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Predict;
