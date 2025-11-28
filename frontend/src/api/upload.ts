import api from './axios';

export const uploadApi = {
  uploadDatasetFile: async (datasetId: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataset_id', datasetId.toString());

    const response = await api.post('/api/upload/dataset', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadSamplesCSV: async (datasetId: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/upload/samples/${datasetId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadLabeledFile: async (datasetId: number, file: File, label: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('label', label);

    const response = await api.post(`/api/upload/labeled/${datasetId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
