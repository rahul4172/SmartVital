import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { Database, Loader2 } from 'lucide-react';
import { api } from '../../../api/axios';

export function AdminResearchers() {
  const [researchers, setResearchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users/researchers').then(res => setResearchers(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Database className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Researchers Management</h1>
      </div>
      <ClayCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Institution</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? <tr><td colSpan={5} className="py-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr> : 
             researchers.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-gray-500">No researchers found.</td></tr> :
             researchers.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{r.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{r.email}</td>
                <td className="px-6 py-4 text-sm">{r.full_name}</td>
                <td className="px-6 py-4 text-sm">{r.institution}</td>
                <td className="px-6 py-4 text-sm">{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ClayCard>
    </div>
  );
}
