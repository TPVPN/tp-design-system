#!/usr/bin/env node
/**
 * sync-assets — mirrors the built outputs of sibling workspace packages into
 * apps/site/public so the docs site can link to real, downloadable files.
 *
 *   packages/brand/dist/**          → public/brand/**     (logo, app-icon, social, flags, fonts, manifest.json)
 *   packages/brand/dist/packs/*.zip → public/downloads/   (+ downloads/index.json with byte sizes)
 *   packages/tokens/dist/**         → public/tokens/**    (css, tailwind, json, dart, swift, kotlin, android, figma)
 *
 * Missing sources are *not* fatal — the packages may not have been built yet —
 * we warn and continue so `vite dev` / `vite build` always run.
 */
import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(here, '..');
const ROOT = path.resolve(SITE, '..', '..');
const PUBLIC = path.join(SITE, 'public');

const BRAND_DIST = path.join(ROOT, 'packages', 'brand', 'dist');
const TOKENS_DIST = path.join(ROOT, 'packages', 'tokens', 'dist');
const PACKS_DIR = path.join(BRAND_DIST, 'packs');

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const log = (msg) => console.log(`[sync-assets] ${msg}`);
const warn = (msg) => console.warn(`[sync-assets] ⚠ ${msg}`);

/** Recursively count files below a directory. */
async function countFiles(dir) {
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    n += entry.isDirectory() ? await countFiles(p) : 1;
  }
  return n;
}

/** Replace `to` with a filtered copy of `from`. Returns false when `from` is missing. */
async function mirror({ label, from, to, filter, hint }) {
  if (!existsSync(from)) {
    warn(`${label}: source ${rel(from)} not found — skipped${hint ? ` (${hint})` : ''}`);
    await rm(to, { recursive: true, force: true });
    return false;
  }
  await rm(to, { recursive: true, force: true });
  await mkdir(path.dirname(to), { recursive: true });
  await cp(from, to, { recursive: true, filter, dereference: true });
  log(`${label}: ${rel(from)} → ${rel(to)} (${await countFiles(to)} files)`);
  return true;
}

async function writeDownloadIndex() {
  const dir = path.join(PUBLIC, 'downloads');
  await mkdir(dir, { recursive: true });
  const files = [];
  for (const name of (await readdir(dir)).sort()) {
    if (!name.endsWith('.zip')) continue;
    const { size, mtime } = await stat(path.join(dir, name));
    files.push({ name, href: `downloads/${name}`, bytes: size, modified: mtime.toISOString() });
  }
  const index = { generatedAt: new Date().toISOString(), files };
  await writeFile(path.join(dir, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  log(`downloads/index.json: ${files.length} archive(s)`);
}

async function main() {
  await mkdir(PUBLIC, { recursive: true });

  await mirror({
    label: 'brand',
    from: BRAND_DIST,
    to: path.join(PUBLIC, 'brand'),
    // everything except the zip packs (those go to /downloads)
    filter: (src) => !src.startsWith(PACKS_DIR),
    hint: 'run `pnpm build:brand`',
  });

  await mirror({
    label: 'downloads',
    from: PACKS_DIR,
    to: path.join(PUBLIC, 'downloads'),
    filter: (src) => src === PACKS_DIR || (path.dirname(src) === PACKS_DIR && src.endsWith('.zip')),
    hint: 'run `pnpm build:brand`',
  });

  await mirror({
    label: 'tokens',
    from: TOKENS_DIST,
    to: path.join(PUBLIC, 'tokens'),
    hint: 'run `pnpm build:tokens`',
  });

  await writeDownloadIndex();
}

main().catch((err) => {
  console.error('[sync-assets] failed:', err);
  process.exit(1);
});
