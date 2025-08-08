import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThumbsUp, ThumbsDown, Volume2 } from 'lucide-react';
import { playAudio } from '../../utils/helpers';

const StudySession = ({ words, onExit, accent }) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentWord = words[currentIndex];

    useEffect(() => {
        if(currentWord) {
            playAudio(currentWord.phonetics, accent);
        }
    }, [currentWord, accent]);

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl mb-4 flex justify-between items-center text-gray-600 dark:text-gray-400">
                <span>{currentIndex + 1} / {words.length}</span>
                <button onClick={onExit} className="hover:text-gray-800 dark:hover:text-gray-200">{t('review_center.exit')}</button>
            </div>
            <div className="w-full max-w-2xl h-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col justify-center items-center p-6 text-center">
                <div className="flex items-center mb-2">
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{currentWord.word}</h3>
                    <button onClick={() => playAudio(currentWord.phonetics, accent)} className="ml-4 text-gray-400 hover:text-indigo-600"><Volume2 size={24}/></button>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">{currentWord.def}</p>
                <p className="text-md text-gray-500 dark:text-gray-500 italic mt-4">"{currentWord.sentences[0]?.text}"</p>
            </div>
            <div className="mt-6 flex items-center justify-center w-full max-w-2xl gap-4">
                <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0} className="px-8 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50">{t('review_center.previous')}</button>
                <button onClick={() => setCurrentIndex(i => Math.min(words.length - 1, i + 1))} disabled={currentIndex === words.length - 1} className="px-8 py-3 rounded-lg bg-indigo-600 text-white">{t('review_center.next')}</button>
            </div>
        </div>
    );
};

const ReviewSession = ({ words, onExit, onWordMastered, accent }) => {
    const { t } = useTranslation();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionResults, setSessionResults] = useState({ correct: [], incorrect: [] });
    const [showSummary, setShowSummary] = useState(false);

    const currentWord = words[currentWordIndex];

    useEffect(() => {
        if(currentWord && !isFlipped) {
            playAudio(currentWord.phonetics, accent);
        }
    }, [currentWord, isFlipped, accent]);

    const handleSessionEnd = () => {
        setShowSummary(true);
    };

    const handleNext = (correct) => {
        setSessionResults(prev => ({
            ...prev,
            [correct ? 'correct' : 'incorrect']: [...prev[correct ? 'correct' : 'incorrect'], currentWord.word]
        }));
        setIsFlipped(false);
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
        } else {
            handleSessionEnd();
        }
    };

    const handleMastered = () => {
        onWordMastered(currentWord.word, 'mastered');
        handleNext(true);
    };
    
    if (showSummary) {
        return <ReviewSummaryModal results={sessionResults} onExit={onExit} />;
    }

    if (!currentWord) return null;

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl mb-4 flex justify-between items-center text-gray-600 dark:text-gray-400">
                <span>{currentWordIndex + 1} / {words.length}</span>
                <button onClick={onExit} className="hover:text-gray-800 dark:hover:text-gray-200">{t('review_center.exit')}</button>
            </div>
            
            <div className="w-full max-w-2xl h-80 perspective-1000">
                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col justify-center items-center p-6" >
                        <div className="flex items-center">
                            <h3 className="text-4xl font-bold text-gray-800 dark:text-gray-200">{currentWord.word}</h3>
                            <button onClick={() => playAudio(currentWord.phonetics, accent)} className="ml-4 text-gray-400 hover:text-indigo-600"><Volume2 size={24}/></button>
                        </div>
                    </div>
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col justify-center items-center p-6 text-center">
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">{currentWord.word}</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400">{currentWord.def}</p>
                         <p className="text-md text-gray-500 dark:text-gray-500 italic mt-4">"{currentWord.sentences[0]?.text}"</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center w-full max-w-2xl gap-4">
                {isFlipped ? (
                    <>
                        <button onClick={() => handleNext(false)} className="bg-red-100 text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">{t('review_center.dont_remember')}</button>
                        <button onClick={() => handleNext(true)} className="bg-green-100 text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900">{t('review_center.remember')}</button>
                        <button onClick={handleMastered} className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg hover:bg-red-600 transition-colors">✓</button>
                    </>
                ) : (
                    <button onClick={() => setIsFlipped(true)} className="bg-indigo-600 text-white px-12 py-3 rounded-lg font-semibold hover:bg-indigo-700">{t('review_center.show_answer')}</button>
                )}
            </div>
        </div>
    );
};

