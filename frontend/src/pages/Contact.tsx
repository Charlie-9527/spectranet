import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">联系我们</h1>
          <p className="text-xl text-primary-100">
            我们随时准备为您提供帮助和支持
          </p>
        </div>
      </div>

      {/* Contact Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img 
            src="/contact-banner.jpg" 
            alt="联系我们" 
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="h-80 bg-gradient-to-r from-primary-100 to-primary-200 flex items-center justify-center"><div class="text-center"><svg class="h-20 w-20 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg><p class="text-2xl font-semibold text-primary-700">联系我们</p></div></div>';
            }}
          />
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">联系方式</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Email */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 p-4 rounded-full">
                <Mail className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">邮箱</h3>
            <p className="text-gray-600 text-sm mb-2">联系邮箱</p>
            <a href="mailto:contact@spectranet.cn" className="text-primary-600 hover:underline">
              contact@spectranet.cn
            </a>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 p-4 rounded-full">
                <Phone className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">电话</h3>
            <p className="text-gray-600 text-sm mb-2">服务热线</p>
            <a href="tel:0551-62901234" className="text-primary-600 hover:underline">
              0551-62901234
            </a>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 p-4 rounded-full">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">地址</h3>
            <p className="text-gray-600 text-sm mb-2">公司地址</p>
            <p className="text-gray-700 text-sm">
              安徽省合肥市包河区包公街道<br />
              屯溪路193号工大智谷304室
            </p>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 p-4 rounded-full">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">工作时间</h3>
            <p className="text-gray-600 text-sm mb-2">服务时间</p>
            <p className="text-gray-700 text-sm">
              周一至周五<br />
              9:00 - 18:00
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">公司信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary-600">合肥纳立讯智能科技有限公司</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">地址</p>
                    <p className="text-sm text-gray-600">安徽省合肥市包河区包公街道屯溪路193号工大智谷304室</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">邮编</p>
                    <p className="text-sm text-gray-600">230009</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">传真</p>
                    <p className="text-sm text-gray-600">0551-62901234</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary-600">技术支持</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">技术支持邮箱</p>
                    <p className="text-sm text-gray-600">support@spectranet.cn</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">技术支持电话</p>
                    <p className="text-sm text-gray-600">0551-62901234</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">在线时间</p>
                    <p className="text-sm text-gray-600">周一至周五 9:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">在线留言</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  姓名 *
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱 *
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  电话
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  主题 *
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                留言内容 *
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                提交留言
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
