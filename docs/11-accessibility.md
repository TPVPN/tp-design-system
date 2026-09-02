# 无障碍 / Accessibility

> 站点路由：`/foundations/accessibility` · 目标：WCAG 2.2 AA（文字对比度 ≥ 4.5:1，大字 ≥ 3:1）；Lighthouse A11y = 100

## 1. 对比度矩阵 / Contrast Matrix

对比度按 WCAG 相对亮度计算（白底 `#FFFFFF`；`#FAFBFF` 与白差异 < 0.05，结论相同）。

### 1.1 文字 × 浅底

| 前景 | 值 | 白 | `#FAFBFF` | slate-50 | slate-100 | blue-50 | 结论 |
|---|---|---|---|---|---|---|---|
| slate-900 | `#0F172A` | 17.85 | 17.26 | 17.06 | 16.30 | 16.60 | AAA |
| slate-700 | `#334155` | 10.35 | 10.01 | 9.90 | 9.45 | 9.63 | AAA |
| slate-600 | `#475569` | 7.58 | 7.33 | 7.24 | 6.92 | 7.04 | AAA |
| slate-500 | `#64748B` | 4.76 | 4.60 | 4.55 | 4.34 | 4.42 | AA 仅白 / `#FAFBFF` / slate-50；**slate-100 与 blue-50 上不达标** |
| slate-400 | `#94A3B8` | 2.56 | 2.48 | 2.45 | 2.34 | 2.38 | 不达标，仅占位 / 禁用 / 装饰 |
| blue-600 | `#046BEF` | 4.82 | 4.66 | 4.61 | 4.40 | 4.48 | AA 白 / `#FAFBFF` / slate-50；slate-100 与 blue-50 上仅大字 |
| blue-500 | `#1677FF` | 4.10 | 3.97 | 3.92 | 3.75 | 3.82 | 仅大字 / 图标 |
| blue-700 | `#0158C9` | 6.48 | 6.27 | 6.19 | 5.92 | 6.02 | AA（Tag `auto` 文字） |

### 1.2 状态与场景文字 × 对应 50 浅底

| 前景（700） | 值 | 白 | 对应 50 底 | 对比度 | 结论 |
|---|---|---|---|---|---|
| green-700 | `#15803D` | 5.02 | green-50 `#F0FDF4` | 4.79 | AA |
| amber-700 | `#B45309` | 5.02 | amber-50 `#FFFBEB` | 4.84 | AA |
| red-700 | `#B91C1C` | 6.47 | red-50 `#FEF2F2` | 5.91 | AA |
| blue-700 | `#0158C9` | 6.48 | blue-50 `#F2F7FF` | 6.02 | AA |
| purple-700 | `#5847C4` | 6.75 | purple-50 `#F5F6FF` | 6.27 | AA |
| mint-700 | `#008B56` | 4.35 | mint-50 `#EEFBF2` | 4.08 | **未达 AA**（见下） |
| mint-800 | `#017347` | 5.92 | mint-50 `#EEFBF2` | 5.56 | AA |

> **说明**：BRIEF §2.3 规定场景 Tag 为「50 底 + 700 字」，**唯 `game` 取 mint-800 `#017347`**（5.56:1）：mint-700 在白底 4.35:1、mint-50 底 4.08:1，均低于 4.5:1，而 `game` Tag 文字（`label-sm` 12px 500）不属于大字。token `color.scene.game.fg` 已按 mint-800 编译，站点 `/foundations/accessibility` 的矩阵按 token 实时计算。

### 1.3 白字 × 有色底

