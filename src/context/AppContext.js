import React, { createContext, useContext, useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import { modules } from '../constants/config';
import { useAuth } from '../hooks/useAuth';
import { useFirestore, useDocuments, useWordbook, useSettings } from '../hooks/useFirestore';

// 应用状态的初始值
const initialState = {
  activeModule: modules.LIBRARY,
  selectedDoc: null,
  showUploadModal: false,
  editingDoc: null,
  showDeleteConfirm: null,
  showSearch: false,
  showWelcome: false,
  showWordDetail: null,
  showAIChat: false,
  showContextMenu: false,
  contextMenuPosition: { x: 0, y: 0 },
  selectedText: '',
  textContext: '',
  contextMenuData: null,
  aiInitialMessage: '',
  aiInitialContext: ''
};

// 动作类型
export const actionTypes = {
  SET_ACTIVE_MODULE: 'SET_ACTIVE_MODULE',
  SET_SELECTED_DOC: 'SET_SELECTED_DOC',
  SET_SHOW_UPLOAD_MODAL: 'SET_SHOW_UPLOAD_MODAL',
  SET_EDITING_DOC: 'SET_EDITING_DOC',
  SET_SHOW_DELETE_CONFIRM: 'SET_SHOW_DELETE_CONFIRM',
  SET_SHOW_SEARCH: 'SET_SHOW_SEARCH',
  SET_SHOW_WELCOME: 'SET_SHOW_WELCOME',
  SET_SHOW_WORD_DETAIL: 'SET_SHOW_WORD_DETAIL',
  SET_SHOW_AI_CHAT: 'SET_SHOW_AI_CHAT',
  SET_SHOW_CONTEXT_MENU: 'SET_SHOW_CONTEXT_MENU',
  SET_CONTEXT_MENU_DATA: 'SET_CONTEXT_MENU_DATA',
  SET_AI_INITIAL_MESSAGE: 'SET_AI_INITIAL_MESSAGE',
  RESET_UI_STATE: 'RESET_UI_STATE'
};

// Reducer 函数
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_MODULE:
      return {
        ...state,
        activeModule: action.payload,
        selectedDoc: null
      };
    case actionTypes.SET_SELECTED_DOC:
      return {
        ...state,
        selectedDoc: action.payload,
        activeModule: action.payload ? modules.READER : state.activeModule
      };
    case actionTypes.SET_SHOW_UPLOAD_MODAL:
      return {
        ...state,
        showUploadModal: action.payload
      };
    case actionTypes.SET_EDITING_DOC:
      return {
        ...state,
        editingDoc: action.payload,
        showUploadModal: !!action.payload
      };
    case actionTypes.SET_SHOW_DELETE_CONFIRM:
      return {
        ...state,
        showDeleteConfirm: action.payload
      };
    case actionTypes.SET_SHOW_SEARCH:
      return {
        ...state,
        showSearch: action.payload
      };
    case actionTypes.SET_SHOW_WELCOME:
      return {
        ...state,
        showWelcome: action.payload
      };
    case actionTypes.SET_SHOW_WORD_DETAIL:
      return {
        ...state,
        showWordDetail: action.payload
      };
    case actionTypes.SET_SHOW_AI_CHAT:
      return {
        ...state,
        showAIChat: action.payload
      };
    case actionTypes.SET_SHOW_CONTEXT_MENU:
      return {
        ...state,
        showContextMenu: action.payload
      };
    case actionTypes.SET_CONTEXT_MENU_DATA:
      return {
        ...state,
        contextMenuPosition: action.payload.position,
        selectedText: action.payload.selectedText,
        textContext: action.payload.textContext,
        contextMenuData: action.payload
      };
    case actionTypes.SET_AI_INITIAL_MESSAGE:
      return {
        ...state,
        aiInitialMessage: action.payload.message,
        aiInitialContext: action.payload.context
      };
    case actionTypes.RESET_UI_STATE:
      return {
        ...initialState,
        activeModule: state.activeModule
      };
    default:
      return state;
  }
};

// 创建上下文
const AppContext = createContext();

