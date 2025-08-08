import { useState, useEffect } from 'react';
import LocalStorageService from '../services/localStorage';

export const useFirestore = (userId) => {
  const [localStorageService, setLocalStorageService] = useState(null);

  useEffect(() => {
    if (userId) {
      setLocalStorageService(new LocalStorageService(userId));
    } else {
      setLocalStorageService(null);
    }
  }, [userId]);

  return localStorageService;
};

export const useDocuments = (localStorageService) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!localStorageService) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 使用本地存储获取文档
      const docs = localStorageService.getDocuments();
      const docsData = docs.map(doc => ({
        id: doc.id,
        ...doc,
        words: new Set(doc.words || [])
      }));
      setDocuments(docsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [localStorageService]);

  return { documents, loading, error };
};

export const useWordbook = (localStorageService) => {
  const [wordbook, setWordbook] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!localStorageService) {
      setWordbook({});
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const wordbookData = localStorageService.getWordbook();
      // 转换数组格式为对象格式以保持兼容性
      const wordbookObj = {};
      wordbookData.forEach(word => {
        wordbookObj[word.word] = word;
      });
      setWordbook(wordbookObj);
      setError(null);
    } catch (err) {
      console.error("Error fetching wordbook:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [localStorageService]);

  return { wordbook, loading, error };
};

export const useSettings = (localStorageService) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    accent: 'us',
    language: 'zh-CN',
    aiEnabled: false,
    aiProvider: 'openai',
    aiApiKey: '',
    aiBaseURL: '',
    aiModel: '',
    aiProviderConfigs: {}, // 添加多服务商配置存储
    dictionaryApiProvider: 'free',
    dictionaryApiKey: '',
    dictionaryBaseURL: '/api/dictionary/v2/entries/en',
    dictionaryCustomEndpoint: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!localStorageService) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const settingsData = localStorageService.getSettings();
      setSettings(prev => ({ 
        ...prev, 
        ...settingsData,
        // 确保aiProviderConfigs存在
        aiProviderConfigs: settingsData.aiProviderConfigs || {}
      }));
      setError(null);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [localStorageService]);

  // 提供更新设置的方法
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ 
      ...prev, 
      ...newSettings,
      // 确保aiProviderConfigs始终为对象
      aiProviderConfigs: newSettings.aiProviderConfigs || prev.aiProviderConfigs
    }));
  };

  return { settings, loading, error, updateSettings };
};
