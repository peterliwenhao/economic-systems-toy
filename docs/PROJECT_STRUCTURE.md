# 项目结构与边界

## 目录总览

```text
economic-systems-toy/
├── src/economic_toy/       # 可安装、可测试的研究代码
│   ├── env/                # 共享环境动力学与约束
│   ├── mechanisms/         # 市场、计划、混合机制
│   ├── agents/             # 规则、优化和 LLM 策略
│   ├── llm/                # 模型 adapter、解析、缓存、费用
│   └── evaluation/         # 指标、统计和比较
├── configs/                # 版本化参数；不含凭据
├── tests/                  # 单元、集成、不变量和小型 golden tests
├── experiments/            # 协议与可提交 run manifest
├── runs/                   # 本地原始运行目录；Git 忽略
├── results/                # 可提交的小型汇总、表格与最终图
├── data/                   # 小型 fixtures 或外部数据索引
├── artifacts/              # 大型产物的 URI/校验和索引
├── notebooks/              # 探索；不作为正式实验唯一入口
├── docs/                   # 项目知识、设计、会议、决策、任务
├── project/                # 团队/项目机器可读元数据
├── examples/               # Dashboard 使用的任务数据
├── records/                # 已确认项目历史
├── scripts/                # 入场、校验、构建和维护脚本
├── dist/                   # 只读协作 Dashboard 静态产物
├── deploy/                 # Dashboard 部署；研究成员无需维护
└── .github/                # Issue、PR、CI 与仓库治理
```

## 四条主线

1. **研究代码**：`src/ + tests/ + configs/`，决定系统实际行为。
2. **实验与证据**：`experiments/ + runs/ + results/ + artifacts/`，建立参数、commit、结果和结论之间的链路。
3. **项目管理**：GitHub Issues/PR 为权威状态，`examples/tasks.json` 和 Dashboard 提供只读快照。
4. **共享知识**：`AGENTS.md + docs/ + project/`，让每位成员的 Codex 不依赖旧聊天也能恢复背景。

## 还需要但不应过早引入的部分

- 数据或权重开始难以复现时再接入 DVC/对象存储；
- run 数量难以比较时再接入 MLflow/W&B；
- 环境与依赖变得复杂时增加 lockfile 或容器；
- 论文写作开始后再增加 `paper/` 与自动制图流程；
- 不在 T-001 通过前实现具体经济机制或固定指标语义。

## Run 的最小可追溯契约

每个 run 至少记录：任务 ID、操作者、完整配置、命令、commit、branch、dirty 状态、开始/结束时间、seed、状态、指标和大型产物 URI。正式结果必须能够从干净 commit 与版本化配置重新运行。
