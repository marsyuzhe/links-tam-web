# 私有简历边界

FULL_NODE 在服务器读取工作目录 `private/resume/access.private.json` 和 `official.pdf`。发行包不包含两者，服务器用 shared/private 符号链接独立提供。生成配置：在 release 工作目录将口令经 stdin 送给 `node scripts/configure-resume-access.mjs`；不要把口令写命令行参数、README、环境模板或 GitHub Secrets。这个项目的当前机制无需口令环境变量。

验证使用 scrypt（随机 salt），会话用随机密钥 HMAC；Cookie HttpOnly、SameSite=Strict，生产 Secure，2小时过期。每个 Node 进程每分钟最多 12 次鉴权尝试，先限流再计算哈希。多副本不能共享这个内存限流器，应另行设计共享限流。更新配置会使会话失效。缺配置时拒绝，不会开放 PDF。

PDF 仅经鉴权 API 同源读取；no-store/noindex/nosniff，查看器只允许同源 frame。简历页面不得进入 CDN 共享缓存。不要缓存 `/api/resume/*`，不要将 private 作为 Nginx root/alias。TLS、代理 Host 和正式 HTTPS SITE_URL 是正确部署的一部分。

PAGES_PUBLIC 构建主动排除 API、服务端鉴权模块、PDF 查看器、私有 Resume 组件和企业证明素材。公开 Resume 是公开概览，没有密码框，不模拟登录。任何 GitHub Pages 资源都可下载，不能存秘密。

`public/assets/evidence` 本地文件保留但所有 V1.2 包排除；展示组件默认关闭。以后若要公开，必须审核授权范围、脱敏与来源，再显式打开 `NEXT_PUBLIC_ENABLE_WORK_EVIDENCE=1` 并重新构建。该决定不改变履历事实，也不删除用户原件。

登录后的截图、浏览器视频/trace 仅存本机 `private/resume/qa/`，不进入公开证据包。公开测试报告只记录状态码与布尔结果，不记录口令或会话值。
