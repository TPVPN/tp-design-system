import { useState, type ComponentType } from 'react';
import { Crown, Globe, Home, Settings, User } from 'lucide-react';
import {
  AppFrame,
  ConnectionButton,
  CountryList,
  CountryListItem,
  StatusDot,
  TabBar,
  Tag,
  UsageMeter,
  type TabBarItem,
} from '@tpvpn/ui';
import {
  Callout,
  DocTable,
  DoDont,
  PageHeader,
  Preview,
  Prose,
  PropsTable,
  Section,
  SubSection,
  TokenTable,
} from '@/components/docs';
import { cn } from '@/lib/cn';
import { token } from '@/lib/tokens';
import { Anatomy } from './_parts/Anatomy';
import { Segmented, SwitchControl } from './_parts/Controls';
import { COUNTRIES } from './_parts/demoData';
import { PlatformHint } from './_parts/PlatformHint';
import { SourceLink } from './_parts/SourceLink';
import { DART, SWIFT } from './_parts/tabBarSnippets';

type TabKey = 'home' | 'nodes' | 'me';

const TABS: TabBarItem[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'nodes', label: '节点', icon: Globe },
  { key: 'me', label: '我的', icon: User },
];

const TAB_OPTIONS: { value: TabKey; label: string }[] = [
  { value: 'home', label: '首页' },
  { value: 'nodes', label: '节点' },
  { value: 'me', label: '我的' },
];

/** iOS home-indicator inset (points). */
const SAFE_AREA_PX = 34;

const noop = () => {};

/* ------------------------------------------------------------------ */
/* Mock bodies                                                           */
/* ------------------------------------------------------------------ */

function HomeBody() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 pt-6">
      <Tag tone="auto" size="md">
        自动最优 · IEPL
      </Tag>
      <ConnectionButton state="connected" elapsed="00:12:47" className="mt-8" tabIndex={-1} />
      <p className="mt-3 flex items-center gap-1.5 text-caption text-fg-muted">
        <StatusDot state="connected" size={8} />
        受保护 · WireGuard
      </p>
    </div>
  );
}

function NodesBody() {
  return (
    <div className="flex flex-1 flex-col gap-2 px-4 pt-4">
      <p className="eyebrow px-1 text-fg-muted">亚太</p>
      <CountryList>
        {COUNTRIES.slice(0, 3).map((c) => (
          <CountryListItem
            key={c.code}
            flagCode={c.code}
            name={c.name}
            tag={c.tag ? <Tag tone={c.tag.tone}>{c.tag.label}</Tag> : undefined}
            latencyMs={c.latencyMs}
            lossPct={c.lossPct}
            loadPct={c.loadPct}
            selected={c.code === 'jp'}
          />
        ))}
      </CountryList>
    </div>
  );
}

function MeBody() {
  return (
    <div className="flex flex-1 flex-col gap-3 px-4 pt-4">
      <div className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1">
        <span className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Crown className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-headline text-fg-primary">专业版</span>
          <span className="block text-caption text-fg-muted">4 台设备 · 2026-12-01 到期</span>
        </span>
      </div>
      <div className="rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1">
        <UsageMeter usedGb={62.5} totalGb={100} />
      </div>
    </div>
  );
}

const BODIES: Record<TabKey, ComponentType> = { home: HomeBody, nodes: NodesBody, me: MeBody };

/* ------------------------------------------------------------------ */
/* Live preview                                                          */
/* ------------------------------------------------------------------ */

