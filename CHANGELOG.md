# 更新日志 / Changelog

本文件记录 TP VPN Design System 的所有重要变更。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。整个仓库共用同一版本号；**token 是公开 API**，删除或重命名 token 即为破坏性变更。

All notable changes to this project are documented here. The format is based on Keep a Changelog and the project adheres to Semantic Versioning. One version number covers the whole monorepo; tokens are the public API.

## [Unreleased]

### Added — Mobile & Social · 2026-09-04

- iOS / Android 组件参考、SwiftUI / Compose 源码与移动端交互实验室；覆盖连接、取消、重试、节点选择、搜索、设置与减少动态效果。
- 4 套 Light Mode Image Gen 主视觉、可编辑 SVG、四种比例的重排预览及中英文标题。
- AI 设计标准 JSON、完整生成提示词和使用说明；Logo 与主色不变。
- 独立 Sitemap，与站点导航共用同一份索引；下载中心连接新增素材。

### Changed — Visual refresh · 2026-09-04

- 保留 TP Blue #1677FF 与全部官方 Logo 资产；网站导航和首页品牌展示直接复用官方横版 SVG。
- 首页采用更轻的展示层级与简明文案，新增基于真实路由生成的 System Map；文档标题不再重复同名英文。
- 中文标题统一 600 字重、零字距、1.3 行高，正文 1.6；辅助信息 caption 提升到 13/20，输入提示改用可读的 slate-500。
- 平板使用单栏 + 导航抽屉，1024px 起显示侧栏，1280px 起显示右侧目录；预览和网格依据文章宽度响应，窄屏提供折叠目录。
- 节点与国家行支持元数据换行；可点击 NodeCard 使用原生按钮；连接演示不再缩小交互目标。搜索清除、导航和弹层关闭采用 44px 触控区域。
- 减少静态卡片和主按钮的装饰阴影，统一清晰的键盘焦点；减少动态偏好下移除 CSS 位移动效。Token 多端产物同步更新。

### Added — `@tpvpn/site`

- 38 个文档路由全部落地（此前为 `ComingSoon` 占位）：品牌 5 页（Logo、App Icon、色彩、字体、语调与文案）、基础 7 页（色彩 Token、字阶 Token、间距 · 圆角 · 布局、阴影层级、动效、图标与国旗、无障碍）、组件总览 + 18 个组件页、模式 4 页（连接流程、节点列表、空态 · 错误 · 加载、套餐与付费）、平台接入、下载中心、更新日志（渲染仓库根目录 `CHANGELOG.md`）。
- 页面级积木：`pages/brand/_parts`（LogoLockup、LogoMisuse、brandData）、`pages/foundations/_parts`（ContrastMatrix、EasingCurves、DurationTable、ConnectionDemo、GridOverlayDemo、FlagGrid、PlatformSnippets …）、`pages/components/_parts`（Anatomy / AnatomyPins、Controls / PropToggles、PlatformHint / PlatformMapping、各组件代码片段）、`pages/patterns/_parts`（PhoneStage、HomeScreen、ConnectionSequence、NodePicker、SubscriptionParts）。
- 全站内联 `code` 采用 `overflow-wrap: anywhere`，Preview 工具栏的 ToggleGroup 允许换行，Prose 内表格包在 `overflow-x-auto` 容器中——360 px 下 39 个路由零横向滚动。

### Added — `@tpvpn/ui`

- `Toast`（Radix Toast）：`Toaster`、`useToast()`、命令式 `toast({ title, description, tone, duration, action })` 及 `toast.success / info / warning / error / dismiss`，最多堆叠 3 条，默认 4000 ms，`error` 用 `role="alert"`；已从 `index.ts` 导出。

### Changed — `docs/`

- `03-app-icon.md`、`04-color.md`、`05-typography.md`、`06-layout.md`、`07-elevation-motion.md`、`08-iconography.md`、`09-components.md`、`11-accessibility.md`、`13-platform-integration.md` 中与真实产物 / 组件 API 不符的文件名、token 名与 props 已按 `dist/` 与 `packages/ui/src` 修正。

### Fixed — `@tpvpn/site`

- `/brand/app-icon` 下载卡片引用了不存在的 `tp-vpn-icon-48.png`（通用图标只有 1024 / 512 / 256 / 128 / 64 / 32）。
- `/foundations/color` 三层架构图在桌面宽度下溢出文章列（网格项缺少 `min-w-0`）。
- `/platforms` 命名映射表的代码单元格逐字符折行，改为不换行并在容器内横向滚动。
- 组件页「Flutter / iOS 对应」说明的 `<dd>` 长 token 名溢出 Callout。

## [1.0.0] - 2026-09-02

首个正式版本。以 `docs/BRIEF.md` 为唯一事实来源建立品牌、token、组件与文档站。

### Added — `docs/`

