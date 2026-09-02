import { Link, useLocation } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { preloadPage, siblings, type NavItem } from '@/app/routes';
import { cn } from '@/lib/cn';

function Card({ item, dir }: { item: NavItem; dir: 'prev' | 'next' }) {
  const next = dir === 'next';
  return (
    <Link
      to={item.path}
      onMouseEnter={() => preloadPage(item.path)}
      rel={next ? 'next' : 'prev'}
      className={cn(
        'group flex flex-1 flex-col gap-1 rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1 transition-[box-shadow,border-color] duration-200 hover:border-border-strong hover:shadow-level-2',
        next ? 'items-end text-right' : 'items-start',
      )}
    >
      <span className="flex items-center gap-1 text-xs text-fg-muted">
        {!next && <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />}
        {next ? '下一页' : '上一页'}
        {next && <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />}
      </span>
      <span className="font-medium text-fg-primary group-hover:text-blue-700">
        {item.title} <span className="font-normal text-fg-muted">{item.en}</span>
      </span>
    </Link>
  );
}

/** Previous / next links derived from the NAV manifest — injected by DocsLayout under every page. */
export function PageNav({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const { prev, next } = siblings(pathname);
  if (!prev && !next) return null;
  return (
    <nav aria-label="分页导航" className={cn('mt-16 flex gap-4 border-t border-border-subtle pt-8', className)}>
      {prev ? <Card item={prev} dir="prev" /> : <div className="flex-1" />}
      {next ? <Card item={next} dir="next" /> : <div className="flex-1" />}
    </nav>
  );
}
