<p align="center">
  <img src="packages/brand/src/logo/tp-vpn-logo-horizontal.svg" alt="TP VPN" width="220" />
</p>

<h1 align="center">TP VPN Design System</h1>

<p align="center">一套跨平台的品牌、设计 token、组件与资产体系 —— 一处定义，Web / Flutter / iOS / Android / Figma 同步使用。</p>

<p align="center">
  <a href="https://brand.tpvpn.com/"><img alt="Docs" src="https://img.shields.io/badge/docs-brand.tpvpn.com-1677FF" /></a>
  <a href="CHANGELOG.md"><img alt="Version" src="https://img.shields.io/badge/version-1.0.0-0F172A" /></a>
  <a href="LICENSE"><img alt="Licence: MIT (code)" src="https://img.shields.io/badge/code-MIT-22C55E" /></a>
  <a href="LICENSE-BRAND.md"><img alt="Brand assets: all rights reserved" src="https://img.shields.io/badge/brand%20assets-all%20rights%20reserved-64748B" /></a>
  <img alt="pnpm 11" src="https://img.shields.io/badge/pnpm-11-F69220" />
  <img alt="Node 24" src="https://img.shields.io/badge/node-24-339933" />
  <img alt="Light mode only" src="https://img.shields.io/badge/theme-light%20only-FAFBFF?labelColor=1677FF" />
</p>

---

## 简介

TP VPN Design System 是 TP VPN（基于 WireGuard 的商业 VPN）全部产品线的**唯一视觉与交互事实来源**：iOS / Android Flutter App、官网 `tp-web`、后台 `tp-admin`、未来的桌面端、营销物料与应用商店素材都从这里取值。

设计标准：**Light Mode Only**。极简、克制、高级 —— 大量留白、清晰的字阶层级、单一品牌蓝 `#1677FF` 作为唯一强调色、微妙的蓝调阴影与渐变。所有数值、命名与契约以 [`docs/BRIEF.md`](docs/BRIEF.md) 为准。

文档站：**https://brand.tpvpn.com/**（Vercel 托管，见「部署」）。

## 仓库内容

| 包 | 名称 | 内容 |
|---|---|---|
| `packages/tokens` | `@tpvpn/tokens` | W3C DTCG 格式的 token 源（primitives → semantic → component），Style Dictionary v4 编译为 CSS、Tailwind v4 `@theme`、JSON、Dart、Swift、Kotlin、Android XML、Figma Tokens Studio |
| `packages/brand` | `@tpvpn/brand` | Logo SVG 源（字标已描边为 path）、Inter 字体（OFL）、62 面 circle-flags 圆形国旗、生成脚本；产出 Logo / App Icon / 社交图 PNG 与 ZIP 下载包 |
| `packages/ui` | `@tpvpn/ui` | React 19 组件库：shadcn/ui（new-york，Radix 基座）按 TP token 换肤 + VPN 专属组件（ConnectionButton、NodeCard、CountryListItem、Tag、TabBar、UsageMeter、PlanCard 等） |
| `apps/site` | `@tpvpn/site` | 文档与 Demo 站（Vite 7 + React 19 + Tailwind 4 + React Router 7 + Motion），部署到 Vercel |
| `docs/` | — | 书面规范（Markdown），与站点内容一一对应，见 [`docs/README.md`](docs/README.md) |

## 目录结构

