import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Wizard({ questions, onComplete, loading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const initial = {};
    questions.forEach(q => {
      initial[q.id] = q.defaultValue;
    });
    return initial;
  });

  const currentQ = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleAnswerChange = (val, autoAdvance = false) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
    if (autoAdvance) {
      setTimeout(handleNext, 300); // Small delay to show selection
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 relative">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between text-sm text-slate-400 font-medium mb-3">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/5">
          <motion.div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl min-h-[400px] flex flex-col relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 flex flex-col justify-center z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {currentQ.title}
              </h2>
              {currentQ.subtitle && (
                <p className="text-lg text-slate-400 mb-10">{currentQ.subtitle}</p>
              )}

              <div className="max-w-xl mx-auto mt-8">
                {currentQ.type === 'slider' && (
                  <div className="space-y-8">
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      {answers[currentQ.id]} <span className="text-2xl text-slate-500 font-medium">{currentQ.unit || ''}</span>
                    </div>
                    <input
                      type="range"
                      min={currentQ.min}
                      max={currentQ.max}
                      step={currentQ.step || 1}
                      value={answers[currentQ.id]}
                      onChange={(e) => handleAnswerChange(parseFloat(e.target.value))}
                      className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 outline-none"
                    />
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>{currentQ.min}</span>
                      <span>{currentQ.max}</span>
                    </div>
                  </div>
                )}

                {currentQ.type === 'options' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQ.options.map(opt => {
                      const isSelected = answers[currentQ.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleAnswerChange(opt.value, true)}
                          className={`p-6 rounded-2xl text-lg font-semibold transition-all duration-200 border-2 ${
                            isSelected 
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                              : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between z-10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={20} /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
              loading 
                ? 'bg-slate-700 cursor-wait' 
                : currentStep === questions.length - 1 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-cyan-500/25'
            }`}
          >
            {loading ? 'Analyzing...' : currentStep === questions.length - 1 ? (
              <>Complete Analysis <CheckCircle2 size={20} /></>
            ) : (
              <>Next Step <ArrowRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
