import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { RiskGauge } from '../../components/ui/RiskGauge';
import { useAuthStore } from '../../store/auth.store';
import toast from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';

import { VitalsChart } from '../../components/charts/VitalsChart';

interface SensorData {
  heart_rate: number;
  spo2: number;
  temperature: number;
  timestamp: string;
}

export function LiveMonitoring() {
  const { user } = useAuthStore();
  const [data, setData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/iot/ws';

  useEffect(() => {
    // Connect to WebSocket
    const connectWs = () => {
      try {
        const ws = new WebSocket(`${WS_URL}/${user?.id}`);
        
        ws.onopen = () => {
          setIsConnected(true);
          setConnectionError('');
          toast.success('Connected to health monitor');
        };

        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            setData(parsed);
            setHistory(prev => {
              const newHistory = [...prev, {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                heart_rate: parsed.heart_rate,
                spo2: parsed.spo2,
              }];
              // Keep last 30 data points for the graph
              return newHistory.slice(-30);
            });
          } catch (e) {
            console.error('Error parsing WS data', e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          wsRef.current = null;
        };

        ws.onerror = (error) => {
          console.error('WebSocket Error:', error);
          setConnectionError('Failed to connect to device');
          setIsConnected(false);
        };

        wsRef.current = ws;
      } catch (error) {
        setConnectionError('WebSocket initialization failed');
      }
    };

    connectWs();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user?.id, WS_URL]);

  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
    setConnectionError('');
    // Trigger useEffect re-run by unmounting/remounting or just waiting for the interval
    toast('Reconnecting...', { icon: <RefreshCw size={16} className="animate-spin text-blue-500" /> });
  };

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
          {!isConnected && (
            <button onClick={reconnect} className="ml-2 text-xs text-[var(--primary)] hover:underline">
              Reconnect
            </button>
          )}
        </div>
      </div>

      {connectionError && !isConnected && (
        <div className="bg-[var(--danger-soft)] text-[var(--danger)] p-4 rounded-xl border border-[var(--danger)] flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-bold">Connection Error</h4>
            <p className="text-sm">{connectionError}. Please ensure your ESP32 device is powered on and connected to WiFi.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Heart Rate */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <ClayCard className="p-8 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-[var(--danger-soft)] text-[var(--heart)] flex items-center justify-center text-3xl mb-6 shadow-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-secondary)] mb-4">Heart Rate</h3>
            
            <RiskGauge 
              score={data?.heart_rate || 0} 
              maxScore={200}
              label={data ? `${data.heart_rate} bpm` : '--'} 
              size={200} 
            />
            
            <div className="mt-6 w-full pt-6 border-t border-gray-100 flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Normal range</span>
              <span className="font-bold text-[var(--text-primary)]">60 - 100 bpm</span>
            </div>
          </ClayCard>
        </motion.div>

        {/* SpO2 */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <ClayCard className="p-8 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-[var(--info-soft)] text-[var(--info)] flex items-center justify-center text-3xl mb-6 shadow-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-secondary)] mb-4">Oxygen Saturation</h3>
            
            <RiskGauge 
              score={data?.spo2 || 0} 
              maxScore={100}
              label={data ? `${data.spo2}%` : '--'} 
              size={200} 
            />
            
            <div className="mt-6 w-full pt-6 border-t border-gray-100 flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Normal range</span>
              <span className="font-bold text-[var(--text-primary)]">&gt; 95%</span>
            </div>
          </ClayCard>
        </motion.div>

        {/* Temperature */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <ClayCard className="p-8 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-[var(--warning-soft)] text-[var(--warning)] flex items-center justify-center text-3xl mb-6 shadow-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-secondary)] mb-4">Body Temperature</h3>
            
            <RiskGauge 
              score={data ? ((data.temperature - 35) / (40 - 35)) * 100 : 0} 
              maxScore={100}
              label={data ? `${data.temperature.toFixed(1)}°C` : '--'} 
              size={200} 
            />
            
            <div className="mt-6 w-full pt-6 border-t border-gray-100 flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Normal range</span>
              <span className="font-bold text-[var(--text-primary)]">36.1 - 37.2°C</span>
            </div>
          </ClayCard>
        </motion.div>

      </div>

      {/* Connection Status Log / Graph placeholder */}
      <ClayCard className="p-6">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Historical Trend</h3>
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
