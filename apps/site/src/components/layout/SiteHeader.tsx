import { Link, NavLink, useLocation } from 'react-router';
import { Search } from 'lucide-react';
import { SITE, TOP_NAV, findSection, preloadPage } from '@/app/routes';
import { GitHubMark } from '@/components/brand/GitHubMark';
import { LogoMark } from '@/components/brand/LogoMark';
import { Kbd } from '@/components/docs/Kbd';
import { Pill } from '@/components/docs/Pill';
import { CommandMenu, useCommandMenu } from '@/components/layout/CommandMenu';
import { MobileNav } from '@/components/layout/MobileNav';
import { cn } from '@/lib/cn';

/** 64px sticky header — the only place backdrop-blur is allowed (BRIEF §5). */
export function SiteHeader() {
  const { pathname } = useLocation();
  const current = findSection(pathname);
  const palette = useCommandMenu();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border-default bg-bg-glass backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-bg-surface focus:px-3 focus:py-2 focus:text-sm focus:shadow-level-2"
      >
        跳到主内容
      </a>
      <div className="mx-auto flex h-full max-w-[1360px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 rounded-md whitespace-nowrap">
          <LogoMark size={28} title="" />
          <span className="text-[15px] font-semibold tracking-tight text-fg-primary">{SITE.shortName}</span>
          <span className="hidden text-[15px] whitespace-nowrap text-fg-muted lg:inline">{SITE.label}</span>
          <Pill tone="neutral" size="sm" className="hidden lg:inline-flex">
            v{SITE.version}
          </Pill>
          <span className="sr-only"> · 首页</span>
        </Link>

        <nav aria-label="主导航" className="ml-auto hidden h-full items-center md:flex">
          {TOP_NAV.map((section) => {
            const active = current?.id === section.id;
            return (
              <NavLink
                key={section.id}
                to={section.path}
                aria-current={active ? 'page' : undefined}
                onMouseEnter={() => preloadPage(section.path)}
                className={cn(
                  'relative flex h-16 items-center px-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 lg:px-3',
                  'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-t-full after:bg-blue-600 after:transition-opacity after:duration-200',
                  active ? 'text-fg-primary after:opacity-100' : 'text-fg-secondary after:opacity-0 hover:text-fg-primary',
                )}
              >
                {section.title}
              </NavLink>
            );
          })}
        </nav>

        <div className={cn('flex items-center gap-1', 'md:ml-2')}>
          <button
            type="button"
            onClick={() => palette.setOpen(true)}
            aria-label="搜索文档（⌘K）"
            className="hidden h-9 items-center gap-2 rounded-md border border-border-default bg-bg-surface pr-1.5 pl-3 text-sm whitespace-nowrap text-fg-muted transition-colors duration-200 hover:border-border-strong hover:text-fg-secondary sm:inline-flex"
          >
            <Search className="size-4" aria-hidden />
            <span className="hidden pr-4 lg:inline">搜索</span>
            <span className="flex items-center gap-0.5">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>
          <button
            type="button"
            onClick={() => palette.setOpen(true)}
            aria-label="搜索文档"
            className="inline-flex size-9 items-center justify-center rounded-md text-fg-secondary transition-colors hover:bg-bg-surface-hover hover:text-fg-primary sm:hidden"
          >
            <Search className="size-5" aria-hidden />
          </button>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 仓库"
            className="inline-flex size-9 items-center justify-center rounded-md text-fg-secondary transition-colors hover:bg-bg-surface-hover hover:text-fg-primary"
          >
            <GitHubMark size={18} />
          </a>
          <MobileNav />
        </div>
      </div>
      <CommandMenu open={palette.open} onOpenChange={palette.setOpen} />
    </header>
  );
}
