import { Tag, Button } from '@tpvpn/ui';
import { contrastGrade, contrastRatio, formatOklch, hexToRgb, INK, PAPER } from '@/lib/contrast';
import { groupTokens, token, tokensByPrefix } from '@/lib/tokens';
import { cn } from '@/lib/cn';
import {
  ButtonLink,
  Callout,
  CodeBlock,
  ColorRamp,
  ContrastBadge,
  CopyButton,
  DoDont,
  Grid,
  PageHeader,
  Pill,
  Section,
  StatCard,
  SubSection,
  TokenTable,
  type ColorRampStep,
} from '@/components/docs';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const BLUE = token('color.blue.500');
const BLUE_600 = token('color.blue.600');
const BLUE_700 = token('color.blue.700');
const BLUE_50 = token('color.blue.50');

const rampSteps = (name: string): ColorRampStep[] => tokensByPrefix(`color.${name}`).map((t) => ({ step: t.key, hex: String(t.value) }));

const BRAND_RAMPS: { name: string; label: string; use: string }[] = [
  { name: 'blue', label: 'blue · 品牌蓝', use: '唯一强调色：按钮、链接、聚焦环、连接中状态。' },
  { name: 'cyan', label: 'cyan', use: '数据 / 速度可视化、hero 渐变终点。' },
  { name: 'purple', label: 'purple', use: 'AI 场景标签、blue-purple 渐变。' },
  { name: 'mint', label: 'mint · 品牌绿', use: '游戏场景标签、green-cyan 渐变。' },
  { name: 'pink', label: 'pink', use: '图表第 6 序列；不用于状态或按钮。' },
];

const NEUTRAL_USE: Record<string, string> = {
  25: '页面底色（带一点蓝）',
  50: '次级底、表头',
  100: '弱化底、hover、骨架屏',
  200: '默认边框、分割线',
  300: '强边框、输入框描边',
  400: '占位符、禁用、装饰——不可作正文',
  500: '弱化文字（AA 下限 4.76:1）',
  600: '次级文字',
  700: '强调次级',
  800: '深底',
  900: '正文、标题',
  950: '最深',
};

const STATUS_META: Record<string, { title: string; en: string; sample: string; ramp: string }> = {
  success: { title: '成功', en: 'Success', sample: '已连接', ramp: 'green' },
  warning: { title: '警告', en: 'Warning', sample: '流量即将用尽', ramp: 'amber' },
  error: { title: '错误', en: 'Error', sample: '连接失败，请重试', ramp: 'red' },
  info: { title: '信息', en: 'Info', sample: '正在切换节点', ramp: 'blue（品牌蓝）' },
};
const STATUS_ORDER = ['success', 'warning', 'error', 'info'] as const;

const GRADIENT_USE: Record<string, string> = {
  primary: '主按钮高光、OG 分享图',
  'blue-light': '轻量装饰面',
  'cyan-blue': '数据 / 速度',
  'blue-purple': 'AI 场景',
  'green-cyan': '游戏 / 成功',
  hero: '官网首屏',
  connected: '已连接按钮（径向）',
  'canvas-glow': '站点 hero 背景微光',
};

const USAGE_CSS = `/* CSS / Tailwind */
.cta { background: var(--tp-color-action-primary-bg); }   /* #046BEF，白字 4.82:1 */
<button class="bg-action-primary-bg text-action-primary-fg">连接</button>
<a class="text-fg-link hover:text-fg-link-hover">查看套餐</a>`;

const USAGE_NATIVE = `// Flutter
Container(color: TpTokens.colorActionPrimaryBg);      // Color(0xFF046BEF)
Icon(Icons.shield, color: TpTokens.colorBlue500);     // 图标可用 #1677FF

// iOS
view.backgroundColor = TPTokens.colorActionPrimaryBg
label.textColor = TPTokens.colorFgPrimary`;

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function ValueChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-bg-surface px-4 py-3 shadow-level-1">
      <div className="min-w-0">
        <p className="text-xs text-fg-muted">{label}</p>
        <p className="mt-0.5 truncate font-mono text-[13px] text-fg-primary tnum">{value}</p>
      </div>
      <CopyButton text={value} size="sm" label="复制" />
    </div>
  );
}

