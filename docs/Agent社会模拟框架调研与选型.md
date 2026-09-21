# Agent 社会模拟框架调研与选型

## 执行摘要

本报告调查截至 2026 年 9 月仍具代表性、公开代码、明确论文或持续维护迹象的 LLM agent 社会模拟框架。主比较对象为 **Concordia、SOTOPIA/SOTOPIA-S4、OASIS、AgentSociety 2、Generative Agents**；同时纳入 **Mesa、NetLogo、GAMA** 三类传统 agent-based modeling（ABM）平台，以及 **CAMEL、AgentScope、AgentVerse、AutoGen/Microsoft Agent Framework** 等相邻的通用多智能体框架。

结论如下：

1. **本项目不应把“社会模拟框架”与“经济环境”做成同一层。** 市场撮合、生产、库存、货币、计划分配和福利指标应由确定性代码管理；LLM 只产生受约束的个体决策。
2. **首选方案是 Mesa + 自定义 LLM Policy 层，并借鉴 Concordia 的 agent/component/engine 分层。** Mesa 提供轻量、Python 原生、容易测试的 ABM 内核；Concordia 提供最成熟的 generative social simulation 设计模式。二者组合最适合小规模、强调制度可比性和可复现性的经济 toy 环境。
3. **若必须只选一个现成的 LLM 社会模拟框架，选 Concordia。** 它是通用 generative social simulation 库，允许定制 Game Master、行动和环境组件；但本项目应避免让 LLM Game Master 决定交易是否成立或修改账本。
4. **AgentSociety 2 是第二选择，不是第一选择。** 它的模块化环境、trace/replay、断点恢复和 Ray 扩展很强，但对 10–30 个代理的 toy 项目明显偏重，且其快速演进增加学习和迁移成本。
5. **SOTOPIA 适合做谈判/社会互动评价，不适合作为完整经济世界底座；OASIS 适合社交媒体平台，不适合一般商品市场；Generative Agents 适合学习，不适合直接作为新项目底座。**

推荐架构：

```text
Mesa / 纯 Python 经济环境
  ├─ 世界状态：商品、库存、货币、生产、冲击
  ├─ 制度机制：市场清算 / 中央计划 / 混合机制
  ├─ 时钟与调度：同步轮次、固定随机种子
  ├─ 指标与账本：福利、短缺、不平等、交易记录
  └─ Policy 接口
       ├─ RulePolicy
       ├─ OptimizerPolicy
       └─ LLMPolicy（借鉴 Concordia 的记忆与组件设计）
```

## 一、范围与筛选标准

“LLM agent framework”常被混用于三类不同软件：

- **社会模拟框架**：提供代理、社会环境、时间推进、交互规则和实验记录，如 Concordia、AgentSociety。
- **领域模拟器或 benchmark**：为某类社会场景预设行动空间和评价，如 OASIS、SOTOPIA。
- **通用 agent 编排框架**：让多个 LLM 角色通信和调用工具，如 CAMEL、AgentScope、AutoGen；它们通常不提供可验证的社会世界。

本报告优先保留满足以下条件的项目：有正式论文或权威技术报告；有官方开源代码；维护状态或社区采用较明确；能够影响本项目的设计选择。GitHub star 仅用于粗略判断可见度，不作为科研有效性的证据。作为量级参照，Generative Agents 官方仓库约 2.1 万 star，CAMEL 约 1.8 万，OASIS 约 4,700，Concordia 约 1,400；这些数字会变化，且“大众关注”与“适合严谨实验”没有必然关系。^1 ^2 ^3 ^4

## 二、主要 LLM 社会模拟框架

### 2.1 Concordia

**定位。** Google DeepMind 开发的通用 generative agent-based modeling 库。核心抽象是 Entity、Component 和 Engine；特殊实体 Game Master 负责世界、观测、行动轮次和结果解析。官方仓库提供 prefabs、agent 与 Game Master 组件、环境引擎、prompt/context 工具、模型适配和 examples，并以 `gdm-concordia` 发布。^4

**优势。**

