import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { List, Loader2 } from 'lucide-react';
import { api } from '../../../api/axios';

export function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/system/logs').then(res => setLogs(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <List className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Security Audit Logs</h1>
      </div>
      <ClayCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">User Email</th>
              <th className="px-6 py-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? <tr><td colSpan={4} className="py-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr> : 
             logs.length === 0 ? <tr><td colSpan={4} className="py-8 text-center text-gray-500">No audit logs recorded yet. Real user activity will populate this table.</td></tr> :
             logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-bold text-blue-600">{log.action}</td>
                <td className="px-6 py-4 text-sm">{log.user_email}</td>
                <td className="px-6 py-4 text-xs font-mono text-gray-400">{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ClayCard>
    </div>
  );
}
