/**
 * Row data for /foundations/color: fallback descriptions for tokens whose source has none,
 * and the contrast pairs each text-like token is checked against.
 */
import type { ReactNode } from 'react';
import { isHex, PAPER } from '@/lib/contrast';
import { token, type TokenEntry } from '@/lib/tokens';
import type { ColorRow } from './ColorTokenTable';
import type { ContrastPair } from './ContrastChip';

export const DESCRIPTIONS: Record<string, string> = {
  'color.bg.surface-pressed': '中性面按压态',
  'color.bg.brand-strong': '品牌强调面（白字 4.82:1）',
  'color.bg.brand-soft-hover': '浅蓝面 hover',
  'color.bg.inverse': '深色面：Tooltip、Toast',
  'color.fg.disabled': '禁用文字（不计对比度）',
  'color.fg.brand-strong': '浅蓝底上的品牌文字 / 链接（blue-700）',
  'color.fg.on-inverse': '深色面上的文字',
  'color.fg.inverse': '反白文字（品牌面、深色面）',
  'color.fg.link': '链接文字（blue-600）',
  'color.fg.link-hover': '链接 hover / 按压',
  'color.border.focus': '聚焦描边，配合 ring.focus 使用',
  'color.border.on-brand': '品牌面上的描边',
  'color.action.primary.bg-hover': '主按钮 hover',
  'color.action.primary.bg-pressed': '主按钮按压',
  'color.action.primary.fg': '主按钮文字',
  'color.action.secondary.bg': '次级按钮底（浅蓝）',
  'color.action.secondary.bg-hover': '次级按钮 hover',
  'color.action.secondary.bg-pressed': '次级按钮按压',
  'color.action.secondary.fg': '次级按钮文字（blue-700，浅蓝底 AA）',
  'color.action.ghost.bg': '幽灵按钮底（透明）',
  'color.action.ghost.bg-hover': '幽灵按钮 hover',
  'color.action.ghost.bg-pressed': '幽灵按钮按压',
  'color.action.ghost.fg': '幽灵按钮文字',
  'color.action.outline.bg': '描边按钮底',
  'color.action.outline.bg-hover': '描边按钮 hover',
  'color.action.outline.border': '描边按钮边框',
  'color.action.outline.border-hover': '描边按钮边框 hover',
  'color.action.outline.fg': '描边按钮文字',
  'color.action.destructive.bg-hover': '危险按钮 hover',
  'color.action.destructive.fg': '危险按钮文字',
  'color.action.destructive.soft-bg': '危险操作浅底',
  'color.action.destructive.soft-fg': '危险操作浅底文字',
  'color.action.disabled.bg': '禁用控件底',
  'color.action.disabled.fg': '禁用控件文字',
  'color.action.disabled.border': '禁用控件边框',
  'color.action.selected.bg': '选中行 / 选中项底',
  'color.action.selected.fg': '选中文字',
  'color.action.selected.indicator': '选中指示条（左侧 3px）',
  'color.status.success.solid': '成功图标、状态点',
  'color.status.success.bg': '成功浅底（Callout、Tag）',
  'color.status.success.border': '成功浅底描边',
  'color.status.warning.solid': '警告图标、状态点',
  'color.status.warning.bg': '警告浅底',
  'color.status.warning.border': '警告浅底描边',
  'color.status.error.solid': '错误图标、状态点、表单错误描边',
  'color.status.error.bg': '错误浅底',
  'color.status.error.border': '错误浅底描边',
  'color.status.info.solid': '信息图标（= 品牌蓝）',
  'color.status.info.fg': '信息文字',
  'color.status.info.bg': '信息浅底',
  'color.status.info.border': '信息浅底描边',
  'color.state.connected': '已连接 · 静态（全产品唯一来源）',
  'color.state.connected-fg': '已连接文字',
  'color.state.connected-bg': '已连接浅底',
  'color.state.connecting': '连接中 · 呼吸 / 旋转动画',
  'color.state.connecting-fg': '连接中文字',
  'color.state.connecting-bg': '连接中浅底',
  'color.state.disconnected': '未连接 · 静态',
  'color.state.disconnected-fg': '未连接文字',
  'color.state.disconnected-bg': '未连接浅底',
  'color.state.error': '连接失败 · 静态',
  'color.state.error-fg': '连接失败文字',
  'color.state.error-bg': '连接失败浅底',
  'color.latency.good': '延迟 < 80 ms（信号条、数值着色）',
  'color.latency.good-fg': '延迟 < 80 ms 文字',
  'color.latency.fair': '延迟 80–180 ms',
  'color.latency.fair-fg': '延迟 80–180 ms 文字',
  'color.latency.poor': '延迟 > 180 ms',
  'color.latency.poor-fg': '延迟 > 180 ms 文字',
  'color.latency.idle': '未测速 / 无数据',
  'color.scene.auto.solid': '自动最优 · 图标 / 强调',
  'color.scene.auto.fg': '自动最优 · Tag 文字',
  'color.scene.auto.bg': '自动最优 · Tag 浅底',
  'color.scene.game.solid': '游戏 · 图标 / 强调',
  'color.scene.game.bg': '游戏 · Tag 浅底',
  'color.scene.ai.solid': 'AI · 图标 / 强调',
  'color.scene.ai.fg': 'AI · Tag 文字',
  'color.scene.ai.bg': 'AI · Tag 浅底',
  'color.scene.exchange.solid': '交易所 · 图标 / 强调',
  'color.scene.exchange.fg': '交易所 · Tag 文字',
  'color.scene.exchange.bg': '交易所 · Tag 浅底',
  'color.chart.1': '序列 1（blue）',
  'color.chart.2': '序列 2（cyan）',
  'color.chart.3': '序列 3（purple）',
  'color.chart.4': '序列 4（mint）',
  'color.chart.5': '序列 5（amber）',
  'color.chart.6': '序列 6（pink）',
  'color.chart.grid': '图表网格线',
  'color.chart.axis': '坐标轴、刻度文字',
  'color.ring.error': '错误态聚焦环（表单 aria-invalid）',
};

