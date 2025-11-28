from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    institution = Column(String(200))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    datasets = relationship("Dataset", back_populates="owner")
    

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    parent = relationship("Category", remote_side=[id], backref="subcategories")
    datasets = relationship("Dataset", back_populates="category")


class Dataset(Base):
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    category_id = Column(Integer, ForeignKey("categories.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Spectral data metadata
    spectral_type = Column(String(50))  # e.g., 'visible', 'NIR', 'hyperspectral'
    wavelength_range = Column(String(100))  # e.g., '400-700nm'
    wavelength_unit = Column(String(20), default='nm')
    num_samples = Column(Integer, default=0)
    num_bands = Column(Integer)  # Number of spectral bands
    
    # File information
    file_format = Column(String(50))  # e.g., 'csv', 'mat', 'hdf5'
    file_size = Column(Integer)  # in bytes
    file_path = Column(String(500))
    
    # Additional metadata
    tags = Column(JSON)  # Array of tags
    extra_metadata = Column(JSON)  # Additional flexible metadata
    
    # Statistics
    download_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    
    # Status
    is_public = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("Category", back_populates="datasets")
    owner = relationship("User", back_populates="datasets")
    samples = relationship("SpectralSample", back_populates="dataset", cascade="all, delete-orphan")


class SpectralSample(Base):
    __tablename__ = "spectral_samples"
    
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    
    sample_name = Column(String(200))
    sample_label = Column(String(100))  # Classification label
    
    # Spectral data (stored as JSON array or reference to file)
    wavelengths = Column(JSON)  # Array of wavelength values
    intensities = Column(JSON)  # Array of intensity/reflectance values
    
    # Additional properties
    properties = Column(JSON)  # Any additional sample properties
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    dataset = relationship("Dataset", back_populates="samples")
