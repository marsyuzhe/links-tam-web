> V1.2 当前验收和部署以 ZOOM_25_TO_500_ACCEPTANCE.md、DEPLOY_CLOUD_UBUNTU_NGINX.md、GITHUB_PAGES_MANUAL_NO_GIT.md、CODE_ARCHITECTURE.md 为准。下文保留为旧版本历史，不代表本轮状态。

# V1.1 原生缩放验收

验收在独立 Chromium 配置的同一个窗口、同一个标签页执行。测试扩展调用 `chrome.tabs.setZoom()` 并用 `getZoom()` 读取浏览器倍率。每次采样记录窗口与标签页 ID、CSS 视口、DPR、`visualViewport.scale`、标题/舞台/卡片/Canvas 边界与滚动位置。使用真实滚轮进入项目区，通过截图确认画面确实进入 Pin。[Chrome Tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoom) · [Playwright 扩展测试](https://playwright.dev/docs/chrome-extensions)

七档为 25%、50%、75%、100%、125%、150%、200%。跨断点保持所选项目，返回 100% 复核项目 Pin 与 About 位置，反向滚轮必须改变滚动。Craft 的键帽在 50%、100%、150%、200% 用真实鼠标坐标点击。另验证 Craft 图像打开时缩放、历史前进后退和焦点返回，以及项目查看器在 200% 保持真实图片比例和完整控制区。最终数据与截图在验证包的 `reports/v1.1/native-zoom/`。

### 本地复现

先启动生产构建，在另一个终端执行以下命令。依赖来自锁文件。配套测试浏览器放在报告的专用目录。

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) 'reports/v1.1/browsers'
node node_modules/playwright/cli.js install chromium --no-shell
node scripts/v11-native-zoom.mjs
```

在实际使用的浏览器菜单也可复查。首页先按 Ctrl+0，滚动到横向项目区中段，使用菜单连续改变七档倍率，再回到 100%。应看到原项目和原进度。滚轮向上后画面应随之改变。在 Craft 展开截图，改变倍率，按 Esc 后用键盘继续操作。200% 的项目查看器内，关闭按钮和上一张、下一张应在首个视口内可触达。

覆盖范围为 Windows 上该 Chromium 版本的桌面原生缩放。Chrome 桌面及移动视口的截图和录屏另行采集。Safari、Firefox、真实手机的系统级缩放、线上部署后的表现仍需环境实测。

## 最终原生缩放记录

Chromium 156.0.8078.4，同一标签页与窗口共 28 次采样。

| 原生倍率 | CSS 视口 | Hero 标题占宽 | 页面横向溢出 |
| --- | --- | --- | --- |
| 25% | 5688 × 3616 | 54.3% | 0 px |
| 50% | 2844 × 1808 | 53.9% | 0 px |
| 75% | 1896 × 1205 | 53.5% | 0 px |
| 100% | 1422 × 904 | 53.1% | 0 px |
| 125% | 1138 × 723 | 52.7% | 0 px |
| 150% | 948 × 603 | 52.9% | 0 px |
| 200% | 711 × 452 | 52.7% | 0 px |

Projects 跨断点和七档往返后，100% 滚动位置为 6094 → 6094 CSS px。反向滚轮后为 5784。About 回到原倍率为 1204 → 1204 CSS px。200% 项目查看器的图片比例、按钮边界和 Esc 焦点均通过。

一次并发验收未实际滚到 Pin，断言拒绝将其算作通过。最终串行复跑先确认 Pin 可见且轨道横移，再采样。保留前次日志 `zoom-delivery.log`。
