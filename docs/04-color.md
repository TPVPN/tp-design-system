# 色彩 / Color

> 站点路由：`/brand/color`（品牌）· `/foundations/color`（token）· token 源：`packages/tokens/src/primitives/color.json`、`src/semantic/color.json` · 产物：`dist/css/tokens.css`（`--tp-color-*`）、`dist/tailwind/theme.css`（`--color-*`）

## 1. 品牌蓝 / TP Blue

**`#1677FF`**（blue-500）是唯一强调色。全部色阶由 OKLCH 等步生成并做过对比度核验；以下 hex 为定稿值，**不得**用工具重新生成或手动微调。

## 2. 色板 / Palettes

### 2.1 五条 11 阶色带

| 阶 | blue（品牌） | cyan | purple | mint（品牌绿） | pink |
|---|---|---|---|---|---|
| 50 | `#F2F7FF` | `#EDF9FF` | `#F5F6FF` | `#EEFBF2` | `#FEF4F4` |
| 100 | `#E3EEFF` | `#D9F1FD` | `#EAEBFF` | `#DAF5E4` | `#FEE6E7` |
| 200 | `#C6DCFF` | `#B4E3F9` | `#D5D7FF` | `#B6E9CA` | `#FECCCF` |
| 300 | `#9FC4FE` | `#81CEF0` | `#B9BBFF` | `#85D8A9` | `#FEA7AD` |
| 400 | `#6BA4FE` | `#5CD5FF` | `#9996FF` | `#4EE0A6` | `#FF6E81` |
| **500** | **`#1677FF`** | **`#00C6FF`** | **`#6C5CE7`** | **`#00D084`** | **`#FF4D6D`** |
| 600 | `#046BEF` | `#00A3D6` | `#5B4AD8` | `#00AD6E` | `#D21E4C` |
| 700 | `#0158C9` | `#0980A5` | `#5847C4` | `#008B56` | `#B4043C` |
| 800 | `#0246A3` | `#056A8A` | `#4638A0` | `#017347` | `#92022F` |
| 900 | `#013681` | `#04556F` | `#362C7D` | `#035C38` | `#730424` |
| 950 | `#032355` | `#034257` | `#221D50` | `#01482B` | `#4A0817` |

token 路径：`color.blue.500`、`color.cyan.500` … → CSS `--tp-color-blue-500` → Tailwind `bg-blue-500`。

### 2.2 中性色（Tailwind slate）

| 阶 | 值 | 典型用途 |
|---|---|---|
| 25 | `#FAFBFF` | 页面底色（带一点蓝，`neutral.25`） |
| 50 | `#F8FAFC` | 次级底、表头 |
| 100 | `#F1F5F9` | 弱化底、hover |
| 200 | `#E2E8F0` | 默认边框、分割线 |
| 300 | `#CBD5E1` | 强边框、输入框描边 |
| 400 | `#94A3B8` | 占位符、禁用、装饰（**不可作正文**） |
| 500 | `#64748B` | 弱化文字（AA 下限） |
| 600 | `#475569` | 次级文字 |
| 700 | `#334155` | 强调次级 |
| 800 | `#1E293B` | 深底 |
| 900 | `#0F172A` | 正文、标题 |
| 950 | `#020617` | 最深 |
| white | `#FFFFFF` | 卡片、按钮文字 |
| black | `#000000` | 单色 Logo |

### 2.3 状态色（Tailwind）

| 状态 | 面（500） | 文字（700） | 浅底（50） |
|---|---|---|---|
| success（green） | `#22C55E` | `#15803D` | `#F0FDF4` |
| warning（amber） | `#F59E0B` | `#B45309` | `#FFFBEB` |
| error（red） | `#EF4444` | `#B91C1C` | `#FEF2F2` |
| info（= 品牌蓝） | `#1677FF` | `#0158C9` | `#F2F7FF` |

### 2.4 渐变（135°，`connected` 为径向）

| token | 起 → 止 | 用途 |
|---|---|---|
| `gradient.primary` | `#1677FF → #4096FF` | 主按钮高光、OG 图 |
| `gradient.blue-light` | `#4DA3FF → #80D4FF` | 轻量装饰面 |
| `gradient.cyan-blue` | `#00C6FF → #36E0FF` | 数据 / 速度 |
| `gradient.blue-purple` | `#6C5CE7 → #A29BFE` | AI 场景 |
| `gradient.green-cyan` | `#00D084 → #00E6BB` | 游戏 / 成功 |
| `gradient.hero` | `#1677FF → #00C6FF` | 官网首屏 |
| `gradient.connected`（radial） | `#3D8BFF → #1677FF` | 已连接按钮 |

## 3. 语义 token / Semantic Tokens

业务代码**只允许**引用语义层与组件层，不得直接使用 primitives。

> 下表列出 BRIEF §2.3 / §3 规定的语义分组与定稿值；各 token 的最终路径以 `packages/tokens/dist/json/tokens.flat.json` 为准，站点表格直接从该文件生成。

### 3.1 背景 `color.bg.*`

