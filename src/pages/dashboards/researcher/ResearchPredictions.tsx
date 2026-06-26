import React, { useState } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { ClayButton } from '../../../components/ui/ClayButton';
import { UploadCloud, Play, Settings, Database, Server, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function ResearchPredictions() {
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setCompleted(false);
    setTimeout(() => {
      setRunning(false);
      setCompleted(true);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Batch Predictions & Sandbox</h1>
        <p className="text-[var(--text-secondary)] mt-1">Run inference across bulk experimental datasets and compare model behavior.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <ClayCard className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
              <Settings size={20} className="text-gray-500" />
              Experiment Config
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Target Model</label>
                <select className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium">
                  <option>CardioNet (Heart Disease v2.4)</option>
                  <option>DiabPredict (Diabetes v1.8)</option>
                  <option>NeuroRisk (Stroke v3.0)</option>
                  <option>OncoScreen (Lung Cancer v1.1)</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Compute Instance</label>
                <select className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium">
                  <option>Standard CPU (Free)</option>
                  <option>GPU Cluster A100 (High Perf)</option>
                  <option>TPU Node (Distributed)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Input Dataset Source</label>
                
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Upload CSV / JSON</span>
                  <span className="text-xs text-slate-400 mt-1">Max 100MB</span>
                </div>
                
                <div className="flex items-center gap-3 my-4">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-xs text-slate-400 font-bold uppercase">OR</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                
                <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Database size={16} />
                  Select Internal Cohort
                </button>
              </div>
            </div>
          </ClayCard>
        </div>

        {/* Console / Output Panel */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <ClayCard className="p-0 overflow-hidden flex flex-col flex-1 min-h-[500px]">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Server size={16} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">Inference Console</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            <div className="bg-slate-950 flex-1 p-6 font-mono text-sm text-slate-300 overflow-y-auto">
              {running ? (
                <div className="space-y-2">
                  <p className="text-green-400">$ init --model=CardioNet_v2.4 --target=upload_temp.csv</p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>[INFO] Validating dataset schema...</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-blue-400">[INFO] Found 14,230 valid rows. 12 rows skipped (NaN).</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>[INFO] Initializing batch inference on GPU Cluster...</motion.p>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="flex items-center gap-2 text-yellow-400 mt-4">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing batches [======&gt;    ] 65%</span>
                  </motion.div>
                </div>
              ) : completed ? (
                <div className="space-y-2">
                  <p className="text-green-400">$ init --model=CardioNet_v2.4 --target=upload_temp.csv</p>
                  <p>[INFO] Validating dataset schema...</p>
                  <p className="text-blue-400">[INFO] Found 14,230 valid rows. 12 rows skipped (NaN).</p>
                  <p>[INFO] Initializing batch inference on GPU Cluster...</p>
                  <p className="text-green-400 flex items-center gap-2 mt-4">
                    <CheckCircle size={16} />
                    [SUCCESS] Inference completed in 2.4s.
                  </p>
                  <p className="mt-4 text-slate-400">Results saved to output.csv.</p>
                  <p className="text-slate-400">Model Confidence Avg: 94.2%</p>
                  <p className="text-slate-400">High Risk Identified: 2,104 patients.</p>
                </div>
              ) : (
                <div className="text-slate-600 flex h-full items-center justify-center">
                  Ready. Configure parameters and run.
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
              <div className="text-xs font-bold text-slate-500 uppercase">
                {completed ? 'Status: Finished' : running ? 'Status: Running...' : 'Status: Idle'}
              </div>
              
              <ClayButton 
                onClick={handleRun} 
                disabled={running} 
                className={`flex items-center gap-2 ${completed ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
              >
                {running ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing</>
                ) : completed ? (
                  <><CheckCircle size={18} /> Run Again</>
                ) : (
                  <><Play size={18} fill="currentColor" /> Run Prediction Job</>
                )}
              </ClayButton>
            </div>
          </ClayCard>
        </div>
      </div>
    </div>
  );
}
