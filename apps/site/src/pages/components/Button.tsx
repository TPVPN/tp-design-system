import { useState } from 'react';
import { ArrowRight, Plus, Power, Settings } from 'lucide-react';
import { Button } from '@tpvpn/ui/components/ui/button';
import {
  Callout,
  ContrastBadge,
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
import { contrastRatio } from '@/lib/contrast';
import { token } from '@/lib/tokens';
import { Anatomy } from './_parts/Anatomy';
import { jsxAttrs, Segmented, SwitchControl } from './_parts/Controls';
import { PlatformHint } from './_parts/PlatformHint';
import { SourceLink } from './_parts/SourceLink';
import { StateTile } from './_parts/StateTile';
import { DART, SWIFT } from './_parts/buttonSnippets';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link';
type Size = 'sm' | 'md' | 'lg' | 'xl';
type IconMode = 'none' | 'leading' | 'trailing' | 'only';

const VARIANTS: { value: Variant; label: string }[] = [
  { value: 'primary', label: 'primary' },
  { value: 'secondary', label: 'secondary' },
  { value: 'ghost', label: 'ghost' },
  { value: 'outline', label: 'outline' },
  { value: 'destructive', label: 'destructive' },
  { value: 'link', label: 'link' },
];
const SIZES: { value: Size; label: string }[] = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
  { value: 'xl', label: 'xl' },
];
const ICONS: { value: IconMode; label: string }[] = [
  { value: 'none', label: '无' },
  { value: 'leading', label: '前置' },
  { value: 'trailing', label: '后置' },
  { value: 'only', label: '仅图标' },
];

const ICON_SIZE: Record<Size, 'icon-sm' | 'icon' | 'icon-lg'> = { sm: 'icon-sm', md: 'icon', lg: 'icon-lg', xl: 'icon-lg' };

const VARIANT_TOKENS: Record<Variant, { bg: string; fg: string; hint: string }> = {
  primary: { bg: 'color.action.primary.bg', fg: 'color.action.primary.fg', hint: 'action.primary.bg · blue-600' },
  secondary: { bg: 'color.action.secondary.bg', fg: 'color.action.secondary.fg', hint: 'action.secondary.* · blue-50 / blue-700' },
  ghost: { bg: 'color.bg.surface', fg: 'color.action.ghost.fg', hint: 'action.ghost.fg · 透明底' },
  outline: { bg: 'color.action.outline.bg', fg: 'color.action.outline.fg', hint: 'action.outline.border · slate-200' },
  destructive: { bg: 'color.action.destructive.bg', fg: 'color.action.destructive.fg', hint: 'action.destructive.bg · red-600' },
  link: { bg: 'color.bg.surface', fg: 'color.fg.link', hint: 'fg.link · 无高度、无内边距' },
};

function LivePreview() {
  const [variant, setVariant] = useState<Variant>('primary');
  const [size, setSize] = useState<Size>('md');
  const [icon, setIcon] = useState<IconMode>('none');
  const [pill, setPill] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);

  const sizeProp = icon === 'only' ? ICON_SIZE[size] : size;
  const attrs = jsxAttrs([
    ['variant', variant !== 'primary' && variant],
    ['size', sizeProp !== 'md' && sizeProp],
    ['pill', pill],
    ['loading', loading],
    ['disabled', disabled],
    ['aria-label', icon === 'only' && '连接'],
    ['className', fullWidth && 'w-full'],
  ]);
  const children =
    icon === 'none'
      ? '连接'
      : icon === 'leading'
        ? '\n  <Power />\n  连接\n'
        : icon === 'trailing'
          ? '\n  连接\n  <ArrowRight />\n'
          : '\n  <Power />\n';
  const iconImport = icon === 'none' ? '' : `import { ${icon === 'trailing' ? 'ArrowRight' : 'Power'} } from 'lucide-react';\n`;
  const code = `import { Button } from '@tpvpn/ui';\n${iconImport}\n<Button${attrs ? ` ${attrs}` : ''}>${children}</Button>`;

  const button = (
    <Button
      variant={variant}
      size={sizeProp}
      pill={pill}
      loading={loading}
      disabled={disabled}
      aria-label={icon === 'only' ? '连接' : undefined}
      className={fullWidth ? 'w-full' : undefined}
    >
      {icon === 'leading' && <Power />}
      {icon === 'only' && <Power />}
      {icon !== 'only' && '连接'}
      {icon === 'trailing' && <ArrowRight />}
    </Button>
  );

  return (
    <Preview
      label="按钮预览"
      code={code}
      minHeight={200}
      toolbar={
        <>
          <Segmented label="变体" value={variant} options={VARIANTS} onChange={setVariant} />
          <Segmented label="尺寸" value={size} options={SIZES} onChange={setSize} />
          <Segmented label="图标" value={icon} options={ICONS} onChange={setIcon} />
          <SwitchControl label="胶囊" checked={pill} onCheckedChange={setPill} />
          <SwitchControl label="加载" checked={loading} onCheckedChange={setLoading} />
          <SwitchControl label="禁用" checked={disabled} onCheckedChange={setDisabled} />
          <SwitchControl label="通栏" checked={fullWidth} onCheckedChange={setFullWidth} />
        </>
      }
    >
      {fullWidth ? <div className="w-full max-w-sm">{button}</div> : button}
    </Preview>
  );
}

