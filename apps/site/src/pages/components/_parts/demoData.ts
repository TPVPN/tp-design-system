import type { SceneTone } from '@tpvpn/ui/components/tp/tag';

/** One row of the demo country list (NodeCard · CountryListItem · SearchBar pages). */
export interface CountryEntry {
  /** ISO 3166-1 alpha-2, lower-case (circle-flags). */
  code: string;
  name: string;
  latencyMs: number;
  lossPct: number;
  loadPct: number;
  /** Optional scene tag rendered next to the name. */
  tag?: { tone: SceneTone; label: string };
  /** Search terms (zh + en + aliases), lower-case. */
  keywords: string[];
}

/** Six realistic entries, measured from Hong Kong; sorted by latency in the UI. */
export const COUNTRIES: readonly CountryEntry[] = [
  {
    code: 'hk',
    name: '中国香港',
    latencyMs: 24,
    lossPct: 0,
    loadPct: 61,
    tag: { tone: 'auto', label: '优选线路 IEPL' },
    keywords: ['hk', 'hong kong', 'hongkong', '香港', '中国香港'],
  },
  {
    code: 'jp',
    name: '日本 · 东京',
    latencyMs: 58,
    lossPct: 0,
    loadPct: 38,
    tag: { tone: 'game', label: '游戏' },
    keywords: ['jp', 'japan', 'tokyo', '日本', '东京'],
  },
  {
    code: 'sg',
    name: '新加坡',
    latencyMs: 71,
    lossPct: 0.1,
    loadPct: 52,
    tag: { tone: 'ai', label: 'AI' },
    keywords: ['sg', 'singapore', '新加坡'],
  },
  {
    code: 'us',
    name: '美国 · 洛杉矶',
    latencyMs: 142,
    lossPct: 0.2,
    loadPct: 46,
    tag: { tone: 'auto', label: '优选线路 IEPL' },
    keywords: ['us', 'usa', 'united states', 'america', 'los angeles', 'la', '美国', '洛杉矶'],
  },
  {
    code: 'gb',
    name: '英国 · 伦敦',
    latencyMs: 196,
    lossPct: 0.4,
    loadPct: 27,
    keywords: ['gb', 'uk', 'united kingdom', 'britain', 'london', '英国', '伦敦'],
  },
  {
    code: 'de',
    name: '德国 · 法兰克福',
    latencyMs: 212,
    lossPct: 0.3,
    loadPct: 33,
    keywords: ['de', 'germany', 'frankfurt', '德国', '法兰克福'],
  },
];

/** Case-insensitive match against name + keywords; empty query returns everything. */
export function filterCountries(query: string, list: readonly CountryEntry[] = COUNTRIES): CountryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...list];
  return list.filter((c) => c.name.toLowerCase().includes(q) || c.keywords.some((k) => k.includes(q)));
}

/** Node entries for the NodeCard page (title format from BRIEF §4: `US · Los Angeles #102`). */
export interface NodeEntry {
  id: string;
  flagCode?: string;
  title: string;
  subtitle?: string;
  latencyMs: number;
  loadPct: number;
  premium?: boolean;
}

export const NODES: readonly NodeEntry[] = [
  { id: 'hk-07', flagCode: 'hk', title: 'HK · Hong Kong #07', subtitle: '中国香港', latencyMs: 38, loadPct: 21, premium: true },
  { id: 'jp-12', flagCode: 'jp', title: 'JP · Tokyo #12', subtitle: '日本 · 东京', latencyMs: 95, loadPct: 58 },
  { id: 'us-102', flagCode: 'us', title: 'US · Los Angeles #102', subtitle: '美国 · 洛杉矶', latencyMs: 160, loadPct: 83 },
  { id: 'de-03', flagCode: 'de', title: 'DE · Frankfurt #03', subtitle: '德国 · 法兰克福', latencyMs: 240, loadPct: 97 },
];

/** HH:MM:SS; beyond 24 h → `1d 02:03:04` (docs/10-patterns §1.3). */
export function formatElapsed(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(s / 86400);
  const hh = Math.floor((s % 86400) / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  const clock = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  return days > 0 ? `${days}d ${clock}` : clock;
}
