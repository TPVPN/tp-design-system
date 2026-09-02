#!/usr/bin/env node
/**
 * TP VPN brand asset pipeline.
 *
 * Generates every logo / app-icon / social / flag / font deliverable from two
 * inputs only:
 *   1. the official mark geometry (66×66 rounded square, rx 15.84, glyph path
 *      copied verbatim from tp-web/public/brand/logo-mark.svg — never redrawn)
 *   2. fonts/Inter-Bold.ttf (the wordmark is outlined to <path> at build time)
 *
 * Outputs:
 *   src/logo/*.svg           vector sources (+ README.md with the construction maths)
 *   dist/logo/{svg,png}/     copies of the SVGs + PNG rasters (@1x/@2x)
 *   dist/app-icon/{ios,android,web,universal}/
 *   dist/social/             OG / avatar / X header / GitHub preview
 *   dist/flags/              circle-flags SVGs + index.json (en/zh names)
 *   dist/fonts/              Inter TTFs + OFL
 *   dist/packs/*.zip         downloadable packs
 *   dist/manifest.json       what the docs site reads for download cards
 *
 * Deterministic: same inputs → byte-identical outputs (fixed zip timestamps,
 * sorted file order, no randomness, no wall-clock values in files).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import TextToSVG from 'text-to-svg';
import archiver from 'archiver';

// ---------------------------------------------------------------------------
// Paths & constants
// ---------------------------------------------------------------------------

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(ROOT, '../..');
const SRC_LOGO = path.join(ROOT, 'src', 'logo');
const DIST = path.join(ROOT, 'dist');
const FONTS_DIR = path.join(ROOT, 'fonts');
const FLAGS_DIR = path.join(ROOT, 'vendor', 'circle-flags');

const VERSION = '1.0.0';
const LICENSE_NOTE =
  'TP VPN brand assets — © TP VPN, all rights reserved; fonts under OFL; flags MIT';
/** Fixed timestamp for zip entries so packs are byte-reproducible. */
const ZIP_DATE = new Date(Date.UTC(2026, 0, 1, 12, 0, 0));

const COLOR = {
  blue: '#1677FF', // brand blue 500
  blue400: '#4096FF', // gradient end (primary gradient)
  blue600: '#046BEF',
  blue100: '#E3EEFF',
  blue50: '#F2F7FF',
  cyan: '#00C6FF', // hero gradient end
  ink: '#0F172A', // slate-900 — wordmark colour
  white: '#FFFFFF',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
};

/**
 * Official mark geometry — BRIEF §2.1. The glyph path is copied verbatim from
 * tp-web/public/brand/logo-mark.svg (Figma export). DO NOT edit the `d` data.
 */
const MARK = {
  size: 66,
  rx: 15.84, // 24 % of the side
  glyph: {
    w: 42.24,
    h: 35.64,
    x: 11.85,
    y: 17.08,
    d: 'M3.02853 0.0561293C3.44733 -0.0231548 3.87503 0.00639278 4.29926 0.0014683C13.5771 0.00639278 22.8549 0.00639302 32.1327 0.00787036C32.8121 -0.00690307 33.4929 0.0300295 34.1639 0.142308C35.9409 0.499332 37.5993 1.38722 38.9145 2.62523C40.3667 4.01344 41.4491 5.80497 41.9203 7.759C42.4449 9.80857 42.2876 11.9832 41.7126 14.0047C41.5361 14.5774 41.3571 15.1531 41.0911 15.6923C40.2911 17.5651 38.9946 19.2301 37.357 20.4499C35.7387 21.6283 33.7594 22.3837 31.7381 22.3463C29.5789 22.3512 27.4196 22.3487 25.2604 22.3492C23.8527 22.2867 22.4722 22.7215 21.2232 23.3376C20.3253 23.8089 19.4714 24.3629 18.6659 24.9779C18.4424 25.1493 18.2348 25.3734 17.948 25.4325C17.6488 25.4881 17.4441 25.1104 17.5762 24.8647C18.305 22.9121 19.1129 20.9901 19.9015 19.0612C20.2655 18.1895 20.7085 17.3268 21.3799 16.6487C22.3154 15.6332 23.6727 14.9886 25.0651 15.0034C26.9756 15.0113 28.8866 15.0034 30.7972 15.0039C31.752 14.9778 32.7226 14.6311 33.3999 13.9441C34.106 13.2823 34.5372 12.3575 34.6568 11.4046C34.7765 10.4625 34.55 9.47764 34.0061 8.69563C33.4622 7.86635 32.5416 7.28231 31.5482 7.18283C31.1853 7.12719 30.8175 7.16412 30.453 7.15526C27.651 7.15723 24.8495 7.15181 22.0474 7.15476C21.8536 7.1592 21.6558 7.13605 21.4655 7.17939C21.2509 7.23405 21.2049 7.47978 21.1258 7.65312C17.7868 15.78 14.3716 23.8763 11.0435 32.0076C10.7033 32.8266 10.4116 33.6992 9.78812 34.3566C9.46278 34.6782 9.11666 34.9884 8.70924 35.2036C7.92158 35.6143 6.98609 35.7537 6.11883 35.5419C5.30002 35.3607 4.57517 34.8353 4.11039 34.1448C3.58677 33.322 3.44437 32.2863 3.66687 31.3438C3.82262 30.6603 4.14599 30.0319 4.39815 29.3814C4.79124 28.4822 5.14427 27.5662 5.53044 26.6641C5.90918 25.6915 6.33985 24.7401 6.72354 23.769C7.49883 21.909 8.27808 20.052 9.04991 18.1905C9.80938 16.3192 10.604 14.4627 11.3768 12.5968C11.979 11.1293 12.6099 9.67364 13.2033 8.20269C13.318 7.95253 13.4381 7.70286 13.5143 7.43792C13.5563 7.28329 13.3971 7.14048 13.2468 7.15427C9.94981 7.1523 6.65283 7.16067 3.35536 7.15378C2.5954 7.12472 1.84285 6.84058 1.26632 6.34419C0.603765 5.79708 0.16272 4.99981 0.0287247 4.15477C-0.0128088 3.74604 -0.016766 3.32943 0.06729 2.92513C0.267541 1.95501 0.903895 1.11292 1.71825 0.561381C2.1148 0.307278 2.55733 0.114731 3.02853 0.0561293Z',
  },
};

/** Wordmark rules — BRIEF §2.1. */
const WORDMARK = {
  text: 'TP VPN',
  fontFile: path.join(FONTS_DIR, 'Inter-Bold.ttf'),
  fontSize: MARK.size * 0.56, // 36.96
  letterSpacing: -0.02, // em (text-to-svg multiplies by fontSize)
  gap: MARK.size * 0.18, // 11.88 — horizontal lock-up
  stackedGap: MARK.size * 0.25, // 16.5 — stacked lock-up
};

