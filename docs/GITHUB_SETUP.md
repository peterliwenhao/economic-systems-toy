# GitHub 建仓与协作设置

本地 Git 仓库已经初始化，默认分支为 `main`，无需重新执行 `git init`。

## 项目负责人需要完成

1. 在 GitHub 新建一个 **private** 仓库，建议名称：`llm-economic-systems-toy`；
2. 建仓时不要勾选自动创建 README、`.gitignore` 或许可证；
3. 把仓库 URL 和张馨月、刘充的 GitHub 用户名交给 Codex，或按下面命令连接并推送；
4. 邀请两位成员，给张馨月创建/指派 T-001 Issue；
5. 为 `main` 开启分支保护：通过 Pull Request 合并，并至少需要一位 reviewer。

## 连接和首次推送

使用 SSH URL：

```bash
git remote add origin git@github.com:<owner>/llm-economic-systems-toy.git
git push -u origin main
```

或使用 HTTPS URL：

```bash
git remote add origin https://github.com/<owner>/llm-economic-systems-toy.git
git push -u origin main
```

首次推送后，把真实 URL 写入 `project/project.json` 的 `repositoryUrl`，并同步更新 `docs/HANDOFF.md`。

## 首个 Issue

- 标题：`[T-001] 形成研究设计草案 v0.1`
- Assignee：张馨月
- 正文来源：`docs/tasks/T-001.md`
- 建议分支：`task/T-001-research-design-v0`
- 交付文件：`docs/research-design-v0.1.md`
