import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Type } from 'lucide-react';
import { Switch, typeRoles, type TypeRole } from '@tpvpn/ui';
import { downloadUrl, PACKS } from '@/lib/assets';
import { token, tokenValue, type TypographyValue } from '@/lib/tokens';
import { cn } from '@/lib/cn';
import {
  ButtonLink,
  Callout,
  CodeBlock,
  DocTable,
  DownloadCard,
  Grid,
  PageHeader,
  Pill,
  Preview,
  Section,
  SubSection,
  TokenTable,
} from '@/components/docs';
import { packBytes } from './_parts/brandData';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const WEIGHTS: { weight: number; name: string; tokenName: string }[] = [
  { weight: 400, name: 'Regular', tokenName: 'font.weight.regular' },
  { weight: 500, name: 'Medium', tokenName: 'font.weight.medium' },
  { weight: 600, name: 'SemiBold', tokenName: 'font.weight.semibold' },
  { weight: 700, name: 'Bold', tokenName: 'font.weight.bold' },
  { weight: 800, name: 'ExtraBold', tokenName: 'font.weight.extrabold' },
];

interface Specimen {
  locale: string;
  lang: string;
  name: string;
  title: string;
  body: string;
  font: string;
}

const SPECIMENS: Specimen[] = [
  { locale: 'zh-CN', lang: 'zh-CN', name: '简体中文（源）', title: '连接中…', body: 'TP VPN 基于 WireGuard，智能选路自动选择最快节点。', font: 'Inter + PingFang SC' },
  { locale: 'en', lang: 'en', name: 'English', title: 'Connecting…', body: 'TP VPN is built on WireGuard and picks the fastest node automatically.', font: 'Inter' },
  { locale: 'zh-HK', lang: 'zh-HK', name: '繁體中文（香港）', title: '連線中…', body: 'TP VPN 以 WireGuard 為基礎，智能選路自動選擇最快的節點。', font: 'Inter + PingFang HK' },
  { locale: 'es', lang: 'es', name: 'Español', title: 'Conectando…', body: 'TP VPN se basa en WireGuard y elige el nodo más rápido automáticamente.', font: 'Inter' },
  { locale: 'hi', lang: 'hi', name: 'हिन्दी', title: 'कनेक्ट हो रहा है…', body: 'TP VPN WireGuard पर आधारित है और अपने आप सबसे तेज़ नोड चुनता है।', font: 'Noto Sans Devanagari' },
];

/** Literal class names so Tailwind picks every role up. */
const ROLE_CLASS: Record<TypeRole, string> = {
  'display-2xl': 'text-display-2xl',
  'display-xl': 'text-display-xl',
  'display-lg': 'text-display-lg',
  'display-md': 'text-display-md',
  'display-sm': 'text-display-sm',
  'title-lg': 'text-title-lg',
  'title-md': 'text-title-md',
  'title-sm': 'text-title-sm',
  headline: 'text-headline',
  'body-lg': 'text-body-lg',
  'body-md': 'text-body-md',
  body: 'text-body',
  'body-sm': 'text-body-sm',
  'label-lg': 'text-label-lg',
  'label-md': 'text-label-md',
  'label-sm': 'text-label-sm',
  caption: 'text-caption',
  overline: 'text-overline uppercase',
  'numeric-lg': 'text-numeric-lg tnum',
  'numeric-md': 'text-numeric-md tnum',
  'numeric-sm': 'text-numeric-sm tnum',
  mono: 'text-mono font-mono',
};

const ROLE_USE: Record<TypeRole, string> = {
  'display-2xl': '官网首屏',
  'display-xl': '官网首屏',
  'display-lg': '官网区块标题',
  'display-md': '官网次级',
  'display-sm': 'App 显示标题（「已连接」）',
  'title-lg': '页面标题',
  'title-md': '模块标题',
  'title-sm': '卡片大标题',
  headline: '卡片标题 / 列表主文字',
  'body-lg': '官网长文',
  'body-md': '官网默认正文',
  body: 'App 正文（默认）',
  'body-sm': '密集信息',
  'label-lg': '大按钮文字',
  'label-md': '按钮 / 表单标签',
  'label-sm': '小标签 / Tab',
  caption: '辅助说明',
  overline: '分组小标（大写）',
  'numeric-lg': '网速 / 计时',
  'numeric-md': '数据展示',
  'numeric-sm': '列表数据',
  mono: '代码 / IP',
};

