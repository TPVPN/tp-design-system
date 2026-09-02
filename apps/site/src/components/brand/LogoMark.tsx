import { useId, type SVGProps } from 'react';

/**
 * Official TP VPN mark — 66×66 rounded square (rx 15.84 = 24%) with the TP ligature.
 * Geometry is copied verbatim from tp-web/public/brand/logo-mark.svg (BRIEF §2.1): never redraw.
 */
export const LOGO_MARK_GLYPH =
  'M3.02853 0.0561293C3.44733 -0.0231548 3.87503 0.00639278 4.29926 0.0014683C13.5771 0.00639278 22.8549 0.00639302 32.1327 0.00787036C32.8121 -0.00690307 33.4929 0.0300295 34.1639 0.142308C35.9409 0.499332 37.5993 1.38722 38.9145 2.62523C40.3667 4.01344 41.4491 5.80497 41.9203 7.759C42.4449 9.80857 42.2876 11.9832 41.7126 14.0047C41.5361 14.5774 41.3571 15.1531 41.0911 15.6923C40.2911 17.5651 38.9946 19.2301 37.357 20.4499C35.7387 21.6283 33.7594 22.3837 31.7381 22.3463C29.5789 22.3512 27.4196 22.3487 25.2604 22.3492C23.8527 22.2867 22.4722 22.7215 21.2232 23.3376C20.3253 23.8089 19.4714 24.3629 18.6659 24.9779C18.4424 25.1493 18.2348 25.3734 17.948 25.4325C17.6488 25.4881 17.4441 25.1104 17.5762 24.8647C18.305 22.9121 19.1129 20.9901 19.9015 19.0612C20.2655 18.1895 20.7085 17.3268 21.3799 16.6487C22.3154 15.6332 23.6727 14.9886 25.0651 15.0034C26.9756 15.0113 28.8866 15.0034 30.7972 15.0039C31.752 14.9778 32.7226 14.6311 33.3999 13.9441C34.106 13.2823 34.5372 12.3575 34.6568 11.4046C34.7765 10.4625 34.55 9.47764 34.0061 8.69563C33.4622 7.86635 32.5416 7.28231 31.5482 7.18283C31.1853 7.12719 30.8175 7.16412 30.453 7.15526C27.651 7.15723 24.8495 7.15181 22.0474 7.15476C21.8536 7.1592 21.6558 7.13605 21.4655 7.17939C21.2509 7.23405 21.2049 7.47978 21.1258 7.65312C17.7868 15.78 14.3716 23.8763 11.0435 32.0076C10.7033 32.8266 10.4116 33.6992 9.78812 34.3566C9.46278 34.6782 9.11666 34.9884 8.70924 35.2036C7.92158 35.6143 6.98609 35.7537 6.11883 35.5419C5.30002 35.3607 4.57517 34.8353 4.11039 34.1448C3.58677 33.322 3.44437 32.2863 3.66687 31.3438C3.82262 30.6603 4.14599 30.0319 4.39815 29.3814C4.79124 28.4822 5.14427 27.5662 5.53044 26.6641C5.90918 25.6915 6.33985 24.7401 6.72354 23.769C7.49883 21.909 8.27808 20.052 9.04991 18.1905C9.80938 16.3192 10.604 14.4627 11.3768 12.5968C11.979 11.1293 12.6099 9.67364 13.2033 8.20269C13.318 7.95253 13.4381 7.70286 13.5143 7.43792C13.5563 7.28329 13.3971 7.14048 13.2468 7.15427C9.94981 7.1523 6.65283 7.16067 3.35536 7.15378C2.5954 7.12472 1.84285 6.84058 1.26632 6.34419C0.603765 5.79708 0.16272 4.99981 0.0287247 4.15477C-0.0128088 3.74604 -0.016766 3.32943 0.06729 2.92513C0.267541 1.95501 0.903895 1.11292 1.71825 0.561381C2.1148 0.307278 2.55733 0.114731 3.02853 0.0561293Z';

export const LOGO_MARK_SIZE = 66;
export const LOGO_MARK_RADIUS = 15.84;
export const LOGO_GLYPH_OFFSET = { x: 11.85, y: 17.08 } as const;
export const TP_BLUE = '#1677FF';

export type LogoMarkVariant =
  /** blue square, white glyph */
  | 'brand'
  /** white square, blue glyph — for use on brand/dark fills */
  | 'reversed'
  /** black square, glyph knocked out */
  | 'mono-black'
  /** white square, glyph knocked out */
  | 'mono-white';

export interface LogoMarkProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  /** Rendered size in px (square). */
  size?: number;
  variant?: LogoMarkVariant;
  /** Accessible name; pass `''` (with `aria-hidden`) for purely decorative uses. */
  title?: string;
}

export function LogoMark({ size = 28, variant = 'brand', title = 'TP VPN', className, ...rest }: LogoMarkProps) {
  const maskId = useId();
  const decorative = title === '';
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': title };

  const knockout = variant === 'mono-black' || variant === 'mono-white';
  const square = variant === 'brand' ? TP_BLUE : variant === 'mono-black' ? '#000000' : '#FFFFFF';
  const glyph = variant === 'brand' ? '#FFFFFF' : TP_BLUE;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${LOGO_MARK_SIZE} ${LOGO_MARK_SIZE}`}
      className={className}
      {...a11y}
      {...rest}
    >
      {knockout ? (
        <>
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={LOGO_MARK_SIZE} height={LOGO_MARK_SIZE}>
              <rect width={LOGO_MARK_SIZE} height={LOGO_MARK_SIZE} fill="#fff" />
              <path transform={`translate(${LOGO_GLYPH_OFFSET.x} ${LOGO_GLYPH_OFFSET.y})`} fill="#000" d={LOGO_MARK_GLYPH} />
            </mask>
          </defs>
          <rect width={LOGO_MARK_SIZE} height={LOGO_MARK_SIZE} rx={LOGO_MARK_RADIUS} fill={square} mask={`url(#${maskId})`} />
        </>
      ) : (
        <>
          <rect width={LOGO_MARK_SIZE} height={LOGO_MARK_SIZE} rx={LOGO_MARK_RADIUS} fill={square} />
          <path transform={`translate(${LOGO_GLYPH_OFFSET.x} ${LOGO_GLYPH_OFFSET.y})`} fill={glyph} d={LOGO_MARK_GLYPH} />
        </>
      )}
    </svg>
  );
}

/** Mark + “TP VPN” wordmark (text) — for UI chrome; the asset packs use the outlined SVG wordmark. */
export function LogoLockup({ size = 28, className, muted }: { size?: number; className?: string; muted?: string }) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.36 }}>
      <LogoMark size={size} title="" />
      <span
        style={{ fontSize: size * 0.56 + 2, letterSpacing: '-0.02em', lineHeight: 1 }}
        className="font-bold text-fg-primary"
      >
        TP VPN
      </span>
      {muted ? (
        <span style={{ fontSize: size * 0.56 + 2, lineHeight: 1 }} className="text-fg-muted">
          {muted}
        </span>
      ) : null}
    </span>
  );
}
