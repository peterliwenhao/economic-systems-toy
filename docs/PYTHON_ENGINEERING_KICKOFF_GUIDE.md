# Python 软件工程与团队开发启动会讲稿

本文用于面向仅掌握基本编程语法的项目成员，统一说明项目如何组织、如何设计接口、如何编写 Python 代码与测试，以及如何使用 Git 和 Codex 完成一次可审查的开发任务。

> 当前任务与分工以 [1123任务文档](tasks/T-008.md) 为准。本文是一份完整的软件工程教学材料，其中测试、代码骨架和正式接口冻结属于后续阶段，不是 1123 本周交付要求。

## 一、会议目标

这次讲解包含模块边界、类与函数、接口、测试、Git 和代码评审。1123 本周先完成设计草案；后续进入实现阶段时，再逐步完成下面的完整开发循环：

```text
理解自己的模块
→ 领取一个任务
→ 写接口草案
→ 设计测试
→ 在自己的分支实现
→ 运行测试
→ 提交 Pull Request
→ 根据评审意见修改
```

成员还应能回答：

1. 我的模块负责什么？
2. 我的模块输入是什么？
3. 我的输出交给谁？
4. 我依赖谁？
5. 谁依赖我？
6. 我要测试哪些正常、边界和非法情况？
7. 哪些事情明确不属于我的任务？

## 二、建议讲解安排

建议总时长约 100–120 分钟，并尽量使用项目中的真实小例子现场演示。

| 时间 | 内容 |
|---|---|
| 15 分钟 | 项目目标、五个责任域和责任边界 |
| 20 分钟 | 接口、输入输出和状态所有权 |
| 20 分钟 | Python 代码组织：面向过程、面向对象及混合方式 |
| 20 分钟 | 现场实现一个小函数和单元测试 |
| 15 分钟 | Git 分支、提交和 Pull Request |
| 10 分钟 | 如何正确使用 Codex |
| 10–20 分钟 | 每位负责人复述自己的任务和接口 |

## 三、先讲清楚项目如何运行

项目由五个责任域组成：

1. **Backbone / Engine（张馨月）**：组织运行流程、调用各模块、汇总结果和产物；
2. **Decision / LLM / Memory（杜芃烨）**：在其他模块提供的上下文下完成决策，处理模型调用、工具使用与决策记忆；
3. **World（张津阁）**：初始化世界，维护权威物理状态，执行生产、运输、消费和健康等确定性规则；
4. **Market / Firm（王逸忱）**：实现商品市场、分散式劳动力市场和企业决策问题，并向 Lange 提供市场反馈；
5. **Planning（郝依琳）**：实现 Cockshott、Lange 与集中式劳动分配机制。

必须反复强调三条规则：

- 每个人只负责自己任务范围内的模块；
- 模块之间通过已经评审的接口通信；
- Engine 主动组织调用；World 拥有并结算库存、健康、产量等权威物理状态。

Decision、Market 和 Planning 返回结构化请求或结果。Engine 决定调用顺序并把需要结算的结果交给 World；World 根据规则验证和更新状态。

## 四、什么是接口

接口就是模块之间关于“传入什么、返回什么、失败时怎么办”的约定。

例如：

```python
def clear_market(
    state: MarketState,
    orders: list[Order],
) -> MarketResult:
    ...
```

- `MarketState` 和 `orders` 是输入；
- `MarketResult` 是输出；
- 调用者不需要了解函数内部如何撮合；
- 输出一旦被其他模块使用，就不能由负责人随意修改；
- 修改公共接口前必须通知并获得相关模块确认。

一个具体输入可以是：

```python
orders = [
    Order(agent_id="A01", side="buy", quantity=2.0, price=3.0),
    Order(agent_id="A02", side="sell", quantity=1.0, price=2.5),
]
```

输出可以是：

```python
MarketResult(
    trades=[...],
    clearing_price=2.75,
    excess_demand=1.0,
)
```

1123 的首次接口草案先说明：

- 接口名称与一句话用途；
- 提供方和调用方；
- Python 形式的函数签名；
- 输入和输出分别表达什么；
- 当前仍未确定的问题。

字段约束、异常、正常/边界/失败样例和测试方案将在接口对齐后逐步补充。

## 五、Python 中面向过程和面向对象的组织思路

### 5.1 面向过程是什么

面向过程通常把问题拆成一组按顺序执行的函数：

```python
orders = validate_orders(orders)
trades = match_orders(orders)
price = calculate_clearing_price(trades)
result = build_market_result(trades, price)
```

它适合：

- 输入确定、输出确定的计算；
- 生产函数、距离、损耗和指标公式；
- 数据验证和格式转换；
- 不需要长期保存内部状态的逻辑；
- 容易单独测试的算法步骤。

优点是简单、透明、容易测试。缺点是当状态、配置和多种可替换行为不断增加时，函数参数可能变得很多，模块边界也可能变得混乱。

### 5.2 面向对象是什么

面向对象把相关的数据和行为组织到类中：

