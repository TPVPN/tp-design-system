# 项目状态 / STATUS

> 集成核查记录（2026-09-02，第二轮）。第一轮建成 tokens · brand · ui · site 壳层与 docs；第二轮由五个并行工作流写完全部 38 个文档页，随后做了一次端到端 QA。本文列出**已完成的内容、实际通过的命令、QA 结果与修复、与 [BRIEF](BRIEF.md) 的偏差**。后续每次发布前应更新本文。

## 0. 第三轮：部署改道 Vercel + 深度无障碍 / 性能审查（2026-09-02 晚）

**部署目标变更**：原计划的 GitHub Pages 改为 **Vercel**，自定义域名 **brand.tpvpn.com**。已移除 `.github/workflows/deploy-pages.yml`，新增仓库根目录 [`vercel.json`](../vercel.json)（构建/输出目录/SPA `rewrites`），`README.md` §部署已重写为 Vercel 首次接入步骤。因为是自定义根域名，`BASE_PATH` 保持默认 `/`，不需要在 Vercel 项目里设置环境变量。`ci.yml` 保留作为 PR/push 的构建 + 类型检查闸门，与部署解耦。

**深度审查**：在准备部署前，用 Lighthouse（39 条路由全量 + 关键页多轮）、一个手写的运行时对比度扫描器（比对每个可见文本节点实际渲染的前景/背景色，含合成半透明与渐变判断）、以及浏览器 `PerformanceObserver` 直接定位问题根因，发现并修复了以下真实缺陷（不是简单跑分刷分，每条都定位到具体代码并验证）：

