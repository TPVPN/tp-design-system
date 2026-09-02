import { useState } from 'react';
import { Play } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { Button } from '@tpvpn/ui';
import { Pill } from '@/components/docs';
import { bezierToCss, token, tokensByPrefix } from '@/lib/tokens';
import { camelName } from './naming';
import { CopyName } from './CopyName';

const USAGE: Record<string, string> = {
  standard: '默认：颜色、位移、hover',
  emphasized: '进入、大元素展开、Hero',
  decelerate: '进入（淡入上浮）',
  accelerate: '退出（必须比进入更快）',
  spring: '连接成功、Switch、轻微过冲',
};

const S = 100;

/** cubic-bezier(x1, y1, x2, y2) → SVG path in a 100×100 box (y flipped). */
function curvePath([x1, y1, x2, y2]: number[]): string {
  return `M0 ${S} C ${x1! * S} ${S - y1! * S}, ${x2! * S} ${S - y2! * S}, ${S} 0`;
}

const isBezier = (v: unknown): v is number[] => Array.isArray(v) && v.length === 4 && v.every((n) => typeof n === 'number');

/** easing.* rows: bezier plot · usage · a ball that eases across a track with that timing function. */
export function EasingCurves() {
  const reduced = useReducedMotion() ?? false;
  const [on, setOn] = useState<Record<string, boolean>>({});
  const ms = parseFloat(token('duration.slower')) || 800;
  const curves = tokensByPrefix('easing').filter((c) => isBezier(c.value));

  return (
    <div className="my-6 space-y-3">
      {curves.map((c) => {
        const bezier = c.value as number[];
        const css = bezierToCss(bezier);
        const active = Boolean(on[c.key]);
        const constName = camelName(c.path);
        return (
          <article key={c.path} className="grid items-center gap-4 rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto]">
            <svg viewBox="-8 -18 116 126" className="h-24 w-24 text-blue-600" role="img" aria-label={`${c.key} 曲线 ${css}`}>
              <rect x="0" y="0" width={S} height={S} fill="none" stroke="currentColor" strokeOpacity="0.15" />
              <line x1="0" y1={S} x2={S} y2="0" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="3 3" />
              <path d={curvePath(bezier)} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="0" cy={S} r="2.5" fill="currentColor" />
              <circle cx={S} cy="0" r="2.5" fill="currentColor" />
            </svg>
            <div className="min-w-0">
              <CopyName text={c.path} />
              <p className="mt-0.5 mb-1 font-mono text-[12px] text-fg-muted">{css}</p>
              <p className="m-0 text-sm text-fg-secondary">{c.description ?? USAGE[c.key]}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Pill tone="outline" size="sm" className="font-mono">
                  ease-{c.key}
                </Pill>
                <Pill tone="outline" size="sm" className="font-mono">
                  --ease-{c.key}
                </Pill>
                <Pill tone="outline" size="sm" className="font-mono">
                  TpTokens.{constName}
                </Pill>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="icon-sm" variant="outline" aria-label={`播放 ${c.key}（${ms} 毫秒）`} onClick={() => setOn((s) => ({ ...s, [c.key]: !s[c.key] }))}>
                <Play aria-hidden />
              </Button>
              <div className="relative h-2 w-40 rounded-full bg-bg-surface-sunken">
                <span
                  aria-hidden
                  className="absolute top-1/2 left-0 size-6 rounded-full bg-blue-500 shadow-level-2"
                  style={{
                    transform: `translate(${active ? 'calc(10rem - 1.5rem)' : '0px'}, -50%)`,
                    transition: reduced ? 'none' : `transform ${ms}ms ${css}`,
                  }}
                />
              </div>
            </div>
          </article>
        );
      })}
      <p className="m-0 text-[12px] text-fg-muted">演示时长为 duration.slower（{ms}ms），便于观察曲线差异；实际使用按「配方」表取值。</p>
    </div>
  );
}