/** `/components/button` */
export default function ButtonPage() {
  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="按钮"
        en="Button"
        description="触发操作。六种变体、四档高度加图标尺寸、胶囊与加载态；一屏只有一个 primary。"
        actions={<SourceLink path="packages/ui/src/components/ui/button.tsx" exports={['Button', 'buttonVariants']} />}
      />

      <Section id="preview" title="预览" en="Preview" description="切换 props，下方代码随之更新，可直接复制。">
        <LivePreview />
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <Anatomy
          width={168}
          pins={[
            { n: 1, label: '容器', note: <>圆角 <code>radius.md</code> 12 · 高度 <code>size.control.lg</code> 52 · 横向内边距 <code>space.6</code> 24</>, x: 0, y: -32 },
            { n: 2, label: '前置图标', note: <>20px（sm 为 16）· 与文字间距 8 · 有图标时内边距减 4</>, x: 20, y: 132 },
            { n: 3, label: '文字', note: <><code>label-lg</code>（sm / md 为 <code>label-md</code>）· 不换行</>, x: 52, y: -32 },
            { n: 4, label: '后置图标', note: <>同前置；方向性动作（继续、外链）放右侧</>, x: 84, y: 132 },
          ]}
        >
          <Button size="lg" className="w-full">
            <Power />
            连接
            <ArrowRight />
          </Button>
        </Anatomy>
      </Section>

      <Section id="variants" title="变体" en="Variants" description="颜色全部取 action.* 语义 token；白字填充一律 blue-600（4.82:1），不用 #1677FF。">
        <Grid cols={3}>
          {VARIANTS.map(({ value }) => (
            <StateTile key={value} label={value} hint={VARIANT_TOKENS[value].hint}>
              <Button variant={value}>{value === 'destructive' ? '断开连接' : value === 'link' ? '查看套餐' : '连接'}</Button>
            </StateTile>
          ))}
        </Grid>
        <Callout title="default = primary 别名">
          <p>
            为兼容 shadcn 生成的代码，<code>variant="default"</code> 与 <code>size="default"</code> 分别是 <code>primary</code> 与 <code>md</code>{' '}
            的别名，样式完全相同。新代码请写 <code>primary</code> / <code>md</code>（或直接省略，它们就是默认值）。
          </p>
        </Callout>
      </Section>

      <Section id="states" title="状态" en="States" description="hover 200ms standard；active 缩放 0.98；disabled 换 action.disabled.* 且去阴影；loading 加 spinner 并阻断点击。">
        <Grid cols={3}>
          <StateTile label="默认" hint="action.primary.bg">
            <Button>连接</Button>
          </StateTile>
          <StateTile label="悬停" hint="action.primary.bg-hover + brand-glow" simulated>
            <Button className="bg-action-primary-bg-hover shadow-brand-glow">连接</Button>
          </StateTile>
          <StateTile label="按下" hint="action.primary.bg-pressed · scale 0.98" simulated>
            <Button className="scale-[0.98] bg-action-primary-bg-pressed">连接</Button>
          </StateTile>
          <StateTile label="聚焦" hint="shadow-focus（3px · blue 32%）" simulated>
            <Button className="shadow-focus">连接</Button>
          </StateTile>
          <StateTile label="禁用" hint="disabled · action.disabled.*">
            <Button disabled>连接</Button>
          </StateTile>
          <StateTile label="加载" hint="loading · aria-busy">
            <Button loading>连接中…</Button>
          </StateTile>
        </Grid>
      </Section>

      <Section id="sizes" title="尺寸" en="Sizes" description="控件高度沿用 size.control.*：sm 36 · md 44（触控最小，默认）· lg 52 · xl 60；仅图标为正方形。">
        <Preview label="尺寸对比" className="items-end gap-3">
          {SIZES.map(({ value }) => (
            <span key={value} className="flex flex-col items-center gap-2">
              <Button size={value}>连接</Button>
              <span className="font-mono text-[11px] text-fg-muted">
                {value} · {token(`size.control.${value}`)}
              </span>
            </span>
          ))}
          <span className="mx-1 h-11 w-px self-center bg-border-default" aria-hidden />
          {(['icon-sm', 'icon', 'icon-lg'] as const).map((s) => (
            <span key={s} className="flex flex-col items-center gap-2">
              <Button size={s} variant="outline" aria-label="设置">
                <Settings />
              </Button>
              <span className="font-mono text-[11px] text-fg-muted">{s}</span>
            </span>
          ))}
        </Preview>
        <TokenTable
          caption="按钮尺寸 token"
          rows={[
            { name: 'button.height.sm', value: token('button.height.sm'), reference: '{size.control.sm}', description: '小按钮 · 表单行内' },
            { name: 'button.height.md', value: token('button.height.md'), reference: '{size.control.md}', description: '默认 · 触控最小 44' },
            { name: 'button.height.lg', value: token('button.height.lg'), reference: '{size.control.lg}', description: '页面主操作' },
            { name: 'size.control.xl', value: token('size.control.xl'), description: 'xl · 官网 Hero CTA' },
            { name: 'button.padding-x.sm', value: token('button.padding-x.sm'), reference: '{space.3}', preview: 'spacing' },
            { name: 'button.padding-x.md', value: token('button.padding-x.md'), reference: '{space.5}', preview: 'spacing' },
            { name: 'button.padding-x.lg', value: token('button.padding-x.lg'), reference: '{space.6}', preview: 'spacing' },
            { name: 'button.radius', value: token('button.radius'), reference: '{radius.md}', preview: 'radius' },
          ]}
        />
      </Section>

      <Section id="icons" title="图标与通栏" en="Icons & full width" description="lucide 图标直接作为子元素，尺寸由按钮控制（20 / sm 16）；仅图标按钮必须有 aria-label。">
        <Grid cols={2}>
          <StateTile label="前置图标" hint="<Plus /> 添加设备">
            <Button variant="secondary">
              <Plus />
              添加设备
            </Button>
          </StateTile>
          <StateTile label="后置图标" hint="继续 <ArrowRight />">
            <Button>
              继续
              <ArrowRight />
            </Button>
          </StateTile>
          <StateTile label="仅图标" hint='size="icon" aria-label="设置"'>
            <Button size="icon" variant="ghost" aria-label="设置">
              <Settings />
            </Button>
          </StateTile>
          <StateTile label="通栏（手机）" hint='className="w-full" · size="lg"'>
            <div className="w-full max-w-[280px]">
              <Button size="lg" className="w-full">
                连接
              </Button>
            </div>
          </StateTile>
        </Grid>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={
            <div className="flex gap-2">
              <Button>连接</Button>
              <Button variant="secondary">选择节点</Button>
            </div>
          }
          dont={
            <div className="flex gap-2">
              <Button>连接</Button>
              <Button>选择节点</Button>
            </div>
          }
          doCaption="一屏只有一个 primary；次要动作用 secondary / ghost 分层。"
          dontCaption="并排两个 primary，主次不分，用户不知道该点哪个。"
        />
        <DoDont
          do={<Button loading>连接中…</Button>}
          dont={<Button loading aria-label="连接中" />}
          doCaption="加载时保留文字并改为进行时，宽度稳定、状态可读。"
          dontCaption="只剩 spinner，按钮宽度跳变，屏幕阅读器只能读到 aria-busy。"
        />
        <DoDont
          do={
            <div className="flex gap-2">
              <Button variant="ghost">取消</Button>
              <Button variant="destructive">断开连接</Button>
            </div>
          }
          dont={
            <div className="flex gap-2">
              <Button variant="destructive">取消</Button>
              <Button>确定</Button>
            </div>
          }
          doCaption="文案写清楚动作（「断开连接」），destructive 只用于真正的破坏性操作。"
          dontCaption="「确定 / 取消」不说明后果；把 destructive 用在「取消」上误导用户。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              原生 <code>&lt;button&gt;</code>（<code>asChild</code> 时用 Radix Slot 渲染子元素，例如 <code>&lt;a&gt;</code>），键盘 Space / Enter 触发。
            </li>
            <li>
              <code>focus-visible</code> 显示聚焦环 <code>shadow-focus</code>；鼠标点击不显示。
            </li>
            <li>
              <code>loading</code> 同时设置 <code>aria-busy</code> 与 <code>aria-disabled</code>，并在 <code>onClick</code> 前 <code>preventDefault</code>；
              spinner <code>aria-hidden</code>。
            </li>
            <li>
              仅图标按钮必须提供 <code>aria-label</code>；图标本身 <code>aria-hidden</code>（lucide 默认）。
            </li>
            <li>高度 ≥ 44 满足触控最小尺寸；sm 36 仅用于桌面密集界面。</li>
          </ul>
        </Prose>
        <SubSection title="文字对比度" en="Text contrast">
          <DocTable
            caption="各变体文字与底色的对比度"
            head={
              <>
                <th>变体</th>
                <th>文字</th>
                <th>底色</th>
                <th>对比度</th>
              </>
            }
          >
            {VARIANTS.map(({ value }) => {
              const fg = token(VARIANT_TOKENS[value].fg);
              const bg = token(VARIANT_TOKENS[value].bg);
              return (
                <tr key={value}>
                  <td className="font-mono text-[13px] text-fg-primary">{value}</td>
                  <td className="font-mono text-[12px] text-fg-secondary">{fg}</td>
                  <td className="font-mono text-[12px] text-fg-secondary">{bg}</td>
                  <td>
                    <ContrastBadge fg={fg} bg={bg} label={`${value} 文字对比度 ${contrastRatio(fg, bg)}:1`} />
                  </td>
                </tr>
              );
            })}
          </DocTable>
        </SubSection>
      </Section>

      <Section id="props" title="属性" en="Props" description="ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?, loading? }">
        <PropsTable
          rows={[
            {
              name: 'variant',
              type: "'primary' | 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'",
              default: "'primary'",
              description: '视觉变体；default 是 primary 的 shadcn 别名。',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'default' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg'",
              default: "'md'",
              description: '高度 36 / 44 / 52 / 60；icon* 为正方形 36 / 44 / 52。default 是 md 的别名。',
            },
            { name: 'pill', type: 'boolean', default: 'false', description: '圆角改为 full（胶囊）。' },
            { name: 'loading', type: 'boolean', default: 'false', description: '前置 spinner，设置 aria-busy / aria-disabled 并阻断点击，保留变体颜色。' },
            { name: 'asChild', type: 'boolean', default: 'false', description: '用 Radix Slot 渲染唯一子元素（如 <a>、<Link>）；此时不注入 spinner。' },
            { name: 'disabled', type: 'boolean', default: 'false', description: '原生禁用：action.disabled.* 配色、去阴影、pointer-events: none。' },
            { name: '...props', type: "React.ComponentProps<'button'>", description: 'type、onClick、className、aria-* 等透传到根元素。' },
          ]}
        />
        <Callout tone="info">
          站内导航请用 <code>@/components/docs</code> 的 <code>&lt;ButtonLink&gt;</code>（React Router <code>Link</code> + 同一套 <code>buttonVariants</code>），
          外部链接用 <code>&lt;a className={'{buttonVariants({ variant, size })}'}&gt;</code>。
        </Callout>
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformHint
          flutter={
            <>
              forui <code>FButton</code>（<code>FButtonStyle.primary</code>）或 <code>FilledButton</code>：高度 <code>TpTokens.sizeControlMd</code>{' '}
              44、圆角 <code>TpTokens.radiusMd</code> 12、底色 <code>TpTokens.colorActionPrimaryBg</code>、文字 <code>TpTokens.typographyLabelMd</code>。
            </>
          }
          ios={
            <>
              SwiftUI 自定义 <code>ButtonStyle</code>（或 UIKit <code>UIButton.Configuration.filled()</code>）：<code>TPTokens.sizeControlMd</code>、
              <code>TPTokens.radiusMd</code>（<code>.continuous</code>）、<code>TPTokens.colorActionPrimaryBg</code>；按下 scale 0.98。
            </>
          }
          dart={DART}
          dartFilename="lib/widgets/primary_button.dart"
          swift={SWIFT}
          swiftFilename="Sources/PrimaryButtonStyle.swift"
        />
      </Section>
    </>
  );
}
