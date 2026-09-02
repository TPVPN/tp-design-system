import * as React from 'react';

import { cn } from '@/lib/utils';
import { connectionStateLabel, type ConnectionState } from '@/lib/connection';

export interface StatusDotProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  state: ConnectionState;
  size?: 8 | 10 | 12;
  /** Pulsing halo. Defaults to `true` while connecting. */
  pulse?: boolean;
  /** Accessible name. Defaults to the state copy. */
  label?: string;
}

const dotByState: Record<ConnectionState, string> = {
  connected: 'bg-state-connected',
  connecting: 'bg-state-connecting',
  disconnected: 'bg-state-disconnected',
  error: 'bg-state-error',
};

function StatusDot({ state, size = 8, pulse, label, className, style, ...props }: StatusDotProps) {
  const shouldPulse = pulse ?? state === 'connecting';

  return (
    <span
      role="img"
      aria-label={label ?? connectionStateLabel[state]}
      data-slot="status-dot"
      data-state={state}
      className={cn('relative inline-flex shrink-0 align-middle', className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {shouldPulse && (
        <span
          aria-hidden="true"
          className={cn('absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping', dotByState[state])}
        />
      )}
      <span aria-hidden="true" className={cn('relative inline-block size-full rounded-full', dotByState[state])} />
    </span>
  );
}

export { StatusDot };
