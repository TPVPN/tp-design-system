import { useState } from 'react';
import { Check, Globe, House, User, X } from 'lucide-react';
import { Button, ConnectionButton, SearchBar, TabBar, ToggleGroup, ToggleGroupItem } from '@tpvpn/ui';
import { cn } from '@/lib/cn';
import { ButtonLink, Callout, DoDont, DocTable, Grid, PageHeader, Pill, Preview, Prose, Section, SubSection } from '@/components/docs';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const PRINCIPLES: { title: string; en: string; body: string }[] = [
  { title: '直接', en: 'Direct', body: '动作即按钮：「连接」「兑换」「查看套餐」。不写「点击这里开始」。' },
  { title: '可信', en: 'Credible', body: '只说做得到的事：「基于 WireGuard」「不记录连接日志」。不写「军事级」「100% 匿名」。' },
  { title: '克制', en: 'Restrained', body: '一标题一句话，不用感叹号，不制造焦虑，不卖萌。' },
];

const TONE_ROWS: { rule: string; good: string; bad: string }[] = [
  { rule: '一标题一句话', good: '智能选路，自动连接最快节点', bad: '我们用先进的算法为您从全球数百个节点中挑选……' },
  { rule: '说事实', good: 'WireGuard 协议 · 无日志', bad: '军事级加密 · 100% 匿名' },
  { rule: '不制造焦虑', good: '网络不可用', bad: '危险！你的数据正在泄露！' },
  { rule: '不卖萌', good: '连接失败，请重试', bad: '哎呀，好像出了点小问题 🥺' },
  { rule: '动作即按钮', good: '连接 · 兑换 · 查看套餐', bad: '点击这里开始 · Go!' },
  { rule: '数字用阿拉伯数字', good: '8 台设备', bad: '八台设备' },
];

const CAN_CLAIM: { name: string; zh: string; en: string; note?: string }[] = [
  { name: 'WireGuard 协议', zh: '基于 WireGuard', en: 'Built on WireGuard' },
  { name: '智能选路', zh: '自动选择最快节点', en: 'Picks the fastest node automatically' },
  { name: '场景专线 auto / game / ai / exchange', zh: '游戏、AI、交易所专线', en: 'Dedicated lines for gaming, AI and exchanges' },
  { name: '多设备 2 / 4 / 8 / 50', zh: '最多 8 台设备同时使用', en: 'Up to 8 devices at once', note: '按套餐写实际数字' },
  { name: 'IEPL 优选', zh: 'IEPL 优选线路', en: 'IEPL premium routes' },
  { name: '固定出口 IP', zh: '固定出口 IP', en: 'Dedicated exit IP', note: '仅企业套餐' },
  { name: '无日志', zh: '不记录连接日志', en: "We don't keep connection logs" },
];

const CANNOT_CLAIM: { name: string; why: string }[] = [
  { name: 'Kill Switch', why: '当前版本没有断网保护，不得暗示「断线自动断网」。' },
  { name: '分流 / 分应用代理', why: '没有按应用或按域名分流，不得写「智能分流」。' },
  { name: '广告拦截', why: '不做内容过滤，不得写「拦截广告与追踪」。' },
  { name: '桌面端', why: '未上线；官网只列 iOS 与 Android，不写「全平台」。' },
  { name: '「全球最快」「100% 安全」「军事级」', why: '绝对化表述一律不用，无法证实且违反广告规范。' },
];

type Locale = 'zh-CN' | 'en' | 'zh-HK' | 'es' | 'hi';
const LOCALES: { id: Locale; label: string; name: string }[] = [
  { id: 'zh-CN', label: '简', name: '简体中文' },
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'zh-HK', label: '繁', name: '繁體中文（香港）' },
  { id: 'es', label: 'ES', name: 'Español' },
  { id: 'hi', label: 'HI', name: 'हिन्दी' },
];

interface CopyRow {
  key: string;
  label: string;
  strings: Record<Locale, string>;
}

