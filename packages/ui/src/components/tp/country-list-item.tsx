import * as React from 'react';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Flag } from './flag';
import { LatencyText } from './latency-text';

export interface CountryListItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  flagCode: string;
  /** Display name, also used as the flag alt text. */
  name: string;
  /** e.g. <Tag tone="game">游戏</Tag> */
  tag?: React.ReactNode;
  latencyMs: number;
  /** Packet loss 0–100 */
  lossPct: number;
  /** Server load 0–100 */
  loadPct: number;
  selected?: boolean;
  /** When provided the row renders as a <button>. */
  onClick?: () => void;
}

function MetaDot() {
  return (
    <span aria-hidden="true" className="text-fg-placeholder">
      ·
    </span>
  );
}

function formatPct(value: number) {
  const clamped = Math.min(100, Math.max(0, value));
  return Number.isInteger(clamped) ? String(clamped) : clamped.toFixed(1);
}

/** 72px country row: 40px flag · name + tag · latency / loss / load · chevron. */
function CountryListItem({
  flagCode,
  name,
  tag,
  latencyMs,
  lossPct,
  loadPct,
  selected = false,
  onClick,
  className,
  ...props
}: CountryListItemProps) {
  const classes = cn(
    'relative flex min-h-[72px] w-full items-center gap-3 px-4 text-left text-fg-primary',
    'transition-colors duration-(--duration-fast) ease-standard',
    onClick &&
      'cursor-pointer outline-none hover:bg-bg-surface-hover focus-visible:z-10 focus-visible:[box-shadow:inset_var(--shadow-focus)] active:bg-bg-surface-pressed',
    selected &&
      'bg-action-selected-bg hover:bg-action-selected-bg before:absolute before:inset-y-3 before:left-0 before:w-[3px] before:rounded-r-full before:bg-action-selected-indicator',
    className,
  );

  const content = (
    <>
      <Flag code={flagCode} name={name} size={40} />
      <span data-slot="country-list-item-body" className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex min-w-0 items-center gap-2">
          <span data-slot="country-list-item-name" className="truncate text-headline">
            {name}
          </span>
          {tag}
        </span>
        <span
          data-slot="country-list-item-meta"
          className="flex min-w-0 items-center gap-1.5 text-caption text-fg-secondary"
        >
          <span className="shrink-0">
            延迟 <LatencyText ms={latencyMs} />
          </span>
          <MetaDot />
          <span className="shrink-0 tabular">丢包 {formatPct(lossPct)}%</span>
          <MetaDot />
          <span className="shrink-0 tabular">负载 {formatPct(loadPct)}%</span>
        </span>
      </span>
      <ChevronRight
        className={cn('size-5 shrink-0 text-fg-placeholder', selected && 'text-fg-brand')}
        aria-hidden="true"
      />
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        data-slot="country-list-item"
        data-selected={selected || undefined}
        aria-pressed={selected}
        className={classes}
        onClick={onClick}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      data-slot="country-list-item"
      data-selected={selected || undefined}
      className={classes}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {content}
    </div>
  );
}

/** Rounded surface that stacks CountryListItem rows with subtle dividers. */
function CountryList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="country-list"
      className={cn(
        'flex flex-col divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-default bg-bg-surface',
        className,
      )}
      {...props}
    />
  );
}

export { CountryListItem, CountryList };
