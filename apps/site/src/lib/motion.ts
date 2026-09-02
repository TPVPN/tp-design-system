/**
 * Motion presets aligned with the token easing curves (BRIEF §2.7).
 * Entering elements use `decelerate` / `emphasized`; exits use `accelerate` and are faster.
 */
import { useReducedMotion, type Transition, type Variants } from 'motion/react';

export type Bezier = [number, number, number, number];
export const EASE_STANDARD: Bezier = [0.2, 0, 0, 1];
export const EASE_EMPHASIZED: Bezier = [0.16, 1, 0.3, 1];
export const EASE_DECELERATE: Bezier = [0, 0, 0.2, 1];
export const EASE_ACCELERATE: Bezier = [0.4, 0, 1, 1];

export interface RevealVariants {
  container: Variants;
  item: Variants;
  /** Transition for one-off elements (not part of a stagger) */
  single: Transition;
  reduced: boolean;
}

/**
 * Staggered fade-up used on the home page. Honours `prefers-reduced-motion`
 * (falls back to a 150ms opacity fade with no translation).
 */
export function useReveal(options: { stagger?: number; delay?: number; distance?: number } = {}): RevealVariants {
  const reduced = useReducedMotion() ?? false;
  const { stagger = 0.07, delay = 0.05, distance = 16 } = options;

  if (reduced) {
    const fade: Transition = { duration: 0.15, ease: 'easeOut' };
    return {
      reduced,
      single: fade,
      container: { hidden: {}, show: { transition: { staggerChildren: 0 } } },
      item: { hidden: { opacity: 0 }, show: { opacity: 1, transition: fade } },
    };
  }

  const single: Transition = { duration: 0.6, ease: EASE_EMPHASIZED };
  return {
    reduced,
    single,
    container: {
      hidden: {},
      show: { transition: { staggerChildren: stagger, delayChildren: delay } },
    },
    item: {
      hidden: { opacity: 0, y: distance },
      show: { opacity: 1, y: 0, transition: single },
    },
  };
}

/** `whileInView` defaults: reveal once, a little before the element enters. */
export const VIEWPORT_ONCE = { once: true, margin: '0px 0px -10% 0px' } as const;
