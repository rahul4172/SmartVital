import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

export default function Timeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await api.getTimeline();
        setTimeline(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchTimeline();
  }, []);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-4 bg-slate-500/20 rounded-2xl text-slate-400">
          <Clock size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Patient Timeline</h1>
          <p className="text-slate-400">Historical record of all AI health assessments</p>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        {loading ? (
          <div className="flex justify-center py-12"><Activity className="animate-spin text-cyan-400" size={32}/></div>
        ) : timeline.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Clock size={48} className="mx-auto mb-4 opacity-20" />
            <p>No historical assessments found.</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            {timeline.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 group-[.is-active]:bg-cyan-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Activity size={18} />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl group-hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-white">{item.disease}</h3>
                    <span className="text-xs font-medium text-slate-400 bg-slate-900 px-2 py-1 rounded-full">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <span className={`text-sm font-semibold px-2 py-1 rounded ${item.risk_score > 0.5 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      Risk Score: {(item.risk_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <p className="text-slate-300 text-sm leading-relaxed flex items-start gap-2">
                    <AlertCircle size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item.insight}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
