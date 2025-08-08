import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Copy, MessageCircle, BookOpen, Trash2, X } from 'lucide-react';

/**
 * 简化的上下文菜单组件
 */
const SimpleContextMenu = ({ 
  isVisible,
  position,
  selectedText,
  isHighlighted,
  onClose,
  onCopy,
  onAskAI,
  onToggleHighlight,
  onAddToWordbook
}) => {
  const menuRef = useRef(null);

  // 点击外部关闭菜单
  useEffect(() => {
    // 安全检查：确保在浏览器环境中
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        if (typeof document !== 'undefined') {
          document.removeEventListener('mousedown', handleClickOutside);
        }
      };
    }
  }, [isVisible, onClose]);

  // 计算菜单位置，防止超出屏幕
  const getMenuPosition = () => {
    if (!position || typeof window === 'undefined') {
      return { x: 0, y: 0 };
    }

    const menuWidth = 200;
    const menuHeight = 200;
    let { x, y } = position;

    // 防止菜单超出右边界
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }

    // 防止菜单超出下边界
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    // 防止菜单超出左边界
    if (x < 10) {
      x = 10;
    }

    // 防止菜单超出上边界
    if (y < 10) {
      y = 10;
    }

    return { x, y };
  };

  const handleAction = useCallback((action) => {
    action();
    onClose();
  }, [onClose]);

  if (!isVisible || !selectedText) {
    return null;
  }

  const menuPosition = getMenuPosition();

  // 定义菜单项
  const menuItems = [
    {
      label: '复制',
      icon: Copy,
      action: () => onCopy && onCopy(selectedText),
      className: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    },
    {
      label: 'AI解释',
      icon: MessageCircle,
      action: () => onAskAI && onAskAI(selectedText),
      className: 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50'
    },
    {
      label: isHighlighted ? '取消高亮' : '添加高亮',
      icon: isHighlighted ? Trash2 : BookOpen,
      action: () => onToggleHighlight && onToggleHighlight(selectedText),
      className: isHighlighted 
        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50'
        : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50'
    }
  ];

  // 如果不是单个单词，添加"添加到生词本"选项
  if (selectedText.includes(' ') && onAddToWordbook) {
    menuItems.push({
      label: '添加到生词本',
      icon: BookOpen,
      action: () => onAddToWordbook(selectedText),
      className: 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50'
    });
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 min-w-[180px] max-w-[250px]"
      style={{
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
      }}
    >
      {/* 选中文本显示 */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          已选择:
        </div>
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
          "{selectedText.length > 30 ? selectedText.substring(0, 30) + '...' : selectedText}"
        </div>
      </div>

      {/* 菜单项 */}
      {menuItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <button
            key={index}
            onClick={() => handleAction(item.action)}
            className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${item.className}`}
            disabled={!item.action}
          >
            <IconComponent className="w-4 h-4 mr-3 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}

      {/* 关闭按钮 */}
      <div className="border-t border-gray-200 dark:border-gray-600 mt-1">
        <button
          onClick={onClose}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4 mr-3" />
          关闭
        </button>
      </div>
    </div>
  );
};

export default SimpleContextMenu;
