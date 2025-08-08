import React, { useEffect, useRef } from 'react';
import { Copy, MessageCircle, BookOpen, X, Trash2, Edit } from 'lucide-react';

const ContextMenu = ({ 
  isVisible,
  position,
  selectedText,
  context,
  isHighlighted,
  onClose,
  onCopy,
  onAskAI,
  onAddToWordbook,
  onRemoveHighlight,
  onHighlight
}) => {
  const menuRef = useRef(null);

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
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const menuItems = [
    { label: '复制', icon: Copy, action: () => onCopy(selectedText) },
    { label: 'Ask AI', icon: MessageCircle, action: onAskAI },
    !isHighlighted && onAddToWordbook 
      ? { label: '添加到生词本', icon: BookOpen, action: onAddToWordbook }
      : null,
    isHighlighted 
      ? { 
          label: '取消高亮', 
          icon: Trash2, 
          action: onRemoveHighlight, 
          className: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50' 
        }
      : null,
    !isHighlighted && onHighlight
      ? { 
          label: '高亮', 
          icon: Edit, 
          action: onHighlight 
        }
      : null,
  ].filter(Boolean);

  // 防止菜单超出窗口边界
  const menuWidth = 200;
  const menuHeight = 180;
  let x = position?.x || 0;
  let y = position?.y || 0;
  if (typeof window !== 'undefined') {
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
  }
  const finalPosition = { x, y };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 min-w-[160px]"
      style={{
        left: `${finalPosition.x}px`,
        top: `${finalPosition.y}px`,
      }}
    >
      {/* 选中文本显示 */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Selected text:
        </div>
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[200px]">
          "{selectedText}"
        </div>
      </div>

      {/* 菜单项 */}
      {menuItems.map((item, index) => {
        const IconComponent = item.icon || (() => null);
        return (
          <button
            key={index}
            onClick={() => { item.action(); onClose(); }}
            className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${
              item.className || 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <IconComponent className="w-4 h-4 mr-3" />
            {item.label}
          </button>
        );
      })}

      {/* 关闭按钮 */}
      <div className="border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onClose}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4 mr-3" />
          Close
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;
