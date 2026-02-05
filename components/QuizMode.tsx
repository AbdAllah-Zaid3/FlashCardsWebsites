
import React, { useState, useCallback, useMemo } from 'react';
import { Flashcard, WordProgress } from '../types';
import Button from './Button';
import { translations, Language } from '../localization';

interface QuizModeProps {
  words: Flashcard[];
  onQuizComplete: (updatedProgress: WordProgress) => void;
  wordProgress: WordProgress;
  isPracticeWrongMode?: boolean;
  onPracticeWrongComplete?: (remainingWrongWords: Flashcard[]) => void;
  language: Language; // Added language prop
}

// Constants for Spaced Repetition
const INITIAL_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const DECREMENT_EASE_FACTOR = 0.2;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const QuizMode: React.FC<QuizModeProps> = ({
  words,
  onQuizComplete,
  wordProgress,
  isPracticeWrongMode = false,
  onPracticeWrongComplete,
  language,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [quizFinished, setQuizFinished] = useState(false);

  const sortedWords = useMemo(() => {
    if (isPracticeWrongMode) {
      return [...words];
    }

    const now = Date.now();
    return [...words].sort((a, b) => {
      const statusA = wordProgress[a.id] || { repetitions: 0, interval: 0, easeFactor: INITIAL_EASE_FACTOR, lastReviewed: 0, correctAttempts: 0, incorrectAttempts: 0, lastAttemptCorrect: null };
      const statusB = wordProgress[b.id] || { repetitions: 0, interval: 0, easeFactor: INITIAL_EASE_FACTOR, lastReviewed: 0, correctAttempts: 0, incorrectAttempts: 0, lastAttemptCorrect: null };

      // Prioritize recently incorrect words
      if (statusA.lastAttemptCorrect === false && statusB.lastAttemptCorrect !== false) return -1;
      if (statusB.lastAttemptCorrect === false && statusA.lastAttemptCorrect !== false) return 1;

      // Calculate next review dates
      const nextReviewA = statusA.lastReviewed + statusA.interval * DAY_IN_MS;
      const nextReviewB = statusB.lastReviewed + statusB.interval * DAY_IN_MS;

      // Prioritize words that are due or overdue
      const isDueA = nextReviewA <= now;
      const isDueB = nextReviewB <= now;

      if (isDueA && !isDueB) return -1;
      if (!isDueA && isDueB) return 1;

      if (isDueA && isDueB) {
        if (nextReviewA < nextReviewB) return -1;
        if (nextReviewB < nextReviewA) return 1;
      }

      if (statusA.easeFactor < statusB.easeFactor) return -1;
      if (statusB.easeFactor < statusA.easeFactor) return 1;

      return 0;
    });
  }, [words, wordProgress, isPracticeWrongMode]);

  const currentWord = sortedWords[currentWordIndex];

  const initializeWordStatus = useCallback(
    (wordId: string) => {
      if (!wordProgress[wordId]) {
        wordProgress[wordId] = {
          correctAttempts: 0,
          incorrectAttempts: 0,
          lastAttemptCorrect: null,
          repetitions: 0,
          interval: 0,
          easeFactor: INITIAL_EASE_FACTOR,
          lastReviewed: 0,
        };
      }
    },
    [wordProgress]
  );

  React.useEffect(() => {
    if (currentWord) {
      initializeWordStatus(currentWord.id);
      setQuizFinished(false);
    }
  }, [currentWord, initializeWordStatus]);

  const handleSubmit = useCallback(() => {
    if (!currentWord) return;

    const trimmedInput = userInput.trim();
    const isCorrect = trimmedInput === currentWord.arabic;

    const updatedProgress = { ...wordProgress };
    initializeWordStatus(currentWord.id);
    const status = updatedProgress[currentWord.id];

    if (isCorrect) {
      setFeedback('correct');
      setFeedbackMessage(translations.correct[language]);
      status.correctAttempts += 1;
      status.lastAttemptCorrect = true;

      status.repetitions += 1;
      let newInterval: number;
      if (status.repetitions === 1) {
        newInterval = 1;
      } else if (status.repetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = status.interval * status.easeFactor;
      }
      status.interval = Math.round(newInterval);
      status.lastReviewed = Date.now();
    } else {
      setFeedback('incorrect');
      setFeedbackMessage(`${translations.incorrect[language]} ${currentWord.arabic}`);
      status.incorrectAttempts += 1;
      status.lastAttemptCorrect = false;

      status.repetitions = 0;
      status.interval = 1;
      status.easeFactor = Math.max(MIN_EASE_FACTOR, status.easeFactor - DECREMENT_EASE_FACTOR);
      status.lastReviewed = Date.now();
    }
    onQuizComplete(updatedProgress);
  }, [currentWord, userInput, wordProgress, initializeWordStatus, onQuizComplete, language]);

  const handleNextWord = useCallback(() => {
    setUserInput('');
    setFeedback('');
    setFeedbackMessage('');

    if (currentWordIndex < sortedWords.length - 1) {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizFinished(true);
      if (isPracticeWrongMode && onPracticeWrongComplete) {
        const remainingWrongWords = sortedWords.filter(
          (word) => wordProgress[word.id]?.repetitions < 3 || wordProgress[word.id]?.lastAttemptCorrect === false
        );
        onPracticeWrongComplete(remainingWrongWords);
      }
    }
  }, [currentWordIndex, sortedWords.length, isPracticeWrongMode, onPracticeWrongComplete, wordProgress, sortedWords]);

  const totalWords = words.length;
  const completedWords = currentWordIndex;
  const currentDir = language === 'ar' ? 'rtl' : 'ltr';

  if (words.length === 0) {
    return (
      <div className="text-center text-gray-600 text-lg mt-8" dir={currentDir}>
        {translations.noFlashcards[language]}
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center" dir={currentDir}>
        <p className="text-3xl font-bold text-green-700 mb-4">{translations.quizFinished[language]}</p>
        <p className="text-xl text-gray-700">{translations.quizCompleted[language]}</p>
        {isPracticeWrongMode && (
          <p className="text-lg text-gray-600 mt-2">
            {translations.continuePracticing[language]}
          </p>
        )}
        <Button onClick={() => window.location.reload()} className="mt-6">
          {translations.restartQuiz[language]}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4" dir={currentDir}>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 border border-indigo-200">
        <p className="text-lg font-semibold text-gray-700 mb-2">
          {completedWords + 1} / {totalWords}
        </p>
        <p className="text-3xl md:text-4xl font-bold text-indigo-700 mb-6 text-center" dir="rtl">
          {currentWord?.hebrew}
        </p>

        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={translations.typeArabicTranslation[language]}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          dir="rtl"
          disabled={!!feedback}
        />

        {!feedback ? (
          <Button onClick={handleSubmit} className="w-full">
            {translations.checkAnswer[language]}
          </Button>
        ) : (
          <div className="mt-4 animate-fade-in">
            <p
              className={`text-xl font-semibold ${
                feedback === 'correct' ? 'text-green-600' : 'text-red-600'
              } mb-4 text-center`}
              dir="rtl"
            >
              {feedbackMessage}
            </p>
            <Button onClick={handleNextWord} variant="secondary" className="w-full">
              {translations.nextWord[language]}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;