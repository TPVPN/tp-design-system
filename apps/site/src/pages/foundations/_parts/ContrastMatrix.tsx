import { useId, useState } from 'react';
import { Switch } from '@tpvpn/ui';
import { cn } from '@/lib/cn';
import { contrastGrade, contrastRatio, isHex, PAPER } from '@/lib/contrast';
import { token, tokenReference } from '@/lib/tokens';
import { DocTable } from '@/components/docs';
import { GRADE_CLASS, GRADE_LABEL, gradeTone } from './ContrastChip';

/** Foreground tokens (rows) — every text colour the system allows. */
export const FG_ROWS = [
  'color.fg.primary',
  'color.fg.secondary',
  'color.fg.muted',
  'color.fg.placeholder',
  'color.fg.brand',
  'color.fg.brand-strong',
  'color.fg.link',
  'color.status.success.fg',
  'color.status.warning.fg',
  'color.status.error.fg',
  'color.status.info.fg',
  'color.state.connected-fg',
  'color.state.connecting-fg',
  'color.state.disconnected-fg',
  'color.state.error-fg',
  'color.scene.auto.fg',
  'color.scene.game.fg',
  'color.scene.ai.fg',
  'color.scene.exchange.fg',
] as const;

/** Background tokens (columns). */
export const BG_COLS = ['color.bg.canvas', 'color.bg.surface', 'color.bg.surface-sunken', 'color.bg.brand-soft'] as const;

/** The 50-tint the token is designed to sit on (status / state / scene), if any. */
export function pairedBg(fgPath: string): string | undefined {
  let m = /^color\.status\.([a-z]+)\.fg$/.exec(fgPath);
  if (m) return `color.status.${m[1]}.bg`;
  m = /^color\.state\.([a-z]+)-fg$/.exec(fgPath);
  if (m) return `color.state.${m[1]}-bg`;
  m = /^color\.scene\.([a-z]+)\.fg$/.exec(fgPath);
  if (m) return `color.scene.${m[1]}.bg`;
  return undefined;
}

const short = (path: string) => path.replace(/^color\./, '');
const refOf = (path: string) => tokenReference(path)?.replace(/^\{color\.|\}$/g, '') ?? '';

function Cell({ fg, bg, large }: { fg: string; bg: string; large: boolean }) {
  if (!isHex(fg) || !isHex(bg)) return <td className="text-fg-placeholder">—</td>;
  const ratio = contrastRatio(fg, bg);
  const grade = contrastGrade(ratio, { large });
  const tone = gradeTone(grade);
  return (
    <td title={`${fg} / ${bg} · ${ratio}:1 · ${grade}`}>
      <span className={cn('flex items-center justify-between gap-2 rounded-xs px-2 py-1', GRADE_CLASS[tone])}>
        <span className="font-mono text-[12px] font-medium tnum">{ratio.toFixed(2)}</span>
        <span className="text-[11px]">{GRADE_LABEL[tone]}</span>
      </span>
    </td>
  );
}

export function ContrastLegend({ large }: { large: boolean }) {
  const items: { tone: keyof typeof GRADE_CLASS; text: string }[] = large
    ? [
        { tone: 'aaa', text: 'AAA ≥ 4.5:1' },
        { tone: 'aa', text: 'AA ≥ 3:1' },
        { tone: 'fail', text: '不达标 < 3:1' },
      ]
    : [
        { tone: 'aaa', text: 'AAA ≥ 7:1' },
        { tone: 'aa', text: 'AA ≥ 4.5:1' },
        { tone: 'large', text: '仅大字 ≥ 3:1（≥ 24px 或 ≥ 18.66px 粗体）' },
        { tone: 'fail', text: '不达标 < 3:1' },
      ];
  return (
    <ul className="my-3 flex flex-wrap gap-2 text-[12px]" aria-label="图例">
      {items.map((i) => (
        <li key={i.tone} className={cn('rounded-xs px-2 py-1 font-medium', GRADE_CLASS[i.tone])}>
          {i.text}
        </li>
      ))}
    </ul>
  );
}

/**
 * Truth table: every allowed foreground × every light background, computed live from token values.
 * Known fails show up on their own: placeholder everywhere; fg.muted / fg.brand on surface-sunken & brand-soft.
 */
