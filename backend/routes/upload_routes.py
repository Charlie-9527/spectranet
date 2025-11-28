from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import Optional, List
import os
import json
import shutil
import csv
import pandas as pd
import numpy as np
from datetime import datetime
from database import get_db
from models import Dataset, User, SpectralSample
from auth import get_current_active_user
from config import settings

router = APIRouter(prefix="/api/upload", tags=["upload"])


def ensure_upload_dir():
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR)


@router.post("/dataset")
async def upload_dataset(
    file: UploadFile = File(...),
    dataset_id: int = Form(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get dataset
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
    
    ensure_upload_dir()
    
    # Create unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"dataset_{dataset_id}_{timestamp}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = os.path.getsize(file_path)
        
        # Check file size
        if file_size > settings.MAX_UPLOAD_SIZE:
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE} bytes"
            )
        
        # Update dataset
        dataset.file_path = unique_filename
        dataset.file_size = file_size
        dataset.file_format = file_extension.lstrip('.')
        
        # Try to parse file and extract samples (for CSV format)
        if file_extension.lower() == '.csv':
            try:
                with open(file_path, 'r') as f:
                    reader = csv.reader(f)
                    rows = list(reader)
                    dataset.num_samples = len(rows) - 1  # Exclude header
            except Exception as e:
                print(f"Could not parse CSV: {e}")
        
        db.commit()
        db.refresh(dataset)
        
        return {
            "message": "File uploaded successfully",
            "file_path": unique_filename,
            "file_size": file_size,
            "dataset_id": dataset.id
        }
    
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )


@router.post("/samples/{dataset_id}")
async def upload_samples_csv(
    dataset_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Upload spectral samples from CSV file.
    Expected format: columns are wavelengths, rows are samples
    First column can be 'sample_name' or 'label'
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    if dataset.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    try:
        # Read CSV using standard library
        content = await file.read()
        lines = content.decode('utf-8').splitlines()
        reader = csv.reader(lines)
        rows = list(reader)
        
        if len(rows) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CSV file must have at least header and one data row"
            )
        
        header = rows[0]
        data_rows = rows[1:]
        
        # Identify label/name column
        label_col_idx = None
        if 'sample_name' in header:
            label_col_idx = header.index('sample_name')
        elif 'label' in header:
            label_col_idx = header.index('label')
        elif 'name' in header:
            label_col_idx = header.index('name')
        
        # Get wavelength columns
        if label_col_idx is not None:
            wavelength_cols = [i for i in range(len(header)) if i != label_col_idx]
        else:
            wavelength_cols = list(range(len(header)))
        
        # Convert wavelengths to float
        try:
            wavelengths = [float(header[i]) for i in wavelength_cols]
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Column headers (except label columns) must be numeric wavelengths"
            )
        
        # Create samples
        samples_created = 0
        for idx, row in enumerate(data_rows):
            if label_col_idx is not None:
                sample_name = row[label_col_idx]
                intensities = [float(row[i]) for i in wavelength_cols]
            else:
                sample_name = f"sample_{idx}"
                intensities = [float(val) for val in row]
            
            sample = SpectralSample(
                dataset_id=dataset_id,
                sample_name=sample_name,
                sample_label=sample_name if label_col_idx is not None else None,
                wavelengths=wavelengths,
                intensities=intensities
            )
            db.add(sample)
            samples_created += 1
        
        # Update dataset
        dataset.num_samples = samples_created
        dataset.num_bands = len(wavelengths)
        
        db.commit()
        
        return {
            "message": f"Successfully uploaded {samples_created} samples",
            "num_samples": samples_created,
            "num_bands": len(wavelengths)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process CSV: {str(e)}"
        )


@router.post("/labeled/{dataset_id}")
async def upload_labeled_file(
    dataset_id: int,
    file: UploadFile = File(...),
    label: str = Form(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Upload CSV file with samples labeled with a specific label.
    All samples in this file will be assigned the given label.
    """
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    if dataset.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    try:
        # Read CSV
        content = await file.read()
        lines = content.decode('utf-8').splitlines()
        reader = csv.reader(lines)
        rows = list(reader)
        
        if len(rows) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CSV file must have at least header and one data row"
            )
        
        header = rows[0]
        data_rows = rows[1:]
        
        # Assume all columns are wavelengths (no sample_name column)
        try:
            wavelengths = [float(h) for h in header]
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="All column headers must be numeric wavelengths"
            )
        
        # Create samples
        samples_created = 0
        for idx, row in enumerate(data_rows):
            try:
                intensities = [float(val) for val in row]
                
                if len(intensities) != len(wavelengths):
                    continue  # Skip invalid rows
                
                sample = SpectralSample(
                    dataset_id=dataset_id,
                    sample_name=f"{label}_{idx+1}",
                    sample_label=label,
                    wavelengths=wavelengths,
                    intensities=intensities
                )
                db.add(sample)
                samples_created += 1
            except Exception as e:
                print(f"Skipping row {idx}: {e}")
                continue
        
        # Update dataset statistics
        total_samples = db.query(SpectralSample).filter(
            SpectralSample.dataset_id == dataset_id
        ).count()
        dataset.num_samples = total_samples
        dataset.num_bands = len(wavelengths)
        
        db.commit()
        
        return {
            "message": f"Successfully uploaded {samples_created} samples with label '{label}'",
            "num_samples": samples_created,
            "label": label,
            "total_dataset_samples": total_samples
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process labeled file: {str(e)}"
        )