- 在现有框架中，对“代理表达意图”和“环境决定结果”的分离最清楚。
- 组件化程度高，记忆、人格、推理链、观测、行动规格和 Game Master 均可替换。
- 场景通用，不被社交媒体、城市地图或双人对话绑定。
- 有研究团队、论文、教程、示例和持续演进的设计文档；适合作为 generative social simulation 的参考实现。
- 对几十个代理、自然语言互动和定性社会机制较友好。

**劣势。**

- 默认设计具有“桌面角色扮演”色彩；Game Master 若由 LLM 解析行动和生成结果，会带来不可重复性、规则漂移和信息泄漏。
- API 和 prefab 体系有学习成本，简单数值经济模型可能需要绕过不少自然语言机制。
- 它不是专业经济仿真器，没有现成的订单簿、预算约束、生产函数或中央计划求解器。
- 关联记忆依赖 embedding，增加模型依赖、费用和额外随机性。

**对本项目的适用度：高，但需要约束使用。**

可以使用 Concordia 管理代理人格、私有观测、记忆和决策轮次；交易、生产和资源分配必须由确定性组件结算。不能把“市场是否成交”“库存剩多少”“计划是否可行”交给 LLM Game Master 自由叙述。

### 2.2 AgentSociety 2

**定位。** 清华 FIB Lab 的 LLM-native 社会模拟与研究平台。第一代强调真实城市环境、大规模代理、出行、社会互动和经济活动；当前官方文档推荐新项目使用 AgentSociety 2。V2 将系统组织为 Agents、Environment Modules 和 AgentSociety coordinator，通过 workspace 持久化状态，使用 Ray 批量推进 agent，并提供环境路由、分布式 trace、JSONL replay、恢复和多种 LLM tool router。^5 ^6

**优势。**

- 工程能力最完整：异步/分布式执行、LLM 并发控制、状态持久化、恢复、trace 和 replay。
- 环境模块通过 `@tool` 暴露 observation/intervention，较容易添加新领域环境。
- 对问卷、访谈、社会干预和大规模群体实验有直接支持思路。
- 适合未来从几十个代理扩展到数千代理，或需要长时间运行和中断恢复的研究。
- V2 的 agent/environment/service 分层比很多早期 LLM 小镇代码更现代。

**劣势。**

- 对 toy 环境过重：Ray、workspace、router、服务代理和分布式日志会显著提高认知与调试成本。
- V1 与 V2 架构差异较大；快速演进意味着教程、论文和 API 可能不完全对应。
- 默认的自然语言请求到 tool 的 CodeGen/ReAct 路由，不适合直接承担严格经济账本操作；仍需要结构化 action 和环境校验。
- 大规模能力并不能解决行为有效性、persona 刻板化或政策外推问题。
- 第一代城市/经济模块的存在不意味着它已经提供可直接用于市场经济—计划经济公平比较的机制。

**对本项目的适用度：中等。**

如果项目很快升级到几百或几千代理、需要在线实验管理和 replay，AgentSociety 2 值得采用。第一阶段只有 10–30 个代理时，它带来的复杂度高于收益。

### 2.3 SOTOPIA / SOTOPIA-S4

**定位。** SOTOPIA 最初是开放式社会智能评价环境，通过角色背景、私有目标和双人多轮互动，评价目标完成和社会行为。2025 年的 SOTOPIA-S4 将其扩展为更易用的模拟系统，提供 pip package、simulation engine、REST API、Web UI、多方互动和自定义评价指标。^7 ^8

**优势。**

- scenario、角色、私有目标、episode sampler 和 evaluator 边界清楚。
- 适合谈判、合作、竞争、招聘面谈等短时社会互动。
- 自带数据和评价传统，便于比较模型或 agent architecture。
- S4 的 API、Web UI 和无代码入口利于经济学同学设计/观察场景。
- 特别适合把“买卖双方谈判能力”作为独立子实验。

**劣势。**

- 核心对象是互动 episode 和社会智能，不是长期运行的经济系统。
- 默认以对话为中心，缺少商品守恒、生产、库存、价格形成和多市场联动。
- LLM-as-a-judge 存在偏差；SOTOPIA-π 后续工作还发现，使用 LLM 评分训练的代理可能被相似评分器高估。^9
- 多方 S4 虽能生成规模更大的互动，但“对话规模”不等于“经济机制规模”。

