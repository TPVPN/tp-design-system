import { useState } from 'react';
import { cn } from '@/lib/cn';
import { bestTextOn, contrastGrade, contrastRatio, PAPER } from '@/lib/contrast';
import { copyText } from '@/lib/copy';

export interface ColorRampStep {
  step: number | string;
  hex: string;
}

export interface ColorRampProps {
  /** Ramp name, e.g. `blue` */
  name: string;
  /** 11 steps (50 … 950) */
  steps: ColorRampStep[];
  /** Step to mark as the base (e.g. 500) */
  base?: number | string;
  label?: string;
  className?: string;
}

/** 11-step colour strip: hover → hex & contrast vs white, click → copy, base step marked. */
export function ColorRamp({ name, steps, base = 500, label, className }: ColorRampProps) {
  const [hover, setHover] = useState<ColorRampStep | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const info = hover ?? steps.find((s) => String(s.step) === String(base)) ?? steps[Math.floor(steps.length / 2)];

  const copy = async (s: ColorRampStep) => {
    if (await copyText(s.hex)) {
      setCopied(s.hex);
      window.setTimeout(() => setCopied((c) => (c === s.hex ? null : c)), 1500);
    }
  };

  return (
    <div className={cn('group/ramp', className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-fg-primary">{label ?? name}</span>
        {info && (
          <span className="truncate font-mono text-xs text-fg-muted tnum" aria-live="polite">
            {name}-{info.step} · <span className="uppercase">{info.hex}</span> · 白字 {contrastRatio(PAPER, info.hex).toFixed(2)}:1{' '}
            {contrastGrade(contrastRatio(PAPER, info.hex))}
          </span>
        )}
      </div>
      <div className="flex h-14 overflow-hidden rounded-lg shadow-level-1 ring-1 ring-black/5" role="list" onMouseLeave={() => setHover(null)}>
        {steps.map((s) => {
          const isBase = String(s.step) === String(base);
          const textOn = bestTextOn(s.hex);
          const isCopied = copied === s.hex;
          return (
            <button
              key={String(s.step)}
              type="button"
              role="listitem"
              onClick={() => void copy(s)}
              onMouseEnter={() => setHover(s)}
              onFocus={() => setHover(s)}
              onBlur={() => setHover(null)}
              aria-label={`${name}-${s.step} ${s.hex}，点击复制`}
              className="group/step relative min-w-0 flex-1 outline-none transition-[flex-grow] duration-200 hover:flex-[1.6] focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
              style={{ background: s.hex }}
            >
              {isBase && (
                <span
                  className="absolute top-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full"
                  style={{ background: textOn }}
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  'absolute inset-x-0 bottom-1.5 flex justify-center transition-opacity duration-200',
                  isCopied ? 'opacity-100' : 'opacity-0 group-hover/step:opacity-100 group-focus-visible/step:opacity-100',
                )}
              >
                {/*
                 * Scrim behind the label, tinted opposite of the text colour: text and swatch
                 * alone can't clear 4.5:1 for every step (blue-500 / mint-700 top out at ~4.35
                 * with either pure white or pure ink) — a translucent backing pushes every
                 * combination past 7:1 without a special case.
                 */}
                <span
                  className="rounded-xs px-1 font-mono text-[10px] uppercase"
                  style={{ color: textOn, background: textOn === PAPER ? 'rgb(0 0 0 / 0.35)' : 'rgb(255 255 255 / 0.35)' }}
                >
                  {isCopied ? 'Copied' : s.hex.replace('#', '')}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex font-mono text-[10px] text-fg-muted tnum" aria-hidden>
        {steps.map((s) => (
          <span key={String(s.step)} className={cn('flex-1 text-center', String(s.step) === String(base) && 'font-semibold text-fg-primary')}>
            {s.step}
          </span>
        ))}
      </div>
    </div>
  );
}