```python
class MarketMechanism:
    def __init__(self, config: MarketConfig) -> None:
        self.config = config

    def clear(
        self,
        state: MarketState,
        orders: list[Order],
    ) -> MarketResult:
        ...
```

它适合：

- 需要保存配置或状态的长期对象；
- 有多个可替换实现的共同接口；
- Engine、Decision、World、Market 与 Planning 等明确角色；
- 需要把内部细节隐藏在稳定公共方法之后的模块。

优点是边界清楚、便于替换实现。缺点是如果过度使用继承和复杂类层次，会比函数更难理解和测试。

### 5.3 本项目推荐混合使用

不要争论“全部面向对象”或“全部面向过程”。本项目推荐：

- **数据使用简单结构表达；**
- **确定性计算尽量写成纯函数；**
- **需要替换的策略和机制使用类或 Protocol；**
- **Engine 负责组织调用，不把所有算法塞进一个大类。**

推荐结构：

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Order:
    agent_id: str
    side: str
    quantity: float
    price: float


@dataclass(frozen=True)
class MarketResult:
    trades: tuple[Trade, ...]
    clearing_price: float
    excess_demand: float
```

确定性算法使用函数：

```python
def validate_orders(orders: list[Order]) -> None:
    ...


def match_orders(orders: list[Order]) -> list[Trade]:
    ...
```

可替换决策实现使用共同接口：

```python
from typing import Protocol


class DecisionProvider(Protocol):
    def decide(
        self,
        observation: Observation,
    ) -> Action:
        ...
```

不同实现遵守同一接口：

```python
class RuleBasedDecision:
    def decide(self, observation: Observation) -> Action:
        ...


class LLMDecision:
    def decide(self, observation: Observation) -> Action:
        ...
```

Engine 只负责协调：

```python
class Engine:
    def step(
        self,
        decision_provider: DecisionProvider,
    ) -> RoundResult:
        observation = self.world.observe()
        action = decision_provider.decide(observation)
        coordination_result = self.coordinator.coordinate(action)
        world_result = self.world.validate_and_settle(coordination_result)
        return self.artifacts.record(world_result)
```

### 5.4 如何判断使用函数还是类

优先使用函数，如果：

- 只需根据输入计算输出；
- 不需要保存状态；
- 不需要提供多种可替换实现。

考虑使用类，如果：

- 多个方法共享同一份配置或状态；
- 需要提供市场、Lange、Cockshott 等可替换实现；
- 对外需要一个稳定入口，内部实现可能变化；
- 对象在多个时间步持续存在。

不建议：

- 为只有一个函数的逻辑创建复杂类；
- 建立多层继承树；
- 使用大量全局变量保存状态；
- 把所有功能都放进一个巨大的 `Simulation` 类；
- 让对象之间随意修改彼此内部字段。

### 5.5 组装模块的基本原则

```text
Engine 组织一轮运行
├── 调用 Decision 获取行动
├── 调用 Market 或 Planning 处理制度规则
├── 调用 World 验证并结算权威状态
└── 调用 Artifact Storage 保存运行产物
```

各模块通过共同确认的接口交换数据，不依赖其他模块的私人实现。具体类由运行入口组装，当前类名和字段仍允许在接口会议中调整。

## 六、怎样拆小一个功能

每个功能尽量遵循：

```text
读取输入
→ 检查是否合法
→ 完成一件明确的事情
→ 返回结构化结果
```

不要用一个几百行函数同时完成：

```text
读取 Agent
+ 生成价格
+ 完成交易
+ 修改库存
+ 计算指标
+ 保存文件
```

可以拆成：

```python
validate_orders(...)
match_orders(...)
calculate_market_feedback(...)
build_market_result(...)
```

初学者最重要的习惯是“一段代码只做一件可以清楚描述和测试的事”。

## 七、统一编码规则

### 7.1 函数与命名

- 函数和变量使用能够表达含义的英文名称；
- 函数尽量短，只完成一个任务；
- 公共函数写清输入、输出和异常；
- 不使用无法解释的魔法数字；
- 重要结果返回结构化对象，不依赖随意打印的文本；
- 随机过程必须使用指定 seed；
- 单位写入名称、类型说明或文档，不能依赖猜测。

最小函数模板：

```python
def function_name(input_data: InputType) -> OutputType:
    """一句话说明功能。

    Args:
        input_data: 输入数据的含义。

    Returns:
        返回结果的含义。

    Raises:
        ValueError: 什么情况下输入非法。
    """
    validate_input(input_data)
    result = ...
    return result
```

### 7.2 状态与副作用

- 不使用全局变量保存世界状态；
- 不在不相关函数中修改传入对象；
- 计算函数优先返回新结果；
- 只有 Engine 结算过程能修改正式世界状态；
- 文件写入、网络调用和 LLM 调用应与纯计算逻辑分开。

### 7.3 修改范围

- 不直接修改其他负责人模块；
- 不复制粘贴多个稍有不同的实现；
- 不在代码中写密码、API Key 或私人信息；
- 不擅自增加大型依赖；
- 修改公共接口时同步修改文档、示例和测试。

## 八、怎样编写单元测试

先讲最实用的 `Arrange–Act–Assert`：

```python
def test_exact_market_clearance():
    # Arrange：准备输入
    orders = ...

    # Act：调用被测试函数
    result = clear_market(state, orders)

    # Assert：检查结果
    assert result.clearing_price == 2.75
    assert result.excess_demand == 0
