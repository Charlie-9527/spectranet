import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDatasetStore } from '../store/datasetStore';
import { Search, Filter, Download, Eye } from 'lucide-react';
import CategoryTree from '../components/CategoryTree';

export default function Datasets() {
  const { datasets, isLoading, fetchDatasets } = useDatasetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('全部分类');
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchDatasets();
  };

  const handleSearch = () => {
    fetchDatasets({
      search: searchTerm || undefined,
      category_id: selectedCategory || undefined,
      spectral_type: selectedType || undefined,
    });
  };

  const handleCategorySelect = (categoryId: number | null, categoryName: string) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
    // 自动触发搜索
    fetchDatasets({
      search: searchTerm || undefined,
      category_id: categoryId || undefined,
      spectral_type: selectedType || undefined,
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedCategoryName('全部分类');
    setSelectedType('');
    fetchDatasets();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">浏览数据集</h1>
          <p className="text-gray-600">探索我们的光谱数据集合</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 左侧：分类树 */}
        <div className="lg:col-span-1">
          <CategoryTree
            onSelectCategory={handleCategorySelect}
            selectedCategoryId={selectedCategory}
          />
        </div>

        {/* 右侧：搜索和数据集列表 */}
        <div className="lg:col-span-3">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCategoryName}
                </h2>
                <span className="text-sm text-gray-500">
                  共 {datasets.length} 个数据集
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搜索
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索数据集..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="input-field pl-10"
                  />
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  光谱类型
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="input-field"
                >
                  <option value="">所有类型</option>
                  <option value="Visible">可见光</option>
                  <option value="NIR">近红外</option>
                  <option value="Hyperspectral">高光谱</option>
                  <option value="Multispectral">多光谱</option>
                  <option value="Infrared">红外</option>
                  <option value="Raman">拉曼</option>
                  <option value="FTIR">傅里叶红外</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              <button onClick={handleSearch} className="btn-primary flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>应用筛选</span>
              </button>
              <button onClick={handleReset} className="btn-secondary">
                重置
              </button>
            </div>
          </div>

          {/* Datasets Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          ) : datasets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">未找到数据集</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datasets.map((dataset) => (
                <Link
                  key={dataset.id}
                  to={`/datasets/${dataset.id}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {dataset.name}
                    </h3>
                    {dataset.is_verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        已验证
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {dataset.description || '暂无描述'}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    {dataset.spectral_type && (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">类型:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {dataset.spectral_type}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <span className="font-medium mr-2">样本数:</span>
                      <span>{dataset.num_samples.toLocaleString()}</span>
                    </div>

                    {dataset.wavelength_range && (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">波段范围:</span>
                        <span>{dataset.wavelength_range}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 pt-2 border-t">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{dataset.view_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{dataset.download_count}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
