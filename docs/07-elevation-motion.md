# 阴影与动效 / Elevation & Motion

> 站点路由：`/foundations/elevation` · `/foundations/motion` · token 源：`packages/tokens/src/semantic/elevation.json`、`src/semantic/motion.json` · 产物：CSS `--tp-elevation-*`、`--tp-duration-*`、`--tp-easing-*`；Tailwind `--shadow-*`、`--duration-*`、`--ease-*`；Dart `TpTokens.elevationLevel1`（`List<BoxShadow>`）、`TpTokens.durationBase`（`Duration`）、`TpTokens.easingStandard`（`Cubic`）

## 1. 阴影 / Elevation

环境光为蓝灰 `rgb(15 23 42)`（slate-900），**不用纯黑**。Light only，因此阴影是唯一的层级手段，配合 `slate-200` 描边使用。

| token | 值 | 用途 |
|---|---|---|
| `level-0` | `none` | 平面元素、列表项 |
| `level-1` | `0 1px 2px rgb(15 23 42 / 0.06), 0 1px 3px rgb(15 23 42 / 0.04)` | 静态卡片 |
| `level-2` | `0 4px 12px rgb(15 23 42 / 0.08), 0 1px 3px rgb(15 23 42 / 0.04)` | 节点卡片、下拉、hover 抬起 |
| `level-3` | `0 12px 32px rgb(15 23 42 / 0.12), 0 2px 6px rgb(15 23 42 / 0.06)` | 浮层 / Sheet / Popover |
| `level-4` | `0 24px 64px rgb(15 23 42 / 0.18), 0 4px 12px rgb(15 23 42 / 0.08)` | Modal |
| `brand-glow` | `0 12px 32px rgb(22 119 255 / 0.35)` | 主 CTA hover、连接中 |
| `brand-glow-lg` | `0 20px 60px rgb(22 119 255 / 0.45)` | **已连接按钮** |
| `success-glow` | `0 12px 32px rgb(34 197 94 / 0.30)` | 成功态强调 |
| `focus` | `0 0 0 3px rgb(22 119 255 / 0.32)` | 键盘聚焦环 |

规则：

- 一个屏幕最多两个层级同时出现（例如卡片 level-1 + 浮层 level-3）。
- hover 从 level-1 升到 level-2，用 `duration.base` + `easing.standard`。
- glow 只用于品牌主操作与连接状态，不用于装饰。
- 站点唯一允许的 `backdrop-filter: blur` 是 64px 顶部导航。

## 2. 动效时长 / Duration

| token | ms | 用途 |
|---|---|---|
| `instant` | 0 | 状态即时切换（reduced motion） |
| `fast` | 100 | 按压反馈、颜色变化 |
| `quick` | 150 | 淡入淡出、Tooltip |
| `base` | 200 | **默认**：hover、切换、站点交互 |
| `moderate` | 300 | Sheet / Dialog 进入、页面切换 |
| `slow` | 500 | 大面积布局变化 |
| `slower` | 800 | 骨架屏 → 内容、数据加载完成 |
| `connect` | 1200 | 连接按钮呼吸 / 旋转周期 |

## 3. 缓动 / Easing

| token | 曲线 | 用途 |
|---|---|---|
| `standard` | `cubic-bezier(0.2, 0, 0, 1)` | 默认；颜色、位移、hover |
| `emphasized` | `cubic-bezier(0.16, 1, 0.3, 1)` | 进入、大元素展开 |
| `decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | 进入（淡入上浮） |
| `accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | 退出（必须比进入更快） |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 连接成功、Switch、轻微过冲 |

## 4. 原则 / Principles

1. **进入用 `decelerate` / `emphasized`，退出用 `accelerate` 且更快**（退出时长 ≈ 进入 × 0.7）。
2. 动效服务于状态变化，不做装饰；同一时间只有一个主动效。
3. 位移距离小：页面切换淡入 + 上浮 12px；Sheet 从底部滑入；Dialog 缩放 0.96 → 1。
4. 列表 stagger 每项 30ms，最多 8 项后不再递增。
5. 连接按钮 `connecting` 态 = 外环旋转弧线（`duration.connect` 1.2s 线性无限）+ 内圈呼吸（1.2s，scale 0.9 → 1.04 → 0.9，opacity 0.35 → 0.85）；`connected` 态整体 scale 1 → 1.02 → 1 每 2.4s 一次。
6. `prefers-reduced-motion: reduce` 时：**所有动效退化为 150ms 淡入淡出**，取消位移、缩放、旋转与无限循环；连接中改为静态蓝色 + 文字「连接中…」。

## 5. 常用配方 / Recipes

| 场景 | 属性 | 时长 | 缓动 |
|---|---|---|---|
| 按钮 hover | background, box-shadow | base 200 | standard |
| 按钮按压 | transform scale 0.98 | fast 100 | standard |
| Tooltip | opacity, translateY 4px | quick 150 | decelerate / accelerate |
| Dropdown / Popover | opacity, scale 0.96 → 1 | base 200 | emphasized / accelerate |
| Sheet | translateY 100% → 0 | moderate 300 | emphasized / accelerate 200 |
| Dialog | opacity + scale 0.96 → 1 | moderate 300 | emphasized / accelerate 200 |
| Toast | translateY -8px + opacity | base 200 | decelerate / accelerate |
| 页面切换 | opacity 0 → 1, translateY 12px → 0 | moderate 300 | decelerate |
| 骨架屏 → 内容 | opacity 交叉淡入 | slower 800 | standard |
| Switch | translateX | base 200 | spring |
| 连接成功 | scale 1 → 1.04 → 1 + glow 出现 | moderate 300 | spring |

```css
.card { transition: box-shadow var(--tp-duration-base) var(--tp-easing-standard); }
.card:hover { box-shadow: var(--tp-elevation-level-2); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 150ms !important; animation: none !important; transform: none !important; }
}
```

```tsx
import { motion } from 'motion/react';
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }} />
```

```dart
AnimatedContainer(duration: TpTokens.durationBase, curve: TpTokens.easingStandard, …);
```
