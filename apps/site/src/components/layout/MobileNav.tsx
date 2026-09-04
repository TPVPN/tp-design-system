import { useState } from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@tpvpn/ui/components/ui/sheet';
import { Link } from 'react-router';
import { LogoMark } from '@/components/brand/LogoMark';
import { SidebarNav } from '@/components/layout/Sidebar';
import { SITE } from '@/app/routes';

/** Hamburger → left drawer with the full grouped navigation (< md). */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="打开导航"
          className="inline-flex size-11 items-center justify-center rounded-md text-fg-secondary transition-colors hover:bg-bg-surface-hover hover:text-fg-primary lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] gap-0 border-border-default bg-bg-surface p-0 shadow-level-3 sm:max-w-[300px]"
      >
        <SheetHeader className="border-b border-border-subtle py-4 pr-12 pl-5">
          <SheetTitle className="text-fg-primary">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 whitespace-nowrap">
              <LogoMark size={24} title="" />
              <span className="font-semibold tracking-tight">{SITE.shortName}</span>
              <span className="font-normal text-fg-muted">{SITE.label}</span>
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">站点导航</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