| token | 值 | 引用 | 说明 |
|---|---|---|---|
| `bg.canvas` | `#FAFBFF` | `slate.25` | 页面底 |
| `bg.surface` | `#FFFFFF` | `white` | 卡片、Sheet、App bar |
| `bg.surface-raised` | `#FFFFFF` | `white` | 抬起面（配 level-2 及以上） |
| `bg.surface-sunken` | `#F1F5F9` | `slate.100` | 凹陷面：输入框填充、进度轨道、分段控件 |
| `bg.surface-hover` | `#F8FAFC` | `slate.50` | 中性面 hover |
| `bg.surface-pressed` | `#F1F5F9` | `slate.100` | 中性面按压 |
| `bg.brand` | `#1677FF` | `blue.500` | 品牌面（大字 / 图标） |
| `bg.brand-strong` | `#046BEF` | `blue.600` | 品牌强调面（白字 4.82:1） |
| `bg.brand-soft` | `#F2F7FF` | `blue.50` | 浅蓝底：次级按钮、选中行、信息横幅 |
| `bg.brand-soft-hover` | `#E3EEFF` | `blue.100` | 浅蓝底 hover |
| `bg.scrim` | `rgba(15, 23, 42, 0.50)` | `alpha.ink-50` | 遮罩 |
| `bg.glass` | `rgba(255, 255, 255, 0.80)` | `alpha.white-80` | 顶部导航毛玻璃（唯一允许的 blur） |
| `bg.inverse` | `#0F172A` | `slate.900` | Tooltip、Toast |

### 3.2 前景 `color.fg.*`

| token | 值 | 引用 | 白底对比度 |
|---|---|---|---|
| `fg.primary` | `#0F172A` | `slate.900` | 17.9:1 |
| `fg.secondary` | `#475569` | `slate.600` | 7.6:1 |
| `fg.muted` | `#64748B` | `slate.500` | 4.76:1（AA 下限；凹陷面 slate-100 上仅 4.34:1，不可用） |
| `fg.placeholder` / `fg.disabled` | `#94A3B8` | `slate.400` | 2.56:1（仅占位 / 禁用，不作文字） |
| `fg.brand` | `#046BEF` | `blue.600` | 4.82:1 |
| `fg.brand-strong` | `#0158C9` | `blue.700` | 6.48:1（浅蓝底上的文字 / 链接） |
| `fg.on-brand` / `fg.on-inverse` / `fg.inverse` | `#FFFFFF` | `white` | — |
| `fg.link` | `#046BEF` | `blue.600` | 4.82:1 |
| `fg.link-hover` | `#0158C9` | `blue.700` | 6.48:1 |

### 3.3 边框 `color.border.*`

| token | 值 | 引用 |
|---|---|---|
| `border.default` | `#E2E8F0` | `slate.200` |
| `border.strong` | `#CBD5E1` | `slate.300` |
| `border.subtle` | `#F1F5F9` | `slate.100` |
| `border.brand` | `#1677FF` | `blue.500` |
| `border.focus` | `#1677FF` | `blue.500` |
| `border.on-brand` | `rgba(255, 255, 255, 0.80)` | `alpha.white-80` |
| `border.flag-inset` | `rgba(15, 23, 42, 0.08)` | `alpha.ink-8` |

表单错误描边用 `status.error.solid`，错误态聚焦环用 `ring.error`；聚焦环颜色 `ring.focus` = `rgba(22, 119, 255, 0.32)`。

### 3.4 操作 `color.action.*`

| token | 值 | 引用 | 说明 |
|---|---|---|---|
| `action.primary.bg` | `#046BEF` | `blue.600` | **白字按钮填充**（4.82:1） |
| `action.primary.bg-hover` | `#0158C9` | `blue.700` | |
| `action.primary.bg-pressed` | `#0246A3` | `blue.800` | |
| `action.primary.fg` | `#FFFFFF` | `white` | |
| `action.secondary.bg` | `#F2F7FF` | `blue.50` | 浅蓝底 |
| `action.secondary.bg-hover` | `#E3EEFF` | `blue.100` | |
| `action.secondary.bg-pressed` | `#C6DCFF` | `blue.200` | |
| `action.secondary.fg` | `#0158C9` | `blue.700` | 蓝字（浅蓝底上 6.02:1） |
| `action.ghost.bg` / `bg-hover` / `bg-pressed` | `transparent` / `#F1F5F9` / `#E2E8F0` | — / `slate.100` / `slate.200` | |
| `action.ghost.fg` | `#046BEF` | `blue.600` | |
| `action.outline.bg` / `bg-hover` | `#FFFFFF` / `#F8FAFC` | `white` / `slate.50` | |
| `action.outline.border` / `border-hover` | `#E2E8F0` / `#CBD5E1` | `slate.200` / `slate.300` | |
| `action.outline.fg` | `#0F172A` | `slate.900` | |
| `action.destructive.bg` | `#DC2626` | `red.600` | 白字 4.83:1 |
| `action.destructive.bg-hover` | `#B91C1C` | `red.700` | |
| `action.destructive.fg` | `#FFFFFF` | `white` | |
| `action.destructive.soft-bg` / `soft-fg` | `#FEF2F2` / `#B91C1C` | `red.50` / `red.700` | 危险操作浅底 |
| `action.disabled.bg` / `fg` / `border` | `#F1F5F9` / `#94A3B8` / `#E2E8F0` | `slate.100` / `slate.400` / `slate.200` | |
| `action.selected.bg` / `fg` / `indicator` | `#F2F7FF` / `#0158C9` / `#1677FF` | `blue.50` / `blue.700` / `blue.500` | 选中行、左侧 3px 指示条 |

