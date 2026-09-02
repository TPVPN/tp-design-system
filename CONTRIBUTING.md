# 贡献指南 / Contributing

感谢参与 TP VPN Design System。本仓库是全部产品线的视觉事实来源，改动会同时影响 App、官网、后台与营销物料，因此流程比一般前端仓库更严格。

## 1. 开始之前

- 阅读 [`docs/BRIEF.md`](docs/BRIEF.md)。所有数值、命名和契约以它为准；发现冲突先修 BRIEF，再改代码。
- 环境：Node ≥ 20.9（推荐 24）、pnpm 11（`corepack enable` 后自动使用 `package.json` 中的 `packageManager`）。
- `pnpm install && pnpm build && pnpm dev` 能跑通再动手。

## 2. 分支与提交

- 从 `main` 切分支：`feat/<scope>-<topic>`、`fix/<scope>-<topic>`、`docs/<topic>`。
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)，scope 用包名：`feat(tokens): …`、`fix(ui): …`、`feat(brand): …`、`docs(site): …`、`chore(ci): …`。
- 一个 PR 只做一件事。token 变更与组件变更请拆开提交，便于评审与回滚。

## 3. 改动分类与要求

| 类型 | 必须做 | 评审人 |
|---|---|---|
| token 数值 / 新增 | 更新 `packages/tokens/src/**`，运行 `pnpm build:tokens`，**提交 `dist/`**；在 `docs/` 对应表格同步；CHANGELOG 记录 | 设计负责人 + 前端负责人 |
| token 删除 / 重命名 | 上述 + 先经过废弃期（见 [`docs/14-governance.md`](docs/14-governance.md)）；主版本号 +1 | 设计负责人 + 各平台负责人 |
| Logo / 品牌资产 | 改 `packages/brand/src/**`，运行 `pnpm build:brand`，提交 `dist/`；更新 `docs/02-logo.md` / `03-app-icon.md` | 设计负责人 |
| 组件 | 保持 shadcn API；props 有 TS 类型与 JSDoc；`data-slot`；键盘可达；对比度 ≥ 4.5:1；站点对应页面同步 | 前端负责人 |
| 文档 | 中文为主、英文副标题；数值只引用 BRIEF，不新造 | 任一维护者 |

## 4. 本地校验（提 PR 前）

```bash
pnpm build:tokens
pnpm build:brand
pnpm typecheck
pnpm build:site
git status --porcelain packages/tokens/dist packages/brand/dist   # 应为空
```

CI 会执行同样的步骤，并在生成产物过期时失败。

## 5. 代码风格

- ESM（所有包 `"type": "module"`），TypeScript strict，`noUnusedLocals` / `noUnusedParameters` 开启。
- Prettier：单引号、分号、行宽 110（`.prettierrc`）；缩进 2 空格（`.editorconfig`）。
- 文件与 token 名一律小写 kebab-case；React 组件文件 `PascalCase.tsx` 放在 `components/tp/`，shadcn 基础组件保持 `components/ui/<name>.tsx`。
- **仅 light 模式**：不得添加 `.dark`、`prefers-color-scheme: dark` 或任何暗色样式。
- 不引入新依赖，除非 PR 描述里说明理由与许可证。

## 6. 质量门槛

PR 合并前必须满足 BRIEF §6：构建与 `tsc --noEmit` 零错误、无 console error、对比度达标、键盘可达、所有下载链接指向真实文件、360px 无横向滚动。

## 7. 提交 Issue

- 设计需求：使用「设计需求」模板，说明场景、涉及平台与期望效果。
- 缺陷：使用「缺陷」模板，附复现步骤、平台、截图与 token / 组件名。

---

**English** — Read `docs/BRIEF.md` first; it is the single source of truth. Use Node ≥ 20.9 and pnpm 11. Branch from `main`, write Conventional Commits with the package as scope, keep token changes in their own PR, rebuild and commit `packages/*/dist` when sources change, run `pnpm build:tokens && pnpm build:brand && pnpm typecheck && pnpm build:site` before opening a PR, and never add dark-mode styles. Removing or renaming a token requires a deprecation period and a major version bump (see `docs/14-governance.md`).
