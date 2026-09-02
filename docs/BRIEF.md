# TP VPN Design System — 设计与工程总纲（BRIEF）

> 本文件是整个 `tp-design-system` 的**唯一事实来源**（single source of truth）。所有 token、资产、组件、文档站页面都必须与本文一致；发现冲突以本文为准，并回写本文。
> 语言约定：文档站 UI 以简体中文为主、英文为副标题（例：「色彩系统 / Color System」）；代码、token 名、文件名全部英文 kebab-case。

## 0. 目标与验收标准

- **目标**：为 TP VPN（WireGuard 商业 VPN，产品线：iOS / Android Flutter App、官网 tp-web Next.js、后台 tp-admin、未来桌面端、营销物料、应用商店素材）提供**一套跨平台的品牌 + 设计 token + 组件 + 资产下载**体系，并以一个部署在 Vercel（自定义域名 brand.tpvpn.com）的 React 文档站作为验收物。
- **视觉标准**：Light Mode Only。极简、克制、高级：大量留白、清晰的字阶层级、单一品牌蓝作为唯一强调色、微妙的蓝调阴影与渐变，参考 Vercel Geist / Linear / Stripe / Apple HIG 文档站的质感。禁止花哨的玻璃拟态、彩虹渐变、卡通插画。
- **开源基座**（已下载进仓库，均带 LICENSE）：
  - Tailwind CSS v3 色板（MIT）→ `packages/tokens/vendor/tailwind-colors.json`：中性色 slate、状态色 green/amber/red 直接取用。
  - shadcn/ui（MIT，new-york 风格，Radix 基座）→ `packages/ui/src/components/ui/*`：26 个基础组件由 CLI 拉取，用 TP token 换肤。
  - Lucide 图标（ISC）、circle-flags 圆形国旗（MIT）→ `packages/brand/vendor/circle-flags/*.svg`（62 面）。
  - Inter 字体（SIL OFL）→ `packages/brand/fonts/Inter-*.ttf`（用于字标描边与资产包）；站点用 `@fontsource-variable/inter`。
  - Style Dictionary v4（Apache-2.0）负责 token 编译；token 源为 W3C DTCG 格式。

## 1. 目录架构（pnpm workspace）

```
tp-design-system/
├── docs/                      # 规范文档（Markdown，站点也会引用其中的表格数据）
│   └── BRIEF.md               # 本文
├── packages/
│   ├── tokens/                # @tpvpn/tokens  DTCG 源 + Style Dictionary 编译
│   │   ├── src/{primitives,semantic,component}/*.json
│   │   ├── vendor/tailwind-colors.json
│   │   ├── build.mjs
│   │   └── dist/{css,tailwind,json,dart,swift,kotlin,android,figma}/   ← 提交到 git
│   ├── brand/                 # @tpvpn/brand  Logo 源文件 + 生成脚本 + 下载包
│   │   ├── src/logo/*.svg     # 手工/脚本生成的 SVG 源（字标已描边为 path）
│   │   ├── fonts/             # Inter TTF (OFL)
│   │   ├── vendor/circle-flags/
│   │   ├── scripts/build-assets.mjs
│   │   └── dist/{logo,app-icon,social,packs}/   ← 提交到 git（PNG/ZIP）
│   └── ui/                    # @tpvpn/ui  React 组件库（shadcn 基座 + VPN 专属组件）
│       └── src/{components/ui,components/tp,lib,styles.css,theme.css,index.ts}
├── apps/
│   └── site/                  # @tpvpn/site  文档 & Demo 站（Vite 7 + React 19 + Tailwind 4 + React Router 7 + Motion）
│       ├── scripts/sync-assets.mjs   # 构建前把 brand/dist、tokens/dist 复制进 public/
│       └── src/{app,pages,components,content,lib}
├── .github/workflows/ci.yml
├── vercel.json
├── README.md · CHANGELOG.md · LICENSE (MIT, 代码) · LICENSE-BRAND.md (品牌资产：保留所有权利)
```

## 2. 品牌核心

