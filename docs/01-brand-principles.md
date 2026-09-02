# 品牌原则 / Brand Principles

> 站点路由：`/`（概览）· 相关：[02-logo.md](02-logo.md)、[04-color.md](04-color.md)、[12-voice-and-i18n.md](12-voice-and-i18n.md)

## 1. 定位 / Positioning

TP VPN 是一款基于 **WireGuard** 的商业 VPN，面向需要稳定、快速、可信连接的个人与团队用户。产品线覆盖 iOS / Android（Flutter）App、官网、后台管理、未来桌面端，以及营销物料与应用商店素材。

品牌要传达的三个词：

| 关键词 | 含义 | 在设计中的体现 |
|---|---|---|
| 可信 | 无日志、协议透明、状态明确 | 单一品牌蓝、克制的语气、真实的能力描述 |
| 快 | 智能选路、IEPL 优选、连接一步完成 | 轻盈的界面、一键连接、动效短促 |
| 清晰 | 用户随时知道自己是否被保护 | 连接状态四色唯一来源、大字阶显示「已连接」 |

## 2. 设计原则 / Design Principles

| 原则 | 英文 | 释义 | 检查问题 |
|---|---|---|---|
| **可信** | Trustworthy | 视觉稳定、状态明确、不做花哨效果；文案只说做得到的事 | 用户能在 1 秒内判断自己是否已连接吗？有没有夸大宣称？ |
| **清晰** | Clear | 一屏一个主任务；字阶层级分明；单一强调色引导视线 | 这一屏最重要的操作只有一个吗？次要信息是否退到 slate-600 / 500？ |
| **轻快** | Light | 大量留白、细边框、浅阴影；动效 100–300ms，退出比进入更快 | 去掉这个阴影 / 渐变 / 动画，界面会变差吗？不会就去掉 |
| **一致** | Consistent | 所有平台从同一份 token 取值；命名、尺寸、状态色跨端一致 | 这个值在 token 里有吗？没有就先加 token，不要写死 |

## 3. 视觉标准 / Visual Standard

- **Light Mode Only**。不做暗色模式，不添加任何 `.dark` 或 `prefers-color-scheme: dark` 样式。
- 页面底色 `neutral.25 = #FAFBFF`（带一点蓝的白）；卡片白底 + `slate-200` 描边 + `level-1` 阴影。
- **单一强调色**：品牌蓝 `#1677FF`。cyan / purple / mint / pink 只用于场景标签、数据可视化与渐变，绝不作第二主色。
- 阴影用蓝灰环境光 `rgb(15 23 42 / α)`，不用纯黑。
- 参考质感：Vercel Geist、Linear、Stripe、Apple HIG 文档站。

禁止：玻璃拟态（站点顶部导航的毛玻璃是唯一例外）、彩虹渐变、卡通插画、大面积饱和色块、装饰性动画。

## 4. 语调 / Voice

直接、可信、克制。一标题一句话；不用感叹号堆砌情绪；不宣称没有的能力。详见 [12-voice-and-i18n.md](12-voice-and-i18n.md)。

| 做 | 不做 |
|---|---|
| 「已连接」 | 「太棒了！你已经安全了！」 |
| 「连接失败，请重试」 | 「哎呀，出了点问题…」 |
| 「智能选路自动为你挑选最快节点」 | 「军事级加密，全球最快 VPN」 |

## 5. 适用范围 / Scope

| 表面 | 取值来源 |
|---|---|
| Flutter App（iOS / Android） | `packages/tokens/dist/dart/tp_tokens.dart` |
| 官网 tp-web（Next.js） | `@tpvpn/tokens/tailwind` |
| 后台 tp-admin | `@tpvpn/tokens/css` 或 Tailwind |
| 原生 iOS / Android 扩展 | `TPTokens.swift` / `TpTokens.kt` / `colors.xml` |
| Figma | `dist/figma/tokens.json`（Tokens Studio） |
| 营销 / 印刷 | `packages/brand/dist/packs/*.zip` |
