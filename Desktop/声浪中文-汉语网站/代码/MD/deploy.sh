#!/bin/bash
# WaveMandarin 自动部署脚本
# 适用于 CentOS Stream 8
# 域名: mandarinwave.cn

set -e

echo "========================================"
echo "  WaveMandarin 自动部署脚本"
echo "========================================"

# 检查是否为 root
if [ "$EUID" -ne 0 ]; then
  echo "请使用 root 用户或 sudo 运行此脚本"
  exit 1
fi

# 1. 更新系统
echo "[1/6] 更新系统..."
dnf update -y

# 2. 安装 Node.js 20
echo "[2/6] 安装 Node.js 20..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  dnf install -y nodejs
fi
echo "Node.js 版本: $(node -v)"

# 3. 安装 pnpm 和 PM2
echo "[3/6] 安装 pnpm 和 PM2..."
npm install -g pnpm pm2

# 4. 安装 Nginx
echo "[4/6] 安装 Nginx..."
if ! command -v nginx &> /dev/null; then
  dnf install -y nginx
  systemctl enable nginx
fi

# 5. 构建项目
echo "[5/6] 构建项目..."
cd /var/www/wavemandarin
pnpm install
pnpm build

# 6. 配置 Nginx
echo "[6/6] 配置 Nginx..."
cat > /etc/nginx/conf.d/wavemandarin.conf << 'EOF'
server {
    listen 80;
    server_name mandarinwave.cn www.mandarinwave.cn;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

nginx -t && systemctl restart nginx

# 7. 启动服务
echo "启动应用..."
pm2 start pnpm --name "wavemandarin" -- start
pm2 save
pm2 startup | tail -n 1 | bash

# 8. 配置防火墙
echo "配置防火墙..."
firewall-cmd --permanent --add-service=http 2>/dev/null || true
firewall-cmd --permanent --add-service=https 2>/dev/null || true
firewall-cmd --reload 2>/dev/null || true

echo ""
echo "========================================"
echo "  部署完成！"
echo "========================================"
echo ""
echo "网站地址: http://mandarinwave.cn"
echo ""
echo "下一步 - 配置 HTTPS:"
echo "  dnf install -y epel-release"
echo "  dnf install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d mandarinwave.cn -d www.mandarinwave.cn"
echo ""
