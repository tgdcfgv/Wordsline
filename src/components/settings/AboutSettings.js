import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Heart, Github, Mail } from 'lucide-react';

const AboutSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* 应用信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          应用信息
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">应用名称:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">Rect Words</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">版本:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">0.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">构建日期:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* 功能特性 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          主要功能
        </h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            智能阅读器 - 支持文档导入和在线阅读
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            生词本管理 - 自动收集和管理学习单词
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            AI助手 - 智能单词解释和学习建议
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            多主题支持 - 深色/浅色模式切换
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            多语言界面 - 支持中英文界面
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            数据导入导出 - 支持多种格式的数据交换
          </li>
        </ul>
      </div>

      {/* 技术栈 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          技术栈
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">前端框架</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>React 18</li>
              <li>Vite</li>
              <li>Tailwind CSS</li>
              <li>Lucide React Icons</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">功能库</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>React i18next</li>
              <li>React Virtuoso</li>
              <li>Dictionary API</li>
              <li>AI Services</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 开发团队 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Heart className="inline w-5 h-5 mr-2 text-red-500" />
          致谢
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          感谢所有为这个项目贡献代码、提供建议和反馈的开发者和用户。
          特别感谢开源社区提供的优秀工具和库，让这个项目成为可能。
        </p>
      </div>

      {/* 链接 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          相关链接
        </h3>
        <div className="space-y-3">
          <a
            href="https://github.com/rect-words"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub 仓库
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          <a
            href="mailto:support@rectwords.app"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            联系我们
          </a>
        </div>
      </div>

      {/* 版权信息 */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p>© 2024 Rect Words. All rights reserved.</p>
        <p className="mt-1">Built with ❤️ for language learners worldwide.</p>
      </div>
    </div>
  );
};

export default AboutSettings;
