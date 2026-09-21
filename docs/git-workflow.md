# Git 与任务工作流

## 不可违反的规则

- `main` 只保存已经评审、可复现、可交接的团队基线，任何成员及其 AI/Codex 都不得直接在 `main` 上开发或提交。
- 每次开始任务前，必须先确认当前分支不是 `main`，并记录任务编号与基线 commit。
- 一个任务对应一个独立分支和一个负责人；AI 只能在当前用户自己的任务分支上修改文件。
- 不得切换、重写、强推、合并或删除他人的分支；不得擅自处理他人的未提交修改。
- 不使用 `git push --force`、`git reset --hard` 或绕过分支保护。确需例外时，由李文浩明确批准并在项目记录中说明。
- 所有进入 `main` 的修改都通过 Pull Request；至少一名未参与实现的成员评审，自动检查通过后才合并。

AI/Codex 开始任何写操作前应执行并检查：

```bash
git status --short --branch
git branch --show-current
git fetch origin
```

如果当前分支是 `main`，AI 必须先停止写操作，并根据任务编号从最新 `origin/main` 创建自己的分支。若工作区存在不属于当前任务的修改，AI 不得自行移动、覆盖或删除，应先向用户报告。

## 任务状态

```text
待讨论 → 可开始 → 进行中 → 待评审 → 已完成
                    ↘ 阻塞 ↗
```

GitHub Issue 使用以下标签：

- 状态：`status:proposed`、`status:ready`、`status:in-progress`、`status:review`、`status:blocked`、`status:done`
- 优先级：`priority:p0`、`priority:p1`、`priority:p2`
- 模块：`module:<name>`

每个 Issue 最多有一个 `status:*` 和一个 `priority:*` 标签。负责人使用 GitHub assignee，不在标题中重复维护。

## 分支

```text
task/T-023-data-loader
fix/T-031-empty-batch
docs/T-042-evaluation-protocol
```

- 一个任务一个分支；分支属于任务负责人，不是共享编辑区。
- 默认从最新 `origin/main` 创建；只有任务明确记录了其他基线 commit 时才例外。
- 不在另一个成员正在使用的分支上继续工作。
- 同一分支不能同时在两个 Git worktree 中检出。

标准开始方式：

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c task/T-023-data-loader
```

开始修改前再次运行 `git branch --show-current`。看到 `main` 就不要继续。

如果 `main` 在任务进行期间更新，优先在自己的分支上合入最新基线：

```bash
git fetch origin
git rebase origin/main
```

已经由多人共同使用的分支不要随意 rebase；这类情况改用 `git merge origin/main`，并在 PR 中说明。发生冲突时由该任务负责人处理，不把冲突直接推给其他成员。

## Commit

推荐格式：

```text
T-023: implement deterministic data split
T-023: document loader output schema
```

Commit 描述事实，不写“update”“changes”等无法审计的笼统信息。不要把多个无关任务压进同一个 commit。

## Pull Request

PR 必须关联任务，并提供：

- 实际完成的范围；
- 对接口和研究结论的影响；
- 运行过的检查及结果；
- 实验 run ID 或“不需要实验”的说明；
- 未解决问题、风险和后续任务。

至少一位未参与实现的合作者评审后再合并。主分支保护应在 GitHub 仓库设置中强制执行，`AGENTS.md` 本身不是权限控制。

## 合并之后

1. 将任务状态改为 `status:done`。
2. 若形成团队决定，提交或更新 `docs/decisions/`。
3. 在 `records/history.json` 添加一条简洁、经确认的时间线记录。
4. 依赖该任务的负责人同步最新主分支，并检查旧实验是否过期。
5. 删除已合并的远端任务分支；下一项任务重新从最新 `main` 建新分支，不沿用旧任务分支。

## 会议前后

会议前不建立“汇总用 dev”，也不把未完成分支为了展示而合并。每位负责人应在自己的分支上提交并 push，更新对应 Issue/PR 的状态、完成内容、阻塞和待决策问题。会议材料可以直接引用 PR、commit 或实验 run。

会议中决定是否合并的标准是任务本身是否达到验收条件，而不是会议日期。未经评审或尚不可复现的内容继续留在原任务分支。

会议后：

1. 把决策写入 `docs/meetings/` 或 `docs/decisions/`；
2. 合格 PR 合并到 `main`；
3. 所有人更新本地 `main`；
4. 每个新任务从更新后的 `main` 新建全新分支。

本项目默认不维护长期 `dev` 分支。只有多个已基本完成的 PR 必须联合验证、且无法分别验证时，才临时建立 `integration/<milestone>`；验证完成后通过 PR 合入 `main` 并删除，不把它变成第二条长期主线。
