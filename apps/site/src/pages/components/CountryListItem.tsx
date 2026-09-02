import { useState } from 'react';
import { CountryList, CountryListItem, Tag } from '@tpvpn/ui';
import {
  Callout,
  DocTable,
  DoDont,
  Grid,
  PageHeader,
  Preview,
  Prose,
  PropsTable,
  Section,
  SubSection,
  TokenTable,
} from '@/components/docs';
import { token } from '@/lib/tokens';
import { Anatomy } from './_parts/Anatomy';
import { SwitchControl } from './_parts/Controls';
import { COUNTRIES, type CountryEntry } from './_parts/demoData';
import { PlatformHint } from './_parts/PlatformHint';
import { SourceLink } from './_parts/SourceLink';
import { StateTile } from './_parts/StateTile';
import { DART } from './_parts/countryListItemSnippets';

function tagFor(entry: CountryEntry) {
  return entry.tag ? <Tag tone={entry.tag.tone}>{entry.tag.label}</Tag> : undefined;
}

const JP = COUNTRIES[1]!;

function LivePreview() {
  const [selected, setSelected] = useState<string>('jp');
  const [showTags, setShowTags] = useState(true);
  const [interactive, setInteractive] = useState(true);

  const sample = COUNTRIES.slice(0, 2);
  const code = `import { CountryList, CountryListItem, Tag } from '@tpvpn/ui';

const [selected, setSelected] = useState('${selected}');

<CountryList>
${sample
  .map(
    (c) => `  <CountryListItem
    flagCode="${c.code}"
    name="${c.name}"${showTags && c.tag ? `\n    tag={<Tag tone="${c.tag.tone}">${c.tag.label}</Tag>}` : ''}
    latencyMs={${c.latencyMs}}
    lossPct={${c.lossPct}}
    loadPct={${c.loadPct}}
    selected={selected === '${c.code}'}${interactive ? `\n    onClick={() => setSelected('${c.code}')}` : ''}
  />`,
  )
  .join('\n')}
  {/* … */}
</CountryList>`;

  return (
    <Preview
      label="国家列表预览"
      code={code}
      padded
      centered={false}
      toolbar={
        <>
          <SwitchControl label="显示标签" checked={showTags} onCheckedChange={setShowTags} />
          <SwitchControl label="可选择" checked={interactive} onCheckedChange={setInteractive} />
        </>
      }
    >
      <CountryList className="mx-auto w-full max-w-[420px]">
        {COUNTRIES.map((c) => (
          <CountryListItem
            key={c.code}
            flagCode={c.code}
            name={c.name}
            tag={showTags ? tagFor(c) : undefined}
            latencyMs={c.latencyMs}
            lossPct={c.lossPct}
            loadPct={c.loadPct}
            selected={selected === c.code}
            onClick={interactive ? () => setSelected(c.code) : undefined}
          />
        ))}
      </CountryList>
    </Preview>
  );
}

function SelectionDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = COUNTRIES.find((c) => c.code === selected);
  return (
    <Preview label="选择演示" padded centered={false}>
      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-4">
        <CountryList>
          {COUNTRIES.slice(0, 4).map((c) => (
            <CountryListItem
              key={c.code}
              flagCode={c.code}
              name={c.name}
              tag={tagFor(c)}
              latencyMs={c.latencyMs}
              lossPct={c.lossPct}
              loadPct={c.loadPct}
              selected={selected === c.code}
              onClick={() => setSelected((s) => (s === c.code ? null : c.code))}
            />
          ))}
        </CountryList>
        <p className="text-center text-caption text-fg-muted" aria-live="polite">
          {current ? (
            <>
              已选择：<span className="text-fg-primary">{current.name}</span>（再次点击取消）
            </>
          ) : (
            '未选择任何线路'
          )}
        </p>
      </div>
    </Preview>
  );
}

