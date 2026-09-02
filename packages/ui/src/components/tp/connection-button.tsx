import * as React from 'react';
import { Power } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { connectionStateLabel, type ConnectionState } from '@/lib/connection';

export interface ConnectionButtonProps extends Omit<React.ComponentProps<'button'>, 'onClick' | 'children'> {
  state: ConnectionState;
  /** 128px on mobile, 160px on tablet/desktop. */
  size?: 'mobile' | 'desktop';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Status label under the control. Defaults to the state copy; pass `null` to hide it. */
  label?: string | null;
  /** Elapsed session time, e.g. "00:12:34". Rendered as numeric-md tabular. */
  elapsed?: string;
  /** Extra classes for the circular control (className goes on the root wrapper). */
  buttonClassName?: string;
}

const controlBase = [
  'relative flex size-full items-center justify-center rounded-full border-2 select-none touch-manipulation',
  'transition-[background-color,border-color,color,box-shadow,transform] duration-(--duration-moderate) ease-standard',
  'outline-none active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60',
];

const controlByState: Record<ConnectionState, string> = {
  disconnected:
    'border-slate-200 bg-bg-surface text-blue-500 shadow-level-2 hover:border-blue-200 hover:shadow-level-3 focus-visible:shadow-focus',
  connecting: 'border-blue-100 bg-bg-surface text-blue-500 shadow-level-2 focus-visible:shadow-focus',
  connected:
    'border-transparent text-fg-on-brand shadow-brand-glow-lg [background-image:var(--gradient-connected)] focus-visible:[box-shadow:var(--shadow-focus),var(--shadow-brand-glow-lg)]',
  error: 'border-red-500 bg-bg-surface text-red-500 shadow-level-2 hover:bg-red-50 focus-visible:shadow-focus',
};

const labelByState: Record<ConnectionState, string> = {
  disconnected: 'text-fg-secondary',
  connecting: 'text-fg-secondary',
  connected: 'text-state-connected-fg',
  error: 'text-state-error-fg',
};

function ConnectionButton({
  state,
  size = 'mobile',
  onClick,
  label,
  elapsed,
  className,
  buttonClassName,
  ...props
}: ConnectionButtonProps) {
  const reduceMotion = useReducedMotion();
  const dimension =
    size === 'desktop' ? 'var(--spacing-connection-desktop, 160px)' : 'var(--spacing-connection-mobile, 128px)';
  const isConnecting = state === 'connecting';
  const isConnected = state === 'connected';
  const text = label === undefined ? connectionStateLabel[state] : label;
  const breathe = isConnected && !reduceMotion;

  return (
    <div
      data-slot="connection-button"
      data-state={state}
      data-size={size}
      className={cn('inline-flex flex-col items-center gap-4', className)}
    >
      <motion.div
        data-slot="connection-button-stage"
        className="relative shrink-0"
        style={{ width: dimension, height: dimension }}
        animate={breathe ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={breathe ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      >
        {isConnecting && (
          <motion.svg
            data-slot="connection-button-ring"
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="pointer-events-none absolute -inset-2 size-[calc(100%+16px)] text-blue-500"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="50" cy="50" r="47.5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.14" vectorEffect="non-scaling-stroke" />
            <circle
              cx="50"
              cy="50"
              r="47.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="88 300"
              vectorEffect="non-scaling-stroke"
            />
          </motion.svg>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={isConnected}
          aria-busy={isConnecting || undefined}
          aria-label={text ?? connectionStateLabel[state]}
          data-slot="connection-button-control"
          data-state={state}
          onClick={onClick}
          className={cn(controlBase, controlByState[state], buttonClassName)}
          {...props}
        >
          {isConnecting && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-blue-500/10"
              animate={reduceMotion ? { opacity: 0.6 } : { scale: [0.9, 1.04, 0.9], opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <Power size={48} strokeWidth={2.25} aria-hidden="true" className="relative" />
        </button>
      </motion.div>
      {text !== null && (
        <span data-slot="connection-button-label" className={cn('text-label-md', labelByState[state])}>
          {text}
        </span>
      )}
      {elapsed && (
        <span data-slot="connection-button-elapsed" className="-mt-2 text-numeric-md tabular text-fg-primary">
          {elapsed}
        </span>
      )}
    </div>
  );
}

export { ConnectionButton };
