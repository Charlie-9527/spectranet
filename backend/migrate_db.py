"""
数据库迁移脚本
自动修复分类唯一性约束
"""
from sqlalchemy import text
from database import engine

def migrate_category_constraint():
    """修复分类唯一性约束：从全局唯一改为组合唯一"""
    
    print("开始数据库迁移...")
    
    with engine.connect() as conn:
        # 开启事务
        trans = conn.begin()
        
        try:
            # 1. 删除旧的全局唯一性约束
            print("正在删除旧的唯一性约束...")
            conn.execute(text("""
                ALTER TABLE categories 
                DROP CONSTRAINT IF EXISTS categories_name_key;
            """))
            
            # 2. 添加新的组合唯一性约束
            print("正在添加新的组合唯一性约束...")
            conn.execute(text("""
                ALTER TABLE categories 
                ADD CONSTRAINT uq_category_name_parent 
                UNIQUE (name, parent_id);
            """))
            
            # 提交事务
            trans.commit()
            print("✅ 数据库迁移成功！")
            return True
            
        except Exception as e:
            # 回滚事务
            trans.rollback()
            print(f"❌ 迁移失败: {e}")
            
            # 检查约束是否已存在
            if "already exists" in str(e):
                print("ℹ️  新约束已存在，无需迁移")
                return True
            
            return False

if __name__ == "__main__":
    migrate_category_constraint()
