@echo off
REM SpectraNet 本地启动脚本 (Windows)

echo.
echo ================================
echo SpectraNet 本地启动
echo ================================
echo.

REM 检查后端是否已初始化
if not exist "backend\venv" (
    echo [1/4] 创建后端虚拟环境并安装依赖...
    cd backend
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    echo 初始化数据库...
    python init_db.py
    cd ..
    echo.
) else (
    echo [1/4] 后端虚拟环境已存在
    echo.
)

REM 检查前端依赖
if not exist "frontend\node_modules" (
    echo [2/4] 安装前端依赖...
    cd frontend
    call npm install
    cd ..
    echo.
) else (
    echo [2/4] 前端依赖已安装
    echo.
)

REM 启动后端
echo [3/4] 启动后端服务 (http://localhost:8000)...
start cmd /k "cd backend && call venv\Scripts\activate.bat && python main.py"
timeout /t 3

REM 启动前端
echo [4/4] 启动前端开发服务器 (http://localhost:5173)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ================================
echo 启动完成！
echo ================================
echo.
echo 后端 API: http://localhost:8000
echo 后端文档: http://localhost:8000/docs
echo 前端网站: http://localhost:5173
echo.
echo 默认账号:
echo   用户名: admin
echo   密码: admin123
echo.
echo 按任意键关闭此窗口...
pause >nul