**对本项目的适用度：低到中。**

不建议作为主环境；可作为谈判模块、社会行为评测方法或对照 benchmark。

### 2.4 OASIS

**定位。** CAMEL-AI 的大规模社交媒体模拟器，面向 Twitter/X、Reddit 类平台，内置动态社交网络、帖子、关注/评论/转发等行动、推荐系统和数据库。官方材料称可扩展至百万 agent，当前包以 PettingZoo 风格环境和 CAMEL `ChatAgent` 为基础。^3 ^10

**优势。**

- 社交媒体平台语义完整：内容、关系图、feed、推荐和用户行动已实现。
- 在 LLM 社会模拟项目中社区可见度较高，文档、PyPI 包和 examples 较完整。
- 适合传播、极化、从众、谣言和推荐算法干预。
- 已考虑模型管理、大规模调度、动态网络和丰富行动空间。

**劣势。**

- 环境高度绑定社交媒体；改造成商品市场需要替换核心实体、状态和 action，而不是简单增加几个 tool。
- 百万级通常不代表百万次实时 LLM 调用；规模声明需要结合 agent 激活比例、模型替代策略和硬件理解。
- 重点是内容与网络互动，不是预算约束、生产和中央计划。
- 引入 CAMEL 生态及数据库等额外复杂度。

**对本项目的适用度：低。**

除非把项目改为“信息传播如何影响经济决策”或需要模拟广告、舆论、推荐平台，否则不应选择 OASIS。

### 2.5 Generative Agents / Smallville

**定位。** 2023 年的奠基性研究原型：25 个代理在小镇中通过 observation、memory retrieval、reflection 和 planning 形成连续生活与涌现互动。官方代码广受关注。^1

**优势。**

- 架构直观，是学习 LLM agent 记忆—反思—规划范式的最佳材料之一。
- 有论文消融和可视化 demo，容易建立直觉。
- 社区传播广，衍生实现多。

**劣势。**

- 代码是论文复现原型，需要并行启动环境和 simulation server，官方说明也提示 API 挂起与成本问题。
- 与旧模型 API、Django/前端和特定 Smallville 地图耦合，不是现代可复用仿真 SDK。
- 主要评价 believability，不足以证明行为预测或社会科学有效性。
- 缺少标准化 action、严格环境约束和实验管理。

**对本项目的适用度：不适合作为底座。**

应当阅读并借鉴 agent memory，但不应 fork 其代码开始新项目。

## 三、传统 ABM 平台及其价值

### 3.1 Mesa

**定位。** 活跃维护的 Python agent-based modeling 框架，提供 Agent/Model、空间、调度、数据收集、批量实验和浏览器可视化。Mesa 3 是当前稳定主线，Mesa 4 正在开发；官方仓库明确把自己定位为 Python 中 NetLogo、Repast、MASON 的替代方案。^11

**优势。**

- Python 原生，易与 LLM SDK、Pydantic、Pandas、SciPy 和 pytest 集成。
- 环境规则完全由代码定义，适合商品守恒、预算、生产与清算等严格机制。
- 轻量，适合本科生理解和修改；无须分布式基础设施。
- 数据收集、空间/网络和可视化够用，且项目仍活跃开发。
- 允许 rule-based、优化器和 LLM policy 共用同一环境，便于做真正的控制变量实验。

**劣势。**

- 不内置 LLM agent、记忆、prompt、模型适配、token 日志或私有自然语言 observation。
- 需要自己定义 Policy 接口、schema、调用缓存和异常处理。
- Mesa 4 尚在 alpha；新项目应锁定稳定版本，避免追随 pre-release。

**对本项目的适用度：最高。**

它不负责“让代理像人”，却最适合保证经济环境正确。这正是本项目更难替代的部分。

### 3.2 NetLogo

**定位。** 成熟、易学、面向教学和研究的 ABM 语言与 IDE。NetLogo 7 已发布，带现代 GUI、模型库、BehaviorSpace 和浏览器版本。^12

**优势。** 上手快、可视化强、经典模型与教学资料丰富，适合快速验证规则和向非程序人员展示涌现现象。

