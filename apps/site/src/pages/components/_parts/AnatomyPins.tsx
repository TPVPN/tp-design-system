import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface AnatomyPin {
  n: number;
  label: string;
  /** Optional short note shown after the label in the legend. */
  note?: ReactNode;
  /** Pin centre, in % of the framed element's width. */
  x: number;
  /** Pin centre, in % of the framed element's height. */
  y: number;
}

export interface AnatomyPinsProps {
  /** The component (rendered at its natural size, pins are positioned relative to it). */
  children: ReactNode;
  pins: AnatomyPin[];
  /** Extra classes for the stage (padding / background). */
  className?: string;
  /** Extra classes for the wrapper that the pins are positioned against. */
  frameClassName?: string;
  caption?: ReactNode;
}

/** Component with numbered pins overlaid + legend — the “anatomy” figure of a component page. */
export function AnatomyPins({ children, pins, className, frameClassName, caption }: AnatomyPinsProps) {
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-border-default bg-bg-surface shadow-level-1">
      <div className={cn('flex items-center justify-center overflow-x-auto bg-bg-canvas px-8 py-12', className)}>
        <div className={cn('relative inline-block', frameClassName)}>
          {children}
          {pins.map((pin) => (
            <span
              key={pin.n}
              aria-hidden="true"
              className="absolute z-10 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-[11px] leading-none font-semibold text-white shadow-level-2 ring-2 ring-white"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              {pin.n}
            </span>
          ))}
        </div>
      </div>
      <figcaption className="border-t border-border-subtle px-5 py-4">
        <ol className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {pins.map((pin) => (
            <li key={pin.n} className="flex items-start gap-2.5 text-sm leading-6">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-semibold text-blue-700">
                {pin.n}
              </span>
              <span className="min-w-0">
                <span className="font-medium text-fg-primary">{pin.label}</span>
                {pin.note && <span className="text-fg-muted"> · {pin.note}</span>}
              </span>
            </li>
          ))}
        </ol>
        {caption && <p className="mt-3 text-sm leading-6 text-fg-muted">{caption}</p>}
      </figcaption>
    </figure>
  );
}
