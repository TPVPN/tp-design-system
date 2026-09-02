import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface PageHeaderProps {
  /** Small uppercase label above the title (e.g. section name). */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** English subtitle rendered after a slash: 「色彩系统 / Color System」 */
  en?: ReactNode;
  description?: ReactNode;
  /** Buttons / links rendered under the description. */
  actions?: ReactNode;
  className?: string;
}

/** Page title block used at the top of every documentation page. */
export function PageHeader({ eyebrow, title, en, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-12 border-b border-border-subtle pb-10', className)}>
      {eyebrow && <p className="eyebrow mb-3 text-fg-brand">{eyebrow}</p>}
      <h1 className="text-display-md text-fg-primary">
        {title}
        {en && (
          <>
            {' '}
            <span className="font-medium text-fg-muted">/ {en}</span>
          </>
        )}
      </h1>
      {description && <p className="mt-4 max-w-[62ch] text-body-lg text-fg-secondary">{description}</p>}
      {actions && <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}
