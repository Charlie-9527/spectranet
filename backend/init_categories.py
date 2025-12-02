"""
初始化层级分类系统
"""
from database import SessionLocal
from models import Category

def init_hierarchical_categories():
    """初始化层级分类结构"""
    db = SessionLocal()
    
    try:
        # 清空现有分类
        db.query(Category).delete()
        db.commit()
        
        # 创建三大类
        solid = Category(name="固体", description="固体物质光谱数据")
        liquid = Category(name="液体", description="液体物质光谱数据")
        gas = Category(name="气体", description="气体物质光谱数据")
        
        db.add_all([solid, liquid, gas])
        db.flush()  # 获取 ID
        
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
        glass = Category(name="玻璃", description="玻璃光谱数据", parent_id=daily_material.id)
        
        db.add_all([fabric, plastic, glass])
        
        db.commit()
        print("✅ 层级分类系统初始化成功！")
        print("\n分类结构：")
        print("├─ 固体")
        print("│  ├─ 农作物")
        print("│  │  ├─ 烟草")
        print("│  │  ├─ 中药")
        print("│  │  └─ 豆类")
        print("│  ├─ 化工原料")
        print("│  ├─ 矿物")
        print("│  │  └─ 金刚石")
        print("│  └─ 日用材料")
        print("│     ├─ 织物")
        print("│     ├─ 塑料")
        print("│     └─ 玻璃")
        print("├─ 液体")
        print("│  ├─ 丙二醇")
        print("│  └─ 油脂")
        print("└─ 气体")
        print("   ├─ 气溶胶")
        print("   ├─ 甲烷")
        print("   └─ 氨气")
        
    except Exception as e:
        print(f"❌ 初始化失败: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_hierarchical_categories()
