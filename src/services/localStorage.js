// 本地存储服务 - 替代Firestore
class LocalStorageService {
  constructor(userId) {
    this.userId = userId;
    this.prefix = `rect-words-${userId}`;
  }

  // 获取存储键
  getKey(collection, id = null) {
    return id ? `${this.prefix}-${collection}-${id}` : `${this.prefix}-${collection}`;
  }

  // 获取所有文档
  getDocuments() {
    try {
      const data = localStorage.getItem(this.getKey('documents'));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  // 保存文档
  saveDocument(doc) {
    try {
      const documents = this.getDocuments();
      const existingIndex = documents.findIndex(d => d.id === doc.id);
      
      if (existingIndex >= 0) {
        documents[existingIndex] = { ...doc, updatedAt: new Date().toISOString() };
      } else {
        documents.push({
          ...doc,
          id: doc.id || this.generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem(this.getKey('documents'), JSON.stringify(documents));
      return true;
    } catch (error) {
      console.error('Error saving document:', error);
      return false;
    }
  }

  // 删除文档
  deleteDocument(docId) {
    try {
      const documents = this.getDocuments();
      const filtered = documents.filter(d => d.id !== docId);
      localStorage.setItem(this.getKey('documents'), JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  // 获取单词本
  getWordbook() {
    try {
      const data = localStorage.getItem(this.getKey('wordbook'));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting wordbook:', error);
      return [];
    }
  }

  // 保存单词本
  saveWordbook(wordbook) {
    try {
      localStorage.setItem(this.getKey('wordbook'), JSON.stringify(wordbook));
      return true;
    } catch (error) {
      console.error('Error saving wordbook:', error);
      return false;
    }
  }

  // 添加单词到单词本
  addWord(word) {
    try {
      const wordbook = this.getWordbook();
      const existingIndex = wordbook.findIndex(w => w.word === word.word);
      
      if (existingIndex >= 0) {
        wordbook[existingIndex] = { ...word, updatedAt: new Date().toISOString() };
      } else {
        wordbook.push({
          ...word,
          id: this.generateId(),
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      this.saveWordbook(wordbook);
      return true;
    } catch (error) {
      console.error('Error adding word:', error);
      return false;
    }
  }

  // 更新单词状态
  updateWordStatus(wordId, status) {
    try {
      const wordbook = this.getWordbook();
      const wordIndex = wordbook.findIndex(w => w.id === wordId);
      
      if (wordIndex >= 0) {
        wordbook[wordIndex].status = status;
        wordbook[wordIndex].updatedAt = new Date().toISOString();
        this.saveWordbook(wordbook);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating word status:', error);
      return false;
    }
  }

  // 删除单词
  deleteWord(wordId) {
    try {
      const wordbook = this.getWordbook();
      const filtered = wordbook.filter(w => w.id !== wordId);
      this.saveWordbook(filtered);
      return true;
    } catch (error) {
      console.error('Error deleting word:', error);
      return false;
    }
  }

  // 获取设置
  getSettings() {
    try {
      const data = localStorage.getItem(this.getKey('settings'));
      return data ? JSON.parse(data) : {
        theme: 'light',
        accent: 'us',
        language: 'zh-CN',
        aiEnabled: false,
        aiProvider: 'openai',
        aiApiKey: '',
        aiBaseURL: '',
        aiModel: '',
        dictionaryApiProvider: 'free',
        dictionaryApiKey: '',
        dictionaryBaseURL: '/api/dictionary/v2/entries/en',
        dictionaryCustomEndpoint: ''
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        theme: 'light',
        accent: 'us',
        language: 'zh-CN',
        aiEnabled: false,
        aiProvider: 'openai',
        aiApiKey: '',
        aiBaseURL: '',
        aiModel: '',
        dictionaryApiProvider: 'free',
        dictionaryApiKey: '',
        dictionaryBaseURL: '/api/dictionary/v2/entries/en',
        dictionaryCustomEndpoint: ''
      };
    }
  }

  // 保存设置
  saveSettings(settings) {
    try {
      localStorage.setItem(this.getKey('settings'), JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  // 生成ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 监听变化的模拟方法（用于替代Firestore的实时监听）
  onDocumentsSnapshot(callback) {
    // 初次加载数据
    const documents = this.getDocuments().map(doc => ({
      id: doc.id,
      data: () => doc
    }));
    
    callback({
      docs: documents
    });

    // 返回取消订阅函数
    return () => {};
  }

  onWordbookSnapshot(callback) {
    const wordbook = this.getWordbook();
    callback(wordbook);
    return () => {};
  }

  onSettingsSnapshot(callback) {
    const settings = this.getSettings();
    callback(settings);
    return () => {};
  }

  // 导出数据
  exportData() {
    return {
      documents: this.getDocuments(),
      wordbook: this.getWordbook(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
  }

  // 导入数据
  importData(data) {
    try {
      if (data.documents) {
        localStorage.setItem(this.getKey('documents'), JSON.stringify(data.documents));
      }
      if (data.wordbook) {
        localStorage.setItem(this.getKey('wordbook'), JSON.stringify(data.wordbook));
      }
      if (data.settings) {
        localStorage.setItem(this.getKey('settings'), JSON.stringify(data.settings));
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // 清除所有数据
  clearAllData() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

export default LocalStorageService;