- `BRIEF.md` 设计与工程总纲（目标、品牌核心、token 契约、组件契约、站点信息架构、质量门槛）。
- 14 份书面规范：品牌原则、Logo、App Icon、色彩、字体、布局、阴影与动效、图标与国旗、组件、模式、无障碍、语调与多语言、平台接入、治理。

### Added — `@tpvpn/tokens`

- W3C DTCG 三层 token 源：`primitives`（blue / cyan / purple / mint / pink 五条 11 阶色带、slate 中性色、状态色、尺寸、字体）→ `semantic`（bg / fg / border / action / status / state / scene / typography / elevation / motion / layout）→ `component`（button、connection-button、node-card、tag、tab-bar、switch、input、search-bar）。
- Style Dictionary v4 构建脚本 `build.mjs`，输出并提交：`css/tokens.css`、`tailwind/theme.css`（Tailwind v4 `@theme`）、`json/tokens.json` 与 `tokens.flat.json`、`dart/tp_tokens.dart`、`swift/TPTokens.swift`、`kotlin/TpTokens.kt`、`android/colors.xml` + `dimens.xml`、`figma/tokens.json`（Tokens Studio）。
- 22 个字阶角色（display-2xl … mono），含 tabular 数字角色 numeric-lg / md / sm。
- 5 级阴影（level-0 … level-4）与 brand-glow / brand-glow-lg / success-glow / focus。
- 8 档动效时长与 5 条缓动曲线。
- `vendor/tailwind-colors.json`（Tailwind CSS v3 色板，MIT）。

### Added — `@tpvpn/brand`

- Logo 源 SVG（Figma 官方标识，66×66 圆角方块 `rx=15.84`，`#1677FF`）7 个变体：`horizontal`、`horizontal-reversed`、`stacked`、`mark`、`mark-mono-black`、`mark-mono-white`、`wordmark`；字标由 Inter Bold 700 经 `text-to-svg` 描边为 path。
- 资产生成脚本 `scripts/build-assets.mjs`（sharp + archiver）：Logo PNG 多尺寸、iOS App Icon 13 档、Android adaptive foreground / background + legacy 6 档、Web/PWA favicon 与 maskable、通用 1024 … 32、社交图（OG 1200×630、头像 1024、Twitter 头图 1500×500）。
- 下载包：品牌全包、Logo 包、App Icon 包、社交图包、Token 全格式包、字体包（Inter OFL）、国旗包。
- `fonts/Inter-*.ttf`（SIL OFL 1.1）、`vendor/circle-flags/`（62 面圆形国旗，MIT）。

### Added — `@tpvpn/ui`

- `theme.css`：引入 `@tpvpn/tokens/tailwind`，映射 shadcn 变量（`--primary: var(--color-action-primary-bg)`、`--ring: var(--color-blue-500)`、`--radius: 0.75rem` 等），仅 light。
- `styles.css`：Tailwind 4 入口 + base 层（`#FAFBFF` 底、slate-900 文字、`cv11` / `ss01` 字体特性）。
- 26 个 shadcn/ui（new-york，Radix）基础组件，按 TP 尺寸（按钮 36 / 44 / 52、圆角 12）换肤。
- VPN 专属组件：`ConnectionButton`、`Tag`、`NodeCard`、`CountryListItem`、`SearchBar`、`TabBar`、`Switch`、`LoadingState`、`Flag`、`SignalBars`、`StatusDot`、`UsageMeter`、`PlanCard`；全部带 TypeScript props、`data-slot` 与 a11y 属性。
- `index.ts` 导出全部组件与 `cn`。

### Added — `@tpvpn/site`

- Vite 7 + React 19 + Tailwind 4 + React Router 7 + Motion 文档站，路由覆盖概览、品牌（Logo / App Icon / 色彩 / 字体 / 语调）、基础（色彩 / 字阶 / 间距 / 阴影 / 动效 / 图标 / 无障碍）、组件（18 个）、模式（连接 / 节点 / 状态 / 套餐）、平台接入、下载中心、更新日志。
- ⌘K 搜索、侧栏 + 页内目录三栏布局、360px 无横向滚动、`color-scheme: light`。
- `scripts/sync-assets.mjs` 在构建前把 `brand/dist` 与 `tokens/dist` 复制进 `public/`；`404.html` SPA 回退；`BASE_PATH` 决定 Vite `base`。

### Added — 仓库

- `.github/workflows/ci.yml`（构建 + 类型检查 + 产物过期校验）。
- `vercel.json`：部署到 Vercel、自定义域名 `brand.tpvpn.com`（推送到 `main` 自动生产部署，PR 自动预览部署，SPA 回退走 `rewrites`）。
- Issue 模板（设计需求、缺陷）与 PR 模板。
- `LICENSE`（MIT，代码）、`LICENSE-BRAND.md`（品牌资产）、`CONTRIBUTING.md`、`.editorconfig`、`.prettierrc`。

[Unreleased]: https://github.com/TPVPN/tp-design-system/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/TPVPN/tp-design-system/releases/tag/v1.0.0
