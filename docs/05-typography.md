# 字体 / Typography

> 站点路由：`/brand/typography`（品牌）· `/foundations/typography`（token）· token 源：`packages/tokens/src/semantic/typography.json` · 产物：CSS `--tp-typography-<role>-font-size / -line-height / -font-weight / -letter-spacing`；Tailwind `--text-<role>` + `--text-<role>--line-height / --font-weight / --letter-spacing`；Dart `TpTokens.typography<Role>`（`TextStyle`）

## 1. 字体族 / Font Families

| 用途 | 首选 | 回退 | 备注 |
|---|---|---|---|
| 拉丁主字体 | **Inter**（变量字体，SIL OFL） | system-ui | 站点用 `@fontsource-variable/inter`；`font-feature-settings: 'cv11', 'ss01'` |
| Apple 平台 | SF Pro（度量与 Inter 相近，可作等价替代） | Inter | Flutter iOS 可直接用 `.SF Pro Text` |
| 简体中文 | PingFang SC | Noto Sans CJK SC | |
| 繁体中文（香港） | PingFang HK | Noto Sans CJK HK | |
| 印地语 | Noto Sans Devanagari | — | 站点用 `@fontsource-variable/noto-sans-devanagari` |
| 等宽 | ui-monospace | SF Mono, Menlo, Consolas | IP、密钥、兑换码 |

CSS 字体栈：

```css
--tp-font-family-sans: 'Inter Variable', Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;
--tp-font-family-sans-hk: 'Inter Variable', Inter, -apple-system, 'PingFang HK', 'PingFang TC', 'Hiragino Sans CNS', 'Microsoft JhengHei UI', 'Noto Sans HK', 'Noto Sans TC', sans-serif;
--tp-font-family-devanagari: 'Noto Sans Devanagari Variable', 'Noto Sans Devanagari', 'Nirmala UI', 'Kohinoor Devanagari', sans-serif;
--tp-font-family-mono: ui-monospace, 'SF Mono', Menlo, Consolas, 'Roboto Mono', monospace;
/* Tailwind：--font-sans / --font-sans-hk / --font-devanagari / --font-mono */
```

数字一律 `font-variant-numeric: tabular-nums`。

## 2. 字阶 / Type Scale

尺寸为拉丁基础 px 字号 / 行高；中文显示标题在 UI 样式层统一为 600 字重、零字距、1.3 行高，正文为 1.6 行高。原生端应应用同样的语言适配，而非直接照搬拉丁度量。

| token | 尺寸 | 字重 | 字距 | 用途 |
|---|---|---|---|---|
| `display-2xl` | 72 / 76 | 800 | -0.025em | 官网首屏 |
| `display-xl` | 64 / 68 | 800 | -0.02em | 官网首屏 |
| `display-lg` | 48 / 52 | 700 | -0.02em | 官网区块标题 |
| `display-md` | 40 / 44 | 700 | -0.02em | 官网次级 |
| `display-sm` | 32 / 40 | 700 | -0.01em | App 显示标题（「已连接」） |
| `title-lg` | 24 / 32 | 600 | -0.01em | 页面标题 |
| `title-md` | 20 / 28 | 600 | -0.005em | 模块标题 |
| `title-sm` | 18 / 26 | 600 | 0 | 卡片大标题 |
| `headline` | 16 / 24 | 600 | 0 | 卡片标题 / 列表主文字 |
| `body-lg` | 17 / 26 | 400 | 0 | 官网长文 |
| `body-md` | 16 / 24 | 400 | 0 | 官网默认正文 |
| `body` | 14 / 22 | 400 | 0 | App 正文（默认） |
| `body-sm` | 13 / 18 | 400 | 0 | 密集信息 |
| `label-lg` | 16 / 24 | 500 | 0 | 大按钮文字 |
| `label-md` | 14 / 20 | 500 | 0 | 按钮 / 表单标签 |
| `label-sm` | 12 / 16 | 500 | 0 | 小标签 / Tab |
| `caption` | 13 / 20 | 400 | 0 | 辅助说明、延迟与负载 |
| `overline` | 11 / 16 | 600 | +0.06em，大写 | 分组小标 |
| `numeric-lg` | 32 / 40 | 700，tabular | 0 | 网速 / 计时 |
| `numeric-md` | 24 / 32 | 700，tabular | 0 | 数据展示 |
| `numeric-sm` | 18 / 24 | 600，tabular | 0 | 列表数据 |
| `mono` | 13 / 20 | 400，等宽 | 0 | 代码 / IP |

## 3. 使用规则 / Usage

- 一屏最多三个层级：一个标题角色、一个正文角色、一个标签 / 说明角色。
- 官网首屏用 `display-xl` / `display-2xl`；App 内最大只到 `display-sm`。
- 按钮：sm 用 `label-md`，md 用 `label-md`，lg 用 `label-lg`。
- 列表主文字 `headline`，副文字 `body-sm` + `fg.secondary`。
- 分组小标 `overline` 用 `fg.muted`，大写只对拉丁文字生效。

## 4. CJK 与印地语 / CJK & Devanagari

| 规则 | 值 |
|---|---|
| CJK 正文行高 | 上调至 **1.6**（`body` 14px → 行高 22.4 ≈ 22；`body-md` 16px → 26） |
| CJK 字距 | 0（不套用拉丁的负字距） |
| CJK 字重 | 标题最多 **600**；禁止假粗体（faux bold） |
| CJK 标点 | 使用全角标点；中英文之间加一个空格（站点文案约定） |
| 印地语 | Noto Sans Devanagari；行高 ≥ 1.6，避免顶部符号被裁切；不用 `overline` 大写 |
| 西班牙语 | 文案平均比中文长 40–60%，按钮与 Tab 需预留 |

## 5. 数字 / Numerals

- 所有数字 `tabular-nums`，表格、计时、网速对齐不跳动。
- 网速 / 计时用 `numeric-lg`，数据面板 `numeric-md`，列表延迟 `numeric-sm`。
- 单位用 `label-sm` + `fg.secondary`，与数字基线对齐，间距 `space.1`（4px）。
- IP、密钥、兑换码用 `mono`，每 4 位加空格便于朗读。

## 6. 代码片段 / Snippets

```css
.title { font: 600 24px/32px var(--tp-font-sans); letter-spacing: -0.01em; }
/* 或 */
.title {
  font-size: var(--tp-typography-title-lg-font-size);
  line-height: var(--tp-typography-title-lg-line-height);
  font-weight: var(--tp-typography-title-lg-font-weight);
  letter-spacing: var(--tp-typography-title-lg-letter-spacing);
}
```

```tsx
<h1 className="text-title-lg text-fg-primary">节点</h1>
<span className="text-numeric-sm tabular-nums">42 ms</span>
```

```dart
Text('已连接', style: TpTokens.typographyDisplaySm);
```
