import React from 'react';
import { Brain } from 'lucide-react';
import QuestionnaireWizard from '../components/questionnaire/QuestionnaireWizard';
import { strokeQuestions } from '../data/questions/strokeQuestions';

export default function Stroke() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8 px-4 sm:px-0">
        <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400">
          <Brain size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Stroke Risk Assessment</h1>
          <p className="text-slate-400">Neurological event predictive analysis</p>
        </div>
      </div>
      
      <QuestionnaireWizard 
        disease="stroke" 
        questionDefinitions={strokeQuestions} 
      />
    </div>
  );
}
