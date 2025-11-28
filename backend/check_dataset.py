"""
检查数据集是否存在
"""
from database import SessionLocal
from models import Dataset, SpectralSample, User, Category
import sys

db = SessionLocal()

try:
    # 检查所有数据集
    datasets = db.query(Dataset).all()
    print(f"\n总共有 {len(datasets)} 个数据集：\n")
    
    for ds in datasets:
        print(f"ID: {ds.id}")
        print(f"名称: {ds.name}")
        print(f"分类ID: {ds.category_id}")
        print(f"拥有者ID: {ds.owner_id}")
        
        # Get owner
        owner = db.query(User).filter(User.id == ds.owner_id).first()
        print(f"拥有者: {owner.username if owner else '未找到'}")
        
        # Get category
        if ds.category_id:
            category = db.query(Category).filter(Category.id == ds.category_id).first()
            print(f"分类: {category.name if category else '未找到'}")
        
        print(f"文件路径: {ds.file_path}")
        print(f"样本数: {ds.num_samples}")
        print(f"是否公开: {ds.is_public}")
        print(f"是否验证: {ds.is_verified}")
        
        # 检查该数据集的样本
        samples = db.query(SpectralSample).filter(
            SpectralSample.dataset_id == ds.id
        ).all()
        print(f"实际样本数: {len(samples)}")
        
        if samples:
            print(f"前3个样本:")
            for i, sample in enumerate(samples[:3]):
                print(f"  - {sample.sample_name} (标签: {sample.sample_label})")
        
        print("-" * 50)
    
    # If a specific dataset ID was provided
    if len(sys.argv) > 1:
        dataset_id = int(sys.argv[1])
        print(f"\n详细检查数据集 ID {dataset_id}:")
        print("="*50)
        
        ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if ds:
            print(f"✓ 数据集 {dataset_id} 存在")
            print(f"  名称: {ds.name}")
            if ds.owner:
                print(f"  拥有者: {ds.owner.username}")
            if ds.category:
                print(f"  分类: {ds.category.name}")
            
            samples = db.query(SpectralSample).filter(
                SpectralSample.dataset_id == dataset_id
            ).all()
            print(f"  样本数: {len(samples)}")
        else:
            print(f"✗ 数据集 {dataset_id} 不存在")
        
finally:
    db.close()
