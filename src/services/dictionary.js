import { apiConfig } from '../constants/config';

export class DictionaryService {
  static config = {
    apiProvider: 'free',
    apiKey: '',
    baseURL: '/api/dictionary/v2/entries/en',
    customEndpoint: ''
  };

  // 配置词典服务
  static configure(config) {
    this.config = { ...this.config, ...config };
  }

  // 获取当前配置
  static getConfig() {
    return { ...this.config };
  }

  // 获取单词定义 - 优先使用词典API，失败时返回null让AI补足
  static async getWordDefinition(word) {
    try {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (!cleanWord) throw new Error('Invalid word');

      // 尝试从词典API获取定义
      const definition = await this.tryDictionaryAPI(cleanWord);
      if (definition) {
        return definition;
      }
      
      // 词典API失败，返回null让调用方使用AI
      return null;
    } catch (error) {
      console.warn('Dictionary API failed:', error);
      return null;
    }
  }

  // 尝试不同的词典API
  static async tryDictionaryAPI(word) {
    const apis = [
      () => this.getFreeApiDefinition(word),
      () => this.config.apiKey ? this.getMerriamWebsterDefinition(word) : null,
      () => this.config.apiKey ? this.getWordsApiDefinition(word) : null
    ];

    for (const apiCall of apis) {
      try {
        const result = await apiCall();
        if (result) return result;
      } catch (error) {
        continue; // 尝试下一个API
      }
    }
    
    return null;
  }

