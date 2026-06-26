import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, Brain, Clock, PlusCircle } from 'lucide-react';
import { api } from '../../api/axios';
import { ClayCard } from '../../components/ui/ClayCard';
import { useAuthStore } from '../../store/auth.store';

export function PatientAlerts() {
  const user = useAuthStore(state => state.user);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlertsData = async () => {
      try {
        const [vitalsRes, forecastRes, backendAlertsRes] = await Promise.all([
          api.get('/patient/vitals/history').catch(() => ({ data: [] })),
          api.get('/patient/forecast').catch(() => ({ data: null })),
          api.get('/alerts').catch(() => ({ data: [] }))
        ]);

        const generatedAlerts: any[] = [];

        // 1. Process Database Alerts (created by system/doctor)
        if (backendAlertsRes.data && Array.isArray(backendAlertsRes.data)) {
          backendAlertsRes.data.forEach((a: any) => {
            generatedAlerts.push({
              id: a._id,
              type: a.type || 'system',
              severity: a.severity?.toLowerCase() || 'warning',
              title: a.title || 'System Alert',
              description: a.message,
              timestamp: a.created_at,
              icon: <AlertTriangle size={24} className={a.severity?.toLowerCase() === 'critical' ? 'text-[var(--danger)]' : 'text-[var(--warning)]'} />
            });
          });
        }

        // 2. Process Vitals for anomalies dynamically
        if (vitalsRes.data && Array.isArray(vitalsRes.data)) {
          vitalsRes.data.forEach((v: any, index: number) => {
            if (v.is_anomaly || v.heart_rate > 100 || v.blood_pressure_sys > 140 || v.spo2 < 94) {
              generatedAlerts.push({
                id: `vital-${v.date || index}`,
                type: 'vital',
                severity: 'critical',
                title: 'Abnormal Vitals Detected',
                description: `Anomaly in readings: HR ${v.heart_rate}bpm, BP ${v.blood_pressure_sys}/${v.blood_pressure_dia}, SpO2 ${v.spo2}%`,
                timestamp: v.date || new Date().toISOString(),
                icon: <Activity size={24} className="text-[var(--danger)]" />
              });
            }
          });
        }

        // 3. Process Forecasting for high risk
        if (forecastRes.data && forecastRes.data.forecast) {
           const latestProj = forecastRes.data.forecast[0]?.projected_risk || 0;
           if (latestProj > 0.6) {
             generatedAlerts.push({
               id: `forecast-alert`,
               type: 'prediction',
               severity: latestProj > 0.8 ? 'critical' : 'warning',
               title: `Elevated ${forecastRes.data.model} Risk`,
               description: `Our AI model forecasted a ${(latestProj * 100).toFixed(1)}% probability risk for ${forecastRes.data.model}. Please consult your physician.`,
               timestamp: new Date().toISOString(),
               icon: <Brain size={24} className="text-[var(--warning)]" />
             });
           }
        }

        // Sort by timestamp descending
        generatedAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setAlerts(generatedAlerts);
      } catch (error) {
        console.error("Failed to fetch alerts data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertsData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[var(--text-primary)]"
          >
            My Alerts
          </motion.h1>
          <p className="text-[var(--text-secondary)] mt-1">Review critical notifications and AI risk warnings.</p>
        </div>
      </div>

      <ClayCard className="p-6 min-h-[500px]">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-20 h-20 bg-[var(--success-soft)] text-[var(--success)] rounded-full flex items-center justify-center mb-6">
              <PlusCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Active Alerts</h3>
            <p className="text-[var(--text-secondary)] max-w-md">
              Your health metrics and AI assessments look stable. We'll notify you if any anomalies or risks are detected.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-5 rounded-2xl border-l-4 ${
                  alert.severity === 'critical' 
                    ? 'bg-red-50/50 border-[var(--danger)]' 
                    : 'bg-orange-50/50 border-[var(--warning)]'
                } flex items-start gap-4 shadow-sm`}
              >
                <div className="shrink-0 bg-white p-3 rounded-xl shadow-sm">
                  {alert.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <h3 className={`font-bold text-lg ${
                      alert.severity === 'critical' ? 'text-[var(--danger)]' : 'text-[var(--warning)]'
                    }`}>
                      {alert.title}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-3">
                    {alert.description}
                  </p>
                  
                  {alert.severity === 'critical' && (
                    <button className="text-xs font-bold bg-white text-[var(--danger)] px-4 py-2 rounded-lg shadow-sm border border-red-100 hover:bg-red-50 transition-colors">
                      Consult Doctor Now
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ClayCard>
    </div>
  );
}
