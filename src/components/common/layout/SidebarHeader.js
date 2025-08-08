import React from 'react';

const SidebarHeader = ({ icon: Icon, title, children }) => {
  return (
    <div className="flex items-center justify-between px-4 py-4 h-16 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50">
      <div className="flex items-center min-w-0 flex-1">
        {Icon && <Icon className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />}
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">{title}</span>
      </div>
      {children && (
        <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
