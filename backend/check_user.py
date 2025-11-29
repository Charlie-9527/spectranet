from database import SessionLocal
from models import User

db = SessionLocal()

try:
    user = db.query(User).filter(User.username == "2024180168").first()
    
    if user:
        print(f"\n用户信息:")
        print(f"  用户名: {user.username}")
        print(f"  邮箱: {user.email}")
        print(f"  is_superuser: {user.is_superuser}")
        print(f"  is_admin: {user.is_admin}")
        print(f"  is_active: {user.is_active}")
    else:
        print("用户不存在!")
        
finally:
    db.close()
