import React, { useState, useEffect } from 'react';

const UploadModal = ({ onClose, onAdd, onEdit, editingDoc }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (editingDoc) {
            setTitle(editingDoc.title);
            setContent(editingDoc.content);
        }
    }, [editingDoc]);

    const handleSubmit = () => {
        if (!title || !content) return;
        if (editingDoc) {
            onEdit(editingDoc.id, title, content);
        } else {
            onAdd(title, content);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">{editingDoc ? 'Edit Text' : 'Upload New Material'}</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Content (Paste text)</label>
                    <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" rows="8"></textarea>
                </div>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingDoc ? 'Save Changes' : 'Add to Library'}</button>
                </div>
            </div>
        </div>
    );
}

export default UploadModal;
