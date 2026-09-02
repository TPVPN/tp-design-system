import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Braces, ChevronRight, FileArchive, FileCode, Flag, Image, Package, Shapes, Type } from 'lucide-react';
import { ButtonLink, Callout, DocTable, DownloadCard, Grid, PageHeader, Pill, Prose, Section, StatCard, buttonVariants } from '@/components/docs';
import { SITE } from '@/app/routes';
import { FONT_FILES, LOGO_VARIANTS, PACKS, SOCIAL_FILES, asset, brandUrl, downloadUrl, fetchDownloadIndex, formatBytes, type DownloadIndex, type LogoVariant, type PackKey } from '@/lib/assets';
import { cn } from '@/lib/cn';
import { TOKEN_DIST_FILES, useFileSizes } from './_parts/tokenFiles';
import manifest from '../../../../packages/brand/dist/manifest.json';

/* ------------------------------------------------------------------ */
/* Data (from packages/brand/dist/manifest.json + zip listings)          */
/* ------------------------------------------------------------------ */

const MANIFEST_BYTES = new Map(manifest.files.map((f) => [f.path, f.bytes] as const));
const bytesOf = (path: string): number => MANIFEST_BYTES.get(path) ?? 0;

const ASSET_FILES = manifest.files.filter((f) => f.kind !== 'pack');
const ASSET_BYTES = ASSET_FILES.reduce((sum, f) => sum + f.bytes, 0);
const PACK_FILES = manifest.files.filter((f) => f.kind === 'pack');
const PACK_BYTES = PACK_FILES.reduce((sum, f) => sum + f.bytes, 0);
const FLAG_COUNT = manifest.files.filter((f) => f.kind === 'flag' && f.format === 'svg').length;

interface PackMeta {
  key: PackKey;
  title: string;
  en: string;
  description: string;
  formats: string[];
  icon: ReactNode;
  /** Entries inside the zip (from `unzip -l`). */
  files: number;
  contents: string[];
}