const ReviewSummaryModal = ({ results, onExit }) => {
    const { t } = useTranslation();
    return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">{t('review_center.review_complete')}</h2>
          <div className="grid grid-cols-2 gap-6">
              <div>
                  <h3 className="font-semibold text-green-600 dark:text-green-400 flex items-center mb-3"><ThumbsUp className="mr-2"/>{t('review_center.mastered_words', { count: results.correct.length })}</h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {results.correct.map(word => <li key={word}>{word}</li>)}
                  </ul>
              </div>
               <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center mb-3"><ThumbsDown className="mr-2"/>{t('review_center.words_to_review', { count: results.incorrect.length })}</h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {results.incorrect.map(word => <li key={word}>{word}</li>)}
                  </ul>
              </div>
          </div>
          <div className="flex justify-center mt-8">
              <button onClick={onExit} className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                {t('review_center.complete')}
              </button>
          </div>
      </div>
    </div>
);
}

const ReviewCenter = ({ wordbook, onWordMastered, accent }) => {
    const { t } = useTranslation();
    const [sessionType, setSessionType] = useState(null); // 'study' or 'review'
  
  const studyWords = useMemo(() => Object.entries(wordbook)
      .filter(([,data]) => data.status === 'not_studied')
      .map(([word, data]) => ({ word, ...data }))
      .sort((a, b) => new Date(a.added) - new Date(b.added))
      .slice(0, 10), [wordbook]);

  const reviewWords = useMemo(() => Object.entries(wordbook)
      .filter(([,data]) => data.status !== 'mastered')
      .map(([word, data]) => {
        const daysSinceAdded = (new Date() - new Date(data.added)) / (1000 * 3600 * 24);
        const retentionScore = data.history.reduce((a, b) => a + b, 0) / (data.history.length + daysSinceAdded);
        return { word, retentionScore, ...data };
      })
      .sort((a, b) => a.retentionScore - b.retentionScore)
      .slice(0, 10), [wordbook]);

  if (sessionType) {
    const wordsForSession = sessionType === 'study' ? studyWords : reviewWords;
    if (wordsForSession.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('review_center.great_job')}</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{sessionType === 'study' ? t('review_center.no_new_words') : t('review_center.no_words_to_review')}</p>
          <button onClick={() => setSessionType(null)} className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors">
            {t('review_center.back')}
          </button>
        </div>
      );
    }
    if (sessionType === 'study') {
        return <StudySession words={wordsForSession} onExit={() => setSessionType(null)} accent={accent} />;
    }
    if (sessionType === 'review') {
        return <ReviewSession words={wordsForSession} onExit={() => setSessionType(null)} onWordMastered={onWordMastered} accent={accent} />;
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('review_center.learn_new_words')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">{t('review_center.learn_new_words_desc', { count: studyWords.length })}</p>
          <button onClick={() => setSessionType('study')} className="w-full bg-indigo-600 text-white px-8 py-3 rounded-lg shadow hover:bg-indigo-700 transition-colors font-semibold text-lg">
            {t('review_center.start_learning')}
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('review_center.review_old_words')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">{t('review_center.review_old_words_desc', { count: reviewWords.length })}</p>
          <button onClick={() => setSessionType('review')} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold text-lg">
            {t('review_center.start_review')}
          </button>
        </div>
      </div>
    </div>
  );
};