| 底 | 值 | 对比度 | 结论 |
|---|---|---|---|
| blue-600 | `#046BEF` | 4.82 | AA，**默认按钮底** |
| blue-500 | `#1677FF` | 4.10 | 仅大字（≥ 24px 或 ≥ 18.66px 粗体）、图标 |
| blue-700 | `#0158C9` | 6.48 | AA |
| slate-900 | `#0F172A` | 17.85 | AAA（Tooltip / Toast 深色） |
| red-500 | `#EF4444` | 3.76 | 仅大字；destructive 按钮白字需 ≥ 18.66px 粗体，否则用 red-700 `#B91C1C`（6.47） |
| red-700 | `#B91C1C` | 6.47 | AA |
| green-500 | `#22C55E` | 2.28 | **不可放白字**（仅图标 / 状态点） |
| amber-500 | `#F59E0B` | 2.15 | **不可放白字** |

> 数值按 WCAG 2.x 相对亮度公式计算，保留两位；站点 `/foundations/accessibility` 页按 token 实时计算并标注 AA / AAA。

## 2. 触控与尺寸 / Touch Targets

| 项 | 值 |
|---|---|
| 最小触控目标 | **44 × 44**（`size.control.md`） |
| 触控目标间距 | ≥ 8 |
| 图标按钮 | 视觉 24 图标，命中区 44 |
| 列表行 | 高 ≥ 64（含 40 国旗） |
| 连接按钮 | 128 / 160 |

## 3. 焦点 / Focus

- 所有可交互元素 `:focus-visible` 显示聚焦环 `0 0 0 3px rgb(22 119 255 / 0.32)`；不移除 outline 而不替代。
- Tab 顺序与视觉顺序一致；Dialog / Sheet 焦点陷阱，关闭后焦点回到触发元素。
- 跳转链接「跳到主要内容」置于站点首个可聚焦位置。
- 自定义组件键盘：Button Space / Enter；Switch Space；Tab 列表 ← →；Listbox ↑ ↓ Home End；Dialog Esc。

## 4. 语义与 ARIA / Semantics

| 组件 | 角色 / 属性 |
|---|---|
| ConnectionButton | `role="switch"` `aria-checked` `aria-busy`（connecting）`aria-label` |
| StatusDot | `role="img"` `aria-label`；或可见文字 |
| UsageMeter | `role="progressbar"` `aria-valuenow / valuemin / valuemax` |
| TabBar | `<nav aria-label>` + `aria-current="page"` |
| CountryListItem | `role="option"` `aria-selected` |
| Toast | `role="status"` / `role="alert"` + `aria-live` |
| Loading spinner | `role="status"` `aria-live="polite"` + 可见或 sr-only 文字 |
| 装饰图标 / 重复国旗 | `aria-hidden="true"` / `alt=""` |
| 所有图片 | 有 `alt`（Logo `alt="TP VPN"`） |

颜色不作唯一信息载体：延迟着色同时显示数值；连接状态同时显示文字。

## 5. 动效 / Motion

- 尊重 `prefers-reduced-motion: reduce`：全部退化为 150ms 淡入淡出；取消位移、缩放、旋转、无限循环、shimmer。
- 无自动播放的闪烁；任何闪烁频率 < 3 Hz。
- 站点动效曲线演示需手动点击播放。

## 6. 语言标记 / Language

- `<html lang>` 使用 BCP 47：`zh-CN`、`en`、`zh-HK`（或 `zh-Hant-HK`）、`es`、`hi`。
- 页面内混排片段用 `lang` 属性标注（例如中文页面中的英文代码块 `lang="en"`）。
- 印地语页面确保字体加载（Noto Sans Devanagari）并禁用 `text-transform: uppercase`。
- 文案不依赖大小写、字体样式传递含义。
- Flutter：`Localizations` + `Semantics(label:)`；iOS：`accessibilityLabel` 用当前语言。

## 7. 验收清单 / Checklist

- [ ] 所有文字对比度 ≥ 4.5:1（大字 ≥ 3:1）
- [ ] 键盘可完成全部流程（连接、选节点、兑换）
- [ ] 每个可交互元素有可见聚焦态
- [ ] `aria-*` / `alt` 完整
- [ ] 触控目标 ≥ 44
- [ ] reduced motion 下无动画
- [ ] `lang` 正确；五语言文案不截断
- [ ] Lighthouse A11y = 100
