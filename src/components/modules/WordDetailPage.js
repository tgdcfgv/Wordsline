import React from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { playAudio } from '../../utils/helpers';

const WordDetailPage = ({ word, wordbook, documents, onExit, accent }) => {
    const data = wordbook[word];
    if (!data) return null;

    const highlightWord = (text) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        return text.replace(regex, (match) => `<strong class="text-indigo-600 dark:text-indigo-400">${match}</strong>`);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onExit} className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold mb-4">
                <ArrowLeft size={20} className="mr-2" />
                返回单词本
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                <div className="flex justify-between items-center pb-4 mb-6 border-b dark:border-gray-700">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 capitalize">{word}</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 italic mt-2">{data.def}</p>
                    </div>
                    <button onClick={() => playAudio(data.phonetics, accent)} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        <Volume2 size={28}/>
                    </button>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">来自您阅读材料的例句</h3>
                    <ul className="space-y-4">
                        {data.sentences.map((sent, i) => (
                            <li key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p 
                                    className="text-gray-800 dark:text-gray-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: `"${highlightWord(sent.text)}"` }}
                                />
                                <button onClick={(e) => e.preventDefault()} className="text-sm text-gray-500 dark:text-gray-400 hover:underline mt-2 block">
                                    来自: {documents.find(d => d.id === sent.docId)?.title || '未知来源'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WordDetailPage;
