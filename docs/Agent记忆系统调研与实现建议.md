# Agent 记忆系统调研与实现建议

## 结论

考虑上下文长度后，项目仍然适合自己写经济模拟核心，但不建议把 memory 当成简单聊天历史，也不建议直接把 Letta、Mem0 或 Zep 整套接入。

推荐方案是：

> **自定义一个面向实验的 MemoryManager，复用现成的数据库和 embedding；第一版参考 Concordia 的 associative memory，必要时用 LangGraph Store 提供持久化与语义检索。**

这里的“自己写”只包括约 200–400 行与实验语义有关的策略代码：记忆类型、写入条件、检索评分、上下文预算、隔离规则和日志。SQLite、向量计算、embedding 和模型调用都使用现成库。

不推荐让第三方框架自动决定哪些事实值得记住，因为 memory policy 本身会改变 agent 行为，是实验模型的一部分。

## 项目真正需要的记忆

每个 agent 至少有四层状态：

1. **固定身份（always in context）**：角色、偏好、生产能力、长期目标。这些不是检索式记忆。
2. **结构化经济状态（由环境提供）**：当前货币、库存、价格、订单和可观察公共信息。它们是世界真值，不应存入自然语言长期记忆并依靠检索获取。
3. **近期情节记忆（recent episodic memory）**：最近若干轮观察、行动与结果。
4. **长期情节/信念记忆（retrieved memory）**：过去交易、对其他 agent 的经验、形成的信念和周期摘要。

每次决策的上下文应当是：

```text
固定身份
+ 当前结构化 observation
+ 最近 K 条事件
+ 与当前决策最相关的 R 条长期记忆
+ 上一周期摘要（可选）
```

这样即使长时间运行，上下文大小也近似固定。

## 可用框架比较

### Concordia AssociativeMemoryBank

Concordia 要求提供文本 embedder，并提供 associative memory、近期观察、摘要和基于记忆生成 agent context 的组件。它直接服务 generative social simulation，而不是客服或个人助理。官方 changelog 显示该项目仍在修复 memory 去重、时间序列化和检索行为等问题，并在 2.x 中简化了 component 与 memory 的交互。^1 ^2

**优点：**

- 与社会模拟的时间、观察和 agent component 模型一致。
- 能参考或直接使用已有的 associative memory bank。
- 适合 episodic event，而不仅是用户偏好事实。
- 有 Generative Agents/Concordia 研究传统作为依据。

**缺点：**

- 绑定 Concordia 类型和组件生命周期时，会把整个项目拉向 Concordia。
- API 仍在演进；不同版本的 retrieval 行为可能变化。
- 默认 embedding 检索并不能自动保证经济上重要的事件被找回。
- 若 reflection/summary 使用 LLM，会增加调用成本和实验随机性。

**判断：最适合参考，可考虑只使用 memory bank；必须固定版本并记录每轮实际检索结果。**

### LangGraph Store

LangGraph 将短期记忆保存在 thread state/checkpointer，将长期记忆放入带 namespace 的 Store；Store 支持键值、内容过滤和 embedding 语义检索，并可使用内存、Postgres、MongoDB 或 Redis 等后端。其官方概念还区分 semantic、episodic 和 procedural memory。^3 ^4

**优点：**

- namespace 很适合按 `(experiment_id, agent_id)` 隔离记忆。
- 持久化、恢复和语义检索接口成熟。
- 不必采用复杂 graph workflow 才能理解其 Store 抽象。
- 更容易保存结构化 metadata，例如 tick、agent、事件类型、重要性和可见范围。

**缺点：**

- 它提供存储与检索能力，不提供适合社会模拟的 memory policy。
- 若引入整个 LangGraph 只为了 memory，会增加不必要依赖。
- semantic search 只衡量文本相似性，不等于决策相关性。

**判断：适合作为底层 Store，但写入、评分和 context composition 仍应自己定义。**

### Letta / MemGPT

Letta 将 agent 设计为长期存在的 stateful agent，使用始终位于上下文中的 editable memory blocks，以及上下文外的 recall/archival memory。agent 可通过工具自行编辑记忆；memory block 还可以在多个 agent 间共享和动态 attach/detach。^5 ^6

**优点：**

- 上下文分层和持久 agent 做得完整。
- 支持 private/shared blocks，理论上适合组织记忆或公共制度信息。
- 支持 agent 导入导出和长期运行。

**缺点：**

- agent 自己修改核心记忆会形成难以控制的额外决策过程。
- 产品目标偏个人助理、AI coworker，而不是重复可控的社会实验。
- 需要 Letta server/SDK 和其 agent runtime，侵入性强。
- 如果多个 agent 能写共享 block，很容易造成实验中的隐式信息泄漏。

**判断：不作为本项目第一版依赖。可借鉴 core/archival memory 分层，但不需要采用 Letta runtime。**

### Mem0