### 2.1 Logo
- 源自 Figma 官方标识（tp-web `public/brand/logo-mark.svg`）：**66×66 圆角方块，`rx=15.84`（= 边长 24%），填充 `#1677FF`，白色 TP 合体字形 42.24×35.64，偏移 (11.85, 17.08)**。字形 path 数据必须原样复制，不得重绘。
- 字标（wordmark）「TP VPN」：Inter Bold 700，字号 = 图形高度 × 0.56，字间距 -0.02em，**必须描边为 path**（用 `text-to-svg` + `fonts/Inter-Bold.ttf` 生成），颜色 `#0F172A`。图形与字标间距 = 图形高度 × 0.18，基线与图形垂直居中。
- 变体（文件名前缀 `tp-vpn-logo-`）：
  1. `horizontal`（图形 + 字标，深字标，白/浅底用）
  2. `horizontal-reversed`（图形白底白字形 + 白字标，用于 `#1677FF`/深底；此时方块填白、字形填 `#1677FF`）
  3. `stacked`（图形居上、字标居下居中）
  4. `mark`（仅图形，蓝底白字形）
  5. `mark-mono-black` / `mark-mono-white`（单色：方块填色、字形镂空反色）
  6. `wordmark`（仅字标）
- 最小安全空间：四周 ≥ 图形高度 × 0.5（X = 1/2 Logo 高）。最小尺寸：图形 ≥ 24px（屏幕）/ 8mm（印刷）；横版 ≥ 96px 宽。
- 禁用示例（站点要画出来）：拉伸变形、改色（绿/红等）、改布局（字标放上方/左侧）、加投影、旋转、放在复杂图片背景上、加描边、用低对比底色。

### 2.2 App Icon
- 基于 mark，**图标本体即圆角方块**（iOS 系统自动裁切时不要再叠一层圆角）。导出：
  - iOS：1024（无 alpha，直角方形供系统裁切）、180、167、152、120、87、80、76、60、58、40、29、20（`app-icon/ios/`）。
  - Android：adaptive `foreground`（字形居中 108dp 画布内 66dp 安全区）+ `background`（纯 `#1677FF`）+ legacy 512、192、144、96、72、48（`app-icon/android/`）。
  - Web/PWA：favicon.ico（16/32/48）、favicon-32、favicon-16、apple-touch-icon 180、icon-192、icon-512、maskable-512（字形缩至 66% 安全区）、`icon.svg`。
  - 通用：1024 / 512 / 256 / 128 / 64 / 32 PNG。
- 社交：`social/og-default.png` 1200×630（左 Logo 横版 + 右侧纯 `#1677FF` → `#4096FF` 渐变块）、`social/avatar-1024.png`（mark 居中于白底圆内）、`social/twitter-header-1500x500.png`。

### 2.3 色彩
**品牌蓝 TP Blue = `#1677FF`**。以下 hex 为定稿值（OKLCH 等步生成，已做对比度核验）：

| 阶 | blue（品牌） | cyan | purple | mint（品牌绿） | pink |
|---|---|---|---|---|---|
| 50 | #F2F7FF | #EDF9FF | #F5F6FF | #EEFBF2 | #FEF4F4 |
| 100 | #E3EEFF | #D9F1FD | #EAEBFF | #DAF5E4 | #FEE6E7 |
| 200 | #C6DCFF | #B4E3F9 | #D5D7FF | #B6E9CA | #FECCCF |
| 300 | #9FC4FE | #81CEF0 | #B9BBFF | #85D8A9 | #FEA7AD |
| 400 | #6BA4FE | #5CD5FF | #9996FF | #4EE0A6 | #FF6E81 |
| 500 | **#1677FF** | **#00C6FF** | **#6C5CE7** | **#00D084** | **#FF4D6D** |
| 600 | #046BEF | #00A3D6 | #5B4AD8 | #00AD6E | #D21E4C |
| 700 | #0158C9 | #0980A5 | #5847C4 | #008B56 | #B4043C |
| 800 | #0246A3 | #056A8A | #4638A0 | #017347 | #92022F |
| 900 | #013681 | #04556F | #362C7D | #035C38 | #730424 |
| 950 | #032355 | #034257 | #221D50 | #01482B | #4A0817 |

