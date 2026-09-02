import { CountryList, LatencyText, SignalBars, Tag, sceneLabel, type SceneTone } from '@tpvpn/ui';
import { Callout, DocTable, Grid, PageHeader, Preview, Prose, Section, TokenTable } from '@/components/docs';
import { token, tokenReference } from '@/lib/tokens';
import { EmptySearch, EmptyUnsubscribed, NODES, NodeRow, PickerDemo, SCENES, SkeletonRows } from './_parts/NodePicker';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const SCENE_ROWS: { tone: SceneTone; en: string; icon: string; meaning: string }[] = [
  { tone: 'auto', en: 'Auto', icon: 'shield-check', meaning: '智能选路的默认线路：自动选择最快节点。' },
  { tone: 'game', en: 'Gaming', icon: 'gamepad-2', meaning: '低延迟、低丢包优先的游戏线路。' },
  { tone: 'ai', en: 'AI', icon: 'sparkles', meaning: '面向 AI 服务的线路。' },
  { tone: 'exchange', en: 'Exchange', icon: 'arrow-left-right', meaning: '面向交易所的线路。' },
];

const LEGEND: { ms: number; label: string; range: string; tone: 'good' | 'fair' | 'poor' | 'idle' }[] = [
  { ms: 42, label: '良好', range: '< 80 ms', tone: 'good' },
  { ms: 150, label: '一般', range: '80–180 ms', tone: 'fair' },
  { ms: 230, label: '较差', range: '> 180 ms', tone: 'poor' },
  { ms: 0, label: '未测 / 超时', range: '显示「—」', tone: 'idle' },
];

