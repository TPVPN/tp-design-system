import { ShieldCheck, User } from 'lucide-react';
import { Flag } from '@tpvpn/ui';
import { Callout, DocTable, Grid, PageHeader, Preview, Prose, Section, SubSection, TokenTable } from '@/components/docs';
import { cn } from '@/lib/cn';
import { brandUrl } from '@/lib/assets';
import { token, tokensByPrefix } from '@/lib/tokens';
import { CopyName } from './_parts/CopyName';
import { GridOverlayDemo } from './_parts/GridOverlayDemo';
import { px } from './_parts/naming';
import { PlatformSnippets } from './_parts/PlatformSnippets';

/* ------------------------------------------------------------------ */
/* Spacing ruler                                                       */
/* ------------------------------------------------------------------ */

const SPACE_USAGE: Record<string, string> = {
  '0': '无间距',
  '0-5': '图标与文字微调',
  '1': '数字与单位、紧密行内',
  '1-5': 'Tag 内边距（横，sm）',
  '2': '行内元素间距、Tag 内边距（横，md）',
  '3': '列表项内部、节点卡片内元素间距、按钮 sm 横向',
  '4': 'App 页面边距、卡片内边距、输入框横向内边距',
  '5': '按钮 md 横向',
  '6': '卡片间距、平板边距、按钮 lg 横向',
  '8': '区块间距、桌面边距',
  '10': '官网区块内间距',
  '12': '官网区块内间距',
  '16': '官网区块间距',
  '20': '官网大区块',
  '24': '官网大区块',
  '32': '官网首屏上下',
};

const SPACES = tokensByPrefix('space')
  .map((t) => ({ ...t, n: px(String(t.value)), tw: t.key.replace('-', '.') }))
  .sort((a, b) => a.n - b.n);

