import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Button, ToggleGroup, ToggleGroupItem } from '@tpvpn/ui';
import { Callout, DoDont, PageHeader, Prose, Section, SubSection } from '@/components/docs';
import { cn } from '@/lib/cn';
import { contrastRatio, PAPER } from '@/lib/contrast';
import { groupTokens, token, tokenCssVar, tokenReference, tokensByPrefix } from '@/lib/tokens';
import { ColorTokenTable } from './_parts/ColorTokenTable';
import { rowsFor, SUBGROUP_LABEL } from './_parts/colorRows';
import { camelName, colorUtility, colorUtilityKind, cssVarRef, dartColor, kotlinColor, swiftColor, tailwindThemeVar } from './_parts/naming';
import { PlatformSnippets, type Snippet } from './_parts/PlatformSnippets';

/* ------------------------------------------------------------------ */
/* Grouped tables (action / status / scene)                            */
/* ------------------------------------------------------------------ */

function GroupedTables({ prefix, idPrefix }: { prefix: string; idPrefix: string }) {
  const groups = groupTokens(prefix);
  return (
    <>
      {Object.entries(groups).map(([key, entries]) => {
        const label = SUBGROUP_LABEL[key] ?? { title: key, en: key };
        return (
          <SubSection key={key} id={`${idPrefix}-${key}`} title={label.title} en={label.en}>
            <ColorTokenTable rows={rowsFor(entries)} caption={`${prefix}.${key} token`} />
          </SubSection>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Three-layer architecture diagram                                    */
/* ------------------------------------------------------------------ */

const CHAINS: [string, string, string][] = [
  ['color.blue.600', 'color.action.primary.bg', 'button.primary.bg'],
  ['color.slate.900', 'color.fg.primary', 'node-card.title-fg'],
  ['color.slate.200', 'color.border.default', 'node-card.border'],
];

const LAYERS = [
  { title: '原始层', en: 'Primitive', rule: '色板、尺寸、字体的原始值。业务代码禁止直接引用。', tone: 'border-border-default bg-bg-surface' },
  { title: '语义层', en: 'Semantic', rule: 'bg / fg / border / action / status / state / scene …，按用途命名，业务只用这一层。', tone: 'border-blue-200 bg-bg-brand-soft' },
  { title: '组件层', en: 'Component', rule: 'button、node-card、tag …，引用语义层，供组件库与 Figma 变量使用。', tone: 'border-border-default bg-bg-surface' },
] as const;

function TokenChip({ path }: { path: string }) {
  const value = token(path);
  const ref = tokenReference(path);
  return (
    <li className="flex items-center gap-2.5 rounded-sm border border-border-subtle bg-bg-surface px-2.5 py-2">
      <span className="size-6 shrink-0 rounded-xs ring-hairline" style={{ background: value }} aria-hidden />
      <span className="min-w-0">
        <span className="block truncate font-mono text-[12px] text-fg-primary">{path}</span>
        <span className="block truncate font-mono text-[11px] text-fg-muted">{ref ? `${ref} → ${value}` : value}</span>
      </span>
    </li>
  );
}

function LayerDiagram() {
  return (
    <figure className="my-6" aria-label="三层 token 架构：原始层 → 语义层 → 组件层">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
        {LAYERS.map((layer, i) => (
          <div key={layer.en} className="contents">
            <div className={cn('flex min-w-0 flex-col rounded-lg border p-4 shadow-level-1', layer.tone)}>
              <p className="text-headline text-fg-primary">
                {layer.title} <span className="font-medium text-fg-secondary">{layer.en}</span>
              </p>
              <p className="mt-1 mb-3 text-[13px] leading-5 text-fg-secondary">{layer.rule}</p>
              <ul className="mt-auto space-y-2">
                {CHAINS.map((chain) => (
                  <TokenChip key={chain[i]} path={chain[i]} />
                ))}
              </ul>
            </div>
            {i < LAYERS.length - 1 && (
              <div className="flex items-center justify-center text-fg-placeholder" aria-hidden>
                <ArrowRight className="hidden size-5 md:block" strokeWidth={1.75} />
                <ArrowDown className="size-5 md:hidden" strokeWidth={1.75} />
              </div>
            )}
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-fg-muted">
        引用用 <code className="font-mono text-[12px]">{'{path.to.token}'}</code> 写在源文件里，Style Dictionary 编译时解析；同一条链在 CSS、Tailwind、Dart、Swift、Kotlin、Figma 中得到相同的值。
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Reference formats                                                   */
/* ------------------------------------------------------------------ */

const REF_OPTIONS = ['color.action.primary.bg', 'color.bg.canvas', 'color.fg.primary', 'color.border.default', 'color.scene.game.fg'] as const;

function referenceSnippets(path: string): Snippet[] {
  const value = token(path);
  const name = camelName(path);
  const kind = colorUtilityKind(path);
  const util = colorUtility(path, kind);
  const cssProp = kind === 'text' ? 'color' : kind === 'border' ? 'border-color' : 'background';
  const twVar = tailwindThemeVar(path);
  const twSecond = kind === 'bg' ? ' text-action-primary-fg' : '';
  const dartUse =
    kind === 'text'
      ? `Text('已连接', style: TextStyle(color: TpTokens.${name}))`
      : kind === 'border'
        ? `Border.all(color: TpTokens.${name}, width: TpTokens.borderWidthHairline)`
        : `Container(color: TpTokens.${name})`;
  const swiftUse =
    kind === 'text'
      ? `label.textColor = TPTokens.${name}`
      : kind === 'border'
        ? `view.layer.borderColor = TPTokens.${name}.cgColor`
        : `view.backgroundColor = TPTokens.${name}`;
  const kotlinUse =
    kind === 'text'
      ? `Text("已连接", color = TpTokens.${name})`
      : kind === 'border'
        ? `Modifier.border(1.dp, TpTokens.${name})`
        : `Modifier.background(TpTokens.${name})`;

  return [
    {
      id: 'css',
      label: 'CSS',
      lang: 'css',
      filename: 'tokens.css',
      code: `/* :root { ${tokenCssVar(path)}: ${value}; } */\n.example {\n  ${cssProp}: ${cssVarRef(path)};\n}`,
    },
    {
      id: 'tailwind',
      label: 'Tailwind',
      lang: 'tsx',
      filename: 'theme.css → 类名',
      code: `// @theme { ${twVar}: ${value}; }\n<div className="${util}${twSecond}">…</div>\n\n// 任意属性也可直接引用主题变量\n<div style={{ ${cssProp === 'border-color' ? 'borderColor' : cssProp}: 'var(${twVar})' }} />`,
    },
    {
      id: 'dart',
      label: 'Dart',
      lang: 'dart',
      filename: 'tp_tokens.dart',
      code: `// static const Color ${name} = ${dartColor(value)};\n${dartUse};`,
    },
    {
      id: 'swift',
      label: 'Swift',
      lang: 'swift',
      filename: 'TPTokens.swift',
      code: `// public static let ${name} = ${swiftColor(value)}\n${swiftUse}`,
    },
    {
      id: 'kotlin',
      label: 'Kotlin',
      lang: 'kotlin',
      filename: 'TpTokens.kt',
      code: `// val ${name} = ${kotlinColor(value)}\n${kotlinUse}`,
    },
  ];
}

function ReferenceFormats() {
  const [path, setPath] = useState<string>(REF_OPTIONS[0]);
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <span className="text-sm text-fg-muted">选择 token</span>
        <ToggleGroup type="single" variant="outline" size="sm" value={path} onValueChange={(v) => v && setPath(v)} aria-label="选择示例 token" className="flex-wrap">
          {REF_OPTIONS.map((p) => (
            <ToggleGroupItem key={p} value={p} className="font-mono text-[12px]">
              {p.replace(/^color\./, '')}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-fg-secondary">
        <span className="size-6 rounded-xs ring-hairline" style={{ background: token(path) }} aria-hidden />
        <code className="font-mono text-[13px] text-fg-primary">{path}</code>
        <span className="font-mono text-[12px] text-fg-muted">{token(path)}</span>
        <span className="font-mono text-[12px] text-fg-muted">{tokenReference(path)}</span>
      </div>
      <PlatformSnippets snippets={referenceSnippets(path)} className="mt-3" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ColorPage() {
  const primaryBg = token('color.action.primary.bg');
  const brandBg = token('color.bg.brand');
  const muted = token('color.fg.muted');
  const secondary = token('color.fg.secondary');
  const sunken = token('color.bg.surface-sunken');
  const brandFg = token('color.fg.brand');
  const brandStrong = token('color.fg.brand-strong');
  const brandSoft = token('color.bg.brand-soft');
  const gameFg = token('color.scene.game.fg');
  const gameBg = token('color.scene.game.bg');
  const mint700 = token('color.mint.700');

  const r = (a: string, b: string) => contrastRatio(a, b).toFixed(2);

  return (
    <>
      <PageHeader
        eyebrow="基础 · Foundations"
        title="色彩 Token"
        en="Color Tokens"
        description="语义色彩 token 是业务代码唯一允许引用的颜色来源。每一行都来自编译产物 tokens.flat.json：色块、名称、值、引用与实时计算的对比度。"
      />

      <Section id="architecture" title="三层架构" en="Three Layers" description="原始层只被语义层引用，语义层被组件层与业务代码引用。换一个品牌蓝，只改一处原始值，整条链同步更新。">
        <LayerDiagram />
        <Prose>
          <ul>
            <li>
              <strong>命名</strong>：全部小写 kebab；路径 <code>color.bg.canvas</code> → CSS <code>--tp-color-bg-canvas</code> → Tailwind <code>--color-bg-canvas</code>（类名 <code>bg-bg-canvas</code>）→ Dart / Swift / Kotlin <code>colorBgCanvas</code>。
            </li>
            <li>
              <strong>语义分组</strong>：<code>bg</code> 底 · <code>fg</code> 文字 · <code>border</code> 边框 · <code>action</code> 操作 · <code>status</code> 状态反馈 · <code>state</code> 连接状态 · <code>latency</code> 延迟着色 · <code>scene</code> 场景标签 · <code>chart</code> 图表序列 · <code>ring</code> 聚焦环。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="usage" title="使用规则" en="Usage" description="所有阈值均按 WCAG 2.x 相对亮度实时计算；下面的数字就是本页表格里的数字。">
        <Callout tone="warning" title={`白字按钮填充必须用 action.primary.bg（blue-600 ${primaryBg}，${r(PAPER, primaryBg)}:1）`}>
          <p>
            <code>#1677FF</code>（<code>bg.brand</code>）上的白字仅 {r(PAPER, brandBg)}:1，只允许用于大字（≥ 24px 或 ≥ 18.66px 粗体）、图标、描边、聚焦环与装饰面。链接文字同样用 blue-600（<code>fg.link</code>）。
          </p>
        </Callout>
        <Callout tone="warning" title="凹陷面与浅蓝面上的文字要升一档">
          <p>
            <code>bg.surface-sunken</code>（slate-100）上 <code>fg.muted</code> 只有 {r(muted, sunken)}:1，次要文字必须用 <code>fg.secondary</code>（{r(secondary, sunken)}:1）。
            <code>bg.brand-soft</code>（blue-50）上 <code>fg.brand</code> 只有 {r(brandFg, brandSoft)}:1，文字与链接改用 <code>fg.brand-strong</code> / <code>action.secondary.fg</code>（blue-700，{r(brandStrong, brandSoft)}:1）。
          </p>
        </Callout>
        <Callout tone="info" title="场景标签：50 底 + 700 字，唯 game 取 mint-800">
          <p>
            mint-700 <code>{mint700}</code> 在 mint-50 上仅 {r(mint700, gameBg)}:1，所以 <code>scene.game.fg</code> = mint-800 <code>{gameFg}</code>（{r(gameFg, gameBg)}:1）。其余场景（auto / ai / exchange）均为 700 阶。
          </p>
        </Callout>
        <Callout tone="info" title="连接状态只有一个来源">
          <p>
            connected = green-500、connecting = blue-500（动画）、disconnected = slate-400、error = red-500，全部通过 <code>color.state.*</code> 引用；按钮、状态点、横幅、节点状态不得另起颜色。
          </p>
        </Callout>
        <DoDont
          do={<Button>连接</Button>}
          dont={<Button className="bg-blue-500 hover:bg-blue-500 hover:shadow-none">连接</Button>}
          doCaption={
            <>
              <code>bg-action-primary-bg</code>（blue-600）配白字，{r(PAPER, primaryBg)}:1，AA。
            </>
          }
          dontCaption={
            <>
              直接用 <code>bg-blue-500</code> 放白字，{r(PAPER, brandBg)}:1，14px 标签不达 AA。
            </>
          }
        />
      </Section>

      <Section id="bg" title="背景" en="Background" description="页面、卡片、内嵌区域与遮罩。白字对比度仅对品牌面与深色面有意义。">
        <ColorTokenTable rows={rowsFor(tokensByPrefix('color.bg'))} caption="color.bg token" />
      </Section>

      <Section id="fg" title="前景" en="Foreground" description="文字与图标颜色。占位符与禁用（slate-400）明确不达 AA，只能用于占位、禁用与装饰。">
        <ColorTokenTable rows={rowsFor(tokensByPrefix('color.fg'))} caption="color.fg token" />
      </Section>

      <Section id="border" title="边框" en="Border" description="边框与分割线不参与文字对比度；描边只需与相邻面可分辨。">
        <ColorTokenTable rows={rowsFor(tokensByPrefix('color.border'))} caption="color.border token" />
      </Section>

      <Section id="action" title="操作" en="Action" description="按钮与可交互控件的底、文字与边框，按变体分组；文字一律对其配对的底计算对比度。">
        <GroupedTables prefix="color.action" idPrefix="action" />
      </Section>

      <Section id="status" title="状态反馈" en="Status" description="success / warning / error / info 四组，每组 solid（图标、状态点）· fg（文字，700 阶）· bg（50 浅底）· border（200 描边）。">
        <GroupedTables prefix="color.status" idPrefix="status" />
      </Section>

      <Section id="state" title="连接状态" en="Connection State" description="全产品唯一来源。solid 用于按钮与状态点，-fg 用于文字，-bg 用于浅底横幅。">
        <ColorTokenTable rows={rowsFor(tokensByPrefix('color.state'))} caption="color.state token" />
      </Section>

      <Section id="latency" title="延迟着色" en="Latency" description="< 80 ms 绿 · 80–180 ms 黄 · > 180 ms 红；颜色之外必须同时显示数值。">
        <ColorTokenTable rows={rowsFor(tokensByPrefix('color.latency'))} caption="color.latency token" />
      </Section>

      <Section id="scene" title="场景标签" en="Scene" description="auto = blue、game = mint、ai = purple、exchange = amber。Tag 组件用 bg + fg，图标与强调用 solid。">
        <GroupedTables prefix="color.scene" idPrefix="scene" />
      </Section>

      <Section id="chart" title="图表序列" en="Chart" description="数据可视化按 1 → 6 顺序取色：blue、cyan、purple、mint、amber、pink；网格与坐标轴用中性色。">
        <ColorTokenTable rows={rowsFor(tokensByPrefix('color.chart'))} caption="color.chart token" />
        <div className="flex h-10 overflow-hidden rounded-md ring-hairline" role="img" aria-label="图表序列色带：blue、cyan、purple、mint、amber、pink">
          {tokensByPrefix('color.chart')
            .filter((t) => /^\d$/.test(t.key))
            .map((t) => (
              <span key={t.path} className="flex-1" style={{ background: String(t.value) }} />
            ))}
        </div>
      </Section>

      <Section id="ring" title="聚焦环" en="Focus Ring" description="3px 半透明品牌蓝环，与 elevation.focus 同值；错误态用红色环。">
        <ColorTokenTable rows={rowsFor(tokensByPrefix('color.ring'))} caption="color.ring token" />
      </Section>

      <Section id="reference" title="CSS / Tailwind / Dart / Swift 引用方式" en="Reference" description="同一个 token 在每个平台的写法。Flutter 用 TpTokens 常量，iOS 用 TPTokens 枚举，Android Compose 用 TpTokens 对象。">
        <ReferenceFormats />
        <Callout tone="info" title="Flutter / iOS 对应">
          <p>
            Dart：<code>abstract final class TpTokens</code> 提供 <code>Color</code> 常量，命名与 Web 一致（<code>colorActionPrimaryBg</code>）。iOS：<code>enum TPTokens</code> 提供 <code>UIColor</code>；SwiftUI 用 <code>Color(TPTokens.colorActionPrimaryBg)</code>。两端都不要在业务层写 hex。
          </p>
        </Callout>
      </Section>
    </>
  );
}
