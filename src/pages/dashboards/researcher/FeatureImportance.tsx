import React, { useState } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Brain, Filter } from 'lucide-react';

const featureData = {
  heart: [
    { feature: 'Chest Pain Type', importance: 0.25 },
    { feature: 'Max Heart Rate', importance: 0.18 },
    { feature: 'Cholesterol', importance: 0.15 },
    { feature: 'Age', importance: 0.12 },
    { feature: 'Resting BP', importance: 0.10 },
    { feature: 'Fasting Blood Sugar', importance: 0.08 },
    { feature: 'Exercise Angina', importance: 0.07 },
    { feature: 'Resting ECG', importance: 0.05 },
  ],
  diabetes: [
    { feature: 'Glucose Level', importance: 0.35 },
    { feature: 'BMI', importance: 0.20 },
    { feature: 'Age', importance: 0.15 },
    { feature: 'Diabetes Pedigree', importance: 0.12 },
    { feature: 'Blood Pressure', importance: 0.08 },
    { feature: 'Insulin Level', importance: 0.06 },
    { feature: 'Skin Thickness', importance: 0.04 },
  ]
};

export function FeatureImportance() {
  const [selectedModel, setSelectedModel] = useState<'heart' | 'diabetes'>('heart');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Global Feature Importance</h1>
          <p className="text-[var(--text-secondary)] mt-1">Understand which clinical features drive the AI models across the entire dataset (SHAP values).</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <button 
            onClick={() => setSelectedModel('heart')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${selectedModel === 'heart' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Heart Disease Model
          </button>
          <button 
            onClick={() => setSelectedModel('diabetes')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${selectedModel === 'diabetes' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Diabetes Model
          </button>
        </div>
      </div>

      <ClayCard className="p-8">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <Brain className={selectedModel === 'heart' ? "text-red-500" : "text-blue-500"} />
          Mean Absolute SHAP Values
        </h2>
        
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureData[selectedModel]} layout="vertical" margin={{ top: 20, right: 30, left: 140, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="feature" type="category" stroke="#64748b" width={130} tick={{ fontSize: 13, fontWeight: 500 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number) => [value.toFixed(3), 'Relative Importance']}
              />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]} barSize={32}>
                {featureData[selectedModel].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={selectedModel === 'heart' ? `rgba(239, 68, 68, ${1 - index * 0.1})` : `rgba(59, 130, 246, ${1 - index * 0.1})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />
            Interpretation Note
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            Features at the top have the highest average impact on model output magnitude. For example, the model relies most heavily on 
            <span className="font-bold text-[var(--primary)]"> {featureData[selectedModel][0].feature} </span> 
            when making {selectedModel} predictions for this population.
          </p>
        </div>
      </ClayCard>
    </div>
  );
}
