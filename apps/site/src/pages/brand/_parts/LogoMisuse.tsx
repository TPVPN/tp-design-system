import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { brandUrl } from '@/lib/assets';
import { token } from '@/lib/tokens';
import { cn } from '@/lib/cn';
import { Grid } from '@/components/docs';
import { LogoLockup } from './LogoLockup';

interface MisuseCase {
  id: string;
  title: string;
  en: string;
  caption: string;
  /** Background of the preview area. */
  surface?: string;
  preview: ReactNode;
}

const horizontal = brandUrl.logoSvg('horizontal');
const H = 34; // mark height used inside the cards

const CASES: MisuseCase[] = [
  {
    id: 'stretch',
    title: '拉伸变形',
    en: 'Stretching',
    caption: '只允许等比缩放。这里横向拉伸了 140%。',
    preview: (
      <img
        src={horizontal}
        alt="被横向拉伸 140% 的 TP VPN 横版标识"
        height={H}
        style={{ height: H, transform: 'scaleX(1.4)', transformOrigin: 'center' }}
        draggable={false}
      />
    ),
  },
  {
    id: 'recolor',
    title: '改色',
    en: 'Recolouring',
    caption: '图形只能是品牌蓝、黑或白（单色版）。绿、红或渐变都不行。',
    preview: <LogoLockup height={H} markFill={token('color.mint.500')} label="被改成绿色的 TP VPN 标识" />,
  },
  {
    id: 'relayout',
    title: '改布局',
    en: 'Re-laying out',
    caption: '字标不得放到图形上方或左侧；堆叠请用官方 stacked 版本。',
    preview: <LogoLockup height={H} layout="wordmark-top" label="字标被放到图形上方的 TP VPN 标识" />,
  },
  {
    id: 'shadow',
    title: '加投影',
    en: 'Drop shadow',
    caption: 'Logo 本身不带阴影或发光；需要层次时改变底色。',
    preview: (
      <img
        src={horizontal}
        alt="加了蓝色投影的 TP VPN 横版标识"
        height={H}
        style={{ height: H, filter: 'drop-shadow(0 10px 18px rgb(22 119 255 / 0.55))' }}
        draggable={false}
      />
    ),
  },
  {
    id: 'rotate',
    title: '旋转 / 倾斜',
    en: 'Rotating',
    caption: '任何角度都不允许。这里旋转了 12°。',
    preview: (
      <img
        src={horizontal}
        alt="旋转了 12 度的 TP VPN 横版标识"
        height={H}
        style={{ height: H, transform: 'rotate(12deg)' }}
        draggable={false}
      />
    ),
  },
  {
    id: 'busy',
    title: '复杂图片背景',
    en: 'Busy background',
    caption: '需要放在照片上时先压暗背景，并改用 mark-mono-white。',
    surface: [
      `radial-gradient(60% 80% at 15% 20%, ${token('color.amber.300')} 0%, transparent 60%)`,
      `radial-gradient(50% 70% at 85% 30%, ${token('color.cyan.400')} 0%, transparent 60%)`,
      `radial-gradient(70% 60% at 50% 100%, ${token('color.pink.400')} 0%, transparent 65%)`,
      `radial-gradient(40% 50% at 70% 75%, ${token('color.purple.400')} 0%, transparent 60%)`,
      `linear-gradient(135deg, ${token('color.mint.200')}, ${token('color.blue.200')})`,
    ].join(', '),
    preview: <img src={horizontal} alt="放在多色杂乱背景上的 TP VPN 横版标识" height={H} style={{ height: H }} draggable={false} />,
  },
  {
    id: 'outline',
    title: '加描边',
    en: 'Outlining',
    caption: '不得给方块或字形加轮廓线，也不能做成线框版。',
    preview: <LogoLockup height={H} stroke={token('color.slate.900')} label="加了描边的 TP VPN 标识" />,
  },
  {
    id: 'low-contrast',
    title: '低对比底色',
    en: 'Low contrast',
    caption: '蓝底上用蓝图形会消失；蓝底请改用 horizontal-reversed。',
    surface: token('color.blue.400'),
    preview: <img src={horizontal} alt="放在中蓝色底上、几乎看不清的 TP VPN 横版标识" height={H} style={{ height: H }} draggable={false} />,
  },
];

/** Eight misuse demonstrations, each built from the real SVG with CSS transforms / recolouring. */
export function LogoMisuseGrid() {
  return (
    <Grid cols={4} gap="md" role="list" aria-label="Logo 禁用示例">
      {CASES.map((c, i) => (
        <figure
          key={c.id}
          role="listitem"
          className="flex flex-col overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-level-1"
        >
          <div className="flex items-center gap-2 border-b border-status-error-border bg-status-error-bg px-3 py-1.5 text-xs font-semibold text-status-error-fg">
            <span className="flex size-4 items-center justify-center rounded-full bg-status-error-solid text-white" aria-hidden>
              <X className="size-2.5" strokeWidth={3} />
            </span>
            {String(i + 1).padStart(2, '0')} · {c.title}
            <span className="ml-auto font-medium">{c.en}</span>
          </div>
          <div
            className={cn('flex min-h-28 flex-1 items-center justify-center overflow-hidden px-4 py-5', !c.surface && 'bg-bg-canvas')}
            style={c.surface ? { background: c.surface } : undefined}
          >
            {c.preview}
          </div>
          <figcaption className="border-t border-border-subtle px-3 py-2.5 text-xs leading-5 text-fg-secondary">{c.caption}</figcaption>
        </figure>
      ))}
    </Grid>
  );
}
