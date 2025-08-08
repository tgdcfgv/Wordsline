// 数据导入导出工具
export class DataManager {
  constructor(localStorageService) {
    this.localStorageService = localStorageService;
  }

  // 导出所有数据
  exportData() {
    if (!this.localStorageService) {
      throw new Error('LocalStorage service not available');
    }

    const data = {
      documents: this.localStorageService.getDocuments(),
      wordbook: this.localStorageService.getWordbook(),
      settings: this.localStorageService.getSettings(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    return data;
  }

  // 导入数据
  async importData(data) {
    if (!this.localStorageService) {
      throw new Error('LocalStorage service not available');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    try {
      // 备份当前数据
      const backup = this.exportData();
      localStorage.setItem('rect-words-backup', JSON.stringify(backup));

      // 导入新数据
      if (data.documents && Array.isArray(data.documents)) {
        data.documents.forEach(doc => {
          this.localStorageService.saveDocument(doc);
        });
      }

      if (data.wordbook && Array.isArray(data.wordbook)) {
        this.localStorageService.saveWordbook(data.wordbook);
      }

      if (data.settings && typeof data.settings === 'object') {
        this.localStorageService.saveSettings(data.settings);
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  // 恢复备份数据
  restoreBackup() {
    try {
      const backup = localStorage.getItem('rect-words-backup');
      if (backup) {
        const data = JSON.parse(backup);
        return this.importData(data);
      }
      throw new Error('No backup found');
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }

  // 清除所有数据
  clearAllData() {
    if (!this.localStorageService) {
      throw new Error('LocalStorage service not available');
    }

    return this.localStorageService.clearAllData();
  }

  // 获取数据统计
  getDataStats() {
    if (!this.localStorageService) {
      return {
        documents: 0,
        words: 0,
        totalWords: 0
      };
    }

    const documents = this.localStorageService.getDocuments();
    const wordbook = this.localStorageService.getWordbook();

    const totalWords = documents.reduce((total, doc) => {
      const content = doc.content || '';
      const words = content.match(/\b\w+\b/g) || [];
      return total + words.length;
    }, 0);

    return {
      documents: documents.length,
      words: wordbook.length,
      totalWords: totalWords
    };
  }
}

// 文件处理工具
export class FileUtils {
  // 将数据保存为JSON文件
  static downloadAsJSON(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  // 读取JSON文件
  static readJSONFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  }

  // 验证导入文件格式
  static validateImportData(data) {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid data format' };
    }

    // 检查必要字段
    const requiredFields = ['documents', 'wordbook', 'settings'];
    for (const field of requiredFields) {
      if (!data.hasOwnProperty(field)) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    // 验证数据类型
    if (!Array.isArray(data.documents)) {
      return { valid: false, error: 'Documents must be an array' };
    }

    if (!Array.isArray(data.wordbook)) {
      return { valid: false, error: 'Wordbook must be an array' };
    }

    if (typeof data.settings !== 'object') {
      return { valid: false, error: 'Settings must be an object' };
    }

    return { valid: true };
  }
}
