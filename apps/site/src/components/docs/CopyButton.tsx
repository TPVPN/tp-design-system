import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useCopy } from '@/lib/copy';

export interface CopyButtonProps {
  /** Text placed on the clipboard. */
  text: string;
  /** Visible label (defaults to icon-only). */
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

/** Icon button with an inline “Copied” confirmation (aria-live). */
export function CopyButton({ text, label, className, size = 'md' }: CopyButtonProps) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => void copy(text)}
      aria-label={copied ? '已复制' : (label ?? '复制')}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border border-border-default bg-bg-surface font-medium text-fg-secondary transition-colors duration-200 hover:border-border-strong hover:text-fg-primary',
        size === 'sm' ? 'h-7 px-2 text-[11px]' : 'h-8 px-2.5 text-xs',
        copied && 'border-status-success-border bg-status-success-bg text-status-success-fg hover:text-status-success-fg',
        className,
      )}
    >
      {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </button>
  );
}
