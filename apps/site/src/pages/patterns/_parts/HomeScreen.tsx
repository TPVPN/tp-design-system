import type { ReactNode } from 'react';
import { Home, Server, User } from 'lucide-react';
import { AppFrame, ConnectionButton, NodeCard, StatusDot, TabBar, Tag, type ConnectionState, type TabBarItem } from '@tpvpn/ui';
import { LogoMark } from '@/components/brand/LogoMark';

export const HOME_TABS: TabBarItem[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'nodes', label: '节点', icon: Server },
  { key: 'me', label: '我的', icon: User },
];

/** display-sm headline per screen state (docs/10-patterns §1.1). The error screen reads 未连接 + toast. */
export const STATE_TITLE: Record<ConnectionState, string> = {
  disconnected: '未连接',
  connecting: '连接中…',
  connected: '已连接',
  error: '未连接',
};

/** caption line under the headline. */
export const STATE_SUBTITLE: Record<ConnectionState, string> = {
  disconnected: '点击连接',
  connecting: '正在选择最快节点',
  connected: '受保护 · WireGuard',
  error: '连接失败，请重试',
};

export interface HomeNode {
  code: string;
  title: string;
  subtitle: string;
  latencyMs: number;
  loadPct: number;
}

export const DEFAULT_NODE: HomeNode = { code: 'us', title: '洛杉矶', subtitle: 'US · Los Angeles #102', latencyMs: 38, loadPct: 21 };

export interface HomeScreenProps {
  /** Screen state — `error` keeps the button in `disconnected` and shows the error caption. */
  state: ConnectionState;
  /** Session timer, only rendered while connected. */
  elapsed?: string;
  node?: HomeNode;
  onToggle?: () => void;
  /** Absolutely positioned content over the body (e.g. an error toast). */
  overlay?: ReactNode;
  /** Non-interactive storyboard frame. */
  inert?: boolean;
  width?: number;
  height?: number;
}

/** The app home screen composed from the kit: app bar → scene tag → headline → ConnectionButton → NodeCard → TabBar. */
export function HomeScreen({
  state,
  elapsed,
  node = DEFAULT_NODE,
  onToggle,
  overlay,
  inert = false,
  width = 320,
  height = 600,
}: HomeScreenProps) {
  const buttonState: ConnectionState = state === 'error' ? 'disconnected' : state;

  return (
    <AppFrame width={width} height={height} className="bg-bg-canvas" inert={inert || undefined}>
      <div className="flex h-12 shrink-0 items-center justify-between px-5">
        <span className="flex items-center gap-2">
          <LogoMark size={22} title="" />
          <span className="text-[15px] font-semibold tracking-tight text-fg-primary">TP VPN</span>
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-bg-surface-sunken text-fg-secondary">
          <User className="size-4" strokeWidth={1.75} aria-hidden />
        </span>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col items-center px-4 pt-2">
        <Tag tone="auto" size="md">
          自动最优 · IEPL
        </Tag>
        <p className="mt-5 text-display-sm text-fg-primary">{STATE_TITLE[state]}</p>
        <p className="mt-1 flex items-center gap-1.5 text-caption text-fg-muted">
          <StatusDot state={state} size={8} />
          {STATE_SUBTITLE[state]}
        </p>
        <ConnectionButton
          state={buttonState}
          label={null}
          elapsed={state === 'connected' ? elapsed : undefined}
          onClick={onToggle}
          className="mt-6"
          tabIndex={inert ? -1 : undefined}
        />
        <div className="mt-auto mb-4 w-full">
          <NodeCard
            flagCode={node.code}
            title={node.title}
            subtitle={node.subtitle}
            badge={<Tag tone="brand">优质节点</Tag>}
            latencyMs={node.latencyMs}
            loadPct={node.loadPct}
            className="p-3 shadow-level-2"
          />
        </div>
        {overlay}
      </div>

      <TabBar items={HOME_TABS} active="home" onChange={() => {}} className="shrink-0" />
    </AppFrame>
  );
}
