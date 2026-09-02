import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { connectionStateLabel, StatusDot, type ConnectionState } from '@tpvpn/ui';
import { cn } from '@/lib/cn';
import { token } from '@/lib/tokens';

/* ------------------------------------------------------------------ */
/* Timing diagram                                                      */
/* ------------------------------------------------------------------ */

function Step({ state, title, children, className }: { state: ConnectionState; title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2 rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1', className)}>
      <p className="flex items-center gap-2 text-headline text-fg-primary">
        <StatusDot state={state} size={10} pulse={false} />
        {title}
        <span className="font-mono text-[11px] font-normal text-fg-muted">{state}</span>
      </p>
      <ul className="flex flex-col gap-1 text-caption text-fg-secondary [&_code]:font-mono [&_code]:text-fg-primary">{children}</ul>
    </div>
  );
}

function Arrow({ label, tone = 'default' }: { label: string; tone?: 'default' | 'error' }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-1 px-1 text-center" aria-hidden>
      <ArrowRight className={cn('size-5', tone === 'error' ? 'text-status-error-fg' : 'text-fg-placeholder')} strokeWidth={2} />
      <span className={cn('max-w-24 text-[11px] leading-4', tone === 'error' ? 'text-status-error-fg' : 'text-fg-muted')}>{label}</span>
    </div>
  );
}

export function TimingDiagram() {
  return (
    <figure className="my-6 overflow-x-auto rounded-xl border border-border-default bg-bg-canvas p-5">
      <div className="grid min-w-[44rem] grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-2">
        <Step state="disconnected" title="未连接">
          <li>
            白底 · slate-200 描边 · 图标 blue-500 · <code>level-2</code>
          </li>
          <li>hover：blue-200 描边 + level-3</li>
          <li>
            active 缩放 0.97（<code>{token('duration.fast')}</code>）
          </li>
        </Step>
        <Arrow label="点击 / Space / Enter" />
        <Step state="connecting" title="连接中…">
          <li>
            外环 2px 弧线 <code>linear</code> 旋转，1 圈 = <code>duration.connect</code> {token('duration.connect')}，循环
          </li>
          <li>内圈 blue-500/10 呼吸，同周期 1.2s</li>
          <li>
            <code>aria-busy</code>；超时 15s 判定失败
          </li>
        </Step>
        <Arrow label="握手成功" />
        <Step state="connected" title="已连接">
          <li>
            <code>gradient.connected</code> 径向渐变 + <code>brand-glow-lg</code>
          </li>
          <li>
            进入过渡 <code>{token('duration.moderate')}</code> standard；整体 2.4s 呼吸 scale 1.02
          </li>
          <li>
            <code>aria-checked=true</code> · 计时 <code>numeric-md</code>
          </li>
        </Step>

        <div aria-hidden />
        <Arrow label="失败 / 超时" tone="error" />
        <Step state="error" title="连接失败" className="border-status-error-border">
          <li>red-500 描边 + 红图标，文字 red-700</li>
          <li>
            同时弹 Toast（error）「{connectionStateLabel.error}」
          </li>
          <li>点击重试 → 回到连接中</li>
        </Step>
        <Arrow label="点击断开（无需二次确认）" />
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border-strong p-4 text-caption text-fg-muted">回到「未连接」</div>
      </div>
      <figcaption className="mt-4 text-caption text-fg-muted">
        时序：点击 → connecting（外环 1.2s / 圈，最长 15s）→ connected（300ms 进入 + 光晕）；失败走 error → Toast → 重试。
      </figcaption>
    </figure>
  );
}
