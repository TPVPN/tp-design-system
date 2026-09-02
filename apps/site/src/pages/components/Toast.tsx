import { useState } from 'react';
import { CircleCheck, CircleX, Info, Layers, TriangleAlert, Undo2 } from 'lucide-react';
import { Button } from '@tpvpn/ui/components/ui/button';
import { TOAST_DURATION, TOAST_LIMIT, Toaster, toast, useToast, type ToastTone } from '@tpvpn/ui/components/ui/toast';
import { Callout, DoDont, Kbd, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { cn } from '@/lib/cn';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSelect, PropSwitch } from './_parts/PropToggles';

type Duration = '2000' | '4000' | '8000' | 'Infinity';

const TONES: { tone: ToastTone; label: string; title: string; description: string; icon: string; color: string; role: string; when: string }[] = [
  { tone: 'neutral', label: '中性', title: '已复制 IP 地址', description: '203.0.113.42', icon: '无', color: '—', role: 'status', when: '轻量确认：复制、已保存、已切换' },
  { tone: 'success', label: '成功', title: '已连接 · 东京 #12', description: '延迟 38 ms · IEPL 优选', icon: 'CircleCheck', color: 'status.success.solid', role: 'status', when: '连接成功、兑换成功、支付成功' },
  { tone: 'info', label: '信息', title: '新版本 1.2.0 可用', description: '包含节点列表刷新与稳定性修复', icon: 'Info', color: 'status.info.solid', role: 'status', when: '版本更新、后台完成的任务' },
  { tone: 'warning', label: '警告', title: '本月流量剩余 10%', description: '超出后限速至 10 Mbps', icon: 'TriangleAlert', color: 'status.warning.solid', role: 'status', when: '接近上限、即将过期、网络不稳定' },
  { tone: 'error', label: '错误', title: '连接失败，请重试', description: '节点无响应（15 s 超时）', icon: 'CircleX', color: 'status.error.solid', role: 'alert', when: '操作失败；始终说明下一步' },
];

/** Static replica of one toast for the anatomy figure (the real ones are portaled). */
function ToastFacsimile() {
  return (
    <div className="relative flex w-[22rem] max-w-full items-start gap-3 rounded-lg border border-border-default bg-bg-surface py-3 pr-10 pl-4 shadow-level-3">
      <CircleCheck className="mt-0.5 size-5 shrink-0 text-status-success-solid" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-label-md text-fg-primary">已断开连接</p>
        <p className="text-body-sm text-fg-secondary">当前设备正在直接访问网络</p>
        <div className="mt-2">
          <Button size="sm" variant="secondary" tabIndex={-1} className="pointer-events-none">
            撤销
          </Button>
        </div>
      </div>
      <span aria-hidden className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full text-fg-muted">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </span>
    </div>
  );
}

function PlacementDiagram() {
  return (
    <div className="grid w-full max-w-lg grid-cols-[auto_1fr] items-end justify-items-center gap-8">
      <figure className="flex flex-col items-center gap-2">
        <div className="relative h-56 w-28 overflow-hidden rounded-xl border-2 border-slate-300 bg-bg-surface">
          <span className="absolute top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-slate-200" />
          <div className="absolute inset-x-2 bottom-3 flex flex-col gap-1">
            <span className="h-6 rounded-sm border border-border-default bg-bg-surface shadow-level-2" />
            <span className="h-6 rounded-sm border border-blue-200 bg-bg-surface shadow-level-3" />
          </div>
          <span className="absolute inset-x-0 bottom-1 mx-auto h-0.5 w-10 rounded-full bg-slate-300" />
        </div>
        <figcaption className="text-caption text-fg-muted">&lt; 768 · 底部居中 · 安全区上方</figcaption>
      </figure>
      <figure className="flex w-full flex-col items-center gap-2">
        <div className="relative h-40 w-full overflow-hidden rounded-xl border-2 border-slate-300 bg-bg-surface">
          <span className="absolute inset-x-0 top-0 h-6 border-b border-border-default bg-bg-canvas" />
          <div className="absolute top-8 right-3 flex w-24 flex-col gap-1">
            <span className="h-5 rounded-sm border border-blue-200 bg-bg-surface shadow-level-3" />
            <span className="h-5 rounded-sm border border-border-default bg-bg-surface shadow-level-2" />
          </div>
        </div>
        <figcaption className="text-caption text-fg-muted">≥ 768 · 右上 · 顶部导航之下</figcaption>
      </figure>
    </div>
  );
}

