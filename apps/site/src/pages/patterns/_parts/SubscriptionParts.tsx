import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { Gift, Share2 } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  LoadingState,
  PlanCard,
  RadioGroup,
  RadioGroupItem,
  Tag,
  ToggleGroup,
  ToggleGroupItem,
} from '@tpvpn/ui';
import { CopyButton, Preview } from '@/components/docs';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface PlanSpec {
  key: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: ReactNode;
  cta: ReactNode;
}

const PLANS: PlanSpec[] = [
  {
    key: 'monthly',
    name: '月付',
    price: '¥30',
    period: '月',
    description: '按月付费，随时停止',
    features: ['2 台设备同时在线', '50 GB 高速流量（FUP）', '智能选路 + 场景专线', 'WireGuard · 无日志'],
    cta: <Button variant="secondary">选择月付</Button>,
  },
  {
    key: 'yearly',
    name: '年付',
    price: '¥252',
    period: '年',
    description: '一次付清，相当于每月 ¥21',
    highlighted: true,
    badge: (
      <Tag tone="brand" size="md">
        推荐
      </Tag>
    ),
    features: ['8 台设备同时在线', '3 TB 高速流量（FUP）', 'IEPL 优选线路', '智能选路 + 场景专线', 'WireGuard · 无日志'],
    cta: <Button>选择年付</Button>,
  },
  {
    key: 'enterprise',
    name: '企业',
    price: '按需',
    description: '团队与业务场景',
    features: ['50 台设备', '不限流量', '固定出口 IP', 'IEPL 优选线路', 'WireGuard · 无日志'],
    cta: <Button variant="outline">联系我们</Button>,
  },
];

const METHODS = [
  { value: 'card', badge: '卡', name: '银行卡', desc: '国际信用卡 / 借记卡' },
  { value: 'alipay', badge: '支付宝', name: '支付宝', desc: '人民币' },
  { value: 'wechat', badge: '微信', name: '微信支付', desc: '人民币' },
  { value: 'usdt', badge: 'USDT', name: 'USDT', desc: '稳定币 · 链上到账' },
] as const;

const CODE_PLANS = `import { Button, PlanCard, Tag } from '@tpvpn/ui';

<div className="grid gap-4 lg:grid-cols-3">
  <PlanCard
    name="月付"
    price="¥30"
    period="月"
    description="按月付费，随时停止"
    features={['2 台设备同时在线', '50 GB 高速流量（FUP）', '智能选路 + 场景专线', 'WireGuard · 无日志']}
    cta={<Button variant="secondary">选择月付</Button>}
  />
  <PlanCard
    name="年付"
    price="¥252"
    period="年"
    description="一次付清，相当于每月 ¥21"
    highlighted
    badge={<Tag tone="brand" size="md">推荐</Tag>}
    features={['8 台设备同时在线', '3 TB 高速流量（FUP）', 'IEPL 优选线路', '智能选路 + 场景专线', 'WireGuard · 无日志']}
    cta={<Button>选择年付</Button>}
    className="lg:-translate-y-2"
  />
  <PlanCard
    name="企业"
    price="按需"
    description="团队与业务场景"
    features={['50 台设备', '不限流量', '固定出口 IP', 'IEPL 优选线路', 'WireGuard · 无日志']}
    cta={<Button variant="outline">联系我们</Button>}
  />
</div>`;

export const CODE_PRICE = `<div className="flex items-baseline gap-1">
  <span className="text-label-md text-fg-secondary">¥</span>
  <span className="text-numeric-lg tabular text-fg-primary">252</span>
  <span className="text-caption text-fg-secondary">/ 年</span>
</div>
<div className="mt-1 flex items-center gap-2">
  <span className="text-body-sm tabular text-fg-muted line-through">¥360</span>
  <Tag tone="success">省 30%</Tag>
</div>`;

export const CODE_REDEEM = `import { useState } from 'react';
import { Button, Input, Label } from '@tpvpn/ui';

/** 只保留 A–Z 0–9，最多 16 位；显示时每 4 位插入空格，提交时用 clean。 */
function formatCode(raw: string) {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
  return { clean, display: clean.replace(/(.{4})(?=.)/g, '$1 ') };
}

function RedeemForm({ redeem }: { redeem: (code: string) => Promise<void> }) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { clean, display } = formatCode(raw);

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (clean.length < 16) return setError('请输入 16 位兑换码');
        setBusy(true);
        try {
          await redeem(clean);
        } catch {
          setError('兑换码无效或已使用');
        } finally {
          setBusy(false);
        }
      }}
    >
      <Label htmlFor="redeem-code">兑换码</Label>
      <div className="mt-2 flex gap-2">
        <Input
          id="redeem-code"
          value={display}
          onChange={(e) => { setRaw(e.target.value); setError(null); }}
          placeholder="XXXX XXXX XXXX XXXX"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          maxLength={19}
          aria-invalid={error ? true : undefined}
          aria-describedby="redeem-hint"
          className="font-mono tracking-[0.1em] uppercase"
        />
        <Button type="submit" loading={busy}>兑换</Button>
      </div>
      <p id="redeem-hint" className={error ? 'mt-2 text-caption text-status-error-fg' : 'mt-2 text-caption text-fg-muted'}>
        {error ?? '兑换码来自官网订单邮件或活动页'}
      </p>
    </form>
  );
}`;

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function PlanGrid({ layout }: { layout: 'row' | 'stack' }) {
  const ordered = layout === 'stack' ? [...PLANS].sort((a, b) => Number(b.highlighted ?? false) - Number(a.highlighted ?? false)) : PLANS;
  return (
    <div className={cn('w-full', layout === 'row' ? 'grid items-stretch gap-4 lg:grid-cols-3' : 'mx-auto flex max-w-sm flex-col gap-4')}>
      {ordered.map((plan) => (
        <PlanCard
          key={plan.key}
          name={plan.name}
          price={plan.price}
          period={plan.period}
          description={plan.description}
          features={plan.features}
          highlighted={plan.highlighted}
          badge={plan.badge}
          cta={plan.cta}
          className={cn(layout === 'row' && plan.highlighted && 'lg:-translate-y-2')}
        />
      ))}
    </div>
  );
}

