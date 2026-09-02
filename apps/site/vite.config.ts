import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const SITE_SRC = fileURLToPath(new URL('./src', import.meta.url));
const UI_SRC = fileURLToPath(new URL('../../packages/ui/src', import.meta.url));

/**
 * `@/` alias that is aware of the importer.
 *
 * Both this app and `@tpvpn/ui` use `@/…` for their own `src/`. A plain
 * `resolve.alias` entry is importer-agnostic and would rewrite the ui kit's
 * `@/lib/utils` to *our* src, so we resolve the prefix per importer instead:
 * files under packages/ui/src keep pointing at the ui kit, everything else
 * points at apps/site/src. (Mirrored for `tsc` via `paths` fallbacks.)
 */
function workspaceAtAlias(): Plugin {
  return {
    name: 'tpvpn:workspace-at-alias',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!source.startsWith('@/')) return null;
      const root = importer && importer.startsWith(UI_SRC) ? UI_SRC : SITE_SRC;
      return this.resolve(`${root}/${source.slice(2)}`, importer, { skipSelf: true });
    },
  };
}

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [workspaceAtAlias(), react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'motion', 'radix-ui'],
  },
  server: {
    port: 5180,
    strictPort: false,
    fs: { allow: [fileURLToPath(new URL('../..', import.meta.url))] },
  },
  preview: { port: 5181 },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // shiki core/engine/theme share one lazy chunk; each grammar stays its own on-demand chunk
          if (/node_modules\/(shiki|@shikijs)\//.test(id)) return /\/langs\//.test(id) ? undefined : 'shiki';
          if (/\/packages\/tokens\/dist\/json\//.test(id)) return 'tokens';
          if (/node_modules\/(motion|framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion';
          if (/node_modules\/(react|react-dom|react-router|scheduler)\//.test(id)) return 'react';
          return undefined;
        },
      },
    },
  },
});
