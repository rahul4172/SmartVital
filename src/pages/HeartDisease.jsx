import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';
import Wizard from '../components/Wizard';
import { api } from '../api/client';

const heartQuestions = [
  { id: 'AGE', type: 'slider', title: 'What is your age?', subtitle: 'Please select your current age in years.', min: 18, max: 100, defaultValue: 50 },
  { id: 'GENDER', type: 'options', title: 'What is your biological sex?', subtitle: 'Required for accurate physiological baseline calculation.', options: [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }], defaultValue: 'M' },
  { id: 'CHEST_PAIN', type: 'options', title: 'Do you experience chest pain?', subtitle: 'Select the type of chest pain you experience, if any.', options: [{ label: 'Asymptomatic (None)', value: 'ASY' }, { label: 'Non-Anginal Pain', value: 'NAP' }, { label: 'Atypical Angina', value: 'ATA' }, { label: 'Typical Angina', value: 'TA' }, { label: 'Not Sure', value: 'ASY' }], defaultValue: 'ASY' },
  { id: 'RESTING_BP', type: 'slider', title: 'What is your resting blood pressure?', subtitle: 'Systolic blood pressure in mmHg.', min: 80, max: 200, unit: 'mmHg', defaultValue: 120 },
  { id: 'CHOLESTEROL', type: 'slider', title: 'What is your cholesterol level?', subtitle: 'Serum cholesterol in mg/dl.', min: 100, max: 500, unit: 'mg/dl', defaultValue: 200 },
  { id: 'FASTING_BS', type: 'options', title: 'Is your fasting blood sugar high?', subtitle: 'Is it greater than 120 mg/dl?', options: [{ label: 'No (< 120 mg/dl)', value: '0' }, { label: 'Yes (> 120 mg/dl)', value: '1' }, { label: 'Not Sure', value: '0' }], defaultValue: '0' },
  { id: 'RESTING_ECG', type: 'options', title: 'Resting Electrocardiogram Results', subtitle: 'Select your most recent resting ECG results.', options: [{ label: 'Normal', value: 'Normal' }, { label: 'ST-T Wave Abnormality', value: 'ST' }, { label: 'Left Ventricular Hypertrophy', value: 'LVH' }, { label: 'Not Sure', value: 'Normal' }], defaultValue: 'Normal' },
  { id: 'MAX_HR', type: 'slider', title: 'Maximum Heart Rate Achieved', subtitle: 'Highest heart rate recorded during exercise.', min: 60, max: 220, unit: 'bpm', defaultValue: 150 },
  { id: 'EXERCISE_ANGINA', type: 'options', title: 'Exercise-Induced Angina', subtitle: 'Do you experience chest pain during physical exertion?', options: [{ label: 'No', value: 'N' }, { label: 'Yes', value: 'Y' }, { label: 'Not Sure', value: 'N' }], defaultValue: 'N' },
  { id: 'OLDPEAK', type: 'slider', title: 'ST Depression (Oldpeak)', subtitle: 'ST depression induced by exercise relative to rest.', min: 0, max: 10, step: 0.1, defaultValue: 0.0 },
  { id: 'ST_SLOPE', type: 'options', title: 'ST Segment Slope', subtitle: 'The slope of the peak exercise ST segment.', options: [{ label: 'Up-sloping', value: 'Up' }, { label: 'Flat', value: 'Flat' }, { label: 'Down-sloping', value: 'Down' }, { label: 'Not Sure', value: 'Flat' }], defaultValue: 'Flat' }
];

export default function HeartDisease() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleComplete = async (answers) => {
    setLoading(true);
    try {
      const payload = {
        age: answers.AGE,
        sex: answers.GENDER,
        cp: answers.CHEST_PAIN,
        trestbps: answers.RESTING_BP,
        chol: answers.CHOLESTEROL,
        fbs: answers.FASTING_BS,
        restecg: answers.RESTING_ECG,
        thalch: answers.MAX_HR,
        exang: answers.EXERCISE_ANGINA,
        oldpeak: answers.OLDPEAK,
        slope: answers.ST_SLOPE,
        ca: 0.0,
        thal: 'normal'
      };
      const res = await api.predictHeart(payload);
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
        <div className="p-4 bg-red-500/20 rounded-2xl text-red-400">
          <Heart size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Heart Disease Risk Assessment</h1>
          <p className="text-slate-400">Clinical cardiovascular AI analysis</p>
        </div>
      </div>

      {!result ? (
        <Wizard questions={heartQuestions} onComplete={handleComplete} loading={loading} />
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
