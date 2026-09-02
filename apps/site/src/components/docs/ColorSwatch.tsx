import { cn } from '@/lib/cn';
import { bestTextOn, contrastGrade, contrastRatio, INK, PAPER } from '@/lib/contrast';
import { useCopy } from '@/lib/copy';

export function ContrastBadge({ fg, bg, label }: { fg: string; bg: string; label: string }) {
  const ratio = contrastRatio(fg, bg);
  const grade = contrastGrade(ratio);
  const pass = grade !== 'Fail';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-[11px] font-medium tnum',
        pass ? 'bg-status-success-bg text-status-success-fg' : 'bg-bg-surface-sunken text-fg-secondary',
      )}
      title={`${label}：对比度 ${ratio}:1 · ${grade}`}
    >
      <span className="size-2 rounded-full ring-hairline" style={{ background: fg }} aria-hidden />
      {ratio.toFixed(2)}
      <span>{grade === 'AA Large' ? 'AA+' : grade}</span>
    </span>
  );
}

export interface ColorSwatchProps {
  name: string;
  hex: string;
  /** Display label (defaults to `name`) */
  label?: string;
  /** Show contrast vs white and vs ink (slate-900) */
  contrast?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Colour card — click anywhere to copy the hex. */
export function ColorSwatch({ name, hex, label, contrast = false, size = 'md', className }: ColorSwatchProps) {
  const { copied, copy } = useCopy();
  const textOn = bestTextOn(hex);
  const heights = { sm: 'h-12', md: 'h-20', lg: 'h-28' } as const;

  return (
    <button
      type="button"
      onClick={() => void copy(hex)}
      aria-label={`${label ?? name} ${hex}，点击复制`}
      className={cn(
        'group w-full overflow-hidden rounded-lg border border-border-default bg-bg-surface text-left shadow-level-1 transition-[box-shadow,border-color] duration-200 hover:border-border-strong hover:shadow-level-2',
        className,
      )}
    >
      <div className={cn('relative', heights[size])} style={{ background: hex }}>
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center text-sm font-medium transition-opacity duration-200',
            copied ? 'opacity-100' : 'opacity-0',
          )}
          style={{ color: textOn }}
          aria-live="polite"
        >
          {copied ? 'Copied' : ''}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p className="truncate text-sm font-medium text-fg-primary">{label ?? name}</p>
        <p className="mt-0.5 font-mono text-xs text-fg-muted uppercase">{hex}</p>
        {contrast && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <ContrastBadge fg={PAPER} bg={hex} label="白字" />
            <ContrastBadge fg={INK} bg={hex} label="深字" />
          </div>
        )}
      </div>
    </button>
  );
}