/** Flags: ISO 3166-1 alpha-2 → English / 简体中文 display names. */
const FLAG_NAMES = {
  ae: { en: 'United Arab Emirates', zh: '阿联酋' },
  ar: { en: 'Argentina', zh: '阿根廷' },
  at: { en: 'Austria', zh: '奥地利' },
  au: { en: 'Australia', zh: '澳大利亚' },
  bd: { en: 'Bangladesh', zh: '孟加拉国' },
  be: { en: 'Belgium', zh: '比利时' },
  br: { en: 'Brazil', zh: '巴西' },
  ca: { en: 'Canada', zh: '加拿大' },
  ch: { en: 'Switzerland', zh: '瑞士' },
  cl: { en: 'Chile', zh: '智利' },
  cn: { en: 'China', zh: '中国' },
  co: { en: 'Colombia', zh: '哥伦比亚' },
  cz: { en: 'Czechia', zh: '捷克' },
  de: { en: 'Germany', zh: '德国' },
  dk: { en: 'Denmark', zh: '丹麦' },
  eg: { en: 'Egypt', zh: '埃及' },
  es: { en: 'Spain', zh: '西班牙' },
  fi: { en: 'Finland', zh: '芬兰' },
  fr: { en: 'France', zh: '法国' },
  gb: { en: 'United Kingdom', zh: '英国' },
  gr: { en: 'Greece', zh: '希腊' },
  hk: { en: 'Hong Kong, China', zh: '中国香港' },
  hu: { en: 'Hungary', zh: '匈牙利' },
  id: { en: 'Indonesia', zh: '印度尼西亚' },
  ie: { en: 'Ireland', zh: '爱尔兰' },
  il: { en: 'Israel', zh: '以色列' },
  in: { en: 'India', zh: '印度' },
  it: { en: 'Italy', zh: '意大利' },
  jp: { en: 'Japan', zh: '日本' },
  ke: { en: 'Kenya', zh: '肯尼亚' },
  kh: { en: 'Cambodia', zh: '柬埔寨' },
  kr: { en: 'South Korea', zh: '韩国' },
  kz: { en: 'Kazakhstan', zh: '哈萨克斯坦' },
  la: { en: 'Laos', zh: '老挝' },
  lk: { en: 'Sri Lanka', zh: '斯里兰卡' },
  lu: { en: 'Luxembourg', zh: '卢森堡' },
  mm: { en: 'Myanmar', zh: '缅甸' },
  mo: { en: 'Macao, China', zh: '中国澳门' },
  mx: { en: 'Mexico', zh: '墨西哥' },
  my: { en: 'Malaysia', zh: '马来西亚' },
  ng: { en: 'Nigeria', zh: '尼日利亚' },
  nl: { en: 'Netherlands', zh: '荷兰' },
  no: { en: 'Norway', zh: '挪威' },
  np: { en: 'Nepal', zh: '尼泊尔' },
  nz: { en: 'New Zealand', zh: '新西兰' },
  pe: { en: 'Peru', zh: '秘鲁' },
  ph: { en: 'Philippines', zh: '菲律宾' },
  pk: { en: 'Pakistan', zh: '巴基斯坦' },
  pl: { en: 'Poland', zh: '波兰' },
  pt: { en: 'Portugal', zh: '葡萄牙' },
  ro: { en: 'Romania', zh: '罗马尼亚' },
  ru: { en: 'Russia', zh: '俄罗斯' },
  sa: { en: 'Saudi Arabia', zh: '沙特阿拉伯' },
  se: { en: 'Sweden', zh: '瑞典' },
  sg: { en: 'Singapore', zh: '新加坡' },
  th: { en: 'Thailand', zh: '泰国' },
  tr: { en: 'Türkiye', zh: '土耳其' },
  tw: { en: 'Taiwan, China', zh: '中国台湾' },
  ua: { en: 'Ukraine', zh: '乌克兰' },
  us: { en: 'United States', zh: '美国' },
  vn: { en: 'Vietnam', zh: '越南' },
  za: { en: 'South Africa', zh: '南非' },
};

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------

/** Format a number for SVG output: ≤3 decimals, no float noise, no "-0". */
function n(v) {
  const s = Number(v.toFixed(3)).toString();
  return s === '-0' ? '0' : s;
}
/** Round *up* to 2 decimals — used for viewBox extents so nothing clips. */
function ceil2(v) {
  return Math.ceil(v * 100 - 1e-6) / 100;
}
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function writeFile(p, data) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, data);
}
function fmtBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}
function walk(dir, base = dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(abs, base));
    else out.push({ abs, rel: path.relative(base, abs).split(path.sep).join('/') });
  }
  return out;
}

// ---------------------------------------------------------------------------
// SVG builders
// ---------------------------------------------------------------------------

function svgDoc({ w, h, label, body, defs = '' }) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${n(w)}" height="${n(h)}" viewBox="0 0 ${n(w)} ${n(h)}" role="img" aria-label="${label}">\n` +
    (defs ? `  <defs>\n${defs}\n  </defs>\n` : '') +
    body +
    '\n</svg>\n'
  );
}

/**
 * The mark: rounded square + glyph. `x`,`y`,`scale` place/scale the whole
 * 66×66 unit; `rounded=false` gives the plain square used for the iOS 1024
 * marketing icon (iOS applies its own mask).
 */
function markSvg({ x = 0, y = 0, scale = 1, square = COLOR.blue, glyph = COLOR.white, rounded = true, indent = '  ' } = {}) {
  const transform = x || y || scale !== 1 ? ` transform="translate(${n(x)} ${n(y)})${scale !== 1 ? ` scale(${n(scale)})` : ''}"` : '';
  const rect = `<rect width="${MARK.size}" height="${MARK.size}"${rounded ? ` rx="${MARK.rx}"` : ''} fill="${square}"/>`;
  const p = `<path transform="translate(${MARK.glyph.x} ${MARK.glyph.y})" fill="${glyph}" d="${MARK.glyph.d}"/>`;
  return `${indent}<g${transform}>\n${indent}  ${rect}\n${indent}  ${p}\n${indent}</g>`;
}

/** The glyph alone (no square), placed so its bounding box starts at (x, y). */
function glyphOnlySvg({ x, y, scale, fill = COLOR.white, indent = '  ' }) {
  return `${indent}<path transform="translate(${n(x)} ${n(y)}) scale(${n(scale)})" fill="${fill}" d="${MARK.glyph.d}"/>`;
}

// ---------------------------------------------------------------------------
// Text outlining (text-to-svg + opentype.js)
// ---------------------------------------------------------------------------

const fontCache = new Map();
function loadFont(file) {
  if (!fontCache.has(file)) fontCache.set(file, TextToSVG.loadSync(file));
  return fontCache.get(file);
}

/**
 * Outline `text` and return the path data + its *tight glyph bounding box*.
 * `left` = visual left edge (bbox.x1) placed at this x.
 * Vertical placement, one of:
 *   capCenterY  — centre of the glyph bbox (for all-caps = cap-height centre) at this y
 *   baseline    — baseline at this y
 * text-to-svg's `letterSpacing` is in em units (multiplied by fontSize).
 */
function outlineText(text, { fontFile, fontSize, letterSpacing = 0, left = 0, capCenterY, baseline, anchor = 'left' }) {
  const tts = loadFont(fontFile);
  const opts = { kerning: true, letterSpacing: letterSpacing || false };
  // 1. measure at the origin
  const probe = tts.font.getPath(text, 0, 0, fontSize, opts);
  const bb = probe.getBoundingBox();
  const width = bb.x2 - bb.x1;
  const height = bb.y2 - bb.y1;
  // 2. solve the origin so the bbox lands where we want it
  let x0 = left - bb.x1;
  if (anchor === 'center') x0 = left - bb.x1 - width / 2;
  if (anchor === 'right') x0 = left - bb.x1 - width;
  let y0;
  if (capCenterY !== undefined) y0 = capCenterY - (bb.y1 + bb.y2) / 2;
  else if (baseline !== undefined) y0 = baseline;
  else y0 = 0;
  const p = tts.font.getPath(text, x0, y0, fontSize, opts);
  const box = p.getBoundingBox();
  return {
    d: p.toPathData(3),
    bbox: { x1: box.x1, y1: box.y1, x2: box.x2, y2: box.y2, width, height },
    baseline: y0,
    advance: tts.getWidth(text, { fontSize, letterSpacing }),
  };
}

