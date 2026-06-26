import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayCard } from './ClayCard';
import { ClayButton } from './ClayButton';

interface StepperFormProps {
  steps: string[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export function StepperForm({ 
  steps, 
  currentStep, 
  onNext, 
  onBack, 
  onSubmit, 
  isSubmitting = false,
  children 
}: StepperFormProps) {
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div 
              key={step} 
              className={`flex flex-col items-center flex-1 ${index !== steps.length - 1 ? 'relative' : ''}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-colors duration-300 ${
                  index <= currentStep 
                    ? 'bg-[var(--primary)] text-white shadow-[0_0_15px_var(--primary-glow)]' 
                    : 'bg-white text-[var(--text-muted)] border-2 border-gray-200'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className={`text-xs mt-2 font-medium hidden sm:block ${
                index <= currentStep ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
              }`}>
                {step}
              </span>
              
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-[2px] bg-gray-200 -z-10">
                  <div 
                    className="h-full bg-[var(--primary)] transition-all duration-500 ease-in-out"
                    style={{ width: index < currentStep ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <ClayCard className="p-6 md:p-10 min-h-[400px] flex flex-col relative overflow-hidden">
        
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
          <ClayButton 
            type="button"
            variant="secondary" 
            onClick={onBack}
            disabled={currentStep === 0 || isSubmitting}
            className={currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}
          >
            Back
          </ClayButton>
          
          {isLastStep ? (
            <ClayButton 
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Setup'}
            </ClayButton>
          ) : (
            <ClayButton 
              type="button"
              onClick={onNext}
            >
              Next Step
            </ClayButton>
          )}
        </div>
      </ClayCard>
      
    </div>
  );
}
