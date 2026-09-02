# 治理 / Governance

> 站点路由：`/changelog` · 相关：[`../CONTRIBUTING.md`](../CONTRIBUTING.md)、[`../CHANGELOG.md`](../CHANGELOG.md)

## 1. 事实来源与角色 / Source of Truth & Roles

- `docs/BRIEF.md` 是唯一事实来源；`docs/*.md` 是它的展开；`packages/tokens/src` 是它的机器可读形式；站点是它的可视化。四者冲突时按此顺序修正。
- 角色：**设计负责人**（品牌、色彩、字阶、组件视觉）、**前端负责人**（`@tpvpn/ui`、站点、token 工程）、**平台负责人**（Flutter / iOS / Android 各一，负责消费与反馈）。

## 2. 版本 / Versioning

整个仓库共用一个语义化版本号（`package.json` 与各包 `version` 同步），tag `v<major>.<minor>.<patch>`。

| 变更 | 级别 |
|---|---|
| 删除 / 重命名任一 semantic 或 component token；改变 token 类型；Logo 构成或品牌蓝值变化；组件 props 破坏性变更 | **major** |
| 新增 token、新增输出格式、新组件、新变体、新资产 | **minor** |
| 数值微调且不改契约（阴影透明度、动效时长 ±50ms、文档修订、构建修复） | **patch** |

primitives 层不是公开 API，但删除会连带影响引用，按 semantic 规则处理。

## 3. 变更流程 / Change Process

```
提出（Issue：设计需求 / 缺陷）
  → 讨论并落 BRIEF（若涉及数值、命名、契约）
  → PR：源 + dist + docs + CHANGELOG [Unreleased]
  → 评审（见 §4）
  → 合并 main → CI → Pages 自动部署
  → 发布：更新版本号、CHANGELOG 定版、打 tag、GitHub Release 附下载包
```

## 4. Token 变更评审 / Token Review

| 检查项 | 说明 |
|---|---|
| 三层归位 | 原始值只进 primitives；业务含义进 semantic；组件私有进 component |
| 命名 | 小写 kebab；路径遵循 `color.<group>.<name>`、`size.<group>.<name>` 等既有分组；不出现平台词（`ios`、`web`） |
| 引用 | semantic / component 必须用 `{path}` 引用，不写死 hex |
| 对比度 | 新增文字色 / 底色组合 ≥ 4.5:1（大字 3:1），在 [11-accessibility.md](11-accessibility.md) 登记 |
| 全平台产物 | `pnpm build:tokens` 后 8 种产物均更新并提交；Dart / Swift / Kotlin 命名通过编译 |
| 文档 | 对应 `docs/*.md` 表格同步；站点页面同步 |
| 影响面 | 列出消费方（tp-app / tp-web / tp-admin / Figma）并通知平台负责人 |

评审人：token 数值 → 设计负责人 + 前端负责人；删除 / 重命名 → 额外加各平台负责人。

## 5. 废弃策略 / Deprecation

1. 在 token 源加 `"$deprecated": "use color.fg.secondary"`（或 `$description` 前缀 `DEPRECATED:`），构建产物在注释 / `$description` 中保留提示。
2. 旧名与新名**同时存在一个 minor 版本**（≥ 4 周），旧名值指向新名。
3. CHANGELOG `Deprecated` 段列出映射表；站点 token 表以 `neutral` Tag 标「已废弃」。
4. 下一个 major 移除旧名，CHANGELOG `Removed` 段记录。
5. 组件 props 废弃同理：`@deprecated` JSDoc + 运行时不报错 + 一个 minor 过渡。

## 6. 品牌资产变更 / Brand Asset Changes

- Logo 图形 path、圆角比、品牌蓝任一变化 = major，需设计负责人书面确认。
- 新增变体或尺寸 = minor；仅重新导出 = patch。
- 变更后 `pnpm build:brand` 重新生成全部 PNG / ZIP 并提交；更新 `LICENSE-BRAND.md` 引用的规范版本。

## 7. 发布清单 / Release Checklist

- [ ] `pnpm build` 与 `pnpm typecheck` 零错误；CI 绿
- [ ] `CHANGELOG.md` `[Unreleased]` 移入新版本并标日期
- [ ] 根 `package.json` 与四个包 `version` 更新
- [ ] 站点 `/changelog` 与首页版本号同步
- [ ] `git tag v<version>` 并推送；GitHub Release 附 `packages/brand/dist/packs/*.zip` 与 Token 包
- [ ] 通知各平台负责人升级（附 [13-platform-integration.md](13-platform-integration.md) §8）

## 8. 支持与反馈 / Support

- 用法问题：先查站点与 `docs/`；仍不明确 → Issue（设计需求模板）。
- 错误：Issue（缺陷模板），注明 token / 组件名与版本。
- 紧急品牌事项：直接联系设计负责人，并补 Issue 记录。
