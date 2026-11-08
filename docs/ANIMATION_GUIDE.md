# 动画维护

入口 `src/lib/gsap.ts` 集中注册现有 GSAP 插件。Craft 的 Flip 在 MediaTransition.tsx 局部注册，不加入主页公共插件入口。时间语义在 `src/lib/motion.ts`，CSS 时长在 styles/tokens.css。

Portfolio.tsx 的 SmoothScroller 必须先于子动画初始化，让 About/Projects 的 Pin 看到相同滚动坐标。onReveal 仅解除暂停，位置恢复后刷新 ScrollTrigger；不要在每次组件状态变化时创建另一个实例。

新增滚动动画使用 useGSAP({scope:ref})，通过 gsap.matchMedia(MOTION_OK) 注册，返回 mm.revert。普通 reading 页面使用原生滚动。节点缩放/平移只能由一个系统拥有：Projects 父轨道由 GSAP 控制，新增第二截图只用子层 opacity 过渡。

About.tsx 的 scene 按每行字符数决定时长，并按 card-step 索引同步资料；Projects.tsx distance 使用 layout offset 而非旋转后的 bounds，避免宽屏末卡偏移。修改 Pin 后测试快滚、反向、窗口 resize 和 25–200% 原生缩放。

MediaTransition 用 Flip.getState、fit、to 在原比例媒体与 native dialog 间移动。dialog 提供焦点约束，ESC 先退历史状态再收回；finish 恢复来源焦点。不要给这个媒体层再增加 CSS transform 动画。

useTypographyMotion 清理 SplitText、指针 requestAnimationFrame 和手动时间轴。没有笔迹路径，签名只是原 PNG 的 clipPath 揭示。useResumeMotion 独立拥有简历 ScrollTrigger。

KeycapModel 的动画只在可见时请求 invalidate，frameloop=demand 使静止画面不持续绘制。reduced-motion 不运行 WebGL，保留 HTML 控件。调试时观察 data-renderer、data-pressed 和 Canvas 的 data-frames，不能用这些本地采样宣称稳定帧率。

缩放异常先检查 ZoomReflow.tsx 与现有 Pin 尺寸函数，不要通过禁用浏览器缩放、CSS zoom 或追加另一个平滑滚动器绕过。

## 品牌签名衔接

Preloader 的 reveal 提前与 Hero 重叠：签名 PNG 蒙版保持原形，useSignatureHandoff 只创建一个 aria-hidden 的 fixed 代理，在幕布上方移动到 Logo 的 data-brand-signature 边界。真实导航不参与位移动画，避免与 Nav 的显示/隐藏 transform 竞争。代理完成、跳过或卸载时移除并恢复目标不透明度；低动态模式不创建代理。加载计数是短揭示节奏，不冒充精确网络进度。

MediaTransition 持有显式 GSAP transition 引用；快速 ESC/Back 先 kill 进入动画，Forward 可取消收回并重新展开。关闭清除 surface transform，focus 返回真实触发按钮，卸载恢复进入时的 body overflow。不要在同一 surface 增加 CSS transform。

KeycapModel 的图案 mesh 在结构状态中独立抬起；与键面分别由同一 effect 拥有并清理 tween，onUpdate 请求 invalidate。默认状态不改几何、材质与灯光。


## RC 生命周期修正

签名保持原 PNG、短揭示与视觉代理。useSignatureHandoff 遇 resize 或标签隐藏取消旧坐标，真实链接不移动。Preloader 清理双 RAF 与 load fallback；结束释放 inert，原焦点属于开场时尝试返回品牌。数字只是装饰，非资源加载进度，保持 aria-hidden 的装饰区域。Hero ScrambleText aria-hidden，读屏获得稳定定位。

Craft FLIP 在原生缩放/resize 时停止过期的矩形转场并清除 transform，关闭中则完成收回；返回焦点仍是原触发器。键帽空格松开提交一次，长按不重复。ZoomReflow 未重写：保留既有 Smoother、Pin 相对进度、用户输入取消；同窗连续原生缩放仍需人工验收，不将静态七档数据冒充动态恢复证明。


### V1.1 交接与缩放

开屏在 hydration 后两个绘制帧启动。已加载的签名以同一裁切克隆，交接同帧关闭源签名及目的签名，由代理等比飞行。中止会释放代理，重播 query 只消费一次。Projects 与案例仅在相同图片之间执行跨页交接。窄视口的细指针使用自然文档流，真实触屏保留 GSAP 叠放。ZoomReflow 将桌面 Pin 进度和当前卡片保持至同一轮缩放结束，滚轮、触摸、指针和方向键开始新的阅读位置。

## V1.2 视口与生命周期补充

Portfolio 的单一 Smoother 现在仅在宽度>=600px且允许动态时存在；readyRef避免缩放重入暂停。ZoomReflow 同时监听布局视口与visualViewport尺寸，350ms稳定后刷新、双RAF恢复，用户输入取消待恢复任务。高倍率关闭窄视口Pin/3D，正文自然缩放，禁止反向整页scale。开屏本身未重新编排，连续签名仍用真实坐标和独立代理，最新原始视频与测量在V1.2证据包。
