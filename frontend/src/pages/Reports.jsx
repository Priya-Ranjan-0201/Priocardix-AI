import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Calendar, CheckCircle2, Search, Trash2, AlertTriangle } from 'lucide-react';

// Default seed records — always shown if no custom history exists
const DEFAULT_HISTORY = [
  { id: 'SC-8391', date: 'Sep 01, 2026', risk: 68, status: 'High Risk', source: 'Hospital Lab' },
  { id: 'SC-8211', date: 'Jan 15, 2026', risk: 85, status: 'Critical',  source: 'ER Room' },
  { id: 'SC-7920', date: 'Nov 20, 2025', risk: 12, status: 'Normal',    source: 'General Checkup' },
];

const STORAGE_KEY = 'pulseiq_scan_history_v2';

const getRiskColor = (risk) => {
  if (risk > 70) return '#ff3366';
  if (risk > 40) return '#f59e0b';
  return 'var(--pulse-accent)';
};

const Reports = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');

  // Load history once on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          return;
        }
      } catch (_) {}
    }
    // First time — seed with defaults
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HISTORY));
    setHistory(DEFAULT_HISTORY);
  }, []);

  const handleDelete = (id) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HISTORY));
    setHistory(DEFAULT_HISTORY);
  };

  const handleDownloadPDF = (scan) => {
    const riskColor = scan.risk > 70 ? '#cc0000' : scan.risk > 40 ? '#d97706' : '#0891b2';
    const p = scan.plan;

    const dietEat    = p?.diet?.mustEat?.map(x => `<li>${x}</li>`).join('') || '<li>Balanced heart-healthy diet</li>';
    const dietAvoid  = p?.diet?.mustAvoid?.map(x => `<li>${x}</li>`).join('') || '<li>Limit fried and salty foods</li>';
    const mealRows   = p?.diet?.mealPlan ? Object.entries(p.diet.mealPlan).map(([t,m]) => `<tr><td class="meal-time">${t}</td><td>${m}</td></tr>`).join('') : '';
    const exRows     = p?.exercise?.routine?.map(r => `<tr><td class="meal-time">${r.day}</td><td>${r.activity}</td><td style="color:${riskColor};font-weight:800">${r.duration}</td></tr>`).join('') || '';
    const docAdvice  = p?.doctorAdvice?.map(x => `<li>${x}</li>`).join('') || '<li>Consult your GP regularly</li>';
    const lifestyle  = p?.lifestyle?.map(x => `<div class="tip"><strong>${x.icon} ${x.title}:</strong> ${x.tip}</div>`).join('') || '';
    const danger     = p?.dangerSigns?.map(x => `<li>${x}</li>`).join('') || '';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>PulseIQ_Report_${scan.id}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #fff; color: #111; font-size: 13px; }
        .header { display:flex; justify-content:space-between; align-items:center; border-bottom: 3px solid ${riskColor}; padding-bottom:20px; margin-bottom:30px; }
        .logo { font-size:26px; font-weight:900; letter-spacing:0.1em; color:#111; }
        .logo span { color:${riskColor}; }
        .badge { background:${riskColor}; color:#fff; font-size:11px; font-weight:900; padding:6px 16px; border-radius:20px; text-transform:uppercase; }
        .risk-box { text-align:center; border:5px solid ${riskColor}; border-radius:20px; padding:30px; margin:20px 0; }
        .risk-num { font-size:90px; font-weight:900; color:${riskColor}; line-height:1; }
        .risk-cat { font-size:22px; font-weight:900; color:${riskColor}; text-transform:uppercase; margin-top:8px; }
        .meta { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin:20px 0; }
        .meta-item label { font-size:9px; font-weight:900; color:#888; text-transform:uppercase; letter-spacing:0.1em; display:block; }
        .meta-item p { font-size:15px; font-weight:700; color:#111; }
        h2 { font-size:15px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em; color:${riskColor}; margin:28px 0 12px; border-bottom:1px solid #eee; padding-bottom:6px; }
        ul { padding-left:20px; line-height:1.9; }
        ul.eat li { color:#057a55; } ul.avoid li { color:#b91c1c; } ul.doctor li { margin-bottom:8px; }
        ul.danger li { color:#dc2626; font-weight:600; }
        .two-col { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        table { width:100%; border-collapse:collapse; margin-top:8px; }
        td { padding:8px 10px; border-bottom:1px solid #f0f0f0; font-size:12px; }
        .meal-time { font-weight:800; color:#555; width:30%; }
        .tip { background:#f9fafb; border-left:3px solid ${riskColor}; padding:10px 14px; margin-bottom:8px; border-radius:4px; line-height:1.6; }
        .footer { margin-top:50px; font-size:9px; color:#999; text-align:center; border-top:1px solid #eee; padding-top:16px; }
        @media print { body { padding:20px; } }
      </style></head><body>

      <div class="header">
        <div class="logo">Pulse<span>IQ</span> Health Report</div>
        <div class="badge">${scan.status}</div>
      </div>

      <div class="meta">
        <div class="meta-item"><label>Record ID</label><p>${scan.id}</p></div>
        <div class="meta-item"><label>Scan Date</label><p>${scan.date}</p></div>
        <div class="meta-item"><label>Source</label><p>${scan.source}</p></div>
      </div>

      <div class="risk-box">
        <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Heart Attack Risk Score</div>
        <div class="risk-num">${scan.risk}%</div>
        <div class="risk-cat">${scan.status}</div>
      </div>

      <h2>Diet Plan</h2>
      <div class="two-col">
        <div><strong style="color:#057a55">✅ Eat These Foods Daily</strong><ul class="eat">${dietEat}</ul></div>
        <div><strong style="color:#b91c1c">❌ Strictly Avoid</strong><ul class="avoid">${dietAvoid}</ul></div>
      </div>

      ${mealRows ? `<h2>Sample Meal Plan</h2><table>${mealRows}</table>` : ''}

      ${exRows ? `<h2>Weekly Exercise Plan</h2>
      <p style="margin-bottom:8px;color:#555">${p?.exercise?.dailyGoal || ''}</p>
      <table><tr><th style="text-align:left;padding:8px 10px">Day</th><th style="text-align:left;padding:8px 10px">Activity</th><th style="text-align:left;padding:8px 10px">Duration</th></tr>${exRows}</table>
      <p style="margin-top:8px;color:#b45309;font-size:11px">${p?.exercise?.warning || ''}</p>` : ''}

      ${lifestyle ? `<h2>Lifestyle Recommendations</h2>${lifestyle}` : ''}

      <h2>Doctor's Advice</h2>
      <ul class="doctor">${docAdvice}</ul>

      ${danger ? `<h2 style="color:#dc2626">🚨 Emergency Warning Signs</h2>
      <ul class="danger">${danger}</ul>
      <p style="margin-top:8px;font-size:11px;color:#dc2626">If you experience any of these signs — call 112 or go to ER immediately.</p>` : ''}

      <div class="footer">
        PulseIQ AI Health System &bull; This report is for informational purposes only &bull; Always consult a qualified physician for medical decisions &bull; Generated: ${new Date().toLocaleString()}
      </div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 800);
  };

  const filtered = history.filter(h =>
    h.id.toLowerCase().includes(search.toLowerCase()) ||
    h.status.toLowerCase().includes(search.toLowerCase()) ||
    h.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full pb-10">
      
      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-heading font-black mb-2 uppercase tracking-tighter">Medical History</h1>
          <p className="text-gray-400 font-medium">
            {history.length} record{history.length !== 1 ? 's' : ''} found &bull; Saved securely on this device
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by ID, status, source..."
              className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleClearAll}
            title="Reset to defaults"
            className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 rounded-xl text-gray-500 hover:text-red-400 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      {/* STATS ROW */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Scans', value: history.length, color: 'text-white' },
          { label: 'High Risk', value: history.filter(h => h.risk > 60).length, color: 'text-pulseRed' },
          { label: 'Normal', value: history.filter(h => h.risk <= 35).length, color: 'text-accent' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 text-center">
            <p className={`text-3xl font-black font-heading ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* HISTORY LIST */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-12 text-center"
            >
              <AlertTriangle size={40} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No records found</p>
              <p className="text-gray-600 text-xs mt-2">Try a different search or run a Heart Scan to generate records.</p>
            </motion.div>
          ) : (
            filtered.map((scan, idx) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: idx * 0.05 }}
                layout
                className="glass-panel p-5 flex flex-col md:flex-row items-center justify-between gap-4 group hover:border-white/10 transition-all border-l-4"
                style={{ borderLeftColor: getRiskColor(scan.risk) }}
              >
                {/* LEFT: ID + Source */}
                <div className="flex items-center space-x-5 w-full md:w-auto">
                  <div className="p-3 rounded-xl bg-white/5 text-accent shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold font-heading tracking-wider">{scan.id}</h4>
                      {scan.risk < 20 && <CheckCircle2 size={14} className="text-accent" />}
                      <span
                        className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${getRiskColor(scan.risk)}22`, color: getRiskColor(scan.risk) }}
                      >
                        {scan.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                      📍 {scan.source}
                    </p>
                  </div>
                </div>

                {/* RIGHT: Date + Risk + Actions */}
                <div className="flex items-center justify-between w-full md:w-auto gap-6 md:gap-10">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} className="text-gray-600" />
                    <span className="text-sm font-bold">{scan.date}</span>
                  </div>

                  <div className="text-center w-20">
                    <p className="text-[9px] font-black text-gray-600 uppercase mb-0.5">Risk Score</p>
                    <p className="text-2xl font-black font-heading" style={{ color: getRiskColor(scan.risk) }}>
                      {scan.risk}%
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadPDF(scan)}
                      className="p-3 bg-white/5 hover:bg-accent/20 rounded-xl text-gray-400 hover:text-accent transition-all border border-white/5 hover:border-accent/30"
                      title="Download PDF Report"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(scan.id)}
                      className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl text-gray-600 hover:text-red-400 transition-all border border-white/5 hover:border-red-500/20"
                      title="Delete Record"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};

export default Reports;
