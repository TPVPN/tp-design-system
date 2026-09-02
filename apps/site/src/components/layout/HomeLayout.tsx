import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

/** Full-width layout without sidebar/TOC — home page and the 404 page. */
export function HomeLayout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col bg-bg-canvas">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense
          fallback={
            <div className="mx-auto max-w-[1200px] px-6 py-24">
              <PageSkeleton />
            </div>
          }
        >
          <div key={pathname} className="page-enter">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
