# Dashboard 部署说明

当前 Dashboard 是纯静态页面。生产副本部署到远端服务器的：

```text
/root/lifehub_static/projects/economic-systems-toy/
```

由 `https://118.178.235.171:9003/projects/economic-systems-toy/` 提供访问。

更新流程：

1. 在项目根目录运行 `npm run dashboard:build && npm run validate`；
2. 将 `dist/` 内容同步到上述远端目录；
3. 静态文件更新不需要重启代理；只有代理路由代码改变时才需要重启。

不要向公开 Dashboard 放入密钥、个人联系方式、未公开数据或敏感实验结果。任务页面只展示团队已经同意共享的摘要。
