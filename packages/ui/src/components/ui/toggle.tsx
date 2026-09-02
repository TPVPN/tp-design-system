import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-md text-label-md whitespace-nowrap text-fg-secondary select-none',
    'transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-standard outline-none',
    'hover:bg-bg-surface-hover hover:text-fg-primary focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:text-fg-disabled',
    'aria-invalid:border-status-error-solid',
    'data-[state=on]:bg-bg-brand-soft data-[state=on]:text-fg-brand-strong',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-border-default bg-bg-surface shadow-level-1 hover:border-border-strong data-[state=on]:border-blue-200',
      },
      size: {
        default: 'h-control-sm min-w-control-sm px-2.5',
        sm: 'h-8 min-w-8 px-2',
        lg: 'h-control-md min-w-control-md px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
