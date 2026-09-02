# 规范文档索引 / Documentation Index

本目录是 TP VPN Design System 的**书面规范**，与文档站页面一一对应。所有数值来自 [`BRIEF.md`](BRIEF.md)（唯一事实来源）；若本目录任何文件与 BRIEF 冲突，以 BRIEF 为准并回写修正。

| # | 文件 | 主题 | 站点路由 |
|---|---|---|---|
| — | [BRIEF.md](BRIEF.md) | 设计与工程总纲（目标、品牌核心、token 契约、组件契约、站点 IA、质量门槛） | — |
| 01 | [01-brand-principles.md](01-brand-principles.md) | 品牌定位、四条设计原则、语调 | `/` |
| 02 | [02-logo.md](02-logo.md) | Logo 构成、变体、安全空间、最小尺寸、禁用示例、文件清单与场景选型 | `/brand/logo` |
| 03 | [03-app-icon.md](03-app-icon.md) | iOS / Android / Web 图标规格与导出清单 | `/brand/app-icon` |
| 04 | [04-color.md](04-color.md) | 全部色值、语义 token、对比度规则、70/20/10、禁忌 | `/brand/color` · `/foundations/color` |
| 05 | [05-typography.md](05-typography.md) | 字体、22 级字阶、CJK / 印地语规则、数字 | `/brand/typography` · `/foundations/typography` |
| 06 | [06-layout.md](06-layout.md) | 间距、圆角、栅格、断点、控件尺寸、z-index | `/foundations/spacing` |
| 07 | [07-elevation-motion.md](07-elevation-motion.md) | 5 级阴影与 glow、时长、缓动、动效原则 | `/foundations/elevation` · `/foundations/motion` |
| 08 | [08-iconography.md](08-iconography.md) | Lucide 规范、场景图标映射、圆形国旗 | `/foundations/iconography` |
| 09 | [09-components.md](09-components.md) | 18 个组件：用途、解剖、状态、尺寸、可达性、Flutter / iOS 对应 | `/components/*` |
| 10 | [10-patterns.md](10-patterns.md) | 连接流程、节点列表与延迟着色、空态 / 错误 / 加载、套餐与付费 | `/patterns/*` |
| 11 | [11-accessibility.md](11-accessibility.md) | 对比度矩阵、触控尺寸、焦点、动效、语言标记 | `/foundations/accessibility` |
| 12 | [12-voice-and-i18n.md](12-voice-and-i18n.md) | 语调、可宣称能力表、五语言 UI 文案对照 | `/brand/voice` |
| 13 | [13-platform-integration.md](13-platform-integration.md) | Web / Flutter / iOS / Android / Figma 接入步骤与代码 | `/platforms` |
| 14 | [14-governance.md](14-governance.md) | 版本、贡献流程、token 变更评审、废弃策略 | `/changelog` |
| — | [STATUS.md](STATUS.md) | 项目状态：集成核查、通过的命令、占位页面、与 BRIEF 的偏差 | — |

## 写作约定 / Conventions

- 中文为主，每个标题附英文副标题（例：「色彩系统 / Color System」）。
- 数值只引用 BRIEF，不新造；表格优先于长段落。
- token 名、文件名、代码一律英文 kebab-case，行内用反引号。
- 每份文档顶部注明对应站点路由与相关 token 文件，便于站点引用表格数据。
