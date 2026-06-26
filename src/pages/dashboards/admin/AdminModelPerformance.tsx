import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { Cpu, Loader2 } from 'lucide-react';
import { api } from '../../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminModelPerformance() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics/models').then(res => setData(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Cpu className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">AI Model Performance</h1>
      </div>
      
      <ClayCard className="p-8">
        <h2 className="text-xl font-bold mb-6">Average Confidence per Model</h2>
        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={32} /></div>
        ) : data.length === 0 ? (
           <p className="text-gray-500 text-center py-10">No predictions have been run yet. Models will populate here once active.</p>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="model_type" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="avg_confidence" name="Average Confidence" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ClayCard>
    </div>
  );
}
