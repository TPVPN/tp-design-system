import type { ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface DoDontProps {
  do: ReactNode;
  dont: ReactNode;
  doCaption?: ReactNode;
  dontCaption?: ReactNode;
  /** Extra classes for the two preview areas (e.g. `p-0`, `bg-bg-canvas`). */
  previewClassName?: string;
  className?: string;
}

function Card({
  kind,
  children,
  caption,
  previewClassName,
}: {
  kind: 'do' | 'dont';
  children: ReactNode;
  caption?: ReactNode;
  previewClassName?: string;
}) {
  const ok = kind === 'do';
  return (
    <figure className="overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1">
      <div
        className={cn(
          'flex items-center gap-2 border-b px-4 py-2 text-sm font-semibold',
          ok
            ? 'border-status-success-border bg-status-success-bg text-status-success-fg'
            : 'border-status-error-border bg-status-error-bg text-status-error-fg',
        )}
      >
        <span
          className={cn(
            'flex size-5 items-center justify-center rounded-full text-white',
            ok ? 'bg-status-success-solid' : 'bg-status-error-solid',
          )}
          aria-hidden
        >
          {ok ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
        </span>
        {ok ? '推荐' : '避免'}
        <span className="font-medium">{ok ? 'Do' : "Don't"}</span>
      </div>
      <div className={cn('flex min-h-40 items-center justify-center p-6', previewClassName)}>{children}</div>
      {caption && (
        <figcaption className="border-t border-border-subtle px-4 py-3 text-sm leading-6 text-fg-secondary">{caption}</figcaption>
      )}
    </figure>
  );
}

/** Side-by-side “Do / Don't” comparison. */
export function DoDont({ do: doNode, dont, doCaption, dontCaption, previewClassName, className }: DoDontProps) {
  return (
    <div className={cn('my-6 grid gap-4 md:grid-cols-2', className)}>
      <Card kind="do" caption={doCaption} previewClassName={previewClassName}>
        {doNode}
      </Card>
      <Card kind="dont" caption={dontCaption} previewClassName={previewClassName}>
        {dont}
      </Card>
    </div>
  );
}
