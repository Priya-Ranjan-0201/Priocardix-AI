import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        setLoading(false);
        return;
      }

      const existingUsers = JSON.parse(localStorage.getItem('pulseiq_accounts') || '[]');
      if (existingUsers.find(u => u.email === formData.email)) {
        setError("Email already registered!");
        setLoading(false);
        return;
      }

      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'doctor',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('pulseiq_accounts', JSON.stringify([...existingUsers, newUser]));
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg text-white relative overflow-hidden p-6">
      <div className="absolute top-0 right-0 w-96 h-96 bg-pulseRed/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-healthCyan/20 rounded-full blur-[150px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-10 max-w-md w-full relative z-10 shadow-2xl border border-white/10">
        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 bg-pulse-gradient rounded-2xl flex items-center justify-center animate-heartbeat shadow-neon-red">
             <Activity className="text-white" size={36} />
           </div>
        </div>
        
        <h2 className="text-3xl font-heading font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-400 mb-8">Join the PulseIQ neural network.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-bold text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block ml-1">Full Name</label>
            <div className="relative">
              <input 
                type="text" required 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full bg-[#151b2e] border border-white/5 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-pulseRed transition-all outline-none text-sm" 
                placeholder="Dr. John Smith" 
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block ml-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" required 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                className="w-full bg-[#151b2e] border border-white/5 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-pulseRed transition-all outline-none text-sm" 
                placeholder="doctor@hospital.com" 
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block ml-1">Set Password</label>
            <div className="relative">
              <input 
                type="password" required 
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                className="w-full bg-[#151b2e] border border-white/5 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-pulseRed transition-all outline-none text-sm" 
                placeholder="••••••••" 
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block ml-1">Confirm Password</label>
            <div className="relative">
              <input 
                type="password" required 
                value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                className="w-full bg-[#151b2e] border border-white/5 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-pulseRed transition-all outline-none text-sm" 
                placeholder="••••••••" 
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-4 bg-pulseRed text-black font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(255,51,102,0.4)] hover:brightness-110 active:scale-95 transition-all flex justify-center items-center">
             {loading ? <Activity className="animate-spin" /> : <>Sign Up Now <ArrowRight size={18} className="ml-2" /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-xs">
          Already registered? <Link to="/login" className="text-pulseRed font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
