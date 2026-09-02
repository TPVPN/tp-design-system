import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type PillTone = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'outline';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone;
  size?: 'sm' | 'md';
}

const TONES: Record<PillTone, string> = {
  neutral: 'bg-bg-surface-sunken text-fg-secondary',
  brand: 'bg-blue-50 text-blue-700',
  success: 'bg-status-success-bg text-status-success-fg',
  warning: 'bg-status-warning-bg text-status-warning-fg',
  error: 'bg-status-error-bg text-status-error-fg',
  outline: 'border border-border-default bg-bg-surface text-fg-secondary',
};

/** Small rounded label (radius-xs, 50-tint background + 700 text). */
export function Pill({ tone = 'neutral', size = 'md', className, ...props }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-xs font-medium whitespace-nowrap tnum',
        size === 'sm' ? 'h-5 px-1.5 text-[11px]' : 'h-6 px-2 text-xs',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
