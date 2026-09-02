import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Keyboard key cap: `<Kbd>⌘</Kbd><Kbd>K</Kbd>` */
export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-border-default bg-bg-surface px-1.5 font-sans text-[11px] leading-none font-medium text-fg-muted shadow-[inset_0_-1px_0_0_var(--color-border-default)]',
        className,
      )}
      {...props}
    />
  );
}