const ROLE_SAMPLE: Record<TypeRole, string> = {
  'display-2xl': '已连接',
  'display-xl': '已连接',
  'display-lg': '为可信连接而设计',
  'display-md': '为可信连接而设计',
  'display-sm': '已连接',
  'title-lg': '节点',
  'title-md': '推荐节点',
  'title-sm': 'US · Los Angeles #102',
  headline: 'HK · 香港 #01 优质节点',
  'body-lg': '智能选路自动为你挑选最快节点，连接一步完成。',
  'body-md': '智能选路自动为你挑选最快节点，连接一步完成。',
  body: '智能选路自动为你挑选最快节点，连接一步完成。',
  'body-sm': '上次连接 2 分钟前 · 延迟 38 ms · 负载 41%',
  'label-lg': '连接',
  'label-md': '查看套餐',
  'label-sm': '首页',
  caption: '流量按自然月重置',
  overline: 'Premium nodes',
  'numeric-lg': '00:12:36',
  'numeric-md': '12.4 GB',
  'numeric-sm': '38 ms',
  mono: '10.8.0.2/32 · Fz3K-9QMA-7PLD',
};

const GROUPS: { title: string; en: string; roles: TypeRole[] }[] = [
  { title: '展示', en: 'Display', roles: ['display-2xl', 'display-xl', 'display-lg', 'display-md', 'display-sm'] },
  { title: '标题', en: 'Title', roles: ['title-lg', 'title-md', 'title-sm', 'headline'] },
  { title: '正文', en: 'Body', roles: ['body-lg', 'body-md', 'body', 'body-sm'] },
  { title: '标签与说明', en: 'Label · Caption', roles: ['label-lg', 'label-md', 'label-sm', 'caption', 'overline'] },
  { title: '数字与等宽', en: 'Numeric · Mono', roles: ['numeric-lg', 'numeric-md', 'numeric-sm', 'mono'] },
];

const px = (v: string) => v.replace(/px$/, '');
const roleMeta = (role: TypeRole) => tokenValue(`typography.${role}`) as TypographyValue;
const formatTracking = (v?: string) => (!v || v === '0em' ? '0' : v.replace('-', '−'));

const FONT_STACK_ROWS: { tokenName: string; use: string; note: string }[] = [
  { tokenName: 'font.family.sans', use: '默认（拉丁 + 简体中文）', note: 'Inter 变量字体；CJK 回退 PingFang SC → Noto Sans SC。' },
  { tokenName: 'font.family.sans-hk', use: '繁體中文（香港）', note: 'lang="zh-HK" 时切换，CJK 回退 PingFang HK → Noto Sans HK。' },
  { tokenName: 'font.family.devanagari', use: '印地语', note: 'lang="hi" 时切换；行高 ≥ 1.6 避免上标符号被裁切。' },
  { tokenName: 'font.family.mono', use: '等宽', note: 'IP、密钥、兑换码；每 4 位加空格便于朗读。' },
];

const LATENCIES = ['9 ms', '38 ms', '111 ms', '1,204 ms'];

const SNIPPET_WEB = `/* CSS 变量 */
.title {
  font-size: var(--tp-typography-title-lg-font-size);      /* 24px */
  line-height: var(--tp-typography-title-lg-line-height);  /* 32px */
  font-weight: var(--tp-typography-title-lg-font-weight);  /* 600 */
  letter-spacing: var(--tp-typography-title-lg-letter-spacing);
}

/* Tailwind */
<h1 class="text-title-lg text-fg-primary">节点</h1>
<span class="text-numeric-sm tabular-nums">38 ms</span>`;

