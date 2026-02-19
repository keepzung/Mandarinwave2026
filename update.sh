#!/bin/bash
# 更新代码并重新部署

cd /var/www/wavemandarin

echo "拉取最新代码..."
git pull

echo "安装依赖..."
pnpm install

echo "构建项目..."
pnpm build

echo "重启服务..."
pm2 restart wavemandarin

echo "更新完成！"
