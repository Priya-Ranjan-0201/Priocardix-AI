import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DigitalTwinCanvas from '../components/DigitalTwinCanvas';
import useTwinStore from '../store/digitalTwinStore';
import { Activity, Clock, Zap } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import ECGWaveform from '../components/ECGWaveform';
import useAuthStore from '../store/authStore';

const DigitalTwin = () => {
   const features = useTwinStore(state => state.features);
   const metrics = useTwinStore(state => state.metrics);
   const user = useAuthStore(state => state.user);
   const updateFeature = useTwinStore(state => state.updateFeature);
   const setMetrics = useTwinStore(state => state.setMetrics);

   const [activeTab, setActiveTab] = useState('simulation');
   const [activeLayer, setActiveLayer] = useState('Myocardial');
   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
   const [bpm, setBpm] = useState(72);

   // Scifi Audio Feedback
   const playSwitchSound = () => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
   };

   useEffect(() => {
      const timer = setTimeout(() => {
          fetch('http://localhost:8000/api/simulate', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(features)
          })
          .then(res => res.json())
          .then(data => { if(!data.error) setMetrics(data); })
          .catch(err => console.log("ML Engine Sync Delay", err));
      }, 300);
      return () => clearTimeout(timer);
   }, [features, setMetrics]);

   // Dynamic BPM simulation
   useEffect(() => {
     const interval = setInterval(() => {
       const base = 60 + (features.Stress_Level * 3) + (features.RestingBP / 40);
       setBpm(Math.floor(base + Math.random() * 5));
     }, 1000);
     return () => clearInterval(interval);
   }, [features.Stress_Level, features.RestingBP]);

   const handleMouseMove = (e) => {
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = (clientX - left - width / 2) / 30;
      const y = (clientY - top - height / 2) / 30;
      setMousePos({ x, y });
   };

   const radialData = [
      { name: 'Sleep', value: (features.Sleep_Hours/10)*100, fill: 'var(--pulse-accent)' },
      { name: 'Water', value: (features.Water_Intake_L/4)*100, fill: 'var(--pulse-accent)' },
      { name: 'Steps', value: (features.Steps_Per_Day/20000)*100, fill: 'var(--pulse-accent)' }
   ];

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col xl:flex-row gap-6 p-2 relative">
         
         {/* Background Biometric Overlay */}
         <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-transparent to-darkBg" />
         </div>

         {/* SIDEBAR NAVIGATION & INPUTS */}
         <div className="xl:w-[450px] flex flex-col gap-6 relative z-10">
           
           {/* BIOLOGICAL ID CARD - NOW COMPACT HORIZONTAL */}
           <motion.div whileHover={{ scale: 1.02 }} className="glass-panel p-4 border-healthCyan/20 border-2 bg-healthCyan/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-healthCyan/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-darkBg border border-healthCyan/30 flex items-center justify-center text-healthCyan text-sm font-black shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                       {user?.name?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <div>
                       <h3 className="text-sm font-black tracking-tighter text-white leading-none uppercase">{user?.name || 'Pulse Scientist'}</h3>
                       <p className="text-[7px] font-black text-healthCyan uppercase tracking-[3px] bg-healthCyan/10 px-1.5 py-0.5 rounded-full mt-1">Authorized</p>
                    </div>
                 </div>
                 <div className="text-right border-l border-healthCyan/20 pl-4">
                    <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Health Sync</p>
                    <p className="text-[10px] font-black text-healthCyan uppercase tracking-widest">{Math.round(metrics.health_score || 0)}% Integrity</p>
                 </div>
              </div>
           </motion.div>
           <div className="glass-panel p-8 flex flex-col h-full border-2 border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Activity size={120} className="text-accent" />
              </div>

              <div className="flex gap-4 mb-8 bg-black/40 p-1 rounded-2xl border border-white/5 relative z-20">
                 {['simulation', 'analytics'].map(t => (
                     <button 
                       key={t} 
                       onClick={(e) => { e.stopPropagation(); setActiveTab(t); playSwitchSound(); }} 
                       className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer ${activeTab === t ? 'bg-accent text-black shadow-accent scale-100' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                     >
                         {t === 'simulation' ? 'Your Health Data' : 'AI Analysis'}
                     </button>
                 ))}
              </div>

              {activeTab === 'simulation' ? (
                 <div className="flex-1 overflow-y-auto pr-3 space-y-7 custom-scrollbar pb-10">
                     <div className="flex gap-3 mb-6 relative z-20">
                        {['Myocardial', 'Vascular', 'Neural'].map(layer => (
                           <button 
                             key={layer} 
                             id={`btn-layer-${layer.toLowerCase()}`}
                             onClick={(e) => { e.stopPropagation(); setActiveLayer(layer); playSwitchSound(); }} 
                             className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all duration-300 cursor-pointer ${activeLayer === layer ? 'bg-accent border-accent text-black scale-105 shadow-[0_0_15px_var(--pulse-accent)]' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20 hover:text-white'}`}
                           >
                               {layer}
                           </button>
                        ))}
                     </div>

                     <div className="space-y-6">
                        <div className="p-5 bg-gradient-to-br from-healthCyan/10 to-transparent rounded-3xl border border-healthCyan/20 mb-8">
                           <h4 className="text-[10px] font-black text-healthCyan uppercase tracking-[0.3em] mb-4 flex items-center">
                              <Zap size={14} className="mr-3" /> Bio-Correction Advisor
                           </h4>
                           <div className="space-y-3">
                              {features.RestingBP > 130 && (
                                 <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase">Lower Sodium Path</span>
                                    <span className="text-healthCyan font-black">-12% Risk</span>
                                 </div>
                              )}
                              {features.Stress_Level > 6 && (
                                 <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase">Restoration Cycle</span>
                                    <span className="text-healthCyan font-black">-8% Risk</span>
                                 </div>
                              )}
                              <p className="text-[9px] text-gray-500 italic mt-4 leading-relaxed font-medium">
                                 Current AI simulation predicts risk reduction of up to 25% if pathways are followed.
                              </p>
                           </div>
                        </div>

                        <div>
                        <label className="flex justify-between text-xs text-gray-400 font-bold mb-3 uppercase tracking-wider">
                            <span>Blood Pressure</span> <span className="text-white font-mono">{features.RestingBP} <span className="text-[10px]">mmHg</span></span>
                        </label>
                        <input type="range" min="90" max="220" value={features.RestingBP} onChange={e => updateFeature('RestingBP', parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent" />
                        </div>
                        
                        <div>
                        <label className="flex justify-between text-xs text-gray-400 font-bold mb-3 uppercase tracking-wider">
                            <span>Stress Level</span> <span className="text-white font-mono">{features.Stress_Level}/10</span>
                        </label>
                        <input type="range" min="1" max="10" value={features.Stress_Level} onChange={e => updateFeature('Stress_Level', parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-accent/20 transition-all">
                              <label className="block text-[8px] font-black text-gray-500 uppercase mb-2 tracking-widest">Salt Intake (mg)</label>
                              <input type="number" id="input-salt" value={features.Sodium_mg} onChange={e => updateFeature('Sodium_mg', parseInt(e.target.value) || 0)} className="w-full bg-transparent border-none p-0 text-2xl font-black focus:ring-0 outline-none text-white font-mono" />
                           </div>
                           <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-accent/20 transition-all">
                              <label className="block text-[8px] font-black text-gray-500 uppercase mb-2 tracking-widest">Caffeine (mg)</label>
                              <input type="number" id="input-caffeine" value={features.Caffeine_mg} onChange={e => updateFeature('Caffeine_mg', parseInt(e.target.value) || 0)} className="w-full bg-transparent border-none p-0 text-2xl font-black focus:ring-0 outline-none text-white font-mono" />
                           </div>
                        </div>

                        <div>
                        <label className="flex justify-between text-xs text-gray-400 font-bold mb-3 uppercase tracking-wider">
                            <span>Sleep (Hours)</span> <span className="text-white font-mono">{features.Sleep_Hours} <span className="text-[10px]">HRS</span></span>
                        </label>
                        <input type="range" min="3" max="12" step="0.5" value={features.Sleep_Hours} onChange={e => updateFeature('Sleep_Hours', parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent" />
                        </div>
                     </div>
                  </div>
              ) : (
                 <div className="flex-1 overflow-y-auto pr-3 space-y-6 custom-scrollbar pb-10">
                    <div className="bg-accent/5 p-6 rounded-[32px] border border-accent/20">
                       <h4 className="text-[9px] font-black text-accent uppercase tracking-[0.3em] mb-4">Neural Health Outlook</h4>
                       <p className="text-xs text-white/80 leading-relaxed font-medium">
                          The neural network has analyzed your current biometric vector. It predicts a <strong>{metrics?.forecasts?.["1_Year"]}%</strong> likelihood of cardiovascular transition in the next 12 months if current patterns persist.
                       </p>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Top Risks Detected</p>
                       <div className="grid grid-cols-1 gap-4">
                          {[
                             { name: 'Arterial Pressure', val: features.RestingBP > 140 ? 'HIGH' : 'STABLE', color: features.RestingBP > 140 ? 'text-pulseRed' : 'text-healthCyan' },
                             { name: 'Stress Load', val: features.Stress_Level > 7 ? 'CRITICAL' : 'MILD', color: features.Stress_Level > 7 ? 'text-pulseRed' : 'text-healthCyan' },
                             { name: 'Chemical Balance', val: (features.Sodium_mg > 3000 || features.Caffeine_mg > 400) ? 'IMBALANCED' : 'NOMINAL', color: (features.Sodium_mg > 3000 || features.Caffeine_mg > 400) ? 'text-pulseRed' : 'text-healthCyan' }
                          ].map((risk, i) => (
                             <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-[11px] font-bold text-gray-400 uppercase">{risk.name}</span>
                                <span className={`text-[11px] font-black ${risk.color}`}>{risk.val}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              )}
           </div>
         </div>

         {/* CENTER CONTROLS: HEART SIMULATOR */}
         <div className="xl:w-2/3 flex flex-col gap-6">
            
            <div 
               onMouseMove={handleMouseMove} 
               onMouseLeave={() => setMousePos({x: 0, y: 0})}
               style={{ transform: `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${-mousePos.x}deg)` }}
               className={`glass-panel border-2 relative flex-1 min-h-[400px] overflow-hidden rounded-3xl transition-transform duration-200 ease-out shadow-[0_0_50px_rgba(0,0,0,0.5)] ${(metrics?.risk_score || 0) > 60 ? 'border-pulseRed/40 bg-pulseRed/5' : 'border-white/10'}`}
            >
               <div className="absolute inset-0">
                  <DigitalTwinCanvas riskScore={metrics?.risk_score || 0} activeLayer={activeLayer} />
               </div>

               <div className="absolute top-8 left-8 z-10 pointer-events-none">
                  <h1 className="text-6xl font-heading font-black tracking-tighter text-white drop-shadow-2xl scale-y-90 leading-none capitalize">{activeLayer} Engine</h1>
                  <h2 className="text-3xl font-heading font-black tracking-widest text-white/40 -mt-1 uppercase">Live View</h2>
                  <div className="flex gap-2 mt-4 items-center">
                     <p className="bg-accent text-black font-black uppercase tracking-[0.2em] text-[9px] px-3 py-1 rounded-full">System OK</p>
                     <div className="bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 flex items-center space-x-3 group">
                        <div className="w-2 h-2 rounded-full bg-healthCyan animate-ping ring-4 ring-healthCyan/20" />
                        <span className="text-white font-black text-[10px] tracking-widest uppercase">{bpm} BPM SYNCING</span>
                     </div>
                  </div>
               </div>

               {/* ECG OVERLAY */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 md:w-96 h-24 md:h-28 z-20 pointer-events-none bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl skew-x-[-12deg]">
                  <div className="absolute top-0 left-0 p-2 text-[8px] font-black text-healthCyan tracking-widest uppercase opacity-40">Biometric_Oscilloscope</div>
                  <ECGWaveform bpm={bpm} color={activeLayer === 'Neural' ? '#00f0ff' : '#ff3366'} />
               </div>

               {/* Simple Info Box */}
               <div className="absolute top-8 right-8 z-10 w-64 text-right pointer-events-none hidden lg:block">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Doctor's Note</p>
                  <p className="text-xs text-white/80 font-medium leading-relaxed italic">
                    {metrics?.risk_score > 60 
                       ? "Danger: High pressure detected. Please stop salt and rest."
                       : (features.Sodium_mg > 3000)
                          ? "Too much salt! Your blood volume is increasing too fast."
                          : "Everything looks good. Keep it up."
                    }
                  </p>
               </div>
               
               <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none flex xl:flex-row flex-col justify-between items-end gap-4">
                  <div className="flex gap-4 w-full xl:w-auto">
                      <div className="bg-darkBg/70 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-glass w-full group/stat relative overflow-hidden">
                         <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                         <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center relative z-10"><Zap size={12} className="mr-2 text-accent"/> Artery Health</p>
                         <p className={`text-4xl font-bold font-heading relative z-10 ${(features.RestingBP > 140) ? 'text-pulseRed' : 'text-accent'}`}>
                           {((features.RestingBP / 120) * 1.2).toFixed(2)} <span className="text-[10px] text-gray-500 font-black tracking-widest">ptL</span>
                         </p>
                      </div>
                      <div className="bg-darkBg/70 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-glass w-full group/stat relative overflow-hidden">
                         <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                         <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center relative z-10"><Activity size={12} className="mr-2 text-accent"/> Heart Strong</p>
                         <p className={`text-4xl font-bold font-heading relative z-10 ${(features.MaxHeartRate < 130) ? 'text-pulseRed' : 'text-accent'}`}>
                            {Math.max(0, 100 - (metrics?.risk_score || 0))}%
                         </p>
                      </div>
                  </div>

                  
                  <div className="hidden xl:flex w-40 h-40 bg-darkBg/50 backdrop-blur-md rounded-full border border-white/10 p-2 items-center justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                         <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={6} data={radialData}>
                           <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                           <RadialBar background clockWise dataKey="value" cornerRadius={10} />
                         </RadialBarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>

            {/* BOTTOM: FUTURE PREDICTIONS */}
            <div className="glass-panel p-6 flex flex-col justify-center rounded-3xl">
               <h3 className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-4 flex items-center">
                 <Clock size={16} className="mr-3" /> Future Health Prediction
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "In 1 Month", val: metrics?.forecasts?.["1_Month"] ?? 0 },
                    { label: "In 3 Months", val: metrics?.forecasts?.["3_Month"] ?? 0 },
                    { label: "In 6 Months", val: metrics?.forecasts?.["6_Month"] ?? 0 },
                    { label: "In 1 Year", val: metrics?.forecasts?.["1_Year"] ?? 0 }
                  ].map((f, index) => (
                    <div key={index} className="bg-[#151b2e] border border-white/5 rounded-2xl p-5 text-center transition-colors">
                       <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">{f.label}</p>
                       <p className={`text-3xl font-heading font-bold ${f.val > 50 ? 'text-pulseRed' : 'text-healthCyan'}`}>{f.val}% Risk</p>
                    </div>
                  ))}
               </div>
            </div>

         </div>
      </motion.div>
   );
};

export default DigitalTwin;
