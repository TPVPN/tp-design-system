import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

/**
 * iOS-proportioned switch: 51×31 track, 27px thumb (default) · 36×22 / 18px (sm).
 * On = blue-500, off = slate-300, disabled = slate-200.
 */
function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent px-0.5',
        'transition-[background-color,box-shadow] duration-(--duration-base) ease-standard outline-none focus-visible:shadow-focus',
        'disabled:cursor-not-allowed disabled:bg-slate-200',
        'data-[size=default]:h-[31px] data-[size=default]:w-[51px] data-[size=sm]:h-[22px] data-[size=sm]:w-9',
        'data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-slate-300',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-[0_3px_8px_rgb(0_0_0_/_0.15),0_1px_1px_rgb(0_0_0_/_0.16)]',
          'transition-transform duration-(--duration-base) ease-standard',
          'group-data-[size=default]/switch:size-[27px] group-data-[size=sm]/switch:size-[18px]',
          'data-[state=unchecked]:translate-x-0',
          'group-data-[size=default]/switch:data-[state=checked]:translate-x-5 group-data-[size=sm]/switch:data-[state=checked]:translate-x-3.5',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
