import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  MessageSquare,
  History,
  StickyNote,
  Volume2,
  Files,
  ChevronLeft,
  ChevronRight,
  X,
  Menu
} from 'lucide-react';
import DocumentInfo from './document/DocumentInfo';
import AIAssistant from './ai/AIAssistant';
import WordHistory from './history/WordHistory';
import ReadingNotes from './notes/ReadingNotes';
import AudioMode from './AudioMode';
import RelatedDocuments from './document/RelatedDocuments';

const RightSidebar = ({ 
  document, 
  wordbook, 
  onAddNote, 
  onUpdateTags,
  documents = [],
  settings = {},
  askAIRequest,
  onAskAIRequestProcessed,
  onToggleSidebar, // 新增：控制侧边栏展开收起的回调
  isExpanded: externalIsExpanded, // 新增：外部控制的展开状态
  onExpandedChange // 新增：通知父组件展开状态变化
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [pendingAIMessage, setPendingAIMessage] = useState(null);
  
  // 使用外部传入的展开状态，如果没有则使用内部状态
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;

  // 监听外部的Ask AI请求
  useEffect(() => {
    if (askAIRequest) {
      setActiveTab('ai');
      setPendingAIMessage(askAIRequest);
      // 自动展开侧边栏
      if (externalIsExpanded !== undefined && onExpandedChange) {
        onExpandedChange(true);
      } else {
        setInternalIsExpanded(true);
      }
      // 通知父组件请求已处理
      if (onAskAIRequestProcessed) {
        onAskAIRequestProcessed();
      }
    }
  }, [askAIRequest, onAskAIRequestProcessed, externalIsExpanded, onExpandedChange]);

  // 侧边栏标签页配置
  const tabs = [
    {
      id: 'info',
      label: '文档信息',
      labelEn: 'Document Info',
      icon: FileText,
      component: DocumentInfo
    },
    {
      id: 'ai',
      label: 'AI助手',
      labelEn: 'AI Assistant',
      icon: MessageSquare,
      component: AIAssistant
    },
    {
      id: 'history',
      label: '词汇记录',
      labelEn: 'Word History',
      icon: History,
      component: WordHistory
    },
    {
      id: 'notes',
      label: '阅读笔记',
      labelEn: 'Reading Notes',
      icon: StickyNote,
      component: ReadingNotes
    },
    {
      id: 'audio',
      label: '语音模式',
      labelEn: 'Audio Mode',
      icon: Volume2,
      component: AudioMode
    },
    {
      id: 'related',
      label: '相关文档',
      labelEn: 'Related Docs',
      icon: Files,
      component: RelatedDocuments
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || DocumentInfo;
  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  // 处理侧边栏展开 - 现在主要通过顶部按钮控制
  const handleExpand = useCallback(() => {
    if (externalIsExpanded !== undefined && onExpandedChange) {
      onExpandedChange(true);
    } else {
      setInternalIsExpanded(true);
    }
  }, [externalIsExpanded, onExpandedChange]);

  // 处理侧边栏收起 - 现在主要通过顶部按钮控制
  const handleCollapse = useCallback(() => {
    if (externalIsExpanded !== undefined && onExpandedChange) {
      onExpandedChange(false);
    } else {
      setInternalIsExpanded(false);
    }
  }, [externalIsExpanded, onExpandedChange]);

  // 处理标签切换
  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
    if (!isExpanded) {
      // 如果未展开，点击标签时自动展开
      if (externalIsExpanded !== undefined && onExpandedChange) {
        onExpandedChange(true);
      } else {
        setInternalIsExpanded(true);
      }
    }
  }, [isExpanded, externalIsExpanded, onExpandedChange]);

  // 键盘快捷键支持 - 主要用于通过顶部按钮控制的展开收起
  useEffect(() => {
    // 检查是否在浏览器环境中，且 document.addEventListener 可用
    if (
      typeof window === 'undefined' ||
      typeof document === 'undefined' ||
      typeof document.addEventListener !== 'function'
    ) {
      return;
    }

    const handleKeyDown = (event) => {
      // Escape 键收起侧边栏
      if (event.key === 'Escape' && isExpanded) {
        event.preventDefault();
        handleCollapse();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, handleCollapse]);

  // 暴露展开收起方法给父组件，以便顶部按钮调用
  useEffect(() => {
    // 这里可以通过ref或其他方式暴露方法给父组件
    // 但由于我们已经通过props管理状态，这里主要是为了响应外部变化
    
    // 安全检查：确保在正确的环境中
    if (typeof window === 'undefined') {
      console.warn('RightSidebar: window is undefined, skipping browser-specific setup');
      return;
    }
  }, []);

  return (
    <div className="fixed right-0 top-[73px] h-[calc(100vh-73px)] z-30 flex">
      {/* 主功能区域 - 根据isExpanded控制显示，向左展开 */}
      <div 
        className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-l border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full'
        }`}
      >
        {isExpanded && (
          <>
            

            {/* 功能区内容 */}
            <div className="flex-1 overflow-y-auto sidebar-scroll">
              <ActiveComponent
                document={document}
                wordbook={wordbook}
                onAddNote={onAddNote}
                onUpdateTags={onUpdateTags}
                documents={documents}
                settings={settings}
                pendingMessage={activeTab === 'ai' ? pendingAIMessage : null}
                onMessageProcessed={() => setPendingAIMessage(null)}
              />
            </div>
          </>
        )}
      </div>

      {/* 窄条按钮栏 - 固定在最右边 */}
      <div className="w-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-l border-gray-200 dark:border-gray-700 shadow-lg flex flex-col">
        {/* 功能按钮区域 */}
        <div className="flex-1 py-4 space-y-2 relative">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <div key={tab.id} className="px-2 relative">
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 relative ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 shadow-md scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-500 hover:scale-105'
                  }`}
                  title={tab.label}
                  aria-label={tab.label}
                  aria-pressed={isActive}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </div>
            );
          })}
          
          {/* 底部渐变装饰 */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-800/50 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
