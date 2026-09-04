import { CircleX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle, Button, StatusDot, UsageMeter, type ConnectionState } from '@tpvpn/ui';
import { Callout, DoDont, DocTable, PageHeader, Preview, Prose, Section, SubSection, TokenTable } from '@/components/docs';
import { token, tokenReference } from '@/lib/tokens';
import { ConnectionDemo, STATE_ZH } from './_parts/ConnectionDemo';
import { SequenceDiagram } from './_parts/ConnectionSequence';
import { HomeScreen } from './_parts/HomeScreen';
import { PhoneStage } from './_parts/PhoneStage';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const STORYBOARD: { state: ConnectionState; step: string; zh: string; en: string; note: string; elapsed?: string }[] = [
  {
    state: 'disconnected',
    step: '01',
    zh: '未连接',
    en: 'Disconnected',
    note: '白底、slate-200 描边、level-2 阴影；标题 display-sm「未连接」，副文字「点击连接」。',
  },
  {
    state: 'connecting',
    step: '02',
    zh: '连接中',
    en: 'Connecting',
    note: '点击后 ≤ 100 ms 出现外环：1.2 s 一圈的旋转弧线 + 呼吸；副文字「正在选择最快节点」。',
  },
  {
    state: 'connected',
    step: '03',
    zh: '已连接',
    en: 'Connected',
    note: 'connected 径向渐变 + brand-glow-lg，spring 300 ms 进入；计时 numeric-md 从 00:00:00 开始。',
    elapsed: '00:12:47',
  },
];

const COPY_ROWS: { state: ConnectionState; zh: string; sub: string; button: string; en: string }[] = [
  { state: 'disconnected', zh: '未连接', sub: '点击连接', button: '连接', en: 'Not connected · Tap to connect · Connect' },
  { state: 'connecting', zh: '连接中…', sub: '正在选择最快节点', button: '连接中…（aria-busy）', en: 'Connecting… · Finding the fastest node · Connecting…' },
  { state: 'connected', zh: '已连接', sub: '受保护 · WireGuard', button: '已连接（aria-checked="true"）', en: 'Connected · Protected · WireGuard · Connected' },
  { state: 'error', zh: '未连接', sub: '连接失败，请重试（Toast）', button: '重试', en: "Not connected · Couldn't connect. Try again. · Try again" },
];

