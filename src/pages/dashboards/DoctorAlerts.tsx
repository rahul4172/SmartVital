import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { HeartPulse, Brain, AlertTriangle, Bell, Loader2 } from 'lucide-react';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';

export function DoctorAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/alerts');
        setAlerts(res.data);
      } catch (err) {
        toast.error('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      setAlerts(prev => prev.map(a => a._id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      toast.error('Failed to update alert');
    }
  };

  const activeAlerts = alerts.filter(a => !a.is_read);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Critical Alerts</h1>
        <p className="text-[var(--text-secondary)] mt-1">Real-time AI-driven notifications and vital anomalies for your patients.</p>
      </div>

      <div className="space-y-4">
        {activeAlerts.map((alert, idx) => (
          <motion.div
            key={alert._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <ClayCard className={`p-5 flex items-start gap-4 border-l-4 ${
              alert.severity === 'Critical' ? 'border-l-[var(--danger)]' :
              alert.severity === 'Warning' ? 'border-l-yellow-500' :
              'border-l-blue-500'
            }`}>
              <div className={`p-3 rounded-xl shrink-0 ${
                alert.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                alert.severity === 'Warning' ? 'bg-yellow-100 text-yellow-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {alert.severity === 'Critical' ? <HeartPulse size={24} /> : 
                 alert.severity === 'Warning' ? <AlertTriangle size={24} /> : 
                 <Bell size={24} />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-lg">{alert.type}</h3>
                    <p className="text-sm font-semibold text-blue-600 mt-0.5">Patient: {alert.patient_name}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{new Date(alert.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-[var(--text-secondary)] mt-2 text-sm leading-relaxed">{alert.message}</p>
                
                <div className="mt-4 flex gap-3">
                  <button className="text-sm font-bold text-[var(--primary)] hover:underline">Review Chart</button>
                  <button onClick={() => handleMarkRead(alert._id)} className="text-sm font-bold text-gray-500 hover:text-gray-700 hover:underline">Dismiss</button>
                </div>
              </div>
            </ClayCard>
          </motion.div>
        ))}
        {activeAlerts.length === 0 && !loading && (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            No new alerts.
          </div>
        )}
      </div>
    </div>
  );
}
