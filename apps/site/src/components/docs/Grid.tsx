import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Column count at ≥ lg; collapses responsively below. */
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
}

const COLS: Record<NonNullable<GridProps['cols']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6',
};
const GAPS = { sm: 'gap-3', md: 'gap-4', lg: 'gap-6' } as const;

/** Responsive equal-column grid for cards, swatches and previews. */
export function Grid({ cols = 3, gap = 'md', className, ...props }: GridProps) {
  return <div className={cn('grid', COLS[cols], GAPS[gap], className)} {...props} />;
}
