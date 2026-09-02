/**
 * Compiled token files shipped by @tpvpn/tokens (`packages/tokens/dist` → `public/tokens`).
 * Shared by /platforms and /downloads.
 *
 * `bytes` is a snapshot of the 1.0.0 build; `useFileSizes()` refines it at runtime from the
 * server's `Content-Length` so the numbers stay honest after a token rebuild.
 */
import { useEffect, useMemo, useState } from 'react';
import { tokenUrl, type TokenFormat } from '@/lib/assets';

export type TokenDistLang = 'css' | 'json' | 'dart' | 'swift' | 'kotlin' | 'xml';

export interface TokenDistFile {
  format: TokenFormat;
  /** Path relative to `tokens/<format>/` (matches `TOKEN_FILES` in `@/lib/assets`). */
  file: string;
  label: string;
  platform: string;
  lang: TokenDistLang;
  bytes: number;
  href: string;
}

const define = (
  format: TokenFormat,
  file: string,
  label: string,
  platform: string,
  lang: TokenDistLang,
  bytes: number,
): TokenDistFile => ({ format, file, label, platform, lang, bytes, href: tokenUrl(format, file) });

export const TOKEN_DIST_FILES: readonly TokenDistFile[] = [
  define('css', 'tokens.css', 'CSS 变量', 'Web · 任意框架', 'css', 28164),
  define('tailwind', 'theme.css', 'Tailwind v4 @theme', 'Web · Tailwind CSS v4', 'css', 19854),
  define('json', 'tokens.json', 'JSON · 树形', '任意 · 已解析引用', 'json', 62106),
  define('json', 'tokens.flat.json', 'JSON · 扁平', '任意 · 工具链 / 脚本', 'json', 80291),
  define('dart', 'tp_tokens.dart', 'Dart', 'Flutter', 'dart', 40803),
  define('swift', 'TPTokens.swift', 'Swift', 'iOS · UIKit / SwiftUI', 'swift', 51346),
  define('kotlin', 'TpTokens.kt', 'Kotlin', 'Android · Jetpack Compose', 'kotlin', 35164),
  define('android', 'values/colors.xml', 'colors.xml', 'Android · Views / XML', 'xml', 17792),
  define('android', 'values/dimens.xml', 'dimens.xml', 'Android · Views / XML', 'xml', 7555),
  define('figma', 'tokens.json', 'Tokens Studio JSON', 'Figma · Tokens Studio', 'json', 61618),
];

export const TOKEN_DIST_BYTES = TOKEN_DIST_FILES.reduce((sum, f) => sum + f.bytes, 0);

export function tokenDistFiles(format: TokenFormat): TokenDistFile[] {
  return TOKEN_DIST_FILES.filter((f) => f.format === format);
}

/**
 * HEAD every URL once and return `{ [url]: bytes }` for those that report a usable,
 * uncompressed `Content-Length`. Missing entries fall back to the caller's snapshot.
 */
export function useFileSizes(urls: readonly string[]): Record<string, number> {
  const key = urls.join('\n');
  const list = useMemo(() => key.split('\n').filter(Boolean), [key]);
  const [sizes, setSizes] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof fetch !== 'function' || list.length === 0) return;
    const controller = new AbortController();
    let alive = true;
    void Promise.all(
      list.map(async (url) => {
        try {
          const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
          if (!res.ok || res.headers.get('content-encoding')) return null;
          const n = Number(res.headers.get('content-length'));
          return Number.isFinite(n) && n > 0 ? ([url, n] as const) : null;
        } catch {
          return null;
        }
      }),
    ).then((entries) => {
      if (!alive) return;
      const next: Record<string, number> = {};
      for (const entry of entries) if (entry) next[entry[0]] = entry[1];
      setSizes(next);
    });
    return () => {
      alive = false;
      controller.abort();
    };
  }, [list]);

  return sizes;
}
