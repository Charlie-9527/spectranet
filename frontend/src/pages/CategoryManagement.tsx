import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FolderPlus, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import api from '../api/axios';

interface Category {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  children?: Category[];
}

export default function CategoryManagement() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: null as number | null
  });
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  
  // 级联选择器状态
  const [selectedLevel1, setSelectedLevel1] = useState<number | null>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<number | null>(null);
  const [level2Options, setLevel2Options] = useState<Category[]>([]);
  const [level3Options, setLevel3Options] = useState<Category[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!user?.is_superuser) {
      alert('仅超级管理员可以访问此页面');
      navigate('/');
      return;
    }
    loadCategories();
  }, [isAuthenticated, user]);

  const loadCategories = async () => {
    try {
      const response = await api.get<Category[]>('/api/categories/tree');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/categories/${editingId}`, formData);
      } else {
        await api.post('/api/categories/', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', parent_id: null });
      loadCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('保存失败，请重试');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return;
    
    try {
      await api.delete(`/api/categories/${id}`);
      loadCategories();
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert('删除失败，请重试');
      }
    }
  };

  // 处理一级分类选择
  const handleLevel1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setSelectedLevel1(value);
    setSelectedLevel2(null);
    setFormData({ ...formData, parent_id: value });
    
    if (value) {
      const selected = categories.find(cat => cat.id === value);
      if (selected && selected.children && selected.children.length > 0) {
        setLevel2Options(selected.children);
        setLevel3Options([]);
        // 有子分类，但保持 parent_id 为当前选择，用户可以继续选择或直接保存
      } else {
        // 如果是叶子节点，直接设置 parent_id
        setLevel2Options([]);
        setLevel3Options([]);
      }
    } else {
      setLevel2Options([]);
      setLevel3Options([]);
    }
  };

  // 处理二级分类选择
  const handleLevel2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setSelectedLevel2(value);
    setFormData({ ...formData, parent_id: value });
    
    if (value) {
      const selected = level2Options.find(cat => cat.id === value);
      if (selected && selected.children && selected.children.length > 0) {
        setLevel3Options(selected.children);
        // 有子分类，但保持 parent_id 为当前选择，用户可以继续选择或直接保存
      } else {
        // 如果是叶子节点，直接设置 parent_id
        setLevel3Options([]);
      }
    } else {
      setLevel3Options([]);
    }
  };

  // 处理三级分类选择
  const handleLevel3Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setFormData({ ...formData, parent_id: value });
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);

    return (
      <div key={category.id} className="mb-2">
        <div
          className={`flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 border border-gray-200`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          <div className="flex items-center space-x-2 flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-4" />}
            <div>
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(category)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {category.children!.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getAllCategories = (cats: Category[], result: Category[] = []): Category[] => {
    cats.forEach(cat => {
      result.push(cat);
      if (cat.children) {
        getAllCategories(cat.children, result);
      }
    });
    return result;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">分类管理</h1>
            <p className="text-gray-600">管理数据集分类体系</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ name: '', description: '', parent_id: null });
              // 重置级联选择器
              setSelectedLevel1(null);
              setSelectedLevel2(null);
              setLevel2Options([]);
              setLevel3Options([]);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FolderPlus className="h-5 w-5" />
            <span>添加分类</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? '编辑分类' : '添加新分类'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  父分类
                </label>
                <div className="space-y-3">
                  {/* 一级分类 */}
                  <select
                    value={selectedLevel1 || ''}
                    onChange={handleLevel1Change}
                    className="input-field"
                  >
                    <option value="">无（顶级分类）</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} disabled={cat.id === editingId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  {/* 二级分类（条件渲染）*/}
                  {level2Options.length > 0 && (
                    <select
                      value={selectedLevel2 || ''}
                      onChange={handleLevel2Change}
                      className="input-field"
                    >
                      <option value="">选择二级分类（或直接使用一级）</option>
                      {level2Options.map((cat) => (
                        <option key={cat.id} value={cat.id} disabled={cat.id === editingId}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* 三级分类（条件渲染）*/}
                  {level3Options.length > 0 && (
                    <select
                      value={formData.parent_id || ''}
                      onChange={handleLevel3Change}
                      className="input-field"
                    >
                      <option value="">选择三级分类（或直接使用二级）</option>
                      {level3Options.map((cat) => (
                        <option key={cat.id} value={cat.id} disabled={cat.id === editingId}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', description: '', parent_id: null });
                    // 重置级联选择器
                    setSelectedLevel1(null);
                    setSelectedLevel2(null);
                    setLevel2Options([]);
                    setLevel3Options([]);
                  }}
                  className="btn-secondary"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-2">
          {categories.map((category) => renderCategory(category))}
        </div>
      </div>
    </div>
  );
}
