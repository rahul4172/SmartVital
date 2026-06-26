import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';
import Wizard from '../components/Wizard';
import { api } from '../api/client';

const yesNoOptions = [{ label: 'No', value: 1 }, { label: 'Yes', value: 2 }, { label: 'Not Sure', value: 1 }];

const lungCancerQuestions = [
  { id: 'AGE', type: 'slider', title: 'What is your age?', subtitle: 'Please select your current age in years.', min: 1, max: 100, defaultValue: 60 },
  { id: 'GENDER', type: 'options', title: 'What is your biological sex?', subtitle: 'Required for physiological baseline.', options: [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }], defaultValue: 'M' },
  { id: 'SMOKING', type: 'options', title: 'Do you smoke?', subtitle: 'Current or past history of smoking.', options: yesNoOptions, defaultValue: 1 },
  { id: 'YELLOW_FINGERS', type: 'options', title: 'Do you have yellow fingers?', subtitle: 'Often a sign of heavy smoking or respiratory issues.', options: yesNoOptions, defaultValue: 1 },
  { id: 'ANXIETY', type: 'options', title: 'Do you experience anxiety?', subtitle: 'Persistent feelings of anxiety.', options: yesNoOptions, defaultValue: 1 },
  { id: 'PEER_PRESSURE', type: 'options', title: 'Are you subject to peer pressure?', subtitle: 'Usually relating to smoking or lifestyle habits.', options: yesNoOptions, defaultValue: 1 },
  { id: 'CHRONIC_DISEASE', type: 'options', title: 'Do you have a chronic disease?', subtitle: 'Any ongoing, long-term medical conditions.', options: yesNoOptions, defaultValue: 1 },
  { id: 'FATIGUE', type: 'options', title: 'Do you experience chronic fatigue?', subtitle: 'Constant feeling of tiredness or weakness.', options: yesNoOptions, defaultValue: 1 },
  { id: 'ALLERGY', type: 'options', title: 'Do you have allergies?', subtitle: 'Environmental or other severe allergies.', options: yesNoOptions, defaultValue: 1 },
  { id: 'WHEEZING', type: 'options', title: 'Do you experience wheezing?', subtitle: 'A high-pitched whistling sound while breathing.', options: yesNoOptions, defaultValue: 1 },
  { id: 'ALCOHOL_CONSUMING', type: 'options', title: 'Do you consume alcohol?', subtitle: 'Regular alcohol consumption.', options: yesNoOptions, defaultValue: 1 },
  { id: 'COUGHING', type: 'options', title: 'Do you have a persistent cough?', subtitle: 'A cough that lasts for weeks without going away.', options: yesNoOptions, defaultValue: 1 },
  { id: 'SHORTNESS_OF_BREATH', type: 'options', title: 'Do you experience shortness of breath?', subtitle: 'Difficulty catching your breath during normal activities.', options: yesNoOptions, defaultValue: 1 },
  { id: 'SWALLOWING_DIFFICULTY', type: 'options', title: 'Do you have difficulty swallowing?', subtitle: 'Dysphagia or pain while swallowing.', options: yesNoOptions, defaultValue: 1 },
  { id: 'CHEST_PAIN', type: 'options', title: 'Do you experience chest pain?', subtitle: 'Pain or discomfort in the chest region.', options: yesNoOptions, defaultValue: 1 }
];

export default function LungCancer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleComplete = async (answers) => {
    setLoading(true);
    try {
      const res = await api.predictLung(answers);
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
        <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
          <Wind size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Lung Cancer Risk Assessment</h1>
          <p className="text-slate-400">Respiratory symptom and lifestyle AI analysis</p>
        </div>
      </div>

      {!result ? (
        <Wizard questions={lungCancerQuestions} onComplete={handleComplete} loading={loading} />
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
