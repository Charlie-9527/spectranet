import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { datasetApi } from '../api/datasets';
import { uploadApi } from '../api/upload';
import { categoryApi } from '../api/categories';
import { Upload as UploadIcon, FileText, CheckCircle } from 'lucide-react';
import MultiFileUpload from '../components/MultiFileUpload';
import type { Category } from '../types';

interface FileWithLabel {
  id: string;
  file: File;
  label: string;
}

export default function Upload() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [step, setStep] = useState(1);
  const [datasetId, setDatasetId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    spectral_type: '',
    wavelength_range: '',
    wavelength_unit: 'nm',
    file_format: 'CSV',
    tags: '',
    is_public: true,
  });

  const [dataFile, setDataFile] = useState<File | null>(null);
  const [samplesFile, setSamplesFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<FileWithLabel[]>([]);
  const [uploadMode, setUploadMode] = useState<'single' | 'multiple'>('single');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCategories();
  }, [isAuthenticated]);

  const loadCategories = async () => {
    const cats = await categoryApi.getCategories();
    setCategories(cats);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
      
      const dataset = await datasetApi.createDataset({
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id ? Number(formData.category_id) : undefined,
        spectral_type: formData.spectral_type || undefined,
        wavelength_range: formData.wavelength_range || undefined,
        wavelength_unit: formData.wavelength_unit,
        file_format: formData.file_format,
        tags,
        is_public: formData.is_public,
      });

      console.log('Dataset created:', dataset); // 添加日志
      setDatasetId(dataset.id);
      setStep(2);
    } catch (err: any) {
      console.error('Create dataset error:', err); // 添加错误日志
      setError(err.response?.data?.detail || 'Failed to create dataset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetId) {
      setError('数据集 ID 丢失，请重新创建数据集');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Uploading files for dataset:', datasetId); // 添加日志
      
      if (uploadMode === 'single') {
        // 单文件上传模式
        if (dataFile) {
          await uploadApi.uploadDatasetFile(datasetId, dataFile);
        }
        if (samplesFile) {
          await uploadApi.uploadSamplesCSV(datasetId, samplesFile);
        }
      } else {
        // 多文件上传模式
        for (const fileItem of multipleFiles) {
          if (!fileItem.label) {
            setError('请为所有文件指定标签');
            setIsLoading(false);
            return;
          }
          // 上传文件并与标签关联
          console.log(`Uploading file: ${fileItem.file.name} with label: ${fileItem.label}`);
          await uploadApi.uploadLabeledFile(datasetId, fileItem.file, fileItem.label);
        }
      }

      console.log('Upload completed successfully'); // 添加日志
      setStep(3);
    } catch (err: any) {
      console.error('Upload error:', err); // 添加错误日志
      setError(err.response?.data?.detail || 'Failed to upload files');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">上传数据集</h1>
          <p className="text-gray-600">与社区分享您的光谱数据</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">数据集信息</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div className={`h-full ${step >= 2 ? 'bg-primary-600' : ''}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">上传文件</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div className={`h-full ${step >= 3 ? 'bg-primary-600' : ''}`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 font-medium">完成</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Dataset Information */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">数据集信息</h2>
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  数据集名称 *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="例如：植被光谱库 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="描述您的数据集..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分类
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    光谱类型
                  </label>
                  <select
                    name="spectral_type"
                    value={formData.spectral_type}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">选择类型</option>
                    <option value="Visible">可见光</option>
                    <option value="NIR">近红外</option>
                    <option value="Hyperspectral">高光谱</option>
                    <option value="Multispectral">多光谱</option>
                    <option value="Infrared">红外</option>
                    <option value="UV-Vis">紫外可见</option>
                    <option value="Raman">拉曼</option>
                    <option value="FTIR">傅里叶变换红外</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    波长范围
                  </label>
                  <input
                    type="text"
                    name="wavelength_range"
                    value={formData.wavelength_range}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="例如：400-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    波长单位
                  </label>
                  <select
                    name="wavelength_unit"
                    value={formData.wavelength_unit}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="nm">nm (纳米)</option>
                    <option value="um">μm (微米)</option>
                    <option value="cm-1">cm⁻¹ (波数)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="例如：植被, 遥感, 农业"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  公开此数据集
                </label>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
                  {isLoading ? '创建中...' : '下一步'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: File Upload */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">上传文件</h2>
            
            {/* 上传模式切换 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                上传模式
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setUploadMode('single')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    uploadMode === 'single'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  单文件上传
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('multiple')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    uploadMode === 'multiple'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  多文件批量上传
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {uploadMode === 'single'
                  ? '适用于上传单个数据集文件'
                  : '适用于批量上传多个 CSV 文件，每个文件对应不同的样本标签'}
              </p>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-6">
              {uploadMode === 'single' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      数据集文件（可选）
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <input
                        type="file"
                        onChange={(e) => setDataFile(e.target.files?.[0] || null)}
                        className="mt-4"
                        accept=".csv,.xlsx,.mat,.hdf5,.nc"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        上传您的完整数据集文件
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      样本 CSV（可选）
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <input
                        type="file"
                        onChange={(e) => setSamplesFile(e.target.files?.[0] || null)}
                        className="mt-4"
                        accept=".csv"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        CSV 格式：波长为列，样本为行
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    批量上传 CSV 文件
                  </label>
                  <MultiFileUpload
                    onFilesChange={setMultipleFiles}
                    availableLabels={['醉酸', '棉', '亚麻', '素缎', '聚酯', '蚕丝', '羊毛']}
                  />
                </div>
              )}

              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                  返回
                </button>
                <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
                  {isLoading ? '上传中...' : '上传文件'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">数据集上传成功！</h2>
            <p className="text-gray-600 mb-6">
              您的数据集已创建，现已对社区开放。
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  console.log('Navigating to dataset:', datasetId); // 添加日志
                  navigate(`/datasets/${datasetId}`);
                }}
                className="btn-primary"
              >
                查看数据集
              </button>
              <button
                onClick={() => navigate('/datasets')}
                className="btn-secondary"
              >
                浏览数据集
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
