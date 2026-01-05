import { Link } from 'react-router-dom';
import { Database, Search, Upload, BarChart3, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                让机器第一次真正<br />
                <span className="text-primary-200">"看懂光谱"</span>
              </h1>
              <p className="text-lg mb-6 text-primary-100 leading-relaxed">
                光谱数据是隐藏在可见图像背后的"物质语言"，它记录了颜色之外的化学与物理特征，是每种材料独一无二的"光谱指纹"。
              </p>
              <p className="text-lg mb-6 text-primary-100 leading-relaxed">
                但长期以来，这些数据分散在各行业实验室中，缺乏统一格式与标注体系，让光谱AI难以形成真正的学习基础。
              </p>
              <p className="text-lg mb-8 text-primary-100 leading-relaxed">
                SPECTRANET 的意义在于：首次以标准化方式汇聚、清洗并标注多源光谱数据，把零散的科研资源转化为可训练、可迁移、可复用的智能基础数据集。
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/datasets"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  浏览数据集
                </Link>
                <Link
                  to={isAuthenticated ? "/upload" : "/login"}
                  className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors border-2 border-white"
                >
                  研究应用
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 overflow-hidden">
                    <img 
                      src="/spectrum1.png" 
                      alt="光谱图表1" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="h-48 flex items-center justify-center text-gray-400 text-sm">光谱图表</div>';
                      }}
                    />
                  </div>
                  <div className="bg-white rounded-lg p-4 overflow-hidden">
                    <img 
                      src="/spectrum2.png" 
                      alt="光谱图表2" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="h-48 flex items-center justify-center text-gray-400 text-sm">光谱图表</div>';
                      }}
                    />
                  </div>
                  <div className="bg-white rounded-lg p-4 overflow-hidden">
                    <img 
                      src="/spectrum3.png" 
                      alt="光谱图表3" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="h-48 flex items-center justify-center text-gray-400 text-sm">光谱图表</div>';
                      }}
                    />
                  </div>
                  <div className="bg-white rounded-lg p-4 overflow-hidden">
                    <img 
                      src="/spectrum4.png" 
                      alt="光谱图表4" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="h-48 flex items-center justify-center text-gray-400 text-sm">光谱图表</div>';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600">
                200<sup>+</sup>
              </div>
              <div className="text-gray-600 mt-2">样本种类</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">
                60K<sup>+</sup>
              </div>
              <div className="text-gray-600 mt-2">光谱数量</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">
                50<sup>+</sup>
              </div>
              <div className="text-gray-600 mt-2">贡献者</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">
                3K<sup>+</sup>
              </div>
              <div className="text-gray-600 mt-2">下载量</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              光谱数据所需的一切
            </h2>
            <p className="text-lg text-gray-600">
              为研究人员、科学家和开发者打造的强大工具
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Database className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">海量数据集</h3>
              <p className="text-gray-600">
                访问涵盖多个领域和应用的数千个光谱数据集
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">高级搜索</h3>
              <p className="text-gray-600">
                利用强大的搜索和过滤功能精确找到所需数据
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Upload className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">便捷上传</h3>
              <p className="text-gray-600">
                使用简单的上传工具与社区分享您的光谱数据
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <BarChart3 className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">可视化分析</h3>
              <p className="text-gray-600">
                交互式光谱曲线可视化和分析工具
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">社区驱动</h3>
              <p className="text-gray-600">
                加入全球研究人员和从业者社区
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">API 接口</h3>
              <p className="text-gray-600">
                通过 RESTful API 程序化访问所有数据集
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">准备开始了吗？</h2>
          <p className="text-xl mb-8 text-primary-100">
            加入数千名研究人员，使用 SPECTRANET 满足您的光谱数据需求
          </p>
          <Link
            to={isAuthenticated ? "/upload" : "/login"}
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            {isAuthenticated ? "上传数据集" : "登录账户"}
          </Link>
        </div>
      </div>
    </div>
  );
}
