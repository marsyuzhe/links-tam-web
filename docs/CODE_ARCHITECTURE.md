# V1.2 运行架构

## 两个目标，共享事实与视觉

FULL_NODE 使用根 `next.config.ts`，`next build` / `next start`。src/content 是项目、履历与社区的原有数据源；不在静态目标复制事实。公开路由仍保留 Sazzad Hero/About/Projects/Skills、Links签名、Craft和Memory Keys。

PAGES_PUBLIC 由 `scripts/build-pages.mjs` 生成 `.targets/pages/`。只复制src/public与构建配置；替换唯一的 ProtectedResume 边界为 PublicResume，删除API、server-only鉴权、PDF查看器和私有Resume组件。使用单独output:export配置、trailingSlash、禁用图片服务优化，编译时固定目标与basePath。源仓库仍只有一套可维护UI，不把整个FULL_NODE改成export。生成目录禁止手改且已gitignore。

所有字面 `/assets/` 在生成目标中加basePath，处理CSS纹理、SVG、DOM共享转场代理与原始img；Next Link和chunks由框架处理。asset辅助函数幂等，避免重复前缀。Pages Community refresh在编译期目标分支直接返回，保留未接入语义，不调用不存在的API。

## 布局与动画所有权

视觉舞台用视口比例构图，长文本使用受控阅读宽度。v12-layout.css只补宽舞台和高缩放短视口重排；不覆盖成熟GSAP时间轴。低倍率不锁定控件物理像素；高倍率允许自然增大和滚动阅读。超短视口页头参与文档流，避免遮住操作。

Portfolio是唯一ScrollSmoother所有者。matchMedia只在足够宽且允许动态时创建，退出kill，重新进入读取readyRef而非首次闭包，避免缩放后永久暂停。About与Projects各自管理Pin并在窄视口解除。ZoomReflow只使用现有Smoother，不创建第二个实例；采集用户阅读锚点，resize/visualViewport稳定350ms后refresh，再双RAF恢复。连续缩放保留原Pin分数和项目身份；新wheel/touch/pointer/滚动键会取消待恢复任务，防止与用户操作争抢。

Preloader / useSignatureHandoff保留原生命周期、实际坐标测量、跳过、会话播放与低动态路径。签名代理在自身cleanup撤销；不改写为假的百分比加载。浏览器返回由原return-home/experience-return模块恢复焦点与位置。

KeyDevice用共享正交投影计算HTML命中框与3D布局。HTML链接始终承担语义与输入；Canvas按容器尺寸渲染、按需invalidate，离屏或失败卸载。小于500px宽/420px高、低性能或reduced-motion直接2.5D，清晰可用比保持GPU形式优先。device-layout在极窄宽度变单列，触摸一次激活。

## 私有与状态边界

Resume只在服务器校验会话；缺配置拒绝，PDF不进入public或静态target。Nginx不缓存私有响应。Community接口没有真实服务器接入时明确planned，不用前端动画造在线状态。公共证明图是独立授权问题，V1.2发行默认关闭并排除文件，原件不删除。

## 发布与测试

deploy/模板采用next start、专属systemd服务、127.0.0.1:3006、Nginx反代；Linux原生依赖必须在Linux安装。scripts/v12-*记录两目标浏览器和真实tabs.setZoom/getZoom测量，不能将viewport仿真当原生缩放。打包脚本采用文件白名单、敏感字节/哈希扫描、逐文件清单、ZIP CRC和重新解压验证。GitHub工作流仅手动触发，先完成全部网页上传批次再运行。
