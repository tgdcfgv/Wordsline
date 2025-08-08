import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Hash, 
  Plus, 
  X, 
  Tag as TagIcon,
  TrendingUp,
  FileText,
  BarChart3
} from 'lucide-react';
import SidebarHeader from '../../common/layout/SidebarHeader';
import SidebarButton from '../../common/buttons/SidebarButton';

const DocumentInfo = ({ document, onUpdateTags }) => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [stats, setStats] = useState({
    wordCount: 0,
    paragraphCount: 0,
    knownWords: 0,
    readingTime: 0
  });

  useEffect(() => {
    if (document) {
      setTags(document.tags || []);
      calculateStats();
    }
  }, [document]);

  const calculateStats = () => {
    if (!document?.content) return;

    const content = document.content;
    const words = content.split(/\s+/).filter(word => word.trim().length > 0);
    const paragraphs = content.split('\n').filter(p => p.trim().length > 0);
    const knownWords = document.words ? document.words.size || document.words.length : 0;
    
    // 估算阅读时间 (平均每分钟200词)
    const estimatedReadingTime = Math.ceil(words.length / 200);

    setStats({
      wordCount: words.length,
      paragraphCount: paragraphs.length,
      knownWords: knownWords,
      readingTime: estimatedReadingTime
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      onUpdateTags(document.id, updatedTags);
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    onUpdateTags(document.id, updatedTags);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!document) {
    return (
      <div className="flex flex-col h-full">
        <SidebarHeader icon={FileText} title="文档信息" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              未选择文档
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              请选择一个文档来查看其详细信息
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <SidebarHeader icon={FileText} title="文档信息" />
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 custom-scrollbar">
        {/* 文档基本信息 */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
            基本信息
          </h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-3 text-indigo-500" />
              <span className="font-medium mr-2">添加时间:</span>
              <span>{formatDate(document.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-3 text-indigo-500" />
              <span className="font-medium mr-2">更新时间:</span>
              <span>{formatDate(document.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* 阅读统计 */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-indigo-500" />
            阅读统计
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center mb-2">
                <FileText className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-800 dark:text-blue-300">总词数</span>
              </div>
              <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {stats.wordCount.toLocaleString()}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-800 dark:text-green-300">预计时间</span>
              </div>
              <div className="text-xl font-bold text-green-900 dark:text-green-100">
                {stats.readingTime} 分钟
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
              <div className="flex items-center mb-2">
                <Hash className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-purple-800 dark:text-purple-300">段落数</span>
              </div>
              <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {stats.paragraphCount}
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30">
              <div className="flex items-center mb-2">
                <BookOpen className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-medium text-orange-800 dark:text-orange-300">已知词汇</span>
              </div>
              <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
                {stats.knownWords}
              </div>
            </div>
          </div>
          {/* 进度条 */}
          {stats.wordCount > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="font-medium">词汇掌握进度</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round((stats.knownWords / stats.wordCount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min((stats.knownWords / stats.wordCount) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* 标签管理 */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <TagIcon className="w-4 h-4 mr-2 text-indigo-500" />
            标签管理
          </h4>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
            {/* 现有标签 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full group border border-indigo-200 dark:border-indigo-800 transition-all duration-200 hover:shadow-sm"
                  >
                    <TagIcon className="w-3 h-3 mr-1.5" />
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 hover:text-red-500 transition-colors" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* 添加新标签 */}
            {isAddingTag ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="输入标签名称"
                  className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 transition-all"
                  style={{ maxWidth: '120px' }}
                  autoFocus
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
                >
                  添加
                </button>
                <button
                  onClick={() => {
                    setIsAddingTag(false);
                    setNewTag('');
                  }}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 whitespace-nowrap"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingTag(true)}
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加标签
              </button>
            )}
          </div>
        </div>

        {/* 文档摘要 */}
        {document.content && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-indigo-500" />
              内容预览
            </h4>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {document.content.substring(0, 300)}
                {document.content.length > 300 && '...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentInfo;
