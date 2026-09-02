import { useState } from 'react';
import { Label } from '@tpvpn/ui/components/ui/label';
import { Switch } from '@tpvpn/ui/components/ui/switch';
import { Callout, CodeBlock, DoDont, Grid, Kbd, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSelect, PropSwitch } from './_parts/PropToggles';

type Size = 'default' | 'sm';

const SWITCH_TOKENS = ['width', 'height', 'thumb', 'on-bg', 'off-bg', 'disabled-bg', 'thumb-bg'] as const;
const TOKEN_NOTES: Record<(typeof SWITCH_TOKENS)[number], string> = {
  width: '轨道宽度（iOS 比例）',
  height: '轨道高度',
  thumb: '滑块直径；位移 20px',
  'on-bg': '开启 · blue-500',
  'off-bg': '关闭 · slate-300',
  'disabled-bg': '禁用 · slate-200',
  'thumb-bg': '滑块 · 白 + 投影',
};

function SettingsRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  id: string;
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex min-h-control-md items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0">
        <Label htmlFor={id} className={disabled ? 'text-fg-disabled' : undefined}>
          {title}
        </Label>
        {description && <p className="mt-0.5 text-caption text-fg-muted">{description}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

export default function SwitchPage() {
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [size, setSize] = useState<Size>('default');

  const [autoConnect, setAutoConnect] = useState(true);
  const [lanBypass, setLanBypass] = useState(false);
  const [notify, setNotify] = useState(true);

  const previewCode = `import { Switch } from '@tpvpn/ui';

<Switch
  aria-label="自动连接"
  checked={${checked}}
  onCheckedChange={setChecked}${size === 'sm' ? `\n  size="sm"` : ''}${disabled ? `\n  disabled` : ''}
/>`;

  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="开关"
        en="Switch"
        description="布尔设置的即时开关。51 × 31 的 iOS 比例、27px 滑块、开启用 blue-500——一眼可读、拇指可及，切换立即生效，不需要「保存」。"
      />

      <Section id="preview" title="预览" en="Preview" description="切换右侧属性，代码面板会同步更新。">
        <Preview
          label="Switch 预览"
          code={previewCode}
          toolbar={
            <>
              <PropSelect label="size" value={size} onChange={setSize} options={[{ value: 'default' }, { value: 'sm' }]} />
              <PropSwitch label="checked" checked={checked} onChange={setChecked} />
              <PropSwitch label="disabled" checked={disabled} onChange={setDisabled} />
            </>
          }
        >
          <Switch aria-label="自动连接" checked={checked} onCheckedChange={setChecked} size={size} disabled={disabled} />
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <AnatomyPins
          pins={[
            { n: 1, label: '轨道 Track', note: '51 × 31 · radius-full · on blue-500 / off slate-300', x: 66, y: 50 },
            { n: 2, label: '滑块 Thumb', note: '27px 白色圆 · 投影 · 位移 20px · 200ms standard', x: 91, y: 6 },
            { n: 3, label: '标签 Label', note: 'label-md · 通过 htmlFor 关联', x: 22, y: 50 },
          ]}
        >
          <span className="flex items-center gap-4">
            <Label htmlFor="anatomy-switch">自动连接</Label>
            <Switch id="anatomy-switch" defaultChecked />
          </span>
        </AnatomyPins>
        <TokenTable
          caption="Switch 组件 token"
          rows={SWITCH_TOKENS.map((key) => ({
            name: `switch.${key}`,
            value: token(`switch.${key}`),
            preview: key.endsWith('bg') ? 'color' : 'spacing',
            description: TOKEN_NOTES[key],
          }))}
        />
      </Section>

      <Section id="states" title="状态" en="States" description="四个静态状态加键盘聚焦环；没有「中间态」——不确定时用加载或禁用。">
        <Preview label="Switch 状态" padded background="surface">
          <Grid cols={4} gap="lg" className="w-full">
            {(
              [
                ['开启 On', true, false],
                ['关闭 Off', false, false],
                ['开启 · 禁用', true, true],
                ['关闭 · 禁用', false, true],
              ] as const
            ).map(([label, on, off]) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <Switch aria-label={label} defaultChecked={on} disabled={off} />
                <span className="text-caption text-fg-muted">{label}</span>
              </div>
            ))}
          </Grid>
        </Preview>
        <Prose>
          <ul>
            <li>
              <strong>hover</strong>：无颜色变化（iOS 同款克制）；桌面端仅光标变为 pointer。
            </li>
            <li>
              <strong>focus-visible</strong>：聚焦环 <code>0 0 0 3px rgb(22 119 255 / 0.32)</code>（<code>shadow-focus</code>），随 Tab 出现、鼠标点击不出现。
            </li>
            <li>
              <strong>disabled</strong>：轨道 slate-200，滑块保持白色，<code>cursor: not-allowed</code>；标签用 <code>fg-disabled</code>。
            </li>
            <li>
              <strong>切换动效</strong>：滑块 <code>translate-x</code> + 轨道背景色，<code>duration.base</code> 200ms · <code>easing.standard</code>；reduced motion 时退化为 150ms。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="sizes" title="尺寸" en="Sizes" description="默认尺寸用于设置页与表单；sm 仅用于密集表格、工具栏或文档站的属性面板。">
        <Preview label="Switch 尺寸" background="surface">
          <div className="flex flex-wrap items-end justify-center gap-12">
            <div className="flex flex-col items-center gap-3">
              <Switch aria-label="默认尺寸" defaultChecked />
              <span className="text-caption text-fg-muted tnum">default · 51 × 31 · 滑块 27</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Switch aria-label="小尺寸" defaultChecked size="sm" />
              <span className="text-caption text-fg-muted tnum">sm · 36 × 22 · 滑块 18</span>
            </div>
          </div>
        </Preview>
        <Callout tone="warning" title="触控目标">
          轨道本身只有 31px 高，达不到 44px 的最小触控目标。放在设置行里时，整行（≥ 44px 高）都是可点击区域：标签用 <code>htmlFor</code> 关联开关，点击文字同样切换。
        </Callout>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <SubSection title="设置行" en="Settings row" description="App「我的 → 设置」中的标准写法：标题 label-md、说明 caption、开关右对齐、行高 ≥ 44。">
          <Preview
            label="设置行示例"
            padded={false}
            code={`import { Label, Switch } from '@tpvpn/ui';

<div className="flex min-h-control-md items-center justify-between gap-4 px-4 py-3">
  <div>
    <Label htmlFor="auto-connect">自动连接</Label>
    <p className="mt-0.5 text-caption text-fg-muted">启动 App 后自动连接上次使用的节点</p>
  </div>
  <Switch id="auto-connect" checked={autoConnect} onCheckedChange={setAutoConnect} />
</div>`}
          >
            <div className="w-full max-w-sm divide-y divide-border-subtle rounded-lg border border-border-default bg-bg-surface shadow-level-1">
              <SettingsRow id="row-auto" title="自动连接" description="启动 App 后自动连接上次使用的节点" checked={autoConnect} onCheckedChange={setAutoConnect} />
              <SettingsRow id="row-lan" title="允许局域网访问" description="连接时保留对打印机、NAS 的访问" checked={lanBypass} onCheckedChange={setLanBypass} />
              <SettingsRow id="row-notify" title="连接状态通知" checked={notify} onCheckedChange={setNotify} />
              <SettingsRow id="row-beta" title="加入测试计划" description="需要先登录账号" checked={false} onCheckedChange={() => undefined} disabled />
            </div>
          </Preview>
        </SubSection>

        <DoDont
          do={
            <div className="flex items-center gap-4">
              <Label htmlFor="do-switch">自动连接</Label>
              <Switch id="do-switch" defaultChecked />
            </div>
          }
          dont={
            <div className="flex items-center gap-4">
              <Label htmlFor="dont-switch">保存设置</Label>
              <Switch id="dont-switch" />
            </div>
          }
          doCaption="标签描述「会发生什么」，切换后立即生效，无需再点保存。"
          dontCaption="不要把开关当按钮：提交、保存、发送这类一次性动作用 Button。"
        />
        <DoDont
          do={
            <div className="flex items-center gap-4">
              <Label htmlFor="do-switch-2">连接状态通知</Label>
              <Switch id="do-switch-2" defaultChecked />
            </div>
          }
          dont={
            <div className="flex items-center gap-4">
              <Label htmlFor="dont-switch-2">通知</Label>
              <Switch id="dont-switch-2" defaultChecked />
              <span className="text-caption text-fg-muted">开</span>
            </div>
          }
          doCaption="状态由颜色 + 位置表达，标签用肯定句。"
          dontCaption="不要在旁边再写「开 / 关」，也不要用否定句标签（「不要通知」）。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              基于 Radix Switch：渲染 <code>&lt;button role="switch" aria-checked&gt;</code>，表单内通过隐藏 <code>&lt;input&gt;</code> 提交 <code>name / value</code>。
            </li>
            <li>
              键盘：<Kbd>Tab</Kbd> 聚焦，<Kbd>Space</Kbd> 切换（<Kbd>Enter</Kbd> 亦可）；聚焦环由 <code>focus-visible:shadow-focus</code> 提供。
            </li>
            <li>
              必须有可访问名称：优先 <code>&lt;Label htmlFor&gt;</code>，无可见文字时用 <code>aria-label</code>；说明文字用 <code>aria-describedby</code> 关联。
            </li>
            <li>状态不只靠颜色：滑块位置（左 / 右）是第二个信号；color-blind 用户依赖它。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props" description="继承 Radix Switch.Root 的全部 props，另加 size。">
        <PropsTable
          caption="Switch props"
          rows={[
            { name: 'size', type: "'sm' | 'default'", default: "'default'", description: 'default 51 × 31（滑块 27）；sm 36 × 22（滑块 18）。' },
            { name: 'checked', type: 'boolean', description: '受控状态。' },
            { name: 'defaultChecked', type: 'boolean', description: '非受控初始状态。' },
            { name: 'onCheckedChange', type: '(checked: boolean) => void', description: '切换回调。' },
            { name: 'disabled', type: 'boolean', default: 'false', description: '禁用：轨道 slate-200，不可交互。' },
            { name: 'required', type: 'boolean', description: '表单必填。' },
            { name: 'name', type: 'string', description: '表单字段名（提交时通过隐藏 input）。' },
            { name: 'value', type: 'string', default: "'on'", description: '提交时的值。' },
            { name: 'asChild', type: 'boolean', default: 'false', description: 'Radix Slot：把样式与行为合并到子元素。' },
            { name: 'className', type: 'string', description: '追加类名（cn 合并）。' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>&lt;Switch /&gt;</code></>, flutter: <><code>FSwitch</code> / <code>CupertinoSwitch</code></>, ios: <><code>Toggle</code></> },
            { web: <><code>switch.on-bg</code></>, flutter: <><code>TpTokens.switchOnBg</code></>, ios: <><code>TPTokens.colorBlue500</code></> },
            { web: <><code>switch.off-bg</code></>, flutter: <><code>TpTokens.switchOffBg</code></>, ios: <><code>TPTokens.colorSlate300</code></> },
            { web: <><code>51 × 31</code></>, flutter: <><code>TpTokens.switchWidth / switchHeight</code></>, ios: <><code>TPTokens.switchWidth / switchHeight</code></> },
          ]}
          dart={`import 'package:flutter/cupertino.dart';
import 'package:tp_tokens/tp_tokens.dart';

// 设置行：标题 + 说明 + 开关；整行可点击
ListTile(
  minTileHeight: TpTokens.sizeControlMd, // 44
  title: Text('自动连接', style: TpTokens.typographyLabelMd),
  subtitle: Text('启动 App 后自动连接上次使用的节点', style: TpTokens.typographyCaption),
  trailing: CupertinoSwitch(
    value: autoConnect,
    activeTrackColor: TpTokens.switchOnBg,      // #1677FF
    inactiveTrackColor: TpTokens.switchOffBg,   // #CBD5E1
    onChanged: (v) => setState(() => autoConnect = v),
  ),
  onTap: () => setState(() => autoConnect = !autoConnect),
);`}
          dartFilename="lib/features/settings/auto_connect_row.dart"
          swift={`Toggle("自动连接", isOn: $autoConnect)
    .tint(Color(TPTokens.colorBlue500))   // on 用 blue-500，系统尺寸即 51 × 31
    .font(.system(size: TPTokens.typographyLabelMd.size, weight: .medium))`}
          swiftFilename="AutoConnectRow.swift"
        >
          <p className="mt-3">
            两端系统开关的尺寸即为 51 × 31，无需自绘；只需把 on 色改为 <code>blue-500</code>。切换动效沿用系统默认（约 200ms）。
          </p>
        </PlatformMapping>
        <CodeBlock
          lang="css"
          filename="tokens.css（节选）"
          code={`--tp-switch-width: ${token('switch.width')};
--tp-switch-height: ${token('switch.height')};
--tp-switch-thumb: ${token('switch.thumb')};
--tp-switch-on-bg: ${token('switch.on-bg')};
--tp-switch-off-bg: ${token('switch.off-bg')};`}
        />
      </Section>
    </>
  );
}
