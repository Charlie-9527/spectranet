from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None
    institution: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    institution: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Dataset Schemas
class DatasetBase(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    spectral_type: Optional[str] = None
    wavelength_range: Optional[str] = None
    wavelength_unit: str = "nm"
    num_bands: Optional[int] = None
    file_format: Optional[str] = None
    tags: Optional[List[str]] = []
    extra_metadata: Optional[Dict[str, Any]] = {}
    is_public: bool = True


class DatasetCreate(DatasetBase):
    pass


class DatasetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    spectral_type: Optional[str] = None
    wavelength_range: Optional[str] = None
    tags: Optional[List[str]] = None
    extra_metadata: Optional[Dict[str, Any]] = None
    is_public: Optional[bool] = None


class DatasetResponse(DatasetBase):
    id: int
    owner_id: int
    num_samples: int
    file_size: Optional[int] = None
    download_count: int
    view_count: int
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DatasetDetailResponse(DatasetResponse):
    owner: UserResponse
    category: Optional[CategoryResponse] = None
    
    class Config:
        from_attributes = True


# Spectral Sample Schemas
class SpectralSampleBase(BaseModel):
    sample_name: str
    sample_label: Optional[str] = None
    wavelengths: List[float]
    intensities: List[float]
    properties: Optional[Dict[str, Any]] = {}


class SpectralSampleCreate(SpectralSampleBase):
    dataset_id: int


class SpectralSampleResponse(SpectralSampleBase):
    id: int
    dataset_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Search and Filter
class DatasetFilter(BaseModel):
    search: Optional[str] = None
    category_id: Optional[int] = None
    spectral_type: Optional[str] = None
    tags: Optional[List[str]] = None
    min_samples: Optional[int] = None
    max_samples: Optional[int] = None
    is_verified: Optional[bool] = None
    owner_id: Optional[int] = None


# Statistics
class DatasetStats(BaseModel):
    total_datasets: int
    total_samples: int
    total_downloads: int
    datasets_by_category: Dict[str, int]
    datasets_by_type: Dict[str, int]
