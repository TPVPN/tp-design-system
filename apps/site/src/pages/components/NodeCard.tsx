import { useState } from 'react';
import { Zap } from 'lucide-react';
import { latencyBars, latencyTone, LoadingState, NodeCard, Tag } from '@tpvpn/ui';
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
  TokenTable,
} from '@/components/docs';
import { token } from '@/lib/tokens';
import { Anatomy } from './_parts/Anatomy';
import { jsxAttrs, Segmented, SwitchControl } from './_parts/Controls';
import { NODES } from './_parts/demoData';
import { PlatformHint } from './_parts/PlatformHint';
import { SourceLink } from './_parts/SourceLink';
import { StateTile } from './_parts/StateTile';
import { DART } from './_parts/nodeCardSnippets';

type IconMode = 'flag' | 'globe' | 'custom';
type LatencyChoice = '38' | '95' | '160' | '240';

const LATENCIES: { value: LatencyChoice; label: string }[] = [
  { value: '38', label: '38 ms' },
  { value: '95', label: '95 ms' },
  { value: '160', label: '160 ms' },
  { value: '240', label: '240 ms' },
];

const TONE_LABEL = { good: '绿 · good', fair: '黄 · fair', poor: '红 · poor', idle: '灰 · idle' } as const;

function LivePreview() {
  const [iconMode, setIconMode] = useState<IconMode>('flag');
  const [latency, setLatency] = useState<LatencyChoice>('38');
  const [badge, setBadge] = useState(true);
  const [subtitle, setSubtitle] = useState(true);
  const [selected, setSelected] = useState(false);
  const [interactive, setInteractive] = useState(true);

  const latencyMs = Number(latency);
  const title = iconMode === 'custom' ? '智能选路' : 'US · Los Angeles #102';
  const sub = iconMode === 'custom' ? '自动选择最快节点' : '美国 · 洛杉矶';

  const attrs = [
    iconMode === 'flag' ? `flagCode="us"` : iconMode === 'custom' ? `icon={<Zap />}` : null,
    `title="${title}"`,
    subtitle ? `subtitle="${sub}"` : null,
    badge ? `badge={<Tag tone="brand">优质节点</Tag>}` : null,
    jsxAttrs([
      ['latencyMs', latencyMs],
      ['loadPct', 21],
      ['selected', selected],
    ]),
    interactive ? `onSelect={() => select('us-102')}` : null,
  ].filter(Boolean);
  const code = `import { NodeCard, Tag } from '@tpvpn/ui';${iconMode === 'custom' ? "\nimport { Zap } from 'lucide-react';" : ''}

<NodeCard
  ${attrs.join('\n  ')}
/>`;

  return (
    <Preview
      label="节点卡片预览"
      code={code}
      toolbar={
        <>
          <Segmented
            label="图标"
            value={iconMode}
            options={[
              { value: 'flag', label: '国旗' },
              { value: 'globe', label: '地球' },
              { value: 'custom', label: '自定义' },
            ]}
            onChange={setIconMode}
          />
          <Segmented label="延迟" value={latency} options={LATENCIES} onChange={setLatency} />
          <SwitchControl label="徽标" checked={badge} onCheckedChange={setBadge} />
          <SwitchControl label="副标题" checked={subtitle} onCheckedChange={setSubtitle} />
          <SwitchControl label="选中" checked={selected} onCheckedChange={setSelected} />
          <SwitchControl label="可点击" checked={interactive} onCheckedChange={setInteractive} />
        </>
      }
    >
      <div className="w-full max-w-[400px]">
        <NodeCard
          flagCode={iconMode === 'flag' ? 'us' : undefined}
          icon={iconMode === 'custom' ? <Zap className="size-6" strokeWidth={1.75} aria-hidden /> : undefined}
          title={title}
          subtitle={subtitle ? sub : undefined}
          badge={badge ? <Tag tone="brand">优质节点</Tag> : undefined}
          latencyMs={latencyMs}
          loadPct={21}
          selected={selected}
          onSelect={interactive ? () => setSelected((s) => !s) : undefined}
        />
      </div>
    </Preview>
  );
}

