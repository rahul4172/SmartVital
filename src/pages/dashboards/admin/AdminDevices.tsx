import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { Smartphone, Loader2, Wifi, Battery } from 'lucide-react';
import { api } from '../../../api/axios';

export function AdminDevices() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/devices').then(res => setDevices(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Smartphone className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">IoT Device Fleet</h1>
      </div>
      <ClayCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Device ID</th>
              <th className="px-6 py-4">Patient ID</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Battery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? <tr><td colSpan={5} className="py-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr> : 
             devices.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-gray-500">No IoT devices registered.</td></tr> :
             devices.map(d => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{d.id}</td>
                <td className="px-6 py-4 text-xs font-mono text-gray-400">{d.patient_id}</td>
                <td className="px-6 py-4 text-sm font-bold">{d.device_type}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Wifi size={14} className={d.status === 'Online' ? 'text-green-500' : 'text-gray-400'} />
                    {d.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Battery size={14} className={d.battery > 20 ? 'text-green-500' : 'text-red-500'} />
                    {d.battery}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ClayCard>
    </div>
  );
}
