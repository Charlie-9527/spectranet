from database import SessionLocal
from models import Dataset, User

db = SessionLocal()

try:
    # 查找owner_id为None的数据集
    datasets_without_owner = db.query(Dataset).filter(Dataset.owner_id == None).all()
    
    if datasets_without_owner:
        print(f"\n找到 {len(datasets_without_owner)} 个没有所有者的数据集:")
        
        # 找到一个管理员用户作为默认所有者
        admin_user = db.query(User).filter(User.is_superuser == True).first()
        
        if not admin_user:
            # 如果没有超级管理员,找任意一个用户
            admin_user = db.query(User).first()
        
        if admin_user:
            print(f"将它们的所有者设置为: {admin_user.username} (ID: {admin_user.id})")
            
            for dataset in datasets_without_owner:
                print(f"  - {dataset.name} (ID: {dataset.id})")
                dataset.owner_id = admin_user.id
            
            db.commit()
            print("\n✅ 修复完成!")
        else:
            print("\n❌ 错误: 数据库中没有任何用户!")
    else:
        print("\n✅ 所有数据集都有所有者,无需修复。")
        
except Exception as e:
    print(f"\n❌ 错误: {e}")
    db.rollback()
finally:
    db.close()
