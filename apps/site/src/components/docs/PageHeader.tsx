import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface PageHeaderProps {
  /** Small uppercase label above the title (e.g. section name). */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Secondary English label; identical translations are omitted. */
  en?: ReactNode;
  description?: ReactNode;
  /** Buttons / links rendered under the description. */
  actions?: ReactNode;
  className?: string;
}

/** Page title block used at the top of every documentation page. */
export function PageHeader({ eyebrow, title, en, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('doc-page-header mb-10 border-b border-border-default pb-8 sm:mb-12 sm:pb-10', className)}>
      {eyebrow && <p className="eyebrow mb-5 text-fg-brand">{eyebrow}</p>}
      <h1 className="doc-title text-fg-primary">{title}</h1>
      {en && en !== title && <p lang="en" className="mt-3 text-[18px] leading-7 text-fg-muted">{en}</p>}
      {description && <p className="mt-6 max-w-[58ch] text-body-lg leading-relaxed text-fg-secondary">{description}</p>}
      {actions && <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}
