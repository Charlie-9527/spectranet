"""
修复现有用户的 is_admin 字段
"""
from database import SessionLocal
from models import User

db = SessionLocal()

try:
    # 获取所有用户
    users = db.query(User).all()
    
    print(f"找到 {len(users)} 个用户:")
    
    for user in users:
        # 如果 is_admin 是 None,设置为 False
        if user.is_admin is None:
            user.is_admin = False
            print(f"  - 修复用户: {user.username} (is_admin: None -> False)")
        else:
            print(f"  - 用户: {user.username} (is_admin: {user.is_admin})")
    
    db.commit()
    print("\n✅ 修复完成!")
    
except Exception as e:
    print(f"❌ 错误: {e}")
    db.rollback()
finally:
    db.close()
