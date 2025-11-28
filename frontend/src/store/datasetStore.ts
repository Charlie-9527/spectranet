import { create } from 'zustand';
import { datasetApi } from '../api/datasets';
import type { Dataset, DatasetDetail } from '../types';

interface DatasetState {
  datasets: Dataset[];
  currentDataset: DatasetDetail | null;
  isLoading: boolean;
  error: string | null;
  fetchDatasets: (filters?: any) => Promise<void>;
  fetchDataset: (id: number) => Promise<void>;
  clearCurrentDataset: () => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  datasets: [],
  currentDataset: null,
  isLoading: false,
  error: null,

  fetchDatasets: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const datasets = await datasetApi.getDatasets(filters);
      set({ datasets, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load datasets', 
        isLoading: false 
      });
    }
  },

  fetchDataset: async (id: number) => {
    console.log('\n=== FETCHING DATASET ===');
    console.log('Dataset ID:', id);
    set({ isLoading: true, error: null });
    try {
      console.log('Making API call to /api/datasets/' + id);
      const dataset = await datasetApi.getDataset(id);
      console.log('Dataset received:', dataset);
      set({ currentDataset: dataset, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching dataset:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      set({ 
        error: error.response?.data?.detail || 'Failed to load dataset', 
        isLoading: false 
      });
    }
  },

  clearCurrentDataset: () => set({ currentDataset: null }),
}));
