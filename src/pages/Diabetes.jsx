import React from 'react';
import { Activity } from 'lucide-react';
import QuestionnaireWizard from '../components/questionnaire/QuestionnaireWizard';
import { diabetesQuestions } from '../data/questions/diabetesQuestions';

export default function Diabetes() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8 px-4 sm:px-0">
        <div className="p-4 bg-orange-500/20 rounded-2xl text-orange-400">
          <Activity size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Diabetes Risk Assessment</h1>
          <p className="text-slate-400">Metabolic health predictive model</p>
        </div>
      </div>
      
      <QuestionnaireWizard 
        disease="diabetes" 
        questionDefinitions={diabetesQuestions} 
      />
    </div>
  );
}
