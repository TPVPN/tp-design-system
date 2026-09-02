import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowLeftRight, Gamepad2, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type SceneTone = 'auto' | 'game' | 'ai' | 'exchange';
export type TagTone = SceneTone | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';

const tagVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1 rounded-xs whitespace-nowrap text-label-sm [&_svg]:shrink-0',
  {
    variants: {
      tone: {
        auto: 'bg-scene-auto-bg text-scene-auto-fg',
        game: 'bg-scene-game-bg text-scene-game-fg',
        ai: 'bg-scene-ai-bg text-scene-ai-fg',
        exchange: 'bg-scene-exchange-bg text-scene-exchange-fg',
        success: 'bg-status-success-bg text-status-success-fg',
        warning: 'bg-status-warning-bg text-status-warning-fg',
        error: 'bg-status-error-bg text-status-error-fg',
        info: 'bg-status-info-bg text-status-info-fg',
        neutral: 'bg-bg-surface-sunken text-fg-secondary',
        brand: 'bg-bg-brand-soft text-fg-brand-strong',
      },
      size: {
        sm: 'h-5 px-1.5 [&_svg]:size-3',
        md: 'h-6 px-2 [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'sm',
    },
  },
);

/** Default scene icons (BRIEF §2.8). */
export const sceneIcon: Record<SceneTone, LucideIcon> = {
  auto: ShieldCheck,
  game: Gamepad2,
  ai: Sparkles,
  exchange: ArrowLeftRight,
};

/** Default zh-CN scene labels. */
export const sceneLabel: Record<SceneTone, string> = {
  auto: '自动最优',
  game: '游戏',
  ai: 'AI',
  exchange: '交易所',
};

export interface TagProps
  extends Omit<React.ComponentProps<'span'>, 'children'>,
    Omit<VariantProps<typeof tagVariants>, 'tone'> {
  tone: TagTone;
  /** Leading icon. Scene tones get their icon by default; pass `null` to suppress it. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

function isScene(tone: TagTone): tone is SceneTone {
  return tone === 'auto' || tone === 'game' || tone === 'ai' || tone === 'exchange';
}

function Tag({ tone, size = 'sm', icon, className, children, ...props }: TagProps) {
  let leading: React.ReactNode = icon;
  if (icon === undefined && isScene(tone)) {
    const Icon = sceneIcon[tone];
    leading = <Icon aria-hidden="true" strokeWidth={2} />;
  }

  return (
    <span
      data-slot="tag"
      data-tone={tone}
      data-size={size}
      className={cn(tagVariants({ tone, size }), className)}
      {...props}
    >
      {leading}
      {children}
    </span>
  );
}

export { Tag, tagVariants };
