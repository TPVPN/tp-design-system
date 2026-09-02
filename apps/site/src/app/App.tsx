import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { DOC_ITEMS, HOME, PAGES, pageTitle, preloadPage } from '@/app/routes';
import { ScrollToTop } from '@/app/ScrollToTop';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { HomeLayout } from '@/components/layout/HomeLayout';
import NotFound from '@/pages/NotFound';

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = pageTitle(pathname);
  }, [pathname]);
  return null;
}

/**
 * Warm every route's lazy chunk during idle time after first paint.
 *
 * Without this, the FIRST visit to any route pays for a network round-trip
 * behind <Suspense>, and swapping the ~450px PageSkeleton fallback for a
 * 3–12k px real page yanks everything below it (footer included) down the
 * page — a single ~0.2–0.3 CLS hit on that navigation, reproducible even on
 * a fast connection because it's a height change, not a slow-network symptom.
 * Prefetching in the background (module cache only, no extra render) means
 * by the time a visitor actually navigates, <Suspense> resolves synchronously
 * and the fallback never mounts. The current route is already loading; skip it.
 */
function useIdlePrefetch() {
  const { pathname } = useLocation();
  useEffect(() => {
    const paths = [HOME.path, ...DOC_ITEMS.map((item) => item.path)].filter((p) => p !== pathname);
    const idle: typeof requestIdleCallback | typeof setTimeout =
      typeof requestIdleCallback === 'function' ? requestIdleCallback : (cb) => setTimeout(cb, 300);
    const cancelIdle: typeof cancelIdleCallback | typeof clearTimeout =
      typeof cancelIdleCallback === 'function' ? cancelIdleCallback : clearTimeout;
    let cancelled = false;
    let handle: number | ReturnType<typeof setTimeout> = 0;
    let i = 0;
    const next = () => {
      if (cancelled) return;
      // one route per idle slice — keeps this off the main thread during interaction
      if (i < paths.length) preloadPage(paths[i++]!);
      if (i < paths.length) handle = idle(next);
    };
    handle = idle(next);
    return () => {
      cancelled = true;
      cancelIdle(handle as never);
    };
    // Only ever run this once per app session (on mount), not on every route change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default function App() {
  const Home = PAGES['/']!;
  useIdlePrefetch();
  return (
    <>
      <ScrollToTop />
      <DocumentTitle />
      <Routes>
        <Route element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<DocsLayout />}>
          {DOC_ITEMS.map((item) => {
            const Page = PAGES[item.path]!;
            return <Route key={item.path} path={item.path} element={<Page />} />;
          })}
        </Route>
      </Routes>
    </>
  );
}
