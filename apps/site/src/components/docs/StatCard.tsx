import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** Compact metric card: label · large tabular value · optional hint/icon. */
export function StatCard({ label, value, hint, icon, className }: StatCardProps) {
  return (
    <div className={cn('flex items-start gap-4 rounded-lg border border-border-default bg-bg-surface p-5 shadow-level-1', className)}>
      {icon && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 [&_svg]:size-5">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-fg-muted">{label}</p>
        <p className="mt-1 text-numeric-md text-fg-primary tnum">{value}</p>
        {hint && <p className="mt-1 text-xs text-fg-muted">{hint}</p>}
      </div>
    </div>
  );
}
