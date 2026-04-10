import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Activity, MessageSquare, FileText, Settings, LogOut, Brain } from 'lucide-react';
import useAuthStore from '../store/authStore';

const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const [holographic, setHolographic] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const playHoloSound = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.1);
  };

  const navItems = [
    { name: 'Heart Preview 3D', path: '/', icon: Brain },
    { name: 'Check My Heart', path: '/predict', icon: Activity },
    { name: 'AI Assistant', path: '/chat', icon: MessageSquare },
    { name: 'Health History', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className={`flex h-screen bg-darkBg text-white overflow-hidden font-sans transition-all duration-700 ${holographic ? 'perspective-[2000px]' : ''}`}>
      <aside className={`w-64 glass-panel m-4 flex flex-col justify-between border-r border-white/5 z-20 transition-all duration-700 ${holographic ? 'rotate-y-[15deg] skew-y-[-2deg] opacity-80' : ''}`}>
        <div>
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-pulse-gradient rounded-xl flex items-center justify-center animate-heartbeat shadow-neon-red">
              <Activity className="text-white" size={24} />
            </div>
            <span className="text-2xl font-heading font-bold tracking-wider">PulseIQ</span>
          </div>

          <nav className="mt-6 px-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <div className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${pathname === item.path ? 'bg-accent/20 text-accent border border-accent/30 shadow-[inset_0_0_15px_rgba(255,51,102,0.1)]' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
                  <item.icon size={20} className="mr-3" />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 space-y-2">
          <button 
            onClick={() => { setHolographic(!holographic); playHoloSound(); }}
            className={`flex items-center justify-center w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${holographic ? 'bg-healthCyan text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'bg-white/5 text-gray-500 border border-white/10 hover:text-white'}`}
          >
            {holographic ? 'HUD_MODE_ACTIVE' : 'ACTIVATE_HUD_MODE'}
          </button>
          
          <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-accent border border-accent/20 bg-accent/10 hover:bg-accent/30 hover:text-white rounded-xl shadow-[inset_0_0_10px_rgba(255,51,102,0.2)] transition-all">
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className={`flex-1 overflow-y-auto p-8 relative z-10 w-full transition-all duration-700 ${holographic ? 'rotate-y-[-10deg] skew-y-[1deg] translate-x-4 scale-95 shadow-[0_0_100px_rgba(255,51,102,0.1)]' : ''}`}>
        {holographic && (
           <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-30">
              <div className="absolute inset-0 bg-scan-line animate-scan-line" />
              <div className="absolute top-0 right-0 p-10 text-healthCyan font-mono text-[10px] space-y-1">
                 <p>SYSTEM_STATUS: STABLE</p>
                 <p>BIO_LINK: CONNECTED</p>
                 <p>NEURAL_LOAD: 24%</p>
              </div>
           </div>
        )}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
