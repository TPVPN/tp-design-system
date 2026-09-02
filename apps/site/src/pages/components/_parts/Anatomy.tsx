import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface AnatomyPin {
  /** 1-based number shown on the pin and in the legend. */
  n: number;
  label: string;
  /** Token / measurement note rendered under the label. */
  note?: ReactNode;
  /** Pin centre, in % of the stage box (may exceed 0–100 to sit outside the component). */
  x: number;
  y: number;
}

export interface AnatomyProps {
  pins: AnatomyPin[];
  /** The component rendered on the stage (made inert — the legend carries the information). */
  children: ReactNode;
  /** Fixed stage width in px (the component fills it). */
  width?: number;
  className?: string;
}

/** Labelled anatomy diagram: component on a canvas stage with numbered pins + a legend list. */
export function Anatomy({ pins, children, width, className }: AnatomyProps) {
  return (
    <figure className={cn('my-6 overflow-hidden rounded-xl border border-border-default bg-bg-surface shadow-level-1', className)}>
      <div className="grid md:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="flex items-center justify-center overflow-x-auto bg-bg-canvas px-8 py-14 md:px-12">
          <div className="relative shrink-0" style={{ width, maxWidth: '100%' }}>
            <div inert aria-hidden>
              {children}
            </div>
            {pins.map((pin) => (
              <span
                key={pin.n}
                aria-hidden
                className="absolute z-10 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-[11px] leading-none font-semibold text-white shadow-level-2 ring-2 ring-white tnum"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                {pin.n}
              </span>
            ))}
          </div>
        </div>
        <ol className="divide-y divide-border-subtle border-t border-border-subtle md:border-t-0 md:border-l" aria-label="组件解剖">
          {pins.map((pin) => (
            <li key={pin.n} className="flex items-start gap-3 px-4 py-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] leading-none font-semibold text-white tnum">
                {pin.n}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg-primary">{pin.label}</p>
                {pin.note && <p className="mt-0.5 text-xs leading-5 text-fg-muted [&_code]:font-mono">{pin.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
