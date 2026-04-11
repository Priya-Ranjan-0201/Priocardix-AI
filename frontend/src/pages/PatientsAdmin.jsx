import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Clock, ShieldCheck } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Navigate, useNavigate } from 'react-router-dom';

const PatientsAdmin = () => {
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = () => {
      const accounts = JSON.parse(localStorage.getItem('pulseiq_accounts') || '[]');
      const patientAccounts = accounts.filter(acc => acc.role === 'patient');
      setPatients(patientAccounts);
    };
    fetchPatients();
  }, []);

  if (user?.role !== 'doctor') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-4xl font-heading font-black tracking-wider flex items-center">
          <Users className="mr-4 text-healthCyan" size={40} />
          Patient Administration
        </h1>
        <p className="text-gray-400 mt-2 font-mono text-sm max-w-2xl bg-white/5 p-3 rounded-lg border border-white/10">
          Monitor your registered patients. Tracking their activity, login sources, and primary health details securely from the Doctor's Control Panel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 flex items-center space-x-4 border-l-4 border-l-healthCyan">
          <div className="p-3 bg-healthCyan/10 rounded-xl text-healthCyan">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Patients</p>
            <p className="text-2xl font-black">{patients.length}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden border border-white/10 rounded-2xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-black tracking-widest text-gray-400">
                <th className="p-4">Patient Info</th>
                <th className="p-4">Unique ID</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Age/Gender</th>
                <th className="p-4">Login Logs</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? patients.map((p, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.05 }}
                  key={p.uniqueId || idx} 
                  className="border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/reports?patientId=${p.uniqueId}`)}
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-healthCyan/20 to-pulseRed/20 flex items-center justify-center border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                        <UserIcon name={p.name} />
                      </div>
                      <div className="font-bold text-sm tracking-wide">{p.name}</div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-healthCyan text-sm font-bold bg-healthCyan/5">
                    {p.uniqueId || 'N/A'}
                  </td>
                  <td className="p-4 font-mono text-gray-300">
                    {p.mobileNumber}
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {p.age} yrs / {p.gender}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded inline-block w-max">
                        Count: {p.loginCount || 0}
                      </span>
                      {p.lastInputSource && (
                        <span className="text-[10px] text-gray-500 font-mono flex items-center">
                           <ShieldCheck size={10} className="mr-1 text-pulseRed" /> Source: {p.lastInputSource}
                        </span>
                      )}
                      {p.lastLoginTime && (
                        <span className="text-[10px] text-gray-500 font-mono flex items-center">
                           <Clock size={10} className="mr-1 text-healthCyan" /> {new Date(p.lastLoginTime).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 text-sm">
                    No patients registered yet. Wait for patients to sign up or create some test ones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UserIcon = ({ name }) => {
   return <span>{name ? name.charAt(0).toUpperCase() : 'U'}</span>;
};

export default PatientsAdmin;
