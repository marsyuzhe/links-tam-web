# 内容更新

- 简介：src/content/profile.ts。中文原文与 translations.ts/语言适配必须一同检查。
- 经历：experiences.ts 添加稳定 id、公司、岗位、期间、关系、duties、sourceNote 和 related；experience-localized.ts 添加英文；keycaps.ts 登记公开入口。不要复制到 3D 模型。
- 项目：projects.ts 的 projectArchive 统一登记 slug、stage、ownership、responsibility、evidence 和 boundary；projects-en.ts 对应语言。featured 控制首页五项，caseProjects 控制独立详情。方案和 fork 不可写成自研上线成果。
- 截图：先核实公开许可，放 public/assets/projects，media.ts 记录原尺寸、sourceUrl、repo、commit；项目 media 数组使用 id。第二张真实媒体会在首页 hover/focus 时揭示。私有截图先留 private，不得直接登记公开资源。
- 个人形象：feature-flags.ts 的 ENABLE_PERSONAL_PORTRAIT 当前 false。保留资产，只有本人批准视觉后再启用。
- 游戏：worlds.ts 的 lanes/mods 维护 planned/enabled/compatibility/removed、版本、依赖和上游链接。没有已装证据不得写 enabled。
- 公告：announcements 加 world、双语内容、publishedAt、priority、state。只有 published 展示。活动使用 communityEvents，玩家截图使用 worldScreenshots 且 approved=true。
- 真实服务：api/community/status/route.ts 将实际 Adapter 传给 queryStatus；适配器必须设置 verified、checkedAt、staleAfter。仅验证在线时展示人数和允许公开的加入地址。密钥在服务端，不能使用 NEXT_PUBLIC。
- 正式简历：替换 private/resume/official.pdf 原件，使用 configure-resume-access.mjs 从 stdin 设置密码。npm run pdf:export 只校验，不创建公开副本。英文入口仍是同一中文原件。

approved 的凯岸裁切证明由 career-evidence.ts 管理，只在对应公开经历与解锁后的简历展示；Craft 不导入它。

首页背景人物由 `ENABLE_IDENTITY_ATMOSPHERE` 单独控制，现已按本人要求恢复；About 配图的 `ENABLE_PERSONAL_PORTRAIT` 仍为 false。两处不再共用开关。


## RC 公私素材维护

工作事实集中在 src/content/experiences.ts 及语言映射，不写入 3D 组件。软件截图在 media.ts 登记尺寸、固定提交和来源；艺术封面不登记为真实界面。社区模组/公告在 worlds.ts 维护，截图只有 approved 才展示。新增工作证据先保留 private 原件，再取得公开授权、检查无关人员和字段，只把批准副本登记到公开组件；public 路径本身没有口令保护。正式 PDF 通过独立私有目录提供，不使用 public 或内容媒体注册表。
