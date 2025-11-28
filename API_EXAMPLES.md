# SpectraNet API Examples

This document provides examples of how to use the SpectraNet API programmatically.

## Authentication

### Register a New User

```python
import requests

url = "http://localhost:8000/api/auth/register"
data = {
    "username": "researcher1",
    "email": "researcher1@example.com",
    "password": "securepassword",
    "full_name": "Dr. Jane Smith",
    "institution": "University of Science"
}

response = requests.post(url, json=data)
print(response.json())
```

### Login and Get Token

```python
import requests

url = "http://localhost:8000/api/auth/login"
data = {
    "username": "researcher1",
    "password": "securepassword"
}

response = requests.post(url, data=data)
token_data = response.json()
access_token = token_data["access_token"]

# Use this token in subsequent requests
headers = {"Authorization": f"Bearer {access_token}"}
```

## Dataset Operations

### Get All Datasets

```python
import requests

url = "http://localhost:8000/api/datasets/"
params = {
    "skip": 0,
    "limit": 20,
    "search": "vegetation",
    "category_id": 1
}

response = requests.get(url, params=params)
datasets = response.json()
print(f"Found {len(datasets)} datasets")
```

### Get Dataset Details

```python
import requests

dataset_id = 1
url = f"http://localhost:8000/api/datasets/{dataset_id}"

response = requests.get(url)
dataset = response.json()
print(f"Dataset: {dataset['name']}")
print(f"Samples: {dataset['num_samples']}")
```

### Create a New Dataset

```python
import requests

url = "http://localhost:8000/api/datasets/"
headers = {"Authorization": f"Bearer {access_token}"}
data = {
    "name": "Agricultural Crop Spectra 2024",
    "description": "Spectral signatures of various agricultural crops",
    "category_id": 1,
    "spectral_type": "Hyperspectral",
    "wavelength_range": "400-2500",
    "wavelength_unit": "nm",
    "tags": ["agriculture", "crops", "hyperspectral"],
    "is_public": True
}

response = requests.post(url, json=data, headers=headers)
new_dataset = response.json()
print(f"Created dataset with ID: {new_dataset['id']}")
```

### Upload Spectral Samples from CSV

```python
import requests
import pandas as pd
import numpy as np

# Create sample data
wavelengths = np.arange(400, 701, 10)  # 400-700nm in 10nm steps
samples = []

for i in range(10):
    intensity = np.random.rand(len(wavelengths))
    samples.append(intensity)

df = pd.DataFrame(samples, columns=wavelengths)
df.insert(0, 'sample_name', [f'sample_{i}' for i in range(10)])

# Save to CSV
df.to_csv('spectral_samples.csv', index=False)

# Upload
dataset_id = new_dataset['id']
url = f"http://localhost:8000/api/upload/samples/{dataset_id}"
headers = {"Authorization": f"Bearer {access_token}"}

with open('spectral_samples.csv', 'rb') as f:
    files = {'file': f}
    response = requests.post(url, files=files, headers=headers)

print(response.json())
```

### Download Dataset

```python
import requests

dataset_id = 1
url = f"http://localhost:8000/api/datasets/{dataset_id}/download"

response = requests.post(url)
download_info = response.json()
print(f"Download URL: {download_info['download_url']}")
```

## Categories

### Get All Categories

```python
import requests

url = "http://localhost:8000/api/categories/"
response = requests.get(url)
categories = response.json()

for cat in categories:
    print(f"{cat['id']}: {cat['name']}")
```

## Statistics

### Get Platform Statistics

```python
import requests

url = "http://localhost:8000/api/stats/"
response = requests.get(url)
stats = response.json()

print(f"Total Datasets: {stats['total_datasets']}")
print(f"Total Samples: {stats['total_samples']}")
print(f"Total Downloads: {stats['total_downloads']}")

print("\nDatasets by Category:")
for category, count in stats['datasets_by_category'].items():
    print(f"  {category}: {count}")
```

### Get Trending Datasets

```python
import requests

url = "http://localhost:8000/api/stats/trending"
params = {"limit": 5}

response = requests.get(url, params=params)
trending = response.json()

print("Top 5 Trending Datasets:")
for i, dataset in enumerate(trending, 1):
    print(f"{i}. {dataset['name']} - {dataset['view_count']} views, {dataset['download_count']} downloads")
```

## Complete Workflow Example

```python
import requests
import pandas as pd
import numpy as np

# 1. Register and Login
def register_and_login():
    # Register
    register_url = "http://localhost:8000/api/auth/register"
    register_data = {
        "username": "spectral_researcher",
        "email": "researcher@example.com",
        "password": "MySecurePassword123",
        "full_name": "Dr. Spectral Researcher",
        "institution": "Research Institute"
    }
    requests.post(register_url, json=register_data)
    
    # Login
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "username": "spectral_researcher",
        "password": "MySecurePassword123"
    }
    response = requests.post(login_url, data=login_data)
    return response.json()["access_token"]

# 2. Create Dataset
def create_dataset(token):
    url = "http://localhost:8000/api/datasets/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "name": "My Spectral Dataset",
        "description": "A collection of spectral measurements",
        "spectral_type": "Visible",
        "wavelength_range": "400-700",
        "tags": ["test", "example"],
        "is_public": True
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# 3. Upload Samples
def upload_samples(token, dataset_id):
    # Create sample data
    wavelengths = np.arange(400, 701, 10)
    data = []
    for i in range(5):
        data.append([f"sample_{i}"] + list(np.random.rand(len(wavelengths))))
    
    df = pd.DataFrame(data, columns=['sample_name'] + list(wavelengths))
    df.to_csv('temp_samples.csv', index=False)
    
    url = f"http://localhost:8000/api/upload/samples/{dataset_id}"
    headers = {"Authorization": f"Bearer {token}"}
    
    with open('temp_samples.csv', 'rb') as f:
        files = {'file': f}
        response = requests.post(url, files=files, headers=headers)
    
    return response.json()

# Run the workflow
token = register_and_login()
print("✓ Logged in successfully")

dataset = create_dataset(token)
print(f"✓ Created dataset: {dataset['name']} (ID: {dataset['id']})")

upload_result = upload_samples(token, dataset['id'])
print(f"✓ Uploaded {upload_result['num_samples']} samples")

print("\n✓ Workflow completed successfully!")
```

## Error Handling

```python
import requests

def make_api_request(url, method='GET', **kwargs):
    try:
        if method == 'GET':
            response = requests.get(url, **kwargs)
        elif method == 'POST':
            response = requests.post(url, **kwargs)
        
        response.raise_for_status()
        return response.json()
    
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e}")
        print(f"Response: {e.response.json()}")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API server")
    except Exception as e:
        print(f"Error: {e}")

# Usage
data = make_api_request("http://localhost:8000/api/datasets/")
```

## Using with JavaScript/TypeScript

```javascript
// Login
async function login(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        body: formData
    });
    
    const data = await response.json();
    return data.access_token;
}

// Get Datasets
async function getDatasets(token) {
    const response = await fetch('http://localhost:8000/api/datasets/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return await response.json();
}

// Create Dataset
async function createDataset(token, datasetData) {
    const response = await fetch('http://localhost:8000/api/datasets/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datasetData)
    });
    
    return await response.json();
}
```