const PACK_META: PackMeta[] = [
  {
    key: 'all',
    title: '品牌全包',
    en: 'All brand assets',
    description: 'Logo、App Icon、社交图、国旗、字体一次取齐；含 README 与品牌许可。',
    formats: ['SVG', 'PNG', 'TTF', 'ZIP'],
    icon: <Package aria-hidden />,
    files: 143,
    contents: [
      'README.txt · LICENSE-BRAND.md',
      'logo/svg · 11 个（7 个变体 + wordmark ×2 + grid + clearspace）',
      'logo/png · 18 个（9 种 × @1x / @2x）',
      'app-icon/ios · 13 档 + Contents.json',
      'app-icon/android · legacy 6 档 + adaptive foreground / background（PNG + SVG）',
      'app-icon/web · favicon.ico · 16 / 32 · apple-touch-icon · 192 / 512 · maskable-512 · icon.svg · README',
      'app-icon/universal · 1024 / 512 / 256 / 128 / 64 / 32',
      'social · og-default · avatar-1024 · twitter-header · github-social-preview',
      `flags · ${FLAG_COUNT} 面圆旗 SVG + index.json + LICENSE（MIT）`,
      'fonts · Inter 5 字重 TTF + LICENSE-Inter（OFL）',
    ],
  },
  {
    key: 'logo',
    title: 'Logo 包',
    en: 'Logo pack',
    description: '7 个 Logo 变体 + 字标的 SVG 与 PNG（@1x / @2x），附构成网格与安全空间图。',
    formats: ['SVG', 'PNG'],
    icon: <Shapes aria-hidden />,
    files: 31,
    contents: [
      'README.txt · LICENSE-BRAND.md',
      'svg/ tp-vpn-logo-horizontal · horizontal-reversed · stacked · mark · mark-reversed · mark-mono-black · mark-mono-white',
      'svg/ tp-vpn-wordmark · wordmark-white',
      'svg/ tp-vpn-logo-grid · clearspace（构成与安全空间图）',
      'png/ 上述 9 种 × @1x / @2x',
    ],
  },
  {
    key: 'appIcons',
    title: 'App Icon 包',
    en: 'App icons',
    description: 'iOS 13 档（含 Contents.json）、Android legacy + adaptive、Web / PWA favicon 与 maskable、通用 6 档。',
    formats: ['PNG', 'SVG', 'ICO'],
    icon: <Image aria-hidden />,
    files: 40,
    contents: [
      'README.txt · LICENSE-BRAND.md',
      'ios/ AppIcon-1024 · 180 · 167 · 152 · 120 · 87 · 80 · 76 · 60 · 58 · 40 · 29 · 20 + Contents.json',
      'android/ ic_launcher-512 · 192 · 144 · 96 · 72 · 48 + ic_launcher_foreground / background（PNG + SVG）',
      'web/ favicon.ico · favicon-16 / 32 · apple-touch-icon · icon-192 / 512 · icon-maskable-512 · icon.svg · README.md',
      'universal/ tp-vpn-icon-1024 · 512 · 256 · 128 · 64 · 32',
    ],
  },
  {
    key: 'social',
    title: '社交图包',
    en: 'Social kit',
    description: 'OG 默认图 1200×630、头像 1024、Twitter 头图 1500×500、GitHub 社交预览 1280×640。',
    formats: ['PNG'],
    icon: <Image aria-hidden />,
    files: 6,
    contents: [
      'README.txt · LICENSE-BRAND.md',
      'social/og-default.png · 1200×630',
      'social/avatar-1024.png · 1024×1024',
      'social/twitter-header-1500x500.png',
      'social/github-social-preview-1280x640.png',
    ],
  },
  {
    key: 'flags',
    title: '国旗包',
    en: 'Flags',
    description: `${FLAG_COUNT} 面 circle-flags 圆形国旗 SVG，附 zh / en 名称索引；MIT 许可。`,
    formats: ['SVG', 'JSON'],
    icon: <Flag aria-hidden />,
    files: 66,
    contents: ['README.txt · LICENSE-BRAND.md', `flags/ ${FLAG_COUNT} 面圆旗（ae … za，ISO 3166-1 alpha-2 小写）`, 'flags/index.json · zh / en 名称', 'flags/LICENSE.txt · MIT（HatScripts）'],
  },
  {
    key: 'fonts',
    title: '字体包 · Inter',
    en: 'Inter fonts',
    description: 'Inter Regular / Medium / SemiBold / Bold / ExtraBold 静态 TTF，SIL Open Font License 1.1。',
    formats: ['TTF'],
    icon: <Type aria-hidden />,
    files: 8,
    contents: ['README.txt · LICENSE-BRAND.md', 'fonts/Inter-Regular · Medium · SemiBold · Bold · ExtraBold .ttf', 'fonts/LICENSE-Inter.txt · SIL OFL 1.1'],
  },
];

const LOGO_TILES: { variant: LogoVariant; label: string; dark?: boolean }[] = [
  { variant: 'horizontal', label: '横版' },
  { variant: 'horizontal-reversed', label: '横版反白', dark: true },
  { variant: 'stacked', label: '堆叠' },
  { variant: 'mark', label: '仅图形' },
  { variant: 'mark-reversed', label: '图形反白', dark: true },
  { variant: 'mark-mono-black', label: '单色黑' },
  { variant: 'mark-mono-white', label: '单色白', dark: true },
];

const SOCIAL_ITEMS: { file: string; title: string; size: string; description: string }[] = [
  { file: SOCIAL_FILES.og, title: 'og-default.png', size: '1200×630', description: '默认 Open Graph 图：左 Logo 横版，右侧 #1677FF → #4096FF 渐变块。' },
  { file: SOCIAL_FILES.twitterHeader, title: 'twitter-header-1500x500.png', size: '1500×500', description: 'X / Twitter 头图。' },
  { file: SOCIAL_FILES.githubPreview, title: 'github-social-preview-1280x640.png', size: '1280×640', description: 'GitHub 仓库社交预览。' },
  { file: SOCIAL_FILES.avatar, title: 'avatar-1024.png', size: '1024×1024', description: '头像：mark 居中于白底圆内。' },
];

