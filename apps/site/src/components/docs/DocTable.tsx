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
    <div className="my-6 min-w-0">
      <p className="mb-2 text-[13px] text-fg-muted @min-[576px]:hidden">左右滑动查看完整表格</p>
      <div tabIndex={0} role="region" aria-label={typeof caption === 'string' ? caption : '可横向滚动的参考表格'} className={cn('overflow-x-auto rounded-lg border border-border-default bg-bg-surface', className)}>
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
    </div>
  );
}
