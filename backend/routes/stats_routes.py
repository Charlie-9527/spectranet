from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Dataset, SpectralSample, Category, User
from schemas import DatasetStats

router = APIRouter(prefix="/api/stats", tags=["statistics"])


@router.get("/", response_model=DatasetStats)
def get_statistics(db: Session = Depends(get_db)):
    # Total datasets
    total_datasets = db.query(func.count(Dataset.id)).scalar()
    
    # Total samples
    total_samples = db.query(func.sum(Dataset.num_samples)).scalar() or 0
    
    # Total downloads
    total_downloads = db.query(func.sum(Dataset.download_count)).scalar() or 0
    
    # Datasets by category
    category_stats = db.query(
        Category.name,
        func.count(Dataset.id)
    ).join(Dataset).group_by(Category.name).all()
    
    datasets_by_category = {name: count for name, count in category_stats}
    
    # Datasets by spectral type
    type_stats = db.query(
        Dataset.spectral_type,
        func.count(Dataset.id)
    ).filter(Dataset.spectral_type.isnot(None)).group_by(Dataset.spectral_type).all()
    
    datasets_by_type = {stype: count for stype, count in type_stats if stype}
    
    return DatasetStats(
        total_datasets=total_datasets,
        total_samples=total_samples,
        total_downloads=total_downloads,
        datasets_by_category=datasets_by_category,
        datasets_by_type=datasets_by_type
    )


@router.get("/trending")
def get_trending_datasets(limit: int = 10, db: Session = Depends(get_db)):
    """Get most viewed/downloaded datasets"""
    trending = db.query(Dataset).filter(
        Dataset.is_public == True
    ).order_by(
        (Dataset.view_count + Dataset.download_count * 2).desc()
    ).limit(limit).all()
    
    return trending
