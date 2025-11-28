@echo off
echo ========================================
echo SpectraNet - Starting Backend Server
echo ========================================
echo.

cd backend

echo Checking virtual environment...
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing/Updating dependencies...
pip install -q -r requirements.txt

echo.
echo Checking database...
if not exist "spectranet.db" (
    echo Initializing database...
    python init_db.py
)

echo.
echo Starting FastAPI server...
echo Backend will be available at: http://localhost:8000
echo API Documentation at: http://localhost:8000/docs
echo.
python main.py
