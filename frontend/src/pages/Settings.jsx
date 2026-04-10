import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Volume2, Palette, Mic, Lock, ShieldCheck, Cpu } from 'lucide-react';

const Settings = () => {
  const [voiceEnabled, setVoiceEnabled] = useState(localStorage.getItem('voice_enabled') !== 'false');
  const [accentColor, setAccentColor] = useState(localStorage.getItem('pulse_theme') || '#ff3366');
  const [voiceType, setVoiceType] = useState(localStorage.getItem('pulse_voice') || 'default');
  const [loading, setLoading] = useState(false);
     const [secure, setSecure] = useState(localStorage.getItem('pulse_secure') === 'true');

   useEffect(() => {
     localStorage.setItem('voice_enabled', voiceEnabled);
     localStorage.setItem('pulse_theme', accentColor);
     localStorage.setItem('pulse_voice', voiceType);
     localStorage.setItem('pulse_secure', secure);
     
     // Hex to RGBA conversion for the glow effect
     const r = parseInt(accentColor.slice(1, 3), 16);
     const g = parseInt(accentColor.slice(3, 5), 16);
     const b = parseInt(accentColor.slice(5, 7), 16);
     const glow = `rgba(${r}, ${g}, ${b}, 0.5)`;

     document.documentElement.style.setProperty('--pulse-accent', accentColor);
     document.documentElement.style.setProperty('--pulse-accent-glow', glow);
   }, [voiceEnabled, accentColor, voiceType, secure]);

   const runSecurityScan = () => {
     if (secure) {
        setSecure(false);
        return;
     }
     setLoading(true);
     setTimeout(() => {
       setLoading(false);
       setSecure(true);
     }, 2000);
   };

   return (
     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full">
       <header className="mb-10 flex justify-between items-center">
         <div>
            <h1 className="text-5xl font-heading font-black mb-2 uppercase tracking-tighter shadow-text text-white">Interface BIOS</h1>
            <p className="text-gray-400 font-medium">Platform-level neural configuration and biological rendering filters.</p>
         </div>
         <div className="flex space-x-3">
             <div className={`px-4 py-2 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all ${accentColor ? 'animate-pulse' : ''}`} style={{ borderColor: accentColor, color: accentColor }}>System_Active</div>
         </div>
       </header>

       <div className="max-w-6xl grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* AUDIO SYNTHESIS */}
         <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity"><Mic size={200} /></div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-accent flex items-center">
              <Volume2 className="mr-3" /> Audio Engine
            </h3>
            <div className="space-y-6 relative z-10">
               <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                  <p className="font-black text-[10px] uppercase tracking-widest text-gray-400">Feedback Matrix</p>
                  <div onClick={() => setVoiceEnabled(!voiceEnabled)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${voiceEnabled ? 'bg-accent' : 'bg-gray-800'}`}>
                     <motion.div animate={{ x: voiceEnabled ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-lg" />
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div>
                     <label className="flex justify-between text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Voice Frequency (Pitch)</label>
                     <input 
                       type="range" min="0.5" max="2" step="0.1" 
                       value={localStorage.getItem('pulse_voice_pitch') || 1} 
                       onChange={(e) => localStorage.setItem('pulse_voice_pitch', e.target.value)}
                       className="w-full accent-accent" 
                     />
                  </div>
                  <div>
                     <label className="flex justify-between text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Temporal Modulation (Rate)</label>
                     <input 
                       type="range" min="0.5" max="2" step="0.1" 
                       value={localStorage.getItem('pulse_voice_rate') || 1} 
                       onChange={(e) => localStorage.setItem('pulse_voice_rate', e.target.value)}
                       className="w-full accent-accent" 
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  {['NEURAL_A', 'NEURAL_B'].map(v => (
                     <button key={v} onClick={() => setVoiceType(v.toLowerCase())} className={`py-4 rounded-xl text-[10px] font-black tracking-widest transition-all border ${voiceType === v.toLowerCase() ? 'bg-accent text-black border-accent' : 'border-white/5 text-gray-500 hover:border-white/20'}`}>{v}</button>
                  ))}
               </div>
            </div>
         </motion.div>

         {/* VISUAL SPECTRUM */}
         <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity"><Palette size={200} /></div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-pulseRed flex items-center">
              <Palette className="mr-3" /> Visual Wavelength
            </h3>
            <div className="space-y-6 relative z-10">
               <div className="flex flex-wrap gap-4">
                  {['#ff3366', '#00f0ff', '#a855f7', '#f59e0b', '#10b981', '#ffffff'].map(color => (
                     <button 
                       key={color} 
                       onClick={() => setAccentColor(color)}
                       className={`w-12 h-12 rounded-2xl border-2 transition-all hover:scale-110 active:scale-90 ${accentColor === color ? 'border-white scale-110 shadow-2xl skew-x-12' : 'border-transparent opacity-40'}`} 
                       style={{ backgroundColor: color }} 
                     />
                  ))}
               </div>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-loose">
                 Interface will shift its primary neural wavelength to the selected spectral frequency.
               </p>
            </div>
         </motion.div>
         
         {/* SECURITY & ENCRYPTION */}
         <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 relative overflow-hidden group border-2 border-white/5">
            <AnimatePresence>
               {loading && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-darkBg/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-10 text-center">
                     <div className="w-20 h-20 border-4 border-t-healthCyan border-white/10 rounded-full animate-spin mb-6" />
                     <p className="text-healthCyan text-xs font-black tracking-[0.3em] animate-pulse">ENCRYPTING_BIO_CACHE...</p>
                 </motion.div>
               )}
            </AnimatePresence>

            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-white flex items-center">
              <Shield className="mr-3" /> Security Protocol
            </h3>
            <div className="space-y-6 relative z-10 text-center">
               <div className={`w-20 h-20 mx-auto rounded-3xl bg-white/5 border flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:rotate-12 ${secure ? 'border-healthCyan/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]' : 'border-white/10'}`}>
                  {secure ? <ShieldCheck className="text-healthCyan" size={40} /> : <Lock className="text-gray-600" size={40} />}
               </div>
               <h4 className="font-black text-xs uppercase tracking-widest text-white">Deep-Health Encryption</h4>
               <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Secure your biometric simulations with 256-bit AES RSA Bio-Latency locks.</p>
               <button 
                 onClick={runSecurityScan}
                 className={`w-full py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all ${secure ? 'bg-healthCyan text-black font-black' : 'bg-white/5 hover:bg-white hover:text-black border border-white/10'}`}
               >
                  {secure ? 'PROTOCOL_LOCKED' : 'ACTIVATE_LOCK'}
               </button>
            </div>
         </motion.div>

        {/* DATA ARCHITECTURE */}
        <div className="glass-panel p-8 xl:col-span-3 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-transparent via-white/5 to-transparent border-y border-white/10">
           <div className="flex items-center space-x-6">
              <div className="p-4 rounded-3xl bg-healthCyan/10 text-healthCyan border border-healthCyan/30 animate-pulse">
                 <Cpu size={32} />
              </div>
              <div>
                 <p className="font-black text-sm uppercase tracking-widest text-white">Neural Processing Unit</p>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Status: Operational (Cluster-4)</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="text-right">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Inference Speed</p>
                 <p className="text-2xl font-black text-white">0.02ms</p>
              </div>
              <div className="text-right border-l border-white/10 pl-4">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">ML Accuracy</p>
                 <p className="text-2xl font-black text-healthCyan">99.8%</p>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
export default Settings;
