/**
 * Latency colouring rules (BRIEF §5 patterns/nodes):
 * < 80 ms good · 80–180 ms fair · > 180 ms poor. Non-finite / non-positive = idle.
 */
export type LatencyTone = 'good' | 'fair' | 'poor' | 'idle';

export function latencyTone(ms: number): LatencyTone {
  if (!Number.isFinite(ms) || ms <= 0) return 'idle';
  if (ms < 80) return 'good';
  if (ms <= 180) return 'fair';
  return 'poor';
}

export interface LatencyBars {
  /** Number of filled bars out of 4. */
  bars: 0 | 1 | 2 | 3 | 4;
  tone: LatencyTone;
}

/** Signal-bar fill: <80 → 4 (good), <120 → 3 (good), <180 → 2 (fair), else 1 (poor). */
export function latencyBars(ms: number): LatencyBars {
  if (!Number.isFinite(ms) || ms <= 0) return { bars: 0, tone: 'idle' };
  if (ms < 80) return { bars: 4, tone: 'good' };
  if (ms < 120) return { bars: 3, tone: 'good' };
  if (ms < 180) return { bars: 2, tone: 'fair' };
  return { bars: 1, tone: 'poor' };
}

export const latencyTextClass: Record<LatencyTone, string> = {
  good: 'text-latency-good-fg',
  fair: 'text-latency-fair-fg',
  poor: 'text-latency-poor-fg',
  idle: 'text-fg-muted',
};

export const latencyFillClass: Record<LatencyTone, string> = {
  good: 'bg-latency-good',
  fair: 'bg-latency-fair',
  poor: 'bg-latency-poor',
  idle: 'bg-latency-idle',
};
