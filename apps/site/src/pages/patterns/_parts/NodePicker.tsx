import { useMemo, useState, type ReactNode } from 'react';
import { Crown, Globe, RotateCcw, Search } from 'lucide-react';
import {
  AppFrame,
  Button,
  CountryList,
  CountryListItem,
  Label,
  NodeCard,
  SearchBar,
  Skeleton,
  Switch,
  TabBar,
  Tag,
  ToggleGroup,
  ToggleGroupItem,
  sceneIcon,
  sceneLabel,
  type SceneTone,
} from '@tpvpn/ui';
import { Preview } from '@/components/docs';
import { HOME_TABS } from './HomeScreen';
import { PhoneStage } from './PhoneStage';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

export interface NodeEntry {
  id: string;
  code: string;
  name: string;
  keywords: string[];
  scene?: SceneTone;
  premium?: boolean;
  latencyMs: number;
  lossPct: number;
  loadPct: number;
  recommended?: boolean;
}

export const NODES: NodeEntry[] = [
  { id: 'hk-01', code: 'hk', name: '香港', keywords: ['hong kong', 'hk', 'iepl'], scene: 'auto', premium: true, latencyMs: 18, lossPct: 0, loadPct: 32, recommended: true },
  { id: 'sg-02', code: 'sg', name: '新加坡', keywords: ['singapore', 'sg'], scene: 'auto', latencyMs: 42, lossPct: 0.1, loadPct: 45, recommended: true },
  { id: 'jp-01', code: 'jp', name: '东京', keywords: ['tokyo', 'japan', 'jp'], scene: 'game', latencyMs: 56, lossPct: 0, loadPct: 61, recommended: true },
  { id: 'tw-01', code: 'tw', name: '台北', keywords: ['taipei', 'taiwan', 'tw'], latencyMs: 35, lossPct: 0, loadPct: 28 },
  { id: 'kr-03', code: 'kr', name: '首尔', keywords: ['seoul', 'korea', 'kr'], scene: 'game', latencyMs: 78, lossPct: 0.2, loadPct: 54 },
  { id: 'us-102', code: 'us', name: '洛杉矶', keywords: ['los angeles', 'la', 'united states', 'us'], scene: 'ai', latencyMs: 142, lossPct: 0.3, loadPct: 40 },
  { id: 'ca-01', code: 'ca', name: '温哥华', keywords: ['vancouver', 'canada', 'ca'], latencyMs: 152, lossPct: 0.1, loadPct: 22 },
  { id: 'de-02', code: 'de', name: '法兰克福', keywords: ['frankfurt', 'germany', 'de'], scene: 'ai', latencyMs: 176, lossPct: 0.4, loadPct: 66 },
  { id: 'gb-01', code: 'gb', name: '伦敦', keywords: ['london', 'uk', 'gb', 'united kingdom'], scene: 'exchange', latencyMs: 188, lossPct: 0.5, loadPct: 83 },
  { id: 'au-01', code: 'au', name: '悉尼', keywords: ['sydney', 'australia', 'au'], scene: 'exchange', latencyMs: 246, lossPct: 1.2, loadPct: 96 },
];

export const SCENES: SceneTone[] = ['auto', 'game', 'ai', 'exchange'];
type SceneFilter = 'all' | SceneTone;