### 3.5 状态 `color.status.*`

| token | bg（50） | fg（700） | solid（500） | border（200） |
|---|---|---|---|---|
| `status.success` | `#F0FDF4` | `#15803D` | `#22C55E` | `#BBF7D0` |
| `status.warning` | `#FFFBEB` | `#B45309` | `#F59E0B` | `#FDE68A` |
| `status.error` | `#FEF2F2` | `#B91C1C` | `#EF4444` | `#FECACA` |
| `status.info` | `#F2F7FF` | `#0158C9` | `#1677FF` | `#C6DCFF` |

### 3.6 连接状态 `color.state.*`（全产品唯一来源）

| token | 值 | 引用 | 表现 | `-fg` / `-bg` |
|---|---|---|---|---|
| `state.connected` | `#22C55E` | `green.500` | 静态 | `#15803D` / `#F0FDF4` |
| `state.connecting` | `#1677FF` | `blue.500` | 呼吸 / 旋转动画 | `#0158C9` / `#F2F7FF` |
| `state.disconnected` | `#94A3B8` | `slate.400` | 静态 | `#475569` / `#F1F5F9` |
| `state.error` | `#EF4444` | `red.500` | 静态 | `#B91C1C` / `#FEF2F2` |

延迟着色 `color.latency.*`：good `#22C55E` / fair `#F59E0B` / poor `#EF4444`（文字取对应 700 阶 `-fg`），idle `#CBD5E1`。

### 3.7 场景 `color.scene.*`（线路场景 tag，浅底深字）

| 场景 | bg（50） | fg | solid（500） | 色带 |
|---|---|---|---|---|
| `scene.auto` | `#F2F7FF` | `#0158C9`（700） | `#1677FF` | blue |
| `scene.game` | `#EEFBF2` | `#017347`（**800**，5.56:1；mint-700 仅 4.08:1，见 [11-accessibility.md](11-accessibility.md) §1.2） | `#00D084` | mint |
| `scene.ai` | `#F5F6FF` | `#5847C4`（700） | `#6C5CE7` | purple |
| `scene.exchange` | `#FFFBEB` | `#B45309`（700） | `#F59E0B` | amber |

### 3.8 数据可视化序列

`blue-500 → cyan-500 → purple-500 → mint-500 → amber-500 → pink-500`（`#1677FF`、`#00C6FF`、`#6C5CE7`、`#00D084`、`#F59E0B`、`#FF4D6D`）。

## 4. 对比度规则 / Contrast Rules

| 用途 | 颜色 | 白底对比度 | 结论 |
|---|---|---|---|
| 正文 | slate-900 | 17.9:1 | AAA |
| 次级 | slate-600 | 7.6:1 | AAA |
| 弱化 | slate-500 | 4.76:1 | AA（下限） |
| 占位 / 禁用 / 装饰 | slate-400 | 2.56:1 | **不可作正文** |
| 白字按钮填充 | **blue-600 `#046BEF`** | 4.82:1 | AA |
| 白字于 `#1677FF` | blue-500 | 4.10:1 | **仅大字**（≥ 24px 或 ≥ 18.66px 粗体）、图标、描边、聚焦环、装饰面 |
| 链接 | blue-600 | 4.82:1 | AA |

完整矩阵见 [11-accessibility.md](11-accessibility.md)。

## 5. 用色比例 / 70 · 20 · 10

| 比例 | 内容 | 颜色 |
|---|---|---|
| 70% | 底与留白 | `#FAFBFF`、白、slate-50/100 |
| 20% | 文字、边框、图标 | slate-900/600/500、slate-200/300 |
| 10% | 强调与状态 | blue-600/500、状态色、场景色 |

一个屏幕里蓝色面积超过 10% 就该问自己：哪些可以退回中性色？

## 6. 禁忌 / Don'ts

| 禁止 | 改为 |
|---|---|
| 白字放在 `#1677FF` 小字按钮上 | 填充改 `blue-600 #046BEF` |
| 用 cyan / purple / mint / pink 作第二主色 | 只用于场景标签、图表、渐变 |
| 直接引用 `color.blue.500` 写业务样式 | 引用 `color.action.*` / `color.bg.brand` 等语义 token |
| slate-400 作正文或说明文字 | slate-500 及以上 |
| 纯黑阴影 `rgb(0 0 0 / α)` | 蓝灰环境光 `rgb(15 23 42 / α)` |
| 连接状态用非 `state.*` 的颜色 | 四态唯一来源 |
| 彩虹 / 多色渐变、玻璃拟态 | 单色或 BRIEF 列出的 7 条渐变 |
| 自行生成新色阶 | 只用本文定稿值 |
