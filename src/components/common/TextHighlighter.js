import React, { useMemo, useCallback } from 'react';

/**
 * 简化的文本高亮组件
 * 负责将文本分割成单词并应用高亮样式
 */
const TextHighlighter = ({ 
  text, 
  highlightedWords = [], 
  onWordClick, 
  onWordHover,
  className = "",
  wordClassName = "",
  highlightClassName = "bg-blue-200 dark:bg-blue-800/50 text-blue-800 dark:text-blue-300 font-medium"
}) => {
  // 将文本分割成单词和非单词部分
  const textParts = useMemo(() => {
    if (!text) return [];
    
    // 使用正则表达式分割文本，保留分隔符
    return text.split(/(\b[\w'-]+\b)/);
  }, [text]);

  // 检查单词是否应该被高亮
  const isWordHighlighted = useCallback((word) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    return highlightedWords.includes(cleanWord);
  }, [highlightedWords]);

  // 处理单词点击
  const handleWordClick = useCallback((word, event) => {
    event.stopPropagation();
    if (onWordClick) {
      onWordClick(word, event);
    }
  }, [onWordClick]);

  // 处理单词悬停
  const handleWordMouseEnter = useCallback((word, event) => {
    // 添加悬停效果
    event.target.style.transform = 'scale(1.05)';
    event.target.style.transition = 'all 0.15s ease';
    
    if (onWordHover) {
      onWordHover(word, event, 'enter');
    }
  }, [onWordHover]);

  const handleWordMouseLeave = useCallback((word, event) => {
    // 移除悬停效果
    event.target.style.transform = 'scale(1)';
    
    if (onWordHover) {
      onWordHover(word, event, 'leave');
    }
  }, [onWordHover]);

  return (
    <span className={className}>
      {textParts.map((part, index) => {
        // 判断是否为单词（奇数索引为单词，偶数为分隔符）
        const isWord = index % 2 === 1;
        
        if (isWord) {
          const isHighlighted = isWordHighlighted(part);
          
          return (
            <span
              key={index}
              className={`
                cursor-pointer 
                transition-all 
                duration-200 
                rounded 
                px-1 
                word-hover-effect
                ${isHighlighted ? `highlighted ${highlightClassName}` : ''}
                ${wordClassName}
              `}
              onClick={(e) => handleWordClick(part, e)}
              onMouseEnter={(e) => handleWordMouseEnter(part, e)}
              onMouseLeave={(e) => handleWordMouseLeave(part, e)}
              title={isHighlighted ? 'Click to remove highlight' : 'Click to highlight'}
            >
              {part}
            </span>
          );
        } else {
          // 非单词部分（空格、标点等）
          return <span key={index}>{part}</span>;
        }
      })}
    </span>
  );
};

export default TextHighlighter;