- 中性色 = Tailwind slate：50 #F8FAFC · 100 #F1F5F9 · 200 #E2E8F0 · 300 #CBD5E1 · 400 #94A3B8 · 500 #64748B · 600 #475569 · 700 #334155 · 800 #1E293B · 900 #0F172A · 950 #020617；另加 `neutral.25 = #FAFBFF`（页面底色，带一点蓝）。白 #FFFFFF，黑 #000000。
- 状态色 = Tailwind：success green（500 #22C55E，文字用 700 #15803D），warning amber（500 #F59E0B，文字 700 #B45309），error red（500 #EF4444，文字 700 #B91C1C），info = 品牌蓝（500，文字 700）。
- **对比度规则**：白底正文用 slate-900（17.9:1）、次级 slate-600（7.6:1）、弱化 slate-500（4.76:1，AA 下限）；slate-400 只能用于占位符/禁用/装饰。**白字按钮填充必须用 blue-600 `#046BEF`（4.82:1）**，`#1677FF` 白字仅 4.10:1，只允许用于大字（≥24px 或 ≥18.66px 粗体）、图标、描边、聚焦环、装饰面。链接文字用 blue-600。
- 渐变（135°）：`primary` #1677FF→#4096FF；`blue-light` #4DA3FF→#80D4FF；`cyan-blue` #00C6FF→#36E0FF；`blue-purple` #6C5CE7→#A29BFE；`green-cyan` #00D084→#00E6BB；`hero` #1677FF→#00C6FF；`connected` (radial) #3D8BFF→#1677FF。
- 场景色（线路场景 tag）：auto=blue、game=mint、ai=purple、exchange=amber。浅底深字组合的文字一律取 700 阶，**唯 game 取 mint-800 `#017347`**（mint-700 在 mint-50 上仅 4.08:1）。凹陷面（slate-100）上的次要文字必须用 fg.secondary（slate-500 在 slate-100 上 4.34:1 不达标）；brand-soft 浅蓝底上的文字/链接用 blue-700（blue-600 在 blue-50 上 4.48:1）。数据可视化序列：blue-500, cyan-500, purple-500, mint-500, amber-500, pink-500。
- 连接状态（全产品唯一来源）：connected=green-500、connecting=blue-500（动画）、disconnected=slate-400、error=red-500。

### 2.4 字体
- 主字体 **Inter**（变量字体，OFL）；Apple 平台原生可用 SF Pro 作为等价替代（度量相近）；中文 PingFang SC / HK → Noto Sans CJK；印地语 Noto Sans Devanagari。数字一律 `font-variant-numeric: tabular-nums`。
- 等宽：ui-monospace / SF Mono / Menlo / Consolas（IP、密钥、兑换码）。
- 字阶（px 字号/行高，字重，字距）：

| Token | 尺寸 | 字重 | 字距 | 用途 |
|---|---|---|---|---|
| display-2xl | 72/76 | 800 | -0.025em | 官网首屏 |
| display-xl | 64/68 | 800 | -0.02em | 官网首屏 |
| display-lg | 48/52 | 700 | -0.02em | 官网区块标题 |
| display-md | 40/44 | 700 | -0.02em | 官网次级 |
| display-sm | 32/40 | 700 | -0.01em | App 显示标题（「已连接」） |
| title-lg | 24/32 | 600 | -0.01em | 页面标题 |
| title-md | 20/28 | 600 | -0.005em | 模块标题 |
| title-sm | 18/26 | 600 | 0 | 卡片大标题 |
| headline | 16/24 | 600 | 0 | 卡片标题 / 列表主文字 |
| body-lg | 17/26 | 400 | 0 | 官网长文 |
| body-md | 16/24 | 400 | 0 | 官网默认正文 |
| body | 14/22 | 400 | 0 | App 正文（默认） |
| body-sm | 13/18 | 400 | 0 | 密集信息 |
| label-lg | 16/24 | 500 | 0 | 大按钮文字 |
| label-md | 14/20 | 500 | 0 | 按钮/表单标签 |
| label-sm | 12/16 | 500 | 0 | 小标签/Tab |
| caption | 12/18 | 400 | 0 | 辅助说明 |
| overline | 11/16 | 600 | +0.06em 大写 | 分组小标 |
| numeric-lg | 32/40 | 700 tabular | 0 | 网速/计时 |
| numeric-md | 24/32 | 700 tabular | 0 | 数据展示 |
| numeric-sm | 18/24 | 600 tabular | 0 | 列表数据 |
| mono | 13/20 | 400 | 0 | 代码/IP |