```
tp-design-system/
├── docs/                      # 规范文档（Markdown，站点也会引用其中的表格数据）
│   └── BRIEF.md               # 设计与工程总纲（唯一事实来源）
├── packages/
│   ├── tokens/                # @tpvpn/tokens  DTCG 源 + Style Dictionary 编译
│   │   ├── src/{primitives,semantic,component}/*.json
│   │   ├── vendor/tailwind-colors.json
│   │   ├── build.mjs
│   │   └── dist/{css,tailwind,json,dart,swift,kotlin,android,figma}/   ← 提交到 git
│   ├── brand/                 # @tpvpn/brand  Logo 源文件 + 生成脚本 + 下载包
│   │   ├── src/logo/*.svg
│   │   ├── fonts/             # Inter TTF (OFL)
│   │   ├── vendor/circle-flags/
│   │   ├── scripts/build-assets.mjs
│   │   └── dist/{logo,app-icon,social,packs}/   ← 提交到 git（PNG/ZIP）
│   └── ui/                    # @tpvpn/ui  React 组件库（shadcn 基座 + VPN 专属组件）
│       └── src/{components/ui,components/tp,lib,styles.css,theme.css,index.ts}
├── apps/
│   └── site/                  # @tpvpn/site  文档 & Demo 站
│       ├── scripts/sync-assets.mjs   # 构建前把 brand/dist、tokens/dist 复制进 public/
│       └── src/{app,pages,components,content,lib}
├── .github/workflows/         # ci.yml（Vercel 通过自己的 GitHub App 部署，不需要 Action）
├── vercel.json                 # Vercel 构建 / 输出 / SPA 回退配置
├── README.md · CHANGELOG.md · CONTRIBUTING.md
└── LICENSE (MIT, 代码) · LICENSE-BRAND.md (品牌资产：保留所有权利)
```

## 快速开始

要求：Node ≥ 20.9（CI 使用 24）、pnpm 11。

```bash
pnpm install          # 安装全部 workspace 依赖
pnpm build            # tokens → brand → site，依次构建
pnpm dev              # 启动文档站  → http://localhost:5180
```

其他常用命令：

| 命令 | 作用 |
|---|---|
| `pnpm build:tokens` | 编译 token，写入 `packages/tokens/dist/**` |
| `pnpm build:brand` | 生成 Logo / App Icon / 社交图与 ZIP，写入 `packages/brand/dist/**` |
| `pnpm build:site` | 同步资产到 `apps/site/public/` 并构建站点到 `apps/site/dist/` |
| `pnpm typecheck` | 所有包 `tsc --noEmit` |
| `pnpm preview` | 预览构建产物 → http://localhost:5181 |

> `packages/tokens/dist` 与 `packages/brand/dist` 是**提交到 git 的产物**。改动 token 源或 Logo 源后必须重新构建并一并提交，CI 会校验产物是否过期。

## 在各平台使用 token

编译产物一览（`packages/tokens/dist/`）：

| 平台 | 文件 | 说明 |
|---|---|---|
| Web（CSS） | `css/tokens.css` | `:root { --tp-color-bg-canvas: #FAFBFF; … }`，全部 token |
| Web（Tailwind v4） | `tailwind/theme.css` | `@theme { --color-bg-canvas … --text-body … --radius-lg … }` |
| 通用 JSON | `json/tokens.json` · `json/tokens.flat.json` | 树形（已解析引用）与扁平两种 |
| Flutter | `dart/tp_tokens.dart` | `abstract final class TpTokens { static const Color colorBgCanvas = …; }` |
| iOS / Swift | `swift/TPTokens.swift` | `enum TPTokens { static let colorBgCanvas: UIColor … }` |
| Android / Compose | `kotlin/TpTokens.kt` | `object TpTokens { val colorBgCanvas = Color(0xFFFAFBFF) }` |
| Android / XML | `android/colors.xml` · `android/dimens.xml` | 资源文件 |
| Figma | `figma/tokens.json` | Tokens Studio 格式，可导入 Figma Variables |

命名规则：路径 `color.bg.canvas` → CSS `--tp-color-bg-canvas` → Tailwind `--color-bg-canvas` → Dart / Swift / Kotlin `colorBgCanvas`。

### Web · CSS 变量

```css
@import '@tpvpn/tokens/css';

.card {
  background: var(--tp-color-bg-surface);
  border-radius: var(--tp-radius-lg);
  box-shadow: var(--tp-elevation-level-1);
}
```

### Web · Tailwind v4

```css
@import 'tailwindcss';
@import '@tpvpn/tokens/tailwind';
```

```tsx
<button className="h-11 rounded-md bg-action-primary-bg px-5 text-label-md text-white hover:bg-action-primary-bg-hover">
  连接
</button>
```

### React 组件（`@tpvpn/ui`）

```tsx
import '@tpvpn/ui/styles.css';
import { ConnectionButton, NodeCard, Tag } from '@tpvpn/ui';
```

### Flutter

把 `dist/dart/tp_tokens.dart` 复制到 `lib/core/theme/`：

