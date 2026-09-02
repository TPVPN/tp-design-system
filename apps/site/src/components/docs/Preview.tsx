import { useId, useState, type ReactNode } from 'react';
import { Code2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { CodeLang } from '@/lib/shiki';
import { CodeBlock } from '@/components/docs/CodeBlock';

export interface PreviewProps {
  children: ReactNode;
  className?: string;
  /** Inner padding (default `true` → p-8). */
  padded?: boolean;
  /** Center the children (default `true`). */
  centered?: boolean;
  background?: 'canvas' | 'surface' | 'brand' | 'checker';
  /** Controls rendered in the top bar (prop toggles, variant switches…). */
  toolbar?: ReactNode;
  /** When given, a “Code” button toggles a highlighted code panel. */
  code?: string;
  lang?: CodeLang | (string & {});
  /** Default open state of the code panel. */
  codeOpen?: boolean;
  minHeight?: number | string;
  /** Accessible name for the preview region. */
  label?: string;
}

const BACKGROUNDS = {
  canvas: 'bg-bg-canvas',
  surface: 'bg-bg-surface',
  brand: 'bg-gradient-primary text-white',
  checker: 'bg-checker',
} as const;

/** Bordered rounded-xl frame for live component demos, with optional toolbar and code panel. */
export function Preview({
  children,
  className,
  padded = true,
  centered = true,
  background = 'canvas',
  toolbar,
  code,
  lang = 'tsx',
  codeOpen = false,
  minHeight,
  label = '组件预览',
}: PreviewProps) {
  const [open, setOpen] = useState(codeOpen);
  const panelId = useId();
  const hasBar = Boolean(toolbar || code);

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-border-default bg-bg-surface shadow-level-1">
      {hasBar && (
        <div className="flex min-h-11 items-center justify-between gap-3 border-b border-border-subtle px-3 py-1.5">
          <div className="flex flex-wrap items-center gap-2 text-sm">{toolbar}</div>
          {code && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={panelId}
              className={cn(
                'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-sm px-2.5 text-xs font-medium transition-colors duration-200',
                open ? 'bg-blue-50 text-blue-700' : 'text-fg-secondary hover:bg-bg-surface-hover hover:text-fg-primary',
              )}
            >
              <Code2 className="size-3.5" aria-hidden />
              Code
            </button>
          )}
        </div>
      )}
      <div
        role="region"
        aria-label={label}
        className={cn(
          'relative',
          BACKGROUNDS[background],
          padded && 'p-8',
          centered && 'flex flex-wrap items-center justify-center gap-4',
          className,
        )}
        style={{ minHeight: minHeight ?? (padded ? 160 : undefined) }}
      >
        {children}
      </div>
      {code && (
        <div id={panelId} hidden={!open} className="border-t border-border-subtle">
          <CodeBlock code={code} lang={lang} bare maxHeight={420} />
        </div>
      )}
    </figure>
  );
}