- CJK：正文行高上调至 1.6，字距 0，禁止假粗体；标题最多使用 600。

### 2.5 间距 / 圆角 / 尺寸 / 布局
- 4pt 网格。spacing：0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128（token 名 `space.0 / 0.5 / 1 / 1.5 / 2 / 3 / 4 / 5 / 6 / 8 / 10 / 12 / 16 / 20 / 24 / 32`，与 Tailwind 单位一致）。
- radius：none 0 · xs 6 · sm 8 · md 12（控件） · lg 16（卡片） · xl 20 · 2xl 24（弹层/Sheet） · 3xl 32（Hero 面板） · full 9999。Logo 圆角比 0.24。
- 控件高度：xs 28 · sm 36 · md 44（触控最小） · lg 52 · xl 60。图标：xs 16 · sm 20 · md 24 · lg 32 · xl 48。连接按钮：直径 128（手机）/ 160（平板/桌面）。头像 24/32/40/56/96。Tab bar 高 56 + 安全区。App bar 56。
- 边框：hairline 1 · thin 1.5 · thick 2。聚焦环：`0 0 0 3px rgb(22 119 255 / 0.32)`。
- 断点：xs 360 · sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536。容器：narrow 720 · content 1200 · wide 1360。栅格：手机 4 列/16 gutter/16 边距；平板 8 列/24/24；桌面 12 列/24/32。
- z-index：base 0 · raised 10 · sticky 100 · overlay 1000 · modal 1100 · popover 1200 · toast 1300 · tooltip 1400。

### 2.6 阴影（elevation，蓝灰环境光 rgb(15 23 42)）
- level-0：none
- level-1：`0 1px 2px rgb(15 23 42 / 0.06), 0 1px 3px rgb(15 23 42 / 0.04)`（静态卡片）
- level-2：`0 4px 12px rgb(15 23 42 / 0.08), 0 1px 3px rgb(15 23 42 / 0.04)`（节点卡片、下拉）
- level-3：`0 12px 32px rgb(15 23 42 / 0.12), 0 2px 6px rgb(15 23 42 / 0.06)`（浮层/Sheet）
- level-4：`0 24px 64px rgb(15 23 42 / 0.18), 0 4px 12px rgb(15 23 42 / 0.08)`（Modal）
- brand-glow：`0 12px 32px rgb(22 119 255 / 0.35)`；brand-glow-lg：`0 20px 60px rgb(22 119 255 / 0.45)`（已连接按钮）
- success-glow：`0 12px 32px rgb(34 197 94 / 0.30)`；focus：见上。

### 2.7 动效
- duration：instant 0 · fast 100 · quick 150 · base 200 · moderate 300 · slow 500 · slower 800 · connect 1200。
- easing：standard `cubic-bezier(0.2, 0, 0, 1)` · emphasized `cubic-bezier(0.16, 1, 0.3, 1)` · decelerate `cubic-bezier(0, 0, 0.2, 1)` · accelerate `cubic-bezier(0.4, 0, 1, 1)` · spring `cubic-bezier(0.34, 1.56, 0.64, 1)`。
- 原则：进入用 decelerate/emphasized，退出用 accelerate 且更快；连接按钮 connecting 态 = 外环 1.2s 呼吸 + 旋转弧线；`prefers-reduced-motion` 时全部退化为 150ms 淡入淡出。

