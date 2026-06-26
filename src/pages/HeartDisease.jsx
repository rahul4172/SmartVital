import React from 'react';
import { Heart } from 'lucide-react';
import QuestionnaireWizard from '../components/questionnaire/QuestionnaireWizard';
import { heartQuestions } from '../data/questions/heartQuestions';

export default function HeartDisease() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8 px-4 sm:px-0">
        <div className="p-4 bg-rose-500/20 rounded-2xl text-rose-400">
          <Heart size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Heart Disease Risk Assessment</h1>
          <p className="text-slate-400">Clinical cardiovascular AI analysis</p>
        </div>
      </div>
      
      <QuestionnaireWizard 
        disease="heart" 
        questionDefinitions={heartQuestions} 
      />
    </div>
  );
}
