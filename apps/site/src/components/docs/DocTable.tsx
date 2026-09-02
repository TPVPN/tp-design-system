import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Shared table chrome for TokenTable / PropsTable (scrolls horizontally on narrow screens). */
export function DocTable({
  head,
  children,
  className,
  caption,
  ...props
}: { head: ReactNode; caption?: ReactNode } & HTMLAttributes<HTMLTableElement>) {
  return (
    <div className={cn('my-6 overflow-x-auto rounded-lg border border-border-default bg-bg-surface shadow-level-1', className)}>
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm" {...props}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-bg-canvas text-xs text-fg-muted">
          <tr className="[&>th]:border-b [&>th]:border-border-default [&>th]:px-4 [&>th]:py-2.5 [&>th]:font-medium">{head}</tr>
        </thead>
        <tbody className="[&>tr:last-child>td]:border-b-0 [&>tr>td]:border-b [&>tr>td]:border-border-subtle [&>tr>td]:px-4 [&>tr>td]:py-3 [&>tr>td]:align-middle">
          {children}
        </tbody>
      </table>
    </div>
  );
}