### 2.8 图标与国旗
- Lucide，24px 网格，描边 1.75（16px 时 2），圆头圆角。功能图标单色（fg-secondary），选中/强调用 blue-600。品牌场景图标（自动最优 = shield-check、游戏 = gamepad-2、AI = sparkles、交易所 = candlestick-chart / arrow-left-right）。
- 国旗：circle-flags 圆形 SVG，尺寸 24 / 32 / 40，外加 1px `rgb(15 23 42 / 0.08)` 内描边。

### 2.9 语调与多语言
- 五语言：zh-CN（源）、en、zh-HK、es、hi。语调：直接、可信、克制；一标题一句话；不夸大（不得宣称 Kill Switch / 分流 / 广告拦截 / 桌面端）。真实能力：WireGuard、智能选路、场景专线 auto/game/ai/exchange、多设备 2/4/8/50、IEPL 优选、固定出口 IP（企业）、无日志。
- UI 文案示例（站点「语调」页展示）：连接按钮「连接 / Connect」「连接中… / Connecting…」「已连接 / Connected」；错误「连接失败，请重试 / Couldn't connect. Try again.」。

## 3. Token 工程契约

- 源：`packages/tokens/src/**/*.json`，W3C DTCG（`$value` / `$type` / `$description`），引用用 `{path.to.token}`。三层：`primitives`（色板/尺寸/字体原始值，业务禁止直接用）→ `semantic`（bg/fg/border/action/status/state/scene/typography/elevation/motion/layout）→ `component`（button、connection-button、node-card、tag、tab-bar、switch、input、search-bar）。
- 编译 `node build.mjs` 输出（全部提交）：
  - `dist/css/tokens.css`：`:root { --tp-<path-kebab>: value }`，全部 token，颜色 hex，尺寸 px，composite typography 拆成 `-font-size/-line-height/-font-weight/-letter-spacing`；shadow 直接拼字符串。
  - `dist/tailwind/theme.css`：Tailwind v4 `@theme { ... }`：`--color-<semantic>`（如 `--color-bg-canvas`、`--color-fg-primary`、`--color-action-primary-bg`）、`--color-blue-500` 等原始色、`--text-<role>` + `--text-<role>--line-height/--font-weight/--letter-spacing`、`--radius-*`、`--shadow-*`、`--ease-*`、`--font-sans/--font-mono`、`--breakpoint-*`、`--container-*`、`--spacing: 0.25rem`。
  - `dist/json/tokens.json`（树，已解析引用）与 `dist/json/tokens.flat.json`（`{ "color.bg.canvas": {value,type,description,original} }`）。
  - `dist/dart/tp_tokens.dart`（`abstract final class TpTokens`：`Color`、`double`、`FontWeight`、`TextStyle` 常量）。
  - `dist/swift/TPTokens.swift`（`enum TPTokens` + `UIColor`/`CGFloat`）。
  - `dist/kotlin/TpTokens.kt`（Compose `object TpTokens { val ... = Color(0xFF...) }`）与 `dist/android/colors.xml + dimens.xml`。
  - `dist/figma/tokens.json`（Tokens Studio 格式，可导入 Figma Variables）。
- 命名：全部小写 kebab；路径 `color.bg.canvas` → CSS `--tp-color-bg-canvas` → Tailwind `--color-bg-canvas` → Dart `colorBgCanvas` → Swift `colorBgCanvas`。

## 4. UI 组件契约（`packages/ui`）

