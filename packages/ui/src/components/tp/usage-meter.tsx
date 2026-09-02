import * as React from 'react';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export interface UsageMeterProps extends React.ComponentProps<'div'> {
  usedGb: number;
  /** `null` = unlimited plan. */
  totalGb: number | null;
  label?: string;
}

function formatGb(value: number) {
  const safe = Math.max(0, value);
  return Number.isInteger(safe) ? String(safe) : safe.toFixed(1);
}

/** Data-usage progress: blue, amber from 80 %, red from 95 %. */
function UsageMeter({ usedGb, totalGb, label = '已用流量', className, ...props }: UsageMeterProps) {
  const pct = totalGb === null || totalGb <= 0 ? 0 : Math.min(100, (Math.max(0, usedGb) / totalGb) * 100);
  const tone = totalGb !== null && pct >= 95 ? 'error' : totalGb !== null && pct >= 80 ? 'warning' : 'default';
  const indicator = tone === 'error' ? 'bg-red-500' : tone === 'warning' ? 'bg-amber-500' : 'bg-blue-500';

  return (
    <div
      data-slot="usage-meter"
      data-tone={tone}
      className={cn('flex w-full flex-col gap-2', className)}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span data-slot="usage-meter-label" className="text-label-md text-fg-secondary">
          {label}
        </span>
        <span data-slot="usage-meter-value" className="flex items-baseline gap-1 tabular">
          <span
            className={cn(
              'text-numeric-sm text-fg-primary',
              tone === 'warning' && 'text-status-warning-fg',
              tone === 'error' && 'text-status-error-fg',
            )}
          >
            {formatGb(usedGb)} GB
          </span>
          <span className="text-caption text-fg-muted">
            {totalGb === null ? '/ 无限制' : `/ ${formatGb(totalGb)} GB`}
          </span>
        </span>
      </div>
      <Progress value={pct} aria-label={label} indicatorClassName={indicator} />
    </div>
  );
}

export { UsageMeter };
