import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * TP typography roles exposed by @tpvpn/tokens as `--text-<role>`.
 * Registered with tailwind-merge so `text-label-md` is treated as a font-size
 * utility (and not mistaken for a text colour that conflicts with `text-fg-primary`).
 */
export const typeRoles = [
  'display-2xl',
  'display-xl',
  'display-lg',
  'display-md',
  'display-sm',
  'title-lg',
  'title-md',
  'title-sm',
  'headline',
  'body-lg',
  'body-md',
  'body',
  'body-sm',
  'label-lg',
  'label-md',
  'label-sm',
  'caption',
  'overline',
  'numeric-lg',
  'numeric-md',
  'numeric-sm',
  'mono',
] as const;

export type TypeRole = (typeof typeRoles)[number];

const shadowKeys = [
  'level-0',
  'level-1',
  'level-2',
  'level-3',
  'level-4',
  'brand-glow',
  'brand-glow-lg',
  'success-glow',
  'focus',
  'inset-hairline',
];

const spacingKeys = [
  'control-xs',
  'control-sm',
  'control-md',
  'control-lg',
  'control-xl',
  'icon-xs',
  'icon-sm',
  'icon-md',
  'icon-lg',
  'icon-xl',
  'avatar-xs',
  'avatar-sm',
  'avatar-md',
  'avatar-lg',
  'avatar-xl',
  'flag-sm',
  'flag-md',
  'flag-lg',
  'connection-mobile',
  'connection-desktop',
  'tab-bar',
  'app-bar',
];

const easeKeys = ['standard', 'emphasized', 'decelerate', 'accelerate', 'spring'];

/** tailwind-merge instance aware of the TP token namespaces. */
export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [...typeRoles],
      shadow: shadowKeys,
      spacing: spacingKeys,
      ease: easeKeys,
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
