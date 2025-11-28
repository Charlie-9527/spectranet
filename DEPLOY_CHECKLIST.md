# 部署前检查清单

## ✅ 在本地完成

- [ ] 确保所有代码已提交到 Git（如果使用）
- [ ] 测试本地环境正常运行
- [ ] 准备好云服务器账号

## ✅ 云服务器配置

- [ ] 购买云服务器（推荐配置：2核4G，Ubuntu 20.04/22.04）
- [ ] 配置安全组，开放端口：
  - [ ] 80 (HTTP)
  - [ ] 443 (HTTPS)
  - [ ] 22 (SSH)
- [ ] 获取服务器公网 IP

## ✅ 上传代码

- [ ] 方法1: Git clone（推荐）
  ```bash
  cd /var/www
  git clone https://github.com/your-username/spectranet_qoderpj.git spectranet
  ```

- [ ] 方法2: SFTP 上传
  - 使用 WinSCP/FileZilla 上传到 `/var/www/spectranet`

## ✅ 修改配置文件

### 后端配置 (backend/.env.production)

```bash
cd /var/www/spectranet/backend
cp .env.production .env
nano .env
```

修改以下内容：

```env
# 生成随机密钥: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-random-generated-secret-key

# 改为你的服务器 IP 或域名
ALLOWED_ORIGINS=http://your-ip-or-domain,http://your-ip-or-domain
```

- [ ] 已修改 SECRET_KEY
- [ ] 已修改 ALLOWED_ORIGINS

### 前端配置 (frontend/.env.production)

```bash
cd /var/www/spectranet/frontend
nano .env.production
```

修改：

```env
# 改为你的服务器 IP 或域名
VITE_API_URL=http://your-ip-or-domain/api
```

- [ ] 已修改 VITE_API_URL

### Nginx 配置 (nginx.conf)

```bash
cd /var/www/spectranet
nano nginx.conf
```

修改第 3 行：

```nginx
server_name your-ip-or-domain;  # 改为你的 IP 或域名
```

- [ ] 已修改 server_name

## ✅ 运行部署脚本

```bash
cd /var/www/spectranet
chmod +x deploy.sh
sudo bash deploy.sh
```

部署过程会：
1. 安装系统依赖
2. 配置 Python 虚拟环境
3. 安装后端依赖
4. 初始化数据库
5. 构建前端
6. 配置 Nginx
7. 设置后端自动启动

- [ ] 部署脚本执行成功

## ✅ 验证部署

### 检查服务状态

```bash
# 检查后端
systemctl status spectranet-backend

# 检查 Nginx
systemctl status nginx
```

- [ ] 后端服务运行中 (active running)
- [ ] Nginx 运行中 (active running)

### 访问网站

在浏览器打开：`http://your-server-ip`

- [ ] 能访问首页
- [ ] 能注册账号
- [ ] 能登录
- [ ] 能浏览数据集
- [ ] 能上传数据集
- [ ] 能下载数据集

## ✅ 可选：配置 HTTPS

如果有域名，建议配置 HTTPS：

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d your-domain.com

# 测试自动续期
certbot renew --dry-run
```

- [ ] 已配置 HTTPS
- [ ] 已测试 HTTPS 访问

## 🔧 常用命令备忘

```bash
# 查看后端日志
journalctl -u spectranet-backend -f

# 重启后端
systemctl restart spectranet-backend

# 重启 Nginx
systemctl restart nginx

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 更新代码（如果用 Git）
cd /var/www/spectranet && git pull
cd frontend && npm run build
systemctl restart spectranet-backend
```

## 📞 遇到问题？

参考 DEPLOY.md 文档中的"常见问题"部分。

---

完成以上所有步骤，你的 SpectraNet 就成功部署了！🎉
