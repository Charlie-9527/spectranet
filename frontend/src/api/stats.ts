import api from './axios';
import type { DatasetStats, Dataset } from '../types';

export const statsApi = {
  getStatistics: async (): Promise<DatasetStats> => {
    const response = await api.get<DatasetStats>('/api/stats/');
    return response.data;
  },

  getTrending: async (limit = 10): Promise<Dataset[]> => {
    const response = await api.get<Dataset[]>('/api/stats/trending', {
      params: { limit },
    });
    return response.data;
  },
};
