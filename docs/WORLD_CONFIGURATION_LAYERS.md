# 世界配置的因素分层

## 结论

项目概念上分成两大类，工程上保存为三个工件：

1. **世界规则（World Definition）**：世界允许什么、如何演化；
2. **初始化（Initialization）**：包含初始化规格和由它生成的实现例。
   - **初始化规格（Initialization Spec）**：这一次怎样抽样；
   - **初始化实现例（Realized Instance）**：给定 seed 后实际生成了谁、在哪里、拿到了什么。

因此，“初始化出来的每个人分配的禀赋”不是新的参数类别，而是初始化规格运行后的结果。它必须保存，才能复现，但不应与生成规则混写。

## 两大类、三个工件

| 工件 | 回答的问题 | 典型内容 | 是否随每次初始化变化 |
|---|---|---|---|
| A. 世界规则 | 世界如何运行？ | 时间步、地图度量、库存守恒、生产函数、健康函数、运输结算 | 通常固定；实验处理可显式替换 |
| B1. 初始化规格 | 这次要生成什么样的世界？ | 人数、设施数量、禀赋类型数、分布、相关结构、位置规则、seed | 会变化 |
| B2. 初始化实现例 | 这次到底生成了什么？ | A01–A16、逐人技能/健康/库存、设施坐标、人员分配 | 是 B1 的确定性输出 |

建议的数据流：

```text
world_definition.yaml
          +
initialization_spec.yaml
          |
          |  initialize(seed)
          v
realized_instance.yaml  --->  simulation  --->  run manifest/results
```

## 你举的“禀赋”例子

应该拆为：

```yaml
# B1：初始化规格
population:
  count: 16
endowment_model:
  type_count: 3
  types:
    - id: grain_specialist
      grain_skill: 1.25
      iron_skill: 0.75
    - id: balanced
      grain_skill: 1.15
      iron_skill: 1.15
    - id: iron_specialist
      grain_skill: 0.75
      iron_skill: 1.25
  assignment:
    method: fixed_counts
    counts:
      grain_specialist: 6
      balanced: 5
      iron_specialist: 5
  seed: 20260927
```

生成后保存：

```yaml
# B2：初始化实现例
agents:
  - id: A01
    endowment_type: grain_specialist
    grain_skill: 1.25
    iron_skill: 0.75
  - id: A02
    endowment_type: iron_specialist
    grain_skill: 0.75
    iron_skill: 1.25
```

这里分别有三个量：

- `type_count = 3`：可用禀赋类型有几种；
- `population.count = 16`：本次生成多少人；
- `agents[*].endowment_type`：这 16 个人实际各拿到哪一类，是 realized assignment。

不能只记录 seed 而丢掉 realized assignment；生成器版本或抽样顺序变化时，同一个 seed 也可能得到不同结果。

## 当前 v1.1 文件应如何拆

当前完整文件保存在：

`configs/scenarios/closed-economy-fixed-transport-v1.1.yaml`

它是一个便于审阅的“冻结完整场景”，但内部混有五种语义：

### A. 世界规则

- `time`
- `map.geometry/coordinate_system/hex_distance_formula`
- `physical_rules`
- `production_technology`
- 环境引擎权限与 settlement order

### B1. 初始化规格

- `global_environment.population_count`
- 商品集合、设施类型/数量
- agent 禀赋类型及数量/概率
- 设施与住宅位置生成规则
- 初始库存/健康的分布或固定值
- 初始化 seed

### B2. 初始化实现例

- `facilities` 中具体 W1–F2、坐标、库存
- `agents` 中具体 A01–A16、技能、健康、住宅、岗位
- `assigned_agents`、`responsible_agent`
- 具体机构实例

### C. 制度/实验处理

- `ownership`
- `currency_enabled`、`labor_voucher_enabled`、`private_account_enabled`
- `misreporting_enabled`
- `allocation_rule`
- 运输损耗模式和数值

这些变量是市场/计划比较和消融的 treatment，应放在实验配置中覆盖世界默认值，避免把制度差异伪装成初始化差异。

### D. 行为输入

- `first_round_actions`

