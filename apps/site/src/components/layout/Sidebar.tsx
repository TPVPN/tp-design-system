import { NavLink } from 'react-router';
import { NAV, preloadPage } from '@/app/routes';
import { cn } from '@/lib/cn';

export interface SidebarNavProps {
  /** Called after a link is activated (used to close the mobile drawer). */
  onNavigate?: () => void;
  className?: string;
}

/** Grouped navigation list — shared by the desktop sidebar and the mobile sheet. */
export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  return (
    <nav aria-label="文档导航" className={cn('flex flex-col gap-7', className)}>
      {NAV.map((section) => (
        <div key={section.id}>
          <p className="eyebrow mb-2 px-3 text-fg-secondary">
            {section.title}
          </p>
          <ul className="flex flex-col gap-px">
            {section.items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end
                  onClick={onNavigate}
                  onMouseEnter={() => preloadPage(item.path)}
                  onFocus={() => preloadPage(item.path)}
                  className={({ isActive }) =>
                    cn(
                      'group flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200',
                      isActive
                        ? 'bg-blue-50 font-medium text-blue-700'
                        : 'text-fg-secondary hover:bg-bg-surface-hover hover:text-fg-primary',
                    )
                  }
                >
                  <span>{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Sticky 260px desktop sidebar (≥ md). */
export function Sidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[216px] shrink-0 overflow-y-auto overscroll-contain border-r border-border-subtle py-8 pr-5 lg:block">
      <SidebarNav />
    </aside>
  );
}
