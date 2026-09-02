/**
 * Public asset URL helpers. Everything under `public/` is mirrored by
 * scripts/sync-assets.mjs from the brand and tokens packages, and every URL
 * must be prefixed with Vite's BASE_URL so GitHub Pages project sites work.
 */

/** Vite base — always ends with "/" (e.g. "/" or "/tp-design-system/"). */
export const BASE_URL: string = import.meta.env.BASE_URL;

/** `asset('brand/flags/us.svg')` → `/tp-design-system/brand/flags/us.svg` */
export function asset(path: string): string {
  return BASE_URL + path.replace(/^\/+/, '');
}

/* ---------------------------------------------------------------- */
/* Brand (packages/brand/dist → public/brand)                         */
/* ---------------------------------------------------------------- */

/** Logo variants exported as SVG + PNG (`tp-vpn-logo-<variant>`). */
export const LOGO_VARIANTS = [
  'horizontal',
  'horizontal-reversed',
  'stacked',
  'mark',
  'mark-reversed',
  'mark-mono-black',
  'mark-mono-white',
] as const;
export type LogoVariant = (typeof LOGO_VARIANTS)[number];

/** Wordmark-only exports (PNG, `tp-vpn-wordmark[-white]`). */
export const WORDMARK_VARIANTS = ['wordmark', 'wordmark-white'] as const;
export type WordmarkVariant = (typeof WORDMARK_VARIANTS)[number];

/** Construction diagrams shipped as SVG (`tp-vpn-logo-<name>`). */
export const LOGO_DIAGRAMS = ['grid', 'clearspace'] as const;
export type LogoDiagram = (typeof LOGO_DIAGRAMS)[number];

export type PngScale = 1 | 2;

export const APP_ICON_PLATFORMS = ['ios', 'android', 'web', 'universal'] as const;
export type AppIconPlatform = (typeof APP_ICON_PLATFORMS)[number];

export const IOS_ICON_SIZES = [1024, 180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20] as const;
export const ANDROID_ICON_SIZES = [512, 192, 144, 96, 72, 48] as const;
export const UNIVERSAL_ICON_SIZES = [1024, 512, 256, 128, 64, 32] as const;
export const WEB_ICON_FILES = [
  'favicon.ico',
  'favicon-16.png',
  'favicon-32.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'icon.svg',
] as const;

export const SOCIAL_FILES = {
  og: 'og-default.png',
  avatar: 'avatar-1024.png',
  twitterHeader: 'twitter-header-1500x500.png',
  githubPreview: 'github-social-preview-1280x640.png',
} as const;

export const FONT_FILES = ['Inter-Regular.ttf', 'Inter-Medium.ttf', 'Inter-SemiBold.ttf', 'Inter-Bold.ttf', 'Inter-ExtraBold.ttf'] as const;

/** Relative (base-less) paths mirroring the brand package layout. */
export const BRAND_PATHS = {
  root: 'brand',
  manifest: 'brand/manifest.json',
  logoSvg: (variant: LogoVariant | LogoDiagram) => `brand/logo/svg/tp-vpn-logo-${variant}.svg`,
  logoPng: (variant: LogoVariant, scale: PngScale = 2) => `brand/logo/png/tp-vpn-logo-${variant}@${scale}x.png`,
  wordmarkPng: (variant: WordmarkVariant = 'wordmark', scale: PngScale = 2) => `brand/logo/png/tp-vpn-${variant}@${scale}x.png`,
  appIcon: (platform: AppIconPlatform, file: string) => `brand/app-icon/${platform}/${file}`,
  appIconIos: (size: number) => `brand/app-icon/ios/AppIcon-${size}.png`,
  appIconAndroid: (size: number) => `brand/app-icon/android/ic_launcher-${size}.png`,
  appIconAndroidAdaptive: (layer: 'foreground' | 'background', ext: 'png' | 'svg' = 'png') =>
    `brand/app-icon/android/ic_launcher_${layer}.${ext}`,
  appIconUniversal: (size: number) => `brand/app-icon/universal/tp-vpn-icon-${size}.png`,
  appIconWeb: (file: (typeof WEB_ICON_FILES)[number]) => `brand/app-icon/web/${file}`,
  flag: (code: string) => `brand/flags/${code.toLowerCase()}.svg`,
  social: (file: string) => `brand/social/${file}`,
  font: (file: string) => `brand/fonts/${file}`,
} as const;

