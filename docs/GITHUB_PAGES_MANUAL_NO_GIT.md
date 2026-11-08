# GitHub Pages 发布公开静态版

Pages 版保留公开视觉与作品、Craft、游戏资料和公开履历概览；不包含 Node API、私有 PDF、口令配置、Cookie 登录或实时服务器查询。三服继续显示未接入/规划状态，不伪造在线人数。

## 推荐：源码网页上传 + 官方 Actions

1. 先完成 `GITHUB_OPEN_SOURCE_MANUAL_NO_GIT.md` 的全部源码批次，确认 scripts/build-pages.mjs 与锁文件齐全。GitHub仓库 `Settings → Pages → Build and deployment → Source` 选择 `GitHub Actions`。
2. 点 `Actions → Deploy to GitHub Pages → Run workflow`，Branch选main，点击绿色Run。仅这一步会开始由你授权的公网发布。若首次提示启用工作流，先阅读后启用。
3. 打开这次运行，查看 build：Checkout、Setup Node、Install dependencies、Lint、Configure Pages、Build static export、Upload artifact。成功后 deploy 显示地址。环境 `github-pages` 可能要求你批准，按仓库保护规则处理。
4. 普通仓库地址 `https://marsyuzhe.github.io/links-tam-portfolio/`；工作流自动从仓库名推导 `/仓库名` basePath，不要求仓库必须同名。用户名根站仓库 `marsyuzhe.github.io` 自动用空 basePath，地址为 `https://marsyuzhe.github.io/`。
5. 实测首页→签名Craft→图片放大关闭→项目详情返回、简中/英文、Community三个游戏详情、公开Resume。刷新详情路由也必须可用。私有PDF/API应该不存在，没有登录框。

工作流锁 Node24.22.2，从同一套src/public数据生成 `.targets/pages`，明确删除请求时服务模块，然后 Next output:export 产出 `.targets/pages/out`。不修改 FULL_NODE 的 next.config。使用官方 checkout/setup-node/configure-pages/upload-pages-artifact/deploy-pages，最小 contents:read/pages:write/id-token:write 权限，无任何私人 Secrets。完整工作流在 `.github/workflows/deploy-pages.yml`。

## 现成静态包与本地检查

`links-tam-github-pages-public-20261107.zip` 包含：

- `project-site/`：实际构建的 `/links-tam-portfolio` 子路径版本，适用于这个精确仓库名。
- `root-site/`：实际构建的空 basePath 根站版本，适用于用户名根站或独立域名根目录。
- `README.txt` 和静态文件校验清单。

如果仓库名不同，必须用源码工作流重新构建；不能只改HTML或重命名文件夹。打包文件可用于静态主机保存，但不会自动上传到Pages。推荐上传源码后由Actions构建，避免手动上传大量编译chunk。

开发者本机：`npm ci --ignore-scripts` 后，PowerShell `$env:PAGES_BASE_PATH='/links-tam-portfolio'; npm run build:pages; node scripts/serve-pages.mjs`，打开 `http://127.0.0.1:3010/links-tam-portfolio/`。根站先 `$env:PAGES_BASE_PATH=''; npm run build:pages`，预览端口与环境一致。环境变量仅对当前终端有效。

## 自定义域名（可选）

先使默认Pages地址正常，再到 Settings→Pages→Custom domain 设置域名，按GitHub显示的DNS要求验证，启用 Enforce HTTPS。独立域名根目录需要空basePath：Settings→Secrets and variables→Actions→Variables→New repository variable，Name `PAGES_ROOT`、Value `true`，同时增加变量 `PAGES_SITE_ORIGIN`，值为你的完整HTTPS源站（例如 `https://links.example.com`，不含路径），再Run workflow。只有确实服务根站才设置，否则普通子路径资源会404。DNS具体值按GitHub官方页面显示，不复制别人的IP。

## 失败与回滚

|现象|处理|
|---|---|
|Actions找不到package.json|你可能上传了包装层；Code根目录应直接存在package.json。|
|依赖或构建失败|打开失败步骤展开完整日志；核对lock和全部批次，不能移除检查伪造成功。|
|CSS/图片404|仓库basePath不匹配；查看Network路径，不把所有URL强行改成根目录。|
|直接打开详情404|确认trailingSlash和已生成目录，使用 `/projects/manga-studio/`；刷新回归。|
|公开履历没有密码|这是正确行为：Pages没有私有登录功能。完整版域名未提供时说明在完整版访问。|
|没有刷新在线人数|Pages主动不请求私有社区API，保持真实未接入语义。|
|deploy权限失败|Pages Source是否Actions；environment保护是否待批准；保留官方最小权限。|

更新：上传完整变更批次，审阅diff，Run workflow。回滚：Actions→Run workflow选择以前完整版本的分支/标签（可在网页从旧commit建立分支），或恢复旧Release源码后重新运行；仅Re-run过去失败的上传任务不一定保留artifact。撤销发布：Settings→Pages中 Unpublish site，并禁用部署工作流。以上均由你本人执行。

正式云域名确认后，可维护PublicResume文案/链接指向自己的HTTPS完整版；不要复制PDF或认证代码到Pages。

官方依据：[自定义Pages工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[Next静态导出](https://nextjs.org/docs/15/app/guides/static-exports)。本轮只验证本地等价路径；真实GitHub权限、DNS、TLS及发布仍待你操作。
