# 代码目录

`economic_toy/` 是可安装的 Python 包。研究机制在 T-001 设计通过前只保留边界，不提前固定语义。

```text
economic_toy/
├── env/          # 状态、转移、生产/消费、守恒约束
├── mechanisms/   # 市场、计划、混合资源配置机制
├── agents/       # 规则、优化与 LLM 决策策略的统一接口
├── llm/          # 模型供应商 adapter、结构化输出、缓存与费用
├── evaluation/   # 指标、统计汇总与比较
└── runtime.py    # 与研究语义无关的 run 记录基础设施
```

不要把制度规则写进 LLM prompt adapter；机制属于 `mechanisms/`，LLM 只是 `agents/` 下的一类策略。
