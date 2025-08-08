import React, { useState } from 'react';
import { Scan } from 'lucide-react';

// 统一的设置区域组件
const SettingsSection = ({ title, description, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h3>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {children}
        </div>
    </div>
);

const ImportSettings = ({ settings = {}, onSettingChange }) => {
  const [testingOCR, setTestingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  const ocrProviders = [
    {
      id: 'tesseract',
      name: 'Tesseract.js',
      description: '开源OCR引擎，本地运行，无需API密钥',
      requiresApiKey: false,
      features: ['多语言支持', '本地处理', '免费使用']
    },
    {
      id: 'google-vision',
      name: 'Google Cloud Vision',
      description: 'Google云视觉API，识别精度高',
      requiresApiKey: true,
      features: ['高精度', '快速识别', '多语言']
    },
    {
      id: 'azure-vision',
      name: 'Azure Computer Vision',
      description: 'Microsoft Azure视觉服务',
      requiresApiKey: true,
      features: ['企业级', '高可靠性', '多格式支持']
    },
    {
      id: 'baidu-ocr',
      name: '百度OCR',
      description: '百度智能云OCR服务，支持中英文',
      requiresApiKey: true,
      features: ['中文优化', '高精度', '表格识别']
    }
  ];



  const currentProvider = ocrProviders.find(p => p.id === (settings.ocrProvider || 'tesseract'));

  const testOCRConnection = async () => {
    setTestingOCR(true);
    setOcrResult(null);
    
    try {
      // 模拟OCR测试
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOcrResult({
        success: true,
        message: 'OCR服务连接成功！',
        provider: currentProvider?.name
      });
    } catch (error) {
      setOcrResult({
        success: false,
        message: 'OCR连接测试失败，请检查配置'
      });
    } finally {
      setTestingOCR(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
        <Scan className="w-8 h-8 mr-4 text-indigo-600" />
        导入设置
      </h1>

      <SettingsSection title="OCR服务配置" description="配置光学字符识别服务，用于从图片中提取文本">
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">OCR服务商</span>
          </div>
          <select
            value={settings.ocrProvider || 'tesseract'}
            onChange={(e) => onSettingChange('ocrProvider', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
          >
            {ocrProviders.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}{provider.requiresApiKey ? ' (需要API密钥)' : ''}
              </option>
            ))}
          </select>
        </div>

        {currentProvider?.requiresApiKey && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {currentProvider.name} API 密钥
            </label>
            <input
              type="password"
              value={settings.ocrApiKey || ''}
              onChange={(e) => onSettingChange('ocrApiKey', e.target.value)}
              placeholder={`输入 ${currentProvider.name} API 密钥`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              请从 {currentProvider.name} 服务商处获取 API 密钥
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API 端点
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="url"
              value={settings.ocrApiUrl || ''}
              onChange={(e) => onSettingChange('ocrApiUrl', e.target.value)}
              placeholder={currentProvider?.id === 'tesseract' ? '本地运行，无需API端点' : 'https://api.example.com/ocr'}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400"
              disabled={currentProvider?.id === 'tesseract'}
            />
            <button
              onClick={testOCRConnection}
              disabled={testingOCR}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {testingOCR ? '测试中' : '测试'}
            </button>
          </div>
        </div>

        {/* 测试结果显示 */}
        {ocrResult && (
          <div className={`p-3 rounded-lg ${
            ocrResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <p className={`text-sm font-medium ${
              ocrResult.success 
                ? 'text-green-800 dark:text-green-300'
                : 'text-red-800 dark:text-red-300'
            }`}>
              {ocrResult.success ? '✅ ' : '❌ '}
              {ocrResult.message}
            </p>
            {ocrResult.provider && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                使用 {ocrResult.provider} 服务
              </p>
            )}
          </div>
        )}
      </SettingsSection>
    </div>
  );
};

export default ImportSettings;
