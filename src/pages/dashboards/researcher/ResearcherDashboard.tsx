import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { Users, Database, Activity, TrendingUp, Search, Brain, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../../api/axios';

export function ResearcherDashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  
  useEffect(() => {
    api.get('/researcher/stats').then(res => setStatsData(res.data)).catch(err => console.error(err));
  }, []);

  const stats = [
    { title: 'Total Anonymized Records', value: statsData?.total_patients?.toLocaleString() || '...', icon: <Database size={24} className="text-blue-500" /> },
    { title: 'Active Cohorts', value: statsData?.active_cohorts || '...', icon: <Users size={24} className="text-purple-500" /> },
    { title: 'AI Model Accuracy (Avg)', value: statsData ? `${statsData.model_accuracy}%` : '...', icon: <Brain size={24} className="text-green-500" /> },
    { title: 'High-Risk Patients', value: statsData?.high_risk_patients?.toLocaleString() || '...', icon: <Activity size={24} className="text-red-500" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Research Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-1">High-level insights across the entire patient population.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <ClayCard className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stat.value}</p>
              </div>
            </ClayCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ClayCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <TrendingUp className="text-[var(--primary)]" />
              Recent Data Updates
            </h2>
          </div>
          <div className="space-y-4">
             {[
               { title: 'New batch of 500 records imported from Clinic A', time: '2 hours ago' },
               { title: 'Diabetes Model retrained with 95% accuracy', time: '5 hours ago' },
               { title: 'Monthly cohort analysis report generated', time: '1 day ago' },
               { title: 'Lung Cancer dataset finalized for export', time: '2 days ago' }
             ].map((update, idx) => (
               <div key={idx} className="flex gap-4 p-4 rounded-[var(--radius-md)] bg-slate-50 border border-slate-100">
                 <Clock className="text-slate-400 mt-1 shrink-0" size={18} />
                 <div>
                   <p className="font-semibold text-slate-800">{update.title}</p>
                   <p className="text-xs text-slate-500 mt-1">{update.time}</p>
                 </div>
               </div>
             ))}
          </div>
        </ClayCard>

        <ClayCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Search className="text-purple-500" />
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <button className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-semibold transition-colors flex flex-col items-center justify-center gap-2 h-32">
                <Users size={28} />
                Explore Cohorts
             </button>
             <button className="p-4 rounded-xl border border-green-100 bg-green-50/50 hover:bg-green-50 text-green-700 font-semibold transition-colors flex flex-col items-center justify-center gap-2 h-32">
                <Database size={28} />
                Export Dataset
             </button>
             <button className="p-4 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-50 text-purple-700 font-semibold transition-colors flex flex-col items-center justify-center gap-2 h-32">
                <Activity size={28} />
                Run Predictions
             </button>
             <button className="p-4 rounded-xl border border-orange-100 bg-orange-50/50 hover:bg-orange-50 text-orange-700 font-semibold transition-colors flex flex-col items-center justify-center gap-2 h-32">
                <Brain size={28} />
                Feature Importance
             </button>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
