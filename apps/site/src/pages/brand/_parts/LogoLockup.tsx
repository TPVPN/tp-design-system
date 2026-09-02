import type { CSSProperties } from 'react';
import { asset } from '@/lib/assets';
import { LOGO_GLYPH_OFFSET, LOGO_MARK_GLYPH, LOGO_MARK_RADIUS, LOGO_MARK_SIZE, TP_BLUE } from '@/components/brand/LogoMark';

/** Outlined wordmark SVGs shipped next to the logo variants (`tp-vpn-wordmark[-white].svg`). */
export const WORDMARK_SVG = {
  dark: asset('brand/logo/svg/tp-vpn-wordmark.svg'),
  white: asset('brand/logo/svg/tp-vpn-wordmark-white.svg'),
} as const;

/** Official horizontal geometry (tp-vpn-logo-horizontal.svg: 207.48 × 66, wordmark 129.6 × 26.89 at x = 77.88). */
export const LOCKUP = {
  markSize: LOGO_MARK_SIZE,
  wordmarkWidth: 129.6,
  wordmarkHeight: 26.89,
  gapRatio: 0.18,
  totalWidth: 207.48,
} as const;

export interface LogoLockupProps {
  /** Mark height in px; the wordmark and gap scale with it. */
  height?: number;
  markFill?: string;
  glyphFill?: string;
  /** Outline stroke colour — misuse demo only. */
  stroke?: string;
  wordmark?: 'dark' | 'white' | 'none';
  /** `horizontal` is the official lockup; `wordmark-top` is a misuse demonstration. */
  layout?: 'horizontal' | 'wordmark-top';
  label: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Composes the mark (inline SVG, so the fill can be changed for misuse demos) with the
 * outlined wordmark image using the official proportions: gap = 0.18 × mark height,
 * wordmark = 1.964 × mark height wide, vertically centred.
 */
export function LogoLockup({
  height = 48,
  markFill = TP_BLUE,
  glyphFill = '#FFFFFF',
  stroke,
  wordmark = 'dark',
  layout = 'horizontal',
  label,
  className,
  style,
}: LogoLockupProps) {
  const scale = height / LOCKUP.markSize;
  const gap = Math.round(height * LOCKUP.gapRatio);
  const wmWidth = Math.round(LOCKUP.wordmarkWidth * scale);
  const wmHeight = Math.round(LOCKUP.wordmarkHeight * scale);
  const vertical = layout === 'wordmark-top';

  return (
    <span
      role="img"
      aria-label={label}
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: vertical ? 'column-reverse' : 'row',
        alignItems: 'center',
        gap,
        ...style,
      }}
    >
      <svg width={height} height={height} viewBox={`0 0 ${LOGO_MARK_SIZE} ${LOGO_MARK_SIZE}`} overflow="visible" aria-hidden>
        <rect
          width={LOGO_MARK_SIZE}
          height={LOGO_MARK_SIZE}
          rx={LOGO_MARK_RADIUS}
          fill={markFill}
          stroke={stroke}
          strokeWidth={stroke ? 3 : undefined}
        />
        <path
          transform={`translate(${LOGO_GLYPH_OFFSET.x} ${LOGO_GLYPH_OFFSET.y})`}
          fill={glyphFill}
          stroke={stroke}
          strokeWidth={stroke ? 1.5 : undefined}
          d={LOGO_MARK_GLYPH}
        />
      </svg>
      {wordmark !== 'none' && (
        <img src={WORDMARK_SVG[wordmark]} alt="" width={wmWidth} height={wmHeight} style={{ display: 'block' }} draggable={false} />
      )}
    </span>
  );
}
