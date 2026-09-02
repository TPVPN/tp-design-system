/**
 * WCAG 2.x contrast helpers + OKLCH conversion for display.
 * All inputs are sRGB hex strings (#RGB, #RRGGBB or #RRGGBBAA — alpha ignored).
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split('').map((c) => c + c).join('');
  if (h.length === 8) h = h.slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`Invalid hex colour: ${hex}`);
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const to = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

export function isHex(value: string): boolean {
  return /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim());
}

function channelToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

/** WCAG contrast ratio between two colours, rounded to 2 decimals (1 … 21). */
export function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

export type ContrastGrade = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/**
 * WCAG grade for normal text: AAA ≥ 7, AA ≥ 4.5, "AA Large" ≥ 3 (only valid for ≥24px or ≥18.66px bold).
 * Pass `{ large: true }` to grade large text (AAA ≥ 4.5, AA ≥ 3).
 */
export function contrastGrade(ratio: number, opts: { large?: boolean } = {}): ContrastGrade {
  if (opts.large) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'Fail';
  }
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

export function passesAA(ratio: number, large = false): boolean {
  return ratio >= (large ? 3 : 4.5);
}
export function passesAAA(ratio: number, large = false): boolean {
  return ratio >= (large ? 4.5 : 7);
}

export const INK = '#0F172A';
export const PAPER = '#FFFFFF';

/** Whichever of ink / white reads better on `bg`. */
export function bestTextOn(bg: string): string {
  return contrastRatio(INK, bg) >= contrastRatio(PAPER, bg) ? INK : PAPER;
}

export interface OKLCH {
  /** Lightness 0–1 */
  l: number;
  /** Chroma (≈ 0–0.4) */
  c: number;
  /** Hue in degrees 0–360 (0 when achromatic) */
  h: number;
}

/** sRGB hex → OKLCH (Björn Ottosson's OKLab). */
export function hexToOklch(hex: string): OKLCH {
  const { r, g, b } = hexToRgb(hex);
  const lr = channelToLinear(r);
  const lg = channelToLinear(g);
  const lb = channelToLinear(b);

  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const c = Math.sqrt(a * a + bb * bb);
  let h = c < 1e-4 ? 0 : (Math.atan2(bb, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

/** `oklch(62.4% 0.214 258.3)` — display string for a hex colour. */
export function formatOklch(hex: string, digits = { l: 1, c: 3, h: 1 }): string {
  const { l, c, h } = hexToOklch(hex);
  return `oklch(${(l * 100).toFixed(digits.l)}% ${c.toFixed(digits.c)} ${h.toFixed(digits.h)})`;
}
