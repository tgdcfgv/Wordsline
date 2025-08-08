import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, PanelRightOpen, PanelRightClose, ChevronLeft, ChevronRight } from 'lucide-react';
import { modules } from '../../constants/config';

const Header = ({ 
  activeModule, 
  selectedDoc, 
  onBackToLibrary, 
  onSearchClick,
  showSidebarToggle = false,
  isSidebarVisible = false,
  onToggleSidebar,
  isSidebarExpanded = false,
  onToggleSidebarExpanded
}) => {
  const { t } = useTranslation();

  const getModuleTitle = () => {
    switch (activeModule) {
      case modules.LIBRARY:
        return t('Library');
      case modules.WORDBOOK:
        return t('Wordbook');
      case modules.REVIEW:
        return t('Review');
      case modules.SETTINGS:
        return t('Settings');
      default:
        return activeModule;
    }
  };

  if (activeModule === modules.READER && selectedDoc) {
    return (
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <button 
          onClick={onBackToLibrary} 
          className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold"
        >
          <ArrowLeft size={20} className="mr-2" />
          {t('Back')}
        </button>
        
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 truncate mx-4 flex-1 text-center">
          {selectedDoc.title}
        </h1>
        
        <div className="flex items-center space-x-2">
          {/* 侧边栏切换按钮 - 只在阅读器模式显示 */}
          {showSidebarToggle && (
            <>
              {/* 侧边栏完全显示/隐藏按钮 */}
              <button
                onClick={onToggleSidebar}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                title={isSidebarVisible ? "隐藏侧边栏" : "显示侧边栏"}
              >
                {isSidebarVisible ? (
                  <PanelRightClose className="w-5 h-5" />
                ) : (
                  <PanelRightOpen className="w-5 h-5" />
                )}
              </button>
              
              {/* 侧边栏展开/收起按钮 - 只在侧边栏可见时显示 */}
              {isSidebarVisible && (
                <button
                  onClick={onToggleSidebarExpanded}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                  title={isSidebarExpanded ? "收起侧边栏功能区" : "展开侧边栏功能区"}
                >
                  {isSidebarExpanded ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : (
                    <ChevronLeft className="w-5 h-5" />
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize">
        {getModuleTitle()}
      </h1>
      
      {activeModule !== modules.SETTINGS && (
        <div className="relative w-1/3">
          <div 
            onClick={onSearchClick} 
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg py-2 pl-10 pr-4 cursor-pointer flex items-center"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} />
            <span>{t('Search your personal dictionary...')}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
