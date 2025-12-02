from database import SessionLocal, engine
from models import Base, Category, User
from auth import get_password_hash


def init_db():
    """Initialize database with default data"""
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
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
        
        # Old category names to delete
        old_names = ["Agriculture", "Vegetation", "Minerals", "Water Quality", 
                     "Remote Sensing", "Medical", "Materials", "Atmospheric"]
        
        # Delete old English categories
        for old_name in old_names:
            old_cat = db.query(Category).filter(Category.name == old_name).first()
            if old_cat:
                db.delete(old_cat)
        
        db.commit()
        
        # Add new Chinese categories
        for cat_data in categories:
            existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
            if not existing:
                category = Category(**cat_data)
                db.add(category)
        
        # Create default admin user
        admin_exists = db.query(User).filter(User.username == "admin").first()
        if not admin_exists:
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
        print("Database initialized successfully!")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
