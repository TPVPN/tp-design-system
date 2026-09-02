import { useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { copyText } from '@/lib/copy';
import { DocTable } from '@/components/docs/DocTable';

export type TokenPreviewKind = 'color' | 'radius' | 'shadow' | 'spacing' | 'text' | 'ease' | 'duration';

export interface TokenRow {
  /** Token path or CSS variable, e.g. `color.bg.canvas` */
  name: string;
  /** Resolved value shown in the table and used for the preview */
  value: string;
  description?: ReactNode;
  preview?: TokenPreviewKind;
  /** Alias source, e.g. `{color.slate.25}` */
  reference?: string;
}

export interface TokenTableProps {
  rows: TokenRow[];
  caption?: string;
  /** Force the “引用” column on/off (default: shown when any row has a reference). */
  showReference?: boolean;
  className?: string;
}

const px = (v: string): number => {
  const m = /(-?\d*\.?\d+)\s*(px|rem)?/.exec(v);
  if (!m) return 0;
  const n = parseFloat(m[1]!);
  return m[2] === 'rem' ? n * 16 : n;
};

function EaseCurve({ value }: { value: string }) {
  const m = /(-?\d*\.?\d+)[,\s]+(-?\d*\.?\d+)[,\s]+(-?\d*\.?\d+)[,\s]+(-?\d*\.?\d+)/.exec(value);
  if (!m) return null;
  const [a, b, c, d] = m.slice(1, 5).map(Number) as [number, number, number, number];
  const S = 32;
  const path = `M0 ${S} C ${a * S} ${S - b * S}, ${c * S} ${S - d * S}, ${S} 0`;
  return (
    <svg viewBox={`-4 -10 ${S + 8} ${S + 20}`} className="h-9 w-9 text-blue-600" aria-hidden>
      <line x1="0" y1={S} x2={S} y2="0" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="2 2" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Visual for one token according to its kind. */
export function TokenPreview({ kind, value }: { kind: TokenPreviewKind; value: string }) {
  switch (kind) {
    case 'color':
      return <span className="inline-block size-7 rounded-sm ring-hairline" style={{ background: value }} aria-hidden />;
    case 'radius':
      return (
        <span
          className="inline-block size-8 border border-blue-300 bg-blue-50"
          style={{ borderRadius: value, borderTopLeftRadius: value }}
          aria-hidden
        />
      );
    case 'shadow':
      return (
        <span className="inline-block py-1" aria-hidden>
          <span className="block h-7 w-11 rounded-sm bg-white" style={{ boxShadow: value }} />
        </span>
      );
    case 'spacing': {
      const n = px(value);
      return (
        <span className="flex h-4 w-24 items-center" aria-hidden>
          <span className="h-2 rounded-full bg-blue-500" style={{ width: Math.max(1, Math.min(n, 96)) }} />
        </span>
      );
    }
    case 'text': {
      const size = Math.min(px(value) || 16, 32);
      const w = /\b([1-9]00)\b/.exec(value)?.[1];
      return (
        <span className="inline-block leading-none text-fg-primary" style={{ fontSize: size, fontWeight: w ? Number(w) : 600 }} aria-hidden>
          Aa
        </span>
      );
    }
    case 'ease':
      return <EaseCurve value={value} />;
    case 'duration': {
      const ms = parseFloat(value) || 0;
      return (
        <span className="flex h-4 w-24 items-center rounded-full bg-bg-surface-sunken" aria-hidden>
          <span className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(100, (ms / 1200) * 100)}%`, minWidth: ms > 0 ? 4 : 0 }} />
        </span>
      );
    }
  }
}

/** Token reference table — click a name to copy it; previews adapt to the token kind. */
export function TokenTable({ rows, caption, showReference, className }: TokenTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const hasPreview = rows.some((r) => r.preview);
  const hasRef = showReference ?? rows.some((r) => r.reference);
  const hasDesc = rows.some((r) => r.description);

  const copy = async (name: string) => {
    if (await copyText(name)) {
      setCopiedKey(name);
      window.setTimeout(() => setCopiedKey((k) => (k === name ? null : k)), 1500);
    }
  };

  return (
    <DocTable
      className={className}
      caption={caption}
      head={
        <>
          {hasPreview && <th className="w-20">预览</th>}
          <th>Token</th>
          <th>值</th>
          {hasRef && <th>引用</th>}
          {hasDesc && <th>说明</th>}
        </>
      }
    >
      {rows.map((row) => {
        const copied = copiedKey === row.name;
        return (
          <tr key={row.name} className="transition-colors hover:bg-bg-surface-hover">
            {hasPreview && <td>{row.preview ? <TokenPreview kind={row.preview} value={row.value} /> : null}</td>}
            <td>
              <button
                type="button"
                onClick={() => void copy(row.name)}
                title="点击复制"
                className={cn(
                  'inline-flex max-w-full items-center gap-1.5 rounded-xs font-mono text-[13px] text-fg-brand transition-colors hover:underline hover:underline-offset-2',
                  copied && 'text-status-success-fg hover:no-underline',
                )}
              >
                <span className="truncate">{row.name}</span>
                {copied && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-medium">
                    <Check className="size-3" aria-hidden /> Copied
                  </span>
                )}
              </button>
            </td>
            <td>
              <span className="block max-w-[13rem] truncate font-mono text-[13px] text-fg-secondary" title={row.value}>
                {row.value}
              </span>
            </td>
            {hasRef && <td className="font-mono text-[12px] text-fg-muted">{row.reference ?? '—'}</td>}
            {hasDesc && <td className="text-fg-secondary">{row.description}</td>}
          </tr>
        );
      })}
    </DocTable>
  );
}
