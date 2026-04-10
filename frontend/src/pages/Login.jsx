import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore(state => state.loginSuccess);
  
  const [step, setStep] = useState(0); // 0: Retina Scan, 1: Login, 2: OTP
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const [accessCode, setAccessCode] = useState('');
  const [gateError, setGateError] = useState('');

  // The secret access code for the security gate
  const SECRET_GATE_CODE = 'PULSE2026';

  const handleGateSubmit = (e) => {
    e.preventDefault();
    setGateError('');
    if (accessCode.trim().toUpperCase() === SECRET_GATE_CODE) {
      setScanning(true);
      // Play scifi sound
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 1.5);
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.01, audioCtx.currentTime);
      osc.connect(g); g.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + 1.5);

      setTimeout(() => {
        setScanning(false);
        setStep(1);
      }, 2500);
    } else {
      setGateError('Access Denied. Invalid neural key. Try again.');
      setAccessCode('');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Demo Credentials
      if (email === 'doctor@hospital.com' && password === 'admin') {
         setLoading(false);
         setStep(2);
         return;
      }

      // Check registered accounts
      const accounts = JSON.parse(localStorage.getItem('pulseiq_accounts') || '[]');
      const user = accounts.find(u => u.email === email && u.password === password);

      if (user) {
        setLoading(false);
        setStep(2);
      } else {
        setError("Invalid credentials. Please try again or sign up.");
        setLoading(false);
      }
    }, 1500);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp !== '000000') {
       setError("Invalid Verification Code.");
       return;
    }
    setLoading(true);
    setTimeout(() => {
      const accounts = JSON.parse(localStorage.getItem('pulseiq_accounts') || '[]');
      const user = accounts.find(u => u.email === email) || { email, name: email.split('@')[0] };
      loginSuccess(user);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg text-white relative overflow-hidden p-6">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pulseRed/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-healthCyan/20 rounded-full blur-[150px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-10 max-w-md w-full relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
        
        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 bg-pulse-gradient rounded-2xl flex items-center justify-center animate-heartbeat shadow-neon-red">
             <Activity className="text-white" size={36} />
           </div>
        </div>
        
        <h2 className="text-3xl font-heading font-bold text-center mb-2">PulseIQ Access</h2>
        <p className="text-center text-gray-400 mb-8">{step === 1 ? 'Enter your medical credentials.' : 'Secure Two-Factor Authentication'}</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-bold text-center mb-6">
            {error}
          </div>
        )}

        {step === 0 ? (
           <form onSubmit={handleGateSubmit} className="flex flex-col items-center justify-center py-6">
              {/* Animated shield */}
              <div className="relative w-36 h-36 mb-6">
                 <div className={`absolute inset-0 border-2 border-healthCyan/20 rounded-full ${scanning ? 'animate-spin-slow' : ''}`} />
                 <div className={`absolute inset-2 border border-healthCyan/10 rounded-full ${scanning ? 'animate-reverse-spin' : ''}`} />
                 {scanning && <div className="absolute inset-x-0 top-1/2 h-[2px] bg-healthCyan/50 shadow-[0_0_15px_#00f0ff] z-10 animate-scan-line-fast" />}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div animate={scanning ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}} transition={{ repeat: Infinity, duration: 1 }} className="text-healthCyan">
                       <ShieldCheck size={64} className={scanning ? 'drop-shadow-[0_0_20px_#00f0ff]' : 'opacity-30'} />
                    </motion.div>
                 </div>
              </div>

              <h3 className="text-xl font-black tracking-[0.3em] text-white mb-1 uppercase">Neural_Link_Sync</h3>
              <p className="text-center text-gray-500 text-[10px] mb-6 uppercase tracking-widest">
                 Enter your secret neural key to unlock terminal
              </p>

              {/* Gate error */}
              {gateError && (
                 <div className="w-full bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-xl text-xs font-bold text-center mb-4">
                    🚫 {gateError}
                 </div>
              )}

              {/* Secret code input */}
              <div className="w-full mb-4">
                 <label className="text-[9px] uppercase font-black tracking-[3px] text-gray-500 mb-2 block">
                    Neural Access Key
                 </label>
                 <input
                    type="password"
                    value={accessCode}
                    onChange={e => setAccessCode(e.target.value)}
                    disabled={scanning}
                    placeholder="Enter secret key..."
                    className="w-full bg-[#0a1628] border-2 border-healthCyan/20 focus:border-healthCyan p-4 rounded-xl outline-none text-center font-mono text-lg tracking-widest text-white transition-all"
                    autoFocus
                 />
                 <p className="text-[9px] text-gray-600 text-center mt-2 font-mono">Hint: PULSE + Year</p>
              </div>

              <button
                 type="submit"
                 disabled={scanning || !accessCode}
                 className={`w-full py-4 bg-healthCyan text-black font-black uppercase tracking-[0.3em] rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:brightness-125 transition-all flex justify-center items-center active:scale-95 ${(scanning || !accessCode) ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                 {scanning ? '🔒 VERIFYING...' : '🔓 UNLOCK TERMINAL'}
              </button>
           </form>
        ) : step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block ml-1">Email Address</label>
              <div className="relative">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#151b2e] border border-white/5 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-pulseRed transition-all outline-none text-sm" placeholder="doctor@hospital.com" />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block ml-1">Access Key</label>
              <div className="relative">
                 <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#151b2e] border border-white/5 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-pulseRed transition-all outline-none text-sm" placeholder="•••••••••" />
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="w-full py-4 bg-pulseRed text-black font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(255,51,102,0.4)] hover:brightness-110 active:scale-95 transition-all flex justify-center items-center">
               {loading ? <Activity className="animate-spin" /> : 'Authenticate Engine'}
            </button>

            <p className="mt-8 text-center text-gray-500 text-xs">
              New clinician? <Link to="/signup" className="text-pulseRed font-bold hover:underline">Register Device</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
             <div className="text-center bg-white/5 border border-white/10 p-4 rounded-xl text-sm text-gray-300 mb-6 font-medium">
               <ShieldCheck className="mx-auto text-healthCyan mb-2" size={32} />
               A secure 6-digit verification code has been dispatched to <br/><span className="text-white font-bold tracking-wide mt-2 block italic">{email}</span>
             </div>
             
             <div>
               <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block text-center">Protocol Passcode</label>
               <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} className="w-full bg-[#151b2e] border border-white/5 p-4 text-center text-3xl font-bold tracking-[0.5em] rounded-xl focus:ring-2 focus:ring-healthCyan transition-all outline-none text-healthCyan" placeholder="000000" />
             </div>
             
             <button type="submit" disabled={loading} className="w-full py-4 text-lg font-black uppercase tracking-widest flex justify-center items-center bg-healthCyan text-black hover:bg-[#00d0dd] rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all active:scale-95">
                {loading ? <Activity className="animate-spin" /> : 'Enter Neural Plane'}
             </button>
             
             <button type="button" onClick={() => { setStep(1); setOtp(''); }} className="w-full text-gray-500 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest">Back to Credentials</button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
export default Login;
