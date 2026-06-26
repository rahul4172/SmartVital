import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function ConversationalWizard({ title, questions, onComplete, loading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const initial = {};
    questions.forEach(q => {
      initial[q.key] = q.defaultValue;
    });
    return initial;
  });

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

  const handleAnswerChange = (val) => {
    setAnswers(prev => ({ ...prev, [questions[currentStep].key]: val }));
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQ = questions[currentStep];

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card transition-colors">
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
            <span>{title}</span>
            <span>Step {currentStep + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-dark-bg h-2 rounded-full overflow-hidden">
            <div 
              className="bg-medical-blue h-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="min-h-[200px] flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            {currentQ.question}
          </h2>

          <div className="flex justify-center w-full max-w-md mx-auto">
            {currentQ.type === 'slider' && (
              <div className="w-full space-y-4">
                <input
                  type="range"
                  min={currentQ.min}
                  max={currentQ.max}
                  step={currentQ.step || 1}
                  value={answers[currentQ.key]}
                  onChange={(e) => handleAnswerChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medical-blue"
                />
                <div className="text-center text-3xl font-bold text-medical-blue">
                  {answers[currentQ.key]} <span className="text-lg text-slate-500 font-normal">{currentQ.unit || ''}</span>
                </div>
              </div>
            )}

            {currentQ.type === 'options' && (
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {currentQ.options.map(opt => {
                  const isSelected = answers[currentQ.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswerChange(opt.value)}
                      className={clsx(
                        "px-6 py-3 rounded-xl border-2 font-medium transition-all duration-200 flex-1 min-w-[140px]",
                        isSelected 
                          ? "border-medical-blue bg-medical-blue/10 text-medical-blue dark:bg-medical-blue/20" 
                          : "border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-12 pt-6 border-t border-slate-100 dark:border-dark-border">
          <Button 
            variant="ghost" 
            onClick={handlePrev} 
            disabled={currentStep === 0 || loading}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          <Button 
            variant="primary" 
            onClick={handleNext}
            disabled={loading}
            className="px-8"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Analyzing...
              </span>
            ) : currentStep === questions.length - 1 ? (
              <span className="flex items-center">
                Complete <CheckCircle2 className="w-4 h-4 ml-2" />
              </span>
            ) : (
              <span className="flex items-center">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
