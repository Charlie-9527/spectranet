from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from database import Base, engine
from routes import auth_routes, dataset_routes, category_routes, upload_routes, stats_routes
from config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

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