**劣势。** LLM API、异步调用、现代 Python 数据栈和复杂工程测试的集成不自然；NetLogo 专用语言会形成双语言系统。

**对本项目的适用度：中等。** 可用来做纯规则经济模型的概念验证，不建议作为最终 LLM 实验底座。

### 3.3 GAMA

**定位。** 以空间显式、GIS、多层 agent 和虚拟实验见长的成熟 ABM 平台，使用 GAML 语言，并提供参数探索、校准、批处理和丰富可视化。^13

**优势。** 城市、交通、地理空间、资源网络和复杂空间行为能力强；实验与校准工具成熟。

**劣势。** 对没有 GIS/城市空间需求的 toy 经济过重；需要学习 GAML；LLM 集成不是其核心工作流。

**对本项目的适用度：低。** 若未来研究城市空间、交通与区域经济，才值得重新评估。

## 四、通用多智能体框架：为什么不作为主底座

### CAMEL

CAMEL 是采用广泛的通用 multi-agent 框架，提供角色、memory、tool、society、数据生成和大规模运行能力；OASIS 就建立在 CAMEL agent 之上。^2 优点是生态和 LLM 工程能力强，缺点是它首先服务协作、任务完成和数据生成，不自动提供一个可验证的社会环境。适合被用作 `LLMPolicy` 的实现层，不适合单独承担经济模拟。

### AgentScope

AgentScope 强调开发者友好的 agent、message exchange、分布式 actor 和大规模模拟，论文展示了本地到分布式部署能力。^14 优点是并发、可观测性和通用组件；缺点同样是缺少领域世界、清算规则和社会科学验证。它可替代自写 LLM client/runtime，但不是经济环境。

### AgentVerse

AgentVerse 明确包含 task-solving 和 simulation 两条路线，并提供博弈、课堂等例子；但官方仓库提示 simulation 代码在重构，需要稳定版时使用旧 `release-0.1` 分支。^15 这使其不适合成为新研究项目的长期底座。

### AutoGen / Microsoft Agent Framework

AutoGen 社区很大，但官方仓库目前建议新项目迁移至 Microsoft Agent Framework。^16 其强项是对话式 agent application 和工作流，不是 agent-based social science；迁移期也不利于把它作为研究模拟的核心依赖。

结论：这些框架的 star 或开发者数量可能远高于专门社会模拟框架，但衡量的是 agent application 生态，而不是社会模拟有效性。它们最多承担模型调用、工具调用或并发层。

## 五、横向比较

评分为本报告针对“小规模市场经济—计划经济 LLM toy 环境”的分析判断，5 为最好；不是通用质量排名。

| 框架 | 类型 | 环境可定制性 | 严格规则/可复现 | LLM 原生能力 | 大规模执行 | 学习成本 | 与本项目匹配 |
|---|---|---:|---:|---:|---:|---:|---:|
| Mesa | 传统 Python ABM | 5 | 5 | 1 | 3 | 2 | **5** |
| Concordia | 通用 LLM 社会模拟 | 5 | 3 | 5 | 3 | 3 | **4** |
| AgentSociety 2 | 大规模 LLM 社会平台 | 4 | 4 | 5 | 5 | 5 | **3** |
| SOTOPIA/S4 | 社会互动与评价 | 3 | 3 | 5 | 3 | 3 | **2–3** |
| NetLogo | 教学/研究 ABM | 4 | 5 | 1 | 3 | 1 | **3** |
| OASIS | 社交媒体模拟器 | 2 | 4 | 5 | 5 | 4 | **2** |
| Generative Agents | 论文原型 | 2 | 2 | 4 | 1 | 4 | **1–2** |
| GAMA | 空间/GIS ABM | 5 | 5 | 1 | 4 | 4 | **2** |
| CAMEL/AgentScope | 通用 LLM runtime | 3 | 2 | 5 | 4–5 | 3–4 | **2（辅助层）** |

需要特别说明：Concordia 的“严格规则/可复现”只有在用代码组件结算行动时才可达到 3；如果让 LLM Game Master 自由生成世界结果，这一评分应降为 1–2。AgentSociety 的 trace/replay 提高了可审计性，但 replay 不能自动消除 LLM 决策的随机性。

