import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@tpvpn/ui/components/ui/button';
import { Skeleton } from '@tpvpn/ui/components/ui/skeleton';
import { LoadingState, Spinner } from '@tpvpn/ui/components/tp/loading-state';
import { NodeCard } from '@tpvpn/ui/components/tp/node-card';
import { Tag } from '@tpvpn/ui/components/tp/tag';
import { Callout, DoDont, Grid, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSelect, PropSwitch } from './_parts/PropToggles';

type Variant = 'skeleton' | 'spinner' | 'success';

const NODES = [
  { flagCode: 'jp', title: 'JP · Tokyo #12', latencyMs: 38, loadPct: 42, badge: <Tag tone="brand">优质节点</Tag> },
  { flagCode: 'hk', title: 'HK · Hong Kong #3', latencyMs: 24, loadPct: 61 },
  { flagCode: 'us', title: 'US · Los Angeles #102', latencyMs: 146, loadPct: 28 },
];

const LOAD_MS = 1600;

/** Skeleton → content sequence with a replay button (setTimeout, 1.6 s). */
function SequenceDemo() {
  const [phase, setPhase] = useState<'loading' | 'content'>('loading');
  const [run, setRun] = useState(0);

  useEffect(() => {
    setPhase('loading');
    const timer = window.setTimeout(() => setPhase('content'), LOAD_MS);
    return () => window.clearTimeout(timer);
  }, [run]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-caption text-fg-muted tnum" aria-live="polite">
          {phase === 'loading' ? `加载中 · ${LOAD_MS} ms` : '加载完成 · 800ms 交叉淡入'}
        </span>
        <Button size="sm" variant="outline" onClick={() => setRun((n) => n + 1)}>
          <RotateCcw aria-hidden />
          重播
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {phase === 'loading'
          ? NODES.map((n) => (
              <div key={n.title} className="rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1">
                <LoadingState variant="skeleton" label={`正在加载 ${n.title}`} />
              </div>
            ))
          : NODES.map((n, i) => (
              <div key={n.title} className="animate-in fade-in-0 duration-(--duration-slower) fill-mode-both" style={{ animationDelay: `${i * 60}ms` }}>
                <NodeCard {...n} />
              </div>
            ))}
      </div>
    </div>
  );
}

function SuccessReplay({ label }: { label?: string }) {
  const [key, setKey] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <LoadingState key={key} variant="success" label={label} />
      <Button size="sm" variant="ghost" onClick={() => setKey((k) => k + 1)}>
        <RotateCcw aria-hidden />
        重播弹入
      </Button>
    </div>
  );
}

