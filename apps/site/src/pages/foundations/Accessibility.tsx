import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { Button, Input, Switch, Tag, ToggleGroup, ToggleGroupItem } from '@tpvpn/ui';
import { Callout, CodeBlock, DocTable, Grid, PageHeader, Pill, Preview, Prose, Section, SubSection } from '@/components/docs';
import { Link } from 'react-router';
import { cn } from '@/lib/cn';
import { contrastRatio } from '@/lib/contrast';
import { token, tokenValue, type TypographyValue } from '@/lib/tokens';
import { ContrastMatrix, WhiteOnFills } from './_parts/ContrastMatrix';
import { px } from './_parts/naming';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const TOUCH_RULES: [string, string][] = [
  ['最小触控目标', `${token('size.touch-target-min')} × ${token('size.touch-target-min')}（size.control.md）`],
  ['触控目标间距', `≥ ${token('space.2')}`],
  ['图标按钮', `视觉 ${token('size.icon.md')} 图标，命中区 ${token('size.control.md')}`],
  ['列表行', `高 ≥ 64（含 ${token('size.flag.lg')} 国旗）；CountryListItem 72`],
  ['连接按钮', `${token('size.connection-button.mobile')} / ${token('size.connection-button.desktop')}`],
];

const KEYBOARD: [string, string][] = [
  ['Button', 'Space / Enter'],
  ['Switch', 'Space'],
  ['Tabs', '← → 切换，Home / End'],
  ['Listbox（节点列表）', '↑ ↓ 移动，Home / End，Enter 选择'],
  ['Dialog / Sheet', 'Esc 关闭；焦点陷阱；关闭后焦点回到触发元素'],
  ['站点', 'Tab 顺序与视觉顺序一致；首个可聚焦位置为「跳到主要内容」'],
];

const ARIA: [string, string][] = [
  ['ConnectionButton', 'role="switch" aria-checked · aria-busy（connecting）· aria-label'],
  ['StatusDot', 'role="img" aria-label；或旁边有可见文字'],
  ['UsageMeter', 'role="progressbar" aria-valuenow / valuemin / valuemax'],
  ['TabBar', '<nav aria-label> + aria-current="page"'],
  ['CountryListItem', 'role="option" aria-selected'],
  ['Toast', 'role="status" / role="alert" + aria-live'],
  ['Loading spinner', 'role="status" aria-live="polite" + 可见或 sr-only 文字'],
  ['装饰图标 / 重复国旗', 'aria-hidden="true" / alt=""'],
  ['所有图片', '有 alt（Logo alt="TP VPN"）'],
];

const LANG_SAMPLES: { lang: string; label: string; text: string }[] = [
  { lang: 'zh-CN', label: '简体中文（源语言）', text: '已连接，享受更安心的网络。' },
  { lang: 'en', label: 'English', text: 'Connected. Enjoy a safer network.' },
  { lang: 'zh-HK', label: '繁體中文（香港）', text: '已連接，享受更安心的網絡。' },
  { lang: 'es', label: 'Español', text: 'Conectado. Disfruta de una red más segura.' },
  { lang: 'hi', label: 'हिन्दी', text: 'कनेक्टेड। सुरक्षित नेटवर्क का आनंद लें।' },
];

const SCALES = [100, 125, 150, 200] as const;

/* ------------------------------------------------------------------ */
/* Demos                                                               */
/* ------------------------------------------------------------------ */

function TouchDemo() {
  const control = px(token('size.control.md'));
  const icon = px(token('size.icon.md'));
  return (
    <Preview background="surface" label="触控目标演示" className="gap-10">
      <figure className="m-0 flex flex-col items-center gap-3">
        <span className="relative inline-flex">
          <Button size="icon" variant="ghost" aria-label="设置">
            <Settings strokeWidth={1.75} />
          </Button>
          <span className="pointer-events-none absolute inset-0 rounded-md border border-dashed border-blue-500" aria-hidden />
        </span>
        <figcaption className="text-center text-[12px] leading-4 text-fg-muted">
          图标 {icon} · 命中区 {control} × {control}（虚线）
        </figcaption>
      </figure>
      <figure className="m-0 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            取消
          </Button>
          <Button size="sm">确定</Button>
        </div>
        <figcaption className="text-center text-[12px] leading-4 text-fg-muted">相邻目标间距 ≥ {token('space.2')}；sm 按钮 36 高，仅用于非主要操作</figcaption>
      </figure>
    </Preview>
  );
}

