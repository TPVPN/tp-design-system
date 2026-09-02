import type { ReactNode } from 'react';
import { DocTable } from '@/components/docs/DocTable';

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description?: ReactNode;
  required?: boolean;
}

export interface PropsTableProps {
  rows: PropRow[];
  caption?: string;
  className?: string;
}

/** Component API table: name · type · default · description. */
export function PropsTable({ rows, caption, className }: PropsTableProps) {
  return (
    <DocTable
      className={className}
      caption={caption}
      head={
        <>
          <th className="w-44">Prop</th>
          <th>类型</th>
          <th className="w-28">默认值</th>
          <th>说明</th>
        </>
      }
    >
      {rows.map((row) => (
        <tr key={row.name} className="transition-colors hover:bg-bg-surface-hover">
          <td>
            <code className="font-mono text-[13px] text-fg-brand">{row.name}</code>
            {row.required && (
              <span className="ml-1 text-status-error-fg" title="必填" aria-label="必填">
                *
              </span>
            )}
          </td>
          <td>
            <code className="font-mono text-[12px] break-words text-fg-secondary">{row.type}</code>
          </td>
          <td>{row.default ? <code className="font-mono text-[12px] text-fg-muted">{row.default}</code> : <span className="text-fg-placeholder">—</span>}</td>
          <td className="text-fg-secondary">{row.description}</td>
        </tr>
      ))}
    </DocTable>
  );
}
