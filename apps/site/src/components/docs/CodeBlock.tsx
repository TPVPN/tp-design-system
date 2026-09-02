import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { highlight, normalizeLang, type CodeLang } from '@/lib/shiki';
import { CopyButton } from '@/components/docs/CopyButton';

export interface CodeBlockProps {
  code: string;
  /** tsx · ts · css · dart · swift · kotlin · xml · json · bash · html (aliases accepted) */
  lang?: CodeLang | (string & {});
  filename?: string;
  showLineNumbers?: boolean;
  /** Frameless variant used inside <Preview>. */
  bare?: boolean;
  /** Max height of the scroll area (default none). */
  maxHeight?: number | string;
  className?: string;
}

const LANG_LABEL: Record<CodeLang, string> = {
  tsx: 'TSX',
  ts: 'TypeScript',
  css: 'CSS',
  dart: 'Dart',
  swift: 'Swift',
  kotlin: 'Kotlin',
  xml: 'XML',
  json: 'JSON',
  bash: 'Shell',
  html: 'HTML',
};

/** Syntax-highlighted code (shiki `github-light-high-contrast`, lazy-loaded) with a copy button. */
export function CodeBlock({ code, lang = 'tsx', filename, showLineNumbers = false, bare = false, maxHeight, className }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const trimmed = code.replace(/^\n+|\n+$/g, '');
  const normalized = normalizeLang(lang);

  useEffect(() => {
    let alive = true;
    setHtml(null);
    highlight(trimmed, normalized)
      .then((out) => alive && setHtml(out))
      .catch(() => alive && setHtml(null));
    return () => {
      alive = false;
    };
  }, [trimmed, normalized]);

  return (
    <div
      className={cn(
        'code-block group relative text-left',
        !bare && 'my-6 overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1',
        className,
      )}
      data-line-numbers={showLineNumbers ? 'true' : undefined}
    >
      {(filename || !bare) && (
        <div className="flex h-10 items-center justify-between gap-3 border-b border-border-subtle bg-bg-canvas px-4">
          <span className="truncate font-mono text-xs text-fg-muted">{filename ?? LANG_LABEL[normalized]}</span>
          <CopyButton text={trimmed} size="sm" />
        </div>
      )}
      {bare && !filename && (
        <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
          <CopyButton text={trimmed} size="sm" />
        </div>
      )}
      <div className="overflow-auto" style={{ maxHeight }}>
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="m-0 overflow-x-auto px-5 py-4 font-mono text-[13px] leading-5 text-fg-primary">
            <code>
              {trimmed.split('\n').map((line, i) => (
                <span key={i} className="line block min-w-max">
                  {line || ' '}
                </span>
              ))}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
