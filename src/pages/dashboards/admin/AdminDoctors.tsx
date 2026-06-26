import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { Stethoscope, Loader2 } from 'lucide-react';
import { api } from '../../../api/axios';

export function AdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users/doctors').then(res => setDoctors(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Stethoscope className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Doctors Management</h1>
      </div>
      <ClayCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Specialization</th>
              <th className="px-6 py-4">Verified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? <tr><td colSpan={5} className="py-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr> : 
             doctors.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-gray-500">No doctors found.</td></tr> :
             doctors.map(d => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{d.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{d.email}</td>
                <td className="px-6 py-4 text-sm">{d.full_name}</td>
                <td className="px-6 py-4 text-sm">{d.specialization}</td>
                <td className="px-6 py-4 text-sm">{d.is_verified ? <span className="text-green-500 font-bold">Yes</span> : <span className="text-yellow-500 font-bold">Pending</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ClayCard>
    </div>
  );
}
