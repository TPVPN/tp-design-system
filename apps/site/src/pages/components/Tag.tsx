import { useState } from 'react';
import { CircleCheck, Star } from 'lucide-react';
import { sceneIcon, sceneLabel, Tag, type SceneTone, type TagTone } from '@tpvpn/ui/components/tp/tag';
import {
  Callout,
  ContrastBadge,
  DocTable,
  DoDont,
  Grid,
  PageHeader,
  Preview,
  Prose,
  PropsTable,
  Section,
  TokenTable,
} from '@/components/docs';
import { contrastRatio } from '@/lib/contrast';
import { token } from '@/lib/tokens';
import { Anatomy } from './_parts/Anatomy';
import { jsxAttrs, Segmented } from './_parts/Controls';
import { PlatformHint } from './_parts/PlatformHint';
import { SourceLink } from './_parts/SourceLink';
import { StateTile } from './_parts/StateTile';

const TONES: readonly TagTone[] = ['auto', 'game', 'ai', 'exchange', 'success', 'warning', 'error', 'info', 'neutral', 'brand'];

const SAMPLE: Record<TagTone, string> = {
  auto: sceneLabel.auto,
  game: sceneLabel.game,
  ai: sceneLabel.ai,
  exchange: sceneLabel.exchange,
  success: '已连接',
  warning: '负载较高',
  error: '连接失败',
  info: '新节点',
  neutral: '默认',
  brand: '优质节点',
};

/** Background / foreground token per tone (mirrors tagVariants → theme). */
const TONE_TOKENS: Record<TagTone, { bg: string; fg: string; use: string }> = {
  auto: { bg: 'color.scene.auto.bg', fg: 'color.scene.auto.fg', use: '场景 · 自动最优' },
  game: { bg: 'color.scene.game.bg', fg: 'color.scene.game.fg', use: '场景 · 游戏' },
  ai: { bg: 'color.scene.ai.bg', fg: 'color.scene.ai.fg', use: '场景 · AI' },
  exchange: { bg: 'color.scene.exchange.bg', fg: 'color.scene.exchange.fg', use: '场景 · 交易所' },
  success: { bg: 'color.status.success.bg', fg: 'color.status.success.fg', use: '状态 · 成功 / 在线' },
  warning: { bg: 'color.status.warning.bg', fg: 'color.status.warning.fg', use: '状态 · 需要注意' },
  error: { bg: 'color.status.error.bg', fg: 'color.status.error.fg', use: '状态 · 失败' },
  info: { bg: 'color.status.info.bg', fg: 'color.status.info.fg', use: '状态 · 提示' },
  neutral: { bg: 'color.bg.surface-sunken', fg: 'color.fg.secondary', use: '中性标记' },
  brand: { bg: 'color.bg.brand-soft', fg: 'color.fg.brand-strong', use: '品牌 · 优质节点 / 推荐' },
};

const ICON_NAMES: Record<SceneTone, string> = { auto: 'shield-check', game: 'gamepad-2', ai: 'sparkles', exchange: 'arrow-left-right' };

const isScene = (tone: TagTone): tone is SceneTone => tone in sceneIcon;

type Size = 'sm' | 'md';
type IconMode = 'default' | 'none' | 'custom';

function LivePreview() {
  const [tone, setTone] = useState<TagTone>('game');
  const [size, setSize] = useState<Size>('sm');
  const [iconMode, setIconMode] = useState<IconMode>('default');

  const attrs = jsxAttrs([
    ['tone', tone],
    ['size', size !== 'sm' && size],
  ]);
  const iconAttr = iconMode === 'none' ? ' icon={null}' : iconMode === 'custom' ? ' icon={<Star />}' : '';
  const code = `import { Tag } from '@tpvpn/ui';${iconMode === 'custom' ? "\nimport { Star } from 'lucide-react';" : ''}\n\n<Tag ${attrs}${iconAttr}>${SAMPLE[tone]}</Tag>`;

  return (
    <Preview
      label="标签预览"
      code={code}
      toolbar={
        <>
          <Segmented label="语义" value={tone} options={TONES.map((t) => ({ value: t, label: t }))} onChange={setTone} />
          <Segmented
            label="尺寸"
            value={size}
            options={[
              { value: 'sm', label: 'sm' },
              { value: 'md', label: 'md' },
            ]}
            onChange={setSize}
          />
          <Segmented
            label="图标"
            value={iconMode}
            options={[
              { value: 'default', label: '默认' },
              { value: 'none', label: '无' },
              { value: 'custom', label: '自定义' },
            ]}
            onChange={setIconMode}
          />
        </>
      }
    >
      <Tag tone={tone} size={size} icon={iconMode === 'none' ? null : iconMode === 'custom' ? <Star /> : undefined}>
        {SAMPLE[tone]}
      </Tag>
    </Preview>
  );
}