export function ContrastMatrix() {
  const [large, setLarge] = useState(false);
  const id = useId();
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ContrastLegend large={large} />
        <label htmlFor={id} className="flex items-center gap-2 text-sm text-fg-secondary">
          <Switch id={id} size="sm" checked={large} onCheckedChange={setLarge} />
          按大字判定
        </label>
      </div>
      <DocTable
        className="my-3"
        caption="前景 token × 背景 token 对比度矩阵"
        head={
          <>
            <th className="min-w-[11rem]">前景</th>
            {BG_COLS.map((b) => (
              <th key={b} className="min-w-[7.5rem]">
                <span className="block font-mono text-[11px] text-fg-primary">{short(b)}</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="size-3 rounded-xs ring-hairline" style={{ background: token(b) }} aria-hidden />
                  {token(b)}
                </span>
              </th>
            ))}
            <th className="min-w-[8.5rem]">对应浅底</th>
          </>
        }
      >
        {FG_ROWS.map((fgPath) => {
          const fg = token(fgPath);
          const paired = pairedBg(fgPath);
          return (
            <tr key={fgPath}>
              <td>
                <span className="flex items-center gap-2">
                  <span className="size-4 shrink-0 rounded-xs ring-hairline" style={{ background: fg }} aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[12px] text-fg-primary">{short(fgPath)}</span>
                    <span className="block font-mono text-[11px] text-fg-muted">
                      {refOf(fgPath)} · {fg}
                    </span>
                  </span>
                </span>
              </td>
              {BG_COLS.map((b) => (
                <Cell key={b} fg={fg} bg={token(b)} large={large} />
              ))}
              {paired ? (
                <Cell fg={fg} bg={token(paired)} large={large} />
              ) : (
                <td className="text-[12px] text-fg-placeholder">—</td>
              )}
            </tr>
          );
        })}
      </DocTable>
      <p className="m-0 text-[12px] text-fg-muted">
        「对应浅底」列 = 该 token 设计上所处的 50 阶浅底（status / state / scene 的 bg）。白底 {PAPER} 与 canvas {token('color.bg.canvas')} 差异小于 0.05，结论一致。
      </p>
    </>
  );
}

/** White text on coloured fills — buttons, brand surfaces, status solids. */
export const WHITE_ON_FILLS = [
  'color.action.primary.bg',
  'color.action.primary.bg-hover',
  'color.bg.brand',
  'color.bg.inverse',
  'color.action.destructive.bg',
  'color.status.error.solid',
  'color.status.error.fg',
  'color.status.success.solid',
  'color.status.warning.solid',
] as const;

const FILL_NOTE: Record<string, string> = {
  'color.action.primary.bg': '默认按钮底（blue-600）',
  'color.action.primary.bg-hover': '按钮 hover（blue-700）',
  'color.bg.brand': '品牌面（blue-500）：仅大字、图标、描边、装饰',
  'color.bg.inverse': 'Tooltip / Toast 深色面',
  'color.action.destructive.bg': '危险按钮底（red-600）',
  'color.status.error.solid': 'red-500：仅大字 / 图标，不作小字按钮底',
  'color.status.error.fg': 'red-700：可作白字底',
  'color.status.success.solid': 'green-500：不可放白字，仅图标 / 状态点',
  'color.status.warning.solid': 'amber-500：不可放白字，仅图标 / 状态点',
};

export function WhiteOnFills() {
  return (
    <DocTable
      caption="白字 × 有色底"
      head={
        <>
          <th>底</th>
          <th>值</th>
          <th className="w-32">正文（4.5）</th>
          <th className="w-32">大字（3.0）</th>
          <th>结论</th>
        </>
      }
    >
      {WHITE_ON_FILLS.map((p) => {
        const bg = token(p);
        return (
          <tr key={p}>
            <td>
              <span className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-xs text-[11px] font-semibold text-white ring-hairline" style={{ background: bg }} aria-hidden>
                  Aa
                </span>
                <span className="font-mono text-[12px] text-fg-primary">{short(p)}</span>
              </span>
            </td>
            <td className="font-mono text-[12px] text-fg-muted">
              {refOf(p)} · {bg}
            </td>
            <Cell fg={PAPER} bg={bg} large={false} />
            <Cell fg={PAPER} bg={bg} large />
            <td className="text-[13px] text-fg-secondary">{FILL_NOTE[p]}</td>
          </tr>
        );
      })}
    </DocTable>
  );
}
