"""
将 admin 用户设为超级管理员
"""
from database import SessionLocal
from models import User

db = SessionLocal()

try:
    # 找到 admin 用户
    admin = db.query(User).filter(User.username == "admin").first()
    
    if admin:
        admin.is_superuser = True
        admin.is_admin = True
        db.commit()
        print(f"✅ admin 用户已设为超级管理员!")
        print(f"   is_superuser: {admin.is_superuser}")
        print(f"   is_admin: {admin.is_admin}")
    else:
        print("❌ 未找到 admin 用户")
    
    # 同时修复 2024180168 用户
    user2024 = db.query(User).filter(User.username == "2024180168").first()
    if user2024:
        user2024.is_superuser = True
        user2024.is_admin = True
        db.commit()
        print(f"\n✅ 2024180168 用户已设为超级管理员!")
        print(f"   is_superuser: {user2024.is_superuser}")
        print(f"   is_admin: {user2024.is_admin}")
        
except Exception as e:
    print(f"❌ 错误: {e}")
    db.rollback()
finally:
    db.close()
