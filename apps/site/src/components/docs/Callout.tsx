import type { ReactNode } from 'react';
import { CircleCheck, CircleX, Info, TriangleAlert, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export type CalloutTone = 'info' | 'success' | 'warning' | 'error';

export interface CalloutProps {
  tone?: CalloutTone;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

const TONES: Record<CalloutTone, { icon: LucideIcon; box: string; accent: string; role?: 'alert' | 'status' }> = {
  info: { icon: Info, box: 'border-status-info-border bg-status-info-bg', accent: 'text-status-info-fg' },
  success: { icon: CircleCheck, box: 'border-status-success-border bg-status-success-bg', accent: 'text-status-success-fg', role: 'status' },
  warning: { icon: TriangleAlert, box: 'border-status-warning-border bg-status-warning-bg', accent: 'text-status-warning-fg', role: 'alert' },
  error: { icon: CircleX, box: 'border-status-error-border bg-status-error-bg', accent: 'text-status-error-fg', role: 'alert' },
};

/** Tinted note box (50 background · 200 border · 700 accent). */
export function Callout({ tone = 'info', title, children, className }: CalloutProps) {
  const { icon: Icon, box, accent, role } = TONES[tone];
  return (
    <div role={role} className={cn('my-6 flex gap-3 rounded-lg border px-4 py-3.5 text-sm leading-6', box, className)}>
      <Icon className={cn('mt-1 size-4 shrink-0', accent)} aria-hidden />
      <div className="min-w-0 flex-1 text-fg-primary [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-xs [&_code]:bg-white/70 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em] [&_p+p]:mt-2">
        {title && <p className={cn('mb-0.5 font-semibold', accent)}>{title}</p>}
        {children}
      </div>
    </div>
  );
}
