import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { Bot, Stethoscope } from 'lucide-react';

interface SymptomLog {
  _id: string;
  symptoms: string[];
  severity: number;
  duration_days: number;
  notes?: string;
  inferred_risk_areas: string[];
  created_at: string;
}

const COMMON_SYMPTOMS = [
  'Chest pain', 'Palpitations', 'Shortness of breath', 'Cough', 'Wheezing',
  'Fatigue', 'Fever', 'Headache', 'Dizziness', 'Nausea', 'Vomiting', 
  'Polyuria', 'Polydipsia', 'Unexplained weight loss', 'Swelling'
];

export function SymptomChecker() {
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mode, setMode] = useState<'structured' | 'conversational'>('structured');
  const [chatInput, setChatInput] = useState('');

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { severity: 5, duration_days: 1, notes: '' }
  });

  const severityVal = watch('severity');

  const fetchLogs = async () => {
    try {
      const res = await api.get('/patient/symptoms');
      setLogs(res.data);
    } catch (e) {
      console.error('Failed to load symptom logs', e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const onSubmit = async (data: any) => {
    if (selectedSymptoms.length === 0 && mode === 'structured') {
      toast.error('Please select at least one symptom');
      return;
    }
    
    let symptomsToSubmit = selectedSymptoms;
    if (mode === 'conversational') {
      if (!chatInput.trim()) return;
      // Mock NLP parsing of conversational input
      symptomsToSubmit = ['Custom Symptom (Parsed from chat)'];
    }

    setIsLoading(true);
    try {
      const payload = {
        symptoms: symptomsToSubmit,
        severity: Number(data.severity),
        duration_days: Number(data.duration_days),
        notes: mode === 'conversational' ? chatInput : data.notes
      };
      
      const res = await api.post('/patient/symptoms', payload);
      
      if (res.data.inferred_risk_areas?.length > 0) {
        toast('AI identified potential risk areas: ' + res.data.inferred_risk_areas.join(', '), { icon: <Bot size={16} className="text-blue-500" /> });
      } else {
        toast.success('Symptoms logged successfully');
      }
      
      setSelectedSymptoms([]);
      setChatInput('');
      reset();
      fetchLogs();
    } catch (e) {
      toast.error('Failed to log symptoms');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">AI Symptom Checker</h1>
        <p className="text-[var(--text-secondary)] mt-1">Log how you feel to get AI-mapped risk areas and monitor flare-ups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Logger */}
        <ClayCard className="p-8">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
              className={`flex-1 py-2 font-bold text-sm rounded-lg transition-colors ${mode === 'structured' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500'}`}
              onClick={() => setMode('structured')}
            >
              Structured Mode
            </button>
            <button 
              className={`flex-1 py-2 font-bold text-sm rounded-lg transition-colors ${mode === 'conversational' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500'}`}
              onClick={() => setMode('conversational')}
            >
              Conversational Mode
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {mode === 'structured' ? (
              <div className="space-y-4">
                <label className="text-sm font-bold text-[var(--text-secondary)]">Select Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS.map(symp => (
                    <button
                      key={symp}
                      type="button"
                      onClick={() => toggleSymptom(symp)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                        selectedSymptoms.includes(symp) 
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md' 
                        : 'bg-white text-[var(--text-secondary)] border-gray-200 hover:border-[var(--primary-soft)]'
                      }`}
                    >
                      {symp}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="text-sm font-bold text-[var(--text-secondary)]">Describe how you feel</label>
                <textarea 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="E.g., I've been having a sharp pain in my chest since yesterday morning when I woke up, and I feel slightly dizzy."
                  className="w-full bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4 py-3 min-h-[120px]"
                />
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-[var(--text-secondary)]">Severity (1-10)</label>
                <span className="font-bold text-[var(--primary)]">{severityVal} / 10</span>
              </div>
              <input 
                type="range" min="1" max="10" 
                {...register('severity')} 
                className="w-full accent-[var(--primary)] h-2 bg-gray-200 rounded-lg appearance-none" 
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[var(--text-secondary)] mb-2 block">Duration (Days)</label>
              <input 
                type="number" min="1" 
                {...register('duration_days')} 
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4" 
              />
            </div>

            {mode === 'structured' && (
              <div>
                <label className="text-sm font-bold text-[var(--text-secondary)] mb-2 block">Additional Notes</label>
                <input 
                  type="text" 
                  {...register('notes')} 
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4" 
                />
              </div>
            )}

            <ClayButton type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Log Symptoms'}
            </ClayButton>
          </form>
        </ClayCard>

        {/* History */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Symptom History</h2>
          
          {logs.length === 0 ? (
            <ClayCard className="p-8 text-center bg-gray-50 border-dashed border-2 border-gray-200 h-[300px] flex flex-col items-center justify-center">
              <div className="flex justify-center mb-4 text-gray-300">
                <Stethoscope size={48} />
              </div>
              <h3 className="font-bold text-[var(--text-primary)]">No Symptoms Logged</h3>
              <p className="text-[var(--text-secondary)] mt-1 text-sm">Start logging your symptoms to build a historical profile for your doctor.</p>
            </ClayCard>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto hide-scrollbar pr-2">
              <AnimatePresence>
                {logs.map(log => (
                  <motion.div key={log._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <ClayCard className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                        <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                          log.severity > 7 ? 'bg-[var(--danger-soft)] text-[var(--danger)]' :
                          log.severity > 4 ? 'bg-[var(--warning-soft)] text-[var(--warning)]' :
                          'bg-[var(--success-soft)] text-[var(--success)]'
                        }`}>
                          Severity: {log.severity}/10
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {log.symptoms.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                            {s}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        Duration: {log.duration_days} day(s)
                      </p>

                      {log.notes && (
                        <div className="p-3 bg-gray-50 rounded-lg text-sm italic text-gray-600 mb-3 border border-gray-100">
                          "{log.notes}"
                        </div>
                      )}

                      {log.inferred_risk_areas && log.inferred_risk_areas.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs font-bold text-[var(--primary)] flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            AI Risk Mapping: {log.inferred_risk_areas.join(', ')}
                          </p>
                        </div>
                      )}
                    </ClayCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
