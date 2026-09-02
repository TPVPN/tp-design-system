## 变更说明 / Summary

<!-- 做了什么、为什么。关联 issue：Closes #… -->

## 变更类型 / Type

- [ ] token（`packages/tokens/src`）
- [ ] 品牌资产（`packages/brand/src`）
- [ ] 组件（`packages/ui`）
- [ ] 文档站（`apps/site`）
- [ ] 规范文档（`docs/`）
- [ ] CI / 仓库配置

## 自查清单 / Checklist

- [ ] 与 `docs/BRIEF.md` 一致；如有冲突已先更新 BRIEF
- [ ] 改动 token 或 Logo 源后已重新构建并**提交 `packages/*/dist`**
- [ ] `pnpm build:tokens && pnpm build:brand && pnpm typecheck && pnpm build:site` 本地通过
- [ ] 无暗色模式样式；无新增依赖（或已在下方说明理由与许可证）
- [ ] 文字对比度 ≥ 4.5:1（大字 ≥ 3:1），键盘可达，`aria-*` 完整
- [ ] 站点相关页面与 `docs/*.md` 已同步
- [ ] `CHANGELOG.md` 的 `[Unreleased]` 已记录
- [ ] token 删除 / 重命名：已按 `docs/14-governance.md` 标记废弃并说明迁移路径

## 截图 / Screenshots

<!-- UI 变更请附 before / after；涉及多语言请附 zh-CN 与 en 至少两种。 -->

## 破坏性变更 / Breaking changes

<!-- 无则写「无」。 -->
