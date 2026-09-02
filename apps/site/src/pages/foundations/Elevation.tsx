import { Check, Power } from 'lucide-react';
import { Button, Flag, Input, Switch } from '@tpvpn/ui';
import { Callout, DoDont, PageHeader, Preview, Prose, Section, TokenTable } from '@/components/docs';
import { brandUrl } from '@/lib/assets';
import { cn } from '@/lib/cn';
import { token, tokensByPrefix } from '@/lib/tokens';
import { CopyName } from './_parts/CopyName';
import { PlatformSnippets } from './_parts/PlatformSnippets';

/** Static class map so Tailwind can see every utility (no template literals). */
const LEVELS: { key: string; className: string; title: string; usage: string }[] = [
  { key: 'level-0', className: 'shadow-level-0', title: '0', usage: '平面元素、列表项' },
  { key: 'level-1', className: 'shadow-level-1', title: '1', usage: '静态卡片' },
  { key: 'level-2', className: 'shadow-level-2', title: '2', usage: '节点卡片、下拉、hover 抬起' },
  { key: 'level-3', className: 'shadow-level-3', title: '3', usage: '浮层 / Sheet / Popover' },
  { key: 'level-4', className: 'shadow-level-4', title: '4', usage: 'Modal' },
];

function LevelCards() {
  return (
    <Preview background="canvas" centered={false} padded label="五级阴影">
      <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {LEVELS.map((l) => (
          <figure key={l.key} className="m-0 flex flex-col items-center">
            <div className={cn('flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-border-default bg-bg-surface text-numeric-md text-fg-primary tnum', l.className)} aria-hidden>
              {l.title}
            </div>
            <figcaption className="mt-3 text-center">
              <CopyName text={`elevation.${l.key}`} label={l.key} />
              <p className="mt-0.5 mb-0 text-[12px] leading-4 text-fg-muted">{l.usage}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Preview>
  );
}

const HOVER_SNIPPETS = [
  {
    id: 'css',
    label: 'CSS',
    lang: 'css',
    code: `.card {\n  box-shadow: var(--tp-elevation-level-1);\n  transition: box-shadow var(--tp-duration-base) var(--tp-easing-standard);\n}\n.card:hover {\n  box-shadow: var(--tp-elevation-level-2);\n}`,
  },
  {
    id: 'tailwind',
    label: 'Tailwind',
    lang: 'tsx',
    code: `<div className="rounded-lg border border-border-default bg-bg-surface shadow-level-1 transition-shadow duration-(--duration-base) ease-standard hover:shadow-level-2">\n  …\n</div>`,
  },
  {
    id: 'dart',
    label: 'Dart',
    lang: 'dart',
    code: `AnimatedContainer(\n  duration: TpTokens.durationBase,\n  curve: TpTokens.easingStandard,\n  decoration: BoxDecoration(\n    color: TpTokens.colorBgSurface,\n    borderRadius: BorderRadius.circular(TpTokens.radiusLg),\n    boxShadow: hovered ? TpTokens.elevationLevel2 : TpTokens.elevationLevel1,\n  ),\n);`,
  },
  {
    id: 'swift',
    label: 'Swift',
    lang: 'swift',
    code: `// 取第一层；多层阴影需叠加多个 CALayer\nlet shadow = TPTokens.elevationLevel2[0]\ncard.layer.shadowColor = shadow.color.cgColor\ncard.layer.shadowOpacity = shadow.opacity\ncard.layer.shadowOffset = shadow.offset\ncard.layer.shadowRadius = shadow.radius / 2 // CSS blur ÷ 2`,
  },
];

export default function ElevationPage() {
  const rows = tokensByPrefix('elevation').map((t) => ({
    name: t.path,
    value: token(t.path),
    description: t.description,
    preview: 'shadow' as const,
  }));

  return (
    <>
      <PageHeader
        eyebrow="基础 · Foundations"
        title="阴影层级"
        en="Elevation"
        description="Light only，阴影是唯一的层级手段。环境光为蓝灰 rgb(15 23 42)，绝不用纯黑；五级阴影配合 slate-200 描边，品牌 glow 只留给主操作与连接状态。"
      />

      <Section id="levels" title="五级阴影" en="Levels" description="一个屏幕最多两个层级同时出现（例如卡片 level-1 + 浮层 level-3）。">
        <LevelCards />
        <Preview background="canvas" label="hover 抬起演示" toolbar={<span className="text-sm text-fg-muted">把鼠标移到卡片上：level-1 → level-2，duration.base + easing.standard</span>}>
          <div className="w-64 rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1 transition-shadow duration-(--duration-base) ease-standard hover:shadow-level-2">
            <p className="m-0 text-headline text-fg-primary">US · Los Angeles #102</p>
            <p className="mt-1 mb-0 text-body-sm text-fg-muted">延迟 42 ms · 负载 36%</p>
          </div>
        </Preview>
      </Section>

      <Section id="glow" title="品牌光晕" en="Brand Glow" description="brand-glow 用于主 CTA hover 与连接中；brand-glow-lg 只用于已连接的连接按钮；success-glow 用于成功态强调。">
        <Preview background="canvas" label="光晕演示" className="gap-10 py-12">
          <figure className="m-0 flex flex-col items-center gap-3">
            <span className="flex size-24 items-center justify-center rounded-full bg-gradient-connected text-white shadow-brand-glow-lg" aria-hidden>
              <Power size={40} strokeWidth={2.25} />
            </span>
            <figcaption className="text-center">
              <CopyName text="elevation.brand-glow-lg" label="brand-glow-lg" />
              <p className="mt-0.5 mb-0 text-[12px] text-fg-muted">已连接按钮</p>
            </figcaption>
          </figure>
          <figure className="m-0 flex flex-col items-center gap-3">
            <span className="flex size-24 items-center justify-center rounded-full border-2 border-blue-100 bg-bg-surface text-blue-500 shadow-brand-glow" aria-hidden>
              <Power size={40} strokeWidth={2.25} />
            </span>
            <figcaption className="text-center">
              <CopyName text="elevation.brand-glow" label="brand-glow" />
              <p className="mt-0.5 mb-0 text-[12px] text-fg-muted">连接中 / 主 CTA hover</p>
            </figcaption>
          </figure>
          <figure className="m-0 flex flex-col items-center gap-3">
            <Button size="lg" className="shadow-brand-glow">
              连接
            </Button>
            <figcaption className="text-center">
              <CopyName text="elevation.brand-glow" label="brand-glow" />
              <p className="mt-0.5 mb-0 text-[12px] text-fg-muted">主按钮 hover 态</p>
            </figcaption>
          </figure>
          <figure className="m-0 flex flex-col items-center gap-3">
            <span className="flex size-24 items-center justify-center rounded-full bg-status-success-solid text-white shadow-success-glow" aria-hidden>
              <Check size={40} strokeWidth={2.5} />
            </span>
            <figcaption className="text-center">
              <CopyName text="elevation.success-glow" label="success-glow" />
              <p className="mt-0.5 mb-0 text-[12px] text-fg-muted">成功态强调</p>
            </figcaption>
          </figure>
        </Preview>
        <Callout tone="warning" title="glow 不是装饰">
          <p>只用于品牌主操作与连接状态。卡片、列表、图标、标题一律不加 glow；同一屏最多一个 glow 元素。</p>
        </Callout>
      </Section>

      <Section id="focus" title="聚焦环" en="Focus Ring" description={`elevation.focus = ${token('elevation.focus')}。所有可交互元素在 :focus-visible 时显示，不移除 outline 而不替代。`}>
        <Preview background="surface" label="聚焦环演示" toolbar={<span className="text-sm text-fg-muted">按 Tab 键在下面的控件间移动，观察 3px 品牌蓝环</span>} className="gap-6">
          <Button>连接</Button>
          <Button variant="outline">选择节点</Button>
          <Input placeholder="搜索国家、城市或节点" aria-label="搜索" className="w-56" />
          <Switch aria-label="自动连接" defaultChecked />
          <span className="flex h-11 items-center rounded-md border border-border-focus bg-bg-surface px-4 text-label-md text-fg-secondary shadow-focus">静态展示 shadow-focus</span>
        </Preview>
        <Prose>
          <ul>
            <li>
              Web：Tailwind <code>focus-visible:shadow-focus</code>（组件库已内置）；CSS <code>box-shadow: var(--tp-elevation-focus)</code>。
            </li>
            <li>
              Flutter：<code>TpTokens.elevationFocus</code>（<code>List&lt;BoxShadow&gt;</code>，spread 3）；iOS：<code>TPTokens.elevationFocus</code>，或直接用 <code>layer.borderWidth = TPTokens.borderWidthFocus</code> + <code>TPTokens.colorRingFocus</code>。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="inset" title="内描边" en="Inset Hairline" description={`elevation.inset-hairline = ${token('elevation.inset-hairline')}，用于圆形国旗与头像，防止浅色边缘与底色融为一体。`}>
        <DoDont
          do={
            <div className="flex items-center gap-6">
              <Flag code="jp" name="日本" size={40} />
              <Flag code="fi" name="芬兰" size={40} />
              <span className="flex size-10 items-center justify-center rounded-full bg-bg-surface text-fg-secondary shadow-inset-hairline">TP</span>
            </div>
          }
          dont={
            <div className="flex items-center gap-6">
              <img src={brandUrl.flag('jp')} alt="日本（无内描边）" width={40} height={40} className="size-10 rounded-full" />
              <img src={brandUrl.flag('fi')} alt="芬兰（无内描边）" width={40} height={40} className="size-10 rounded-full" />
              <span className="flex size-10 items-center justify-center rounded-full bg-bg-surface text-fg-secondary">TP</span>
            </div>
          }
          doCaption={
            <>
              <code>Flag</code> 组件自带 1px 内描边（<code>shadow-inset-hairline</code>），白色国旗在白底上仍有轮廓。
            </>
          }
          dontCaption="直接放 SVG：日本、芬兰国旗的白色区域与白卡片融合，圆形边界消失。"
        />
        <Prose>
          <p>
            Flutter 没有 inset 阴影，用 <code>Border.all(color: TpTokens.colorBorderFlagInset, width: TpTokens.borderWidthHairline)</code> 绘制；iOS 用 <code>layer.borderColor = TPTokens.colorBorderFlagInset.cgColor</code>。
          </p>
        </Prose>
      </Section>

      <Section id="tokens" title="Token 表" en="Tokens" description="完整 box-shadow 字符串，与 dist/css/tokens.css 中的 --tp-elevation-* 一致；Tailwind 类名为 shadow-<name>。">
        <TokenTable rows={rows} caption="elevation token" />
      </Section>

      <Section id="rules" title="规则与配方" en="Rules & Recipes">
        <Callout tone="info" title="四条规则">
          <ul className="list-disc space-y-1 pl-5">
            <li>一个屏幕最多两个层级同时出现。</li>
            <li>
              hover 从 level-1 升到 level-2，用 <code>duration.base</code>（200ms）+ <code>easing.standard</code>。
            </li>
            <li>glow 只用于品牌主操作与连接状态，不用于装饰。</li>
            <li>
              站点唯一允许的 <code>backdrop-filter: blur</code> 是 64px 顶部导航（<code>bg.glass</code>）。
            </li>
          </ul>
        </Callout>
        <PlatformSnippets snippets={HOVER_SNIPPETS} />
      </Section>
    </>
  );
}
