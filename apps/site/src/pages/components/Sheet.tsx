import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@tpvpn/ui/components/ui/button';
import { Label } from '@tpvpn/ui/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@tpvpn/ui/components/ui/sheet';
import { Switch } from '@tpvpn/ui/components/ui/switch';
import { CountryList, CountryListItem } from '@tpvpn/ui/components/tp/country-list-item';
import { Tag } from '@tpvpn/ui/components/tp/tag';
import { Callout, DoDont, Kbd, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSelect, PropSwitch } from './_parts/PropToggles';

type Side = 'bottom' | 'right' | 'left' | 'top';

const COUNTRIES = [
  { code: 'jp', name: '日本', tag: <Tag tone="auto">自动最优</Tag>, latencyMs: 38, lossPct: 0, loadPct: 42 },
  { code: 'hk', name: '香港', tag: <Tag tone="exchange">交易所</Tag>, latencyMs: 24, lossPct: 0, loadPct: 61 },
  { code: 'sg', name: '新加坡', tag: <Tag tone="ai">AI</Tag>, latencyMs: 67, lossPct: 0.2, loadPct: 35 },
  { code: 'us', name: '美国', tag: <Tag tone="game">游戏</Tag>, latencyMs: 146, lossPct: 0.5, loadPct: 28 },
  { code: 'de', name: '德国', latencyMs: 212, lossPct: 1.1, loadPct: 19 },
];

/** Static replica of a bottom sheet for the anatomy figure. */
function BottomSheetFacsimile() {
  return (
    <div className="relative flex w-[20rem] max-w-full flex-col gap-4 rounded-t-2xl border-t border-border-subtle bg-bg-surface pb-4 text-fg-primary shadow-level-3">
      <span aria-hidden className="mx-auto mt-2.5 -mb-2 h-1.5 w-9 rounded-full bg-slate-300" />
      <div className="flex flex-col gap-1.5 p-5 pb-0">
        <p className="text-title-md">选择节点</p>
        <p className="text-body text-fg-secondary">按延迟排序 · 自动选路可随时切换</p>
      </div>
      <div className="mx-5 divide-y divide-border-subtle rounded-xl border border-border-default">
        {COUNTRIES.slice(0, 2).map((c) => (
          <CountryListItem key={c.code} flagCode={c.code} name={c.name} tag={c.tag} latencyMs={c.latencyMs} lossPct={c.lossPct} loadPct={c.loadPct} selected={c.code === 'jp'} />
        ))}
      </div>
      <div className="px-5">
        <Button className="w-full pointer-events-none" tabIndex={-1}>
          连接到日本
        </Button>
      </div>
      <div className="h-5 border-t border-dashed border-border-strong" aria-hidden />
    </div>
  );
}

