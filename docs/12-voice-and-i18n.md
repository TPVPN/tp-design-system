# 语调与多语言 / Voice & i18n

> 站点路由：`/brand/voice` · 语言：zh-CN（源）、en、zh-HK、es、hi · 相关：[01-brand-principles.md](01-brand-principles.md)、[11-accessibility.md](11-accessibility.md) §6

## 1. 语调 / Voice

**直接、可信、克制。**

| 原则 | 做 | 不做 |
|---|---|---|
| 一标题一句话 | 「智能选路，自动连接最快节点」 | 「我们用先进的算法为您从全球数百个节点中挑选……」 |
| 说事实 | 「WireGuard 协议」「无日志」 | 「军事级加密」「100% 匿名」 |
| 不制造焦虑 | 「网络不可用」 | 「危险！你的数据正在泄露！」 |
| 不卖萌 | 「连接失败，请重试」 | 「哎呀，好像出了点小问题 🥺」 |
| 动作即按钮 | 「连接」「兑换」「查看套餐」 | 「点击这里开始」「Go!」 |
| 数字用阿拉伯数字 | 「8 台设备」 | 「八台设备」 |

标点：中文用全角标点；中英文、中文与数字之间加一个空格；省略号用「…」（单字符）；不用感叹号。

## 2. 术语 / Terminology

| 概念 | zh-CN | en | 备注 |
|---|---|---|---|
| 节点 | 节点 | Node / Location | 用户面用「节点」，不用「服务器」 |
| 线路场景 | 场景专线 | Scene line | auto / game / ai / exchange |
| 智能选路 | 智能选路 | Smart routing | 不译「AI 选路」 |
| 续期 | **续期** | Renew | 官网既有约定，不用「续费」 |
| 兑换码 | 兑换码 | Redeem code | |
| 套餐 | 套餐 | Plan | |
| 固定出口 IP | 固定出口 IP | Dedicated IP | 企业能力 |
| 无日志 | 无日志 | No-logs | |

## 3. 可宣称能力 / What We Can Claim

只宣称 BRIEF §2.9 列出的真实能力。

| 能力 | 可宣称 | 表述示例（zh-CN / en） |
|---|---|---|
| WireGuard 协议 | ✅ | 基于 WireGuard / Built on WireGuard |
| 智能选路 | ✅ | 自动选择最快节点 / Picks the fastest node automatically |
| 场景专线 auto / game / ai / exchange | ✅ | 游戏、AI、交易所专线 / Dedicated lines for gaming, AI and exchanges |
| 多设备 2 / 4 / 8 / 50 | ✅ | 最多 8 台设备同时使用 / Up to 8 devices at once |
| IEPL 优选 | ✅ | IEPL 优选线路 / IEPL premium routes |
| 固定出口 IP（企业） | ✅（企业套餐） | 固定出口 IP / Dedicated exit IP |
| 无日志 | ✅ | 不记录连接日志 / We don't keep connection logs |
| Kill Switch | ❌ | — |
| 分流 / 分应用代理 | ❌ | — |
| 广告拦截 | ❌ | — |
| 桌面端 | ❌（未上线） | — |
| 「全球最快」「100% 安全」「军事级」 | ❌ | 绝对化表述一律不用 |

## 4. 五语言 UI 文案对照 / UI Strings

| 键 | zh-CN | en | zh-HK | es | hi |
|---|---|---|---|---|---|
| `connect` | 连接 | Connect | 連線 | Conectar | कनेक्ट करें |
| `connecting` | 连接中… | Connecting… | 連線中… | Conectando… | कनेक्ट हो रहा है… |
| `connected` | 已连接 | Connected | 已連線 | Conectado | कनेक्ट हो गया |
| `disconnect` | 断开 | Disconnect | 斷開 | Desconectar | डिस्कनेक्ट करें |
| `disconnected` | 未连接 | Not connected | 未連線 | Sin conexión | कनेक्ट नहीं है |
| `nodes` | 节点 | Nodes | 節點 | Nodos | नोड |
| `home` | 首页 | Home | 首頁 | Inicio | होम |
| `me` | 我的 | Me | 我的 | Yo | मेरा |
| `search.placeholder` | 搜索国家、城市或节点 | Search countries, cities or nodes | 搜尋國家、城市或節點 | Buscar países, ciudades o nodos | देश, शहर या नोड खोजें |
| `error.retry` | 连接失败，请重试 | Couldn't connect. Try again. | 連線失敗，請重試 | No se pudo conectar. Inténtalo de nuevo. | कनेक्ट नहीं हो सका। फिर से कोशिश करें। |
| `retry` | 重试 | Try again | 重試 | Reintentar | फिर से कोशिश करें |
| `plans` | 套餐 | Plans | 套餐 | Planes | प्लान |
| `plan.recommended` | 推荐 | Recommended | 推薦 | Recomendado | अनुशंसित |
| `plan.renew` | 续期 | Renew | 續期 | Renovar | नवीनीकरण करें |
| `redeem.code` | 兑换码 | Redeem code | 兌換碼 | Código de canje | रिडीम कोड |
| `redeem` | 兑换 | Redeem | 兌換 | Canjear | रिडीम करें |
| `redeem.invalid` | 兑换码无效或已使用 | This code is invalid or already used | 兌換碼無效或已使用 | El código no es válido o ya se ha usado | यह कोड अमान्य है या पहले ही उपयोग हो चुका है |
| `latency` | 延迟 | Latency | 延遲 | Latencia | लेटेंसी |
| `load` | 负载 | Load | 負載 | Carga | लोड |
| `smart.routing` | 智能选路 | Smart routing | 智能選路 | Enrutamiento inteligente | स्मार्ट रूटिंग |
| `offline` | 网络不可用 | No internet connection | 網絡不可用 | Sin conexión a internet | इंटरनेट कनेक्शन नहीं है |
| `clear.search` | 清除搜索 | Clear search | 清除搜尋 | Borrar búsqueda | खोज साफ़ करें |

规则：

- zh-HK 用香港繁体用词（「連線」「搜尋」「網絡」），不是简繁机械转换。
- es 使用中性西班牙语，第二人称 tú（「Inténtalo」）。
- hi 动作按钮用敬语「करें」；保留英文外来词音译（「नोड」「प्लान」「रिडीम」）。
- en 省略号用单字符「…」；错误文案用缩略「Couldn't」保持口语。

## 5. 长度预算 / Length Budget

| 位置 | zh-CN 参考 | 预留 |
|---|---|---|
| Tab 标签 | 2 字 | es / hi 最多 10 字符；超出改图标 + 短词 |
| 按钮 md | ≤ 6 字 | es 平均 +50%；按钮允许换行 = 否，需截断前改文案 |
| 连接状态标题 `display-sm` | 3 字 | hi「कनेक्ट हो रहा है…」需两行，`display-sm` 行高 40 已预留 |
| Toast | ≤ 20 字 | 允许两行 |

## 6. 实现 / Implementation

- App：slang（`lib/core/i18n/*.i18n.json`），键名与本文一致。
- 官网：next-intl（`messages/<locale>/*.json`）。
- 站点：本文表格即数据源；新增键先在本文登记再翻译。
