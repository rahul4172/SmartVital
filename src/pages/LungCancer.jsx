import React from 'react';
import { Wind } from 'lucide-react';
import QuestionnaireWizard from '../components/questionnaire/QuestionnaireWizard';
import { lungQuestions } from '../data/questions/lungQuestions';

export default function LungCancer() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8 px-4 sm:px-0">
        <div className="p-4 bg-sky-500/20 rounded-2xl text-sky-400">
          <Wind size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Lung Cancer Risk Assessment</h1>
          <p className="text-slate-400">Respiratory health screening</p>
        </div>
      </div>
      
      <QuestionnaireWizard 
        disease="lung" 
        questionDefinitions={lungQuestions} 
      />
    </div>
  );
}
