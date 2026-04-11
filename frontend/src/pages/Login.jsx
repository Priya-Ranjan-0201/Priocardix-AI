import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore(state => state.loginSuccess);
  
  const [activeTab, setActiveTab] = useState('patient'); // 'patient' or 'doctor'
  const [identifier, setIdentifier] = useState(''); // Mobile or Unique ID
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Demo Credentials Support
      if (activeTab === 'doctor' && identifier === 'doctor@hospital.com' && password === 'admin') {
         setLoading(false);
         loginSuccess({ name: 'System Admin', email: 'doctor@hospital.com', role: 'doctor', loginCount: 1 });
         navigate('/');
         return;
      }

      // Check registered accounts
      const accounts = JSON.parse(localStorage.getItem('pulseiq_accounts') || '[]');
      
      const userIndex = accounts.findIndex(u => 
        u.role === activeTab && 
        (u.mobileNumber === identifier || u.uniqueId === identifier) && 
        u.password === password
      );

      if (userIndex !== -1) {
        const user = accounts[userIndex];
        // Generate an admin tracking log info
        user.loginCount = (user.loginCount || 0) + 1;
        user.lastInputSource = identifier === user.uniqueId ? 'Unique ID' : 'Mobile Number';
        user.lastLoginTime = new Date().toISOString();
        
        // Update storage
        accounts[userIndex] = user;
        localStorage.setItem('pulseiq_accounts', JSON.stringify(accounts));

        setLoading(false);
        loginSuccess(user);
        navigate('/');
      } else {
        setError("Invalid credentials. Please verify your role, ID, and password.");
        setLoading(false);
      }
    }, 1500);
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
        <p className="text-center text-gray-400 mb-6">Authenticate your credentials.</p>

        {/* Tabs for Role Selection */}
        <div className="flex bg-[#151b2e] rounded-xl p-1 mb-6">
            <button 
                type="button"
                onClick={() => { setActiveTab('patient'); setError(''); setIdentifier(''); setPassword(''); }}
                className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'patient' ? 'bg-healthCyan text-black shadow-md' : 'text-gray-500 hover:text-white'}`}
            >
                Patient
            </button>
            <button 
                type="button"
                onClick={() => { setActiveTab('doctor'); setError(''); setIdentifier(''); setPassword(''); }}
                className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'doctor' ? 'bg-pulseRed text-black shadow-md' : 'text-gray-500 hover:text-white'}`}
            >
                Doctor
            </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-bold text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block ml-1">Mobile Number / Unique ID</label>
            <div className="relative">
              <input 
                type="text" required 
                value={identifier} 
                onChange={e => setIdentifier(e.target.value)} 
                className="w-full bg-[#151b2e] border border-white/5 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-healthCyan transition-all outline-none text-sm" 
                placeholder={activeTab === 'doctor' ? "DOC-##### or Mobile" : "PAT-##### or Mobile"} 
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block ml-1">Access Key</label>
            <div className="relative">
                <input 
                  type="password" required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-[#151b2e] border border-white/5 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-healthCyan transition-all outline-none text-sm" 
                  placeholder="•••••••••" 
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
          
          <button 
             type="submit" 
             disabled={loading || !identifier || !password} 
             className={`w-full py-4 mt-2 font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(255,51,102,0.3)] hover:brightness-110 active:scale-95 transition-all flex justify-center items-center ${(loading || !identifier || !password) ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === 'doctor' ? 'bg-pulseRed text-black' : 'bg-healthCyan text-black'}`}
          >
             {loading ? <Activity className="animate-spin" /> : <>Authenticate <ArrowRight size={18} className="ml-2" /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-xs">
          New user? <Link to="/signup" className="text-white font-bold hover:underline">Register Here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
