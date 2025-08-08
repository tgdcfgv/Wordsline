import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Loader, 
  AlertCircle,
  Settings,
  History,
  MoreVertical,
  Plus,
  X,
  Copy,
  RefreshCw,
  BookMarked,
  Edit2,
  Check,
  XIcon
} from 'lucide-react';
import aiService from '../../../services/aiService';
import SidebarHeader from '../../common/layout/SidebarHeader';
import SidebarButton from '../../common/buttons/SidebarButton';

const AIAssistant = ({ document, settings = {}, pendingMessage, onMessageProcessed }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showHistoryList, setShowHistoryList] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const settingsMenuRef = useRef(null);

  useEffect(() => {
    // 检查AI是否已配置 - 只要有API密钥就认为已配置
    setIsConfigured(!!settings.aiApiKey);
    
    // 如果有文档，添加欢迎消息
    if (document && settings.aiApiKey) {
      setMessages([{
        id: Date.now(),
        type: 'assistant',
        content: `你好！我是AI助手，可以帮助你理解"${document.title}"这个文档。你可以问我关于内容、词汇或概念的任何问题。`,
        timestamp: new Date()
      }]);
      // 清空输入框
      setInputMessage('');
    }
  }, [document, settings]);

  // 处理外部传入的消息
  useEffect(() => {
    if (pendingMessage && pendingMessage.text) {
      setInputMessage(pendingMessage.text);
      // 聚焦到输入框
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      // 通知消息已处理
      if (onMessageProcessed) {
        onMessageProcessed();
      }
    }
  }, [pendingMessage, onMessageProcessed]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 点击外部关闭设置菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    };

    if (showSettingsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsMenu]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isConfigured) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    
    await handleAIResponse(currentMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    if (document && settings.aiApiKey) {
      setMessages([{
        id: Date.now(),
        type: 'assistant',
        content: `你好！我是AI助手，可以帮助你理解"${document.title}"这个文档。你可以问我关于内容、词汇或概念的任何问题。`,
        timestamp: new Date()
      }]);
    }
  };

  const clearChatHistory = () => {
    setMessages([]);
    setShowSettingsMenu(false);
    // 这里可以添加清除历史记录的逻辑
  };

  const openAISettings = () => {
    // 跳转到AI设置界面
    window.location.hash = '#settings/ai';
    setShowSettingsMenu(false);
  };

  const showChatHistory = () => {
    setShowHistoryList(true);
    setShowSettingsMenu(false);
  };

  const getQuickQuestions = () => {
    if (!document) return [];
    
    return [
      '总结这个文档',
      '重点内容是什么？',
      '解释难懂的词汇',
      '我可以问哪些问题？'
    ];
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    // 直接发送，不需要用户再次点击发送
    setTimeout(() => {
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: question,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      handleAIResponse(question);
    }, 100);
  };

  const handleAIResponse = async (messageContent) => {
    setIsLoading(true);
    try {
      let response = "";
      
      if (!settings.aiApiKey) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        response = `我注意到你正在使用AI助手的演示模式。要获得完整功能，请前往"设置→AI助手"配置你的API密钥。\n\n你的问题是: "${messageContent}"\n\n这是一个模拟回复，因为AI服务尚未完全配置。请在设置中添加有效的API密钥以启用完整功能。`;
      } else {
        let context = '';
        if (document) {
          context = `Document: "${document.title}"\n\nContent excerpt: ${document.content.substring(0, 1000)}...`;
        }
        response = await aiService.generateResponse(messageContent, context);
      }
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 消息操作函数
  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const regenerateMessage = async (messageIndex) => {
    const userMessage = messages[messageIndex - 1];
    if (userMessage && userMessage.type === 'user') {
      // 移除当前AI回复
      setMessages(prev => prev.slice(0, messageIndex));
      // 重新生成回复
      await handleAIResponse(userMessage.content);
    }
  };

  const addToNotes = (content) => {
    // 这里可以添加到笔记的逻辑
    console.log('Adding to notes:', content);
  };

  const startEditMessage = (messageId, content) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const saveEditedMessage = async () => {
    if (!editingContent.trim()) return;
    
    // 更新消息内容
    setMessages(prev => prev.map(msg => 
      msg.id === editingMessageId 
        ? { ...msg, content: editingContent, isEdited: true }
        : msg
    ));

    // 如果编辑的是用户消息，重新生成AI回复
    const messageIndex = messages.findIndex(msg => msg.id === editingMessageId);
    const message = messages[messageIndex];
    
    if (message.type === 'user') {
      // 删除该消息之后的所有消息
      setMessages(prev => prev.slice(0, messageIndex + 1));
      // 重新生成AI回复
      await handleAIResponse(editingContent);
    }

    setEditingMessageId(null);
    setEditingContent('');
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  if (!isConfigured) {
    return (
      <div className="flex flex-col h-full">
        <SidebarHeader icon={MessageSquare} title="AI助手" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              AI助手未启用
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              请在设置中启用AI助手功能。
            </p>
            <button 
              onClick={() => window.location.hash = '#settings/ai'}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              <span>前往AI设置</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 历史聊天列表界面
  if (showHistoryList) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">聊天历史</h3>
          <button
            onClick={() => setShowHistoryList(false)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {/* 当前文档的历史记录 */}
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              "{document?.title || '当前文档'}" 的聊天历史
            </div>
            
            {/* 示例历史记录项 */}
            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                关于文档内容的讨论
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                2024年8月3日 14:30
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                总结这个文档的主要内容...
              </div>
            </div>
            
            <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
              暂无更多历史记录
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 头部控制 */}
      <SidebarHeader icon={MessageSquare} title="AI助手">
        <SidebarButton
          onClick={startNewChat}
          icon={Plus}
          variant="ghost"
          title="开始新聊天"
        />
        <SidebarButton
          onClick={showChatHistory}
          icon={History}
          variant="ghost"
          title="历史聊天"
        />
        <div className="relative">
          <SidebarButton
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            icon={MoreVertical}
            variant="ghost"
            title="设置"
          />
          {showSettingsMenu && (
            <div 
              ref={settingsMenuRef}
              className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
            >
              <button
                onClick={clearChatHistory}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              >
                清理聊天历史
              </button>
              <button
                onClick={openAISettings}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
              >
                模型设置
              </button>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 sidebar-scroll">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            onMouseEnter={() => setHoveredMessageId(message.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            <div className="relative max-w-[90%]">
              <div
                className={`rounded-xl px-4 py-3 shadow-sm ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : message.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 opacity-80" />
                    ) : message.type === 'error' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingMessageId === message.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-600 dark:text-gray-200"
                          rows="3"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={saveEditedMessage}
                            className="flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs transition-colors"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            保存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xs transition-colors"
                          >
                            <XIcon className="w-3 h-3 mr-1" />
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                          {message.isEdited && (
                            <span className="text-xs opacity-60 ml-2">(已编辑)</span>
                          )}
                        </div>
                        <div className={`text-xs mt-2 opacity-60 ${
                          message.type === 'user' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 悬停操作按钮 */}
              {hoveredMessageId === message.id && editingMessageId !== message.id && (
                <div className={`absolute -bottom-2 ${message.type === 'user' ? 'right-0' : 'left-0'} flex space-x-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1`}>
                  <button
                    onClick={() => copyMessage(message.content)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="复制"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  
                  {message.type === 'user' && (
                    <button
                      onClick={() => startEditMessage(message.id, message.content)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                  
                  {message.type === 'assistant' && (
                    <>
                      <button
                        onClick={() => regenerateMessage(index)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="重新生成"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => addToNotes(message.content)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="加入笔记"
                      >
                        <BookMarked className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start px-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <Bot className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <Loader className="w-4 h-4 animate-spin text-indigo-500 dark:text-indigo-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">正在思考...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 - 固定在底部 */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 mt-auto">
        {/* 快速提问按钮 - 仅在无消息或仅有机器人欢迎词时显示 */}
        {(messages.length === 0 || (messages.length === 1 && messages[0].type === 'assistant')) && document && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {getQuickQuestions().map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 border border-indigo-200 dark:border-indigo-700 hover:border-indigo-600 rounded-full transition-all duration-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="问我任何问题..."
              className="w-full resize-none rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 transition-all"
              style={{ overflow: 'hidden' }}
              disabled={isLoading}
              rows="1"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="h-[52px] w-[52px] flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
