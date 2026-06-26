import React from 'react';
import { cn } from './ClayCard';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ClayButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const ClayButton = React.forwardRef<HTMLButtonElement, ClayButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-md)]";
    
    const variants = {
      primary: "bg-[var(--primary)] text-white hover:bg-[#3B6AE3] shadow-md shadow-[var(--primary-soft)]",
      secondary: "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-gray-200 hover:bg-gray-50 shadow-sm",
      danger: "bg-[var(--danger)] text-white hover:bg-[#E03F58] shadow-md shadow-[var(--danger-soft)]",
      success: "bg-[var(--success)] text-white hover:bg-[#2CB079] shadow-md shadow-[var(--success-soft)]",
      outline: "bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-soft)]"
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

ClayButton.displayName = "ClayButton";