export default function ToastPage() {
  const [tone, setTone] = useState<ToastTone>('success');
  const [duration, setDuration] = useState<Duration>('4000');
  const [withDescription, setWithDescription] = useState(true);
  const [withAction, setWithAction] = useState(false);
  const { toasts } = useToast();

  const sample = TONES.find((t) => t.tone === tone)!;
  const fire = () =>
    toast({
      title: sample.title,
      description: withDescription ? sample.description : undefined,
      tone,
      duration: duration === 'Infinity' ? Infinity : Number(duration),
      action: withAction ? { label: '撤销', onClick: () => toast({ title: '已撤销', tone: 'neutral' }) } : undefined,
    });

  const previewCode = `import { Toaster, toast } from '@tpvpn/ui';

// 1. 应用根部挂一次
<Toaster />

// 2. 任何地方调用（组件外也可以）
toast({
  title: '${sample.title}',${withDescription ? `\n  description: '${sample.description}',` : ''}${tone !== 'neutral' ? `\n  tone: '${tone}',` : ''}${duration !== '4000' ? `\n  duration: ${duration},` : ''}${withAction ? `\n  action: { label: '撤销', onClick: undo },` : ''}
});`;

  const undoDemo = () => {
    const handle = toast({
      title: '已断开连接',
      description: '当前设备正在直接访问网络',
      tone: 'neutral',
      duration: 6000,
      action: {
        label: '撤销',
        altText: '撤销断开，重新连接',
        onClick: () => {
          handle.dismiss();
          toast({ title: '已重新连接 · 东京 #12', tone: 'success' });
        },
      },
    });
  };

  const stackDemo = () => {
    const items: [string, ToastTone][] = [
      ['已复制 IP 地址', 'neutral'],
      ['已连接 · 东京 #12', 'success'],
      ['新版本 1.2.0 可用', 'info'],
      ['本月流量剩余 10%', 'warning'],
    ];
    items.forEach(([title, t], i) => window.setTimeout(() => toast({ title, tone: t, duration: 6000 }), i * 350));
  };

  return (
    <>
      <Toaster />
      <PageHeader
        eyebrow="组件 · Components"
        title="轻提示"
        en="Toast"
        description="操作结果的短暂反馈：白底、level-3 阴影、左侧状态图标，4 秒后自动消失，最多同时三条。手机底部居中，桌面右上角。命令式 API——在组件外也能调用。"
      />

      <Section id="preview" title="预览" en="Preview" description="点击「显示」在真实位置弹出。工具栏切换语义、时长、说明与动作。">
        <Preview
          label="Toast 预览"
          code={previewCode}
          toolbar={
            <>
              <PropSelect label="tone" value={tone} onChange={setTone} options={TONES.map((t) => ({ value: t.tone }))} />
              <PropSelect label="duration" value={duration} onChange={setDuration} options={[{ value: '2000' }, { value: '4000' }, { value: '8000' }, { value: 'Infinity', label: '∞' }]} />
              <PropSwitch label="description" checked={withDescription} onChange={setWithDescription} />
              <PropSwitch label="action" checked={withAction} onChange={setWithAction} />
            </>
          }
        >
          <div className="flex flex-col items-center gap-3">
            <Button onClick={fire}>显示 {sample.label} Toast</Button>
            <span className="text-caption text-fg-muted tnum" aria-live="polite">
              当前 {toasts.filter((t) => t.open).length} / {TOAST_LIMIT} 条
            </span>
          </div>
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <AnatomyPins
          pins={[
            { n: 1, label: '容器', note: 'bg-surface · radius-lg 16 · slate-200 描边 · level-3 · 最大宽 24rem', x: 0, y: 0 },
            { n: 2, label: '状态图标', note: '20px · status.*.solid · 中性无图标', x: 8, y: 22 },
            { n: 3, label: '标题', note: 'label-md · ≤ 20 字', x: 34, y: 18 },
            { n: 4, label: '说明', note: 'body-sm · fg-secondary · 可选，允许两行', x: 40, y: 40 },
            { n: 5, label: '动作', note: 'secondary sm · 一个 · 「撤销」「查看」', x: 20, y: 78 },
            { n: 6, label: '关闭', note: '32px · 右上 · aria-label 关闭', x: 94, y: 16 },
          ]}
        >
          <ToastFacsimile />
        </AnatomyPins>
      </Section>

      <Section id="tones" title="语义" en="Tones" description="五种语义只改图标与图标颜色，容器保持一致；错误用 role=alert 立即朗读，其余 status 礼貌朗读。">
        <div className="my-6 overflow-x-auto rounded-lg border border-border-default bg-bg-surface shadow-level-1">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead className="bg-bg-canvas text-xs text-fg-muted">
              <tr className="[&>th]:border-b [&>th]:border-border-default [&>th]:px-4 [&>th]:py-2.5 [&>th]:font-medium">
                <th>tone</th>
                <th>示例</th>
                <th>图标</th>
                <th>role</th>
                <th>用途</th>
                <th className="w-24">试一试</th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>td]:border-b-0 [&>tr>td]:border-b [&>tr>td]:border-border-subtle [&>tr>td]:px-4 [&>tr>td]:py-3 [&>tr>td]:align-middle">
              {TONES.map((t) => {
                const Icon = t.tone === 'success' ? CircleCheck : t.tone === 'info' ? Info : t.tone === 'warning' ? TriangleAlert : t.tone === 'error' ? CircleX : null;
                const color =
                  t.tone === 'success'
                    ? 'text-status-success-solid'
                    : t.tone === 'info'
                      ? 'text-status-info-solid'
                      : t.tone === 'warning'
                        ? 'text-status-warning-solid'
                        : t.tone === 'error'
                          ? 'text-status-error-solid'
                          : '';
                return (
                  <tr key={t.tone}>
                    <td>
                      <code className="font-mono text-[13px] text-fg-brand">{t.tone}</code>
                    </td>
                    <td className="text-fg-primary">{t.title}</td>
                    <td>
                      <span className="flex items-center gap-2 text-fg-secondary">
                        {Icon && <Icon className={cn('size-4', color)} aria-hidden />}
                        <code className="font-mono text-[12px]">{t.icon}</code>
                      </span>
                    </td>
                    <td>
                      <code className="font-mono text-[12px] text-fg-secondary">{t.role}</code>
                    </td>
                    <td className="text-fg-secondary">{t.when}</td>
                    <td>
                      <Button size="sm" variant="ghost" onClick={() => toast({ title: t.title, description: t.description, tone: t.tone })}>
                        显示
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TokenTable
          caption="图标颜色 token"
          rows={(['success', 'info', 'warning', 'error'] as const).map((s) => ({
            name: `color.status.${s}.solid`,
            value: token(`color.status.${s}.solid`),
            preview: 'color',
            description: `${s} 图标`,
          }))}
        />
      </Section>

      <Section id="behavior" title="行为" en="Behavior">
        <SubSection title="堆叠" en="Stacking" description={`最多 ${TOAST_LIMIT} 条：第四条到来时最早的一条先退出。DOM 顺序即时间顺序，新的一条总是离屏幕边缘最近。`}>
          <Preview label="堆叠演示" background="surface">
            <Button variant="secondary" onClick={stackDemo}>
              <Layers aria-hidden />
              连发 4 条
            </Button>
          </Preview>
        </SubSection>
        <SubSection title="带动作" en="With action" description="动作只放一个，且必须可撤销或可跳转；点击后 toast 立即关闭并给出新的反馈。">
          <Preview
            label="撤销演示"
            background="surface"
            code={`const handle = toast({
  title: '已断开连接',
  description: '当前设备正在直接访问网络',
  duration: 6000,
  action: {
    label: '撤销',
    altText: '撤销断开，重新连接',   // 屏幕阅读器的替代说明
    onClick: () => {
      handle.dismiss();
      reconnect();
      toast({ title: '已重新连接 · 东京 #12', tone: 'success' });
    },
  },
});`}
          >
            <Button variant="outline" onClick={undoDemo}>
              <Undo2 aria-hidden />
              断开并允许撤销
            </Button>
          </Preview>
        </SubSection>
        <SubSection title="时长与关闭" en="Duration & dismissal">
          <Prose>
            <ul>
              <li>
                默认 <code>{TOAST_DURATION}</code> ms；带动作的用 6000，错误 5000–8000；<code>Infinity</code> 只用于必须手动处理的情况（极少）。
              </li>
              <li>鼠标悬停、聚焦或窗口失焦时计时暂停，离开后继续（Radix 内置）。</li>
              <li>
                关闭方式：等待、右上角 ×、向右滑动（阈值 50px）、<Kbd>Esc</Kbd>（聚焦时）；<Kbd>F8</Kbd> 把焦点移到 toast 区域。
              </li>
              <li>
                程序化关闭：<code>toast()</code> 返回 <code>{'{ id, dismiss, update }'}</code>；<code>toast.dismiss()</code> 关闭全部。
              </li>
            </ul>
          </Prose>
        </SubSection>
        <SubSection title="位置" en="Placement" description="手机底部居中（避开拇指热区之外的顶部、留出安全区）；≥ 768 右上角，不遮挡顶部导航与主操作。">
          <Preview label="位置示意" background="canvas" padded>
            <PlacementDiagram />
          </Preview>
        </SubSection>
      </Section>

      <Section id="copy" title="文案" en="Copy" description="标题 ≤ 20 字、动词或结果开头、不加句号与感叹号；错误必须给出下一步。">
        <Prose>
          <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>场景</th>
                <th>推荐</th>
                <th>避免</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>连接成功</td>
                <td>已连接 · 东京 #12</td>
                <td>连接成功！🎉</td>
              </tr>
              <tr>
                <td>连接失败</td>
                <td>连接失败，请重试</td>
                <td>哎呀，好像出了点小问题</td>
              </tr>
              <tr>
                <td>复制</td>
                <td>已复制 IP 地址</td>
                <td>IP 地址已经成功复制到剪贴板。</td>
              </tr>
              <tr>
                <td>兑换</td>
                <td>兑换成功 · 年付已延长至 2027-09-01</td>
                <td>操作成功</td>
              </tr>
              <tr>
                <td>流量</td>
                <td>本月流量剩余 10%</td>
                <td>警告：您的流量即将耗尽，请及时购买套餐以免影响使用</td>
              </tr>
            </tbody>
          </table>
          </div>
        </Prose>
        <DoDont
          do={
            <div className="flex w-full max-w-xs items-start gap-3 rounded-lg border border-border-default bg-bg-surface px-4 py-3 shadow-level-3">
              <CircleX className="mt-0.5 size-5 text-status-error-solid" aria-hidden />
              <div>
                <p className="text-label-md">连接失败，请重试</p>
                <p className="text-body-sm text-fg-secondary">节点无响应（15 s 超时）</p>
              </div>
            </div>
          }
          dont={
            <div className="flex w-full max-w-xs items-start gap-3 rounded-lg border border-border-default bg-bg-surface px-4 py-3 shadow-level-3">
              <CircleX className="mt-0.5 size-5 text-status-error-solid" aria-hidden />
              <div>
                <p className="text-label-md">错误</p>
                <p className="text-body-sm text-fg-secondary">WG_HANDSHAKE_TIMEOUT (code 0x2f)</p>
              </div>
            </div>
          }
          doCaption="错误标题说明发生了什么与下一步；说明给出人话原因。"
          dontCaption="不要暴露错误码，不要用「错误」「提示」这种没有信息量的标题。"
        />
        <Callout tone="info" title="什么不该用 Toast">
          需要用户决定的事（断开？删除？）用 Dialog；持续状态（离线、连接中）用横幅或 StatusDot；表单校验错误写在字段下方。Toast 会消失，所以只放「看过就行」的信息。
        </Callout>
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              每条 toast 是 <code>&lt;li role="status"&gt;</code>（错误：<code>role="alert"</code>），Radix 同时以 <code>aria-live</code> 区域朗读：错误 <code>type="foreground"</code>（assertive），其余 background（polite）。
            </li>
            <li>
              视口是 <code>&lt;ol&gt;</code> 地标，标签「通知 (F8)」；<Kbd>F8</Kbd> 聚焦，<Kbd>Tab</Kbd> 在动作与关闭之间移动，<Kbd>Esc</Kbd> 关闭。
            </li>
            <li>
              动作按钮带 <code>altText</code>（默认等于 label），为无法及时到达按钮的用户提供替代说明。
            </li>
            <li>动效：进入 200ms decelerate（8px 位移）、退出 150ms accelerate；reduced motion 下退化为淡入淡出。</li>
            <li>不要把 toast 作为唯一的成功反馈：页面状态（按钮、StatusDot、列表）也要同步变化。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="API" en="API">
        <PropsTable
          caption="toast(options) → { id, dismiss, update }"
          rows={[
            { name: 'title', type: 'string', required: true, description: '标题，label-md，≤ 20 字。' },
            { name: 'description', type: 'string', description: '说明，body-sm，允许两行。' },
            { name: 'tone', type: "'neutral' | 'success' | 'warning' | 'error' | 'info'", default: "'neutral'", description: '语义：决定图标、颜色与 role。' },
            { name: 'duration', type: 'number', default: String(TOAST_DURATION), description: '自动关闭 ms；Infinity 不自动关闭。' },
            { name: 'action', type: '{ label: string; onClick: () => void; altText?: string }', description: '唯一动作按钮（secondary sm）。' },
          ]}
        />
        <PropsTable
          caption="快捷方法与 hook"
          rows={[
            { name: 'toast.success / info / warning / error', type: '(title, options?) => ToastHandle', description: '预设 tone 的简写。' },
            { name: 'toast.dismiss / dismissToast', type: '(id?: string) => void', description: '关闭一条或全部。' },
            { name: 'useToast()', type: '{ toasts, toast, dismiss }', description: '订阅 store（useSyncExternalStore）；toasts 含 open 标记。' },
            { name: 'TOAST_LIMIT / TOAST_DURATION', type: 'number', default: `${TOAST_LIMIT} / ${TOAST_DURATION}`, description: '常量。' },
          ]}
        />
        <PropsTable
          caption="<Toaster /> props"
          rows={[
            { name: 'label', type: 'string', default: "'通知 ({hotkey})'", description: '视口地标的可访问名称，{hotkey} 由 Radix 替换。' },
            { name: 'hotkey', type: 'string[]', default: "['F8']", description: '聚焦视口的快捷键。' },
            { name: 'className', type: 'string', description: '视口追加类名（位置覆盖）。' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>toast()</code></>, flutter: <><code>FToast</code> / <code>ScaffoldMessenger.showSnackBar</code>（floating）</>, ios: <>自定义 overlay（<code>.overlay</code> + <code>.transition</code>）</> },
            { web: '底部居中 / 右上', flutter: <><code>SnackBarBehavior.floating</code> + 底部</>, ios: <>顶部（避开状态栏）</> },
            { web: <><code>elevation.level-3</code></>, flutter: <><code>TpTokens.elevationLevel3</code></>, ios: <><code>TPTokens.elevationLevel3</code></> },
            { web: <><code>status.*.solid</code></>, flutter: <><code>TpTokens.colorStatusSuccessSolid …</code></>, ios: <><code>TPTokens.colorStatusSuccessSolid …</code></> },
            { web: <><code>duration 4000</code></>, flutter: <><code>Duration(seconds: 4)</code></>, ios: <><code>DispatchQueue.asyncAfter(4)</code></> },
          ]}
          dart={`import 'package:flutter/material.dart';
import 'package:tp_tokens/tp_tokens.dart';

void showTpToast(BuildContext context, {required String title, String? description, IconData? icon, Color? iconColor}) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      behavior: SnackBarBehavior.floating,
      backgroundColor: TpTokens.colorBgSurface,
      elevation: 0, // 阴影用 Container 自绘 TpTokens.elevationLevel3
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(TpTokens.radiusLg), // 16
        side: const BorderSide(color: TpTokens.colorBorderDefault),
      ),
      duration: const Duration(milliseconds: 4000),
      content: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (icon != null) Icon(icon, size: TpTokens.sizeIconSm, color: iconColor ?? TpTokens.colorStatusSuccessSolid),
          if (icon != null) const SizedBox(width: 12),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TpTokens.typographyLabelMd.copyWith(color: TpTokens.colorFgPrimary)),
                if (description != null)
                  Text(description, style: TpTokens.typographyBodySm.copyWith(color: TpTokens.colorFgSecondary)),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}`}
          dartFilename="lib/core/feedback/tp_toast.dart"
        />
      </Section>
    </>
  );
}
