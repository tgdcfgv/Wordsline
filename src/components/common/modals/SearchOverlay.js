import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Volume2 } from 'lucide-react';
import { playAudio } from '../../../utils/helpers';

const SearchOverlay = ({ wordbook, onClose, accent = 'us' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // 高亮搜索关键词的函数
    const highlightText = (text, term) => {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600/50 px-1 rounded">$1</mark>');
    };

    const searchResults = useMemo(() => {
        if (!searchTerm) return [];
        const term = searchTerm.toLowerCase();
        return Object.entries(wordbook).filter(([word, data]) => 
            word.toLowerCase().includes(term) || 
            data.def.toLowerCase().includes(term)
        ).sort(([wordA], [wordB]) => {
            // 优先显示单词名称匹配的结果
            const aWordMatch = wordA.toLowerCase().includes(term);
            const bWordMatch = wordB.toLowerCase().includes(term);
            if (aWordMatch && !bWordMatch) return -1;
            if (!aWordMatch && bWordMatch) return 1;
            return wordA.localeCompare(wordB);
        });
    }, [searchTerm, wordbook]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-center" onClick={onClose}>
            <div className="w-full max-w-3xl mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="relative p-4 border-b border-gray-200 dark:border-gray-700">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search your personal dictionary..."
                        className="w-full bg-transparent text-lg p-2 pl-10 pr-12 text-gray-800 dark:text-gray-200 focus:outline-none"
                    />
                    <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={24} />
                    </button>
                    {searchTerm && (
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Found {searchResults.length} results
                        </div>
                    )}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 overflow-y-auto max-h-96">
                    {searchResults.length > 0 ? (
                        <ul className="p-4 space-y-3">
                            {searchResults.map(([word, data]) => (
                                <li key={word} className="p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <h4 
                                            className="font-semibold text-gray-800 dark:text-gray-200 capitalize mb-1"
                                            dangerouslySetInnerHTML={{ __html: highlightText(word, searchTerm) }}
                                        />
                                        <p 
                                            className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-2 break-words"
                                            dangerouslySetInnerHTML={{ 
                                                __html: highlightText(
                                                    data.def.length > 120 ? `${data.def.substring(0, 120)}...` : data.def, 
                                                    searchTerm
                                                ) 
                                            }}
                                        />
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                {data.sentences.length} examples
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                data.status === 'mastered' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                                                data.status === 'reviewing' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' :
                                                data.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                                                'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                            }`}>
                                                {
                                                    data.status === 'mastered' ? 'Mastered' :
                                                    data.status === 'reviewing' ? 'Reviewing' :
                                                    data.status === 'completed' ? 'Completed' :
                                                    'Not studied'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    {data.phonetics && data.phonetics.length > 0 && (
                                        <button 
                                            onClick={() => playAudio(data.phonetics, accent)} 
                                            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ml-4 flex-shrink-0"
                                            title="播放发音"
                                        >
                                            <Volume2 size={20} />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center">
                            {searchTerm ? (
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                                        No words found containing "{searchTerm}"
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">
                                        Try searching other keywords or definitions
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                                        Search your personal dictionary
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">
                                        Enter keywords from words or definitions to start searching
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