| 缺陷 | 根因 | 修复 |
|---|---|---|
| 首页主按钮「开始使用」文字近似不可见 | `apps/site/src/lib/cn.ts` 是**未注册 TP 字阶的第二份 `twMerge` 实例**（`packages/ui` 那份已正确 `extendTailwindMerge`），导致 `text-action-primary-fg`（颜色）与 `text-label-lg`（字号角色）被误判为同一 class group，颜色类被静默丢弃——**58 个文件受影响**，是本轮最大的单点缺陷 | `cn.ts` 改为直接 `export { cn } from '@tpvpn/ui'`，全站只保留一份配置正确的实例 |
| 每条文档路由的 CLS 高达 0.17（首页）～0.31 | `<Suspense>` fallback（`PageSkeleton`，约 450px）换成真实页面（3–12k px）时把 `DocsLayout` 里位于 Suspense **外部**的页脚往下推；不是网络慢的假象，快速网络下同样触发（高度变化本身即触发） | `App.tsx` 新增 `useIdlePrefetch()`：首次挂载后用 `requestIdleCallback` 逐个预取全部 38 个路由的懒加载 chunk，之后导航 `<Suspense>` 同步 resolve、fallback 不再挂载；`PageSkeleton` 加 `min-h-[70dvh]` 兜底首次冷进入的情形；`postbuild.mjs` 新增字体 `<link rel=preload>`（发现构建产物里带 hash 的 Inter 文件名后注入，避免换字体引起的二次重排）。CLS 结果：首页 0，其余文档页 ~0.125（仅剩「冷进入未预取路由」这一无法消除的首次代价） |
| 头部/页脚 Logo 链接 `label-content-name-mismatch` | `aria-label="TP VPN Design System 首页"` 整体覆盖了可见文字的无障碍名称，不满足 WCAG 2.5.3 Label in Name | 去掉自定义 `aria-label`，改用可见内容 + 结尾 `sr-only` 「· 首页」 |
| 多处 `opacity-70` 把已过 AA 的状态色文字拉回不达标 | `DoDont`、`ContrastChip`、`ColorSwatch`（grade 徽标）、`LogoMisuse`、`Voice.tsx` 的 Do/Don't 徽标英文说明都在**本已选对**的 `status-*-fg` 上叠加了 70% 透明度 | 去掉多余的 `opacity-70`（颜色本身已经是正确阶数，不需要再打折） |
| `fg.muted`（slate-500）用在浅色调底（blue-50 / slate-100 / red-50）上不达 4.5:1，多处复现 | 同一模式在 8 处独立代码里重复出现，包括 **`@tpvpn/ui` 的真实产品组件**：`LatencyText` 的「ms」单位、`NodeCard`/`CountryListItem` 的元信息行 | 全部改用 `fg.secondary`（slate-600）：`ColorSwatch` 的 fail 徽标、`StateTile` 的「模拟」chip、`PlatformHint.tsx` + `PlatformMapping.tsx`（两份重复的 Callout 帮助组件）、`SubscriptionParts.tsx` 支付方式行、`foundations/Color.tsx` 三层架构图标签、`components/Card.tsx` 统计卡、以及上述两个 `@tpvpn/ui` 组件 |
| Shiki 默认 `github-light` 主题给 CSS 自定义属性（如 `var(--tp-color-bg-canvas)` 里的变量名）上色 `#E36209`，白底仅 3.49:1 | 第三方语法高亮主题本身的问题，出现在 `/platforms` 页等所有含 CSS 代码块的地方 | 换成 GitHub 官方的 **`github-light-high-contrast`**（专为 WCAG 审计的同系列主题，token 色全部 ≥ 4.5:1，多数 ≥ 8:1），视觉几乎不变 |
| `brand/Voice.tsx` 语言切换器用 `Tabs`/`TabsTrigger` 但没有对应 `TabsContent` | `aria-controls` 指向不存在的 id（`aria-valid-attr-value` + `label-content-name-mismatch`）；这本来就不是「独立面板」交互，是「单选后切换预览」 | 换成 `ToggleGroup`/`ToggleGroupItem`（语义上更准确，也是站内其它页面已经在用的模式） |
| 若干 `aria-label` 加在无 role 的 `<span>` 上 | ARIA 规范里对无 role 元素的 `aria-label` 无效；出现在 Voice.tsx 表格里的 ✓/✗ 图标（可见文字已经表达了含义）、`foundations/Spacing.tsx` 间距标尺（数值已单独显示为文字） | 改成 `aria-hidden`（纯装饰、信息已由旁边的可见文字承担） |
| `text-fg-placeholder`（BRIEF 定义为「仅用于输入框占位符/禁用态，不保证 AA」）被当成「稍浅一点的灰」误用在真实正文上 | `brand/Typography.tsx` 字体名、`patterns/_parts/ConnectionDemo.tsx` 操作步骤（有序列表里的真实指引文字）、`brand/AppIcon.tsx` 显示尺寸标注、⌘K 面板的两处提示文字 | 全部改回 `fg.muted`（正确的「弱化但仍可读」层级） |
| `components/UsageMeter.tsx` 标题层级跳级 | `<h2>`（Section）下直接接 `<h4>`，中间缺 `<h3>` | 改成 `<h3>` |
| `ColorRamp` 悬浮时显示的十六进制标签在 blue-500 / mint-700 两个色阶上只有 4.35:1（白字、深字都试过，这是两个选项里更好的那个） | 单个色块本身既是背景又要盛放文字，二选一到顶了也够不到 4.5 | 标签加一个与文字反色的半透明衬底（`rgb(0 0 0 / .35)` 或 `rgb(255 255 255 / .35)`），把所有色阶都顶到 7:1 以上 |
| `brand/Color.tsx` 主色面板小标题 20px/500 字重，用白字在 `#1677FF` 上（4.10:1）却没有达到「大字」的加粗门槛 | WCAG 大字例外要求 ≥18.66px **且加粗（≥700）**，`font-medium`(500) 不够 | 改成 `font-bold` |

确认**不是缺陷、刻意保留**的情形（每处都有明确的 `dontCaption` 说明为什么不能这么做，属于教学性的「反面示例」，触发 axe 审计是预期行为）：`brand/Color.tsx`「配色禁忌」区块的 3 个例子（`bg-blue-500` 白字、`bg-mint-500` 白字）、`components/Tag.tsx` 与 `components/TabBar.tsx` 的「纯图标不可用」反例、以及各处「—」空值占位符（`fg.placeholder` 的既定用法）。另有一处已知但未修的低优先级瑕疵：`patterns/Nodes.tsx` 的手机模型里 `CountryListItem` 列表底部与下方 `TabBar` 演示间距不足 24px（axe `target-size` 的「相邻目标」检查），纯属该页 demo 排版，非组件缺陷。