/** Small helper for diagram labels (Inter Medium). */
const LABEL_FONT = path.join(FONTS_DIR, 'Inter-Medium.ttf');
function label(text, { x, y, size = 11, fill = COLOR.slate600, anchor = 'center', rotate = 0, indent = '  ' }) {
  const t = outlineText(text, { fontFile: LABEL_FONT, fontSize: size, left: x, capCenterY: y, anchor });
  const tr = rotate ? ` transform="rotate(${rotate} ${n(x)} ${n(y)})"` : '';
  return { svg: `${indent}<path${tr} fill="${fill}" d="${t.d}"/>`, bbox: t.bbox };
}

// ---------------------------------------------------------------------------
// Logo lock-ups
// ---------------------------------------------------------------------------

/** Wordmark geometry, computed once. */
function wordmarkMetrics() {
  const probe = outlineText(WORDMARK.text, {
    fontFile: WORDMARK.fontFile,
    fontSize: WORDMARK.fontSize,
    letterSpacing: WORDMARK.letterSpacing,
    left: 0,
    baseline: 0,
  });
  return probe.bbox; // width/height are what we need; x1/y1 describe the raw origin offsets
}

function buildLogos() {
  const wm = wordmarkMetrics();
  const S = MARK.size;
  const wordOpts = { fontFile: WORDMARK.fontFile, fontSize: WORDMARK.fontSize, letterSpacing: WORDMARK.letterSpacing };

  // Horizontal: mark at origin, wordmark to the right, cap-height centre on the mark centre.
  const hW = ceil2(S + WORDMARK.gap + wm.width);
  const horizontal = (square, glyph, word, label) => {
    const t = outlineText(WORDMARK.text, { ...wordOpts, left: S + WORDMARK.gap, capCenterY: S / 2 });
    return {
      svg: svgDoc({
        w: hW,
        h: S,
        label,
        body: `${markSvg({ square, glyph })}\n  <path fill="${word}" d="${t.d}"/>`,
      }),
      w: hW,
      h: S,
      geometry: t,
    };
  };

  // Stacked: mark centred above, wordmark centred below.
  const sW = ceil2(Math.max(S, wm.width));
  const sH = ceil2(S + WORDMARK.stackedGap + wm.height);
  const stacked = (square, glyph, word, label) => {
    const t = outlineText(WORDMARK.text, {
      ...wordOpts,
      left: sW / 2,
      anchor: 'center',
      capCenterY: S + WORDMARK.stackedGap + wm.height / 2,
    });
    return {
      svg: svgDoc({
        w: sW,
        h: sH,
        label,
        body: `${markSvg({ x: (sW - S) / 2, square, glyph })}\n  <path fill="${word}" d="${t.d}"/>`,
      }),
      w: sW,
      h: sH,
    };
  };

  const mark = (square, glyph, label) => ({
    svg: svgDoc({ w: S, h: S, label, body: markSvg({ square, glyph }) }),
    w: S,
    h: S,
  });

  const wW = ceil2(wm.width);
  const wH = ceil2(wm.height);
  const wordmark = (word, label) => {
    const t = outlineText(WORDMARK.text, { ...wordOpts, left: 0, capCenterY: wm.height / 2 });
    return { svg: svgDoc({ w: wW, h: wH, label, body: `  <path fill="${word}" d="${t.d}"/>` }), w: wW, h: wH };
  };

  const B = COLOR.blue, W = COLOR.white, K = COLOR.ink;
  const logos = {
    'tp-vpn-logo-horizontal': horizontal(B, W, K, 'TP VPN'),
    'tp-vpn-logo-horizontal-reversed': horizontal(W, B, W, 'TP VPN'),
    'tp-vpn-logo-stacked': stacked(B, W, K, 'TP VPN'),
    'tp-vpn-logo-mark': mark(B, W, 'TP VPN'),
    'tp-vpn-logo-mark-mono-black': mark(K, W, 'TP VPN'),
    'tp-vpn-logo-mark-mono-white': mark(W, K, 'TP VPN'),
    'tp-vpn-logo-mark-reversed': mark(W, B, 'TP VPN'),
    'tp-vpn-wordmark': wordmark(K, 'TP VPN'),
    'tp-vpn-wordmark-white': wordmark(W, 'TP VPN'),
  };

  const geometry = {
    markSize: S,
    fontSize: WORDMARK.fontSize,
    letterSpacing: WORDMARK.letterSpacing,
    gap: WORDMARK.gap,
    stackedGap: WORDMARK.stackedGap,
    capHeight: wm.height,
    wordmarkWidth: wm.width,
    leftBearing: wm.x1, // T's left side bearing at this size (trimmed away by tight bbox alignment)
    baselineY: logos['tp-vpn-logo-horizontal'].geometry.baseline, // baseline y in the horizontal lock-up
    horizontal: { w: hW, h: S },
    stacked: { w: sW, h: sH },
    wordmark: { w: wW, h: wH },
  };
  return { logos, geometry };
}

// ---------------------------------------------------------------------------
// Documentation diagrams (clear space, construction grid)
// ---------------------------------------------------------------------------

function buildClearspaceDiagram(geometry) {
  const S = MARK.size;
  const X = S / 2; // clear space unit
  const logoW = geometry.horizontal.w;
  const pad = 28; // outer padding for labels
  const captionH = 26;
  const ox = pad + X, oy = pad + X; // logo origin inside the diagram
  const W = ceil2(logoW + 2 * X + 2 * pad);
  const H = ceil2(S + 2 * X + 2 * pad + captionH);

  const t = outlineText(WORDMARK.text, {
    fontFile: WORDMARK.fontFile,
    fontSize: WORDMARK.fontSize,
    letterSpacing: WORDMARK.letterSpacing,
    left: ox + S + WORDMARK.gap,
    capCenterY: oy + S / 2,
  });

  const parts = [];
  // clear-space boundary
  parts.push(
    `  <rect x="${n(ox - X)}" y="${n(oy - X)}" width="${n(logoW + 2 * X)}" height="${n(S + 2 * X)}" rx="4" fill="none" stroke="${COLOR.slate400}" stroke-width="1" stroke-dasharray="4 3"/>`,
  );
  // X squares (one per side, aligned with the mark)
  const squares = [
    [ox - X, oy + (S - X) / 2], // left
    [ox + logoW, oy + (S - X) / 2], // right
    [ox + (S - X) / 2, oy - X], // top
    [ox + (S - X) / 2, oy + S], // bottom
  ];
  for (const [sx, sy] of squares) {
    parts.push(`  <rect x="${n(sx)}" y="${n(sy)}" width="${n(X)}" height="${n(X)}" fill="${COLOR.blue100}"/>`);
    parts.push(label('X', { x: sx + X / 2, y: sy + X / 2, size: 12, fill: COLOR.blue600 }).svg);
  }
  // the logo itself
  parts.push(markSvg({ x: ox, y: oy }));
  parts.push(`  <path fill="${COLOR.ink}" d="${t.d}"/>`);
  // caption
  parts.push(
    label('X = ½ mark height · keep this space free on every side', {
      x: W / 2,
      y: oy + S + X + pad / 2 + captionH / 2 - 2,
      size: 11,
      fill: COLOR.slate500,
    }).svg,
  );
  return { svg: svgDoc({ w: W, h: H, label: 'TP VPN logo clear space: X equals half the mark height', body: parts.join('\n') }), w: W, h: H };
}

