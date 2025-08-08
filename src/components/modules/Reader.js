import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import TextHighlighter from '../common/TextHighlighter';
import SimpleContextMenu from '../common/SimpleContextMenu';
import simpleDictionaryService from '../../services/simpleDictionary';
import wordHighlightManager from '../../services/wordHighlightManager';
import RightSidebar from '../features/RightSidebar';

/**
 * 简化的阅读器组件（优化版本）
 */
const Reader = ({ 
  doc, 
  knownWords = [], 
  wordbook = {}, 
  onWordToggle, 
  documents = [], 
  settings = {}, 
  onAskAI,
  askAIRequest,
  onAskAIRequestProcessed,
  isSidebarVisible = true, // 新增：从MainApp传递的侧边栏显示状态
  onToggleSidebar, // 新增：切换侧边栏显示的回调
  isSidebarExpanded = false, // 新增：侧边栏展开状态
  onSidebarExpandedChange // 新增：侧边栏展开状态变化回调
}) => {
  const [paragraphs, setParagraphs] = useState([]);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { x: 0, y: 0 },
    selectedText: '',
    isHighlighted: false
  });

  // 切换侧边栏显示状态 - 现在使用从MainApp传递的回调
  const toggleSidebar = useCallback(() => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  }, [onToggleSidebar]);

  // 长按相关状态
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [isLongPress, setIsLongPress] = useState(false);

  // 处理文档内容分割
  useEffect(() => {
    if (!doc || !doc.content) {
      setParagraphs([]);
      return;
    }

    const splitParagraphs = doc.content
      .split('\n')
      .filter(p => p.trim().length > 0);
    
    setParagraphs(splitParagraphs);
  }, [doc]);

  // 初始化高亮管理器
  useEffect(() => {
    // 从knownWords设置初始高亮
    if (knownWords && knownWords.length > 0) {
      wordHighlightManager.setHighlights(knownWords);
    }

    // 监听高亮变化
    const handleHighlightChange = (action, word) => {
      setHighlightedWords(wordHighlightManager.getAllHighlighted());
    };

    wordHighlightManager.addListener(handleHighlightChange);
    setHighlightedWords(wordHighlightManager.getAllHighlighted());

    return () => {
      wordHighlightManager.removeListener(handleHighlightChange);
    };
  }, [knownWords]);

  // 处理单词点击
  const handleWordClick = useCallback(async (word) => {
    console.log('Word clicked:', word);
    
    try {
      // 切换高亮状态
      const isNowHighlighted = wordHighlightManager.toggleHighlight(word);
      
      // 如果添加了高亮，获取单词定义
      if (isNowHighlighted) {
        console.log('Getting definition for:', word);
        const definition = await simpleDictionaryService.getWordDefinition(word);
        
        if (definition) {
          console.log('Definition found:', definition);
        } else {
          console.log('No definition found, word still highlighted');
        }
      }

      // 调用原始的onWordToggle（如果存在）
      if (onWordToggle) {
        onWordToggle(word, '', !isNowHighlighted);
      }
    } catch (error) {
      console.error('Error handling word click:', error);
    }
  }, [onWordToggle]);

  // 处理文本选择
  const handleTextSelection = useCallback((event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const isHighlighted = wordHighlightManager.isHighlighted(selectedText);
      
      setContextMenu({
        isVisible: true,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.bottom + 10
        },
        selectedText,
        isHighlighted
      });
    }
  }, []);

  // 处理长按开始
  const handleTouchStart = useCallback((event) => {
    setIsLongPress(false);
    const timer = setTimeout(() => {
      setIsLongPress(true);
      handleTextSelection(event);
    }, 500);
    setLongPressTimer(timer);
  }, [handleTextSelection]);

  // 处理长按结束
  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  // 处理右键菜单
  const handleContextMenuClick = useCallback((event) => {
    event.preventDefault();
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      const isHighlighted = wordHighlightManager.isHighlighted(selectedText);
      
      // 只对高亮内容显示右键菜单
      if (isHighlighted) {
        setContextMenu({
          isVisible: true,
          position: {
            x: event.clientX,
            y: event.clientY
          },
          selectedText,
          isHighlighted: true
        });
      }
    }
  }, []);

  // 上下文菜单处理函数
  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied:', text);
    }).catch(err => {
      console.error('Failed to copy text:', err);
    });
  }, []);

  const handleAskAI = useCallback((text) => {
    if (onAskAI) {
      onAskAI(`请解释这个词或短语: "${text}"`);
    }
  }, [onAskAI]);

  const handleToggleHighlight = useCallback((text) => {
    wordHighlightManager.toggleHighlight(text);
  }, []);

  const handleAddToWordbook = useCallback((text) => {
    // 对于短语，直接添加高亮
    wordHighlightManager.addHighlight(text);
    
    // 调用原始的onWordToggle
    if (onWordToggle) {
      onWordToggle(text, '');
    }
  }, [onWordToggle]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isVisible: false }));
  }, []);

  // 处理笔记和标签（为RightSidebar准备）
  const handleAddNote = useCallback((note) => {
    console.log('Adding note:', note);
  }, []);

  const handleUpdateTags = useCallback((newTags) => {
    console.log('Updating tags:', newTags);
  }, []);

  // 渲染段落组件
  const ParagraphComponent = useMemo(() => 
    ({ paragraph, index }) => (
      <div 
        key={index}
        className="mb-4 last:mb-0 select-text"
        onMouseUp={handleTextSelection}
        onContextMenu={handleContextMenuClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <TextHighlighter
          text={paragraph}
          highlightedWords={highlightedWords}
          onWordClick={handleWordClick}
          className="text-lg leading-relaxed"
        />
      </div>
    ), [highlightedWords, handleWordClick, handleTextSelection, handleContextMenuClick, handleTouchStart, handleTouchEnd]
  );

  const renderParagraph = useCallback((index) => (
    <ParagraphComponent paragraph={paragraphs[index]} index={index} />
  ), [paragraphs, ParagraphComponent]);

  if (!doc) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        选择一个文档开始阅读
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* 主内容区域 - 根据侧边栏状态调整右边距 */}
      <div className={`transition-all duration-300 ease-in-out ${
        isSidebarVisible ? (isSidebarExpanded ? 'pr-96' : 'pr-16') : 'pr-0'
      }`}>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-lg shadow-lg">
            <div className="text-gray-700 dark:text-gray-300 font-serif">
              {paragraphs.length > 100 ? (
                <Virtuoso
                  totalCount={paragraphs.length}
                  itemContent={renderParagraph}
                  className="virtuoso-scroller"
                  style={{ height: 'calc(100vh - 250px)' }}
                  overscan={20}
                />
              ) : (
                paragraphs.map((paragraph, index) => (
                  <ParagraphComponent 
                    key={index}
                    paragraph={paragraph} 
                    index={index}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 右侧侧边栏 - 使用新的优化组件 */}
      {isSidebarVisible && (
        <RightSidebar
          document={doc}
          wordbook={wordbook}
          onAddNote={handleAddNote}
          onUpdateTags={handleUpdateTags}
          documents={documents}
          settings={settings}
          askAIRequest={askAIRequest}
          onAskAIRequestProcessed={onAskAIRequestProcessed}
          onToggleSidebar={onToggleSidebar}
          isExpanded={isSidebarExpanded}
          onExpandedChange={onSidebarExpandedChange}
        />
      )}

      {/* 上下文菜单 */}
      <SimpleContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        selectedText={contextMenu.selectedText}
        isHighlighted={contextMenu.isHighlighted}
        onClose={closeContextMenu}
        onCopy={handleCopy}
        onAskAI={handleAskAI}
        onToggleHighlight={handleToggleHighlight}
        onAddToWordbook={handleAddToWordbook}
      />
    </div>
  );
};

export default Reader;
