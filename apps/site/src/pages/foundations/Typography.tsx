import { useId, useState } from 'react';
import { Switch } from '@tpvpn/ui';
import { Callout, CodeBlock, DocTable, DoDont, PageHeader, Preview, Prose, Section, SubSection, TokenTable } from '@/components/docs';
import { formatTokenValue, token, tokensByPrefix, type TokenEntry, type TypographyValue } from '@/lib/tokens';
import { roleNumbers } from './_parts/naming';
import { TypeRoleCard } from './_parts/TypeRoleCard';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const ROLES = tokensByPrefix('typography');
const byKey = new Map(ROLES.map((r) => [r.key, r]));
const typo = (key: string): TypographyValue => byKey.get(key)!.value as TypographyValue;

const SAMPLES: Record<string, string> = {
  'display-2xl': '更快、更安心的连接',
  'display-xl': '连接世界，无需等待',
  'display-lg': '为游戏与 AI 准备的专线',
  'display-md': '多设备，一个账号',
  'display-sm': '已连接',
  'title-lg': '节点',
  'title-md': '推荐线路',
  'title-sm': 'US · Los Angeles #102',
  headline: '香港 · 优质节点',
  'body-lg': 'TP VPN 基于 WireGuard，智能选路自动匹配最优线路，支持 2 / 4 / 8 / 50 台设备同时在线。',
  'body-md': '连接后所有流量经加密隧道传输，我们不记录任何日志。',
  body: '上次连接：香港 · 2 分钟前 · 42 ms',
  'body-sm': '延迟 42 ms · 丢包 0% · 负载 36%',
  'label-lg': '连接 Connect',
  'label-md': '选择节点',
  'label-sm': '自动最优',
  caption: '兑换码 30 天内有效',
  overline: '推荐节点 Recommended',
  'numeric-lg': '128.4 Mbps',
  'numeric-md': '00:12:34',
  'numeric-sm': '42 ms',
  mono: 'wg0 · 10.66.0.12/32 · TPVN-8K2M-3XQ9',
};

const GROUPS: { id: string; title: string; en: string; description: string; keys: string[] }[] = [
  { id: 'display', title: '展示', en: 'Display', description: '官网首屏与区块标题；App 内最大只到 display-sm（「已连接」）。', keys: ['display-2xl', 'display-xl', 'display-lg', 'display-md', 'display-sm'] },
  { id: 'title', title: '标题', en: 'Title', description: '页面、模块、卡片标题与列表主文字。CJK 标题最多 600。', keys: ['title-lg', 'title-md', 'title-sm', 'headline'] },
  { id: 'body', title: '正文', en: 'Body', description: 'App 默认正文 body（14/22），官网默认 body-md（16/24），长文 body-lg。', keys: ['body-lg', 'body-md', 'body', 'body-sm'] },
  { id: 'label', title: '标签与说明', en: 'Label · Caption · Overline', description: '按钮、表单标签、Tab、辅助说明与分组小标（overline 大写只对拉丁文字生效）。', keys: ['label-lg', 'label-md', 'label-sm', 'caption', 'overline'] },
  { id: 'numeric', title: '数字与等宽', en: 'Numeric · Mono', description: '网速、计时、延迟一律 tabular-nums；IP、密钥、兑换码用 mono。', keys: ['numeric-lg', 'numeric-md', 'numeric-sm', 'mono'] },
];

const listed = new Set(GROUPS.flatMap((g) => g.keys));
const EXTRA: TokenEntry[] = ROLES.filter((r) => !listed.has(r.key));

/* ------------------------------------------------------------------ */
/* Responsive rule table                                               */
/* ------------------------------------------------------------------ */

const RESPONSIVE: { use: string; xs: string; sm: string; lg: string; xl: string }[] = [
  { use: '官网首屏标题', xs: 'display-md · 40', sm: 'display-lg · 48', lg: 'display-xl · 64', xl: 'display-2xl · 72' },
  { use: '官网区块标题', xs: 'display-sm · 32', sm: 'display-md · 40', lg: 'display-lg · 48', xl: 'display-lg · 48' },
  { use: '官网次级标题', xs: 'title-lg · 24', sm: 'display-sm · 32', lg: 'display-md · 40', xl: 'display-md · 40' },
  { use: '官网正文', xs: 'body-md · 16', sm: 'body-md · 16', lg: 'body-lg · 17', xl: 'body-lg · 17' },
  { use: 'App 显示标题（已连接）', xs: 'display-sm · 32', sm: 'display-sm · 32', lg: '—', xl: '—' },
  { use: 'App / 站点页面标题', xs: 'title-lg · 24', sm: 'title-lg · 24', lg: 'title-lg · 24', xl: 'title-lg · 24' },
  { use: 'App 正文', xs: 'body · 14', sm: 'body · 14', lg: '—', xl: '—' },
];

/* ------------------------------------------------------------------ */
/* CJK line-height demo                                                */
/* ------------------------------------------------------------------ */