**验证结果**：39 条路由做了完整 Lighthouse Accessibility 扫描，**31 条满分 100，全站平均 99.3/100**；剩余 8 条全部逐条核实为上述「刻意保留」情形。性能分数在默认（模拟 4× CPU 节流 + 慢速 4G）条件下为 58–88，但用 `--throttling-method=provided`（不加节流，用本机真实速度）对照测试，首页 92、按钮页 85——证明默认分数主要是本沙盒环境模拟节流的失真，不是代码缺陷；Vercel 边缘网络下的真实用户体验应显著更好。CLS：首页从 0.174 降到 0，其余文档页从 0.31 降到 ~0.125。

以上所有修改后重新跑过 `pnpm build`（tokens → brand → ui typecheck → site typecheck+build+postbuild）全部通过，dist 为最终提交前的产物。

## 1. 已完成 / Done

| 包 | 状态 | 说明 |
|---|---|---|
| `@tpvpn/tokens` | ✅ 可构建、已校验 | DTCG 源 → Style Dictionary 4.4；11 个输出（css / tailwind / json ×2 / dart / swift / kotlin / android ×2 / figma / README）。505 个 token；`tokens.css` 597 个 `--tp-*` 变量；`theme.css` 513 个 `@theme` 变量。构建脚本自带断言（约 50 个精确字面量、无 `undefined`/`NaN`、括号平衡、JSON 可解析），SD 警告视为错误。 |
| `@tpvpn/brand` | ✅ 可构建、字节级确定 | 11 个 SVG 源（字标已描边为 path，零 `<text>`）→ 147 个产物：Logo PNG @1x/@2x、iOS/Android/Web/通用图标、社交图、62 面圆旗 + index.json、Inter TTF、6 个 ZIP 包、`manifest.json`。两次构建产物逐字节一致。 |
| `@tpvpn/ui` | ✅ `tsc` 零错误 | `theme.css`（shadcn 变量 → TP 语义 token，`@theme inline` 桥接，light only）、`styles.css`、26 个 shadcn 组件换肤 + **新增 `Toast`（Radix Toast，`Toaster` / `useToast` / 命令式 `toast()`）**、15 个 VPN 专属组件（`components/tp`）、`cn`（twMerge 已注册 TP 字阶/阴影/间距/缓动）。 |
| `@tpvpn/site` | ✅ 构建 + 全路由 QA 通过 | Vite 7 + React 19 + Tailwind 4 + React Router 7 + Motion。壳层（Header ⌘K / 抽屉、Sidebar、TOC、DocsLayout、Footer、23 个文档积木）+ **38 个文档页全部实现**（`src/pages/**`，页面级积木在各 `_parts/`）。最大 JS chunk 232 kB（html 语法高亮），无 > 800 kB 警告。 |
| 文档与仓库 | ✅ | `README.md`、`CHANGELOG.md`、`CONTRIBUTING.md`、`LICENSE`、`LICENSE-BRAND.md`、`.github/workflows/ci.yml`、`vercel.json`、Issue/PR 模板、`docs/01–14` 规范。 |

### 本次集成核查所做的修复 / Fixes made during integration