```dart
import 'package:tp_app/core/theme/tp_tokens.dart';

Container(
  decoration: BoxDecoration(
    color: TpTokens.colorBgSurface,
    borderRadius: BorderRadius.circular(TpTokens.radiusLg),
  ),
  child: Text('已连接', style: TpTokens.typographyDisplaySm),
);
```

### iOS / Swift

把 `dist/swift/TPTokens.swift` 加入 target：

```swift
view.backgroundColor = TPTokens.colorBgCanvas
button.layer.cornerRadius = TPTokens.radiusMd
```

### Android · Kotlin / Compose

```kotlin
Surface(color = TpTokens.colorBgSurface, shape = RoundedCornerShape(TpTokens.radiusLg.dp)) { … }
```

### Android · XML

把 `dist/android/values/colors.xml`、`dist/android/values/dimens.xml` 放入 `res/values/`：

```xml
<TextView android:textColor="@color/tp_color_fg_primary" android:padding="@dimen/tp_space_4" />
```

### Figma · Tokens Studio

在 Figma 安装 **Tokens Studio** 插件 → Settings → Import → 选择 `dist/figma/tokens.json` → Export to Figma Variables。详细步骤见 [`docs/13-platform-integration.md`](docs/13-platform-integration.md)。

## 下载品牌资产

- 源与产物在仓库中：`packages/brand/src/logo/*.svg`（矢量源）、`packages/brand/dist/logo/`（PNG）、`packages/brand/dist/app-icon/{ios,android,web,universal}/`、`packages/brand/dist/social/`、`packages/brand/dist/packs/*.zip`（品牌全包、Logo 包、App Icon 包、Token 包、国旗包）。
- 文档站「下载中心」：<https://brand.tpvpn.com/downloads>，每项显示大小与包含清单。
- 使用规范见 [`docs/02-logo.md`](docs/02-logo.md)，许可见 [`LICENSE-BRAND.md`](LICENSE-BRAND.md)。

## 部署

文档站部署在 **Vercel**，自定义域名 **brand.tpvpn.com**。仓库根目录的 [`vercel.json`](vercel.json) 已配置好构建：