/** Source: docs/12-voice-and-i18n.md §4, cross-checked against tp-app slang files. */
const COPY_ROWS: CopyRow[] = [
  { key: 'connect', label: '连接', strings: { 'zh-CN': '连接', en: 'Connect', 'zh-HK': '連線', es: 'Conectar', hi: 'कनेक्ट करें' } },
  { key: 'connecting', label: '连接中', strings: { 'zh-CN': '连接中…', en: 'Connecting…', 'zh-HK': '連線中…', es: 'Conectando…', hi: 'कनेक्ट हो रहा है…' } },
  { key: 'connected', label: '已连接', strings: { 'zh-CN': '已连接', en: 'Connected', 'zh-HK': '已連線', es: 'Conectado', hi: 'कनेक्टेड' } },
  { key: 'disconnect', label: '断开连接', strings: { 'zh-CN': '断开连接', en: 'Disconnect', 'zh-HK': '中斷連線', es: 'Desconectar', hi: 'डिस्कनेक्ट करें' } },
  { key: 'nodes', label: '节点', strings: { 'zh-CN': '节点', en: 'Nodes', 'zh-HK': '節點', es: 'Nodos', hi: 'नोड' } },
  { key: 'me', label: '我的', strings: { 'zh-CN': '我的', en: 'Me', 'zh-HK': '我的', es: 'Perfil', hi: 'मेरा' } },
  { key: 'search.placeholder', label: '搜索占位', strings: { 'zh-CN': '搜索国家、城市或节点', en: 'Search countries, cities or nodes', 'zh-HK': '搜尋國家、城市或節點', es: 'Buscar países, ciudades o nodos', hi: 'देश, शहर या नोड खोजें' } },
  { key: 'error.retry', label: '连接失败重试', strings: { 'zh-CN': '连接失败，请重试', en: "Couldn't connect. Try again.", 'zh-HK': '連線失敗，請重試', es: 'No se pudo conectar. Inténtalo de nuevo.', hi: 'कनेक्ट नहीं हो सका। फिर से कोशिश करें।' } },
  { key: 'plans', label: '套餐', strings: { 'zh-CN': '套餐', en: 'Plans', 'zh-HK': '套餐', es: 'Planes', hi: 'प्लान' } },
  { key: 'redeem.code', label: '兑换码', strings: { 'zh-CN': '兑换码', en: 'Redeem code', 'zh-HK': '兌換碼', es: 'Código de canje', hi: 'रिडीम कोड' } },
  { key: 'invite', label: '邀请好友', strings: { 'zh-CN': '邀请好友', en: 'Invite friends', 'zh-HK': '邀請好友', es: 'Invitar amigos', hi: 'दोस्तों को आमंत्रित करें' } },
];

const HOME_LABEL: Record<Locale, string> = { 'zh-CN': '首页', en: 'Home', 'zh-HK': '首頁', es: 'Inicio', hi: 'होम' };

const t = (key: string, locale: Locale) => COPY_ROWS.find((r) => r.key === key)?.strings[locale] ?? '';

