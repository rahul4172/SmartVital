import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link, Network, Loader2 } from 'lucide-react';
import { api } from '../../../api/axios';

const mockCorrelations = [
  { pair: 'Diabetes & Heart Disease', correlation: 0.85 },
  { pair: 'Hypertension & Stroke', correlation: 0.78 },
  { pair: 'Obesity & Diabetes', correlation: 0.92 },
  { pair: 'Smoking & Lung Cancer', correlation: 0.88 },
  { pair: 'Physical Activity & Heart Risk', correlation: -0.65 },
  { pair: 'High HDL & Stroke Risk', correlation: -0.45 },
  { pair: 'Stress & Hypertension', correlation: 0.62 },
];

export function DiseaseCorrelations() {
  const [correlations, setCorrelations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCorrelations = async () => {
      try {
        const res = await api.get('/researcher/correlations');
        setCorrelations(res.data);
      } catch (err) {
        console.error("Failed to fetch correlations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCorrelations();
  }, []);
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Disease Correlations</h1>
        <p className="text-[var(--text-secondary)] mt-1">Analyze Pearson correlation coefficients between various clinical conditions and lifestyle factors.</p>
      </div>

      <ClayCard className="p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <Link className="text-[var(--primary)]" />
          Correlation Matrix (Top Pairs)
        </h2>
        <div className="h-[500px] w-full flex items-center justify-center">
          {loading ? (
            <div className="text-slate-500 flex flex-col items-center gap-2">
               <Loader2 className="animate-spin text-blue-500" size={32} />
               <p>Calculating live database correlations...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={correlations} layout="vertical" margin={{ top: 20, right: 30, left: 150, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[-1, 1]} stroke="#94a3b8" />
                <YAxis dataKey="pair" type="category" stroke="#64748b" width={140} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [value, 'Correlation (r)']}
                />
                <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
                  {correlations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.correlation > 0 ? '#ef4444' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <h3 className="font-bold text-red-800">Strong Positive</h3>
            <p className="text-sm text-red-600 mt-1">Conditions that frequently co-occur. E.g., Obesity & Diabetes (+0.92)</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <h3 className="font-bold text-green-800">Strong Negative</h3>
            <p className="text-sm text-green-600 mt-1">Factors that reduce risk. E.g., Physical Activity & Heart Risk (-0.65)</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 font-semibold gap-2 hover:bg-slate-100 cursor-pointer transition-colors">
            <Network size={20} />
            View Full Matrix
          </div>
        </div>
      </ClayCard>
    </div>
  );
}
