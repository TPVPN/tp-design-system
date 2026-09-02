# 图标与国旗 / Iconography & Flags

> 站点路由：`/foundations/iconography` · 图标：Lucide（ISC，`lucide-react` / `lucide_icons` Flutter 包 / Lucide SF Symbols 替代）· 国旗：`packages/brand/vendor/circle-flags/*.svg`（MIT，62 面），站点路径 `public/brand/flags/<code>.svg`

## 1. Lucide 规范 / Lucide

| 属性 | 值 |
|---|---|
| 网格 | 24 × 24 |
| 描边 | **1.75**（16px 尺寸时 2） |
| 线帽 / 拐角 | 圆头、圆角（`stroke-linecap: round; stroke-linejoin: round`） |
| 填充 | 无（`fill: none`），除非组件明确要求实心 |
| 颜色 | 功能图标单色 `fg.secondary`（`#475569`）；选中 / 强调 `blue-600`（`#046BEF`）；禁用 `fg.placeholder` |
| 尺寸 | `size.icon.*`：16 / 20 / 24 / 32 / 48 |
| 对齐 | 与相邻文字基线垂直居中；图标与文字间距 `space.2`（8px），按钮内 `space.1.5`（6px） |

```tsx
import { ShieldCheck } from 'lucide-react';
<ShieldCheck size={24} strokeWidth={1.75} className="text-fg-secondary" aria-hidden />
```

```dart
Icon(LucideIcons.shieldCheck, size: 24, color: TpTokens.colorFgSecondary);
```

装饰性图标 `aria-hidden="true"`；独立可点击图标必须有 `aria-label`。

## 2. 场景图标映射 / Scene Icons

| 场景 | Lucide 名 | 色（Tag） | 说明 |
|---|---|---|---|
| 自动最优 `auto` | `shield-check` | blue | 默认线路 |
| 游戏 `game` | `gamepad-2` | mint | 低延迟线路 |
| AI `ai` | `sparkles` | purple | AI 服务专线 |
| 交易所 `exchange` | `arrow-left-right`（`Tag` 组件默认；备选 `candlestick-chart`） | amber | 交易所专线 |

## 3. 功能图标映射 / Functional Icons

| 用途 | Lucide 名 |
|---|---|
| 连接 / 电源 | `power` |
| 首页 Tab | `house` |
| 节点 Tab | `globe` |
| 我的 Tab | `user` |
| 搜索 | `search` |
| 清除 | `x` / `circle-x` |
| 进入 / chevron | `chevron-right` |
| 返回 | `chevron-left` |
| 设置 | `settings` |
| 延迟 | `activity` |
| 负载 | `gauge` |
| 信号 | 自绘 `SignalBars`（不用 Lucide） |
| 成功 | `check` / `circle-check` |
| 警告 | `triangle-alert` |
| 错误 | `circle-x` |
| 信息 | `info` |
| 复制 | `copy` |
| 外链 | `arrow-up-right` |
| 下载 | `download` |
| 兑换码 | `ticket` |
| 套餐 / 会员 | `crown` |
| 设备 | `smartphone` / `monitor` |
| 无日志 | `eye-off` |
| 固定 IP | `map-pin` |

## 4. 国旗 / Flags

| 属性 | 值 |
|---|---|
| 来源 | circle-flags（HatScripts，MIT），圆形 SVG |
| 尺寸 | 24（列表密集）/ 32（节点卡片）/ **40**（国家列表项） |
| 内描边 | 1px `rgb(15 23 42 / 0.08)`（`box-shadow: inset 0 0 0 1px …` 或叠加 `<circle>`） |
| 命名 | ISO 3166-1 alpha-2 小写：`us.svg`、`jp.svg`、`hk.svg`、`sg.svg` … |
| 无国旗场景 | 「自动」用 `globe` 图标置于 `bg.brand-subtle` 圆内 |

```tsx
<Flag code="us" size={40} />
// 渲染：<img src={`${base}brand/flags/us.svg`} width={40} height={40} alt="美国" />
```

圆旗必须带 `alt` 为国家名（按当前语言）；装饰重复时 `alt=""`。

## 5. 禁忌 / Don'ts

- 不混用其他图标库（Material、Font Awesome）；找不到的图标先用 Lucide 近似，再提设计需求。
- 不给图标加渐变、投影或双色。
- 不把国旗矩形化或加圆角矩形背景。
- 不用国旗代替语言切换（语言用文字）。