## 六、针对本项目的选型建议

### 推荐方案：Mesa + 薄 LLM Policy 层

这是研究质量、学生可理解性和开发工作量之间的最佳平衡。

**Mesa 负责：**

- agent 集合、模型状态和时钟；
- 市场/计划两种机制共享的资源、生产与消费环境；
- 交易清算、库存、货币、预算和约束；
- 随机冲击、随机种子和批量实验；
- 日志、指标和可视化。

**LLM Policy 层负责：**

- 将 agent 的私有 observation 转为 prompt；
- 根据 persona、目标和历史生成结构化 action；
- schema 校验、越界拒绝、重试、缓存和 token 记录；
- 可选的摘要记忆或 Concordia 风格 associative memory。

**为什么优于全用 Concordia：** 经济制度比较要求“同一环境，只替换资源配置机制或决策策略”。Mesa 更容易保证两个实验组共享完全相同的状态转移、约束和指标，也更容易加入不使用 LLM 的规则/优化基线。

### 备选方案：Concordia + 确定性经济 Game Master 组件

如果项目更重视自然语言社会互动、角色身份、记忆和制度叙事，可以只用 Concordia。但必须做到：

1. action 使用有限 JSON schema，例如生产、报价、下单、申报需求和投票；
2. Game Master 的交易和计划结算部分不调用 LLM；
3. 每个 agent 只获得授权的私有 observation；
4. LLM 只生成意图，不直接写环境状态；
5. 所有非法 action 采用预先规定、制度中立的处理规则。

这种方案减少自写 memory/prompt 组件的工作，但学生需要理解 Concordia 较复杂的组件系统。

### 何时改选 AgentSociety 2

只有出现以下需求时再迁移或采用 AgentSociety 2：

- 代理规模明确达到数百以上；
- 单次实验持续很久，需要中断恢复；
- 多台机器或多模型并行调用；
- 需要统一 Web/CLI/API 管理大量实验；
- trace/replay 和社会科学研究工作流成为主要需求。

不要因为它内置“economy”或展示过 UBI 案例就直接选用；首先应确认该模块的状态变量、市场规则和指标是否与本研究定义一致。

## 七、风险与验证要求

框架只能解决工程组织，不能保证模拟有效。两项研究尤其影响本项目：一项发现全知脚本式模拟在不现实的共享信息条件下表现更好，而严格信息不对称会显著降低代理表现；另一类研究指出人口 persona 可能形成 caricature 而非可靠人群模型。^17 ^18

无论选择哪个框架，都应满足：

- 私有信息在 prompt、memory、日志回填和 evaluator 中均不泄漏；
- LLM 不负责维护商品、货币和库存真值；
- 所有 action 进入环境前做 schema 与可行性校验；
- 固定并记录模型版本、提示词、采样参数、代码版本和随机种子；
- 同时运行 rule-based、随机和优化基线；
- 更换模型、温度、persona 表述和行动顺序后做稳健性分析；
- 评价优先使用环境中的客观结果，LLM judge 只做补充定性评价；
- 不以“对话像人”或少数涌现故事作为制度优劣证据。

## 八、最终决策

**建议立项时选择：Mesa 3 稳定版作为环境核心，自写一个很薄的 `Policy` 接口；阅读并复用 Concordia 的设计思想，但不把整个项目绑定到 LLM Game Master。**

如果团队希望尽快做出带人物记忆和自然语言互动的 demo，并愿意接受较高的框架学习成本，则选择 **Concordia + 确定性经济组件**。SOTOPIA 可作为谈判和社会行为评价的参考；OASIS、AgentSociety 2、Generative Agents 均不应成为第一阶段底座。

这一结论不是认为 Mesa 比其他框架更“先进”，而是本项目的关键难点是制度之间的可比性、硬约束和实验复现。LLM 社会模拟框架最擅长的自然语言行为与角色连续性，应被放在这些硬约束之上，而不能取代它们。

## Sources

