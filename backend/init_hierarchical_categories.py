"""
初始化层级分类系统
Create hierarchical category structure for SpectraNet
"""
from database import SessionLocal
from models import Category


def create_hierarchical_categories():
    """创建层级分类结构"""
    db = SessionLocal()
    
    try:
        # 清空现有分类
        print("清空现有分类...")
        db.query(Category).delete()
        db.commit()
        
        # 一级分类：主要领域
        print("\n创建一级分类...")
        categories_level1 = [
            {"name": "农业", "description": "Agricultural spectral data"},
            {"name": "植被", "description": "Plant and vegetation spectra"},
            {"name": "矿物", "description": "Mineral and geological spectra"},
            {"name": "水质", "description": "Water and aquatic spectral data"},
            {"name": "遥感", "description": "Satellite and aerial spectral data"},
            {"name": "医学", "description": "Biomedical spectral data"},
            {"name": "材料", "description": "Material characterization spectra"},
            {"name": "大气", "description": "Atmospheric spectral measurements"},
        ]
        
        cat_map = {}  # 用于存储分类 ID 映射
        
        for cat_data in categories_level1:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            cat_map[cat_data["name"]] = cat.id
            print(f"  添加: {cat_data['name']} (ID: {cat.id})")
        
        db.commit()
        
        # 二级分类：农业下的子分类
        print("\n创建二级分类 - 农业...")
        agriculture_subcats = [
            {"name": "烟草", "description": "Tobacco spectral data", "parent_id": cat_map["农业"]},
            {"name": "中药", "description": "Chinese medicine spectral data", "parent_id": cat_map["农业"]},
            {"name": "谷物", "description": "Grain spectral data", "parent_id": cat_map["农业"]},
            {"name": "水果", "description": "Fruit spectral data", "parent_id": cat_map["农业"]},
            {"name": "蔬菜", "description": "Vegetable spectral data", "parent_id": cat_map["农业"]},
        ]
        
        for cat_data in agriculture_subcats:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            cat_map[cat_data["name"]] = cat.id
            print(f"  添加: {cat_data['name']} (ID: {cat.id}, Parent: {cat_data['parent_id']})")
        
        db.commit()
        
        # 三级分类：烟草下的子分类
        print("\n创建三级分类 - 烟草...")
        tobacco_subcats = [
            {"name": "常规烟叶", "description": "Regular tobacco leaves", "parent_id": cat_map["烟草"]},
            {"name": "雪茄烟叶", "description": "Cigar tobacco leaves", "parent_id": cat_map["烟草"]},
            {"name": "晾晒烟", "description": "Sun-cured tobacco", "parent_id": cat_map["烟草"]},
        ]
        
        for cat_data in tobacco_subcats:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            cat_map[cat_data["name"]] = cat.id
            print(f"  添加: {cat_data['name']} (ID: {cat.id}, Parent: {cat_data['parent_id']})")
        
        db.commit()
        
        # 四级分类：雪茄烟叶下的产地分类
        print("\n创建四级分类 - 雪茄烟叶产地...")
        cigar_subcats = [
            {"name": "雪茄-云南", "description": "Yunnan cigar tobacco", "parent_id": cat_map["雪茄烟叶"]},
            {"name": "雪茄-多米尼加", "description": "Dominican cigar tobacco", "parent_id": cat_map["雪茄烟叶"]},
            {"name": "雪茄-古巴", "description": "Cuban cigar tobacco", "parent_id": cat_map["雪茄烟叶"]},
            {"name": "雪茄-尼加拉瓜", "description": "Nicaraguan cigar tobacco", "parent_id": cat_map["雪茄烟叶"]},
        ]
        
        for cat_data in cigar_subcats:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            cat_map[cat_data["name"]] = cat.id
            print(f"  添加: {cat_data['name']} (ID: {cat.id}, Parent: {cat_data['parent_id']})")
        
        db.commit()
        
        # 二级分类：材料下的子分类
        print("\n创建二级分类 - 材料...")
        material_subcats = [
            {"name": "纺织品", "description": "Textile materials", "parent_id": cat_map["材料"]},
            {"name": "聚合物", "description": "Polymer materials", "parent_id": cat_map["材料"]},
            {"name": "金属", "description": "Metal materials", "parent_id": cat_map["材料"]},
        ]
        
        for cat_data in material_subcats:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            cat_map[cat_data["name"]] = cat.id
            print(f"  添加: {cat_data['name']} (ID: {cat.id}, Parent: {cat_data['parent_id']})")
        
        db.commit()
        
        # 三级分类：纺织品下的子分类
        print("\n创建三级分类 - 纺织品...")
        textile_subcats = [
            {"name": "醋酸纤维", "description": "Acetate fiber", "parent_id": cat_map["纺织品"]},
            {"name": "棉", "description": "Cotton", "parent_id": cat_map["纺织品"]},
            {"name": "亚麻", "description": "Linen", "parent_id": cat_map["纺织品"]},
            {"name": "素缎", "description": "Satin", "parent_id": cat_map["纺织品"]},
            {"name": "聚酯", "description": "Polyester", "parent_id": cat_map["纺织品"]},
            {"name": "蚕丝", "description": "Silk", "parent_id": cat_map["纺织品"]},
            {"name": "羊毛", "description": "Wool", "parent_id": cat_map["纺织品"]},
        ]
        
        for cat_data in textile_subcats:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            cat_map[cat_data["name"]] = cat.id
            print(f"  添加: {cat_data['name']} (ID: {cat.id}, Parent: {cat_data['parent_id']})")
        
        db.commit()
        
        print("\n✅ 层级分类结构创建成功！")
        print(f"总共创建了 {len(cat_map)} 个分类")
        
        # 显示完整的层级结构
        print("\n=== 完整层级结构 ===")
        root_cats = db.query(Category).filter(Category.parent_id == None).all()
        for cat in root_cats:
            print_category_tree(cat, db, level=0)
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        db.rollback()
    finally:
        db.close()


def print_category_tree(category, db, level=0):
    """递归打印分类树"""
    indent = "  " * level
    symbol = "└─" if level > 0 else "●"
    print(f"{indent}{symbol} {category.name} (ID: {category.id})")
    
    # 获取子分类
    children = db.query(Category).filter(Category.parent_id == category.id).all()
    for child in children:
        print_category_tree(child, db, level + 1)


if __name__ == "__main__":
    create_hierarchical_categories()
