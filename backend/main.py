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
    """自动初始化数据库（仅初始化分类，不再自动创建 admin 用户）"""
    db = SessionLocal()
    try:
        # 检查分类是否存在
        category_count = db.query(Category).count()
        if category_count == 0:
            print("初始化层级分类...")
            
            # 创建三大类
            solid = Category(name="固体", description="固体物质光谱数据")
            liquid = Category(name="液体", description="液体物质光谱数据")
            gas = Category(name="气体", description="气体物质光谱数据")
            
            db.add_all([solid, liquid, gas])
            db.flush()
            
            # 固体下的二级分类
            crops = Category(name="农作物", description="农作物光谱数据", parent_id=solid.id)
            chemical = Category(name="化工原料", description="化工原料光谱数据", parent_id=solid.id)
            mineral = Category(name="矿物", description="矿物光谱数据", parent_id=solid.id)
            daily_material = Category(name="日用材料", description="日用材料光谱数据", parent_id=solid.id)
            
            db.add_all([crops, chemical, mineral, daily_material])
            db.flush()
            
            # 液体下的二级分类
            glycol = Category(name="丙二醇", description="丙二醇光谱数据", parent_id=liquid.id)
            oils = Category(name="油脂", description="油脂光谱数据", parent_id=liquid.id)
            
            db.add_all([glycol, oils])
            db.flush()
            
            # 气体下的二级分类
            aerosol = Category(name="气溶胶", description="气溶胶光谱数据", parent_id=gas.id)
            methane = Category(name="甲烷", description="甲烷光谱数据", parent_id=gas.id)
            ammonia = Category(name="氨气", description="氨气光谱数据", parent_id=gas.id)
            
            db.add_all([aerosol, methane, ammonia])
            db.flush()
            
            # 农作物下的三级分类
            tobacco = Category(name="烟草", description="烟草光谱数据", parent_id=crops.id)
            medicine = Category(name="中药", description="中药光谱数据", parent_id=crops.id)
            beans = Category(name="豆类", description="豆类光谱数据", parent_id=crops.id)
            
            db.add_all([tobacco, medicine, beans])
            db.flush()
            
            # 矿物下的三级分类
            diamond = Category(name="金刚石", description="金刚石光谱数据", parent_id=mineral.id)
            
            db.add(diamond)
            db.flush()
            
            # 日用材料下的三级分类
            fabric = Category(name="织物", description="织物光谱数据", parent_id=daily_material.id)
            plastic = Category(name="塑料", description="塑料光谱数据", parent_id=daily_material.id)
            glass_cat = Category(name="玻璃", description="玻璃光谱数据", parent_id=daily_material.id)
            
            db.add_all([fabric, plastic, glass_cat])
            
            db.commit()
            print("✅ 层级分类初始化成功！")
        else:
            print(f"分类已存在（发现 {category_count} 个分类）")
            
    except Exception as e:
        print(f"初始化错误: {e}")
        db.rollback()
    finally:
        db.close()

# 运行自动初始化（仅分类）
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