- `src/theme.css`：`@import '@tpvpn/tokens/tailwind'`（即 theme.css）+ shadcn 变量映射（`--background: var(--color-bg-canvas)`、`--foreground`、`--card`、`--popover`、`--primary: var(--color-action-primary-bg)`、`--primary-foreground`、`--secondary`、`--muted`、`--accent`、`--destructive`、`--border`、`--input`、`--ring: var(--color-blue-500)`、`--radius: 0.75rem`）+ `@theme inline` 把 shadcn 变量暴露成 `bg-primary` 等类；`@import 'tw-animate-css'`。**只做 light**，删除所有 `.dark` 相关。
- `src/styles.css`：`@import 'tailwindcss'; @import './theme.css'; @source '../src';` + base 层（`body { background: var(--color-bg-canvas); color: var(--color-fg-primary); font-feature-settings: 'cv11','ss01'; }` 等）。
- shadcn 基础组件保持 API，只改类名以套 TP 尺寸（按钮高度 sm 36 / md 44 / lg 52，圆角 md 12，primary 用 `bg-action-primary-bg hover:bg-action-primary-bg-hover`，secondary = 浅蓝底蓝字，ghost 透明）。
- VPN 专属组件（`src/components/tp/`，全部有 TS props、`data-slot`、a11y）：
  - `ConnectionButton`：`state: 'disconnected' | 'connecting' | 'connected'`，直径 128/160，内含 Power 图标；connected 用 `connected` 渐变 + brand-glow；connecting 外环旋转；可选 `elapsed` 计时文字。
  - `Tag`：`tone: 'auto' | 'game' | 'ai' | 'exchange' | 'success' | 'warning' | 'error' | 'neutral' | 'brand'`，`size sm/md`，可带图标；浅底深字（50 底 + 700 字）。
  - `NodeCard`：国旗/地球图标、`title`（US · Los Angeles #102）、`badge`（优质节点）、`latencyMs`、`loadPct`、信号条（4 格，按延迟着色）、chevron。
  - `CountryListItem`：圆形国旗 40、名称、tag、`latencyMs / lossPct / loadPct` 三段元数据、chevron；`selected` 态左侧 3px 蓝条。
  - `SearchBar`：搜索图标、占位「搜索国家、城市或节点」、清除按钮。
  - `TabBar`：3 项（首页/节点/我的），选中蓝色 + label，安全区 padding。
  - `Switch`（复用 shadcn，尺寸 51×31 iOS 比例，on 用 blue-500）。
  - `LoadingState`：`variant: 'skeleton' | 'spinner' | 'success'`。
  - `Flag`：`code` → 从 `@tpvpn/brand` 圆旗 SVG（站点通过 `public/brand/flags/<code>.svg` 访问，组件接受 `src` 前缀 prop 或使用 `import.meta.env.BASE_URL`）。
  - `SignalBars`、`StatusDot`（四态）、`UsageMeter`（流量进度）、`PlanCard`（套餐）。
- `src/index.ts` 导出全部组件与 `cn`。

## 5. 文档站信息架构（`apps/site`）

顶部：Logo + 站名「TP VPN Design System」+ 顶导（品牌 / 基础 / 组件 / 模式 / 平台 / 下载）+ ⌘K 搜索 + GitHub 链接。左侧 sticky 侧栏分组；右侧页内目录（TOC）。首页无侧栏。

