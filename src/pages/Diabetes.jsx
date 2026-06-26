import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';
import Wizard from '../components/Wizard';
import { api } from '../api/client';

const diabetesQuestions = [
  { id: 'AGE', type: 'slider', title: 'What is your age?', subtitle: 'Please select your current age in years.', min: 1, max: 100, defaultValue: 45 },
  { id: 'GENDER', type: 'options', title: 'What is your biological sex?', subtitle: 'Required for physiological baseline.', options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }], defaultValue: 'Male' },
  { id: 'HYPERTENSION', type: 'options', title: 'Do you have hypertension?', subtitle: 'Have you been diagnosed with high blood pressure?', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }], defaultValue: 0 },
  { id: 'HEART_DISEASE', type: 'options', title: 'Do you have any heart disease?', subtitle: 'Previous heart conditions or cardiovascular issues.', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }], defaultValue: 0 },
  { id: 'SMOKING_HISTORY', type: 'options', title: 'Smoking History', subtitle: 'What is your current or past smoking status?', options: [{ label: 'Never', value: 'never' }, { label: 'Former', value: 'former' }, { label: 'Current', value: 'current' }, { label: 'Not Current', value: 'not current' }, { label: 'Ever', value: 'ever' }, { label: 'Not Sure / No Info', value: 'No Info' }], defaultValue: 'never' },
  { id: 'BMI', type: 'slider', title: 'Body Mass Index (BMI)', subtitle: 'Weight in kg / (Height in m)²', min: 10, max: 60, step: 0.1, defaultValue: 25.0 },
  { id: 'HBA1C_LEVEL', type: 'slider', title: 'HbA1c Level', subtitle: 'Average blood sugar level over the past 2-3 months (%)', min: 3.0, max: 15.0, step: 0.1, unit: '%', defaultValue: 5.5 },
  { id: 'BLOOD_GLUCOSE_LEVEL', type: 'slider', title: 'Blood Glucose Level', subtitle: 'Current blood sugar level in mg/dl.', min: 50, max: 300, step: 1, unit: 'mg/dl', defaultValue: 100 }
];

export default function Diabetes() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleComplete = async (answers) => {
    setLoading(true);
    try {
      const payload = {
        gender: answers.GENDER,
        age: answers.AGE,
        hypertension: answers.HYPERTENSION,
        heart_disease: answers.HEART_DISEASE,
        smoking_history: answers.SMOKING_HISTORY,
        bmi: answers.BMI,
        HbA1c_level: answers.HBA1C_LEVEL,
        blood_glucose_level: answers.BLOOD_GLUCOSE_LEVEL
      };
      const res = await api.predictDiabetes(payload);
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error calculating risk. Please ensure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400">
          <Activity size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Diabetes Risk Assessment</h1>
          <p className="text-slate-400">Metabolic and lifestyle AI analysis</p>
        </div>
      </div>

      {!result ? (
        <Wizard questions={diabetesQuestions} onComplete={handleComplete} loading={loading} />
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className={`p-8 text-center border-b ${result.risk_score > 0.5 ? 'border-red-500/30 bg-red-500/10' : 'border-emerald-500/30 bg-emerald-500/10'}`}>
              <h2 className="text-2xl font-bold text-white mb-2">Diagnostic Result</h2>
              <div className="text-6xl font-black mb-4 tracking-tight text-white">
                {(result.risk_score * 100).toFixed(0)}%
              </div>
              <p className={`font-semibold text-lg ${result.risk_score > 0.5 ? 'text-red-400' : 'text-emerald-400'}`}>
                {result.risk_score > 0.5 ? 'High Risk Detected' : 'Low Risk Profile'}
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
                <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-4">
                  <ShieldCheck className="text-cyan-400" size={24} /> Clinical Insight
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg">{result.insight}</p>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
                <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-4">
                  <AlertCircle className="text-purple-400" size={24} /> Explainable AI (SHAP) Narrative
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg">{result.narrative}</p>
              </div>

              <div className="flex justify-center pt-6">
                <button 
                  onClick={() => setResult(null)}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-600"
                >
                  <RefreshCcw size={20} /> Start New Assessment
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
