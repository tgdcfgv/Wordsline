import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  BookOpen, 
  Clock, 
  TrendingUp,
  BarChart3,
  Calendar,
  Filter,
  X,
  ChevronDown,
  Volume2
} from 'lucide-react';
import SidebarHeader from '../../common/layout/SidebarHeader';
import SidebarButton from '../../common/buttons/SidebarButton';

const WordHistory = ({ document, wordbook }) => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [stats, setStats] = useState({
    totalWords: 0,
    studiedWords: 0,
    masteredWords: 0,
    todayWords: 0
  });

  useEffect(() => {
    if (wordbook && document) {
      generateHistory();
    }
  }, [wordbook, document]);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchTerm, filterStatus, sortBy]);

  const generateHistory = () => {
    if (!wordbook || !document) return;

    // 从wordbook中获取与当前文档相关的单词
    const documentWords = Array.isArray(wordbook) ? wordbook : Object.values(wordbook);
    const docHistory = documentWords.filter(word => 
      word.sentences?.some(sentence => sentence.docId === document.id)
    ).map(word => ({
      ...word,
      lookupTime: word.added || word.addedAt || new Date().toISOString(),
      fromDocument: document.title
    }));

    setHistory(docHistory);
    calculateStats(docHistory);
  };

  const calculateStats = (words) => {
    const today = new Date().toDateString();
    const totalWords = words.length;
    const studiedWords = words.filter(w => w.status === 'learning' || w.status === 'reviewing').length;
    const masteredWords = words.filter(w => w.status === 'mastered').length;
    const todayWords = words.filter(w => {
      const wordDate = new Date(w.lookupTime).toDateString();
      return wordDate === today;
    }).length;

    setStats({
      totalWords,
      studiedWords,
      masteredWords,
      todayWords
    });
  };

  const filterAndSortHistory = () => {
    let filtered = [...history];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 状态过滤
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lookupTime) - new Date(a.lookupTime);
        case 'alphabetical':
          return (a.word || '').localeCompare(b.word || '');
        case 'frequency':
          return (b.count || 0) - (a.count || 0);
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  };

  const playPronunciation = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'learning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'mastered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <SidebarHeader icon={History} title="词汇记录" />
      
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 custom-scrollbar">
      {/* 统计概览 */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2 text-indigo-500" />
          学习统计
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">总词数</span>
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {stats.totalWords}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">已掌握</span>
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {stats.masteredWords}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">学习中</span>
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {stats.studiedWords}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">今日</span>
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {stats.todayWords}
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <Search className="w-4 h-4 mr-2 text-indigo-500" />
          搜索与过滤
        </h4>
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索单词或释义..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* 过滤和排序 */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="all">所有状态</option>
            <option value="learning">学习中</option>
            <option value="reviewing">复习中</option>
            <option value="mastered">已掌握</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="recent">最近查看</option>
            <option value="alphabetical">字母排序</option>
            <option value="frequency">查看频率</option>
          </select>
        </div>
      </div>

      {/* 历史记录列表 */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {searchTerm || filterStatus !== 'all' ? '没有匹配的词汇' : '还没有词汇记录'}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? '尝试调整搜索条件或过滤器' 
                : '开始阅读来建立你的词汇记录'
              }
            </p>
          </div>
        ) : (
          filteredHistory.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                      {item.word}
                    </h4>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status === 'learning' ? '学习中' : 
                       item.status === 'reviewing' ? '复习中' : 
                       item.status === 'mastered' ? '已掌握' : '新词'}
                    </span>
                    <button
                      onClick={() => playPronunciation(item.word)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="播放发音"
                    >
                      <Volume2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-indigo-500" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                    {item.definition || '暂无释义'}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1.5" />
                      {formatTime(item.lookupTime)}
                    </span>
                    {item.count && (
                      <span>
                        查看 {item.count} 次
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 底部提示 */}
      {filteredHistory.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            显示 {filteredHistory.length} / {history.length} 个词汇
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default WordHistory;
