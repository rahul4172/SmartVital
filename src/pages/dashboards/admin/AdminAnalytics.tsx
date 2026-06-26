import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { BarChart2, Loader2 } from 'lucide-react';
import { api } from '../../../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics/platform').then(res => setData(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <BarChart2 className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Platform Analytics</h1>
      </div>
      
      <ClayCard className="p-8">
        <h2 className="text-xl font-bold mb-6">User Registration Growth</h2>
        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={32} /></div>
        ) : data.length === 0 ? (
           <p className="text-gray-500 text-center py-10">Not enough data to display.</p>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="new_users" name="New Users" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </ClayCard>
    </div>
  );
}
