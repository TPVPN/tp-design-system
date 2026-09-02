import { useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { copyText } from '@/lib/copy';
import { tokenReference, type TokenEntry } from '@/lib/tokens';
import { DocTable } from '@/components/docs';
import { ContrastChip, type ContrastPair } from './ContrastChip';

export interface ColorRow {
  entry: TokenEntry;
  description?: ReactNode;
  /** Contrast checks shown in the last column (only for text-like tokens). */
  pairs: ContrastPair[];
}

/**
 * Semantic colour table: swatch · token (click to copy) · value · reference · description · contrast.
 * Values come straight from tokens.flat.json; contrast is computed live.
 */
export function ColorTokenTable({ rows, caption, className }: { rows: ColorRow[]; caption?: string; className?: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  const hasPairs = rows.some((r) => r.pairs.length > 0);

  const copy = async (name: string) => {
    if (await copyText(name)) {
      setCopied(name);
      window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1500);
    }
  };

  return (
    <DocTable
      className={className}
      caption={caption}
      head={
        <>
          <th className="w-14">预览</th>
          <th>Token</th>
          <th>值</th>
          <th>引用</th>
          <th>说明</th>
          {hasPairs && <th>对比度</th>}
        </>
      }
    >
      {rows.map(({ entry, description, pairs }) => {
        const value = String(entry.value);
        const ref = tokenReference(entry.path);
        const isCopied = copied === entry.path;
        const transparent = value === 'transparent';
        return (
          <tr key={entry.path} className="transition-colors hover:bg-bg-surface-hover">
            <td>
              <span
                className={cn('inline-block size-7 rounded-sm ring-hairline', transparent && 'bg-checker')}
                style={transparent ? undefined : { background: value }}
                aria-hidden
              />
            </td>
            <td>
              <button
                type="button"
                onClick={() => void copy(entry.path)}
                title="点击复制"
                className={cn(
                  'inline-flex max-w-full items-center gap-1.5 rounded-xs font-mono text-[13px] text-fg-brand transition-colors hover:underline hover:underline-offset-2',
                  isCopied && 'text-status-success-fg hover:no-underline',
                )}
              >
                <span className="truncate">{entry.path}</span>
                {isCopied && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-medium">
                    <Check className="size-3" aria-hidden /> Copied
                  </span>
                )}
              </button>
            </td>
            <td>
              <code className="font-mono text-[12px] whitespace-nowrap text-fg-secondary">{value}</code>
            </td>
            <td className="font-mono text-[12px] whitespace-nowrap text-fg-muted">{ref ? ref.slice(1, -1) : '—'}</td>
            <td className="min-w-[12rem] text-fg-secondary">{description ?? entry.description ?? '—'}</td>
            {hasPairs && (
              <td>
                {pairs.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {pairs.map((p) => (
                      <ContrastChip key={p.label} {...p} />
                    ))}
                  </div>
                ) : (
                  <span className="text-fg-placeholder">—</span>
                )}
              </td>
            )}
          </tr>
        );
      })}
    </DocTable>
  );
}
