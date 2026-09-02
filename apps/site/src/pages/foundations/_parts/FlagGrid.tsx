import { useDeferredValue, useId, useMemo, useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import { Flag, Input } from '@tpvpn/ui';
import { cn } from '@/lib/cn';
import { copyText } from '@/lib/copy';
import flagsJson from '../../../../../../packages/brand/dist/flags/index.json';

export interface FlagInfo {
  code: string;
  en: string;
  zh: string;
}

/** 62 circle-flags with names, statically imported from @tpvpn/brand (mirrored to public/brand/flags/index.json). */
export const FLAGS: FlagInfo[] = Object.entries(flagsJson as Record<string, { en: string; zh: string }>)
  .map(([code, n]) => ({ code, en: n.en, zh: n.zh }))
  .sort((a, b) => a.code.localeCompare(b.code));

export function FlagGrid() {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const [copied, setCopied] = useState<string | null>(null);
  const inputId = useId();

  const results = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    if (!q) return FLAGS;
    return FLAGS.filter((f) => f.code.includes(q) || f.en.toLowerCase().includes(q) || f.zh.includes(q));
  }, [deferred]);

  const copy = async (code: string) => {
    if (await copyText(code)) {
      setCopied(code);
      window.setTimeout(() => setCopied((c) => (c === code ? null : c)), 1500);
    }
  };

  return (
    <div className="my-6">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-fg-muted" strokeWidth={1.75} aria-hidden />
        <label htmlFor={inputId} className="sr-only">
          搜索国旗：代码、英文名或中文名
        </label>
        <Input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索代码 / 英文 / 中文，例如 hk、Japan、新加坡"
          autoComplete="off"
          className="pr-11 pl-12"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="清除搜索"
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-bg-surface-sunken hover:text-fg-primary"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>
      <p className="mt-3 mb-4 text-[13px] text-fg-muted" role="status" aria-live="polite">
        {results.length} / {FLAGS.length} 面 · 点击图块复制 ISO 3166-1 alpha-2 代码
      </p>
      {results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong bg-bg-surface px-6 py-12 text-center">
          <p className="m-0 text-headline text-fg-primary">没有匹配的国旗</p>
          <p className="mt-1 mb-0 text-sm text-fg-muted">换个关键词，或检查代码是否为两位小写字母。</p>
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {results.map((f) => {
            const isCopied = copied === f.code;
            return (
              <li key={f.code}>
                <button
                  type="button"
                  onClick={() => void copy(f.code)}
                  aria-label={`${f.zh} ${f.en} ${f.code}，点击复制代码`}
                  className={cn(
                    'flex w-full flex-col items-center gap-2 rounded-lg border border-border-default bg-bg-surface px-2 py-4 text-center shadow-level-1 transition-[box-shadow,border-color] duration-(--duration-base) ease-standard outline-none hover:border-border-strong hover:shadow-level-2 focus-visible:shadow-focus',
                    isCopied && 'border-status-success-border',
                  )}
                >
                  <Flag code={f.code} name={f.zh} size={40} />
                  <span className="w-full">
                    <span className="block truncate text-sm font-medium text-fg-primary">{f.zh}</span>
                    <span className="block truncate text-[12px] text-fg-muted">{f.en}</span>
                    <span className={cn('mt-1 inline-flex items-center gap-1 font-mono text-[12px]', isCopied ? 'text-status-success-fg' : 'text-fg-brand')}>
                      {isCopied ? (
                        <>
                          <Check className="size-3" aria-hidden /> Copied
                        </>
                      ) : (
                        f.code
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
