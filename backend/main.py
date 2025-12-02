from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from database import Base, engine, SessionLocal
from models import User, Category
from routes import auth_routes, dataset_routes, category_routes, upload_routes, stats_routes
from config import settings
from auth import get_password_hash

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto-initialize database with default data on startup
def auto_init_db():
    """Automatically initialize database with default data if needed"""
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin_exists = db.query(User).filter(User.username == "admin").first()
        if not admin_exists:
            print("Initializing database with default data...")
            
            # Create default categories
            categories = [
                {"name": "农业", "description": "Agricultural spectral data"},
                {"name": "植被", "description": "Plant and vegetation spectra"},
                {"name": "矿物", "description": "Mineral and geological spectra"},
                {"name": "水质", "description": "Water and aquatic spectral data"},
                {"name": "遥感", "description": "Satellite and aerial spectral data"},
                {"name": "医学", "description": "Biomedical spectral data"},
                {"name": "材料", "description": "Material characterization spectra"},
                {"name": "大气", "description": "Atmospheric spectral measurements"},
            ]
            
            for cat_data in categories:
                existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
                if not existing:
                    category = Category(**cat_data)
                    db.add(category)
            
            # Create default admin user
            admin = User(
                username="admin",
                email="admin@spectranet.com",
                hashed_password=get_password_hash("admin123"),
                full_name="System Administrator",
                is_superuser=True,
                is_admin=True,
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("Database initialized successfully with admin user and categories!")
        else:
            print("Database already initialized.")
    except Exception as e:
        print(f"Error during auto-initialization: {e}")
        db.rollback()
    finally:
        db.close()

# Run auto-initialization
auto_init_db()

# Create upload directory
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

app = FastAPI(
    title="SpectraNet API",
    description="Spectral Dataset Repository - Similar to ImageNet but for spectral data",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,  # 使用配置文件中的值
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (uploads)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth_routes.router)
app.include_router(dataset_routes.router)
app.include_router(category_routes.router)
app.include_router(upload_routes.router)
app.include_router(stats_routes.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to SpectraNet API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host=settings.HOST, 
        port=settings.PORT, 
        reload=False
    )