const TOKEN_ROWS = [
  ...(['disconnected', 'connecting', 'connected', 'error'] as const).map((s) => ({
    name: `color.state.${s}`,
    value: token(`color.state.${s}`),
    reference: tokenReference(`color.state.${s}`),
    preview: 'color' as const,
    description: { disconnected: '未连接 · 状态点 / 灰', connecting: '连接中 · 外环与状态点（动画）', connected: '已连接 · 状态点（按钮本体用 gradient.connected）', error: '失败 · 状态点与 Toast' }[s],
  })),
  { name: 'duration.fast', value: token('duration.fast'), preview: 'duration' as const, description: '点击后首次反馈的上限' },
  { name: 'duration.connect', value: token('duration.connect'), preview: 'duration' as const, description: 'connecting 外环一圈 · 呼吸周期' },
  { name: 'duration.moderate', value: token('duration.moderate'), preview: 'duration' as const, description: '进入 connected 的 spring 时长' },
  { name: 'easing.spring', value: token('easing.spring'), preview: 'ease' as const, description: '进入 connected' },
  { name: 'elevation.brand-glow-lg', value: token('elevation.brand-glow-lg'), preview: 'shadow' as const, description: '已连接按钮的蓝色光晕' },
  { name: 'size.connection-button.mobile', value: token('size.connection-button.mobile'), preview: 'spacing' as const, description: '手机直径' },
  { name: 'size.connection-button.desktop', value: token('size.connection-button.desktop'), preview: 'spacing' as const, description: '平板 / 桌面直径' },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ConnectionPage() {
  return (
    <>
      <PageHeader
        eyebrow="模式 · Patterns"
        title="连接流程"
        en="Connection"
        description="首页只有一件事：连接。三个状态、一条时序、一套文案，从点击到已连接的每一帧都有明确反馈，失败时具体且可重试。"
      />

      <Section id="storyboard" title="三态故事板" en="Storyboard" description="用真实组件拼出的首页：未连接 → 连接中 → 已连接。三帧共用同一布局，只有按钮、标题和状态点在变化。">
        <div className="grid gap-6 md:grid-cols-3">
          {STORYBOARD.map((frame) => (
            <figure key={frame.state} className="flex min-w-0 flex-col">
              <PhoneStage width={320} height={600}>
                <HomeScreen state={frame.state} elapsed={frame.elapsed} inert />
              </PhoneStage>
              <figcaption className="mt-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-fg-primary">
                  <span className="font-mono text-xs text-fg-muted tabular">{frame.step}</span>
                  <StatusDot state={frame.state} size={8} />
                  {frame.zh}
                  <span className="font-medium text-fg-muted">{frame.en}</span>
                </p>
                <p className="mt-1 text-sm leading-6 text-fg-secondary">{frame.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="timeline" title="时序" en="Sequence" description="点击之后发生了什么、何时发生。错误分支回到未连接并给出可重试的提示。">
        <SequenceDiagram />
      </Section>

      <Section id="copy" title="状态文案" en="Copy" description="标题用 display-sm，副文字用 caption，按钮文字来自 connectionStateLabel；英文对照见「语调与文案」。">
        <DocTable
          caption="连接流程各状态文案"
          head={
            <>
              <th className="w-24">状态</th>
              <th>标题 · display-sm</th>
              <th>副文字 · caption</th>
              <th>按钮文字 · label-md</th>
              <th>English</th>
            </>
          }
        >
          {COPY_ROWS.map((row) => (
            <tr key={row.state}>
              <td>
                <span className="flex items-center gap-2 text-fg-primary">
                  <StatusDot state={row.state} size={8} />
                  {STATE_ZH[row.state]}
                </span>
              </td>
              <td className="text-fg-primary">{row.zh}</td>
              <td className="text-fg-secondary">{row.sub}</td>
              <td>
                <code className="font-mono text-[12px] text-fg-secondary">{row.button}</code>
              </td>
              <td className="text-fg-secondary">{row.en}</td>
            </tr>
          ))}
        </DocTable>
        <Prose>
          <p>
            节点名与计时不放在副文字里：计时由 <code>ConnectionButton</code> 的 <code>elapsed</code> 以 numeric-md 渲染在按钮下方，节点名在底部的 <code>NodeCard</code>。
            按钮是 <code>role="switch"</code>，<code>aria-checked</code> 表示已连接，<code>aria-busy</code> 表示连接中，可见文字即无障碍名称。
          </p>
        </Prose>
      </Section>

      <Section id="rules" title="规则" en="Rules">
        <Prose>
          <ul>
            <li>
              <strong>永远有状态。</strong>首页任何时刻都显示「未连接 / 连接中… / 已连接」之一，不存在空白或只有图标的过渡帧。
            </li>
            <li>
              <strong>100 ms 内反馈。</strong>点击后 ≤ 100 ms（<code>duration.fast</code>）出现按压缩放与外环，然后进入 1.2 s 循环（<code>duration.connect</code>）；没有真实进度，就不显示百分比。
            </li>
            <li>
              <strong>错误具体且可重试。</strong>15 s 超时判定失败；按钮回到未连接，用 Toast（error）说「连接失败，请重试」并给「重试」按钮，不出现错误码。
            </li>
            <li>
              <strong>计时用 tabular 数字。</strong>格式 <code>HH:MM:SS</code>，numeric-md；超过 24 h 显示 <code>1d 02:03:04</code>，数字跳动时宽度不变。
            </li>
            <li>
              <strong>按钮是首页唯一的主操作。</strong>不再放第二个 primary 按钮；状态栏与 App bar 不重复使用状态色。
            </li>
            <li>断开无需二次确认，按压反馈 100 ms；连接成功不弹全屏庆祝动画。</li>
            <li>
              <code>prefers-reduced-motion</code>：外环静止、呼吸取消，只保留 150 ms 淡入淡出。
            </li>
          </ul>
        </Prose>

        <DoDont
          doCaption="错误说清楚发生了什么，并给出唯一的下一步。"
          dontCaption="模糊的标题、暴露技术错误码、没有可操作的按钮。"
          do={
            <Alert variant="error" className="max-w-xs">
              <CircleX aria-hidden />
              <AlertTitle>连接失败，请重试</AlertTitle>
              <AlertDescription>
                <Button size="sm" variant="outline">
                  重试
                </Button>
              </AlertDescription>
            </Alert>
          }
          dont={
            <Alert variant="error" className="max-w-xs">
              <CircleX aria-hidden />
              <AlertTitle>出错了</AlertTitle>
              <AlertDescription>E_TIMEOUT_0x3 · wg0 handshake did not complete</AlertDescription>
            </Alert>
          }
        />

        <DoDont
          doCaption="numeric-md + tabular：每一位等宽，秒数跳动时冒号不漂移。"
          dontCaption="比例数字：1 比 0 窄，计时器每秒左右抖动。"
          do={
            <div className="flex flex-col items-end text-numeric-md text-fg-primary tabular">
              <span>00:09:41</span>
              <span>00:11:11</span>
            </div>
          }
          dont={
            <div className="flex flex-col items-end text-numeric-md text-fg-primary" style={{ fontVariantNumeric: 'proportional-nums' }}>
              <span>00:09:41</span>
              <span>00:11:11</span>
            </div>
          }
        />

        <SubSection title="计时与流量" en="Timer & data">
          <Prose>
            <ul>
              <li>
                计时 <code>HH:MM:SS</code>；超过 24 h 显示 <code>1d 02:03:04</code>。
              </li>
              <li>
                流量用 <code>UsageMeter</code>：已用 / 总量，单位自适应 MB / GB，保留 1 位小数；80% 起 amber，95% 起 red。
              </li>
            </ul>
          </Prose>
          <Preview label="计时与流量示例" background="surface">
            <div className="flex w-full max-w-sm flex-col gap-6">
              <div className="flex flex-wrap items-baseline justify-around gap-4 text-numeric-md text-fg-primary tabular">
                <span>00:00:00</span>
                <span>00:12:47</span>
                <span>1d 02:03:04</span>
              </div>
              <UsageMeter usedGb={12.4} totalGb={50} />
            </div>
          </Preview>
        </SubSection>
      </Section>

      <Section id="demo" title="交互演示" en="Interactive demo" description="点击手机里的按钮走一遍完整流程；打开「模拟失败」查看错误分支：回到未连接、Toast 提示、重试。">
        <ConnectionDemo />
      </Section>

      <Section id="tokens" title="相关 Token" en="Tokens" description="连接状态色是全产品唯一来源：按钮、状态点、列表状态与 Toast 都从这四个 token 取色。">
        <TokenTable rows={TOKEN_ROWS} caption="连接流程相关 token" />
      </Section>

      <Section id="platform" title="Flutter / iOS 对应" en="Flutter / iOS">
        <Callout title="Flutter / iOS 对应">
          <p>
            <strong>Flutter</strong>：状态用同一枚举 <code>ConnectionState</code>；按钮 = <code>GestureDetector</code> + <code>AnimatedContainer</code>（直径{' '}
            <code>TpTokens.sizeConnectionButtonMobile</code>）+ <code>CustomPaint</code> 画外环弧线，<code>AnimationController(duration: TpTokens.durationConnect)</code>{' '}
            循环；已连接用 <code>RadialGradient</code> + <code>TpTokens.elevationBrandGlowLg</code>。
          </p>
          <p>
            <strong>iOS（SwiftUI）</strong>：<code>Circle().fill(RadialGradient(…))</code> + <code>.shadow(color: Color(TPTokens.colorBlue500).opacity(0.24), radius: 24, y: 16)</code>
            ；外环用 <code>rotationEffect</code> 配 <code>.linear(duration: TPTokens.durationConnect).repeatForever()</code>；
            计时文字 <code>.monospacedDigit()</code>。
          </p>
        </Callout>
      </Section>
    </>
  );
}
