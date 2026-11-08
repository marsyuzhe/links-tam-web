# Ubuntu 24.04 + Nginx：FULL_NODE 完整版

本教程针对 `links-tam-full-node-release-20261107.zip`。包中 `links-tam-portfolio/` 是可构建部署源码，保留动态路由；不携带 Windows node_modules、.next、私人 PDF、口令配置。唯一启动方式是 **next start**，不使用 standalone/server.js。Windows 本地构建/解压验证与 Ubuntu 实机验证分开：后者须由你执行，尚未替你登录服务器。

## 先准备

在云控制台确认 Ubuntu 24.04、CPU 架构 `uname -m` 为 x86_64、有 SSH 权限。下面 Node 模板是 x64；ARM 服务器必须替换为官方 linux-arm64 包并相应改 service 路径。2核2GB 的构建可能 OOM，不能保证成功；4GB 也受其他业务占用影响。优先在兼容 Ubuntu/Linux CI 构建，再传完整 release（含 Linux node_modules/.next），不要上传 Windows 构建依赖。构建峰值请观察 `free -h`、`top`、`journalctl -k`。不要关闭 AstrBot 或覆盖已有站点。

域名 DNS 控制台添加 A 记录：你选定的域名 → 云服务器公网 IPv4。仅当 IPv6 确实可达才添加 AAAA。云安全组放行 TCP 80、443 和你自己的 SSH 端口；不放行 3006。命令中的 `links.example.com` 必须替换成你的域名。

## 安装工具和锁定 Node

在你自己的 SSH 客户端执行（本轮未替你执行）：

```bash
sudo apt update
sudo apt install -y nginx unzip curl xz-utils ca-certificates
mkdir -p ~/links-node-download
cd ~/links-node-download
curl -fLO https://nodejs.org/dist/v24.22.2/node-v24.22.2-linux-x64.tar.xz
curl -fLO https://nodejs.org/dist/v24.22.2/SHASUMS256.txt
grep ' node-v24.22.2-linux-x64.tar.xz$' SHASUMS256.txt | sha256sum -c -
sudo tar -xJf node-v24.22.2-linux-x64.tar.xz -C /opt
export PATH=/opt/node-v24.22.2-linux-x64/bin:$PATH
node -v
npm -v
```

本地验证 Node v24.22.2/npm 11.19.1。只调整当前终端和专属 service 的 PATH，不替换系统 Node，避免影响其他服务。后续终端需再次 export PATH。

## 上传、校验、解压

使用云控制台文件上传或 WinSCP 把 ZIP 和 `SHA256SUMS.txt` 上传到 `~/links-upload/`。在这个目录运行 `sha256sum -c SHA256SUMS.txt --ignore-missing`，必须看到该包 OK。然后：

```bash
sudo mkdir -p /srv/links-tam/releases/20261107-v1.2
sudo unzip ~/links-upload/links-tam-full-node-release-20261107.zip -d /srv/links-tam/releases/20261107-v1.2
```

真实结构：`/srv/links-tam/releases/20261107-v1.2/links-tam-portfolio/{src,public,deploy,package.json,package-lock.json,...}`。本教程 release 参数包含最后一层 `links-tam-portfolio`，不能漏掉。

## 独立私有目录

```bash
sudo useradd --system --home-dir /srv/links-tam --shell /usr/sbin/nologin links-tam
sudo install -d -m 750 -o links-tam -g links-tam /srv/links-tam/shared/private/resume
sudo nano /srv/links-tam/shared/site.env
```

若用户已存在，跳过 useradd。site.env 内容（用真实 HTTPS 域名）：

```dotenv
SITE_MODE=production
SITE_URL=https://links.example.com
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_ENABLE_WORK_EVIDENCE=0
```

暂不启用 HSTS。确认 HTTPS 正常后可增加 `ENABLE_HSTS=1` 并重启。`SITE_URL` 应在构建与运行时保持相同；改域名必须重新 build。公开变量不是秘密。配置权限：

```bash
sudo chown links-tam:links-tam /srv/links-tam/shared/site.env
sudo chmod 600 /srv/links-tam/shared/site.env
```

把你自己保留的正式 PDF 通过加密传输单独放到 `/srv/links-tam/shared/private/resume/official.pdf`，不要放 public 或 GitHub。为新 release 建受控私有目录链接并生成新的口令哈希（不会打印口令）：

```bash
cd /srv/links-tam/releases/20261107-v1.2/links-tam-portfolio
sudo chown -R links-tam:links-tam .
sudo ln -s /srv/links-tam/shared/private private
read -rsp 'Resume password: ' resume_password; printf '\n'
printf '%s' "$resume_password" | sudo -u links-tam /opt/node-v24.22.2-linux-x64/bin/node scripts/configure-resume-access.mjs
unset resume_password
sudo chown links-tam:links-tam /srv/links-tam/shared/private/resume/official.pdf
sudo chmod 600 /srv/links-tam/shared/private/resume/*
```

这一步在服务器交互输入你选定的密码，发行包没有内置默认密码。脚本生成 scrypt 哈希和随机会话密钥；重置会让旧会话失效。没有配置或 PDF 时拒绝访问，不会公开降级。详见 `PRIVATE_RESUME_SECURITY.md`。

## 构建、systemd 启动

```bash
cd /srv/links-tam/releases/20261107-v1.2/links-tam-portfolio
sudo bash deploy/install.sh "$PWD"
sudo systemctl status links-tam --no-pager
curl -I http://127.0.0.1:3006/
curl -I http://127.0.0.1:3006/api/resume/file
```