const DART = `/// 场景 / 状态标签：浅底 50 + 深字 700（game 取 mint-800），高度 20 / 24，圆角 6。
class TpTag extends StatelessWidget {
  const TpTag({
    super.key,
    required this.label,
    this.icon,
    this.bg = TpTokens.colorSceneGameBg, // #EEFBF2
    this.fg = TpTokens.colorSceneGameFg, // #017347（mint-800）
    this.medium = false,
  });

  final String label;
  final IconData? icon;
  final Color bg;
  final Color fg;
  final bool medium;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: medium ? TpTokens.tagHeightMd : TpTokens.tagHeightSm, // 24 / 20
      padding: EdgeInsets.symmetric(
        horizontal: medium ? TpTokens.tagPaddingXMd : TpTokens.tagPaddingXSm, // 8 / 6
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(TpTokens.tagRadius), // 6
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: medium ? 14 : 12, color: fg),
            const SizedBox(width: 4),
          ],
          Text(label, style: TpTokens.typographyLabelSm.copyWith(color: fg)), // 12/16 · 500
        ],
      ),
    );
  }
}`;

/** `/components/tag` */
export default function TagPage() {
  return (
    <>
      <PageHeader
        eyebrow="组件 · Components"
        title="标签"
        en="Tag"
        description="标记场景、状态与品牌属性的纯展示元素：浅底 50 阶 + 深字 700 阶，两档高度，可带图标。"
        actions={<SourceLink path="packages/ui/src/components/tp/tag.tsx" exports={['Tag', 'sceneIcon', 'sceneLabel', 'tagVariants']} />}
      />

      <Section id="preview" title="预览" en="Preview" description="场景语义（auto / game / ai / exchange）默认带各自的图标；其他语义默认无图标。">
        <LivePreview />
      </Section>

      <Section id="anatomy" title="解剖" en="Anatomy">
        <Anatomy
          width={96}
          pins={[
            { n: 1, label: '容器', note: <>圆角 <code>tag.radius</code> 6 · 高度 <code>tag.height.md</code> 24（sm 20）· 底色 <code>scene.game.bg</code></>, x: -4, y: -70 },
            { n: 2, label: '图标', note: <>md 14px / sm 12px · 描边 2 · 与文字间距 4 · <code>aria-hidden</code></>, x: 20, y: 170 },
            { n: 3, label: '文字', note: <><code>label-sm</code> 12/16 · 500 · 颜色 <code>scene.game.fg</code>（mint-800）· 不换行</>, x: 70, y: -70 },
          ]}
        >
          <Tag tone="game" size="md" className="w-full justify-center">
            游戏
          </Tag>
        </Anatomy>
      </Section>

      <Section id="tones" title="语义" en="Tones" description="十种 tone × 两档尺寸。颜色只表达语义，不承载唯一信息——标签必须有文字。">
        <Grid cols={5} gap="sm">
          {TONES.map((tone) => (
            <StateTile key={tone} label={tone} hint={TONE_TOKENS[tone].use} className="min-h-24 flex-col gap-2">
              <Tag tone={tone}>{SAMPLE[tone]}</Tag>
              <Tag tone={tone} size="md">
                {SAMPLE[tone]}
              </Tag>
            </StateTile>
          ))}
        </Grid>
        <DocTable
          caption="各 tone 的底色、文字色与对比度"
          head={
            <>
              <th>tone</th>
              <th>示例</th>
              <th>底色</th>
              <th>文字</th>
              <th>对比度</th>
              <th>默认图标</th>
            </>
          }
        >
          {TONES.map((tone) => {
            const bg = token(TONE_TOKENS[tone].bg);
            const fg = token(TONE_TOKENS[tone].fg);
            return (
              <tr key={tone}>
                <td className="font-mono text-[13px] text-fg-primary">{tone}</td>
                <td>
                  <Tag tone={tone}>{SAMPLE[tone]}</Tag>
                </td>
                <td className="font-mono text-[12px] text-fg-secondary">
                  <span className="mr-1.5 inline-block size-3 rounded-[3px] align-[-1px] ring-hairline" style={{ background: bg }} aria-hidden />
                  {bg}
                </td>
                <td className="font-mono text-[12px] text-fg-secondary">
                  <span className="mr-1.5 inline-block size-3 rounded-[3px] align-[-1px] ring-hairline" style={{ background: fg }} aria-hidden />
                  {fg}
                </td>
                <td>
                  <ContrastBadge fg={fg} bg={bg} label={`${tone} 对比度 ${contrastRatio(fg, bg)}:1`} />
                </td>
                <td className="font-mono text-[12px] text-fg-muted">{isScene(tone) ? ICON_NAMES[tone] : '—'}</td>
              </tr>
            );
          })}
        </DocTable>
        <Callout tone="warning" title="game 取 mint-800，不是 700">
          <p>
            浅底深字组合的文字一律取 700 阶，唯 game 例外：mint-700 <code>{token('color.mint.700')}</code> 在 mint-50 <code>{token('color.mint.50')}</code>{' '}
            上仅 {contrastRatio(token('color.mint.700'), token('color.mint.50'))}:1，不达 AA；mint-800 <code>{token('color.mint.800')}</code> 为{' '}
            {contrastRatio(token('color.mint.800'), token('color.mint.50'))}:1。语义 token <code>scene.game.fg</code> 已指向 mint-800，业务代码不要自己取色阶。
          </p>
        </Callout>
      </Section>

      <Section id="sizes" title="尺寸" en="Sizes" description="sm 20（列表行、卡片内）· md 24（首页状态、独立展示）；图标随尺寸 12 / 14。">
        <Preview label="尺寸对比" className="items-end gap-6">
          {(['sm', 'md'] as const).map((size) => (
            <span key={size} className="flex flex-col items-center gap-2">
              <Tag tone="auto" size={size}>
                {sceneLabel.auto}
              </Tag>
              <span className="font-mono text-[11px] text-fg-muted">
                {size} · {token(`tag.height.${size}`)}
              </span>
            </span>
          ))}
        </Preview>
        <TokenTable
          caption="标签尺寸 token"
          rows={[
            { name: 'tag.height.sm', value: token('tag.height.sm'), description: '默认高度' },
            { name: 'tag.height.md', value: token('tag.height.md'), description: 'md 高度' },
            { name: 'tag.padding-x.sm', value: token('tag.padding-x.sm'), reference: '{space.1-5}', preview: 'spacing' },
            { name: 'tag.padding-x.md', value: token('tag.padding-x.md'), reference: '{space.2}', preview: 'spacing' },
            { name: 'tag.radius', value: token('tag.radius'), reference: '{radius.xs}', preview: 'radius' },
          ]}
        />
      </Section>

      <Section id="icons" title="图标" en="Icons" description="场景图标映射来自 BRIEF §2.8，可通过 sceneIcon 复用；传 icon={null} 去掉，或传任意 lucide 图标。">
        <Grid cols={4} gap="sm">
          {(Object.keys(sceneIcon) as SceneTone[]).map((tone) => (
            <StateTile key={tone} label={sceneLabel[tone]} hint={`sceneIcon.${tone} · ${ICON_NAMES[tone]}`}>
              <Tag tone={tone} size="md">
                {sceneLabel[tone]}
              </Tag>
            </StateTile>
          ))}
        </Grid>
        <Grid cols={2} className="mt-4">
          <StateTile label="去掉默认图标" hint="icon={null}">
            <Tag tone="ai" icon={null}>
              AI
            </Tag>
          </StateTile>
          <StateTile label="状态语义加图标" hint="icon={<CircleCheck />}">
            <Tag tone="success" icon={<CircleCheck />}>
              已连接
            </Tag>
          </StateTile>
        </Grid>
      </Section>

      <Section id="usage" title="用法" en="Usage">
        <DoDont
          do={
            <span className="flex items-center gap-2">
              <span className="text-headline text-fg-primary">日本 · 东京</span>
              <Tag tone="game">游戏</Tag>
            </span>
          }
          dont={
            <span className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-headline text-fg-primary">日本 · 东京</span>
              <Tag tone="game">游戏</Tag>
              <Tag tone="ai">AI</Tag>
              <Tag tone="brand">优质节点</Tag>
              <Tag tone="success">在线</Tag>
            </span>
          }
          doCaption="一行最多一个场景标签，跟在名称后面。"
          dontCaption="堆叠多个标签，信息互相抢夺，行高被撑破。"
        />
        <DoDont
          do={<Tag tone="warning">负载较高</Tag>}
          dont={<Tag tone="warning" aria-label="负载较高" className="w-5 px-0" />}
          doCaption="颜色 + 文字共同表达语义。"
          dontCaption="只用一个色块，色弱用户无法区分 warning 与 exchange（同为 amber）。"
        />
        <DoDont
          do={
            <span className="flex items-center gap-2">
              <Tag tone="auto" size="md">
                自动最优 · IEPL
              </Tag>
            </span>
          }
          dont={
            <button type="button" className="inline-flex cursor-pointer">
              <Tag tone="auto" size="md" className="shadow-focus">
                自动最优 · IEPL
              </Tag>
            </button>
          }
          doCaption="Tag 只做展示。"
          dontCaption="把 Tag 当过滤按钮：需要可点击的筛选项请用 ToggleGroup / Toggle。"
        />
      </Section>

      <Section id="a11y" title="无障碍" en="Accessibility">
        <Prose>
          <ul>
            <li>
              渲染为 <code>&lt;span&gt;</code>，无 role、不可聚焦、不响应点击；语义由文字承载，屏幕阅读器按普通文本朗读。
            </li>
            <li>图标一律 <code>aria-hidden</code>，自定义图标请同样处理（lucide 默认已带）。</li>
            <li>
              所有 tone 的文字对比度 ≥ 4.5:1（见上表，实时计算）；<code>label-sm</code> 12px 属小字，因此不放宽到 3:1。
            </li>
            <li>
              需要交互（筛选、删除）时不要复用 Tag，改用 <code>Toggle</code> / <code>Button</code>，并保证 44px 触控高度。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="props" title="属性" en="Props" description="TagProps = Omit<React.ComponentProps<'span'>, 'children'> & { tone, size?, icon?, children? }">
        <PropsTable
          rows={[
            {
              name: 'tone',
              type: "'auto' | 'game' | 'ai' | 'exchange' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand'",
              required: true,
              description: '语义：四种线路场景、四种状态、中性与品牌。',
            },
            { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: '高度 20 / 24，图标 12 / 14。' },
            {
              name: 'icon',
              type: 'React.ReactNode',
              description: '前置图标。场景 tone 默认取 sceneIcon[tone]；传 null 去掉；其他 tone 默认无。',
            },
            { name: 'children', type: 'React.ReactNode', description: '标签文字（必填，颜色不作唯一信息载体）。' },
            { name: '...props', type: "Omit<React.ComponentProps<'span'>, 'children'>", description: 'className、title、data-* 等透传到 span。' },
          ]}
        />
        <Callout tone="info" title="同文件导出">
          <p>
            <code>sceneIcon: Record&lt;SceneTone, LucideIcon&gt;</code>（shield-check / gamepad-2 / sparkles / arrow-left-right）、
            <code>sceneLabel</code>（自动最优 / 游戏 / AI / 交易所）与 <code>tagVariants</code>（cva，可用于非 span 元素）。
          </p>
        </Callout>
      </Section>

      <Section id="platforms" title="平台对应" en="Platforms">
        <PlatformHint
          flutter={
            <>
              forui <code>FBadge</code> 自定义 style，或按下方 <code>Container</code> 写法：高度 <code>TpTokens.tagHeightSm</code> 20 / <code>tagHeightMd</code> 24、圆角{' '}
              <code>TpTokens.tagRadius</code> 6、配色 <code>TpTokens.colorScene*Bg / *Fg</code>、<code>colorStatus*Bg / *Fg</code>。
            </>
          }
          ios={
            <>
              <code>Text(label).font(...).padding(.horizontal, TPTokens.tagPaddingXSm).frame(height: TPTokens.tagHeightSm)</code>{' '}
              <code>.background(Color(TPTokens.colorSceneGameBg), in: RoundedRectangle(cornerRadius: TPTokens.tagRadius))</code>{' '}
              <code>.foregroundStyle(Color(TPTokens.colorSceneGameFg))</code>。
            </>
          }
          dart={DART}
          dartFilename="lib/widgets/tp_tag.dart"
        />
      </Section>
    </>
  );
}
