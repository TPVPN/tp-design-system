/**
 * Lazy shiki highlighter singleton — core build + JavaScript regex engine +
 * `github-light-high-contrast`. Nothing from shiki is in the initial bundle; the first
 * <CodeBlock> loads core (~small), and each grammar is fetched on demand the first time
 * that language is rendered.
 *
 * Theme note: plain `github-light`'s "constant/variable" token colour (`#E36209`, used for
 * e.g. a CSS custom-property name inside `var(--tp-color-bg-canvas)`) is only 3.49:1 on
 * white — below AA for 13px text. `github-light-high-contrast` is GitHub's WCAG-audited
 * variant of the same palette family (every token colour ≥ 4.5:1, most ≥ 8:1) — same look,
 * accessible by construction, so no per-token overrides are needed here.
 */
import type { HighlighterCore, LanguageRegistration } from 'shiki/core';

export const CODE_LANGS = ['tsx', 'ts', 'css', 'dart', 'swift', 'kotlin', 'xml', 'json', 'bash', 'html'] as const;
export type CodeLang = (typeof CODE_LANGS)[number];

export const CODE_THEME = 'github-light-high-contrast';

const LANG_ALIASES: Record<string, CodeLang> = {
  typescript: 'ts',
  javascript: 'ts',
  js: 'ts',
  jsx: 'tsx',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  kt: 'kotlin',
  scss: 'css',
  xhtml: 'html',
};

type GrammarModule = { default: LanguageRegistration[] };

/** Grammar loaders — one dynamic import per language so each becomes its own chunk. */
const GRAMMARS: Record<CodeLang, () => Promise<GrammarModule>> = {
  tsx: () => import('shiki/langs/tsx.mjs'),
  ts: () => import('shiki/langs/typescript.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  dart: () => import('shiki/langs/dart.mjs'),
  swift: () => import('shiki/langs/swift.mjs'),
  kotlin: () => import('shiki/langs/kotlin.mjs'),
  xml: () => import('shiki/langs/xml.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  html: () => import('shiki/langs/html.mjs'),
};

export function normalizeLang(lang?: string): CodeLang {
  if (!lang) return 'tsx';
  const l = lang.toLowerCase();
  if ((CODE_LANGS as readonly string[]).includes(l)) return l as CodeLang;
  return LANG_ALIASES[l] ?? 'tsx';
}

let core: Promise<HighlighterCore> | null = null;
const loaded = new Map<CodeLang, Promise<void>>();

/** Highlighter core (theme + engine, no grammars yet). */
export function getHighlighter(): Promise<HighlighterCore> {
  core ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ]);
    return createHighlighterCore({
      themes: [import('shiki/themes/github-light-high-contrast.mjs')],
      langs: [],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    });
  })();
  return core;
}

/** Ensure a grammar is registered (idempotent, de-duplicated). */
export function ensureLang(lang: CodeLang): Promise<void> {
  let p = loaded.get(lang);
  if (!p) {
    p = (async () => {
      const [hl, mod] = await Promise.all([getHighlighter(), GRAMMARS[lang]()]);
      await hl.loadLanguage(...mod.default);
    })();
    loaded.set(lang, p);
    p.catch(() => loaded.delete(lang));
  }
  return p;
}

/** Highlight `code` → HTML string (`<pre class="shiki">…</pre>`). */
export async function highlight(code: string, lang?: string): Promise<string> {
  const l = normalizeLang(lang);
  await ensureLang(l);
  const hl = await getHighlighter();
  return hl.codeToHtml(code, { lang: l, theme: CODE_THEME });
}
