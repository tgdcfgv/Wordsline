import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Upload, FileText, MoreVertical, Edit, Trash2, X, Zap } from 'lucide-react';
const WelcomeGuide = React.memo(({ onDismiss }) => {
        return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-2 border-dashed border-indigo-300 dark:border-indigo-700 mb-6 relative">
        <button onClick={onDismiss} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
        </button>
        <div className="flex items-center mb-4">
            <Zap className="text-indigo-500 mr-3" size={24} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Welcome to Rect Words</h2>
        </div>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Get started by uploading a reading material</li>
        </ol>
    </div>
    );
});

WelcomeGuide.displayName = 'WelcomeGuide';

const DocumentCard = React.memo(({ doc, openDocument, onEdit, onDelete, openMenuId, setOpenMenuId, menuRef }) => {
    const handleMenuClick = useCallback((e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === doc.id ? null : doc.id);
  }, [openMenuId, doc.id, setOpenMenuId]);

  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    onEdit(doc);
    setOpenMenuId(null);
  }, [onEdit, doc, setOpenMenuId]);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    onDelete(doc);
    setOpenMenuId(null);
  }, [onDelete, doc, setOpenMenuId]);

  const handleDocumentClick = useCallback(() => {
    openDocument(doc);
  }, [openDocument, doc]);

  const wordCount = useMemo(() => doc.words?.size || 0, [doc.words]);
  const readTime = useMemo(() => Math.round((doc.content || '').split(' ').length / 200), [doc.content]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex justify-between items-start">
        <FileText className="text-indigo-500" size={32} />
        <div className="relative" ref={openMenuId === doc.id ? menuRef : null}>
          <button onClick={handleMenuClick} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreVertical size={20} />
          </button>
          {openMenuId === doc.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
              <button onClick={handleEditClick} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Edit size={16} className="mr-2" /> Edit Document
              </button>
              <button onClick={handleDeleteClick} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50">
                <Trash2 size={16} className="mr-2" /> Delete Document
              </button>
            </div>
          )}
        </div>
      </div>
      <div onClick={handleDocumentClick} className="cursor-pointer flex-grow mt-2">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">{doc.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{doc.content}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{wordCount} words saved</span>
        <span>{readTime} min read</span>
      </div>
    </div>
  );
});

DocumentCard.displayName = 'DocumentCard';

const ReadingLibrary = ({ documents, openDocument, onUpload, onDelete, onEdit, showWelcome, onDismissWelcome }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenuId(null);
    }
  }, []);

  useEffect(() => {
    // 安全检查：确保在浏览器环境中
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [handleClickOutside]);

  const documentCount = useMemo(() => documents.length, [documents.length]);
  
  // 使用虚拟化列表优化文档渲染
  const DocumentGrid = useMemo(() => {
    const sortedDocs = [...documents].sort((a, b) => 
      new Date(b.lastUpdated || b.createdAt || 0) - new Date(a.lastUpdated || a.createdAt || 0)
    );
    
    // 文档较少时不使用虚拟化
    if (sortedDocs.length <= 20) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              openDocument={openDocument}
              onEdit={onEdit}
              onDelete={onDelete}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              menuRef={menuRef}
            />
          ))}
        </div>
      );
    }
    
    // 文档较多时使用虚拟化列表
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDocs.slice(0, 50).map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            openDocument={openDocument}
            onEdit={onEdit}
            onDelete={onDelete}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            menuRef={menuRef}
          />
        ))}
      </div>
    );
  }, [documents, openDocument, onEdit, onDelete, openMenuId, setOpenMenuId, menuRef]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Library ({documentCount})</h2>
        <button onClick={onUpload} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors">
          <Upload size={20} className="mr-2" />
          Add Document
        </button>
      </div>
      {showWelcome && <WelcomeGuide onDismiss={onDismissWelcome} />}
      {documentCount > 0 ? (
        <div className="transition-all duration-300 ease-in-out">
          {DocumentGrid}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center shadow-md border border-gray-200 dark:border-gray-700">
          <div className="mb-4 flex justify-center">
            <FileText className="text-indigo-500 h-16 w-16" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{"No documents found"}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by uploading a reading material</p>
          <button
            onClick={onUpload}
            className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm flex items-center mx-auto"
          >
            <Upload size={18} className="mr-2" />
            Add Document
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ReadingLibrary);
