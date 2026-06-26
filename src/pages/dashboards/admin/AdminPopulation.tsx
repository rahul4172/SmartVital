import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { TrendingUp, Loader2, Users, Activity } from 'lucide-react';
import { api } from '../../../api/axios';

export function AdminPopulation() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics/population').then(res => setData(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Population Insights</h1>
      </div>
      
      {loading || !data ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ClayCard className="p-8 text-center flex flex-col items-center justify-center">
            <Users size={48} className="text-blue-500 mb-4" />
            <h3 className="text-gray-500 font-bold mb-2">Average Patient Age</h3>
            <p className="text-5xl font-bold text-gray-800">{data.avg_age > 0 ? data.avg_age : '--'}</p>
            <p className="text-sm text-gray-400 mt-2">Years Old</p>
          </ClayCard>

          <ClayCard className="p-8 text-center flex flex-col items-center justify-center">
            <Activity size={48} className="text-green-500 mb-4" />
            <h3 className="text-gray-500 font-bold mb-2">Average Patient BMI</h3>
            <p className="text-5xl font-bold text-gray-800">{data.avg_bmi > 0 ? data.avg_bmi : '--'}</p>
            <p className="text-sm text-gray-400 mt-2">Body Mass Index</p>
          </ClayCard>
        </div>
      )}
    </div>
  );
}
