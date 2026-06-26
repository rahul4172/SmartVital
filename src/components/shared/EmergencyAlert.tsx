import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface EmergencyAlertProps {
  message: string;
  recommendation: string;
  onDismiss: () => void;
  show: boolean;
}

export function EmergencyAlert({ message, recommendation, onDismiss, show }: EmergencyAlertProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--danger-soft)] border-l-4 border-[var(--danger)] p-4 rounded-r-[var(--radius-md)] mb-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-3">
              <span className="text-2xl" role="img" aria-label="warning">⚠️</span>
              <div>
                <h4 className="text-[var(--danger)] font-bold uppercase tracking-wider text-sm">{message}</h4>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Recommended: {recommendation}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={onDismiss}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Dismiss
              </button>
              <Link 
                to="/patient/appointments"
                className="px-4 py-2 bg-[var(--danger)] text-white text-sm font-bold rounded-lg shadow-[0_4px_12px_rgba(247,79,106,0.3)] hover:translate-y-[-1px] transition-all"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
