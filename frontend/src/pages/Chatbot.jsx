import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageSquare, Sparkles, Cpu, Zap } from 'lucide-react';

const QA_DATABASE = [
  { keywords: ['diet', 'eat', 'food', 'carbs', 'nutrition', 'keto', 'vegan'], response: "Eating healthy is key! Try to eat more green vegetables, limit red meat, and avoid oily fried foods. Reducing salt in your food can also lower your blood pressure." },
  { keywords: ['sleep', 'rest', 'tired', 'insomnia', 'fatigue'], response: "Good sleep helps your heart stay strong. Try to get 7-8 hours of sleep. Try to avoid looking at phones or screens before you go to bed." },
  { keywords: ['heart', 'exercise', 'workout', 'cardio', 'gym', 'run', 'steps'], response: "Walking or running is great for the heart. Try to walk for 30 minutes every day. Keeping active helps lower your heart risk." },
  { keywords: ['stress', 'anxiety', 'panic', 'emotional', 'depressed'], response: "Too much stress can hurt your heart. Try to take 15 minutes each day to relax or practice deep breathing. It helps lower your blood pressure." },
  { keywords: ['water', 'hydration', 'drink', 'thirsty'], response: "Drinking enough water is important. Try to drink at least 8-10 glasses of water every day. It helps your blood flow better and keeps your pulse normal." },
  { keywords: ['bp', 'blood pressure', 'hypertension', 'systolic'], response: "High blood pressure is dangerous. Normal BP is 120/80. If yours is high, please eat less salt, stay relaxed, and talk to a doctor soon." },
  { keywords: ['cholesterol', 'ldl', 'hdl', 'triglycerides', 'lipid'], response: "Bad cholesterol can block your blood flow. Avoid oily foods and try eating more oats and beans to keep your heart clean." },
  { keywords: ['bmi', 'weight', 'fat', 'obese', 'lose'], response: "Maintaining a healthy weight is good for your heart. Losing even a little bit of weight can greatly improve your heart's health." },
  { keywords: ['smoke', 'smoking', 'vape', 'tobacco', 'nicotine'], response: "Smoking is very bad for your heart and arteries. If you stop smoking now, your heart health will improve very quickly." },
  { keywords: ['sugar', 'diabetes', 'glucose', 'insulin'], response: "Too much sugar is bad for your heart. Try to avoid sugary drinks and soda. Drink plain water instead to keep your heart healthy." },
  { keywords: ['age', 'old', 'youth', 'aging'], response: "Age is just a number! You can make your heart feel younger by eating well, sleeping enough, and walking every day." },
  { keywords: ['hello', 'hi', 'hey', 'start'], response: "Hello! I am PulseAI. I can help you understand your heart health and how to stay healthy. What would you like to know?" }
];

const SUGGESTIONS = [ "How to lower my Blood Pressure?", "Good food for heart?", "How to sleep better?", "Is salt bad for me?" ];

const Chatbot = () => {
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! I am your PulseAI Assistant. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = (textInput) => {
    if (!textInput.trim() || isTyping) return;
    setMessages(prev => [...prev, { role: 'user', text: textInput }]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      let aiResponse = "I'm not sure about that. Try asking about diet, sleep, or blood pressure.";
      const userText = textInput.toLowerCase();
      for (const rule of QA_DATABASE) {
         if (rule.keywords.some(kw => userText.includes(kw))) { aiResponse = rule.response; break; }
      }
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col p-2 overflow-hidden">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-heading font-black tracking-tighter uppercase text-white shadow-text flex items-center">
            <Cpu className="mr-3 text-[var(--pulse-accent)] animate-pulse" /> AI Assistant
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Ask me anything about your heart.</p>
        </div>
        <div className="flex space-x-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Online</span>
        </div>
      </header>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative border-2 border-white/5 shadow-2xl rounded-[40px]">
        {/* Animated Neural Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(var(--pulse-accent) 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
        </div>

        <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8 bg-black/20 relative z-10 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] p-6 rounded-3xl border shadow-2xl relative ${msg.role === 'user' ? 'bg-white/5 border-white/10 text-white rounded-tr-none' : 'bg-gradient-to-br from-white/10 to-transparent border-white/5 text-gray-200 rounded-tl-none'}`}>
                  <p className="text-sm leading-relaxed font-medium tracking-wide font-medium">{msg.text}</p>
                  <div className={`absolute top-0 ${msg.role === 'user' ? '-right-2' : '-left-2'} w-4 h-4 bg-inherit border-inherit rotate-45`} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex space-x-2">
                  {[0, 150, 300].map(delay => (
                     <div key={delay} className="w-1.5 h-1.5 rounded-full bg-[var(--pulse-accent)] animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
               </div>
             </motion.div>
          )}
        </div>
        
        <div className="p-6 bg-black/40 border-t border-white/5 z-20">
          <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
             {SUGGESTIONS.map((s, idx) => (
               <button key={idx} onClick={() => handleSend(s)} className="whitespace-nowrap px-6 py-2 bg-white/5 hover:bg-white text-gray-400 hover:text-black border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-full transition-all">
                  {s}
               </button>
             ))}
          </div>

          <form className="flex space-x-4 bg-white/5 p-2 rounded-2xl border border-white/10" onSubmit={e => { e.preventDefault(); handleSend(input); }}>
            <input 
              type="text" 
              className="flex-1 px-6 py-3 bg-transparent outline-none text-white placeholder-gray-600 font-bold" 
              placeholder="Ask a question..." 
              value={input} 
              disabled={isTyping}
              onChange={e => setInput(e.target.value)} 
            />
            <button type="submit" className="p-4 bg-[var(--pulse-accent)] text-black hover:brightness-110 transition-all rounded-xl shadow-[0_0_15px_var(--pulse-accent)]" disabled={!input.trim() || isTyping}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
export default Chatbot;