```

每个功能至少考虑：

1. **正常情况**：最常见输入能否正确运行；
2. **边界情况**：空输入、零库存、供不应求、刚好达到上限；
3. **非法情况**：负数、缺字段、越权操作、错误单位。

测试不是为了证明代码“运行时没有报错”，而是明确模块承诺做到什么。

测试还应遵守：

- 一个测试只验证一个清楚行为；
- 测试名称说明预期结果；
- 测试不依赖执行顺序；
- 固定随机种子；
- 不通过访问大量内部字段来测试；
- 修复 bug 时增加一个能够复现该 bug 的测试。

## 九、Git 工作方式

日常流程：

```text
确认身份和任务
→ 阅读 AGENTS.md 和任务文档
→ 从最新 main 创建自己的任务分支
→ 只修改任务允许的范围
→ 运行测试
→ 查看 diff
→ commit
→ push
→ 提交 Pull Request
→ 根据评审意见修改
```

必须遵守：

- 不在 `main` 上开发；
- 不在其他人的任务分支上工作；
- 不直接合并自己的 Pull Request；
- 不强制推送；
- 一次提交尽量只完成一件事情；
- 提交前运行测试并检查改动；
- 出现冲突时先报告，不让 AI 猜测式解决。

推荐提交信息：

```text
Add market order validation
Implement deterministic market clearing
Add contract tests for MarketResult
```

Pull Request 至少说明：

- 做了什么；
- 为什么这样做；
- 如何测试；
- 改动了哪些接口；
- 有什么已知限制；
- 需要谁评审。

## 十、如何正确使用 Codex

成员可以使用 Codex 辅助开发，但必须提供完整上下文。

推荐提示模板：

```text
我是市场模块负责人。

当前任务：
实现单商品市场出清。

请先阅读：
- AGENTS.md
- 当前任务文档
- 市场接口文档
- Engine 接口文档

允许修改：
- src/.../market/
- tests/.../market/

不要修改：
- Engine
- LLM
- 计划模块
- 已通过的公共接口

验收条件：
- 完成指定功能；
- 添加正常、边界和非法输入测试；
- 所有测试通过。

请先检查当前分支和工作区，再提出实现计划。
```

使用 Codex 时必须遵守：

- Codex 生成的代码仍由任务负责人负责；
- 不理解的代码不能直接提交；
- AI 提议修改公共接口时必须停下来确认；
- 不一次要求 AI 修改整个项目；
- 每次修改后查看 diff 并运行测试；
- 不允许 AI 在 `main` 或他人的分支上工作；
- 不允许 AI 擅自合并、强推或删除他人的改动。

## 十一、建议的现场演示

会议中现场完成一个很小的功能，例如订单验证：

```python
def validate_order(order: Order) -> None:
    if order.side not in {"buy", "sell"}:
        raise ValueError("side must be buy or sell")
    if order.quantity <= 0:
        raise ValueError("quantity must be positive")
    if order.price < 0:
        raise ValueError("price must be non-negative")
```

配套测试：

```python
import pytest


def test_valid_buy_order_is_accepted():
    order = Order("A01", "buy", quantity=2.0, price=3.0)
    validate_order(order)


def test_negative_quantity_is_rejected():
    order = Order("A01", "buy", quantity=-1.0, price=3.0)

    with pytest.raises(ValueError, match="quantity must be positive"):
        validate_order(order)
```

随后演示：

1. 把函数放到正确模块；
2. 把测试放到对应测试目录；
3. 运行测试；
4. 查看 `git diff`；
5. 提交一个小 commit；
6. 解释这段代码如何成为更大市场接口的一部分。

## 十二、进入实现阶段前的确认

不要只问“大家听懂了吗”。请每位负责人依次说明：

```text
我负责的模块是：
本轮任务是：
我的输入来自：
我的输出交给：
我依赖：
依赖我的模块有：
后续需要共同设计的测试包括：
本轮明确不做：
我目前仍不确定的问题是：
```

如果成员不能回答，应先继续澄清接口和责任，不急着进入完整编码。

## 十三、1123 本周交付

每位负责人提交：

1. 一张本模块类图草案；
2. 一份讲清本模块内部组成与运行方式的说明材料；
3. 为每个准备提供的接口分别写一份首次草案；
4. 为每个希望获得的接口分别写一份需求草案。

张馨月额外提交一张系统级时序图，说明 Engine 如何调用四个领域模块。当前不要求测试、正常/边界/失败样例、最终字段或代码骨架。完整要求见 [1123任务文档](tasks/T-008.md)。
