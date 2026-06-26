import React from 'react';
import { cn } from './ClayCard';

interface ClayInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const ClayInput = React.forwardRef<HTMLInputElement, ClayInputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-[var(--text-secondary)] text-sm font-medium ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-12 bg-white border border-gray-200 rounded-[var(--radius-md)] px-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] transition-all shadow-[inset_0px_2px_4px_rgba(0,0,0,0.02)]",
              icon && "pl-10",
              error && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger-soft)]",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[var(--danger)] text-xs font-medium ml-1 mt-0.5 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

ClayInput.displayName = "ClayInput";
