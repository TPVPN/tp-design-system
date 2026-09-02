import { Suspense, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { PageNav } from '@/components/docs/PageNav';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { Sidebar } from '@/components/layout/Sidebar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Toc } from '@/components/layout/Toc';

/**
 * Documentation layout (every non-home route):
 * ≥1280 three columns (sidebar 260 / article ≤ 52rem / toc 220) · 768–1279 two columns · <768 single + drawer.
 */
export function DocsLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);

  return (
    <div className="flex min-h-dvh flex-col bg-bg-canvas">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1360px] flex-1 px-4 sm:px-6 lg:px-8">
        <Sidebar />
        <main ref={mainRef} id="main" tabIndex={-1} className="min-w-0 flex-1 py-10 outline-none md:pl-10 lg:py-14 xl:pr-6">
          <div className="mx-auto w-full max-w-[52rem]">
            <Suspense fallback={<PageSkeleton />}>
              <div key={pathname} className="page-enter">
                <Outlet />
                <PageNav />
              </div>
            </Suspense>
          </div>
        </main>
        <Toc containerRef={mainRef} />
      </div>
      <SiteFooter />
    </div>
  );
}
