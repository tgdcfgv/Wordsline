import React, { useState, useEffect } from 'react';
import { 
  StickyNote, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  Search,
  Tag,
  ChevronDown,
  FileText
} from 'lucide-react';
import SidebarHeader from '../../common/layout/SidebarHeader';
import SidebarButton from '../../common/buttons/SidebarButton';

const ReadingNotes = ({ document, onAddNote }) => {
  const [notes, setNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'general',
    tags: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const noteTypes = [
    { id: 'general', label: '常规', color: 'blue' },
    { id: 'vocabulary', label: '词汇', color: 'green' },
    { id: 'summary', label: '总结', color: 'purple' },
    { id: 'question', label: '问题', color: 'orange' },
    { id: 'insight', label: '见解', color: 'pink' }
  ];

  useEffect(() => {
    if (document) {
      loadNotes();
    }
  }, [document]);

  const loadNotes = () => {
    // 从localStorage加载笔记
    const storedNotes = localStorage.getItem(`notes_${document.id}`);
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    } else {
      setNotes([]);
    }
  };

  const saveNotes = (updatedNotes) => {
    localStorage.setItem(`notes_${document.id}`, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note = {
      id: Date.now(),
      ...newNote,
      docId: document.id,
      docTitle: document.title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedNotes = [...notes, note];
    saveNotes(updatedNotes);
    
    // 重置表单
    setNewNote({
      title: '',
      content: '',
      type: 'general',
      tags: []
    });
    setIsAddingNote(false);

    // 通知父组件
    if (onAddNote) {
      onAddNote(note);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setNewNote({
      title: note.title,
      content: note.content,
      type: note.type,
      tags: note.tags || []
    });
  };

  const handleUpdateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const updatedNotes = notes.map(note => 
      note.id === editingNote 
        ? {
            ...note,
            ...newNote,
            updatedAt: new Date().toISOString()
          }
        : note
    );

    saveNotes(updatedNotes);
    setEditingNote(null);
    setNewNote({
      title: '',
      content: '',
      type: 'general',
      tags: []
    });
  };

  const handleDeleteNote = (noteId) => {
    if (confirm('确定要删除这条笔记吗？')) {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      saveNotes(updatedNotes);
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setIsAddingNote(false);
    setNewNote({
      title: '',
      content: '',
      type: 'general',
      tags: []
    });
  };

  const getTypeColor = (type) => {
    const typeConfig = noteTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.color : 'blue';
  };

  const getFilteredNotes = () => {
    let filtered = notes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(note => note.type === filterType);
    }

    return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!document) {
    return (
      <div className="flex flex-col h-full">
        <SidebarHeader icon={StickyNote} title="阅读笔记" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <StickyNote className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              未选择文档
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              请选择一个文档来添加阅读笔记
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filteredNotes = getFilteredNotes();

  return (
    <div className="flex flex-col h-full">
      {/* 头部控制 */}
      <SidebarHeader icon={StickyNote} title="阅读笔记">
        <SidebarButton
          onClick={() => setIsAddingNote(true)}
          icon={Plus}
          variant="ghost"
          title="添加笔记"
        />
      </SidebarHeader>
      
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 sidebar-scroll">

      {/* 搜索和过滤 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索笔记..."
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 transition-all"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 transition-all"
        >
          <option value="all">所有类型</option>
          {noteTypes.map(type => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* 添加/编辑笔记表单 */}
      {(isAddingNote || editingNote) && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-800/50">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Edit3 className="w-4 h-4 mr-2 text-indigo-500" />
            {editingNote ? '编辑笔记' : '添加新笔记'}
          </h4>
          <div className="space-y-4">
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              placeholder="笔记标题..."
              className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 transition-all"
            />

            <select
              value={newNote.type}
              onChange={(e) => setNewNote(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 transition-all"
            >
              {noteTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>

            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              placeholder="在这里写下你的笔记..."
              rows="5"
              className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 resize-none transition-all"
            />

            <div className="flex space-x-3">
              <button
                onClick={editingNote ? handleUpdateNote : handleAddNote}
                className="flex items-center px-4 py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingNote ? '更新笔记' : '保存笔记'}
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 笔记列表 */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <StickyNote className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              还没有笔记
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              添加你的第一条笔记开始记录阅读心得
            </p>
            <button
              onClick={() => setIsAddingNote(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加笔记
            </button>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-indigo-200 dark:hover:border-indigo-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                    {note.title}
                  </h4>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full bg-${getTypeColor(note.type)}-100 dark:bg-${getTypeColor(note.type)}-900/20 text-${getTypeColor(note.type)}-800 dark:text-${getTypeColor(note.type)}-300 flex-shrink-0`}>
                    {noteTypes.find(t => t.id === note.type)?.label || note.type}
                  </span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="编辑笔记"
                  >
                    <Edit3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="删除笔记"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1.5" />
                  <span>{formatDate(note.updatedAt)}</span>
                </div>
                {note.createdAt !== note.updatedAt && (
                  <span className="text-indigo-500 dark:text-indigo-400">已编辑</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 统计信息 */}
      {notes.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2">
            <span>共 {notes.length} 条笔记</span>
            <span>显示 {filteredNotes.length} 条</span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ReadingNotes;
