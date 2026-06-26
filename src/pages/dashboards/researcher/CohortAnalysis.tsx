import React, { useState } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { Users, Filter, ArrowRight, HeartPulse, Droplet } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const cohortData = [
  { metric: 'Avg BMI', cohortA: 26.5, cohortB: 29.2, fullMark: 40 },
  { metric: 'Heart Risk (%)', cohortA: 18, cohortB: 35, fullMark: 100 },
  { metric: 'Diabetes Risk (%)', cohortA: 12, cohortB: 42, fullMark: 100 },
  { metric: 'Avg Glucose', cohortA: 95, cohortB: 125, fullMark: 200 },
  { metric: 'Systolic BP', cohortA: 118, cohortB: 135, fullMark: 180 },
  { metric: 'Cholesterol', cohortA: 180, cohortB: 240, fullMark: 300 },
];

export function CohortAnalysis() {
  const [cohortA, setCohortA] = useState('Males, 40-50, Non-Smokers');
  const [cohortB, setCohortB] = useState('Males, 40-50, Smokers');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Cohort Analysis</h1>
        <p className="text-[var(--text-secondary)] mt-1">Compare health metrics and AI risk predictions between different demographic subsets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Control Panel */}
        <div className="md:col-span-4 space-y-6">
          <ClayCard className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-600">
              <Users size={20} />
              Cohort A (Baseline)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Age Range</label>
                <select className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
                  <option>40-50</option>
                  <option>50-60</option>
                  <option>60+</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                <select className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
                  <option>Male</option>
                  <option>Female</option>
                  <option>All</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Lifestyle Filter</label>
                <select className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
                  <option>Non-Smokers</option>
                  <option>Smokers</option>
                </select>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
              <span className="text-slate-500">Sample Size</span>
              <span className="font-bold">1,245 patients</span>
            </div>
          </ClayCard>

          <ClayCard className="p-6 border-2 border-transparent hover:border-purple-200 transition-colors">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-600">
              <Filter size={20} />
              Cohort B (Comparison)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Age Range</label>
                <select className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
                  <option>40-50</option>
                  <option>50-60</option>
                  <option>60+</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                <select className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm">
                  <option>Male</option>
                  <option>Female</option>
                  <option>All</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Lifestyle Filter</label>
                <select className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm" defaultValue="Smokers">
                  <option>Non-Smokers</option>
                  <option value="Smokers">Smokers</option>
                </select>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
              <span className="text-slate-500">Sample Size</span>
              <span className="font-bold">832 patients</span>
            </div>
          </ClayCard>
        </div>

        {/* Visualization Panel */}
        <div className="md:col-span-8 space-y-6">
          <ClayCard className="p-6 h-[500px] flex flex-col">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Multivariate Metric Comparison</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Normalized radar chart comparing average health markers.</p>
            
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={cohortData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Radar name="Cohort A" dataKey="cohortA" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                  <Radar name="Cohort B" dataKey="cohortB" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ClayCard>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><HeartPulse size={24} /></div>
                <h4 className="font-bold text-slate-800">Delta: Heart Risk</h4>
              </div>
              <div className="flex items-end gap-4">
                <div className="text-3xl font-black text-red-600">+17%</div>
                <div className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  in <span className="font-bold text-purple-600">Cohort B</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Droplet size={24} /></div>
                <h4 className="font-bold text-slate-800">Delta: Diabetes Risk</h4>
              </div>
              <div className="flex items-end gap-4">
                <div className="text-3xl font-black text-blue-600">+30%</div>
                <div className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  in <span className="font-bold text-purple-600">Cohort B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
