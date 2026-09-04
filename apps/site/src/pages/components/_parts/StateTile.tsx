import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface StateTileProps {
  label: ReactNode;
  /** Monospace hint under the label (token, prop or class). */
  hint?: ReactNode;
  /** Marks a state that is reproduced with static classes rather than real interaction. */
  simulated?: boolean;
  children: ReactNode;
  /** Extra classes for the stage area. */
  className?: string;
}

/** Card used in variant / state grids: stage on canvas + label footer. */
export function StateTile({ label, hint, simulated = false, children, className }: StateTileProps) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1">
      <div className={cn('flex min-h-28 flex-1 items-center justify-center bg-bg-canvas p-5', className)}>{children}</div>
      <div className="flex items-start justify-between gap-2 border-t border-border-subtle px-3.5 py-2.5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-fg-primary">{label}</p>
          {hint && <p className="mt-1 break-words font-mono text-[13px] leading-5 text-fg-muted">{hint}</p>}
        </div>
        {simulated && (
          <span className="shrink-0 rounded-xs bg-bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium text-fg-secondary" title="用静态类名复现的状态">
            模拟
          </span>
        )}
      </div>
    </div>
  );
}