export const describe = (e: TokenEntry): ReactNode => e.description ?? DESCRIPTIONS[e.path] ?? '—';

/** Which contrast checks to show for a token (only text-like tokens get any). */
export function pairsFor(e: TokenEntry): ContrastPair[] {
  const v = String(e.value);
  if (!isHex(v)) return [];
  const p = e.path;
  const pairs: ContrastPair[] = [];
  const onWhite = () => pairs.push({ fg: v, bg: token('color.bg.surface'), label: '白底' });
  const whiteOn = () => pairs.push({ fg: PAPER, bg: v, label: '白字' });
  const against = (bgPath: string, label: string) => {
    const bg = token(bgPath);
    if (isHex(bg)) pairs.push({ fg: v, bg, label });
  };

  if (p.startsWith('color.bg.')) {
    if (p === 'color.bg.brand' || p === 'color.bg.brand-strong' || p === 'color.bg.inverse') whiteOn();
    return pairs;
  }
  if (p.startsWith('color.fg.')) {
    if (p === 'color.fg.on-brand') against('color.bg.brand', 'bg.brand');
    else if (p === 'color.fg.on-inverse' || p === 'color.fg.inverse') against('color.bg.inverse', 'bg.inverse');
    else onWhite();
    if (p === 'color.fg.secondary' || p === 'color.fg.muted') against('color.bg.surface-sunken', 'surface-sunken');
    if (p === 'color.fg.brand' || p === 'color.fg.brand-strong' || p === 'color.fg.link') against('color.bg.brand-soft', 'brand-soft');
    return pairs;
  }
  let m = /^color\.action\.([a-z]+)\.(fg|soft-fg)$/.exec(p);
  if (m) {
    const [, variant, part] = m;
    if (variant === 'ghost') onWhite();
    else {
      const bgKey = part === 'soft-fg' ? 'soft-bg' : 'bg';
      against(`color.action.${variant}.${bgKey}`, `${variant}.${bgKey}`);
    }
    return pairs;
  }
  if (/^color\.action\.(primary|destructive)\.bg(-hover|-pressed)?$/.test(p)) {
    whiteOn();
    return pairs;
  }
  m = /^color\.status\.([a-z]+)\.(fg|solid)$/.exec(p);
  if (m) {
    if (m[2] === 'fg') {
      onWhite();
      against(`color.status.${m[1]}.bg`, `${m[1]}.bg`);
    } else whiteOn();
    return pairs;
  }
  m = /^color\.state\.([a-z]+)(-fg)?$/.exec(p);
  if (m) {
    if (m[2]) {
      onWhite();
      against(`color.state.${m[1]}-bg`, `${m[1]}-bg`);
    } else whiteOn();
    return pairs;
  }
  if (/^color\.latency\.[a-z]+-fg$/.test(p)) {
    onWhite();
    return pairs;
  }
  m = /^color\.scene\.([a-z]+)\.(fg|solid)$/.exec(p);
  if (m) {
    if (m[2] === 'fg') {
      onWhite();
      against(`color.scene.${m[1]}.bg`, `${m[1]}.bg`);
    } else whiteOn();
    return pairs;
  }
  return pairs;
}

export const rowsFor = (entries: TokenEntry[]): ColorRow[] => entries.map((entry) => ({ entry, description: describe(entry), pairs: pairsFor(entry) }));

export const SUBGROUP_LABEL: Record<string, { title: string; en: string }> = {
  primary: { title: '主操作', en: 'Primary' },
  secondary: { title: '次级操作', en: 'Secondary' },
  ghost: { title: '幽灵', en: 'Ghost' },
  outline: { title: '描边', en: 'Outline' },
  destructive: { title: '危险操作', en: 'Destructive' },
  disabled: { title: '禁用', en: 'Disabled' },
  selected: { title: '选中', en: 'Selected' },
  success: { title: '成功', en: 'Success' },
  warning: { title: '警告', en: 'Warning' },
  error: { title: '错误', en: 'Error' },
  info: { title: '信息', en: 'Info' },
  auto: { title: '自动最优', en: 'Auto' },
  game: { title: '游戏', en: 'Game' },
  ai: { title: 'AI', en: 'AI' },
  exchange: { title: '交易所', en: 'Exchange' },
};
