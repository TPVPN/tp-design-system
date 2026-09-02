import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button, CountryList, CountryListItem, SearchBar, Tag } from '@tpvpn/ui';
import {
  Callout,
  DoDont,
  Grid,
  PageHeader,
  Preview,
  Prose,
  PropsTable,
  Section,
  TokenTable,
} from '@/components/docs';
import { token } from '@/lib/tokens';
import { Anatomy } from './_parts/Anatomy';
import { SwitchControl } from './_parts/Controls';
import { COUNTRIES, filterCountries, type CountryEntry } from './_parts/demoData';
import { PlatformHint } from './_parts/PlatformHint';
import { SourceLink } from './_parts/SourceLink';
import { StateTile } from './_parts/StateTile';

const DEFAULT_PLACEHOLDER = '搜索国家、城市或节点';

function tagFor(entry: CountryEntry) {
  return entry.tag ? <Tag tone={entry.tag.tone}>{entry.tag.label}</Tag> : undefined;
}

/** Empty state from docs/10-patterns §2.4: search icon 48 · 「没有找到「{query}」」· 清除搜索. */
function EmptyResult({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center" role="status">
      <Search className="size-12 text-fg-placeholder" strokeWidth={1.5} aria-hidden />
      <p className="text-headline text-fg-primary">没有找到「{query}」</p>
      <p className="text-body-sm text-fg-secondary">换个关键词，或直接浏览全部线路。</p>
      <Button variant="secondary" size="sm" onClick={onClear}>
        清除搜索
      </Button>
    </div>
  );
}

function LivePreview() {
  const [query, setQuery] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [showList, setShowList] = useState(true);
  const results = filterCountries(query);

  const code = `import { useState } from 'react';
import { CountryList, CountryListItem, SearchBar } from '@tpvpn/ui';

const [query, setQuery] = useState('${query.replace(/'/g, "\\'")}');
const results = countries.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));

<SearchBar
  value={query}
  onChange={setQuery}
  onClear={() => setQuery('')}${disabled ? '\n  disabled' : ''}
  aria-label="搜索节点"
/>
<CountryList>
  {results.map((c) => (
    <CountryListItem key={c.code} flagCode={c.code} name={c.name} latencyMs={c.latencyMs} lossPct={c.lossPct} loadPct={c.loadPct} />
  ))}
</CountryList>`;

  return (
    <Preview
      label="搜索栏预览"
      code={code}
      padded
      centered={false}
      toolbar={
        <>
          <SwitchControl label="禁用" checked={disabled} onCheckedChange={setDisabled} />
          <SwitchControl label="结果列表" checked={showList} onCheckedChange={setShowList} />
        </>
      }
    >
      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-3">
        <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} disabled={disabled} aria-label="搜索节点" />
        {showList && (
          <CountryList>
            {results.length > 0 ? (
              results.map((c) => (
                <CountryListItem key={c.code} flagCode={c.code} name={c.name} tag={tagFor(c)} latencyMs={c.latencyMs} lossPct={c.lossPct} loadPct={c.loadPct} />
              ))
            ) : (
              <EmptyResult query={query.trim()} onClear={() => setQuery('')} />
            )}
          </CountryList>
        )}
        <p className="text-center text-caption text-fg-muted tnum" aria-live="polite">
          {query.trim() ? `${results.length} / ${COUNTRIES.length} 条匹配` : '试试输入「东京」「sg」或「香港」'}
        </p>
      </div>
    </Preview>
  );
}

