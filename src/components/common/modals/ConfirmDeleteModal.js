import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDeleteModal = ({ doc, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center">
          <AlertTriangle className="text-red-500 mr-4" size={48} />
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">确认删除？</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              您确定要删除 “{doc.title}” 吗？此操作将同时从您的单词本中移除所有相关的例句。
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onCancel} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
            取消
          </button>
          <button onClick={() => onConfirm(doc)} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
