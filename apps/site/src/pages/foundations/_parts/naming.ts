/**
 * Cross-platform naming + snippet generators for the foundations pages.
 * Mirrors what packages/tokens/build.mjs emits (see dist/dart, dist/swift, dist/kotlin):
 *   color.bg.canvas       → colorBgCanvas
 *   typography.display-2xl → typographyDisplay2xl
 *   space.0-5             → space05
 */
import { tokenCssVar, tokenTailwindVar, type TypographyValue } from '@/lib/tokens';

/** Token path → camelCase constant name used by Dart / Swift / Kotlin outputs. */
export function camelName(path: string): string {
  return path
    .split(/[.-]/)
    .filter(Boolean)
    .map((seg, i) => (i === 0 ? seg : seg.charAt(0).toUpperCase() + seg.slice(1)))
    .join('');
}

/** `color.bg.canvas` → `var(--tp-color-bg-canvas)` */
export function cssVarRef(path: string): string {
  return `var(${tokenCssVar(path)})`;
}

/** Tailwind theme variable (`--color-bg-canvas`) or '' when the namespace is not exposed. */
export function tailwindThemeVar(path: string): string {
  return tokenTailwindVar(path) ?? '';
}

/** `color.action.primary.bg` → `action-primary-bg` (what follows `--color-`). */
export function colorSlug(path: string): string {
  return path.replace(/^color\./, '').replace(/\./g, '-');
}

export type ColorUtilityKind = 'bg' | 'text' | 'border';

/** Which Tailwind utility family a colour token is normally used with. */
export function colorUtilityKind(path: string): ColorUtilityKind {
  if (/(^|[.-])fg($|[-.])/.test(path) || /\.(link|placeholder)/.test(path)) return 'text';
  if (/\.border/.test(path) || path.startsWith('color.border.')) return 'border';
  return 'bg';
}

export function colorUtility(path: string, kind: ColorUtilityKind = colorUtilityKind(path)): string {
  return `${kind}-${colorSlug(path)}`;
}

/* ------------------------------------------------------------------ */
/* Colour values per platform                                          */
/* ------------------------------------------------------------------ */

const HEX6 = /^#([0-9a-f]{6})$/i;
const RGBA = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/i;

const swiftFloat = (n: number): string => {
  const v = Math.round(n * 10000) / 10000;
  return Number.isInteger(v) ? v.toFixed(1) : String(v);
};

/** `#046BEF` → `Color(0xFF046BEF)`; `rgba(15, 23, 42, 0.5)` → `Color.fromRGBO(15, 23, 42, 0.5)` */
export function dartColor(value: string): string {
  const hex = HEX6.exec(value.trim());
  if (hex) return `Color(0xFF${hex[1]!.toUpperCase()})`;
  const m = RGBA.exec(value);
  if (m) return `Color.fromRGBO(${m[1]}, ${m[2]}, ${m[3]}, ${m[4] ?? '1'})`;
  return value;
}

/** `#046BEF` → `Color(0xFF046BEF)` (Compose). */
export function kotlinColor(value: string): string {
  const hex = HEX6.exec(value.trim());
  if (hex) return `Color(0xFF${hex[1]!.toUpperCase()})`;
  const m = RGBA.exec(value);
  if (m) return `Color(${m[1]}, ${m[2]}, ${m[3]}, ${Math.round((m[4] ? parseFloat(m[4]) : 1) * 255)})`;
  return value;
}

/** `#046BEF` → `UIColor(red: 0.0157, green: 0.4196, blue: 0.9373, alpha: 1.0)` (same rounding as TPTokens.swift). */
export function swiftColor(value: string): string {
  const hex = HEX6.exec(value.trim());
  if (hex) {
    const n = parseInt(hex[1]!, 16);
    return `UIColor(red: ${swiftFloat(((n >> 16) & 255) / 255)}, green: ${swiftFloat(((n >> 8) & 255) / 255)}, blue: ${swiftFloat((n & 255) / 255)}, alpha: 1.0)`;
  }
  const m = RGBA.exec(value);
  if (m) {
    return `UIColor(red: ${swiftFloat(+m[1]! / 255)}, green: ${swiftFloat(+m[2]! / 255)}, blue: ${swiftFloat(+m[3]! / 255)}, alpha: ${swiftFloat(m[4] ? parseFloat(m[4]) : 1)})`;
  }
  return value;
}

