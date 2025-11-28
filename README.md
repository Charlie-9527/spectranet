# SpectraNet

光谱数据集管理平台 - 类似 ImageNet 但专注于光谱数据。

## 🌟 Features

- **Dataset Management**: Upload, browse, and download spectral datasets
- **User Authentication**: Secure JWT-based authentication system
- **Advanced Search**: Filter datasets by category, type, and keywords
- **Data Visualization**: Interactive spectral curve visualization with Chart.js
- **Statistics Dashboard**: Platform-wide analytics and trending datasets
- **RESTful API**: Full API access for programmatic interactions
- **Responsive Design**: Modern UI with TailwindCSS

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Initialize database:
```bash
python init_db.py
```

6. Run the server:
```bash
python main.py
```

Backend will be running at: http://localhost:8000
API documentation: http://localhost:8000/docs

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will be running at: http://localhost:5173

## 🔑 Default Admin Account

- Username: `admin`
- Password: `admin123`

**⚠️ Important**: Change these credentials in production!

## 📁 Project Structure

```
spectranet_qoderpj/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication utilities
│   ├── init_db.py           # Database initialization
│   ├── routes/              # API route handlers
│   │   ├── auth_routes.py
│   │   ├── dataset_routes.py
│   │   ├── category_routes.py
│   │   ├── upload_routes.py
│   │   └── stats_routes.py
│   └── uploads/             # Uploaded files storage
│
└── frontend/
    ├── src/
    │   ├── api/             # API client functions
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── store/           # Zustand state management
    │   ├── types/           # TypeScript types
    │   ├── config/          # Configuration
    │   ├── App.tsx          # Main app component
    │   └── main.tsx         # Entry point
    └── package.json
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation
- **JWT**: Token-based authentication
- **SQLite**: Default database (can use PostgreSQL)

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **TailwindCSS**: Styling
- **Chart.js**: Data visualization
- **Zustand**: State management
- **Axios**: HTTP client
- **React Router**: Navigation

## 📊 Database Schema

### Main Tables
- **users**: User accounts and authentication
- **categories**: Dataset categorization
- **datasets**: Dataset metadata
- **spectral_samples**: Individual spectral measurements

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Datasets
- `GET /api/datasets/` - List datasets
- `GET /api/datasets/{id}` - Get dataset details
- `POST /api/datasets/` - Create dataset
- `PUT /api/datasets/{id}` - Update dataset
- `DELETE /api/datasets/{id}` - Delete dataset
- `GET /api/datasets/{id}/samples` - Get dataset samples
- `POST /api/datasets/{id}/download` - Download dataset

### Categories
- `GET /api/categories/` - List categories
- `POST /api/categories/` - Create category

### Upload
- `POST /api/upload/dataset` - Upload dataset file
- `POST /api/upload/samples/{dataset_id}` - Upload samples CSV

### Statistics
- `GET /api/stats/` - Get platform statistics
- `GET /api/stats/trending` - Get trending datasets

## 📝 Usage Guide

### Uploading a Dataset

1. **Register/Login** to your account
2. Navigate to **Upload** page
3. Fill in dataset information:
   - Name, description
   - Category and spectral type
   - Wavelength range
   - Tags
4. Upload files (optional):
   - Dataset file (various formats)
   - Samples CSV (wavelengths as columns, samples as rows)
5. Submit and share!

### CSV Format for Spectral Samples

```csv
sample_name,400,450,500,550,600,650,700
sample_1,0.23,0.34,0.45,0.56,0.67,0.78,0.89
sample_2,0.21,0.32,0.43,0.54,0.65,0.76,0.87
```

## 🌐 Deployment

### Vercel + Railway 部署（推荐）

详见部署文档。

### Backend Deployment
- Update `DATABASE_URL` in `.env` for production database
- Set strong `SECRET_KEY`
- Use production WSGI server (e.g., Gunicorn)
- Configure CORS for production domain

### Frontend Deployment
- Build for production: `npm run build`
- Deploy `dist/` folder to static hosting
- Update `VITE_API_URL` environment variable

## 🤝 Contributing

This project is inspired by ImageNet and aims to provide similar functionality for spectral data. Contributions are welcome!

## 📄 License

This project is created for educational and research purposes.

## 🙏 Acknowledgments

Inspired by **ImageNet** (Fei-Fei Li et al.) - A pioneering dataset that revolutionized computer vision research.

---

Built with ❤️ for the spectral data community
