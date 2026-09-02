import { motion, useReducedMotion } from 'motion/react';
import { Home, Server, User } from 'lucide-react';
import { AppFrame, ConnectionButton, NodeCard, StatusDot, TabBar, Tag, sceneIcon, type TabBarItem } from '@tpvpn/ui';
import { LogoMark } from '@/components/brand/LogoMark';
import { cn } from '@/lib/cn';

const TABS: TabBarItem[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'nodes', label: '节点', icon: Server },
  { key: 'me', label: '我的', icon: User },
];

/**
 * Hero visual: the connected home screen, composed from the UI kit
 * (AppFrame → Tag → ConnectionButton → StatusDot → NodeCard → TabBar). Purely decorative.
 */
export function PhoneMock({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const AutoIcon = sceneIcon.auto;

  return (
    <div className={cn('relative w-[320px] max-w-full select-none', className)} aria-hidden inert>
      {/* soft, slow-breathing glow — the only looping motion on the page */}
      <motion.div
        className="absolute top-[42%] left-1/2 -z-10 size-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(22_119_255/0.2),rgb(0_198_255/0.07)_55%,transparent_100%)]"
        animate={reduced ? undefined : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AppFrame width={320} height={624} className="bg-bg-canvas">
        {/* app bar */}
        <div className="flex h-12 shrink-0 items-center justify-between px-5">
          <span className="flex items-center gap-2">
            <LogoMark size={22} title="" />
            <span className="text-[15px] font-semibold tracking-tight text-fg-primary">TP VPN</span>
          </span>
          <span className="flex size-8 items-center justify-center rounded-full bg-bg-surface-sunken text-fg-secondary">
            <User className="size-4" strokeWidth={1.75} />
          </span>
        </div>

        {/* body */}
        <div className="flex min-h-0 flex-1 flex-col items-center px-4 pt-3">
          <Tag tone="auto" size="md" icon={<AutoIcon />}>
            自动最优 · IEPL
          </Tag>
          <ConnectionButton state="connected" elapsed="00:12:47" className="mt-9" tabIndex={-1} />
          <p className="mt-3 flex items-center gap-1.5 text-caption text-fg-muted">
            <StatusDot state="connected" size={8} />
            受保护 · WireGuard
          </p>
          <div className="mt-auto mb-4 w-full">
            <NodeCard
              flagCode="us"
              title="洛杉矶"
              subtitle="US · Los Angeles"
              badge={<Tag tone="brand">优质节点</Tag>}
              latencyMs={38}
              loadPct={21}
              className="p-3 shadow-level-2"
            />
          </div>
        </div>

        <TabBar items={TABS} active="home" onChange={() => {}} className="shrink-0" />
      </AppFrame>
    </div>
  );
}
