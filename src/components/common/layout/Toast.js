import React, { useEffect } from 'react';
import { CheckCircle, HelpCircle, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;
  
  const isError = toast.type === 'error';

  return (
    <div className={`fixed bottom-5 right-5 z-50 w-full max-w-sm p-4 rounded-xl shadow-lg text-white transition-all duration-300 ${
      isError ? 'bg-red-500' : 'bg-green-500'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isError ? (
            <HelpCircle className="mr-3" size={24} />
          ) : (
            <CheckCircle className="mr-3" size={24} />
          )}
          <div className="flex-1">
            {toast.type === 'add' ? (
              <p><b>{toast.word}</b> added to wordbook.</p>
            ) : toast.type === 'remove' ? (
              <p><b>{toast.word}</b> removed from wordbook.</p>
            ) : (
              <p>{toast.message}</p>
            )}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="ml-3 text-white hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