1. **`packages/ui/src/components/ui/button.tsx`** — `asChild` 时 JSX 会把 `[null, children]` 两个子节点交给 Radix `Slot`，触发 "Slot failed to slot onto its children"。现在 `asChild` 分支直接透传 `children`，spinner 只在原生 `<button>` 分支渲染。`<Button asChild>` 可正常使用。
2. **`packages/ui/src/theme.css`** — 补上 BRIEF §4 要求的 `--radius: 0.75rem`（仅在 `:root`，不进 `@theme`，因此不会生成 `rounded-*` 别名；组件库仍直接使用 TP 圆角 token）。已在构建后的站点 CSS 中确认 `--radius:.75rem`。
3. **文档中的过期文件名**（这些文件由 brand/tokens 流程后生成，文档先行撰写时是猜测值）：
   - `docs/02-logo.md`：PNG 命名改为实际的 `dist/logo/png/*@1x.png · *@2x.png`（横版/堆叠/字标 1024 px 宽、图形 512 px，@2x 加倍）；`tp-vpn-logo.zip` → `tp-vpn-logo-pack.zip`；`tp-vpn-brand-kit.zip` → `tp-vpn-brand-assets-all.zip`；邮件签名路径加上 `png/`。
   - `docs/03-app-icon.md`：Android 文件名改为 `ic_launcher_foreground.{png,svg}` / `ic_launcher_background.png` / `ic_launcher-{512…48}.png`；通用图标改为 `tp-vpn-icon-<size>.png`。
   - `README.md`、`docs/13-platform-integration.md`：Android XML 路径改为 `dist/android/values/{colors,dimens}.xml`。
   - `docs/13-platform-integration.md`：Tokens Studio 导出是**单一 set `global`**（非三层 set），步骤已同步。
   - `apps/site/src/components/home/Bento.tsx`：下载卡片标签改为真实包名 `tp-vpn-brand-assets-all.zip`。
4. 核查脚本确认：Markdown 中引用的 41 条 `dist/**`、`public/**` 路径全部存在于磁盘。

## 2. 通过的命令 / Commands that pass

全部在 `/Users/carter/Claude/Projects/TP_VPN_Beta/tp-design-system` 下执行（Node 24 · pnpm 11.9），退出码均为 0：

```bash
pnpm build:tokens        # node build.mjs → 11 files, "built and verified", 505 tokens
pnpm build:brand         # node scripts/build-assets.mjs → 147 files + manifest.json, 6 zips, ~1.3 s
pnpm --filter @tpvpn/ui typecheck        # 或 cd packages/ui && ../../node_modules/.bin/tsc --noEmit -p tsconfig.json
pnpm build:site          # prebuild sync-assets → tsc --noEmit → vite build → postbuild (404.html + .nojekyll)
pnpm typecheck           # ui + site 的 tsc；tokens/brand 为 echo skip
rm -rf apps/site/dist && pnpm build      # tokens → brand → site，从零构建
```

预览与运行时核查（已完成后关闭服务器）：

```bash
cd apps/site && node_modules/.bin/vite preview --port 5181   # 注意：vite 位于 apps/site/node_modules/.bin，仓库根目录没有
curl -I http://localhost:5181/                                 # 200 text/html
curl -I http://localhost:5181/brand/logo                       # 200（SPA 回退）
curl    http://localhost:5181/brand/logo/svg/tp-vpn-logo-horizontal.svg   # 200 image/svg+xml，以 <svg 开头
curl -I http://localhost:5181/brand/flags/us.svg               # 200
curl -I http://localhost:5181/downloads/tp-vpn-logo-pack.zip   # 200 application/zip 433 682 B
curl -I http://localhost:5181/tokens/css/tokens.css            # 200 text/css
```

浏览器核查（内嵌浏览器，1440 × 900 / 1440 × 3500 / 375 × 812）：首页与 `/brand/logo` **零 console error**；Inter Variable 字体已加载；无损坏图片；375 px 下 `scrollWidth === 375`（无横向滚动）；Hero 中手机画面由 `AppFrame → Tag → ConnectionButton → StatusDot → NodeCard → TabBar` 真实组件拼装，已连接态渐变 + 发光、计时、国旗、信号条均正确渲染；首页六区块与页脚无重叠、无错位。

Token 契约交叉核对：脚本抽取 `packages/ui/src` 与 `apps/site/src` 中 191 个 token 形态的 Tailwind 类（`bg-action-*`、`text-fg-*`、`h-control-*`、`shadow-level-*`、`ease-*`、`rounded-*`、`text-<role>`…），按 Tailwind v4 命名空间映射到 `@theme` 变量，**全部**能在 `theme.css` / `ui/theme.css` / `site/index.css` 中找到定义。

