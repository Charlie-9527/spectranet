# SpectraNet Setup Guide

## Initial Setup Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Initialize database with default data
python init_db.py

# Start the backend server
python main.py
```

The backend API will be available at:
- Main URL: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### 2. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:5173

## Default Credentials

After running `python init_db.py`, you can login with:
- **Username**: admin
- **Password**: admin123

## Testing the Application

1. Open browser to http://localhost:5173
2. Click "Register" to create a new account
3. After registration, login with your credentials
4. Navigate to "Upload" to create your first dataset
5. Browse datasets and view statistics

## Common Issues

### Backend Issues

**Port 8000 already in use**
```bash
# Change port in main.py or kill the process using port 8000
```

**Database errors**
```bash
# Delete the database and reinitialize
rm spectranet.db
python init_db.py
```

**Import errors**
```bash
# Make sure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Port 5173 already in use**
```bash
# Vite will automatically try the next available port
```

**API connection errors**
- Make sure backend is running at http://localhost:8000
- Check CORS settings in backend/main.py

**Module not found errors**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Backend

1. Update `.env` with production values:
```
DATABASE_URL=postgresql://user:password@host:5432/spectranet
SECRET_KEY=<generate-a-strong-secret-key>
```

2. Use production server:
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

1. Build for production:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting service

3. Update environment variable:
```
VITE_API_URL=https://your-api-domain.com
```

## Database Migration (Optional)

To use PostgreSQL instead of SQLite:

1. Install PostgreSQL and create a database
2. Update `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/spectranet
```
3. Install PostgreSQL adapter:
```bash
pip install psycopg2-binary
```
4. Run initialization:
```bash
python init_db.py
```

## Next Steps

- Explore the API documentation at http://localhost:8000/docs
- Upload sample spectral datasets
- Customize categories in the database
- Integrate with your existing spectral data workflows

## Support

For issues and questions, refer to the main README.md file.
