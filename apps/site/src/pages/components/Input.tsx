import { useId, useState, type ReactNode } from 'react';
import { Eye, EyeOff, Mail, Search, Ticket } from 'lucide-react';
import { Button } from '@tpvpn/ui/components/ui/button';
import { Input } from '@tpvpn/ui/components/ui/input';
import { Label } from '@tpvpn/ui/components/ui/label';
import { Callout, DoDont, Grid, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { cn } from '@/lib/cn';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSelect, PropSwitch } from './_parts/PropToggles';

type FieldState = 'default' | 'error' | 'disabled';
type Height = 'sm' | 'md' | 'lg';

const HEIGHT_CLASS: Record<Height, string> = { sm: 'h-control-sm', md: '', lg: 'h-control-lg' };
const HEIGHT_PX: Record<Height, number> = { sm: 36, md: 44, lg: 52 };

const INPUT_TOKENS = ['height', 'radius', 'padding-x', 'bg', 'bg-sunken', 'border', 'border-hover', 'border-focus', 'fg', 'placeholder'] as const;
const TOKEN_NOTES: Record<(typeof INPUT_TOKENS)[number], string> = {
  height: '默认高度 = size.control.md',
  radius: 'radius.md',
  'padding-x': '横向内边距',
  bg: '白底',
  'bg-sunken': '凹陷面（搜索栏 / 表格内）',
  border: '默认描边 slate-200',
  'border-hover': 'hover 描边 slate-300',
  'border-focus': '聚焦描边 blue-500 + 聚焦环',
  fg: '输入文字',
  placeholder: '占位文字 slate-400（仅占位可用）',
};

