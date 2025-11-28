@echo off
echo ========================================
echo SpectraNet - Starting Frontend
echo ========================================
echo.

cd frontend

echo Checking node_modules...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting Vite development server...
echo Frontend will be available at: http://localhost:5173
echo.
call npm run dev
