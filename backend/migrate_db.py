"""
数据库迁移脚本:添加 is_admin 字段
运行此脚本将:
1. 备份当前数据库
2. 为所有现有用户添加 is_admin 字段(默认为 False)
"""
from database import SessionLocal, engine
from models import Base, User
from sqlalchemy import inspect, text

def migrate_db():
    """添加 is_admin 字段到现有数据库"""
    db = SessionLocal()
    
    try:
        # 检查 is_admin 列是否已存在
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('users')]
        
        if 'is_admin' not in columns:
            print("正在添加 is_admin 字段...")
            
            # SQLite 添加列
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0"))
                conn.commit()
            
            print("✅ is_admin 字段添加成功!")
        else:
            print("✅ is_admin 字段已存在,无需迁移。")
        
    except Exception as e:
        print(f"❌ 迁移失败: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("数据库迁移: 添加 is_admin 字段")
    print("=" * 60)
    migrate_db()
    print("=" * 60)
    print("迁移完成!")
    print("=" * 60)