/** Label + Input + helper / error caption, wired with aria-describedby / aria-invalid. */
function Field({
  label,
  helper,
  error,
  children,
  id,
  className,
}: {
  label: string;
  helper?: string;
  error?: string;
  id: string;
  className?: string;
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => ReactNode;
}) {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const describedBy = [error ? errorId : null, helper ? helperId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error ? (
        <p id={errorId} className="text-caption text-status-error-fg" role="alert">
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className="text-caption text-fg-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

/** XXXX-XXXX-XXXX-XXXX — upper-case alphanumerics grouped by 4. */
function formatRedeemCode(raw: string) {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
  return clean.replace(/(.{4})(?=.)/g, '$1-');
}

function PasswordField() {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <Field id={id} label="密码" helper="至少 8 位，包含字母与数字">
      {(a) => (
        <div className="relative">
          <Input {...a} type={show ? 'text' : 'password'} autoComplete="current-password" defaultValue="tp-vpn-2026" className="pr-12" />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? '隐藏密码' : '显示密码'}
            aria-pressed={show}
            className="absolute top-1/2 right-1 -translate-y-1/2 text-fg-muted"
          >
            {show ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      )}
    </Field>
  );
}

function RedeemField() {
  const id = useId();
  const [code, setCode] = useState('TPVP-2026-8K4Q-W7ZX');
  return (
    <Field id={id} label="兑换码" helper="16 位，字母不区分大小写；在「我的 → 兑换」里输入">
      {(a) => (
        <div className="relative">
          <Ticket className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-fg-muted" aria-hidden />
          <Input
            {...a}
            value={code}
            onChange={(e) => setCode(formatRedeemCode(e.target.value))}
            inputMode="text"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            maxLength={19}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            className="pl-11 font-mono tracking-wide uppercase"
          />
        </div>
      )}
    </Field>
  );
}

export default function InputPage() {
  const [state, setState] = useState<FieldState>('default');
  const [height, setHeight] = useState<Height>('md');
  const [leading, setLeading] = useState(false);
  const [suffix, setSuffix] = useState(false);
  const previewId = useId();

  const errorMsg = state === 'error' ? '邮箱格式不正确' : undefined;
  const previewCode = `import { Input, Label } from '@tpvpn/ui';${leading ? `\nimport { Mail } from 'lucide-react';` : ''}

<div className="flex flex-col gap-1.5">
  <Label htmlFor="email">邮箱</Label>
  <div className="relative">${leading ? `\n    <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-fg-muted" aria-hidden />` : ''}
    <Input
      id="email"
      type="email"
      placeholder="name@example.com"
      autoComplete="email"${state === 'error' ? `\n      aria-invalid\n      aria-describedby="email-error"` : ''}${state === 'disabled' ? `\n      disabled` : ''}${leading || suffix || height !== 'md' ? `\n      className="${[HEIGHT_CLASS[height], leading ? 'pl-11' : '', suffix ? 'pr-24' : ''].filter(Boolean).join(' ')}"` : ''}
    />${suffix ? `\n    <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-body-sm text-fg-muted">@tpvpn.app</span>` : ''}
  </div>${state === 'error' ? `\n  <p id="email-error" className="text-caption text-status-error-fg" role="alert">邮箱格式不正确</p>` : `\n  <p className="text-caption text-fg-muted">用于接收订单与登录验证码</p>`}
</div>`;

  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="输入框"
        en="Input"
        description="表单输入的基础控件：高度 44、圆角 12、slate-200 描边，聚焦时蓝色描边 + 聚焦环。原生 <input> 语义，配合 Label 与 caption 组成完整的表单字段。"
      />

      <Section id="preview" title="预览" en="Preview" description="切换状态、高度与前后缀，代码同步更新。">
        <Preview
          label="Input 预览"
          code={previewCode}
          toolbar={
            <>
              <PropSelect label="state" value={state} onChange={setState} options={[{ value: 'default' }, { value: 'error' }, { value: 'disabled' }]} />
              <PropSelect label="height" value={height} onChange={setHeight} options={[{ value: 'sm', label: '36' }, { value: 'md', label: '44' }, { value: 'lg', label: '52' }]} />
              <PropSwitch label="leading icon" checked={leading} onChange={setLeading} />
              <PropSwitch label="suffix" checked={suffix} onChange={setSuffix} />
            </>
          }
        >
          <Field id={previewId} label="邮箱" helper="用于接收订单与登录验证码" error={errorMsg} className="max-w-sm">
            {(a) => (
              <div className="relative">
                {leading && <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-fg-muted" aria-hidden />}
                <Input
                  {...a}
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={state === 'disabled'}
                  defaultValue={state === 'error' ? 'carter@' : undefined}
                  className={cn(HEIGHT_CLASS[height], leading && 'pl-11', suffix && 'pr-24')}
                />
                {suffix && <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-body-sm text-fg-muted">@tpvpn.app</span>}
              </div>
            )}
          </Field>
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy" description="Input 只负责输入框本身；标签、图标、帮助 / 错误文字由页面按此模式组合。">
        <AnatomyPins
          pins={[
            { n: 1, label: '标签 Label', note: 'label-md · htmlFor 关联', x: 4, y: 6 },
            { n: 2, label: '前置图标', note: '20px · fg-muted · 左内边距改为 44', x: 7, y: 50 },
            { n: 3, label: '输入框', note: '44 高 · radius-md 12 · 描边 slate-200 · 内边距 16', x: 50, y: 50 },
            { n: 4, label: '后缀', note: 'body-sm fg-muted，或 32px 图标按钮', x: 90, y: 50 },
            { n: 5, label: '帮助 / 错误文字', note: 'caption · 错误用 red-700 + role="alert"', x: 4, y: 96 },
          ]}
          frameClassName="w-[22rem] max-w-full"
        >
          <div className="flex w-full flex-col gap-1.5">
            <Label htmlFor="anatomy-input">邮箱</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-fg-muted" aria-hidden />
              <Input id="anatomy-input" type="email" defaultValue="carter" className="pl-11 pr-24" aria-describedby="anatomy-helper" />
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-body-sm text-fg-muted">@tpvpn.app</span>
            </div>
            <p id="anatomy-helper" className="text-caption text-fg-muted">
              用于接收订单与登录验证码
            </p>
          </div>
        </AnatomyPins>
        <TokenTable
          caption="Input 组件 token"
          rows={INPUT_TOKENS.map((key) => ({
            name: `input.${key}`,
            value: token(`input.${key}`),
            preview: /bg|border|fg|placeholder/.test(key) ? 'color' : key === 'radius' ? 'radius' : 'spacing',
            description: TOKEN_NOTES[key],
          }))}
        />
      </Section>

      <Section id="states" title="状态" en="States" description="描边是唯一的状态载体：默认 slate-200 → hover slate-300 → focus blue-500 + 聚焦环 → error red-500。">
        <Preview label="Input 状态" background="surface" padded>
          <Grid cols={2} gap="lg" className="w-full max-w-2xl">
            <Field id="st-default" label="默认">
              {(a) => <Input {...a} placeholder="name@example.com" />}
            </Field>
            <Field id="st-focus" label="聚焦（点击查看）" helper="border-focus + shadow-focus">
              {(a) => <Input {...a} defaultValue="carter@tpvpn.app" />}
            </Field>
            <Field id="st-error" label="错误" error="邮箱格式不正确">
              {(a) => <Input {...a} defaultValue="carter@" />}
            </Field>
            <Field id="st-disabled" label="禁用" helper="slate-100 底 · slate-400 字">
              {(a) => <Input {...a} defaultValue="carter@tpvpn.app" disabled />}
            </Field>
            <Field id="st-readonly" label="只读" helper="可选中复制，不可编辑">
              {(a) => <Input {...a} defaultValue="203.0.113.42" readOnly className="font-mono" />}
            </Field>
            <Field id="st-search" label="凹陷面（搜索）" helper="bg-bg-surface-sunken · 无描边，见 SearchBar">
              {(a) => (
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-fg-muted" aria-hidden />
                  <Input {...a} type="search" placeholder="搜索国家、城市或节点" className="border-transparent bg-bg-surface-sunken pl-11 focus-visible:bg-bg-surface" />
                </div>
              )}
            </Field>
          </Grid>
        </Preview>
      </Section>

      <Section id="variants" title="变体" en="Variants">
        <SubSection title="密码" en="Password" description="右侧 32px 幽灵图标按钮切换可见性；按钮带 aria-label 与 aria-pressed。">
          <Preview
            label="密码输入"
            background="surface"
            code={`const [show, setShow] = useState(false);

<div className="relative">
  <Input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" className="pr-12" />
  <Button
    type="button" variant="ghost" size="icon-sm"
    onClick={() => setShow((s) => !s)}
    aria-label={show ? '隐藏密码' : '显示密码'} aria-pressed={show}
    className="absolute top-1/2 right-1 -translate-y-1/2 text-fg-muted"
  >
    {show ? <EyeOff /> : <Eye />}
  </Button>
</div>`}
          >
            <div className="w-full max-w-sm">
              <PasswordField />
            </div>
          </Preview>
        </SubSection>

        <SubSection title="兑换码" en="Redeem code" description="等宽、大写、加宽字距，4-4-4-4 自动分组；粘贴任意格式都会被规整。">
          <Preview
            label="兑换码输入"
            background="surface"
            code={`/** XXXX-XXXX-XXXX-XXXX — 大写字母数字，每 4 位一组 */
function formatRedeemCode(raw: string) {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
  return clean.replace(/(.{4})(?=.)/g, '$1-');
}

<Input
  id="redeem"
  value={code}
  onChange={(e) => setCode(formatRedeemCode(e.target.value))}
  inputMode="text" autoCapitalize="characters" autoCorrect="off" spellCheck={false}
  maxLength={19}
  placeholder="XXXX-XXXX-XXXX-XXXX"
  className="pl-11 font-mono tracking-wide uppercase"
/>`}
          >
            <div className="w-full max-w-sm">
              <RedeemField />
            </div>
          </Preview>
          <Callout tone="info" title="等宽字体的场景">
            IP 地址、密钥、兑换码一律用 <code>font-mono</code>（ui-monospace / SF Mono / Menlo / Consolas），数字天然等宽，肉眼核对不会错位。
          </Callout>
        </SubSection>
      </Section>

      <Section id="sizes" title="尺寸" en="Sizes" description="Input 没有 size prop——默认即 44（触控最小值）。需要其它高度时用控件高度类覆盖。">
        <Preview label="Input 高度" background="surface">
          <div className="flex w-full max-w-sm flex-col gap-4">
            {(['sm', 'md', 'lg'] as const).map((h) => (
              <div key={h} className="flex items-center gap-4">
                <Input aria-label={`高度 ${HEIGHT_PX[h]}`} placeholder={`h-control-${h} · ${HEIGHT_PX[h]}px`} className={HEIGHT_CLASS[h]} />
                <span className="w-10 shrink-0 text-caption text-fg-muted tnum">{HEIGHT_PX[h]}</span>
              </div>
            ))}
          </div>
        </Preview>
        <Prose>
          <ul>
            <li>
              <strong>36</strong>（<code>h-control-sm</code>）：桌面端密集表单、表格内联编辑、筛选栏。
            </li>
            <li>
              <strong>44</strong>（默认）：App 与官网所有表单；这是触控最小尺寸。
            </li>
            <li>
              <strong>52</strong>（<code>h-control-lg</code>）：登录 / 兑换等单字段页面，与 lg 按钮等高。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={
            <div className="w-full max-w-xs">
              <Field id="do-label" label="邮箱" helper="用于接收订单与登录验证码">
                {(a) => <Input {...a} type="email" placeholder="name@example.com" />}
              </Field>
            </div>
          }
          dont={
            <div className="w-full max-w-xs">
              <Input aria-label="邮箱" type="email" placeholder="请输入邮箱（用于接收订单与登录验证码）" />
            </div>
          }
          doCaption="标签常驻在上方，占位符只示例格式，帮助文字放在下方。"
          dontCaption="不要用占位符代替标签或说明——输入后信息就消失了，且 slate-400 只是占位级对比度。"
        />
        <DoDont
          do={
            <div className="w-full max-w-xs">
              <Field id="do-error" label="兑换码" error="兑换码无效或已使用">
                {(a) => <Input {...a} defaultValue="TPVP-2026-0000-0000" className="font-mono tracking-wide uppercase" />}
              </Field>
            </div>
          }
          dont={
            <div className="w-full max-w-xs">
              <Field id="dont-error" label="兑换码" error="错误：E_CODE_INVALID (409)">
                {(a) => <Input {...a} defaultValue="TPVP-2026-0000-0000" className="font-mono tracking-wide uppercase" />}
              </Field>
            </div>
          }
          doCaption="提交时校验、输入时清除；错误文字说明原因或下一步。"
          dontCaption="不要把技术错误码暴露给用户，也不要在每次击键时就报错。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              原生 <code>&lt;input&gt;</code>：始终给 <code>id</code> 并用 <code>&lt;Label htmlFor&gt;</code> 关联；无可见标签时才用 <code>aria-label</code>。
            </li>
            <li>
              错误态：<code>aria-invalid</code> 触发红色描边与红色聚焦环；错误文字 <code>role="alert"</code> 并通过 <code>aria-describedby</code> 关联，屏幕阅读器会在聚焦时朗读。
            </li>
            <li>
              帮助文字同样用 <code>aria-describedby</code>；多个 id 用空格分隔（错误在前）。
            </li>
            <li>
              正确的 <code>type / inputMode / autoComplete</code>（<code>email</code>、<code>current-password</code>、兑换码 <code>autoCapitalize="characters"</code>）让移动端弹出合适键盘。
            </li>
            <li>
              占位符对比度 4.76:1 以下（slate-400 为 2.9:1），因此占位符<strong>不能</strong>承载必要信息。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props" description="Input 透传全部原生 <input> 属性（React.ComponentProps<'input'>），没有额外 prop。">
        <PropsTable
          caption="Input props"
          rows={[
            { name: 'type', type: "React.HTMLInputTypeAttribute", default: "'text'", description: 'email / password / search / number / file … 原样透传。' },
            { name: 'className', type: 'string', description: '追加类名（cn 合并）：高度、内边距、font-mono 等。' },
            { name: 'disabled', type: 'boolean', description: '禁用：slate-100 底、slate-400 字、不可点击。' },
            { name: 'aria-invalid', type: "boolean | 'true' | 'false'", description: '错误态描边与聚焦环（通过 aria-invalid: 变体）。' },
            { name: 'readOnly', type: 'boolean', description: '只读；样式同默认，可选中复制。' },
            { name: '…rest', type: "React.ComponentProps<'input'>", description: 'value / defaultValue / onChange / placeholder / inputMode / autoComplete / maxLength 等。' },
          ]}
        />
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>&lt;Input /&gt;</code></>, flutter: <><code>FTextField</code></>, ios: <><code>TextField</code> + 自定义 style</> },
            { web: <><code>input.height 44</code></>, flutter: <><code>TpTokens.inputHeight</code></>, ios: <><code>TPTokens.inputHeight</code></> },
            { web: <><code>input.radius 12</code></>, flutter: <><code>TpTokens.inputRadius</code></>, ios: <><code>TPTokens.inputRadius</code></> },
            { web: <><code>input.border / border-focus</code></>, flutter: <><code>TpTokens.inputBorder / inputBorderFocus</code></>, ios: <><code>TPTokens.colorBorderDefault / colorBorderFocus</code></> },
            { web: 'font-mono 兑换码', flutter: <><code>TpTokens.typographyMono</code> + <code>UpperCaseTextFormatter</code></>, ios: <><code>.monospaced()</code> + <code>.textInputAutocapitalization(.characters)</code></> },
          ]}
          dart={`import 'package:flutter/material.dart';
import 'package:tp_tokens/tp_tokens.dart';

// 邮箱字段：标签 + 44 高输入框 + 帮助 / 错误文字
TextField(
  controller: emailCtrl,
  keyboardType: TextInputType.emailAddress,
  autofillHints: const [AutofillHints.email],
  style: TpTokens.typographyBodyMd,
  decoration: InputDecoration(
    labelText: '邮箱',
    helperText: '用于接收订单与登录验证码',
    errorText: emailError, // null 时不显示
    prefixIcon: const Icon(Icons.mail_outline, size: TpTokens.sizeIconSm),
    filled: true,
    fillColor: TpTokens.inputBg,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16),
    constraints: const BoxConstraints(minHeight: TpTokens.inputHeight), // 44
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(TpTokens.inputRadius), // 12
      borderSide: const BorderSide(color: TpTokens.inputBorder),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(TpTokens.inputRadius),
      borderSide: const BorderSide(color: TpTokens.inputBorderFocus, width: 1.5),
    ),
  ),
);`}
          dartFilename="lib/features/auth/email_field.dart"
        />
      </Section>
    </>
  );
}
