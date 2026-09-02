import { cn } from '@/lib/cn';
import { contrastGrade, contrastRatio, type ContrastGrade } from '@/lib/contrast';

export type GradeTone = 'aaa' | 'aa' | 'large' | 'fail';

export function gradeTone(grade: ContrastGrade): GradeTone {
  if (grade === 'AAA') return 'aaa';
  if (grade === 'AA') return 'aa';
  if (grade === 'AA Large') return 'large';
  return 'fail';
}

/** Cell / chip colouring per grade — status tokens only, never raw hex. */
export const GRADE_CLASS: Record<GradeTone, string> = {
  aaa: 'bg-status-success-bg text-status-success-fg',
  aa: 'bg-status-success-bg/50 text-status-success-fg',
  large: 'bg-status-warning-bg text-status-warning-fg',
  fail: 'bg-status-error-bg text-status-error-fg',
};

export const GRADE_LABEL: Record<GradeTone, string> = {
  aaa: 'AAA',
  aa: 'AA',
  large: '仅大字',
  fail: '不达标',
};

export interface ContrastPair {
  fg: string;
  bg: string;
  /** What the pair is measured against, e.g. `白底`, `status.success.bg` */
  label: string;
}

/**
 * Contrast chip: ratio + WCAG grade, colour-coded.
 * “仅大字” = 3:1 ≤ ratio < 4.5:1 (only valid for ≥ 24px or ≥ 18.66px bold).
 */
export function ContrastChip({ fg, bg, label, large = false, className }: ContrastPair & { large?: boolean; className?: string }) {
  const ratio = contrastRatio(fg, bg);
  const grade = contrastGrade(ratio, { large });
  const tone = gradeTone(grade);
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap tnum', GRADE_CLASS[tone], className)}
      title={`${label}：${fg} / ${bg} · 对比度 ${ratio}:1 · ${grade}`}
    >
      <span className="inline-block size-2.5 rounded-full ring-hairline" style={{ background: bg }} aria-hidden>
        <span className="block size-full rounded-full" style={{ background: fg, transform: 'scale(0.5)' }} />
      </span>
      <span>{label}</span>
      {ratio.toFixed(2)}
      <span>{GRADE_LABEL[tone]}</span>
    </span>
  );
}
