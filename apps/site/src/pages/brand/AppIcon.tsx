import type { ReactNode } from 'react';
import { Package, Share2 } from 'lucide-react';
import { ANDROID_ICON_SIZES, brandUrl, downloadUrl, PACKS, UNIVERSAL_ICON_SIZES, WEB_ICON_FILES, formatBytes } from '@/lib/assets';
import { token } from '@/lib/tokens';
import { cn } from '@/lib/cn';
import {
  ButtonLink,
  buttonVariants,
  Callout,
  CodeBlock,
  DoDont,
  DocTable,
  DownloadCard,
  Grid,
  PageHeader,
  Pill,
  Preview,
  Prose,
  Section,
  SubSection,
} from '@/components/docs';
import { brandFile, IOS_ICON_ENTRIES, iosPixelSize, packBytes } from './_parts/brandData';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** Rendered px for each universal size in the ladder (capped so 1024 still fits). */
const LADDER_DISPLAY: Record<(typeof UNIVERSAL_ICON_SIZES)[number], number> = {
  1024: 144,
  512: 112,
  256: 88,
  128: 64,
  64: 48,
  32: 32,
};

const IOS_IDIOM_LABEL: Record<string, string> = {
  iphone: 'iPhone',
  ipad: 'iPad',
  'ios-marketing': 'App Store',
};

/** Purpose by point size, per Apple's AppIcon.appiconset slots. */
const IOS_USAGE: Record<string, string> = {
  '20x20': '通知',
  '29x29': '设置',
  '40x40': 'Spotlight',
  '60x60': 'App 图标（iPhone）',
  '76x76': 'App 图标（iPad）',
  '83.5x83.5': 'App 图标（iPad Pro）',
  '1024x1024': 'App Store（无 alpha，直角方形）',
};

const ANDROID_DENSITY: Record<(typeof ANDROID_ICON_SIZES)[number], string> = {
  512: 'Google Play 商店图标',
  192: 'xxxhdpi（4×）',
  144: 'xxhdpi（3×）',
  96: 'xhdpi（2×）',
  72: 'hdpi（1.5×）',
  48: 'mdpi（1×）',
};

const WEB_META: Record<(typeof WEB_ICON_FILES)[number], { size: string; use: string }> = {
  'favicon.ico': { size: '16 / 32 / 48（PNG-in-ICO）', use: '旧式 favicon，<link rel="icon" sizes="any">' },
  'favicon-16.png': { size: '16', use: '现代浏览器 PNG favicon' },
  'favicon-32.png': { size: '32', use: '现代浏览器 PNG favicon' },
  'apple-touch-icon.png': { size: '180', use: 'iOS「添加到主屏幕」' },
  'icon-192.png': { size: '192', use: 'PWA manifest，purpose: any' },
  'icon-512.png': { size: '512', use: 'PWA manifest，purpose: any' },
  'icon-maskable-512.png': { size: '512', use: 'PWA maskable：纯 #1677FF 铺满，字形缩至 66% 安全区' },
  'icon.svg': { size: '矢量', use: '现代浏览器首选 favicon' },
};

const ADAPTIVE_XML = `<!-- res/mipmap-anydpi-v26/ic_launcher.xml -->
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@color/tp_color_blue_500" />
  <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>`;

const HEAD_HTML = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1677FF">`;

const WEBMANIFEST = `{
  "name": "TP VPN",
  "short_name": "TP VPN",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFBFF",
  "theme_color": "#1677FF",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "/icon.svg", "sizes": "any", "type": "image/svg+xml" }
  ]
}`;

/** iOS masks icons with a superellipse ≈ 22.37% of the side — used only to preview the system crop. */
const IOS_MASK_RADIUS = '22.37%';

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function Layer({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1">
      <div className={cn('flex aspect-square items-center justify-center p-6', className)}>{children}</div>
      <figcaption className="border-t border-border-subtle px-4 py-3">
        <p className="text-sm font-semibold text-fg-primary">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-fg-secondary">{hint}</p>
      </figcaption>
    </figure>
  );
}

