import React, { useState, useEffect } from 'react';
import { 
  Files, 
  FileText, 
  Calendar, 
  Tag, 
  BookOpen, 
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Hash,
  Clock
} from 'lucide-react';
import SidebarHeader from "../../common/layout/SidebarHeader";
import SidebarButton from "../../common/buttons/SidebarButton";

const RelatedDocuments = ({ document, documents = [] }) => {
  const [relatedDocs, setRelatedDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('similarity');
  const [filteredDocs, setFilteredDocs] = useState([]);

  useEffect(() => {
    if (document && documents.length > 0) {
      findRelatedDocuments();
    }
  }, [document, documents]);

  useEffect(() => {
    filterAndSortDocuments();
  }, [relatedDocs, searchTerm, sortBy]);

  const findRelatedDocuments = () => {
    if (!document || !documents) return;

    const currentTags = document.tags || [];
    const currentWords = Array.from(document.words || []);
    
    const related = documents
      .filter(doc => doc.id !== document.id) // 排除当前文档
      .map(doc => {
        const docTags = doc.tags || [];
        const docWords = Array.from(doc.words || []);
        
        // 计算相似度得分
        let similarityScore = 0;
        
        // 标签匹配 (权重: 3)
        const commonTags = currentTags.filter(tag => docTags.includes(tag));
        similarityScore += commonTags.length * 3;
        
        // 单词匹配 (权重: 1)
        const commonWords = currentWords.filter(word => docWords.includes(word));
        similarityScore += commonWords.length;
        
        // 标题相似度 (简单关键词匹配)
        const currentTitleWords = document.title.toLowerCase().split(/\s+/);
        const docTitleWords = doc.title.toLowerCase().split(/\s+/);
        const titleMatches = currentTitleWords.filter(word => 
          word.length > 3 && docTitleWords.some(dw => dw.includes(word) || word.includes(dw))
        );
        similarityScore += titleMatches.length * 2;

        return {
          ...doc,
          similarityScore,
          commonTags,
          commonWords: commonWords.slice(0, 5), // 只显示前5个
          titleMatches
        };
      })
      .filter(doc => doc.similarityScore > 0) // 只显示有相关性的文档
      .sort((a, b) => b.similarityScore - a.similarityScore);

    setRelatedDocs(related);
  };

  const filterAndSortDocuments = () => {
    let filtered = [...relatedDocs];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'similarity':
          return b.similarityScore - a.similarityScore;
        case 'recent':
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'tags':
          return (b.commonTags?.length || 0) - (a.commonTags?.length || 0);
        default:
          return b.similarityScore - a.similarityScore;
      }
    });

    setFilteredDocs(filtered);
  };

  const getRelationshipDescription = (doc) => {
    const relationships = [];
    
    if (doc.commonTags?.length > 0) {
      relationships.push(`${doc.commonTags.length} 个共同标签`);
    }
    
    if (doc.commonWords?.length > 0) {
      relationships.push(`${doc.commonWords.length} 个相同词汇`);
    }
    
    if (doc.titleMatches?.length > 0) {
      relationships.push('相似主题');
    }

    return relationships.join(', ') || '相关内容';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getSimilarityLevel = (score) => {
    if (score >= 10) return { level: 'high', color: 'green', label: 'High' };
    if (score >= 5) return { level: 'medium', color: 'yellow', label: 'Medium' };
    return { level: 'low', color: 'gray', label: 'Low' };
  };

  if (!document) {
    return (
      <div className="flex flex-col h-full">
        <SidebarHeader icon={Files} title="相关文档" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <Files className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              未选择文档
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              请选择一个文档来查找相关内容
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <SidebarHeader icon={Files} title="相关文档" />
      
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 custom-scrollbar">
      {/* 搜索和排序 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <Search className="w-4 h-4 mr-2 text-indigo-500" />
          搜索与筛选
        </h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索相关文档..."
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 transition-all"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 transition-all"
        >
          <option value="similarity">按相似度排序</option>
          <option value="recent">最近更新</option>
          <option value="alphabetical">字母排序</option>
          <option value="tags">按共同标签</option>
        </select>
      </div>

      {/* 当前文档标签 */}
      {document.tags && document.tags.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            当前文档标签:
          </h4>
          <div className="flex flex-wrap gap-2">
            {document.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700"
              >
                <Hash className="w-3 h-3 mr-1.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 相关文档列表 */}
      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-12">
            <Files className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              未找到相关文档
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              具有共同标签或相似内容的文档将显示在这里
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const similarity = getSimilarityLevel(doc.similarityScore);
            
            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-200 cursor-pointer group"
              >
                {/* 文档头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {doc.title}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full bg-${similarity.color}-100 dark:bg-${similarity.color}-900/20 text-${similarity.color}-800 dark:text-${similarity.color}-300`}>
                      {similarity.label === 'High' ? '高相似' : similarity.label === 'Medium' ? '中等' : '低相似'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* 关系描述 */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {getRelationshipDescription(doc)}
                </p>

                {/* 共同标签 */}
                {doc.commonTags && doc.commonTags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {doc.commonTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 共同单词 */}
                {doc.commonWords && doc.commonWords.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                      共同词汇:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.commonWords.map((word, index) => (
                        <span
                          key={index}
                          className="inline-block px-2.5 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-lg"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 文档信息 */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1.5" />
                      <span>{formatDate(doc.updatedAt || doc.createdAt)}</span>
                    </div>
                    {doc.words && (
                      <div className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1.5" />
                        <span>{Array.from(doc.words).length} 词汇</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1.5" />
                    <span>得分: {doc.similarityScore}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 统计信息 */}
      {relatedDocs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" />
            相关性统计
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {relatedDocs.filter(doc => getSimilarityLevel(doc.similarityScore).level === 'high').length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">高相似度</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {relatedDocs.reduce((acc, doc) => acc + (doc.commonTags?.length || 0), 0)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">共同标签</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {relatedDocs.reduce((acc, doc) => acc + (doc.commonWords?.length || 0), 0)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">相同词汇</div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default RelatedDocuments;
