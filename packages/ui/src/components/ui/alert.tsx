import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  [
    'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-md border px-4 py-3 text-body',
    'has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] has-[>svg]:gap-x-3',
    '[&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  ],
  {
    variants: {
      variant: {
        default: 'border-border-default bg-bg-surface text-fg-primary [&>svg]:text-fg-secondary',
        success:
          'border-status-success-border bg-status-success-bg text-status-success-fg *:data-[slot=alert-description]:text-current',
        warning:
          'border-status-warning-border bg-status-warning-bg text-status-warning-fg *:data-[slot=alert-description]:text-current',
        error:
          'border-status-error-border bg-status-error-bg text-status-error-fg *:data-[slot=alert-description]:text-current',
        info: 'border-status-info-border bg-status-info-bg text-status-info-fg *:data-[slot=alert-description]:text-current',
        /** shadcn alias of `error`. */
        destructive:
          'border-status-error-border bg-status-error-bg text-status-error-fg *:data-[slot=alert-description]:text-current',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type AlertProps = React.ComponentProps<'div'> & VariantProps<typeof alertVariants>;

function Alert({ className, variant = 'default', ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-5 text-label-md font-semibold', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-body-sm text-fg-secondary [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