function buildGridDiagram() {
  const s = 4; // diagram scale: 1 mark unit = 4 px
  const S = MARK.size * s; // 264
  const r = MARK.rx * s; // 63.36
  const g = { x: MARK.glyph.x * s, y: MARK.glyph.y * s, w: MARK.glyph.w * s, h: MARK.glyph.h * s };
  const ml = 56, mt = 44, mr = 96, mb = 64; // margins for dimension lines
  const W = ml + S + mr, H = mt + S + mb;
  const ox = ml, oy = mt;
  const parts = [];

  // fine 12×12 grid (5.5 units) + centre lines
  const gridLines = [];
  for (let i = 0; i <= 12; i++) {
    const p = (S / 12) * i;
    gridLines.push(`M${n(ox + p)} ${n(oy)}V${n(oy + S)}`, `M${n(ox)} ${n(oy + p)}H${n(ox + S)}`);
  }
  parts.push(`  <rect x="${ox}" y="${oy}" width="${S}" height="${S}" rx="${n(r)}" fill="${COLOR.blue50}"/>`);
  parts.push(`  <path d="${gridLines.join('')}" fill="none" stroke="${COLOR.slate200}" stroke-width="0.75"/>`);
  parts.push(
    `  <path d="M${n(ox + S / 2)} ${n(oy)}V${n(oy + S)}M${n(ox)} ${n(oy + S / 2)}H${n(ox + S)}" fill="none" stroke="${COLOR.slate300}" stroke-width="0.75" stroke-dasharray="3 3"/>`,
  );
  // square outline
  parts.push(`  <rect x="${ox}" y="${oy}" width="${S}" height="${S}" rx="${n(r)}" fill="none" stroke="${COLOR.ink}" stroke-width="1.25"/>`);
  // corner-radius construction: circle centres, radius lines and highlighted arcs
  const corners = [
    { cx: ox + r, cy: oy + r, arc: `M${n(ox)} ${n(oy + r)}A${n(r)} ${n(r)} 0 0 1 ${n(ox + r)} ${n(oy)}` },
    { cx: ox + S - r, cy: oy + r, arc: `M${n(ox + S - r)} ${n(oy)}A${n(r)} ${n(r)} 0 0 1 ${n(ox + S)} ${n(oy + r)}` },
    { cx: ox + S - r, cy: oy + S - r, arc: `M${n(ox + S)} ${n(oy + S - r)}A${n(r)} ${n(r)} 0 0 1 ${n(ox + S - r)} ${n(oy + S)}` },
    { cx: ox + r, cy: oy + S - r, arc: `M${n(ox + r)} ${n(oy + S)}A${n(r)} ${n(r)} 0 0 1 ${n(ox)} ${n(oy + S - r)}` },
  ];
  for (const c of corners) {
    parts.push(`  <path d="${c.arc}" fill="none" stroke="${COLOR.blue}" stroke-width="2.5" stroke-linecap="round"/>`);
    parts.push(`  <circle cx="${n(c.cx)}" cy="${n(c.cy)}" r="2" fill="${COLOR.blue}"/>`);
  }
  // radius line on the top-left corner + label
  parts.push(`  <path d="M${n(ox + r)} ${n(oy + r)}L${n(ox + r)} ${n(oy)}" stroke="${COLOR.blue}" stroke-width="1" stroke-dasharray="2 2"/>`);
  // glyph + its bounding box
  parts.push(`  <rect x="${n(ox + g.x)}" y="${n(oy + g.y)}" width="${n(g.w)}" height="${n(g.h)}" fill="none" stroke="${COLOR.slate500}" stroke-width="1" stroke-dasharray="4 3"/>`);
  parts.push(`  <path transform="translate(${n(ox + g.x)} ${n(oy + g.y)}) scale(${s})" fill="${COLOR.blue}" d="${MARK.glyph.d}"/>`);

  // dimension helper: line with end ticks + label with a white knock-out
  const dim = (x1, y1, x2, y2, text, { side }) => {
    const vertical = x1 === x2;
    const tick = 4;
    const ticks = vertical
      ? `M${n(x1 - tick)} ${n(y1)}H${n(x1 + tick)}M${n(x2 - tick)} ${n(y2)}H${n(x2 + tick)}`
      : `M${n(x1)} ${n(y1 - tick)}V${n(y1 + tick)}M${n(x2)} ${n(y2 - tick)}V${n(y2 + tick)}`;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const l = label(text, { x: mx, y: my, size: 10.5, fill: COLOR.slate700, rotate: vertical ? -90 : 0 });
    const bw = l.bbox.width + 8, bh = l.bbox.height + 6;
    const knock = vertical
      ? `  <rect x="${n(mx - bh / 2)}" y="${n(my - bw / 2)}" width="${n(bh)}" height="${n(bw)}" fill="${COLOR.white}"/>`
      : `  <rect x="${n(mx - bw / 2)}" y="${n(my - bh / 2)}" width="${n(bw)}" height="${n(bh)}" fill="${COLOR.white}"/>`;
    void side;
    return [
      `  <path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}${ticks}" fill="none" stroke="${COLOR.slate400}" stroke-width="1"/>`,
      knock,
      l.svg,
    ].join('\n');
  };
  // overall size
  parts.push(dim(ox, oy - 20, ox + S, oy - 20, '66', { side: 'top' }));
  parts.push(dim(ox - 20, oy, ox - 20, oy + S, '66', { side: 'left' }));
  // glyph offsets + size (bottom: x-offset and width; right: y-offset and height)
  parts.push(dim(ox, oy + S + 22, ox + g.x, oy + S + 22, '11.85', { side: 'bottom' }));
  parts.push(dim(ox + g.x, oy + S + 22, ox + g.x + g.w, oy + S + 22, '42.24', { side: 'bottom' }));
  parts.push(dim(ox + S + 22, oy, ox + S + 22, oy + g.y, '17.08', { side: 'right' }));
  parts.push(dim(ox + S + 22, oy + g.y, ox + S + 22, oy + g.y + g.h, '35.64', { side: 'right' }));
  // radius label (to the right, second column)
  parts.push(dim(ox + S + 62, oy, ox + S + 62, oy + r, 'r 15.84', { side: 'right' }));
  parts.push(label('24 %', { x: ox + S + 62, y: oy + r + 14, size: 9.5, fill: COLOR.slate500 }).svg);
  // extenders for the right column (light guide lines from the square edge)
  parts.push(
    `  <path d="M${n(ox + S)} ${n(oy)}H${n(ox + S + 66)}M${n(ox + S)} ${n(oy + r)}H${n(ox + S + 66)}M${n(ox + S)} ${n(oy + g.y)}H${n(ox + S + 26)}M${n(ox + S)} ${n(oy + g.y + g.h)}H${n(ox + S + 26)}M${n(ox + S)} ${n(oy + S)}H${n(ox + S + 26)}M${n(ox)} ${n(oy + S)}V${n(oy + S + 26)}M${n(ox + g.x)} ${n(oy + S)}V${n(oy + S + 26)}M${n(ox + g.x + g.w)} ${n(oy + S)}V${n(oy + S + 26)}M${n(ox + S)} ${n(oy + S)}V${n(oy + S + 26)}" fill="none" stroke="${COLOR.slate300}" stroke-width="0.75"/>`,
  );

  return {
    svg: svgDoc({ w: W, h: H, label: 'TP VPN mark construction grid: 66 unit square, 24 percent corner radius, glyph 42.24 by 35.64 at 11.85, 17.08', body: parts.join('\n') }),
    w: W,
    h: H,
  };
}

