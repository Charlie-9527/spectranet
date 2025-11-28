# SpectraNet 云服务器部署指南

## 📋 准备工作

### 1. 购买云服务器
- **阿里云**: https://www.aliyun.com/product/ecs
- **腾讯云**: https://cloud.tencent.com/product/cvm

**推荐配置**:
- CPU: 2核
- 内存: 4GB
- 硬盘: 40GB
- 带宽: 1-3Mbps
- 操作系统: **Ubuntu 20.04 LTS** 或 **Ubuntu 22.04 LTS**

💡 **学生优惠**: 阿里云和腾讯云都有学生机，约 10 元/月

### 2. 配置安全组
在云控制台开放以下端口：
- **80** (HTTP)
- **443** (HTTPS，如果要配置 SSL)
- **22** (SSH，用于连接服务器)

---

## 🚀 部署步骤

### 第一步：连接到服务器

使用 SSH 工具连接服务器（推荐使用 Xshell、MobaXterm 或 PuTTY）:

```bash
ssh root@your-server-ip
```

或者使用云控制台的网页终端。

---

### 第二步：上传代码

**方法 1: 使用 Git（推荐）**

如果代码已上传到 GitHub：

```bash
cd /var/www
git clone https://github.com/your-username/spectranet_qoderpj.git spectranet
```

**方法 2: 使用 SFTP/SCP 工具**

使用 WinSCP、FileZilla 或 MobaXterm 将整个项目文件夹上传到服务器的 `/var/www/spectranet` 目录。

---

### 第三步：修改配置文件

#### 1. 修改后端配置

```bash
cd /var/www/spectranet/backend
nano .env.production
```

修改以下内容：

```env
# 生成随机密钥：python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-random-secret-key-here

# 改为你的域名或服务器 IP
ALLOWED_ORIGINS=http://your-domain.com,http://your-ip
```

保存：按 `Ctrl+O`，回车，然后 `Ctrl+X` 退出

#### 2. 修改前端配置

```bash
cd /var/www/spectranet/frontend
nano .env.production
```

修改：

```env
# 改为你的域名或 IP
VITE_API_URL=http://your-domain.com/api
```

#### 3. 修改 Nginx 配置

```bash
cd /var/www/spectranet
nano nginx.conf
```

修改第 3 行：

```nginx
server_name your-domain.com;  # 改为你的域名或 IP
```

---

### 第四步：运行部署脚本

```bash
cd /var/www/spectranet
chmod +x deploy.sh
sudo bash deploy.sh
```

脚本会自动：
1. 安装所有依赖（Python、Node.js、Nginx）
2. 配置后端虚拟环境
3. 初始化数据库
4. 构建前端
5. 配置 Nginx 反向代理
6. 设置后端自动启动服务

整个过程大约 5-10 分钟。

---

### 第五步：验证部署

#### 1. 检查后端状态

```bash
systemctl status spectranet-backend
```

应该显示 `active (running)`

#### 2. 检查 Nginx 状态

```bash
systemctl status nginx
```

应该显示 `active (running)`

#### 3. 访问网站

在浏览器打开：`http://your-server-ip`

应该能看到 SpectraNet 首页！

---

## 🔧 常用管理命令

### 查看日志

```bash
# 查看后端日志（实时）
journalctl -u spectranet-backend -f

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 查看 Nginx 访问日志
tail -f /var/log/nginx/access.log
```

### 重启服务

```bash
# 重启后端
systemctl restart spectranet-backend

# 重启 Nginx
systemctl restart nginx
```

### 更新代码

```bash
# 如果使用 Git
cd /var/www/spectranet
git pull

# 重新构建前端
cd frontend
npm run build

# 重启后端
systemctl restart spectranet-backend
```

---

## 🔒 配置 HTTPS（可选但推荐）

使用免费的 Let's Encrypt SSL 证书：

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 申请证书（替换为你的域名）
certbot --nginx -d your-domain.com

# 自动续期测试
certbot renew --dry-run
```

Certbot 会自动修改 Nginx 配置，启用 HTTPS。

---

## 🐛 常见问题

### 1. 502 Bad Gateway

**原因**: 后端服务未启动

**解决**:
```bash
systemctl start spectranet-backend
systemctl status spectranet-backend
journalctl -u spectranet-backend -f
```

### 2. 403 Forbidden

**原因**: 文件权限问题

**解决**:
```bash
chown -R www-data:www-data /var/www/spectranet
chmod -R 755 /var/www/spectranet
```

### 3. 无法上传文件

**原因**: uploads 目录权限或 Nginx 配置

**解决**:
```bash
mkdir -p /var/www/spectranet/backend/uploads
chown -R www-data:www-data /var/www/spectranet/backend/uploads
chmod 755 /var/www/spectranet/backend/uploads
```

### 4. CORS 错误

**原因**: ALLOWED_ORIGINS 配置不正确

**解决**:
编辑 `/var/www/spectranet/backend/.env`，确保包含你的域名：
```env
ALLOWED_ORIGINS=http://your-domain.com,https://your-domain.com
```

然后重启后端：
```bash
systemctl restart spectranet-backend
```

---

## 📊 性能优化（可选）

### 1. 启用 Gzip 压缩

编辑 `/etc/nginx/nginx.conf`，在 `http` 块中添加：

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### 2. 使用 Gunicorn（推荐生产环境）

安装 Gunicorn：
```bash
cd /var/www/spectranet/backend
source venv/bin/activate
pip install gunicorn
```

修改 `/etc/systemd/system/spectranet-backend.service`:

```ini
ExecStart=/var/www/spectranet/backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

重启服务：
```bash
systemctl daemon-reload
systemctl restart spectranet-backend
```

---

## 📞 需要帮助？

如果遇到问题，请检查：
1. 后端日志: `journalctl -u spectranet-backend -f`
2. Nginx 日志: `/var/log/nginx/error.log`
3. 防火墙设置: `ufw status`（如果启用了 ufw）

---

## ✅ 部署检查清单

- [ ] 购买云服务器并配置安全组（开放 80、443、22 端口）
- [ ] 上传代码到 `/var/www/spectranet`
- [ ] 修改 `backend/.env.production`（SECRET_KEY、ALLOWED_ORIGINS）
- [ ] 修改 `frontend/.env.production`（VITE_API_URL）
- [ ] 修改 `nginx.conf`（server_name）
- [ ] 运行 `deploy.sh` 部署脚本
- [ ] 验证后端运行: `systemctl status spectranet-backend`
- [ ] 验证 Nginx 运行: `systemctl status nginx`
- [ ] 浏览器访问服务器 IP，确认网站正常
- [ ] （可选）配置域名和 HTTPS 证书

---

完成以上步骤后，你的 SpectraNet 就成功部署到云服务器了！🎉
