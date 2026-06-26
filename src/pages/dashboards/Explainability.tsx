import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayInput } from '../../components/ui/ClayInput';
import { ClayButton } from '../../components/ui/ClayButton';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { BarChart } from 'lucide-react';

export function Explainability() {
  const [modelType, setModelType] = useState<'heart' | 'stroke' | 'diabetes'>('heart');
  const [patientId, setPatientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<any>(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchExplanation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId.trim()) {
      toast.error('Please enter a valid Patient ID');
      return;
    }

    setIsLoading(true);
    setExplanation(null);
    try {
      const res = await api.get(`/predict/explainability/shap/${modelType}?patient_id=${patientId}`);
      setExplanation(res.data);
      toast.success('AI Analysis retrieved successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to fetch explanation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">AI Diagnostics & Explainability</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Deep dive into the neural network's decision-making process using SHAP (SHapley Additive exPlanations).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <ClayCard className="p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Request Analysis</h2>
            <form onSubmit={fetchExplanation} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Disease Model</label>
                <select 
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value as any)}
                  className="w-full h-12 bg-white border border-gray-200 rounded-[var(--radius-md)] px-4 shadow-sm"
                >
                  <option value="heart">Cardiovascular Risk</option>
                  <option value="stroke">Stroke Prediction</option>
                  <option value="diabetes">Diabetes Onset</option>
                </select>
              </div>

              <ClayInput 
                label="Patient ID" 
                placeholder="Enter MongoDB User ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />

              <ClayButton type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Processing SHAP values...' : 'Generate Report'}
              </ClayButton>
            </form>
          </ClayCard>

          {explanation && explanation.top_features && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ClayCard className="p-6 bg-gradient-to-br from-[var(--bg-primary)] to-white border border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Top Feature Contributions</h3>
                <div className="space-y-4">
                  {explanation.top_features.map((feat: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">{feat.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">Value: {feat.value}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${feat.impact > 0 ? 'bg-[var(--danger-soft)] text-[var(--danger)]' : 'bg-[var(--success-soft)] text-[var(--success)]'}`}>
                        {feat.impact > 0 ? '+' : ''}{feat.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </ClayCard>
            </motion.div>
          )}
        </div>

        {/* Visualizations */}
        <div className="lg:col-span-2">
          {!explanation ? (
            <ClayCard className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-cyan-500 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <BarChart size={40} />
              </div>
              <h3 className="font-bold text-xl text-[var(--text-primary)] mb-2">No Analysis Selected</h3>
              <p className="text-[var(--text-secondary)] max-w-sm">
                Enter a Patient ID and select a disease model to visualize the neural network's feature importance charts.
              </p>
            </ClayCard>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <ClayCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">Force Plot (Individual Prediction)</h2>
                </div>
                <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center min-h-[150px] p-4">
                  {/* Real implementation would load the image from the backend or render JS object. Here we simulate image load. */}
                  <img 
                    src={explanation.force_plot} 
                    alt="SHAP Force Plot" 
                    className="max-w-full h-auto"
                    onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerHTML = '<p class="text-gray-400 text-sm">Force plot image not found in assets/</p>'}}
                  />
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-4">
                  <strong>Red arrows</strong> push the risk higher, while <strong>blue arrows</strong> push the risk lower. The baseline is the average risk across the dataset.
                </p>
              </ClayCard>

              <ClayCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--info-soft)] text-[var(--info)] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">Summary Plot (Global Importance)</h2>
                </div>
                <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center min-h-[300px] p-4">
                  <img 
                    src={explanation.summary_plot} 
                    alt="SHAP Summary Plot" 
                    className="max-w-full h-auto"
                    onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerHTML = '<p class="text-gray-400 text-sm">Summary plot image not found in assets/</p>'}}
                  />
                </div>
              </ClayCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