function ListDemo() {
  const [selectedId, setSelectedId] = useState<string>('hk-07');
  return (
    <Preview
      label="节点列表演示"
      padded
      centered={false}
      code={`const [selectedId, setSelectedId] = useState('hk-07');

<div className="flex flex-col gap-3">
  {nodes.map((n) => (
    <NodeCard
      key={n.id}
      flagCode={n.flagCode}
      title={n.title}
      subtitle={n.subtitle}
      badge={n.premium ? <Tag tone="brand">优质节点</Tag> : undefined}
      latencyMs={n.latencyMs}
      loadPct={n.loadPct}
      selected={n.id === selectedId}
      onSelect={() => setSelectedId(n.id)}
    />
  ))}
</div>`}
    >
      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-3">
        {NODES.slice(0, 3).map((n) => (
          <NodeCard
            key={n.id}
            flagCode={n.flagCode}
            title={n.title}
            subtitle={n.subtitle}
            badge={n.premium ? <Tag tone="brand">优质节点</Tag> : undefined}
            latencyMs={n.latencyMs}
            loadPct={n.loadPct}
            selected={n.id === selectedId}
            onSelect={() => setSelectedId(n.id)}
          />
        ))}
        <p className="text-center text-caption text-fg-muted tnum">
          已选择：<span className="text-fg-primary">{NODES.find((n) => n.id === selectedId)?.title}</span>
        </p>
      </div>
    </Preview>
  );
}

