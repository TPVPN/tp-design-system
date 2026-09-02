import { useState } from 'react';
import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Download,
  Gift,
  Globe,
  Info,
  Key,
  Lock,
  MapPin,
  Power,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Ticket,
  TriangleAlert,
  User,
  Wifi,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Tag, sceneIcon, sceneLabel, type SceneTone } from '@tpvpn/ui';
import { Callout, CodeBlock, DocTable, DoDont, Grid, PageHeader, Preview, Prose, Section, SubSection } from '@/components/docs';
import { brandUrl } from '@/lib/assets';
import { cn } from '@/lib/cn';
import { copyText } from '@/lib/copy';
import { token, tokensByPrefix } from '@/lib/tokens';
import { FLAGS, FlagGrid } from './_parts/FlagGrid';
import { px } from './_parts/naming';
import { PlatformSnippets } from './_parts/PlatformSnippets';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const STROKE_DEFAULT = 1.75;
const STROKE_SMALL = 2;
const strokeFor = (size: number) => (size <= 16 ? STROKE_SMALL : STROKE_DEFAULT);

const SCENES: { tone: SceneTone; lucide: string; react: string; color: string; note: string }[] = [
  { tone: 'auto', lucide: 'shield-check', react: 'ShieldCheck', color: 'blue', note: '默认线路，自动最优' },
  { tone: 'game', lucide: 'gamepad-2', react: 'Gamepad2', color: 'mint', note: '低延迟游戏线路' },
  { tone: 'ai', lucide: 'sparkles', react: 'Sparkles', color: 'purple', note: 'AI 服务专线' },
  { tone: 'exchange', lucide: 'arrow-left-right', react: 'ArrowLeftRight', color: 'amber', note: '交易所专线（备选 candlestick-chart）' },
];

const COMMON: { icon: LucideIcon; react: string; lucide: string; use: string }[] = [
  { icon: Power, react: 'Power', lucide: 'power', use: '连接 / 电源' },
  { icon: Globe, react: 'Globe', lucide: 'globe', use: '节点 Tab、自动线路' },
  { icon: Shield, react: 'Shield', lucide: 'shield', use: '保护、隐私' },
  { icon: ShieldCheck, react: 'ShieldCheck', lucide: 'shield-check', use: '自动最优、已保护' },
  { icon: Zap, react: 'Zap', lucide: 'zap', use: '速度、IEPL 优选' },
  { icon: Wifi, react: 'Wifi', lucide: 'wifi', use: '网络状态' },
  { icon: Server, react: 'Server', lucide: 'server', use: '服务器、节点' },
  { icon: MapPin, react: 'MapPin', lucide: 'map-pin', use: '固定出口 IP、位置' },
  { icon: Search, react: 'Search', lucide: 'search', use: '搜索' },
  { icon: Settings, react: 'Settings', lucide: 'settings', use: '设置' },
  { icon: User, react: 'User', lucide: 'user', use: '我的 Tab、账号' },
  { icon: CreditCard, react: 'CreditCard', lucide: 'credit-card', use: '支付、套餐' },
  { icon: Gift, react: 'Gift', lucide: 'gift', use: '邀请奖励' },
  { icon: Ticket, react: 'Ticket', lucide: 'ticket', use: '兑换码' },
  { icon: Bell, react: 'Bell', lucide: 'bell', use: '通知' },
  { icon: Lock, react: 'Lock', lucide: 'lock', use: '加密、锁定' },
  { icon: Key, react: 'Key', lucide: 'key', use: '密钥、WireGuard' },
  { icon: RefreshCw, react: 'RefreshCw', lucide: 'refresh-cw', use: '刷新、重新测速' },
  { icon: ChevronRight, react: 'ChevronRight', lucide: 'chevron-right', use: '进入、列表 chevron' },
  { icon: Check, react: 'Check', lucide: 'check', use: '成功、已选' },
  { icon: X, react: 'X', lucide: 'x', use: '关闭、清除' },
  { icon: TriangleAlert, react: 'TriangleAlert', lucide: 'triangle-alert', use: '警告' },
  { icon: Info, react: 'Info', lucide: 'info', use: '信息' },
  { icon: Download, react: 'Download', lucide: 'download', use: '下载' },
];

