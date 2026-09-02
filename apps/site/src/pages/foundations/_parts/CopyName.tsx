import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useCopy } from '@/lib/copy';

/** Monospace token name that copies itself on click (same look as TokenTable's name cell). */
export function CopyName({ text, label, className }: { text: string; label?: string; className?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => void copy(text)}
      title="点击复制"
      aria-label={`${label ?? text}，点击复制`}
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-xs font-mono text-[13px] text-fg-brand transition-colors hover:underline hover:underline-offset-2',
        copied && 'text-status-success-fg hover:no-underline',
        className,
      )}
    >
      <span className="truncate">{label ?? text}</span>
      {copied && (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-medium">
          <Check className="size-3" aria-hidden /> Copied
        </span>
      )}
    </button>
  );
}
