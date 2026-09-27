# GitHub 建仓与协作设置

GitHub 仓库已创建：`git@github.com:peterliwenhao/economic-systems-toy.git`。本地 Git 仓库已经初始化，默认分支为 `main`，无需重新执行 `git init`。

## 项目负责人需要完成

1. 确认张馨月、刘充已接受邀请，并将二人的 GitHub 用户名补入 `project/team.json`；
2. 给张馨月创建/指派 T-001 Issue；
3. 为 `main` 开启分支保护：通过 Pull Request 合并，并至少需要一位 reviewer；
4. 将 `validate-template` 设置为 required status check；
5. 禁止 force push 和删除 `main`。

## 连接和首次推送

使用 SSH URL：

```bash
git remote add origin git@github.com:peterliwenhao/economic-systems-toy.git
git push -u origin main
```

或使用 HTTPS URL：

```bash
git remote add origin https://github.com/peterliwenhao/economic-systems-toy.git
git push -u origin main
```

当前 `main` 已完成首次推送；剩余事项是成员接受邀请、分支保护、required check 和首个 Issue。

## 首个 Issue

- 标题：`[T-001] 形成研究设计草案 v0.1`
- Assignee：张馨月
- 正文来源：`docs/tasks/T-001.md`
- 建议分支：`task/T-001-research-design-v0`
- 交付文件：`docs/research-design-v0.1.md`
