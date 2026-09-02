import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  [
    'inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 text-label-sm whitespace-nowrap',
    'transition-[color,background-color,box-shadow] duration-(--duration-fast) ease-standard',
    'outline-none focus-visible:shadow-focus',
    '[&>svg]:pointer-events-none [&>svg]:size-3',
  ],
  {
    variants: {
      variant: {
        default: 'bg-action-primary-bg text-action-primary-fg [a&]:hover:bg-action-primary-bg-hover',
        secondary: 'bg-action-secondary-bg text-action-secondary-fg [a&]:hover:bg-action-secondary-bg-hover',
        destructive: 'bg-action-destructive-bg text-action-destructive-fg [a&]:hover:bg-action-destructive-bg-hover',
        outline: 'border-border-default bg-bg-surface text-fg-secondary [a&]:hover:bg-bg-surface-hover',
        ghost: 'text-fg-secondary [a&]:hover:bg-bg-surface-hover',
        success: 'bg-status-success-bg text-status-success-fg',
        warning: 'bg-status-warning-bg text-status-warning-fg',
        error: 'bg-status-error-bg text-status-error-fg',
        info: 'bg-status-info-bg text-status-info-fg',
        link: 'text-fg-link underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

function Badge({ className, variant = 'default', asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
