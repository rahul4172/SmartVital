import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { Activity, Loader2, HardDrive, Cpu, Clock, Server } from 'lucide-react';
import { api } from '../../../api/axios';

export function AdminSystemHealth() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Poll every 5 seconds for live data
    const fetchHealth = () => {
      api.get('/admin/system/health').then(res => setHealth(res.data)).finally(() => setLoading(false));
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  if (loading && !health) {
    return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={32} /> Loading live server metrics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-500" size={28} />
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">System Health</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-xs">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ClayCard className="p-6 border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500">CPU Usage</h3>
            <Cpu className="text-blue-500" />
          </div>
          <p className="text-4xl font-bold text-gray-800">{health.cpu_usage}%</p>
        </ClayCard>
        
        <ClayCard className="p-6 border-t-4 border-t-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500">Memory (RAM)</h3>
            <Server className="text-purple-500" />
          </div>
          <p className="text-4xl font-bold text-gray-800">{health.memory_percent}%</p>
          <p className="text-sm text-gray-500 mt-2">{health.memory_used_gb} GB / {health.memory_total_gb} GB</p>
        </ClayCard>

        <ClayCard className="p-6 border-t-4 border-t-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500">Disk Space</h3>
            <HardDrive className="text-yellow-500" />
          </div>
          <p className="text-4xl font-bold text-gray-800">{health.disk_percent}%</p>
          <p className="text-sm text-gray-500 mt-2">{health.disk_used_gb} GB / {health.disk_total_gb} GB</p>
        </ClayCard>

        <ClayCard className="p-6 border-t-4 border-t-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-500">Uptime</h3>
            <Clock className="text-green-500" />
          </div>
          <p className="text-4xl font-bold text-gray-800">{formatUptime(health.process_uptime_seconds)}</p>
        </ClayCard>
      </div>
    </div>
  );
}
