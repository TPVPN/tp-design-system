import { useId, useState, type CSSProperties } from 'react';
import { Check, Code2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { copyText } from '@/lib/copy';
import type { TypographyValue } from '@/lib/tokens';
import { Pill } from '@/components/docs';
import { camelName, cssTypographyRule, dartTextStyle, roleNumbers, swiftTextStyle, tailwindTypographyClass } from './naming';
import { PlatformSnippets, type Snippet } from './PlatformSnippets';

export interface TypeRoleCardProps {
  /** Role key, e.g. `title-lg` */
  role: string;
  value: TypographyValue;
  description?: string;
  sample: string;
  lang?: string;
}

function Meta({ k, v }: { k: string; v: string | number }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
      <span className="text-fg-muted">{k}</span>
      <span className="font-mono text-[12px] text-fg-primary tnum">{v}</span>
    </span>
  );
}

function snippetsFor(role: string, value: TypographyValue, sample: string): Snippet[] {
  const n = roleNumbers(value);
  const name = camelName(`typography.${role}`);
  const tw = tailwindTypographyClass(role, value);
  return [
    { id: 'css', label: 'CSS', lang: 'css', filename: 'tokens.css', code: cssTypographyRule(role, value) },
    {
      id: 'tailwind',
      label: 'Tailwind',
      lang: 'tsx',
      filename: 'theme.css → 类名',
      code: `// @theme { --text-${role}: ${n.fontSize / 16}rem; --text-${role}--line-height: ${n.lineHeight / 16}rem; --text-${role}--font-weight: ${n.weight}; --text-${role}--letter-spacing: ${value.letterSpacing ?? '0em'}; }\n<p className="${tw} text-fg-primary">${sample}</p>`,
    },
    {
      id: 'dart',
      label: 'Dart',
      lang: 'dart',
      filename: 'tp_tokens.dart',
      code: `// ${dartTextStyle(role, value)}\nText(\n  '${sample}',\n  style: TpTokens.${name}.copyWith(fontFamily: TpTokens.fontFamily${role === 'mono' ? 'Mono' : 'Sans'}.first),\n);`,
    },
    {
      id: 'swift',
      label: 'Swift',
      lang: 'swift',
      filename: 'TPTokens.swift',
      code: `// ${swiftTextStyle(role, value)}\nlet style = TPTokens.${name}\nlabel.font = style.font // SF Pro · ${n.fontSize}pt · ${n.weight}\nlabel.attributedText = NSAttributedString(\n  string: "${sample}",\n  attributes: [.kern: style.tracking]\n)`,
    },
  ];
}

/** One typography role: live sample · metadata · Tailwind class · per-platform code (lazy). */
export function TypeRoleCard({ role, value, description, sample, lang }: TypeRoleCardProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelId = useId();
  const n = roleNumbers(value);
  const path = `typography.${role}`;
  const twClass = tailwindTypographyClass(role, value);

  const style: CSSProperties = {
    fontFamily: role === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)',
    fontSize: n.fontSize,
    lineHeight: `${n.lineHeight}px`,
    fontWeight: n.weight,
    letterSpacing: value.letterSpacing ?? '0em',
    fontVariantNumeric: n.tabular ? 'tabular-nums' : undefined,
    textTransform: n.uppercase ? 'uppercase' : undefined,
    textWrap: 'balance',
  };

  const copy = async () => {
    if (await copyText(path)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <article className="overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1" aria-label={`字阶 ${role}`}>
      <div className="overflow-x-auto border-b border-border-subtle px-6 py-5">
        <p style={style} className="m-0 text-fg-primary" lang={lang}>
          {sample}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3 text-[13px] text-fg-secondary">
        <button
          type="button"
          onClick={() => void copy()}
          title="点击复制 token 路径"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xs font-mono text-[13px] text-fg-brand transition-colors hover:underline hover:underline-offset-2',
            copied && 'text-status-success-fg hover:no-underline',
          )}
        >
          {path}
          {copied && (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium">
              <Check className="size-3" aria-hidden /> Copied
            </span>
          )}
        </button>
        <Meta k="字号 / 行高" v={`${n.fontSize} / ${n.lineHeight}`} />
        <Meta k="字重" v={n.weight} />
        <Meta k="字距" v={value.letterSpacing ?? '0em'} />
        {n.tabular && (
          <Pill size="sm" tone="outline">
            tabular-nums
          </Pill>
        )}
        {n.uppercase && (
          <Pill size="sm" tone="outline">
            uppercase
          </Pill>
        )}
        <Pill size="sm" tone="brand" className="font-mono">
          {twClass.split(' ')[0]}
        </Pill>
        {description && <span className="text-fg-muted">{description}</span>}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          className={cn(
            'ml-auto inline-flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-xs font-medium transition-colors duration-200',
            open ? 'bg-blue-50 text-blue-700' : 'text-fg-secondary hover:bg-bg-surface-hover hover:text-fg-primary',
          )}
        >
          <Code2 className="size-3.5" aria-hidden />
          Code
        </button>
      </div>
      {open && (
        <div id={panelId} className="border-t border-border-subtle px-4 pb-4">
          <PlatformSnippets snippets={snippetsFor(role, value, sample)} className="my-0 pt-1" label={`${role} 代码格式`} />
        </div>
      )}
    </article>
  );
}
