import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitMerge, Activity, AlertTriangle } from 'lucide-react';
import { api } from '../api/client';

export default function Comorbidity() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComorbidity = async () => {
      try {
        const res = await api.getComorbidity();
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchComorbidity();
  }, []);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400">
          <GitMerge size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Comorbidity Analytics</h1>
          <p className="text-slate-400">Cross-disease correlation and combined risk analysis</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Activity className="animate-spin text-cyan-400" size={32}/></div>
      ) : !data || Object.keys(data.assessments).length === 0 ? (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
          <AlertTriangle size={48} className="mx-auto text-yellow-500/50 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Insufficient Data</h3>
          <p className="text-slate-400 max-w-lg mx-auto">Please complete at least one disease risk assessment to generate a comorbidity report.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">Overall Risk Profile</h3>
            <p className="text-slate-300 leading-relaxed mb-6 bg-slate-800/50 p-4 rounded-xl border border-white/5">
              {data.overall_summary}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(data.assessments).map(([disease, details]) => (
                <div key={disease} className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl">
                  <h4 className="text-sm font-medium text-slate-400 mb-2">{disease}</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">{(details.risk_score * 100).toFixed(0)}%</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded mb-1 ${details.risk_score > 0.5 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {details.risk_score > 0.5 ? 'HIGH' : 'LOW'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="text-yellow-400" size={20} /> Detected Correlations
            </h3>
            {data.correlations && data.correlations.length > 0 ? (
              <ul className="space-y-3">
                {data.correlations.map((corr, idx) => (
                  <li key={idx} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-100">
                    {corr}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm">No significant cross-disease correlations detected.</p>
            )}
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={20} /> Recommendations
            </h3>
            {data.recommendations && data.recommendations.length > 0 ? (
              <ul className="space-y-3">
                {data.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400">•</span> {rec}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm">Maintain current healthy lifestyle habits.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
