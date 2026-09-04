/**
 * Single typed navigation manifest for the whole site (BRIEF §5).
 *
 * - `NAV` drives the header, sidebar, ⌘K palette, prev/next links and <title>.
 * - `PAGES` maps every route to a lazily loaded page module. Page files live in
 *   `src/pages/<section>/<PascalName>.tsx` and default-export the page component
 *   (see src/pages/README.md). Adding a route = one NAV item + one PAGES entry.
 */
import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import {
  Component,
  Download,
  History,
  LayoutGrid,
  Layers,
  Monitor,
  Shapes,
  type LucideIcon,
} from 'lucide-react';

export const SITE = {
  name: 'TP VPN Design System',
  shortName: 'TP VPN',
  label: 'Design System',
  version: '1.0.0',
  github: 'https://github.com/TPVPN',
  year: 2026,
} as const;

export type SectionId = 'brand' | 'foundations' | 'components' | 'patterns' | 'platforms' | 'downloads' | 'changelog';

export interface NavItem {
  path: string;
  /** 中文标题（主） */
  title: string;
  /** English title（副） */
  en: string;
  /** One-line summary of what the page covers (BRIEF §5) — shown on placeholders & overview cards */
  description?: string;
}

export interface NavSection {
  id: SectionId;
  title: string;
  en: string;
  /** Landing route used by the top navigation */
  path: string;
  icon: LucideIcon;
  /** Show in the 64px header nav */
  topNav: boolean;
  items: NavItem[];
}

export const HOME: NavItem = { path: '/', title: '概览', en: 'Overview' };

