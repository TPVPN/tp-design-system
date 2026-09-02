import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface PlanCardProps extends React.ComponentProps<'div'> {
  name: string;
  /** Formatted price, e.g. "¥68" or "$9.99". */
  price: string;
  /** e.g. "月" / "年" */
  period?: string;
  description?: string;
  features: string[];
  /** Recommended plan: blue border, brand glow and a top gradient stripe. */
  highlighted?: boolean;
  /** e.g. <Tag tone="brand">最受欢迎</Tag> */
  badge?: React.ReactNode;
  cta: React.ReactNode;
}

function PlanCard({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  badge,
  cta,
  className,
  ...props
}: PlanCardProps) {
  return (
    <div
      data-slot="plan-card"
      data-highlighted={highlighted || undefined}
      className={cn(
        'relative flex flex-col gap-6 overflow-hidden rounded-xl border border-border-default bg-bg-surface p-6 text-fg-primary shadow-level-1',
        'transition-[box-shadow,border-color] duration-(--duration-base) ease-standard',
        highlighted &&
          'border-blue-500 shadow-brand-glow before:absolute before:inset-x-0 before:top-0 before:h-1 before:[background-image:var(--gradient-primary)]',
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 data-slot="plan-card-name" className="text-title-sm">
            {name}
          </h3>
          {description ? <p className="text-body text-fg-secondary">{description}</p> : null}
        </div>
        {badge}
      </div>
      <div data-slot="plan-card-price" className="flex items-baseline gap-1">
        <span className="text-display-sm tabular">{price}</span>
        {period ? <span className="text-body text-fg-muted">/ {period}</span> : null}
      </div>
      <ul data-slot="plan-card-features" className="flex flex-col gap-2.5 text-body text-fg-secondary">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="mt-1 size-4 shrink-0 text-fg-brand" strokeWidth={2.5} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div data-slot="plan-card-cta" className="mt-auto pt-2 [&>*]:w-full">
        {cta}
      </div>
    </div>
  );
}

export { PlanCard };
