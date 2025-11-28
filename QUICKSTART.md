# SpectraNet - Quick Start Guide

## 🚀 Get Started in 5 Minutes!

### Option 1: Automated Setup (Windows)

1. **Start Backend:**
   - Double-click `start-backend.bat`
   - Wait for the message "Backend will be available at: http://localhost:8000"

2. **Start Frontend:**
   - Double-click `start-frontend.bat`
   - Wait for the message "Frontend will be available at: http://localhost:5173"

3. **Open Your Browser:**
   - Navigate to http://localhost:5173
   - You should see the SpectraNet homepage!

### Option 2: Manual Setup

#### Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- Git (optional)

#### Step 1: Backend Setup (5 minutes)

```bash
# Open Terminal/Command Prompt
cd E:\spectranet_qoderpj\backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Or on Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start server
python main.py
```

✅ Backend should now be running at http://localhost:8000

#### Step 2: Frontend Setup (3 minutes)

```bash
# Open a NEW Terminal/Command Prompt
cd E:\spectranet_qoderpj\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend should now be running at http://localhost:5173

## 🎯 First Steps After Starting

### 1. Login with Default Admin Account
- **URL:** http://localhost:5173/login
- **Username:** `admin`
- **Password:** `admin123`

### 2. Or Create Your Own Account
- Click "Register" on the homepage
- Fill in your details
- Login with your new credentials

### 3. Upload Your First Dataset
1. Click "Upload" in the navigation bar
2. Fill in dataset information:
   - Name: e.g., "My First Spectral Dataset"
   - Description: Brief description
   - Select a category
   - Choose spectral type
3. Upload files (optional):
   - Use the sample file at `sample_data/example_spectral_data.csv`
4. Click "Upload Files" to complete

### 4. Browse Datasets
- Click "Datasets" in the navigation
- Use search and filters
- Click on any dataset to view details
- See spectral visualizations

### 5. View Statistics
- Click "Statistics" to see platform overview
- View datasets by category and type
- See trending datasets

## 📊 Sample Data

A sample spectral dataset CSV is provided at:
```
E:\spectranet_qoderpj\sample_data\example_spectral_data.csv
```

This contains 10 spectral samples with wavelengths from 400-700nm.

## 🔧 Troubleshooting

### Backend won't start?
- Make sure Python 3.8+ is installed: `python --version`
- Check if port 8000 is free
- Try deleting `spectranet.db` and run `python init_db.py` again

### Frontend won't start?
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` folder and run `npm install` again
- Check if port 5173 is free

### Can't connect to backend from frontend?
- Make sure backend is running at http://localhost:8000
- Check `frontend/vite.config.ts` proxy settings
- Clear browser cache and reload

### Login not working?
- Use default credentials: admin / admin123
- Or register a new account
- Check browser console for errors

## 📚 Next Steps

1. **Explore the API:**
   - Visit http://localhost:8000/docs for interactive API documentation
   - Try the examples in `API_EXAMPLES.md`

2. **Customize Categories:**
   - Login as admin
   - Use API to add custom categories
   - See API documentation

3. **Upload Real Data:**
   - Prepare your spectral data in CSV format
   - Wavelengths as column headers
   - Samples as rows

4. **Integration:**
   - Use the API for programmatic access
   - See `API_EXAMPLES.md` for Python and JavaScript examples

## 🎓 Learn More

- **Full Documentation:** See `README.md`
- **Setup Guide:** See `SETUP.md`
- **API Examples:** See `API_EXAMPLES.md`

## 🆘 Need Help?

Common issues and solutions:

1. **"Module not found" errors:**
   - Backend: Activate virtual environment and reinstall: `pip install -r requirements.txt`
   - Frontend: Reinstall packages: `npm install`

2. **Database errors:**
   - Delete `backend/spectranet.db`
   - Run `python init_db.py` again

3. **Port already in use:**
   - Kill the process using the port
   - Or change the port in configuration files

## ✨ Features You Can Try

- ✅ User registration and authentication
- ✅ Dataset browsing with search and filters
- ✅ Dataset upload with metadata
- ✅ Spectral data visualization
- ✅ Sample CSV upload and parsing
- ✅ Statistics and trending datasets
- ✅ Download datasets
- ✅ RESTful API access

## 🎉 You're All Set!

Enjoy using SpectraNet - The Spectral Data Repository!

---

**Remember:** This is a development setup. For production deployment, see `SETUP.md` for additional configuration.
