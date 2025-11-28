export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SPECTRANET</h3>
            <p className="text-gray-400 text-sm">
              用于研究和应用的综合光谱数据集存储库。
              受 ImageNet 启发，专为光谱数据构建。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/datasets" className="hover:text-white">浏览数据集</a></li>
              <li><a href="/statistics" className="hover:text-white">统计信息</a></li>
              <li><a href="/upload" className="hover:text-white">上传数据</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">资源</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/api/docs" className="hover:text-white">API 文档</a></li>
              <li><a href="#" className="hover:text-white">关于</a></li>
              <li><a href="#" className="hover:text-white">联系我们</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 SPECTRANET. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
}
