# 模式 / Patterns

> 站点路由：`/patterns/connection` · `/patterns/nodes` · `/patterns/states` · `/patterns/subscription` · 相关：[09-components.md](09-components.md)、[12-voice-and-i18n.md](12-voice-and-i18n.md)

## 1. 连接流程 / Connection Flow

### 1.1 三态时序

```
disconnected ──点击──▶ connecting ──成功──▶ connected
     ▲                    │                    │
     │                 失败/超时             点击断开
     └──── error(toast) ◀─┘                    │
     └─────────────────────────────────────────┘
```

| 状态 | 按钮 | 颜色（`state.*`） | 标题（`display-sm`） | 副文字 | 动效 |
|---|---|---|---|---|---|
| disconnected | 白底、slate-200 描边、Power 图标 slate-400 | `#94A3B8` | 未连接 | 点击连接 | 无 |
| connecting | 蓝底 `blue-500`、外环旋转 + 呼吸 | `#1677FF` | 连接中… | 正在选择最快节点 | `connect` 1200ms 循环 |
| connected | `gradient.connected` + `brand-glow-lg` | `#22C55E` 状态点 | 已连接 | 节点名 · 计时 `numeric-md` | 进入 `spring` 300ms |
| error | 回到 disconnected + Toast | `#EF4444` | 未连接 | 连接失败，请重试 | Toast 200ms |

### 1.2 规则

- 连接按钮直径 128（手机）/ 160（平板 / 桌面），始终是首页唯一主操作。
- connecting 超时 **15s** 判定失败；失败后按钮回到 disconnected，用 Toast（error）提示，文案见 [12-voice-and-i18n.md](12-voice-and-i18n.md)。
- 连接成功后显示计时（`00:00:00`，`numeric-md`，tabular）与节点摘要卡（`NodeSummaryCard` = NodeCard 简化版）。
- 断开需二次确认？**不需要**；点击即断开，但按钮按压反馈 100ms。
- 首页状态栏 / App bar 不再重复显示状态色，避免双重强调。
- 禁止：连接中显示进度百分比（无真实进度）；连接成功弹全屏庆祝动画。

### 1.3 计时与流量

- 计时 `HH:MM:SS`；超过 24h 显示 `1d 02:03:04`。
- 流量 `UsageMeter`：已用 / 总量，单位自适应 MB / GB，保留 1 位小数。

## 2. 节点列表 / Node List

### 2.1 结构

1. `SearchBar`（占位「搜索国家、城市或节点」），sticky 顶部。
2. 场景 Tag 过滤行（auto / game / ai / exchange），横向滚动。
3. 分组：按国家 / 地区分组（`overline` 小标），组内 `CountryListItem` 或 `NodeCard`。
4. 推荐区「智能选路」置顶，用 `globe` + `bg.brand-subtle`。

### 2.2 延迟着色（全产品统一）

| 延迟 | 颜色 | token | 信号格 |
|---|---|---|---|
| < 80 ms | 绿 | `green.500 #22C55E` / 文字 `green.700 #15803D` | 4 格 |
| 80–180 ms | 黄 | `amber.500 #F59E0B` / 文字 `amber.700 #B45309` | 2–3 格 |
| > 180 ms | 红 | `red.500 #EF4444` / 文字 `red.700 #B91C1C` | 1 格 |
| 超时 / 未测 | 灰 | `slate.400 #94A3B8` | 0 格，显示「—」 |

信号格：4 格；120–180 显示 2 格，80–119 显示 3 格。

### 2.3 排序与元数据

- 默认按延迟升序；「优质节点」badge 优先。
- 每项三段元数据：延迟 `42 ms` · 丢包 `0.1%` · 负载 `35%`，`numeric-sm` + `label-sm` 单位。
- 负载 > 80% 用 amber 文字，> 95% 用 red。
- 选中态左侧 3px 蓝条（`border.brand`），背景 `bg.brand-subtle`。

### 2.4 空态

- 搜索无结果：`search` 图标 48 `fg.placeholder` + 「没有找到「{query}」」+ 按钮「清除搜索」。
- 列表为空（未登录 / 无套餐）：`crown` 图标 + 「订阅后即可使用全部节点」+ 主按钮「查看套餐」。

## 3. 空态 / 错误 / 加载 / Empty · Error · Loading

| 状态 | 组件 | 规则 |
|---|---|---|
| 加载（首屏） | `LoadingState variant="skeleton"` | 骨架屏与内容布局一致；300ms 内完成则不显示；完成后 `slower` 800ms 交叉淡入 |
| 加载（操作） | `LoadingState variant="spinner"` | 按钮内 spinner 20px，文字不变，按钮 disabled |
| 成功 | `LoadingState variant="success"` | check 图标 `spring` 弹入，600ms 后自动关闭 |
| 空态 | 图标 48 + 标题 `headline` + 说明 `body-sm` + 一个动作 | 图标 `fg.placeholder`；只放一个主动作 |
| 错误（页面级） | 图标 `circle-x` red-500 + 标题 + 「重试」按钮 | 不显示技术错误码给用户；日志记录 |
| 错误（操作级） | Toast（error） | 3–5s 自动消失；可手动关闭 |
| 表单错误 | Input 描边 `border.error` + 下方 `caption` red-700 | 提交时校验，输入时清除 |
| 离线 | 顶部 banner amber | 「网络不可用」+ 自动恢复 |

## 4. 套餐与付费 / Plans & Payment

### 4.1 PlanCard 排布

- 手机：纵向堆叠，推荐套餐置顶并带 `brand` Tag「推荐」；卡片 `radius.lg`，推荐卡 `border.brand` 1.5px + `level-2`。
- 平板 / 桌面：横排 2–4 张，等高；推荐卡略高（上移 8px）。
- 卡片内容自上而下：套餐名 `title-sm` → 价格 → 计费周期 `caption` → 权益列表（check 图标）→ CTA（推荐用 primary，其他 secondary）。

### 4.2 价格排版

- 货币符号 `label-md` + 金额 `numeric-lg`（tabular）+ 周期 `caption fg.secondary`。示例：`¥ 28 /月`。
- 折扣：原价 `body-sm` 删除线 `fg.tertiary`，折扣 Tag `success`「省 30%」。
- 多设备数按 token 真实能力：**2 / 4 / 8 / 50**。
- 不做倒计时、闪烁、「仅剩 N 名额」等压迫性元素。

### 4.3 兑换码

- `Input` 等宽 `mono`，自动大写，每 4 位插入空格显示（存储时去空格）。
- 按钮「兑换」primary；成功 → `LoadingState success` + Toast「兑换成功」；失败 → 表单错误「兑换码无效或已使用」。
- 兑换码来源提示用 `caption`。

### 4.4 文案

- 「续期」而非「续费」（官网既有约定）。
- 权益只列可宣称能力（见 [12-voice-and-i18n.md](12-voice-and-i18n.md) §3）。