const LATENCY_TOKEN_ROWS = (['good', 'fair', 'poor'] as const).flatMap((t) => [
  { name: `color.latency.${t}`, value: token(`color.latency.${t}`), reference: tokenReference(`color.latency.${t}`), preview: 'color' as const, description: { good: '信号格 · < 80 ms', fair: '信号格 · 80–180 ms', poor: '信号格 · > 180 ms' }[t] },
  { name: `color.latency.${t}-fg`, value: token(`color.latency.${t}-fg`), reference: tokenReference(`color.latency.${t}-fg`), preview: 'color' as const, description: '延迟文字（700 阶，白底 ≥ 4.5:1）' },
]);
LATENCY_TOKEN_ROWS.push({ name: 'color.latency.idle', value: token('color.latency.idle'), reference: tokenReference('color.latency.idle'), preview: 'color', description: '未点亮的信号格' });

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function NodesPage() {
  return (
    <>
      <PageHeader
        eyebrow="模式 · Patterns"
        title="节点列表"
        en="Nodes"
        description="搜索、场景筛选、按国家 / 地区分组、按延迟排序与着色——一个让用户 3 秒内选到合适节点的列表。所有延迟颜色规则全产品统一。"
      />

      <Section id="anatomy" title="结构与演示" en="Anatomy" description="自上而下：SearchBar（sticky）→ 场景筛选 → 当前节点 → 推荐（智能选路置顶）→ 全部。试试搜索「东京」、「jp」或一个不存在的名字。">
        <Prose>
          <ol>
            <li>
              <code>SearchBar</code>，占位「搜索国家、城市或节点」，随列表滚动吸顶。
            </li>
            <li>场景筛选行（全部 / 自动最优 / 游戏 / AI / 交易所），单选，横向可滚动。</li>
            <li>
              「当前节点」置顶一行，<code>selected</code> 态；「推荐」区「智能选路」用地球图标的 <code>NodeCard</code> 置顶。
            </li>
            <li>
              分组小标用 overline；组内用 <code>CountryListItem</code>（圆旗 40 · 名称 · Tag · 延迟 / 丢包 / 负载 · chevron）。
            </li>
            <li>底部 TabBar 始终可见。</li>
          </ol>
        </Prose>
        <PickerDemo />
      </Section>

      <Section id="search" title="搜索、筛选与排序" en="Search · filter · sort">
        <Prose>
          <ul>
            <li>搜索匹配国家 / 地区名、城市名、ISO 代码与节点编号，不区分大小写；输入即筛选，无需回车。</li>
            <li>场景筛选是单选：再次点击已选项回到「全部」。搜索与筛选同时生效。</li>
            <li>
              默认按延迟升序；带「优质节点」徽标的排在前面。分组顺序：当前节点 → 推荐 → 全部。
            </li>
            <li>
              元数据三段：延迟 <code>42 ms</code> · 丢包 <code>0.1%</code> · 负载 <code>35%</code>，数字 tabular；负载 &gt; 80% 用 amber 文字，&gt; 95% 用 red。
            </li>
            <li>清除搜索后恢复上一次的筛选与滚动位置。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="latency" title="延迟着色" en="Latency colouring" description="< 80 ms 绿 · 80–180 ms 黄 · > 180 ms 红。文字取 700 阶保证白底对比度，信号格取 500 阶。">
        <Grid cols={4} gap="sm" className="my-6">
          {LEGEND.map((item) => (
            <div key={item.tone} className="rounded-lg border border-border-default bg-bg-surface p-4 shadow-level-1">
              <div className="flex items-center justify-between">
                <LatencyText ms={item.ms} className="text-numeric-sm" />
                <SignalBars latencyMs={item.ms} />
              </div>
              <p className="mt-3 text-sm font-medium text-fg-primary">{item.label}</p>
              <p className="mt-0.5 text-xs text-fg-muted">
                {item.range} · <code className="font-mono">latency.{item.tone}</code>
              </p>
            </div>
          ))}
        </Grid>
        <DocTable
          caption="延迟着色与信号格规则"
          head={
            <>
              <th>延迟</th>
              <th>文字色</th>
              <th>信号格</th>
              <th>Token</th>
            </>
          }
        >
          {(
            [
              ['< 80 ms', 'good', '4 格'],
              ['80–119 ms', 'fair', '3 格'],
              ['120–180 ms', 'fair', '2 格'],
              ['> 180 ms', 'poor', '1 格'],
              ['超时 / 未测', 'idle', '0 格，显示「—」'],
            ] as const
          ).map(([range, tone, bars]) => {
            const fg = tone === 'idle' ? token('color.fg.muted') : token(`color.latency.${tone}-fg`);
            const fill = token(`color.latency.${tone}`);
            return (
              <tr key={range}>
                <td className="text-fg-primary tabular">{range}</td>
                <td>
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 rounded-full ring-hairline" style={{ background: fg }} aria-hidden />
                    <code className="font-mono text-[12px] text-fg-secondary uppercase">{fg}</code>
                  </span>
                </td>
                <td>
                  <span className="inline-flex items-center gap-2 text-fg-secondary">
                    <span className="size-3 rounded-full ring-hairline" style={{ background: fill }} aria-hidden />
                    {bars}
                  </span>
                </td>
                <td>
                  <code className="font-mono text-[12px] text-fg-brand">color.latency.{tone}{tone === 'idle' ? '' : ' / -fg'}</code>
                </td>
              </tr>
            );
          })}
        </DocTable>
        <Prose>
          <p>
            <code>LatencyText</code> 与 <code>SignalBars</code> 共用 <code>latencyTone()</code> / <code>latencyBars()</code>（<code>@tpvpn/ui</code> 导出），
            延迟未知或 ≤ 0 时显示「—」且 0 格。颜色不是唯一信息载体：数字与「ms」单位始终可见，信号格带 <code>aria-label="延迟 42 ms"</code>。
          </p>
        </Prose>
        <TokenTable rows={LATENCY_TOKEN_ROWS} caption="延迟色 token" />
      </Section>

      <Section id="scenes" title="场景标签" en="Scene tags" description="四个场景 = 四种线路。浅底（50 阶）深字（700 阶），游戏场景唯一取 mint-800 以满足对比度。">
        <Preview label="场景标签预览" background="surface">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SCENES.map((s) => (
                <Tag key={s} tone={s}>
                  {sceneLabel[s]}
                </Tag>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SCENES.map((s) => (
                <Tag key={s} tone={s} size="md">
                  {sceneLabel[s]}
                </Tag>
              ))}
            </div>
          </div>
        </Preview>
        <DocTable
          caption="场景标签语义"
          head={
            <>
              <th>tone</th>
              <th>文案</th>
              <th>图标</th>
              <th>底 / 字</th>
              <th>含义</th>
            </>
          }
        >
          {SCENE_ROWS.map((row) => (
            <tr key={row.tone}>
              <td>
                <code className="font-mono text-[13px] text-fg-brand">{row.tone}</code>
              </td>
              <td className="text-fg-primary">
                {sceneLabel[row.tone]} <span className="text-fg-muted">{row.en}</span>
              </td>
              <td>
                <code className="font-mono text-[12px] text-fg-secondary">{row.icon}</code>
              </td>
              <td>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-3 rounded-full ring-hairline" style={{ background: token(`color.scene.${row.tone}.bg`) }} aria-hidden />
                  <span className="size-3 rounded-full ring-hairline" style={{ background: token(`color.scene.${row.tone}.fg`) }} aria-hidden />
                  <code className="font-mono text-[12px] text-fg-secondary">
                    {tokenReference(`color.scene.${row.tone}.bg`)?.replace(/[{}]/g, '').replace('color.', '')} /{' '}
                    {tokenReference(`color.scene.${row.tone}.fg`)?.replace(/[{}]/g, '').replace('color.', '')}
                  </code>
                </span>
              </td>
              <td className="text-fg-secondary">{row.meaning}</td>
            </tr>
          ))}
        </DocTable>
        <Prose>
          <p>
            标签只做展示，不可点击；筛选交给顶部的筛选行。一个节点最多两枚标签：「优质节点」（brand）在前，场景在后。
          </p>
        </Prose>
      </Section>

      <Section id="selection" title="选中与当前节点" en="Selection" description="选中态：左侧 3px 蓝条 + 浅蓝底，chevron 变蓝，按钮带 aria-pressed；「当前节点」永远置顶一行。">
        <Preview label="选中态预览" background="surface" padded={false} className="p-4 sm:p-8">
          <CountryList className="w-full max-w-sm" role="list">
            <NodeRow node={NODES[0]!} selected onSelect={() => {}} />
            <NodeRow node={NODES[1]!} selected={false} onSelect={() => {}} />
          </CountryList>
        </Preview>
        <TokenTable
          caption="选中态 token"
          rows={[
            { name: 'color.action.selected.bg', value: token('color.action.selected.bg'), reference: tokenReference('color.action.selected.bg'), preview: 'color', description: '选中行背景' },
            { name: 'color.action.selected.indicator', value: token('color.action.selected.indicator'), reference: tokenReference('color.action.selected.indicator'), preview: 'color', description: '左侧 3px 指示条' },
            { name: 'color.action.selected.fg', value: token('color.action.selected.fg'), reference: tokenReference('color.action.selected.fg'), preview: 'color', description: '选中行强调文字 / chevron' },
          ]}
        />
        <Prose>
          <ul>
            <li>
              点击整行即选中，行高 72px 满足触控；选中后不弹确认，「当前节点」行立即更新并可回到首页连接。
            </li>
            <li>只有一个选中项；「智能选路」也是可选项，选中时「当前节点」显示地球图标卡片。</li>
            <li>
              已连接时切换节点 = 以新节点重新连接，首页按钮进入「连接中…」。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="empty" title="空态" en="Empty states" description="两种空态各有一个动作：搜索无结果 → 清除搜索；无套餐 → 查看套餐。图标 48px 用 fg.placeholder，标题 headline，说明 body-sm。">
        <Grid cols={2} className="my-6">
          <Preview label="搜索无结果" background="surface" className="w-full">
            <EmptySearch query="纽约" onReset={() => {}} />
          </Preview>
          <Preview label="未订阅空态" background="surface" className="w-full">
            <EmptyUnsubscribed />
          </Preview>
        </Grid>
        <Prose>
          <p>
            无结果时保留输入内容并在标题里回显（「没有找到「纽约」」），不清空搜索框；筛选行保持可用，用户可以只改场景。
          </p>
        </Prose>
      </Section>

      <Section id="loading" title="加载与刷新" en="Loading & refresh">
        <Preview label="骨架屏行" background="surface" padded={false} className="p-4 sm:p-8">
          <div className="w-full max-w-sm">
            <SkeletonRows rows={3} />
          </div>
        </Preview>
        <Prose>
          <ul>
            <li>
              首屏用骨架行（<code>Skeleton</code> 或 <code>LoadingState variant="skeleton"</code>），布局与真实行一致：40px 圆 + 两行文字 + chevron，行高 72px。
            </li>
            <li>300 ms 内完成则不显示骨架；完成后 800 ms（slower）交叉淡入内容。</li>
            <li>
              骨架容器 <code>role="status" aria-busy="true"</code>，只宣告一次「正在加载节点」，不逐行宣告。
            </li>
          </ul>
        </Prose>
        <Callout title="下拉刷新">
          下拉刷新只重测延迟：顶部显示 20px spinner，<strong>列表不清空、不回到骨架</strong>，数字就地更新（信号格 200ms 过渡色）。
          刷新失败用 Toast「刷新失败，请重试」，列表保留旧数据。
        </Callout>
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              列表用 <code>role="list"</code> / <code>role="listitem"</code>（或原生 <code>ul</code> / <code>li</code>）包住行按钮，读屏器能报「第 3 项，共 8 项」。
            </li>
            <li>
              行是 <code>&lt;button aria-pressed&gt;</code>：选中态被朗读为「已按下」，不依赖蓝条颜色。
            </li>
            <li>
              搜索区 <code>role="search"</code>，清除按钮 <code>aria-label="清除搜索"</code>；筛选行是 Radix ToggleGroup，方向键切换、<code>aria-label="按场景筛选"</code>。
            </li>
            <li>
              延迟用数字 + 单位表达，信号格是 <code>role="img"</code> 带「延迟 42 ms」；颜色只是增强。
            </li>
            <li>触控目标：行高 72px、筛选项 36px 高 ≥ 44px 点击区（含间距）；焦点环内嵌避免被裁切。</li>
            <li>加载时 <code>aria-busy</code>，结果数变化通过标题旁的计数被动读出，不打断输入。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="platform" title="Flutter / iOS 对应" en="Flutter / iOS">
        <Callout title="Flutter / iOS 对应">
          <p>
            <strong>Flutter</strong>：行用 forui <code>FTile</code>（或 <code>ListTile</code>）+ 左侧 <code>Container(width: 3, color: TpTokens.colorActionSelectedIndicator)</code>；
            搜索框 <code>FTextField</code> 前缀图标、<code>TextInputAction.search</code>；延迟色用 <code>TpTokens.colorLatencyGoodFg</code> 等；
            <code>RefreshIndicator</code> 只刷新数据不重建列表。
          </p>
          <p>
            <strong>iOS（SwiftUI）</strong>：<code>List</code> + <code>.searchable(text:)</code>，选中行 <code>.listRowBackground(Color(TPTokens.colorActionSelectedBg))</code>；
            信号格自绘 4 个 <code>RoundedRectangle</code>，颜色 <code>TPTokens.colorLatencyGood</code> 等；<code>.refreshable {}</code> 下拉刷新。
          </p>
        </Callout>
      </Section>
    </>
  );
}
