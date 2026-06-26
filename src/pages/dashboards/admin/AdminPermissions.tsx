import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { Shield, Loader2 } from 'lucide-react';
import { api } from '../../../api/axios';

export function AdminPermissions() {
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/security/permissions').then(res => setPermissions(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Role-Based Permissions Matrix</h1>
      </div>
      
      {loading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={32} /> Loading RBAC rules...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(permissions).map(([role, perms]) => (
            <ClayCard key={role} className="p-6">
              <h3 className="text-xl font-bold capitalize text-[var(--text-primary)] mb-4">{role} Role</h3>
              <ul className="space-y-3">
                {perms.map(p => (
                  <li key={p} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <Shield size={16} className="text-green-500" />
                    <span className="font-mono">{p}</span>
                  </li>
                ))}
              </ul>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}