const NUMBER_RULES: { rule: string; example: string }[] = [
  { rule: '阿拉伯数字，数字与单位之间一个空格', example: '延迟 38 ms · 流量 12.4 GB' },
  { rule: '单位用国际缩写，大小写固定', example: 'ms · MB · GB · Mbps' },
  { rule: '千位加逗号，小数最多一位', example: '1,204 ms · 12.4 GB' },
  { rule: '中文与数字、英文之间加一个空格', example: '8 台设备 · 基于 WireGuard' },
  { rule: '计时 hh:mm:ss，全部 tabular-nums', example: '00:12:36' },
  { rule: '兑换码 / IP 用等宽，每 4 位一组', example: 'FZ3K 9QMA 7PLD · 10.8.0.2' },
  { rule: '价格：货币符号 + 空格 + 金额，周期用「/」', example: '¥ 28 / 月 · US$ 3.99 / mo' },
];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function LocalizedMock({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('home');
  const [connected, setConnected] = useState(true);
  return (
    <div lang={locale} className="mx-auto flex w-full max-w-[22rem] flex-col overflow-hidden rounded-2xl border border-border-default bg-bg-canvas shadow-level-2">
      <div className="flex flex-col items-center gap-5 px-5 pt-8 pb-6">
        <ConnectionButton
          state={connected ? 'connected' : 'disconnected'}
          label={connected ? t('connected', locale) : t('connect', locale)}
          elapsed={connected ? '00:12:36' : undefined}
          onClick={() => setConnected((c) => !c)}
        />
        <Button variant={connected ? 'secondary' : 'primary'} size="sm" onClick={() => setConnected((c) => !c)}>
          {connected ? t('disconnect', locale) : t('connect', locale)}
        </Button>
        <SearchBar value={query} onChange={setQuery} placeholder={t('search.placeholder', locale)} aria-label={t('search.placeholder', locale)} />
      </div>
      <TabBar
        active={tab}
        onChange={setTab}
        items={[
          { key: 'home', label: HOME_LABEL[locale], icon: House },
          { key: 'nodes', label: t('nodes', locale), icon: Globe },
          { key: 'me', label: t('me', locale), icon: User },
        ]}
      />
    </div>
  );
}

function ClaimList({ kind }: { kind: 'can' | 'cannot' }) {
  const ok = kind === 'can';
  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1">
      <div
        className={cn(
          'flex items-center gap-2 border-b px-4 py-2.5 text-sm font-semibold',
          ok ? 'border-status-success-border bg-status-success-bg text-status-success-fg' : 'border-status-error-border bg-status-error-bg text-status-error-fg',
        )}
      >
        <span className={cn('flex size-5 items-center justify-center rounded-full text-white', ok ? 'bg-status-success-solid' : 'bg-status-error-solid')} aria-hidden>
          {ok ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
        </span>
        {ok ? '可宣称' : '不可宣称'}
        <span className="font-medium">{ok ? 'What we can claim' : "What we don't claim"}</span>
      </div>
      <ul className="divide-y divide-border-subtle">
        {ok
          ? CAN_CLAIM.map((c) => (
              <li key={c.name} className="px-4 py-3">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-fg-primary">
                  {c.name}
                  {c.note && (
                    <Pill tone="warning" size="sm">
                      {c.note}
                    </Pill>
                  )}
                </p>
                <p className="mt-1 text-sm leading-6 text-fg-secondary">
                  「{c.zh}」 <span className="text-fg-muted">/ {c.en}</span>
                </p>
              </li>
            ))
          : CANNOT_CLAIM.map((c) => (
              <li key={c.name} className="px-4 py-3">
                <p className="text-sm font-medium text-fg-primary line-through decoration-status-error-solid/60">{c.name}</p>
                <p className="mt-1 text-sm leading-6 text-fg-secondary">{c.why}</p>
              </li>
            ))}
      </ul>
    </div>
  );
}

function ToneSample({ children, bad }: { children: string; bad?: boolean }) {
  return (
    <p className={cn('max-w-[18rem] text-center text-title-sm', bad ? 'text-fg-secondary' : 'text-fg-primary')} lang="zh-CN">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function VoicePage() {
  const [locale, setLocale] = useState<Locale>('zh-CN');

  return (
    <>
      <PageHeader
        eyebrow="品牌 · Brand"
        title="语调与文案"
        en="Voice & Tone"
        description="直接、可信、克制。一标题一句话，只说做得到的事。zh-CN 是源语言，en、zh-HK、es、hi 由此翻译；这一页是五语言 UI 文案的对照表与写作规则。"
        actions={
          <ButtonLink to="/patterns/connection" variant="outline" size="md">
            连接流程文案 →
          </ButtonLink>
        }
      />

      {/* ------------------------------------------------------------ */}
      <Section id="principles" title="原则" en="Principles" description="三个词，六条检查项。写完一句文案，对照右边的「不做」一列，命中任何一条就改。">
        <Grid cols={3} gap="md">
          {PRINCIPLES.map((p) => (
            <div key={p.en} className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-level-1">
              <p className="text-title-md text-fg-primary">
                {p.title} <span className="text-headline font-medium text-fg-muted">{p.en}</span>
              </p>
              <p className="mt-2 text-sm leading-6 text-fg-secondary">{p.body}</p>
            </div>
          ))}
        </Grid>
        <DocTable
          caption="语调检查表"
          head={
            <>
              <th className="w-40">原则</th>
              <th>做</th>
              <th>不做</th>
            </>
          }
        >
          {TONE_ROWS.map((r) => (
            <tr key={r.rule} className="transition-colors hover:bg-bg-surface-hover">
              <td className="font-medium text-fg-primary">{r.rule}</td>
              <td className="text-fg-primary">
                <span className="mr-1.5 inline-flex size-4 items-center justify-center rounded-full bg-status-success-solid align-[-2px] text-white" aria-hidden>
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                {r.good}
              </td>
              <td className="text-fg-secondary">
                <span className="mr-1.5 inline-flex size-4 items-center justify-center rounded-full bg-status-error-solid align-[-2px] text-white" aria-hidden>
                  <X className="size-2.5" strokeWidth={3} />
                </span>
                {r.bad}
              </td>
            </tr>
          ))}
        </DocTable>
        <Callout tone="info" title="标点">
          中文用全角标点；中英文、中文与数字之间加一个空格；省略号用单字符「…」；不用感叹号。英文错误文案用缩略（Couldn't）保持口语，省略号同样用「…」。
        </Callout>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="claims" title="可宣称 / 不可宣称" en="Claims" description="只宣称真实存在的能力。左列的表述可以直接用在官网、商店页与 App 内；右列的功能没有上线，任何渠道都不得暗示。">
        <Grid cols={2} gap="md">
          <ClaimList kind="can" />
          <ClaimList kind="cannot" />
        </Grid>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="ui-copy" title="五语言 UI 文案" en="UI Strings" description="核心界面文案对照。zh-HK 用香港用词（連線、搜尋、網絡），不是简繁机械转换；es 用中性西班牙语、第二人称 tú；hi 动作按钮用敬语「करें」，外来词保留音译。">
        <Preview
          background="canvas"
          label="多语言界面预览"
          toolbar={
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              spacing={2}
              value={locale}
              onValueChange={(v) => v && setLocale(v as Locale)}
              aria-label="选择语言"
            >
              {LOCALES.map((l) => (
                <ToggleGroupItem key={l.id} value={l.id} aria-label={l.name}>
                  {l.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          }
        >
          <LocalizedMock key={locale} locale={locale} />
        </Preview>
        <DocTable
          caption="五语言 UI 文案对照"
          head={
            <>
              <th className="w-28">键</th>
              <th>zh-CN</th>
              <th>en</th>
              <th>zh-HK</th>
              <th>es</th>
              <th>hi</th>
            </>
          }
        >
          {COPY_ROWS.map((r) => (
            <tr key={r.key} className="transition-colors hover:bg-bg-surface-hover">
              <td>
                <p className="font-medium text-fg-primary">{r.label}</p>
                <p className="font-mono text-[11px] text-fg-muted">{r.key}</p>
              </td>
              <td className="text-fg-primary" lang="zh-CN">
                {r.strings['zh-CN']}
              </td>
              <td className="text-fg-primary" lang="en">
                {r.strings.en}
              </td>
              <td className="text-fg-primary" lang="zh-HK">
                {r.strings['zh-HK']}
              </td>
              <td className="text-fg-primary" lang="es">
                {r.strings.es}
              </td>
              <td className="text-fg-primary" lang="hi">
                {r.strings.hi}
              </td>
            </tr>
          ))}
        </DocTable>
        <SubSection title="长度预算" en="Length budget" description="es 平均比中文长 40–60%，hi 的「कनेक्ट हो रहा है…」需要两行。">
          <Prose>
            <ul>
              <li>Tab 标签：zh-CN 2 字；es / hi 最多 10 字符，超出改图标 + 短词。</li>
              <li>按钮 md：zh-CN ≤ 6 字；不允许换行，需截断前先改文案。</li>
              <li>连接状态标题 display-sm：行高 40 已为两行 hi 预留。</li>
              <li>Toast：≤ 20 字，允许两行。</li>
              <li>实现：App 用 slang（<code>lib/core/i18n/*.i18n.json</code>），官网用 next-intl（<code>messages/&lt;locale&gt;/*.json</code>），键名与本表一致；新增键先登记再翻译。</li>
            </ul>
          </Prose>
        </SubSection>
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="tone" title="语气示例" en="Tone" description="同一个场景的两种写法。左边是 TP VPN 的声音。">
        <DoDont
          do={<ToneSample>连接失败，请重试</ToneSample>}
          dont={<ToneSample bad>哎呀，出错啦！</ToneSample>}
          doCaption="说清发生了什么、下一步做什么。en：Couldn't connect. Try again."
          dontCaption="拟人化与感叹号都不能替代信息；用户想知道怎么办。"
          previewClassName="bg-bg-surface"
        />
        <DoDont
          do={<ToneSample>已连接</ToneSample>}
          dont={<ToneSample bad>太棒了！你已经安全了！</ToneSample>}
          doCaption="状态就是标题：两个字，display-sm，绿色状态点。"
          dontCaption="不承诺「安全」这种无法度量的结果，也不庆祝。"
          previewClassName="bg-bg-surface"
        />
        <DoDont
          do={<ToneSample>智能选路，自动连接最快节点</ToneSample>}
          dont={<ToneSample bad>军事级加密，全球最快 VPN</ToneSample>}
          doCaption="一标题一句话，说的是真实功能。"
          dontCaption="「军事级」「全球最快」是绝对化表述，任何渠道都不用。"
          previewClassName="bg-bg-surface"
        />
      </Section>

      {/* ------------------------------------------------------------ */}
      <Section id="numbers" title="数字与单位" en="Numbers & Units" description="数字是 VPN 界面里最常变的内容：延迟、网速、流量、计时、设备数、价格。格式统一，才能对齐。">
        <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
          <DocTable
            caption="数字与单位格式"
            head={
              <>
                <th>规则</th>
                <th className="w-56">示例</th>
              </>
            }
          >
            {NUMBER_RULES.map((r) => (
              <tr key={r.rule} className="transition-colors hover:bg-bg-surface-hover">
                <td className="text-fg-primary">{r.rule}</td>
                <td className="font-mono text-[13px] text-fg-secondary tnum">{r.example}</td>
              </tr>
            ))}
          </DocTable>
          <div className="my-6 rounded-lg border border-border-default bg-bg-surface p-5 shadow-level-1">
            <p className="eyebrow text-fg-muted">本次连接</p>
            <p className="mt-2 text-numeric-lg text-fg-primary tnum">00:12:36</p>
            <dl className="mt-4 divide-y divide-border-subtle">
              {[
                ['延迟', '38', 'ms'],
                ['下载', '86.4', 'Mbps'],
                ['已用流量', '12.4', 'GB'],
                ['设备', '3 / 8', '台'],
              ].map(([k, v, u]) => (
                <div key={k} className="flex items-baseline justify-between py-2">
                  <dt className="text-sm text-fg-secondary">{k}</dt>
                  <dd className="flex items-baseline gap-1">
                    <span className="text-numeric-sm text-fg-primary tnum">{v}</span>
                    <span className="text-label-sm text-fg-secondary">{u}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 font-mono text-mono text-fg-secondary">FZ3K 9QMA 7PLD</p>
          </div>
        </div>
      </Section>
    </>
  );
}
