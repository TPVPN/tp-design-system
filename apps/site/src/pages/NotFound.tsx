import { ArrowLeft, Search } from 'lucide-react';
import { ButtonLink, Kbd } from '@/components/docs';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto flex min-h-[60vh] max-w-[720px] flex-col items-center justify-center px-6 py-24 text-center">
        <p className="eyebrow text-fg-brand">404</p>
        <h1 className="mt-3 text-display-md text-fg-primary">
          页面不存在 <span className="font-medium text-fg-muted">/ Page not found</span>
        </h1>
        <p className="mt-4 max-w-md text-body-md text-fg-secondary">
          这个地址没有对应的页面。试试从概览开始，或者按 <Kbd>⌘</Kbd> <Kbd>K</Kbd> 搜索。
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink to="/" size="lg">
            <ArrowLeft aria-hidden />
            返回概览
          </ButtonLink>
          <ButtonLink to="/components" variant="outline" size="lg">
            <Search aria-hidden />
            浏览组件
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
