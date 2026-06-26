import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';

export function Simulator() {
  const [profile, setProfile] = useState<any>(null);
  
  // Baselines
  const [baselineRisk, setBaselineRisk] = useState<any>(null);
  
  // Simulator State
  const [simWeight, setSimWeight] = useState<number>(0);
  const [simSleep, setSimSleep] = useState<number>(0);
  const [simSmoke, setSimSmoke] = useState<number>(1); // 1 = Smoker, 0 = Non-smoker
  
  const [simResult, setSimResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initSimulator = async () => {
      try {
        const res = await api.get('/patient/profile');
        const p = res.data;
        setProfile(p);
        
        // Init simulator values
        setSimWeight(p.weight_kg || 70);
        setSimSleep(p.sleep_hours || 7);
        setSimSmoke(p.smoking_status !== 'never' ? 1 : 0);
        
        // Calculate initial Baseline Risk (Heart Disease as example)
        await runSimulation(p, p.weight_kg || 70, p.sleep_hours || 7, p.smoking_status !== 'never' ? 1 : 0, true);
        
      } catch (e) {
        console.error('Failed to init simulator', e);
      }
    };
    initSimulator();
  }, []);

  const runSimulation = async (prof: any, weight: number, sleep: number, smoke: number, isBaseline = false) => {
    setIsLoading(true);
    
    // Recalculate BMI based on simulated weight
    const hMeters = prof.height_cm ? prof.height_cm / 100 : 1.7;
    const calcBmi = parseFloat((weight / (hMeters * hMeters)).toFixed(2));
    
    // Construct payload for Heart Disease prediction
    // Map lifestyle factors to HeartRequest schema proxies
    const baseBP = prof.vitals?.blood_pressure_sys || 120;
    const baseChol = prof.vitals?.cholesterol || 200;
    
    // Higher BMI increases BP
    const bmiDiff = calcBmi - 24; 
    const bpModifier = bmiDiff > 0 ? bmiDiff * 1.5 : 0;
    
    // Smoking increases Cholesterol and Oldpeak
    const cholModifier = smoke === 1 ? 40 : 0;
    
    // Poor sleep increases Fasting Blood Sugar probability
    const sleepDiff = 7 - sleep;
    const fbsModifier = sleepDiff > 2 ? 1 : 0;

    const payload = {
      Age: prof.age || 50,
      Sex: prof.gender === 'Female' ? 'F' : 'M',
      ChestPainType: "ASY", // Default asymptomatic
      RestingBP: Math.round(baseBP + bpModifier),
      Cholesterol: Math.round(baseChol + cholModifier),
      FastingBS: (prof.vitals?.blood_sugar > 120 || fbsModifier) ? 1 : 0,
      RestingECG: "Normal",
      MaxHR: 150, // Default avg max HR
      ExerciseAngina: "N",
      Oldpeak: smoke === 1 ? 1.2 : 0.0, // Smokers have higher stress indicators
      ST_Slope: "Flat"
    };

    try {
      const res = await api.post('/predict/heart', payload);
      console.log('API RESPONSE:', res.data);
      if (isBaseline) {
        setBaselineRisk(res.data);
      } else {
        setSimResult(res.data);
      }
    } catch (error) {
      console.error('API ERROR:', error);
      if (!isBaseline) toast.error('Simulation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulate = () => {
    if (!profile) return;
    runSimulation(profile, simWeight, simSleep, simSmoke, false);
  };

  const getDelta = () => {
    if (!baselineRisk || !simResult) return null;
    const diff = (simResult.risk_score - baselineRisk.risk_score) * 100;
    return diff;
  };

  const delta = getDelta();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">What-If Simulator</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Adjust lifestyle parameters to see how they impact your Heart Disease risk over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls */}
        <ClayCard className="p-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Lifestyle Variables</h2>
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-[var(--text-secondary)]">Target Weight (kg)</label>
                <span className="font-bold text-[var(--primary)]">{simWeight} kg</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="150" 
                value={simWeight} 
                onChange={e => setSimWeight(Number(e.target.value))} 
                className="w-full accent-[var(--primary)] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-[var(--text-muted)] mt-2 text-right">
                Resulting BMI: {profile?.height_cm ? (simWeight / Math.pow(profile.height_cm/100, 2)).toFixed(1) : '--'}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-[var(--text-secondary)]">Sleep per Night</label>
                <span className="font-bold text-[var(--primary)]">{simSleep} hours</span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="12" 
                step="0.5"
                value={simSleep} 
                onChange={e => setSimSleep(Number(e.target.value))} 
                className="w-full accent-[var(--primary)] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--text-secondary)] block mb-3">Smoking Status</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setSimSmoke(0)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${simSmoke === 0 ? 'bg-[var(--success)] text-white shadow-md' : 'bg-gray-50 text-[var(--text-secondary)]'}`}
                >
                  Non-Smoker
                </button>
                <button 
                  onClick={() => setSimSmoke(1)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${simSmoke === 1 ? 'bg-[var(--danger)] text-white shadow-md' : 'bg-gray-50 text-[var(--text-secondary)]'}`}
                >
                  Smoker
                </button>
              </div>
            </div>
            
            <div className="pt-4">
              <ClayButton onClick={handleSimulate} fullWidth disabled={isLoading}>
                {isLoading ? 'Simulating...' : 'Run Simulation'}
              </ClayButton>
            </div>
          </div>
        </ClayCard>

        {/* Results */}
        <div className="space-y-6">
          
          <ClayCard className="p-6 bg-gray-50 border-0 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Baseline Risk</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-[var(--text-primary)]">
                  {baselineRisk ? (baselineRisk.risk_score * 100).toFixed(1) : '--'}%
                </h3>
              </div>
            </div>
            {baselineRisk && (
              <RiskBadge score={baselineRisk.risk_score * 100} size="sm" />
            )}
          </ClayCard>

          <ClayCard className={`p-8 border-t-4 transition-all duration-500 ${
            !simResult ? 'border-gray-200' :
            delta !== null && delta < 0 ? 'border-[var(--success)]' :
            delta !== null && delta > 0 ? 'border-[var(--danger)]' : 'border-[var(--warning)]'
          }`}>
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-8">Simulated Risk</h3>
            
            {!simResult ? (
              <div className="py-10 text-center text-[var(--text-muted)]">
                Adjust sliders and click "Run Simulation" to see projected outcomes.
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-5xl font-bold text-[var(--text-primary)] mb-2">
                      {(simResult.risk_score * 100).toFixed(1)}<span className="text-2xl text-[var(--text-muted)]">%</span>
                    </div>
                    <RiskBadge score={simResult.risk_score * 100} size="md" />
                  </div>
                  
                  {delta !== null && (
                    <div className={`flex items-center gap-1 px-4 py-2 rounded-full font-bold text-lg ${
                      delta < -0.1 ? 'bg-[var(--success-soft)] text-[var(--success)]' :
                      delta > 0.1 ? 'bg-[var(--danger-soft)] text-[var(--danger)]' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {delta < -0.1 ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                      ) : delta > 0.1 ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                      ) : (
                        <span>=</span>
                      )}
                      {Math.abs(delta).toFixed(1)}%
                    </div>
                  )}
                </div>

                <div className="bg-[var(--bg-primary)] p-4 rounded-xl">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    AI Insight
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {delta !== null && delta < -2 
                      ? 'Excellent improvement. Maintaining this lifestyle will significantly lower your cardiovascular risk over the next 5 years.' 
                      : delta !== null && delta > 2
                        ? 'This lifestyle trajectory increases your risk profile. Consider maintaining your baseline or adopting healthier habits.'
                        : 'These changes have a marginal impact on your overall risk profile. Focus on compounding small daily habits.'}
                  </p>
                </div>

              </motion.div>
            )}
          </ClayCard>

        </div>
      </div>
    </div>
  );
}
