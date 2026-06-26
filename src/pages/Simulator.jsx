import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Play, ArrowRight, Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { api } from '../api/client';

export default function Simulator() {
  const [baseline, setBaseline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [scenarios, setScenarios] = useState({
    weight_loss: false,
    quit_smoking: false,
    blood_pressure_control: false
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchBaseline = async () => {
      try {
        const res = await api.getSimulationBaseline();
        setBaseline(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchBaseline();
  }, []);

  const handleToggle = (scenario) => {
    setScenarios(prev => ({ ...prev, [scenario]: !prev[scenario] }));
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const activeScenarios = Object.keys(scenarios).filter(k => scenarios[k]);
      const res = await api.runSimulation(activeScenarios);
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Simulation failed.");
    }
    setSimulating(false);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-4 bg-orange-500/20 rounded-2xl text-orange-400">
          <Settings size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">"What-If" Health Simulator</h1>
          <p className="text-slate-400">Simulate the impact of lifestyle changes on your risk profile</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Activity className="animate-spin text-cyan-400" size={32}/></div>
      ) : !baseline ? (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
          <h3 className="text-xl font-medium text-white mb-2">No Baseline Data</h3>
          <p className="text-slate-400">Please complete at least one assessment to establish a baseline before running simulations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Select Interventions</h3>
              <div className="space-y-4">
                
                <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                  <div>
                    <h4 className="text-white font-medium">Weight Loss Protocol</h4>
                    <p className="text-sm text-slate-400">Simulate a 10% reduction in BMI</p>
                  </div>
                  <input type="checkbox" checked={scenarios.weight_loss} onChange={() => handleToggle('weight_loss')} className="w-5 h-5 accent-cyan-500" />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                  <div>
                    <h4 className="text-white font-medium">Smoking Cessation</h4>
                    <p className="text-sm text-slate-400">Change status to 'formerly smoked' / reduce impact</p>
                  </div>
                  <input type="checkbox" checked={scenarios.quit_smoking} onChange={() => handleToggle('quit_smoking')} className="w-5 h-5 accent-cyan-500" />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                  <div>
                    <h4 className="text-white font-medium">Blood Pressure Control</h4>
                    <p className="text-sm text-slate-400">Normalize systolic BP to 120 mmHg</p>
                  </div>
                  <input type="checkbox" checked={scenarios.blood_pressure_control} onChange={() => handleToggle('blood_pressure_control')} className="w-5 h-5 accent-cyan-500" />
                </label>
                
              </div>

              <button 
                onClick={runSimulation}
                disabled={simulating || !Object.values(scenarios).some(v => v)}
                className="mt-6 w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-bold text-lg hover:from-orange-400 hover:to-red-400 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {simulating ? 'Simulating...' : 'Run Simulation'} <Play size={20} fill="currentColor" />
              </button>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Current Baseline Risk</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(baseline.base_risks).map(([disease, score]) => (
                  <div key={disease} className="bg-slate-800/50 p-3 rounded-lg border border-white/5 text-center">
                    <p className="text-slate-400 text-xs mb-1">{disease}</p>
                    <p className="text-white font-bold text-lg">{(score * 100).toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-6">Simulation Results</h3>
            
            {result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex-1">
                
                <div className="space-y-4">
                  {Object.entries(result.impact).map(([disease, data]) => {
                    const diff = data.new - data.original;
                    const isImproved = diff < 0;
                    return (
                      <div key={disease} className="bg-slate-800/50 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{disease}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm">
                            <span className="text-slate-400">Old: {(data.original * 100).toFixed(1)}%</span>
                            <ArrowRight size={14} className="text-slate-600" />
                            <span className="text-white font-bold">New: {(data.new * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        {diff !== 0 && (
                          <div className={`flex items-center gap-1 font-bold ${isImproved ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isImproved ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                            {Math.abs(diff * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-5 border border-indigo-500/20 mt-auto">
                  <h4 className="text-indigo-300 font-medium mb-2 flex items-center gap-2">
                    <Activity size={18} /> Projection Narrative
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{result.narrative}</p>
                </div>

              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <Play size={48} className="text-slate-600 mb-4" />
                <p className="text-slate-400">Select interventions and run the simulation to see projected outcomes.</p>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
