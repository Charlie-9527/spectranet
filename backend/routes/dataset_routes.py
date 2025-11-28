from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
import io
import csv
from urllib.parse import quote
from database import get_db
from models import Dataset, User, Category, SpectralSample
from schemas import (
    DatasetCreate, DatasetUpdate, DatasetResponse, 
    DatasetDetailResponse, DatasetFilter, DatasetStats,
    SpectralSampleResponse
)
from auth import get_current_active_user

router = APIRouter(prefix="/api/datasets", tags=["datasets"])


@router.get("/", response_model=List[DatasetResponse])
def get_datasets(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    spectral_type: Optional[str] = None,
    is_verified: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Dataset).filter(Dataset.is_public == True)
    
    if search:
        query = query.filter(
            or_(
                Dataset.name.contains(search),
                Dataset.description.contains(search)
            )
        )
    
    if category_id:
        query = query.filter(Dataset.category_id == category_id)
    
    if spectral_type:
        query = query.filter(Dataset.spectral_type == spectral_type)
    
    if is_verified is not None:
        query = query.filter(Dataset.is_verified == is_verified)
    
    datasets = query.offset(skip).limit(limit).all()
    return datasets


@router.get("/{dataset_id}", response_model=DatasetDetailResponse)
def get_dataset(dataset_id: int, db: Session = Depends(get_db)):
    print(f"\n=== GET DATASET {dataset_id} ===")
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    print(f"Dataset found: {dataset is not None}")
    if not dataset:
        print(f"Dataset {dataset_id} not found in database")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    print(f"Dataset name: {dataset.name}")
    print(f"Dataset owner_id: {dataset.owner_id}")
    print(f"Dataset category_id: {dataset.category_id}")
    
    # 确保加载 owner 和 category 关系
    if dataset.owner:
        _ = dataset.owner.username  # 触发加载
        print(f"Owner loaded: {dataset.owner.username}")
    if dataset.category:
        _ = dataset.category.name  # 触发加载
        print(f"Category loaded: {dataset.category.name}")
    
    # Increment view count
    dataset.view_count += 1
    db.commit()
    print(f"Returning dataset {dataset_id}")
    
    return dataset


@router.post("/", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
def create_dataset(
    dataset_data: DatasetCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Validate category if provided
    if dataset_data.category_id:
        category = db.query(Category).filter(Category.id == dataset_data.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
    
    db_dataset = Dataset(
        **dataset_data.dict(),
        owner_id=current_user.id
    )
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset


@router.put("/{dataset_id}", response_model=DatasetResponse)
def update_dataset(
    dataset_id: int,
    dataset_data: DatasetUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Check ownership
    if dataset.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Update fields
    update_data = dataset_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(dataset, field, value)
    
    db.commit()
    db.refresh(dataset)
    return dataset


@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dataset(
    dataset_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Check ownership
    if dataset.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db.delete(dataset)
    db.commit()
    return None


@router.get("/{dataset_id}/samples", response_model=List[SpectralSampleResponse])
def get_dataset_samples(
    dataset_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    samples = db.query(SpectralSample).filter(
        SpectralSample.dataset_id == dataset_id
    ).offset(skip).limit(limit).all()
    
    return samples


@router.get("/{dataset_id}/download")
def download_dataset(
    dataset_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    下载数据集为CSV格式
    如果数据集有样本数据，导出为CSV；否则返回原始文件路径
    需要用户登录
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # 获取数据集的所有样本
    samples = db.query(SpectralSample).filter(
        SpectralSample.dataset_id == dataset_id
    ).all()
    
    if samples:
        # 导出样本数据为CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # 写入表头 (波长)
        if samples[0].wavelengths:
            header = ['sample_name', 'label'] + [str(w) for w in samples[0].wavelengths]
            writer.writerow(header)
        
        # 写入每个样本的数据
        for sample in samples:
            row = [
                sample.sample_name or f'sample_{sample.id}',
                sample.sample_label or ''
            ] + sample.intensities
            writer.writerow(row)
        
        # 增加下载计数
        dataset.download_count += 1
        db.commit()
        
        # URL编码文件名以支持中文
        encoded_filename = quote(f"{dataset.name}.csv")
        
        # 返回CSV文件
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode('utf-8-sig')),  # 使用 UTF-8 BOM 以便 Excel 正确识别中文
            media_type='text/csv',
            headers={
                'Content-Disposition': f'attachment; filename*=UTF-8\'\'\'{encoded_filename}'
            }
        )
    
    # 如果没有样本但有原始文件
    elif dataset.file_path:
        dataset.download_count += 1
        db.commit()
        
        return {
            "download_url": f"/uploads/{dataset.file_path}",
            "file_name": dataset.name,
            "file_size": dataset.file_size
        }
    
    # 既没有样本也没有文件
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="该数据集没有可下载的数据"
        )
