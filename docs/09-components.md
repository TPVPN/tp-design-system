# 组件 / Components

> 站点路由：`/components` · `/components/<name>` · 代码：`packages/ui/src/components/ui/*`（shadcn 基座）与 `packages/ui/src/components/tp/*`（VPN 专属）· 导出：`@tpvpn/ui`

通用约定：

- 所有组件 TypeScript props 完整、根元素带 `data-slot="<component>"`、支持 `className` 合并（`cn`）。
- 触控目标 ≥ 44 × 44；键盘可达；聚焦环 `focus`（`0 0 0 3px rgb(22 119 255 / 0.32)`）。
- 尺寸、颜色、圆角全部来自 token（组件层 `packages/tokens/src/component/components.json`，单文件）。
- Flutter 对应实现建议基于 **forui** + `TpTokens`；iOS 对应基于 SwiftUI + `TPTokens`。

---

## 1. Button

| 项 | 说明 |
|---|---|
| 用途 | 触发操作。一屏只有一个 primary |
| 解剖 | 容器（`radius.md` 12）· 可选前置图标 20 · 文字 `label-md` / `label-lg` · 可选后置图标 |
| 变体 | `primary`（`action.primary.bg` blue-600 / 白字）· `secondary`（blue-50 底 blue-700 字，`action.secondary.*`）· `ghost`（透明，hover slate-100）· `outline`（slate-200 描边，hover slate-300）· `destructive`（red-600 `#DC2626` / 白字）· `link` |
| 尺寸 | `sm` 36 / 横向 12 · `md` 44 / 20（默认）· `lg` 52 / 24 · `xl` 60 / 28 · `icon` 44 × 44（`icon-sm` 36 · `icon-lg` 52）· `pill` 胶囊 |
| 状态 | default · hover（bg-hover，200ms）· active（scale 0.98，100ms）· focus-visible（聚焦环）· disabled（`action.disabled.*`，`opacity` 不变）· loading（spinner 20 + `aria-busy`） |
| 可达性 | 原生 `<button>`；图标按钮必须 `aria-label`；`asChild` 用 Radix `Slot` |
| Flutter | `FButton`（forui）`style: FButtonStyle.primary`，高度 44，`TpTokens.colorActionPrimaryBg` |
| iOS | `Button` + 自定义 `ButtonStyle`，`frame(minHeight: 44)`，`.background(TPTokens.colorActionPrimaryBg)` |

## 2. ConnectionButton

| 项 | 说明 |
|---|---|
| 用途 | 首页唯一主操作：连接 / 断开 |
| 解剖 | 外环（connecting 时旋转弧线 + 呼吸）· 圆形本体（直径 128 / 160，`radius.full`）· `power` 图标 48 · 可选 `elapsed` 计时文字（下方 `numeric-md`） |
| Props | `state: 'disconnected' \| 'connecting' \| 'connected' \| 'error'` · `size: 'mobile' \| 'desktop'`（128 / 160）· `elapsed?: string` · `label?: string \| null` · `onClick` · `disabled` |
| 状态 | disconnected：白底、slate-200 描边、图标 blue-500 · connecting：白底、blue-100 描边、图标 blue-500、外环 blue-500 弧线旋转 + 内圈呼吸、`aria-busy` · connected：`gradient.connected` + `brand-glow-lg`、白图标 · error：白底、red-500 描边、红图标，配合 Toast |
| 动效 | connecting 外环 1.2s（`duration.connect`）；进入 connected `spring` 300ms；reduced motion 时静态 |
| 可达性 | `role="switch"` + `aria-checked`（connected）；`aria-label` 随状态更新（取 `connectionStateLabel[state]`，可用 `label` 覆盖）；键盘 Space / Enter |
| Flutter | `GestureDetector` + `AnimatedContainer` + `CustomPaint` 画弧；`AnimationController(duration: 1200ms)` |
| iOS | `Circle().fill(RadialGradient(...))` + `.shadow(color: TPTokens.colorBlue500.opacity(0.45), radius: 30, y: 10)`；`rotationEffect` 动画 |

