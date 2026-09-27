# 本地运行目录（不进入 Git）

每次运行建立唯一目录：

```text
runs/RUN-T004-.../
├── config.json    # 本次实际使用的完整配置
├── manifest.json  # task、commit、branch、dirty、命令、操作者、状态
├── metrics.json   # 机器可读指标
├── logs/          # 可选完整日志
└── artifacts/     # 可选轨迹、图、模型输出
```

除本说明外，`runs/` 已被 Git 忽略。需要支持论文结论的 run，应将小型 manifest/汇总复制到 `experiments/manifests/` 和 `results/`，大型产物上传共享存储并记录稳定 URI。
