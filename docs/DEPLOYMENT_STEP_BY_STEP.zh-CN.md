> V1.2 当前验收和部署以 ZOOM_25_TO_500_ACCEPTANCE.md、DEPLOY_CLOUD_UBUNTU_NGINX.md、GITHUB_PAGES_MANUAL_NO_GIT.md、CODE_ARCHITECTURE.md 为准。下文保留为旧版本历史，不代表本轮状态。

# Links Tam 最新源码与部署教程

更新于 2026-11-07，适用于 Links Tam Portfolio V1.1。本机使用生产构建验收。

推荐 Ubuntu 24.04 云服务器 + Node.js 24 + Nginx + HTTPS，运行一个 Node 进程。网站有服务端简历密码验证、私有 PDF 和社区状态 API，不能直接上传到 GitHub Pages 或只支持静态 HTML 的空间。

## 1. 文件和本地预览

`links-tam-portfolio-v1.1-source.zip` 内顶层文件夹为 `links-tam-portfolio`，包含可构建源码、公开素材、许可证、文档、维护脚本及本次导航验证摘要。

私有简历 PDF、密码配置、证明原件、node_modules、.next、Git 历史和历史录像不在包中。不要把整个项目目录配置为 Nginx 静态目录。

安装 [Node.js 官方下载页](https://nodejs.org/en/download) 的 Node 24 LTS，本项目实际验证版本为 24.22.2。Windows 解压后，在含 package.json 的文件夹打开 PowerShell：

```powershell
npm ci --ignore-scripts
npm run dev
```

打开 `http://127.0.0.1:3006`。停止服务按 Ctrl+C。已有服务占用端口时，不要重复启动。

生产预览用 `npm run build`，成功后 `npm start`。新解压目录不含私有配置，简历默认保持锁定；原开发目录的私有文件没有被删除。作者本机 D:\LinksTools 不是服务器依赖。

## 2. 准备服务器与域名

以下按新 Ubuntu 24.04 服务器编写，需要 SSH 和 sudo。建议从 2 核、4GB 内存开始构建，这不是实测容量承诺。

把 `portfolio.example.com` 替换为自己的域名，`SSH_USER` 和 `SERVER_IP` 替换为登录账号和公网 IP。域名 A 记录指向服务器；无可用 IPv6 时不要加 AAAA。安全组开放 SSH、TCP 80/443，不公开 3006。

服务器执行：

```bash
sudo apt update
sudo apt install -y nginx unzip certbot python3-certbot-nginx
```

通过 Node 官方下载页安装对应 Linux 架构的 Node 24，再执行：

```bash
node --version
npm --version
command -v node
```

确认 24.x。下面的服务配置要求 node 可在 `/usr/local/bin` 或 `/usr/bin` 找到；如用 nvm，需改用 Node 的绝对路径，不能依赖交互式 shell 初始化。

## 3. 上传、安装与构建

先在 Windows PowerShell 上传公开源码包：

```powershell
scp "D:\Documents\ChatGPT\web\links-tam-portfolio-v1.1-source.zip" SSH_USER@SERVER_IP:/tmp/
```

以下在服务器执行。若 `links` 账号已存在则跳过 useradd，不覆盖已有站点：

```bash
sudo useradd --system --user-group --create-home --home-dir /srv/links-tam --shell /usr/sbin/nologin links
sudo install -d -o links -g links /srv/links-tam/releases/20261107 /srv/links-tam/shared/private/resume
sudo unzip /tmp/links-tam-portfolio-v1.1-source.zip -d /srv/links-tam/releases/20261107
sudo chown -R links:links /srv/links-tam/releases/20261107
sudo -u links ln -s /srv/links-tam/shared/private /srv/links-tam/releases/20261107/links-tam-portfolio/private
cd /srv/links-tam/releases/20261107/links-tam-portfolio
```

不再手改 layout.tsx。构建前在工程根目录创建 `.env.production.local`，填写（换成真实域名）：

```dotenv
SITE_MODE=production
SITE_URL=https://portfolio.example.com
NEXT_TELEMETRY_DISABLED=1
# 确认 HTTPS 正常后再设为 1 并重新构建/重启
ENABLE_HSTS=0
```

Next.js 在 build 和 start 加载该文件；当前服务工作目录即工程根。缺失/错误正式域名会明确失败。SITE_URL 作为静态元数据的构建参数，切换域名必须重新 build；仅改运行时环境不会更新预渲染分享链接。默认 local 仅用于审核预览。

审核期间保留根 metadata 的 `robots: { index: false, follow: false }`。确认允许收录后再调整公开页面并重建；简历页面和 PDF API 的 noindex/no-store 保留。不要修改 next.config.ts 中私有目录的 tracing 排除规则，不需为生产添加 WebSocket 服务。

```bash
sudo -u links env NEXT_TELEMETRY_DISABLED=1 npm ci --ignore-scripts
sudo -u links npm run build
```

必须构建成功再继续。next/font/google 在构建时需要访问 Google Fonts；运行时使用构建出的本地字体。不要上传 Windows node_modules/.next 到 Linux，不要删除锁文件或运行 npm audit fix --force 绕过错误。

## 4. 单独配置正式简历

PDF 和密码文件不能进 public、GitHub 或公开源码包。网站口令保护访问，不是给下载后的 PDF 文件本身加密。

Windows PowerShell 中单独上传开发目录内的正式私有副本：

```powershell
scp "D:\Documents\ChatGPT\web\links-tam-portfolio\private\resume\official.pdf" SSH_USER@SERVER_IP:/tmp/links-official-resume.pdf
```

服务器执行：

```bash
sudo mv /tmp/links-official-resume.pdf /srv/links-tam/shared/private/resume/official.pdf
sudo chown links:links /srv/links-tam/shared/private/resume/official.pdf
sudo chmod 700 /srv/links-tam/shared/private /srv/links-tam/shared/private/resume
sudo chmod 600 /srv/links-tam/shared/private/resume/official.pdf
cd /srv/links-tam/releases/20261107/links-tam-portfolio
sudo -v
read -r -s -p '请输入简历查看密码: ' LINKS_PASSWORD
printf '\n'
printf '%s' "$LINKS_PASSWORD" | sudo -u links node scripts/configure-resume-access.mjs
unset LINKS_PASSWORD
sudo chmod 600 /srv/links-tam/shared/private/resume/access.private.json
sudo -u links npm run pdf:export
```

隐藏输入时填写之前确认的查看口令。不要把明文写入命令、文档、NEXT_PUBLIC 变量或前端源码。脚本生成随机盐、哈希及会话密钥，重复运行会使旧会话失效；缺少配置时接口拒绝访问。

shared/private 的符号链接保证以后换源码版本仍使用原 PDF 和配置。

## 5. 设置开机运行

```bash
sudo ln -s /srv/links-tam/releases/20261107/links-tam-portfolio /srv/links-tam/current
sudo nano /etc/systemd/system/links-tam.service
```

填写：

```ini
[Unit]
Description=Links Tam Portfolio
After=network.target

[Service]
Type=simple
User=links
Group=links
WorkingDirectory=/srv/links-tam/current
Environment=NODE_ENV=production
Environment=NEXT_TELEMETRY_DISABLED=1
Environment=PATH=/usr/local/bin:/usr/bin:/bin
ExecStart=/usr/bin/env node /srv/links-tam/current/node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3006
Restart=on-failure
RestartSec=5
UMask=0077
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

启动并检查：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now links-tam
sudo systemctl status links-tam --no-pager
curl -I http://127.0.0.1:3006/
```

故障日志：`sudo journalctl -u links-tam -n 100 --no-pager`。简历验证当前限制为单进程每分钟 12 次；本教程仅启一个实例，多实例需要另行适配共享限流。

## 6. Nginx 与 HTTPS

创建 `/etc/nginx/sites-available/links-tam`，将域名换成自己的：

```nginx
server {
    listen 80;
    server_name portfolio.example.com;
    client_max_body_size 1m;

    location ^~ /private/ { return 404; }
    location ^~ /.git/ { return 404; }
    location ~ /\.env { return 404; }

    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 60s;
        proxy_cookie_flags links_resume_access secure httponly samesite=strict;
    }
}
```

保留真实 Host，防止登录同源校验失败。代理显式补充 Secure Cookie，避免 TLS 在 Nginx 终止后应用内部协议识别差异。不要对简历页面或 `/api/resume/*` 开启 CDN/代理整页缓存。本例无聊天或 WebSocket 业务。

```bash
sudo ln -s /etc/nginx/sites-available/links-tam /etc/nginx/sites-enabled/links-tam
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d portfolio.example.com --redirect
sudo certbot renew --dry-run
```

证书申请前 DNS 和 80 端口必须可用。成功后只通过 HTTPS 输入简历口令。已有其他网站时不要删除它们的站点配置或证书。

## 7. 发布后的实际验收

无痕打开正式 HTTPS 域名，逐项确认：

1. 开场可跳过、签名对齐；签名进入 Craft，Resume/GitHub/Servers 仍可点击。
2. `/craft` 和 `/en/craft` 可直接访问、可返回各自语言官网；项目和简历导航无 Craft。
3. About、Projects、Skills、Memory Keys、后退恢复、手机操作正常。
4. 未登录 `/api/resume/file` 返回 401；私有目录不可直接打开；正确口令可读/下载 PDF，错误口令拒绝，退出后再次锁定。
5. 开发者工具中的 `links_resume_access` 含 Secure、HttpOnly、SameSite=Strict；PDF 响应含 private/no-store。不要公开实际 Cookie、口令和受保护简历截图。
6. 在同一浏览器标签页用原生缩放 25%、50%、75%、100%、125%、150%、200%。从 Projects 中间连续缩放并回到 100%，验证滚动与返回焦点。在 Craft 打开图片时改变缩放，再用 Esc 关闭。用手机检查触屏叠放、键帽点击和游戏详情。
7. 社区规划状态为真实内容，不会因部署自动出现在线人数。

## 8. 更新和回滚

以后每次解压到新的 `/srv/links-tam/releases/版本号/links-tam-portfolio`，链接同一 shared/private，配置新版本 .env.production.local 并构建。先用 `readlink -f /srv/links-tam/current` 记录旧版本路径，再切换：

```bash
sudo ln -sfn /srv/links-tam/releases/新版本号/links-tam-portfolio /srv/links-tam/current
sudo systemctl restart links-tam
```

有问题就把 current 切回记录的旧完整路径并重启。保留旧版本的 node_modules/.next，不删除 shared/private。此方案为版本目录回切，有短暂重启时间。

## 9. 常见问题

| 问题 | 检查 |
| --- | --- |
| 502 | 服务状态、journalctl、Node 路径、3006 本地 curl |
| 简历 503 | shared/private 链接、文件名、links 读权限、配置生成结果 |
| 简历 403 | 浏览器 Origin 与代理 Host 是否同域名、同端口 |
| 简历 429 | 一分钟验证次数超限，稍后重试 |
| npm ci 失败 | Node 24、锁文件、下载网络；不删除锁文件 |
| build 字体失败 | 构建机访问 Google Fonts 的网络 |
| 分享链接是 localhost | 修改 SITE_URL 后重新构建并重启 |

Vercel/其他 Serverless 平台不能按原样直接导入就完整运行：当前私有文件被 outputFileTracingExcludes 排除，且限流在进程内。需要先单独适配私有存储、密钥与共享限流。纯静态托管无法保留现有服务端密码能力。

## 官方依据与验证范围

- [Next.js 15 自托管](https://nextjs.org/docs/15/app/guides/self-hosting)
- [Node.js 下载](https://nodejs.org/en/download) 与 [版本周期](https://nodejs.org/en/about/previous-releases)
- [Nginx 代理模块](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Certbot Nginx 指南](https://eff-certbot.readthedocs.io/en/stable/using.html#nginx)

教程按当前源码和官方文档整理。本地生产构建和浏览器验证已经完成；Linux 服务配置为部署模板，尚未在你的服务器运行。


RC 安全补充：应用生产 CSP 已去除 unsafe-eval/本机 ws，保留有记录的内联脚本/样式。SITE_MODE=production 会强制 Secure Cookie；本教程代理仍保留 cookie 标记作为防御。根 noindex 继续保留。此为 Ubuntu/Nginx 模板，未连接服务器、未申请证书或部署。详见 SECURITY.md。
