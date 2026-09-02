/**
 * Single source of truth: re-export the kit's `cn`, which uses a `tailwind-merge`
 * instance extended with the TP token namespaces (custom `text-<role>` type scale,
 * `shadow-level-*`, `spacing-control-*`, `ease-*`). A second, un-extended `twMerge`
 * here previously caused it to treat `text-<role>` (font-size) and `text-fg-*` /
 * `text-action-*-fg` (color) as the same conflicting group — e.g. `text-action-primary-fg
 * text-label-lg` silently dropped the color class, leaving primary buttons at size lg/xl
 * with invisible/low-contrast (slate-900-on-blue) text. Caught by Lighthouse color-contrast
 * on the home hero CTA; do not reintroduce a local `tailwind-merge` instance here.
 */
export { cn } from '@tpvpn/ui';