// ---------------------------------------------------------------------------
// App-icon & social SVG compositions
// ---------------------------------------------------------------------------

/** iOS 1024 marketing icon: plain square, no rounding (the OS masks it). */
function iosSquareSvg() {
  return svgDoc({ w: MARK.size, h: MARK.size, label: 'TP VPN app icon', body: markSvg({ rounded: false }) });
}

/**
 * Android adaptive foreground (108 dp canvas). Glyph longest side = 44 % of
 * the canvas → 47.52 dp, well inside the 66 dp safe zone (bbox half-diagonal
 * 31.1 dp < 33 dp radius).
 */
function androidForegroundSvg() {
  const C = 108;
  const scale = (C * 0.44) / MARK.glyph.w;
  const w = MARK.glyph.w * scale, h = MARK.glyph.h * scale;
  return svgDoc({
    w: C,
    h: C,
    label: 'TP VPN adaptive icon foreground',
    body: glyphOnlySvg({ x: (C - w) / 2, y: (C - h) / 2, scale }),
  });
}
function androidBackgroundSvg() {
  return svgDoc({ w: 108, h: 108, label: 'TP VPN adaptive icon background', body: `  <rect width="108" height="108" fill="${COLOR.blue}"/>` });
}

/**
 * PWA maskable icon. W3C safe zone = centred circle, diameter 80 % of the
 * canvas. Glyph longest side = 66 % of that diameter (= 52.8 % of the canvas)
 * so the whole glyph bounding box — including the T's corners — sits inside
 * the circle with margin (bbox half-diagonal 34.5 % < 40 % radius).
 */
function maskableSvg() {
  const C = 512;
  const safe = C * 0.8;
  const scale = (safe * 0.66) / MARK.glyph.w;
  const w = MARK.glyph.w * scale, h = MARK.glyph.h * scale;
  return svgDoc({
    w: C,
    h: C,
    label: 'TP VPN maskable icon',
    body: `  <rect width="${C}" height="${C}" fill="${COLOR.blue}"/>\n${glyphOnlySvg({ x: (C - w) / 2, y: (C - h) / 2, scale })}`,
  });
}

/** OG / GitHub card: white, horizontal logo left, gradient panel on the right 44 %. */
function socialCardSvg(W, H, geometry) {
  const margin = Math.round((88 / 1200) * W);
  const inset = Math.round((44 / 1200) * W);
  const panelW = Math.round(W * 0.44);
  const panelX = W - inset - panelW;
  const logoH = Math.round(H * 0.22);
  const scale = logoH / MARK.size;
  const logoW = geometry.horizontal.w * scale;
  if (margin + logoW > panelX - margin) throw new Error('social card: logo overlaps the gradient panel');
  const lx = margin, ly = (H - logoH) / 2;
  const t = outlineText(WORDMARK.text, {
    fontFile: WORDMARK.fontFile,
    fontSize: WORDMARK.fontSize * scale,
    letterSpacing: WORDMARK.letterSpacing,
    left: lx + (MARK.size + WORDMARK.gap) * scale,
    capCenterY: ly + logoH / 2,
  });
  return svgDoc({
    w: W,
    h: H,
    label: 'TP VPN',
    defs: `    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">\n      <stop offset="0" stop-color="${COLOR.blue}"/>\n      <stop offset="1" stop-color="${COLOR.blue400}"/>\n    </linearGradient>`,
    body: [
      `  <rect width="${W}" height="${H}" fill="${COLOR.white}"/>`,
      `  <rect x="${panelX}" y="${inset}" width="${panelW}" height="${H - 2 * inset}" rx="32" fill="url(#g)"/>`,
      markSvg({ x: lx, y: ly, scale }),
      `  <path fill="${COLOR.ink}" d="${t.d}"/>`,
    ].join('\n'),
  });
}

/** X/Twitter header: hero gradient with the reversed horizontal logo centred. */
function twitterHeaderSvg(geometry) {
  const W = 1500, H = 500;
  const logoH = 160;
  const scale = logoH / MARK.size;
  const logoW = geometry.horizontal.w * scale;
  const lx = (W - logoW) / 2, ly = (H - logoH) / 2;
  const t = outlineText(WORDMARK.text, {
    fontFile: WORDMARK.fontFile,
    fontSize: WORDMARK.fontSize * scale,
    letterSpacing: WORDMARK.letterSpacing,
    left: lx + (MARK.size + WORDMARK.gap) * scale,
    capCenterY: ly + logoH / 2,
  });
  return svgDoc({
    w: W,
    h: H,
    label: 'TP VPN',
    defs: `    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">\n      <stop offset="0" stop-color="${COLOR.blue}"/>\n      <stop offset="1" stop-color="${COLOR.cyan}"/>\n    </linearGradient>`,
    body: [
      `  <rect width="${W}" height="${H}" fill="url(#g)"/>`,
      markSvg({ x: lx, y: ly, scale, square: COLOR.white, glyph: COLOR.blue }),
      `  <path fill="${COLOR.white}" d="${t.d}"/>`,
    ].join('\n'),
  });
}

/** Avatar: white 1024 square, rounded mark at 62 % centred. */
function avatarSvg() {
  const C = 1024;
  const size = C * 0.62;
  const scale = size / MARK.size;
  return svgDoc({
    w: C,
    h: C,
    label: 'TP VPN',
    body: `  <rect width="${C}" height="${C}" fill="${COLOR.white}"/>\n${markSvg({ x: (C - size) / 2, y: (C - size) / 2, scale })}`,
  });
}

// ---------------------------------------------------------------------------
// Rasterisation
// ---------------------------------------------------------------------------

function svgSize(svg) {
  const m = svg.match(/<svg[^>]*\swidth="([\d.]+)"[^>]*\sheight="([\d.]+)"/);
  if (!m) throw new Error('SVG is missing width/height');
  return { w: Number(m[1]), h: Number(m[2]) };
}

/**
 * Render an SVG string to PNG. The SVG is rendered at 2× the target size
 * (via `density`, which librsvg uses to scale the intrinsic size) and then
 * downsampled with Lanczos so edges stay crisp even at 16 px.
 */
