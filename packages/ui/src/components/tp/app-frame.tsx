import * as React from 'react';
import { Wifi } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface AppFrameProps extends React.ComponentProps<'div'> {
  /** Device width in px (default 390 = iPhone 15). */
  width?: number;
  /** Fixed height in px; content scrolls inside when set. */
  height?: number;
  /** Status-bar clock (default "9:41"). */
  time?: string;
  statusBar?: boolean;
}

function CellularIcon() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
      <rect x="0" y="7" width="3" height="4" rx="0.8" />
      <rect x="4.5" y="5" width="3" height="6" rx="0.8" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="0.8" />
      <rect x="13.5" y="0" width="3" height="11" rx="0.8" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
      <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <rect x="2" y="2" width="19" height="9" rx="2" fill="currentColor" />
      <path d="M24.5 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

/** Subtle phone frame for mobile compositions on the site (rounded 40px, level-4 shadow, hairline ring). */
function AppFrame({
  children,
  width = 390,
  height,
  time = '9:41',
  statusBar = true,
  className,
  style,
  ...props
}: AppFrameProps) {
  return (
    <div
      data-slot="app-frame"
      className={cn(
        'relative flex flex-col overflow-hidden rounded-[40px] bg-bg-surface text-fg-primary shadow-level-4 ring-1 ring-slate-200',
        className,
      )}
      style={{ width, maxWidth: '100%', height, ...style }}
      {...props}
    >
      {statusBar && (
        <div
          data-slot="app-frame-status-bar"
          aria-hidden="true"
          className="relative flex h-12 shrink-0 items-end justify-between px-8 pb-2 text-label-sm font-semibold"
        >
          <span className="tabular">{time}</span>
          <span className="absolute top-3 left-1/2 h-6 w-[88px] -translate-x-1/2 rounded-full bg-slate-900" />
          <span className="flex items-center gap-1.5">
            <CellularIcon />
            <Wifi className="size-4" strokeWidth={2.5} aria-hidden="true" />
            <BatteryIcon />
          </span>
        </div>
      )}
      <div
        data-slot="app-frame-content"
        className={cn('relative flex min-h-0 flex-1 flex-col', height !== undefined && 'overflow-y-auto')}
      >
        {children}
      </div>
    </div>
  );
}

export { AppFrame };
