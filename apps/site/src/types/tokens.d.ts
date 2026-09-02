/**
 * Ambient typing for the flat token JSON produced by `@tpvpn/tokens` (`dist/json/tokens.flat.json`).
 * When the file exists, TypeScript resolves the real JSON (and this declaration is ignored);
 * when it has not been built yet, this keeps `tsc --noEmit` green. Runtime always needs the file.
 */
declare module '@tpvpn/tokens/flat' {
  interface FlatTokenEntry {
    value: unknown;
    type: string;
    description?: string;
    original?: unknown;
  }
  const tokens: Record<string, FlatTokenEntry>;
  export default tokens;
}