function SpacingRuler() {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border-default bg-bg-surface" tabIndex={0} role="region" aria-label="间距标尺，可横向滚动">
      <div className="min-w-[320px]">
      <div className="grid grid-cols-[6.5rem_3rem_1fr] items-center gap-3 border-b border-border-default bg-bg-canvas px-4 py-2.5 text-xs text-fg-muted sm:grid-cols-[7.5rem_3.5rem_5rem_9rem_1fr]">
        <span>Token</span>
        <span>px</span>
        <span className="hidden sm:block">Tailwind</span>
        <span>标尺</span>
        <span className="hidden sm:block">典型用途</span>
      </div>
      <ul>
        {SPACES.map((s) => (
          <li
            key={s.path}
            className="grid grid-cols-[6.5rem_3rem_1fr] items-center gap-3 border-b border-border-subtle px-4 py-2.5 text-sm transition-colors last:border-b-0 hover:bg-bg-surface-hover sm:grid-cols-[7.5rem_3.5rem_5rem_9rem_1fr]"
          >
            <CopyName text={s.path} />
            <span className="font-mono text-[12px] text-fg-secondary tnum">{s.n}</span>
            <span className="hidden font-mono text-[12px] text-fg-muted sm:block">p-{s.tw}</span>
            <span className="flex h-4 items-center" aria-hidden>
              <span className="h-2.5 rounded-full bg-blue-500" style={{ width: Math.max(s.n, s.n === 0 ? 0 : 2) }} />
            </span>
            <span className="hidden text-[13px] text-fg-secondary sm:block">{SPACE_USAGE[s.key] ?? ''}</span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Radius                                                              */
/* ------------------------------------------------------------------ */

function RadiusSpecimens() {
  const radii = tokensByPrefix('radius');
  const ratio = token('logo.corner-ratio');
  return (
    <Grid cols={5} gap="md" className="my-6">
      {radii.map((r) => {
        const value = String(r.value);
        return (
          <div key={r.path} className="flex flex-col items-center rounded-lg border border-border-default bg-bg-canvas p-4 shadow-level-1">
            <div className="flex size-24 items-center justify-center border border-blue-200 bg-bg-brand-soft" style={{ borderRadius: value }} aria-hidden>
              <span className="font-mono text-[12px] text-fg-brand-strong tnum">{value}</span>
            </div>
            <CopyName text={r.path} label={r.key} className="mt-3" />
            <p className="mt-1 mb-0 text-center text-[12px] leading-4 text-fg-muted">{r.description ?? '—'}</p>
          </div>
        );
      })}
      <div className="flex flex-col items-center rounded-lg border border-border-default bg-bg-canvas p-4 shadow-level-1">
        <img src={brandUrl.logoSvg('mark')} width={96} height={96} alt="TP VPN 标识：圆角为边长的 24%" className="size-24" />
        <CopyName text="logo.corner-ratio" label={`logo · ${ratio}`} className="mt-3" />
        <p className="mt-1 mb-0 text-center text-[12px] leading-4 text-fg-muted">Logo 圆角比 {ratio}（66px → 15.84），与 radius token 无关</p>
      </div>
    </Grid>
  );
}

/* ------------------------------------------------------------------ */
/* Size ladders                                                        */
/* ------------------------------------------------------------------ */

function ControlLadder() {
  return (
    <Preview background="canvas" label="控件高度阶梯" className="items-end">
      {tokensByPrefix('size.control').map((s) => {
        const n = px(String(s.value));
        return (
          <div key={s.path} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'flex min-w-24 items-center justify-center rounded-md border px-4 text-label-md',
                s.key === 'md' ? 'border-blue-500 bg-action-primary-bg text-action-primary-fg' : 'border-blue-200 bg-bg-brand-soft text-fg-brand-strong',
              )}
              style={{ height: n }}
            >
              {n}
            </div>
            <CopyName text={s.path} label={s.key} />
          </div>
        );
      })}
    </Preview>
  );
}

function IconLadder() {
  return (
    <Preview background="canvas" label="图标尺寸阶梯" className="items-end gap-8">
      {tokensByPrefix('size.icon').map((s) => {
        const n = px(String(s.value));
        const stroke = n <= 16 ? 2 : 1.75;
        return (
          <div key={s.path} className="flex flex-col items-center gap-2">
            <div className="flex h-12 items-end text-fg-secondary">
              <ShieldCheck size={n} strokeWidth={stroke} aria-hidden />
            </div>
            <CopyName text={s.path} label={`${s.key} · ${n}`} />
            <span className="font-mono text-[11px] text-fg-muted">stroke {stroke}</span>
          </div>
        );
      })}
    </Preview>
  );
}

function AvatarLadder() {
  return (
    <Preview background="canvas" label="头像尺寸阶梯" className="items-end gap-6">
      {tokensByPrefix('size.avatar').map((s) => {
        const n = px(String(s.value));
        return (
          <div key={s.path} className="flex flex-col items-center gap-2">
            <span className="flex items-center justify-center rounded-full bg-bg-surface-sunken text-fg-muted ring-hairline" style={{ width: n, height: n }} aria-hidden>
              <User size={Math.round(n * 0.5)} strokeWidth={1.75} />
            </span>
            <CopyName text={s.path} label={`${s.key} · ${n}`} />
          </div>
        );
      })}
    </Preview>
  );
}

function FlagLadder() {
  return (
    <Preview background="canvas" label="国旗尺寸阶梯" className="items-end gap-8">
      {tokensByPrefix('size.flag').map((s) => {
        const n = px(String(s.value)) as 24 | 32 | 40;
        return (
          <div key={s.path} className="flex flex-col items-center gap-2">
            <Flag code="hk" name="中国香港" size={n} />
            <CopyName text={s.path} label={`${s.key} · ${n}`} />
          </div>
        );
      })}
    </Preview>
  );
}

/* ------------------------------------------------------------------ */
/* Breakpoints & containers                                            */
/* ------------------------------------------------------------------ */

const BP_TONES = ['bg-blue-500/10', 'bg-blue-500/15', 'bg-blue-500/20', 'bg-blue-500/25', 'bg-blue-500/30', 'bg-blue-500/35'];
const BP_NOTE: Record<string, string> = {
  xs: '最小支持宽度，无横向滚动',
  sm: '',
  md: '平板；单栏内容与抽屉导航',
  lg: '桌面；侧栏 216px + 内容',
  xl: '三栏：侧栏 216px / 内容 / 目录 208px',
  '2xl': '宽桌面；文章最大宽度 832px',
};
const CONTAINER_NOTE: Record<string, string> = { narrow: '长文、表单', content: '默认内容宽', wide: '站点三栏 / 宽表' };

function BreakpointBars() {
  const bps = tokensByPrefix('breakpoint');
  const containers = tokensByPrefix('container');
  const max = Math.max(...bps.map((b) => px(String(b.value))));
  return (
    <div className="my-6 rounded-lg border border-border-default bg-bg-surface p-5 shadow-level-1">
      <p className="mb-3 text-xs font-medium text-fg-muted">断点 breakpoint.*</p>
      <ul className="space-y-1.5">
        {bps.map((b, i) => {
          const n = px(String(b.value));
          return (
            <li key={b.path} className="grid grid-cols-[3.5rem_1fr] items-center gap-3">
              <CopyName text={b.path} label={b.key} />
              <div className="min-w-0">
                <div className={cn('flex h-7 items-center justify-between rounded-r-sm border-l-2 border-blue-500 px-2 font-mono text-[11px] text-fg-primary tnum', BP_TONES[i] ?? BP_TONES[5])} style={{ width: `${(n / max) * 100}%` }}>
                  <span className="truncate text-fg-secondary">{BP_NOTE[b.key]}</span>
                  <span>{n}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 mb-3 text-xs font-medium text-fg-muted">容器 container.*</p>
      <ul className="space-y-1.5">
        {containers.map((c) => {
          const n = px(String(c.value));
          return (
            <li key={c.path} className="grid grid-cols-[3.5rem_1fr] items-center gap-3">
              <CopyName text={c.path} label={c.key} />
              <div className="min-w-0">
                <div className="flex h-7 items-center justify-between rounded-sm border border-dashed border-border-strong bg-bg-surface-sunken/60 px-2 font-mono text-[11px] text-fg-primary tnum" style={{ width: `${(n / max) * 100}%` }}>
                  <span className="truncate text-fg-secondary">{CONTAINER_NOTE[c.key]}</span>
                  <span>{n}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 mb-0 text-[12px] text-fg-muted">条宽按 {max}px 等比绘制。</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Z_USAGE: Record<string, string> = {
  base: '常规内容',
  raised: '卡片 hover、浮动按钮',
  sticky: '顶部导航、Tab bar',
  overlay: '遮罩（scrim）',
  modal: 'Dialog / Sheet',
  popover: '下拉、菜单',
  toast: 'Toast',
  tooltip: 'Tooltip',
};

const OTHER_SIZES = ['size.connection-button.mobile', 'size.connection-button.desktop', 'size.tab-bar', 'size.app-bar', 'size.touch-target-min', 'size.logo.min-mark', 'size.logo.min-horizontal'];
const OTHER_NOTE: Record<string, string> = {
  'size.connection-button.mobile': '连接按钮直径（手机）',
  'size.connection-button.desktop': '连接按钮直径（平板 / 桌面）',
  'size.tab-bar': 'Tab bar 高度 + 底部安全区',
  'size.app-bar': 'App bar 高度',
  'size.touch-target-min': '最小触控目标（= control.md）',
  'size.logo.min-mark': '图形最小尺寸（屏幕）',
  'size.logo.min-horizontal': '横版 Logo 最小宽度',
};

export default function SpacingPage() {
  const grids = (['mobile', 'tablet', 'desktop'] as const).map((d) => ({
    id: d,
    label: d === 'mobile' ? '手机' : d === 'tablet' ? '平板' : '桌面',
    range: d === 'mobile' ? `< ${token('breakpoint.md')}` : d === 'tablet' ? `${token('breakpoint.md')} – ${px(token('breakpoint.lg')) - 1}px` : `≥ ${token('breakpoint.lg')}`,
    columns: token(`grid.${d}.columns`),
    gutter: token(`grid.${d}.gutter`),
    margin: token(`grid.${d}.margin`),
  }));

  return (
    <>
      <PageHeader
        eyebrow="基础 · Foundations"
        title="间距 · 圆角 · 布局"
        en="Spacing · Radius · Layout"
        description="4pt 网格。间距 token 名与 Tailwind 单位一致（space.4 = 16px = p-4）；圆角、控件尺寸、断点、栅格与 z-index 都只有一套值。"
      />

      <Section id="spacing" title="间距标尺" en="Spacing Scale" description="16 档，全部为 4 的倍数（2 与 6 用于行内微调）。Tailwind 的 --spacing 为 0.25rem，因此 p-4 = 16px。">
        <SpacingRuler />
      </Section>

      <Section id="radius" title="圆角" en="Radius" description="控件 md 12 · 卡片 lg 16 · 弹层 / Sheet 2xl 24 · Hero 面板 3xl 32 · 圆形 full。">
        <RadiusSpecimens />
      </Section>

      <Section id="sizes" title="尺寸" en="Sizes" description="控件高度、图标、头像、国旗与其他固定尺寸，全部来自 size.*。">
        <SubSection id="control-sizes" title="控件高度" en="Controls" description="md 44 为默认值，也是最小触控目标；按钮 sm / md / lg 分别对应 36 / 44 / 52。">
          <ControlLadder />
        </SubSection>
        <SubSection id="icon-sizes" title="图标" en="Icons" description="Lucide 24px 网格；16px 时描边加粗到 2，其余 1.75。">
          <IconLadder />
        </SubSection>
        <SubSection id="avatar-sizes" title="头像" en="Avatars">
          <AvatarLadder />
        </SubSection>
        <SubSection id="flag-sizes" title="国旗" en="Flags" description="圆形国旗 24 / 32 / 40，外加 1px 内描边（Flag 组件自带）。">
          <FlagLadder />
        </SubSection>
        <SubSection id="other-sizes" title="其他固定尺寸" en="Other">
          <TokenTable
            rows={OTHER_SIZES.map((p) => ({ name: p, value: token(p), description: OTHER_NOTE[p], preview: 'spacing' as const }))}
            caption="其他尺寸 token"
          />
        </SubSection>
      </Section>

      <Section id="borders" title="边框与聚焦环" en="Borders & Focus Ring" description="hairline 1 · thin 1.5 · thick 2；聚焦环为 3px 半透明品牌蓝。">
        <Grid cols={4} gap="md" className="my-6">
          {tokensByPrefix('border-width').map((b) => {
            const value = String(b.value);
            const isFocus = b.key === 'focus';
            return (
              <div key={b.path} className="rounded-lg border border-border-default bg-bg-canvas p-4 shadow-level-1">
                <div
                  className={cn('flex h-16 items-center justify-center rounded-md bg-bg-surface font-mono text-[12px] text-fg-secondary tnum', isFocus && 'border border-border-focus shadow-focus')}
                  style={isFocus ? undefined : { border: `${value} solid var(--color-border-strong)` }}
                  aria-hidden
                >
                  {value}
                </div>
                <CopyName text={b.path} label={b.key} className="mt-3" />
                <p className="mt-1 mb-0 text-[12px] leading-4 text-fg-muted">{isFocus ? `聚焦环 ${token('elevation.focus')}` : b.key === 'hairline' ? '默认边框、分割线、国旗内描边' : b.key === 'thin' ? '强调描边' : '连接按钮外环、选中态描边'}</p>
              </div>
            );
          })}
        </Grid>
      </Section>

      <Section id="breakpoints" title="断点与容器" en="Breakpoints & Containers" description="xs 360 是最小支持宽度；站点 ≥ 1280 三栏、768–1279 两栏、< 768 单栏 + 抽屉侧栏。">
        <BreakpointBars />
      </Section>

      <Section id="grid" title="栅格" en="Grid" description="手机 4 列 / 16 gutter / 16 边距；平板 8 / 24 / 24；桌面 12 / 24 / 32。">
        <DocTable
          caption="栅格规格"
          head={
            <>
              <th>设备</th>
              <th>宽度</th>
              <th>列</th>
              <th>gutter</th>
              <th>边距</th>
              <th>Token</th>
            </>
          }
        >
          {grids.map((g) => (
            <tr key={g.id} className="transition-colors hover:bg-bg-surface-hover">
              <td className="font-medium text-fg-primary">{g.label}</td>
              <td className="font-mono text-[12px] text-fg-secondary tnum">{g.range}</td>
              <td className="font-mono text-[12px] text-fg-secondary tnum">{g.columns}</td>
              <td className="font-mono text-[12px] text-fg-secondary tnum">{g.gutter}</td>
              <td className="font-mono text-[12px] text-fg-secondary tnum">{g.margin}</td>
              <td>
                <CopyName text={`grid.${g.id}`} label={`grid.${g.id}.*`} />
              </td>
            </tr>
          ))}
        </DocTable>
        <GridOverlayDemo />
      </Section>

      <Section id="z-index" title="z-index 层级" en="z-index" description="八档固定层级；组件只引用 token，不得手写数字。">
        <TokenTable rows={tokensByPrefix('z-index').map((z) => ({ name: z.path, value: String(z.value), description: Z_USAGE[z.key] }))} caption="z-index token" />
      </Section>

      <Section id="reference" title="跨平台引用" en="Reference" description="同一组尺寸在 Web、Flutter、iOS 的写法。">
        <PlatformSnippets
          snippets={[
            {
              id: 'css',
              label: 'CSS',
              lang: 'css',
              code: `.card {\n  padding: var(--tp-space-4);           /* ${token('space.4')} */\n  border-radius: var(--tp-radius-lg);   /* ${token('radius.lg')} */\n  min-height: var(--tp-size-control-md); /* ${token('size.control.md')} */\n}`,
            },
            {
              id: 'tailwind',
              label: 'Tailwind',
              lang: 'tsx',
              code: `<div className="rounded-lg p-4 min-h-control-md">…</div>\n{/* p-4 = space.4 · rounded-lg = radius.lg · min-h-control-md = size.control.md */}`,
            },
            {
              id: 'dart',
              label: 'Dart',
              lang: 'dart',
              code: `Container(\n  padding: const EdgeInsets.all(TpTokens.space4),\n  constraints: const BoxConstraints(minHeight: TpTokens.sizeControlMd),\n  decoration: BoxDecoration(borderRadius: BorderRadius.circular(TpTokens.radiusLg)),\n);`,
            },
            {
              id: 'swift',
              label: 'Swift',
              lang: 'swift',
              code: `card.layoutMargins = UIEdgeInsets(top: TPTokens.space4, left: TPTokens.space4, bottom: TPTokens.space4, right: TPTokens.space4)\ncard.layer.cornerRadius = TPTokens.radiusLg\ncard.heightAnchor.constraint(greaterThanOrEqualToConstant: TPTokens.sizeControlMd).isActive = true`,
            },
          ]}
        />
        <Callout tone="info" title="Flutter / iOS 对应">
          <p>
            Dart：<code>TpTokens.space4</code>、<code>TpTokens.radiusLg</code>、<code>TpTokens.sizeControlMd</code>（<code>double</code>）；iOS：<code>TPTokens.space4</code>、<code>TPTokens.radiusLg</code>（<code>CGFloat</code>）。断点与栅格在移动端按 <code>MediaQuery</code> / <code>traitCollection</code> 判断 768 与 1024 两个阈值。
          </p>
        </Callout>
        <Prose>
          <p>
            App 页面模板：App bar 56 → 页面边距 16 → 卡片 radius.lg 16、内边距 16、卡片间距 24 → Tab bar 56 + 安全区。
          </p>
        </Prose>
      </Section>
    </>
  );
}
