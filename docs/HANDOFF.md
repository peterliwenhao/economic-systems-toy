# 项目交接入口

更新时间：2026-09-21

## 当前状态

- 已有一批 LLM 社会模拟、Agent 框架和记忆系统调研材料；
- 已建立三人团队角色、Git/Codex 协作规范、Dashboard、决策/会议模板和实验 manifest；
- 当前唯一已启动团队任务是 **T-001：形成研究设计草案 v0.1**，负责人为张馨月；
- 尚未进入正式代码实现或实验阶段；
- GitHub 仓库信息将在创建后写回本文件与 `project/project.json`。

## 新会话应该先做什么

任何成员或新的 Codex 会话进入本目录后：

1. 读取根目录 `AGENTS.md`；
2. 读取 `docs/team.md` 与 `docs/project.md`；
3. 如果执行 T-001，完整读取 `docs/tasks/T-001.md`；
4. 检查当前 Git 分支、工作区状态和最新历史记录；
5. 不依赖之前聊天中的隐含信息；缺失内容应写回仓库。

## 张馨月当前任务

- 任务说明：`docs/tasks/T-001.md`
- 推荐分支：`task/T-001-research-design-v0`
- 主要交付：`docs/research-design-v0.1.md`
- 评审点：研究边界、环境形式化、机制可比性、指标和待确认问题。

## 项目负责人后续事项

- 确认/创建私有 GitHub 仓库并邀请张馨月、刘充；
- 将 GitHub 用户名补充到团队文档并设置任务 assignee；
- 设置主分支保护和至少一位合作者评审；
- T-001 草案完成后组织一次短评审，分别确认计算/LLM 与经济学问题；
- 不在研究设计通过前要求张馨月同时推进大规模编码和 LLM 实验。

## 验证命令

```bash
npm run dashboard:build
npm run validate
```

Dashboard 的公开展示地址和 GitHub 地址会在部署完成后补充到本文件。
