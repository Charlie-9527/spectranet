import { useEffect, useState } from 'react';
import { statsApi } from '../api/stats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Database, Download, Eye, TrendingUp } from 'lucide-react';
import type { DatasetStats, Dataset } from '../types';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export default function Statistics() {
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [trending, setTrending] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const [statsData, trendingData] = await Promise.all([
        statsApi.getStatistics(),
        statsApi.getTrending(5),
      ]);
      setStats(statsData);
      setTrending(trendingData);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Failed to load statistics</p>
      </div>
    );
  }

  // Prepare chart data
  const categoryData = Object.entries(stats.datasets_by_category).map(([name, value]) => ({
    name,
    datasets: value,
  }));

  const typeData = Object.entries(stats.datasets_by_type).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Statistics</h1>
          <p className="text-gray-600">Overview of SPECTRANET datasets and activity</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Datasets</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_datasets}</p>
              </div>
              <Database className="h-12 w-12 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Samples</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_samples.toLocaleString()}</p>
              </div>
              <Eye className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Downloads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_downloads.toLocaleString()}</p>
              </div>
              <Download className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Categories</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Object.keys(stats.datasets_by_category).length}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Datasets by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Datasets by Category</h2>
            {categoryData.length > 0 ? (
              <BarChart width={500} height={300} data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="datasets" fill="#0ea5e9" />
              </BarChart>
            ) : (
              <p className="text-gray-500 text-center py-8">No category data available</p>
            )}
          </div>

          {/* Datasets by Type */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Datasets by Spectral Type</h2>
            {typeData.length > 0 ? (
              <PieChart width={500} height={300}>
                <Pie
                  data={typeData}
                  cx={250}
                  cy={150}
                  labelLine={true}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <p className="text-gray-500 text-center py-8">No type data available</p>
            )}
          </div>
        </div>

        {/* Trending Datasets */}
        {trending.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Trending Datasets</h2>
            <div className="space-y-4">
              {trending.map((dataset, index) => (
                <div key={dataset.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                      <p className="text-sm text-gray-500">{dataset.spectral_type || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
