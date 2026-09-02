import { useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronRight, Gauge, Smartphone, Wifi } from 'lucide-react';
import { Button } from '@tpvpn/ui/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@tpvpn/ui/components/ui/card';
import { Switch } from '@tpvpn/ui/components/ui/switch';
import { Label } from '@tpvpn/ui/components/ui/label';
import { Tag } from '@tpvpn/ui/components/tp/tag';
import { Callout, DoDont, Grid, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { cn } from '@/lib/cn';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSwitch } from './_parts/PropToggles';

const INTERACTIVE = 'transition-[box-shadow,border-color] duration-(--duration-base) ease-standard hover:border-border-strong hover:shadow-level-2';

const PART_ROWS = [
  { name: 'Card', type: "React.ComponentProps<'div'>", description: '容器：flex-col · gap-6 · py-6 · rounded-lg · border-border-default · bg-bg-surface · shadow-level-1。' },
  { name: 'CardHeader', type: "React.ComponentProps<'div'>", description: '标题区，px-6；含 CardAction 时自动变为两列（1fr auto）。加 border-b 时底部补 pb-6。' },
  { name: 'CardTitle', type: "React.ComponentProps<'div'>", description: '标题 · text-headline（16/24 600）。' },
  { name: 'CardDescription', type: "React.ComponentProps<'div'>", description: '说明 · text-body fg-secondary。' },
  { name: 'CardAction', type: "React.ComponentProps<'div'>", description: '标题区右上角动作位（按钮 / Tag / 图标）。' },
  { name: 'CardContent', type: "React.ComponentProps<'div'>", description: '正文，px-6；无额外样式。' },
  { name: 'CardFooter', type: "React.ComponentProps<'div'>", description: '底部动作行 · flex items-center gap-3 px-6；加 border-t 时顶部补 pt-6。' },
];