export function PlansDemo() {
  const [layout, setLayout] = useState<'row' | 'stack'>('row');
  return (
    <Preview
      label="套餐卡片排布演示"
      centered={false}
      code={CODE_PLANS}
      toolbar={
        <ToggleGroup type="single" value={layout} onValueChange={(v) => v && setLayout(v as 'row' | 'stack')} size="sm" variant="outline" aria-label="排布方式" className="flex-wrap">
          <ToggleGroupItem value="row">桌面 · 横排</ToggleGroupItem>
          <ToggleGroupItem value="stack">手机 · 纵向</ToggleGroupItem>
        </ToggleGroup>
      }
    >
      <PlanGrid layout={layout} />
    </Preview>
  );
}

export function PriceBlock() {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-1">
        <span className="text-label-md text-fg-secondary">¥</span>
        <span className="text-numeric-lg text-fg-primary tabular">252</span>
        <span className="text-caption text-fg-secondary">/ 年</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-body-sm text-fg-muted line-through tabular">¥360</span>
        <Tag tone="success">省 30%</Tag>
      </div>
    </div>
  );
}

type RedeemStatus = 'idle' | 'format' | 'checking' | 'invalid' | 'success';

function formatCode(raw: string) {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
  return { clean, display: clean.replace(/(.{4})(?=.)/g, '$1 ') };
}

export function RedeemForm() {
  const [raw, setRaw] = useState('');
  const [status, setStatus] = useState<RedeemStatus>('idle');
  const inputId = useId();
  const hintId = useId();
  const { clean, display } = formatCode(raw);
  const error = status === 'format' ? '请输入 16 位兑换码' : status === 'invalid' ? '兑换码无效或已使用' : null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (clean.length < 16) {
      setStatus('format');
      return;
    }
    setStatus('checking');
    window.setTimeout(() => setStatus(clean.startsWith('TP') ? 'success' : 'invalid'), 900);
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <LoadingState variant="success" label="兑换成功" />
        <p className="text-body-sm text-fg-secondary">套餐已更新，到期日已延长</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setRaw('');
            setStatus('idle');
          }}
        >
          再兑换一个
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2">
      <Label htmlFor={inputId}>兑换码</Label>
      <div className="flex gap-2">
        <Input
          id={inputId}
          value={display}
          onChange={(e) => {
            setRaw(e.target.value);
            if (status !== 'checking') setStatus('idle');
          }}
          placeholder="XXXX XXXX XXXX XXXX"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          maxLength={19}
          aria-invalid={error ? true : undefined}
          aria-describedby={hintId}
          disabled={status === 'checking'}
          className="font-mono tracking-[0.1em] uppercase"
        />
        <Button type="submit" loading={status === 'checking'} className="shrink-0">
          兑换
        </Button>
      </div>
      <p id={hintId} aria-live="polite" className={cn('text-caption', error ? 'text-status-error-fg' : 'text-fg-muted')}>
        {error ?? '兑换码来自官网订单邮件或活动页。演示：以 TP 开头的 16 位视为有效，例如 TPVP 2026 0901 DEMO'}
      </p>
    </form>
  );
}

export function InviteCard() {
  return (
    <Card className="w-full max-w-sm gap-5 py-5">
      <CardHeader className="px-5">
        <span className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Gift className="size-5" aria-hidden />
        </span>
        <CardTitle className="mt-2">邀请好友</CardTitle>
        <CardDescription>好友通过你的邀请码订阅后，你和好友各获得 7 天。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-5">
        <div className="flex items-center justify-between gap-3 rounded-md border border-border-default bg-bg-canvas px-4 py-3">
          <span className="flex min-w-0 flex-col">
            <span className="text-overline text-fg-muted uppercase">我的邀请码</span>
            <span className="font-mono text-numeric-sm text-fg-primary tabular">TP-8K2M-Q7</span>
          </span>
          <CopyButton text="TP-8K2M-Q7" label="复制" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-label-md text-fg-secondary">已获得</span>
          <span className="text-numeric-sm text-fg-primary tabular">21 天</span>
        </div>
        <Button className="w-full">
          <Share2 aria-hidden />
          分享邀请码
        </Button>
      </CardContent>
    </Card>
  );
}

export function PaymentMethods() {
  const [value, setValue] = useState<string>('card');
  const base = useId();
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      aria-label="支付方式"
      className="w-full max-w-sm gap-0 divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-default bg-bg-surface"
    >
      {METHODS.map((m) => {
        const id = `${base}-${m.value}`;
        const checked = value === m.value;
        return (
          <label
            key={m.value}
            htmlFor={id}
            className={cn(
              'flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors duration-(--duration-fast)',
              checked ? 'bg-action-selected-bg' : 'hover:bg-bg-surface-hover',
            )}
          >
            <span
              className={cn(
                'inline-flex h-8 min-w-12 shrink-0 items-center justify-center rounded-sm px-2 text-label-sm font-semibold',
                checked ? 'bg-blue-100 text-fg-brand-strong' : 'bg-bg-surface-sunken text-fg-secondary',
              )}
            >
              {m.badge}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-headline text-fg-primary">{m.name}</span>
              <span className="text-caption text-fg-secondary">{m.desc}</span>
            </span>
            <RadioGroupItem id={id} value={m.value} />
          </label>
        );
      })}
    </RadioGroup>
  );
}