function StaticBar({
  value = '',
  className,
  disabled,
  placeholder,
}: {
  value?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return <SearchBar value={value} onChange={() => {}} className={className} disabled={disabled} placeholder={placeholder} aria-label="搜索节点" />;
}

const DART = `/// 搜索栏：高 44、圆角 12、白底 + slate-200 描边；前置 search 图标 20；有值时显示清除按钮。
class TpSearchBar extends StatelessWidget {
  const TpSearchBar({super.key, required this.controller, this.hintText = '搜索国家、城市或节点', this.onChanged});

  final TextEditingController controller;
  final String hintText;
  final ValueChanged<String>? onChanged;

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<TextEditingValue>(
      valueListenable: controller,
      builder: (context, value, _) => SizedBox(
        height: TpTokens.searchBarHeight, // 44
        child: TextField(
          controller: controller,
          onChanged: onChanged,
          textInputAction: TextInputAction.search,
          style: TpTokens.typographyBodyMd,
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: TpTokens.typographyBodyMd.copyWith(color: TpTokens.colorFgPlaceholder),
            prefixIcon: const Icon(Icons.search_rounded, size: 20, color: TpTokens.searchBarIconFg),
            suffixIcon: value.text.isEmpty
                ? null
                : IconButton(
                    tooltip: '清除搜索',
                    icon: const Icon(Icons.close_rounded, size: 16),
                    onPressed: controller.clear,
                  ),
            filled: true,
            fillColor: TpTokens.searchBarBg,
            contentPadding: const EdgeInsets.symmetric(horizontal: TpTokens.space3),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(TpTokens.searchBarRadius), // 12
              borderSide: const BorderSide(color: TpTokens.searchBarBorder), // slate-200
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(TpTokens.searchBarRadius),
              borderSide: const BorderSide(color: TpTokens.colorBorderFocus, width: 1.5), // blue-500
            ),
          ),
        ),
      ),
    );
  }
}`;

/** `/components/search-bar` */
export default function SearchBarPage() {
  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="搜索栏"
        en="Search Bar"
        description="节点搜索输入：搜索图标、占位「搜索国家、城市或节点」、有值时的清除按钮；受控组件，输入即过滤。"
        actions={<SourceLink path="packages/ui/src/components/tp/search-bar.tsx" exports={['SearchBar']} />}
      />

      <Section id="preview" title="预览" en="Preview" description="受控演示：输入实时过滤下方 CountryList；无结果时展示空态；清除按钮重置并保持焦点。">
        <LivePreview />
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <Anatomy
          width={380}
          pins={[
            { n: 1, label: '搜索图标', note: <>lucide <code>search</code> 20 · fg-muted · 绝对定位左 14 · <code>aria-hidden</code></>, x: 5, y: -32 },
            { n: 2, label: '输入框', note: <><code>&lt;input type="search"&gt;</code> · 高 <code>size.control.md</code> 44 · 圆角 <code>radius.md</code> 12 · <code>body-md</code> · 左右内边距 44</>, x: 50, y: -32 },
            { n: 3, label: '占位文案', note: <>默认「{DEFAULT_PLACEHOLDER}」· fg-placeholder slate-400</>, x: 28, y: 132 },
            { n: 4, label: '清除按钮', note: <>有值时显示 · 28 圆形 · slate-100 底 · <code>aria-label="清除搜索"</code> · 点击后 <code>onChange('')</code> 并重新聚焦</>, x: 95, y: 132 },
          ]}
        >
          <div className="flex flex-col gap-3">
            <StaticBar />
            <StaticBar value="东京" />
          </div>
        </Anatomy>
      </Section>

      <Section id="states" title="状态" en="States" description="外框负责所有状态：hover 描边 slate-300；focus-within 描边 blue-500 + 聚焦环；disabled 用 action.disabled.* 底与描边。">
        <Grid cols={2}>
          <StateTile label="默认" hint="border-default · bg-surface" className="px-5">
            <StaticBar className="w-full" />
          </StateTile>
          <StateTile label="悬停" hint="border-strong" simulated className="px-5">
            <StaticBar className="w-full border-border-strong" />
          </StateTile>
          <StateTile label="聚焦" hint="border-focus + shadow-focus" simulated className="px-5">
            <StaticBar className="w-full border-border-focus shadow-focus" />
          </StateTile>
          <StateTile label="有值" hint="显示清除按钮" className="px-5">
            <StaticBar className="w-full" value="东京" />
          </StateTile>
          <StateTile label="禁用" hint="disabled · action.disabled.*" className="px-5">
            <StaticBar className="w-full" disabled />
          </StateTile>
          <StateTile label="禁用 + 有值" hint="清除按钮同样禁用" className="px-5">
            <StaticBar className="w-full" value="东京" disabled />
          </StateTile>
        </Grid>
      </Section>

      <Section id="clear" title="清除按钮" en="Clear button" description="只有 value 非空时才渲染；点击顺序：onChange('') → onClear?.() → 输入框重新聚焦，方便继续输入。">
        <Prose>
          <ul>
            <li>
              原生 <code>type="search"</code> 自带的 ✕ 已用 <code>::-webkit-search-cancel-button</code> 隐藏，避免出现两个清除按钮。
            </li>
            <li>
              <code>onClear</code> 用于附加副作用（重置过滤、埋点、回滚滚动位置），不必在里面再次 <code>setQuery('')</code>。
            </li>
            <li>
              空态里的「清除搜索」按钮应调用同一个 <code>onClear</code>，两条路径回到同一状态。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="placeholder" title="占位文案规则" en="Placeholder" description="占位文案描述「能搜什么」，不是指令；默认值就是产品文案，除非搜索范围不同否则不要改。">
        <Callout title="「搜索国家、城市或节点」">
          <ul className="list-disc pl-5">
            <li>
              说明可搜索的对象（国家 / 城市 / 节点），不写「请输入…」「点击搜索」这类指令，也不写「输入关键词」这种废话。
            </li>
            <li>
              占位不是标签：屏幕阅读器不可靠地读取它，因此始终传 <code>aria-label</code>（或用可见 <code>&lt;label&gt;</code>）。
            </li>
            <li>
              颜色 fg-placeholder（slate-400，3.0:1）仅允许用于占位；用户输入后文字为 fg-primary。
            </li>
            <li>
              多语言：en「Search country, city or node」· zh-HK「搜尋國家、城市或節點」· es「Buscar país, ciudad o nodo」· hi「देश, शहर या नोड खोजें」——通过{' '}
              <code>placeholder</code> 传入翻译。
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={<StaticBar className="w-full max-w-[300px]" />}
          dont={<StaticBar className="w-full max-w-[300px]" placeholder="请输入关键词" />}
          doCaption="占位「搜索国家、城市或节点」，说明搜索范围。"
          dontCaption="占位改成「请输入关键词」或「Search…」——没有信息量，也丢掉了产品语境。"
          previewClassName="px-4"
        />
        <DoDont
          do={
            <div className="flex w-full max-w-[300px] flex-col gap-2">
              <StaticBar value="东" />
              <CountryList>
                <CountryListItem flagCode="jp" name="日本 · 东京" latencyMs={58} lossPct={0} loadPct={38} />
              </CountryList>
            </div>
          }
          dont={
            <div className="flex w-full max-w-[300px] items-center gap-2">
              <StaticBar value="东" className="min-w-0 flex-1" />
              <Button>搜索</Button>
            </div>
          }
          doCaption="输入即过滤（本地列表），结果随字符实时更新。"
          dontCaption="额外的「搜索」按钮：多一步操作，而且列表在本地，无需提交。"
          previewClassName="px-4"
        />
        <DoDont
          do={
            <div className="w-full max-w-[300px] rounded-lg border border-border-default bg-bg-canvas p-3">
              <StaticBar />
              <p className="mt-3 text-center text-caption text-fg-muted">sticky 顶部，列表在下方滚动</p>
            </div>
          }
          dont={
            <div className="flex w-full max-w-[300px] flex-col gap-2">
              <StaticBar />
              <StaticBar placeholder="搜索游戏节点" />
            </div>
          }
          doCaption="节点页只有一个搜索栏，sticky 在顶部。"
          dontCaption="每个分组一个搜索栏：焦点混乱，用户不知道哪个在过滤什么。"
          previewClassName="px-4"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              外框 <code>role="search"</code> 形成地标；输入框为原生 <code>&lt;input type="search"&gt;</code>，<code>enterKeyHint="search"</code> 让移动键盘显示「搜索」。
            </li>
            <li>
              请传 <code>aria-label</code>（透传到 input）或关联可见 label；占位文案不是可访问名称。
            </li>
            <li>
              清除按钮 <code>aria-label="清除搜索"</code>，28px 视觉尺寸但位于 44px 高的外框内；键盘 Tab 可达，Enter / Space 触发后焦点回到输入框。
            </li>
            <li>
              聚焦环 <code>shadow-focus</code> 挂在外框（<code>focus-within</code>），不管焦点在输入框还是清除按钮都可见。
            </li>
            <li>
              结果数量变化用 <code>aria-live="polite"</code> 播报（见预览下方文字）；空态容器 <code>role="status"</code>。
            </li>
            <li>禁用态同时禁用输入框与清除按钮，并通过 data-disabled 换配色。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props" description="SearchBarProps = Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'size'> & { value, onChange, placeholder?, onClear?, inputClassName? }">
        <PropsTable
          rows={[
            { name: 'value', type: 'string', required: true, description: '受控值。' },
            { name: 'onChange', type: '(value: string) => void', required: true, description: '输入或清除时回调新字符串（不是事件对象）。' },
            { name: 'placeholder', type: 'string', default: `'${DEFAULT_PLACEHOLDER}'`, description: '占位文案；多语言时传翻译。' },
            { name: 'onClear', type: '() => void', description: '清除按钮把值重置为 "" 之后调用。' },
            { name: 'disabled', type: 'boolean', default: 'false', description: '禁用输入与清除按钮，外框换 action.disabled.* 配色。' },
            { name: 'className', type: 'string', description: '附加到外框（role="search" 容器）。' },
            { name: 'inputClassName', type: 'string', description: '附加到内部 input。' },
            { name: '...props', type: "Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'size'>", description: 'aria-label、autoFocus、name、onKeyDown 等透传到 input。' },
          ]}
        />
      </Section>

      <Section id="tokens" title="组件 Token" en="Component tokens">
        <TokenTable
          caption="search-bar.* 组件 token"
          rows={[
            { name: 'search-bar.height', value: token('search-bar.height'), reference: '{size.control.md}' },
            { name: 'search-bar.radius', value: token('search-bar.radius'), reference: '{radius.md}', preview: 'radius' },
            { name: 'search-bar.bg', value: token('search-bar.bg'), reference: '{color.bg.surface}', preview: 'color' },
            { name: 'search-bar.border', value: token('search-bar.border'), reference: '{color.border.default}', preview: 'color' },
            { name: 'search-bar.icon-fg', value: token('search-bar.icon-fg'), reference: '{color.fg.muted}', preview: 'color' },
            { name: 'color.fg.placeholder', value: token('color.fg.placeholder'), reference: '{color.slate.400}', preview: 'color', description: '占位文字' },
            { name: 'color.border.focus', value: token('color.border.focus'), reference: '{color.blue.500}', preview: 'color', description: '聚焦描边' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformHint
          flutter={
            <>
              forui <code>FTextField</code>（前缀图标）或 Material <code>TextField</code>：高 <code>TpTokens.searchBarHeight</code> 44、圆角 <code>searchBarRadius</code> 12、描边{' '}
              <code>searchBarBorder</code>、图标色 <code>searchBarIconFg</code>；<code>TextInputAction.search</code>。
            </>
          }
          ios={
            <>
              <code>.searchable(text: $query, prompt: "搜索国家、城市或节点")</code>，或自定义 <code>TextField</code> + <code>Image(systemName: "magnifyingglass")</code>{' '}
              放在 <code>RoundedRectangle(cornerRadius: TPTokens.searchBarRadius)</code> 内，高度 <code>TPTokens.searchBarHeight</code>；
              <code>.submitLabel(.search)</code>。
            </>
          }
          dart={DART}
          dartFilename="lib/widgets/tp_search_bar.dart"
        />
      </Section>
    </>
  );
}