function PhoneWithTabBar({
  active,
  onChange,
  safeArea,
  height = 520,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
  safeArea: boolean;
  height?: number;
}) {
  const Body = BODIES[active];
  return (
    <AppFrame width={320} height={height} className="bg-bg-canvas">
      <div className="flex h-12 shrink-0 items-center justify-between px-5">
        <span className="text-[15px] font-semibold tracking-tight text-fg-primary">TP VPN</span>
        <Settings className="size-5 text-fg-secondary" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Body />
      </div>
      <div className="relative shrink-0">
        <TabBar items={TABS} active={active} onChange={(key) => onChange(key as TabKey)} className={cn(safeArea && 'pb-[34px]')} />
        {safeArea && (
          <span aria-hidden className="pointer-events-none absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-slate-900" />
        )}
      </div>
    </AppFrame>
  );
}

function LivePreview() {
  const [active, setActive] = useState<TabKey>('home');
  const [safeArea, setSafeArea] = useState(true);

  const code = `import { useState } from 'react';
import { Globe, Home, User } from 'lucide-react';
import { TabBar, type TabBarItem } from '@tpvpn/ui';

const TABS: TabBarItem[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'nodes', label: '节点', icon: Globe },
  { key: 'me', label: '我的', icon: User },
];

const [active, setActive] = useState('${active}');

{/* 内容区底部留出 56px + 安全区，避免被遮挡 */}
<main className="pb-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))]">…</main>
<TabBar items={TABS} active={active} onChange={setActive} className="fixed inset-x-0 bottom-0" />`;

  return (
    <Preview
      label="标签栏预览"
      code={code}
      minHeight={600}
      toolbar={
        <>
          <Segmented label="当前" value={active} options={TAB_OPTIONS} onChange={setActive} />
          <SwitchControl label={`模拟安全区 ${SAFE_AREA_PX}pt`} checked={safeArea} onCheckedChange={setSafeArea} />
        </>
      }
    >
      <PhoneWithTabBar active={active} onChange={setActive} safeArea={safeArea} />
    </Preview>
  );
}

