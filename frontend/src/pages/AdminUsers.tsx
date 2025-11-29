import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { UserPlus, Trash2, Users } from 'lucide-react';
import axios from 'axios';
import type { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AdminUsers() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    institution: '',
    is_admin: false,
    is_superuser: false
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // 加载用户列表
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get<User[]>(
        `${API_URL}/api/auth/admin/users`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setUsers(response.data);
    } catch (error: any) {
      console.error('加载用户列表失败:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // 删除用户
  const handleDelete = async (userId: number, username: string) => {
    if (!confirm(`确定要删除用户 "${username}" 吗?此操作不可恢复!`)) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(
        `${API_URL}/api/auth/admin/users/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage({
        type: 'success',
        text: `用户 "${username}" 已删除`
      });

      // 重新加载用户列表
      loadUsers();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || '删除用户失败'
      });
    }
  };

  // 组件加载时获取用户列表
  useEffect(() => {
    if (user?.is_superuser) {
      loadUsers();
    }
  }, [user]);

  // 检查是否为超级管理员
  if (!user?.is_superuser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">访问被拒绝</h2>
          <p className="text-gray-600">您没有权限访问此页面。</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${API_URL}/api/auth/admin/create-user`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage({
        type: 'success',
        text: `用户 "${response.data.username}" 创建成功!`
      });

      // 清空表单
      setFormData({
        username: '',
        email: '',
        password: '',
        full_name: '',
        institution: '',
        is_admin: false,
        is_superuser: false
      });

      // 重新加载用户列表
      loadUsers();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || '创建用户失败'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <UserPlus className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">创建新用户</h1>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名 *
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="输入用户名"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱 *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码 *
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="至少6个字符"
              />
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                姓名
              </label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="可选"
              />
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                机构
              </label>
              <input
                type="text"
                name="institution"
                id="institution"
                value={formData.institution}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="可选"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_admin"
                  id="is_admin"
                  checked={formData.is_admin}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-700">
                  设为管理员 (可上传和下载数据集)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_superuser"
                  id="is_superuser"
                  checked={formData.is_superuser}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="is_superuser" className="ml-2 block text-sm text-gray-700">
                  设为超级管理员 (拥有用户管理权限)
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">权限说明:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>超级管理员</strong>: 创建用户 + 上传 + 下载</li>
                <li>• <strong>管理员</strong>: 上传 + 下载</li>
                <li>• <strong>普通用户</strong>: 仅下载</li>
                <li>• <strong>未登录</strong>: 仅浏览</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '创建中...' : '创建用户'}
            </button>
          </form>
        </div>

        {/* 用户列表 */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">用户列表</h2>
            </div>
            <span className="text-sm text-gray-500">共 {users.length} 个用户</span>
          </div>

          {loadingUsers ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">权限</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.full_name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {u.is_superuser && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              超级管理员
                            </span>
                          )}
                          {u.is_admin && !u.is_superuser && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              管理员
                            </span>
                          )}
                          {!u.is_admin && !u.is_superuser && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              普通用户
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {u.id === user?.id ? (
                          <span className="text-gray-400">当前用户</span>
                        ) : (
                          <button
                            onClick={() => handleDelete(u.id, u.username)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            删除
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
