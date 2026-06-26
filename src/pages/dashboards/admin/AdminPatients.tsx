import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { User, Loader2 } from 'lucide-react';
import { api } from '../../../api/axios';

export function AdminPatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users/patients').then(res => setPatients(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <User className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Patients Management</h1>
      </div>
      <ClayCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Age / Gender</th>
              <th className="px-6 py-4">Blood Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? <tr><td colSpan={5} className="py-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr> : 
             patients.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-gray-500">No patients found.</td></tr> :
             patients.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{p.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{p.email}</td>
                <td className="px-6 py-4 text-sm">{p.full_name}</td>
                <td className="px-6 py-4 text-sm">{p.age} / {p.gender}</td>
                <td className="px-6 py-4 text-sm text-red-500 font-bold">{p.blood_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ClayCard>
    </div>
  );
}