function CjkDemo() {
  const [cjk, setCjk] = useState(true);
  const id = useId();
  const body = roleNumbers(typo('body-md'));
  const ratio = parseFloat(token('font.line-height-ratio.cjk-body')) || 1.6;
  const lh = cjk ? Math.round(body.fontSize * ratio) : body.lineHeight;

  return (
    <Preview
      background="surface"
      centered={false}
      label="CJK 行高演示"
      toolbar={
        <label htmlFor={id} className="flex items-center gap-2 text-sm text-fg-secondary">
          <Switch id={id} size="sm" checked={cjk} onCheckedChange={setCjk} />
          CJK 行高 {ratio}
          <span className="font-mono text-[12px] text-fg-muted tnum">
            {body.fontSize}px × {cjk ? ratio : body.lineHeight / body.fontSize} = {lh}px
          </span>
        </label>
      }
      code={`<p lang="zh-CN" className="text-body-md leading-[1.6] tracking-normal">连接后所有流量经加密隧道传输……</p>
<p lang="en" className="text-body-md">Once connected, all traffic travels through an encrypted tunnel…</p>`}
    >
      <div className="grid w-full gap-6 md:grid-cols-2">
        <p lang="zh-CN" className="m-0 text-fg-primary" style={{ fontSize: body.fontSize, lineHeight: `${lh}px`, letterSpacing: 0, transition: 'line-height 200ms var(--ease-standard)' }}>
          连接后所有流量经加密隧道传输，我们不记录任何日志。智能选路会在几百毫秒内比较可用线路，为游戏、AI 与交易所场景自动匹配最合适的出口；多设备套餐支持 2、4、8 或 50 台设备同时在线。
        </p>
        <p lang="en" className="m-0 text-fg-secondary" style={{ fontSize: body.fontSize, lineHeight: `${body.lineHeight}px` }}>
          Once connected, all traffic travels through an encrypted tunnel and we keep no logs. Smart routing compares the available lines within a few hundred milliseconds and picks the best exit for gaming, AI and exchange scenarios; multi-device plans allow 2, 4, 8 or 50 devices at once.
        </p>
      </div>
    </Preview>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TypographyPage() {
  const overviewRows = ROLES.map((r) => ({
    name: r.path,
    value: formatTokenValue(r.value),
    description: r.description,
    preview: 'text' as const,
  }));

  return (
    <>
      <PageHeader
        eyebrow="基础 · Foundations"
        title="字阶 Token"
        en="Type Scale"
        description={`${ROLES.length} 个字体角色，每个角色 = 字号 / 行高 / 字重 / 字距的组合。下面每一条都按 token 值实时渲染，并给出 Tailwind 类名、CSS 变量与 Dart、Swift 常量。`}
      />

      <Section id="overview" title="总览" en="Overview" description="点击 token 名复制。值为「字号/行高 字重 字距」，与 dist/json/tokens.flat.json 一致。">
        <TokenTable rows={overviewRows} caption="typography token 总览" />
        <Prose>
          <ul>
            <li>
              主字体 <strong>Inter</strong>（变量字体，OFL）；Apple 平台原生用 SF Pro 等价替代；中文 PingFang SC / HK → Noto Sans CJK；印地语 Noto Sans Devanagari。
            </li>
            <li>
              Web：<code>text-&lt;role&gt;</code> 类名自动带行高、字重、字距（Tailwind v4 <code>--text-&lt;role&gt;--*</code>）；Flutter：<code>TpTokens.typography&lt;Role&gt;</code>（<code>TextStyle</code>）；iOS：<code>TPTokens.typography&lt;Role&gt;</code>（<code>TPTextStyle</code>，<code>.font</code> 得到 SF Pro）。
            </li>
            <li>一屏最多三个层级：一个标题角色、一个正文角色、一个标签 / 说明角色。</li>
          </ul>
        </Prose>
      </Section>

      {GROUPS.map((g) => (
        <Section key={g.id} id={g.id} title={g.title} en={g.en} description={g.description}>
          <div className="space-y-4">
            {g.keys.map((key) => {
              const entry = byKey.get(key);
              if (!entry) return null;
              return <TypeRoleCard key={key} role={key} value={entry.value as TypographyValue} description={entry.description} sample={SAMPLES[key] ?? key} />;
            })}
          </div>
        </Section>
      ))}

      {EXTRA.length > 0 && (
        <Section id="other-roles" title="其他角色" en="Other roles">
          <div className="space-y-4">
            {EXTRA.map((entry) => (
              <TypeRoleCard key={entry.key} role={entry.key} value={entry.value as TypographyValue} description={entry.description} sample={SAMPLES[entry.key] ?? entry.key} />
            ))}
          </div>
        </Section>
      )}

      <Section id="responsive" title="响应式规则" en="Responsive Rules" description="标题按断点降级：手机取小两档，平板小一档，桌面用定稿角色。App 内角色不随宽度变化。">
        <DocTable
          caption="标题角色与断点对应表"
          head={
            <>
              <th>用途</th>
              <th>&lt; 640</th>
              <th>640 – 1023</th>
              <th>1024 – 1279</th>
              <th>≥ 1280</th>
            </>
          }
        >
          {RESPONSIVE.map((row) => (
            <tr key={row.use} className="transition-colors hover:bg-bg-surface-hover">
              <td className="font-medium text-fg-primary">{row.use}</td>
              {[row.xs, row.sm, row.lg, row.xl].map((v, i) => (
                <td key={i} className="font-mono text-[12px] whitespace-nowrap text-fg-secondary">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </DocTable>
        <CodeBlock
          lang="tsx"
          filename="hero.tsx"
          code={`<h1 className="text-display-md text-fg-primary sm:text-display-lg lg:text-display-xl xl:text-display-2xl">
  更快、更安心的连接
</h1>
<p className="mt-6 text-body-md text-fg-secondary lg:text-body-lg">基于 WireGuard 的智能选路，为游戏、AI 与交易所准备的场景专线。</p>`}
        />
      </Section>

      <Section id="cjk" title="CJK 行高" en="CJK Line Height" description="中文正文行高上调至 1.6，字距为 0，不套用拉丁的负字距；标题最多 600，禁止假粗体。">
        <CjkDemo />
        <DoDont
          do={
            <h3 lang="zh-CN" className="m-0 text-title-lg text-fg-primary" style={{ letterSpacing: 0 }}>
              为游戏与 AI 准备的专线
            </h3>
          }
          dont={
            <h3 lang="zh-CN" className="m-0 text-title-lg text-fg-primary" style={{ fontWeight: 700, WebkitTextStroke: '0.35px currentColor' }}>
              为游戏与 AI 准备的专线
            </h3>
          }
          doCaption="中文标题 title-lg 600，字距 0。"
          dontCaption="700 加描边模拟粗体（faux bold）：笔画糊成一团，且中文字体通常没有 700 以上字重。"
        />
        <Callout tone="info" title="多语言排版要点">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              简体 / 繁体页面加 <code>lang="zh-CN"</code> / <code>lang="zh-HK"</code>，站点样式会按 <code>:lang()</code> 切换 PingFang SC / HK 回退链。
            </li>
            <li>
              印地语（<code>lang="hi"</code>）使用 Noto Sans Devanagari，行高 ≥ 1.6，避免顶部符号被裁切；不用 overline 大写。
            </li>
            <li>西班牙语文案平均比中文长 40–60%，按钮与 Tab 需预留宽度，不得截断。</li>
          </ul>
        </Callout>
      </Section>

      <Section id="families" title="字体族与字重" en="Families & Weights" description="字体栈来自 font.family.*；字重只用 400 / 500 / 600 / 700 / 800 五档。">
        <SubSection title="字体族" en="Families">
          <TokenTable
            rows={tokensByPrefix('font.family').map((t) => ({ name: t.path, value: formatTokenValue(t.value), description: t.description }))}
            caption="font.family token"
          />
        </SubSection>
        <SubSection title="字重" en="Weights">
          <div className="my-6 grid gap-3 sm:grid-cols-5">
            {tokensByPrefix('font.weight').map((w) => (
              <div key={w.path} className="rounded-lg border border-border-default bg-bg-surface px-4 py-4 shadow-level-1">
                <p className="m-0 text-[28px] leading-none text-fg-primary" style={{ fontWeight: Number(w.value) }}>
                  Aa 字
                </p>
                <p className="mt-3 mb-0 font-mono text-[12px] text-fg-brand">{w.key}</p>
                <p className="m-0 font-mono text-[12px] text-fg-muted tnum">{String(w.value)}</p>
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title="数字" en="Numerals">
          <Preview background="surface" label="tabular-nums 对比" className="gap-10">
            <div className="text-center">
              <p className="mb-2 text-xs text-fg-muted">proportional</p>
              <p className="m-0 text-numeric-md text-fg-primary" style={{ fontVariantNumeric: 'proportional-nums' }}>
                111.11 Mbps
                <br />
                888.88 Mbps
              </p>
            </div>
            <div className="text-center">
              <p className="mb-2 text-xs text-fg-muted">tabular-nums（规范）</p>
              <p className="m-0 text-numeric-md text-fg-primary tnum">
                111.11 Mbps
                <br />
                888.88 Mbps
              </p>
            </div>
          </Preview>
          <Prose>
            <ul>
              <li>所有数字 <code>tabular-nums</code>，表格、计时、网速对齐不跳动；Tailwind 用 <code>tabular-nums</code>，Dart 用 <code>FontFeature.tabularFigures()</code>。</li>
              <li>网速 / 计时用 <code>numeric-lg</code>，数据面板 <code>numeric-md</code>，列表延迟 <code>numeric-sm</code>；单位用 <code>label-sm</code> + <code>fg.secondary</code>，间距 <code>space.1</code>。</li>
              <li>IP、密钥、兑换码用 <code>mono</code>，每 4 位加空格便于朗读。</li>
            </ul>
          </Prose>
        </SubSection>
      </Section>
    </>
  );
}
