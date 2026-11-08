# 双语与局部视觉精修

本轮沿用现有工程，不增加运行依赖，不部署。

- 中文首页 `/`，英文首页 `/en`；About、Resume、CV、项目、社区、四个经历详情均有对应英文页面。
- 经历事实继续在 `src/content/experiences.ts` 维护，英文叙述在 `experience-localized.ts`，键帽仅引用 ID。
- 默认键帽无公司名称、岗位、日期或常驻编号。悬停及键盘聚焦提示为“实习 1—4”；详情保留实际公司与关系。
- `ZoomReflow.tsx` 只维护原生缩放后的阅读位置，复用现有 ScrollSmoother；保留 About 编译进度和横向展览当前作品。
- `Background.tsx` 提供银灰光场、细网格与原创线框碎片；彩色视觉限定于 Skills 的轨道、节点、标题和选中状态。
- `atmosphere.css` 包含浅色主题、手机与 reduced-motion 适配；不会创建新的 Canvas。

本地运行：`npm run build`，然后 `npm run start`，地址 `http://127.0.0.1:3006`。

验收入口在 `reports/bilingual-refinement/REPORT.md`。原件与工作证明仍放在被 Git 忽略的 `private/`，不包含于源码交付包。

需要回退本轮时，按照验收报告内的文件快照与变更清单操作，不使用 `git reset --hard`。
