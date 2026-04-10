import { motion } from 'framer-motion';
import { Cpu, Wifi, Database, BrainCircuit, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Sensor Integration',
      desc: 'Five specialized sensors (DO, pH, Turbidity, TDS, MQ135) are physically interfaced with the ESP32S3 microcontroller using I2C and Analog interfaces.',
      icon: Cpu,
    },
    {
      title: 'Real-time Processing',
      desc: 'The ESP32S3 captures raw analog signals, converts them to digital values, and performs initial calibration and filtering.',
      icon: Wifi,
    },
    {
      title: 'ML Model Inference',
      desc: 'Data is transmitted via MQTT/HTTP to a centralized ML model which processes parameters to calculate the Water Quality Index (WQI).',
      icon: BrainCircuit,
    },
    {
      title: 'Decision Engine',
      desc: 'The model classifies the water into three primary categories: Drinkable, Irrigation, or Sewage, based on WQI thresholds.',
      icon: Database,
    },
  ];

  return (
    <div className="section-padding space-y-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold italic">The Technical Architecture</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Seamlessly bridging IoT hardware with Machine Learning for precise water analysis.
        </p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/20 via-blue-500 to-blue-500/20 -translate-x-1/2"></div>
        
        <div className="space-y-12 md:space-y-24">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="md:w-1/2 flex justify-center">
                <div className={`p-6 rounded-3xl glass-card border-2 ${i % 2 === 0 ? 'border-blue-500/30' : 'border-cyan-500/30'}`}>
                  <step.icon className={`w-16 h-16 ${i % 2 === 0 ? 'text-blue-400' : 'text-cyan-400'}`} />
                </div>
              </div>

              <div className="md:w-1/2 space-y-4 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">STEP 0{i+1}</span>
                  <CheckCircle2 size={16} className="text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decision Visualization */}
      <section className="glass-card p-12 bg-gradient-to-br from-blue-500/5 to-purple-500/5 mt-32">
        <h2 className="text-3xl font-bold mb-8 text-center italic">Decision Logic Visualization</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-green-500/20 bg-green-500/5 rounded-xl text-center">
            <h4 className="text-green-400 font-bold mb-2 uppercase">Drinkable</h4>
            <div className="text-3xl font-mono mb-2">90 - 100</div>
            <p className="text-xs text-slate-500">Perfect for consumption</p>
          </div>
          <div className="p-6 border border-yellow-500/20 bg-yellow-500/5 rounded-xl text-center">
            <h4 className="text-yellow-400 font-bold mb-2 uppercase">Irrigation</h4>
            <div className="text-3xl font-mono mb-2">60 - 89</div>
            <p className="text-xs text-slate-500">Safe for agriculture</p>
          </div>
          <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-xl text-center">
            <h4 className="text-red-400 font-bold mb-2 uppercase">Sewage</h4>
            <div className="text-3xl font-mono mb-2">0 - 59</div>
            <p className="text-xs text-slate-500">Non-usable / Industrial</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
