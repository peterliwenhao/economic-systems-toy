# Git 与任务工作流

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

- 一个任务一个分支。
- 从任务记录的基线 commit 或团队指定主分支创建。
- 不在另一个成员正在使用的分支上继续工作。
- 同一分支不能同时在两个 Git worktree 中检出。

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
