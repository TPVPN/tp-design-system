import { useState } from 'react';
import { ArrowDownToLine, Package } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@tpvpn/ui';
import { asset, brandUrl, downloadUrl, PACKS, type LogoVariant } from '@/lib/assets';
import { token } from '@/lib/tokens';
import { cn } from '@/lib/cn';
import { LOGO_GLYPH_OFFSET, LOGO_MARK_RADIUS, LOGO_MARK_SIZE, TP_BLUE } from '@/components/brand/LogoMark';
import {
  ButtonLink,
  buttonVariants,
  Callout,
  CodeBlock,
  DocTable,
  DownloadCard,
  Grid,
  PageHeader,
  Pill,
  Preview,
  Section,
  SubSection,
} from '@/components/docs';
import { brandFile, packBytes } from './_parts/brandData';
import { LOCKUP } from './_parts/LogoLockup';
import { LogoMisuseGrid } from './_parts/LogoMisuse';

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

type Surface = 'light' | 'brand' | 'dark';
type VariantId = LogoVariant | 'wordmark';

interface VariantDef {
  id: VariantId;
  title: string;
  en: string;
  /** File base name (without extension). */
  file: string;
  svg: string;
  png: string;
  surface: Surface;
  use: string;
  /** Rendered height in the hero specimen (px). */
  heroHeight: number;
  /** Rendered height in the grid card (px). */
  cardHeight: number;
}

const SURFACE_CLASS: Record<Surface, string> = {
  light: 'bg-bg-surface',
  brand: 'bg-blue-500',
  dark: 'bg-slate-900',
};

const SURFACE_LABEL: Record<Surface, string> = {
  light: '白 / 浅色底',
  brand: '#1677FF / 深色底',
  dark: '深色底、压暗照片',
};

const logo = (id: LogoVariant) => ({ svg: brandUrl.logoSvg(id), png: brandUrl.logoPng(id, 2) });

const VARIANTS: VariantDef[] = [
  { id: 'horizontal', title: '横版（主）', en: 'Horizontal', file: 'tp-vpn-logo-horizontal', ...logo('horizontal'), surface: 'light', use: '网站头部、文档、邮件签名——默认首选。', heroHeight: 72, cardHeight: 30 },
  { id: 'horizontal-reversed', title: '横版反白', en: 'Horizontal reversed', file: 'tp-vpn-logo-horizontal-reversed', ...logo('horizontal-reversed'), surface: 'brand', use: '蓝底 Banner、页脚、深色区域；方块填白、字形填 #1677FF。', heroHeight: 72, cardHeight: 30 },
  { id: 'stacked', title: '堆叠', en: 'Stacked', file: 'tp-vpn-logo-stacked', ...logo('stacked'), surface: 'light', use: 'App 启动页、方形版位、印刷居中排版。', heroHeight: 150, cardHeight: 72 },
  { id: 'mark', title: '仅图形', en: 'Mark', file: 'tp-vpn-logo-mark', ...logo('mark'), surface: 'light', use: '小尺寸、头像、favicon 来源；低于最小尺寸时改用它。', heroHeight: 120, cardHeight: 56 },
  { id: 'mark-reversed', title: '图形反白', en: 'Mark reversed', file: 'tp-vpn-logo-mark-reversed', ...logo('mark-reversed'), surface: 'brand', use: '蓝底上的图形：白方块、蓝字形。', heroHeight: 120, cardHeight: 56 },
  { id: 'mark-mono-black', title: '单色黑', en: 'Mono black', file: 'tp-vpn-logo-mark-mono-black', ...logo('mark-mono-black'), surface: 'light', use: '单色印刷、雕刻、压印；字形镂空。', heroHeight: 120, cardHeight: 56 },
  { id: 'mark-mono-white', title: '单色白', en: 'Mono white', file: 'tp-vpn-logo-mark-mono-white', ...logo('mark-mono-white'), surface: 'dark', use: '深底、压暗后的照片；字形镂空。', heroHeight: 120, cardHeight: 56 },
  {
    id: 'wordmark',
    title: '仅字标',
    en: 'Wordmark',
    file: 'tp-vpn-wordmark',
    svg: asset('brand/logo/svg/tp-vpn-wordmark.svg'),
    png: brandUrl.wordmarkPng('wordmark', 2),
    surface: 'light',
    use: '图形已单独出现时（如 App 内页顶部）。',
    heroHeight: 40,
    cardHeight: 18,
  },
];

