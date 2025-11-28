#!/bin/bash

# SpectraNet 部署脚本 - 阿里云/腾讯云
# 使用方法: sudo bash deploy.sh

echo "================================"
echo "SpectraNet 部署开始"
echo "================================"

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 sudo 运行此脚本${NC}"
    exit 1
fi

# 1. 更新系统
echo -e "${GREEN}[1/10] 更新系统...${NC}"
apt update && apt upgrade -y

# 2. 安装必要软件
echo -e "${GREEN}[2/10] 安装必要软件...${NC}"
apt install -y python3 python3-pip python3-venv nodejs npm nginx git

# 3. 创建项目目录
echo -e "${GREEN}[3/10] 创建项目目录...${NC}"
mkdir -p /var/www/spectranet
cd /var/www/spectranet

# 4. 克隆或复制项目（需要手动上传代码）
echo -e "${GREEN}[4/10] 请确保已将代码上传到 /var/www/spectranet${NC}"
read -p "代码已上传？(y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "请先上传代码，然后重新运行此脚本"
    exit 1
fi

# 5. 安装后端依赖
echo -e "${GREEN}[5/10] 安装后端依赖...${NC}"
cd /var/www/spectranet/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 6. 配置后端环境变量
echo -e "${GREEN}[6/10] 配置后端环境变量...${NC}"
cp .env.production .env
echo "请编辑 /var/www/spectranet/backend/.env 文件，修改 SECRET_KEY 和 ALLOWED_ORIGINS"
read -p "按回车键继续..."

# 7. 初始化数据库
echo -e "${GREEN}[7/10] 初始化数据库...${NC}"
python init_db.py

# 8. 构建前端
echo -e "${GREEN}[8/10] 构建前端...${NC}"
cd /var/www/spectranet/frontend
npm install
npm run build

# 9. 配置 Nginx
echo -e "${GREEN}[9/10] 配置 Nginx...${NC}"
cp /var/www/spectranet/nginx.conf /etc/nginx/sites-available/spectranet
ln -sf /etc/nginx/sites-available/spectranet /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 10. 配置 systemd 服务
echo -e "${GREEN}[10/10] 配置后端服务...${NC}"
cp /var/www/spectranet/spectranet-backend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable spectranet-backend
systemctl start spectranet-backend

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "访问地址: http://$(curl -s ifconfig.me)"
echo ""
echo "常用命令:"
echo "  查看后端状态: systemctl status spectranet-backend"
echo "  查看后端日志: journalctl -u spectranet-backend -f"
echo "  重启后端: systemctl restart spectranet-backend"
echo "  重启 Nginx: systemctl restart nginx"
echo ""
