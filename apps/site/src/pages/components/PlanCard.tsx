import { useState } from 'react';
import { Button } from '@tpvpn/ui/components/ui/button';
import { PlanCard } from '@tpvpn/ui/components/tp/plan-card';
import { Tag } from '@tpvpn/ui/components/tp/tag';
import { Callout, DoDont, PageHeader, Preview, Prose, PropsTable, Section, SubSection, TokenTable } from '@/components/docs';
import { token } from '@/lib/tokens';
import { AnatomyPins } from './_parts/AnatomyPins';
import { PlatformMapping } from './_parts/PlatformMapping';
import { PropSelect, PropSwitch } from './_parts/PropToggles';

type Highlight = 'none' | 'yearly';

interface Plan {
  key: 'monthly' | 'yearly' | 'enterprise';
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  devices: 2 | 4 | 8 | 50;
  cta: string;
}

const PLANS: Plan[] = [
  {
    key: 'monthly',
    name: '月付',
    price: '¥28',
    period: '月',
    description: '随时取消，按月续期',
    devices: 2,
    features: ['2 台设备同时在线', '全部节点 · 智能选路', '公平使用（FUP）200 GB / 月', 'WireGuard · 无日志'],
    cta: '选择月付',
  },
  {
    key: 'yearly',
    name: '年付',
    price: '¥228',
    period: '年',
    description: '相当于 ¥19 / 月，省 32%',
    devices: 4,
    features: ['4 台设备同时在线', 'IEPL 优选线路', '场景专线：自动 / 游戏 / AI / 交易所', '公平使用（FUP）300 GB / 月', 'WireGuard · 无日志'],
    cta: '选择年付',
  },
  {
    key: 'enterprise',
    name: '企业',
    price: '¥1,880',
    period: '年',
    description: '团队与办公网络，可开发票',
    devices: 50,
    features: ['50 台设备 · 成员管理', '固定出口 IP', 'IEPL 优选线路 · 优先带宽', '公平使用（FUP）2 TB / 月', '专属支持 · SLA 99.9%'],
    cta: '联系销售',
  },
];

function PlanGrid({ highlight, badge, description }: { highlight: Highlight; badge: boolean; description: boolean }) {
  return (
    <div className="grid w-full gap-4 md:grid-cols-3 md:items-stretch">
      {PLANS.map((plan) => {
        const highlighted = highlight === 'yearly' && plan.key === 'yearly';
        return (
          <PlanCard
            key={plan.key}
            name={plan.name}
            price={plan.price}
            period={plan.period}
            description={description ? plan.description : undefined}
            features={plan.features}
            highlighted={highlighted}
            badge={badge && plan.key === 'yearly' ? <Tag tone="brand" size="md">推荐</Tag> : undefined}
            role="group"
            aria-label={`${plan.name}套餐，每${plan.period} ${plan.price.replace('¥', '')} 元，${plan.devices} 台设备`}
            cta={
              <Button variant={highlighted ? 'primary' : plan.key === 'enterprise' ? 'outline' : 'secondary'} size="lg">
                {plan.cta}
              </Button>
            }
          />
        );
      })}
    </div>
  );
}

