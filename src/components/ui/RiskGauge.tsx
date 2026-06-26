import React from 'react';
import { useSpring, animated } from 'react-spring';
import NumberFlow from '@number-flow/react';

interface RiskGaugeProps {
  score: number; // 0-100
  title?: string;
  size?: number;
}

export function RiskGauge({ score, title, size = 160 }: RiskGaugeProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference * 0.75; // 270 degree arc

  let color = '#22c55e'; // green-500
  if (score > 30 && score <= 60) color = '#eab308'; // yellow-500
  if (score > 60 && score <= 80) color = '#f97316'; // orange-500
  if (score > 80) color = '#ef4444'; // red-500

  // useSpring for authoritative medical feel
  const { strokeDashoffset } = useSpring({
    strokeDashoffset: arcLength - (score / 100) * arcLength,
    from: { strokeDashoffset: arcLength },
    config: { tension: 60, friction: 20 }
  });

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform"
        style={{ transform: 'rotate(135deg)' }}
      >
        {/* Background Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          className="dark:stroke-white/5"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Foreground Arc */}
        <animated.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          strokeDashoffset={strokeDashoffset}
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center" style={{ top: '45%' }}>
        <div className="text-3xl font-bold font-display" style={{ color }}>
          <NumberFlow
            value={score}
            format={{ style: 'unit', unit: 'percent', maximumFractionDigits: 0 }}
            transformTiming={{ duration: 700, easing: 'ease-out' }}
            spinTiming={{ duration: 500, easing: 'ease-out' }}
          />
        </div>
        {title && (
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mt-1">
            {title}
          </span>
        )}
      </div>
    </div>
  );
}
