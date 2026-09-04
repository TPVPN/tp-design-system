import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Column count at ≥ lg; collapses responsively below. */
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
}

const COLS: Record<NonNullable<GridProps['cols']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 @min-[480px]:grid-cols-2',
  3: 'grid-cols-1 @min-[480px]:grid-cols-2 @min-[720px]:grid-cols-3',
  4: 'grid-cols-2 @min-[720px]:grid-cols-4',
  5: 'grid-cols-2 @min-[560px]:grid-cols-3 @min-[800px]:grid-cols-5',
  6: 'grid-cols-2 @min-[480px]:grid-cols-3 @min-[800px]:grid-cols-6',
};
const GAPS = { sm: 'gap-3', md: 'gap-4', lg: 'gap-6' } as const;

/** Responsive equal-column grid for cards, swatches and previews. */
export function Grid({ cols = 3, gap = 'md', className, ...props }: GridProps) {
  return <div className={cn('grid', COLS[cols], GAPS[gap], className)} {...props} />;
}