const PNG_INFO = (v: VariantDef) => brandFile(`logo/png/${v.file}@2x.png`);

function DownloadLinks({ v, size = 'sm' }: { v: VariantDef; size?: 'sm' | 'md' }) {
  const png = PNG_INFO(v);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={v.svg} download className={buttonVariants({ variant: 'outline', size })} aria-label={`下载 ${v.file}.svg`}>
        <ArrowDownToLine aria-hidden />
        SVG
      </a>
      <a href={v.png} download className={buttonVariants({ variant: 'outline', size })} aria-label={`下载 ${v.file}@2x.png`}>
        <ArrowDownToLine aria-hidden />
        PNG @2x{png ? ` · ${png.width}×${png.height}` : ''}
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Static content                                                      */
/* ------------------------------------------------------------------ */

const CONSTRUCTION_SPECS: { label: string; value: string; note: string }[] = [
  { label: '画布', value: `${LOGO_MARK_SIZE} × ${LOGO_MARK_SIZE}`, note: '圆角方块即图标本体，App Icon 直接沿用。' },
  { label: '圆角', value: `rx ${LOGO_MARK_RADIUS}`, note: `= 边长 × ${token('logo.corner-ratio')}（24%）。` },
  { label: '图形填充', value: TP_BLUE, note: 'blue-500，唯一品牌色。' },
  { label: '字形', value: `42.24 × 35.64 @ (${LOGO_GLYPH_OFFSET.x}, ${LOGO_GLYPH_OFFSET.y})`, note: '白色 TP 合体字形，path 数据原样复制，不得重绘。' },
  { label: '字标', value: 'Inter Bold 700', note: `字号 = 图形高 × ${token('logo.wordmark-size-ratio')}，字距 −0.02em，颜色 ${token('color.slate.900')}，已描边为 path。` },
  { label: '间距', value: `图形高 × ${token('logo.wordmark-gap-ratio')}`, note: '字标基线与图形垂直居中；堆叠版图形居上、字标居下居中。' },
  { label: '整体画布', value: `${LOCKUP.totalWidth} × ${LOCKUP.markSize} · 129.6 × 109.39`, note: '横版 ≈ 3.14 : 1；堆叠 ≈ 1.18 : 1。' },
];

const USAGE_ROWS: { scene: string; file: string; note: string }[] = [
  { scene: '网站头部（浅底）', file: 'tp-vpn-logo-horizontal.svg', note: '高度 28–32px，链接回首页，alt="TP VPN"。' },
  { scene: '网站页脚 / 蓝底 Banner', file: 'tp-vpn-logo-horizontal-reversed.svg', note: '蓝底或深底。' },
  { scene: 'App 启动页', file: 'tp-vpn-logo-stacked.svg · tp-vpn-logo-mark.svg', note: '居中；底色 #FAFBFF，或 #1677FF 配反白版。' },
  { scene: 'App Icon / 应用商店', file: 'app-icon/*', note: '图标本体即圆角方块，不要再叠圆角，见 App Icon 页。' },
  { scene: '社交头像', file: 'social/avatar-1024.png', note: 'mark 居中于白底圆内。' },
  { scene: 'OG / 分享图', file: 'social/og-default.png', note: '1200 × 630。' },
  { scene: '邮件签名', file: 'tp-vpn-logo-horizontal@2x.png', note: '显示高度 24–32px。' },
  { scene: '印刷（彩色）', file: 'tp-vpn-logo-horizontal.svg · stacked.svg', note: 'CMYK 近似：#1677FF → C91 M53 Y0 K0。' },
  { scene: '印刷（单色）', file: 'tp-vpn-logo-mark-mono-black.svg', note: '雕刻、压印、单色丝印。' },
  { scene: '深色照片上', file: 'tp-vpn-logo-mark-mono-white.svg', note: '先压暗背景保证对比。' },
];

const HEADER_SNIPPET = `<a href="/" aria-label="TP VPN 首页">
  <img src="/brand/logo/svg/tp-vpn-logo-horizontal.svg" alt="TP VPN" width="101" height="32">
</a>`;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LogoPage() {
  const [variantId, setVariantId] = useState<VariantId>('horizontal');
  const active = VARIANTS.find((v) => v.id === variantId) ?? VARIANTS[0]!;
  const markSvg = brandUrl.logoSvg('mark');
  const horizontalSvg = brandUrl.logoSvg('horizontal');
  const minMark = parseInt(token('size.logo.min-mark'), 10) || 24;
  const minHorizontal = parseInt(token('size.logo.min-horizontal'), 10) || 96;

  return (
    <>
      <PageHeader
        eyebrow="品牌 · Brand"
        title="Logo"
        en="Logo"
        description="TP VPN 的标识由一个 24% 圆角的品牌蓝方块与白色 TP 合体字形构成，配 Inter Bold 字标。八个变体、构成网格、安全空间、最小尺寸与禁用示例都在这一页，每个文件可直接下载。"
        actions={
          <>
            <a href={downloadUrl(PACKS.logo)} download className={buttonVariants({ variant: 'primary', size: 'md' })}>
              <Package aria-hidden />
              下载 Logo 包
            </a>
            <ButtonLink to="/brand/app-icon" variant="outline" size="md">
              App Icon →
            </ButtonLink>
          </>
        }
      />

      {/* ------------------------------------------------------------ */}
      <Section id="variants" title="标识变体" en="Variants" description="横版是默认首选；蓝底用反白版，空间受限用堆叠或仅图形，单色印刷用 mono 版。切换查看每个变体在对应底色上的样子。">
        <Preview
          padded={false}
          centered={false}
          label={`${active.title} 预览`}
          toolbar={
            <>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={2}
                value={variantId}
                onValueChange={(v) => v && setVariantId(v as VariantId)}
                aria-label="选择 Logo 变体"
                className="flex-wrap"
              >
                {VARIANTS.map((v) => (
                  <ToggleGroupItem key={v.id} value={v.id} aria-label={`${v.title} ${v.en}`}>
                    {v.title}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <div className="ml-auto">
                <DownloadLinks v={active} />
              </div>
            </>
          }
        >
          <div className={cn('flex min-h-72 flex-col items-center justify-center gap-6 px-8 py-14 transition-colors duration-200', SURFACE_CLASS[active.surface])}>
            <img
              key={active.id}
              src={active.svg}
              alt={`TP VPN ${active.title}标识（${active.en}）`}
              style={{ height: active.heroHeight }}
              className="max-w-full"
              draggable={false}
            />
          </div>
        </Preview>
        <div className="-mt-3 mb-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-secondary">
          <span className="font-mono text-[13px] text-fg-primary">{active.file}.svg</span>
          <Pill tone="outline" size="sm">
            {SURFACE_LABEL[active.surface]}
          </Pill>
          <span>{active.use}</span>
        </div>

        <SubSection title="全部变体" en="All files" description="文件名前缀 tp-vpn-logo-；PNG 提供 @1x / @2x 两档，横版与字标 @1x 宽 1024、图形 512。">
          <Grid cols={2} gap="md">
            {VARIANTS.map((v) => (
              <div key={v.id} className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1">
                <div className={cn('flex h-32 items-center justify-center px-6', SURFACE_CLASS[v.surface])}>
                  <img src={v.svg} alt={`TP VPN ${v.title}标识（${v.en}）`} style={{ height: v.cardHeight }} draggable={false} />
                </div>
                <div className="flex flex-1 flex-col gap-3 border-t border-border-subtle p-4">
                  <div>
                    <p className="font-semibold text-fg-primary">
                      {v.title} <span className="font-medium text-fg-muted">{v.en}</span>
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-fg-muted">{v.file}</p>
                    <p className="mt-1.5 text-sm leading-6 text-fg-secondary">{v.use}</p>
                  </div>
                  <div className="mt-auto">
                    <DownloadLinks v={v} />
                  </div>
                </div>
              </div>
            ))}
          </Grid>
        </SubSection>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="construction" title="构成" en="Construction" description="所有尺寸都以图形高度为基准比例，放大缩小时关系不变。字形 path 来自 Figma 官方文件，任何重绘都视为改动标识。">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <figure className="rounded-xl border border-border-default bg-bg-surface p-6 shadow-level-1">
            <img
              src={brandUrl.logoSvg('grid')}
              alt="TP VPN 图形构成网格：66 单位正方形、24% 圆角、字形 42.24 × 35.64 位于 (11.85, 17.08)"
              className="mx-auto w-full max-w-[26rem]"
              draggable={false}
            />
            <figcaption className="mt-4 text-center text-xs text-fg-muted">tp-vpn-logo-grid.svg · 每格 1/12 边长</figcaption>
          </figure>
          <dl className="divide-y divide-border-subtle rounded-xl border border-border-default bg-bg-surface shadow-level-1">
            {CONSTRUCTION_SPECS.map((s) => (
              <div key={s.label} className="grid grid-cols-[5.5rem_1fr] gap-3 px-5 py-3.5">
                <dt className="text-sm font-medium text-fg-muted">{s.label}</dt>
                <dd className="min-w-0">
                  <p className="font-mono text-[13px] text-fg-primary tnum">{s.value}</p>
                  <p className="mt-0.5 text-sm leading-6 text-fg-secondary">{s.note}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="clear-space" title="安全空间" en="Clear Space" description={`四周最小留白 X = 图形高度 × ${token('logo.clear-space-ratio')}，即 Logo 高度的一半。安全空间内不得出现文字、图形、其他标识或画面主体。`}>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <figure className="rounded-xl border border-border-default bg-bg-surface p-6 shadow-level-1">
            <img
              src={brandUrl.logoSvg('clearspace')}
              alt="TP VPN 安全空间图：Logo 四周留白 X 等于图形高度的一半"
              className="mx-auto w-full max-w-[26rem]"
              draggable={false}
            />
            <figcaption className="mt-4 text-center text-xs text-fg-muted">tp-vpn-logo-clearspace.svg</figcaption>
          </figure>
          <div className="flex flex-col justify-between gap-6 rounded-xl border border-border-default bg-bg-canvas p-6 shadow-level-1">
            <div className="flex items-center justify-center">
              <div className="rounded-sm border border-dashed border-border-strong" style={{ padding: 32 }}>
                <img src={horizontalSvg} alt="高度 64px 的 TP VPN 横版标识，四周留白 32px" style={{ height: 64 }} draggable={false} />
              </div>
            </div>
            <ul className="space-y-1.5 text-sm leading-6 text-fg-secondary">
              <li>
                图形高 64px → X = <span className="font-mono text-fg-primary tnum">32px</span>，容器内边距 ≥ X。
              </li>
              <li>放在按钮或卡片内时同样适用；与其他品牌并列时以两者中较大的 X 为准。</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="minimum-size" title="最小尺寸" en="Minimum Size" description="低于最小尺寸时字标会糊成一团——改用仅图形。">
        <Preview background="surface" label="最小尺寸演示" centered={false}>
          <div className="flex flex-wrap items-end justify-center gap-x-12 gap-y-8">
          {[minMark, 32, 48].map((s) => (
            <figure key={s} className="flex flex-col items-center gap-3">
              <img src={markSvg} alt={`${s}px 的 TP VPN 图形`} width={s} height={s} draggable={false} />
              <figcaption className="font-mono text-xs text-fg-muted tnum">{s}px{s === minMark ? ' · 最小' : ''}</figcaption>
            </figure>
          ))}
          <span className="hidden h-16 w-px bg-border-default sm:block" aria-hidden />
          {[minHorizontal, 128, 160].map((w) => (
            <figure key={w} className="flex flex-col items-center gap-3">
              <img
                src={horizontalSvg}
                alt={`${w}px 宽的 TP VPN 横版标识`}
                width={w}
                height={Math.round((w * LOCKUP.markSize) / LOCKUP.totalWidth)}
                draggable={false}
              />
              <figcaption className="font-mono text-xs text-fg-muted tnum">{w}px 宽{w === minHorizontal ? ' · 最小' : ''}</figcaption>
            </figure>
          ))}
          </div>
        </Preview>
        <DocTable
          caption="最小尺寸"
          head={
            <>
              <th>场景</th>
              <th>图形（mark）</th>
              <th>横版整体</th>
            </>
          }
        >
          <tr>
            <td className="font-medium text-fg-primary">屏幕</td>
            <td className="font-mono text-[13px] text-fg-secondary tnum">≥ {minMark}px</td>
            <td className="font-mono text-[13px] text-fg-secondary tnum">≥ {minHorizontal}px 宽</td>
          </tr>
          <tr>
            <td className="font-medium text-fg-primary">印刷</td>
            <td className="font-mono text-[13px] text-fg-secondary tnum">≥ 8mm</td>
            <td className="font-mono text-[13px] text-fg-secondary tnum">≥ 32mm 宽</td>
          </tr>
        </DocTable>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="misuse" title="禁用示例" en="Misuse" description="以下八种改动一律禁止。示例都由真实 SVG 加 CSS 变形生成——这正是它们看起来「差一点」的原因。">
        <LogoMisuseGrid />
        <Callout tone="info" title="需要变化时怎么办">
          只从八个官方变体里选。底色太花就先压暗再用 mark-mono-white；空间太小就用 mark；想要「更醒目」请调整版式与留白，而不是改动标识本身。
        </Callout>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="usage" title="使用场景" en="Where to Use Which File" description="按场景选文件；网页优先 SVG，邮件与第三方平台用 @2x PNG。">
        <DocTable
          caption="场景与文件对应"
          head={
            <>
              <th className="w-44">场景</th>
              <th>文件</th>
              <th>说明</th>
            </>
          }
        >
          {USAGE_ROWS.map((r) => (
            <tr key={r.scene} className="transition-colors hover:bg-bg-surface-hover">
              <td className="font-medium text-fg-primary">{r.scene}</td>
              <td className="font-mono text-[12px] text-fg-brand">{r.file}</td>
              <td className="text-fg-secondary">{r.note}</td>
            </tr>
          ))}
        </DocTable>
        <SubSection title="网站头部示例" en="Header markup" description="高度 32px 时宽度取 101px（207.48 : 66 ≈ 3.14）；始终写明 alt。">
          <CodeBlock code={HEADER_SNIPPET} lang="html" filename="header.html" />
        </SubSection>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="download" title="下载" en="Download" description="Logo 包含全部 SVG、@1x / @2x PNG、构成与安全空间图、README 与品牌许可。">
        <Grid cols={2} gap="md">
          <DownloadCard
            title="Logo 包"
            description="8 个变体 SVG + PNG（@1x / @2x）、grid 与 clearspace 图、LICENSE-BRAND。"
            href={downloadUrl(PACKS.logo)}
            bytes={packBytes(PACKS.logo)}
            formats={['SVG', 'PNG', 'ZIP']}
            preview={<img src={horizontalSvg} alt="TP VPN 横版标识" style={{ height: 40 }} draggable={false} />}
          />
          <DownloadCard
            title="品牌全包"
            description="Logo + App Icon + 社交图 + Inter 字体 + 62 面圆形国旗。"
            href={downloadUrl(PACKS.all)}
            bytes={packBytes(PACKS.all)}
            formats={['SVG', 'PNG', 'TTF', 'ZIP']}
            preview={
              <div className="flex items-center gap-4">
                <img src={markSvg} alt="TP VPN 图形" width={48} height={48} draggable={false} />
                <img src={brandUrl.logoSvg('mark-mono-black')} alt="TP VPN 单色黑图形" width={48} height={48} draggable={false} />
                <img src={brandUrl.appIconWeb('icon-192.png')} alt="TP VPN 192px 应用图标" width={48} height={48} draggable={false} />
              </div>
            }
          />
        </Grid>
        <Callout tone="warning" title="许可">
          代码采用 MIT 许可；品牌资产（Logo、App Icon、社交图）受 LICENSE-BRAND.md 约束，保留所有权利——仅可用于指代 TP VPN 产品，不得改动或用于暗示背书。
        </Callout>
      </Section>
    </>
  );
}
