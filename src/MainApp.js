import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

import { useAppContext } from './context/AppContext';
import aiService from './services/aiService';
import DictionaryService from './services/dictionary';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import SearchOverlay from './components/common/modals/SearchOverlay';
import LoadingSpinner from './components/common/layout/LoadingSpinner';
import ContextMenu from './components/common/layout/ContextMenu';

// 懒加载非关键组件以减少初始加载时间
const ReadingLibrary = lazy(() => import('./components/modules/ReadingLibrary'));
const Reader = lazy(() => import('./components/modules/Reader'));
const Wordbook = lazy(() => import('./components/modules/Wordbook'));
const ReviewCenter = lazy(() => import('./components/modules/ReviewCenter'));
const SettingsPage = lazy(() => import('./components/modules/SettingsPage'));
const UploadModal = lazy(() => import('./components/common/modals/UploadModal'));
const ConfirmDeleteModal = lazy(() => import('./components/common/modals/ConfirmDeleteModal'));

// eslint-disable-next-line no-undef
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const MainApp = () => {
  const [askAIRequest, setAskAIRequest] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // 侧边栏显示状态
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // 侧边栏展开状态
  const [currentHash, setCurrentHash] = useState(window.location.hash || ''); // 当前hash状态
  
  const {
    theme, accent, activeModule,
    documents, wordbook, settings,
    selectedDoc,
    isLoading, showWelcome,
    handleNavClick, handleSettingChange,
    openDocument,
    handleWordToggle, handleDeleteDocument,
    handleEditDocument, handleAddDocument,
    handleWordStatusUpdate, closeUploadModal,
    showUploadModal, editingDoc,
    showDeleteConfirm, setShowDeleteConfirm,
    showSearch, setShowSearch,
    setShowWelcome, setEditingDoc,
    setShowUploadModal,
    showContextMenu, setShowContextMenu,
    contextMenuPosition, selectedText, textContext, contextMenuData,
    handleCopyText, handleAddToWordbook,
    userId, firestoreService, localStorageService
  } = useAppContext();

  // 监听 hash 变化并自动跳转到设置页面
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash;
      setCurrentHash(newHash);
      // 只有 hash 变为 #settings/xxx 且当前不是 settings 时才跳转
      if (newHash.startsWith('#settings/')) {
        if (activeModule !== 'settings') {
          handleNavClick('settings');
        }
      }
    };

    // 初始检查hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
    // 依赖只监听 activeModule
  }, [activeModule]);

  // 初始化AI服务配置
  useEffect(() => {
    // 只要有API密钥就配置AI服务，不再检查aiEnabled
    if (settings.aiApiKey) {
      aiService.configure({
        provider: settings.aiProvider || "openai",
        apiKey: settings.aiApiKey,
        baseURL: settings.aiBaseURL,
        model: settings.aiModel,
      });
    }
  }, [settings.aiApiKey, settings.aiProvider, settings.aiBaseURL, settings.aiModel]);

  // 初始化词典服务配置
  useEffect(() => {
    // 强制使用新的代理URL，忽略用户之前的设置
    const newConfig = {
      apiProvider: settings.dictionaryApiProvider || 'free',
      apiKey: settings.dictionaryApiKey || '',
      baseURL: '/api/dictionary/v2/entries/en', // 强制使用代理URL
      customEndpoint: settings.dictionaryCustomEndpoint || ''
    };
    
    DictionaryService.configure(newConfig);
    
    // 如果用户的设置中还是旧的URL，更新它
    if (settings.dictionaryBaseURL && settings.dictionaryBaseURL.includes('api.dictionaryapi.dev')) {
      handleSettingChange('dictionaryBaseURL', '/api/dictionary/v2/entries/en');
    }
  }, [settings, handleSettingChange]);

  // 处理"Ask AI"功能 - 设置Ask AI请求
  const handleAskAIInSidebar = (text, context) => {
    // 设置Ask AI请求状态
    setAskAIRequest({ text, context, timestamp: Date.now() });
  };

  // 切换侧边栏显示状态（完全显示/隐藏）
  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  // 切换侧边栏展开状态（展开主功能区/只显示按钮栏）
  const toggleSidebarExpanded = () => {
    setIsSidebarExpanded(prev => !prev);
  };

  // 包装 handleNavClick，切换到非 settings 时清空 hash
  const handleNavClickWithHash = (module) => {
    if (module !== 'settings' && window.location.hash.startsWith('#settings/')) {
      window.location.hash = '';
      setCurrentHash('');
    }
    handleNavClick(module);
  };

  const renderModule = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"><Loader className="animate-spin text-indigo-500" size={48} /></div>;
    }
    
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-full"><LoadingSpinner size={48} /></div>}>
        {(() => {
          switch (activeModule) {
            case 'library':
              return <ReadingLibrary documents={documents} openDocument={openDocument} onUpload={() => setShowUploadModal(true)} onDelete={(doc) => setShowDeleteConfirm(doc)} onEdit={(doc) => { setEditingDoc(doc); setShowUploadModal(true); }} showWelcome={showWelcome} onDismissWelcome={() => setShowWelcome(false)} />;
            case 'reader':
              return <Reader 
                doc={selectedDoc} 
                knownWords={Object.keys(wordbook)} 
                wordbook={wordbook}
                onExit={() => handleNavClick('library')} 
                onWordToggle={handleWordToggle}
                documents={documents}
                settings={settings}
                onAskAI={handleAskAIInSidebar}
                askAIRequest={askAIRequest}
                onAskAIRequestProcessed={() => setAskAIRequest(null)}
                isSidebarVisible={isSidebarVisible}
                onToggleSidebar={toggleSidebar}
                isSidebarExpanded={isSidebarExpanded}
                onSidebarExpandedChange={setIsSidebarExpanded}
              />;
            case 'wordbook':
              return <Wordbook wordbook={wordbook} accent={accent} />;
            case 'review':
              return <ReviewCenter wordbook={wordbook} onWordMastered={handleWordStatusUpdate} accent={accent} />;
            case 'settings':
              return <SettingsPage 
                userId={userId} 
                wordbook={wordbook} 
                documents={documents} 
                firestoreService={firestoreService} 
                accent={accent} 
                onSettingChange={handleSettingChange} 
                appId={appId} 
                settings={settings} 
                localStorageService={localStorageService}
                currentHash={currentHash}
              />;
            default:
              return <ReadingLibrary documents={documents} openDocument={openDocument} onUpload={() => setShowUploadModal(true)} onDelete={(doc) => setShowDeleteConfirm(doc)} onEdit={(doc) => { setEditingDoc(doc); setShowUploadModal(true); }} showWelcome={showWelcome} onDismissWelcome={() => setShowWelcome(false)} />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300 ${theme}`}>
      <Sidebar 
        activeModule={activeModule} 
        onModuleChange={handleNavClickWithHash} 
        onThemeToggle={() => handleSettingChange('theme', theme === 'light' ? 'dark' : 'light')} 
        theme={theme} 
      />

      <main className="flex-1 flex flex-col relative">
        <Header
          activeModule={activeModule}
          selectedDoc={selectedDoc}
          onBackToLibrary={() => handleNavClickWithHash('library')}
          onSearchClick={() => setShowSearch(true)}
          showSidebarToggle={activeModule === 'reader'}
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={toggleSidebar}
          isSidebarExpanded={isSidebarExpanded}
          onToggleSidebarExpanded={toggleSidebarExpanded}
        />
        <div className={`flex-1 ${activeModule === 'settings' ? 'overflow-hidden' : 'p-6 overflow-y-auto'}`}>
          <Suspense fallback={<div className="flex justify-center items-center h-full"><LoadingSpinner size={48} /></div>}>
            {renderModule(activeModule)}
          </Suspense>
        </div>
      </main>
      
      {/* 上下文菜单 */}
      <ContextMenu
        isVisible={showContextMenu}
        position={contextMenuPosition}
        selectedText={selectedText}
        context={textContext}
        isHighlighted={contextMenuData?.isHighlighted || false}
        onClose={setShowContextMenu ? () => setShowContextMenu(false) : undefined}
        onCopy={handleCopyText}
        onAskAI={handleAskAIInSidebar}
        onAddToWordbook={handleAddToWordbook}
        onRemoveHighlight={contextMenuData?.onRemoveHighlight}
        onHighlight={contextMenuData?.onHighlight}
      />
      
      {/* 使用Suspense懒加载模态框 */}
      <Suspense fallback={<div className="fixed inset-0 bg-black/30 flex items-center justify-center"><LoadingSpinner /></div>}>
        {showSearch && <SearchOverlay wordbook={wordbook} onClose={() => setShowSearch(false)} accent={accent} />}
        {showUploadModal && <UploadModal onClose={closeUploadModal} onAdd={handleAddDocument} onEdit={handleEditDocument} editingDoc={editingDoc} />}
        {showDeleteConfirm && <ConfirmDeleteModal doc={showDeleteConfirm} onConfirm={handleDeleteDocument} onCancel={() => setShowDeleteConfirm(null)} />}
      </Suspense>
    </div>
  );
};

export default MainApp;
