import type { ReactNode } from 'react';
import { ArrowDownToLine, FileArchive } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatBytes } from '@/lib/assets';
import { Pill } from '@/components/docs/Pill';

export interface DownloadCardProps {
  title: ReactNode;
  description?: ReactNode;
  /** Absolute URL (already BASE_URL-prefixed, e.g. from `downloadUrl()` / `brandUrl.*`). */
  href: string;
  /** File size in bytes (shown as “1.2 MB”). */
  bytes?: number;
  /** Format chips, e.g. ['SVG', 'PNG'] */
  formats?: string[];
  /** Optional visual rendered above the text. */
  preview?: ReactNode;
  icon?: ReactNode;
  /** Suggested filename for the `download` attribute (defaults to the URL's basename). */
  filename?: string;
  className?: string;
}

/** Card with a real `<a download>` — every href must point at a file that exists in `public/`. */
export function DownloadCard({ title, description, href, bytes, formats, preview, icon, filename, className }: DownloadCardProps) {
  return (
    <a
      href={href}
      download={filename ?? true}
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1 transition-[box-shadow,border-color] duration-200 hover:border-border-strong hover:shadow-level-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        className,
      )}
    >
      {preview && <div className="flex h-36 items-center justify-center border-b border-border-subtle bg-bg-canvas p-6">{preview}</div>}
      <div className="flex flex-1 gap-4 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 [&_svg]:size-5">
          {icon ?? <FileArchive aria-hidden />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 font-semibold text-fg-primary">
            <span className="truncate">{title}</span>
            <ArrowDownToLine
              className="size-4 shrink-0 text-fg-placeholder transition-[color,transform] duration-200 group-hover:translate-y-0.5 group-hover:text-blue-600"
              aria-hidden
            />
          </p>
          {description && <p className="mt-1 text-sm leading-6 text-fg-secondary">{description}</p>}
          {(formats?.length || bytes !== undefined) && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {formats?.map((f) => (
                <Pill key={f} tone="outline" size="sm">
                  {f}
                </Pill>
              ))}
              {bytes !== undefined && <span className="ml-auto text-xs text-fg-muted tnum">{formatBytes(bytes)}</span>}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
