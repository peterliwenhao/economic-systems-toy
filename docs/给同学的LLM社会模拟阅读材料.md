# LLM 社会模拟阅读材料

这份材料用于帮助你了解：如何使用大语言模型构造具有记忆、行动和互动能力的社会代理，以及如何判断这种模拟是否可信。

不要求一开始掌握所有多智能体框架。请先理解代理结构、环境结构、社会互动和模拟验证四件事。建议按下面顺序阅读。

## 一、基础必读

### 0. From Individual to Society: A Survey on Social Simulation Driven by LLM-based Agents

- 综述：[arXiv](https://arxiv.org/abs/2412.03563)
- 配套文献索引：[FudanDISC/SocialAgent](https://github.com/FudanDISC/SocialAgent)

建议先读这篇综述，建立领域全貌。文章将相关工作分为 individual simulation、scenario simulation 和 society simulation，并整理了常用架构、研究场景、数据集和评价方式。

阅读时重点理解三类模拟的目标和评价标准有什么不同，并利用配套索引查找原始论文。综述用于建立地图，具体结论仍应回到原始论文核对。

### 1. Generative Agents: Interactive Simulacra of Human Behavior

- 论文：[arXiv](https://arxiv.org/abs/2304.03442)
- 作者：Joon Sung Park 等，2023

这篇论文展示了一个由 25 个 LLM 代理组成的虚拟小镇。重点阅读代理的 memory stream、memory retrieval、reflection 和 planning，不必关注网页界面。

读完后应能说明：代理如何记录经历、选择相关记忆、形成较长期认识并安排后续行动；论文中的“行为可信”与“能够预测真人行为”为什么不是同一件事。

### 2. Generative Agent-Based Modeling with Concordia

- 论文：[arXiv](https://arxiv.org/abs/2312.03664)
- 官方代码：[Google DeepMind Concordia](https://github.com/google-deepmind/concordia)

Concordia 是专门用于 generative social simulation 的开源框架。它将系统分为代理实体、组件、模拟引擎和 Game Master。代理用自然语言表达行动意图，环境再判断实际发生的结果。

重点理解：agent 与 environment 为什么必须分开；观测、行动、时间推进和行动结算分别由谁负责；Game Master 带来了哪些便利，又可能引入哪些主观判断。

建议运行官方最小示例，并跟踪一次完整的 observation → action → resolution → logging 流程。

### 3. SOTOPIA: Interactive Evaluation for Social Intelligence in Language Agents

- 论文：[arXiv](https://arxiv.org/abs/2310.11667)
- 官方代码：[SOTOPIA](https://github.com/sotopia-lab/sotopia)

SOTOPIA 用开放式双人社会场景评价语言代理。每个角色可以具有背景信息和私有目标，代理需要通过合作、竞争或协商完成目标。

重点理解：如何把社会互动写成可重复的 episode；如何设置角色私有信息；如何从目标完成、社会规范和行为质量等角度评价结果。

同时注意：由另一个 LLM 打分并不等于获得客观真值。

### 4. Is This the Real Life? Is This Just Fantasy?

- 论文：[ACL Anthology](https://aclanthology.org/2024.emnlp-main.1208/)
- 作者：Xuhui Zhou 等，EMNLP 2024

这篇论文比较了全知和非全知的社会模拟。若同一个模型掌握所有角色的私有信息，模拟可能表现得很好，但这种设定并不符合现实中的信息不对称。

重点理解：为什么不同代理的上下文必须隔离；为什么不能让环境裁判或其他角色看到本不该知道的信息；信息泄漏会怎样夸大实验效果。

### 5. CoMPosT: Characterizing and Evaluating Caricature in LLM Simulations

- 论文：[ACL Anthology](https://aclanthology.org/2023.emnlp-main.669/)
- 作者：Myra Cheng、Tiziano Piccardi、Diyi Yang，EMNLP 2023

这篇论文讨论使用 LLM 模拟特定人群时的刻板化问题，并从 Context、Model、Persona 和 Topic 四个维度分析模拟设定。

重点理解：人口属性或角色描述不一定能产生可靠的人类行为模型；模型可能只是放大训练数据中的刻板印象；改变 persona 的表达方式可能明显改变结果。

## 二、按研究方向选读

### 社交媒体模拟：OASIS

- 论文：[OASIS](https://arxiv.org/abs/2411.11581)
- 官方代码：[CAMEL-AI/OASIS](https://github.com/camel-ai/oasis)

OASIS 模拟类似 Twitter/X 和 Reddit 的社交平台，包含发帖、关注、评论、转发、动态网络和推荐系统。适合了解信息传播、群体极化和从众现象的模拟方法。

重点看平台规则、推荐算法和 LLM 用户策略如何分离。无需复现百万代理实验。

### 大规模社会模拟：AgentSociety

- 论文：[AgentSociety](https://arxiv.org/abs/2502.08691)
- 项目主页：[AgentSociety](https://agentsociety.fiblab.net/)

AgentSociety 将 LLM 代理放入较丰富的社会环境，并展示问卷、访谈、社会干预以及极化、基本收入和灾害冲击等案例。

重点了解人口构造、社会环境、实验干预和群体指标。阅读结果时应检查使用了什么现实数据进行校准和验证，而不能只看代理数量。

### 社交网络模拟：S³

- 论文：[S³: Social-network Simulation System](https://arxiv.org/abs/2307.14984)

这是一项较早的 LLM 社交网络模拟工作，主要建模用户的情绪、态度和互动行为，并观察信息、态度和情绪的群体传播。

可将它与 OASIS 对照阅读，了解领域专用原型如何发展为规模更大的通用平台。

### 人群与环境校准：SocioVerse

- 论文：[SocioVerse](https://arxiv.org/abs/2504.10157)

SocioVerse 强调环境、目标用户、互动机制和行为模式四方面的对齐，并使用现实用户数据构造代理池。

重点了解：社会模拟不能只依靠一段 persona prompt，还需要考虑样本代表性、现实行为分布、环境一致性和隐私问题。

## 三、补充阅读

### LLM 能否作为实验参与者

- [Using Large Language Models to Simulate Multiple Humans and Replicate Human Subject Studies](https://arxiv.org/abs/2208.10264)
- [Large Language Models as Simulated Economic Agents: What Can We Learn from Homo Silicus?](https://arxiv.org/abs/2301.07543)

这两项工作把 LLM 放入经典心理学、社会学或经济学实验。阅读重点不是模型是否复现了某个著名结果，而是作者如何与人类实验数据比较，以及怎样识别模型稳定存在的行为偏差。

### 避免拟人化

- [Talking About Large Language Models](https://arxiv.org/abs/2212.03551)

这篇短文提醒读者，不要因为模型语言自然，就直接认为模型具有与人相同的信念、人格和认知机制。这个区别对解释社会模拟结果非常重要。

## 四、读完后应当能够回答

- 代理的状态、记忆和聊天记录分别是什么？
- 代理能观察到哪些信息，哪些信息必须保持私有？
- 自然语言行动如何转换成环境中真实发生的事件？
- 行动结果由固定规则还是 LLM 裁判决定？
- 个体行为看起来合理，是否意味着群体统计也符合现实？
- 模拟结果使用什么人类数据或真实数据验证？
- 更换模型、提示词、温度和 persona 后，结果是否保持稳定？
- 结论只适用于这个人工场景，还是有足够证据外推到现实？

如果这些问题还不能清楚回答，就应继续理解模拟设计与验证，而不是急于增加代理数量或搭建复杂界面。