// Provider 组件
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // 使用自定义hooks获取数据
  const { userId, loading: authLoading } = useAuth();
  const localStorageService = useFirestore(userId);
  const { documents, loading: docsLoading } = useDocuments(localStorageService);
  const { wordbook, loading: wordbookLoading } = useWordbook(localStorageService);
  const { settings, loading: settingsLoading, updateSettings } = useSettings(localStorageService);

  // 主题和口音状态
  const [theme, setTheme] = useState(settings.theme || 'light');
  const [accent, setAccent] = useState(settings.accent || 'us');

  // 更新主题和口音当设置改变时
  useEffect(() => {
    setTheme(settings.theme || 'light');
    setAccent(settings.accent || 'us');
  }, [settings]);

  // 应用主题到DOM
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  // 检查是否显示欢迎页面
  useEffect(() => {
    if (!docsLoading && !wordbookLoading && documents.length === 0 && Object.keys(wordbook).length === 0) {
      dispatch({ type: actionTypes.SET_SHOW_WELCOME, payload: true });
    }
  }, [documents, wordbook, docsLoading, wordbookLoading]);

  const isLoading = authLoading || docsLoading || wordbookLoading || settingsLoading;

  // 便捷的动作创建函数
  const actions = useMemo(() => ({
    setActiveModule: (module) => 
      dispatch({ type: actionTypes.SET_ACTIVE_MODULE, payload: module }),
    
    setSelectedDoc: (doc) => 
      dispatch({ type: actionTypes.SET_SELECTED_DOC, payload: doc }),
    
    setShowUploadModal: (show) => 
      dispatch({ type: actionTypes.SET_SHOW_UPLOAD_MODAL, payload: show }),
    
    setEditingDoc: (doc) => 
      dispatch({ type: actionTypes.SET_EDITING_DOC, payload: doc }),
    
    setShowDeleteConfirm: (doc) => 
      dispatch({ type: actionTypes.SET_SHOW_DELETE_CONFIRM, payload: doc }),
    
    setShowSearch: (show) => 
      dispatch({ type: actionTypes.SET_SHOW_SEARCH, payload: show }),
    
    setShowWelcome: (show) => 
      dispatch({ type: actionTypes.SET_SHOW_WELCOME, payload: show }),

    setShowWordDetail: (word) =>
      dispatch({ type: actionTypes.SET_SHOW_WORD_DETAIL, payload: word }),
    
    setShowAIChat: (show) =>
      dispatch({ type: actionTypes.SET_SHOW_AI_CHAT, payload: show }),
    
    showContextMenu: (position, selectedText, textContext, menuData) => {
        dispatch({ 
            type: actionTypes.SET_CONTEXT_MENU_DATA, 
            payload: { position, selectedText, textContext, ...menuData } 
        });
        dispatch({ type: actionTypes.SET_SHOW_CONTEXT_MENU, payload: true });
    },

    hideContextMenu: () => 
        dispatch({ type: actionTypes.SET_SHOW_CONTEXT_MENU, payload: false }),
    
    setAIInitialMessage: (message, context) =>
      dispatch({ type: actionTypes.SET_AI_INITIAL_MESSAGE, payload: { message, context } }),
    
    resetUIState: () => 
      dispatch({ type: actionTypes.RESET_UI_STATE })
  }), [dispatch]);

  // 数据操作函数
  const handleNavClick = useCallback((module) => {
    actions.setActiveModule(module);
  }, [actions]);

  const openDocument = useCallback((doc) => {
    actions.setSelectedDoc(doc);
  }, [actions]);

  const handleSettingChange = useCallback(async (key, value) => {
    if (key === 'theme') setTheme(value);
    if (key === 'accent') setAccent(value);
    
    if (localStorageService) {
      try {
        const newSettings = { ...settings, [key]: value };
        await localStorageService.saveSettings(newSettings);
        // 立即更新设置状态
        updateSettings(newSettings);
      } catch (error) {
        console.error('Error updating settings:', error);
      }
    }
  }, [localStorageService, settings, updateSettings]);

  const handleAddDocument = useCallback(async (title, content) => {
    if (!localStorageService) return;
    try {
      const docId = 'doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      await localStorageService.saveDocument({ id: docId, title, content, words: [] });
      actions.setShowWelcome(false);
      actions.setShowUploadModal(false);
      // 重新加载文档列表以反映更改
      window.location.reload();
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }, [localStorageService, actions]);

  const handleEditDocument = useCallback(async (docId, title, content) => {
    if (!localStorageService) return;
    try {
      const currentDoc = documents.find(d => d.id === docId);
      if (currentDoc) {
        await localStorageService.saveDocument({ ...currentDoc, title, content });
        actions.setShowUploadModal(false);
        actions.setEditingDoc(null);
        // 重新加载文档列表以反映更改
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }, [localStorageService, documents, actions]);

  const handleDeleteDocument = useCallback(async (docToDelete) => {
    if (!localStorageService) return;
    try {
      await localStorageService.deleteDocument(docToDelete.id);
      
      // 从单词本中移除相关句子
      const currentWordbook = localStorageService.getWordbook();
      const updatedWordbook = currentWordbook.filter(wordEntry => {
        // 过滤掉来自被删除文档的句子
        const filteredSentences = wordEntry.sentences?.filter(s => s.docId !== docToDelete.id) || [];
        wordEntry.sentences = filteredSentences;
        return filteredSentences.length > 0; // 如果没有句子了，删除整个单词条目
      });
      
      await localStorageService.saveWordbook(updatedWordbook);
      
      actions.setShowDeleteConfirm(null);
      // 重新加载页面以反映更改
      window.location.reload();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }, [localStorageService, actions]);

  const handleWordToggle = useCallback(async (word, sentence, forceRemove = false) => {
    if (!localStorageService || !state.selectedDoc) return;
    
    // 更严格的单词验证
    if (!word || typeof word !== 'string') return;
    
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord || cleanWord.length < 2) return; // 至少2个字符
    
    // 排除一些常见的非单词
    const invalidWords = ['false', 'true', 'null', 'undefined', 'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must'];
    if (invalidWords.includes(cleanWord)) return;

    const currentWordbook = localStorageService.getWordbook();
    const wordExists = currentWordbook.some(w => w.word === cleanWord);

    try {
      if (wordExists || forceRemove) {
        // 移除单词 - 取消高亮，退出单词本
        const updatedWordbook = currentWordbook.filter(w => w.word !== cleanWord);
        await localStorageService.saveWordbook(updatedWordbook);
        
        // 更新文档的单词列表
        const currentDoc = documents.find(d => d.id === state.selectedDoc.id);
        if (currentDoc?.words) {
          const currentWords = Array.from(currentDoc.words);
          const updatedWords = currentWords.filter(w => w !== cleanWord);
          await localStorageService.saveDocument({ ...currentDoc, words: updatedWords });
        }
        
      } else {
        // 添加单词 - 点击直接高亮，无弹窗直接添加到单词本
        try {
          let definition = '';
          let phonetics = [];
          
          // 优先使用词典API，失败时使用AI补足
          try {
            // 导入DictionaryService并尝试获取定义
            const { DictionaryService } = await import('../services/dictionary');
            const dictionaryResult = await DictionaryService.getWordDefinition(cleanWord);
            
            if (dictionaryResult) {
              definition = dictionaryResult.meanings?.[0]?.definitions?.[0]?.definition || '';
              phonetics = dictionaryResult.phonetics || [];
            }
          } catch (dictionaryError) {
            console.warn('Dictionary service failed:', dictionaryError);
          }
          
          // 如果词典API无法提供定义，使用AI补足
          if (!definition) {
            try {
              // 使用AI获取定义
              const aiService = (await import('../services/aiService')).default;
              if (aiService.isConfigured) {
                const aiResponse = await aiService.sendMessage(
                  `Please provide a concise definition for the English word "${cleanWord}". Return only the definition without extra explanation.`
                );
                definition = aiResponse.trim();
              } else {
                definition = `Word "${cleanWord}" - Definition will be updated when dictionary service is available.`;
              }
            } catch (aiError) {
              console.warn('AI service failed:', aiError);
              definition = `Word "${cleanWord}" - Definition will be updated when dictionary service is available.`;
            }
          }

          const newWordEntry = {
            word: cleanWord,
            def: definition,
            phonetics,
            sentences: [{ docId: state.selectedDoc.id, text: sentence || '' }],
            notes: '', 
            tags: [], 
            difficulty: 3,
            added: new Date().toISOString().split('T')[0],
            history: [1], 
            status: 'not_studied'
          };
          
          await localStorageService.addWord(newWordEntry);
          
          // 更新文档的单词列表
          const currentDoc = documents.find(d => d.id === state.selectedDoc.id);
          const currentWords = currentDoc?.words || [];
          const updatedWords = Array.from(new Set([...currentWords, cleanWord]));
          await localStorageService.saveDocument({ ...currentDoc, words: updatedWords });
          
        } catch (error) {
          console.error("LocalStorage Error:", error);
        }
      }
    } catch (error) {
      console.error('Error toggling word:', error);
    }
  }, [localStorageService, state.selectedDoc, documents]);

  const handleWordStatusUpdate = useCallback(async (word, status) => {
    if (!localStorageService) return;
    try {
      const currentWordbook = localStorageService.getWordbook();
      const wordIndex = currentWordbook.findIndex(w => w.word === word);
      if (wordIndex >= 0) {
        currentWordbook[wordIndex].status = status;
        await localStorageService.saveWordbook(currentWordbook);
      }
    } catch (error) {
      console.error('Error updating word status:', error);
    }
  }, [localStorageService]);

  const closeUploadModal = useCallback(() => {
    actions.setShowUploadModal(false);
    actions.setEditingDoc(null);
  }, [actions]);

  // AI和上下文菜单相关处理函数
  const handleToggleAIChat = useCallback(() => {
    actions.setShowAIChat(!state.showAIChat);
  }, [actions, state.showAIChat]);

  const handleCopyText = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加toast提示
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, []);

  const handleAskAI = useCallback((selectedText, context) => {
    // 设置初始消息并打开AI聊天窗口
    const aiMessage = context ? 
      `Please explain "${selectedText}" in this context: "${context}"` :
      `Please explain: "${selectedText}"`;
    
    actions.setAIInitialMessage(aiMessage, context);
    actions.setShowAIChat(true);
  }, [actions]);

  const handleAddToWordbook = useCallback(async (selectedText, context) => {
    if (!localStorageService || !state.selectedDoc) return;
    
    // 验证输入
    if (!selectedText || typeof selectedText !== 'string') return;
    
    const cleanText = selectedText.toLowerCase().trim();
    if (!cleanText || cleanText.length < 1) return;

    const currentWordbook = localStorageService.getWordbook();
    const textExists = currentWordbook.some(w => w.word === cleanText);

    try {
      if (!textExists) {
        // 添加短语或表达到词典
        const newWordEntry = {
          word: cleanText,
          def: `Added phrase: "${selectedText}"`,
          phonetics: [],
          sentences: [{ docId: state.selectedDoc.id, text: context || '' }],
          notes: '', 
          tags: ['phrase'], 
          difficulty: 3,
          added: new Date().toISOString().split('T')[0],
          history: [1], 
          status: 'not_studied'
        };
        
        await localStorageService.addWord(newWordEntry);
        
        // 更新文档的单词列表
        const currentDoc = documents.find(d => d.id === state.selectedDoc.id);
        const currentWords = currentDoc?.words || [];
        const updatedWords = Array.from(new Set([...currentWords, cleanText]));
        await localStorageService.saveDocument({ ...currentDoc, words: updatedWords });
        
        // 可以添加成功提示
        console.log(`Added "${cleanText}" to wordbook`);
      }
    } catch (error) {
      console.error('Error adding to wordbook:', error);
    }
  }, [localStorageService, state.selectedDoc, documents]);

  const memoizedContextValue = useMemo(() => ({
    ...state,
    theme, accent,
    documents, wordbook, settings,
    isLoading,
    userId,
    localStorageService,
    handleNavClick,
    handleSettingChange,
    openDocument,
    handleWordToggle,
    handleDeleteDocument,
    handleEditDocument,
    handleAddDocument,
    handleWordStatusUpdate,
    closeUploadModal,
    handleToggleAIChat,
    handleShowContextMenu: actions.showContextMenu,
    hideContextMenu: actions.hideContextMenu,
    handleCopyText,
    handleAskAI,
    handleAddToWordbook,
    setShowWelcome: actions.setShowWelcome,
    setEditingDoc: actions.setEditingDoc,
    setShowUploadModal: actions.setShowUploadModal,
    setShowDeleteConfirm: actions.setShowDeleteConfirm,
    setShowSearch: actions.setShowSearch,
    setShowWordDetail: actions.setShowWordDetail,
    setShowAIChat: actions.setShowAIChat,
    setShowContextMenu: actions.hideContextMenu,
  }), [state, theme, accent, documents, wordbook, settings, isLoading, userId, localStorageService, handleNavClick, handleSettingChange, openDocument, handleWordToggle, handleDeleteDocument, handleEditDocument, handleAddDocument, handleWordStatusUpdate, closeUploadModal, handleToggleAIChat, actions.showContextMenu, actions.hideContextMenu, handleCopyText, handleAskAI, handleAddToWordbook, actions.setShowWelcome, actions.setEditingDoc, actions.setShowUploadModal, actions.setShowDeleteConfirm, actions.setShowSearch, actions.setShowWordDetail, actions.setShowAIChat]);

  return (
    <AppContext.Provider value={memoizedContextValue}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义 Hook 来使用上下文
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;