# Source, licenses and evidence

原项目版本2.0.0，官方提交735f87df9940ecdf945b70d18ce9ea79422294a7。基线保留Next15.5.26、React19、GSAP3.15的原lock，成功npm ci与生产构建；桌面、手机、reduced-motion实际操作记录在baseline-results.json及同名WEBM。原始归档和原作者public资源仅作研究，正式包排除。

原工程MIT；根LICENSE保留 Sazzad Ali 版权声明。本项目不能宣称完全从零原创。Cursor、Magnetic、RollText、ThemeToggle与lib/gsap.ts对官方提交无差异；About逐行clip与card-step、Projects水平pin/scrub/containerAnimation及移动叠层、Skills轨道和指针响应在原组件上保留。Nav增加Community，Preloader增加跳过与有界兜底，Portfolio增加位置与焦点恢复。

GSAP使用自身标准许可证：https://gsap.com/community/standard-license/ 。字体沿用原工程next/font Geist，本地构建产物自托管，字体独立许可见 https://github.com/vercel/geist-font 。未移植作者照片、CV、项目截图或个人标识。

## Links 图像

人物和三张项目艺术封面使用内置imagegen生成，完整提示词为docs/ART_PROMPTS.json。人物是半写实原创创作者概念，不复刻真实面貌；透明PNG原图和优化WebP保留。Links标识与技术缩写SVG、另外两张封面SVG为本工程绘制。

真实产品媒体由本人确认的公开GitHub账号核验并下载：
- manga-workspace.png：https://github.com/marsyuzhe/links-manga-studio/blob/main/docs/images/workspace-dark.png
- manga-translation.png：同仓库docs/images/translation-center.png
- ledger-dashboard.png：https://github.com/marsyuzhe/RealtimeLedger/blob/main/docs/images/dashboard-landscape.png

Manga README说明截图使用原创合成演示内容；这是对应软件的真实界面，不能宣称真实用户文档。Manga源码Apache-2.0，RealtimeLedger MIT；媒体仅用于本人项目展示，不下载或再发布OCR模型。公开仓库README与树清单已保存以便追溯。AI视频项目公开仓库LAV-Links-AI-Video已核实，但不据README认定其生产服务上线；Toolbox 后续 KADO 公开工程已在本轮对应；Gateway 没有猜测公开链接。

真实软件测试记录仅按仓库自述标识，不冒充本次重新运行的软件测试。网站表单无外发，Vercel Analytics移除，技术图标改本地SVG，CSP约束本机资源。

## Content refresh · 2026-10-31

个人资料源迁移到 src/content/profile.ts；四公司经历在 experiences.ts；荣誉仅发布 recognitions.ts 中已确认项；33 条档案在 projects.ts。首页只使用其中五条 featured，七个项目有独立案例。

新的公开截图和固定提交记录在 content/media-manifest.json；KADO Desk 对应 Links Toolbox 的后续工程，保留原入口。Manga 的 Apache-2.0、其余导入项目的自有代码/素材 MIT 及混合第三方条款按各仓库 README 区分。完整许可证保存在 docs/licenses。RoomFit 继承 openPlan3D，不能宣称全部原创。旧同名 portfolio 仓库已归档，不等同本站已上传。

private/proofs 内的原件和脱敏审核副本均不公开、不打包。当前没有将任何工作证明或用户私人联系方式导入 public。公开 PDF 由共用 /resume 内容生成，不使用用户提供的含隐私原始简历。完整记录在 reports/content-refresh。


## Craft Edition · 2026-11-02

本轮没有重做首页，没有移除 MIT 与第三方许可。Craft 的真实媒体使用 media.ts 的固定提交；Typography 使用本人原始签名 PNG 的蒙版。Material/Engineering 复用原 Memory Keys 模型。GSAP Flip 依据官方 API 实现，不复制第三方演示网页： https://gsap.com/docs/v3/Plugins/Flip/ 。按需渲染参考 R3F 官方说明 https://r3f.docs.pmnd.rs/advanced/scaling-performance 。

早期“公开生成 PDF”流程已停用：正式原件现在只在 private/resume，由服务端密码保护。经本人批准的凯岸团队页裁切副本是当前唯一公开工作证明，原件仍私有；不能将早期段落的“无公开证明”理解为当前状态。旧归档保留其历史上下文。


### V1.1 Craft 关联媒体

`/assets/projects/portfolio-skills-v11.webp` 是用本地 Chrome 浏览 Links 站点、选择 Web & Interaction 后拍摄的真实页面。图像由 1440×900 实拍缩至 1200×750。Manga 继续使用原仓库截图。n8n 节点展示既有项目 `process` 字段形成的工作流，并保留原档案来源。

## V1.2 发行素材范围

本轮三套发行包排除public/assets/evidence全部企业证明副本；本机原件保留，组件默认关闭。没有新增生成式软件截图或虚构服务器素材。公开产品截图、肖像、签名和游戏素材延续原授权/来源，见原有记录。源码代码许可不能替代素材授权。
