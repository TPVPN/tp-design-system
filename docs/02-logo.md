# Logo / Logo

> 站点路由：`/brand/logo` · 源文件：`packages/brand/src/logo/*.svg` · 产物：`packages/brand/dist/logo/` · 许可：[`LICENSE-BRAND.md`](../LICENSE-BRAND.md)

## 1. 构成 / Construction

### 1.1 图形（mark）

源自 Figma 官方标识（tp-web `public/brand/logo-mark.svg`）。

| 属性 | 值 |
|---|---|
| 画布 | 66 × 66 |
| 圆角 | `rx = 15.84`（= 边长 × 0.24） |
| 填充 | `#1677FF`（blue-500） |
| 字形 | 白色 TP 合体字形，42.24 × 35.64，偏移 (11.85, 17.08) |
| 字形 path | **原样复制**官方 path 数据，不得重绘、不得改动锚点 |

### 1.2 字标（wordmark）

| 属性 | 值 |
|---|---|
| 文字 | `TP VPN` |
| 字体 | Inter Bold 700（`packages/brand/fonts/Inter-Bold.ttf`） |
| 字号 | 图形高度 × 0.56 |
| 字间距 | -0.02em |
| 颜色 | `#0F172A`（slate-900） |
| 输出 | **必须描边为 path**（`text-to-svg` 生成），不得依赖系统字体 |

### 1.3 组合关系

| 属性 | 值 |
|---|---|
| 图形与字标间距 | 图形高度 × 0.18 |
| 对齐 | 字标基线与图形垂直居中 |
| 堆叠版 | 图形居上、字标居下居中，间距同上 |

## 2. 变体 / Variants

文件名前缀 `tp-vpn-logo-`。

| 变体 | 文件名 | 图形 | 字标 | 适用背景 |
|---|---|---|---|---|
| 横版（主） | `tp-vpn-logo-horizontal` | 蓝底白字形 | slate-900 | 白 / 浅色 |
| 横版反白 | `tp-vpn-logo-horizontal-reversed` | **白底、字形填 `#1677FF`** | 白 | `#1677FF` / 深色 |
| 堆叠 | `tp-vpn-logo-stacked` | 蓝底白字形 | slate-900，居中 | 白 / 浅色，方形位 |
| 仅图形 | `tp-vpn-logo-mark` | 蓝底白字形 | — | 任意浅色 |
| 单色黑 | `tp-vpn-logo-mark-mono-black` | 黑方块、字形镂空 | — | 单色印刷、浅底 |
| 单色白 | `tp-vpn-logo-mark-mono-white` | 白方块、字形镂空 | — | 深底、照片压暗区域 |
| 仅字标 | `tp-vpn-logo-wordmark` | — | slate-900 | 图形已单独出现时 |

每个变体提供 `svg`（`dist/logo/svg/`）与 PNG（`dist/logo/png/`）：`@1x` 横版 / 堆叠 / 字标宽 1024 px、图形 512 px；`@2x` 尺寸加倍（2048 / 1024 px）。

## 3. 安全空间 / Clear Space

- 四周最小安全空间 **X = 图形高度 × 0.5**（即 Logo 高度的一半）。
- 安全空间内不得出现文字、图形、其他标识或画面主体。
- 放在按钮或卡片内时，容器内边距 ≥ X。

## 4. 最小尺寸 / Minimum Size

| 场景 | 图形 | 横版整体 |
|---|---|---|
| 屏幕 | ≥ 24 px | ≥ 96 px 宽 |
| 印刷 | ≥ 8 mm | ≥ 32 mm 宽 |

低于最小尺寸时改用 `mark`（仅图形）。

## 5. 禁用示例 / Misuse

站点以真实 SVG 变形演示以下 8 条，均**禁止**：

| # | 禁止 | 说明 |
|---|---|---|
| 1 | 拉伸 / 压扁 | 只允许等比缩放 |
| 2 | 改色 | 不得改为绿、红、黑（单色版除外）或渐变 |
| 3 | 改布局 | 字标不得置于图形上方、左侧；不得改字体 |
| 4 | 加投影 | Logo 本身不带阴影或发光 |
| 5 | 旋转 / 倾斜 | 任何角度都不允许 |
| 6 | 复杂图片背景 | 需要时先压暗并使用 `mark-mono-white` |
| 7 | 加描边 | 不得给方块或字形加轮廓线 |
| 8 | 低对比底色 | 蓝底上用蓝 Logo、浅灰底用白 Logo 等 |

## 6. 文件清单与用途 / Files & Usage

| 路径 | 格式 | 用途 |
|---|---|---|
| `packages/brand/src/logo/*.svg` | SVG（源） | 设计与开发引用；网站内联 |
| `packages/brand/dist/logo/png/*@1x.png` · `*@2x.png` | PNG | 邮件、文档、第三方平台 |
| `packages/brand/dist/packs/tp-vpn-logo-pack.zip` | ZIP | 对外分发 Logo 包（SVG + PNG + README + 品牌许可） |
| `packages/brand/dist/packs/tp-vpn-brand-assets-all.zip` | ZIP | 品牌全包（Logo + App Icon + 社交图 + 字体 + 国旗） |
| 站点 `/downloads` | — | 在线下载中心，显示大小与清单 |

## 7. 场景选型 / Which File Where

| 场景 | 使用文件 | 说明 |
|---|---|---|
| 网站头部（浅底） | `tp-vpn-logo-horizontal.svg` | 高度 28–32 px，链接回首页；`alt="TP VPN"` |
| 网站页脚 / 蓝底 Banner | `tp-vpn-logo-horizontal-reversed.svg` | 蓝底或深底 |
| App 启动页 | `tp-vpn-logo-stacked` 或 `mark` | 居中；底色 `#FAFBFF` 或 `#1677FF`（用反白） |
| App Icon / 应用商店 | 见 [03-app-icon.md](03-app-icon.md) | 图标本体即圆角方块，**不要**再叠圆角 |
| 社交头像 | `dist/social/avatar-1024.png` | mark 居中于白底圆内 |
| OG / 分享图 | `dist/social/og-default.png` | 1200 × 630 |
| 邮件签名 | `dist/logo/png/tp-vpn-logo-horizontal@2x.png` | 显示高度 24–32 px |
| 印刷（彩色） | `tp-vpn-logo-horizontal.svg` / `stacked.svg` | CMYK 近似：`#1677FF` → C91 M53 Y0 K0 |
| 印刷（单色） | `tp-vpn-logo-mark-mono-black.svg` | 雕刻、压印、单色丝印 |
| 深色照片上 | `tp-vpn-logo-mark-mono-white.svg` | 先压暗背景保证对比 |
