import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { Activity, Droplets, Scale, Flame, CircleDot, Dna } from 'lucide-react';

const CONDITIONS = [
  { id: 'hypertension', name: 'Hypertension', icon: <Activity className="w-6 h-6 text-red-400" /> },
  { id: 'diabetes', name: 'Type II Diabetes', icon: <Droplets className="w-6 h-6 text-blue-400" /> },
  { id: 'obesity', name: 'Obesity (BMI > 30)', icon: <Scale className="w-6 h-6 text-orange-400" /> },
  { id: 'smoking', name: 'Active Smoker', icon: <Flame className="w-6 h-6 text-gray-400" /> },
  { id: 'hyperlipidemia', name: 'Hyperlipidemia', icon: <CircleDot className="w-6 h-6 text-yellow-400" /> },
  { id: 'ckd', name: 'Chronic Kidney Disease', icon: <Activity className="w-6 h-6 text-purple-400" /> }
];

export function Comorbidity() {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Auto-fill from patient profile if available
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/patient/profile');
        const p = res.data;
        const initialConds = [];
        
        if (p.chronic_diseases) {
          if (p.chronic_diseases.includes('Hypertension')) initialConds.push('hypertension');
          if (p.chronic_diseases.includes('Diabetes')) initialConds.push('diabetes');
        }
        if (p.bmi && p.bmi > 30) initialConds.push('obesity');
        if (p.smoking_status === 'current') initialConds.push('smoking');
        
        setSelectedConditions(initialConds);
      } catch (e) {
        // ignore
      }
    };
    fetchProfile();
  }, []);

  const toggleCondition = (id: string) => {
    setSelectedConditions(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const analyzeComorbidity = async () => {
    if (selectedConditions.length === 0) {
      toast.error('Please select at least one condition');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await api.post('/predict/comorbidity/analyze', { conditions: selectedConditions });
      setResult(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to analyze comorbidity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Comorbidity Engine</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Analyze the compounded risk of overlapping health conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Selector Panel */}
        <ClayCard className="p-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Select Conditions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {CONDITIONS.map(cond => (
              <div 
                key={cond.id}
                onClick={() => toggleCondition(cond.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  selectedConditions.includes(cond.id)
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
                    : 'border-transparent bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center ${selectedConditions.includes(cond.id) ? 'bg-[var(--primary)] text-white' : 'bg-gray-200'}`}>
                  {selectedConditions.includes(cond.id) && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-xl">{cond.icon}</span>
                <span className="font-bold text-[var(--text-primary)] text-sm">{cond.name}</span>
              </div>
            ))}
          </div>
          
          <ClayButton onClick={analyzeComorbidity} fullWidth disabled={isLoading}>
            {isLoading ? 'Analyzing Graph...' : 'Calculate Compounded Risk'}
          </ClayButton>
        </ClayCard>

        {/* Results Panel */}
        <div>
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ClayCard className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 min-h-[400px]">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-cyan-500 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Dna size={32} />
                  </div>
                  <h3 className="font-bold text-[var(--text-primary)]">Interaction Analysis</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2">Select multiple conditions to see how they amplify overall clinical risk.</p>
                </ClayCard>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                
                <ClayCard className="p-8 text-center bg-gradient-to-br from-white to-gray-50">
                  <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-6">Compounded Risk Score</h3>
                  
                  <div className="flex justify-center mb-6">
                    <RiskBadge risk={result.risk_level.toLowerCase()} size="lg" />
                  </div>
                  
                  <div className="text-5xl font-bold text-[var(--text-primary)] mb-2">
                    {(result.compounded_risk_score * 100).toFixed(1)}<span className="text-2xl text-[var(--text-muted)]">%</span>
                  </div>
                  <p className="text-[var(--text-secondary)]">Aggregated severity multiplier applied</p>
                </ClayCard>

                <ClayCard className="p-6">
                  <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[var(--warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Synergistic Effects
                  </h4>
                  <ul className="space-y-3">
                    {result.synergistic_effects.map((effect: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 bg-[var(--warning-soft)] p-3 rounded-lg text-sm text-[var(--text-primary)] font-medium">
                        <span className="mt-0.5">•</span>
                        {effect}
                      </li>
                    ))}
                  </ul>
                </ClayCard>

                <ClayCard className="p-6 bg-[var(--primary)] text-white border-0 shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="font-bold flex items-center gap-2 mb-4 text-white">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Clinical Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-blue-100">
                          <span className="font-bold text-white mt-0.5">{idx + 1}.</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-10 -mt-10 blur-xl"></div>
                </ClayCard>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