它属于固定策略 fixture 或实际 agent/LLM 输出，不属于初始化。后续应移到 `configs/actions/` 或对应 run 的输入记录。

### E. 校准测试

- `transport_calibration_examples`

它属于 transport 单元测试/golden cases，不属于运行配置。后续应移到 `tests/fixtures/`，由测试验证公式结果。

## 建议进一步拆出的文件

```text
configs/
├── worlds/
│   └── closed-economy-v1.yaml          # A：世界规则
├── initialization/
│   └── population16-calibration.yaml   # B1：初始化规格
├── instances/
│   └── seed-20260927.yaml               # B2：冻结实现例
├── treatments/
│   └── fixed-transport-loss-v1.yaml     # C：制度/实验处理
├── actions/
│   └── first-round-fixed-work.yaml      # D：行为 fixture
└── scenarios/
    └── closed-economy-fixed-transport-v1.1.yaml  # 当前完整快照

tests/fixtures/
└── transport-loss-cases.yaml            # E：校准测试
```

## 因素拆分时的实验原则

1. **一次只改变一个 treatment 维度**：例如比较运输损耗模式时，使用同一个 realized instance。
2. **共同随机数**：不同制度条件共享初始化 seed、冲击序列和 agent 禀赋实现例。
3. **结构因素和数值因素分开**：是否有货币是结构因素；运输损耗为 0.02/0.05 是数值因素。
4. **生成参数和生成结果同时留档**：spec 用于解释采样总体，instance 用于精确复现。
5. **派生值不作为自由因素**：`tile_count=37` 可由 radius=3 推出，应校验而不是独立扫描。
6. **重复表达必须有唯一真源**：如 `household_initial_grain` 与每个 agent 的 `initial_grain_inventory`，前者应是默认/生成规则，后者是实现值；不得双向手改。

## 当前配置中需要团队确认的建模问题

- `minimum_consumption * 7` 与 40 小时 action round 的时间单位是否一致；“7”代表天、餐次还是安全库存期？
- `target_safety_stock_action_rounds: 7` 与 request formula 中的 `* 7` 是否同一概念；
- `grain_iron_input_per_unit` 与 `production_technology.grain.iron_input_per_grain` 重复，哪个是唯一真源；
- 固定每条指令损耗会强烈鼓励合单，需要明确合单发生在谁决策之后、由谁执行，以及是否存在容量/批次上限；
- `population_count`、agents 数量、设施 assigned_agents 覆盖关系应由 schema 自动校验；
- `allocation_rule` 是制度 treatment 还是世界默认机制，应在市场/计划比较前明确。

## 当前 v1.1 的因素审计

对规范化 YAML 做机器读取后得到：

- 人口：16；agent ID 唯一；第一轮 action 也是 16 条；
- 技能禀赋有 **4 种二元组合**，每种恰好 4 人：`(1.25, 0.75)`、`(0.75, 1.25)`、`(1.15, 1.15)`、`(0.85, 0.85)`；
- 健康/营养参数组合也有 **4 种**，每种恰好 4 人；
- 职业有 **5 种**：7 名 grain worker、4 名 grain farm manager、2 名 iron mine manager、2 名 iron worker、1 名 public dispatcher；
- 把技能、营养、恢复、短缺伤害、安全工时等全绑成一个“完整禀赋类型”时，实际出现 **14 种组合**，几乎退化成逐人定制；
- 设施共 8 个：2 个仓库、4 个农场、2 个铁矿；
- 初始家庭粮食总量 112，仓库粮食 1568，农场铁 16，仓库铁 24。

这说明“禀赋有几种”必须先说明是哪一条轴：技能类型、健康脆弱性类型、职业类型，还是它们的联合类型。建议不要创建一个包办所有属性的 `endowment_type`；更适合分别声明：

```yaml
agent_factor_axes:
  skill_profile: 4
  health_profile: 4
  role: 5
assignment_design:
  skill_x_health: balanced_or_seeded
  role_given_skill: constrained
```

然后在 realized instance 中保存每个人沿每条轴的取值。这样可以分别做“只改变技能异质性”“只改变健康脆弱性”“只改变职业分配”的消融，而不会一次连带改变所有属性。
