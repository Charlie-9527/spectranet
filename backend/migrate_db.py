"""n数据库迁移脚本
自动修复分类唯一性约束
"""
from sqlalchemy import text
from database import engine
import traceback

def migrate_category_constraint():
    """修复分类唯一性约束：从全局唯一改为组合唯一"""
    
    print("\n" + "="*60)
    print("开始数据库迁移...")
    print("="*60)
    
    try:
        with engine.connect() as conn:
            # 开启事务
            trans = conn.begin()
            
            try:
                # 1. 先检查新约束是否已存在
                print("步骤 1: 检查现有约束...")
                result = conn.execute(text("""
                    SELECT constraint_name 
                    FROM information_schema.table_constraints 
                    WHERE table_name = 'categories' 
                    AND constraint_type = 'UNIQUE';
                """))
                
                constraints = [row[0] for row in result]
                print(f"现有约束: {constraints}")
                
                # 如果新约束已存在，跳过迁移
                if 'uq_category_name_parent' in constraints:
                    print("✅ 组合唯一性约束已存在，无需迁移")
                    trans.commit()
                    return True
                
                # 2. 删除旧的全局唯一性约束
                if 'categories_name_key' in constraints:
                    print("步骤 2: 删除旧的全局唯一性约束...")
                    conn.execute(text("""
                        ALTER TABLE categories 
                        DROP CONSTRAINT categories_name_key;
                    """))
                    conn.commit()  # 提交删除操作
                    print("✅ 旧约束删除成功")
                else:
                    print("ℹ️  旧约束不存在，跳过删除")
                
                # 3. 添加新的组合唯一性约束
                print("步骤 3: 添加新的组合唯一性约束...")
                conn.execute(text("""
                    ALTER TABLE categories 
                    ADD CONSTRAINT uq_category_name_parent 
                    UNIQUE (name, parent_id);
                """))
                conn.commit()  # 提交添加操作
                print("✅ 新约束添加成功")
                
                # 提交整个事务
                trans.commit()
                print("\n" + "="*60)
                print("✅ 数据库迁移成功！")
                print("="*60 + "\n")
                return True
                
            except Exception as e:
                # 回滚事务
                trans.rollback()
                error_msg = str(e)
                print(f"\n❌ 迁移失败: {error_msg}")
                print(f"错误类型: {type(e).__name__}")
                traceback.print_exc()
                
                # 检查是否是因为约束已存在
                if "already exists" in error_msg or "duplicate" in error_msg.lower():
                    print("ℹ️  新约束已存在，无需迁移")
                    return True
                
                print("\n" + "="*60)
                print("⚠️  迁移未完成，但系统将继续运行")
                print("="*60 + "\n")
                return False
                
    except Exception as e:
        print(f"\n❌ 数据库连接错误: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    migrate_category_constraint()
