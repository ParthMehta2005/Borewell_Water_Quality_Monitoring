import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Thermometer, Waves, Zap, ShieldAlert, BarChart3, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Mock data for live values
  const [data, setData] = useState({
    wqi: 82,
    do: 6.5,
    ph: 7.2,
    turbidity: 4.1,
    tds: 350,
    ammonia: 0.12,
  });

  // Simulation of live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        wqi: Math.max(0, Math.min(100, prev.wqi + (Math.random() - 0.5) * 2)),
        do: +(prev.do + (Math.random() - 0.5) * 0.1).toFixed(1),
        ph: +(prev.ph + (Math.random() - 0.5) * 0.1).toFixed(1),
        turbidity: +(prev.turbidity + (Math.random() - 0.5) * 0.2).toFixed(1),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getClassification = (wqi: number) => {
    if (wqi >= 90) return { label: 'Drinkable', color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' };
    if (wqi >= 60) return { label: 'Irrigation', color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' };
    return { label: 'Sewage', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' };
  };

  const classification = getClassification(data.wqi);

  return (
    <div className="section-padding space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold">Live Monitoring</h1>
          <p className="text-slate-400 flex items-center gap-2 mt-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Real-time feed from Rover-X1
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 glass-card hover:bg-white/10 transition-colors flex items-center gap-2 text-sm">
            <BarChart3 size={16} /> Reports
          </button>
          <button className="px-4 py-2 glass-card hover:bg-white/10 transition-colors flex items-center gap-2 text-sm">
            <TrendingUp size={16} /> Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Gauge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-2 glass-card p-12 flex flex-col items-center justify-center text-center space-y-8 ${classification.border}`}
        >
          <h2 className="text-2xl font-semibold italic">Water Quality Index</h2>
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="128" cy="128" r="110"
                className="stroke-slate-800 fill-none"
                strokeWidth="12"
              />
              <motion.circle
                cx="128" cy="128" r="110"
                className={`fill-none ${classification.color.replace('text', 'stroke')}`}
                strokeWidth="12"
                strokeDasharray="690"
                initial={{ strokeDashoffset: 690 }}
                animate={{ strokeDashoffset: 690 - (690 * data.wqi) / 100 }}
                strokeLinecap="round"
                transition={{ duration: 1.5 }}
              />
            </svg>
            <div className="z-10">
              <span className={`text-7xl font-mono font-bold ${classification.color}`}>{Math.round(data.wqi)}</span>
            </div>
          </div>
          <div className={`px-8 py-3 rounded-full border ${classification.border} ${classification.bg} animate-pulse`}>
            <span className={`text-xl font-bold uppercase tracking-widest ${classification.color}`}>
              {classification.label}
            </span>
          </div>
        </motion.div>

        {/* Small Parameter Cards */}
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: 'Dissolved O2', value: data.do, unit: 'mg/L', icon: Waves, color: 'text-blue-400' },
            { label: 'pH Level', value: data.ph, unit: 'pH', icon: Thermometer, color: 'text-purple-400' },
            { label: 'Turbidity', value: data.turbidity, unit: 'NTU', icon: Droplets, color: 'text-cyan-400' },
            { label: 'TDS Purity', value: data.tds, unit: 'ppm', icon: Zap, color: 'text-yellow-400' },
            { label: 'Ammonia', value: data.ammonia, unit: 'ppm', icon: ShieldAlert, color: 'text-red-400' },
          ].map((param, i) => (
            <motion.div
              key={param.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/5`}>
                  <param.icon className={param.color} size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase">{param.label}</p>
                  <p className="text-xl font-bold">{param.value} <span className="text-xs text-slate-300 font-normal">{param.unit}</span></p>
                </div>
              </div>
              <div className="h-10 w-24 bg-white/5 rounded-lg overflow-hidden flex items-end">
                 <div 
                   className={`w-full ${param.color.replace('text', 'bg')} opacity-20`} 
                   style={{ height: `${(param.value / (param.label.includes('TDS') ? 1000 : 10)) * 100}%` }}
                 />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
