import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { Smartphone, Battery, Wifi, Activity, Settings, RefreshCw, Plus, Watch } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../api/axios';
import { useSmartVitalIoT } from '../../hooks/useSmartVitalIoT';

export function MyDevices() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [vitals, setVitals] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const { vitals: liveVitals, connected, mode } = useSmartVitalIoT();
  const [iotMode, setIotMode] = useState<string>('mock');
  const [isToggling, setIsToggling] = useState(false);

  const fetchIotStatus = async () => {
    try {
      const res = await api.get('/api/iot/status');
      if (res.data && res.data.iot_mode) {
        setIotMode(res.data.iot_mode);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchVitals = async () => {
    try {
      const res = await api.get('/patient/vitals/history');
      if (res.data && res.data.length > 0) {
        setVitals(res.data[res.data.length - 1]);
      }
    } catch (err) {
      console.error('Failed to fetch vitals');
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await api.get('/patient/devices');
      setDevices(res.data);
    } catch (err) {
      console.error('Failed to fetch devices');
    }
  };

  useEffect(() => {
    fetchVitals();
    fetchDevices();
    fetchIotStatus();
  }, []);

  const toggleIotMode = async () => {
    setIsToggling(true);
    try {
      const newMode = iotMode === 'mock' ? 'real' : 'mock';
      await api.post('/api/iot/mode', { mode: newMode, scenario: 'normal' });
      setIotMode(newMode);
      toast.success(`Switched IoT to ${newMode.toUpperCase()} mode`);
    } catch (e) {
      toast.error('Failed to change mode');
    } finally {
      setIsToggling(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await fetchVitals();
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Device synced successfully! Vitals updated.');
    }, 1500);
  };

  const mainDevice = devices.length > 0 ? devices[0] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Devices</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your connected IoT wearables and health monitors.</p>
        </div>
        <Link to="/patient/devices/setup">
          <ClayButton className="flex items-center gap-2">
            <Plus size={18} /> Pair New Device
          </ClayButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Connected Device */}
        {mainDevice ? (
          <ClayCard className="lg:col-span-2 p-0 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white relative overflow-hidden">
              <div className="absolute -right-20 -top-20 opacity-10">
                <Watch size={300} />
              </div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 w-max mb-4">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Active Connection
                  </span>
                  <h2 className="text-3xl font-bold">{mainDevice.name}</h2>
                  <p className="text-gray-400 mt-1 capitalize">{mainDevice.type}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Battery size={18} className="text-green-400" /> 84%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last Charged: 2 days ago</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-10 relative z-10">
                <div>
                  <p className="text-gray-400 text-sm">Connection</p>
                  <p className="font-bold flex items-center gap-2"><Wifi size={16} className="text-blue-400" /> Wi-Fi</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="font-bold capitalize">{mainDevice.status}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Sync</p>
                  <p className="font-bold">{new Date(mainDevice.last_sync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-white p-6 grid grid-cols-2 gap-4">
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="p-4 border-2 border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors text-[var(--text-secondary)] hover:text-[var(--primary)] disabled:opacity-50"
              >
                <RefreshCw size={24} className={isSyncing ? "animate-spin text-[var(--primary)]" : ""} />
                <span className="font-bold">{isSyncing ? 'Syncing...' : 'Force Sync Data'}</span>
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}
                className="p-4 border-2 border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors text-[var(--text-secondary)] hover:text-[var(--primary)]"
              >
                <Settings size={24} />
                <span className="font-bold">Device Settings</span>
              </button>
            </div>
          </ClayCard>
        ) : (
          <ClayCard className="lg:col-span-2 p-12 flex flex-col items-center justify-center text-center">
            <Watch size={64} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600">No Devices Connected</h2>
            <p className="text-gray-400 mt-2 mb-6">You haven't paired any SmartVital devices yet.</p>
            <Link to="/patient/devices/setup">
              <ClayButton>Pair Your First Device</ClayButton>
            </Link>
          </ClayCard>
        )}

        {/* Live Metrics Feed */}
        <ClayCard className="p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <Activity className={connected ? "text-green-500" : "text-gray-400"} size={20} />
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Live Sensor Feed</h3>
            </div>
            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Simulated</span>
              <button 
                onClick={toggleIotMode}
                disabled={isToggling}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${iotMode === 'real' ? 'bg-cyan-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${iotMode === 'real' ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
              <span className="text-xs font-bold text-cyan-600 uppercase">Hardware</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
              <span className="text-gray-600 font-medium">Heart Rate</span>
              <span className="font-bold text-xl text-gray-800">{liveVitals?.heartRate || '--'} <span className="text-sm font-normal text-gray-500">bpm</span></span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
              <span className="text-gray-600 font-medium">SpO2</span>
              <span className="font-bold text-xl text-gray-800">{liveVitals?.spo2 || '--'} <span className="text-sm font-normal text-gray-500">%</span></span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
              <span className="text-gray-600 font-medium">Skin Temp</span>
              <span className="font-bold text-xl text-gray-800">{liveVitals?.temperature || '--'} <span className="text-sm font-normal text-gray-500">°C</span></span>
            </div>
            <p className="text-xs text-center text-gray-400 mt-4">
              Real-time telemetry directly from {iotMode === 'mock' ? 'Mock Simulator' : 'ESP32/Hardware'}.
            </p>
          </div>
        </ClayCard>

      </div>
    </div>
  );
}
