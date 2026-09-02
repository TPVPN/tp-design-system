import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tpvpn/ui';
import { Callout, DoDont, DocTable, PageHeader, Preview, Prose, Section, SubSection } from '@/components/docs';
import { cn } from '@/lib/cn';
import { CODE_PRICE, CODE_REDEEM, InviteCard, PaymentMethods, PlansDemo, PriceBlock, RedeemForm } from './_parts/SubscriptionParts';

const MATRIX: [string, string, string, string, string][] = [
  ['同时在线设备', '2', '4', '8', '50'],
  ['高速流量（FUP）', '50 GB', '1 TB', '3 TB', '不限'],
  ['IEPL 优选', '—', '✓', '✓', '✓'],
  ['固定出口 IP', '—', '—', '—', '✓'],
  ['WireGuard · 智能选路 · 场景专线 · 无日志', '✓', '✓', '✓', '✓'],
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SubscriptionPage() {
  return (
    <>
      <PageHeader
        eyebrow="模式 · Patterns"
        title="套餐与付费"
        en="Subscription"
        description="套餐对比、价格排版、兑换码、邀请赠天与支付方式。只列可宣称的真实能力，不做倒计时与压迫性文案；官网购买为一次性预付，不自动续期。"
      />

      <Section id="plans" title="套餐对比" en="Plan comparison" description="PlanCard × 3：推荐套餐带 brand Tag、blue-500 描边与 brand-glow；桌面横排时推荐卡上移 8px，手机纵向时推荐卡置顶。">
        <PlansDemo />
        <Prose>
          <p className="text-sm text-fg-muted">示例价格与权益仅用于展示排版；正式数值以后台套餐配置为准。</p>
        </Prose>
        <DocTable
          caption="四档能力矩阵（BRIEF §2.9）"
          head={
            <>
              <th>能力</th>
              <th className="w-24">基础</th>
              <th className="w-24">标准</th>
              <th className="w-24">高级</th>
              <th className="w-24">企业</th>
            </>
          }
        >
          {MATRIX.map(([label, ...cells]) => (
            <tr key={label}>
              <td className="text-fg-primary">{label}</td>
              {cells.map((cell, i) => (
                <td key={i} className={cn('tabular', cell === '—' ? 'text-fg-placeholder' : 'text-fg-secondary')}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </DocTable>
        <Prose>
          <ul>
            <li>卡片内容自上而下：套餐名 title-sm → 价格 → 计费周期 → 权益列表（check 图标）→ CTA（推荐用 primary，其他用 secondary / outline）。</li>
            <li>多设备数只写真实能力 2 / 4 / 8 / 50；固定出口 IP 只出现在企业档。</li>
            <li>横排 2–4 张等高；纵向堆叠时推荐卡置顶，卡片圆角 radius.xl。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="price" title="价格排版" en="Price typography" description="货币符号 label-md、金额 numeric-lg（tabular）、周期 caption；折扣用删除线原价 + success Tag。">
        <Preview label="价格排版示例" background="surface" code={CODE_PRICE}>
          <PriceBlock />
        </Preview>
        <Prose>
          <ul>
            <li>
              金额永远 tabular，货币符号与金额之间不加空格，周期前加「/」：<code>¥252 / 年</code>。
            </li>
            <li>
              折扣：原价 body-sm 删除线 fg.muted，Tag <code>success</code>「省 30%」；折扣百分比四舍五入到整数。
            </li>
            <li>
              <code>PlanCard</code> 内价格由组件渲染为 display-sm + tabular（同为 32 / 40 · 700），独立价格块用 numeric-lg。
            </li>
            <li>不做倒计时、闪烁、「仅剩 N 名额」等压迫性元素。</li>
          </ul>
        </Prose>
        <DoDont
          doCaption="清晰的价格层级与一个平静的折扣标记。"
          dontCaption="倒计时、闪烁与名额压迫；「续费」也应改为「续期」。"
          do={<PriceBlock />}
          dont={
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-numeric-lg text-status-error-fg tabular">¥252</span>
              <span className="text-caption text-status-error-fg">限时 00:59 · 仅剩 3 个名额 · 立即续费</span>
            </div>
          }
        />
      </Section>

      <Section id="redeem" title="兑换码" en="Redeem code" description="Input 等宽字体、自动大写、每 4 位插入空格显示（存储时去空格）；提交时校验，输入时清除错误。">
        <Preview label="兑换码表单演示" background="surface" code={CODE_REDEEM}>
          <Card className="w-full max-w-sm py-5">
            <CardHeader className="px-5">
              <CardTitle>兑换</CardTitle>
              <CardDescription>输入 16 位兑换码，立即延长套餐</CardDescription>
            </CardHeader>
            <CardContent className="px-5">
              <RedeemForm />
            </CardContent>
          </Card>
        </Preview>
        <Prose>
          <ul>
            <li>三种校验状态：位数不足「请输入 16 位兑换码」；服务端拒绝「兑换码无效或已使用」（Input error 描边 + caption red-700）；成功用 <code>LoadingState variant="success"</code> + Toast「兑换成功」。</li>
            <li>校验中按钮 <code>loading</code>，输入框 disabled；错误时保留输入，不清空。</li>
            <li>
              <code>autoCapitalize="characters"</code>、<code>autoComplete="off"</code>、<code>maxLength=19</code>；粘贴带连字符或空格的码也能正确解析。
            </li>
            <li>兑换码来源提示用 caption；不要在提示里承诺具体天数。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="billing" title="付费与续期" en="Billing & renewal">
        <Callout tone="warning" title="官网一次性预付，不自动续期">
          官网购买的套餐为一次性预付：到期不自动扣款、不自动续期，用户需要主动「续期」。所有文案用「续期」而不是「续费」；到期前 7 天与到期当天各提醒一次，到期后进入「订阅已过期」空态并给「续期」按钮。
        </Callout>
        <Prose>
          <ul>
            <li>套餐到期日在「我的」页用 numeric-sm 显示，剩余 ≤ 7 天时用 warning 文字。</li>
            <li>续期入口只有一个 primary；不在首页连接按钮旁做促销。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="invite" title="邀请与赠送天数" en="Invite & referral" description="Card + Gift 图标：一句规则、邀请码（等宽 + 复制）、已获得天数、一个主动作。">
        <Preview label="邀请卡片示例">
          <InviteCard />
        </Preview>
        <Prose>
          <ul>
            <li>邀请码用 mono + tabular，分段用连字符；复制按钮带「已复制」反馈。</li>
            <li>赠送天数直接写数字（「7 天」），来源与到账时间在二级页说明；示例天数以后台配置为准。</li>
            <li>只放一个主动作「分享邀请码」，系统分享面板承载渠道选择。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="payment" title="支付方式" en="Payment methods" description="单选列表：文字徽章 + 名称 + 一行说明 + 单选圆点；不使用第三方品牌标志。">
        <Preview label="支付方式列表示例">
          <PaymentMethods />
        </Preview>
        <Prose>
          <ul>
            <li>
              徽章是纯文字（卡 / 支付宝 / 微信 / USDT），用 <code>bg.surface-sunken</code> 底；选中行用 <code>action.selected.bg</code>，徽章换 blue-100 底。
            </li>
            <li>默认预选第一项；整行可点，单选圆点在右侧对齐 chevron 位置。</li>
            <li>支付页不出现任何第三方 Logo、颜色或品牌字体；说明文字只写币种与到账方式。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="copy" title="文案" en="Copy">
        <Prose>
          <ul>
            <li>
              「续期」而非「续费」；「套餐」而非「会员」；「兑换码」而非「优惠码」。
            </li>
            <li>权益只列可宣称能力：WireGuard、智能选路、场景专线、多设备 2 / 4 / 8 / 50、IEPL 优选、固定出口 IP（企业）、无日志。</li>
            <li>不宣称 Kill Switch、分流、广告拦截、桌面端；不用「全球最快」「100% 安全」等绝对化表述。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="platform" title="Flutter / iOS 对应" en="Flutter / iOS">
        <Callout title="Flutter / iOS 对应">
          <p>
            <strong>Flutter</strong>：套餐卡用 forui <code>FCard</code> 组合，推荐卡 <code>Border.all(color: TpTokens.colorBorderBrand, width: 1.5)</code> + <code>TpTokens.elevationBrandGlow</code>；
            价格 <code>TpTokens.typographyNumericLg</code>（含 tabular figures）；兑换码 <code>FTextField</code> + <code>TextInputFormatter</code> 每 4 位插空格；支付方式 <code>FRadio</code> 列表。
          </p>
          <p>
            <strong>iOS（SwiftUI）</strong>：卡片 <code>VStack</code> + <code>RoundedRectangle(cornerRadius: TPTokens.radiusXl, style: .continuous)</code>；
            价格 <code>.monospacedDigit()</code>；兑换码 <code>TextField</code> + <code>.textInputAutocapitalization(.characters)</code>；支付方式 <code>Picker</code> 或自定义 <code>List</code> 单选。
          </p>
        </Callout>
      </Section>

      <SubSection title="相关页面" en="See also">
        <Prose>
          <p>
            组件 API 见「套餐卡片」「输入框」「用量指示」；错误文案见「空态 · 错误 · 加载」；五语言文案见「语调与文案」。
          </p>
        </Prose>
      </SubSection>
    </>
  );
}
