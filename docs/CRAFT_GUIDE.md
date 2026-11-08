# Craft 制作细节

入口 `/craft` 与 `/en/craft`，主组件 `src/components/links/craft/CraftExperience.tsx`。没有开屏、后台或 Demo 卡片墙；四件作品按阅读顺序展开。

| 互动 | 组件 / 数据 | 调整位置 | 边界 |
|---|---|---|---|
| 姓名字形与签名 | TypographyStudy / useTypographyMotion | 指针半径 150px、抬起 12px、reveal 时间轴 | PNG 蒙版，不是笔迹轨迹 |
| 真实软件共享展开 | MediaTransition / media.ts 的 manga-workspace | Flip 开合时长、craft-media-surface 的 viewport 限高 | 不替换真实截图、不改变比例 |
| Memory Key 技术视图 | KeyEngineering / KeyDevice / KeycapModel | keyColors、exploded 的层高、deviceLayout | 同一套模型，无经历证明或 PDF |
| 技术与项目 | ProjectRelations / projects.ts | connections 只登记真实对应关系 | 不打分，不把方案当成产品上线 |

每件作品的“实现方式”使用 HowItWorks disclosure。新互动应提供原生按钮、焦点、触摸和无动画行为。图形连线只是 SVG，数据规模四组，无须大型图编辑器。

媒体支持 Enter 打开、ESC/关闭按钮/浏览器后退收回、前进重开。直接 ?media=manga 链接可展开。修改时必须测试连续两次打开，以及开着弹层 resize。来源截图为固定 Git 提交的演示内容，来源入口保留在实现说明中。

三维采用原有动态 Scene，不把 Three.js 放入 Craft 首页之外的公共同步导入。KeyDevice 接近视口且设备合格才加载，WebGL 失败保留 2.5D。显示结构是现有键帽与键座的分离视图，不是可编辑 CAD。

## 精修行为

品牌签名彩蛋入口位于首页 Logo 下方，显式可聚焦链接而非隐藏的连续点击手势。关系图选中 Python/Qt 会同步显示 media.ts 的真实 Manga 截图及来源；没有公开实图的项目明确使用文档，不生成虚构界面填空。

2026-11-02 导航调整：签名与 Logo 左对齐，在导航栏正常布局中占位，不再绝对定位悬挂。Craft 使用独立 CraftShell，与 Community 一样脱离项目/简历的 ReadingShell 导航；页头和页尾均可返回相应语言的个人官网。首页签名仍是 Craft 入口，三个快捷入口不变。验证资料位于 reports/craft-navigation-followup。

媒体展开/返回保留原图比例，快速开合时中止旧 Flip；键帽拆层复用已有图案、键面、键座与底座，图案层独立分离。减少动态效果时保留静态结构和操作反馈。极端缩放请遵照 ZOOM_ACCEPTANCE 当前实测资料。


## RC 精修

第一屏可主动重播签名开场（/?intro=replay，英文由 LocaleLink 加前缀），会话内普通返回不重播。媒体转场新增 resize 清理，复用真实 Manga 截图与来源；Memory Key 空格采用松开提交并防重复，结构展示继续复用同一几何/纹理/灯光，2.5D 输入不变。关系区仍以真实媒体注册表为准，没有图的项目诚实空状态。没有新增演示或虚构截图。

## V1.2 双目标与高缩放

Craft四模块共享于FULL_NODE和PAGES_PUBLIC。静态构建为真实媒体/纹理/代理URL加basePath，图片/键帽交互不依赖API。宽视口舞台改用视口比例，超短视口页头退出固定定位，避免媒体按钮被覆盖。高倍率、小视口或WebGL失败使用相同投影的HTML键帽与原有可访问导航；不模拟服务器功能。原始API原生缩放证据和菜单人工确认的区分见ZOOM_25_TO_500_ACCEPTANCE.md。
