import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatasetStore } from '../store/datasetStore';
import { useAuthStore } from '../store/authStore';
import { datasetApi } from '../api/datasets';
import { Download, Eye, Calendar, User, Tag } from 'lucide-react';
import SpectralChart from '../components/SpectralChart';
import type { SpectralSample } from '../types';

export default function DatasetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDataset, isLoading, fetchDataset } = useDatasetStore();
  const { isAuthenticated } = useAuthStore();
  const [samples, setSamples] = useState<SpectralSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<SpectralSample | null>(null);

  useEffect(() => {
    if (id) {
      fetchDataset(Number(id));
      loadSamples();
    }
  }, [id]);

  const loadSamples = async () => {
    if (!id) return;
    try {
      const data = await datasetApi.getSamples(Number(id), 0, 10);
      setSamples(data);
      if (data.length > 0) {
        setSelectedSample(data[0]);
      }
    } catch (error) {
      console.error('Failed to load samples:', error);
    }
  };

  const handleDownload = async () => {
    if (!id) return;
    
    // 检查是否登录
    if (!isAuthenticated) {
      alert('请先登录后再下载数据集');
      navigate('/login');
      return;
    }
    
    try {
      // 获取 token
      const token = localStorage.getItem('access_token');
      
      // 使用 fetch 下载文件，携带认证 token
      const response = await fetch(`http://localhost:8000/api/datasets/${id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          alert('登录已过期，请重新登录');
          navigate('/login');
          return;
        }
        throw new Error('下载失败');
      }
      
      // 获取文件内容
      const blob = await response.blob();
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentDataset?.name || 'dataset'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败，请稍后重试');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading dataset...</p>
        </div>
      </div>
    );
  }

  if (!currentDataset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Dataset not found</p>
          <button onClick={() => navigate('/datasets')} className="mt-4 btn-primary">
            Back to Datasets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentDataset.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{currentDataset.owner.username}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(currentDataset.created_at).toLocaleDateString()}</span>
                </div>
                {currentDataset.is_verified && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <button onClick={handleDownload} className="btn-primary flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Download</span>
            </button>
          </div>

          <p className="text-gray-700 mb-4">{currentDataset.description}</p>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Spectral Type</p>
              <p className="font-medium">{currentDataset.spectral_type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Wavelength Range</p>
              <p className="font-medium">{currentDataset.wavelength_range || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Samples</p>
              <p className="font-medium">{currentDataset.num_samples.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bands</p>
              <p className="font-medium">{currentDataset.num_bands || 'N/A'}</p>
            </div>
          </div>

          {/* Tags */}
          {currentDataset.tags && currentDataset.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center space-x-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-500" />
                {currentDataset.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-4 pt-4 border-t flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{currentDataset.view_count} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="h-4 w-4" />
              <span>{currentDataset.download_count} downloads</span>
            </div>
          </div>
        </div>

        {/* Spectral Visualization */}
        {samples.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Spectral Visualization</h2>
            
            {selectedSample && (
              <div className="mb-4">
                <SpectralChart
                  wavelengths={selectedSample.wavelengths}
                  intensities={selectedSample.intensities}
                  label={selectedSample.sample_name}
                />
              </div>
            )}

            {/* Sample Selection */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Sample Spectra (Showing first 10)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {samples.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => setSelectedSample(sample)}
                    className={`px-3 py-2 text-sm rounded border transition-colors ${
                      selectedSample?.id === sample.id
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                    }`}
                  >
                    {sample.sample_name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dataset Information</h2>
          
          <div className="space-y-4">
            {currentDataset.category && (
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-gray-900">{currentDataset.category.name}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-500">File Format</p>
              <p className="text-gray-900">{currentDataset.file_format || 'N/A'}</p>
            </div>

            {currentDataset.file_size && (
              <div>
                <p className="text-sm font-medium text-gray-500">File Size</p>
                <p className="text-gray-900">
                  {(currentDataset.file_size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-gray-900">
                {new Date(currentDataset.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