async function rasterize(svg, { width, height, flatten = null }) {
  const { w, h } = svgSize(svg);
  height ??= Math.round((width / w) * h);
  const density = Math.min(100000, 72 * 2 * Math.max(width / w, height / h));
  let img = sharp(Buffer.from(svg), { density }).resize(width, height, {
    fit: 'contain',
    kernel: 'lanczos3',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (flatten) img = img.flatten({ background: flatten }).removeAlpha();
  else img = img.ensureAlpha();
  return img.png({ compressionLevel: 9, adaptiveFiltering: false, palette: false }).toBuffer();
}

/** Hand-written ICO container with PNG-encoded images (valid since Vista). */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(entries.length, 4);
  const dirs = [];
  let offset = 6 + 16 * entries.length;
  for (const e of entries) {
    const d = Buffer.alloc(16);
    d.writeUInt8(e.size >= 256 ? 0 : e.size, 0);
    d.writeUInt8(e.size >= 256 ? 0 : e.size, 1);
    d.writeUInt8(0, 2); // colour palette
    d.writeUInt8(0, 3); // reserved
    d.writeUInt16LE(1, 4); // colour planes
    d.writeUInt16LE(32, 6); // bits per pixel
    d.writeUInt32LE(e.png.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += e.png.length;
    dirs.push(d);
  }
  return Buffer.concat([header, ...dirs, ...entries.map((e) => e.png)]);
}

// ---------------------------------------------------------------------------
// Packs
// ---------------------------------------------------------------------------

function packReadme(name, description, files) {
  const lines = [
    `TP VPN brand assets — ${name}`,
    `Version ${VERSION}`,
    '',
    description,
    '',
    'License',
    `  ${LICENSE_NOTE}`,
    '  See LICENSE-BRAND.md for the brand terms; fonts: LICENSE-Inter.txt (SIL OFL 1.1);',
    '  flags: circle-flags by HatScripts (MIT).',
    '',
    'Regenerate',
    '  packages/brand/scripts/build-assets.mjs in the tp-design-system repository.',
    '',
    `Contents (${files.length} files)`,
    ...files.map((f) => `  ${f.name}  (${fmtBytes(f.bytes)})`),
    '',
  ];
  return lines.join('\n');
}

/**
 * Entries are appended as Buffers (not `zip.file(path)`): archiver stats paths
 * through a concurrency-4 queue, which would make the entry order — and thus
 * the zip bytes — non-deterministic. Buffer appends go through the ordered
 * queue. `files` must already be sorted; README.txt is always first.
 */
function writeZip(outPath, files, readme) {
  return new Promise((resolve, reject) => {
    ensureDir(path.dirname(outPath));
    const out = fs.createWriteStream(outPath);
    const zip = archiver('zip', { zlib: { level: 9 } });
    out.on('close', () => resolve(fs.statSync(outPath).size));
    out.on('error', reject);
    zip.on('error', reject);
    zip.on('warning', reject);
    zip.pipe(out);
    zip.append(Buffer.from(readme, 'utf8'), { name: 'README.txt', date: ZIP_DATE, mode: 0o644 });
    for (const f of files) zip.append(fs.readFileSync(f.abs), { name: f.name, date: ZIP_DATE, mode: 0o644 });
    zip.finalize();
  });
}

/** Locale-independent ordering (plain code-point compare) for reproducible output. */
const byName = (key) => (a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const t0 = Date.now();
  const written = []; // { abs, rel }
  const out = (rel, data) => {
    const abs = path.join(DIST, rel);
    writeFile(abs, data);
    written.push({ abs, rel });
  };

  // Fresh dist
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);
  ensureDir(SRC_LOGO);

  // ---- B. SVG sources --------------------------------------------------
  const { logos, geometry } = buildLogos();
  const clearspace = buildClearspaceDiagram(geometry);
  const grid = buildGridDiagram();
  const allSvgs = {
    ...Object.fromEntries(Object.entries(logos).map(([k, v]) => [k, v.svg])),
    'tp-vpn-logo-clearspace': clearspace.svg,
    'tp-vpn-logo-grid': grid.svg,
  };
  for (const [name, svg] of Object.entries(allSvgs)) {
    if (/<text[\s>]/.test(svg)) throw new Error(`${name}: <text> elements are not allowed`);
    if (!svg.includes(MARK.glyph.d) && !name.startsWith('tp-vpn-wordmark')) throw new Error(`${name}: glyph path not verbatim`);
    writeFile(path.join(SRC_LOGO, `${name}.svg`), svg);
    out(`logo/svg/${name}.svg`, svg);
  }
  writeFile(path.join(SRC_LOGO, 'README.md'), logoReadme(geometry));

  // ---- C. Logo PNGs ----------------------------------------------------
  const pngWidth = (name) => (name.includes('-mark') ? 512 : 1024);
  for (const [name, { svg }] of Object.entries(logos)) {
    const w = pngWidth(name);
    out(`logo/png/${name}@1x.png`, await rasterize(svg, { width: w }));
    out(`logo/png/${name}@2x.png`, await rasterize(svg, { width: w * 2 }));
  }

  // ---- C. App icons ----------------------------------------------------
  const markSvgStr = logos['tp-vpn-logo-mark'].svg;
  const square = iosSquareSvg();
  // iOS
  out('app-icon/ios/AppIcon-1024.png', await rasterize(square, { width: 1024, flatten: COLOR.blue }));
  for (const s of [180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20]) {
    out(`app-icon/ios/AppIcon-${s}.png`, await rasterize(markSvgStr, { width: s }));
  }
  out('app-icon/ios/Contents.json', JSON.stringify(iosContents(), null, 2) + '\n');
  // Android
  const fg = androidForegroundSvg();
  out('app-icon/android/ic_launcher_foreground.svg', fg);
  out('app-icon/android/ic_launcher_foreground.png', await rasterize(fg, { width: 432 }));
  out('app-icon/android/ic_launcher_background.png', await rasterize(androidBackgroundSvg(), { width: 432, flatten: COLOR.blue }));
  for (const s of [512, 192, 144, 96, 72, 48]) {
    out(`app-icon/android/ic_launcher-${s}.png`, await rasterize(markSvgStr, { width: s }));
  }
  // Web / PWA
  const fav = {};
  for (const s of [16, 32, 48]) fav[s] = await rasterize(markSvgStr, { width: s });
  out('app-icon/web/favicon.ico', buildIco([16, 32, 48].map((size) => ({ size, png: fav[size] }))));
  out('app-icon/web/favicon-16.png', fav[16]);
  out('app-icon/web/favicon-32.png', fav[32]);
  out('app-icon/web/apple-touch-icon.png', await rasterize(markSvgStr, { width: 180 }));
  out('app-icon/web/icon-192.png', await rasterize(markSvgStr, { width: 192 }));
  out('app-icon/web/icon-512.png', await rasterize(markSvgStr, { width: 512 }));
  out('app-icon/web/icon-maskable-512.png', await rasterize(maskableSvg(), { width: 512, flatten: COLOR.blue }));
  out('app-icon/web/icon.svg', markSvgStr);
  out('app-icon/web/README.md', webReadme());
  // Universal
  for (const s of [1024, 512, 256, 128, 64, 32]) {
    out(`app-icon/universal/tp-vpn-icon-${s}.png`, await rasterize(markSvgStr, { width: s }));
  }

  // ---- C. Social -------------------------------------------------------
  out('social/og-default.png', await rasterize(socialCardSvg(1200, 630, geometry), { width: 1200, height: 630, flatten: COLOR.white }));
  out('social/github-social-preview-1280x640.png', await rasterize(socialCardSvg(1280, 640, geometry), { width: 1280, height: 640, flatten: COLOR.white }));
  out('social/avatar-1024.png', await rasterize(avatarSvg(), { width: 1024, height: 1024, flatten: COLOR.white }));
  out('social/twitter-header-1500x500.png', await rasterize(twitterHeaderSvg(geometry), { width: 1500, height: 500, flatten: COLOR.blue }));

  // ---- C. Flags --------------------------------------------------------
  const flagFiles = fs.readdirSync(FLAGS_DIR).filter((f) => f.endsWith('.svg')).sort();
  const codes = flagFiles.map((f) => f.replace(/\.svg$/, ''));
  const missing = codes.filter((c) => !FLAG_NAMES[c]);
  const extra = Object.keys(FLAG_NAMES).filter((c) => !codes.includes(c));
  if (missing.length || extra.length) throw new Error(`flag name map out of sync — missing: ${missing.join(',')} extra: ${extra.join(',')}`);
  for (const f of flagFiles) out(`flags/${f}`, fs.readFileSync(path.join(FLAGS_DIR, f)));
  const index = Object.fromEntries(codes.map((c) => [c, FLAG_NAMES[c]]));
  out('flags/index.json', JSON.stringify(index, null, 2) + '\n');
  out('flags/LICENSE.txt', fs.readFileSync(path.join(FLAGS_DIR, 'LICENSE.txt')));

  // ---- C. Fonts --------------------------------------------------------
  for (const f of fs.readdirSync(FONTS_DIR).filter((f) => f.endsWith('.ttf') || f === 'LICENSE-Inter.txt').sort()) {
    out(`fonts/${f}`, fs.readFileSync(path.join(FONTS_DIR, f)));
  }

  // ---- D. Packs --------------------------------------------------------
  const brandLicensePath = path.join(REPO_ROOT, 'LICENSE-BRAND.md');
  const brandLicense = fs.existsSync(brandLicensePath) ? [{ abs: brandLicensePath, name: 'LICENSE-BRAND.md' }] : [];
  if (!brandLicense.length) console.warn('warning: LICENSE-BRAND.md not found at repo root; packs will omit it');
  const entries = (prefix, filter = () => true) =>
    written
      .filter((f) => f.rel.startsWith(prefix) && filter(f.rel))
      .map((f) => ({ abs: f.abs, name: f.rel }))
      .sort(byName('name'));
  const withSizes = (files) => files.map((f) => ({ ...f, bytes: fs.statSync(f.abs).size }));
  const packs = [
    {
      file: 'tp-vpn-brand-assets-all.zip',
      title: 'Complete brand kit',
      description: 'Everything: logo SVG/PNG, app icons (iOS/Android/Web/universal), social images, circle flags, Inter fonts.',
      files: [...entries('logo/'), ...entries('app-icon/'), ...entries('social/'), ...entries('flags/'), ...entries('fonts/')],
    },
    {
      file: 'tp-vpn-logo-pack.zip',
      title: 'Logo pack',
      description: 'All logo variants as SVG (outlined wordmark) and PNG @1x/@2x, plus the clear-space and construction-grid diagrams.',
      files: entries('logo/'),
    },
    {
      file: 'tp-vpn-app-icons.zip',
      title: 'App icons',
      description: 'iOS AppIcon.appiconset (with Contents.json), Android adaptive + legacy launcher icons, Web/PWA favicons and manifest icons, universal PNGs.',
      files: entries('app-icon/'),
    },
    {
      file: 'tp-vpn-social-kit.zip',
      title: 'Social kit',
      description: 'Open Graph default image, GitHub social preview, square avatar and X/Twitter header.',
      files: entries('social/'),
    },
    {
      file: 'tp-vpn-flags.zip',
      title: 'Circle flags',
      description: '62 circular country/region flags (SVG) with index.json (ISO alpha-2 → English / 简体中文 names).',
      files: entries('flags/'),
    },
    {
      file: 'tp-vpn-fonts-inter.zip',
      title: 'Inter fonts',
      description: 'Inter Regular / Medium / SemiBold / Bold / ExtraBold (TTF) under the SIL Open Font License 1.1.',
      files: entries('fonts/'),
    },
  ];
  const packSizes = [];
  for (const p of packs) {
    const files = withSizes([...brandLicense, ...p.files]);
    const size = await writeZip(path.join(DIST, 'packs', p.file), files, packReadme(p.title, p.description, files));
    written.push({ abs: path.join(DIST, 'packs', p.file), rel: `packs/${p.file}` });
    packSizes.push({ file: p.file, bytes: size, count: files.length + 1 });
  }

  // ---- E. Manifest -----------------------------------------------------
  const manifestFiles = [];
  for (const f of walk(DIST).filter((f) => f.rel !== 'manifest.json')) {
    const bytes = fs.statSync(f.abs).size;
    const ext = path.extname(f.rel).slice(1).toLowerCase();
    let width = null, height = null;
    if (ext === 'png' || ext === 'svg') {
      const meta = await sharp(f.abs).metadata();
      width = meta.width;
      height = meta.height;
    } else if (ext === 'ico') {
      width = 48;
      height = 48;
    }
    manifestFiles.push({ path: f.rel, bytes, width, height, kind: kindOf(f.rel), format: ext });
  }
  manifestFiles.sort(byName('path'));
  const manifest = { generatedFrom: 'build-assets.mjs', version: VERSION, files: manifestFiles };
  out('manifest.json', JSON.stringify(manifest, null, 2) + '\n');

  // ---- Print manifest summary -----------------------------------------
  const groups = new Map();
  for (const f of manifestFiles) {
    const g = f.path.split('/')[0];
    const cur = groups.get(g) ?? { count: 0, bytes: 0 };
    cur.count += 1;
    cur.bytes += f.bytes;
    groups.set(g, cur);
  }
  console.log(`\nTP VPN brand assets v${VERSION} — ${manifestFiles.length} files → ${path.relative(process.cwd(), DIST) || '.'}`);
  console.log('\n  wordmark geometry');
  console.log(`    font size ${n(geometry.fontSize)} px · letter-spacing ${geometry.letterSpacing} em · cap height ${n(geometry.capHeight)} · width ${n(geometry.wordmarkWidth)}`);
  console.log(`    horizontal ${n(geometry.horizontal.w)}×${n(geometry.horizontal.h)} (gap ${n(geometry.gap)}, baseline y ${n(geometry.baselineY)}) · stacked ${n(geometry.stacked.w)}×${n(geometry.stacked.h)} (gap ${n(geometry.stackedGap)})`);
  console.log('\n  group           files      size');
  for (const [g, v] of [...groups.entries()].sort()) {
    console.log(`    ${g.padEnd(14)}${String(v.count).padStart(5)}  ${fmtBytes(v.bytes).padStart(10)}`);
  }
  console.log('\n  packs');
  for (const p of packSizes) console.log(`    ${p.file.padEnd(34)}${String(p.count).padStart(4)} entries  ${fmtBytes(p.bytes).padStart(10)}`);
  console.log(`\n  done in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
}

function kindOf(rel) {
  const top = rel.split('/')[0];
  const base = path.basename(rel);
  if (/^(README|LICENSE|Contents)/i.test(base)) return 'doc';
  return { logo: 'logo', 'app-icon': 'app-icon', social: 'social', flags: 'flag', fonts: 'font', packs: 'pack' }[top] ?? 'other';
}

function iosContents() {
  const img = (filename, idiom, scale, size) => ({ filename, idiom, scale, size });
  return {
    images: [
      img('AppIcon-40.png', 'iphone', '2x', '20x20'),
      img('AppIcon-60.png', 'iphone', '3x', '20x20'),
      img('AppIcon-58.png', 'iphone', '2x', '29x29'),
      img('AppIcon-87.png', 'iphone', '3x', '29x29'),
      img('AppIcon-80.png', 'iphone', '2x', '40x40'),
      img('AppIcon-120.png', 'iphone', '3x', '40x40'),
      img('AppIcon-120.png', 'iphone', '2x', '60x60'),
      img('AppIcon-180.png', 'iphone', '3x', '60x60'),
      img('AppIcon-20.png', 'ipad', '1x', '20x20'),
      img('AppIcon-40.png', 'ipad', '2x', '20x20'),
      img('AppIcon-29.png', 'ipad', '1x', '29x29'),
      img('AppIcon-58.png', 'ipad', '2x', '29x29'),
      img('AppIcon-40.png', 'ipad', '1x', '40x40'),
      img('AppIcon-80.png', 'ipad', '2x', '40x40'),
      img('AppIcon-76.png', 'ipad', '1x', '76x76'),
      img('AppIcon-152.png', 'ipad', '2x', '76x76'),
      img('AppIcon-167.png', 'ipad', '2x', '83.5x83.5'),
      img('AppIcon-1024.png', 'ios-marketing', '1x', '1024x1024'),
    ],
    info: { author: 'xcode', version: 1 },
  };
}

function webReadme() {
  return `# TP VPN — Web / PWA icons

Generated by \`packages/brand/scripts/build-assets.mjs\`. All rasters come from the
official mark (\`icon.svg\`); do not edit the PNGs by hand.

| File | Size | Use |
|---|---|---|
| \`favicon.ico\` | 16 / 32 / 48 (PNG-in-ICO) | Legacy favicon (\`<link rel="icon" href="/favicon.ico" sizes="any">\`) |
| \`favicon-16.png\`, \`favicon-32.png\` | 16, 32 | Modern favicon PNGs |
| \`icon.svg\` | vector | Preferred favicon for modern browsers |
| \`apple-touch-icon.png\` | 180 | iOS home-screen icon (rounded mark on transparent) |
| \`icon-192.png\`, \`icon-512.png\` | 192, 512 | PWA manifest icons (\`purpose: any\`) |
| \`icon-maskable-512.png\` | 512 | PWA maskable icon — solid #1677FF full-bleed, glyph inside the 80 % safe zone |

## \`<head>\`

\`\`\`html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1677FF">
\`\`\`

## \`site.webmanifest\`

\`\`\`json
{
  "name": "TP VPN",
  "short_name": "TP VPN",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#1677FF",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "/icon.svg", "sizes": "any", "type": "image/svg+xml" }
  ]
}
\`\`\`
`;
}

function logoReadme(g) {
  return `# TP VPN logo sources

Every file in this folder is **generated** by \`packages/brand/scripts/build-assets.mjs\`.
Edit the script (or the inputs it reads), never the SVGs.

## Inputs

1. **Mark geometry** — the official Figma export \`tp-web/public/brand/logo-mark.svg\`:
   a 66 × 66 square with \`rx = 15.84\` (24 % of the side), fill \`#1677FF\`, and the
   white "TP" glyph (bounding box 42.24 × 35.64, offset 11.85, 17.08). The glyph
   \`<path d>\` is copied **verbatim** into the script and asserted at build time —
   it is never redrawn or re-encoded.
2. **Wordmark** — "TP VPN" set in Inter Bold (\`fonts/Inter-Bold.ttf\`, Inter 4.001,
   SIL OFL) and outlined to \`<path>\` with \`text-to-svg\` / opentype.js, so no
   file contains a \`<text>\` element and nothing depends on installed fonts.

## Construction (all values in mark units, mark height = 66)

| Rule | Value |
|---|---|
| Font size = mark height × 0.56 | ${n(g.fontSize)} px |
| Letter-spacing | ${g.letterSpacing} em (text-to-svg's \`letterSpacing\` is in em, multiplied by the font size) |
| Cap height at that size (= glyph bounding-box height; OS/2 capHeight 1490 / 2048) | ${n(g.capHeight)} |
| Wordmark tight width (bounding box of the outlined glyphs) | ${n(g.wordmarkWidth)} |
| Horizontal gap = mark height × 0.18 | ${n(g.gap)} |
| Stacked gap = mark height × 0.25 | ${n(g.stackedGap)} |
| Horizontal lock-up | ${n(g.horizontal.w)} × ${n(g.horizontal.h)} |
| Stacked lock-up | ${n(g.stacked.w)} × ${n(g.stacked.h)} |
| Wordmark alone | ${n(g.wordmark.w)} × ${n(g.wordmark.h)} |

**Optical alignment.** The wordmark is positioned from the *outlined glyph bounding
box*, not from font metrics: the visual left edge of the "T" (its left side bearing,
${n(g.leftBearing)} px, is trimmed) sits exactly \`gap\` to the right of the square, and the
centre of the cap height is aligned to the centre of the square (baseline at
y = ${n(g.baselineY)} in the horizontal lock-up). In the stacked lock-up the wordmark
is centred on the mark's vertical axis by the same bounding box. Kerning: Inter 4
stores kerning as class-based GPOS pairs that opentype.js 0.11 does not resolve,
so the wordmark uses letter-spacing only — this is deterministic and is the
reference rendering for every platform.

## Files

| File | What |
|---|---|
| \`tp-vpn-logo-horizontal.svg\` | Primary lock-up: blue mark + slate-900 wordmark. White / light backgrounds. |
| \`tp-vpn-logo-horizontal-reversed.svg\` | White square with blue glyph + white wordmark. For \`#1677FF\` or dark backgrounds. |
| \`tp-vpn-logo-stacked.svg\` | Mark above a centred wordmark. |
| \`tp-vpn-logo-mark.svg\` | Mark only (blue square, white glyph). Also the app-icon source. |
| \`tp-vpn-logo-mark-mono-black.svg\` | Single colour: slate-900 square, white glyph. |
| \`tp-vpn-logo-mark-mono-white.svg\` | Single colour: white square, slate-900 glyph. |
| \`tp-vpn-logo-mark-reversed.svg\` | White square, blue glyph (for blue backgrounds). |
| \`tp-vpn-wordmark.svg\` / \`tp-vpn-wordmark-white.svg\` | Wordmark only, tight bounding box. |
| \`tp-vpn-logo-clearspace.svg\` | Documentation diagram: clear space X = ½ mark height on every side. |
| \`tp-vpn-logo-grid.svg\` | Documentation diagram: construction grid (24 % corner radius, glyph box, dimensions). |

All SVGs have a tight \`viewBox\`, explicit \`width\`/\`height\`, \`role="img"\` and an
\`aria-label\`. Rules of use: minimum mark size 24 px on screen / 8 mm in print,
horizontal lock-up ≥ 96 px wide, clear space ≥ ½ mark height; never recolour,
stretch, rotate, outline or add effects. See \`LICENSE-BRAND.md\`.
`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
