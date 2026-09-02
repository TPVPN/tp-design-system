import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { ConnectionButton, connectionStateLabel, type ConnectionState } from '@tpvpn/ui';
import {
  Callout,
  DocTable,
  DoDont,
  Grid,
  PageHeader,
  Preview,
  Prose,
  PropsTable,
  Section,
  SubSection,
  TokenTable,
} from '@/components/docs';
import { token } from '@/lib/tokens';
import { Anatomy } from './_parts/Anatomy';
import { TimingDiagram } from './_parts/ConnectionTimingDiagram';
import { Segmented, SwitchControl } from './_parts/Controls';
import { formatElapsed } from './_parts/demoData';
import { PlatformHint } from './_parts/PlatformHint';
import { SourceLink } from './_parts/SourceLink';
import { StateTile } from './_parts/StateTile';
import { DART, SWIFT } from './_parts/connectionButtonSnippets';

type Size = 'mobile' | 'desktop';

const STATES: { value: ConnectionState; label: string }[] = [
  { value: 'disconnected', label: '未连接' },
  { value: 'connecting', label: '连接中' },
  { value: 'connected', label: '已连接' },
  { value: 'error', label: '错误' },
];

const EN_LABEL: Record<ConnectionState, string> = {
  disconnected: 'Connect',
  connecting: 'Connecting…',
  connected: 'Connected',
  error: "Couldn't connect. Try again.",
};

/** Demo latency for the simulated handshake. */
const SIMULATED_CONNECT_MS = 1800;

/* ------------------------------------------------------------------ */
/* Live preview: state machine + elapsed timer + reduced-motion switch  */
/* ------------------------------------------------------------------ */

function useElapsed(active: boolean): number {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    setSeconds(0);
    const id = window.setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return active ? seconds : 0;
}

function LivePreview() {
  const [state, setState] = useState<ConnectionState>('disconnected');
  const [size, setSize] = useState<Size>('mobile');
  const [failNext, setFailNext] = useState(false);
  const [showElapsed, setShowElapsed] = useState(true);
  const [reduced, setReduced] = useState(false);
  const seconds = useElapsed(state === 'connected');

  // connecting → connected | error after the simulated handshake
  useEffect(() => {
    if (state !== 'connecting') return;
    const t = window.setTimeout(() => setState(failNext ? 'error' : 'connected'), SIMULATED_CONNECT_MS);
    return () => window.clearTimeout(t);
  }, [state, failNext]);

  const toggle = () => setState((s) => (s === 'disconnected' || s === 'error' ? 'connecting' : 'disconnected'));
  const elapsed = state === 'connected' && showElapsed ? formatElapsed(seconds) : undefined;

  const lines = [
    `  state={state}`,
    size === 'desktop' ? `  size="desktop"` : null,
    elapsed ? `  elapsed="${elapsed}"` : null,
    `  onClick={() => setState(state === 'connected' ? 'disconnected' : 'connecting')}`,
  ].filter(Boolean);
  const code = `import { useState } from 'react';
import { ConnectionButton, type ConnectionState } from '@tpvpn/ui';

const [state, setState] = useState<ConnectionState>('${state}');

<ConnectionButton
${lines.join('\n')}
/>`;

  return (
    <Preview
      label="连接按钮预览"
      code={code}
      minHeight={300}
      toolbar={
        <>
          <Segmented label="状态" value={state} options={STATES} onChange={setState} />
          <Segmented
            label="尺寸"
            value={size}
            options={[
              { value: 'mobile', label: 'mobile 128' },
              { value: 'desktop', label: 'desktop 160' },
            ]}
            onChange={setSize}
          />
          <SwitchControl label="模拟失败" checked={failNext} onCheckedChange={setFailNext} />
          <SwitchControl label="计时" checked={showElapsed} onCheckedChange={setShowElapsed} />
          <SwitchControl label="Reduced motion" checked={reduced} onCheckedChange={setReduced} />
        </>
      }
    >
      <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
        <ConnectionButton state={state} size={size} elapsed={elapsed} onClick={toggle} />
      </MotionConfig>
      <p className="basis-full text-center text-caption text-fg-muted">
        点击按钮：未连接 → 连接中（模拟 {SIMULATED_CONNECT_MS / 1000}s）→ {failNext ? '连接失败' : '已连接'}；再次点击断开。
      </p>
    </Preview>
  );
}

