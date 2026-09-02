import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowUpRight, CircleCheck, Globe, Home, User } from 'lucide-react';
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  ConnectionButton,
  CountryList,
  CountryListItem,
  Input,
  LoadingState,
  NodeCard,
  PlanCard,
  SearchBar,
  Spinner,
  StatusDot,
  Switch,
  TabBar,
  Tag,
  UsageMeter,
  type TabBarItem,
} from '@tpvpn/ui';
import { NAV, type NavItem } from '@/app/routes';
import { CodeBlock, Grid, PageHeader, Prose, Section } from '@/components/docs';
import { cn } from '@/lib/cn';
import { useReveal, VIEWPORT_ONCE } from '@/lib/motion';

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const COMPONENT_ITEMS: readonly NavItem[] = (NAV.find((s) => s.id === 'components')?.items ?? []).filter(
  (item) => item.path !== '/components',
);

/** BRIEF §4: everything under `packages/ui/src/components/tp/` is VPN-specific. */
const VPN_PATHS = new Set([
  '/components/connection-button',
  '/components/tag',
  '/components/node-card',
  '/components/country-list-item',
  '/components/search-bar',
  '/components/tab-bar',
  '/components/loading',
  '/components/usage-meter',
  '/components/plan-card',
  '/components/status-dot',
]);

const VPN_ITEMS = COMPONENT_ITEMS.filter((i) => VPN_PATHS.has(i.path));
const BASE_ITEMS = COMPONENT_ITEMS.filter((i) => !VPN_PATHS.has(i.path));

const TABS: TabBarItem[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'nodes', label: '节点', icon: Globe },
  { key: 'me', label: '我的', icon: User },
];

const noop = () => {};

/* ------------------------------------------------------------------ */
/* Mini previews                                                        */
/* ------------------------------------------------------------------ */