/** Android adaptive canvas: 108dp total, 72dp visible, 66dp safe circle. */
function AdaptiveOverlay() {
  const safe = `${((1 - 66 / 108) / 2) * 100}%`;
  const visible = `${((1 - 72 / 108) / 2) * 100}%`;
  return (
    <>
      <span className="pointer-events-none absolute border border-dashed border-slate-400" style={{ inset: visible }} aria-hidden />
      <span className="pointer-events-none absolute rounded-full border-2 border-dashed border-status-success-solid" style={{ inset: safe }} aria-hidden />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AppIconPage() {
  const universal = (size: number) => brandUrl.appIconUniversal(size);
  const ios1024 = brandUrl.appIconIos(1024);
  const fgPng = brandUrl.appIconAndroidAdaptive('foreground', 'png');
  const bgPng = brandUrl.appIconAndroidAdaptive('background', 'png');
  const maskable = brandUrl.appIconWeb('icon-maskable-512.png');

  return (
    <>
      <PageHeader
        eyebrow="品牌 · Brand"
        title="App Icon"
        en="App Icon"
        description="图标就是 Logo 的图形本体：品牌蓝圆角方块 + 白色 TP 字形，没有文字、角标、阴影或渐变。iOS、Android、Web/PWA 与通用尺寸全部由同一个 SVG 生成。"
        actions={
          <>
            <a href={downloadUrl(PACKS.appIcons)} download className={buttonVariants({ variant: 'primary', size: 'md' })}>
              <Package aria-hidden />
              下载 App Icon 包
            </a>
            <ButtonLink to="/brand/logo" variant="outline" size="md">
              ← Logo
            </ButtonLink>
          </>
        }
      />

      {/* ------------------------------------------------------------ */}
      <Section id="sizes" title="尺寸阶梯" en="Size Ladder" description="通用 PNG：自带 24% 圆角、透明背景，用于桌面端、文档与演示。1024 至 32 六档，越小的档位字形越要保持清晰。">
        <Preview background="canvas" label="通用图标尺寸阶梯" centered={false}>
          <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-8">
          {UNIVERSAL_ICON_SIZES.map((size) => {
            const px = LADDER_DISPLAY[size];
            return (
              <figure key={size} className="flex flex-col items-center gap-3">
                <img src={universal(size)} alt={`TP VPN 通用图标 ${size}px`} width={px} height={px} draggable={false} className="shadow-level-1" style={{ borderRadius: '24%' }} />
                <figcaption className="font-mono text-xs text-fg-muted tnum">
                  {size}
                  {px !== size ? <span className="text-fg-muted"> · 显示 {px}</span> : null}
                </figcaption>
              </figure>
            );
          })}
          </div>
        </Preview>
        <p className="text-sm text-fg-secondary">
          文件：<code className="rounded-xs bg-bg-surface-sunken px-1 font-mono text-[13px] text-fg-primary">app-icon/universal/tp-vpn-icon-&lt;size&gt;.png</code>
          {' · '}全部 sRGB、8-bit。
        </p>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="ios" title="iOS" en="iOS" description="13 档，与 AppIcon.appiconset 的 Contents.json 一一对应。1024 供 App Store，必须无 alpha、直角方形；圆角由系统裁切。">
        <Grid cols={2} gap="md" className="mb-6">
          <Layer title="导出文件" hint="AppIcon-1024.png：直角、不透明、无圆角。" className="bg-checker">
            <img src={ios1024} alt="导出的 1024px iOS 图标：直角方形" width={128} height={128} draggable={false} />
          </Layer>
          <Layer title="系统显示（示意）" hint="iOS 自动套用超椭圆遮罩，因此文件里不要再叠一层圆角。" className="bg-bg-canvas">
            <img src={ios1024} alt="iOS 系统裁切后的图标示意" width={128} height={128} draggable={false} style={{ borderRadius: IOS_MASK_RADIUS }} className="shadow-level-2" />
          </Layer>
        </Grid>
        <DocTable
          caption="iOS 图标规格"
          head={
            <>
              <th className="w-14">预览</th>
              <th>点尺寸</th>
              <th>倍率</th>
              <th>像素</th>
              <th>设备</th>
              <th>文件</th>
              <th>用途</th>
            </>
          }
        >
          {IOS_ICON_ENTRIES.map((e, i) => {
            const px = iosPixelSize(e);
            return (
              <tr key={`${e.filename}-${e.idiom}-${e.size}-${i}`} className="transition-colors hover:bg-bg-surface-hover">
                <td>
                  <img src={brandUrl.appIcon('ios', e.filename)} alt="" width={28} height={28} draggable={false} style={{ borderRadius: IOS_MASK_RADIUS }} />
                </td>
                <td className="font-mono text-[13px] text-fg-primary tnum">{e.size.replace('x', ' × ')} pt</td>
                <td className="font-mono text-[13px] text-fg-secondary tnum">@{e.scale}</td>
                <td className="font-mono text-[13px] text-fg-secondary tnum">{px}</td>
                <td className="text-fg-secondary">{IOS_IDIOM_LABEL[e.idiom] ?? e.idiom}</td>
                <td className="font-mono text-[12px] text-fg-brand">{e.filename}</td>
                <td className="text-fg-secondary">{IOS_USAGE[e.size] ?? '—'}</td>
              </tr>
            );
          })}
        </DocTable>
        <Prose>
          <p>
            <strong>接入：</strong>把 <code>app-icon/ios/</code> 整个目录（含 <code>Contents.json</code>）复制为 Xcode 的{' '}
            <code>Assets.xcassets/AppIcon.appiconset</code>；Flutter 项目对应 <code>ios/Runner/Assets.xcassets/AppIcon.appiconset</code>。同一张 PNG 会被多个槽位引用（如 AppIcon-40 同时用于 iPhone 20pt@2x 与 iPad 40pt@1x），这是 Xcode 允许的。
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="android" title="Android" en="Android" description="Adaptive icon 由前景与背景两层组成，系统按 OEM 形状裁切。前景只放字形，背景纯品牌蓝；圆角方块本身不出现在任何一层。">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-full border-2 border-dashed border-status-success-solid" aria-hidden />
            66dp 安全区（字形必须在圆内）
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-3 border border-dashed border-slate-400" aria-hidden />
            72dp 可见区
          </span>
          <span>108dp 画布 · 导出 432px（@4x）</span>
        </div>
        <Grid cols={3} gap="md">
          <Layer title="ic_launcher_foreground" hint="仅字形，透明背景；字形最长边 = 画布 44%，落在 66dp 安全圆内。" className="relative bg-checker p-0">
            <img src={fgPng} alt="Android 前景层：透明背景上的白色 TP 字形" className="size-full" draggable={false} />
            <AdaptiveOverlay />
          </Layer>
          <Layer title="ic_launcher_background" hint={`纯 ${token('color.blue.500')}（tp_color_blue_500），无渐变。`} className="relative p-0">
            <img src={bgPng} alt="Android 背景层：纯品牌蓝" className="size-full" draggable={false} />
            <AdaptiveOverlay />
          </Layer>
          <Layer title="合成（圆形遮罩示意）" hint="Pixel 默认圆形；其他厂商为方圆形或泪滴，字形始终完整。" className="bg-bg-canvas">
            <div className="relative size-[66.67%] overflow-hidden rounded-full shadow-level-2">
              <img src={bgPng} alt="" className="absolute inset-0 size-full scale-[1.5]" draggable={false} />
              <img src={fgPng} alt="合成后的 Android 圆形图标" className="absolute inset-0 size-full scale-[1.5]" draggable={false} />
            </div>
          </Layer>
        </Grid>
        <SubSection title="Legacy 尺寸" en="Legacy launcher" description="Android 7.1 及以下，以及 Google Play 商店图标：直接使用带圆角的位图。">
          <DocTable
            caption="Android legacy 图标"
            head={
              <>
                <th className="w-14">预览</th>
                <th>尺寸</th>
                <th>密度</th>
                <th>文件</th>
                <th>大小</th>
              </>
            }
          >
            {ANDROID_ICON_SIZES.map((size) => {
              const file = `ic_launcher-${size}.png`;
              const info = brandFile(`app-icon/android/${file}`);
              return (
                <tr key={size} className="transition-colors hover:bg-bg-surface-hover">
                  <td>
                    <img src={brandUrl.appIconAndroid(size)} alt="" width={28} height={28} draggable={false} />
                  </td>
                  <td className="font-mono text-[13px] text-fg-primary tnum">{size}</td>
                  <td className="text-fg-secondary">{ANDROID_DENSITY[size]}</td>
                  <td className="font-mono text-[12px] text-fg-brand">{file}</td>
                  <td className="font-mono text-[12px] text-fg-muted tnum">{info ? formatBytes(info.bytes) : '—'}</td>
                </tr>
              );
            })}
          </DocTable>
          <CodeBlock code={ADAPTIVE_XML} lang="xml" filename="ic_launcher.xml" />
        </SubSection>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="web" title="Web / PWA" en="Web / PWA" description="favicon 优先 SVG，旧浏览器回退 ICO；PWA 需要 any 与 maskable 两种 purpose。">
        <DocTable
          caption="Web / PWA 图标"
          head={
            <>
              <th className="w-14">预览</th>
              <th>文件</th>
              <th>尺寸</th>
              <th>用途</th>
              <th>大小</th>
            </>
          }
        >
          {WEB_ICON_FILES.map((file) => {
            const info = brandFile(`app-icon/web/${file}`);
            const meta = WEB_META[file];
            return (
              <tr key={file} className="transition-colors hover:bg-bg-surface-hover">
                <td>
                  <img src={brandUrl.appIconWeb(file)} alt="" width={28} height={28} draggable={false} />
                </td>
                <td className="font-mono text-[12px] text-fg-brand">{file}</td>
                <td className="font-mono text-[13px] text-fg-secondary tnum">{meta.size}</td>
                <td className="text-fg-secondary">{meta.use}</td>
                <td className="font-mono text-[12px] text-fg-muted tnum">{info ? formatBytes(info.bytes) : '—'}</td>
              </tr>
            );
          })}
        </DocTable>

        <SubSection title="maskable 安全区" en="Maskable safe zone" description="W3C 规定 maskable 图标的安全区是直径 80% 的圆；TP 的字形再缩至安全区的 66%，任何形状裁切都不会碰到字形。">
          <Grid cols={2} gap="md">
            <Layer title="icon-maskable-512.png" hint="纯品牌蓝铺满整张画布，字形居中。" className="relative bg-checker p-0">
              <img src={maskable} alt="PWA maskable 图标：品牌蓝铺满，字形居中" className="size-full" draggable={false} />
              <span className="pointer-events-none absolute rounded-full border-2 border-dashed border-white/90" style={{ inset: '10%' }} aria-hidden />
            </Layer>
            <Layer title="裁切后（圆形示意）" hint="Android Chrome 的圆形、方圆形或方形遮罩都在安全区之外。" className="bg-bg-canvas">
              <div className="size-[80%] overflow-hidden rounded-full shadow-level-2">
                <img src={maskable} alt="裁切为圆形的 maskable 图标示意" className="size-full" draggable={false} />
              </div>
            </Layer>
          </Grid>
        </SubSection>

        <SubSection title="接入代码" en="Markup">
          <CodeBlock code={HEAD_HTML} lang="html" filename="index.html" />
          <CodeBlock code={WEBMANIFEST} lang="json" filename="site.webmanifest" />
        </SubSection>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="rules" title="规则" en="Rules" description="三条最容易出错的地方，每条都能在提审或上架时被打回。">
        <DoDont
          do={<img src={ios1024} alt="直角方形的 1024 图标" width={96} height={96} draggable={false} />}
          dont={
            <span className="inline-block overflow-hidden bg-slate-900" style={{ borderRadius: IOS_MASK_RADIUS }}>
              <img src={universal(128)} alt="自带圆角、再被系统裁切一次的图标：四角露出底色" width={96} height={96} draggable={false} />
            </span>
          }
          doCaption="iOS 提供直角方形，让系统自己裁切圆角。"
          dontCaption="不要在 iOS 上再叠一层圆角：双重圆角会在四角露出底色或出现黑边。"
          previewClassName="bg-checker"
        />
        <DoDont
          do={
            <span className="relative inline-block size-24 overflow-hidden rounded-full bg-blue-500">
              <img src={fgPng} alt="前景只有字形的 Android 图标" className="absolute inset-0 size-full scale-[1.5]" draggable={false} />
            </span>
          }
          dont={
            <span className="relative inline-flex size-24 items-center justify-center overflow-hidden rounded-full bg-blue-500">
              <img src={universal(128)} alt="把整块圆角方块当前景放进圆形遮罩里的错误示例" width={60} height={60} draggable={false} />
            </span>
          }
          doCaption="Android 前景层只放字形，背景层纯蓝。"
          dontCaption="不要把带圆角的整块图标当前景：遮罩里会出现「圆中方」。"
        />
        <DoDont
          do={<img src={ios1024} alt="不透明的 1024 App Store 图标" width={96} height={96} draggable={false} />}
          dont={<img src={universal(128)} alt="四角透明的图标，App Store 会拒绝" width={96} height={96} draggable={false} />}
          doCaption="App Store 1024 必须完全不透明。"
          dontCaption="带 alpha 通道的 1024 会被 App Store Connect 直接拒收。"
          previewClassName="bg-checker"
        />
        <Callout tone="warning" title="任何平台都不得">
          在图标上添加文字、角标、阴影、描边或渐变；改动字形位置或比例；用非 #1677FF 的背景色。需要区分测试包时改 App 名称，不改图标。
        </Callout>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="download" title="下载" en="Download" description="App Icon 包含 iOS appiconset（含 Contents.json）、Android adaptive + legacy、Web/PWA 与通用 PNG。">
        <Grid cols={2} gap="md">
          <DownloadCard
            title="App Icon 包"
            description="iOS 13 档 · Android adaptive 两层 + legacy 6 档 · Web 8 个文件 · 通用 6 档。"
            href={downloadUrl(PACKS.appIcons)}
            bytes={packBytes(PACKS.appIcons)}
            formats={['PNG', 'SVG', 'ICO', 'ZIP']}
            preview={
              <div className="flex items-end gap-3">
                {[64, 32].map((s) => (
                  <img key={s} src={universal(s)} alt={`TP VPN 通用图标 ${s}px`} width={s} height={s} draggable={false} />
                ))}
              </div>
            }
          />
          <DownloadCard
            title="社交图套件"
            description="og-default 1200×630 · avatar 1024 · Twitter header 1500×500 · GitHub 预览 1280×640。"
            href={downloadUrl(PACKS.social)}
            bytes={packBytes(PACKS.social)}
            formats={['PNG', 'ZIP']}
            icon={<Share2 aria-hidden />}
            preview={<img src={brandUrl.social('avatar-1024.png')} alt="TP VPN 社交头像：白底圆内的图形" width={72} height={72} draggable={false} className="rounded-full shadow-level-1" />}
          />
        </Grid>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-fg-secondary">
          <Pill tone="brand" size="sm">
            Flutter / iOS 对应
          </Pill>
          <span>
            Flutter：<code className="rounded-xs bg-bg-surface-sunken px-1 font-mono text-[13px] text-fg-primary">ios/</code> 目录替换 Runner 的 AppIcon.appiconset，
            <code className="rounded-xs bg-bg-surface-sunken px-1 font-mono text-[13px] text-fg-primary">android/</code> 的 ic_launcher-*.png 按密度放入 mipmap-*，adaptive 两层放 mipmap-anydpi-v26；原生 iOS 直接拖入 Xcode。
          </span>
        </div>
      </Section>
    </>
  );
}