Mem0 提供托管和开源 memory layer，自动从消息中抽取记忆，并支持 `user_id`、`agent_id` 和 `run_id` 作用域。其 graph memory 会抽取实体、关系或实体共现，并与向量检索结合。^7 ^8

**优点：**

- 接口简单，接入速度快。
- 有 agent/run 级隔离，支持多 session 和图记忆。
- 适合产品型 agent 跨会话记住用户事实。

**缺点：**

- 自动 extraction/consolidation 是隐藏的模型过程，会改变实验条件。
- 新旧 graph memory 的实现和返回行为发生过迁移，长期复现需额外控制版本。
- 人物/实体知识图不等于经济决策需要的事件记忆。
- benchmark 结果主要回答长期问答检索能力，不直接证明社会行为模拟更真实。

**判断：适合快速产品原型，不适合第一版科学模拟的核心 memory。**

### Zep / Graphiti

Zep 从消息、业务数据和 JSON 构造 temporal context graph，保留事实与关系随时间变化的历史，并生成 token-efficient context。其底层 Graphiti 有开源实现。^9 ^10

**优点：**

- 对会变化的关系和事实具有时间建模能力。
- 适合长期、多实体、多跳关系检索。
- 当研究重点是社会网络、声誉和关系演化时有明显价值。

**缺点：**

- 对几十个 agent 的 toy 经济明显过重。
- 自动抽取知识图仍会引入额外 LLM 判断和不可重复性。
- 服务和图结构增加调试、部署与成本。
- 结构化经济状态本来就应由环境数据库保存，无需再从语言中抽取成图。

**判断：第一版不采用；以后若把社会关系网络作为主要研究变量，再单独评估 Graphiti。**

## 推荐实现

建议定义一个很小、可替换的接口：

```python
class MemoryManager(Protocol):
    def record(self, event: MemoryEvent) -> None: ...
    def retrieve(self, query: MemoryQuery, budget: int) -> list[MemoryItem]: ...
    def summarize(self, until_tick: int) -> Summary: ...
    def snapshot(self) -> MemorySnapshot: ...
    def restore(self, snapshot: MemorySnapshot) -> None: ...
```

`MemoryItem` 至少保存：

```text
memory_id
experiment_id
agent_id
tick
event_type
text
structured_payload
importance
visibility
embedding
source_event_ids
```

第一版 retrieval 不要只用向量相似度。建议使用显式可记录的组合分数：

```text
score = w1 × semantic_relevance
      + w2 × recency
      + w3 × fixed_importance
      + w4 × exact_entity_match
```

其中 `fixed_importance` 由确定性规则给出，例如破产、交易违约、重大价格变化高于日常观察；不要每条记忆都调用 LLM 打重要性分。

## 第一版技术选择

- **存储：SQLite**。每个实验一个数据库或以 `experiment_id` 隔离。
- **向量：小规模可直接 NumPy cosine similarity**；几十个 agent、几千条事件不需要独立 vector DB。
- **Embedding：固定同一模型与版本，并缓存到数据库。**
- **摘要：每 N 轮生成一次，但保存原始事件和摘要来源；摘要失败不能删除原始事件。**
- **上下文预算：按 token 数分配给身份、当前状态、近期事件、长期检索和摘要，而不是简单截断字符串。**
- **私有隔离：查询必须由代码强制加入 `experiment_id + agent_id + visibility` 条件，不能靠 prompt 要求模型保密。**
- **审计：每次 action 同时保存 prompt 中实际注入的 memory IDs 和 retrieval scores。**

如果想减少底层工作，可以把 SQLite/NumPy 替换成 LangGraph Store；如果决定整体采用 Concordia，则直接使用并封装 `AssociativeMemoryBank`。无论用哪种后端，对上层只暴露自己的 `MemoryManager`，避免以后更换框架时改动 agent 和环境代码。

## 为什么不是“完全自己写”或“整套采用框架”

完全自己实现数据库、ANN 索引、embedding client 和重试没有研究价值；整套采用产品型 memory framework，又会把最关键的实验变量交给黑盒 extraction 和 consolidation。

适合本项目的边界是：

| 层 | 是否自己定义 |
|---|---|
| 经济世界真值与账本 | 是 |
| 哪些事件进入记忆 | 是 |
| 记忆重要性和遗忘规则 | 是 |
| 检索组合分数与 token budget | 是 |
| agent 间可见性 | 是 |
| SQLite/向量计算/embedding API | 否，使用现成组件 |
| LLM 调用、tokenization、重试 | 否，使用官方 SDK/库 |

因此最终建议不是“完全自己写”，而是：

> **自写可实验控制的 memory policy，复用成熟的 storage/retrieval primitive。**

## 本地 Embedding 模型建议（单张 40GB A100）

针对中文或中英混合的社会模拟记忆，默认选择 **Qwen3-Embedding-4B**。它支持 100 多种语言、32K 上下文、instruction-aware retrieval，并支持通过 MRL 将输出维度从最高 2560 降到较小维度。对短小的 agent event，建议限制输入至 512 或 1024 tokens，并先使用 1024 维输出。^11