/* ------------------------------------------------------------------ */
/* Elapsed demo                                                         */
/* ------------------------------------------------------------------ */

function ElapsedDemo() {
  const [running, setRunning] = useState(true);
  const seconds = useElapsed(running);
  return (
    <Preview
      label="计时演示"
      minHeight={260}
      toolbar={<SwitchControl label="已连接（计时中）" checked={running} onCheckedChange={setRunning} />}
      code={`<ConnectionButton state="connected" elapsed={formatElapsed(seconds)} onClick={disconnect} />

// HH:MM:SS，超过 24h 显示 1d 02:03:04；用 tabular 数字避免跳动
function formatElapsed(total: number) {
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return \`\${d ? \`\${d}d \` : ''}\${p(h)}:\${p(m)}:\${p(s)}\`;
}`}
    >
      <ConnectionButton state={running ? 'connected' : 'disconnected'} elapsed={running ? formatElapsed(seconds) : undefined} onClick={() => setRunning((r) => !r)} />
      <p className="basis-full text-center font-mono text-[11px] text-fg-muted">
        90061s → {formatElapsed(90061)} · 754s → {formatElapsed(754)}
      </p>
    </Preview>
  );
}

/* ------------------------------------------------------------------ */
/* Platform snippets                                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

/** `/components/connection-button` */
export default function ConnectionButtonPage() {
  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="连接按钮"
        en="Connection Button"
        description="首页唯一主操作。四种状态、两档直径（128 / 160）、可选计时文字；connecting 外环旋转，connected 渐变 + 光晕。"
        actions={<SourceLink path="packages/ui/src/components/tp/connection-button.tsx" exports={['ConnectionButton', 'connectionStateLabel', 'type ConnectionState']} />}
      />

      <Section id="preview" title="预览" en="Preview" description="状态机演示：点击按钮走完整流程；也可以直接切换状态，或打开 Reduced motion 查看降级效果。">
        <LivePreview />
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <Anatomy
          width={128}
          pins={[
            { n: 1, label: '外环 / 光晕', note: <>connecting：2px blue-500 弧线，外扩 8px 旋转；connected：<code>brand-glow-lg</code> 光晕</>, x: 104, y: 8 },
            { n: 2, label: '圆形本体', note: <>直径 <code>size.connection-button.mobile</code> 128（desktop 160）· <code>radius.full</code> · 2px 描边</>, x: -6, y: 34 },
            { n: 3, label: 'Power 图标', note: <>lucide <code>power</code> 48px（<code>size.icon.xl</code>）· 描边 2.25 · <code>aria-hidden</code></>, x: 76, y: 60 },
            { n: 4, label: '状态文字', note: <><code>label-md</code> · 默认取 <code>connectionStateLabel[state]</code>，<code>label=null</code> 隐藏</>, x: 112, y: 80 },
            { n: 5, label: '计时', note: <><code>elapsed</code> · <code>numeric-md</code> 24/32 700 tabular · 仅 connected 时传入</>, x: 112, y: 93 },
          ]}
        >
          <ConnectionButton state="connected" elapsed="00:12:47" tabIndex={-1} />
        </Anatomy>
      </Section>

      <Section id="states" title="状态" en="States" description="四态是全产品唯一来源（BRIEF §2.3）：connected = green-500、connecting = blue-500、disconnected = slate-400、error = red-500。">
        <Grid cols={4} gap="sm">
          {STATES.map(({ value, label }) => (
            <StateTile key={value} label={label} hint={value} className="min-h-56">
              <ConnectionButton state={value} tabIndex={-1} />
            </StateTile>
          ))}
        </Grid>
        <DocTable
          caption="各状态的样式与 ARIA"
          head={
            <>
              <th>状态</th>
              <th>本体 / 描边</th>
              <th>图标</th>
              <th>外环 · 阴影</th>
              <th>文字</th>
              <th>ARIA</th>
            </>
          }
        >
          <tr>
            <td className="font-mono text-[12px]">disconnected</td>
            <td>白底 · slate-200 描边</td>
            <td>blue-500</td>
            <td>level-2；hover blue-200 描边 + level-3</td>
            <td>{connectionStateLabel.disconnected} · fg-secondary</td>
            <td className="font-mono text-[12px]">aria-checked=false</td>
          </tr>
          <tr>
            <td className="font-mono text-[12px]">connecting</td>
            <td>白底 · blue-100 描边</td>
            <td>blue-500</td>
            <td>外环 blue-500 弧线旋转 1.2s · 内圈呼吸 · level-2</td>
            <td>{connectionStateLabel.connecting} · fg-secondary</td>
            <td className="font-mono text-[12px]">aria-busy=true</td>
          </tr>
          <tr>
            <td className="font-mono text-[12px]">connected</td>
            <td>gradient.connected · 无描边</td>
            <td>白</td>
            <td>brand-glow-lg · 2.4s 呼吸</td>
            <td>{connectionStateLabel.connected} · state.connected-fg</td>
            <td className="font-mono text-[12px]">aria-checked=true</td>
          </tr>
          <tr>
            <td className="font-mono text-[12px]">error</td>
            <td>白底 · red-500 描边；hover red-50</td>
            <td>red-500</td>
            <td>level-2</td>
            <td>{connectionStateLabel.error} · state.error-fg</td>
            <td className="font-mono text-[12px]">aria-checked=false</td>
          </tr>
        </DocTable>
      </Section>

      <Section id="sizes" title="尺寸" en="Sizes" description="手机 128 · 平板 / 桌面 160（BRIEF §2.5）；图标固定 48，外环外扩 8。">
        <Preview label="尺寸对比" className="items-end gap-10" minHeight={260}>
          {(['mobile', 'desktop'] as const).map((size) => (
            <span key={size} className="flex flex-col items-center gap-3">
              <ConnectionButton state="disconnected" size={size} label={null} tabIndex={-1} />
              <span className="font-mono text-[11px] text-fg-muted">
                {size} · {token(`size.connection-button.${size}`)}
              </span>
            </span>
          ))}
        </Preview>
      </Section>

      <Section id="elapsed" title="计时" en="Elapsed" description="连接成功后显示会话时长：HH:MM:SS，超过 24h 前置天数；numeric-md tabular，数字不跳动。">
        <ElapsedDemo />
        <Prose>
          <ul>
            <li>
              计时由业务侧维护（每秒更新一次字符串），组件只负责排版；断开时不传 <code>elapsed</code>。
            </li>
            <li>首页同时显示节点摘要卡（NodeCard 简化版），不再在状态栏 / App bar 重复状态色。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="motion" title="动效与时序" en="Motion & timing">
        <TimingDiagram />
        <SubSection title="时长 token" en="Durations">
          <TokenTable
            caption="连接按钮用到的动效 token"
            rows={[
              { name: 'duration.fast', value: token('duration.fast'), preview: 'duration', description: '按压反馈 scale 0.97' },
              { name: 'duration.moderate', value: token('duration.moderate'), preview: 'duration', description: '状态间颜色 / 阴影过渡（standard）' },
              { name: 'duration.connect', value: token('duration.connect'), preview: 'duration', description: 'connecting 外环 1 圈 · 内圈呼吸周期' },
              { name: 'easing.standard', value: token('easing.standard'), preview: 'ease', description: '状态过渡' },
              { name: 'easing.spring', value: token('easing.spring'), preview: 'ease', description: '进入 connected 的弹性（原生端）' },
            ]}
          />
        </SubSection>
        <Callout tone="info" title="Reduced motion">
          <p>
            组件通过 <code>useReducedMotion()</code> 读取系统设置：外环停止旋转（静态弧线）、内圈固定 60% 不呼吸、connected 不做 2.4s 缩放，只保留颜色 /
            阴影的 150–300ms 过渡。预览工具栏的「Reduced motion」用 <code>&lt;MotionConfig reducedMotion="always"&gt;</code> 强制模拟这一行为。
          </p>
        </Callout>
      </Section>

      <Section id="error" title="错误处理与文案" en="Errors & copy" description="connecting 超时 15s 判定失败；按钮进入 error 并弹 Toast，点击即重试。不显示进度百分比，不做全屏庆祝动画。">
        <DocTable
          caption="各状态文案（zh-CN 为源，en 见语调页）"
          head={
            <>
              <th>状态</th>
              <th>zh-CN（connectionStateLabel）</th>
              <th>en</th>
            </>
          }
        >
          {STATES.map(({ value }) => (
            <tr key={value}>
              <td className="font-mono text-[12px]">{value}</td>
              <td className="text-fg-primary">{connectionStateLabel[value]}</td>
              <td className="text-fg-secondary">{EN_LABEL[value]}</td>
            </tr>
          ))}
        </DocTable>
        <Prose>
          <ul>
            <li>
              <code>label</code> 可覆盖默认文案（多语言场景传入翻译后的字符串），<code>label={'{null}'}</code> 隐藏文字但 <code>aria-label</code> 仍取默认文案。
            </li>
            <li>错误文案直接、不卖萌：「连接失败，请重试」，不出现「哎呀」「小问题」。</li>
            <li>不向用户展示技术错误码；记录日志即可。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={<ConnectionButton state="disconnected" tabIndex={-1} />}
          dont={
            <div className="flex items-center gap-6">
              <ConnectionButton state="disconnected" label={null} tabIndex={-1} buttonClassName="scale-75" />
              <ConnectionButton state="connected" label={null} tabIndex={-1} buttonClassName="scale-75" />
            </div>
          }
          doCaption="一屏只有一个连接按钮，且是首页唯一主操作。"
          dontCaption="两个连接按钮并排（如「快速连接」+「智能连接」），主操作被稀释。"
        />
        <DoDont
          do={<ConnectionButton state="connecting" tabIndex={-1} />}
          dont={
            <span className="flex flex-col items-center gap-3">
              <ConnectionButton state="connecting" label={null} tabIndex={-1} />
              <span className="text-numeric-md text-fg-primary tnum">37%</span>
            </span>
          }
          doCaption="connecting 用外环动画表达进行中。"
          dontCaption="显示百分比进度：握手没有真实进度，数字是编的。"
        />
        <DoDont
          do={
            <span className="flex flex-col items-center gap-3">
              <ConnectionButton state="error" tabIndex={-1} />
            </span>
          }
          dont={
            <span className="flex flex-col items-center gap-3">
              <ConnectionButton state="error" label="哎呀，好像出了点小问题 🥺" tabIndex={-1} />
            </span>
          }
          doCaption="错误态直接说明并给出动作：「连接失败，请重试」。"
          dontCaption="卖萌文案掩盖问题，也没有告诉用户下一步。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              控件是原生 <code>&lt;button role="switch"&gt;</code>：<code>aria-checked</code> 在 connected 时为 true；connecting 时附加{' '}
              <code>aria-busy</code>；<code>aria-label</code> 始终等于当前状态文字。
            </li>
            <li>键盘 Space / Enter 切换；聚焦环 <code>shadow-focus</code>（connected 时叠加在光晕之外）。</li>
            <li>
              触控目标 128 / 160，远超 44 最小值；<code>touch-manipulation</code> 去除 300ms 延迟。
            </li>
            <li>
              对比度：白图标在 <code>gradient.connected</code>（主体 #1677FF）上 4.10:1，图标级 ≥ 3:1 通过；blue-500 图标在白底同样 4.10:1。状态文字用 700
              阶（state.*-fg）保证 ≥ 4.5:1。
            </li>
            <li>状态变化时应由业务侧用 live region 播报（如 Toast <code>role="status"</code>），按钮本身不自行播报。</li>
            <li>reduced motion 下无循环动画，避免前庭不适。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props" description="ConnectionButtonProps = Omit<React.ComponentProps<'button'>, 'onClick' | 'children'> & { state, size?, onClick?, label?, elapsed?, buttonClassName? }">
        <PropsTable
          rows={[
            { name: 'state', type: "ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'", required: true, description: '当前连接状态；决定配色、动画与 ARIA。' },
            { name: 'size', type: "'mobile' | 'desktop'", default: "'mobile'", description: '直径 128 / 160（--spacing-connection-mobile / -desktop）。' },
            { name: 'onClick', type: 'React.MouseEventHandler<HTMLButtonElement>', description: '点击圆形控件；由业务决定连接 / 断开。' },
            { name: 'label', type: 'string | null', default: 'connectionStateLabel[state]', description: '控件下方状态文字；null 隐藏（aria-label 仍取默认文案）。' },
            { name: 'elapsed', type: 'string', description: '会话时长文字，如 "00:12:34"；numeric-md tabular。' },
            { name: 'buttonClassName', type: 'string', description: '附加到圆形控件；className 附加到外层 wrapper。' },
            { name: '...props', type: "Omit<React.ComponentProps<'button'>, 'onClick' | 'children'>", description: 'disabled、tabIndex、aria-* 等透传到圆形控件。' },
          ]}
        />
      </Section>

      <Section id="tokens" title="组件 Token" en="Component tokens">
        <TokenTable
          caption="connection-button.* 组件 token"
          showReference
          rows={[
            { name: 'connection-button.size.mobile', value: token('connection-button.size.mobile'), reference: '{size.connection-button.mobile}' },
            { name: 'connection-button.size.desktop', value: token('connection-button.size.desktop'), reference: '{size.connection-button.desktop}' },
            { name: 'connection-button.icon-size', value: token('connection-button.icon-size'), reference: '{size.icon.xl}' },
            { name: 'connection-button.ring-width', value: token('connection-button.ring-width'), reference: '{border-width.thick}' },
            { name: 'connection-button.disconnected.ring', value: token('connection-button.disconnected.ring'), reference: '{color.slate.200}', preview: 'color' },
            { name: 'connection-button.disconnected.fg', value: token('connection-button.disconnected.fg'), reference: '{color.blue.500}', preview: 'color' },
            { name: 'connection-button.connecting.ring', value: token('connection-button.connecting.ring'), reference: '{color.blue.500}', preview: 'color' },
            { name: 'connection-button.connected.fg', value: token('connection-button.connected.fg'), reference: '{color.white}', preview: 'color' },
            { name: 'connection-button.connected-gradient', value: token('connection-button.connected-gradient'), reference: '{gradient.connected}' },
            { name: 'connection-button.connected-shadow', value: token('connection-button.connected-shadow'), reference: '{elevation.brand-glow-lg}', preview: 'shadow' },
            { name: 'connection-button.duration', value: token('connection-button.duration'), reference: '{duration.connect}', preview: 'duration' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformHint
          flutter={
            <>
              <code>GestureDetector</code> + <code>AnimatedContainer</code> + <code>CustomPaint</code> 画弧；<code>AnimationController(duration:
              TpTokens.connectionButtonDuration)</code> 1200ms 循环；尺寸 <code>TpTokens.connectionButtonSizeMobile</code> 128 /{' '}
              <code>connectionButtonSizeDesktop</code> 160；光晕 <code>TpTokens.connectionButtonConnectedShadow</code>。
            </>
          }
          ios={
            <>
              <code>Circle().fill(RadialGradient(...))</code> + <code>.shadow(color: Color(TPTokens.colorBlue500).opacity(0.45), radius: 30, y: 10)</code>；外环{' '}
              <code>Circle().trim().rotationEffect</code> 以 <code>TPTokens.durationConnect</code> 1.2s 线性循环；直径 <code>TPTokens.sizeConnectionButtonMobile</code>。
            </>
          }
          dart={DART}
          dartFilename="lib/widgets/connection_button.dart"
          swift={SWIFT}
          swiftFilename="Sources/ConnectionButtonView.swift"
        />
      </Section>
    </>
  );
}
