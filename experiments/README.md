# 实验记录

每次重要运行复制 `manifests/RUN-000-template.json`，使用唯一 ID，例如 `RUN-T023-20260914-001`。

Git 只保存 manifest、小型指标和必要图表。原始数据、模型权重、完整日志和大型产物应放在 DVC remote、对象存储、共享文件系统或 MLflow artifact store，并在 manifest 中记录不可歧义的位置。

实验可追溯链：

```text
研究问题 → 任务 → commit → run manifest → 指标/产物 → 决策或结论
```

运行时工作区有未提交修改时必须设置 `dirty: true` 并记录 diff；用于正式结论的实验原则上应基于干净 commit。