```json
{
  "buildCommand": "corepack enable && corepack prepare pnpm@11.9.0 --activate && pnpm build:tokens && pnpm build:brand && pnpm --filter @tpvpn/site build",
  "installCommand": "corepack enable && corepack prepare pnpm@11.9.0 --activate && pnpm install --frozen-lockfile",
  "outputDirectory": "apps/site/dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

首次接入（在 Vercel 网页控制台操作，一次性）：

1. **New Project → Import Git Repository**，选择 `TPVPN/tp-design-system`。Vercel 会自动读取 `vercel.json`；**Root Directory 留空**（不是 monorepo 子目录部署，整个仓库就是这个项目）。`Framework Preset` 选 **Other**（`vercel.json` 里 `"framework": null` 已声明，不依赖预设）。
2. 直接 **Deploy** 一次，确认构建通过（约 1–2 分钟：装依赖 → token → brand → site）。
3. **Project → Settings → Domains**，添加 `brand.tpvpn.com`。Vercel 会给出一条 CNAME 记录（通常是 `cname.vercel-dns.com`）；在 `tpvpn.com` 的 DNS 服务商处为 `brand` 子域名添加这条 CNAME，等待解析生效（Vercel 面板会自动检测并签发证书）。
4. 之后每次 push 到 `main` 都会自动触发生产部署；其它分支 / PR 会得到各自的预览 URL。**不需要 GitHub Actions** 做部署——那是 GitHub Pages 的模式，Vercel 用自己的 GitHub App 监听仓库。

因为是自定义根域名（不是 `/some-path/` 子路径），`vite.config.ts` 的 `base` 保持默认值 `'/'` 即可，**不需要设置 `BASE_PATH` 环境变量**；`apps/site/scripts/postbuild.mjs` 生成的 `dist/404.html` 在 Vercel 上是多余的（已用 `rewrites` 做 SPA 回退），留着无害。

[`ci.yml`](.github/workflows/ci.yml) 在 PR 与 push 时构建 token / brand / site、类型检查，并校验提交的 `dist/` 产物与源一致——这是代码质量闸门，独立于 Vercel 的部署流程。

## 版本策略

- 遵循 [语义化版本](https://semver.org/lang/zh-CN/)，整个仓库使用同一版本号（当前 **1.0.0**）。
- **token 即 API**：删除或重命名任一 semantic / component token → major；新增 token 或新增输出格式 → minor；仅调整数值且不影响契约（例如微调阴影透明度）→ patch。
- 品牌资产（Logo 构成、色值）变更视为 major，需设计负责人评审。
- 详见 [`docs/14-governance.md`](docs/14-governance.md) 与 [`CHANGELOG.md`](CHANGELOG.md)。

## 开源基座与致谢

| 项目 | 许可 | 用途 |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com) | MIT | 中性色 slate、状态色 green/amber/red 色板；站点样式引擎（v4） |
| [shadcn/ui](https://ui.shadcn.com) | MIT | 26 个基础组件（new-york 风格），按 TP token 换肤 |
| [Radix UI](https://www.radix-ui.com) | MIT | 无障碍交互基座 |
| [Lucide](https://lucide.dev) | ISC | 图标 |
| [Inter](https://rsms.me/inter/) | SIL OFL 1.1 | 主字体，字标描边 |
| [circle-flags](https://github.com/HatScripts/circle-flags) | MIT | 62 面圆形国旗 |
| [Style Dictionary](https://styledictionary.com) | Apache-2.0 | token 编译 |

各基座的 LICENSE 文件随源码一同保存在 `packages/*/vendor/` 与 `packages/brand/fonts/` 目录。

## 许可

- 代码：[MIT](LICENSE) © 2026 TP VPN。
- 品牌资产（Logo、字标、App Icon、社交图）：[保留所有权利](LICENSE-BRAND.md)。

---

## English

**TP VPN Design System** is the single source of truth for brand, design tokens, UI components and downloadable assets across every TP VPN surface — the Flutter app (iOS / Android), the Next.js marketing site, the admin console, future desktop clients and marketing collateral. Light mode only; one brand blue (`#1677FF`); restrained, premium, minimal. All values are defined in [`docs/BRIEF.md`](docs/BRIEF.md).

**Packages**

- `@tpvpn/tokens` — W3C DTCG token sources compiled with Style Dictionary v4 into CSS variables, a Tailwind v4 `@theme`, JSON, Dart, Swift, Kotlin/Compose, Android XML and a Figma Tokens Studio file.
- `@tpvpn/brand` — logo sources (wordmark outlined to paths), Inter (OFL), circle-flags (MIT) and the generator that produces logo PNGs, app icons, social images and ZIP packs.
- `@tpvpn/ui` — React 19 component kit: shadcn/ui (Radix) primitives themed with TP tokens plus VPN-specific components.
- `@tpvpn/site` — the documentation and demo site (Vite 7 + React 19 + Tailwind 4), deployed on Vercel at <https://brand.tpvpn.com/> (see `vercel.json` and the deployment section above).

**Quick start**

```bash
pnpm install
pnpm build      # tokens → brand → site
pnpm dev        # http://localhost:5180
```

**Consuming tokens** — import `@tpvpn/tokens/css` (CSS variables prefixed `--tp-`) or `@tpvpn/tokens/tailwind` (Tailwind v4 `@theme`); copy `dist/dart/tp_tokens.dart`, `dist/swift/TPTokens.swift`, `dist/kotlin/TpTokens.kt` or `dist/android/{colors,dimens}.xml` into the respective apps; import `dist/figma/tokens.json` with the Tokens Studio plugin. A token path such as `color.bg.canvas` becomes `--tp-color-bg-canvas` (CSS), `--color-bg-canvas` (Tailwind) and `colorBgCanvas` (Dart / Swift / Kotlin). See [`docs/13-platform-integration.md`](docs/13-platform-integration.md).

**Versioning** — semantic versioning with one version for the whole repository; tokens are the public API (removing or renaming a token is a breaking change). See [`docs/14-governance.md`](docs/14-governance.md).

**Licences** — code is MIT © 2026 TP VPN; brand assets are all rights reserved ([`LICENSE-BRAND.md`](LICENSE-BRAND.md)). Built on Tailwind CSS (MIT), shadcn/ui (MIT), Radix UI (MIT), Lucide (ISC), Inter (SIL OFL 1.1), circle-flags (MIT) and Style Dictionary (Apache-2.0).
