import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-control-md w-full min-w-0 rounded-md border border-border-default bg-bg-surface px-4 text-body-md text-fg-primary',
        'transition-[border-color,box-shadow,background-color] duration-(--duration-base) ease-standard outline-none',
        'placeholder:text-fg-placeholder',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-label-md file:text-fg-primary',
        'hover:border-border-strong focus-visible:border-border-focus focus-visible:shadow-focus',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-action-disabled-border disabled:bg-action-disabled-bg disabled:text-action-disabled-fg',
        'aria-invalid:border-status-error-solid aria-invalid:focus-visible:shadow-[0_0_0_3px_var(--color-ring-error,rgb(239_68_68_/_0.28))]',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