const LUCIDE_SNIPPETS = [
  {
    id: 'tsx',
    label: 'React',
    lang: 'tsx',
    code: `import { ShieldCheck } from 'lucide-react';\n\n// 装饰性图标：aria-hidden；独立可点击图标必须有 aria-label\n<ShieldCheck size={24} strokeWidth={1.75} className="text-fg-secondary" aria-hidden />\n<ShieldCheck size={16} strokeWidth={2} className="text-fg-brand" aria-hidden />`,
  },
  {
    id: 'dart',
    label: 'Dart',
    lang: 'dart',
    code: `import 'package:lucide_icons/lucide_icons.dart';\n\nIcon(LucideIcons.shieldCheck, size: TpTokens.sizeIconMd, color: TpTokens.colorFgSecondary);`,
  },
  {
    id: 'swift',
    label: 'Swift',
    lang: 'swift',
    code: `// Lucide 提供 SF Symbols 替代包；或把 SVG 作为模板图片导入 Asset Catalog\nlet icon = UIImage(named: "shield-check")?.withRenderingMode(.alwaysTemplate)\nimageView.image = icon\nimageView.tintColor = TPTokens.colorFgSecondary`,
  },
];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function GridSpecimen() {
  const cell = 4;
  const size = 24 * cell;
  return (
    <figure className="m-0 flex flex-col items-center gap-3">
      <div className="relative rounded-md border border-border-default bg-bg-surface" style={{ width: size, height: size }} role="img" aria-label="24px 网格上的 shield-check 图标，描边 1.75">
        <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 size-full text-blue-500" aria-hidden>
          {Array.from({ length: 25 }, (_, i) => (
            <line key={`v${i}`} x1={i * cell} y1="0" x2={i * cell} y2={size} stroke="currentColor" strokeOpacity={i % 12 === 0 ? 0.35 : 0.12} />
          ))}
          {Array.from({ length: 25 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * cell} x2={size} y2={i * cell} stroke="currentColor" strokeOpacity={i % 12 === 0 ? 0.35 : 0.12} />
          ))}
          <rect x={2 * cell} y={2 * cell} width={20 * cell} height={20 * cell} fill="none" stroke="currentColor" strokeOpacity="0.5" strokeDasharray="4 3" />
        </svg>
        <ShieldCheck size={size} strokeWidth={STROKE_DEFAULT} className="relative text-fg-primary" aria-hidden />
      </div>
      <figcaption className="text-center text-[12px] leading-4 text-fg-muted">
        24 × 24 网格 · 2px 安全边距（虚线）· 描边 {STROKE_DEFAULT} · 圆头圆角
      </figcaption>
    </figure>
  );
}