export default function LoadingPage() {
  const [variant, setVariant] = useState<Variant>('skeleton');
  const [withLabel, setWithLabel] = useState(true);
  const labels: Record<Variant, string> = { skeleton: '正在加载节点', spinner: '连接中…', success: '已连接' };
  const label = withLabel ? labels[variant] : undefined;

  const previewCode = `import { LoadingState } from '@tpvpn/ui';

<LoadingState variant="${variant}"${label ? ` label="${label}"` : ''} />`;

  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="加载状态"
        en="Loading"
        description="三种等待反馈：骨架屏用于首屏与列表、12 点式 spinner 用于操作中、绿色 check 用于完成。同一个 LoadingState 组件，通过 variant 切换；全部带 role=status。"
      />

      <Section id="preview" title="预览" en="Preview">
        <Preview
          label="LoadingState 预览"
          code={previewCode}
          minHeight={200}
          toolbar={
            <>
              <PropSelect label="variant" value={variant} onChange={setVariant} options={[{ value: 'skeleton' }, { value: 'spinner' }, { value: 'success' }]} />
              <PropSwitch label="label" checked={withLabel} onChange={setWithLabel} />
            </>
          }
        >
          <div className="w-full max-w-sm">
            <LoadingState key={`${variant}-${withLabel}`} variant={variant} label={label} className={variant === 'skeleton' ? undefined : 'mx-auto'} />
          </div>
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <Grid cols={3} gap="md">
          <AnatomyPins
            className="px-6 py-10"
            pins={[
              { n: 1, label: '头像骨架', note: '44 圆 · slate-100 · pulse', x: 9, y: 50 },
              { n: 2, label: '文本骨架', note: 'h-4 / h-3 · radius-sm · 宽 60 / 40 / 80%', x: 60, y: 22 },
            ]}
            frameClassName="w-56"
          >
            <LoadingState variant="skeleton" />
          </AnatomyPins>
          <AnatomyPins
            className="px-6 py-10"
            pins={[{ n: 3, label: 'Spinner', note: '12 点 · 28px · blue-500 · 1s / 12 步', x: 50, y: 30 }]}
          >
            <LoadingState variant="spinner" label="连接中…" />
          </AnatomyPins>
          <AnatomyPins
            className="px-6 py-10"
            pins={[
              { n: 4, label: '成功徽标', note: '56 圆 · green-50 底 · green-600 check 28', x: 50, y: 30 },
              { n: 5, label: '文字', note: 'label-md fg-primary，默认「已完成」', x: 50, y: 92 },
            ]}
          >
            <LoadingState variant="success" label="已连接" />
          </AnatomyPins>
        </Grid>
      </Section>

      <Section id="variants" title="变体" en="Variants">
        <SubSection title="骨架屏 → 内容" en="Skeleton → content" description="骨架与目标布局同尺寸；300ms 内完成则不显示骨架；完成后 slower 800ms 交叉淡入。点「重播」重新走一遍。">
          <Preview
            label="骨架屏到内容的序列"
            background="canvas"
            code={`const [phase, setPhase] = useState<'loading' | 'content'>('loading');

useEffect(() => {
  const timer = window.setTimeout(() => setPhase('content'), 1600);
  return () => window.clearTimeout(timer);
}, [run]);

{phase === 'loading'
  ? nodes.map((n) => (
      <div key={n.title} className="rounded-lg border border-border-default bg-bg-surface p-4">
        <LoadingState variant="skeleton" label={\`正在加载 \${n.title}\`} />
      </div>
    ))
  : nodes.map((n, i) => (
      <div key={n.title} className="animate-in fade-in-0 duration-(--duration-slower) fill-mode-both" style={{ animationDelay: \`\${i * 60}ms\` }}>
        <NodeCard {...n} />
      </div>
    ))}`}
          >
            <SequenceDemo />
          </Preview>
          <Callout tone="info" title="自定义骨架">
            LoadingState 的 skeleton 是「头像 + 三行」的列表行形状。其它形状用底层 <code>Skeleton</code>（<code>animate-pulse rounded-sm bg-slate-100</code>）自行拼装，尺寸对齐真实内容。
          </Callout>
          <Preview label="自定义骨架示例" background="surface" code={`import { Skeleton } from '@tpvpn/ui';

<div className="flex flex-col gap-3">
  <Skeleton className="h-6 w-40" />          {/* 标题 */}
  <Skeleton className="h-10 w-full rounded-md" /> {/* 数值行 */}
  <Skeleton className="h-2 w-full rounded-full" /> {/* 进度条 */}
</div>`}>
            <div className="flex w-full max-w-xs flex-col gap-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </Preview>
        </SubSection>

        <SubSection title="Spinner 尺寸" en="Spinner sizes" description="独立导出的 Spinner 接受 size（直径 px）。按钮内 20，卡片 / 空态 28（默认），全屏遮罩 40。">
          <Preview label="Spinner 尺寸" background="surface" code={`import { Spinner } from '@tpvpn/ui';

<Spinner size={20} />   // 按钮内（Button loading 已内置）
<Spinner />             // 28 默认
<Spinner size={40} />   // 全屏 / 面板级`}>
            <div className="flex flex-wrap items-end justify-center gap-10">
              {[20, 24, 28, 40].map((s) => (
                <div key={s} className="flex flex-col items-center gap-3">
                  <Spinner size={s} />
                  <span className="text-caption text-fg-muted tnum">{s}px</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-3">
                <Button loading>连接中…</Button>
                <span className="text-caption text-fg-muted">Button loading</span>
              </div>
            </div>
          </Preview>
        </SubSection>

        <SubSection title="成功弹入" en="Success spring" description="check 徽标以 spring（stiffness 420 · damping 22）从 0.5 缩放弹入；reduced motion 时改为 150ms 淡入。成功态 600ms 后由页面自行关闭或跳转。">
          <Preview label="成功态弹入" background="surface" minHeight={200}>
            <SuccessReplay label="兑换成功" />
          </Preview>
        </SubSection>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <Prose>
          <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>场景</th>
                <th>用哪个</th>
                <th>规则</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>首屏 / 列表加载</td>
                <td>
                  <code>skeleton</code>
                </td>
                <td>与内容布局一致；300ms 内完成则不显示；完成后 800ms 交叉淡入</td>
              </tr>
              <tr>
                <td>操作进行中（按钮）</td>
                <td>
                  <code>Button loading</code>
                </td>
                <td>按钮内 spinner 20，文字不变，按钮不可再点</td>
              </tr>
              <tr>
                <td>操作进行中（区块）</td>
                <td>
                  <code>spinner</code>
                </td>
                <td>居中 28，配一句 label（「连接中…」）；超过 15s 视为失败</td>
              </tr>
              <tr>
                <td>操作完成</td>
                <td>
                  <code>success</code>
                </td>
                <td>spring 弹入，600ms 后关闭；配合 Toast「兑换成功」</td>
              </tr>
            </tbody>
          </table>
          </div>
        </Prose>
        <DoDont
          do={
            <div className="w-56">
              <LoadingState variant="skeleton" />
            </div>
          }
          dont={
            <div className="flex flex-col items-center gap-2">
              <Spinner />
              <span className="text-caption text-fg-muted">加载列表…</span>
            </div>
          }
          doCaption="列表首屏用骨架：形状告诉用户「即将出现什么」，切换时不会跳动。"
          dontCaption="不要用居中 spinner 顶替整块列表——内容出现时布局会突变。"
        />
        <DoDont
          do={<LoadingState variant="spinner" label="连接中…" />}
          dont={
            <div className="flex items-center gap-6">
              <Spinner size={20} />
              <Spinner />
              <Spinner size={40} />
            </div>
          }
          doCaption="一次只出现一个 spinner，并说明在等什么。"
          dontCaption="不要在同一视图里放多个 spinner，也不要让它无限转而没有超时。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              三个变体根元素都是 <code>role="status"</code>；skeleton / spinner 额外 <code>aria-busy="true"</code>，spinner / success 带 <code>aria-live="polite"</code>，状态变化会被朗读且不打断当前操作。
            </li>
            <li>
              skeleton 的骨架块 <code>aria-hidden</code>，只朗读 <code>label</code>（默认「加载中」）；spinner 无 label 时有 sr-only 的「加载中」。
            </li>
            <li>
              动效尊重 <code>prefers-reduced-motion</code>：spinner 与 pulse 通过 <code>motion-safe:</code> 门控，success 的 spring 退化为 150ms 淡入。
            </li>
            <li>加载中的按钮设置 <code>aria-busy</code> 与 <code>aria-disabled</code>，而不是移出 Tab 顺序。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props">
        <PropsTable
          caption="LoadingState props"
          rows={[
            { name: 'variant', type: "'skeleton' | 'spinner' | 'success'", required: true, description: 'skeleton：头像 + 三行骨架；spinner：12 点式 28px；success：绿色 check 弹入。' },
            { name: 'label', type: 'string', description: 'skeleton → aria-label（默认「加载中」）；spinner → 下方文字（无则 sr-only「加载中」）；success → 下方文字（默认「已完成」）。' },
            { name: 'className', type: 'string', description: '追加到根元素。' },
            { name: '…rest', type: "React.ComponentProps<'div'>", description: '透传到根 div。' },
          ]}
        />
        <PropsTable
          caption="Spinner props"
          rows={[
            { name: 'size', type: 'number', default: '28', description: '直径 px；按钮内 20，面板级 40。' },
            { name: 'className', type: 'string', description: '追加类名（改颜色用 text-*，默认 text-blue-500）。' },
            { name: '…rest', type: "Omit<React.ComponentProps<'span'>, 'children'>", description: '透传到根 span（自带 aria-hidden）。' },
          ]}
        />
        <TokenTable
          caption="相关 token"
          rows={[
            { name: 'color.blue.500', value: token('color.blue.500'), preview: 'color', description: 'spinner 颜色' },
            { name: 'color.slate.100', value: token('color.slate.100'), preview: 'color', description: '骨架块' },
            { name: 'color.green.50', value: token('color.green.50'), preview: 'color', description: '成功徽标底' },
            { name: 'color.green.600', value: token('color.green.600'), preview: 'color', description: '成功 check' },
            { name: 'duration.slower', value: token('duration.slower'), preview: 'duration', description: '骨架 → 内容交叉淡入' },
            { name: 'easing.spring', value: token('easing.spring'), preview: 'ease', description: '成功弹入（CSS 等价曲线）' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>variant="skeleton"</code></>, flutter: <><code>Shimmer</code> 自绘（slate-100，1.5s）</>, ios: <><code>.redacted(reason: .placeholder)</code></> },
            { web: <><code>variant="spinner"</code></>, flutter: <><code>CupertinoActivityIndicator</code> / <code>CircularProgressIndicator(strokeWidth: 2)</code></>, ios: <><code>ProgressView()</code></> },
            { web: <><code>variant="success"</code></>, flutter: <><code>AnimatedScale</code> + <code>Curves.elasticOut</code></>, ios: <><code>.scaleEffect</code> + <code>.spring(response: 0.35)</code></> },
            { web: <><code>color.blue.500</code></>, flutter: <><code>TpTokens.colorBlue500</code></>, ios: <><code>TPTokens.colorBlue500</code></> },
          ]}
          dart={`import 'package:flutter/cupertino.dart';
import 'package:tp_tokens/tp_tokens.dart';

// 操作中：iOS 风格 12 点 spinner + 一句说明
Column(
  mainAxisSize: MainAxisSize.min,
  children: [
    const CupertinoActivityIndicator(radius: 14, color: TpTokens.colorBlue500), // 直径 28
    const SizedBox(height: 12),
    Text('连接中…', style: TpTokens.typographyLabelMd.copyWith(color: TpTokens.colorFgSecondary)),
  ],
);

// 成功：绿色 check 弹入（TpTokens.durationModerate，elasticOut）
AnimatedScale(
  scale: done ? 1 : 0.5,
  duration: TpTokens.durationModerate,
  curve: Curves.elasticOut,
  child: Container(
    width: 56, height: 56,
    decoration: const BoxDecoration(color: TpTokens.colorGreen50, shape: BoxShape.circle),
    child: const Icon(CupertinoIcons.checkmark, size: 28, color: TpTokens.colorGreen600),
  ),
);`}
          dartFilename="lib/widgets/loading_state.dart"
        />
      </Section>
    </>
  );
}
