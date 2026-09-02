import * as React from 'react';

import { cn } from '@/lib/utils';
import { latencyBars, latencyFillClass } from '@/lib/latency';

export interface SignalBarsProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  latencyMs: number;
}

const barHeights = ['h-[5px]', 'h-[8px]', 'h-[11px]', 'h-[14px]'];

/** Four signal bars coloured by latency: <80 4 green · <120 3 green · <180 2 amber · else 1 red. */
function SignalBars({ latencyMs, className, ...props }: SignalBarsProps) {
  const { bars, tone } = latencyBars(latencyMs);
  const label = tone === 'idle' ? '延迟未知' : `延迟 ${Math.round(latencyMs)} ms`;

  return (
    <span
      role="img"
      aria-label={label}
      data-slot="signal-bars"
      data-tone={tone}
      data-bars={bars}
      className={cn('inline-flex h-3.5 shrink-0 items-end gap-[2px]', className)}
      {...props}
    >
      {barHeights.map((height, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            'w-[3px] rounded-[1.5px] transition-colors duration-(--duration-base)',
            height,
            index < bars ? latencyFillClass[tone] : latencyFillClass.idle,
          )}
        />
      ))}
    </span>
  );
}

export { SignalBars };
