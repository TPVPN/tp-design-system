import * as React from 'react';

import { cn } from '@/lib/utils';

const DEFAULT_FLAG_BASE_URL = '/brand/flags/';

const FlagBaseUrlContext = React.createContext<string>(DEFAULT_FLAG_BASE_URL);

/** Sets the base URL for circle-flag SVGs (e.g. `${import.meta.env.BASE_URL}brand/flags/` on the site). */
function FlagProvider({ baseUrl, children }: { baseUrl: string; children: React.ReactNode }) {
  return <FlagBaseUrlContext.Provider value={baseUrl}>{children}</FlagBaseUrlContext.Provider>;
}

function useFlagBaseUrl() {
  return React.useContext(FlagBaseUrlContext);
}

export type FlagSize = 24 | 32 | 40;

export interface FlagProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** ISO 3166-1 alpha-2 code (case-insensitive), e.g. "us", "hk", "jp". */
  code: string;
  /** Localised country name used as alt text. Falls back to the upper-cased code. */
  name?: string;
  size?: FlagSize;
  /** Overrides the FlagProvider / default base URL. */
  baseUrl?: string;
}

/** Circular circle-flags SVG with the 1px inset hairline (BRIEF §2.8). */
function Flag({ code, name, size = 32, baseUrl, className, style, ...props }: FlagProps) {
  const contextBaseUrl = useFlagBaseUrl();
  const base = baseUrl ?? contextBaseUrl;
  const normalized = code.trim().toLowerCase();
  const src = `${base.endsWith('/') ? base : `${base}/`}${normalized}.svg`;

  return (
    <span
      data-slot="flag"
      data-code={normalized}
      className={cn(
        'relative inline-block shrink-0 overflow-hidden rounded-full bg-bg-surface-sunken align-middle',
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <img
        data-slot="flag-image"
        src={src}
        alt={name ?? code.toUpperCase()}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="block size-full rounded-full object-cover"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_var(--color-border-flag-inset,rgb(15_23_42_/_0.08))]"
      />
    </span>
  );
}

export { Flag, FlagProvider, useFlagBaseUrl, DEFAULT_FLAG_BASE_URL };
