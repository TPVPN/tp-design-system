import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { connectionStateLabel, type ConnectionState } from '@tpvpn/ui/lib/connection';
import { Flag } from '@tpvpn/ui/components/tp/flag';
import { LatencyText } from '@tpvpn/ui/components/tp/latency-text';
import { StatusDot } from '@tpvpn/ui/components/tp/status-dot';
import { Callout, DoDont, Grid, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { cn } from '@/lib/cn';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSelect } from './_parts/PropToggles';

type Size = '8' | '10' | '12';
type Pulse = 'auto' | 'true' | 'false';

const STATES: ConnectionState[] = ['connected', 'connecting', 'disconnected', 'error'];

const STATE_META: Record<ConnectionState, { token: string; text: string; fgClass: string; when: string }> = {
  connected: { token: 'color.state.connected', text: '已连接', fgClass: 'text-state-connected-fg', when: '隧道已建立；App bar、节点行、桌面菜单栏' },
  connecting: { token: 'color.state.connecting', text: '连接中…', fgClass: 'text-state-connecting-fg', when: '握手中（≤ 15 s）；默认脉冲' },
  disconnected: { token: 'color.state.disconnected', text: '未连接', fgClass: 'text-state-disconnected-fg', when: '空闲；不要用红色' },
  error: { token: 'color.state.error', text: '连接失败', fgClass: 'text-state-error-fg', when: '失败后回到 disconnected 前的短暂状态 + Toast' },
};

const NODE_ROWS: { code: string; name: string; state: ConnectionState; latencyMs: number }[] = [
  { code: 'jp', name: 'JP · Tokyo #12', state: 'connected', latencyMs: 38 },
  { code: 'hk', name: 'HK · Hong Kong #3', state: 'connecting', latencyMs: 24 },
  { code: 'sg', name: 'SG · Singapore #7', state: 'disconnected', latencyMs: 67 },
  { code: 'us', name: 'US · Los Angeles #102', state: 'error', latencyMs: 0 },
];

function InlineStatus({ state, place, size = 8 }: { state: ConnectionState; place?: string; size?: 8 | 10 | 12 }) {
  const meta = STATE_META[state];
  return (
    <span className={cn('inline-flex items-center gap-2 text-label-md', meta.fgClass)}>
      <StatusDot state={state} size={size} aria-hidden="true" />
      <span>
        {meta.text}
        {place && <span className="text-fg-muted"> · {place}</span>}
      </span>
    </span>
  );
}