如果以效果上限为先，可以使用 **Qwen3-Embedding-8B**。其 BF16/FP16 权重约占 16GB，能够放入 40GB A100；实际显存还取决于 batch size 和输入长度。不要以 32K 输入和大 batch 作为默认配置。该模型最高输出 4096 维，同样支持 MRL；建议仍从 1024 或 2048 维开始。Qwen 官方报告显示该系列在多语言检索 benchmark 上表现很强，但项目最终仍应使用自建 memory retrieval 样本验证。^12 ^13

如果更重视吞吐、成熟度和简单部署，选择 **BGE-M3**。它约 0.6B 参数，支持 8192 tokens、1024 维向量以及 dense、sparse、multi-vector 三种检索方式，MIT 许可，社区使用广。对本项目第一版只启用 dense retrieval 即可。^14

更轻量的基线是 **multilingual-e5-large-instruct**：MIT 许可、支持 94 种语言、1024 维，模型权重约 1.12GB；但最大输入长度约 512 tokens。对于单条短事件完全够用，适合作为低成本对照。^15

`gte-Qwen2-7B-instruct` 也能在 A100 40GB 上运行，官方模型卡给出的 FP32 占用约 26.45GB，支持 32K 和 3584 维。但它已经被更新的 Qwen3 Embedding 系列覆盖，不建议作为新项目默认。^16

建议的实际组合：

| 用途 | 模型 | 建议配置 |
|---|---|---|
| 默认实验 | Qwen3-Embedding-4B | BF16，max length 512/1024，1024 维，归一化 |
| 高质量复核 | Qwen3-Embedding-8B | BF16，1024/2048 维，小 batch |
| 高吞吐基线 | BGE-M3 | BF16，dense only，1024 维 |
| 轻量基线 | multilingual-e5-large-instruct | FP16/BF16，最长 512，1024 维 |

不建议只看 MTEB 总分选模型。应人工构造 200–500 个与实验一致的查询，例如“最近谁曾违约”“上次粮价上涨时发生了什么”“哪个供应商可靠”，为每个查询标注应召回事件，再比较 Recall@K、MRR、延迟和显存。模型、revision、instruction、最大长度、输出维度和归一化设置必须固定并写入实验配置。

## Sources

1. Google DeepMind. “[Concordia](https://github.com/google-deepmind/concordia).” 官方仓库与架构说明，访问于 2026-09。
2. Google DeepMind. “[Concordia Changelog](https://github.com/google-deepmind/concordia/blob/main/CHANGELOG.md).” 官方版本记录，访问于 2026-09。
3. LangChain. “[Memory Overview](https://docs.langchain.com/oss/python/concepts/memory).” LangGraph 官方文档，访问于 2026-09。
4. LangChain. “[LangGraph Persistence](https://docs.langchain.com/oss/python/langgraph/persistence).” 官方文档，访问于 2026-09。
5. Letta. “[Letta Documentation](https://docs.letta.com/).” 官方文档，访问于 2026-09。
6. Letta. “[Attaching and Detaching Memory Blocks](https://docs.letta.com/tutorials/attaching-detaching-blocks/).” 官方文档，访问于 2026-09。
7. Mem0. “[Welcome to Mem0](https://docs.mem0.ai/introduction).” 官方文档，访问于 2026-09。
8. Mem0. “[Graph Memory](https://docs.mem0.ai/open-source/features/graph-memory).” 官方文档，访问于 2026-09。
9. Zep. “[Key Concepts](https://help.getzep.com/).” 官方文档，访问于 2026-09。
10. Rasmussen, P. et al. “[Zep: A Temporal Knowledge Graph Architecture for Agent Memory](https://arxiv.org/abs/2501.13956).” 2025.
11. Qwen Team. “[Qwen3-Embedding-4B](https://huggingface.co/Qwen/Qwen3-Embedding-4B).” 官方模型卡，访问于 2026-09。
12. Qwen Team. “[Qwen3-Embedding-8B](https://huggingface.co/Qwen/Qwen3-Embedding-8B).” 官方模型卡，访问于 2026-09。
13. Zhang, Y. et al. “[Qwen3 Embedding: Advancing Text Embedding and Reranking Through Foundation Models](https://arxiv.org/abs/2506.05176).” 2025.
14. BAAI. “[BGE-M3](https://huggingface.co/BAAI/bge-m3).” 官方模型卡，访问于 2026-09。
15. intfloat. “[multilingual-e5-large-instruct](https://huggingface.co/intfloat/multilingual-e5-large-instruct).” 官方模型卡，访问于 2026-09。
16. Alibaba-NLP. “[gte-Qwen2-7B-instruct](https://huggingface.co/Alibaba-NLP/gte-Qwen2-7B-instruct).” 官方模型卡，访问于 2026-09。
