# 开源项目借鉴记录

评估日期：2026-09-14。

本页记录模板设计参考，避免未来成员误以为相关项目是运行依赖或代码来源。

| 项目 | 许可证 | 借鉴内容 | 代码使用情况 |
|---|---|---|---|
| [hivemind](https://github.com/dip497/hivemind) | MIT | Markdown/YAML 可读任务、验收项、活动日志、MCP 边界 | 未复制 |
| [ATC Kanban](https://github.com/JSCOP/atc-kanban) | MIT | 状态机、依赖 DAG、原子领取与锁超时语义 | 未复制 |
| [Kangentic](https://github.com/Kangentic/kangentic) | AGPL-3.0 | 规划→执行→评审、GitHub 任务导入、会话与任务分离 | 未复制 |
| [Plane](https://github.com/makeplane/plane) | AGPL-3.0 | 任务筛选、文档与任务关联 | 未复制 |
| [Vibe Kanban](https://github.com/BloopAI/vibe-kanban) | Apache-2.0 | worktree、review、PR 生命周期 | 未复制 |
| [DVC](https://github.com/treeverse/dvc) | Apache-2.0 | 数据与模型版本、可复现实验 | 可选外部工具 |
| [MLflow](https://github.com/mlflow/mlflow) | Apache-2.0 | run、参数、指标和 artifact 模型 | 可选外部服务 |
| [Renku](https://github.com/SwissDataScienceCenter/renku) | Apache-2.0 | 代码、数据、计算环境的科研协作边界 | 未复制 |

若以后引入代码：

1. 在本页记录精确仓库、commit、文件和修改内容；
2. 复制许可证与必要 NOTICE；
3. 在合并前检查许可证是否与项目发布方式兼容；
4. AGPL 项目的产品设计可以独立借鉴，但不要把其实现复制进非 AGPL 项目。
