import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowUpRight, Home } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@tpvpn/ui/components/ui/command';
import { NAV, SITE } from '@/app/routes';
import { GitHubMark } from '@/components/brand/GitHubMark';
import { Kbd } from '@/components/docs/Kbd';

/** ⌘K / Ctrl+K toggles the palette. */
export function useCommandMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return { open, setOpen };
}

const itemClass =
  'gap-2.5 rounded-sm px-2.5 py-2 text-sm text-fg-primary data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-700 [&_svg]:text-fg-muted data-[selected=true]:[&_svg]:text-blue-600';

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="搜索文档"
      description="输入页面、组件或 Token 名称，回车打开"
      showCloseButton={false}
      className="top-[12%] max-w-[calc(100%-2rem)] translate-y-0 overflow-hidden rounded-2xl border-border-default bg-bg-surface p-0 shadow-level-4 sm:max-w-[600px]"
    >
      <CommandInput placeholder="搜索页面、组件、Token…" className="h-12 text-[15px]" />
      <CommandList className="max-h-[min(60vh,440px)] px-1 pb-1">
        <CommandEmpty className="py-10 text-sm text-fg-muted">没有匹配的结果</CommandEmpty>
        <CommandGroup heading="概览">
          <CommandItem value="概览 overview home /" onSelect={() => go('/')} className={itemClass}>
            <Home />
            <span>概览</span>
            <span className="text-fg-muted">Overview</span>
            <span className="ml-auto font-mono text-[11px] text-fg-muted">/</span>
          </CommandItem>
        </CommandGroup>
        {NAV.map((section) => {
          const Icon = section.icon;
          return (
            <CommandGroup key={section.id} heading={`${section.title} · ${section.en}`}>
              {section.items.map((item) => (
                <CommandItem
                  key={item.path}
                  value={`${item.title} ${item.en} ${item.path}`}
                  onSelect={() => go(item.path)}
                  className={itemClass}
                >
                  <Icon />
                  <span>{item.title}</span>
                  <span className="text-fg-muted">{item.en}</span>
                  <span className="ml-auto hidden font-mono text-[11px] text-fg-muted sm:inline">{item.path}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
        <CommandGroup heading="链接">
          <CommandItem
            value="github repository 仓库 源码"
            onSelect={() => {
              onOpenChange(false);
              window.open(SITE.github, '_blank', 'noopener,noreferrer');
            }}
            className={itemClass}
          >
            <GitHubMark size={16} />
            <span>GitHub 仓库</span>
            <ArrowUpRight className="ml-auto" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <div className="flex items-center gap-4 border-t border-border-subtle bg-bg-canvas px-4 py-2 text-[11px] text-fg-muted">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> 选择
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd> 打开
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>Esc</Kbd> 关闭
        </span>
        <span className="ml-auto hidden sm:inline">TP VPN Design System</span>
      </div>
    </CommandDialog>
  );
}