const CODE_PICKER = `import { useState } from 'react';
import { CountryList, CountryListItem, SearchBar, Tag, sceneLabel } from '@tpvpn/ui';

const [query, setQuery] = useState('');
const [selected, setSelected] = useState('hk-01');
const q = query.trim().toLowerCase();
const results = nodes
  .filter((n) => !q || n.name.includes(q) || n.keywords.some((k) => k.includes(q)))
  .sort((a, b) => Number(b.premium ?? false) - Number(a.premium ?? false) || a.latencyMs - b.latencyMs);

<SearchBar value={query} onChange={setQuery} />
{results.length === 0 ? (
  <EmptySearch query={query} onReset={() => setQuery('')} />
) : (
  <CountryList role="list">
    {results.map((n) => (
      <div role="listitem" key={n.id}>
        <CountryListItem
          flagCode={n.code}
          name={n.name}
          tag={n.scene ? <Tag tone={n.scene}>{sceneLabel[n.scene]}</Tag> : undefined}
          latencyMs={n.latencyMs}
          lossPct={n.lossPct}
          loadPct={n.loadPct}
          selected={n.id === selected}
          onClick={() => setSelected(n.id)}
        />
      </div>
    ))}
  </CountryList>
)}`;

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function byPriority(a: NodeEntry, b: NodeEntry) {
  return Number(b.premium ?? false) - Number(a.premium ?? false) || a.latencyMs - b.latencyMs;
}

function NodeTags({ node }: { node: NodeEntry }) {
  return (
    <>
      {node.premium && <Tag tone="brand">优质节点</Tag>}
      {node.scene && <Tag tone={node.scene}>{sceneLabel[node.scene]}</Tag>}
    </>
  );
}

export function NodeRow({ node, selected, onSelect }: { node: NodeEntry; selected: boolean; onSelect: () => void }) {
  return (
    <div role="listitem">
      <CountryListItem
        flagCode={node.code}
        name={node.name}
        tag={<NodeTags node={node} />}
        latencyMs={node.latencyMs}
        lossPct={node.lossPct}
        loadPct={node.loadPct}
        selected={selected}
        onClick={onSelect}
      />
    </div>
  );
}

function Group({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-2">
      <p className="eyebrow px-1 text-fg-muted">
        {title}
        {count !== undefined ? ` · ${count}` : ''}
      </p>
      {children}
    </section>
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="正在加载节点"
      className="flex flex-col divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-default bg-bg-surface"
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex min-h-[72px] items-center gap-3 px-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="size-5 rounded-xs" />
        </div>
      ))}
    </div>
  );
}

export function EmptySearch({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <Search className="size-12 text-fg-placeholder" strokeWidth={1.5} aria-hidden />
      <p className="mt-4 text-headline text-fg-primary">没有找到「{query}」</p>
      <p className="mt-1 text-body-sm text-fg-secondary">试试国家、城市或节点编号</p>
      <Button variant="secondary" size="sm" className="mt-5" onClick={onReset}>
        清除搜索
      </Button>
    </div>
  );
}

export function EmptyUnsubscribed() {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <Crown className="size-12 text-fg-placeholder" strokeWidth={1.5} aria-hidden />
      <p className="mt-4 text-headline text-fg-primary">订阅后即可使用全部节点</p>
      <p className="mt-1 text-body-sm text-fg-secondary">当前账号还没有可用套餐</p>
      <Button size="sm" className="mt-5">
        查看套餐
      </Button>
    </div>
  );
}

