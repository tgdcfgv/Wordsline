// 音频播放工具
export const playAudio = (phonetics, preferredAccent = 'us') => {
  if (!phonetics || phonetics.length === 0) return;
  
  let audioUrl;
  
  // 首先尝试找到偏好的口音
  const preferredAudio = phonetics.find(p => 
    p.audio && p.audio.includes(`-${preferredAccent}.mp3`)
  );
  
  if (preferredAudio) {
    audioUrl = preferredAudio.audio;
  } else {
    // 如果没有偏好的口音，使用第一个可用的音频
    const firstAvailable = phonetics.find(p => p.audio);
    if (firstAvailable) {
      audioUrl = firstAvailable.audio;
    }
  }
  
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  }
};

// 文本处理工具
export const cleanWord = (word) => {
  return word.toLowerCase().replace(/[^a-z]/g, '');
};

// Escape special characters for use in regular expressions
export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const highlightWordInText = (text, word) => {
  const escapedWord = escapeRegExp(word);
  const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
  return text.replace(regex, (match) =>
    `<strong class="text-indigo-600 dark:text-indigo-400">${match}</strong>`
  );
};

// 文档处理工具
export const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = (content || '').split(' ').length;
  return Math.round(wordCount / wordsPerMinute);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// 时间格式化工具
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
};

// 数据导出工具
export const exportToCSV = (data, filename = 'data.csv') => {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  if (Array.isArray(data) && data.length > 0) {
    // 获取标题行
    const headers = Object.keys(data[0]);
    csvContent += headers.join(',') + "\r\n";
    
    // 添加数据行
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // 处理包含逗号或引号的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += values.join(',') + "\r\n";
    });
  }
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 单词本导出专用函数
export const exportWordbookToCSV = (wordbook) => {
  const data = Object.entries(wordbook).map(([word, entry]) => ({
    word,
    definition: entry.def,
    status: entry.status,
    difficulty: entry.difficulty,
    added: entry.added,
    sentences: entry.sentences.map(s => s.text).join('; '),
    notes: entry.notes || '',
    tags: (entry.tags || []).join('; ')
  }));
  
  exportToCSV(data, 'my_wordbook.csv');
};

// 存储工具
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

// 性能优化工具

// 节流函数 - 限制函数在指定时间内只执行一次
export const throttle = (func, delay) => {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func(...args);
  };
};

// 防抖函数 - 延迟执行函数，如果在延迟时间内再次调用则重新计时
export const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// 缓存计算结果的记忆化函数
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// 计算组件渲染时间的工具函数
export const measureRenderTime = (Component) => {
  return (props) => {
    const startTime = performance.now();
    const result = Component(props);
    const endTime = performance.now();
    console.log(`${Component.name || 'Component'} rendered in ${endTime - startTime}ms`);
    return result;
  };
};