/* ------------------------------------------------------------------ */
/* Platform snippets                                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

/** `/components/tab-bar` */
export default function TabBarPage() {
  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="标签栏"
        en="Tab Bar"
        description="App 底部主导航，固定三项：首页 / 节点 / 我的。高 56 + 底部安全区，玻璃底、顶部 hairline，选中项 blue-600。"
        actions={<SourceLink path="packages/ui/src/components/tp/tab-bar.tsx" exports={['TabBar', 'type TabBarItem', 'type TabBarIconProps']} />}
      />

      <Section id="preview" title="预览" en="Preview" description="放在 AppFrame 里的完整示例：切换标签会替换内容区；「模拟安全区」用 34pt 底部内边距模拟 iPhone 的 home indicator。">
        <LivePreview />
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <Anatomy
          width={320}
          pins={[
            { n: 1, label: '容器', note: <><code>&lt;nav aria-label="主导航"&gt;</code> · 高 <code>size.tab-bar</code> 56 + <code>env(safe-area-inset-bottom)</code> · 底 <code>bg.glass</code> + <code>backdrop-blur</code> · 顶部 1px <code>border.default</code></>, x: 0, y: -34 },
            { n: 2, label: '图标', note: <>lucide 24px · 未选描边 1.75 · 选中描边 2.5 · <code>aria-hidden</code></>, x: 26, y: 20 },
            { n: 3, label: '文字', note: <><code>label-sm</code> 12/16 500 · 与图标间距 4 · 单行截断</>, x: 26, y: 46 },
            { n: 4, label: '选中项', note: <>图标 + 文字 <code>tab-bar.active-fg</code> blue-600 · <code>aria-current="page"</code>；未选 <code>tab-bar.inactive-fg</code> slate-500</>, x: 50, y: -34 },
            { n: 5, label: '安全区', note: <><code>padding-bottom: env(safe-area-inset-bottom)</code> · iOS 34pt · 需 <code>viewport-fit=cover</code></>, x: 50, y: 84 },
          ]}
        >
          <div className="overflow-hidden rounded-xl bg-bg-surface ring-1 ring-border-default">
            <div className="relative">
              <TabBar items={TABS} active="nodes" onChange={noop} className="pb-[34px]" />
              <span aria-hidden className="pointer-events-none absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-slate-900" />
            </div>
          </div>
        </Anatomy>
      </Section>

      <Section id="states" title="状态" en="States" description="状态作用在每一项上：选中 / 默认 / 悬停 / 按下 / 聚焦。颜色只用两档（blue-600 与 slate-500），选中同时加粗图标描边。">
        <Preview label="选中项对比" className="gap-6">
          {(['home', 'me'] as const).map((active) => (
            <div key={active} className="w-full max-w-[300px] overflow-hidden rounded-xl bg-bg-surface ring-1 ring-border-default">
              <TabBar items={TABS} active={active} onChange={noop} />
            </div>
          ))}
        </Preview>
        <DocTable
          caption="标签项状态"
          head={
            <>
              <th>状态</th>
              <th>图标 / 文字</th>
              <th>其他</th>
              <th>ARIA / 触发</th>
            </>
          }
        >
          <tr>
            <td>选中</td>
            <td>blue-600 · 图标描边 2.5</td>
            <td>hover 不变色</td>
            <td className="font-mono text-[12px]">aria-current="page" · data-active</td>
          </tr>
          <tr>
            <td>默认</td>
            <td>slate-500 · 描边 1.75</td>
            <td>—</td>
            <td className="font-mono text-[12px]">button</td>
          </tr>
          <tr>
            <td>悬停</td>
            <td>fg-secondary slate-600</td>
            <td>100ms standard</td>
            <td>鼠标（桌面 / 平板指针）</td>
          </tr>
          <tr>
            <td>按下</td>
            <td>不变</td>
            <td>opacity 70%，100ms</td>
            <td>active</td>
          </tr>
          <tr>
            <td>聚焦</td>
            <td>不变</td>
            <td>inset shadow-focus（不撑破 nav 外框）</td>
            <td className="font-mono text-[12px]">focus-visible</td>
          </tr>
        </DocTable>
      </Section>

      <Section id="safe-area" title="安全区" en="Safe area" description="标签栏高度 = 56 + 设备底部安全区；内容区要预留同样的底部内边距，否则最后一行被遮住。">
        <figure className="my-6 overflow-hidden rounded-xl border border-border-default bg-bg-canvas p-6">
          <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl bg-bg-surface shadow-level-2 ring-1 ring-border-default">
            <div className="flex h-24 items-center justify-center border-b border-dashed border-border-strong text-caption text-fg-muted">
              内容区 · padding-bottom = 56 + inset
            </div>
            <div className="relative flex h-14 items-center justify-between border-t border-border-default bg-bg-glass px-4 backdrop-blur-xl">
              <span className="text-caption text-fg-secondary">tab-bar</span>
              <span className="font-mono text-[11px] text-fg-muted">size.tab-bar · {token('size.tab-bar')}</span>
            </div>
            <div className="relative flex h-[34px] items-center justify-between bg-blue-50 px-4">
              <span className="text-caption text-blue-700">env(safe-area-inset-bottom)</span>
              <span className="font-mono text-[11px] text-blue-700">iOS 34pt · Android 手势条 ≈ 16–24dp</span>
              <span aria-hidden className="pointer-events-none absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-slate-900" />
            </div>
          </div>
          <figcaption className="mt-4 text-center text-caption text-fg-muted">
            玻璃底会透出滚动内容，因此安全区也在 nav 内部，用同一块 backdrop-blur 覆盖。
          </figcaption>
        </figure>
        <Prose>
          <ul>
            <li>
              Web / PWA：<code>&lt;meta name="viewport" content="width=device-width, viewport-fit=cover"&gt;</code>，否则 <code>env()</code> 恒为 0；组件已内置{' '}
              <code>pb-[env(safe-area-inset-bottom)]</code>。
            </li>
            <li>
              内容区：<code>pb-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))]</code>（56 + inset）；滚动到底时最后一项完整可见。
            </li>
            <li>
              Flutter：<code>SafeArea(top: false)</code> 包住 56 高的栏；iOS <code>TabView</code> 自动处理；Android 手势导航同理，不要再手写 16dp。
            </li>
            <li>横屏 / 桌面窗口没有底部安全区时 inset 为 0，高度回到 56，不需要额外分支。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={
            <div className="w-full max-w-[300px] overflow-hidden rounded-xl bg-bg-surface ring-1 ring-border-default">
              <TabBar items={TABS} active="home" onChange={noop} />
            </div>
          }
          dont={
            <div className="w-full max-w-[300px] overflow-hidden rounded-xl bg-bg-surface ring-1 ring-border-default">
              <TabBar
                items={[
                  { key: 'home', label: '首页', icon: Home },
                  { key: 'nodes', label: '节点', icon: Globe },
                  { key: 'plans', label: '套餐', icon: Crown },
                  { key: 'settings', label: '设置', icon: Settings },
                  { key: 'me', label: '我的', icon: User },
                ]}
                active="home"
                onChange={noop}
              />
            </div>
          }
          doCaption="固定三项（首页 / 节点 / 我的），套餐与设置放进「我的」。"
          dontCaption="五项标签栏：每项不足 60px 宽，文字截断，产品结构也被摊平。"
          previewClassName="px-4"
        />
        <DoDont
          do={
            <div className="w-full max-w-[300px] overflow-hidden rounded-xl bg-bg-surface ring-1 ring-border-default">
              <TabBar items={TABS} active="nodes" onChange={noop} />
            </div>
          }
          dont={
            <div className="w-full max-w-[300px] overflow-hidden rounded-xl bg-bg-surface ring-1 ring-border-default">
              <TabBar items={TABS.map((t) => ({ ...t, label: '' }))} active="nodes" onChange={noop} />
            </div>
          }
          doCaption="图标 + 文字：不依赖用户猜图标含义。"
          dontCaption="只有图标：「节点」用地球还是服务器，用户要试一次才知道。"
          previewClassName="px-4"
        />
        <DoDont
          do={
            <div className="w-full max-w-[300px] overflow-hidden rounded-xl bg-bg-surface ring-1 ring-border-default">
              <TabBar items={TABS} active="me" onChange={noop} />
            </div>
          }
          dont={
            <div className="w-full max-w-[300px] overflow-hidden rounded-xl bg-bg-surface ring-1 ring-border-default [&_[data-active]]:mx-2 [&_[data-active]]:my-1.5 [&_[data-active]]:rounded-full [&_[data-active]]:bg-blue-600 [&_[data-active]]:text-white [&_[data-active]]:hover:text-white">
              <TabBar items={TABS} active="me" onChange={noop} />
            </div>
          }
          doCaption="选中只靠颜色 + 描边加粗，安静、稳定。"
          dontCaption="选中项填充蓝色胶囊：抢过连接按钮的视觉权重，也与 Material 3 风格混杂。"
          previewClassName="px-4"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              <code>&lt;nav aria-label="主导航"&gt;</code> 形成地标；每项是原生 <code>&lt;button&gt;</code>，选中项 <code>aria-current="page"</code>。
            </li>
            <li>键盘：Tab 在三项间移动，Enter / Space 切换；聚焦环 inset 绘制，不会被 nav 的 overflow 裁掉。</li>
            <li>
              每项宽 ≥ 106px（320 屏三等分）、高 56，远超 44 触控最小值；文字 12px <code>label-sm</code> 是本系统允许的最小字号。
            </li>
            <li>
              对比度：blue-600 在白 / 80% 白玻璃上 4.82:1；slate-500 4.76:1（AA）。<code>backdrop-blur</code> 下若内容极暗，玻璃底 80% 白仍能保持文字可读。
            </li>
            <li>图标 <code>aria-hidden</code>，可访问名称来自可见文字；标签栏切换不改变焦点位置，由页面自行管理标题。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props">
        <SubSection title="TabBar" description="TabBarProps = Omit<React.ComponentProps<'nav'>, 'onChange'> & { items, active, onChange }">
          <PropsTable
            rows={[
              { name: 'items', type: 'TabBarItem[]', required: true, description: '标签项数组，产品固定 3 项。' },
              { name: 'active', type: 'string', required: true, description: '当前项的 key。' },
              { name: 'onChange', type: '(key: string) => void', required: true, description: '点击某项时回调其 key。' },
              { name: '...props', type: "Omit<React.ComponentProps<'nav'>, 'onChange'>", description: 'className（如 fixed inset-x-0 bottom-0）、aria-label 覆盖等透传到 nav。' },
            ]}
          />
        </SubSection>
        <SubSection title="TabBarItem · TabBarIconProps">
          <PropsTable
            rows={[
              { name: 'key', type: 'string', required: true, description: '唯一标识，与 active 比较。' },
              { name: 'label', type: 'string', required: true, description: '可见文字（同时是可访问名称）。' },
              {
                name: 'icon',
                type: 'React.ComponentType<TabBarIconProps>',
                required: true,
                description: '图标组件（lucide 可直接传）；组件会注入 className="size-6"、strokeWidth（选中 2.5 / 未选 1.75）与 aria-hidden。',
              },
              { name: 'TabBarIconProps', type: "{ className?: string; strokeWidth?: number | string; 'aria-hidden'?: boolean | 'true' | 'false' }", description: '自定义图标组件需接受这三个 props。' },
            ]}
          />
        </SubSection>
      </Section>

      <Section id="tokens" title="组件 Token" en="Component tokens">
        <TokenTable
          caption="tab-bar.* 组件 token"
          rows={[
            { name: 'tab-bar.height', value: token('tab-bar.height'), reference: '{size.tab-bar}', description: '不含安全区' },
            { name: 'tab-bar.bg', value: token('tab-bar.bg'), reference: '{color.bg.glass}', preview: 'color', description: '80% 白 + backdrop-blur' },
            { name: 'tab-bar.border', value: token('tab-bar.border'), reference: '{color.border.default}', preview: 'color', description: '顶部 hairline' },
            { name: 'tab-bar.active-fg', value: token('tab-bar.active-fg'), reference: '{color.blue.600}', preview: 'color', description: '选中项' },
            { name: 'tab-bar.inactive-fg', value: token('tab-bar.inactive-fg'), reference: '{color.slate.500}', preview: 'color', description: '未选项' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformHint
          flutter={
            <>
              forui <code>FBottomNavigationBar</code> 或按下方自定义：<code>SafeArea(top: false)</code> + 高 <code>TpTokens.tabBarHeight</code> 56、底{' '}
              <code>TpTokens.tabBarBg</code>、顶部 <code>tabBarBorder</code>，选中 <code>TpTokens.tabBarActiveFg</code>（blue-600）、未选 <code>tabBarInactiveFg</code>（slate-500），文字{' '}
              <code>typographyLabelSm</code>。
            </>
          }
          ios={
            <>
              <code>TabView</code> + <code>.tint(Color(TPTokens.tabBarActiveFg))</code>；未选中色通过 <code>UITabBarAppearance</code> 指定 <code>TPTokens.tabBarInactiveFg</code>；
              系统自动处理毛玻璃与底部安全区。
            </>
          }
          dart={DART}
          dartFilename="lib/widgets/tp_tab_bar.dart"
          swift={SWIFT}
          swiftFilename="Sources/RootView.swift"
        />
        <Callout tone="info">
          三个平台的标签文案（首页 / 节点 / 我的）与图标映射（house · globe · person）保持一致；不要在某一端改成「连接 / 线路 / 账户」。
        </Callout>
      </Section>
    </>
  );
}
