import api from './axios';
import type { Dataset, DatasetDetail, SpectralSample } from '../types';

export interface DatasetFilters {
  skip?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  spectral_type?: string;
  is_verified?: boolean;
}

export const datasetApi = {
  getDatasets: async (filters: DatasetFilters = {}): Promise<Dataset[]> => {
    const response = await api.get<Dataset[]>('/api/datasets/', { params: filters });
    return response.data;
  },

  getDataset: async (id: number): Promise<DatasetDetail> => {
    const response = await api.get<DatasetDetail>(`/api/datasets/${id}`);
    return response.data;
  },

  createDataset: async (data: Partial<Dataset>): Promise<Dataset> => {
    const response = await api.post<Dataset>('/api/datasets/', data);
    return response.data;
  },

  updateDataset: async (id: number, data: Partial<Dataset>): Promise<Dataset> => {
    const response = await api.put<Dataset>(`/api/datasets/${id}`, data);
    return response.data;
  },

  deleteDataset: async (id: number): Promise<void> => {
    await api.delete(`/api/datasets/${id}`);
  },

  getSamples: async (datasetId: number, skip = 0, limit = 100): Promise<SpectralSample[]> => {
    const response = await api.get<SpectralSample[]>(`/api/datasets/${datasetId}/samples`, {
      params: { skip, limit },
    });
    return response.data;
  },

  downloadDataset: async (id: number): Promise<any> => {
    const response = await api.post(`/api/datasets/${id}/download`);
    return response.data;
  },
};