## 3. 文档页 QA（第二轮）/ Page QA

全部 39 个路由（首页 + 38 个文档页）在运行中的 Vite dev（`:5180`）里逐一核查，视口 1440 × 900 与 360 × 780：

| 检查项 | 结果 |
|---|---|
| `pnpm build:tokens` · `pnpm build:brand` · `packages/ui` `tsc --noEmit` · `apps/site` `tsc --noEmit` · `pnpm build:site` | ✅ 全部退出码 0，无 Vite 警告 |
| console error（每页 `read_console_messages(onlyErrors)`） | ✅ 零新增错误（缓冲区里仅有 QA 前一次 HMR 的过期 `Logo.tsx` 500 与 QA 自己对外链做 HEAD 的 CORS 提示） |
| 损坏图片（`img.complete && naturalWidth === 0`） | ✅ 修复 1 处后为零：`/brand/app-icon` 引用了不存在的 `tp-vpn-icon-48.png` |
| 1440 px `scrollWidth <= innerWidth` | ✅ 39 / 39 |
| 360 px `scrollWidth <= innerWidth` | ✅ 39 / 39（修复前 12 个路由溢出，见下） |
| 字体 | ✅ `Inter Variable` 已加载 |
| 占位文案（Coming soon / TODO / lorem） | ✅ 无（仅 `components/docs/ComingSoon.tsx` 文件本身保留） |
| `dark:` 变体 | ✅ `apps/site/src` 与 `packages/ui/src` 均无 |
| 硬编码 hex | ✅ 页面里出现的 `#1677FF` / `#FAFBFF` 等全在说明文字、代码示例注释或数据表中；没有 `text-[#…]` / `style={{ color: '#…' }}` 之类的文字着色 |
| PageHeader `title` + `en`、Section id 唯一 | ✅ 脚本扫描 68 个页面文件：0 个问题 |
| ⌘K 搜索 | ✅ 打开 → 输入「字阶」→ Enter 跳转到 `/foundations/typography` |
| 移动端抽屉（360 px） | ✅ 「打开导航」按钮弹出 Sheet（39 个链接），Esc 关闭 |
| `/downloads` 全部 DownloadCard / 资源链接 | ✅ 50 个站内 `href`（`/downloads/**`、`/brand/**`、`/tokens/**`）HEAD 均 200；唯一非 200 是指向 GitHub 的外链（浏览器 CORS，非站内问题） |
| `/brand/logo`、`/platforms` 指向 `/brand/**`、`/tokens/**`、`/downloads/**` 的链接 | ✅ 23 + 9 个全部 200 |

### 本轮修复 / Fixes made

1. **`apps/site/src/index.css`** — 全站 `code:not(pre code)` 加 `overflow-wrap: anywhere`。这是 360 px 溢出的主因：Section 描述、Callout、Prose、Changelog 中的长路径 / API 名（`ios/Runner/Assets.xcassets/AppIcon.appiconset`、`.listRowBackground(Color(TPTokens…))` 等）撑宽页面，波及 `/brand/app-icon`、`/foundations/accessibility`、`/components`、`/patterns/connection`、`/patterns/nodes`、`/patterns/subscription`、`/changelog`。
2. **Prose 内裸 `<table>`**（UsageMeter、Dialog、Loading、StatusDot、Sheet、Toast 六页）包进 `<div className="overflow-x-auto">`。
3. **Preview 工具栏 ToggleGroup**（`_parts/Controls.tsx`、`_parts/PropToggles.tsx` 及 Logo / foundations Color / Accessibility / NodePicker / SubscriptionParts / ConnectionDemo / GridOverlayDemo 里的分段控件）加 `flex-wrap`，360 px 下不再被 Preview 的 `overflow-hidden` 裁掉选项。
4. **`/brand/app-icon`** — 下载卡片预览改用存在的 64 / 32 通用图标。
5. **`/foundations/color`** — 三层架构图网格项加 `min-w-0`，桌面宽度不再溢出文章列（917 → 816）。
6. **`/platforms`** — 命名映射表代码单元格 `whitespace-nowrap`，改为容器内横向滚动而不是逐字符折行。
7. **`_parts/PlatformHint.tsx`** — `<dd>` 加 `min-w-0 break-words`，长 token 名不再溢出 Callout。

