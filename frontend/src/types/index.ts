export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  institution?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  created_at: string;
}

export interface Dataset {
  id: number;
  name: string;
  description?: string;
  category_id?: number;
  owner_id: number;
  spectral_type?: string;
  wavelength_range?: string;
  wavelength_unit: string;
  num_samples: number;
  num_bands?: number;
  file_format?: string;
  file_size?: number;
  tags?: string[];
  metadata?: Record<string, any>;
  download_count: number;
  view_count: number;
  is_public: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatasetDetail extends Dataset {
  owner: User;
  category?: Category;
}

export interface SpectralSample {
  id: number;
  dataset_id: number;
  sample_name: string;
  sample_label?: string;
  wavelengths: number[];
  intensities: number[];
  properties?: Record<string, any>;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  institution?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface DatasetStats {
  total_datasets: number;
  total_samples: number;
  total_downloads: number;
  datasets_by_category: Record<string, number>;
  datasets_by_type: Record<string, number>;
}
