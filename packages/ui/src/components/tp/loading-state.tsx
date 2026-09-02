import * as React from 'react';
import { Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface SpinnerProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** Diameter in px. */
  size?: number;
}

/** 12-dot iOS-style spinner in brand blue (stepped rotation, respects reduced motion). */
function Spinner({ size = 28, className, style, ...props }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      data-slot="spinner"
      className={cn('relative inline-block text-blue-500 motion-safe:animate-tp-spin', className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {Array.from({ length: 12 }, (_, index) => (
        <span
          key={index}
          className="absolute inset-0"
          style={{ transform: `rotate(${index * 30}deg)`, opacity: 0.2 + (0.8 * (index + 1)) / 12 }}
        >
          <span className="absolute top-0 left-1/2 h-[30%] w-[9%] -translate-x-1/2 rounded-full bg-current" />
        </span>
      ))}
    </span>
  );
}

export interface LoadingStateProps extends React.ComponentProps<'div'> {
  variant: 'skeleton' | 'spinner' | 'success';
  label?: string;
}

function LoadingState({ variant, label, className, ...props }: LoadingStateProps) {
  const reduceMotion = useReducedMotion();

  if (variant === 'skeleton') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={label ?? '加载中'}
        data-slot="loading-state"
        data-variant="skeleton"
        className={cn('flex w-full items-center gap-3', className)}
        {...props}
      >
        <Skeleton className="size-11 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-live="polite"
        data-slot="loading-state"
        data-variant="spinner"
        className={cn('inline-flex flex-col items-center gap-3', className)}
        {...props}
      >
        <Spinner />
        {label ? (
          <span className="text-label-md text-fg-secondary">{label}</span>
        ) : (
          <span className="sr-only">加载中</span>
        )}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      data-slot="loading-state"
      data-variant="success"
      className={cn('inline-flex flex-col items-center gap-3', className)}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        initial={reduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 420, damping: 22, mass: 0.8 }}
        className="flex size-14 items-center justify-center rounded-full bg-green-50 text-green-600"
      >
        <Check className="size-7" strokeWidth={2.5} />
      </motion.span>
      <span className="text-label-md text-fg-primary">{label ?? '已完成'}</span>
    </div>
  );
}

export { LoadingState, Spinner };