function StatusCard({ id }: { id: (typeof STATUS_ORDER)[number] }) {
  const meta = STATUS_META[id]!;
  const g = Object.fromEntries(groupTokens('color.status')[id]!.map((t) => [t.key.split('.').pop()!, String(t.value)])) as Record<
    'solid' | 'fg' | 'bg' | 'border',
    string
  >;
  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1">
      <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium" style={{ background: g.bg, color: g.fg, borderBottom: `1px solid ${g.border}` }}>
        <span className="size-2.5 rounded-full" style={{ background: g.solid }} aria-hidden />
        {meta.sample}
      </div>
      <div className="space-y-3 p-4">
        <p className="font-semibold text-fg-primary">
          {meta.title} <span className="font-medium text-fg-muted">{meta.en}</span>
          <span className="ml-2 text-xs font-normal text-fg-muted">{meta.ramp}</span>
        </p>
        <dl className="grid grid-cols-3 gap-2 text-xs">
          {(['solid', 'fg', 'bg'] as const).map((k) => (
            <div key={k} className="rounded-sm border border-border-subtle p-2">
              <dt className="flex items-center gap-1.5 text-fg-muted">
                <span className="size-3 rounded-xs ring-hairline" style={{ background: g[k] }} aria-hidden />
                {k}
              </dt>
              <dd className="mt-1 font-mono text-[11px] text-fg-primary uppercase">{g[k]}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-1.5">
          <ContrastBadge fg={g.fg} bg={g.bg} label="fg 在 bg 上" />
          <ContrastBadge fg={PAPER} bg={g.solid} label="白字在 solid 上" />
          <ContrastBadge fg={g.fg} bg={PAPER} label="fg 在白底上" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ColorPage() {
  const rgb = hexToRgb(BLUE);
  const gradients = tokensByPrefix('gradient');
  const slate = rampSteps('slate');
  const whiteOnBlue = contrastRatio(PAPER, BLUE);
  const whiteOnBlue600 = contrastRatio(PAPER, BLUE_600);
  const blue600OnWhite = contrastRatio(BLUE_600, PAPER);
  const inkOnWhite = contrastRatio(INK, PAPER);

  return (
    <>
      <PageHeader
        eyebrow="品牌 · Brand"
        title="品牌色彩"
        en="Color"
        description="一个蓝，其余都是中性色。TP Blue 是唯一强调色；cyan、purple、mint、pink 只出现在场景标签、图表与渐变里。全部色阶由 OKLCH 等步生成并经对比度核验——这里的 hex 是定稿值，不要重新生成。"
        actions={
          <ButtonLink to="/foundations/color" variant="outline" size="md">
            语义 Token 表 →
          </ButtonLink>
        }
      />

      {/* ------------------------------------------------------------ */}
      <Section id="tp-blue" title="TP Blue" en="Brand Blue" description="品牌锚点。白字在它上面只有 4.10:1，所以它负责大字、图标、描边、聚焦环与装饰面；白字按钮的填充要用 blue-600。">
        <div className="overflow-hidden rounded-xl border border-border-default shadow-level-2">
          <div className="flex min-h-56 flex-col justify-between p-8 text-white" style={{ background: BLUE }}>
            <p className="text-display-md">TP Blue</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="font-mono text-title-lg uppercase tnum">{BLUE}</p>
              <p className="text-title-md font-bold">blue-500 · color.blue.500</p>
            </div>
          </div>
          <div className="grid gap-3 bg-bg-surface p-4 sm:grid-cols-3">
            <ValueChip label="HEX" value={BLUE} />
            <ValueChip label="OKLCH" value={formatOklch(BLUE)} />
            <ValueChip label="RGB" value={`rgb(${rgb.r} ${rgb.g} ${rgb.b})`} />
          </div>
        </div>
        <Grid cols={4} gap="md" className="mt-6">
          <StatCard label="白字 · blue-500" value={`${whiteOnBlue.toFixed(2)}:1`} hint={`${contrastGrade(whiteOnBlue)} · 仅大字 / 图标`} />
          <StatCard label="白字 · blue-600" value={`${whiteOnBlue600.toFixed(2)}:1`} hint={`${contrastGrade(whiteOnBlue600)} · 按钮填充`} />
          <StatCard label="blue-600 · 白底" value={`${blue600OnWhite.toFixed(2)}:1`} hint={`${contrastGrade(blue600OnWhite)} · 链接文字`} />
          <StatCard label="slate-900 · 白底" value={`${inkOnWhite.toFixed(2)}:1`} hint={`${contrastGrade(inkOnWhite)} · 正文`} />
        </Grid>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="palettes" title="五条色带" en="Palettes" description="每条 11 阶（50–950），500 为基准。悬停查看 hex 与白字对比度，点击复制。">
        <div className="space-y-8">
          {BRAND_RAMPS.map((r) => (
            <div key={r.name}>
              <ColorRamp name={r.name} label={r.label} steps={rampSteps(r.name)} base={500} />
              <p className="mt-2 text-sm text-fg-secondary">{r.use}</p>
            </div>
          ))}
        </div>
        <Callout tone="info" title="Token 路径">
          <code>color.blue.500</code> → CSS <code>--tp-color-blue-500</code> → Tailwind <code>bg-blue-500</code> / <code>text-blue-500</code> → Dart <code>TpTokens.colorBlue500</code>。业务代码优先引用语义 token（<code>color.action.*</code>、<code>color.bg.brand</code>），不直接写原始色阶。
        </Callout>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="neutrals" title="中性色" en="Neutrals" description="Tailwind slate 12 阶，另加 25 阶 #FAFBFF 作为页面底色。文字层级只用 900 / 600 / 500，400 只做占位与装饰。">
        <ColorRamp name="slate" label="slate · 中性" steps={slate} base={900} />
        <TokenTable
          caption="中性色用途"
          rows={[
            ...slate.map((s) => ({
              name: `color.slate.${s.step}`,
              value: s.hex,
              preview: 'color' as const,
              description: NEUTRAL_USE[String(s.step)] ?? '',
            })),
            { name: 'color.white', value: token('color.white'), preview: 'color' as const, description: '卡片、按钮文字' },
            { name: 'color.black', value: token('color.black'), preview: 'color' as const, description: '单色 Logo' },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="status" title="状态色" en="Status" description="success / warning / error 对应 green / amber / red，info 复用品牌蓝。solid 用于图标与状态点，fg 用于文字，bg 用于浅底容器。">
        <Grid cols={2} gap="md">
          {STATUS_ORDER.map((id) => (
            <StatusCard key={id} id={id} />
          ))}
        </Grid>
        <SubSection title="连接状态" en="Connection states" description="全产品唯一来源：按钮、状态点、横幅与节点状态都从 color.state.* 取值。">
          <div className="flex flex-wrap gap-2">
            {(['connected', 'connecting', 'disconnected', 'error'] as const).map((s) => (
              <span key={s} className="inline-flex items-center gap-2 rounded-md border border-border-default bg-bg-surface px-3 py-2 text-sm shadow-level-1">
                <span className={cn('size-2.5 rounded-full', s === 'connecting' && 'animate-pulse')} style={{ background: token(`color.state.${s}`) }} aria-hidden />
                <span className="font-mono text-[13px] text-fg-primary">state.{s}</span>
                <span className="font-mono text-xs text-fg-muted uppercase">{token(`color.state.${s}`)}</span>
              </span>
            ))}
          </div>
        </SubSection>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="gradients" title="渐变板" en="Gradients" description="七条 135° 线性渐变加一条径向；只允许这几条。彩虹与多色渐变、玻璃拟态都不在此列。">
        <Grid cols={2} gap="md">
          {gradients.map((g) => {
            const css = String(g.value);
            return (
              <figure key={g.path} className="overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1">
                <div className={cn('h-28', g.key === 'canvas-glow' && 'bg-bg-canvas')} style={{ backgroundImage: css }} aria-hidden />
                <figcaption className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[13px] text-fg-primary">gradient.{g.key}</p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-fg-muted" title={css}>
                      {css}
                    </p>
                    <p className="mt-1.5 text-sm text-fg-secondary">{GRADIENT_USE[g.key] ?? ''}</p>
                  </div>
                  <CopyButton text={css} size="sm" label="CSS" />
                </figcaption>
              </figure>
            );
          })}
        </Grid>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="ratio" title="用色比例" en="70 · 20 · 10" description="一个屏幕里，七成是底与留白，两成是文字、边框与图标，一成是强调与状态。蓝色面积超过 10% 就该问：哪些可以退回中性色？">
        <div className="overflow-hidden rounded-xl border border-border-default shadow-level-1" role="img" aria-label="用色比例：70% 底与留白，20% 文字与边框，10% 强调色">
          <div className="flex h-24">
            <div className="flex w-[70%] items-end justify-start bg-bg-canvas p-3">
              <span className="text-numeric-md text-fg-primary tnum">70%</span>
            </div>
            <div className="flex w-[20%] items-end justify-start bg-slate-700 p-3">
              <span className="text-numeric-md text-white tnum">20%</span>
            </div>
            <div className="flex w-[10%] items-end justify-start bg-blue-600 p-3">
              <span className="text-numeric-md text-white tnum">10</span>
            </div>
          </div>
        </div>
        <Grid cols={3} gap="md" className="mt-4">
          <div className="rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1">
            <p className="font-semibold text-fg-primary">70% · 底与留白</p>
            <p className="mt-1 text-sm leading-6 text-fg-secondary">#FAFBFF 页面底、白色卡片、slate-50 / 100 弱化底。留白本身就是设计。</p>
          </div>
          <div className="rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1">
            <p className="font-semibold text-fg-primary">20% · 文字、边框、图标</p>
            <p className="mt-1 text-sm leading-6 text-fg-secondary">slate-900 / 600 / 500 三级文字，slate-200 / 300 边框，功能图标用 fg-secondary。</p>
          </div>
          <div className="rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1">
            <p className="font-semibold text-fg-primary">10% · 强调与状态</p>
            <p className="mt-1 text-sm leading-6 text-fg-secondary">主按钮、链接、选中态用 blue-600 / 500；状态色与场景色只落在标签、状态点与图表上。</p>
          </div>
        </Grid>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="dont" title="配色禁忌" en="Don'ts" description="四条最常见的错误，每条都有可直接替换的做法。">
        <DoDont
          do={
            <div className="flex flex-col items-center gap-3">
              <Button size="md">连接</Button>
              <a href="#dont" className="text-sm text-fg-link underline underline-offset-2">
                查看套餐
              </a>
            </div>
          }
          dont={
            <div className="flex flex-col items-center gap-3">
              <span className="inline-flex h-11 items-center rounded-md px-5 text-label-md text-white" style={{ background: BLUE }}>
                连接
              </span>
              <span className="text-sm" style={{ color: BLUE }}>
                查看套餐
              </span>
            </div>
          }
          doCaption={
            <>
              白字按钮填充 blue-600（{whiteOnBlue600.toFixed(2)}:1），链接用 blue-600（{blue600OnWhite.toFixed(2)}:1）。
            </>
          }
          dontCaption={
            <>
              #1677FF 配白字只有 {whiteOnBlue.toFixed(2)}:1，正文大小的蓝字同样不达标；blue-500 只用于大字、图标、描边与聚焦环。
            </>
          }
          previewClassName="bg-bg-surface"
        />
        <DoDont
          do={
            <div className="flex w-full max-w-64 flex-col gap-2 rounded-lg border border-border-default bg-bg-surface p-3 shadow-level-1">
              <div className="h-2 w-2/3 rounded-full bg-slate-900" />
              <div className="h-2 w-1/2 rounded-full bg-slate-300" />
              <div className="mt-2 flex gap-2">
                <span className="h-7 flex-1 rounded-sm bg-blue-600" />
                <span className="h-7 flex-1 rounded-sm border border-border-default" />
              </div>
            </div>
          }
          dont={
            <div className="flex w-full max-w-64 flex-col gap-2 rounded-lg border border-border-default bg-bg-surface p-3 shadow-level-1">
              <div className="h-2 w-2/3 rounded-full bg-purple-500" />
              <div className="h-2 w-1/2 rounded-full bg-cyan-400" />
              <div className="mt-2 flex gap-2">
                <span className="h-7 flex-1 rounded-sm bg-pink-500" />
                <span className="h-7 flex-1 rounded-sm bg-mint-500" />
              </div>
            </div>
          }
          doCaption="一屏一个强调色：蓝色引导视线，其余退回中性色。"
          dontCaption="不要在一个界面里混用多种强调色——cyan / purple / mint / pink 不是第二主色。"
        />
        <DoDont
          do={
            <div className="flex flex-wrap justify-center gap-2">
              <Tag tone="auto">自动最优</Tag>
              <Tag tone="game">游戏</Tag>
              <Tag tone="ai">AI</Tag>
              <Tag tone="exchange">交易所</Tag>
            </div>
          }
          dont={
            <div className="flex w-full max-w-64 flex-col gap-2">
              <span className="inline-flex h-11 items-center justify-center rounded-md bg-purple-500 text-label-md text-white">AI 专线</span>
              <span className="inline-flex h-11 items-center justify-center rounded-md bg-mint-500 text-label-md text-white">游戏专线</span>
            </div>
          }
          doCaption="场景色只出现在标签（50 底 + 700 字）、状态点与图表序列里。"
          dontCaption="不要把场景色铺成按钮或区块底色——它们会抢走品牌蓝的位置，白字对比度也不够。"
        />
        <DoDont
          do={
            <div className="w-full max-w-64 rounded-lg p-4 text-sm" style={{ background: BLUE_50, color: BLUE_700 }}>
              浅蓝底上的说明文字与链接用 blue-700。
              <div className="mt-2">
                <ContrastBadge fg={BLUE_700} bg={BLUE_50} label="blue-700 在 blue-50 上" />
              </div>
            </div>
          }
          dont={
            <div className="w-full max-w-64 rounded-lg p-4 text-sm" style={{ background: BLUE_50, color: BLUE_600 }}>
              浅蓝底上的说明文字与链接用 blue-600。
              <div className="mt-2">
                <ContrastBadge fg={BLUE_600} bg={BLUE_50} label="blue-600 在 blue-50 上" />
              </div>
            </div>
          }
          doCaption="brand-soft 浅蓝底（blue-50）上的文字与链接取 blue-700。"
          dontCaption={`blue-600 在 blue-50 上只有 ${contrastRatio(BLUE_600, BLUE_50).toFixed(2)}:1，差一点就是不达标。`}
        />
        <Callout tone="warning" title="场景色 game 的例外">
          浅底深字组合的文字一律取 700 阶，唯独 <code>scene.game</code> 取 <strong>mint-800 {token('color.mint.800')}</strong>：mint-700 在 mint-50 上只有{' '}
          {contrastRatio(token('color.mint.700'), token('color.mint.50')).toFixed(2)}:1，不满足 AA；mint-800 为{' '}
          {contrastRatio(token('color.mint.800'), token('color.mint.50')).toFixed(2)}:1。同理，凹陷面（slate-100）上的次要文字用 fg.secondary（slate-600），slate-500 在 slate-100 上只有{' '}
          {contrastRatio(token('color.slate.500'), token('color.slate.100')).toFixed(2)}:1。
        </Callout>
        <div className="flex flex-wrap gap-2">
          <Pill tone="error" size="sm">
            禁止
          </Pill>
          <span className="text-sm text-fg-secondary">纯黑阴影 rgb(0 0 0 / α)（改用蓝灰环境光 rgb(15 23 42 / α)） · 自行生成新色阶 · 连接状态用 state.* 之外的颜色 · 玻璃拟态与彩虹渐变</span>
        </div>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="usage" title="代码用法" en="Usage" description="所有平台从同一份 token 取值；命名规则 color.action.primary.bg → --tp-color-action-primary-bg → bg-action-primary-bg → TpTokens.colorActionPrimaryBg。">
        <Grid cols={2} gap="md">
          <CodeBlock code={USAGE_CSS} lang="html" filename="web" />
          <CodeBlock code={USAGE_NATIVE} lang="dart" filename="Flutter / iOS 对应" />
        </Grid>
      </Section>
    </>
  );
}
