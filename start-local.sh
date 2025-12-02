#!/bin/bash

# SpectraNet 本地启动脚本 (Linux/Mac)

echo ""
echo "================================"
echo "SpectraNet 本地启动"
echo "================================"
echo ""

# 检查后端是否已初始化
if [ ! -d "backend/venv" ]; then
    echo "[1/4] 创建后端虚拟环境并安装依赖..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    echo "初始化数据库..."
    python init_db.py
    cd ..
    echo ""
else
    echo "[1/4] 后端虚拟环境已存在"
    echo ""
fi

# 检查前端依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "[2/4] 安装前端依赖..."
    cd frontend
    npm install
    cd ..
    echo ""
else
    echo "[2/4] 前端依赖已安装"
    echo ""
fi

# 启动后端
echo "[3/4] 启动后端服务 (http://localhost:8000)..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..
sleep 2

# 启动前端
echo "[4/4] 启动前端开发服务器 (http://localhost:5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "================================"
echo "启动完成！"
echo "================================"
echo ""
echo "后端 API: http://localhost:8000"
echo "后端文档: http://localhost:8000/docs"
echo "前端网站: http://localhost:5173"
echo ""
echo "默认账号:"
echo "  用户名: admin"
echo "  密码: admin123"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 等待进程
wait
