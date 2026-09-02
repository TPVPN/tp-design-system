import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Long-form text wrapper: paragraphs, lists, links, inline code, tables (styles in index.css `.doc-prose`). */
export function Prose({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('doc-prose', className)} {...props} />;
}
