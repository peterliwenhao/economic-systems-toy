# 自动售货机工程示例

这个例子用于演示多人项目中的公共数据结构、`Protocol` 接口、可替换实现、编排类、纯函数和测试。

运行示例：

```bash
python run_demo.py
```

运行测试：

```bash
python -m unittest discover -s tests -v
```

所有金额都使用整数分，避免浮点误差。`VendingMachine` 负责组织购买流程；定价、支付和库存通过 `Protocol` 连接。
