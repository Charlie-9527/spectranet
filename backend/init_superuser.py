"""
初始化超级管理员账号
用于生产环境首次部署时创建管理员账号
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User
from auth import get_password_hash

# 从环境变量获取数据库URL，如果没有则使用本地SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./spectranet.db")

# 创建数据库引擎
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def create_superuser(username: str, email: str, password: str, full_name: str = None):
    """创建超级管理员账号"""
    db = SessionLocal()
    try:
        # 检查用户是否已存在
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"❌ 用户 {username} 已存在！")
            return False
        
        # 创建超级管理员
        hashed_password = get_password_hash(password)
        superuser = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            full_name=full_name or username,
            institution="LASDOP Lab - HFUT",
            is_superuser=True,
            is_admin=True,
            is_active=True
        )
        
        db.add(superuser)
        db.commit()
        db.refresh(superuser)
        
        print(f"✅ 超级管理员创建成功！")
        print(f"   用户名: {superuser.username}")
        print(f"   邮箱: {superuser.email}")
        print(f"   ID: {superuser.id}")
        return True
        
    except Exception as e:
        print(f"❌ 创建失败: {e}")
        db.rollback()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 50)
    print("SpectraNet - 超级管理员初始化")
    print("=" * 50)
    
    # 创建默认超级管理员
    print("\n创建超级管理员账号...")
    create_superuser(
        username="admin",
        email="admin@spectranet.com",
        password="admin123456",  # 建议部署后立即修改密码
        full_name="系统管理员"
    )
    
    print("\n" + "=" * 50)
    print("⚠️  重要提示：")
    print("   1. 请立即登录并修改默认密码")
    print("   2. 可以通过管理员账号创建其他用户")
    print("   3. 建议创建完其他管理员后删除此脚本")
    print("=" * 50)