function NodePicker({ loading }: { loading: boolean }) {
  const [query, setQuery] = useState('');
  const [scene, setScene] = useState<SceneFilter>('all');
  const [selectedId, setSelectedId] = useState('hk-01');

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      NODES.filter((n) => scene === 'all' || n.scene === scene).filter(
        (n) => !q || n.name.includes(q) || n.id.includes(q) || n.keywords.some((k) => k.includes(q)),
      ),
    [q, scene],
  );
  const recommended = matches.filter((n) => n.recommended).sort(byPriority);
  const rest = matches.filter((n) => !n.recommended).sort(byPriority);
  const current = NODES.find((n) => n.id === selectedId);
  const showAuto = !q && scene === 'all';

  return (
    <AppFrame width={360} height={680} className="bg-bg-canvas">
      <div className="sticky top-0 z-10 flex flex-col gap-3 bg-bg-canvas/90 px-4 pt-1 pb-3 backdrop-blur-sm">
        <p className="text-title-md text-fg-primary">节点</p>
        <SearchBar value={query} onChange={setQuery} />
        <div className="-mx-4 overflow-x-auto px-4">
          <ToggleGroup
            type="single"
            value={scene}
            onValueChange={(v) => setScene((v || 'all') as SceneFilter)}
            variant="outline"
            size="sm"
            aria-label="按场景筛选"
            className="flex-wrap"
          >
            <ToggleGroupItem value="all">全部</ToggleGroupItem>
            {SCENES.map((s) => {
              const Icon = sceneIcon[s];
              return (
                <ToggleGroupItem key={s} value={s}>
                  <Icon aria-hidden />
                  {sceneLabel[s]}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-4 pt-1 pb-4">
        {loading ? (
          <SkeletonRows />
        ) : matches.length === 0 ? (
          <EmptySearch query={query} onReset={() => setQuery('')} />
        ) : (
          <>
            <Group title="当前节点">
              {selectedId === 'auto' || !current ? (
                <NodeCard
                  icon={<Globe className="size-6" strokeWidth={1.75} aria-hidden />}
                  title="智能选路"
                  subtitle="自动选择最快节点"
                  badge={<Tag tone="auto">自动最优</Tag>}
                  latencyMs={18}
                  loadPct={32}
                  selected
                />
              ) : (
                <CountryList role="list">
                  <NodeRow node={current} selected onSelect={() => setSelectedId(current.id)} />
                </CountryList>
              )}
            </Group>

            {showAuto && (
              <Group title="推荐">
                <NodeCard
                  icon={<Globe className="size-6" strokeWidth={1.75} aria-hidden />}
                  title="智能选路"
                  subtitle="自动选择最快节点"
                  badge={<Tag tone="auto">自动最优</Tag>}
                  latencyMs={18}
                  loadPct={32}
                  selected={selectedId === 'auto'}
                  onSelect={() => setSelectedId('auto')}
                />
                {recommended.length > 0 && (
                  <CountryList role="list">
                    {recommended.map((n) => (
                      <NodeRow key={n.id} node={n} selected={n.id === selectedId} onSelect={() => setSelectedId(n.id)} />
                    ))}
                  </CountryList>
                )}
              </Group>
            )}

            {!showAuto && recommended.length > 0 && (
              <Group title="推荐" count={recommended.length}>
                <CountryList role="list">
                  {recommended.map((n) => (
                    <NodeRow key={n.id} node={n} selected={n.id === selectedId} onSelect={() => setSelectedId(n.id)} />
                  ))}
                </CountryList>
              </Group>
            )}

            {rest.length > 0 && (
              <Group title="全部" count={rest.length}>
                <CountryList role="list">
                  {rest.map((n) => (
                    <NodeRow key={n.id} node={n} selected={n.id === selectedId} onSelect={() => setSelectedId(n.id)} />
                  ))}
                </CountryList>
              </Group>
            )}
          </>
        )}
      </div>

      <TabBar items={HOME_TABS} active="nodes" onChange={() => {}} className="sticky bottom-0 shrink-0" />
    </AppFrame>
  );
}

export function PickerDemo() {
  const [loading, setLoading] = useState(false);
  const [run, setRun] = useState(0);
  return (
    <Preview
      label="节点选择器交互演示"
      centered={false}
      code={CODE_PICKER}
      toolbar={
        <>
          <span className="flex items-center gap-2">
            <Switch id="nodes-loading" size="sm" checked={loading} onCheckedChange={setLoading} />
            <Label htmlFor="nodes-loading" className="text-sm">
              加载中
            </Label>
          </span>
          <Button variant="ghost" size="sm" onClick={() => setRun((n) => n + 1)}>
            <RotateCcw aria-hidden />
            重置
          </Button>
        </>
      }
    >
      <PhoneStage width={360} height={680}>
        <NodePicker key={run} loading={loading} />
      </PhoneStage>
    </Preview>
  );
}
