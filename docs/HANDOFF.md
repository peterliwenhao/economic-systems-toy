# 项目交接入口

更新时间：2026-09-21

## 当前状态

- 已有一批 LLM 社会模拟、Agent 框架和记忆系统调研材料；
- 已建立三人团队角色、Git/Codex 协作规范、Dashboard、决策/会议模板和实验 manifest；
- 当前任务包括张馨月负责的 **T-001：形成研究设计草案 v0.1**，以及李文浩负责的 GitHub 建仓与项目启动任务 T-002/T-003；
- 尚未进入正式代码实现或实验阶段；
- Dashboard 已部署至 `https://118.178.235.171:9003/projects/economic-systems-toy/`；
- GitHub 仓库信息将在创建后写回本文件与 `project/project.json`。

## 新会话应该先做什么

任何成员或新的 Codex 会话进入本目录后：

1. 读取根目录 `AGENTS.md`；
2. 读取 `docs/team.md` 与 `docs/project.md`；
   - 张馨月另读 `docs/onboarding/张馨月.md`；刘充另读 `docs/onboarding/刘充.md`；
3. 如果执行 T-001，完整读取 `docs/tasks/T-001.md`；
4. 检查当前 Git 分支、工作区状态和最新历史记录；
5. 完整阅读 `docs/git-workflow.md`；任何成员及其 AI 都不得在 `main` 上直接工作；
6. 不依赖之前聊天中的隐含信息；缺失内容应写回仓库。

## 张馨月当前任务

- 任务说明：`docs/tasks/T-001.md`
- 推荐分支：`task/T-001-research-design-v0`
- 主要交付：`docs/research-design-v0.1.md`
- 评审点：研究边界、环境形式化、机制可比性、指标和待确认问题。

## 项目负责人后续事项

- 完成 `docs/tasks/T-002.md`：创建私有 GitHub 仓库、邀请成员并保护 `main`；
- 完成 `docs/tasks/T-003.md` 与 `docs/PROJECT_STARTUP.md`：确认访问、资源、评审节奏并召开启动会议；
- T-001 草案完成后组织一次短评审，分别确认计算/LLM 与经济学问题；
- 不在研究设计通过前要求张馨月同时推进大规模编码和 LLM 实验。

GitHub 的具体创建与推送步骤见 `docs/GITHUB_SETUP.md`。目前本地仓库已经初始化并有完整提交，不要在 GitHub 创建仓库时额外生成 README、许可证或 `.gitignore`。

## 验证命令

```bash
npm run dashboard:build
npm run validate
```

公开 Dashboard：<https://118.178.235.171:9003/projects/economic-systems-toy/>

部署维护说明见 `deploy/README.md`。GitHub 地址仍待仓库创建后补充。