| 路由 | 页面 | 内容要点 |
|---|---|---|
| `/` | 概览 | Hero（大字标题 + 一句话 + 两个按钮「开始使用」「下载资产」）、设计原则 4 条（可信 Trustworthy · 清晰 Clear · 轻快 Light · 一致 Consistent）、四大板块入口卡、平台覆盖（Web/Flutter/iOS/Android/Figma）、版本与更新 |
| `/brand/logo` | Logo | 主 Logo、反白、堆叠、仅图形、单色；构成（网格图：圆角 24%、字形位置）；安全空间图；最小尺寸；禁用示例 8 条（用真实 SVG 变形演示）；每个变体 SVG/PNG 下载按钮 |
| `/brand/app-icon` | App Icon | 1024/512/256/128/64/32 展示、iOS/Android/Web 规格表、maskable 安全区图、下载 |
| `/brand/color` | 品牌色彩 | 主色大色块（含 OKLCH 值）、5 条 11 阶色带（点击复制 hex）、中性色、状态色、渐变板、使用比例（70/20/10）、配色禁忌 |
| `/brand/typography` | 字体 | Inter 展示（大字 Aa + 字重行）、多语言样张（zh/en/zh-HK/es/hi 各一句）、数字 tabular 演示、字阶表 |
| `/brand/voice` | 语调与文案 | 原则、可宣称/不可宣称能力表、五语言 UI 文案对照 |
| `/foundations/color` | 色彩 token | 语义 token 表（bg/fg/border/action/status/state/scene）每行：色块、名称、值、引用、说明、对比度；三层架构图 |
| `/foundations/typography` | 字阶 token | 每个角色实时渲染 + token 名 + CSS/Dart 片段 |
| `/foundations/spacing` | 间距 · 圆角 · 布局 | 间距标尺、圆角示例、栅格断点可视化、控件尺寸 |
| `/foundations/elevation` | 阴影层级 | 5 级卡片 + glow |
| `/foundations/motion` | 动效 | duration/easing 曲线可视化（可点击播放）、连接动画演示、reduced motion |
| `/foundations/iconography` | 图标与国旗 | Lucide 用法、尺寸描边规范、场景图标映射、62 面圆旗网格（搜索） |
| `/foundations/accessibility` | 无障碍 | 对比度矩阵（前景 × 背景 自动计算 AA/AAA）、触控尺寸、焦点、动效 |
| `/components` | 组件总览 | 卡片网格 |
| `/components/<name>` | 单组件 | 实时预览（可切换 props）+ 代码（tsx）+ Props 表 + 用法 Do/Don't + 对应 Flutter/iOS 提示。组件：button, connection-button, tag, node-card, country-list-item, search-bar, tab-bar, switch, input, card, loading, dialog, sheet, tooltip, toast, usage-meter, plan-card, status-dot |
| `/patterns/connection` | 连接流程 | 三态时序、错误处理、计时、文案 |
| `/patterns/nodes` | 节点列表 | 搜索+分组+延迟着色规则（<80 绿 / 80–180 黄 / >180 红）+ 空态 |
| `/patterns/states` | 空态/错误/加载 | 骨架屏→内容 演示 |
| `/patterns/subscription` | 套餐与付费 | PlanCard 排布、价格排版、兑换码输入 |
| `/platforms` | 平台接入 | Web(CSS/Tailwind)、Flutter(Dart)、iOS(Swift)、Android(Kotlin/XML)、Figma(Tokens Studio) 代码块与文件下载 |
| `/downloads` | 下载中心 | 品牌全包 ZIP、Logo 包、App Icon 包、社交图、Token 全格式、字体（Inter OFL）、国旗包；每项显示大小与包含清单 |
| `/changelog` | 更新日志 | 1.0.0 |

站点视觉：白底 `#FAFBFF` 页面、白卡片 `level-1` 阴影 + `slate-200` 描边、`radius-lg`；标题 Inter 700 -0.02em；顶部 64px 半透明白毛玻璃导航（唯一允许的 blur）；Hero 背景为非常淡的蓝 → 青径向渐变 + 细网格；所有交互 200ms `standard`；页面切换淡入上浮 12px。响应式：≥1280 三栏（侧栏 260 / 内容 / TOC 220），768–1279 两栏，<768 单栏 + 抽屉侧栏。Light only：`color-scheme: light`，不做暗色。

## 6. 质量门槛（验收）

1. `pnpm build`（tokens → brand → site）零错误；`tsc --noEmit` 零错误；无 console error。
2. 所有文字对比度 ≥ 4.5:1（大字 ≥ 3:1）；键盘可达；`aria-*` 完整；所有图片有 alt。
3. 每个下载按钮指向真实存在的文件（`public/downloads/*.zip`、`public/brand/**`、`public/tokens/**`），构建后 `dist/` 中可验证。
4. Lighthouse（桌面）Performance ≥ 90、A11y = 100、Best Practices ≥ 95。
5. 站点在 360px 宽下无横向滚动。
6. `BASE_PATH` 环境变量决定 Vite `base`（默认 `/`，站点部署在 Vercel 自定义根域名 brand.tpvpn.com，不需要设置）；SPA 回退由 `vercel.json` 的 `rewrites` 提供（`404.html` = `index.html` 拷贝仍保留，供 GitHub Pages 等静态托管场景使用）；所有资源链接使用 `import.meta.env.BASE_URL` 前缀。
