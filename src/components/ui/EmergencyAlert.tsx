import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { api } from '../../api/axios';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';

export function EmergencyAlert() {
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    // In a real app, this would be a WebSocket listener or polling
    // For now, we'll make a one-off call to check for any high-risk vitals or predictions
    const checkAlerts = async () => {
      try {
        const [vitalsRes, predsRes] = await Promise.all([
          api.get('/patient/vitals/history'),
          api.get('/patient/predictions/history') // assuming a history route exists, or we can check recent
        ]);

        const newAlerts: string[] = [];

        // Check recent vitals
        const recentVitals = vitalsRes.data.slice(-1)[0];
        if (recentVitals?.is_anomaly) {
          if (recentVitals.heart_rate > 100) newAlerts.push('Abnormal Heart Rate detected (>100 bpm).');
          if (recentVitals.blood_pressure_sys > 140) newAlerts.push('Elevated Systolic Blood Pressure detected (>140 mmHg).');
          if (recentVitals.spo2 < 94) newAlerts.push('Low Oxygen Saturation detected (<94%).');
        }

        // Check recent predictions
        if (predsRes.data && Array.isArray(predsRes.data)) {
          const highRiskPreds = predsRes.data.filter((p: any) => p.probability > 0.7);
          if (highRiskPreds.length > 0) {
            newAlerts.push(`Critical Risk Alert: High probability identified for ${highRiskPreds[0].model} disease.`);
          }
        }

        if (newAlerts.length > 0) {
          setAlerts(newAlerts);
          setIsVisible(true);
        }
      } catch (e) {
        // silently ignore error if history route doesn't exist yet
      }
    };

    checkAlerts();
    const intervalId = setInterval(checkAlerts, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [user]);

  if (!isVisible || alerts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
      >
        <div className="bg-[var(--danger)] text-white p-4 rounded-xl shadow-2xl flex items-start gap-4">
          <div className="bg-white/20 p-2 rounded-full shrink-0">
            <AlertTriangle className="animate-pulse" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Clinical Alert</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-50 mb-3">
              {alerts.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
            <div className="flex gap-3">
              <button 
                onClick={() => { setIsVisible(false); navigate('/patient/appointments'); }}
                className="bg-white text-[var(--danger)] px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-red-50 transition-colors"
              >
                Book Consult
              </button>
              <button 
                onClick={() => navigate('/patient/monitoring')}
                className="bg-red-900/40 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-900/60 transition-colors"
              >
                View Vitals
              </button>
            </div>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-white p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
