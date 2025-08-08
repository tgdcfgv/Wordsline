import React from 'react';
import { X, Volume2, Edit, Trash2, Tag, Star, CheckCircle, BookOpen } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { playAudio } from '../../utils/helpers';

const WordDetailModal = () => {
  const { showWordDetail, setShowWordDetail, wordbook, accent } = useAppContext();

  if (!showWordDetail) return null;

  const wordData = wordbook[showWordDetail];

  const handleClose = () => setShowWordDetail(null);

  if (!wordData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={handleClose}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
          <p>Loading word information...</p>
        </div>
      </div>
    );
  }

  const { def, phonetics, sentences, notes, tags, difficulty, added, status } = wordData;

  const phoneticText = phonetics?.find(p => p.text)?.text;
  const audioSrc = phonetics?.find(p => p.audio)?.audio;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
          <X size={24} />
        </button>
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-bold capitalize text-gray-900 dark:text-white">{showWordDetail}</h2>
          <div className="flex items-center gap-3">
            {audioSrc && (
              <button onClick={() => playAudio(phonetics, accent)} className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Volume2 size={22} />
              </button>
            )}
            <span className="text-lg text-gray-500 dark:text-gray-400">{phoneticText}</span>
          </div>
        </div>

        <p className="text-base text-gray-600 dark:text-gray-300 mb-6">{def}</p>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center"><BookOpen size={16} className="mr-2"/>Examples</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {sentences?.map((s, i) => <li key={i}>{s.text}</li>)}
            </ul>
          </div>

          {notes && (
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center"><Edit size={16} className="mr-2"/>Notes</h3>
              <p className="text-gray-600 dark:text-gray-400">{notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}/>
              ))}
            </div>
            <div className="flex gap-2">
              {tags?.map(t => <span key={t} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">{t}</span>)}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Added on {added}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetailModal;