## 3. Tag

| 项 | 说明 |
|---|---|
| 用途 | 场景、状态、标记 |
| 解剖 | 容器（`radius.xs` 6，浅底 50 + 深字 700）· 可选图标 12（sm）/ 14（md）· 文字 `label-sm` |
| Props | `tone: 'auto' \| 'game' \| 'ai' \| 'exchange' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'neutral' \| 'brand'` · `size: 'sm' \| 'md'`（高度 20 / 24）· `icon?`（场景 tone 默认取 `sceneIcon`，`null` 去掉） |
| 色 | auto blue-50/700 · game mint-50/**800**（mint-700 仅 4.08:1） · ai purple-50/700 · exchange amber-50/700 · success green-50/700 · warning amber-50/700 · error red-50/700 · neutral slate-100/700 · info blue-50/700 · brand blue-50 (`bg.brand-soft`) / blue-700 (`fg.brand-strong`) |
| 可达性 | 纯展示 `<span>`；不可点击；颜色不作唯一信息载体（带文字） |
| Flutter | `FBadge`（forui）自定义 style |
| iOS | `Text().padding().background(Capsule / RoundedRectangle(6))` |

## 4. NodeCard

| 项 | 说明 |
|---|---|
| 用途 | 首页节点摘要、推荐节点 |
| 解剖 | 国旗 40（置于 44 圆底）或 `globe` 图标 / 自定义 `icon` · `title`（`headline`，「US · Los Angeles #102」）· `badge`（Tag「优质节点」）· 元数据行 `caption`：`subtitle` · `latencyMs`（延迟着色）· `loadPct` · `SignalBars`（4 格）· `chevron-right` |
| 容器 | 白底 · `radius.lg` 16 · `slate-200` 描边 · `level-1`（hover `level-2`，`node-card.shadow` / `shadow-hover`） |
| 状态 | default · hover（level-1 → level-2，描边 slate-300）· pressed（scale 0.995）· selected（blue-500 描边 + blue-50 底）· loading（骨架） |
| 可达性 | 传 `onSelect` 时整卡 `<button aria-pressed>`，否则 `<div>`；国旗 `alt` + `SignalBars` `aria-label`「延迟 N ms」 |
| Flutter | `FCard` 或 `Container(decoration: BoxDecoration(borderRadius: 16, boxShadow: TpTokens.elevationLevel2))` |
| iOS | `HStack` 内 `RoundedRectangle(cornerRadius: 16)` 背景 |

## 5. CountryListItem

| 项 | 说明 |
|---|---|
| 用途 | 节点 / 国家列表行 |
| 解剖 | 圆形国旗 **40** · 名称 `headline` · Tag（场景）· 三段元数据 `latencyMs / lossPct / loadPct`（`caption` tabular，延迟着色）· `chevron-right` |
| 尺寸 | 高度 ≥ 72（`country-list-item.height`）；横向内边距 16 |
| 状态 | default · hover（slate-50）· pressed · `selected`（左侧 3px 蓝条 `action.selected.indicator` + `action.selected.bg`）· disabled |
| 可达性 | 传 `onClick` 时为 `<button aria-pressed>`，否则 `<div>`；listbox / option 语义由容器层按需补充 |
| Flutter | `FTile`（forui）或 `ListTile`；左侧 `Container(width: 3, color: TpTokens.colorBorderBrand)` |
| iOS | `List` 行 + `.listRowBackground` |

## 6. SearchBar

| 项 | 说明 |
|---|---|
| 用途 | 节点搜索 |
| 解剖 | `search` 图标 20 `fg.muted` · `<input type="search">` · 清除按钮（28 圆形 + `x`，有值时显示，点击后重新聚焦） |
| 尺寸 | 高度 44 · `radius.md` 12 · 白底 `bg.surface` + `border.default` slate-200 描边（`search-bar.*`）；hover slate-300；focus `border.focus` + 聚焦环 |
| 占位 | 「搜索国家、城市或节点」（`fg.placeholder`） |
| 可达性 | 外框 `role="search"`，`<input type="search">` + `aria-label`；清除按钮 `aria-label="清除搜索"` |
| Flutter | `FTextField` 前缀图标；`TextInputAction.search` |
| iOS | `.searchable` 或自定义 `TextField` |

## 7. TabBar

| 项 | 说明 |
|---|---|
| 用途 | App 底部主导航（3 项：首页 / 节点 / 我的） |
| 解剖 | 容器高 **56 + 底部安全区** · 每项：图标 24 + label `label-sm` |
| 色 | 选中 blue-600 图标 + 文字；未选 slate-500（`tab-bar.inactive-fg`）；顶部 hairline `border.default` |
| 状态 | selected · default · pressed（fast 100） |
| 可达性 | `<nav aria-label="主导航">` + `aria-current="page"` |
| Flutter | `FBottomNavigationBar`（forui）或 `NavigationBar`，`SafeArea(top: false)` |
| iOS | `TabView` + `.tint(TPTokens.colorBlue600)` |

## 8. Switch

| 项 | 说明 |
|---|---|
| 用途 | 布尔设置 |
| 尺寸 | **51 × 31**（iOS 比例），滑块 27，位移 20 |
| 色 | on blue-500 · off slate-300 · disabled slate-200 · 滑块白 + 投影（`0 3px 8px rgb(0 0 0 / 0.15)`）|
| 动效 | `base` 200ms `standard`（滑块 translate + 轨道色）；`size: 'sm' \| 'default'`（36 × 22 / 51 × 31）|
| 可达性 | Radix Switch：`role="switch"` `aria-checked`；label 关联 |
| Flutter | `FSwitch`（forui）或 `CupertinoSwitch(activeColor: TpTokens.colorBlue500)` |
| iOS | `Toggle().tint(TPTokens.colorBlue500)` |

## 9. Input

| 项 | 说明 |
|---|---|
| 用途 | 表单输入（邮箱、兑换码…） |
| 解剖 | 可选 label（`label-md`）· 输入框 · 可选前后图标 · 帮助 / 错误文字 `caption` |
| 尺寸 | 高度 44 · `radius.md` 12 · 描边 `border.default` slate-200（hover `border.strong` slate-300）· 内边距 16 · 无 `size` prop（36 / 52 用 `h-control-sm` / `h-control-lg` 覆盖）|
| 状态 | default · hover（slate-300 描边）· focus（`border.focus` + 聚焦环）· error（`aria-invalid` → red-500 描边 + 红色聚焦环 + red-700 caption）· disabled（slate-100 底 slate-400 字）· readonly |
| 可达性 | `<label for>`；错误 `aria-invalid` + `aria-describedby` |
| Flutter | `FTextField` |
| iOS | `TextField` + `.textFieldStyle(.roundedBorder)` 自定义 |

## 10. Card

| 项 | 说明 |
|---|---|
| 用途 | 内容分组 |
| 解剖 | `CardHeader`（`CardTitle` `headline`，`CardDescription` `body`，可选 `CardAction` 右上）· `CardContent` · `CardFooter` |
| 样式 | 白底 · `radius.lg` 16 · `slate-200` 描边 · `level-1` · 内边距 24（Web 组件默认 `py-6` + `px-6`）/ 16（App） |
| 状态 | static · interactive（hover level-2） |
| Flutter | `FCard` |
| iOS | `GroupBox` 自定义或 `VStack.background` |

## 11. Loading（LoadingState）

| 项 | 说明 |
|---|---|
| Props | `variant: 'skeleton' \| 'spinner' \| 'success'` · `label?` |
| skeleton | slate-100 底，`radius.sm`，`animate-pulse`（reduced motion 时静态）；内置形状为「44 圆头像 + 三行」，其它形状用 `Skeleton` 自拼，与目标布局同尺寸 |
| spinner | 12 点式 iOS 风格，默认 28（`Spinner size`，按钮内 20），blue-500，1s / 12 步；`role="status"` + `aria-live="polite"` |
| success | green-50 圆（56）+ green-600 check（28），`spring` 弹入（stiffness 420 / damping 22） |
| Flutter | `Shimmer` 自绘 / `CircularProgressIndicator(strokeWidth: 2)` |
| iOS | `ProgressView` / `redacted(reason: .placeholder)` |

## 12. Dialog / Sheet

| 项 | Dialog | Sheet |
|---|---|---|
| 用途 | 需决策的中断 | 从底部呼出的次级流程（节点详情、套餐选择） |
| 容器 | `radius.2xl` 24 · `level-4` · 最大宽 512（`sm:max-w-lg`，可用 className 覆盖为 384 / 672）| 顶部 `radius.2xl` 24 · `level-3` · 顶部抓手 36 × 6 slate-300（`side="bottom"` 自动）· `pb-[env(safe-area-inset-bottom)]` |
| 遮罩 | `bg.overlay` | 同 |
| 动效 | scale 0.95 + opacity，`moderate` 300 进出 | 位移滑入，进 `slow` 500 · 出 `base` 200，`emphasized` |
| 可达性 | Radix Dialog：`role="dialog"` `aria-modal` 焦点陷阱、Esc 关闭、标题 `aria-labelledby` | 同（下滑关闭手势由宿主实现，Web 版未内置；抓手仅视觉）|
| Flutter | `showFDialog` / `showModalBottomSheet(shape: RoundedRectangleBorder(top 24))` | |
| iOS | `.sheet` + `.presentationDetents` + `.presentationCornerRadius(24)` | |

## 13. Tooltip

| 项 | 说明 |
|---|---|
| 样式 | `bg.inverse` slate-900 · 白字 `caption` · `radius.sm` 8 · 内边距 6 / 10 · `level-2` · 10px 同色箭头 · `sideOffset` 6 · 最大宽 20rem |
| 动效 | `fast` 100ms，位移 4px；`TooltipProvider` 默认 `delayDuration` 200 |
| 可达性 | Radix Tooltip：hover + focus 触发；仅补充信息，不承载唯一信息 |
| 移动端 | 不用 Tooltip，改用 Popover 或说明文字 |

## 14. Toast

| 项 | 说明 |
|---|---|
| 用途 | 操作结果、错误 |
| 解剖 | 状态图标 20（`status.*.solid`；neutral 无图标）· 标题 `label-md` + 说明 `body-sm` · 可选动作（secondary sm）· 关闭 32 |
| 样式 | 白底 · `radius.lg` 16 · `slate-200` 描边 · `level-3`；语义只改图标与图标颜色，容器不变 |
| 位置 | < 768 底部居中（安全区上方）/ ≥ 768 右上；最多同时 3 条，第 4 条到来时最早的先退出；向右滑动关闭 |
| 时长 | 默认 4000ms（`duration`，`Infinity` 常驻）· 带动作 6000 · error 5000–8000 · hover / focus 暂停 |
| 可达性 | `role="status"`（非 error）/ `role="alert"`（error，`type="foreground"` assertive）；F8 聚焦视口；动作带 `altText`。API：`toast({ title, description?, tone?, duration?, action? })` + `<Toaster />` + `useToast()` |
| Flutter | `FToast` 或 `ScaffoldMessenger.showSnackBar` |
| iOS | 自定义 overlay |

## 15. UsageMeter

| 项 | 说明 |
|---|---|
| 用途 | 流量 / 设备数进度 |
| 解剖 | 标题 `label-md` · 数值 `numeric-sm`（`12.3 GB / 100 GB`）· 进度条高 8 `radius.full` |
| 色 | < 80% blue-500 · 80–95% amber-500 · > 95% red-500；轨道 slate-100 |
| 可达性 | `role="progressbar"` `aria-valuenow / min / max` + `aria-label` |
| Flutter | `LinearProgressIndicator(minHeight: 8, borderRadius: 9999)` |
| iOS | `ProgressView(value:)` 自定义 style |

## 16. PlanCard

| 项 | 说明 |
|---|---|
| 解剖 | 套餐名 `title-sm`（h3）· `badge`（Tag brand md「推荐」）· 价格（`price` 整串以 `display-sm` tabular 渲染，`period` → 「/ 年」body muted；页面级 lockup 规则：货币 `label-md` + 金额 `numeric-lg` + 周期 `caption`）· 权益列表（check 16 `fg.brand` + `body` secondary）· CTA 全宽 |
| Props | `name` · `price`（已格式化字符串）· `period?` · `description?` · `features: string[]` · `highlighted?` · `badge?` · `cta`（设备数 2 / 4 / 8 / 50 写入 features 第一条） |
| 样式 | `radius.xl` 20 · `level-1` · 推荐态 `border.brand` blue-500 + `brand-glow` + 顶部 4px `gradient.primary` 条 |
| 可达性 | `<article aria-labelledby>`；价格用 `aria-label` 朗读完整（「每月 28 元」） |
| Flutter | `FCard` 组合 |
| iOS | `VStack` 组合 |

## 17. StatusDot

| 项 | 说明 |
|---|---|
| 用途 | 连接状态点（App bar、列表） |
| Props | `state: 'connected' \| 'connecting' \| 'disconnected' \| 'error'` · `size: 8 \| 10 \| 12` · `pulse?`（默认仅 connecting）· `label?` |
| 色 | 严格 `color.state.*`：green-500 / blue-500（脉冲）/ slate-400 / red-500 |
| 可达性 | 有 `label` 时可见文字；否则 `aria-label` + `role="img"` |
| Flutter | `Container(decoration: BoxDecoration(shape: circle, color: TpTokens.colorStateConnected))` |
| iOS | `Circle().fill(TPTokens.colorStateConnected).frame(width: 8)` |

## 18. 辅助组件 / Helpers

| 组件 | 说明 |
|---|---|
| `SignalBars` | 4 格，宽 3 间距 2，高 4 / 7 / 10 / 13；按延迟着色（见 [10-patterns.md](10-patterns.md) §2.2） |
| `Flag` | `code` → `<base>brand/flags/<code>.svg`，尺寸 24 / 32 / 40，1px 内描边；`alt` 国家名 |
| `cn` | `clsx` + `tailwind-merge` |

## 19. 组件 token 文件 / Component Token Files

| 文件 | 内容 |
|---|---|
| `components.json` → `button` | 高度 36 / 44 / 52、横向内边距 12 / 20 / 24、圆角 12、primary / secondary / ghost 各态色 |
| `components.json` → `connection-button` | 直径 128 / 160、图标 48、环宽 2、三态色、connected 渐变 + glow、duration 1200 |
| `components.json` → `node-card` | 圆角 16、内边距 16、间距 12、阴影 level-1 / hover level-2、标题 / 元数据色 |
| `components.json` → `tag` | 高度 20 / 24、横向内边距 6 / 8、圆角 6（tone 色取语义层 scene.* / status.*） |
| `components.json` → `tab-bar` | 高度 56、玻璃底、顶部描边、选中 blue-600 / 未选 slate-500 |
| `components.json` → `switch` | 51 × 31、滑块 27、on / off / disabled 色 |
| `components.json` → `input` | 高度 44、圆角 12、内边距 16、描边 / hover / focus 色、占位色 |
| `components.json` → `search-bar` | 高度 44、圆角 12、白底 + slate-200 描边、图标色 |
| `components.json` → `country-list-item` | 行高 72、横向内边距 16、旗 40、选中底 / 指示条、分割线 |
