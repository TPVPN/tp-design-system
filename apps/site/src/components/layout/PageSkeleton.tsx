/**
 * Suspense fallback while a lazy page chunk loads.
 *
 * min-height keeps the footer (rendered outside this boundary, in DocsLayout)
 * roughly in place once the real page swaps in — real pages run ~60–90dvh of
 * content on a typical viewport, so this trims the swap-triggered layout
 * shift without needing per-page height data. The idle prefetch in App.tsx
 * means most visitors never see this at all after their first navigation.
 */
export function PageSkeleton() {
  return (
    <div className="min-h-[70dvh] animate-pulse" aria-busy="true" aria-live="polite" aria-label="加载中">
      <div className="h-3 w-20 rounded bg-slate-200" />
      <div className="mt-4 h-9 w-2/3 rounded-md bg-slate-200" />
      <div className="mt-4 h-4 w-full max-w-xl rounded bg-slate-100" />
      <div className="mt-2 h-4 w-5/6 max-w-lg rounded bg-slate-100" />
      <div className="mt-10 h-48 rounded-xl border border-border-subtle bg-slate-50" />
      <div className="mt-8 h-4 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
    </div>
  );
}
