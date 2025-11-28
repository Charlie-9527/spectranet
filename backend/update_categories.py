from database import SessionLocal
from models import Category

def update_categories():
    """强制更新分类为中文"""
    db = SessionLocal()
    
    try:
        # 删除所有现有分类
        print("删除所有现有分类...")
        db.query(Category).delete()
        db.commit()
        print("删除完成！")
        
        # 添加新的中文分类
        print("添加新的中文分类...")
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
            category = Category(**cat_data)
            db.add(category)
            print(f"  添加: {cat_data['name']}")
        
        db.commit()
        print("更新完成！")
        
        # 验证
        print("\n当前分类:")
        all_cats = db.query(Category).all()
        for cat in all_cats:
            print(f"  ID: {cat.id}, Name: {cat.name}")
            
    except Exception as e:
        print(f"错误: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_categories()
