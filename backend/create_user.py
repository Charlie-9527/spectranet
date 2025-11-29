"""
管理员脚本:创建新用户账号
用法: python create_user.py
"""
from database import SessionLocal
from models import User
from auth import get_password_hash
import sys

def create_user(username: str, email: str, password: str, full_name: str = None, institution: str = None, is_superuser: bool = False, is_admin: bool = False):
    """创建新用户"""
    db = SessionLocal()
    
    try:
        # 检查用户是否已存在
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"❌ 错误: 用户名 '{username}' 已存在!")
            return False
        
        existing_email = db.query(User).filter(User.email == email).first()
        if existing_email:
            print(f"❌ 错误: 邮箱 '{email}' 已被注册!")
            return False
        
        # 创建新用户
        hashed_password = get_password_hash(password)
        new_user = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            institution=institution,
            is_superuser=is_superuser,
            is_admin=is_admin,
            is_active=True
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print(f"✅ 成功创建用户:")
        print(f"   用户名: {username}")
        print(f"   邮箱: {email}")
        print(f"   姓名: {full_name or '未设置'}")
        print(f"   机构: {institution or '未设置'}")
        print(f"   超级管理员: {'是' if is_superuser else '否'}")
        print(f"   管理员: {'是' if is_admin else '否'}")
        
        return True
        
    except Exception as e:
        db.rollback()
        print(f"❌ 创建用户失败: {str(e)}")
        return False
    finally:
        db.close()


def main():
    print("=" * 60)
    print("SpectraNet 用户创建工具")
    print("=" * 60)
    print()
    
    # 交互式输入
    username = input("请输入用户名: ").strip()
    if not username:
        print("❌ 用户名不能为空!")
        sys.exit(1)
    
    email = input("请输入邮箱: ").strip()
    if not email:
        print("❌ 邮箱不能为空!")
        sys.exit(1)
    
    password = input("请输入密码: ").strip()
    if not password:
        print("❌ 密码不能为空!")
        sys.exit(1)
    
    full_name = input("请输入姓名 (可选,直接回车跳过): ").strip() or None
    institution = input("请输入机构 (可选,直接回车跳过): ").strip() or None
    
    is_superuser_input = input("是否设为超级管理员? (可创建用户+上传+下载) (y/N): ").strip().lower()
    is_superuser = is_superuser_input == 'y'
    
    is_admin = False
    if not is_superuser:
        is_admin_input = input("是否设为管理员? (可上传+下载) (y/N): ").strip().lower()
        is_admin = is_admin_input == 'y'
    
    print()
    print("=" * 60)
    print("确认信息:")
    print(f"  用户名: {username}")
    print(f"  邮箱: {email}")
    print(f"  姓名: {full_name or '未设置'}")
    print(f"  机构: {institution or '未设置'}")
    print(f"  超级管理员: {'是' if is_superuser else '否'}")
    print(f"  管理员: {'是' if is_admin else '否'}")
    print("=" * 60)
    
    confirm = input("确认创建? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ 已取消")
        sys.exit(0)
    
    print()
    success = create_user(username, email, password, full_name, institution, is_superuser, is_admin)
    
    if success:
        print()
        print("🎉 用户创建成功!")
        print()
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
