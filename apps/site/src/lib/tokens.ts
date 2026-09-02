/**
 * Typed access to the compiled design tokens (`@tpvpn/tokens/flat`).
 *
 *   token('color.bg.canvas')        → '#FAFBFF'
 *   token('easing.standard')        → 'cubic-bezier(0.2, 0, 0, 1)'
 *   tokensByPrefix('color.blue')    → [{ path: 'color.blue.50', key: '50', value: '#F2F7FF', … }, …]
 *   tokenCssVar('color.bg.canvas')  → '--tp-color-bg-canvas'
 */
import flatJson from '@tpvpn/tokens/flat';

export type TokenType =
  | 'color'
  | 'dimension'
  | 'duration'
  | 'cubicBezier'
  | 'shadow'
  | 'typography'
  | 'fontFamily'
  | 'fontWeight'
  | 'number'
  | 'string'
  | (string & {});

export interface ShadowLayer {
  color: string;
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
  inset?: boolean;
}

export interface TypographyValue {
  fontFamily: string | string[];
  fontSize: string;
  lineHeight: string;
  fontWeight: number | string;
  letterSpacing?: string;
  textTransform?: string;
  fontVariantNumeric?: string;
}

export interface FlatToken {
  value: unknown;
  type: TokenType;
  description?: string;
  /** Unresolved source value, e.g. `{color.slate.25}` */
  original?: unknown;
}

export type FlatTokens = Record<string, FlatToken>;

export interface TokenEntry extends FlatToken {
  /** Full dotted path, e.g. `color.bg.canvas` */
  path: string;
  /** Path with the queried prefix removed, e.g. `canvas` */
  key: string;
}

export const tokens: FlatTokens = flatJson as unknown as FlatTokens;

/** Raw token entry (or `undefined`). */
export function tokenEntry(path: string): FlatToken | undefined {
  return tokens[path];
}

/** Raw token value (unknown shape). */
export function tokenValue(path: string): unknown {
  return tokens[path]?.value;
}

const isShadowLayers = (v: unknown): v is ShadowLayer[] =>
  Array.isArray(v) && v.every((l) => l && typeof l === 'object' && 'blur' in l);
const isBezier = (v: unknown): v is number[] => Array.isArray(v) && v.length === 4 && v.every((n) => typeof n === 'number');
const isTypography = (v: unknown): v is TypographyValue => !!v && typeof v === 'object' && 'fontSize' in v;

export function shadowToCss(layers: ShadowLayer[]): string {
  if (layers.length === 0) return 'none';
  return layers
    .map((l) => `${l.inset ? 'inset ' : ''}${l.offsetX} ${l.offsetY} ${l.blur} ${l.spread} ${l.color}`)
    .join(', ');
}

export function bezierToCss(b: number[]): string {
  return `cubic-bezier(${b.join(', ')})`;
}

/** Stringify any token value into something CSS-ish and human-readable. */
export function formatTokenValue(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (isBezier(value)) return bezierToCss(value);
  if (isShadowLayers(value)) return shadowToCss(value);
  if (isTypography(value)) return `${value.fontSize}/${value.lineHeight} ${value.fontWeight}${value.letterSpacing ? ` ${value.letterSpacing}` : ''}`;
  if (Array.isArray(value)) return value.map(String).join(', ');
  return JSON.stringify(value);
}

/**
 * Typed accessor: returns the token's value as a CSS-ready string.
 * Unknown paths return '' (and warn in dev) so a typo never crashes a page.
 */
export function token(path: string): string {
  const entry = tokens[path];
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`[tokens] unknown token "${path}"`);
    return '';
  }
  return formatTokenValue(entry.value);
}

/** Original reference (`{color.slate.25}`) when the token aliases another, else `undefined`. */
export function tokenReference(path: string): string | undefined {
  const o = tokens[path]?.original;
  return typeof o === 'string' && /^\{.+\}$/.test(o) ? o : undefined;
}

/** All tokens whose path starts with `prefix.` (source order preserved). */
export function tokensByPrefix(prefix: string): TokenEntry[] {
  const p = prefix.endsWith('.') ? prefix : `${prefix}.`;
  return Object.entries(tokens)
    .filter(([path]) => path.startsWith(p))
    .map(([path, t]) => ({ ...t, path, key: path.slice(p.length) }));
}

/** Direct children of a prefix grouped by their next path segment: `groupTokens('color.status')` → { success: [...], warning: [...] } */
export function groupTokens(prefix: string): Record<string, TokenEntry[]> {
  const groups: Record<string, TokenEntry[]> = {};
  for (const t of tokensByPrefix(prefix)) {
    const head = t.key.split('.')[0]!;
    (groups[head] ??= []).push(t);
  }
  return groups;
}

/** `color.bg.canvas` → `--tp-color-bg-canvas` (dist/css/tokens.css) */
export function tokenCssVar(path: string): string {
  return `--tp-${path.replace(/\./g, '-')}`;
}

const TW_NAMESPACE: Record<string, string> = {
  color: '--color',
  radius: '--radius',
  elevation: '--shadow',
  typography: '--text',
  easing: '--ease',
  duration: '--duration',
  breakpoint: '--breakpoint',
  container: '--container',
  space: '--spacing',
};

/** `color.bg.canvas` → `--color-bg-canvas` (Tailwind v4 theme variable), or `null` if not exposed. */
export function tokenTailwindVar(path: string): string | null {
  const [head, ...rest] = path.split('.');
  const ns = head ? TW_NAMESPACE[head] : undefined;
  if (!ns || rest.length === 0) return null;
  return `${ns}-${rest.join('-')}`;
}

/** Total number of compiled tokens. */
export const TOKEN_COUNT = Object.keys(tokens).length;
