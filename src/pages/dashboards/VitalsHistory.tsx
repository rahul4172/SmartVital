import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { api } from '../../api/axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface VitalRecord {
  date: string;
  heart_rate: number;
  spo2: number;
  blood_pressure_sys: number;
  blood_pressure_dia: number;
  is_anomaly: boolean;
}

export function VitalsHistory() {
  const [history, setHistory] = useState<VitalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metric, setMetric] = useState<'heart_rate' | 'spo2' | 'blood_pressure'>('heart_rate');

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/patient/vitals/history');
      setHistory(res.data);
    } catch (e) {
      console.error('Failed to load vitals history', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const anomaliesCount = history.filter(h => h.is_anomaly).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Vitals History & Trends</h1>
        <p className="text-[var(--text-secondary)] mt-1">Review your logged and device-captured vitals over time to detect anomalies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ClayCard className="p-6 cursor-pointer hover:border-[var(--primary)] transition-colors border-2 border-transparent" onClick={() => setMetric('heart_rate')}>
          <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Avg Heart Rate</div>
          <div className="text-3xl font-bold text-[var(--danger)]">
            {history.length ? Math.round(history.reduce((acc, curr) => acc + curr.heart_rate, 0) / history.length) : '--'} <span className="text-lg text-[var(--text-secondary)]">bpm</span>
          </div>
        </ClayCard>
        
        <ClayCard className="p-6 cursor-pointer hover:border-[var(--primary)] transition-colors border-2 border-transparent" onClick={() => setMetric('spo2')}>
          <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Avg SpO2</div>
          <div className="text-3xl font-bold text-[var(--primary)]">
            {history.length ? Math.round(history.reduce((acc, curr) => acc + curr.spo2, 0) / history.length) : '--'} <span className="text-lg text-[var(--text-secondary)]">%</span>
          </div>
        </ClayCard>
        
        <ClayCard className="p-6 cursor-pointer hover:border-[var(--primary)] transition-colors border-2 border-transparent" onClick={() => setMetric('blood_pressure')}>
          <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Avg Blood Pressure</div>
          <div className="text-3xl font-bold text-[var(--warning)]">
            {history.length ? Math.round(history.reduce((acc, curr) => acc + curr.blood_pressure_sys, 0) / history.length) : '--'} / {history.length ? Math.round(history.reduce((acc, curr) => acc + curr.blood_pressure_dia, 0) / history.length) : '--'}
          </div>
        </ClayCard>
      </div>

      <ClayCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {metric === 'heart_rate' ? 'Heart Rate Trend' : metric === 'spo2' ? 'SpO2 Trend' : 'Blood Pressure Trend'}
          </h2>
          {anomaliesCount > 0 && (
            <div className="px-3 py-1 bg-[var(--danger-soft)] text-[var(--danger)] text-sm font-bold rounded-full">
              {anomaliesCount} Anomalies Detected
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'var(--text-muted)' }} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getMonth()+1}/${d.getDate()}`;
                  }}
                />
                <YAxis 
                  tick={{ fill: 'var(--text-muted)' }} 
                  tickLine={false} 
                  axisLine={false}
                  domain={metric === 'spo2' ? [85, 100] : ['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  labelFormatter={(val) => new Date(val).toLocaleDateString()}
                />
                <Legend />
                
                {metric === 'heart_rate' && (
                  <Line 
                    type="monotone" 
                    dataKey="heart_rate" 
                    name="Heart Rate (bpm)" 
                    stroke="var(--danger)" 
                    strokeWidth={3} 
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.heart_rate > 100 || payload.heart_rate < 50) {
                        return <circle cx={cx} cy={cy} r={6} fill="red" stroke="white" strokeWidth={2} />;
                      }
                      return <circle cx={cx} cy={cy} r={4} fill="var(--danger)" stroke="none" />;
                    }}
                  />
                )}
                
                {metric === 'spo2' && (
                  <Line 
                    type="monotone" 
                    dataKey="spo2" 
                    name="SpO2 (%)" 
                    stroke="var(--primary)" 
                    strokeWidth={3} 
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.spo2 < 94) {
                        return <circle cx={cx} cy={cy} r={6} fill="red" stroke="white" strokeWidth={2} />;
                      }
                      return <circle cx={cx} cy={cy} r={4} fill="var(--primary)" stroke="none" />;
                    }}
                  />
                )}
                
                {metric === 'blood_pressure' && (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="blood_pressure_sys" 
                      name="Systolic" 
                      stroke="var(--warning)" 
                      strokeWidth={3} 
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        if (payload.blood_pressure_sys > 140) {
                          return <circle cx={cx} cy={cy} r={6} fill="red" stroke="white" strokeWidth={2} />;
                        }
                        return <circle cx={cx} cy={cy} r={4} fill="var(--warning)" stroke="none" />;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="blood_pressure_dia" 
                      name="Diastolic" 
                      stroke="#8b5cf6" 
                      strokeWidth={3} 
                      dot={{ r: 4 }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </ClayCard>
    </div>
  );
}