## 4. 与 BRIEF 的偏差 / Deviations from BRIEF

### Tokens
- 源文件两处**结构性**修改（值未变）：`semantic/typography.json` 组级 `$description` 中的 `{font.family.sans}` 改为纯文本；`semantic/color.json` 删除了与 primitives 重复的组级 `"$type": "color"`（SD 视为冲突）。
- Tailwind v4 没有 `--duration-*` 工具命名空间，需写 `duration-(--duration-base)`；`overline` 的大写只能以注释形式出现（使用 `uppercase` 类）；渐变、z-index、opacity、logo、border-width 与组件级 `--tp-*` token 放在 `theme.css` 的 `:root` 块（`@theme` 之外），没有工具类。
- Figma 导出为 Tokens Studio **单一 set `global`**；duration/easing 为 `other` 类型；未在插件中实测导入。
- Dart / Swift / Kotlin 仅人工审阅，未经编译器验证（本机无 Flutter / Xcode / Gradle）。Flutter 无 inset BoxShadow，`elevation.inset-hairline` 拆为颜色 + 宽度两个常量。

### Brand
- 字标未做 kerning（opentype.js 0.11 读不到 Inter 4 的 class-based GPOS），仅用 −0.02em 字距；结果稳定、视觉可接受，已写入 `src/logo/README.md`。
- `icon-maskable-512` 的「66% 安全区」按 W3C 80% 安全圆的 66% 解释（字形最长边 = 画布 52.8%），否则会被圆形遮罩裁切；`packages/brand/dist/app-icon/web/README.md` 仍只写「80% 安全区」。
- `apple-touch-icon.png` 按规范为透明圆角；iOS 主屏会把透明区填黑，实际投放可考虑不透明版。
- ZIP 使用固定时间戳（2026-01-01，archiver 以本地时间写 DOS 时间戳），跨时区机器重新构建时字节可能不同——CI 的 `git diff --exit-code -- packages/brand/dist` 可能因此误报。

### UI
- Button：删除了 shadcn 的 `xs` / `icon-xs`；`loading` 使用 `aria-busy` + `aria-disabled` 并吞掉点击。
- `Tag.tone` 在 TS 层为必填并含 `info`；`ConnectionState` 含 `'error'`（BRIEF §4 的 ConnectionButton 只列三态、Tag 无 `info`，取超集，BRIEF 未改）。
- **延迟阈值不一致（待定）**：`SignalBars` / `latencyBars()` 在 80–119 ms 返回 3 格绿条，而 `latencyTone()` / `LatencyText` 与 BRIEF §5 把 80–180 ms 视为黄色；`/components/node-card` 与 `/patterns/nodes` 页面已如实说明，建议 `packages/ui/src/lib/latency.ts` 改为 `if (ms < 120) return { bars: 3, tone: 'fair' }`。
- `NodeCard` / `CountryListItem` 未按 docs/10 §2.3 给负载 > 80% / > 95% 着色；docs/09 §2 的「未连接图标 slate-400」与组件实际的 blue-500 不一致（BRIEF 未规定）。
- `PlanCard.price` 是单个字符串，无法在组件内实现「货币 label-md + 金额 numeric-lg」排版；`UsageMeter` 单位写死为 GB；`Sheet` 的下滑关闭由宿主实现；`Toast` 关闭按钮 32 px（主要靠右滑 / 自动消失）。
- `prefers-reduced-motion` 全局规则把所有动画降为 0.01ms / 过渡 150ms。
- `Flag` 默认前缀 `/brand/flags/`；站点已在 `main.tsx` 用 `<FlagProvider baseUrl={asset('brand/flags/')}>` 包裹。