/** Absolute URLs (BASE_URL applied) for brand files. */
export const brandUrl = {
  manifest: () => asset(BRAND_PATHS.manifest),
  logoSvg: (variant: LogoVariant | LogoDiagram) => asset(BRAND_PATHS.logoSvg(variant)),
  logoPng: (variant: LogoVariant, scale: PngScale = 2) => asset(BRAND_PATHS.logoPng(variant, scale)),
  wordmarkPng: (variant: WordmarkVariant = 'wordmark', scale: PngScale = 2) => asset(BRAND_PATHS.wordmarkPng(variant, scale)),
  appIcon: (platform: AppIconPlatform, file: string) => asset(BRAND_PATHS.appIcon(platform, file)),
  appIconIos: (size: number) => asset(BRAND_PATHS.appIconIos(size)),
  appIconAndroid: (size: number) => asset(BRAND_PATHS.appIconAndroid(size)),
  appIconAndroidAdaptive: (layer: 'foreground' | 'background', ext: 'png' | 'svg' = 'png') =>
    asset(BRAND_PATHS.appIconAndroidAdaptive(layer, ext)),
  appIconUniversal: (size: number) => asset(BRAND_PATHS.appIconUniversal(size)),
  appIconWeb: (file: (typeof WEB_ICON_FILES)[number]) => asset(BRAND_PATHS.appIconWeb(file)),
  /** circle-flags, ISO 3166-1 alpha-2 lower-case (`us`, `jp`, `hk`) */
  flag: (code: string) => asset(BRAND_PATHS.flag(code)),
  social: (file: string) => asset(BRAND_PATHS.social(file)),
  font: (file: string) => asset(BRAND_PATHS.font(file)),
};

/* ---------------------------------------------------------------- */
/* Downloads (packages/brand/dist/packs/*.zip → public/downloads)      */
/* ---------------------------------------------------------------- */

/** Zip packs produced by packages/brand (`dist/packs`). */
export const PACKS = {
  all: 'tp-vpn-brand-assets-all.zip',
  logo: 'tp-vpn-logo-pack.zip',
  appIcons: 'tp-vpn-app-icons.zip',
  social: 'tp-vpn-social-kit.zip',
  fonts: 'tp-vpn-fonts-inter.zip',
  flags: 'tp-vpn-flags.zip',
} as const;
export type PackKey = keyof typeof PACKS;

export function downloadUrl(zip: string): string {
  return asset(`downloads/${zip}`);
}

export interface DownloadIndexEntry {
  name: string;
  href: string;
  bytes: number;
  modified: string;
}
export interface DownloadIndex {
  generatedAt: string;
  files: DownloadIndexEntry[];
}

/** Reads `public/downloads/index.json` (written by sync-assets). Resolves to an empty list on failure. */
export async function fetchDownloadIndex(): Promise<DownloadIndex> {
  try {
    const res = await fetch(asset('downloads/index.json'), { cache: 'no-cache' });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as DownloadIndex;
  } catch {
    return { generatedAt: '', files: [] };
  }
}

/* ---------------------------------------------------------------- */
/* Tokens (packages/tokens/dist → public/tokens)                       */
/* ---------------------------------------------------------------- */

export const TOKEN_FORMATS = ['css', 'tailwind', 'json', 'dart', 'swift', 'kotlin', 'android', 'figma'] as const;
export type TokenFormat = (typeof TOKEN_FORMATS)[number];

/** Files each format ships (paths relative to `tokens/<format>/`). */
export const TOKEN_FILES: Record<TokenFormat, readonly string[]> = {
  css: ['tokens.css'],
  tailwind: ['theme.css'],
  json: ['tokens.json', 'tokens.flat.json'],
  dart: ['tp_tokens.dart'],
  swift: ['TPTokens.swift'],
  kotlin: ['TpTokens.kt'],
  android: ['values/colors.xml', 'values/dimens.xml'],
  figma: ['tokens.json'],
};

export function tokenUrl(format: TokenFormat, file: string = TOKEN_FILES[format][0]!): string {
  return asset(`tokens/${format}/${file}`);
}

/* ---------------------------------------------------------------- */

/** 1234567 → "1.2 MB" */
export function formatBytes(bytes: number, digits = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 ? 0 : digits)} ${units[i]}`;
}
