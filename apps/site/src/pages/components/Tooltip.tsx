import { useState } from 'react';
import { Copy, Pencil, RefreshCw, Settings2, Trash2 } from 'lucide-react';
import { Button } from '@tpvpn/ui/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@tpvpn/ui/components/ui/tooltip';
import { Callout, DoDont, Kbd, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSelect } from './_parts/PropToggles';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Delay = '0' | '200' | '700';

/** Static replica of TooltipContent for the anatomy figure. */
function TooltipFacsimile() {
  return (
    <div className="relative flex flex-col items-center">
      <span className="relative z-10 rounded-sm bg-fg-primary px-2.5 py-1.5 text-caption text-white shadow-level-2">刷新延迟</span>
      <span aria-hidden className="-mt-1.5 size-2.5 rotate-45 rounded-[2px] bg-fg-primary" />
      <Button variant="ghost" size="icon" aria-label="刷新延迟" tabIndex={-1} className="pointer-events-none mt-2">
        <RefreshCw />
      </Button>
    </div>
  );
}

export default function TooltipPage() {
  const [side, setSide] = useState<Side>('top');
  const [delay, setDelay] = useState<Delay>('200');

  const previewCode = `import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Button } from '@tpvpn/ui';
import { RefreshCw } from 'lucide-react';

// TooltipProvider 放在应用根部一次即可（默认 delayDuration 200）
<TooltipProvider${delay !== '200' ? ` delayDuration={${delay}}` : ''}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="刷新延迟">
        <RefreshCw />
      </Button>
    </TooltipTrigger>
    <TooltipContent${side !== 'top' ? ` side="${side}"` : ''}>刷新延迟</TooltipContent>
  </Tooltip>
</TooltipProvider>`;

  return (
    <TooltipProvider>
      <PageHeader
        eyebrow="组件 · Components"
        title="提示"
        en="Tooltip"
        description="悬停或聚焦时出现的反色小气泡：slate-900 底、白色 caption 文字、radius-sm、200ms 延迟。只用来补充信息——尤其是图标按钮的名称与快捷键——绝不承载唯一信息。"
      />

      <Section id="preview" title="预览" en="Preview" description="把鼠标移到按钮上，或用 Tab 聚焦。切换位置与延迟。">
        <Preview
          label="Tooltip 预览"
          code={previewCode}
          minHeight={200}
          toolbar={
            <>
              <PropSelect label="side" value={side} onChange={setSide} options={[{ value: 'top' }, { value: 'right' }, { value: 'bottom' }, { value: 'left' }]} />
              <PropSelect label="delay" value={delay} onChange={setDelay} options={[{ value: '0', label: '0' }, { value: '200', label: '200' }, { value: '700', label: '700' }]} />
            </>
          }
        >
          <TooltipProvider delayDuration={Number(delay)}>
            <Tooltip key={`${side}-${delay}`}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="刷新延迟">
                  <RefreshCw />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side}>刷新延迟</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <AnatomyPins
          pins={[
            { n: 1, label: '气泡', note: 'bg-fg-primary slate-900 · 白字 caption 12/18 · radius-sm 8 · 内边距 6 / 10 · level-2 · 最大宽 20rem', x: 50, y: 12 },
            { n: 2, label: '箭头', note: '10px 旋转方块 · 与气泡同色', x: 76, y: 38 },
            { n: 3, label: '触发器', note: '任何可聚焦元素；图标按钮仍需 aria-label · 间距 sideOffset 6', x: 50, y: 82 },
          ]}
        >
          <TooltipFacsimile />
        </AnatomyPins>
        <TokenTable
          caption="Tooltip 使用的 token"
          rows={[
            { name: 'color.fg.primary', value: token('color.fg.primary'), preview: 'color', description: '气泡底（bg-inverse 同值 slate-900）' },
            { name: 'color.fg.on-inverse', value: token('color.fg.on-inverse'), preview: 'color', description: '文字 · 17.85:1' },
            { name: 'radius.sm', value: token('radius.sm'), preview: 'radius', description: '气泡圆角' },
            { name: 'elevation.level-2', value: token('elevation.level-2'), preview: 'shadow', description: '气泡阴影' },
            { name: 'duration.fast', value: token('duration.fast'), preview: 'duration', description: '进入 / 退出 100ms · 位移 4px（slide-in-from-*-1）' },
            { name: 'z-index.tooltip', value: String(token('z-index.tooltip')), description: '1400（Portal 内 z-50）' },
          ]}
        />
      </Section>

      <Section id="placements" title="位置" en="Placements" description="默认 top；空间不足时 Radix 自动翻转（avoidCollisions）。align 控制对齐（start / center / end）。">
        <Preview label="四个方向" background="surface" minHeight={220}>
          <div className="grid grid-cols-3 grid-rows-3 place-items-center gap-2">
            <span />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  top
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">上方 · 默认</TooltipContent>
            </Tooltip>
            <span />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  left
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">左侧</TooltipContent>
            </Tooltip>
            <span className="text-caption text-fg-muted">sideOffset 6</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  right
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">右侧</TooltipContent>
            </Tooltip>
            <span />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  bottom
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">下方</TooltipContent>
            </Tooltip>
            <span />
          </div>
        </Preview>
      </Section>

      <Section id="delay" title="延迟" en="Delay" description="套件把 Provider 的 delayDuration 默认改为 200ms（Radix 原生 700）：足够避免鼠标划过时闪烁，又不会让人等待。同一 Provider 内，一个 tooltip 打开后 300ms 内移到相邻触发器会立即显示（skipDelayDuration）。">
        <Preview label="工具栏上的图标按钮" background="surface" code={`<TooltipProvider>
  <div role="toolbar" aria-label="节点操作" className="flex gap-1">
    {[
      { icon: Copy, label: '复制 IP' },
      { icon: Pencil, label: '重命名' },
      { icon: Settings2, label: '节点设置' },
      { icon: Trash2, label: '移除' },
    ].map(({ icon: Icon, label }) => (
      <Tooltip key={label}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={label}><Icon /></Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    ))}
  </div>
</TooltipProvider>`}>
          <div role="toolbar" aria-label="节点操作" className="flex gap-1 rounded-lg border border-border-default bg-bg-surface p-1 shadow-level-1">
            {[
              { icon: Copy, label: '复制 IP' },
              { icon: Pencil, label: '重命名' },
              { icon: Settings2, label: '节点设置' },
              { icon: Trash2, label: '移除' },
            ].map(({ icon: Icon, label }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={label}>
                    <Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </Preview>
        <SubSection title="带快捷键" en="With shortcut">
          <Preview label="带快捷键的提示" background="surface">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">连接</Button>
              </TooltipTrigger>
              <TooltipContent>
                连接到自动最优节点
                <span className="ml-2 inline-flex gap-0.5 opacity-70">
                  <Kbd className="h-4 min-w-4 border-white/20 bg-white/10 text-white">⌘</Kbd>
                  <Kbd className="h-4 min-w-4 border-white/20 bg-white/10 text-white">K</Kbd>
                </span>
              </TooltipContent>
            </Tooltip>
          </Preview>
        </SubSection>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <Callout tone="warning" title="绝不承载唯一信息">
          触摸屏没有 hover，屏幕阅读器用户也可能跳过它。Tooltip 里的内容必须能从别处得到：图标按钮有 <code>aria-label</code>，表单说明写在 caption 里，缩写在正文里展开。手机端不使用 Tooltip——改用 Popover 或直接显示说明文字。
        </Callout>
        <DoDont
          do={
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="复制 IP 地址">
                  <Copy />
                </Button>
              </TooltipTrigger>
              <TooltipContent>复制 IP 地址</TooltipContent>
            </Tooltip>
          }
          dont={
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-body text-fg-secondary underline decoration-dotted underline-offset-4">FUP</span>
              </TooltipTrigger>
              <TooltipContent>公平使用政策：单月超过 300 GB 后限速至 10 Mbps。</TooltipContent>
            </Tooltip>
          }
          doCaption="图标按钮：aria-label 与 tooltip 文字一致，一两个词。"
          dontCaption="不要用 tooltip 解释关键规则，也不要把 tooltip 挂在不可聚焦的 span 上——这段话应该直接写在页面里。"
        />
        <DoDont
          do={
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="节点设置">
                  <Settings2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>节点设置</TooltipContent>
            </Tooltip>
          }
          dont={
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="节点设置">
                  <Settings2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-none">
                <span className="flex items-center gap-2">
                  打开节点设置
                  <Button size="sm" variant="secondary" tabIndex={-1} className="h-6 px-2 text-xs">
                    立即打开
                  </Button>
                </span>
              </TooltipContent>
            </Tooltip>
          }
          doCaption="纯文本、一行、≤ 20 字。"
          dontCaption="不要在 tooltip 里放按钮、链接或多段文字——那是 Popover。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              Radix Tooltip：hover 与 <strong>键盘聚焦</strong>都会触发；内容通过 <code>aria-describedby</code> 关联到触发器，<Kbd>Esc</Kbd> 关闭。
            </li>
            <li>
              触发器必须是可聚焦元素（Button、链接、input）。用 <code>asChild</code> 把触发行为合并到你的按钮，不要包一层 span。
            </li>
            <li>
              图标按钮的 <code>aria-label</code> 不能省——tooltip 是描述，不是名称。
            </li>
            <li>文字对比度：白字在 slate-900 上 17.85:1（AAA）。</li>
            <li>动效 100ms（fast）+ 4px 位移，reduced motion 下退化为淡入。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props">
        <PropsTable
          caption="TooltipProvider"
          rows={[
            { name: 'delayDuration', type: 'number', default: '200', description: '打开延迟 ms（套件默认 200；Radix 原生 700）。' },
            { name: 'skipDelayDuration', type: 'number', default: '300', description: '从一个 tooltip 移到相邻 tooltip 时跳过延迟的时间窗。' },
            { name: 'disableHoverableContent', type: 'boolean', default: 'false', description: '为 true 时鼠标移入气泡即关闭。' },
          ]}
        />
        <PropsTable
          caption="Tooltip（Root）"
          rows={[
            { name: 'open / defaultOpen', type: 'boolean', description: '受控 / 非受控。' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: '状态回调。' },
            { name: 'delayDuration', type: 'number', description: '覆盖 Provider 的延迟。' },
          ]}
        />
        <PropsTable
          caption="TooltipContent"
          rows={[
            { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: '首选位置；碰撞时自动翻转。' },
            { name: 'sideOffset', type: 'number', default: '6', description: '与触发器的距离 px。' },
            { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: '沿边对齐。' },
            { name: 'alignOffset', type: 'number', default: '0', description: '对齐偏移 px。' },
            { name: 'avoidCollisions', type: 'boolean', default: 'true', description: '视口内自动翻转 / 移动。' },
            { name: 'collisionPadding', type: 'number | Partial<Record<Side, number>>', default: '0', description: '碰撞检测的边距。' },
            { name: 'className', type: 'string', description: '追加类名（max-w-xs 可覆盖）。' },
          ]}
        />
        <PropsTable caption="TooltipTrigger" rows={[{ name: 'asChild', type: 'boolean', default: 'false', description: '把触发行为合并到子元素（推荐始终为 true）。' }]} />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>&lt;Tooltip&gt;</code></>, flutter: <><code>FTooltip</code> / <code>Tooltip(message:)</code>（长按触发）</>, ios: <>无 hover——用 <code>.accessibilityHint</code> + 可见标签；macOS 才有 <code>.help()</code></> },
            { web: <><code>color.fg.primary</code></>, flutter: <><code>TpTokens.colorFgPrimary</code></>, ios: <><code>TPTokens.colorFgPrimary</code></> },
            { web: <><code>radius.sm 8</code></>, flutter: <><code>TpTokens.radiusSm</code></>, ios: <><code>TPTokens.radiusSm</code></> },
            { web: <><code>typography.caption</code></>, flutter: <><code>TpTokens.typographyCaption</code></>, ios: <><code>TPTokens.typographyCaption</code></> },
          ]}
          dart={`import 'package:flutter/material.dart';
import 'package:tp_tokens/tp_tokens.dart';

// 桌面 / Web 端 Flutter 才建议使用；手机端改为可见说明
Tooltip(
  message: '刷新延迟',
  waitDuration: TpTokens.durationBase,          // 200ms
  decoration: BoxDecoration(
    color: TpTokens.colorFgPrimary,             // slate-900
    borderRadius: BorderRadius.circular(TpTokens.radiusSm), // 8
    boxShadow: TpTokens.elevationLevel2,
  ),
  textStyle: TpTokens.typographyCaption.copyWith(color: TpTokens.colorFgOnInverse),
  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
  child: IconButton(
    icon: const Icon(Icons.refresh, size: TpTokens.sizeIconSm),
    tooltip: null, // 已由外层 Tooltip 提供
    onPressed: refreshLatency,
  ),
);`}
          dartFilename="lib/widgets/tp_tooltip.dart"
        >
          <p className="mt-3">
            iOS 没有 hover 概念：图标按钮用 <code>.accessibilityLabel("刷新延迟")</code>，需要解释时用 <code>.popover</code> 或直接显示 caption。
          </p>
        </PlatformMapping>
      </Section>
    </TooltipProvider>
  );
}