export const NAV: readonly NavSection[] = [
  {
    id: 'brand',
    title: '品牌',
    en: 'Brand',
    path: '/brand/logo',
    icon: Shapes,
    topNav: true,
    items: [
      { path: '/brand/logo', title: 'Logo', en: 'Logo', description: '主 Logo、反白、堆叠、仅图形、单色；构成网格、安全空间、最小尺寸、禁用示例与下载。' },
      { path: '/brand/app-icon', title: 'App Icon', en: 'App Icon', description: '1024 → 32 展示、iOS / Android / Web 规格表、maskable 安全区与下载。' },
      { path: '/brand/color', title: '品牌色彩', en: 'Color', description: '主色（含 OKLCH）、5 条 11 阶色带、中性色、状态色、渐变板、70/20/10 使用比例与配色禁忌。' },
      { path: '/brand/typography', title: '字体', en: 'Typography', description: 'Inter 展示、多语言样张、tabular 数字演示与字阶表。' },
      { path: '/brand/voice', title: '语调与文案', en: 'Voice & Tone', description: '原则、可宣称 / 不可宣称能力表、五语言 UI 文案对照。' },
      { path: '/brand/social', title: '社媒与主视觉', en: 'Social & Main KV', description: '四套 Light Mode KV、可编辑模板、尺寸与版式标准。' },
      { path: '/brand/ai-guidelines', title: 'AI 设计标准', en: 'AI Design Guidelines', description: '可下载的品牌约束、提示词与 AI Agent 检查清单。' },
    ],
  },
  {
    id: 'foundations',
    title: '基础',
    en: 'Foundations',
    path: '/foundations/color',
    icon: Layers,
    topNav: true,
    items: [
      { path: '/foundations/color', title: '色彩 Token', en: 'Color Tokens', description: '语义 token 表（bg / fg / border / action / status / state / scene）：色块、名称、值、引用、说明、对比度；三层架构图。' },
      { path: '/foundations/typography', title: '字阶 Token', en: 'Type Scale', description: '每个角色实时渲染 + token 名 + CSS / Dart 片段。' },
      { path: '/foundations/spacing', title: '间距 · 圆角 · 布局', en: 'Spacing · Radius · Layout', description: '间距标尺、圆角示例、栅格断点可视化、控件尺寸。' },
      { path: '/foundations/elevation', title: '阴影层级', en: 'Elevation', description: '5 级卡片阴影 + brand / success glow。' },
      { path: '/foundations/motion', title: '动效', en: 'Motion', description: 'duration / easing 曲线可视化（可播放）、连接动画演示、reduced motion。' },
      { path: '/foundations/iconography', title: '图标与国旗', en: 'Iconography', description: 'Lucide 用法、尺寸与描边规范、场景图标映射、62 面圆旗网格（可搜索）。' },
      { path: '/foundations/accessibility', title: '无障碍', en: 'Accessibility', description: '对比度矩阵（自动计算 AA / AAA）、触控尺寸、焦点、动效降级。' },
    ],
  },
  {
    id: 'components',
    title: '组件',
    en: 'Components',
    path: '/components',
    icon: Component,
    topNav: true,
    items: [
      { path: '/components', title: '组件总览', en: 'Overview', description: '全部组件的卡片网格。' },
      { path: '/components/button', title: '按钮', en: 'Button', description: '实时预览、代码、Props、Do / Don\'t 与 Flutter / iOS 提示。' },
      { path: '/components/connection-button', title: '连接按钮', en: 'Connection Button', description: 'disconnected / connecting / connected 三态，直径 128 / 160，计时文字。' },
      { path: '/components/tag', title: '标签', en: 'Tag', description: '场景与状态语义、sm / md 尺寸、可带图标。' },
      { path: '/components/node-card', title: '节点卡片', en: 'Node Card', description: '国旗、标题、优质节点徽标、延迟、负载、信号条。' },
      { path: '/components/country-list-item', title: '国家列表项', en: 'Country List Item', description: '圆旗 40、名称、tag、三段元数据、选中态蓝条。' },
      { path: '/components/search-bar', title: '搜索栏', en: 'Search Bar', description: '搜索图标、占位文案、清除按钮。' },
      { path: '/components/tab-bar', title: '标签栏', en: 'Tab Bar', description: '首页 / 节点 / 我的，选中蓝色，安全区。' },
      { path: '/components/switch', title: '开关', en: 'Switch', description: '51×31 iOS 比例，on 用 blue-500。' },
      { path: '/components/input', title: '输入框', en: 'Input', description: '高度 44、圆角 12、聚焦环、错误态。' },
      { path: '/components/card', title: '卡片', en: 'Card', description: 'level-1 阴影 + slate-200 描边 + radius-lg。' },
      { path: '/components/loading', title: '加载状态', en: 'Loading', description: 'skeleton / spinner / success。' },
      { path: '/components/dialog', title: '对话框', en: 'Dialog', description: 'level-4 阴影、radius-2xl、scrim。' },
      { path: '/components/sheet', title: '抽屉', en: 'Sheet', description: '底部 / 侧边抽屉、安全区、拖拽条。' },
      { path: '/components/tooltip', title: '提示', en: 'Tooltip', description: '反色气泡、延迟与位置。' },
      { path: '/components/toast', title: '轻提示', en: 'Toast', description: '四种状态、自动消失、堆叠。' },
      { path: '/components/usage-meter', title: '用量指示', en: 'Usage Meter', description: '流量进度、阈值着色。' },
      { path: '/components/plan-card', title: '套餐卡片', en: 'Plan Card', description: '价格排版、推荐标记、设备数。' },
      { path: '/components/status-dot', title: '状态点', en: 'Status Dot', description: 'connected / connecting / disconnected / error 四态。' },
    ],
  },
  {
    id: 'patterns',
    title: '模式',
    en: 'Patterns',
    path: '/patterns/connection',
    icon: LayoutGrid,
    topNav: true,
    items: [
      { path: '/patterns/connection', title: '连接流程', en: 'Connection', description: '三态时序、错误处理、计时、文案。' },
      { path: '/patterns/nodes', title: '节点列表', en: 'Nodes', description: '搜索 + 分组 + 延迟着色规则（<80 绿 / 80–180 黄 / >180 红）+ 空态。' },
      { path: '/patterns/states', title: '空态 · 错误 · 加载', en: 'States', description: '骨架屏 → 内容演示、错误与空态文案。' },
      { path: '/patterns/subscription', title: '套餐与付费', en: 'Subscription', description: 'PlanCard 排布、价格排版、兑换码输入。' },
    ],
  },
  {
    id: 'platforms',
    title: '平台',
    en: 'Platforms',
    path: '/platforms',
    icon: Monitor,
    topNav: true,
    items: [
      { path: '/platforms', title: '平台接入', en: 'Platforms', description: 'Web（CSS / Tailwind）、Flutter（Dart）、iOS（Swift）、Android（Kotlin / XML）、Figma（Tokens Studio）代码块与文件下载。' },
      { path: '/platforms/ios', title: 'iOS 组件', en: 'iOS Components', description: '连接、节点、设置与原生 SwiftUI 参考。' },
      { path: '/platforms/android', title: 'Android 组件', en: 'Android Components', description: 'Material 3 组件、导航与 Compose 参考。' },
      { path: '/platforms/mobile-motion', title: '移动端交互动效', en: 'Mobile Motion', description: '连接、切换、弹层与减少动态效果的交互实验室。' },
    ],
  },
  {
    id: 'downloads',
    title: '下载',
    en: 'Downloads',
    path: '/downloads',
    icon: Download,
    topNav: true,
    items: [
      { path: '/downloads', title: '下载中心', en: 'Downloads', description: '品牌全包、Logo 包、App Icon 包、社交图、Token 全格式、字体、国旗包；每项显示大小与清单。' },
      { path: '/sitemap', title: '网站地图', en: 'Sitemap', description: '全部规范、组件、平台和素材入口。' },
    ],
  },
  {
    id: 'changelog',
    title: '更新',
    en: 'Updates',
    path: '/changelog',
    icon: History,
    topNav: false,
    items: [{ path: '/changelog', title: '更新日志', en: 'Changelog', description: '版本记录，从 1.0.0 开始。' }],
  },
];

/** Every documentation route, in sidebar order (excludes the home page). */
export const DOC_ITEMS: readonly NavItem[] = NAV.flatMap((s) => s.items);

