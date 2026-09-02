import * as React from 'react';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function Checkbox({ className, checked, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      className={cn(
        'peer size-5 shrink-0 rounded-xs border border-border-strong bg-bg-surface',
        'transition-[background-color,border-color,box-shadow] duration-(--duration-fast) ease-standard',
        'outline-none focus-visible:shadow-focus',
        'disabled:cursor-not-allowed disabled:border-action-disabled-border disabled:bg-action-disabled-bg disabled:text-action-disabled-fg',
        'aria-invalid:border-status-error-solid',
        'data-[state=checked]:border-action-primary-bg data-[state=checked]:bg-action-primary-bg data-[state=checked]:text-action-primary-fg',
        'data-[state=indeterminate]:border-action-primary-bg data-[state=indeterminate]:bg-action-primary-bg data-[state=indeterminate]:text-action-primary-fg',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        {checked === 'indeterminate' ? (
          <MinusIcon className="size-3.5" strokeWidth={3} />
        ) : (
          <CheckIcon className="size-3.5" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
