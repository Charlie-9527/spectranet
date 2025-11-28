#!/bin/bash

echo "========================================"
echo "SpectraNet - Starting Backend Server"
echo "========================================"
echo ""

cd backend

echo "Checking virtual environment..."
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing/Updating dependencies..."
pip install -q -r requirements.txt

echo ""
echo "Checking database..."
if [ ! -f "spectranet.db" ]; then
    echo "Initializing database..."
    python init_db.py
fi

echo ""
echo "Starting FastAPI server..."
echo "Backend will be available at: http://localhost:8000"
echo "API Documentation at: http://localhost:8000/docs"
echo ""
python main.py