install.sh 仅操作 `/srv/links-tam`、专属 service；使用锁文件执行 `npm ci --ignore-scripts` 和 `npm run build`，成功后切换 current。PDF 未认证应 401。首次若构建失败，旧目录仍保留；查看错误后在相同新 release 重试。已 current 的目录禁止原地更新，请使用新版本目录。

systemd 模板全文见同包 `deploy/links-tam.service`，WorkingDirectory 为 `/srv/links-tam/current`，启动命令固定为：

```text
/opt/node-v24.22.2-linux-x64/bin/node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3006
```

## Nginx 与 HTTPS

```bash
sudo cp deploy/nginx.links-tam.conf /etc/nginx/sites-available/links-tam
sudo nano /etc/nginx/sites-available/links-tam
```

将模板中的 `server_name links.example.com` 改成你的域名。完整模板位于 `deploy/nginx.links-tam.conf`；它只代理专属 localhost:3006，不静态暴露项目目录、private 或其他应用。Host 保留给同源鉴权。不要添加 proxy_cache，不要对全站重写 Cache-Control。

```bash
sudo ln -s /etc/nginx/sites-available/links-tam /etc/nginx/sites-enabled/links-tam
sudo nginx -t
sudo systemctl reload nginx
curl -I http://links.example.com
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo /snap/bin/certbot --nginx -d links.example.com
sudo /snap/bin/certbot renew --dry-run
systemctl list-timers | grep certbot
```

如果专属配置/符号链接已存在，先阅读比对，不重复 cp 或覆盖。保留其他 sites-enabled 文件。Certbot 会请求 HTTPS 并可选择 HTTP 跳转；确认域名解析、80/443 可达。证书续期和定时器须实机核验。

## 日常操作与排错

```bash
sudo systemctl restart links-tam
sudo systemctl stop links-tam
sudo systemctl start links-tam
sudo journalctl -u links-tam -n 100 --no-pager
sudo tail -n 100 /var/log/nginx/error.log
sudo ss -ltnp | grep 3006
```

|现象|检查与处理|
|---|---|
|502|service 是否 running；localhost:3006 是否返回；Node 路径与构建是否存在。不要把 3006 开放公网“修复”。|
|401|未登录、会话过期或私有配置缺失；检查文件权限，重新登录。|
|403|Origin/Host 不同；检查 proxy_set_header Host，必须从正式域名打开，不关闭同源检查。|
|429|单进程一分钟最多 12 次鉴权尝试；等待窗口恢复，不循环暴力测试。|
|PDF 404/503|检查 shared/private/resume/official.pdf、链接、属主和日志；绝不移到 public。|
|Cookie 不保存|生产 Secure Cookie 需要 HTTPS；检查 SITE_MODE/SITE_URL，清旧 Cookie 后再试。|
|OOM / killed|查看 free -h 和内核日志；在兼容 Linux 构建机 build 或提升内存，不宣称 2GB 一定够。|
|域名/资源错|SITE_URL 在构建与运行一致；重新构建，浏览器清缓存。|

生产验收：HTTPS、首页→签名 Craft、项目媒体与返回、四键、两种语言、三服状态、登录前 PDF 401、登录后 PDF 下载/打印、登出后 401、Cookie HttpOnly/Secure/SameSite=Strict、no-store/noindex、500% 导航。开启 HSTS 后再次检查响应头。

## 更新、备份、回滚

新版本解压到全新 release 目录，执行 `sudo bash 新目录/deploy/update.sh 新目录`。它构建成功再切 current，健康检查失败恢复 previous 链接。首次记录 previous 路径；不得在 current 中 npm ci。

私有备份：`sudo tar -czf ~/links-private-backup.tar.gz -C /srv/links-tam/shared private site.env`，然后 `sudo chmod 600 ~/links-private-backup.tar.gz`；将其加密、离线保存，不能上传 GitHub。保留旧 release，运行 `sudo bash 当前目录/deploy/rollback.sh /srv/links-tam/releases/旧版本/links-tam-portfolio`。完整步骤见 `UPGRADE_AND_ROLLBACK.md`。

官方依据：[Next self-hosting](https://nextjs.org/docs/15/app/guides/self-hosting)、[Node 官方下载与校验](https://nodejs.org/en/download)、[Nginx proxy](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)、[Certbot Nginx](https://certbot.eff.org/instructions?ws=nginx&os=snap)。Linux/systemd/Nginx/证书未在本机执行，必须保留人工确认。

## systemd 模板全文

```ini
[Unit]
Description=Links Tam FULL_NODE
After=network.target

[Service]
Type=simple
User=links-tam
Group=links-tam
WorkingDirectory=/srv/links-tam/current
EnvironmentFile=/srv/links-tam/shared/site.env
Environment=NODE_ENV=production
Environment=PATH=/opt/node-v24.22.2-linux-x64/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=/opt/node-v24.22.2-linux-x64/bin/node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3006
Restart=on-failure
RestartSec=5
UMask=0077
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/srv/links-tam/current/.next/cache

[Install]
WantedBy=multi-user.target
```

## Nginx 初始 HTTP 模板全文

```nginx
# Replace links.example.com. Do not replace the server's other sites/default configuration.
server {
    listen 80;
    listen [::]:80;
    server_name links.example.com;
    client_max_body_size 1m;
    location ^~ /private/ { return 404; }
    location ~ /\.(?!well-known(?:/|$)) { deny all; }
    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_read_timeout 60s;
        # Never cache authenticated PDF / resume responses at this reverse proxy.
        proxy_cache off;
    }
}
```
