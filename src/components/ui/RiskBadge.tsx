import React from 'react';
import { cn } from './ClayCard';

interface RiskBadgeProps {
  score: number; // 0-100
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ score, className, size = 'md' }: RiskBadgeProps) {
  let riskLevel = '';
  let riskColor = '';

  if (score <= 30) {
    riskLevel = 'Low Risk';
    riskColor = 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]';
  } else if (score <= 60) {
    riskLevel = 'Moderate Risk';
    riskColor = 'bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning)]';
  } else if (score <= 80) {
    riskLevel = 'High Risk';
    riskColor = 'bg-[#FFF2EB] text-[#FF6B35] border-[#FF6B35]'; // Orange equivalent
  } else {
    riskLevel = 'Critical Risk';
    riskColor = 'bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]';
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span className={cn(
      "inline-flex items-center justify-center rounded-full font-semibold border bg-opacity-30",
      sizes[size],
      riskColor,
      className
    )}>
      {riskLevel}
    </span>
  );
}