function SettingsGroupRow({ id, label, hint, checked, onChange }: { id: string; label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex min-h-control-md items-center justify-between gap-4 px-6 py-3">
      <div className="min-w-0">
        <Label htmlFor={id}>{label}</Label>
        {hint && <p className="mt-0.5 text-caption text-fg-muted">{hint}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function LinkRow({ label, value }: { label: string; value?: string }) {
  return (
    <button type="button" className="flex min-h-control-md w-full items-center justify-between gap-4 px-6 py-3 text-left transition-colors duration-(--duration-fast) hover:bg-bg-surface-hover focus-visible:z-10 focus-visible:[box-shadow:inset_var(--shadow-focus)] outline-none">
      <span className="text-label-md text-fg-primary">{label}</span>
      <span className="flex items-center gap-1.5 text-body-sm text-fg-muted">
        {value}
        <ChevronRight className="size-4 text-fg-placeholder" aria-hidden />
      </span>
    </button>
  );
}

function StatCardDemo({ icon, label, value, unit, hint }: { icon: ReactNode; label: string; value: string; unit?: string; hint?: string }) {
  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5">
        <CardDescription className="text-label-md">{label}</CardDescription>
        <CardAction className="flex size-9 items-center justify-center rounded-md bg-bg-brand-soft text-fg-brand [&_svg]:size-5">{icon}</CardAction>
      </CardHeader>
      <CardContent className="px-5">
        <p className="flex items-baseline gap-1 tnum">
          <span className="text-numeric-md text-fg-primary">{value}</span>
          {unit && <span className="text-label-md text-fg-muted">{unit}</span>}
        </p>
        {hint && <p className="mt-1 text-caption text-fg-muted">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default function CardPage() {
  const [interactive, setInteractive] = useState(false);
  const [withFooter, setWithFooter] = useState(true);
  const [withAction, setWithAction] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [killOnSleep, setKillOnSleep] = useState(false);

  const previewCode = `import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent${withFooter ? ', CardFooter' : ''}, Button, Tag } from '@tpvpn/ui';

<Card${interactive ? ` className="transition-[box-shadow,border-color] duration-(--duration-base) ease-standard hover:border-border-strong hover:shadow-level-2"` : ''}>
  <CardHeader>
    <CardTitle>当前节点</CardTitle>
    <CardDescription>JP · Tokyo #12 · IEPL 优选</CardDescription>${withAction ? `\n    <CardAction>\n      <Tag tone="success">已连接</Tag>\n    </CardAction>` : ''}
  </CardHeader>
  <CardContent>
    <dl className="grid grid-cols-3 gap-4 text-center tnum">…</dl>
  </CardContent>${withFooter ? `\n  <CardFooter>\n    <Button variant="secondary" size="sm">切换节点</Button>\n    <Button variant="ghost" size="sm">断开</Button>\n  </CardFooter>` : ''}
</Card>`;

  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="卡片"
        en="Card"
        description="内容分组的基础容器：白底、radius-lg 16、slate-200 描边、level-1 阴影。由 Header / Content / Footer 三段组成，可交互时 hover 抬升到 level-2。"
      />

      <Section id="preview" title="预览" en="Preview">
        <Preview
          label="Card 预览"
          code={previewCode}
          toolbar={
            <>
              <PropSwitch label="interactive" checked={interactive} onChange={setInteractive} />
              <PropSwitch label="action" checked={withAction} onChange={setWithAction} />
              <PropSwitch label="footer" checked={withFooter} onChange={setWithFooter} />
            </>
          }
        >
          <Card className={cn('w-full max-w-sm', interactive && INTERACTIVE)}>
            <CardHeader>
              <CardTitle>当前节点</CardTitle>
              <CardDescription>JP · Tokyo #12 · IEPL 优选</CardDescription>
              {withAction && (
                <CardAction>
                  <Tag tone="success">已连接</Tag>
                </CardAction>
              )}
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-3 gap-4 text-center tnum">
                {[
                  ['延迟', '38', 'ms'],
                  ['下行', '182', 'Mbps'],
                  ['已连接', '01:24:07', ''],
                ].map(([k, v, u]) => (
                  <div key={k} className="rounded-md bg-bg-surface-sunken py-3">
                    <dt className="text-caption text-fg-secondary">{k}</dt>
                    <dd className="mt-0.5 text-numeric-sm text-fg-primary">
                      {v}
                      {u && <span className="ml-0.5 text-caption font-normal text-fg-secondary">{u}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
            {withFooter && (
              <CardFooter>
                <Button variant="secondary" size="sm">
                  切换节点
                </Button>
                <Button variant="ghost" size="sm">
                  断开
                </Button>
              </CardFooter>
            )}
          </Card>
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy" description="七个部件都是纯 div 包装：只有类名，没有逻辑。">
        <AnatomyPins
          pins={[
            { n: 1, label: 'Card', note: 'radius-lg 16 · slate-200 描边 · level-1 · 内边距 24', x: 0, y: 0 },
            { n: 2, label: 'CardHeader', note: 'px-6 · grid，含 Action 时两列', x: 8, y: 16 },
            { n: 3, label: 'CardTitle', note: 'headline 16/24 600', x: 27, y: 12 },
            { n: 4, label: 'CardDescription', note: 'body 14/22 · fg-secondary', x: 40, y: 24 },
            { n: 5, label: 'CardAction', note: '右上角：Tag / 图标按钮', x: 92, y: 14 },
            { n: 6, label: 'CardContent', note: 'px-6 · 自由内容', x: 8, y: 54 },
            { n: 7, label: 'CardFooter', note: 'flex gap-3 px-6 · 动作从左排', x: 8, y: 88 },
          ]}
          frameClassName="w-[22rem] max-w-full"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>本月流量</CardTitle>
              <CardDescription>年付套餐 · 2026-09-01 重置</CardDescription>
              <CardAction>
                <Tag tone="brand">年付</Tag>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-numeric-md text-fg-primary tnum">
                12.4 <span className="text-label-md font-medium text-fg-muted">/ 50 GB</span>
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm">
                查看明细
              </Button>
            </CardFooter>
          </Card>
        </AnatomyPins>
        <TokenTable
          caption="Card 使用的语义 token"
          rows={[
            { name: 'color.bg.surface', value: token('color.bg.surface'), preview: 'color', description: '卡片底色' },
            { name: 'color.border.default', value: token('color.border.default'), preview: 'color', description: 'slate-200 描边' },
            { name: 'color.border.strong', value: token('color.border.strong'), preview: 'color', description: '可交互卡片 hover 描边' },
            { name: 'radius.lg', value: token('radius.lg'), preview: 'radius', description: '卡片圆角' },
            { name: 'elevation.level-1', value: token('elevation.level-1'), preview: 'shadow', description: '静态卡片' },
            { name: 'elevation.level-2', value: token('elevation.level-2'), preview: 'shadow', description: '可交互 hover / 节点卡片' },
            { name: 'space.6', value: token('space.6'), preview: 'spacing', description: '内边距 24（Web）' },
          ]}
        />
      </Section>

      <Section id="elevation" title="静态与可交互" en="Static vs interactive" description="静态卡片停在 level-1；整卡可点时 hover 抬到 level-2 + slate-300 描边，200ms standard。不做位移、不做缩放。">
        <Preview label="卡片层级" background="canvas">
          <Grid cols={2} gap="lg" className="w-full max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>静态 · level-1</CardTitle>
                <CardDescription>内容分组，本身不可点击。</CardDescription>
              </CardHeader>
              <CardContent className="text-body text-fg-secondary">阴影 0 1px 2px / 0 1px 3px，几乎只是一条更深的描边。</CardContent>
            </Card>
            <Card className={cn(INTERACTIVE, 'cursor-pointer')}>
              <CardHeader>
                <CardTitle>可交互 · hover level-2</CardTitle>
                <CardDescription>整卡是一个链接或按钮。</CardDescription>
                <CardAction>
                  <ArrowUpRight className="size-5 text-fg-placeholder" aria-hidden />
                </CardAction>
              </CardHeader>
              <CardContent className="text-body text-fg-secondary">把鼠标移上来：阴影 0 4px 12px，描边 slate-300。</CardContent>
            </Card>
          </Grid>
        </Preview>
        <Callout tone="info" title="一屏最多两个层级">
          页面里同时出现的卡片阴影不超过两级（例如 level-1 卡片 + level-3 浮层）。节点卡片（NodeCard）默认就是 level-1，hover 才 level-2。
        </Callout>
      </Section>

      <Section id="compositions" title="组合" en="Compositions">
        <SubSection title="设置分组" en="Settings group" description="去掉 Card 的默认内边距（py-0），让行自己撑高度；行间 hairline 分隔；开关行与跳转行可以混排。">
          <Preview
            label="设置分组"
            padded
            code={`<Card className="py-0 divide-y divide-border-subtle">
  <CardHeader className="pt-5 pb-3">
    <CardTitle>连接</CardTitle>
  </CardHeader>
  {/* 开关行 */}
  <div className="flex min-h-control-md items-center justify-between gap-4 px-6 py-3">
    <Label htmlFor="auto">自动连接</Label>
    <Switch id="auto" checked={autoConnect} onCheckedChange={setAutoConnect} />
  </div>
  {/* 跳转行 */}
  <button className="flex min-h-control-md w-full items-center justify-between px-6 py-3 hover:bg-bg-surface-hover">
    <span className="text-label-md">协议</span>
    <span className="text-body-sm text-fg-muted">WireGuard <ChevronRight className="size-4" /></span>
  </button>
</Card>`}
          >
            <Card className="w-full max-w-sm divide-y divide-border-subtle py-0">
              <CardHeader className="pt-5 pb-3">
                <CardTitle>连接</CardTitle>
              </CardHeader>
              <SettingsGroupRow id="cg-auto" label="自动连接" hint="启动后连接上次使用的节点" checked={autoConnect} onChange={setAutoConnect} />
              <SettingsGroupRow id="cg-sleep" label="休眠时保持连接" checked={killOnSleep} onChange={setKillOnSleep} />
              <LinkRow label="协议" value="WireGuard" />
              <LinkRow label="场景专线" value="自动最优" />
            </Card>
          </Preview>
        </SubSection>

        <SubSection title="数据卡片" en="Stat card" description="标签 label-md + 数值 numeric-md（tabular）+ 单位 label-md muted，右上角图标位用 CardAction。三张并排时用 Grid。">
          <Preview
            label="数据卡片"
            padded
            code={`<Card className="gap-4 py-5">
  <CardHeader className="px-5">
    <CardDescription className="text-label-md">今日流量</CardDescription>
    <CardAction className="flex size-9 items-center justify-center rounded-md bg-bg-brand-soft text-fg-brand">
      <Gauge className="size-5" aria-hidden />
    </CardAction>
  </CardHeader>
  <CardContent className="px-5">
    <p className="flex items-baseline gap-1 tnum">
      <span className="text-numeric-md">2.8</span>
      <span className="text-label-md text-fg-muted">GB</span>
    </p>
    <p className="mt-1 text-caption text-fg-muted">较昨日 +12%</p>
  </CardContent>
</Card>`}
          >
            <Grid cols={3} gap="md" className="w-full">
              <StatCardDemo icon={<Gauge aria-hidden />} label="今日流量" value="2.8" unit="GB" hint="较昨日 +12%" />
              <StatCardDemo icon={<Wifi aria-hidden />} label="平均延迟" value="41" unit="ms" hint="东京 · 过去 24h" />
              <StatCardDemo icon={<Smartphone aria-hidden />} label="在线设备" value="3" unit="/ 4" hint="iPhone · iPad · MacBook" />
            </Grid>
          </Preview>
        </SubSection>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          previewClassName="bg-bg-canvas"
          do={
            <Card className="w-full max-w-xs">
              <CardHeader>
                <CardTitle>节点详情</CardTitle>
                <CardDescription>JP · Tokyo #12</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button size="sm">连接</Button>
                <Button size="sm" variant="ghost">
                  收藏
                </Button>
              </CardFooter>
            </Card>
          }
          dont={
            <Card className="w-full max-w-xs">
              <CardHeader>
                <CardTitle>节点详情</CardTitle>
              </CardHeader>
              <CardContent>
                <Card className="shadow-level-2">
                  <CardContent className="text-body">嵌套的卡片</CardContent>
                </Card>
              </CardContent>
            </Card>
          }
          doCaption="一张卡一个主动作；次要动作用 ghost。"
          dontCaption="不要把卡片嵌进卡片：层级和描边会叠加，改用分隔线或凹陷面（bg-surface-sunken）。"
        />
        <DoDont
          previewClassName="bg-bg-canvas"
          do={
            <Card className="w-full max-w-xs">
              <CardHeader>
                <CardTitle>本月流量</CardTitle>
                <CardDescription>2026-09-01 重置</CardDescription>
              </CardHeader>
            </Card>
          }
          dont={
            <Card className="w-full max-w-xs rounded-sm border-2 border-blue-500 shadow-level-4">
              <CardHeader>
                <CardTitle>本月流量</CardTitle>
                <CardDescription>2026-09-01 重置</CardDescription>
              </CardHeader>
            </Card>
          }
          doCaption="保持 radius-lg 16、slate-200 描边、level-1——卡片是背景，不是主角。"
          dontCaption="不要改圆角、加粗描边或用 level-4 强调；需要强调用 Tag 或推荐态（见 PlanCard）。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              Card 是纯 <code>div</code>，没有语义。作为文章或独立区块时传 <code>role="region"</code> + <code>aria-labelledby</code> 指向 CardTitle（自行给 id）。
            </li>
            <li>
              整卡可点击时，用 <code>&lt;a&gt;</code> / <code>&lt;button&gt;</code> 作为最外层（或给 Card 传 <code>asChild</code> 风格的包装），并保证 <code>focus-visible:shadow-focus</code>；不要在卡片里再放另一个可点击整卡。
            </li>
            <li>CardTitle 渲染为 div，不会自动成为标题：页面结构需要标题层级时，在 CardTitle 内放 h3。</li>
            <li>数值用 tabular 数字（<code>tnum</code>），刷新时不会左右跳动。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props" description="七个部件都接受 React.ComponentProps<'div'>（className 通过 cn 合并），没有专属 prop。">
        <PropsTable caption="Card parts" rows={PART_ROWS} />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>&lt;Card&gt;</code></>, flutter: <><code>FCard</code> / <code>Container + BoxDecoration</code></>, ios: <><code>GroupBox</code> 自定义 / <code>VStack.background</code></> },
            { web: <><code>radius.lg 16</code></>, flutter: <><code>TpTokens.radiusLg</code></>, ios: <><code>TPTokens.radiusLg</code></> },
            { web: <><code>elevation.level-1 / level-2</code></>, flutter: <><code>TpTokens.elevationLevel1 / elevationLevel2</code></>, ios: <><code>TPTokens.elevationLevel1</code>（<code>TPShadow</code> 数组）</> },
            { web: <><code>color.border.default</code></>, flutter: <><code>TpTokens.colorBorderDefault</code></>, ios: <><code>TPTokens.colorBorderDefault</code></> },
            { web: '内边距 24（Web）', flutter: 'App 内边距 16', ios: 'App 内边距 16' },
          ]}
          dart={`import 'package:flutter/material.dart';
import 'package:tp_tokens/tp_tokens.dart';

class TpCard extends StatelessWidget {
  const TpCard({super.key, required this.child, this.padding = const EdgeInsets.all(16)});
  final Widget child;
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: TpTokens.colorBgSurface,
        borderRadius: BorderRadius.circular(TpTokens.radiusLg), // 16
        border: Border.all(color: TpTokens.colorBorderDefault),   // slate-200
        boxShadow: TpTokens.elevationLevel1,
      ),
      child: child,
    );
  }
}`}
          dartFilename="lib/widgets/tp_card.dart"
        >
          <p className="mt-3">App 端卡片内边距 16（Web 24）；标题 <code>typographyHeadline</code>，说明 <code>typographyBody</code> + <code>colorFgSecondary</code>。</p>
        </PlatformMapping>
      </Section>
    </>
  );
}