export default function StatusDotPage() {
  const [state, setState] = useState<ConnectionState>('connected');
  const [size, setSize] = useState<Size>('8');
  const [pulse, setPulse] = useState<Pulse>('auto');

  const pulseProp = pulse === 'auto' ? undefined : pulse === 'true';
  const previewCode = `import { StatusDot } from '@tpvpn/ui';

<StatusDot state="${state}"${size !== '8' ? ` size={${size}}` : ''}${pulseProp !== undefined ? ` pulse={${pulseProp}}` : ''} />
{/* aria-label 默认为「${connectionStateLabel[state]}」 */}`;

  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="状态点"
        en="Status Dot"
        description="连接状态的最小表达：一个 8 / 10 / 12px 的圆点，颜色严格取自 color.state.*——connected 绿、connecting 蓝（脉冲）、disconnected 灰、error 红。全产品的连接状态颜色只有这一个来源。"
      />

      <Section id="preview" title="预览" en="Preview">
        <Preview
          label="StatusDot 预览"
          code={previewCode}
          toolbar={
            <>
              <PropSelect label="state" value={state} onChange={setState} options={STATES.map((s) => ({ value: s }))} />
              <PropSelect label="size" value={size} onChange={setSize} options={[{ value: '8' }, { value: '10' }, { value: '12' }]} />
              <PropSelect label="pulse" value={pulse} onChange={setPulse} options={[{ value: 'auto' }, { value: 'true' }, { value: 'false' }]} />
            </>
          }
        >
          <div className="flex flex-col items-center gap-4">
            <StatusDot key={`${state}-${size}-${pulse}`} state={state} size={Number(size) as 8 | 10 | 12} pulse={pulseProp} />
            <span className="text-caption text-fg-muted">
              aria-label「{connectionStateLabel[state]}」 · data-state=<code className="font-mono">{state}</code>
            </span>
          </div>
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <AnatomyPins
          className="py-16"
          pins={[
            { n: 1, label: '圆点', note: 'size 8 / 10 / 12 · radius-full · color.state.*', x: 50, y: 50 },
            { n: 2, label: '脉冲光环', note: '同色 · opacity 0.6 · animate-ping（motion-safe）· connecting 默认开启', x: 50, y: -90 },
            { n: 3, label: '可访问名称', note: 'role="img" + aria-label（默认状态文案）', x: 50, y: 190 },
          ]}
          frameClassName="p-6"
        >
          <StatusDot state="connecting" size={12} />
        </AnatomyPins>
      </Section>

      <Section id="states" title="四态" en="States" description="颜色即 token：不要在页面里用 green-500 / red-500 直接画点。">
        <Preview label="四种状态" background="surface" padded>
          <Grid cols={4} gap="lg" className="w-full">
            {STATES.map((s) => (
              <div key={s} className="flex flex-col items-center gap-3 text-center">
                <StatusDot state={s} size={12} />
                <span className="text-label-md text-fg-primary">{STATE_META[s].text}</span>
                <code className="font-mono text-[11px] text-fg-muted">{s}</code>
              </div>
            ))}
          </Grid>
        </Preview>
        <TokenTable
          caption="color.state.* — 连接状态颜色（全产品唯一来源）"
          rows={STATES.flatMap((s) => [
            { name: STATE_META[s].token, value: token(STATE_META[s].token), preview: 'color' as const, description: `${STATE_META[s].text} · 圆点` },
            { name: `${STATE_META[s].token}-fg`, value: token(`${STATE_META[s].token}-fg`), preview: 'color' as const, description: '旁边文字（700 阶，AA）' },
          ])}
        />
        <Prose>
          <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>state</th>
                <th>默认文案</th>
                <th>何时出现</th>
              </tr>
            </thead>
            <tbody>
              {STATES.map((s) => (
                <tr key={s}>
                  <td>
                    <code>{s}</code>
                  </td>
                  <td>{connectionStateLabel[s]}</td>
                  <td>{STATE_META[s].when}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Prose>
      </Section>

      <Section id="sizes" title="尺寸" en="Sizes" description="8 用于行内文字与列表行（与 label-md 对齐），10 用于 App bar / 卡片标题，12 用于首页状态区与桌面菜单栏图标。">
        <Preview label="三种尺寸" background="surface">
          <div className="flex flex-wrap items-end justify-center gap-12">
            {([8, 10, 12] as const).map((s) => (
              <div key={s} className="flex flex-col items-center gap-3">
                <StatusDot state="connected" size={s} />
                <span className="text-caption text-fg-muted tnum">{s}px</span>
              </div>
            ))}
          </div>
        </Preview>
      </Section>

      <Section id="pulse" title="脉冲" en="Pulse" description="pulse 未指定时，只有 connecting 会脉冲。它表达「正在变化」；已连接是稳态，不应该动。">
        <Preview label="脉冲对比" background="surface">
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-3">
              <StatusDot state="connecting" size={12} />
              <span className="text-caption text-fg-muted">connecting · 默认脉冲</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <StatusDot state="connecting" size={12} pulse={false} />
              <span className="text-caption text-fg-muted">pulse={'{false}'}</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <StatusDot state="connected" size={12} pulse />
              <span className="text-caption text-fg-muted">connected · pulse（仅刚连上的 1.2 s）</span>
            </div>
          </div>
        </Preview>
        <Callout tone="info" title="减弱动效">
          脉冲用 <code>motion-safe:animate-ping</code> 门控：<code>prefers-reduced-motion</code> 下光环静止显示，仍保留一圈同色半透明作为「进行中」的提示。
        </Callout>
      </Section>

      <Section id="patterns" title="模式" en="Patterns">
        <SubSection title="行内文字" en="Inline with text" description="圆点 8 + 状态文字（label-md，color.state.*-fg）+ 位置（fg-muted）。文字承载信息，圆点只是强化。">
          <Preview
            label="行内状态"
            background="surface"
            code={`<span className="inline-flex items-center gap-2 text-label-md text-state-connected-fg">
  <StatusDot state="connected" aria-hidden="true" />
  已连接<span className="text-fg-muted"> · 东京</span>
</span>`}
          >
            <div className="flex flex-col items-start gap-3">
              <InlineStatus state="connected" place="东京" />
              <InlineStatus state="connecting" place="香港" />
              <InlineStatus state="disconnected" />
              <InlineStatus state="error" place="洛杉矶" />
            </div>
          </Preview>
        </SubSection>
        <SubSection title="App bar" en="App bar" description="标题左侧 10px 圆点；连接中时脉冲，连接后静止。">
          <Preview label="App bar 状态" padded={false} background="surface">
            <div className="flex h-14 w-full max-w-sm items-center justify-between border-b border-border-default px-4">
              <InlineStatus state="connected" place="东京 #12" size={10} />
              <span className="text-caption text-fg-muted tnum">01:24:07</span>
            </div>
          </Preview>
        </SubSection>
        <SubSection title="列表行" en="In list rows" description="节点列表里，圆点放在国旗右下角或名称前；错误行的延迟显示「—」。">
          <Preview
            label="列表行中的状态点"
            padded={false}
            background="surface"
            code={`<li className="flex min-h-[64px] items-center gap-3 px-4">
  <span className="relative">
    <Flag code="jp" size={32} />
    <StatusDot state="connected" size={10} className="absolute -right-0.5 -bottom-0.5 rounded-full ring-2 ring-white" />
  </span>
  <span className="flex-1 text-headline">JP · Tokyo #12</span>
  <LatencyText ms={38} className="text-numeric-sm" />
</li>`}
          >
            <ul className="w-full max-w-md divide-y divide-border-subtle" aria-label="节点">
              {NODE_ROWS.map((row) => (
                <li key={row.code} className="flex min-h-[64px] items-center gap-3 px-4">
                  <span className="relative shrink-0">
                    <Flag code={row.code} name={row.name} size={32} />
                    <StatusDot state={row.state} size={10} className="absolute -right-0.5 -bottom-0.5 rounded-full ring-2 ring-white" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-headline text-fg-primary">{row.name}</span>
                    <span className={cn('text-caption', STATE_META[row.state].fgClass)}>{connectionStateLabel[row.state]}</span>
                  </span>
                  <LatencyText ms={row.latencyMs} className="text-numeric-sm" />
                  <ChevronRight className="size-5 text-fg-placeholder" aria-hidden />
                </li>
              ))}
            </ul>
          </Preview>
        </SubSection>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={<InlineStatus state="connected" place="东京" />}
          dont={
            <span className="inline-flex items-center gap-2">
              <StatusDot state="connected" />
              <StatusDot state="disconnected" />
            </span>
          }
          doCaption="圆点总是和文字在一起：颜色 + 文字两个信号。"
          dontCaption="不要只用颜色表达状态，也不要并排放多个圆点当图例。"
        />
        <DoDont
          do={
            <span className="inline-flex items-center gap-2 text-label-md text-state-disconnected-fg">
              <StatusDot state="disconnected" aria-hidden="true" />
              未连接
            </span>
          }
          dont={
            <span className="inline-flex items-center gap-2 text-label-md text-status-error-fg">
              <span className="size-2 rounded-full bg-red-500" aria-hidden />
              未连接
            </span>
          }
          doCaption="未连接是中性的 slate-400——用户还没做任何事。"
          dontCaption="不要把「未连接」画成红色，红色只属于 error；也不要绕过组件手绘圆点。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              根元素 <code>role="img"</code> + <code>aria-label</code>（默认 <code>connectionStateLabel[state]</code>：连接 / 连接中… / 已连接 / 连接失败，请重试）；传 <code>label</code> 可覆盖。
            </li>
            <li>
              旁边已有可见状态文字时，给圆点传 <code>aria-hidden="true"</code>，避免屏幕阅读器读两遍。
            </li>
            <li>
              状态文字用 <code>color.state.*-fg</code>（700 阶）保证 4.5:1；圆点本身是非文字元素，仅需 3:1——slate-400 在白底 2.9:1 略低，因此 disconnected 必须配文字。
            </li>
            <li>脉冲动画不携带信息，reduced motion 下静止不影响理解。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props">
        <PropsTable
          caption="StatusDot props"
          rows={[
            { name: 'state', type: "'disconnected' | 'connecting' | 'connected' | 'error'", required: true, description: 'ConnectionState（@tpvpn/ui lib/connection）；写入 data-state。' },
            { name: 'size', type: '8 | 10 | 12', default: '8', description: '直径 px。' },
            { name: 'pulse', type: 'boolean', default: 'state === "connecting"', description: '脉冲光环；未指定时仅 connecting 为 true。' },
            { name: 'label', type: 'string', default: 'connectionStateLabel[state]', description: 'aria-label。' },
            { name: 'className', type: 'string', description: '追加到根 span（定位、ring 等）。' },
            { name: '…rest', type: "Omit<React.ComponentProps<'span'>, 'children'>", description: '透传（aria-hidden、style、title…）。' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>&lt;StatusDot state="connected" /&gt;</code></>, flutter: <><code>Container(shape: circle, color: TpTokens.colorStateConnected)</code></>, ios: <><code>Circle().fill(TPTokens.colorStateConnected)</code></> },
            { web: <><code>color.state.connecting</code> + 脉冲</>, flutter: <><code>TpTokens.colorStateConnecting</code> + <code>AnimatedScale</code> / <code>ScaleTransition</code></>, ios: <><code>TPTokens.colorStateConnecting</code> + <code>.scaleEffect</code> 循环动画</> },
            { web: <><code>color.state.disconnected</code></>, flutter: <><code>TpTokens.colorStateDisconnected</code></>, ios: <><code>TPTokens.colorStateDisconnected</code></> },
            { web: <><code>color.state.error</code></>, flutter: <><code>TpTokens.colorStateError</code></>, ios: <><code>TPTokens.colorStateError</code></> },
          ]}
          dart={`import 'package:flutter/material.dart';
import 'package:tp_tokens/tp_tokens.dart';

enum ConnectionState { disconnected, connecting, connected, error }

Color stateColor(ConnectionState s) => switch (s) {
  ConnectionState.connected => TpTokens.colorStateConnected,       // green-500
  ConnectionState.connecting => TpTokens.colorStateConnecting,     // blue-500
  ConnectionState.disconnected => TpTokens.colorStateDisconnected, // slate-400
  ConnectionState.error => TpTokens.colorStateError,               // red-500
};

class StatusDot extends StatelessWidget {
  const StatusDot({super.key, required this.state, this.size = 8});
  final ConnectionState state;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: switch (state) {
        ConnectionState.connected => '已连接',
        ConnectionState.connecting => '连接中…',
        ConnectionState.disconnected => '连接',
        ConnectionState.error => '连接失败，请重试',
      },
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(shape: BoxShape.circle, color: stateColor(state)),
      ),
    );
  }
}`}
          dartFilename="lib/widgets/status_dot.dart"
          swift={`Circle()
    .fill(Color(TPTokens.colorStateConnected))
    .frame(width: 8, height: 8)
    .accessibilityLabel("已连接")`}
          swiftFilename="StatusDot.swift"
        />
      </Section>
    </>
  );
}
