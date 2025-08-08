import React, { useState } from "react";
import { Eye, EyeOff, Bot } from "lucide-react";
import aiService from "../../services/aiService";

const SettingsSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
      {title}
    </h3>
    {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      {children}
    </div>
  </div>
);

const AISettings = ({ settings = {}, onSettingChange }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState(null);
  
  // 使用单一配置对象存储所有服务商设置
  const [aiConfig, setAiConfig] = useState(() => {
    const provider = settings.aiProvider || "openai";
    const defaults = aiService.getProviderDefaults(provider);
    
    // 从settings获取所有服务商配置
    const providerConfigs = settings.aiProviderConfigs || {};
    
    // 如果当前服务商配置不存在，使用默认值
    const currentConfig = providerConfigs[provider] || {
      apiKey: settings.aiApiKey || "",
      baseURL: settings.aiBaseURL || defaults.baseURL,
      model: settings.aiModel || defaults.model,
    };
    
    return {
      provider,
      ...currentConfig
    };
  });

  // 更新服务商配置
  const updateProviderConfig = (provider, config) => {
    const newConfig = {
      ...aiConfig,
      provider,
      ...config
    };
    setAiConfig(newConfig);
    
    // 保存到全局设置
    onSettingChange("aiProvider", provider);
    onSettingChange("aiApiKey", config.apiKey || "");
    onSettingChange("aiBaseURL", config.baseURL || "");
    onSettingChange("aiModel", config.model || "");
    
    // 更新所有服务商配置
    const updatedConfigs = {
      ...(settings.aiProviderConfigs || {}),
      [provider]: config
    };
    onSettingChange("aiProviderConfigs", updatedConfigs);
  };

  // 切换服务商处理
  const handleProviderChange = (newProvider) => {
    const defaults = aiService.getProviderDefaults(newProvider);
    const existingConfig = (settings.aiProviderConfigs || {})[newProvider];
    
    updateProviderConfig(newProvider, {
      apiKey: existingConfig?.apiKey || "",
      baseURL: existingConfig?.baseURL || defaults.baseURL,
      model: existingConfig?.model || defaults.model
    });
  };

  // 更新配置项
  const handleConfigChange = (key, value) => {
    setConnectionResult(null);
    
    // 更新当前服务商配置
    const updatedConfig = {
      ...aiConfig,
      [key]: value
    };
    
    // 更新全局状态
    updateProviderConfig(aiConfig.provider, updatedConfig);
  };

  const testAiConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    aiService.configure(aiConfig);
    const result = await aiService.testConnection();
    setConnectionResult(result);
    setTestingConnection(false);
  };

  const supportedProviders = aiService.getSupportedProviders();
  const modelOptions = aiService.getProviderDefaults(aiConfig.provider).models || [];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
        <Bot className="w-8 h-8 mr-4 text-indigo-600" />
        AI 助手设置
      </h1>

      <SettingsSection title="AI 服务配置" description="配置您的AI助手服务提供商和相关参数">
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI提供商</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">选择AI助手服务提供商</p>
          </div>
          <select
            value={aiConfig.provider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 min-w-[160px]"
          >
            {supportedProviders.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {supportedProviders.find((p) => p.id === aiConfig.provider)?.requiresApiKey && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={aiConfig.apiKey || ""}
                onChange={(e) => handleConfigChange("apiKey", e.target.value)}
                placeholder={`Enter your ${supportedProviders.find((p) => p.id === aiConfig.provider)?.name} API key`}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
              />
              <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showApiKey ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Base URL</label>
          <div className="flex items-center space-x-2">
            <input
              type="url"
              value={aiConfig.baseURL}
              onChange={(e) => handleConfigChange("baseURL", e.target.value)}
              placeholder={aiService.getProviderDefaults(aiConfig.provider).baseURL}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
            />
            <button onClick={testAiConnection} disabled={testingConnection || !aiConfig.apiKey} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors whitespace-nowrap">
              {testingConnection ? "测试中" : "测试"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI模型</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">选择要使用的AI模型版本</p>
          </div>
          <select
            key={`model-select-${aiConfig.provider}`}
            value={aiConfig.model}
            onChange={(e) => handleConfigChange("model", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 min-w-[160px]"
          >
            {modelOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        {connectionResult && (
          <div className={`p-3 rounded-lg ${connectionResult.success ? "bg-green-50 dark:bg-green-900/20 border-green-200" : "bg-red-50 dark:bg-red-900/20 border-red-200"}`}>
            <p className={`text-sm font-medium ${connectionResult.success ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}>
              {connectionResult.success ? "✅ " : "❌ "}{connectionResult.message}
            </p>
            {connectionResult.response && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">响应: {connectionResult.response}</p>}
          </div>
        )}
      </SettingsSection>
    </div>
  );
};

export default AISettings;
