import { useState } from 'react';
import { X, Upload, FileText, Plus } from 'lucide-react';

interface FileWithLabel {
  id: string;
  file: File;
  label: string;
}

interface MultiFileUploadProps {
  onFilesChange: (files: FileWithLabel[]) => void;
  availableLabels?: string[];
}

export default function MultiFileUpload({ onFilesChange, availableLabels = [] }: MultiFileUploadProps) {
  const [files, setFiles] = useState<FileWithLabel[]>([]);

  const addFile = (file: File) => {
    const newFile: FileWithLabel = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      label: '',
    };
    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const updateLabel = (id: string, label: string) => {
    const updatedFiles = files.map(f => 
      f.id === id ? { ...f, label } : f
    );
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(file => addFile(file));
    e.target.value = ''; // 重置 input
  };

  return (
    <div className="space-y-4">
      {/* 文件上传区域 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <label className="mt-4 inline-block cursor-pointer">
          <span className="btn-primary">
            <Plus className="inline-block w-4 h-4 mr-2" />
            选择 CSV 文件
          </span>
          <input
            type="file"
            multiple
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
        <p className="mt-2 text-sm text-gray-500">
          支持批量上传多个 CSV 文件
        </p>
      </div>

      {/* 已选文件列表 */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            已选择 {files.length} 个文件
          </h3>
          
          {files.map((fileItem) => (
            <div 
              key={fileItem.id} 
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileItem.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileItem.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(fileItem.id)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                  title="删除文件"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  样本标签 *
                </label>
                {availableLabels.length > 0 ? (
                  <select
                    value={fileItem.label}
                    onChange={(e) => updateLabel(fileItem.id, e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">选择标签</option>
                    {availableLabels.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={fileItem.label}
                    onChange={(e) => updateLabel(fileItem.id, e.target.value)}
                    className="input-field"
                    placeholder="例如：醋酸、棉、亚麻..."
                    required
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 提示：每个文件将被标记为对应的标签，CSV 格式应为：波长作为列，样本作为行
          </p>
        </div>
      )}
    </div>
  );
}
