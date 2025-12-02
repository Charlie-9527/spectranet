import api from './axios';
import type { Category } from '../types';

interface CategoryNode {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  children: CategoryNode[];
}

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/api/categories/');
    return response.data;
  },

  getCategoryTree: async (): Promise<CategoryNode[]> => {
    const response = await api.get<CategoryNode[]>('/api/categories/tree');
    return response.data;
  },

  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/api/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await api.post<Category>('/api/categories/', data);
    return response.data;
  },
};
