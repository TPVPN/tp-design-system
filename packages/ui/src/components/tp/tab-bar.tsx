import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TabBarIconProps {
  className?: string;
  strokeWidth?: number | string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export interface TabBarItem {
  key: string;
  label: string;
  /** Active icon 2px; resting icon 1.75px. */
  icon: React.ComponentType<TabBarIconProps>;
}

export interface TabBarProps extends Omit<React.ComponentProps<'nav'>, 'onChange'> {
  items: TabBarItem[];
  /** Key of the active item. */
  active: string;
  onChange: (key: string) => void;
}

/** Bottom tab bar: 56px + safe-area, glass background, active item in blue-600. */
function TabBar({ items, active, onChange, className, ...props }: TabBarProps) {
  return (
    <nav
      data-slot="tab-bar"
      aria-label="主导航"
      className={cn(
        'w-full border-t border-border-default bg-bg-glass pb-[env(safe-area-inset-bottom)] backdrop-blur-xl',
        className,
      )}
      {...props}
    >
      <div className="flex h-tab-bar items-stretch">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              data-slot="tab-bar-item"
              data-active={isActive || undefined}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onChange(key)}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-2 text-label-sm text-slate-500 select-none',
                'transition-colors duration-(--duration-fast) ease-standard outline-none',
                'hover:text-fg-secondary focus-visible:[box-shadow:inset_var(--shadow-focus)] active:opacity-70',
                isActive && 'text-blue-600 hover:text-blue-600',
              )}
            >
              <Icon className="size-6" strokeWidth={isActive ? 2 : 1.75} aria-hidden="true" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export { TabBar };