1. Park, J. S. et al. “[Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442).” UIST 2023；[官方代码](https://github.com/joonspk-research/generative_agents)。
2. Li, G. et al. “[CAMEL: Communicative Agents for ‘Mind’ Exploration of Large Scale Language Model Society](https://arxiv.org/abs/2303.17760).” 2023；[官方代码](https://github.com/camel-ai/camel)。
3. Yang, Z. et al. “[OASIS: Open Agent Social Interaction Simulations with One Million Agents](https://arxiv.org/abs/2411.11581).” 2024；[官方代码](https://github.com/camel-ai/oasis)。
4. Vezhnevets, A. S. et al. “[Generative Agent-Based Modeling with Actions Grounded in Physical, Social, or Digital Space Using Concordia](https://arxiv.org/abs/2312.03664).” 2023；[官方代码](https://github.com/google-deepmind/concordia)。
5. Piao, J. et al. “[AgentSociety: Large-Scale Simulation of LLM-Driven Generative Agents Advances Understanding of Human Behaviors and Society](https://arxiv.org/abs/2502.08691).” 2025；[官方代码](https://github.com/tsinghua-fib-lab/AgentSociety)。
6. AgentSociety Team. “[AgentSociety 2 Architecture and Scalability](https://agentsociety2.readthedocs.io/en/latest/architecture.html).” 官方文档，访问于 2026-09。
7. Zhou, X. et al. “[SOTOPIA: Interactive Evaluation for Social Intelligence in Language Agents](https://arxiv.org/abs/2310.11667).” ICLR 2024；[官方代码](https://github.com/sotopia-lab/sotopia)。
8. Zhou, X. et al. “[SOTOPIA-S4: A User-Friendly System for Flexible, Customizable, and Large-Scale Social Simulation](https://aclanthology.org/2025.naacl-demo.30/).” NAACL 2025.
9. Wang, R. et al. “[SOTOPIA-π: Interactive Learning of Socially Intelligent Language Agents](https://arxiv.org/abs/2403.08715).” 2024.
10. CAMEL-AI. “[OASIS Environment: Connecting Simulation to the Real World](https://www.camel-ai.org/blogs/oasis-environment-connecting-simulation-to-the-real-world).” 官方项目说明。
11. Mesa Project. “[Mesa: Agent-Based Modeling in Python](https://github.com/mesa/mesa).” 官方仓库；[版本发布](https://github.com/mesa/mesa/releases)。
12. Northwestern University Center for Connected Learning. “[NetLogo](https://www.netlogo.org/).” 官方网站；[版本历史](https://docs.netlogo.org/versions)。
13. GAMA Consortium. “[GAMA Platform](https://gama-platform.org/wiki/next/Home).” 官方文档。
14. Gao, D. et al. “[AgentScope: A Flexible yet Robust Multi-Agent Platform](https://arxiv.org/abs/2402.14034).” 2024；[官方代码](https://github.com/agentscope-ai/agentscope)。
15. Chen, W. et al. “[AgentVerse: Facilitating Multi-Agent Collaboration and Exploring Emergent Behaviors](https://arxiv.org/abs/2308.10848).” 2023；[官方代码](https://github.com/OpenBMB/AgentVerse)。
16. Microsoft. “[AutoGen](https://github.com/microsoft/autogen).” 官方仓库；[Microsoft Agent Framework 文档](https://learn.microsoft.com/en-us/agent-framework/)。
17. Zhou, X. et al. “[Is This the Real Life? Is This Just Fantasy? The Misleading Success of Simulating Social Interactions With LLMs](https://aclanthology.org/2024.emnlp-main.1208/).” EMNLP 2024.
18. Cheng, M., Piccardi, T., Yang, D. “[CoMPosT: Characterizing and Evaluating Caricature in LLM Simulations](https://aclanthology.org/2023.emnlp-main.669/).” EMNLP 2023.
19. Mou, X. et al. “[From Individual to Society: A Survey on Social Simulation Driven by Large Language Model-Based Agents](https://arxiv.org/abs/2412.03563).” 2024；[配套索引](https://github.com/FudanDISC/SocialAgent)。
20. Taillandier, P. et al. “[Integrating LLM in Agent-Based Social Simulation: Opportunities and Challenges](https://arxiv.org/abs/2507.19364).” 2025.