function SizeLadder() {
  const sizes = tokensByPrefix('size.icon');
  const icons: [LucideIcon, string][] = [
    [ShieldCheck, 'shield-check'],
    [Globe, 'globe'],
    [Power, 'power'],
  ];
  return (
    <Preview background="canvas" centered={false} label="图标尺寸阶梯">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-fg-muted">
              <th className="pb-3 font-medium">Token</th>
              {sizes.map((s) => (
                <th key={s.path} className="pb-3 text-center font-medium">
                  <span className="font-mono text-fg-primary tnum">{String(s.value)}</span>
                  <span className="block font-mono text-[11px] text-fg-muted">
                    {s.key} · stroke {strokeFor(px(String(s.value)))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {icons.map(([Icon, name]) => (
              <tr key={name} className="border-t border-border-subtle">
                <td className="py-3 font-mono text-[12px] text-fg-secondary">{name}</td>
                {sizes.map((s) => {
                  const n = px(String(s.value));
                  return (
                    <td key={s.path} className="py-3 text-center">
                      <span className="inline-flex h-12 items-center justify-center text-fg-secondary">
                        <Icon size={n} strokeWidth={strokeFor(n)} aria-hidden />
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Preview>
  );
}

function CommonIcons() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (name: string) => {
    if (await copyText(name)) {
      setCopied(name);
      window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1500);
    }
  };
  return (
    <ul className="my-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {COMMON.map(({ icon: Icon, react, lucide, use }) => {
        const isCopied = copied === react;
        return (
          <li key={react}>
            <button
              type="button"
              onClick={() => void copy(react)}
              aria-label={`${use}：${lucide}，点击复制 React 组件名 ${react}`}
              className={cn(
                'flex w-full flex-col items-center gap-2 rounded-lg border border-border-default bg-bg-surface px-2 py-4 text-center shadow-level-1 transition-[box-shadow,border-color] duration-(--duration-base) ease-standard outline-none hover:border-border-strong hover:shadow-level-2 focus-visible:shadow-focus',
                isCopied && 'border-status-success-border',
              )}
            >
              <span className="flex size-10 items-center justify-center rounded-md bg-bg-canvas text-fg-secondary">
                <Icon size={24} strokeWidth={STROKE_DEFAULT} aria-hidden />
              </span>
              <span className="w-full">
                <span className={cn('block truncate font-mono text-[12px]', isCopied ? 'text-status-success-fg' : 'text-fg-primary')}>{isCopied ? 'Copied' : lucide}</span>
                <span className="block truncate text-[12px] text-fg-muted">{use}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function IconographyPage() {
  const flagSizes = tokensByPrefix('size.flag')
    .map((s) => String(s.value))
    .join(' / ');

  return (
    <>
      <PageHeader
        eyebrow="基础 · Foundations"
        title="图标与国旗"
        en="Iconography"
        description={`功能图标只用 Lucide（ISC）：24px 网格、描边 1.75（16px 时 2）、圆头圆角、单色。国旗用 circle-flags 圆形 SVG（MIT，${FLAGS.length} 面），尺寸 ${flagSizes}，外加 1px 内描边。`}
      />

      <Section id="lucide" title="Lucide 用法" en="Lucide" description="不混用其他图标库；找不到的图标先用 Lucide 近似，再提设计需求。">
        <Preview background="surface" label="24px 网格规范" className="gap-12">
          <GridSpecimen />
          <div className="max-w-xs text-sm leading-6 text-fg-secondary">
            <DocTable
              className="my-0 shadow-none"
              caption="Lucide 属性"
              head={
                <>
                  <th>属性</th>
                  <th>值</th>
                </>
              }
            >
              {[
                ['网格', '24 × 24'],
                ['描边', `${STROKE_DEFAULT}（16px 时 ${STROKE_SMALL}）`],
                ['线帽 / 拐角', 'round / round'],
                ['填充', 'none（除非组件明确要求实心）'],
                ['与文字间距', `${token('space.2')}；按钮内 ${token('space.1-5')}`],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="text-fg-primary">{k}</td>
                  <td className="font-mono text-[12px] text-fg-secondary">{v}</td>
                </tr>
              ))}
            </DocTable>
          </div>
        </Preview>
        <PlatformSnippets snippets={LUCIDE_SNIPPETS} />
      </Section>

      <Section id="sizes" title="尺寸阶梯" en="Size Ladder" description="size.icon.* 五档：16 / 20 / 24 / 32 / 48。描边宽度不随尺寸缩放，16px 用 2 保证笔画清晰。">
        <SizeLadder />
      </Section>

      <Section id="color" title="颜色规则" en="Colour" description="功能图标单色 fg.secondary；选中 / 强调 blue-600；禁用 fg.placeholder；状态图标用 status.*.solid。不加渐变、投影或双色。">
        <Preview background="surface" label="图标颜色" className="gap-8">
          {[
            ['fg.secondary', 'text-fg-secondary', '默认功能图标'],
            ['blue-600', 'text-blue-600', '选中 / 强调'],
            ['fg.placeholder', 'text-fg-placeholder', '禁用'],
            ['status.success.solid', 'text-status-success-solid', '成功状态'],
            ['status.error.solid', 'text-status-error-solid', '错误状态'],
          ].map(([name, cls, use]) => (
            <figure key={name} className="m-0 flex flex-col items-center gap-2">
              <span className={cn('flex size-12 items-center justify-center rounded-md bg-bg-canvas', cls)}>
                <ShieldCheck size={24} strokeWidth={STROKE_DEFAULT} aria-hidden />
              </span>
              <figcaption className="text-center">
                <span className="block font-mono text-[12px] text-fg-primary">{name}</span>
                <span className="block text-[12px] text-fg-muted">{use}</span>
              </figcaption>
            </figure>
          ))}
        </Preview>
        <DoDont
          do={
            <span className="flex items-center gap-2 text-fg-secondary">
              <Globe size={24} strokeWidth={STROKE_DEFAULT} aria-hidden />
              <span className="text-body text-fg-primary">节点</span>
            </span>
          }
          dont={
            <span className="flex items-center gap-2">
              <Globe size={24} strokeWidth={STROKE_DEFAULT} className="text-blue-500 drop-shadow-[0_2px_4px_rgba(22,119,255,0.5)]" aria-hidden />
              <span className="text-body text-fg-primary">节点</span>
            </span>
          }
          doCaption="单色 fg.secondary，与文字垂直居中，间距 space.2。"
          dontCaption="加投影 / 渐变 / 双色：图标从功能元素变成装饰，破坏一致性。"
        />
      </Section>

      <Section id="scene" title="场景图标映射" en="Scene Icons" description="四个线路场景各有固定图标与色带，Tag 组件按 tone 自动带出。">
        <DocTable
          caption="场景图标映射"
          head={
            <>
              <th>场景</th>
              <th>Tag</th>
              <th>Lucide</th>
              <th>React</th>
              <th>色带</th>
              <th>说明</th>
            </>
          }
        >
          {SCENES.map((s) => {
            const Icon = sceneIcon[s.tone];
            return (
              <tr key={s.tone} className="transition-colors hover:bg-bg-surface-hover">
                <td>
                  <span className="inline-flex items-center gap-2 text-fg-primary">
                    <Icon size={20} strokeWidth={STROKE_DEFAULT} className="text-fg-secondary" aria-hidden />
                    {sceneLabel[s.tone]}
                    <code className="font-mono text-[12px] text-fg-muted">{s.tone}</code>
                  </span>
                </td>
                <td>
                  <Tag tone={s.tone} size="md">
                    {sceneLabel[s.tone]}
                  </Tag>
                </td>
                <td className="font-mono text-[12px] text-fg-secondary">{s.lucide}</td>
                <td className="font-mono text-[12px] text-fg-secondary">{s.react}</td>
                <td className="font-mono text-[12px] text-fg-secondary">{s.color}</td>
                <td className="text-fg-secondary">{s.note}</td>
              </tr>
            );
          })}
        </DocTable>
        <CodeBlock
          lang="tsx"
          filename="scene-tag.tsx"
          code={`import { Tag, sceneIcon, sceneLabel } from '@tpvpn/ui';\n\n<Tag tone="game">游戏</Tag>                 // 自动带 Gamepad2 图标\n<Tag tone="ai" size="md">{sceneLabel.ai}</Tag>\n<Tag tone="exchange" icon={null}>交易所</Tag> // 去掉图标\n\nconst Icon = sceneIcon.auto;                // ShieldCheck`}
        />
      </Section>

      <Section id="common" title="常用图标集" en="Common Icons" description="VPN App 里高频出现的 24 个 Lucide 图标；点击复制 React 组件名。">
        <CommonIcons />
        <Prose>
          <p>
            其余映射：首页 Tab <code>house</code>、返回 <code>chevron-left</code>、延迟 <code>activity</code>、负载 <code>gauge</code>、复制 <code>copy</code>、外链 <code>arrow-up-right</code>、套餐 / 会员 <code>crown</code>、设备 <code>smartphone</code> / <code>monitor</code>、无日志 <code>eye-off</code>。信号强度用自绘 <code>SignalBars</code>，不用 Lucide。
          </p>
        </Prose>
      </Section>

      <Section id="flags" title="国旗" en="Flags" description={`circle-flags 圆形 SVG，ISO 3166-1 alpha-2 小写命名（us.svg、jp.svg、hk.svg）。尺寸 ${flagSizes}：24 列表密集、32 节点卡片、40 国家列表项；组件自带 1px rgb(15 23 42 / 0.08) 内描边。`}>
        <FlagGrid />
        <SubSection title="用法" en="Usage">
          <CodeBlock
            lang="tsx"
            filename="flag.tsx"
            code={`import { Flag, FlagProvider } from '@tpvpn/ui';\n\n// 应用入口：告诉组件圆旗 SVG 的基础路径（站点为 BASE_URL + 'brand/flags/'）\n<FlagProvider baseUrl={\`\${import.meta.env.BASE_URL}brand/flags/\`}>\n  <App />\n</FlagProvider>\n\n// 列表项 40 · 节点卡片 32 · 密集列表 24；name 作为 alt，按当前语言传入\n<Flag code="hk" name="中国香港" size={40} />\n<Flag code="jp" name="日本" size={32} />\n<Flag code="us" name="美国" size={24} />`}
          />
        </SubSection>
        <Callout tone="warning" title="国旗禁忌">
          <ul className="list-disc space-y-1 pl-5">
            <li>不把国旗矩形化，不加圆角矩形背景；不去掉内描边（白色国旗会与白底融合）。</li>
            <li>
              「自动」线路没有国旗，用 <code>globe</code> 图标置于 <code>bg.brand-soft</code> 圆内。
            </li>
            <li>
              圆旗必须带 <code>alt</code> 为国家名（按当前语言）；同一行重复出现的装饰国旗 <code>alt=""</code>。
            </li>
            <li>不用国旗代替语言切换，语言用文字。</li>
          </ul>
        </Callout>
        <Grid cols={3} gap="md" className="my-6">
          {(['zh-CN', 'en', 'hi'] as const).map((lang) => {
            const names = { 'zh-CN': '新加坡', en: 'Singapore', hi: 'सिंगापुर' } as const;
            return (
              <div key={lang} className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1">
                <img src={brandUrl.flag('sg')} alt={names[lang]} width={40} height={40} className="size-10 rounded-full shadow-inset-hairline" lang={lang} />
                <span>
                  <span className="block text-sm font-medium text-fg-primary" lang={lang}>
                    {names[lang]}
                  </span>
                  <span className="block font-mono text-[12px] text-fg-muted">alt · {lang}</span>
                </span>
              </div>
            );
          })}
        </Grid>
      </Section>
    </>
  );
}
