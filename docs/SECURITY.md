# Release Candidate 安全说明

生产 CSP 删除 unsafe-eval 与本地 ws 来源；object-src none、base-uri self、frame-ancestors none、form-action self。保留 script/style unsafe-inline：当前静态预渲染依赖 Next Hydration 与主题内联脚本，GSAP 写入行内样式；改 nonce 需要动态渲染与全站缓存设计，不在本轮粗暴替换。参考 [Next.js 15 CSP](https://nextjs.org/docs/15/app/guides/content-security-policy)。这仍是残余 XSS 风险，不声称严格 CSP。

所有页面 nosniff、Referrer-Policy、X-Frame-Options。ENABLE_HSTS=1 才启一年 HSTS，不自动包括子域；HTTPS 确认后再启。只有 /api/resume/file 例外使用 SAMEORIGIN 与 frame-ancestors self，以便受保护 CV 内嵌原 PDF；鉴权/no-store 不变，外站仍不能嵌入。该路由响应头在 rc-security 专门断言。

SITE_MODE=production 要求合法 HTTPS SITE_URL，拒绝缺失/本机/路径/凭据。默认 local 支持离线审核构建；NODE_ENV=production 并不等于已授权公网发布。robots 仍 noindex。构建 URL 变化要重新 build。

Resume 保留 scrypt、随机盐、签名 nonce 会话、HttpOnly/SameSite=Strict、两小时过期、退出、原 PDF 和 Range。正式模式强制 Secure Cookie，不信任任意 Forwarded 来认定 HTTPS 或来源 IP。Origin 对比请求 Host；Nginx 必须覆盖 Host 并只代理本机服务。全局每分钟12次是现有单进程策略，恶意流量可耗尽该窗口；未擅自改成可伪造 X-Forwarded-For 的按 IP 限流。公网应在可信代理加限流；多实例需共享存储。

PDF 和口令配置只在 private/resume；outputFileTracingExcludes 保持。原证明和受保护 QA 在 private，不进源码/公开证据包。批准的凯岸团队截图只含本人姓名、原岗位文字、职责和岗位号；已按用户明确“作为证据”的授权保留同一裁切，没有修改事实，没有原图/其他员工/地址/联系方式。发布前仍由本人最终审核公开副本。艺术图不是证明。

运行依赖审计见 reports/release-candidate/logs/runtime-audit.json；开发链仍有14项 moderate（npm ci 日志），不强制破坏性升级。无公网/代理 HTTPS 实测、无渗透测试或专业安全认证。
