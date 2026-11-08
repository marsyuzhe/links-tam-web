> V1.2 当前验收和部署以 ZOOM_25_TO_500_ACCEPTANCE.md、DEPLOY_CLOUD_UBUNTU_NGINX.md、GITHUB_PAGES_MANUAL_NO_GIT.md、CODE_ARCHITECTURE.md 为准。下文保留为旧版本历史，不代表本轮状态。

# 运行与发布

最新版完整操作步骤见 [中文部署教程](DEPLOYMENT_STEP_BY_STEP.zh-CN.md)，包含源码包结构、Node 24、服务器安装、私有简历、Nginx/HTTPS、开机运行与回滚。下文为原有发布约束摘要；运行环境以新教程已验证的 Node 24 为准。

Node 24 LTS（本机验证 24.22.2），npm，Chrome。通用流程：npm ci --ignore-scripts；npm run dev。生产检查 npm run lint、npm run typecheck、npm run build，然后 npm start。默认 127.0.0.1:3006，仅本机。Windows 可选先激活 D:/LinksTools/Activate-LinksTools.ps1，不是其他开发者的必要依赖。

.env.example 无凭据。设置 NEXT_TELEMETRY_DISABLED=1 可关闭构建工具遥测；未使用的 @vercel/analytics 已移除。没有外部运行时遥测或 WebSocket 业务服务。CSP 仅保留本地开发 ws 连接及现有 PDF.js worker/blob 能力，不为视觉特效放宽策略。

主页、Craft 与项目档案可预渲染；Resume、PDF 和状态 API 需要 Node 服务端。不能用纯静态 GitHub Pages 承载密码保护。私有 PDF 与 access.private.json 必须单独放在运行环境 private/resume，不能进 Git/public/源码包。配置缺失时拒绝访问。多实例上线前需要共享限流存储。

当前 metadataBase 在 app/layout.tsx 是本地地址，robots/noindex 是审核状态。未经本人审核不要改为正式索引或部署。发布前独立设置站点域名、Open Graph 地址、robots 策略、HTTPS 和安全 Cookie；核对 sameOrigin 的实际代理 Host 行为。CSP 如需新资源，应精确列出来源并测试。

社区默认没有真实 Adapter，不提供虚构在线数据。接入后设置超时、缓存、验证与隐私白名单，不把后台管理地址或 Token 返回浏览器。

回滚：保存后续改动、停服务，按 reports/craft-edition/changed-files.json 恢复 before.zip 中 modified/deleted 文件，移除 added 文件，再 build/start。不要 reset 整仓。旧私有资料和历史归档不删除。恢复旧公开简历文件会破坏保护，未经明确授权不要这样操作。


## RC 域名配置替代旧手改步骤

旧文中的手改 metadataBase 现由 `.env.production.local` 的 SITE_MODE=production 与 SITE_URL=https://真实域名 取代；build/start 都保留该配置。HSTS 在 HTTPS 验证后用 ENABLE_HSTS=1 启用并重建。详细命令以逐步中文教程为准。仍未执行生产部署。
