import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Radio, Cpu, Power, PowerOff, ShieldAlert, HeartPulse } from 'lucide-react';
import { api } from '../api/client';

const MetricCard = ({ label, value, unit, icon: Icon, colorClass, connected }) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 ${colorClass.replace('text-', 'bg-').replace('-400', '-500')}/10 rounded-bl-full -z-10`} />
    <div className="flex items-center justify-between mb-4">
      <span className="text-slate-400 font-medium">{label}</span>
      <Icon size={24} className={colorClass} />
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
      <span className="text-slate-500 font-medium">{unit}</span>
    </div>
    {connected && <div className={`absolute inset-0 border-2 rounded-2xl ${colorClass.replace('text-', 'border-')}/30 animate-pulse pointer-events-none`} />}
  </div>
);

export default function IoTManager() {
  const [ports, setPorts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [selectedPort, setSelectedPort] = useState('COM3');
  const [liveData, setLiveData] = useState({
    hr: 0, spo2: 0, temp: 0, sys: 0, dia: 0
  });
  const wsRef = useRef(null);

  useEffect(() => {
    // Attempt to scan available ports
    api.scanIoT().then(res => {
      if(res.data.ports && res.data.ports.length > 0) {
        setPorts(res.data.ports);
        setSelectedPort(res.data.ports[0]);
      } else {
        setPorts(['COM3', 'COM4', '/dev/ttyUSB0']); // Fallback simulated ports
      }
    }).catch(err => {
      console.error(err);
      setPorts(['COM3', 'COM4', '/dev/ttyUSB0']);
    });

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const handleConnect = async () => {
    try {
      await api.connectIoT(selectedPort);
      setConnected(true);
      
      // Setup WebSocket
      const wsUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace('http', 'ws') + '/api/iot/stream';
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.type === 'live_data') {
          setLiveData(data.state);
        }
      };
    } catch (err) {
      console.error(err);
      alert("Failed to connect to IoT device. Ensure backend and device are running.");
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.disconnectIoT();
      if(wsRef.current) wsRef.current.close();
      setConnected(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-cyan-500/20 rounded-2xl text-cyan-400">
            <Radio size={40} className={connected ? "animate-pulse" : ""} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">IoT Sensor Stream</h1>
            <p className="text-slate-400">Connect to clinical wearables and stream real-time vitals</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full border ${connected ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-600 text-slate-400'} flex items-center gap-2 font-medium`}>
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          {connected ? 'Device Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <Cpu className="text-slate-400" size={24} />
          <span className="text-white font-medium">Select Port:</span>
        </div>
        <select 
          value={selectedPort} 
          onChange={(e) => setSelectedPort(e.target.value)}
          disabled={connected}
          className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
        >
          {ports.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {!connected ? (
          <button 
            onClick={handleConnect}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors"
          >
            <Power size={18} /> Connect Device
          </button>
        ) : (
          <button 
            onClick={handleDisconnect}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-colors"
          >
            <PowerOff size={18} /> Disconnect
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Heart Rate" value={liveData.hr.toFixed(1)} unit="BPM" icon={HeartPulse} colorClass="text-red-400" />
        <MetricCard label="Oxygen Saturation" value={liveData.spo2.toFixed(1)} unit="% SpO2" icon={Activity} colorClass="text-cyan-400" />
        <MetricCard label="Temperature" value={liveData.temp.toFixed(1)} unit="°C" icon={Activity} colorClass="text-orange-400" />
        <MetricCard label="Blood Pressure" value={`${liveData.sys.toFixed(0)}/${liveData.dia.toFixed(0)}`} unit="mmHg" icon={Activity} colorClass="text-purple-400" />
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center min-h-[300px] flex flex-col justify-center relative overflow-hidden">
        {connected ? (
          <>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #00e5ff 0%, transparent 70%)' }} />
            <Activity size={64} className="mx-auto text-cyan-400 animate-pulse mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">Streaming Active</h3>
            <p className="text-slate-400 max-w-lg mx-auto">Sensors are actively transmitting physiological data. Values are being parsed into the ML inference queue for continuous risk evaluation.</p>
          </>
        ) : (
          <>
            <ShieldAlert size={64} className="mx-auto text-slate-600 mb-6 opacity-50" />
            <h3 className="text-xl font-medium text-slate-400 mb-2">No Active Stream</h3>
            <p className="text-slate-500 max-w-md mx-auto">Connect a clinical device or start the software simulator to begin monitoring live vitals.</p>
          </>
        )}
      </div>
    </div>
  );
}
