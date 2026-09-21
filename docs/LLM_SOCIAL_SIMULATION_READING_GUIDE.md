# LLM 社会模拟：本科生基础阅读与框架甄别

更新日期：2026-09-03

## 先给结论

本科生不需要先把所有 multi-agent/agent 框架学一遍。建议只沿四条线学习：

1. **代理怎样形成连续行为**：记忆、检索、反思、规划。
2. **环境怎样约束行为**：观测、行动、时序、世界状态和行动结算。
3. **多个代理怎样互动**：私有信息、通信、社会关系和涌现现象。
4. **模拟怎样被验证**：行为真实性、群体分布、因果/干预结果、稳健性与偏差。

其中第 4 条最重要。能生成一段可信故事，不等于能模拟人类，更不等于能支持社会科学结论。

## A 级：必须精读和动手复现

### 1. Generative Agents（Park et al., 2023）

- [论文](https://arxiv.org/abs/2304.03442)
- 要学：observation → memory stream → retrieval → reflection → planning 的完整链条；记忆按相关性、新近性和重要性取回；用消融判断模块是否真的有贡献。
- 它为什么基础：这篇工作建立了后来大量“LLM 小镇/社会”项目沿用的代理范式。
- 不要误学：论文主要验证的是 believability，不是预测真实人群或政策结果的准确性。
- 动手任务：不用图形界面，只实现 3 个代理、20 个离散时步；分别关闭 reflection、planning、memory retrieval，比较行为连续性和信息传播。

### 2. Concordia（DeepMind, 2023–）

- [论文](https://arxiv.org/abs/2312.03664)
- [官方代码](https://github.com/google-deepmind/concordia)
- 要学：Entity、Component、Engine、Game Master；特别是把代理的自然语言意图和环境中真正发生的结果分开。
- 它为什么基础：相比“大家轮流聊天”，Concordia 明确表达时间、因果、观测和行动结算，是更接近研究用 agent-based model 的框架。
- 需要读的代码：一个最小 example、一个 agent prefab、一个 game-master/environment component、simulation logging；不要求通读仓库。
- 动手任务：修改一个官方示例，加入私有观测和一个可客观计分的行动；证明代理无法读取未授权信息。

### 3. SOTOPIA（Zhou et al., 2023/ICLR 2024）

- [论文](https://arxiv.org/abs/2310.11667)
- [官方代码](https://github.com/sotopia-lab/sotopia)
- 要学：scenario、角色背景、私有社会目标、双人交互、episode sampler 和多维评价。
- 它为什么基础：它把重点从“生成一个社会故事”移到“定义任务并评价社会智能”，可帮助学生理解 benchmark 和 simulator 的区别。
- 需要警惕：LLM-as-a-judge 不是客观真值；后续 SOTOPIA-π 发现，用 LLM 评分训练的代理可能被同类评分器高估。
- 动手任务：复现少量 episode，并手工双盲评分；比较人工评分、规则指标和 LLM judge 的一致性。

### 4. 两篇方法论反例

#### 信息不对称

- [Is This the Real Life? Is This Just Fantasy?（EMNLP 2024）](https://aclanthology.org/2024.emnlp-main.1208/)
- 要学：单个全知模型生成所有角色，会泄露私有信息并夸大模拟效果；真实社会互动通常是 non-omniscient 的。
- 动手任务：同一场景分别用共享上下文和严格隔离上下文运行，检查行动与评价差异。

#### 人群刻板化与模拟边界

- [CoMPosT（EMNLP 2023）](https://aclanthology.org/2023.emnlp-main.669/)
- 要学：用 Context、Model、Persona、Topic 分解模拟设定；人口属性 prompt 可能产生 caricature，而不是可靠的个体或人群模型。
- 动手任务：改变 persona 信息的表述顺序、详略和人口标签，测量输出分布是否稳定。

## B 级：选读，用来理解不同框架路线

### OASIS：大规模社交媒体模拟

- [论文](https://arxiv.org/abs/2411.11581)
- [官方代码](https://github.com/camel-ai/oasis)
- 特点：动态社交网络、帖子、关注/评论/转发、推荐系统以及大规模代理调度。
- 适合：研究传播、极化、从众和平台机制。
- 本项目中的价值：学习如何把“平台规则”和“LLM 用户策略”分开。
- 为什么不是入门首选：规模很大不代表有效性更高；系统工程会遮蔽核心实验设计。

### AgentSociety：城市/社会级模拟

- [论文](https://arxiv.org/abs/2502.08691)
- [项目主页](https://agentsociety.fiblab.net/)
- 特点：较丰富的社会环境、大规模代理、问卷/访谈/干预式实验，并展示极化、UBI、灾害冲击等案例。
- 适合：理解社会实验工作流、人口生成和分布式模拟。
- 为什么是选读：系统复杂，论文中的现实一致性结果需要逐项审视其校准数据、自由度和外部验证，不能把案例展示当成普适证明。

### OASIS 之前的 S³：社交网络模拟

- [S³ 论文](https://arxiv.org/abs/2307.14984)
- 价值：较早把 LLM agent 放入传统 social-network simulation，围绕情绪、态度和互动建模。
- 阅读目的：观察从领域专用模拟器到 OASIS 通用平台的演进，不建议以它作为新项目底座。

### SocioVerse：真实用户池与多重对齐

- [论文](https://arxiv.org/abs/2504.10157)
- 特点：强调环境、目标用户、互动机制和行为模式的 alignment，并报告千万级真实用户池。
- 阅读目的：理解“persona prompt”之外还需要人口、环境和行为分布校准。
- 定位：前沿案例，不是基础教材；重点审查数据可得性、隐私、代表性和复现条件。

## C 级：知道它们是什么即可

- [CAMEL](https://arxiv.org/abs/2303.17760)：角色扮演与 communicative agents 的通用框架；对多代理协作有影响，但不是专为社会科学有效性设计。
- [AgentVerse](https://arxiv.org/abs/2308.10848)：通用多代理协作/涌现框架；可了解任务分解和交互编排，无需作为本项目必学底座。
- AutoGen、LangGraph、CrewAI 等通用 agent orchestration：是软件编排工具，不是社会模拟方法论；会调用工具或轮流对话，不自动带来行为真实性、环境有效性或因果解释。
- OASIS/AgentSociety 的百万级、万级规模结论：了解其工程思路即可。toy 项目的瓶颈首先是可验证性，不是 agent 数量。

## 建议补充的“硅样本”基础

这些不是完整社会模拟框架，但能帮助学生理解 LLM 是否能代替实验参与者：

- [Using LLMs to Simulate Multiple Humans and Replicate Human Subject Studies](https://arxiv.org/abs/2208.10264)：Turing Experiment 思路，用经典实验比较模型与人类行为，并寻找系统性偏差。
- [Large Language Models as Simulated Economic Agents: Homo Silicus](https://arxiv.org/abs/2301.07543)：早期把 LLM 置于经济实验条件中的代表工作。
- [From Individual to Society: A Survey](https://arxiv.org/abs/2412.03563)：用作索引，按 individual / scenario / society simulation 查文献；不代替精读原论文。
- [Talking About Large Language Models](https://arxiv.org/abs/2212.03551)：建立反拟人化意识，避免把流畅语言直接解释为信念、人格或认知机制。

## 学完后必须能回答的 12 个问题

1. agent 的状态与聊天历史有什么区别？
2. 哪些记忆被存储、压缩、遗忘和取回？
3. persona 是稳定行为模型，还是只是一段诱导文本？
4. 每个 agent 的 observation 是否严格隔离？
5. 自然语言 action 怎样落到有限、可验证的环境变化？
6. 谁决定行动结果：环境规则还是另一个 LLM？
7. 模拟是同步还是异步，行动顺序是否改变结论？
8. 个体“像人”与群体统计“像真实数据”是否分别验证？
9. 评价来自规则、真实数据、人类还是另一个 LLM？它会偏向谁？
10. 更换模型、提示词、温度和人口描述后，结论是否保持？
11. 训练数据中是否可能已经出现被复现的经典实验或答案？
12. 结果只能说明这个人工世界，还是有证据支持外推到现实？

如果学生不能清楚回答这些问题，就还没有掌握 LLM 社会模拟的基础，即使已经能运行一个大型框架。

## 最小学习顺序（约 3 周）

### 第 1 周：代理结构

- 精读 Generative Agents。
- 实现一个最小 memory/retrieval/planning loop。
- 做一次模块消融，不追求 UI 和大量代理。

### 第 2 周：环境与评价

- 跑 Concordia 最小示例，追踪一次 observation → action → resolution → logging。
- 跑 SOTOPIA 少量 episode，对比人工、规则和 LLM 评价。

### 第 3 周：有效性

- 精读信息不对称论文与 CoMPosT。
- 做共享/隔离上下文和 persona perturbation 两个实验。
- 最终提交一页“这个模拟能说明什么、不能说明什么”。

## 框架选择建议

如果之后确实要搭 toy 社会：优先借鉴或直接使用 **Concordia**，因为它对 agent、世界和行动结算的分层最贴近社会模拟问题；若研究的是双人社会能力评价，选 **SOTOPIA**；若明确研究社交平台传播机制，才选 **OASIS**；只有做到人口校准和较大规模干预实验时，再评估 **AgentSociety**。

这不是说 Concordia 的结论更“真实”，而是它较适合把假设显式化。最终可信度仍取决于外部数据验证、信息隔离、稳健性实验和结论边界。