/** Sections shown in the 64px header. */
export const TOP_NAV: readonly NavSection[] = NAV.filter((s) => s.topNav);

export function findNavItem(pathname: string): NavItem | undefined {
  if (pathname === '/') return HOME;
  return DOC_ITEMS.find((i) => i.path === pathname);
}

export function findSection(pathname: string): NavSection | undefined {
  return NAV.find((s) => pathname === `/${s.id}` || pathname.startsWith(`/${s.id}/`));
}

export function siblings(pathname: string): { prev?: NavItem; next?: NavItem } {
  const i = DOC_ITEMS.findIndex((item) => item.path === pathname);
  if (i === -1) return {};
  return { prev: DOC_ITEMS[i - 1], next: DOC_ITEMS[i + 1] };
}

/** `Logo · TP VPN Design System` */
export function pageTitle(pathname: string): string {
  if (pathname === '/') return SITE.name;
  const item = findNavItem(pathname);
  return item ? `${item.title} · ${SITE.name}` : `未找到页面 · ${SITE.name}`;
}

/* ------------------------------------------------------------------ */
/* Page registry (lazy)                                                */
/* ------------------------------------------------------------------ */

type PageModule = { default: ComponentType };
type PageLoader = () => Promise<PageModule>;

const loaders: Record<string, PageLoader> = {
  '/': () => import('@/pages/Home'),

  '/brand/logo': () => import('@/pages/brand/Logo'),
  '/brand/app-icon': () => import('@/pages/brand/AppIcon'),
  '/brand/color': () => import('@/pages/brand/Color'),
  '/brand/typography': () => import('@/pages/brand/Typography'),
  '/brand/voice': () => import('@/pages/brand/Voice'),
  '/brand/social': () => import('@/pages/brand/Social'),
  '/brand/ai-guidelines': () => import('@/pages/brand/AIGuidelines'),

  '/foundations/color': () => import('@/pages/foundations/Color'),
  '/foundations/typography': () => import('@/pages/foundations/Typography'),
  '/foundations/spacing': () => import('@/pages/foundations/Spacing'),
  '/foundations/elevation': () => import('@/pages/foundations/Elevation'),
  '/foundations/motion': () => import('@/pages/foundations/Motion'),
  '/foundations/iconography': () => import('@/pages/foundations/Iconography'),
  '/foundations/accessibility': () => import('@/pages/foundations/Accessibility'),

  '/components': () => import('@/pages/components/Index'),
  '/components/button': () => import('@/pages/components/Button'),
  '/components/connection-button': () => import('@/pages/components/ConnectionButton'),
  '/components/tag': () => import('@/pages/components/Tag'),
  '/components/node-card': () => import('@/pages/components/NodeCard'),
  '/components/country-list-item': () => import('@/pages/components/CountryListItem'),
  '/components/search-bar': () => import('@/pages/components/SearchBar'),
  '/components/tab-bar': () => import('@/pages/components/TabBar'),
  '/components/switch': () => import('@/pages/components/Switch'),
  '/components/input': () => import('@/pages/components/Input'),
  '/components/card': () => import('@/pages/components/Card'),
  '/components/loading': () => import('@/pages/components/Loading'),
  '/components/dialog': () => import('@/pages/components/Dialog'),
  '/components/sheet': () => import('@/pages/components/Sheet'),
  '/components/tooltip': () => import('@/pages/components/Tooltip'),
  '/components/toast': () => import('@/pages/components/Toast'),
  '/components/usage-meter': () => import('@/pages/components/UsageMeter'),
  '/components/plan-card': () => import('@/pages/components/PlanCard'),
  '/components/status-dot': () => import('@/pages/components/StatusDot'),

  '/patterns/connection': () => import('@/pages/patterns/Connection'),
  '/patterns/nodes': () => import('@/pages/patterns/Nodes'),
  '/patterns/states': () => import('@/pages/patterns/States'),
  '/patterns/subscription': () => import('@/pages/patterns/Subscription'),

  '/platforms': () => import('@/pages/Platforms'),
  '/platforms/ios': () => import('@/pages/mobile/IOS'),
  '/platforms/android': () => import('@/pages/mobile/Android'),
  '/platforms/mobile-motion': () => import('@/pages/mobile/MobileMotion'),
  '/downloads': () => import('@/pages/Downloads'),
  '/sitemap': () => import('@/pages/Sitemap'),
  '/changelog': () => import('@/pages/Changelog'),
};

export const PAGES: Record<string, LazyExoticComponent<ComponentType>> = Object.fromEntries(
  Object.entries(loaders).map(([path, load]) => [path, lazy(load)]),
);

/** Warm a page chunk (used on hover/focus of nav links). */
export function preloadPage(path: string): void {
  void loaders[path]?.();
}

if (import.meta.env.DEV) {
  for (const item of [HOME, ...DOC_ITEMS]) {
    if (!loaders[item.path]) console.error(`[routes] NAV item "${item.path}" has no page loader in PAGES`);
  }
}
