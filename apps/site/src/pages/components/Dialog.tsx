import { useRef, useState } from 'react';
import { Button } from '@tpvpn/ui/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@tpvpn/ui/components/ui/dialog';
import { Input } from '@tpvpn/ui/components/ui/input';
import { Label } from '@tpvpn/ui/components/ui/label';
import { Callout, DoDont, Kbd, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { cn } from '@/lib/cn';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSelect, PropSwitch } from './_parts/PropToggles';

type Size = 'sm' | 'md' | 'lg';
const SIZE_CLASS: Record<Size, string> = { sm: 'sm:max-w-sm', md: '', lg: 'sm:max-w-2xl' };
const SIZE_PX: Record<Size, string> = { sm: '384', md: '512', lg: '672' };

/** Destructive confirm: initial focus lands on 「取消」 via onOpenAutoFocus + ref. */
function DestructiveDemo() {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">删除设备</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-sm"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          cancelRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>删除设备「Carter 的 iPad」？</DialogTitle>
          <DialogDescription>该设备将被立即下线，需要重新登录才能再次使用。</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" ref={cancelRef}>
              取消
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive">删除</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Static, non-portaled replica of DialogContent for the anatomy figure. */
function DialogFacsimile() {
  return (
    <div className="relative grid w-[22rem] max-w-full gap-5 rounded-2xl border border-border-subtle bg-bg-surface p-6 text-fg-primary shadow-level-4">
      <div className="flex flex-col gap-1.5 text-left">
        <p className="text-title-md text-fg-primary">断开连接？</p>
        <p className="text-body text-fg-secondary">断开后当前设备将直接访问网络，直到你再次连接。</p>
      </div>
      <div className="flex flex-row justify-end gap-2">
        <Button variant="outline" tabIndex={-1} className="pointer-events-none">
          取消
        </Button>
        <Button variant="destructive" tabIndex={-1} className="pointer-events-none">
          断开
        </Button>
      </div>
      <span aria-hidden className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full text-fg-muted">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </span>
    </div>
  );
}

export default function DialogPage() {
  const [size, setSize] = useState<Size>('md');
  const [destructive, setDestructive] = useState(true);
  const [closeButton, setCloseButton] = useState(true);
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const previewCode = `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Button } from '@tpvpn/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">断开连接</Button>
  </DialogTrigger>
  <DialogContent${size !== 'md' ? ` className="${SIZE_CLASS[size]}"` : ''}${closeButton ? '' : ' showCloseButton={false}'}${destructive ? `\n    onOpenAutoFocus={(e) => { e.preventDefault(); cancelRef.current?.focus(); }}` : ''}>
    <DialogHeader>
      <DialogTitle>断开连接？</DialogTitle>
      <DialogDescription>断开后当前设备将直接访问网络，直到你再次连接。</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline"${destructive ? ' ref={cancelRef}' : ''}>取消</Button>
      </DialogClose>
      <Button variant="${destructive ? 'destructive' : 'primary'}" onClick={disconnect}>断开</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="对话框"
        en="Dialog"
        description="需要用户做决定的中断：居中、radius-2xl 24、level-4 阴影、半透明 scrim。基于 Radix Dialog——焦点陷阱、Esc 关闭、焦点归还都是默认行为。"
      />

      <Section id="preview" title="预览" en="Preview" description="点击按钮打开真实的对话框；工具栏切换尺寸、危险态与右上角关闭按钮。">
        <Preview
          label="Dialog 预览"
          code={previewCode}
          toolbar={
            <>
              <PropSelect label="size" value={size} onChange={setSize} options={[{ value: 'sm', label: '384' }, { value: 'md', label: '512' }, { value: 'lg', label: '672' }]} />
              <PropSwitch label="destructive" checked={destructive} onChange={setDestructive} />
              <PropSwitch label="close button" checked={closeButton} onChange={setCloseButton} />
            </>
          }
        >
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">断开连接</Button>
            </DialogTrigger>
            <DialogContent
              className={cn(SIZE_CLASS[size])}
              showCloseButton={closeButton}
              onOpenAutoFocus={
                destructive
                  ? (e) => {
                      e.preventDefault();
                      cancelRef.current?.focus();
                    }
                  : undefined
              }
            >
              <DialogHeader>
                <DialogTitle>断开连接？</DialogTitle>
                <DialogDescription>断开后当前设备将直接访问网络，直到你再次连接。</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" ref={cancelRef}>
                    取消
                  </Button>
                </DialogClose>
                <Button variant={destructive ? 'destructive' : 'primary'} onClick={() => setOpen(false)}>
                  断开
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <AnatomyPins
          className="bg-bg-scrim py-14"
          pins={[
            { n: 1, label: 'Scrim', note: 'bg-scrim rgb(15 23 42 / 0.5) · 300ms 淡入 · 点击关闭', x: -12, y: -14 },
            { n: 2, label: 'DialogContent', note: 'radius-2xl 24 · level-4 · p-6 · 最大宽 512', x: 0, y: 0 },
            { n: 3, label: 'DialogTitle', note: 'title-md 20/28 600 · aria-labelledby', x: 14, y: 20 },
            { n: 4, label: 'DialogDescription', note: 'body · fg-secondary · aria-describedby', x: 40, y: 38 },
            { n: 5, label: 'DialogFooter', note: '右对齐；手机端纵向、主操作在上', x: 62, y: 78 },
            { n: 6, label: '关闭按钮', note: '32px · 右上 16 · 可 showCloseButton={false}', x: 94, y: 12 },
          ]}
          frameClassName="relative"
        >
          <DialogFacsimile />
        </AnatomyPins>
        <TokenTable
          caption="Dialog 使用的 token"
          rows={[
            { name: 'color.bg.scrim', value: token('color.bg.scrim'), preview: 'color', description: '遮罩' },
            { name: 'radius.2xl', value: token('radius.2xl'), preview: 'radius', description: '弹层圆角' },
            { name: 'elevation.level-4', value: token('elevation.level-4'), preview: 'shadow', description: 'Modal 阴影' },
            { name: 'duration.moderate', value: token('duration.moderate'), preview: 'duration', description: '进入 / 退出' },
            { name: 'easing.emphasized', value: token('easing.emphasized'), preview: 'ease', description: '缩放 0.95 → 1' },
            { name: 'z-index.modal', value: String(token('z-index.modal')), description: '层级 1100（Radix Portal 内 z-50）' },
          ]}
        />
      </Section>

      <Section id="sizes" title="尺寸" en="Sizes" description="DialogContent 默认 sm:max-w-lg（512）；手机端始终为 100% − 32px。用 className 覆盖最大宽度。">
        <Prose>
          <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>尺寸</th>
                <th>类名</th>
                <th>最大宽</th>
                <th>用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>sm</td>
                <td>
                  <code>sm:max-w-sm</code>
                </td>
                <td>384</td>
                <td>确认 / 危险操作，一句话 + 两个按钮</td>
              </tr>
              <tr>
                <td>md（默认）</td>
                <td>—</td>
                <td>512</td>
                <td>带一两个字段的表单（重命名设备、输入兑换码）</td>
              </tr>
              <tr>
                <td>lg</td>
                <td>
                  <code>sm:max-w-2xl</code>
                </td>
                <td>672</td>
                <td>桌面端多段内容（协议详情、节点信息）；手机端改用 Sheet</td>
              </tr>
            </tbody>
          </table>
          </div>
        </Prose>
        <Preview label="三种尺寸" background="surface">
          <div className="flex flex-wrap justify-center gap-3">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <Dialog key={s}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    {s} · {SIZE_PX[s]}
                  </Button>
                </DialogTrigger>
                <DialogContent className={SIZE_CLASS[s]}>
                  <DialogHeader>
                    <DialogTitle>{s === 'sm' ? '断开连接？' : s === 'md' ? '重命名设备' : '节点信息'}</DialogTitle>
                    <DialogDescription>
                      {s === 'sm' ? '断开后当前设备将直接访问网络。' : s === 'md' ? '名称会显示在「我的设备」列表中。' : 'JP · Tokyo #12 · IEPL 优选 · WireGuard · 上次连接 2 小时前。'}
                    </DialogDescription>
                  </DialogHeader>
                  {s === 'md' && (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`rename-${s}`}>设备名称</Label>
                      <Input id={`rename-${s}`} defaultValue="Carter 的 iPhone" />
                    </div>
                  )}
                  <DialogFooter showCloseButton>{s !== 'lg' && <Button>{s === 'sm' ? '断开' : '保存'}</Button>}</DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </Preview>
      </Section>

      <Section id="patterns" title="模式" en="Patterns">
        <SubSection title="危险操作确认" en="Destructive confirm" description="标题用问句说明后果，主按钮 destructive 且文字是动词本身（「断开」「删除」），取消在左；初始焦点落在「取消」，Enter 不会误触。">
          <Preview
            label="危险操作确认"
            background="surface"
            code={`const cancelRef = useRef<HTMLButtonElement>(null);

<DialogContent
  className="sm:max-w-sm"
  onOpenAutoFocus={(e) => { e.preventDefault(); cancelRef.current?.focus(); }}
>
  <DialogHeader>
    <DialogTitle>删除设备「Carter 的 iPad」？</DialogTitle>
    <DialogDescription>该设备将被立即下线，需要重新登录才能再次使用。</DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <DialogClose asChild><Button variant="outline" ref={cancelRef}>取消</Button></DialogClose>
    <Button variant="destructive" onClick={remove}>删除</Button>
  </DialogFooter>
</DialogContent>`}
          >
            <DestructiveDemo />
          </Preview>
        </SubSection>

        <SubSection title="焦点陷阱与 scrim" en="Focus trap & scrim">
          <Prose>
            <ul>
              <li>
                打开时焦点移入对话框（默认第一个可聚焦元素），<Kbd>Tab</Kbd> 在内部循环；关闭后焦点回到触发按钮。这些由 Radix 处理，不要自己写 focus 逻辑。
              </li>
              <li>
                scrim 是 <code>bg-scrim</code>（slate-900 50%），300ms 淡入；点击 scrim 或按 <Kbd>Esc</Kbd> 关闭。危险操作或未保存的表单可用 <code>onPointerDownOutside</code> / <code>onEscapeKeyDown</code> 的 <code>preventDefault</code> 阻止误关。
              </li>
              <li>背景滚动被锁定（body 加 <code>pointer-events: none</code>），一屏只允许一个 Dialog；对话框里需要再次确认时，替换内容而不是叠第二层。</li>
            </ul>
          </Prose>
        </SubSection>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={
            <div className="w-full max-w-xs rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-level-4">
              <p className="text-title-md">断开连接？</p>
              <p className="mt-1 text-body text-fg-secondary">断开后当前设备将直接访问网络。</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button size="sm" variant="outline" tabIndex={-1} className="pointer-events-none">
                  取消
                </Button>
                <Button size="sm" variant="destructive" tabIndex={-1} className="pointer-events-none">
                  断开
                </Button>
              </div>
            </div>
          }
          dont={
            <div className="w-full max-w-xs rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-level-4">
              <p className="text-title-md">提示</p>
              <p className="mt-1 text-body text-fg-secondary">您确定要执行此操作吗？此操作可能无法撤销。</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button size="sm" variant="outline" tabIndex={-1} className="pointer-events-none">
                  否
                </Button>
                <Button size="sm" tabIndex={-1} className="pointer-events-none">
                  是
                </Button>
              </div>
            </div>
          }
          doCaption="标题即问题、按钮即答案：「断开连接？→ 断开 / 取消」。"
          dontCaption="不要用「提示」「确定吗？」「是 / 否」——用户看不出点了会发生什么。"
        />
        <Callout tone="warning" title="什么时候不用 Dialog">
          节点选择、套餐选择、多步流程属于「次级流程」而不是「决定」，用 <a href="/components/sheet">Sheet</a>；操作结果（已复制、连接失败）用 <a href="/components/toast">Toast</a>；纯提示信息用 Callout 内联。
        </Callout>
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              Radix Dialog 输出 <code>role="dialog"</code> + <code>aria-modal="true"</code>；<code>DialogTitle</code> 必填并自动成为 <code>aria-labelledby</code>，<code>DialogDescription</code> 成为 <code>aria-describedby</code>。没有可见标题时用 sr-only 的 DialogTitle，不要省略。
            </li>
            <li>
              键盘：<Kbd>Esc</Kbd> 关闭、<Kbd>Tab</Kbd> / <Kbd>Shift</Kbd>+<Kbd>Tab</Kbd> 循环；触发元素保持在 Tab 顺序，关闭后焦点归还。
            </li>
            <li>关闭按钮带 sr-only「关闭」；危险操作把初始焦点放在「取消」。</li>
            <li>
              动效：进入 300ms emphasized（fade + zoom 0.95 → 1），退出同时长；<code>prefers-reduced-motion</code> 下全局退化为 150ms 淡入。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props" description="每个部件都是 Radix Dialog 对应部件的薄包装（加 data-slot 与 TP 样式），props 与 Radix 一致；下表列出常用项与本套件新增项。">
        <PropsTable
          caption="Dialog（Root）"
          rows={[
            { name: 'open', type: 'boolean', description: '受控开关。' },
            { name: 'defaultOpen', type: 'boolean', description: '非受控初始状态。' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: '打开 / 关闭回调（含 Esc、scrim、Close）。' },
            { name: 'modal', type: 'boolean', default: 'true', description: '模态：锁滚动、阻断外部交互。' },
          ]}
        />
        <PropsTable
          caption="DialogContent"
          rows={[
            { name: 'showCloseButton', type: 'boolean', default: 'true', description: '右上角 32px 关闭按钮。' },
            { name: 'className', type: 'string', description: '覆盖最大宽度等（sm:max-w-sm / sm:max-w-2xl）。' },
            { name: 'onOpenAutoFocus', type: '(event: Event) => void', description: '打开时的自动聚焦；preventDefault 后自行指定焦点。' },
            { name: 'onCloseAutoFocus', type: '(event: Event) => void', description: '关闭时焦点归还的钩子。' },
            { name: 'onEscapeKeyDown', type: '(event: KeyboardEvent) => void', description: 'Esc；preventDefault 可阻止关闭。' },
            { name: 'onPointerDownOutside', type: '(event) => void', description: '点击 scrim；preventDefault 可阻止关闭。' },
            { name: 'forceMount', type: 'true', description: '强制挂载（配合外部动画库）。' },
          ]}
        />
        <PropsTable
          caption="其它部件"
          rows={[
            { name: 'DialogTrigger', type: 'asChild?: boolean', description: '把触发行为合并到子元素（通常是 Button）。' },
            { name: 'DialogClose', type: 'asChild?: boolean', description: '任意位置的关闭按钮。' },
            { name: 'DialogHeader', type: "React.ComponentProps<'div'>", description: '标题区：手机居中、≥ sm 左对齐。' },
            { name: 'DialogFooter', type: "React.ComponentProps<'div'> & { showCloseButton?: boolean }", default: 'showCloseButton false', description: '按钮行；showCloseButton 追加一个 outline「关闭」。' },
            { name: 'DialogTitle', type: 'Radix Title props', description: 'title-md；必填。' },
            { name: 'DialogDescription', type: 'Radix Description props', description: 'body · fg-secondary。' },
            { name: 'DialogOverlay / DialogPortal', type: 'Radix props', description: '通常不需要单独使用，DialogContent 已内置。' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>&lt;Dialog&gt;</code></>, flutter: <><code>showFDialog</code> / <code>showDialog</code></>, ios: <><code>.alert</code>（确认）/ <code>.sheet</code>（内容）</> },
            { web: <><code>radius.2xl 24</code></>, flutter: <><code>TpTokens.radius2xl</code></>, ios: <><code>TPTokens.radius2xl</code> · <code>.presentationCornerRadius</code></> },
            { web: <><code>elevation.level-4</code></>, flutter: <><code>TpTokens.elevationLevel4</code></>, ios: <><code>TPTokens.elevationLevel4</code></> },
            { web: <><code>color.bg.scrim</code></>, flutter: <><code>barrierColor: TpTokens.colorBgScrim</code></>, ios: <>系统遮罩</> },
            { web: <><code>duration.moderate</code></>, flutter: <><code>TpTokens.durationModerate</code></>, ios: <><code>TPTokens.durationModerate</code></> },
          ]}
          dart={`import 'package:flutter/material.dart';
import 'package:tp_tokens/tp_tokens.dart';

Future<bool?> confirmDisconnect(BuildContext context) {
  return showDialog<bool>(
    context: context,
    barrierColor: TpTokens.colorBgScrim, // rgb(15 23 42 / 0.5)
    builder: (ctx) => AlertDialog(
      backgroundColor: TpTokens.colorBgSurface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(TpTokens.radius2xl)), // 24
      title: Text('断开连接？', style: TpTokens.typographyTitleMd),
      content: Text('断开后当前设备将直接访问网络，直到你再次连接。', style: TpTokens.typographyBody),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx, false), autofocus: true, child: const Text('取消')),
        FilledButton(
          style: FilledButton.styleFrom(backgroundColor: TpTokens.colorActionDestructiveBg),
          onPressed: () => Navigator.pop(ctx, true),
          child: const Text('断开'),
        ),
      ],
    ),
  );
}`}
          dartFilename="lib/features/home/confirm_disconnect.dart"
          swift={`.alert("断开连接？", isPresented: $showDisconnect) {
    Button("取消", role: .cancel) {}
    Button("断开", role: .destructive) { vpn.disconnect() }
} message: {
    Text("断开后当前设备将直接访问网络，直到你再次连接。")
}`}
          swiftFilename="HomeView.swift"
        />
      </Section>
    </>
  );
}