function NodePickerSheet({ side }: { side: Side }) {
  const [selected, setSelected] = useState('jp');
  const [open, setOpen] = useState(false);
  const current = COUNTRIES.find((c) => c.code === selected)!;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">选择节点 · {current.name}</Button>
      </SheetTrigger>
      <SheetContent side={side} className={side === 'bottom' || side === 'top' ? 'max-h-[85dvh]' : undefined}>
        <SheetHeader className="pb-0">
          <SheetTitle>选择节点</SheetTitle>
          <SheetDescription>按延迟排序 · 自动选路可随时切换</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          <CountryList role="group" aria-label="国家与地区">
            {COUNTRIES.map((c) => (
              <CountryListItem
                key={c.code}
                flagCode={c.code}
                name={c.name}
                tag={c.tag}
                latencyMs={c.latencyMs}
                lossPct={c.lossPct}
                loadPct={c.loadPct}
                selected={c.code === selected}
                onClick={() => setSelected(c.code)}
              />
            ))}
          </CountryList>
        </div>
        <SheetFooter className="pt-0">
          <SheetClose asChild>
            <Button className="w-full">连接到{current.name}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SettingsSheet() {
  const [autoConnect, setAutoConnect] = useState(true);
  const [lan, setLan] = useState(false);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Settings2 aria-hidden />
          连接设置
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>连接设置</SheetTitle>
          <SheetDescription>更改后立即生效，无需重新连接。</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col divide-y divide-border-subtle px-5">
          <div className="flex min-h-control-md items-center justify-between gap-4 py-3">
            <div>
              <Label htmlFor="sheet-auto">自动连接</Label>
              <p className="mt-0.5 text-caption text-fg-muted">启动后连接上次使用的节点</p>
            </div>
            <Switch id="sheet-auto" checked={autoConnect} onCheckedChange={setAutoConnect} />
          </div>
          <div className="flex min-h-control-md items-center justify-between gap-4 py-3">
            <div>
              <Label htmlFor="sheet-lan">允许局域网访问</Label>
              <p className="mt-0.5 text-caption text-fg-muted">保留对打印机、NAS 的访问</p>
            </div>
            <Switch id="sheet-lan" checked={lan} onCheckedChange={setLan} />
          </div>
          <div className="flex min-h-control-md items-center justify-between gap-4 py-3">
            <span className="text-label-md">协议</span>
            <span className="text-body-sm text-fg-muted">WireGuard</span>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">完成</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default function SheetPage() {
  const [side, setSide] = useState<Side>('bottom');
  const [closeButton, setCloseButton] = useState(true);

  const previewCode = `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, Button, CountryList, CountryListItem } from '@tpvpn/ui';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="secondary">选择节点</Button>
  </SheetTrigger>
  <SheetContent side="${side}"${side === 'bottom' || side === 'top' ? ' className="max-h-[85dvh]"' : ''}${closeButton ? '' : ' showCloseButton={false}'}>
    <SheetHeader className="pb-0">
      <SheetTitle>选择节点</SheetTitle>
      <SheetDescription>按延迟排序 · 自动选路可随时切换</SheetDescription>
    </SheetHeader>
    <div className="min-h-0 flex-1 overflow-y-auto px-5">
      <CountryList role="group" aria-label="国家与地区">
        {countries.map((c) => (
          <CountryListItem key={c.code} {...c} selected={c.code === selected} onClick={() => setSelected(c.code)} />
        ))}
      </CountryList>
    </div>
    <SheetFooter className="pt-0">
      <SheetClose asChild><Button className="w-full">连接到{current.name}</Button></SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`;

  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="抽屉"
        en="Sheet"
        description="从屏幕边缘滑入的次级流程面板。手机端用底部抽屉（顶部 radius-2xl、拖拽条、安全区内边距），桌面端用右侧抽屉。与 Dialog 共用 Radix Dialog 基座——同样的焦点陷阱与可达性。"
      />

      <Section id="preview" title="预览" en="Preview" description="打开真实抽屉：手机节点选择器。用工具栏切换滑入方向。">
        <Preview
          label="Sheet 预览"
          code={previewCode}
          toolbar={
            <>
              <PropSelect label="side" value={side} onChange={setSide} options={[{ value: 'bottom' }, { value: 'right' }, { value: 'left' }, { value: 'top' }]} />
              <PropSwitch label="close button" checked={closeButton} onChange={setCloseButton} />
            </>
          }
        >
          <NodePickerSheet key={`${side}-${closeButton}`} side={side} />
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy" description="底部抽屉的部件；右侧抽屉没有拖拽条，其余相同。">
        <AnatomyPins
          className="bg-bg-scrim pt-14 pb-0"
          pins={[
            { n: 1, label: '拖拽条 Handle', note: '36 × 6 · slate-300 · side="bottom" 自动渲染', x: 50, y: 3 },
            { n: 2, label: 'SheetHeader', note: 'p-5 · SheetTitle title-md + SheetDescription body', x: 6, y: 14 },
            { n: 3, label: '滚动区', note: 'flex-1 overflow-y-auto · 列表 / 表单', x: 6, y: 44 },
            { n: 4, label: 'SheetFooter', note: 'mt-auto · 主操作全宽', x: 6, y: 84 },
            { n: 5, label: '安全区', note: 'pb-[env(safe-area-inset-bottom)] 内置', x: 50, y: 97 },
            { n: 6, label: '关闭按钮', note: '32px · 右上 16', x: 94, y: 8 },
          ]}
        >
          <BottomSheetFacsimile />
        </AnatomyPins>
        <TokenTable
          caption="Sheet 使用的 token"
          rows={[
            { name: 'radius.2xl', value: token('radius.2xl'), preview: 'radius', description: '顶部圆角（bottom）/ 底部圆角（top）' },
            { name: 'elevation.level-3', value: token('elevation.level-3'), preview: 'shadow', description: '浮层阴影' },
            { name: 'color.bg.scrim', value: token('color.bg.scrim'), preview: 'color', description: '遮罩' },
            { name: 'color.slate.300', value: token('color.slate.300'), preview: 'color', description: '拖拽条' },
            { name: 'duration.slow', value: token('duration.slow'), preview: 'duration', description: '进入 500ms emphasized' },
            { name: 'duration.base', value: token('duration.base'), preview: 'duration', description: '退出 200ms' },
          ]}
        />
      </Section>

      <Section id="sides" title="方向" en="Sides" description="side 决定位置、圆角与滑入方向。">
        <Prose>
          <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>side</th>
                <th>尺寸</th>
                <th>用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>bottom</code>
                </td>
                <td>宽 100%，高自适应（建议 <code>max-h-[85dvh]</code>）；顶部 radius-2xl；拖拽条；安全区</td>
                <td>手机：节点选择、套餐选择、节点详情</td>
              </tr>
              <tr>
                <td>
                  <code>right</code>（默认）
                </td>
                <td>宽 75%，≥ sm 最大 24rem（384）；全高；左描边</td>
                <td>桌面 / 平板：设置、详情、筛选</td>
              </tr>
              <tr>
                <td>
                  <code>left</code>
                </td>
                <td>同 right，镜像</td>
                <td>导航抽屉（文档站侧栏）</td>
              </tr>
              <tr>
                <td>
                  <code>top</code>
                </td>
                <td>宽 100%，高自适应；底部 radius-2xl</td>
                <td>通知 / 离线横幅的展开态（少用）</td>
              </tr>
            </tbody>
          </table>
          </div>
        </Prose>
      </Section>

      <Section id="patterns" title="模式" en="Patterns">
        <SubSection title="手机节点选择器" en="Mobile node picker" description="底部抽屉 + CountryList：选中态左侧蓝条，主按钮固定在底部，列表区独立滚动。">
          <Preview label="手机节点选择器" background="surface">
            <NodePickerSheet side="bottom" />
          </Preview>
        </SubSection>
        <SubSection title="桌面右侧抽屉" en="Desktop right sheet" description="设置与详情放在右侧，宽 384；内容用设置行排版，底部「完成」关闭。">
          <Preview
            label="桌面右侧抽屉"
            background="surface"
            code={`<Sheet>
  <SheetTrigger asChild><Button variant="outline">连接设置</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>连接设置</SheetTitle>
      <SheetDescription>更改后立即生效，无需重新连接。</SheetDescription>
    </SheetHeader>
    <div className="flex flex-col divide-y divide-border-subtle px-5">…设置行…</div>
    <SheetFooter>
      <SheetClose asChild><Button variant="outline">完成</Button></SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`}
          >
            <SettingsSheet />
          </Preview>
        </SubSection>
        <SubSection title="安全区" en="Safe area">
          <Prose>
            <p>
              <code>side="bottom"</code> 已内置 <code>pb-[env(safe-area-inset-bottom)]</code>：在带 Home 指示条的设备上，底部按钮自动抬高 34px；在没有安全区的设备上为 0。PWA / WebView 需要在{' '}
              <code>&lt;meta name="viewport" content="…, viewport-fit=cover"&gt;</code> 下才能取到该值。
            </p>
          </Prose>
        </SubSection>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          previewClassName="bg-bg-canvas"
          do={
            <div className="w-56 rounded-t-2xl border-t border-border-subtle bg-bg-surface px-4 pt-2 pb-4 shadow-level-3">
              <span aria-hidden className="mx-auto block h-1.5 w-9 rounded-full bg-slate-300" />
              <p className="mt-3 text-title-md">选择节点</p>
              <p className="mt-1 text-body text-fg-secondary">列表 · 主按钮在底部</p>
            </div>
          }
          dont={
            <div className="w-56 rounded-t-2xl border-t border-border-subtle bg-bg-surface px-4 pt-4 pb-4 shadow-level-3">
              <p className="text-title-md">断开连接？</p>
              <p className="mt-1 text-body text-fg-secondary">断开后设备将直接访问网络。</p>
            </div>
          }
          doCaption="Sheet 承载「流程」：选择、浏览、编辑，内容可滚动。"
          dontCaption="不要用 Sheet 做一句话确认——那是 Dialog 的事。"
        />
        <Callout tone="info" title="一次一个">
          抽屉里不再弹抽屉；需要二级选择时在同一抽屉内切换内容（面包屑或返回箭头）。Sheet 与 Dialog 也不要同时打开。
        </Callout>
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              与 Dialog 相同：<code>role="dialog"</code> + <code>aria-modal</code>，SheetTitle 必填（aria-labelledby），焦点陷阱，<Kbd>Esc</Kbd> 关闭，关闭后焦点归还触发元素。
            </li>
            <li>拖拽条仅是视觉提示（aria-hidden）；下滑关闭手势需要由宿主实现（当前 Web 版未内置），关闭按钮与 scrim 点击始终可用。</li>
            <li>
              列表用 <code>role="group"</code> + <code>aria-label</code>，每行是 button 并带 <code>aria-pressed</code>（CountryListItem 的选中态）；主按钮文案带上选择结果（「连接到日本」）。
            </li>
            <li>滚动区必须是抽屉内部的元素（<code>overflow-y-auto</code>），不要让整个抽屉超出视口。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props" description="部件与 Dialog 一一对应；SheetContent 多一个 side。">
        <PropsTable
          caption="SheetContent"
          rows={[
            { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'right'", description: '位置与滑入方向；bottom 自动带拖拽条与安全区内边距。' },
            { name: 'showCloseButton', type: 'boolean', default: 'true', description: '右上角 32px 关闭按钮。' },
            { name: 'className', type: 'string', description: '高度上限（max-h-[85dvh]）、宽度等。' },
            { name: 'onOpenAutoFocus / onEscapeKeyDown / onPointerDownOutside', type: 'Radix Content props', description: '同 Dialog。' },
          ]}
        />
        <PropsTable
          caption="其它部件"
          rows={[
            { name: 'Sheet', type: 'open · defaultOpen · onOpenChange · modal', description: 'Radix Dialog Root。' },
            { name: 'SheetTrigger / SheetClose', type: 'asChild?: boolean', description: '触发 / 关闭。' },
            { name: 'SheetHeader', type: "React.ComponentProps<'div'>", description: 'flex-col gap-1.5 p-5。' },
            { name: 'SheetFooter', type: "React.ComponentProps<'div'>", description: 'mt-auto flex-col gap-2 p-5，贴底。' },
            { name: 'SheetTitle / SheetDescription', type: 'Radix Title / Description props', description: 'title-md / body fg-secondary。' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>side="bottom"</code></>, flutter: <><code>showModalBottomSheet</code> / forui <code>showFSheet</code></>, ios: <><code>.sheet</code> + <code>.presentationDetents</code></> },
            { web: <><code>radius.2xl 24</code></>, flutter: <><code>RoundedRectangleBorder(top: 24)</code></>, ios: <><code>.presentationCornerRadius(24)</code></> },
            { web: '拖拽条', flutter: <><code>showDragHandle: true</code></>, ios: <><code>.presentationDragIndicator(.visible)</code></> },
            { web: '安全区', flutter: <><code>SafeArea(top: false)</code></>, ios: <>系统自动</> },
            { web: <><code>side="right"</code></>, flutter: <><code>endDrawer</code></>, ios: <>iPad <code>.popover</code> / 分栏</> },
          ]}
          dart={`import 'package:flutter/material.dart';
import 'package:tp_tokens/tp_tokens.dart';

Future<String?> pickNode(BuildContext context) {
  return showModalBottomSheet<String>(
    context: context,
    useSafeArea: true,
    showDragHandle: true,            // 36 × 4，颜色取 colorSlate300
    barrierColor: TpTokens.colorBgScrim,
    backgroundColor: TpTokens.colorBgSurface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(TpTokens.radius2xl)), // 24
    ),
    constraints: BoxConstraints(maxHeight: MediaQuery.sizeOf(context).height * 0.85),
    builder: (ctx) => const NodePickerSheet(),
  );
}`}
          dartFilename="lib/features/nodes/pick_node.dart"
          swift={`.sheet(isPresented: $showPicker) {
    NodePickerView()
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .presentationCornerRadius(TPTokens.radius2xl)   // 24
}`}
          swiftFilename="HomeView.swift"
        />
      </Section>
    </>
  );
}
