import React, { useMemo, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { playAudio } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';

const Wordbook = ({ wordbook, accent = 'us' }) => {
    const { setShowWordDetail } = useAppContext();
  const [filterStatus, setFilterStatus] = useState('all');
  
  const filteredWords = useMemo(() => {
    let words = Object.entries(wordbook);

    if (filterStatus !== 'all') {
        words = words.filter(([, data]) => data.status === filterStatus);
    }

    return words.sort(([, a], [, b]) => new Date(b.added) - new Date(a.added));
  }, [wordbook, filterStatus]);

  const statusFilters = [
      { key: 'all', label: 'All Words' },
      { key: 'not_studied', label: 'Not Studied' },
      { key: 'reviewing', label: 'Reviewing' },
      { key: 'completed', label: "Completed" },
      { key: 'mastered', label: "Mastered" },
  ];

  const currentFilterLabel = statusFilters.find(f => f.key === filterStatus)?.label || 'Words';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{currentFilterLabel} ({filteredWords.length})</h2>
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {statusFilters.map(filter => (
                    <button 
                        key={filter.key}
                        onClick={() => setFilterStatus(filter.key)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filterStatus === filter.key ? 'bg-white dark:bg-gray-900 text-indigo-600 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50'}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
        <div className="space-y-2">
            {filteredWords.map(([word, data]) => (
                <div 
                    key={word} 
                    className="p-4 flex items-center justify-between border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                    onClick={() => setShowWordDetail(word)}
                >
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 capitalize">{word}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-2xl">{data.def}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            data.status === 'mastered' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                            data.status === 'reviewing' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                            data.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' :
                            'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300'
                        }`}>
                            {statusFilters.find(f => f.key === data.status)?.label}
                        </span>
                        {data.phonetics && data.phonetics.length > 0 && (
                            <button 
                                onClick={() => playAudio(data.phonetics, accent)} 
                                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                title="Play Pronunciation"
                            >
                                <Volume2 size={20} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {filteredWords.length === 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <p>No matching words found.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Wordbook;