/** `/components/node-card` */
export default function NodeCardPage() {
  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="节点卡片"
        en="Node Card"
        description="首页节点摘要与推荐节点：国旗或地球图标、标题、优质节点徽标、延迟与负载、四格信号条、chevron。"
        actions={<SourceLink path="packages/ui/src/components/tp/node-card.tsx" exports={['NodeCard']} />}
      />

      <Section id="preview" title="预览" en="Preview" description="延迟切换会同时改变延迟文字颜色与信号条；选中态为 blue-500 描边 + blue-50 底。">
        <LivePreview />
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <Anatomy
          width={380}
          pins={[
            { n: 1, label: '国旗 / 图标', note: <>圆旗 40（<code>size.flag.lg</code>）置于 44 圆形底；无国旗时 <code>globe</code> 24 或自定义 <code>icon</code></>, x: 8, y: -28 },
            { n: 2, label: '标题', note: <><code>headline</code> 16/24 600 · 格式「US · Los Angeles #102」· 超长截断</>, x: 34, y: -28 },
            { n: 3, label: '徽标', note: <><code>badge</code> · 通常 <code>&lt;Tag tone="brand"&gt;优质节点&lt;/Tag&gt;</code></>, x: 63, y: -28 },
            { n: 4, label: '元数据行', note: <><code>caption</code> fg-muted · 副标题 · 延迟（<code>LatencyText</code> 着色、tabular）· 负载 %</>, x: 34, y: 128 },
            { n: 5, label: '信号条', note: <><code>SignalBars</code> 4 格，宽 3 间距 2，高 5 / 8 / 11 / 14，按延迟着色 · <code>role="img"</code></>, x: 84, y: 128 },
            { n: 6, label: 'chevron', note: <><code>chevron-right</code> 20 · fg-placeholder · 表示可进入详情 / 可选</>, x: 96, y: -28 },
          ]}
        >
          <NodeCard flagCode="us" title="US · Los Angeles #102" subtitle="美国 · 洛杉矶" badge={<Tag tone="brand">优质节点</Tag>} latencyMs={38} loadPct={21} />
        </Anatomy>
      </Section>

      <Section id="states" title="状态" en="States" description="容器：白底 · radius-lg 16 · slate-200 描边 · level-1；hover 描边 slate-300 + level-2；选中 blue-500 描边 + blue-50 底；按下缩放 0.995。">
        <Grid cols={2}>
          <StateTile label="默认" hint="level-1 · border-default" className="px-4">
            <NodeCard className="w-full" flagCode="jp" title="JP · Tokyo #12" latencyMs={58} loadPct={38} />
          </StateTile>
          <StateTile label="悬停" hint="border-strong · level-2" simulated className="px-4">
            <NodeCard className="w-full border-border-strong shadow-level-2" flagCode="jp" title="JP · Tokyo #12" latencyMs={58} loadPct={38} />
          </StateTile>
          <StateTile label="选中" hint="selected · blue-500 / blue-50" className="px-4">
            <NodeCard className="w-full" flagCode="jp" title="JP · Tokyo #12" latencyMs={58} loadPct={38} selected onSelect={() => {}} />
          </StateTile>
          <StateTile label="聚焦" hint="shadow-focus（onSelect 时可聚焦）" simulated className="px-4">
            <NodeCard className="w-full shadow-focus" flagCode="jp" title="JP · Tokyo #12" latencyMs={58} loadPct={38} onSelect={() => {}} />
          </StateTile>
          <StateTile label="静态（无 onSelect）" hint="渲染为 <div>，无 hover 抬升外的交互" className="px-4">
            <NodeCard className="w-full" flagCode="jp" title="JP · Tokyo #12" latencyMs={58} loadPct={38} />
          </StateTile>
          <StateTile label="加载中" hint='<LoadingState variant="skeleton" /> 放在同尺寸卡框内' className="px-4">
            <div className="w-full rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1">
              <LoadingState variant="skeleton" label="加载节点" />
            </div>
          </StateTile>
        </Grid>
      </Section>

      <Section id="latency" title="延迟着色" en="Latency colouring" description="全产品统一规则（模式 · 节点列表）：< 80 ms 绿 · 80–180 ms 黄 · > 180 ms 红；信号条 <80 四格、<120 三格、<180 两格、其余一格。">
        <div className="my-6 flex flex-col gap-3">
          {NODES.map((n) => (
            <NodeCard
              key={n.id}
              flagCode={n.flagCode}
              title={n.title}
              subtitle={n.subtitle}
              badge={n.premium ? <Tag tone="brand">优质节点</Tag> : undefined}
              latencyMs={n.latencyMs}
              loadPct={n.loadPct}
            />
          ))}
        </div>
        <DocTable
          caption="四个示例延迟对应的文字色调与信号格数"
          head={
            <>
              <th>延迟</th>
              <th>文字色调（latencyTone）</th>
              <th>文字 token</th>
              <th>信号格（latencyBars）</th>
              <th>信号色 token</th>
            </>
          }
        >
          {NODES.map((n) => {
            const textTone = latencyTone(n.latencyMs);
            const bars = latencyBars(n.latencyMs);
            return (
              <tr key={n.id}>
                <td className="font-mono text-[13px] text-fg-primary tnum">{n.latencyMs} ms</td>
                <td>{TONE_LABEL[textTone]}</td>
                <td className="font-mono text-[12px] text-fg-secondary">
                  color.latency.{textTone}-fg · {token(`color.latency.${textTone}-fg`)}
                </td>
                <td className="tnum">{bars.bars} / 4</td>
                <td className="font-mono text-[12px] text-fg-secondary">
                  color.latency.{bars.tone} · {token(`color.latency.${bars.tone}`)}
                </td>
              </tr>
            );
          })}
        </DocTable>
        <Callout tone="info">
          <p>
            延迟文字与信号条各自取色：文字按 <code>latencyTone</code>（80–180 为黄），信号条按 <code>latencyBars</code>（80–119 仍是三格绿）。95 ms 因此显示「黄字 +
            三格绿条」，这是当前实现的真实行为；负载数值不着色。
          </p>
        </Callout>
      </Section>

      <Section id="icon" title="国旗与地球图标" en="Flag vs. globe" description="有具体国家 / 地区时传 flagCode；「智能选路」等聚合节点不传 flagCode，默认显示 globe，也可传自定义图标。">
        <Grid cols={3} gap="sm">
          <StateTile label="国旗" hint='flagCode="hk"' className="px-3">
            <NodeCard className="w-full p-3" flagCode="hk" title="HK · Hong Kong #07" latencyMs={38} loadPct={21} />
          </StateTile>
          <StateTile label="地球（默认）" hint="无 flagCode → <Globe />" className="px-3">
            <NodeCard className="w-full p-3" title="智能选路" subtitle="自动最优" latencyMs={24} loadPct={40} />
          </StateTile>
          <StateTile label="自定义图标" hint="icon={<Zap />}" className="px-3">
            <NodeCard className="w-full p-3" icon={<Zap className="size-6" strokeWidth={1.75} aria-hidden />} title="游戏加速" subtitle="场景专线" latencyMs={31} loadPct={12} />
          </StateTile>
        </Grid>
      </Section>

      <Section id="load" title="负载" en="Load" description="loadPct 取整并限制在 0–100，仅显示数值；负载警示由列表排序与场景推荐承担，不在卡片上着色。">
        <Grid cols={2} gap="sm">
          {[21, 58, 83, 97].map((load) => (
            <StateTile key={load} label={`负载 ${load}%`} hint={`loadPct={${load}}`} className="px-3">
              <NodeCard className="w-full p-3" flagCode="sg" title="SG · Singapore #03" latencyMs={71} loadPct={load} />
            </StateTile>
          ))}
        </Grid>
      </Section>

      <Section id="list" title="列表" en="List" description="三张卡片纵向堆叠、间距 12；单选时只有一张 selected，点击切换。">
        <ListDemo />
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={
            <div className="w-full max-w-[320px]">
              <NodeCard flagCode="us" title="US · Los Angeles #102" badge={<Tag tone="brand">优质节点</Tag>} latencyMs={38} loadPct={21} />
            </div>
          }
          dont={
            <div className="w-full max-w-[320px]">
              <NodeCard
                flagCode="us"
                title="US · Los Angeles #102"
                badge={
                  <span className="flex gap-1">
                    <Tag tone="brand">优质节点</Tag>
                    <Tag tone="game">游戏</Tag>
                    <Tag tone="ai">AI</Tag>
                  </span>
                }
                latencyMs={38}
                loadPct={21}
              />
            </div>
          }
          doCaption="标题后最多一个徽标；场景信息放在列表分组或副标题。"
          dontCaption="多个标签挤在标题旁，标题被截断、行高不稳。"
        />
        <DoDont
          do={
            <div className="w-full max-w-[320px]">
              <NodeCard flagCode="jp" title="JP · Tokyo #12" subtitle="日本 · 东京" latencyMs={58} loadPct={38} onSelect={() => {}} />
            </div>
          }
          dont={
            <div className="w-full max-w-[320px]">
              <NodeCard flagCode="jp" title="日本东京高速游戏专线节点（推荐使用）#12" latencyMs={58} loadPct={38} onSelect={() => {}} />
            </div>
          }
          doCaption="标题用「国家代码 · 城市 #编号」，本地化名称放副标题。"
          dontCaption="营销式长标题被截断，关键的编号看不见。"
        />
        <DoDont
          do={
            <div className="w-full max-w-[320px]">
              <NodeCard flagCode="de" title="DE · Frankfurt #03" latencyMs={240} loadPct={97} />
            </div>
          }
          dont={
            <div className="w-full max-w-[320px]">
              <NodeCard flagCode="de" title="DE · Frankfurt #03" latencyMs={240} loadPct={97} className="border-status-error-border bg-status-error-bg" />
            </div>
          }
          doCaption="高延迟只通过延迟文字和信号条表达。"
          dontCaption="整卡染红：卡片背景不是状态载体，与 error 语义混淆。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              传入 <code>onSelect</code> 时整卡渲染为 <code>&lt;button aria-pressed={'{selected}'}&gt;</code>，键盘 Space / Enter 触发，聚焦环{' '}
              <code>shadow-focus</code>；不传时是普通 <code>&lt;div&gt;</code>（仍可挂 <code>onClick</code>）。
            </li>
            <li>
              国旗 <code>alt</code> 默认为大写国家代码（如「US」）；<code>SignalBars</code> 为 <code>role="img"</code>，<code>aria-label</code> 读作「延迟 38 ms」。
            </li>
            <li>延迟带「ms」单位文字，颜色不是唯一信息；信号格数同样传达等级。</li>
            <li>卡片高度 ≥ 76（内边距 16 + 44 图标区），满足触控目标。</li>
            <li>
              文字对比度：标题 slate-900 17.9:1；元数据 fg-muted slate-500 4.76:1（AA）；延迟 700 阶色 ≥ 4.5:1；选中态 blue-50 底上依然达标。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props" description="NodeCardProps = Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onSelect'> & { … }">
        <PropsTable
          rows={[
            { name: 'title', type: 'string', required: true, description: '主标题，如 "US · Los Angeles #102"。' },
            { name: 'latencyMs', type: 'number', required: true, description: '延迟毫秒；决定文字色与信号条。非正数 / 非有限值显示「—」与空信号条。' },
            { name: 'loadPct', type: 'number', required: true, description: '负载 0–100，取整并夹取。' },
            { name: 'flagCode', type: 'string', description: 'ISO 3166-1 alpha-2；有值时渲染 40px 圆旗。' },
            { name: 'icon', type: 'React.ReactNode', description: '无 flagCode 时的前置图标；默认 <Globe />。' },
            { name: 'subtitle', type: 'string', description: '元数据行首段，如本地化城市名。' },
            { name: 'badge', type: 'React.ReactNode', description: '标题右侧徽标，通常为 <Tag tone="brand">优质节点</Tag>。' },
            { name: 'selected', type: 'boolean', default: 'false', description: '选中态：blue-500 描边、blue-50 底、图标区 blue-100。' },
            { name: 'onSelect', type: '() => void', description: '提供时整卡为 <button>（aria-pressed）；与 onClick 同时触发。' },
            { name: '...props', type: "Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onSelect'>", description: 'className、onClick、data-* 等透传到根元素。' },
          ]}
        />
      </Section>

      <Section id="tokens" title="组件 Token" en="Component tokens">
        <TokenTable
          caption="node-card.* 组件 token"
          rows={[
            { name: 'node-card.radius', value: token('node-card.radius'), reference: '{radius.lg}', preview: 'radius' },
            { name: 'node-card.padding', value: token('node-card.padding'), reference: '{space.4}', preview: 'spacing' },
            { name: 'node-card.gap', value: token('node-card.gap'), reference: '{space.3}', preview: 'spacing' },
            { name: 'node-card.bg', value: token('node-card.bg'), reference: '{color.bg.surface}', preview: 'color' },
            { name: 'node-card.border', value: token('node-card.border'), reference: '{color.border.default}', preview: 'color' },
            { name: 'node-card.shadow', value: token('node-card.shadow'), reference: '{elevation.level-1}', preview: 'shadow' },
            { name: 'node-card.shadow-hover', value: token('node-card.shadow-hover'), reference: '{elevation.level-2}', preview: 'shadow' },
            { name: 'node-card.title-fg', value: token('node-card.title-fg'), reference: '{color.fg.primary}', preview: 'color' },
            { name: 'node-card.meta-fg', value: token('node-card.meta-fg'), reference: '{color.fg.muted}', preview: 'color' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformHint
          flutter={
            <>
              forui <code>FCard</code> 或 <code>Container(decoration: BoxDecoration(borderRadius: TpTokens.nodeCardRadius, boxShadow: TpTokens.nodeCardShadow))</code>；标题{' '}
              <code>TpTokens.typographyHeadline</code>，元数据 <code>typographyCaption</code> + <code>nodeCardMetaFg</code>，延迟色 <code>TpTokens.colorLatencyGoodFg</code> 等。
            </>
          }
          ios={
            <>
              <code>HStack</code> 放在 <code>RoundedRectangle(cornerRadius: TPTokens.nodeCardRadius, style: .continuous)</code> 背景上，描边{' '}
              <code>TPTokens.nodeCardBorder</code>，阴影 <code>TPTokens.nodeCardShadow</code>；整卡 <code>Button</code> + <code>.accessibilityAddTraits(.isSelected)</code>。
            </>
          }
          dart={DART}
          dartFilename="lib/widgets/node_card.dart"
        />
      </Section>
    </>
  );
}
