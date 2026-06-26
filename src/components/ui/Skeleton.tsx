import React from 'react';
import { cn } from './GlassCard';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/50 dark:bg-slate-800/50",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card p-5 h-full space-y-4", className)}>
      <Skeleton className="w-full h-32 rounded-full mx-auto" style={{ maxWidth: '120px' }} />
      <Skeleton className="h-4 w-3/4 mx-auto" />
      <Skeleton className="h-3 w-1/2 mx-auto" />
    </div>
  );
}

export function SkeletonText({ width = 'w-full', lines = 1 }: { width?: string, lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 && lines > 1 ? "w-2/3" : width)} />
      ))}
    </div>
  );
}

export function SkeletonGauge({ size = 120 }: { size?: number }) {
  return <Skeleton className="rounded-full shrink-0" style={{ width: size, height: size }} />;
}

export function SkeletonChart({ height = 200 }: { height?: number }) {
  return <Skeleton className="w-full rounded-xl" style={{ height }} />;
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton className="rounded-full shrink-0" style={{ width: size, height: size }} />;
}
