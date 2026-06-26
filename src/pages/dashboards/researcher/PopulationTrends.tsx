import React from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

const mockTrendData = [
  { year: '2019', heartRisk: 12, diabetesRisk: 8, strokeRisk: 4 },
  { year: '2020', heartRisk: 14, diabetesRisk: 9, strokeRisk: 5 },
  { year: '2021', heartRisk: 16, diabetesRisk: 11, strokeRisk: 6 },
  { year: '2022', heartRisk: 15, diabetesRisk: 14, strokeRisk: 7 },
  { year: '2023', heartRisk: 18, diabetesRisk: 16, strokeRisk: 8 },
  { year: '2024', heartRisk: 22, diabetesRisk: 19, strokeRisk: 10 },
];

const mockAgeData = [
  { ageGroup: '20-30', avgRisk: 5 },
  { ageGroup: '31-40', avgRisk: 12 },
  { ageGroup: '41-50', avgRisk: 25 },
  { ageGroup: '51-60', avgRisk: 42 },
  { ageGroup: '61-70', avgRisk: 65 },
  { ageGroup: '71-80', avgRisk: 80 },
  { ageGroup: '80+', avgRisk: 88 },
];

export function PopulationTrends() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Population Risk Trends</h1>
        <p className="text-[var(--text-secondary)] mt-1">Analyze how disease risks are evolving across the dataset over time and demographics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ClayCard className="p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <TrendingUp className="text-[var(--primary)]" />
            5-Year Disease Risk Trajectory
          </h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDiabetes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStroke" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(val) => `${val}%`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [`${value}%`, 'Population Risk']}
                />
                <Legend />
                <Area type="monotone" dataKey="heartRisk" name="Heart Disease" stroke="#ef4444" fillOpacity={1} fill="url(#colorHeart)" />
                <Area type="monotone" dataKey="diabetesRisk" name="Diabetes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDiabetes)" />
                <Area type="monotone" dataKey="strokeRisk" name="Stroke" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorStroke)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ClayCard>

        <ClayCard className="p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <Users className="text-purple-500" />
            Average Risk by Age Group
          </h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAgeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="ageGroup" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(val) => `${val}%`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [`${value}%`, 'Average Risk Score']}
                />
                <Area type="monotone" dataKey="avgRisk" name="Composite Risk" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAge)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