  // Free Dictionary API
  static async getFreeApiDefinition(word) {
    const url = `${this.config.baseURL}/${word}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Definition not found for "${word}"`);
    }
    
    const data = await response.json();
    const entry = data[0];
    
    if (!entry) {
      throw new Error('No definition found');
    }

    return this.formatFreeApiResponse(entry);
  }

  // Merriam-Webster API
  static async getMerriamWebsterDefinition(word) {
    if (!this.config.apiKey) {
      throw new Error('Merriam-Webster API key is required');
    }

    const url = `${this.config.baseURL}/${word}?key=${this.config.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Definition not found for "${word}"`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No definition found');
    }

    return this.formatMerriamWebsterResponse(data[0], word);
  }

  // Oxford Dictionary API
  static async getOxfordDefinition(word) {
    if (!this.config.apiKey) {
      throw new Error('Oxford Dictionary API key is required');
    }

    const url = `${this.config.baseURL}/${word}`;
    const response = await fetch(url, {
      headers: {
        'app_id': this.config.apiKey.split(':')[0],
        'app_key': this.config.apiKey.split(':')[1]
      }
    });
    
    if (!response.ok) {
      throw new Error(`Definition not found for "${word}"`);
    }
    
    const data = await response.json();
    return this.formatOxfordResponse(data);
  }

  // WordsAPI (RapidAPI)
  static async getWordsApiDefinition(word) {
    if (!this.config.apiKey) {
      throw new Error('WordsAPI key is required');
    }

    const url = `${this.config.baseURL}/${word}`;
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': this.config.apiKey,
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Definition not found for "${word}"`);
    }
    
    const data = await response.json();
    return this.formatWordsApiResponse(data);
  }

  // Custom API
  static async getCustomApiDefinition(word) {
    let url = this.config.baseURL;
    
    if (this.config.customEndpoint) {
      // 替换占位符
      const endpoint = this.config.customEndpoint.replace('{word}', word);
      url = url.endsWith('/') ? url + endpoint.replace(/^\//, '') : url + endpoint;
    } else {
      url = url.endsWith('/') ? url + word : url + '/' + word;
    }

    const headers = {};
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Definition not found for "${word}"`);
    }
    
    const data = await response.json();
    return this.formatCustomApiResponse(data, word);
  }

  // 格式化Free API响应
  static formatFreeApiResponse(entry) {
    const phonetics = entry.phonetics?.map(p => ({
      text: p.text,
      audio: p.audio
    })).filter(p => p.audio) || [];

    const meanings = entry.meanings?.map(m => ({
      partOfSpeech: m.partOfSpeech,
      definitions: m.definitions?.map(d => ({
        definition: d.definition,
        example: d.example,
        synonyms: d.synonyms || [],
        antonyms: d.antonyms || []
      })) || [],
      synonyms: m.synonyms || [],
      antonyms: m.antonyms || []
    })) || [];

    return {
      word: entry.word,
      phonetics,
      meanings
    };
  }

  // 格式化Merriam-Webster响应
  static formatMerriamWebsterResponse(entry, word) {
    const phonetics = entry.hwi?.prs?.map(p => ({
      text: p.mw ? `/${p.mw}/` : '',
      audio: p.sound?.audio || ''
    })) || [];

    const meanings = entry.def?.map(d => ({
      partOfSpeech: entry.fl || '',
      definitions: d.sseq?.flat(2)
        .filter(item => item.dt)
        .map(item => ({
          definition: item.dt?.[0]?.[1] || '',
          example: '',
          synonyms: [],
          antonyms: []
        })) || [],
      synonyms: [],
      antonyms: []
    })) || [];

    return {
      word: word,
      phonetics,
      meanings
    };
  }

  // 格式化Oxford响应
  static formatOxfordResponse(data) {
    const entry = data.results?.[0];
    if (!entry) throw new Error('No definition found');

    const phonetics = entry.lexicalEntries?.[0]?.pronunciations?.map(p => ({
      text: p.phoneticSpelling || '',
      audio: p.audioFile || ''
    })) || [];

    const meanings = entry.lexicalEntries?.map(le => ({
      partOfSpeech: le.lexicalCategory?.text || '',
      definitions: le.entries?.[0]?.senses?.map(s => ({
        definition: s.definitions?.[0] || '',
        example: s.examples?.[0]?.text || '',
        synonyms: s.synonyms?.map(syn => syn.text) || [],
        antonyms: s.antonyms?.map(ant => ant.text) || []
      })) || [],
      synonyms: [],
      antonyms: []
    })) || [];

    return {
      word: entry.word,
      phonetics,
      meanings
    };
  }

  // 格式化WordsAPI响应
  static formatWordsApiResponse(data) {
    const phonetics = data.pronunciation ? [{
      text: data.pronunciation.all || '',
      audio: ''
    }] : [];

    const meanings = data.results?.map(r => ({
      partOfSpeech: r.partOfSpeech || '',
      definitions: [{
        definition: r.definition || '',
        example: r.examples?.[0] || '',
        synonyms: r.synonyms || [],
        antonyms: r.antonyms || []
      }],
      synonyms: r.synonyms || [],
      antonyms: r.antonyms || []
    })) || [];

    return {
      word: data.word,
      phonetics,
      meanings
    };
  }

  // 格式化自定义API响应 (尝试适配通用格式)
  static formatCustomApiResponse(data, word) {
    // 尝试检测常见的API响应格式
    if (Array.isArray(data) && data[0]) {
      return this.formatFreeApiResponse(data[0]);
    }
    
    if (data.results) {
      return this.formatWordsApiResponse(data);
    }

    // 基本格式化
    return {
      word: word,
      phonetics: [],
      meanings: [{
        partOfSpeech: '',
        definitions: [{
          definition: data.definition || data.meaning || 'Definition available',
          example: data.example || '',
          synonyms: [],
          antonyms: []
        }],
        synonyms: [],
        antonyms: []
      }]
    };
  }

  // 批量获取定义
  static async batchGetDefinitions(words) {
    const results = [];
    
    for (const word of words) {
      try {
        const definition = await this.getWordDefinition(word);
        results.push({ word, definition, success: true });
      } catch (error) {
        results.push({ word, error: error.message, success: false });
      }
    }
    
    return results;
  }
}

export default DictionaryService;
