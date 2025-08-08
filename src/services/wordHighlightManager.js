/**
 * 单词高亮管理器 - 简化的高亮状态管理
 */

class WordHighlightManager {
  constructor() {
    this.highlightedWords = new Set();
    this.listeners = new Set();
  }

  /**
   * 添加单词到高亮列表
   * @param {string} word - 要高亮的单词
   */
  addHighlight(word) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord && !this.highlightedWords.has(cleanWord)) {
      this.highlightedWords.add(cleanWord);
      this.notifyListeners('add', cleanWord);
      console.log(`Added highlight: ${cleanWord}`);
    }
  }

  /**
   * 从高亮列表移除单词
   * @param {string} word - 要移除高亮的单词
   */
  removeHighlight(word) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord && this.highlightedWords.has(cleanWord)) {
      this.highlightedWords.delete(cleanWord);
      this.notifyListeners('remove', cleanWord);
      console.log(`Removed highlight: ${cleanWord}`);
    }
  }

  /**
   * 切换单词的高亮状态
   * @param {string} word - 要切换的单词
   * @returns {boolean} 切换后的状态 (true=高亮, false=未高亮)
   */
  toggleHighlight(word) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) return false;

    if (this.highlightedWords.has(cleanWord)) {
      this.removeHighlight(cleanWord);
      return false;
    } else {
      this.addHighlight(cleanWord);
      return true;
    }
  }

  /**
   * 检查单词是否被高亮
   * @param {string} word - 要检查的单词
   * @returns {boolean} 是否被高亮
   */
  isHighlighted(word) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    return this.highlightedWords.has(cleanWord);
  }

  /**
   * 获取所有高亮的单词
   * @returns {string[]} 高亮单词数组
   */
  getAllHighlighted() {
    return Array.from(this.highlightedWords);
  }

  /**
   * 清除所有高亮
   */
  clearAllHighlights() {
    const words = Array.from(this.highlightedWords);
    this.highlightedWords.clear();
    words.forEach(word => this.notifyListeners('remove', word));
    console.log('Cleared all highlights');
  }

  /**
   * 批量设置高亮单词
   * @param {string[]} words - 单词数组
   */
  setHighlights(words) {
    this.highlightedWords.clear();
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanWord) {
        this.highlightedWords.add(cleanWord);
      }
    });
    this.notifyListeners('reset', Array.from(this.highlightedWords));
  }

  /**
   * 添加变化监听器
   * @param {Function} listener - 监听器函数 (action, word) => void
   */
  addListener(listener) {
    this.listeners.add(listener);
  }

  /**
   * 移除变化监听器
   * @param {Function} listener - 监听器函数
   */
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * 通知所有监听器
   * @param {string} action - 动作类型 ('add', 'remove', 'reset')
   * @param {string|string[]} word - 单词或单词数组
   */
  notifyListeners(action, word) {
    this.listeners.forEach(listener => {
      try {
        listener(action, word);
      } catch (error) {
        console.error('Error in highlight listener:', error);
      }
    });
  }

  /**
   * 从localStorage加载高亮状态
   * @param {string} key - 存储键名，默认为 'highlighted-words'
   */
  loadFromStorage(key = 'highlighted-words') {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const words = JSON.parse(stored);
        if (Array.isArray(words)) {
          this.setHighlights(words);
          console.log(`Loaded ${words.length} highlighted words from storage`);
        }
      }
    } catch (error) {
      console.error('Error loading highlights from storage:', error);
    }
  }

  /**
   * 保存高亮状态到localStorage
   * @param {string} key - 存储键名，默认为 'highlighted-words'
   */
  saveToStorage(key = 'highlighted-words') {
    try {
      const words = this.getAllHighlighted();
      localStorage.setItem(key, JSON.stringify(words));
      console.log(`Saved ${words.length} highlighted words to storage`);
    } catch (error) {
      console.error('Error saving highlights to storage:', error);
    }
  }
}

// 创建单例实例
const wordHighlightManager = new WordHighlightManager();

export default wordHighlightManager;
