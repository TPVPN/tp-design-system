#!/usr/bin/env node
/**
 * postbuild:
 *  1. Preload the Inter Variable latin(+ext) woff2 so the headline/body text renders in
 *     its final font on first paint instead of swapping from the fallback stack — the
 *     `font-display: swap` reflow was the single largest CLS contributor on Home
 *     (~0.17, all attributed to a late shift once the fallback→Inter swap re-wrapped
 *     text throughout the page). The filename is content-hashed by Vite, so it is
 *     discovered from dist/assets rather than hardcoded.
 *  2. dist/404.html  = copy of (the now-patched) index.html, so deep links fall back to
 *     the app router on static hosts that support a 404 fallback (GitHub Pages; Vercel
 *     uses vercel.json rewrites instead but the file is harmless there).
 *  3. dist/.nojekyll = disables Jekyll processing (keeps files/dirs starting with "_").
 */
import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(here, '..', 'dist');
const ASSETS = path.join(DIST, 'assets');
const index = path.join(DIST, 'index.html');

if (!existsSync(index)) {
  console.error(`[postbuild] ${index} not found — run \`vite build\` first.`);
  process.exit(1);
}

const assetFiles = existsSync(ASSETS) ? await readdir(ASSETS) : [];
const fontSubsets = ['inter-latin-wght-normal', 'inter-latin-ext-wght-normal'];
const preloadHrefs = fontSubsets
  .map((prefix) => assetFiles.find((f) => f.startsWith(prefix) && f.endsWith('.woff2')))
  .filter(Boolean)
  .map((f) => `/assets/${f}`);

const base = process.env.BASE_PATH ?? '/';

let html = await readFile(index, 'utf8');
if (preloadHrefs.length > 0) {
  const links = preloadHrefs
    .map((href) => `    <link rel="preload" as="font" type="font/woff2" href="${base}${href.slice(1)}" crossorigin />`)
    .join('\n');
  html = html.replace('</title>', '</title>\n' + links);
  await writeFile(index, html);
  console.log(`[postbuild] preloaded ${preloadHrefs.length} Inter woff2 subset(s)`);
} else {
  console.warn('[postbuild] no hashed Inter woff2 found in dist/assets — skipping font preload');
}

await copyFile(index, path.join(DIST, '404.html'));
await writeFile(path.join(DIST, '.nojekyll'), '');
console.log('[postbuild] wrote dist/404.html and dist/.nojekyll');
