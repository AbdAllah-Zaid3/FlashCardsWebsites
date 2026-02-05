
import React, { useState, useCallback, useEffect } from 'react';
import { Flashcard, WordProgress } from '../types';
import QuizMode from './QuizMode';
import Button from './Button';
import { translations, Language } from '../localization';

interface PracticeWrongModeProps {
  allWords: Flashcard[];
  wordProgress: WordProgress;
  onUpdateWordProgress: (updatedProgress: WordProgress) => void;
  onExitPractice: () => void;
  language: Language; // Added language prop
}

const PracticeWrongMode: React.FC<PracticeWrongModeProps> = ({
  allWords,
  wordProgress,
  onUpdateWordProgress,
  onExitPractice,
  language,
}) => {
  const [wrongWordsToPractice, setWrongWordsToPractice] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const filterAndShuffleWrongWords = useCallback((words: Flashcard[], progress: WordProgress) => {
    return words
      .filter((word) => {
        const status = progress[word.id];
        return !status || status.repetitions < 3 || status.lastAttemptCorrect === false;
      })
      .sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    setWrongWordsToPractice(filterAndShuffleWrongWords(allWords, wordProgress));
    setLoading(false);
  }, [allWords, wordProgress, filterAndShuffleWrongWords]);

  const handlePracticeWrongComplete = useCallback(
    (remainingWrongWords: Flashcard[]) => {
      setWrongWordsToPractice(filterAndShuffleWrongWords(remainingWrongWords, wordProgress));
    },
    [filterAndShuffleWrongWords, wordProgress]
  );

  const handleQuizUpdate = useCallback(
    (updatedProgress: WordProgress) => {
      onUpdateWordProgress(updatedProgress);
      setWrongWordsToPractice(filterAndShuffleWrongWords(allWords, updatedProgress));
    },
    [allWords, filterAndShuffleWrongWords, onUpdateWordProgress]
  );

  const currentDir = language === 'ar' ? 'rtl' : 'ltr';

  if (loading) {
    return <div className="text-center text-gray-600 text-lg mt-8" dir={currentDir}>{translations.loadingPracticeWords[language]}</div>;
  }

  if (wrongWordsToPractice.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center" dir={currentDir}>
        <p className="text-3xl font-bold text-green-700 mb-4">{translations.greatJob[language]}</p>
        <p className="text-xl text-gray-700 mb-6">{translations.masteredAllWrong[language]}</p>
        <Button onClick={onExitPractice} className="mt-4">
          {translations.backToMainMenu[language]}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center" dir={currentDir}>
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-6 text-center">
        {translations.practiceWrongWords[language]} ({wrongWordsToPractice.length} {translations.remaining[language]})
      </h2>
      <QuizMode
        words={wrongWordsToPractice}
        onQuizComplete={handleQuizUpdate}
        wordProgress={wordProgress}
        isPracticeWrongMode={true}
        onPracticeWrongComplete={handlePracticeWrongComplete}
        language={language} // Pass language prop
      />
      <Button onClick={onExitPractice} variant="secondary" className="mt-6 mb-4">
        {translations.exitPractice[language]}
      </Button>
    </div>
  );
};

export default PracticeWrongMode;