function TextScaleDemo() {
  const [scale, setScale] = useState<(typeof SCALES)[number]>(100);
  const base = px((tokenValue('typography.body-md') as TypographyValue | undefined)?.fontSize) || 16;
  return (
    <Preview
      background="canvas"
      centered={false}
      label="文字缩放演示"
      toolbar={
        <>
          <ToggleGroup type="single" size="sm" variant="outline" value={String(scale)} onValueChange={(v) => v && setScale(Number(v) as (typeof SCALES)[number])} aria-label="文字缩放" className="flex-wrap">
            {SCALES.map((s) => (
              <ToggleGroupItem key={s} value={String(s)}>
                {s}%
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <span className="font-mono text-[12px] text-fg-muted tnum">
            根字号 {Math.round((base * scale) / 100)}px
          </span>
        </>
      }
    >
      <div className="mx-auto w-full max-w-sm rounded-lg border border-border-default bg-bg-surface p-[1em] shadow-level-1 transition-[font-size] duration-(--duration-base) ease-standard" style={{ fontSize: (base * scale) / 100 }}>
        <div className="flex items-start gap-[0.75em]">
          <span className="mt-[0.1em] size-[2.5em] shrink-0 rounded-full bg-bg-surface-sunken ring-hairline" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate text-[1em] leading-[1.5] font-semibold text-fg-primary">US · Los Angeles #102</p>
            <p className="m-0 text-[0.8125em] leading-[1.5] text-fg-muted tnum">延迟 42 ms · 丢包 0% · 负载 36%</p>
            <div className="mt-[0.5em] flex flex-wrap gap-[0.375em]">
              <Tag tone="game" className="h-auto min-h-[1.5em] px-[0.5em] text-[0.75em]">
                游戏
              </Tag>
              <Tag tone="success" icon={null} className="h-auto min-h-[1.5em] px-[0.5em] text-[0.75em]">
                优质节点
              </Tag>
            </div>
          </div>
        </div>
        <button type="button" className="mt-[1em] flex min-h-[2.75em] w-full items-center justify-center rounded-md bg-action-primary-bg px-[1.25em] text-[0.875em] font-medium text-action-primary-fg">
          连接
        </button>
      </div>
    </Preview>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AccessibilityPage() {
  const reduced = useReducedMotion();
  return (
    <>
      <PageHeader
        eyebrow="基础 · Foundations"
        title="无障碍"
        en="Accessibility"
        description="目标 WCAG 2.2 AA：文字对比度 ≥ 4.5:1（大字 ≥ 3:1），键盘可达，aria 完整，触控目标 ≥ 44，尊重减弱动态效果；Lighthouse A11y = 100。"
      />

      <Section id="contrast-matrix" title="对比度矩阵" en="Contrast Matrix" description="按 WCAG 相对亮度实时计算每个前景 token 在每个浅底上的对比度。这是真值表：包括已知的不达标组合。">
        <ContrastMatrix />
        <Callout tone="warning" title="已知不达标，且是有意为之">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <code>fg.placeholder</code>（slate-400）在所有浅底上都不达标——只用于占位符、禁用与装饰，不作文字。
            </li>
            <li>
              <code>fg.muted</code>（slate-500）在 <code>bg.surface-sunken</code>（slate-100）上不达标——凹陷面上的次要文字必须用 <code>fg.secondary</code>。
            </li>
            <li>
              <code>fg.brand</code> / <code>fg.link</code>（blue-600）在 <code>bg.brand-soft</code> 与 <code>bg.surface-sunken</code> 上仅大字——浅蓝底上改用 <code>fg.brand-strong</code>（blue-700）。
            </li>
            <li>
              <code>scene.game.fg</code> 已取 mint-800（{contrastRatio(token('color.scene.game.fg'), token('color.scene.game.bg')).toFixed(2)}:1），因为 mint-700 在 mint-50 上只有 {contrastRatio(token('color.mint.700'), token('color.mint.50')).toFixed(2)}:1。
            </li>
          </ul>
        </Callout>
        <SubSection id="white-on-fills" title="白字 × 有色底" en="White on Fills" description="按钮与品牌面。绿色与琥珀色面永远不放白字。">
          <WhiteOnFills />
        </SubSection>
      </Section>

      <Section id="touch" title="触控尺寸" en="Touch Targets" description="44 × 44 是硬下限：视觉可以更小，命中区不能。">
        <DocTable
          caption="触控尺寸规则"
          head={
            <>
              <th>项</th>
              <th>值</th>
            </>
          }
        >
          {TOUCH_RULES.map(([k, v]) => (
            <tr key={k} className="transition-colors hover:bg-bg-surface-hover">
              <td className="font-medium text-fg-primary">{k}</td>
              <td className="font-mono text-[12px] text-fg-secondary tnum">{v}</td>
            </tr>
          ))}
        </DocTable>
        <TouchDemo />
      </Section>

      <Section id="focus" title="焦点可见" en="Focus Visibility" description={`所有可交互元素 :focus-visible 显示 ${token('elevation.focus')}；不移除 outline 而不替代。`}>
        <Preview background="surface" label="焦点演示" toolbar={<span className="text-sm text-fg-muted">用 Tab / Shift+Tab 在控件间移动，Space / Enter 触发</span>} className="gap-6">
          <Button>连接</Button>
          <Button variant="secondary">选择节点</Button>
          <Input placeholder="兑换码" aria-label="兑换码" className="w-48 font-mono" />
          <label className="flex items-center gap-2 text-sm text-fg-secondary">
            <Switch defaultChecked aria-label="自动连接" />
            自动连接
          </label>
          <Link to="/foundations/motion" className="rounded-xs text-fg-link underline underline-offset-4 hover:text-fg-link-hover">
            动效规范
          </Link>
        </Preview>
        <DocTable
          caption="键盘操作"
          head={
            <>
              <th>组件</th>
              <th>键盘</th>
            </>
          }
        >
          {KEYBOARD.map(([k, v]) => (
            <tr key={k} className="transition-colors hover:bg-bg-surface-hover">
              <td className="font-medium text-fg-primary">{k}</td>
              <td className="text-fg-secondary">{v}</td>
            </tr>
          ))}
        </DocTable>
      </Section>

      <Section id="semantics" title="语义与 ARIA" en="Semantics" description="颜色不作唯一信息载体：延迟着色同时显示数值，连接状态同时显示文字。">
        <DocTable
          caption="组件 ARIA 约定"
          head={
            <>
              <th>组件</th>
              <th>角色 / 属性</th>
            </>
          }
        >
          {ARIA.map(([k, v]) => (
            <tr key={k} className="transition-colors hover:bg-bg-surface-hover">
              <td className="font-medium text-fg-primary">{k}</td>
              <td className="font-mono text-[12px] text-fg-secondary">{v}</td>
            </tr>
          ))}
        </DocTable>
        <Preview background="surface" label="颜色不作唯一载体" className="gap-8">
          {[
            { ms: 42, cls: 'text-latency-good-fg', bar: 'bg-latency-good', label: '良好' },
            { ms: 128, cls: 'text-latency-fair-fg', bar: 'bg-latency-fair', label: '一般' },
            { ms: 236, cls: 'text-latency-poor-fg', bar: 'bg-latency-poor', label: '较差' },
          ].map((l) => (
            <span key={l.ms} className="inline-flex items-center gap-2">
              <span className="flex h-4 items-end gap-0.5" aria-hidden>
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={cn('w-1 rounded-full', i <= (l.ms < 80 ? 4 : l.ms < 180 ? 2 : 1) ? l.bar : 'bg-latency-idle')} style={{ height: 4 + i * 3 }} />
                ))}
              </span>
              <span className={cn('text-numeric-sm tnum', l.cls)}>{l.ms} ms</span>
              <span className="sr-only">延迟{l.label}</span>
            </span>
          ))}
        </Preview>
      </Section>

      <Section id="motion" title="动效与减弱动态效果" en="Motion" description="prefers-reduced-motion: reduce 时全部退化为 150ms 淡入淡出；无自动播放闪烁，任何闪烁频率 < 3 Hz。">
        <div className="my-6 flex flex-wrap items-center gap-3 rounded-lg border border-border-default bg-bg-surface px-4 py-3 shadow-level-1" role="status" aria-live="polite">
          <span className="text-sm text-fg-secondary">当前浏览器 prefers-reduced-motion：</span>
          <Pill tone={reduced ? 'warning' : 'success'}>{reduced ? 'reduce' : 'no-preference'}</Pill>
          <Link to="/foundations/motion#reduced-motion" className="text-sm text-fg-link underline underline-offset-4 hover:text-fg-link-hover">
            查看动效页的完整规则与代码
          </Link>
        </div>
        <Prose>
          <ul>
            <li>取消位移、缩放、旋转、无限循环与 shimmer；连接中改为静态蓝环 + 文字「连接中…」。</li>
            <li>站点曲线与时长演示需手动点击播放，页面不自动播放动画。</li>
            <li>
              Web 用 <code>useReducedMotion()</code> / 媒体查询；Flutter <code>MediaQuery.disableAnimationsOf(context)</code>；iOS <code>UIAccessibility.isReduceMotionEnabled</code>。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="language" title="语言标记" en="Language" description="五语言 zh-CN（源）、en、zh-HK、es、hi。lang 决定屏幕阅读器的发音、浏览器的字体回退与断字规则。">
        <Grid cols={1} gap="sm" className="my-6">
          {LANG_SAMPLES.map((s) => (
            <div key={s.lang} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border-default bg-bg-surface px-4 py-3 shadow-level-1">
              <code className="w-16 shrink-0 font-mono text-[12px] text-fg-brand">{s.lang}</code>
              <span className="w-36 shrink-0 text-[12px] text-fg-muted">{s.label}</span>
              <p lang={s.lang} className="m-0 min-w-0 flex-1 text-body-md text-fg-primary">
                {s.text}
              </p>
            </div>
          ))}
        </Grid>
        <CodeBlock
          lang="html"
          filename="index.html"
          code={`<!-- 页面语言：BCP 47 -->
<html lang="zh-CN">
<!-- 混排片段单独标注 -->
<p>连接协议：<span lang="en">WireGuard</span></p>
<p lang="zh-HK">已連接</p>
<p lang="hi">कनेक्टेड</p>
<!-- 印地语不做大写转换；站点 CSS 按 :lang(hi) / :lang(zh-HK) 切换字体回退链 -->`}
        />
        <Prose>
          <ul>
            <li>
              <code>&lt;html lang&gt;</code> 用 <code>zh-CN</code>、<code>en</code>、<code>zh-HK</code>（或 <code>zh-Hant-HK</code>）、<code>es</code>、<code>hi</code>。
            </li>
            <li>
              印地语页面确保 Noto Sans Devanagari 已加载，并禁用 <code>text-transform: uppercase</code>（overline 不套大写）。
            </li>
            <li>文案不依赖大小写、字体样式传递含义；西班牙语平均比中文长 40–60%，按钮与 Tab 不得截断。</li>
            <li>
              Flutter：<code>Localizations</code> + <code>Semantics(label:)</code>；iOS：<code>accessibilityLabel</code> 用当前语言。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="text-scaling" title="文字缩放" en="Text Scaling" description="支持到 200%（WCAG 1.4.4）、iOS Dynamic Type 与 Android 字体缩放。切换下面的比例，卡片按 em 随根字号放大而不裁切。">
        <TextScaleDemo />
        <Prose>
          <ul>
            <li>
              Web 字号用 rem / em，行高用无单位倍数；容器用 <code>min-height</code> 而非固定 <code>height</code>，文字区域允许换行。
            </li>
            <li>
              Flutter 用 <code>MediaQuery.textScalerOf(context)</code> 缩放所有 <code>TextStyle</code>；iOS 用 <code>UIFontMetrics</code> 包装 <code>TPTextStyle.font</code>。
            </li>
            <li>连接按钮、Tab bar、国旗等固定尺寸元素不随字体缩放；其文字标签可换行或截断为省略号，但不得重叠。</li>
            <li>验收：200% 下无横向滚动、无重叠、所有操作可完成。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="checklist" title="验收清单" en="Checklist">
        <div className="grid gap-4 md:grid-cols-2">
          <Callout tone="info" title="设计师" className="my-0">
            <ul className="list-disc space-y-1 pl-5">
              <li>所有文字对比度 ≥ 4.5:1（大字 ≥ 3:1）；只用本页矩阵中达标的组合</li>
              <li>触控目标 ≥ 44 × 44，间距 ≥ 8</li>
              <li>颜色之外有第二信号：数值、文字、图标</li>
              <li>每个交互元素标注聚焦态、禁用态</li>
              <li>五语言文案预留宽度，不截断</li>
              <li>动效标注 reduced motion 退化方案</li>
            </ul>
          </Callout>
          <Callout tone="success" title="开发者" className="my-0">
            <ul className="list-disc space-y-1 pl-5">
              <li>键盘可完成全部流程（连接、选节点、兑换）</li>
              <li>每个可交互元素有可见 :focus-visible</li>
              <li>aria-* / alt 完整；装饰元素 aria-hidden</li>
              <li>reduced motion 下无位移、旋转与循环动画</li>
              <li>lang 正确；印地语字体已加载</li>
              <li>200% 文字缩放无裁切；Lighthouse A11y = 100</li>
            </ul>
          </Callout>
        </div>
      </Section>
    </>
  );
}