const FONT_WEIGHTS: Record<(typeof FONT_FILES)[number], { name: string; weight: number }> = {
  'Inter-Regular.ttf': { name: 'Regular', weight: 400 },
  'Inter-Medium.ttf': { name: 'Medium', weight: 500 },
  'Inter-SemiBold.ttf': { name: 'SemiBold', weight: 600 },
  'Inter-Bold.ttf': { name: 'Bold', weight: 700 },
  'Inter-ExtraBold.ttf': { name: 'ExtraBold', weight: 800 },
};

const LICENSE_URL = `${SITE.github}/tp-design-system/blob/main/LICENSE-BRAND.md`;

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function PackBlock({ pack, bytes }: { pack: PackMeta; bytes: number }) {
  const zip = PACKS[pack.key];
  return (
    <div className="flex flex-col gap-3">
      <DownloadCard
        title={
          <>
            {pack.title} <span className="font-normal text-fg-muted">{pack.en}</span>
          </>
        }
        description={pack.description}
        href={downloadUrl(zip)}
        bytes={bytes}
        formats={pack.formats}
        icon={pack.icon}
        filename={zip}
      />
      <details className="group rounded-lg border border-border-default bg-bg-surface text-sm">
        <summary className="cursor-pointer list-none px-4 py-2.5 text-fg-secondary select-none hover:text-fg-primary [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-1.5">
            <ChevronRight className="size-3.5 transition-transform duration-200 group-open:rotate-90" aria-hidden />
            包含清单 · {pack.files} 个文件
            <span className="ml-1 font-mono text-xs text-fg-muted">{zip}</span>
          </span>
        </summary>
        <ul className="flex flex-col gap-1 border-t border-border-subtle px-4 py-3 text-xs leading-5 text-fg-secondary">
          {pack.contents.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-fg-placeholder" aria-hidden>
                ·
              </span>
              <span className="font-mono">{line}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function LogoTile({ label, svg, png, alt, dark }: { label: string; svg: string; png: string; alt: string; dark?: boolean }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1">
      <div className={cn('flex h-28 items-center justify-center p-5', dark ? 'bg-gradient-primary' : 'bg-bg-canvas')}>
        <img src={svg} alt={alt} className="max-h-14 max-w-full" loading="lazy" decoding="async" />
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="truncate text-sm font-medium text-fg-primary">{label}</span>
        <span className="flex shrink-0 gap-0.5">
          <a href={svg} download className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            SVG
          </a>
          <a href={png} download className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            PNG
          </a>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DownloadsPage() {
  const [index, setIndex] = useState<DownloadIndex | null>(null);
  useEffect(() => {
    let alive = true;
    void fetchDownloadIndex().then((data) => alive && data.files.length > 0 && setIndex(data));
    return () => {
      alive = false;
    };
  }, []);

  const packBytes = (key: PackKey): number => {
    const zip = PACKS[key];
    return index?.files.find((f) => f.name === zip)?.bytes ?? bytesOf(`packs/${zip}`);
  };

  const tokenUrls = useMemo(() => TOKEN_DIST_FILES.map((f) => f.href), []);
  const tokenSizes = useFileSizes(tokenUrls);
  const tokenBytes = TOKEN_DIST_FILES.reduce((sum, f) => sum + (tokenSizes[f.href] ?? f.bytes), 0);

  return (
    <>
      <PageHeader
        eyebrow="下载 · Downloads"
        title="下载中心"
        en="Downloads"
        description={`品牌资产、App Icon、社交图、国旗、字体与全部 Token 产物。所有文件都由 packages/brand 与 packages/tokens 构建脚本生成并提交，当前版本 v${manifest.version}。`}
        actions={
          <>
            <a href={downloadUrl(PACKS.all)} download={PACKS.all} className={buttonVariants({ size: 'lg' })}>
              <Package aria-hidden />
              下载品牌全包 · {formatBytes(packBytes('all'))}
            </a>
            <ButtonLink to="/platforms" variant="outline" size="lg">
              平台接入指南
            </ButtonLink>
          </>
        }
      />

      <Section id="overview" title="总览" en="Overview">
        <Grid cols={4} gap="sm">
          <StatCard label="资产文件" value={ASSET_FILES.length} hint={`合计 ${formatBytes(ASSET_BYTES)}`} icon={<FileArchive aria-hidden />} />
          <StatCard label="下载包" value={PACK_FILES.length} hint={`合计 ${formatBytes(index ? index.files.reduce((s, f) => s + f.bytes, 0) : PACK_BYTES)}`} icon={<Package aria-hidden />} />
          <StatCard label="Token 文件" value={TOKEN_DIST_FILES.length} hint={`8 种格式 · ${formatBytes(tokenBytes)}`} icon={<Braces aria-hidden />} />
          <StatCard label="圆形国旗" value={FLAG_COUNT} hint="circle-flags · MIT" icon={<Flag aria-hidden />} />
        </Grid>
      </Section>

      <Section id="packs" title="资产包" en="Packs" description="六个 ZIP，每个都带 README 与 LICENSE-BRAND.md。展开「包含清单」查看每个包里的文件。">
        <Grid cols={2} className="my-6">
          {PACK_META.map((pack) => (
            <PackBlock key={pack.key} pack={pack} bytes={packBytes(pack.key)} />
          ))}
        </Grid>
      </Section>

      <Section id="tokens" title="Token 全格式" en="Token formats" description="同一份 DTCG 源编译的 8 种产物；用法见「平台接入」。">
        <Grid cols={2} className="my-6">
          {TOKEN_DIST_FILES.map((f) => (
            <DownloadCard
              key={f.href}
              title={`${f.format}/${f.file}`}
              description={`${f.label} · ${f.platform}`}
              href={f.href}
              bytes={tokenSizes[f.href] ?? f.bytes}
              formats={[f.lang.toUpperCase()]}
              icon={f.lang === 'json' ? <Braces aria-hidden /> : <FileCode aria-hidden />}
              filename={f.file.split('/').pop()}
            />
          ))}
        </Grid>
      </Section>

      <Section id="logos" title="Logo 快速下载" en="Logo quick download" description="单个变体的 SVG 与 PNG @2x；构成规则、安全空间与禁用示例见「Logo」页。">
        <Grid cols={3} className="my-6">
          {LOGO_TILES.map((tile) => (
            <LogoTile
              key={tile.variant}
              label={tile.label}
              svg={brandUrl.logoSvg(tile.variant)}
              png={brandUrl.logoPng(tile.variant, 2)}
              alt={`TP VPN Logo · ${tile.label}`}
              dark={tile.dark}
            />
          ))}
          <LogoTile label="字标" svg={asset('brand/logo/svg/tp-vpn-wordmark.svg')} png={brandUrl.wordmarkPng('wordmark', 2)} alt="TP VPN 字标" />
          <LogoTile label="字标反白" svg={asset('brand/logo/svg/tp-vpn-wordmark-white.svg')} png={brandUrl.wordmarkPng('wordmark-white', 2)} alt="TP VPN 字标（反白）" dark />
          <LogoTile label="构成网格" svg={brandUrl.logoSvg('grid')} png={brandUrl.logoPng('horizontal', 2)} alt="TP VPN Logo 构成网格图" />
        </Grid>
        <p className="text-xs text-fg-muted">
          {LOGO_VARIANTS.length} 个变体 PNG 同时提供 @1x；「构成网格」的 PNG 按钮指向横版 @2x。
        </p>
      </Section>

      <Section id="social" title="社交图" en="Social images" description="四张成品图直接可用；尺寸已按各平台要求裁定，不要再缩放或加字。">
        <Grid cols={2} className="my-6">
          {SOCIAL_ITEMS.map((item) => (
            <DownloadCard
              key={item.file}
              title={item.title}
              description={item.description}
              href={brandUrl.social(item.file)}
              bytes={bytesOf(`social/${item.file}`)}
              formats={['PNG', item.size]}
              icon={<Image aria-hidden />}
              preview={<img src={brandUrl.social(item.file)} alt={`${item.title} 预览`} className="max-h-24 w-auto max-w-full rounded-sm shadow-level-1" loading="lazy" decoding="async" />}
            />
          ))}
        </Grid>
      </Section>

      <Section id="fonts" title="字体 · Inter" en="Fonts" description="站点与 App 使用 Inter 变量字体；资产包提供 5 个静态字重 TTF，用于字标描边与设计稿。">
        <DocTable
          caption="Inter 字重与下载"
          head={
            <>
              <th className="w-28">字重</th>
              <th>样张</th>
              <th className="w-44">文件</th>
              <th className="w-20">大小</th>
              <th className="w-20">下载</th>
            </>
          }
        >
          {FONT_FILES.map((file) => {
            const meta = FONT_WEIGHTS[file];
            return (
              <tr key={file}>
                <td className="text-fg-primary">
                  {meta.name} <span className="text-fg-muted tabular">{meta.weight}</span>
                </td>
                <td>
                  <span className="text-title-md text-fg-primary" style={{ fontWeight: meta.weight }}>
                    为可信连接而设计 0123456789
                  </span>
                </td>
                <td>
                  <code className="font-mono text-[12px] text-fg-secondary">{file}</code>
                </td>
                <td className="text-fg-secondary tabular">{formatBytes(bytesOf(`fonts/${file}`))}</td>
                <td>
                  <a href={brandUrl.font(file)} download={file} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                    TTF
                  </a>
                </td>
              </tr>
            );
          })}
        </DocTable>
        <Prose>
          <p>
            Inter © The Inter Project Authors，SIL Open Font License 1.1：可自由嵌入、分发与修改，但不得单独出售，改版需换名。Web 端直接用 <code>@fontsource-variable/inter</code>；
            Apple 平台可用 SF Pro 作等价替代。
          </p>
        </Prose>
      </Section>

      <Section id="license" title="许可" en="Licence">
        <Callout tone="warning" title="品牌资产 © TP VPN，保留所有权利">
          <p>
            TP 标志、「TP VPN」字标、组合、App Icon 与社交图是 TP VPN 的商标与版权作品，<strong>不适用</strong>本仓库代码的 MIT 许可。
          </p>
          <p>
            <strong>允许</strong>：在评测、文章、教程、对比与学术作品中用未经修改的资产指代 TP VPN；链接官网或商店页；如实标明「兼容 / 集成 TP VPN」且与自有品牌明确分开。使用时遵守安全空间 ≥ 图形高度 × 0.5、最小尺寸 24 px / 8 mm、仅用批准的颜色变体。
          </p>
          <p>
            <strong>禁止</strong>：改色、拉伸、旋转、裁切、加效果 / 描边 / 阴影 / 渐变、改布局或重绘字形；把资产用作自己的产品名、Logo、图标、域名或公司名；暗示不存在的赞助、背书或合作；用于周边或广告；作为其他素材库、图标集或模板再分发。
          </p>
          <p>
            第三方组件各自许可：Inter 字体 SIL OFL 1.1；circle-flags 国旗 MIT（© HatScripts）。完整条款见{' '}
            <a href={LICENSE_URL} target="_blank" rel="noreferrer">
              LICENSE-BRAND.md
            </a>
            。
          </p>
        </Callout>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="brand">品牌资产 · 保留所有权利</Pill>
          <Pill tone="success">Inter · SIL OFL 1.1</Pill>
          <Pill tone="success">circle-flags · MIT</Pill>
          <Pill tone="outline">代码 · MIT</Pill>
        </div>
      </Section>
    </>
  );
}
