# GitHub 网页手动开源上传（无需 Git 命令）

使用 `links-tam-github-source-web-upload-20261107.zip`。先解压到本机，里面的 `links-tam-portfolio/` 是完整源码；同目录交付的 `links-tam-web-upload-batches/` 是它的分批上传副本。不是上传 ZIP 当源码：GitHub 网页不会替你解压。

1. 登录你自己的 github.com，右上角 `+ → New repository`。Owner 选自己的账号，Repository name 建议 `links-tam-portfolio`，选择 Public。勾选添加 README 以方便后续网页操作；不选新的 License 或 .gitignore，发行源码已经有。点击 `Create repository`。本轮没有代你执行。
2. 本机先审阅 LICENSE、THIRD_PARTY_NOTICES、素材范围与敏感扫描报告。私有 PDF/口令/证明原图不得上传。若下载包被修改，需要重新扫描。
3. 打开 `links-tam-web-upload-batches/upload-manifest.csv`，按批号从小到大上传。每批目录有说明和 `repository/`，每批不超过100个实际文件。不要把 `batch-001`、`repository` 这些包装层上传到仓库；上传的是 repository **里面的内容**。
4. 仓库 `Code → Add file → Upload files`。把该批 repository 内的文件及目录拖到网页区域。GitHub会保留拖入的目录结构；查看上传路径应为 `src/...`、`public/...`，不能是 `repository/src/...`。等待每个文件上传成功，在下方填 `Import V1.2 batch N`，点击 `Commit changes`。回 Code 核对后再进行下一批。每次只拖一批，限制是100文件，不是100个顶层文件夹。
5. Windows资源管理器选择 `查看 → 显示 → 隐藏的项目`；确认 `.gitignore`、`.env.example` 和最后一批 `.github/workflows/deploy-pages.yml` 存在。若拖拽隐藏目录失败，在 GitHub `Add file → Create new file` 输入完整路径 `.github/workflows/deploy-pages.yml`，粘贴发行文件全文后 Commit；其余隐藏文本同样创建。不要创建空工作流或更改目录名。所有普通批次完成后再上传工作流，避免不完整构建。
6. README 与初始README冲突时，以发行README为准，在网页编辑器粘贴替换；不要生成第二份许可证。最后 Code 根目录必须直接看到 package.json、package-lock.json、src、public、scripts、docs、deploy、.github。
7. 工作流仅 `workflow_dispatch`，上传期间不会自动发布。确认源码完整后再按 Pages 教程主动运行。不能在公开仓库设置本地口令、PDF或私钥。

单文件必须不超过25 MiB；分批清单记录实际大小、SHA-256。上传失败时按清单核对该批，必要时只重传缺失文件；网页不会自动校验本机 SHA，可下载后用 `Get-FileHash 文件 -Algorithm SHA256` 比较。批次副本重复出现的父目录是正常合并，不要删除上一批目录。

## Releases 放发行包

源码全部上传后，仓库右侧 `Releases → Draft a new release → Choose a tag → Create new tag`，例如 `v1.2.0`，Target 选完整源码对应的 main。Title 填版本，说明中写明 FULL_NODE/PAGES_PUBLIC 功能差异、测试边界和回滚。`Attach binaries` 添加三套正式ZIP和 SHA256SUMS.txt；不要添加私人备份或认证 trace。审核后点击 Publish release。发行附件不能替代 Code 源码树。

更新时按新清单替换文件；需要删除过期文件时逐个审查仓库差异，不能只覆盖新增文件就认为完成升级。网页 `History` 可查看每批提交；回滚时恢复旧 Release 的源码/批次并重新运行工作流，或在 Actions 选择旧完整提交构建。不要伪造作者或删除 Sazzad MIT 归属。

官方限制：[GitHub 上传文件](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)。