/** `/components/country-list-item` */
export default function CountryListItemPage() {
  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="国家列表项"
        en="Country List Item"
        description="节点 / 国家列表的一行：圆旗 40、名称、场景标签、延迟 / 丢包 / 负载三段元数据、chevron；选中态左侧 3px 蓝条。"
        actions={<SourceLink path="packages/ui/src/components/tp/country-list-item.tsx" exports={['CountryListItem', 'CountryList']} />}
      />

      <Section id="preview" title="预览" en="Preview" description="六条真实线路（按延迟升序）。传 onClick 时每行是 <button>，点击选中；关闭「可选择」后退化为静态 <div>。">
        <LivePreview />
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <Anatomy
          width={380}
          pins={[
            { n: 1, label: '圆形国旗', note: <>40px（<code>size.flag.lg</code>）· circle-flags · 1px 内描边 · <code>alt</code> = name</>, x: 9, y: -26 },
            { n: 2, label: '名称', note: <><code>headline</code> 16/24 600 · 「国家 · 城市」· 超长截断</>, x: 30, y: -26 },
            { n: 3, label: '标签', note: <><code>tag</code> · 场景 Tag（优选线路 IEPL / 游戏 / AI）· 最多一个</>, x: 52, y: -26 },
            { n: 4, label: '元数据', note: <><code>caption</code> fg-muted · 延迟（着色 + ms）· 丢包 %（1 位小数）· 负载 %（整数）· tabular</>, x: 40, y: 126 },
            { n: 5, label: 'chevron', note: <><code>chevron-right</code> 20 · fg-placeholder，选中时 fg-brand</>, x: 96, y: 126 },
            { n: 6, label: '选中指示', note: <>左侧 3px 圆头蓝条 <code>action.selected.indicator</code> + 底色 <code>action.selected.bg</code></>, x: -3, y: 50 },
          ]}
        >
          <CountryList>
            <CountryListItem flagCode={JP.code} name={JP.name} tag={tagFor(JP)} latencyMs={JP.latencyMs} lossPct={JP.lossPct} loadPct={JP.loadPct} selected />
          </CountryList>
        </Anatomy>
      </Section>

      <Section id="states" title="状态" en="States" description="行高 ≥ 72（country-list-item.height），横向内边距 16；hover slate-50、pressed slate-100，100ms standard。">
        <Grid cols={2}>
          <StateTile label="默认" hint="onClick → <button>" className="px-0 py-0">
            <CountryList className="w-full rounded-none border-0">
              <CountryListItem flagCode="sg" name="新加坡" tag={<Tag tone="ai">AI</Tag>} latencyMs={71} lossPct={0.1} loadPct={52} onClick={() => {}} />
            </CountryList>
          </StateTile>
          <StateTile label="悬停" hint="bg-surface-hover · slate-50" simulated className="px-0 py-0">
            <CountryList className="w-full rounded-none border-0">
              <CountryListItem className="bg-bg-surface-hover" flagCode="sg" name="新加坡" tag={<Tag tone="ai">AI</Tag>} latencyMs={71} lossPct={0.1} loadPct={52} onClick={() => {}} />
            </CountryList>
          </StateTile>
          <StateTile label="按下" hint="bg-surface-pressed · slate-100" simulated className="px-0 py-0">
            <CountryList className="w-full rounded-none border-0">
              <CountryListItem className="bg-bg-surface-pressed" flagCode="sg" name="新加坡" tag={<Tag tone="ai">AI</Tag>} latencyMs={71} lossPct={0.1} loadPct={52} onClick={() => {}} />
            </CountryList>
          </StateTile>
          <StateTile label="选中" hint="selected · 3px 蓝条 + blue-50" className="px-0 py-0">
            <CountryList className="w-full rounded-none border-0">
              <CountryListItem flagCode="sg" name="新加坡" tag={<Tag tone="ai">AI</Tag>} latencyMs={71} lossPct={0.1} loadPct={52} selected onClick={() => {}} />
            </CountryList>
          </StateTile>
          <StateTile label="聚焦" hint="inset shadow-focus（不撑破列表圆角）" simulated className="px-0 py-0">
            <CountryList className="w-full rounded-none border-0">
              <CountryListItem className="[box-shadow:inset_var(--shadow-focus)]" flagCode="sg" name="新加坡" tag={<Tag tone="ai">AI</Tag>} latencyMs={71} lossPct={0.1} loadPct={52} onClick={() => {}} />
            </CountryList>
          </StateTile>
          <StateTile label="静态" hint="无 onClick → <div>，无 hover" className="px-0 py-0">
            <CountryList className="w-full rounded-none border-0">
              <CountryListItem flagCode="sg" name="新加坡" tag={<Tag tone="ai">AI</Tag>} latencyMs={71} lossPct={0.1} loadPct={52} />
            </CountryList>
          </StateTile>
        </Grid>
      </Section>

      <Section id="selection" title="选择" en="Selection" description="单选：同一时刻只有一行 selected；再次点击取消。选中态只靠蓝条与底色，不改字重，避免布局跳动。">
        <SelectionDemo />
      </Section>

      <Section id="tags" title="标签" en="Tags" description="场景标签跟在名称后，用 Tag 组件：优选线路 IEPL（auto）、游戏（game）、AI（ai）。一行只放一个。">
        <Preview label="标签示例" padded centered={false}>
          <CountryList className="mx-auto w-full max-w-[420px]">
            <CountryListItem flagCode="hk" name="中国香港" tag={<Tag tone="auto">优选线路 IEPL</Tag>} latencyMs={24} lossPct={0} loadPct={61} />
            <CountryListItem flagCode="jp" name="日本 · 东京" tag={<Tag tone="game">游戏</Tag>} latencyMs={58} lossPct={0} loadPct={38} />
            <CountryListItem flagCode="sg" name="新加坡" tag={<Tag tone="ai">AI</Tag>} latencyMs={71} lossPct={0.1} loadPct={52} />
            <CountryListItem flagCode="gb" name="英国 · 伦敦" latencyMs={196} lossPct={0.4} loadPct={27} />
          </CountryList>
        </Preview>
      </Section>

      <Section id="meta" title="元数据规则" en="Metadata" description="三段元数据用「·」分隔，全部 tabular 数字，宽度稳定。">
        <DocTable
          caption="元数据格式与着色"
          head={
            <>
              <th>字段</th>
              <th>格式</th>
              <th>着色</th>
              <th>示例</th>
            </>
          }
        >
          <tr>
            <td className="font-mono text-[12px]">latencyMs</td>
            <td>四舍五入整数 + 「ms」；非正数 / 非有限值显示「—」</td>
            <td>&lt; 80 绿 700 · 80–180 黄 700 · &gt; 180 红 700（LatencyText）</td>
            <td className="tnum">延迟 24 ms</td>
          </tr>
          <tr>
            <td className="font-mono text-[12px]">lossPct</td>
            <td>0–100 夹取；整数原样，小数保留 1 位</td>
            <td>不着色</td>
            <td className="tnum">丢包 0.2%</td>
          </tr>
          <tr>
            <td className="font-mono text-[12px]">loadPct</td>
            <td>同 lossPct</td>
            <td>不着色（模式页建议 &gt; 80% amber 由列表层处理）</td>
            <td className="tnum">负载 61%</td>
          </tr>
        </DocTable>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={
            <CountryList className="w-full max-w-[320px]">
              <CountryListItem flagCode="hk" name="中国香港" tag={<Tag tone="auto">优选线路 IEPL</Tag>} latencyMs={24} lossPct={0} loadPct={61} />
              <CountryListItem flagCode="jp" name="日本 · 东京" tag={<Tag tone="game">游戏</Tag>} latencyMs={58} lossPct={0} loadPct={38} />
            </CountryList>
          }
          dont={
            <div className="flex w-full max-w-[320px] flex-col gap-3">
              <CountryListItem className="rounded-lg border border-border-default shadow-level-1" flagCode="hk" name="中国香港" latencyMs={24} lossPct={0} loadPct={61} />
              <CountryListItem className="rounded-lg border border-border-default shadow-level-1" flagCode="jp" name="日本 · 东京" latencyMs={58} lossPct={0} loadPct={38} />
            </div>
          }
          doCaption="用 CountryList 容器：统一圆角、外描边与行间分割线。"
          dontCaption="每行各自成卡片：列表变成一堆卡片，滚动密度低、视觉噪音大（那是 NodeCard 的场景）。"
        />
        <DoDont
          do={
            <CountryList className="w-full max-w-[320px]">
              <CountryListItem flagCode="us" name="美国 · 洛杉矶" tag={<Tag tone="auto">优选线路 IEPL</Tag>} latencyMs={142} lossPct={0.2} loadPct={46} selected onClick={() => {}} />
            </CountryList>
          }
          dont={
            <CountryList className="w-full max-w-[320px]">
              <CountryListItem className="border-2 border-blue-500 font-bold" flagCode="us" name="美国 · 洛杉矶" tag={<Tag tone="auto">优选线路 IEPL</Tag>} latencyMs={142} lossPct={0.2} loadPct={46} onClick={() => {}} />
            </CountryList>
          }
          doCaption="选中态 = 左侧 3px 蓝条 + 浅蓝底 + 蓝色 chevron。"
          dontCaption="加粗描边或改字重表示选中：行高与宽度跳动，列表抖。"
        />
        <DoDont
          do={
            <CountryList className="w-full max-w-[320px]">
              <CountryListItem flagCode="de" name="德国 · 法兰克福" latencyMs={212} lossPct={0.3} loadPct={33} />
            </CountryList>
          }
          dont={
            <CountryList className="w-full max-w-[320px]">
              <CountryListItem
                flagCode="de"
                name="德国 · 法兰克福"
                tag={
                  <span className="flex gap-1">
                    <Tag tone="exchange">交易所</Tag>
                    <Tag tone="ai">AI</Tag>
                    <Tag tone="brand">推荐</Tag>
                  </span>
                }
                latencyMs={212}
                lossPct={0.3}
                loadPct={33}
              />
            </CountryList>
          }
          doCaption="没有场景就不放标签；名称保持可读。"
          dontCaption="堆标签把名称挤到截断。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              传 <code>onClick</code> 时渲染 <code>&lt;button type="button" aria-pressed={'{selected}'}&gt;</code>，键盘 Space / Enter 触发；聚焦环用{' '}
              <code>inset</code> 阴影绘制，且 <code>focus-visible:z-10</code> 保证不被相邻行遮住。
            </li>
            <li>
              不传 <code>onClick</code> 时是 <code>&lt;div&gt;</code>，只做展示；需要单选语义（listbox / option）时由业务在容器层补充。
            </li>
            <li>
              国旗 <code>alt</code> 直接取 <code>name</code>，不重复朗读代码；chevron 与分隔点 <code>aria-hidden</code>。
            </li>
            <li>行高 ≥ 72，整行可点，触控目标充足；选中态同时有蓝条、底色、chevron 变色三重线索。</li>
            <li>元数据 fg-muted（slate-500）在白底 4.76:1、在选中态 blue-50 底 4.5:1 以上；延迟色取 700 阶。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props">
        <SubSection title="CountryListItem" description="CountryListItemProps = Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> & { … }">
          <PropsTable
            rows={[
              { name: 'flagCode', type: 'string', required: true, description: 'ISO 3166-1 alpha-2（大小写不敏感），渲染 40px 圆旗。' },
              { name: 'name', type: 'string', required: true, description: '显示名称，同时作为国旗 alt。' },
              { name: 'latencyMs', type: 'number', required: true, description: '延迟毫秒，LatencyText 着色。' },
              { name: 'lossPct', type: 'number', required: true, description: '丢包率 0–100。' },
              { name: 'loadPct', type: 'number', required: true, description: '负载 0–100。' },
              { name: 'tag', type: 'React.ReactNode', description: '名称右侧的场景 Tag。' },
              { name: 'selected', type: 'boolean', default: 'false', description: '选中态：左侧 3px 蓝条、blue-50 底、chevron 变蓝；作为 button 时同步 aria-pressed。' },
              { name: 'onClick', type: '() => void', description: '提供时整行渲染为 <button>。' },
              { name: '...props', type: "Omit<React.HTMLAttributes<HTMLElement>, 'onClick'>", description: 'className、id、data-* 等透传到根元素。' },
            ]}
          />
        </SubSection>
        <SubSection title="CountryList" description="容器：圆角 xl、slate-200 外描边、行间 border-subtle 分割线。">
          <PropsTable rows={[{ name: '...props', type: "React.ComponentProps<'div'>", description: 'children 为若干 CountryListItem；className 合并。' }]} />
        </SubSection>
      </Section>

      <Section id="tokens" title="组件 Token" en="Component tokens">
        <TokenTable
          caption="country-list-item.* 组件 token"
          rows={[
            { name: 'country-list-item.height', value: token('country-list-item.height'), description: '最小行高' },
            { name: 'country-list-item.padding-x', value: token('country-list-item.padding-x'), reference: '{space.4}', preview: 'spacing' },
            { name: 'country-list-item.flag-size', value: token('country-list-item.flag-size'), reference: '{size.flag.lg}' },
            { name: 'country-list-item.selected-bg', value: token('country-list-item.selected-bg'), reference: '{color.action.selected.bg}', preview: 'color' },
            { name: 'country-list-item.selected-indicator', value: token('country-list-item.selected-indicator'), reference: '{color.action.selected.indicator}', preview: 'color' },
            { name: 'country-list-item.divider', value: token('country-list-item.divider'), reference: '{color.border.subtle}', preview: 'color' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformHint
          flutter={
            <>
              forui <code>FTile</code> 或自定义 <code>InkWell</code> 行：高 <code>TpTokens.countryListItemHeight</code> 72、圆旗 <code>countryListItemFlagSize</code> 40，选中底色{' '}
              <code>TpTokens.countryListItemSelectedBg</code>，左侧 <code>Container(width: 3, color: TpTokens.countryListItemSelectedIndicator)</code>。
            </>
          }
          ios={
            <>
              <code>List</code> 行或 <code>Button</code> + <code>HStack</code>：<code>.frame(minHeight: TPTokens.countryListItemHeight)</code>、选中{' '}
              <code>.listRowBackground(Color(TPTokens.colorActionSelectedBg))</code> 并在左侧叠 3pt <code>Color(TPTokens.colorActionSelectedIndicator)</code>；
              <code>.accessibilityAddTraits(.isSelected)</code>。
            </>
          }
          dart={DART}
          dartFilename="lib/widgets/country_list_item.dart"
        />
        <Callout tone="info">
          原生端的「丢包」「负载」文字请走 i18n 资源（zh-CN / en / zh-HK / es / hi），组件内不要写死中文。
        </Callout>
      </Section>
    </>
  );
}