const SNIPPET_NATIVE = `// Flutter — TextStyle 常量，配 fontFamily: TpTokens.fontFamilySans.first
Text('已连接', style: TpTokens.typographyDisplaySm);
Text('38 ms', style: TpTokens.typographyNumericSm.copyWith(
  fontFeatures: const [FontFeature.tabularFigures()],
));

// iOS — SF Pro 度量与 Inter 相近，可直接用系统字体
let title = UIFont.systemFont(ofSize: TPTokens.typographyTitleLg.size, weight: .semibold)
let numeric = UIFont.monospacedDigitSystemFont(ofSize: 18, weight: .semibold)`;

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function useElapsed(running: boolean, start = 12 * 60 + 36) {
  const [seconds, setSeconds] = useState(start);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

function NumberColumn({ tabular, elapsed }: { tabular: boolean; elapsed: string }) {
  return (
    <div className={cn('flex-1 rounded-lg border border-border-default bg-bg-surface p-5 shadow-level-1', tabular && 'tnum')} style={tabular ? undefined : { fontVariantNumeric: 'proportional-nums' }}>
      <p className="flex items-center justify-between text-xs text-fg-muted">
        <span className="font-mono">{tabular ? 'tabular-nums' : 'proportional-nums'}</span>
        <Pill tone={tabular ? 'success' : 'neutral'} size="sm">
          {tabular ? '规范' : '默认'}
        </Pill>
      </p>
      <p className="mt-3 text-numeric-lg text-fg-primary" aria-live="off">
        {elapsed}
      </p>
      <ul className="mt-4 divide-y divide-border-subtle">
        {LATENCIES.map((v, i) => (
          <li key={v} className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-fg-secondary">节点 {i + 1}</span>
            <span className="w-24 text-left text-numeric-sm text-fg-primary">{v}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-5 text-fg-secondary">{tabular ? '每个数字等宽，列表对齐、计时不跳动。' : '「1」比「8」窄，列表参差，计时器左右抖动。'}</p>
    </div>
  );
}

function RoleRow({ role }: { role: TypeRole }) {
  const m = roleMeta(role);
  const cssVar = `--text-${role}`;
  return (
    <div className="grid gap-3 py-5 lg:grid-cols-[13rem_1fr] lg:gap-8">
      <div className="min-w-0">
        <p className="font-mono text-[13px] text-fg-brand">{role}</p>
        <p className="mt-1 font-mono text-[11px] text-fg-muted tnum">
          {px(m.fontSize)}/{px(m.lineHeight)} · {m.fontWeight} · {formatTracking(m.letterSpacing)}
          {m.fontVariantNumeric ? ' · tabular' : ''}
          {m.textTransform ? ' · uppercase' : ''}
        </p>
        <p className="mt-1 font-mono text-[11px] text-fg-muted">
          .{ROLE_CLASS[role].split(' ')[0]} · {cssVar}
        </p>
        <p className="mt-1 text-xs text-fg-secondary">{ROLE_USE[role]}</p>
      </div>
      <p className={cn('min-w-0 break-words text-fg-primary', ROLE_CLASS[role])}>{ROLE_SAMPLE[role]}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TypographyPage() {
  const reduced = useReducedMotion() ?? false;
  const [running, setRunning] = useState(!reduced);
  const elapsed = useElapsed(running);

  return (
    <>
      <PageHeader
        eyebrow="品牌 · Brand"
        title="字体"
        en="Typography"
        description="英文清晰，中文舒展，数字稳定。以 Inter 与本地中文系统字体组成轻量的多语言体系；用字号、留白和字重建立秩序，而不是堆叠字体。"
        actions={
          <>
            <ButtonLink to="/foundations/typography" variant="outline" size="md">
              字阶 Token →
            </ButtonLink>
          </>
        }
      />

      {/* ------------------------------------------------------------ */}
      <Section id="inter" title="Inter" en="Primary Typeface" description="开启 cv11（单层 a）与 ss01（开口数字），拉丁标题用负字距，正文字距 0。">
        <div className="overflow-hidden rounded-xl border border-border-default bg-bg-surface shadow-level-1">
          <div className="grid gap-8 bg-blue-50/40 p-5 @min-[640px]:grid-cols-[1fr_1fr] @min-[640px]:items-end @min-[640px]:p-8">
            <div>
              <p lang="en" className="font-sans text-[clamp(80px,18cqi,144px)] leading-none font-medium tracking-[-0.06em] text-fg-primary" aria-label="Inter 字样 Aa">Aa</p>
              <p className="mt-6 text-[28px] leading-snug font-medium text-fg-primary">清晰，自然。</p>
              <p lang="en" className="mt-2 text-[15px] text-fg-secondary">Connection without distraction.</p>
            </div>
            <div className="text-fg-secondary">
              <p className="text-title-md text-fg-primary">Inter Variable</p>
              <p className="mt-1 text-sm leading-6">
                Rasmus Andersson 设计，SIL Open Font License。站点用 <code className="rounded-xs bg-bg-surface-sunken px-1 font-mono text-[13px] text-fg-primary">@fontsource-variable/inter</code>，资产包附 Regular / Medium / SemiBold / Bold / ExtraBold 静态 TTF。
              </p>
              <p className="mt-3 font-mono text-[11px] text-fg-muted">font-feature-settings: 'cv11', 'ss01'</p>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t border-border-subtle @min-[720px]:grid-cols-5">
            {WEIGHTS.map((w) => (
              <div key={w.weight} className="min-w-0 border-b border-border-subtle px-4 py-5">
                <p lang="en" className="text-[2rem] leading-none text-fg-primary" style={{ fontWeight: w.weight }}>
                  Aa
                </p>
                <p className="mt-3 text-sm font-medium text-fg-primary">
                  {w.name} <span className="font-mono text-xs text-fg-muted tnum">{token(w.tokenName)}</span>
                </p>
                <p className="mt-2 text-[13px] text-fg-muted">{w.weight <= 600 ? '中英文 UI' : '拉丁展示字'}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="multilingual" title="多语言样张" en="Multilingual" description="五种语言各一句。标题用 display-sm，正文用 body-md；每张卡都带 lang 属性，浏览器据此切换 CJK / 天城文字体栈。">
        <Grid cols={2} gap="md">
          {SPECIMENS.map((s) => (
            <div key={s.locale} className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-level-1" lang={s.lang}>
              <p className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-fg-muted">
                  {s.name} <span className="font-mono">· {s.locale}</span>
                </span>
                <span className="font-mono text-[11px] text-fg-muted">{s.font}</span>
              </p>
              <p className="mt-4 text-display-sm text-fg-primary">{s.title}</p>
              <p className={cn('mt-2 text-body-md text-fg-secondary', (s.lang.startsWith('zh') || s.lang === 'hi') && 'leading-[1.6]')}>{s.body}</p>
            </div>
          ))}
        </Grid>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="tabular" title="等宽数字" en="Tabular Numerals" description="延迟、网速、计时、流量都是会变的数字。tabular-nums 让每个数字占同样宽度，列表对齐，计时器不左右跳动。">
        <Preview
          background="canvas"
          centered={false}
          label="等宽数字对比"
          toolbar={
            <label className="flex items-center gap-2 text-sm text-fg-secondary">
              <Switch size="sm" checked={running} onCheckedChange={setRunning} aria-label="运行计时器" />
              运行计时器
            </label>
          }
        >
          <div className="flex flex-col gap-4 @min-[640px]:flex-row">
            <NumberColumn tabular={false} elapsed={elapsed} />
            <NumberColumn tabular elapsed={elapsed} />
          </div>
        </Preview>
        <p className="text-sm leading-6 text-fg-secondary">
          Web：<code className="rounded-xs bg-bg-surface-sunken px-1 font-mono text-[13px] text-fg-primary">font-variant-numeric: tabular-nums</code>（站点工具类{' '}
          <code className="rounded-xs bg-bg-surface-sunken px-1 font-mono text-[13px] text-fg-primary">.tnum</code>、Tailwind{' '}
          <code className="rounded-xs bg-bg-surface-sunken px-1 font-mono text-[13px] text-fg-primary">tabular-nums</code>）；numeric-* 三个角色已内置。单位用 label-sm + fg-secondary，与数字之间留一个空格。
        </p>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="scale" title="字阶" en="Type Scale" description="22 个可复用角色，单个界面优先使用三个层级。表中为拉丁基础度量；中文标题实际使用 600 字重、零字距与 1.3 行高，正文使用 1.6 行高。">
        <div className="rounded-xl border border-border-default bg-bg-surface px-6 shadow-level-1">
          {GROUPS.map((g) => (
            <div key={g.en} className="border-b border-border-subtle last:border-b-0">
              <p className="eyebrow pt-6 text-fg-muted">
                {g.title} · {g.en}
              </p>
              <div className="divide-y divide-border-subtle">
                {g.roles.map((role) => (
                  <RoleRow key={role} role={role} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <SubSection title="参考表" en="Reference" description="px 字号 / 行高、字重、字距。点击 token 名复制。">
          <TokenTable
            caption="字阶 token"
            rows={typeRoles.map((role) => {
              const m = roleMeta(role);
              return {
                name: `typography.${role}`,
                value: `${px(m.fontSize)}/${px(m.lineHeight)} ${m.fontWeight} ${formatTracking(m.letterSpacing)}`,
                preview: 'text' as const,
                description: ROLE_USE[role],
              };
            })}
          />
        </SubSection>
        <SubSection title="代码片段" en="Snippets">
          <Grid cols={2} gap="md">
            <CodeBlock code={SNIPPET_WEB} lang="css" filename="web" />
            <CodeBlock code={SNIPPET_NATIVE} lang="dart" filename="Flutter / iOS 对应" />
          </Grid>
        </SubSection>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="cjk" title="CJK 与印地语" en="CJK & Devanagari" description="拉丁字阶的负字距与 1.5 行高不适合方块字与天城文。">
        <Callout tone="info" title="中文规则">
          <p>
            正文行高上调至 <strong>{token('font.line-height-ratio.cjk-body')}</strong>（body 14px → 22px，body-md 16px → 26px）；字距 0，不套用拉丁负字距；<strong>禁止假粗体</strong>（faux bold），标题最多 <strong>600</strong>；使用全角标点，中英文与数字之间加一个空格。
          </p>
        </Callout>
        <Callout tone="info" title="印地语与西班牙语">
          <p>
            hi：Noto Sans Devanagari，行高 ≥ 1.6 避免上标符号被裁切，不用 overline 的大写。es：文案平均比中文长 40–60%，按钮与 Tab 需预留宽度，按钮不允许换行。
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="font-stack" title="字体栈" en="Font Stacks" description="四条字体栈由 token 输出；站点通过 :lang() 在 zh-HK 与 hi 下自动切换。">
        <DocTable
          caption="字体栈"
          head={
            <>
              <th className="w-40">用途</th>
              <th className="w-44">Token</th>
              <th>字体栈</th>
            </>
          }
        >
          {FONT_STACK_ROWS.map((r) => (
            <tr key={r.tokenName} className="transition-colors hover:bg-bg-surface-hover">
              <td className="align-top font-medium text-fg-primary">
                {r.use}
                <p className="mt-1 text-xs font-normal leading-5 text-fg-secondary">{r.note}</p>
              </td>
              <td className="align-top font-mono text-[12px] text-fg-brand">{r.tokenName}</td>
              <td className="align-top font-mono text-[12px] leading-5 text-fg-secondary">{token(r.tokenName)}</td>
            </tr>
          ))}
        </DocTable>
        <Callout tone="success" title="Apple 平台可用 SF Pro 等价">
          SF Pro 的度量与 Inter 相近（x 高度、字重级别、tabular 数字都对得上），iOS / macOS 原生界面直接使用系统字体即可；Flutter iOS 也可用 <code>.SF Pro Text</code>。跨平台的品牌物料、官网与 Android 统一用 Inter。
        </Callout>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="download" title="下载" en="Download" description="Inter 静态 TTF 五档（Regular 400 · Medium 500 · SemiBold 600 · Bold 700 · ExtraBold 800），附 OFL 许可文本。">
        <Grid cols={2} gap="md">
          <DownloadCard
            title="Inter 字体包"
            description="5 个 TTF + LICENSE-Inter.txt；SIL Open Font License 1.1，可随产品免费分发。"
            href={downloadUrl(PACKS.fonts)}
            bytes={packBytes(PACKS.fonts)}
            formats={['TTF', 'OFL', 'ZIP']}
            icon={<Type aria-hidden />}
            preview={
              <p className="text-[3.5rem] leading-none font-bold tracking-[-0.03em] text-fg-primary" aria-hidden>
                Inter
              </p>
            }
          />
        </Grid>
      </Section>
    </>
  );
}
