# 布局 / Layout

> 站点路由：`/foundations/spacing` · token 源：`packages/tokens/src/primitives/dimension.json`、`src/semantic/layout.json` · 产物：CSS `--tp-space-*`、`--tp-radius-*`、`--tp-size-*`；Tailwind `--spacing: 0.25rem`、`--radius-*`、`--breakpoint-*`、`--container-*`

## 1. 间距 / Spacing

4pt 网格。token 名与 Tailwind 单位一致（`space.4` = 16px = Tailwind `p-4`）。

| token | px | 典型用途 |
|---|---|---|
| `space.0` | 0 | |
| `space.0-5`（Tailwind `p-0.5`） | 2 | 图标与文字微调 |
| `space.1` | 4 | 数字与单位、紧密行内 |
| `space.1-5`（Tailwind `p-1.5`） | 6 | Tag 内边距（横，sm） |
| `space.2` | 8 | 行内元素间距、Tag 内边距（横，md） |
| `space.3` | 12 | 列表项内部、节点卡片内元素间距、按钮 sm 横向 |
| `space.4` | 16 | **App 页面边距**、卡片内边距、输入框横向内边距 |
| `space.5` | 20 | 按钮 md 横向 |
| `space.6` | 24 | 卡片间距、平板边距、按钮 lg 横向 |
| `space.8` | 32 | 区块间距、桌面边距 |
| `space.10` | 40 | |
| `space.12` | 48 | 官网区块内间距 |
| `space.16` | 64 | 官网区块间距 |
| `space.20` | 80 | |
| `space.24` | 96 | 官网大区块 |
| `space.32` | 128 | 官网首屏上下 |

## 2. 圆角 / Radius

| token | px | 用途 |
|---|---|---|
| `radius.none` | 0 | |
| `radius.xs` | 6 | Tag、小徽标 |
| `radius.sm` | 8 | 输入框内元素、小卡 |
| `radius.md` | 12 | **控件**（按钮、输入框、搜索栏） |
| `radius.lg` | 16 | **卡片** |
| `radius.xl` | 20 | 大卡片 |
| `radius.2xl` | 24 | 弹层 / Sheet |
| `radius.3xl` | 32 | Hero 面板 |
| `radius.full` | 9999 | 圆形（连接按钮、头像、Switch） |

Logo 圆角比 0.24（与 token 无关，见 [02-logo.md](02-logo.md)）。

## 3. 尺寸 / Sizes

### 3.1 控件高度 `size.control.*`

| token | px | 用途 |
|---|---|---|
| `xs` | 28 | 行内小按钮、Tag 大号 |
| `sm` | 36 | 次级按钮、紧凑表单 |
| `md` | 44 | **默认，触控最小** |
| `lg` | 52 | 主 CTA |
| `xl` | 60 | 官网首屏 CTA |

### 3.2 图标 `size.icon.*`

| token | px |
|---|---|
| `xs` | 16 |
| `sm` | 20 |
| `md` | 24 |
| `lg` | 32 |
| `xl` | 48 |

### 3.3 其他

| 元素 | 值 |
|---|---|
| 连接按钮直径 | 128（手机）/ 160（平板 / 桌面） |
| 头像 | 24 / 32 / 40 / 56 / 96 |
| Tab bar 高度 | 56 + 底部安全区 |
| App bar 高度 | 56 |
| 站点顶部导航 | 64 |
| 圆形国旗 | 24 / 32 / 40 |

### 3.4 边框与聚焦环

| token | 值 |
|---|---|
| `border-width.hairline` | 1 |
| `border-width.thin` | 1.5 |
| `border-width.thick` | 2 |
| `border-width.focus` | 3 |
| `elevation.focus`（颜色 `color.ring.focus`） | `0 0 0 3px rgb(22 119 255 / 0.32)` |

## 4. 断点与容器 / Breakpoints & Containers

| token | px | 说明 |
|---|---|---|
| `breakpoint.xs` | 360 | 最小支持宽度，**无横向滚动** |
| `breakpoint.sm` | 640 | |
| `breakpoint.md` | 768 | 平板 |
| `breakpoint.lg` | 1024 | 桌面 |
| `breakpoint.xl` | 1280 | 站点三栏起点 |
| `breakpoint.2xl` | 1536 | |

| 容器 | px | 用途 |
|---|---|---|
| `container.narrow` | 720 | 长文、表单 |
| `container.content` | 1200 | 默认内容宽 |
| `container.wide` | 1360 | 站点三栏 / 宽表 |

## 5. 栅格 / Grid

| 设备 | 列 | gutter | 边距 |
|---|---|---|---|
| 手机（< 768） | 4 | 16 | 16 |
| 平板（768–1023） | 8 | 24 | 24 |
| 桌面（≥ 1024） | 12 | 24 | 32 |

站点布局：≥ 1280 三栏（侧栏 260 / 内容 / TOC 220）；768–1279 两栏；< 768 单栏 + 抽屉侧栏。

## 6. z-index

| token | 值 | 用途 |
|---|---|---|
| `z-index.base` | 0 | |
| `z-index.raised` | 10 | 卡片 hover、浮动按钮 |
| `z-index.sticky` | 100 | 顶部导航、Tab bar |
| `z-index.overlay` | 1000 | 遮罩 |
| `z-index.modal` | 1100 | Dialog / Sheet |
| `z-index.popover` | 1200 | 下拉、菜单 |
| `z-index.toast` | 1300 | Toast |
| `z-index.tooltip` | 1400 | Tooltip |

## 7. App 页面模板 / App Page Template

```
┌──────────────────────────────┐
│ App bar 56                   │
├──────────────────────────────┤
│ 边距 16                      │
│  ┌────────────────────────┐  │
│  │ 卡片 radius.lg 16      │  │  卡片内边距 16，卡片间距 24
│  └────────────────────────┘  │
│                              │
├──────────────────────────────┤
│ Tab bar 56 + 安全区           │
└──────────────────────────────┘
```
