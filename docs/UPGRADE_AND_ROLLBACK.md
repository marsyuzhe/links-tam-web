# 更新与独立回滚

V1.2 不覆盖或删除 V1.1 源码。交付目录提供 `rollback-v1.1.zip`，SHA-256 在总清单中；本机原件也保留。每套最终包有独立文件清单和 ZIP CRC/内容哈希验证。恢复私有资料必须使用你自己的离线备份，公开发行包不承担秘密备份职责。

## 本机

停止当前预览；将旧源码 ZIP 解压到**新目录**，不要覆盖当前文件。使用 Node24.22.2、`npm ci --ignore-scripts`、`npm run build`、`npm start`。旧私有 PDF/配置可由本人从受控目录另行提供。`.env.example` 是示例，不能当作已配置的生产环境。保留新旧目录便于比较。

## 云端 FULL_NODE

每次升级新建 `/srv/links-tam/releases/版本/links-tam-portfolio`。shared/site.env 和 shared/private 不在 release 内复制。按云端教程解压、校验、运行新目录 `deploy/update.sh`。脚本只切换自己专属 current 链接，构建先于切换，构建失败不影响旧进程；启动健康检查失败时尽可能恢复旧链接。成功后记录 previous 路径。

回滚：`sudo bash 新目录/deploy/rollback.sh /srv/links-tam/releases/旧版本/links-tam-portfolio`。要求旧版本已有 .next/BUILD_ID 和 Linux node_modules。随后检查 systemctl、localhost HTTP、HTTPS、PDF鉴权和三服路由。shared密钥不随回滚改变；若鉴权格式变更，需要先比较配置再决定恢复离线备份。不要删除旧 release；本轮脚本没有清理历史的操作。

## Pages

Actions工作流只在你手动运行后发布。将源码恢复到旧Release完整版本，在网页创建该版本分支/标签，Run workflow选它重新构建。静态包的root/subpath必须与实际地址一致，不能混用。需要撤销站点时到Settings→Pages→Unpublish site，并禁用工作流。源码仓库与云服务是独立目标，回滚一个不会自动回滚另一个。

部署脚本在本地进行语法/边界审阅；Ubuntu与systemd运行、证书/DNS和GitHub发布属于待本人执行的生产验收，不能据此宣称云端回滚已实测。
