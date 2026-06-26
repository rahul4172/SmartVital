import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export function ClayCard({ children, className, interactive = false, ...props }: ClayCardProps) {
  return (
    <div
      className={cn(
        'clay-card',
        interactive && 'cursor-pointer hover:shadow-[var(--clay-shadow-hover)] hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
