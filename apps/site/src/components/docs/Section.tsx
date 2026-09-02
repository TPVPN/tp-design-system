import type { ReactNode } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface AnchorHeadingProps {
  id: string;
  as: 'h2' | 'h3';
  title: ReactNode;
  en?: ReactNode;
  className?: string;
}

/** Heading with a hover-revealed anchor link; `id` is what the TOC and `#hash` links target. */
export function AnchorHeading({ id, as: Tag, title, en, className }: AnchorHeadingProps) {
  return (
    <Tag
      id={id}
      data-toc-label={typeof title === 'string' ? title : undefined}
      className={cn(
        'group flex scroll-mt-24 flex-wrap items-baseline gap-x-2 text-fg-primary',
        Tag === 'h2' ? 'text-title-lg' : 'text-title-md',
        className,
      )}
    >
      <span>{title}</span>
      {en && <span className={cn('font-medium text-fg-muted', Tag === 'h2' ? 'text-title-sm' : 'text-headline')}>{en}</span>}
      <a
        href={`#${id}`}
        aria-label="复制本节链接"
        className="ml-1 inline-flex size-6 items-center justify-center self-center rounded-xs text-fg-placeholder opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-bg-surface-sunken hover:text-fg-secondary focus-visible:opacity-100"
      >
        <LinkIcon className="size-3.5" aria-hidden />
      </a>
    </Tag>
  );
}

export interface SectionProps {
  /** Anchor id (kebab-case, unique per page) */
  id: string;
  title: ReactNode;
  en?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Top-level page section — renders an `h2` (listed in the TOC). */
export function Section({ id, title, en, description, children, className }: SectionProps) {
  return (
    <section aria-labelledby={id} className={cn('mb-16', className)}>
      <div className="mb-6">
        <AnchorHeading id={id} as="h2" title={title} en={en} />
        {description && <p className="mt-2 max-w-[65ch] text-body-md text-fg-secondary">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export interface SubSectionProps extends Omit<SectionProps, 'id'> {
  /** Optional anchor id — when given the heading appears in the TOC. */
  id?: string;
}

/** Nested section — renders an `h3`. */
export function SubSection({ id, title, en, description, children, className }: SubSectionProps) {
  const headingId = id ?? undefined;
  return (
    <div className={cn('mb-10', className)}>
      <div className="mb-4">
        {headingId ? (
          <AnchorHeading id={headingId} as="h3" title={title} en={en} />
        ) : (
          <h3 className="flex flex-wrap items-baseline gap-x-2 text-title-md text-fg-primary">
            <span>{title}</span>
            {en && <span className="text-headline font-medium text-fg-muted">{en}</span>}
          </h3>
        )}
        {description && <p className="mt-1.5 max-w-[65ch] text-body-md text-fg-secondary">{description}</p>}
      </div>
      {children}
    </div>
  );
}
