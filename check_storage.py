#!/usr/bin/env python3
import os
import sys
from pathlib import Path
from sqlalchemy import create_engine, text

# 检查数据库大小
db_path = r'E:\spectranet_qoderpj\backend\spectranet.db'
if os.path.exists(db_path):
    db_size_mb = os.path.getsize(db_path) / 1024 / 1024
    print(f"✅ 数据库文件大小: {db_size_mb:.2f} MB")
else:
    print("❌ 数据库文件不存在")
    sys.exit(1)

# 检查上传文件
uploads_dir = r'E:\spectranet_qoderpj\backend\uploads'
if os.path.exists(uploads_dir):
    total_size = 0
    file_count = 0
    file_details = []
    
    for root, dirs, files in os.walk(uploads_dir):
        for file in files:
            file_path = os.path.join(root, file)
            file_size = os.path.getsize(file_path)
            total_size += file_size
            file_count += 1
            file_details.append((file, file_size / 1024))  # KB
    
    print(f"\n✅ 上传文件目录:")
    print(f"   总大小: {total_size / 1024 / 1024:.2f} MB")
    print(f"   文件数: {file_count}")
    if file_details:
        print(f"\n   文件详情:")
        for fname, fsize in sorted(file_details, key=lambda x: x[1], reverse=True):
            print(f"   - {fname}: {fsize:.2f} KB")
else:
    print("❌ uploads 目录不存在")

# 连接数据库查询数据
print("\n" + "="*50)
print("📊 数据库数据统计")
print("="*50)

try:
    from database import engine, SessionLocal
    from models import Dataset, SpectralSample, User
    
    db = SessionLocal()
    
    # 查询用户数
    user_count = db.query(User).count()
    print(f"\n👥 用户数: {user_count}")
    
    # 查询数据集统计
    dataset_count = db.query(Dataset).count()
    total_samples = db.query(SpectralSample).count()
    
    print(f"\n📦 数据集统计:")
    print(f"   数据集数: {dataset_count}")
    print(f"   总样本数: {total_samples}")
    
    # 逐个数据集详情
    datasets = db.query(Dataset).all()
    print(f"\n   数据集详情:")
    for ds in datasets:
        samples_count = db.query(SpectralSample).filter(SpectralSample.dataset_id == ds.id).count()
        print(f"   - {ds.name}: {samples_count} 行数据")
    
    db.close()
    
except Exception as e:
    print(f"⚠️ 数据库查询出错: {e}")

print("\n" + "="*50)
print("💾 存储容量估算 (基于当前数据)")
print("="*50)

db_size = os.path.getsize(db_path) / 1024 / 1024 if os.path.exists(db_path) else 0
uploads_size = 0
if os.path.exists(uploads_dir):
    uploads_size = sum(os.path.getsize(os.path.join(r,f)) for r,d,fs in os.walk(uploads_dir) for f in fs) / 1024 / 1024

total = db_size + uploads_size
growth_factor = 50 * 600 / (6 * 600) if 6 * 600 > 0 else 1  # 50万/3600的增长倍数

print(f"\n当前存储使用:")
print(f"  数据库: {db_size:.2f} MB")
print(f"  上传文件: {uploads_size:.2f} MB")
print(f"  总计: {total:.2f} MB")

print(f"\n扩展到 50 万行数据的估算 (增长 {growth_factor:.1f} 倍):")
print(f"  数据库: {db_size * growth_factor:.2f} MB = {db_size * growth_factor / 1024:.2f} GB")
print(f"  上传文件: {uploads_size * growth_factor:.2f} MB = {uploads_size * growth_factor / 1024:.2f} GB")
print(f"  总计: {total * growth_factor:.2f} MB = {total * growth_factor / 1024:.2f} GB")

print(f"\n📌 Render 数据库套餐建议:")
print(f"  当前占用: < 1 GB (Basic-1gb 足够)")
print(f"  50万行: 约 {total * growth_factor / 1024:.1f} GB (Basic-4gb 推荐)")