/** Renders `children` at their natural size, then scales the box with a CSS transform. */
function Scaled({ scale, width, height, children }: { scale: number; width: number; height: number; children: ReactNode }) {
  return (
    <div className="relative shrink-0" style={{ width: width * scale, height: height * scale }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width, height, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

interface PreviewSpec {
  node: ReactNode;
  /** Extra classes for the stage (e.g. a scrim behind overlays). */
  stage?: string;
}

function previewFor(path: string): PreviewSpec {
  switch (path) {
    case '/components/button':
      return {
        node: (
          <div className="flex items-center gap-2">
            <Button size="sm">连接</Button>
            <Button size="sm" variant="secondary">
              选择节点
            </Button>
          </div>
        ),
      };
    case '/components/connection-button':
      return {
        node: (
          <Scaled scale={0.5} width={128} height={128}>
            <ConnectionButton state="connected" label={null} tabIndex={-1} />
          </Scaled>
        ),
      };
    case '/components/tag':
      return {
        node: (
          <div className="flex flex-wrap justify-center gap-1.5">
            <Tag tone="auto">自动最优</Tag>
            <Tag tone="game">游戏</Tag>
            <Tag tone="ai">AI</Tag>
            <Tag tone="exchange">交易所</Tag>
          </div>
        ),
      };
    case '/components/node-card':
      return {
        node: (
          <Scaled scale={0.6} width={360} height={76}>
            <NodeCard flagCode="us" title="US · Los Angeles #102" badge={<Tag tone="brand">优质节点</Tag>} latencyMs={38} loadPct={21} />
          </Scaled>
        ),
      };
    case '/components/country-list-item':
      return {
        node: (
          <Scaled scale={0.6} width={360} height={74}>
            <CountryList>
              <CountryListItem flagCode="jp" name="日本 · 东京" tag={<Tag tone="game">游戏</Tag>} latencyMs={58} lossPct={0} loadPct={38} selected />
            </CountryList>
          </Scaled>
        ),
      };
    case '/components/search-bar':
      return {
        node: (
          <div className="w-56">
            <SearchBar value="东京" onChange={noop} aria-label="搜索节点" />
          </div>
        ),
      };
    case '/components/tab-bar':
      return {
        node: (
          <div className="w-64 overflow-hidden rounded-lg border border-border-default bg-bg-surface">
            <TabBar items={TABS} active="nodes" onChange={noop} className="border-t-0" />
          </div>
        ),
      };
    case '/components/switch':
      return {
        node: (
          <div className="flex items-center gap-4">
            <Switch checked onCheckedChange={noop} aria-label="已开启" />
            <Switch checked={false} onCheckedChange={noop} aria-label="已关闭" />
          </div>
        ),
      };
    case '/components/input':
      return {
        node: (
          <div className="w-56">
            <Input placeholder="邮箱地址" readOnly aria-label="邮箱地址" />
          </div>
        ),
      };
    case '/components/card':
      return {
        node: (
          <Card className="w-56 gap-2 py-4">
            <CardHeader className="px-4">
              <CardTitle>当前套餐</CardTitle>
              <CardDescription>专业版 · 4 台设备</CardDescription>
            </CardHeader>
          </Card>
        ),
      };
    case '/components/loading':
      return {
        node: (
          <div className="flex items-center gap-6">
            <Spinner size={28} />
            <div className="w-40">
              <LoadingState variant="skeleton" />
            </div>
          </div>
        ),
      };
    case '/components/dialog':
      return {
        stage: 'bg-slate-900/40',
        node: (
          <div className="w-56 rounded-2xl bg-bg-surface p-4 shadow-level-4 ring-1 ring-border-default">
            <p className="text-headline text-fg-primary">断开连接？</p>
            <p className="mt-1 text-caption text-fg-secondary">当前会话将立即结束。</p>
            <div className="mt-3 flex justify-end gap-2">
              <Button size="sm" variant="ghost">
                取消
              </Button>
              <Button size="sm" variant="destructive">
                断开
              </Button>
            </div>
          </div>
        ),
      };
    case '/components/sheet':
      return {
        stage: 'bg-slate-900/40 items-end px-8 pb-0',
        node: (
          <div className="w-full rounded-t-2xl bg-bg-surface px-4 pt-2 pb-3 shadow-level-3">
            <span className="mx-auto block h-1 w-9 rounded-full bg-slate-300" />
            <p className="mt-2 text-headline text-fg-primary">选择节点</p>
            <div className="mt-2 flex flex-col gap-1.5">
              <span className="h-2.5 w-3/4 rounded-full bg-bg-surface-sunken" />
              <span className="h-2.5 w-1/2 rounded-full bg-bg-surface-sunken" />
            </div>
          </div>
        ),
      };
    case '/components/tooltip':
      return {
        node: (
          <div className="flex flex-col items-center">
            <span className="rounded-sm bg-fg-primary px-2.5 py-1.5 text-caption text-white shadow-level-2">已复制到剪贴板</span>
            <span className="-mt-1 size-2.5 rotate-45 rounded-[2px] bg-fg-primary" />
            <Button size="sm" variant="outline" className="mt-1.5">
              复制 IP
            </Button>
          </div>
        ),
      };
    case '/components/toast':
      return {
        node: (
          <div className="flex w-60 items-center gap-3 rounded-md border border-border-default border-l-[3px] border-l-status-success-solid bg-bg-surface py-3 pr-3 pl-4 shadow-level-3">
            <CircleCheck className="size-5 shrink-0 text-status-success-solid" strokeWidth={2} />
            <span className="text-body text-fg-primary">已连接 · 东京 #12</span>
          </div>
        ),
      };
    case '/components/usage-meter':
      return {
        node: (
          <div className="w-56">
            <UsageMeter usedGb={62.5} totalGb={100} />
          </div>
        ),
      };
    case '/components/plan-card':
      return {
        node: (
          <Scaled scale={0.42} width={260} height={340}>
            <PlanCard
              name="专业版"
              price="¥28"
              period="月"
              features={['4 台设备', '全部节点', 'IEPL 优选线路']}
              highlighted
              badge={<Tag tone="brand">推荐</Tag>}
              cta={<Button>选择套餐</Button>}
            />
          </Scaled>
        ),
      };
    case '/components/status-dot':
      return {
        node: (
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {(
              [
                ['connected', '已连接'],
                ['connecting', '连接中'],
                ['disconnected', '未连接'],
                ['error', '错误'],
              ] as const
            ).map(([state, label]) => (
              <span key={state} className="flex items-center gap-2 text-caption text-fg-secondary">
                <StatusDot state={state} size={10} />
                {label}
              </span>
            ))}
          </div>
        ),
      };
    default:
      return { node: null };
  }
}

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */

function ComponentCard({ item }: { item: NavItem }) {
  const { item: variants } = useReveal();
  const preview = previewFor(item.path);
  return (
    <motion.article
      variants={variants}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border-default bg-bg-surface shadow-level-1 transition-[box-shadow,border-color,transform] duration-300 ease-emphasized hover:-translate-y-0.5 hover:border-border-strong hover:shadow-level-2 has-[a:focus-visible]:shadow-focus"
    >
      {/* Decorative live preview — inert so the nested controls never receive focus. */}
      <div
        inert
        aria-hidden
        className={cn('relative flex h-40 items-center justify-center overflow-hidden border-b border-border-subtle bg-bg-canvas px-5', preview.stage)}
      >
        {preview.node}
      </div>
      <div className="flex flex-1 items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-headline text-fg-primary">
            <Link to={item.path} className="outline-none after:absolute after:inset-0 after:content-['']">
              {item.title}
            </Link>{' '}
            <span className="font-medium text-fg-muted">{item.en}</span>
          </p>
          <p className="mt-1 text-sm leading-6 text-fg-secondary">{item.description}</p>
        </div>
        <ArrowUpRight
          className="mt-1 size-4 shrink-0 text-fg-placeholder transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600"
          aria-hidden
        />
      </div>
    </motion.article>
  );
}

function CardGrid({ items }: { items: readonly NavItem[] }) {
  const { container } = useReveal({ stagger: 0.05 });
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>
      <Grid cols={2}>
        {items.map((item) => (
          <ComponentCard key={item.path} item={item} />
        ))}
      </Grid>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const INSTALL = `import '@tpvpn/ui/styles.css'; // Tailwind + TP 主题 + base，只引一次
import { Button, ConnectionButton, NodeCard, Tag, cn } from '@tpvpn/ui';

export function Home() {
  return (
    <>
      <ConnectionButton state="connected" elapsed="00:12:47" onClick={toggle} />
      <NodeCard flagCode="us" title="US · Los Angeles #102" badge={<Tag tone="brand">优质节点</Tag>} latencyMs={38} loadPct={21} />
      <Button variant="secondary">选择节点</Button>
    </>
  );
}`;

/** `/components` — card grid of every component route (BRIEF §5), grouped VPN-specific vs primitives. */
export default function IndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="组件总览"
        en="Components"
        description={`${COMPONENT_ITEMS.length} 个组件：${VPN_ITEMS.length} 个 VPN 专属组件与 ${BASE_ITEMS.length} 个 shadcn/ui 基座组件，全部用 TP token 换肤、只做 Light。每张卡片里都是真实组件的缩小渲染。`}
      />

      <Section id="install" title="引入" en="Install" description="一次引入样式，按需导入组件；深路径 @tpvpn/ui/components/ui/* 与 @tpvpn/ui/components/tp/* 同样可用。">
        <CodeBlock code={INSTALL} lang="tsx" filename="app.tsx" />
      </Section>

      <Section
        id="vpn"
        title="VPN 专属"
        en="VPN-specific"
        description="packages/ui/src/components/tp/ 下的组件：连接、节点、场景标签与套餐——产品语义直接写进 props。"
      >
        <CardGrid items={VPN_ITEMS} />
      </Section>

      <Section
        id="base"
        title="基础组件"
        en="Primitives"
        description="shadcn/ui（new-york，Radix 基座）拉取后换肤：保持原 API，只把尺寸、圆角、颜色替换为 TP token。"
      >
        <CardGrid items={BASE_ITEMS} />
      </Section>

      <Section id="conventions" title="通用约定" en="Conventions">
        <Prose>
          <ul>
            <li>
              所有组件 TypeScript props 完整；根元素带 <code>data-slot="&lt;component&gt;"</code>，状态通过 <code>data-state</code> / <code>data-selected</code>{' '}
              暴露，方便样式覆盖与测试选择器。
            </li>
            <li>
              <code>className</code> 用 <code>cn</code>（clsx + tailwind-merge）合并，且 twMerge 已登记 TP 的字阶、阴影、尺寸命名空间——传入{' '}
              <code>shadow-level-2</code> 会正确覆盖默认的 <code>shadow-level-1</code>。
            </li>
            <li>
              触控目标 ≥ 44 × 44（<code>size.control.md</code>）；键盘可达；聚焦环统一为 <code>shadow-focus</code>（
              <code>0 0 0 3px rgb(22 119 255 / 0.32)</code>）。
            </li>
            <li>
              尺寸、颜色、圆角全部来自 token：组件层定义在 <code>packages/tokens/src/component/components.json</code>，站点每个组件页底部列出。
            </li>
            <li>
              动效遵循 <code>prefers-reduced-motion</code>：循环动画停止，过渡退化为 150ms 淡入淡出。
            </li>
          </ul>
        </Prose>
      </Section>
    </>
  );
}
