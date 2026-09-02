# Docs building blocks (`@/components/docs`)

Reusable, token-styled pieces for content pages. Import from the barrel:

```tsx
import { PageHeader, Section, SubSection, Prose, Callout, DoDont, Preview, CodeBlock,
         TokenTable, ColorSwatch, ColorRamp, PropsTable, DownloadCard, Grid, Kbd, Pill, StatCard } from '@/components/docs';
```

Every page should start with `<PageHeader>` and be organised into `<Section id="…">` blocks —
the right-hand TOC is built from the `h2`/`h3` elements that `Section`/`SubSection` render, and
`DocsLayout` appends `<PageNav>` (prev/next from the NAV manifest) automatically.

| Component | Props | Notes |
|---|---|---|
| `PageHeader` | `eyebrow?`, `title`, `en?`, `description?`, `actions?`, `className?` | H1 「标题 / English」, body-lg description, action row. |
| `Section` | `id` (required, unique kebab-case), `title`, `en?`, `description?`, `children`, `className?` | Renders `h2#id` with hover anchor link. Appears in TOC. |
| `SubSection` | same as `Section` but `id?` optional | Renders `h3`; listed in the TOC only when `id` is given. |
| `AnchorHeading` | `id`, `as: 'h2' \| 'h3'`, `title`, `en?` | Low-level heading used by the two above. |
| `Prose` | `HTMLAttributes<div>` | Wraps long-form HTML (p/ul/ol/a/code/table/blockquote) with `.doc-prose` styles. |
| `Callout` | `tone?: 'info' \| 'success' \| 'warning' \| 'error'` (default `info`), `title?`, `children` | 50-tint box, 200 border, 700 accent; warning/error get `role="alert"`. |
| `DoDont` | `do`, `dont`, `doCaption?`, `dontCaption?`, `previewClassName?` | Two cards with green ✓ / red ✕ headers. |
| `Preview` | `children`, `className?`, `padded?=true`, `centered?=true`, `background?: 'canvas' \| 'surface' \| 'brand' \| 'checker'`, `toolbar?`, `code?`, `lang?`, `codeOpen?`, `minHeight?`, `label?` | Rounded-xl frame; `code` adds a “Code” toggle that reveals a `CodeBlock`. Put prop switches in `toolbar`. |
| `CodeBlock` | `code`, `lang?` (`tsx` default; `ts css dart swift kotlin xml json bash html`), `filename?`, `showLineNumbers?`, `bare?`, `maxHeight?` | shiki `github-light-high-contrast`, lazy-loaded; monospace `<pre>` while loading; copy button with “Copied” state. |
| `CopyButton` | `text`, `label?`, `size?: 'sm' \| 'md'` | Standalone copy control. |
| `TokenTable` | `rows: { name, value, description?, preview?: 'color' \| 'radius' \| 'shadow' \| 'spacing' \| 'text' \| 'ease' \| 'duration', reference? }[]`, `caption?`, `showReference?` | Click a name to copy. Preview column adapts per kind. |
| `ColorSwatch` | `name`, `hex`, `label?`, `contrast?`, `size?: 'sm' \| 'md' \| 'lg'` | Card; click copies hex; `contrast` shows ratio/grade vs white and vs ink. |
| `ColorRamp` | `name`, `steps: { step, hex }[]`, `base?=500`, `label?` | 11-step strip; hover → hex + contrast vs white; click copies; base step dotted. |
| `ContrastBadge` | `fg`, `bg`, `label` | `4.82 AA` chip (used by `ColorSwatch`, handy for a11y matrices). |
| `PropsTable` | `rows: { name, type, default?, description?, required? }[]`, `caption?` | Component API table. |
| `DownloadCard` | `title`, `description?`, `href` (BASE_URL-prefixed), `bytes?`, `formats?: string[]`, `preview?`, `icon?`, `filename?` | Real `<a download>`; build hrefs with `downloadUrl()` / `brandUrl.*` / `tokenUrl()` from `@/lib/assets`. |
| `ButtonLink` | `LinkProps` + `variant?` / `size?` / `pill?` (the kit's `buttonVariants`) | Router `<Link>` styled as a kit Button — use for CTAs instead of `<Button asChild>`. |
| `Grid` | `cols?: 1–6` (default 3), `gap?: 'sm' \| 'md' \| 'lg'` | Responsive equal columns. |
| `Kbd` | `HTMLAttributes<kbd>` | Key cap. |
| `Pill` | `tone?: 'neutral' \| 'brand' \| 'success' \| 'warning' \| 'error' \| 'outline'`, `size?: 'sm' \| 'md'` | Small label. |
| `StatCard` | `label`, `value`, `hint?`, `icon?` | Metric card with tabular numerals. |
| `PageNav` | `className?` | Prev/next — already rendered by `DocsLayout`; don't add it manually. |
| `ComingSoon` | `path` | Placeholder body for pages that are not written yet. |

## Helpers in `@/lib`

- `cn(...)` — Tailwind-aware class merge.
- `useCopy()` → `{ copied, copy(text), reset }` · `copyText(text)`.
- `contrastRatio(a, b)`, `contrastGrade(ratio, { large? })`, `passesAA/AAA`, `bestTextOn(bg)`, `hexToOklch(hex)`, `formatOklch(hex)`.
- `asset(path)`, `brandUrl.{logoSvg,logoPng,appIcon,flag,social,font,manifest}`, `downloadUrl(zip)`, `tokenUrl(format, file?)`, `fetchDownloadIndex()`, `formatBytes(n)`, plus the `LOGO_VARIANTS`, `TOKEN_FORMATS`, `TOKEN_FILES` constants.
- `token('color.bg.canvas')`, `tokenValue(path)`, `tokensByPrefix('color.blue')`, `groupTokens('color.status')`, `tokenReference(path)`, `tokenCssVar(path)`, `tokenTailwindVar(path)`, `formatTokenValue(v)`, `TOKEN_COUNT`.
- `useReveal()` (motion variants honouring reduced motion), `EASE_*` beziers, `VIEWPORT_ONCE`.
- `highlight(code, lang)` / `getHighlighter()` (shiki singleton), `CODE_LANGS`.

## Conventions

- Chinese first, English second: `title="色彩系统" en="Color System"`.
- Section ids are kebab-case and unique within a page (`id="usage"`, `id="dont"`).
- Never hard-code colours in pages when a token class exists (`bg-bg-surface`, `text-fg-muted`, `border-border-default`, `shadow-level-1`, `text-title-md` …).
- All asset links go through `@/lib/assets` so `BASE_PATH` deployments keep working.
