
import React, { useState, useCallback, useMemo } from 'react';
import { Flashcard, WordProgress } from '../types';
import Button from './Button';

interface QuizModeProps {
  words: Flashcard[];
  onQuizComplete: (updatedProgress: WordProgress) => void;
  wordProgress: WordProgress;
  isPracticeWrongMode?: boolean; // New prop to indicate if it's the practice wrong mode
  onPracticeWrongComplete?: (remainingWrongWords: Flashcard[]) => void;
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
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [quizFinished, setQuizFinished] = useState(false);

  const sortedWords = useMemo(() => {
    // If in practice wrong mode, use the provided words as they are already curated
    if (isPracticeWrongMode) {
      return [...words];
    }

    // Otherwise, implement spaced repetition sorting for regular quiz mode
    const now = Date.now();
    return [...words].sort((a, b) => {
      const statusA = wordProgress[a.id] || { repetitions: 0, interval: 0, easeFactor: INITIAL_EASE_FACTOR, lastReviewed: 0 };
      const statusB = wordProgress[b.id] || { repetitions: 0, interval: 0, easeFactor: INITIAL_EASE_FACTOR, lastReviewed: 0 };

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
        // Among due cards, prioritize older ones
        if (nextReviewA < nextReviewB) return -1;
        if (nextReviewB < nextReviewA) return 1;
      }

      // If neither is due or both are due at similar times, prioritize by ease factor (lower easeFactor first)
      if (statusA.easeFactor < statusB.easeFactor) return -1;
      if (statusB.easeFactor < statusA.easeFactor) return 1;

      // Finally, shuffle remaining with a consistent random sort if all else equal
      return 0; // Maintain original order if no specific priority
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
      setFeedbackMessage('Correct!');
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
      // No change to easeFactor on correct for this simplified version
    } else {
      setFeedback('incorrect');
      setFeedbackMessage(`Incorrect. The correct answer is: ${currentWord.arabic}`);
      status.incorrectAttempts += 1;
      status.lastAttemptCorrect = false;

      status.repetitions = 0; // Reset repetitions on incorrect
      status.interval = 1; // Re-show quickly
      status.easeFactor = Math.max(MIN_EASE_FACTOR, status.easeFactor - DECREMENT_EASE_FACTOR);
      status.lastReviewed = Date.now();
    }
    onQuizComplete(updatedProgress);
  }, [currentWord, userInput, wordProgress, initializeWordStatus, onQuizComplete]);

  const handleNextWord = useCallback(() => {
    setUserInput('');
    setFeedback('');
    setFeedbackMessage('');

    if (currentWordIndex < sortedWords.length - 1) {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizFinished(true);
      if (isPracticeWrongMode && onPracticeWrongComplete) {
        // For practice wrong mode, re-filter based on current mastery
        const remainingWrongWords = sortedWords.filter(
          (word) => wordProgress[word.id]?.repetitions < 3 || wordProgress[word.id]?.lastAttemptCorrect === false
        );
        onPracticeWrongComplete(remainingWrongWords);
      }
    }
  }, [currentWordIndex, sortedWords.length, isPracticeWrongMode, onPracticeWrongComplete, wordProgress, sortedWords]);

  const totalWords = words.length;
  const completedWords = currentWordIndex;

  if (words.length === 0) {
    return (
      <div className="text-center text-gray-600 text-lg mt-8">
        No words available for quiz. Please add some words.
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-3xl font-bold text-green-700 mb-4">Quiz Finished!</p>
        <p className="text-xl text-gray-700">You've completed all words in this round.</p>
        {isPracticeWrongMode && (
          <p className="text-lg text-gray-600 mt-2">
            You can continue practicing incorrect words or switch modes.
          </p>
        )}
        <Button onClick={() => window.location.reload()} className="mt-6">
          Start Another Round
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
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
          placeholder="Type Arabic translation here"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          dir="rtl"
          disabled={!!feedback}
        />

        {!feedback ? (
          <Button onClick={handleSubmit} className="w-full">
            Check Answer
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
              Next Word
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
