import * as React from 'react';
import { ChevronRight, Globe } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Flag } from './flag';
import { LatencyText } from './latency-text';
import { SignalBars } from './signal-bars';

export interface NodeCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onSelect'> {
  /** Country code rendered as a 40px circle flag. */
  flagCode?: string;
  /** Custom leading icon when there is no flag (defaults to a globe). */
  icon?: React.ReactNode;
  /** e.g. "US · Los Angeles #102" */
  title: string;
  subtitle?: string;
  /** e.g. <Tag tone="brand">优质节点</Tag> */
  badge?: React.ReactNode;
  latencyMs: number;
  /** 0–100 */
  loadPct: number;
  selected?: boolean;
  /** When provided the card renders as a <button>. */
  onSelect?: () => void;
}

function MetaDot() {
  return (
    <span aria-hidden="true" className="text-fg-placeholder">
      ·
    </span>
  );
}

function NodeCard({
  flagCode,
  icon,
  title,
  subtitle,
  badge,
  latencyMs,
  loadPct,
  selected = false,
  onSelect,
  className,
  onClick,
  ...props
}: NodeCardProps) {
  const load = Math.round(Math.min(100, Math.max(0, loadPct)));
  const classes = cn(
    'group/node-card flex w-full items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-4 text-left text-fg-primary',
    'transition-[box-shadow,border-color,background-color,transform] duration-(--duration-base) ease-standard',
    (onSelect || onClick) && 'cursor-pointer hover:border-blue-300 hover:bg-blue-50/40 focus-visible:shadow-focus active:bg-blue-50',
    selected && 'border-blue-500 bg-blue-50 hover:border-blue-500',
    className,
  );

  const content = (
    <>
      <span
        data-slot="node-card-icon"
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-full bg-bg-surface-sunken text-fg-secondary',
          selected && 'bg-blue-100 text-fg-brand',
        )}
      >
        {flagCode ? (
          <Flag code={flagCode} size={40} />
        ) : (
          (icon ?? <Globe className="size-6" strokeWidth={1.75} aria-hidden="true" />)
        )}
      </span>
      <span data-slot="node-card-body" className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span data-slot="node-card-title" className="break-words text-headline">
            {title}
          </span>
          {badge}
        </span>
        <span data-slot="node-card-meta" className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-caption text-fg-secondary">
          {subtitle ? (
            <>
              <span className="truncate">{subtitle}</span>
              <MetaDot />
            </>
          ) : null}
          <span className="shrink-0">
            延迟 <LatencyText ms={latencyMs} />
          </span>
          <MetaDot />
          <span className="shrink-0 tabular">负载 {load}%</span>
        </span>
      </span>
      <SignalBars latencyMs={latencyMs} />
      {(onSelect || onClick) && <ChevronRight className="size-4 shrink-0 text-fg-muted" aria-hidden="true" />}
    </>
  );

  if (onSelect || onClick) {
    return (
      <button
        type="button"
        data-slot="node-card"
        data-selected={selected || undefined}
        aria-pressed={selected}
        className={classes}
        onClick={(event) => {
          onClick?.(event);
          onSelect?.();
        }}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      data-slot="node-card"
      data-selected={selected || undefined}
      className={classes}
      onClick={onClick}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {content}
    </div>
  );
}

export { NodeCard };