export default function PlanCardPage() {
  const [highlight, setHighlight] = useState<Highlight>('yearly');
  const [badge, setBadge] = useState(true);
  const [description, setDescription] = useState(true);

  const previewCode = `import { PlanCard, Tag, Button } from '@tpvpn/ui';

<div className="grid gap-4 md:grid-cols-3">
  <PlanCard
    name="月付" price="¥28" period="月"${description ? `\n    description="随时取消，按月续期"` : ''}
    features={['2 台设备同时在线', '全部节点 · 智能选路', '公平使用（FUP）200 GB / 月', 'WireGuard · 无日志']}
    cta={<Button variant="secondary" size="lg">选择月付</Button>}
  />
  <PlanCard
    name="年付" price="¥228" period="年"${description ? `\n    description="相当于 ¥19 / 月，省 32%"` : ''}${highlight === 'yearly' ? `\n    highlighted` : ''}${badge ? `\n    badge={<Tag tone="brand" size="md">推荐</Tag>}` : ''}
    features={['4 台设备同时在线', 'IEPL 优选线路', '场景专线：自动 / 游戏 / AI / 交易所', '公平使用（FUP）300 GB / 月', 'WireGuard · 无日志']}
    cta={<Button${highlight === 'yearly' ? '' : ' variant="secondary"'} size="lg">选择年付</Button>}
  />
  <PlanCard
    name="企业" price="¥1,880" period="年"${description ? `\n    description="团队与办公网络，可开发票"` : ''}
    features={['50 台设备 · 成员管理', '固定出口 IP', 'IEPL 优选线路 · 优先带宽', '公平使用（FUP）2 TB / 月', '专属支持 · SLA 99.9%']}
    cta={<Button variant="outline" size="lg">联系销售</Button>}
  />
</div>`;

  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="套餐卡片"
        en="Plan Card"
        description="套餐名、价格、权益列表与 CTA 的固定排版。推荐套餐用 blue-500 描边 + brand-glow + 顶部渐变条，其余保持 level-1。三张并排、手机纵向堆叠。"
      />

      <Section id="preview" title="预览" en="Preview" description="月付 / 年付（推荐）/ 企业。设备数 2 / 4 / 50 与权益来自真实套餐能力（BRIEF §2.9）。">
        <Preview
          label="PlanCard 预览"
          code={previewCode}
          padded
          toolbar={
            <>
              <PropSelect label="highlighted" value={highlight} onChange={setHighlight} options={[{ value: 'none', label: '无' }, { value: 'yearly', label: '年付' }]} />
              <PropSwitch label="badge" checked={badge} onChange={setBadge} />
              <PropSwitch label="description" checked={description} onChange={setDescription} />
            </>
          }
        >
          <PlanGrid highlight={highlight} badge={badge} description={description} />
        </Preview>
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <AnatomyPins
          pins={[
            { n: 1, label: '容器', note: 'radius-xl 20 · p-6 · level-1；推荐态 blue-500 描边 + brand-glow + 顶部 4px 渐变条', x: 0, y: 0 },
            { n: 2, label: '套餐名', note: 'title-sm 18/26 600（h3）', x: 12, y: 12 },
            { n: 3, label: '说明', note: 'body · fg-secondary', x: 40, y: 20 },
            { n: 4, label: '徽标 badge', note: 'Tag brand md「推荐」· 右上', x: 90, y: 10 },
            { n: 5, label: '价格', note: 'display-sm 32/40 700 tabular · 周期 body fg-muted', x: 16, y: 36 },
            { n: 6, label: '权益列表', note: 'check 16 fg-brand + body fg-secondary · gap 10', x: 8, y: 60 },
            { n: 7, label: 'CTA', note: '全宽 Button lg · 推荐 primary，其余 secondary / outline', x: 50, y: 92 },
          ]}
          frameClassName="w-[18rem] max-w-full"
        >
          <PlanCard
            name="年付"
            price="¥228"
            period="年"
            description="相当于 ¥19 / 月"
            highlighted
            badge={
              <Tag tone="brand" size="md">
                推荐
              </Tag>
            }
            features={['4 台设备同时在线', 'IEPL 优选线路', '场景专线']}
            cta={
              <Button size="lg" tabIndex={-1} className="pointer-events-none">
                选择年付
              </Button>
            }
          />
        </AnatomyPins>
        <TokenTable
          caption="PlanCard 使用的 token"
          rows={[
            { name: 'radius.xl', value: token('radius.xl'), preview: 'radius', description: '卡片圆角 20' },
            { name: 'elevation.level-1', value: token('elevation.level-1'), preview: 'shadow', description: '普通套餐' },
            { name: 'elevation.brand-glow', value: token('elevation.brand-glow'), preview: 'shadow', description: '推荐套餐' },
            { name: 'color.border.brand', value: token('color.border.brand'), preview: 'color', description: '推荐描边 blue-500' },
            { name: 'gradient.primary', value: token('gradient.primary'), description: '推荐态顶部 4px 条' },
            { name: 'typography.display-sm', value: token('typography.display-sm'), preview: 'text', description: '价格（与 numeric-lg 同为 32/40 700）' },
            { name: 'typography.title-sm', value: token('typography.title-sm'), preview: 'text', description: '套餐名' },
          ]}
        />
      </Section>

      <Section id="pricing" title="价格排版" en="Price typography" description="货币符号 label-md、金额 numeric-lg（tabular）、周期 caption fg-secondary——三种字阶让「数字」成为唯一的大字。">
        <Preview
          label="价格排版规则"
          background="surface"
          code={`{/* 价格 lockup：货币 label-md · 金额 numeric-lg tabular · 周期 caption */}
<p className="flex items-baseline gap-1 tnum">
  <span className="text-label-md text-fg-secondary">¥</span>
  <span className="text-numeric-lg text-fg-primary">228</span>
  <span className="text-caption text-fg-secondary">/ 年</span>
</p>`}
        >
          <div className="flex flex-wrap items-end justify-center gap-12">
            {[
              ['¥', '28', '/ 月'],
              ['¥', '228', '/ 年'],
              ['¥', '1,880', '/ 年'],
            ].map(([cur, amt, per]) => (
              <p key={amt} className="flex items-baseline gap-1 tnum">
                <span className="text-label-md text-fg-secondary">{cur}</span>
                <span className="text-numeric-lg text-fg-primary">{amt}</span>
                <span className="text-caption text-fg-secondary">{per}</span>
              </p>
            ))}
          </div>
        </Preview>
        <Prose>
          <ul>
            <li>
              金额永远是 tabular 数字，千分位用逗号（<code>1,880</code>），不用「元」而用「¥」；美元 <code>$9.99</code>，港币 <code>HK$</code>。
            </li>
            <li>
              PlanCard 的 <code>price</code> 是一整个字符串（如 <code>"¥228"</code>），组件以 <code>display-sm</code>（32/40 700，与 numeric-lg 同度量）+ tabular 渲染，<code>period</code> 以 body fg-muted 渲染为「/ 年」。需要把货币符号缩到 label-md 时，按上面的 lockup 在页面里自行排版。
            </li>
            <li>折算价（「相当于 ¥19 / 月」）放在 description，不要和主价格并排出现两个大数字。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="highlighted" title="推荐态" en="Highlighted" description="一组套餐里只有一张推荐：blue-500 描边、brand-glow 阴影、顶部 4px primary 渐变条、Tag「推荐」、primary CTA。其余用 secondary（企业用 outline）。">
        <Preview label="推荐态对比" background="canvas" padded>
          <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">
            <PlanCard name="月付" price="¥28" period="月" features={['2 台设备同时在线', '全部节点 · 智能选路']} cta={<Button variant="secondary">选择月付</Button>} />
            <PlanCard
              name="年付"
              price="¥228"
              period="年"
              highlighted
              badge={
                <Tag tone="brand" size="md">
                  推荐
                </Tag>
              }
              features={['4 台设备同时在线', 'IEPL 优选线路']}
              cta={<Button>选择年付</Button>}
            />
          </div>
        </Preview>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <SubSection title="权益列表规则" en="Feature list rules">
          <Prose>
            <ul>
              <li>
                第一条永远是设备数（<strong>2 / 4 / 8 / 50</strong> 台），其后按「线路 → 场景 → 用量（FUP）→ 基础保障」排序；4–6 条，每条 ≤ 14 字。
              </li>
              <li>
                只写真实能力：WireGuard、智能选路、场景专线（自动 / 游戏 / AI / 交易所）、IEPL 优选、固定出口 IP（企业）、无日志。<strong>不得</strong>宣称 Kill Switch、分流、广告拦截、桌面端。
              </li>
              <li>高阶套餐不重复低阶已有的条目时，用「包含月付全部权益」作为第一条之后的一行。</li>
            </ul>
          </Prose>
        </SubSection>
        <DoDont
          previewClassName="bg-bg-canvas"
          do={
            <PlanCard
              className="w-full max-w-[16rem]"
              name="年付"
              price="¥228"
              period="年"
              highlighted
              badge={
                <Tag tone="brand" size="md">
                  推荐
                </Tag>
              }
              features={['4 台设备同时在线', 'IEPL 优选线路', 'FUP 300 GB / 月']}
              cta={<Button size="sm">选择年付</Button>}
            />
          }
          dont={
            <PlanCard
              className="w-full max-w-[16rem]"
              name="年付"
              price="¥228"
              period="年"
              highlighted
              badge={
                <Tag tone="error" size="md">
                  限时 -50%
                </Tag>
              }
              features={['无限设备', 'Kill Switch · 广告拦截', '全球 3000+ 节点', '桌面端 / 路由器']}
              cta={<Button size="sm">立即抢购</Button>}
            />
          }
          doCaption="真实权益、一个推荐、一个动词 CTA。"
          dontCaption="不要宣称没有的能力，不要用促销色徽标和「抢购」——语调要可信、克制。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              套餐名渲染为 <code>h3</code>；把整卡作为一组：传 <code>role="group"</code> + <code>aria-label="年付套餐，每年 228 元，4 台设备"</code>，让价格被完整朗读（视觉上的「¥228 / 年」会被拆读）。
            </li>
            <li>权益列表是 <code>ul/li</code>，check 图标 aria-hidden；推荐态除了颜色还有 Tag「推荐」文字。</li>
            <li>CTA 是真实 Button，文案带套餐名（「选择年付」），不写「立即购买」这种脱离上下文的动词。</li>
            <li>三卡并排时高度对齐（grid items-stretch），CTA 贴底（mt-auto），键盘 Tab 顺序 = 视觉顺序。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props">
        <PropsTable
          caption="PlanCard props"
          rows={[
            { name: 'name', type: 'string', required: true, description: '套餐名（h3 · title-sm）。' },
            { name: 'price', type: 'string', required: true, description: '格式化后的价格，如 "¥228" / "$9.99"；display-sm tabular。' },
            { name: 'period', type: 'string', description: '计费周期，如 "月" / "年"，渲染为「/ 年」。' },
            { name: 'description', type: 'string', description: '套餐名下方一句说明（折算价、适用人群）。' },
            { name: 'features', type: 'string[]', required: true, description: '权益列表，每条前置 check 图标。' },
            { name: 'highlighted', type: 'boolean', default: 'false', description: '推荐态：blue-500 描边 + brand-glow + 顶部渐变条；data-highlighted。' },
            { name: 'badge', type: 'React.ReactNode', description: '右上角徽标，通常 <Tag tone="brand" size="md">推荐</Tag>。' },
            { name: 'cta', type: 'React.ReactNode', required: true, description: '底部按钮，自动全宽（[&>*]:w-full）。' },
            { name: 'className', type: 'string', description: '追加到根元素。' },
            { name: '…rest', type: "React.ComponentProps<'div'>", description: '透传到根 div（role / aria-label 等）。' },
          ]}
        />
        <Callout tone="info" title="设备数不是 prop">
          设备数（2 / 4 / 8 / 50）作为 features 的第一条写入，而不是单独字段——这样五种语言的文案由同一处翻译控制。
        </Callout>
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformMapping
          rows={[
            { web: <><code>&lt;PlanCard&gt;</code></>, flutter: <><code>FCard</code> 组合 / <code>Container</code></>, ios: <><code>VStack</code> 组合</> },
            { web: '推荐描边 + glow', flutter: <><code>Border.all(color: TpTokens.colorBlue500, width: 1.5)</code> + <code>TpTokens.elevationBrandGlow</code></>, ios: <><code>.overlay(RoundedRectangle().stroke(TPTokens.colorBlue500))</code> + shadow</> },
            { web: <><code>typography.numeric-lg</code></>, flutter: <><code>TpTokens.typographyNumericLg</code></>, ios: <><code>TPTokens.typographyNumericLg</code> + <code>.monospacedDigit()</code></> },
            { web: <><code>radius.xl 20</code></>, flutter: <><code>TpTokens.radiusXl</code></>, ios: <><code>TPTokens.radiusXl</code></> },
          ]}
          dart={`import 'package:flutter/material.dart';
import 'package:tp_tokens/tp_tokens.dart';

// 价格 lockup：货币 label-md · 金额 numeric-lg · 周期 caption
Widget priceLockup(String currency, String amount, String period) {
  return Row(
    crossAxisAlignment: CrossAxisAlignment.baseline,
    textBaseline: TextBaseline.alphabetic,
    children: [
      Text(currency, style: TpTokens.typographyLabelMd.copyWith(color: TpTokens.colorFgSecondary)),
      const SizedBox(width: 4),
      Text(amount, style: TpTokens.typographyNumericLg), // 32/40 700 tabular
      const SizedBox(width: 4),
      Text('/ \$period', style: TpTokens.typographyCaption.copyWith(color: TpTokens.colorFgSecondary)),
    ],
  );
}

// 推荐态容器
Container(
  padding: const EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: TpTokens.colorBgSurface,
    borderRadius: BorderRadius.circular(TpTokens.radiusXl), // 20
    border: Border.all(color: highlighted ? TpTokens.colorBlue500 : TpTokens.colorBorderDefault, width: highlighted ? 1.5 : 1),
    boxShadow: highlighted ? TpTokens.elevationBrandGlow : TpTokens.elevationLevel1,
  ),
  child: planBody,
);`}
          dartFilename="lib/features/subscription/plan_card.dart"
        />
      </Section>
    </>
  );
}
