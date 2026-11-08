# 排错

| 问题 | 检查步骤 |
|---|---|
| 安装失败 | 确认 Node 版本与 lock，npm ci --ignore-scripts；核对网络/代理，不先删除用户锁文件 |
| 构建失败或 EPERM | 停同工程 dev/start，重跑 typecheck/build；不要同时修改 .next |
| GSAP 不运行 | 确认 use client、lib/gsap 注册、ready 与 reduced-motion；看浏览器错误 |
| Pin 错位 | 检查唯一 ScrollSmoother、图片尺寸预留、布局 offset、刷新顺序与 ZoomReflow |
| 浏览器缩放 | 先验证原生 DPR 与 visualViewport，检查导航换行；不添加 CSS zoom |
| WebGL 失败 | ?graphics=2d 验证 fallback；检查设备内存、线程数与 contextlost，HTML 应仍可操作 |
| 图片不显示 | 检查 public 路径大小写、media id、原尺寸与 CSP，区分艺术封面和实图 |
| 状态查询失败 | 检查 /api/community/status、3 秒请求超时、适配器与缓存；未配置应为 planned |
| Resume 无法访问 | 检查 private/resume 两个文件存在，原 PDF 有效；检查 Cookie、Host、限流；不要移到 public |
| 端口占用 | 检查 3006 的进程命令，只停属于当前工程的服务；或给 next dev 指定另一个端口并同步测试 BASE_URL |
| Craft 弹层返回异常 | 检查 media 查询状态与 popstate 清理，不覆盖 Next 的 history.state |
| 测试报告含隐私 | 授权简历测试证据只放 private，源码包不要收录 private 或浏览器配置目录 |

维护命令见 README；开发依赖审计的 moderate ESLint 链不能用 force 降级框架来“清零”。


## RC 检查命令

`npm run typecheck`、`npm run lint`、`npm run format:check`、`npm run build`。正式发布先检查 SITE_MODE/SITE_URL，错误会阻止构建；本地预览使用默认 local 模式。CSP 问题检查浏览器 securitypolicyviolation 和真实响应头，不为消除错误直接加 unsafe-eval。服务器状态用 systemctl status links-tam 和 journalctl -u links-tam -n 100 --no-pager；不要粘贴 Cookie、口令、配置原值或受保护 PDF 到公共工单。专项脚本可用 LINKS_QA_ROOT 指定独立公开报告目录；认证录像仍在 private。
