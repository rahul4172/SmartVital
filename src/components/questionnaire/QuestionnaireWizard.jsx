import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Activity, CheckCircle, Loader2 } from 'lucide-react';
import ResultCard from '../assessments/ResultCard';

const QuestionnaireWizard = ({ disease, questionDefinitions }) => {
  const [currentTier, setCurrentTier] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Initialize defaults
  useEffect(() => {
    const initial = {};
    questionDefinitions.forEach(tier => {
      tier.questions.forEach(q => {
        if (q.default !== undefined) initial[q.id] = q.default;
        else if (q.type === 'select' && q.options.length > 0) {
           initial[q.id] = typeof q.options[0] === 'string' ? q.options[0] : q.options[0].value;
        }
      });
    });
    setAnswers(initial);
  }, [questionDefinitions]);

  const currentTierData = questionDefinitions.find(t => t.tier === currentTier);
  const totalTiers = questionDefinitions.length;

  const handleInputChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const submitPrediction = async (finalTier) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/predict/questionnaire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease,
          answers,
          tier_reached: finalTier
        })
      });
      
      if (!response.ok) throw new Error('Prediction failed');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      // In production, add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentTier < totalTiers) {
      setCurrentTier(prev => prev + 1);
    } else {
      submitPrediction(currentTier);
    }
  };

  const handleBack = () => {
    if (result) {
      setResult(null); // Go back to questions
    } else if (currentTier > 1) {
      setCurrentTier(prev => prev - 1);
    }
  };

  const handleUpgrade = () => {
    setResult(null);
    setCurrentTier(prev => Math.min(prev + 1, totalTiers));
  };

  // Skip remaining tiers and get prediction early
  const handleSkipAndPredict = () => {
    submitPrediction(currentTier);
  };

  if (result) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8">
        <button 
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Questions
        </button>
        <ResultCard 
          disease={result.disease || disease} 
          result={result} 
          onReset={handleBack} 
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{disease} Assessment</h2>
            <p className="text-gray-400 text-sm mt-1">Tier {currentTier} of {totalTiers}: {currentTierData?.title}</p>
          </div>
          <div className="text-indigo-400 font-semibold">
            {Math.round(((currentTier - 1) / totalTiers) * 100)}% Complete
          </div>
        </div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${((currentTier - 1) / totalTiers) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTier}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {currentTierData?.questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  {q.label}
                </label>
                
                {q.type === 'select' ? (
                  <select
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    {q.options.map((opt, i) => {
                      const val = typeof opt === 'string' ? opt : opt.value;
                      const lbl = typeof opt === 'string' ? opt : opt.label;
                      return <option key={i} value={val}>{lbl}</option>;
                    })}
                  </select>
                ) : q.type === 'number' ? (
                  <input
                    type="number"
                    min={q.min}
                    max={q.max}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                ) : null}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentTier === 1 || isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex w-full sm:w-auto gap-3">
            {currentTier < totalTiers && (
               <button
                 onClick={handleSkipAndPredict}
                 disabled={isSubmitting}
                 className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
               >
                 Predict Now
               </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
              ) : currentTier === totalTiers ? (
                <><Activity className="w-5 h-5" /> Get Results</>
              ) : (
                <>Next Tier <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireWizard;
