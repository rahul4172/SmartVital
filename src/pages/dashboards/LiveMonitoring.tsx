import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { RiskGauge } from '../../components/ui/RiskGauge';
import { Activity, Heart, Thermometer, Droplets, ActivitySquare } from 'lucide-react';
import { VitalsChart } from '../../components/charts/VitalsChart';
import { ECGChart } from '../../components/charts/ECGChart';
import { useSmartVitalIoT } from '../../hooks/useSmartVitalIoT';

export function LiveMonitoring() {
  const { vitals: data, connected: isConnected, error } = useSmartVitalIoT();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.heartRate && data.spo2) {
      setHistory(prev => {
        const newHistory = [...prev, {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          heart_rate: data.heartRate,
          spo2: data.spo2,
        }];
        // Keep last 30 data points for the graph
        return newHistory.slice(-30);
      });
    }
  }, [data?.timestamp]); // Use timestamp as dependency to only run when new payload arrives

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Live Vitals Monitoring</h1>
          <p className="text-[var(--text-secondary)] mt-1">Real-time telemetry from your connected SmartVital wearable.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--danger)]'}`}></div>
          <span className="text-sm font-bold text-[var(--text-primary)]">
            {isConnected ? 'Device Connected' : 'Device Offline'}
          </span>
          {data?.mode && (
             <span className="ml-2 text-xs font-bold px-2 py-1 bg-gray-100 rounded-md text-gray-500 uppercase">
                {data.mode === 'SIMULATION' ? 'Mock Data' : 'Real Hardware'}
             </span>
          )}
        </div>
      </div>

      {error && !isConnected && (
        <div className="bg-[var(--danger-soft)] text-[var(--danger)] p-4 rounded-xl border border-[var(--danger)] flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-bold">Connection Error</h4>
            <p className="text-sm">{error}. Please ensure your ESP32 device or Mock server is running.</p>
          </div>
        </div>
      )}

      {/* Main 5 Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Heart Rate */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <ClayCard className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-12 h-12 rounded-full bg-[var(--danger-soft)] text-[var(--heart)] flex items-center justify-center mb-4 shadow-sm">
              <Heart size={24} className={isConnected ? "animate-pulse" : ""} />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-4">Heart Rate (MAX30102)</h3>
            <RiskGauge 
              score={data?.heartRate || 0} 
              maxScore={200}
              label={data?.heartRate ? `${data.heartRate} bpm` : '--'} 
              size={160} 
            />
            <div className="mt-4 w-full pt-4 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Normal range</span>
              <span className="font-bold text-[var(--text-primary)]">60 - 100 bpm</span>
            </div>
          </ClayCard>
        </motion.div>

        {/* SpO2 */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <ClayCard className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-12 h-12 rounded-full bg-[var(--info-soft)] text-[var(--info)] flex items-center justify-center mb-4 shadow-sm">
              <Droplets size={24} />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-4">SpO2 (MAX30102)</h3>
            <RiskGauge 
              score={data?.spo2 || 0} 
              maxScore={100}
              label={data?.spo2 ? `${data.spo2}%` : '--'} 
              size={160} 
            />
            <div className="mt-4 w-full pt-4 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Normal range</span>
              <span className="font-bold text-[var(--text-primary)]">&gt; 95%</span>
            </div>
          </ClayCard>
        </motion.div>

        {/* Temperature */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <ClayCard className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-12 h-12 rounded-full bg-[var(--warning-soft)] text-[var(--warning)] flex items-center justify-center mb-4 shadow-sm">
              <Thermometer size={24} />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-4">Body Temp (DHT22)</h3>
            <RiskGauge 
              score={data?.temperature ? ((data.temperature - 35) / (40 - 35)) * 100 : 0} 
              maxScore={100}
              label={data?.temperature ? `${data.temperature.toFixed(1)}°C` : '--'} 
              size={160} 
            />
            <div className="mt-4 w-full pt-4 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Normal range</span>
              <span className="font-bold text-[var(--text-primary)]">36.1 - 37.2°C</span>
            </div>
          </ClayCard>
        </motion.div>

        {/* Blood Pressure */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <ClayCard className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4 shadow-sm">
              <ActivitySquare size={24} />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-4">Blood Pressure (BP Module)</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center w-full">
               <div className="text-3xl font-bold text-gray-800">
                 {data?.systolic || '--'} <span className="text-gray-400 font-light">/</span> {data?.diastolic || '--'}
               </div>
               <div className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">mmHg</div>
               
               {data?.bpCategory && (
                 <div className={`mt-4 px-3 py-1 rounded-full text-xs font-bold ${
                   data.bpCategory === 'Normal' ? 'bg-green-100 text-green-700' :
                   data.bpCategory === 'Elevated' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                 }`}>
                   {data.bpCategory}
                 </div>
               )}
            </div>
            
            <div className="mt-4 w-full pt-4 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Normal range</span>
              <span className="font-bold text-[var(--text-primary)]">&lt; 120/80</span>
            </div>
          </ClayCard>
        </motion.div>

        {/* GSR Stress */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <ClayCard className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-4 shadow-sm">
              <Activity size={24} />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-4">Skin Conductance (GSR)</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center w-full">
               <div className="text-3xl font-bold text-gray-800">
                 {data?.gsrConductance || '--'}
               </div>
               <div className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">µS</div>
               
               {data?.stressLevel && (
                 <div className={`mt-4 px-3 py-1 rounded-full text-xs font-bold ${
                   data.stressLevel === 'Low' ? 'bg-green-100 text-green-700' :
                   data.stressLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                 }`}>
                   Stress: {data.stressLevel}
                 </div>
               )}
            </div>
            
            <div className="mt-4 w-full pt-4 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Normal range</span>
              <span className="font-bold text-[var(--text-primary)]">&lt; 0.6 µS</span>
            </div>
          </ClayCard>
        </motion.div>
      </div>

      {/* ECG Waveform Display */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <ClayCard className="p-6 border-2 border-red-500/10 shadow-[0_8px_30px_rgb(239,68,68,0.1)]">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                  <Activity size={18} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-gray-900">Live ECG Waveform</h3>
                   <p className="text-xs text-gray-500 font-medium">AD8232 Single-Lead Monitor (50-point PQRST array)</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                {data?.ecgLeadOff ? (
                  <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full animate-pulse">Lead Off</span>
                ) : isConnected && data?.ecgWaveform?.length > 0 ? (
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Lead Attached</span>
                ) : (
                  <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Waiting...</span>
                )}
             </div>
          </div>
          <ECGChart data={data?.ecgWaveform || []} color="#ef4444" />
        </ClayCard>
      </motion.div>

      {/* Connection Status Log / Graph placeholder */}
      <ClayCard className="p-6">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Historical Trend (Session)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-2">Heart Rate (bpm)</h4>
            <div className="h-48">
              {history.length > 0 ? (
                <VitalsChart data={history} dataKey="heart_rate" color="var(--heart)" />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 border border-gray-100 rounded-xl text-sm text-[var(--text-muted)]">
                  Waiting for data...
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-2">SpO2 (%)</h4>
            <div className="h-48">
              {history.length > 0 ? (
                <VitalsChart data={history} dataKey="spo2" color="var(--info)" />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 border border-gray-100 rounded-xl text-sm text-[var(--text-muted)]">
                  Waiting for data...
                </div>
              )}
            </div>
          </div>
        </div>
      </ClayCard>
    </div>
  );
}
