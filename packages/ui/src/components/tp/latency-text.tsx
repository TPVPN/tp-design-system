import * as React from 'react';

import { cn } from '@/lib/utils';
import { latencyTone, latencyTextClass } from '@/lib/latency';

export interface LatencyTextProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  ms: number;
  /** Text shown when latency is unknown (non-finite or ≤ 0). */
  fallback?: string;
}

/** Latency number coloured by tone, tabular, with a muted "ms" unit. Inherits font size. */
function LatencyText({ ms, fallback = '—', className, ...props }: LatencyTextProps) {
  const tone = latencyTone(ms);

  return (
    <span
      data-slot="latency-text"
      data-tone={tone}
      className={cn('inline-flex items-baseline gap-0.5 tabular font-semibold', latencyTextClass[tone], className)}
      {...props}
    >
      {tone === 'idle' ? (
        <span>{fallback}</span>
      ) : (
        <>
          <span>{Math.round(ms)}</span>
          <span className="text-[0.85em] font-normal text-fg-secondary">ms</span>
        </>
      )}
    </span>
  );
}

export { LatencyText };
