import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ size = 48, message = "加载中..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full py-8">
      <Loader className="animate-spin text-indigo-500 mb-4" size={size} />
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
