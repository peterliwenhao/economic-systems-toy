# 共享接口草案入口

> 当前分工和本周交付以 [1123任务文档](tasks/T-008.md) 为准。本页说明长期需要对齐的接口范围，不代表字段或类名已经定稿。

1123 本周由每位负责人分别提交“准备提供的接口”和“希望获得的接口”草案。首次草案只需写清接口名称、用途、提供方、调用方、Python 签名、输入、输出和待确认问题；测试、异常和完整字段在后续接口对齐中补充。

## Engine 与 World

可讨论的最小形态：

```text
World.initialize(config, seed) -> WorldState
World.observe(request) -> Observation
World.validate_and_settle(request) -> WorldResult
```

必须明确：

- 全局状态与每类参与者可观察信息；
- 商品、货币、库存、生产与消费的记账顺序；
- 同步或异步行动顺序；
- 冲击的发生位置和随机数来源；
- 商品守恒、预算约束、库存非负与行动合法性不变量。

Engine 负责主动组织调用；World 维护并更新权威物理状态。最终名称和参数由张馨月、张津阁在接口对齐时确认。

## Engine 与 Decision

可讨论的最小形态：

```text
Decision.decide(context) -> Action
```

其他领域模块负责说明某个决策需要哪些上下文；Decision 负责 Harness、模型适配、结构化结果与决策记忆。具体上下文字段由杜芃烨与相关领域负责人共同确认。

## Engine 与 Market / Planning

- Market 负责商品市场、分散式劳动力市场、企业决策问题及市场反馈；
- Planning 负责 Cockshott、Lange 和集中式劳动分配；
- Lange 所需的价格或超额需求反馈由 Market 与 Planning 共同对齐；
- 二者产生的交易、分配或生产结果由 Engine 交给 World 验证和结算。

## 评价接口

每个时间步至少保留：

- 状态和参与者观察；
- 原始策略输出与解析后的合法行动；
- 交易或分配结果；
- 约束检查；
- 指标增量；
- LLM 延迟、token、费用、重试与失败原因。

## 后续需要逐步明确

- [ ] 第一版参与者及其信息集；
- [ ] 商品、效用和生产函数；
- [ ] 市场清算与未成交处理；
- [ ] 规划者目标函数和信息限制；
- [ ] 指标公式与聚合方式；
- [ ] 可手算极小案例和失败案例；
- [ ] Engine 一轮调用顺序和 RoundResult；
- [ ] 决策上下文与 Decision Memory 的边界；
- [ ] 分散式劳动力市场与集中式劳动分配的不同接口；
- [ ] Lange 与 Market 之间的反馈接口。
