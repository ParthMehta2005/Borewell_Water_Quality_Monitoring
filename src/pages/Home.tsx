import { motion } from 'framer-motion';
import { Droplets, Thermometer, Waves, Zap, ShieldAlert, Cpu } from 'lucide-react';

const Home = () => {
  const sensors = [
    { name: 'DO Sensor', desc: 'Measures Dissolved Oxygen levels essential for water health.', icon: Waves, color: 'text-blue-400' },
    { name: 'pH Sensor', desc: 'Determines the acidity or alkalinity of the water source.', icon: Thermometer, color: 'text-purple-400' },
    { name: 'Turbidity Sensor', desc: 'Detects the cloudiness or haziness caused by large numbers of individual particles.', icon: Droplets, color: 'text-cyan-400' },
    { name: 'TDS Sensor', desc: 'Measures Total Dissolved Solids to determine water purity.', icon: Zap, color: 'text-yellow-400' },
    { name: 'MQ135 Sensor', desc: 'Detects ammonia and other harmful gases in the vicinity.', icon: ShieldAlert, color: 'text-red-400' },
  ];

  return (
    <div className="section-padding space-y-32">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="md:w-1/2 space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Next-Gen <br /> 
            <span className="text-gradient">Borewell Analysis</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
            Our autonomous rover leverages advanced IoT sensors and Machine Learning to provide real-time water quality insights, ensuring safe usage for drinking and irrigation.
          </p>
          <div className="flex space-x-4">
            <button className="btn-primary">Get Started</button>
            <button className="px-6 py-3 border border-white/20 rounded-full font-semibold hover:bg-white/5 transition-colors">
              Read Docs
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="md:w-1/2 relative group"
        >
          <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all"></div>
          <img 
            src="/borewell_rover_rover.png" 
            alt="Borewell Rover" 
            className="relative rounded-3xl shadow-2xl border border-white/10"
          />
        </motion.div>
      </section>

      {/* Product Description */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">The Multi-Sensor System</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Equipped with 5 precision sensors and powered by the ESP32S3 microcontroller for high-speed data processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sensors.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 hover:translate-y-[-5px] transition-all"
            >
              <s.icon className={`${s.color} w-10 h-10 mb-4`} />
              <h3 className="text-xl font-bold mb-2">{s.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8 bg-blue-500/10 border-blue-500/20"
          >
            <Cpu className="text-blue-400 w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">ESP32S3</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Dual-core Xtensa 32-bit LX7 processor with integrated Wi-Fi and Bluetooth for seamless real-time communication.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
