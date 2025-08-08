import React from 'react';

const SidebarButton = ({ 
  onClick, 
  icon: Icon, 
  label,
  isActive = false,
  variant = "default", // "default" | "ghost" | "compact"
  title = "",
  className = "",
}) => {
  // 根据变体选择样式
  const getButtonClasses = () => {
    const baseClasses = "flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1";
    
    if (variant === "ghost" || variant === "compact") {
      return `${baseClasses} w-8 h-8 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-500 dark:hover:text-indigo-400 ${className}`;
    }
    
    // default variant
    const activeClasses = "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 scale-105 shadow-md";
    const inactiveClasses = "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/80 hover:text-indigo-500 dark:hover:text-indigo-400 hover:scale-105";

    return `${baseClasses} flex-col w-full py-3 my-1 ${isActive ? activeClasses : inactiveClasses} ${className}`;
  };

  const getIconSize = () => {
    if (variant === "ghost" || variant === "compact") {
      return "w-4 h-4";
    }
    return "w-6 h-6";
  };

  return (
    <button
      onClick={onClick}
      aria-label={label || title}
      title={title || label}
      className={getButtonClasses()}
    >
      {Icon && <Icon className={getIconSize()} />}
      {variant === "default" && label && (
        <span className="text-xs mt-1 font-medium">{label}</span>
      )}
    </button>
  );
};

export default SidebarButton;
