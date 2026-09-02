import { useState } from 'react';
import { UsageMeter } from '@tpvpn/ui/components/tp/usage-meter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tpvpn/ui/components/ui/card';
import { Callout, DoDont, Grid, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSelect } from './_parts/PropToggles';

type Preset = 'normal' | 'warning' | 'error' | 'unlimited';

const PRESETS: Record<Preset, { usedGb: number; totalGb: number | null; note: string }> = {
  normal: { usedGb: 12.4, totalGb: 50, note: '24.8% · blue-500' },
  warning: { usedGb: 42, totalGb: 50, note: '84% · amber-500 · 数值 warning-fg' },
  error: { usedGb: 49, totalGb: 50, note: '98% · red-500 · 数值 error-fg' },
  unlimited: { usedGb: 268.3, totalGb: null, note: '无限制 · 进度 0，仅显示用量' },
};

export default function UsageMeterPage() {
  const [preset, setPreset] = useState<Preset>('normal');
  const [label, setLabel] = useState<'已用流量' | '本月流量' | '已用 · 年付'>('已用流量');
  const p = PRESETS[preset];

  const previewCode = `import { UsageMeter } from '@tpvpn/ui';

<UsageMeter usedGb={${p.usedGb}} totalGb={${p.totalGb === null ? 'null' : p.totalGb}}${label !== '已用流量' ? ` label="${label}"` : ''} />`;

  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="用量指示"
        en="Usage Meter"
        description="套餐流量进度：标签 + tabular 数值 + 8px 圆角进度条。80% 起变琥珀、95% 起变红，数值同步换色；无限制套餐只显示用量。"
      />

      <Section id="preview" title="预览" en="Preview">
        <Preview
          label="UsageMeter 预览"
          code={previewCode}
          toolbar={
            <>
              <PropSelect
                label="preset"
                value={preset}
                onChange={setPreset}
                options={[
                  { value: 'normal', label: '12.4 / 50' },
                  { value: 'warning', label: '42 / 50' },
                  { value: 'error', label: '49 / 50' },
                  { value: 'unlimited', label: '无限制' },
                ]}
              />
              <PropSelect label="label" value={label} onChange={setLabel} options={[{ value: '已用流量' }, { value: '本月流量' }, { value: '已用 · 年付' }]} />
            </>
          }
        >
          <div className="w-full max-w-sm">
            <UsageMeter usedGb={p.usedGb} totalGb={p.totalGb} label={label} />
          </div>
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <AnatomyPins
          pins={[
            { n: 1, label: '标签', note: 'label-md · fg-secondary', x: 4, y: 12 },
            { n: 2, label: '已用值', note: 'numeric-sm 18/24 600 tabular · 阈值换色', x: 70, y: 12 },
            { n: 3, label: '总量', note: 'caption fg-muted · 「/ 50 GB」或「/ 无限制」', x: 96, y: 12 },
            { n: 4, label: '进度条', note: 'Progress · 高 8 · radius-full · 轨道 slate-100', x: 50, y: 86 },
            { n: 5, label: '指示条', note: 'blue-500 → amber-500（≥ 80%）→ red-500（≥ 95%）· 300ms standard', x: 12, y: 86 },
          ]}
          frameClassName="w-[20rem] max-w-full"
        >
          <UsageMeter usedGb={12.4} totalGb={50} />
        </AnatomyPins>
        <TokenTable
          caption="UsageMeter 使用的 token"
          rows={[
            { name: 'color.blue.500', value: token('color.blue.500'), preview: 'color', description: '< 80%' },
            { name: 'color.amber.500', value: token('color.amber.500'), preview: 'color', description: '80–95%' },
            { name: 'color.red.500', value: token('color.red.500'), preview: 'color', description: '≥ 95%' },
            { name: 'color.status.warning.fg', value: token('color.status.warning.fg'), preview: 'color', description: '数值 · 80–95%（amber-700，4.5:1+）' },
            { name: 'color.status.error.fg', value: token('color.status.error.fg'), preview: 'color', description: '数值 · ≥ 95%（red-700）' },
            { name: 'color.bg.surface-sunken', value: token('color.bg.surface-sunken'), preview: 'color', description: '轨道' },
            { name: 'typography.numeric-sm', value: token('typography.numeric-sm'), preview: 'text', description: '已用值' },
            { name: 'duration.moderate', value: token('duration.moderate'), preview: 'duration', description: '进度过渡' },
          ]}
        />
      </Section>

      <Section id="examples" title="示例" en="Examples" description="同一套餐（50 GB）在三个区间的表现，以及无限制套餐。">
        <Preview label="四个示例" background="surface" padded>
          <Grid cols={2} gap="lg" className="w-full">
            {(Object.keys(PRESETS) as Preset[]).map((key) => (
              <div key={key} className="flex flex-col gap-2 rounded-lg border border-border-default bg-bg-surface p-4">
                <UsageMeter usedGb={PRESETS[key].usedGb} totalGb={PRESETS[key].totalGb} />
                <span className="text-caption text-fg-muted tnum">{PRESETS[key].note}</span>
              </div>
            ))}
          </Grid>
        </Preview>
        <SubSection title="在卡片中" en="In a card" description="「我的」页流量卡：标题 + 重置日期 + UsageMeter。">
          <Preview
            label="流量卡片"
            code={`<Card>
  <CardHeader>
    <CardTitle>本月流量</CardTitle>
    <CardDescription>年付套餐 · 2026-10-01 重置</CardDescription>
  </CardHeader>
  <CardContent>
    <UsageMeter usedGb={42} totalGb={50} label="已用" />
    <p className="mt-3 text-caption text-status-warning-fg">超过 80%：超出后限速至 10 Mbps，可升级套餐。</p>
  </CardContent>
</Card>`}
          >
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>本月流量</CardTitle>
                <CardDescription>年付套餐 · 2026-10-01 重置</CardDescription>
              </CardHeader>
              <CardContent>
                <UsageMeter usedGb={42} totalGb={50} label="已用" />
                <p className="mt-3 text-caption text-status-warning-fg">超过 80%：超出后限速至 10 Mbps，可升级套餐。</p>
              </CardContent>
            </Card>
          </Preview>
        </SubSection>
      </Section>

      <Section id="thresholds" title="阈值与格式" en="Thresholds & formats">
        <Prose>
          <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>区间</th>
                <th>指示条</th>
                <th>数值颜色</th>
                <th>data-tone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>&lt; 80%</td>
                <td>blue-500</td>
                <td>fg-primary</td>
                <td>
                  <code>default</code>
                </td>
              </tr>
              <tr>
                <td>80% – 95%</td>
                <td>amber-500</td>
                <td>status.warning.fg（amber-700）</td>
                <td>
                  <code>warning</code>
                </td>
              </tr>
              <tr>
                <td>≥ 95%</td>
                <td>red-500</td>
                <td>status.error.fg（red-700）</td>
                <td>
                  <code>error</code>
                </td>
              </tr>
              <tr>
                <td>无限制（totalGb = null）</td>
                <td>0%（空轨道）</td>
                <td>fg-primary</td>
                <td>
                  <code>default</code>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          <h3>数值格式</h3>
          <ul>
            <li>
              整数不带小数：<code>42 GB</code>；非整数保留一位：<code>12.4 GB</code>；负数按 0 处理。
            </li>
            <li>
              总量格式：<code>/ 50 GB</code>；无限制：<code>/ 无限制</code>。单位固定为 GB，由组件拼接——传入值本身就是 GB。
            </li>
            <li>
              全部数字使用 <code>tabular</code>（等宽数字），刷新时不会左右抖动；进度 &gt; 100% 时进度条封顶，数值照常显示（如 <code>52 GB / 50 GB</code>）。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={
            <div className="w-full max-w-xs">
              <UsageMeter usedGb={42} totalGb={50} />
            </div>
          }
          dont={
            <div className="w-full max-w-xs">
              <UsageMeter usedGb={42} totalGb={50} label="流量使用情况（已用 / 总计，单位 GB）" />
            </div>
          }
          doCaption="标签两三个字，数值自己会说话。"
          dontCaption="不要在标签里重复数值已经表达的信息，也不要写单位——组件会拼。"
        />
        <Callout tone="info" title="超出上限的文案">
          ≥ 80% 时在下方补一行 caption 说明后果与出路（「超出后限速至 10 Mbps，可升级套餐」），不要用弹窗打断。达到 100% 后，页面上的连接按钮仍可用——TP VPN 是限速而不是断网。
        </Callout>
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              进度条来自 Radix Progress：<code>role="progressbar"</code> + <code>aria-valuenow / aria-valuemin / aria-valuemax</code>（0–100），<code>aria-label</code> 取 <code>label</code>。
            </li>
            <li>颜色不是唯一信号：数值文字同步变色、且旁边可见「/ 50 GB」——屏幕阅读器读到百分比，色盲用户读到数字。</li>
            <li>amber-700 / red-700 在白底上分别为 4.5:1 以上，数值文字符合 AA；进度条颜色本身是装饰，不要求对比度。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props">
        <PropsTable
          caption="UsageMeter props"
          rows={[
            { name: 'usedGb', type: 'number', required: true, description: '已用流量（GB）。负数按 0。' },
            { name: 'totalGb', type: 'number | null', required: true, description: '套餐总量（GB）；null = 无限制（进度 0，显示「/ 无限制」）。' },
            { name: 'label', type: 'string', default: "'已用流量'", description: '标签文字，同时作为进度条的 aria-label。' },
            { name: 'className', type: 'string', description: '追加到根元素（flex-col gap-2）。' },
            { name: '…rest', type: "React.ComponentProps<'div'>", description: '透传到根 div；根元素带 data-tone="default | warning | error"。' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>&lt;UsageMeter /&gt;</code></>, flutter: <><code>LinearProgressIndicator(minHeight: 8)</code></>, ios: <><code>ProgressView(value:)</code> 自定义 style</> },
            { web: '阈值着色', flutter: <><code>TpTokens.colorBlue500 / colorAmber500 / colorRed500</code></>, ios: <><code>TPTokens.colorBlue500 …</code></> },
            { web: <><code>typography.numeric-sm</code></>, flutter: <><code>TpTokens.typographyNumericSm</code></>, ios: <><code>TPTokens.typographyNumericSm</code> + <code>.monospacedDigit()</code></> },
            { web: '轨道 slate-100', flutter: <><code>TpTokens.colorBgSurfaceSunken</code></>, ios: <><code>TPTokens.colorBgSurfaceSunken</code></> },
          ]}
          dart={`import 'package:flutter/material.dart';
import 'package:tp_tokens/tp_tokens.dart';

class UsageMeter extends StatelessWidget {
  const UsageMeter({super.key, required this.usedGb, required this.totalGb, this.label = '已用流量'});
  final double usedGb;
  final double? totalGb; // null = 无限制
  final String label;

  @override
  Widget build(BuildContext context) {
    final pct = totalGb == null || totalGb! <= 0 ? 0.0 : (usedGb / totalGb!).clamp(0.0, 1.0);
    final color = totalGb != null && pct >= 0.95
        ? TpTokens.colorRed500
        : totalGb != null && pct >= 0.8
            ? TpTokens.colorAmber500
            : TpTokens.colorBlue500;
    final valueColor = totalGb != null && pct >= 0.95
        ? TpTokens.colorStatusErrorFg
        : totalGb != null && pct >= 0.8
            ? TpTokens.colorStatusWarningFg
            : TpTokens.colorFgPrimary;

    String fmt(double v) => v == v.roundToDouble() ? v.toStringAsFixed(0) : v.toStringAsFixed(1);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Text(label, style: TpTokens.typographyLabelMd.copyWith(color: TpTokens.colorFgSecondary)),
            const Spacer(),
            Text('\${fmt(usedGb)} GB', style: TpTokens.typographyNumericSm.copyWith(color: valueColor)),
            const SizedBox(width: 4),
            Text(totalGb == null ? '/ 无限制' : '/ \${fmt(totalGb!)} GB',
                style: TpTokens.typographyCaption.copyWith(color: TpTokens.colorFgMuted)),
          ],
        ),
        const SizedBox(height: 8),
        Semantics(
          label: label,
          value: '\${(pct * 100).round()}%',
          child: LinearProgressIndicator(
            value: pct,
            minHeight: 8,
            borderRadius: BorderRadius.circular(TpTokens.radiusFull),
            backgroundColor: TpTokens.colorBgSurfaceSunken,
            color: color,
          ),
        ),
      ],
    );
  }
}`}
          dartFilename="lib/widgets/usage_meter.dart"
        />
      </Section>
    </>
  );
}