/* ------------------------------------------------------------------ */
/* Typography per platform                                             */
/* ------------------------------------------------------------------ */

export const px = (v: string | number | undefined): number => (v == null ? 0 : parseFloat(String(v)) || 0);

const trim = (n: number, digits: number): string => String(Number(n.toFixed(digits)));

const SWIFT_WEIGHT: Record<number, string> = {
  100: '.ultraLight',
  200: '.thin',
  300: '.light',
  400: '.regular',
  500: '.medium',
  600: '.semibold',
  700: '.bold',
  800: '.heavy',
  900: '.black',
};

export interface RoleNumbers {
  fontSize: number;
  lineHeight: number;
  weight: number;
  /** em, e.g. -0.01 */
  letterSpacingEm: number;
  tabular: boolean;
  uppercase: boolean;
}

export function roleNumbers(t: TypographyValue): RoleNumbers {
  return {
    fontSize: px(t.fontSize),
    lineHeight: px(t.lineHeight),
    weight: Number(t.fontWeight) || 400,
    letterSpacingEm: px(t.letterSpacing),
    tabular: t.fontVariantNumeric === 'tabular-nums',
    uppercase: t.textTransform === 'uppercase',
  };
}

/** Dart `TextStyle` constant exactly as emitted in dist/dart/tp_tokens.dart. */
export function dartTextStyle(role: string, t: TypographyValue): string {
  const n = roleNumbers(t);
  const feats = n.tabular ? ', fontFeatures: [FontFeature.tabularFigures()]' : '';
  return `static const TextStyle ${camelName(`typography.${role}`)} = TextStyle(fontSize: ${n.fontSize}, height: ${trim(n.lineHeight / n.fontSize, 4)}, fontWeight: FontWeight.w${n.weight}, letterSpacing: ${trim(n.letterSpacingEm * n.fontSize, 2)}${feats});`;
}

/** Swift `TPTextStyle` constant exactly as emitted in dist/swift/TPTokens.swift. */
export function swiftTextStyle(role: string, t: TypographyValue): string {
  const n = roleNumbers(t);
  return `public static let ${camelName(`typography.${role}`)} = TPTextStyle(size: ${n.fontSize}, lineHeight: ${n.lineHeight}, weight: ${SWIFT_WEIGHT[n.weight] ?? '.regular'}, tracking: ${trim(n.letterSpacingEm * n.fontSize, 2)})`;
}

/** CSS rule built from the four `--tp-typography-<role>-*` variables. */
export function cssTypographyRule(role: string, t: TypographyValue, selector = `.${role}`): string {
  const n = roleNumbers(t);
  const base = `typography.${role}`;
  const lines = [
    `${selector} {`,
    `  font-family: ${role === 'mono' ? 'var(--tp-font-family-mono)' : 'var(--tp-font-family-sans)'};`,
    `  font-size: ${cssVarRef(`${base}-font-size`)}; /* ${n.fontSize}px */`,
    `  line-height: ${cssVarRef(`${base}-line-height`)}; /* ${n.lineHeight}px */`,
    `  font-weight: ${cssVarRef(`${base}-font-weight`)}; /* ${n.weight} */`,
    `  letter-spacing: ${cssVarRef(`${base}-letter-spacing`)}; /* ${t.letterSpacing ?? '0em'} */`,
  ];
  if (n.tabular) lines.push('  font-variant-numeric: tabular-nums;');
  if (n.uppercase) lines.push('  text-transform: uppercase;');
  lines.push('}');
  return lines.join('\n');
}

/** Tailwind class list for a role (`text-<role>` + modifiers the utility does not carry). */
export function tailwindTypographyClass(role: string, t: TypographyValue): string {
  const n = roleNumbers(t);
  const extra: string[] = [];
  if (n.tabular) extra.push('tabular-nums');
  if (n.uppercase) extra.push('uppercase');
  if (role === 'mono') extra.push('font-mono');
  return [`text-${role}`, ...extra].join(' ');
}
