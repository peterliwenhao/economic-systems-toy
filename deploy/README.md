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

当前服务组成：

- 远端 `lifehub-proxy.service`：监听 9003，负责 TLS 和路径转发；
- 远端 `lifehub-projects-static.service`：在回环地址 19006 提供静态文件；
- 本机用户级 `lifehub-tunnels.service`：把远端 19103/19104 分别转回本机 8000/8001，供 PaperRec 和 LifeOS 使用；
- 50example 继续使用既有的远端 19005 隧道。

常用检查：

```bash
systemctl --user status lifehub-tunnels.service
ssh root@118.178.235.171 'systemctl status lifehub-proxy.service lifehub-projects-static.service'
curl -k -I https://118.178.235.171:9003/projects/economic-systems-toy/
```

本机账户当前未启用 systemd linger；本机重启且用户尚未登录时，用户级隧道不会自动建立。需要长期无人值守时，可由管理员启用 linger，或把该隧道迁到系统级服务。

不要向公开 Dashboard 放入密钥、个人联系方式、未公开数据或敏感实验结果。任务页面只展示团队已经同意共享的摘要。
