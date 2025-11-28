export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DATASETS: '/datasets',
  DATASET_DETAIL: '/datasets/:id',
  UPLOAD: '/upload',
  DASHBOARD: '/dashboard',
  STATISTICS: '/statistics',
  PROFILE: '/profile',
};

export const SPECTRAL_TYPES = [
  'Visible',
  'NIR',
  'Hyperspectral',
  'Multispectral',
  'Infrared',
  'UV-Vis',
  'Raman',
  'FTIR',
  'Other'
];

export const FILE_FORMATS = [
  'CSV',
  'Excel',
  'MAT',
  'HDF5',
  'NetCDF',
  'ENVI',
  'Other'
];
