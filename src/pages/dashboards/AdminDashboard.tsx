import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { useAuthStore } from '../../store/auth.store';
import { api } from '../../api/axios';

// We no longer need static SYSTEM_STATS, it's fetched from backend.

const ML_MODELS = [
  { name: 'Heart Disease (ANN)', accuracy: 94.2, f1: 0.92, drift: '+0.1%', status: 'healthy' },
  { name: 'Stroke Risk (XGBoost)', accuracy: 89.5, f1: 0.88, drift: '-0.3%', status: 'warning' },
  { name: 'Diabetes (RandomForest)', accuracy: 96.1, f1: 0.95, drift: '0.0%', status: 'healthy' },
  { name: 'Lung Cancer (SVM)', accuracy: 91.8, f1: 0.90, drift: '+0.5%', status: 'healthy' }
];

export function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      }
      // ML models are still mocked until a dedicated ML tracking DB is active
      setModels(ML_MODELS);
    };
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">System Administration</h1>
          <p className="text-[var(--text-secondary)] mt-1">Platform telemetry, ML model monitoring, and user management.</p>
        </div>
        
        <div className="px-4 py-2 bg-[var(--success-soft)] text-[var(--success)] rounded-full border border-[var(--success)] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
          <span className="text-sm font-bold">All Systems Operational</span>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ClayCard className="p-6">
            <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Total Users</p>
            <h3 className="text-4xl font-bold text-[var(--text-primary)]">{stats.total_users.toLocaleString()}</h3>
          </ClayCard>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ClayCard className="p-6">
            <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Doctors</p>
            <h3 className="text-4xl font-bold text-[var(--primary)]">{stats.roles?.doctor || 0}</h3>
          </ClayCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <ClayCard className="p-6">
            <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Patients</p>
            <h3 className="text-4xl font-bold text-green-500">{stats.roles?.patient || 0}</h3>
          </ClayCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <ClayCard className="p-6">
            <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Researchers</p>
            <h3 className="text-4xl font-bold text-purple-500">{stats.roles?.researcher || 0}</h3>
          </ClayCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <ClayCard className="p-6">
            <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">IoT Devices</p>
            <h3 className="text-4xl font-bold text-[var(--info)]">{stats.total_devices || 0}</h3>
          </ClayCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ML Model Performance */}
        <ClayCard className="p-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            Machine Learning Diagnostics
          </h2>
          
          <div className="space-y-4">
            {models.map((model, idx) => (
              <div key={idx} className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-white">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[var(--text-primary)]">{model.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${model.status === 'healthy' ? 'bg-[var(--success-soft)] text-[var(--success)]' : 'bg-[var(--warning-soft)] text-[var(--warning)]'}`}>
                    {model.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Accuracy</p>
                    <p className="font-bold text-lg">{model.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">F1 Score</p>
                    <p className="font-bold text-lg">{model.f1}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Data Drift</p>
                    <p className={`font-bold text-lg ${model.drift.startsWith('+') ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                      {model.drift}
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className={`h-full ${model.status === 'healthy' ? 'bg-[var(--success)]' : 'bg-[var(--warning)]'}`} style={{ width: `${model.accuracy}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </ClayCard>

        {/* Server Health */}
        <div className="space-y-6">
          <ClayCard className="p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--info)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
              Infrastructure Status
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-[var(--text-secondary)]">FastAPI Backend (Render)</span>
                  <span className="text-[var(--success)] font-bold">{stats.api_latency || "24ms latency"}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--success)] w-[15%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-[var(--text-secondary)]">MongoDB Cluster (Atlas)</span>
                  <span className="text-[var(--text-primary)] font-bold">42% storage used</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--primary)] w-[42%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-[var(--text-secondary)]">WebSocket IoT Relay</span>
                  <span className="text-[var(--text-primary)] font-bold">1.2k req/sec</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--info)] w-[65%]"></div>
                </div>
              </div>
            </div>
          </ClayCard>

          <ClayCard className="p-6 bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center min-h-[200px]">
            <p className="text-[var(--text-secondary)] font-bold mb-4">Export Full Audit Log</p>
            <button className="px-6 py-2 bg-white border border-gray-200 shadow-sm rounded-lg font-bold text-[var(--text-primary)] hover:bg-gray-100 transition-colors">
              Download CSV
            </button>
          </ClayCard>
        </div>

      </div>

    </div>
  );
}
