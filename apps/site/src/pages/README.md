# Pages (`src/pages`)

One file per route, resolved by the lazy registry in `src/app/routes.tsx` (`PAGES`).
Each file **default-exports** the page component and is wrapped by `DocsLayout`
(header, sidebar, TOC, prev/next) — or `HomeLayout` for `/`.

## Naming convention

| Route | File | Export |
|---|---|---|
| `/` | `src/pages/Home.tsx` | `export default function HomePage()` |
| `/brand/logo` | `src/pages/brand/Logo.tsx` | `export default function LogoPage()` |
| `/brand/app-icon` | `src/pages/brand/AppIcon.tsx` | `AppIconPage` |
| `/foundations/color` | `src/pages/foundations/Color.tsx` | `ColorPage` |
| `/components` (index) | `src/pages/components/Index.tsx` | `IndexPage` |
| `/components/connection-button` | `src/pages/components/ConnectionButton.tsx` | `ConnectionButtonPage` |
| `/patterns/nodes` | `src/pages/patterns/Nodes.tsx` | `NodesPage` |
| `/platforms` · `/downloads` · `/changelog` | `src/pages/Platforms.tsx` · `Downloads.tsx` · `Changelog.tsx` | … |

Rule: `<section>/<kebab-name>` → `src/pages/<section>/<PascalName>.tsx`; top-level routes live directly in `src/pages/`.
The current placeholders (`<ComingSoon path="…" />`) are meant to be overwritten in place.

## Adding a new route

1. Add a `NavItem` to the right section in `src/app/routes.tsx` (`NAV`) — this wires the sidebar, ⌘K search, prev/next and `<title>`.
2. Add the matching loader to `loaders` in the same file: `'/section/name': () => import('@/pages/section/Name')`.
3. Create the page file. In dev, a missing loader logs a console error.

## Writing a page

```tsx
import { PageHeader, Section, SubSection, Prose, Preview, CodeBlock, PropsTable, Callout, DoDont } from '@/components/docs';
import { Button } from '@tpvpn/ui/components/ui/button';

export default function ButtonPage() {
  return (
    <>
      <PageHeader eyebrow="组件 · Components" title="按钮" en="Button" description="…" />
      <Section id="preview" title="预览" en="Preview">
        <Preview code={`<Button>连接</Button>`}>
          <Button>连接</Button>
        </Preview>
      </Section>
      <Section id="props" title="属性" en="Props">
        <PropsTable rows={[{ name: 'variant', type: "'default' | 'secondary' | …", default: "'default'", description: '…' }]} />
      </Section>
    </>
  );
}
```

- Start with `<PageHeader>`; organise content with `<Section id>` (h2 → TOC) and `<SubSection id?>` (h3).
- Do **not** render `<PageNav>` yourself — `DocsLayout` adds it.
- Asset URLs must come from `@/lib/assets` (`brandUrl.*`, `downloadUrl()`, `tokenUrl()`), token values from `@/lib/tokens`.
- The UI kit is available via `@tpvpn/ui` (barrel) and deep paths `@tpvpn/ui/components/ui/*` · `@tpvpn/ui/components/tp/*`.
- Component docs for every building block: `src/components/docs/README.md`.