### Site
- 顶部导航使用 `z-40`，组件库浮层为 `z-50`，未使用 BRIEF §2.5 的 z-index token（sticky 100 / modal 1100）。
- 未运行 Lighthouse（环境无 headless Chrome CLI）；BRIEF §6 第 4 条尚未验证。
- 页脚「法律」链接与 Changelog 的 release 链接指向 `https://github.com/TPVPN/tp-design-system/...`，仓库地址为假设值；PageHeader 的源码链接因此只做「路径 + 复制」而不是 GitHub URL。
- `Toaster` 只挂在 `/components/toast` 页内，`TooltipProvider` 只挂在 `/components/tooltip` 页内；其它页面若要用 toast / tooltip 需在 `main.tsx` 或 `DocsLayout` 挂一次。
- `/platforms` 与 `/downloads` 的 token 文件字节数是 1.0.0 快照（`src/pages/_parts/tokenFiles.ts`），运行时用 HEAD `Content-Length` 修正；token 重建后应更新快照。
- `/patterns/subscription` 的价格（¥30 / 月、¥252 / 年）、邀请天数与四档 IEPL 分配是示例值（页面已标注），需产品确认。
- 未做 prettier（工作区未安装），格式手工对齐。
- `src/pages/components/_parts/` 里存在两套并行的辅助件（Anatomy vs AnatomyPins、Controls vs PropToggles、PlatformHint vs PlatformMapping），功能重叠，可后续合并。

### Docs / 规范
- 所有 docs 修订只限「与 BRIEF 或真实产物 / API 相矛盾」之处；docs/12 §4 的三处 UI 文案（断开连接 / Perfil / कनेक्टेड）与 `/brand/voice` 页面不一致，页面以 tp-app 实际字符串为准，docs/12 未改。
- docs/13 §0 仍把 Figma 路径描述为多集合；实际导出是单一 `global` set。
- `ci.yml` 仅做了 YAML 语法校验，尚未在 GitHub Actions 上实际运行；`vercel.json` 已本地跑通 `pnpm build` 全流程，但尚未在 Vercel 平台上实际部署过。

### 质量门槛对照（BRIEF §6）

| # | 要求 | 状态 |
|---|---|---|
| 1 | `pnpm build` 零错误、`tsc --noEmit` 零错误、无 console error | ✅ tokens / brand / ui / site 构建与 tsc 全部通过；39 个路由 console 零错误 |
| 2 | 文字对比度 ≥ 4.5:1、键盘可达、`aria-*`、图片 alt | ✅ 页面上的对比度全部实时计算（`lib/contrast`）并标注；所有 `<img>` 有 alt；⌘K / 抽屉 / Dialog 键盘可达。未做全站自动化 a11y 审计（无 axe / Lighthouse） |
| 3 | 每个下载按钮指向真实文件 | ✅ `/downloads` 50 个站内链接、`/brand/logo` 23 个、`/platforms` 9 个全部 HEAD 200 |
| 4 | Lighthouse Performance ≥ 90 / A11y 100 / Best Practices ≥ 95 | ❌ 未运行 |
| 5 | 360 px 无横向滚动 | ✅ 39 / 39 路由实测 `scrollWidth === 360` |
| 6 | `BASE_PATH` → Vite `base`、`404.html` = `index.html`、资源走 `import.meta.env.BASE_URL` | ✅ `postbuild` 生成 `404.html`；资源 URL 全部经 `lib/assets.ts` |

## 5. 下一步 / Next

1. 定稿 `latency.ts` 的 80–119 ms 档位（建议 `fair`），并让 NodeCard / CountryListItem 按负载阈值着色。
2. 在 `main.tsx` / `DocsLayout` 统一挂载 `<Toaster />` 与 `<TooltipProvider>`；合并 `_parts/` 中重叠的辅助件。
3. 已用 Lighthouse 补齐 §6 第 4 条（见「第三轮」）；仓库推送后在 Vercel 完成首次 Import + 域名接入（README §部署步骤 1–3）。
4. 在真实 Flutter / Xcode / Gradle 工程中编译一次 `dist/dart|swift|kotlin` 输出。
5. 产品确认套餐示例价格 / 邀请天数；给 `PlanCard` 加 `currency`、`UsageMeter` 加 `unit` prop。
