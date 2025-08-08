/**
 * 简化的字典服务 - 直接使用本地代理，避免CSP问题
 */

class SimpleDictionaryService {
  constructor() {
    // 使用Vite代理的本地路径
    this.baseURL = '/api/dictionary/v2/entries/en';
  }

  /**
   * 获取单词定义
   * @param {string} word - 要查询的单词
   * @returns {Promise<Object|null>} 返回格式化的定义或null
   */
  async getWordDefinition(word) {
    try {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (!cleanWord || cleanWord.length < 1) {
        throw new Error('Invalid word');
      }

      console.log(`Fetching definition for: ${cleanWord}`);
      
      const url = `${this.baseURL}/${cleanWord}`;
      console.log(`Request URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn(`Dictionary API returned ${response.status} for word: ${cleanWord}`);
        return null;
      }

      const data = await response.json();
      console.log('Dictionary response:', data);

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('No definition found in response');
        return null;
      }

      return this.formatResponse(data[0], cleanWord);
    } catch (error) {
      console.error('Dictionary service error:', error);
      return null;
    }
  }

  /**
   * 格式化API响应
   * @param {Object} entry - API返回的条目
   * @param {string} word - 原始单词
   * @returns {Object} 格式化的定义
   */
  formatResponse(entry, word) {
    try {
      // 提取发音信息
      const phonetics = (entry.phonetics || [])
        .filter(p => p.text || p.audio)
        .map(p => ({
          text: p.text || '',
          audio: p.audio || ''
        }));

      // 提取词义信息
      const meanings = (entry.meanings || []).map(meaning => ({
        partOfSpeech: meaning.partOfSpeech || '',
        definitions: (meaning.definitions || []).slice(0, 3).map(def => ({
          definition: def.definition || '',
          example: def.example || '',
          synonyms: def.synonyms || [],
          antonyms: def.antonyms || []
        })),
        synonyms: meaning.synonyms || [],
        antonyms: meaning.antonyms || []
      }));

      return {
        word: entry.word || word,
        phonetics,
        meanings,
        success: true
      };
    } catch (error) {
      console.error('Error formatting response:', error);
      return {
        word: word,
        phonetics: [],
        meanings: [{
          partOfSpeech: '',
          definitions: [{
            definition: 'Definition available',
            example: '',
            synonyms: [],
            antonyms: []
          }],
          synonyms: [],
          antonyms: []
        }],
        success: false
      };
    }
  }

  /**
   * 批量获取多个单词的定义
   * @param {string[]} words - 单词数组
   * @returns {Promise<Object[]>} 结果数组
   */
  async batchGetDefinitions(words) {
    const results = [];
    
    for (const word of words) {
      try {
        const definition = await this.getWordDefinition(word);
        results.push({
          word,
          definition,
          success: !!definition
        });
        
        // 添加小延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          word,
          definition: null,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }
}

// 创建单例实例
const simpleDictionaryService = new SimpleDictionaryService();

export default simpleDictionaryService;
