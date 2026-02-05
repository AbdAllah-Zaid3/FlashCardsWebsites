
import React, { useState, useCallback, useEffect } from 'react';
import { Flashcard, WordProgress } from '../types';
import QuizMode from './QuizMode';
import Button from './Button';

interface PracticeWrongModeProps {
  allWords: Flashcard[];
  wordProgress: WordProgress;
  onUpdateWordProgress: (updatedProgress: WordProgress) => void;
  onExitPractice: () => void;
}

const PracticeWrongMode: React.FC<PracticeWrongModeProps> = ({
  allWords,
  wordProgress,
  onUpdateWordProgress,
  onExitPractice,
}) => {
  const [wrongWordsToPractice, setWrongWordsToPractice] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  // A word is considered "wrong" or unmastered if repetitions are less than 3
  // or if the last attempt was incorrect.
  const filterAndShuffleWrongWords = useCallback((words: Flashcard[], progress: WordProgress) => {
    return words
      .filter((word) => {
        const status = progress[word.id];
        // If no status, it's never been attempted, so it's "wrong" for practice
        // If repetitions < 3, not yet mastered
        // If lastAttemptCorrect is false, recently got it wrong
        return !status || status.repetitions < 3 || status.lastAttemptCorrect === false;
      })
      .sort(() => Math.random() - 0.5); // Shuffle for variety
  }, []);

  useEffect(() => {
    setWrongWordsToPractice(filterAndShuffleWrongWords(allWords, wordProgress));
    setLoading(false);
  }, [allWords, wordProgress, filterAndShuffleWrongWords]);

  const handlePracticeWrongComplete = useCallback(
    (remainingWrongWords: Flashcard[]) => {
      // After a round, re-evaluate which words are still wrong based on the updated progress
      setWrongWordsToPractice(filterAndShuffleWrongWords(remainingWrongWords, wordProgress));
    },
    [filterAndShuffleWrongWords, wordProgress]
  );

  const handleQuizUpdate = useCallback(
    (updatedProgress: WordProgress) => {
      onUpdateWordProgress(updatedProgress);
      // Re-evaluate which words are still wrong based on the updated progress
      setWrongWordsToPractice(filterAndShuffleWrongWords(allWords, updatedProgress));
    },
    [allWords, filterAndShuffleWrongWords, onUpdateWordProgress]
  );

  if (loading) {
    return <div className="text-center text-gray-600 text-lg mt-8">Loading practice words...</div>;
  }

  if (wrongWordsToPractice.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-3xl font-bold text-green-700 mb-4">Great Job!</p>
        <p className="text-xl text-gray-700 mb-6">You've mastered all the words you got wrong!</p>
        <Button onClick={onExitPractice} className="mt-4">
          Back to Main Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-6 text-center">
        Practice Wrong Words ({wrongWordsToPractice.length} remaining)
      </h2>
      <QuizMode
        words={wrongWordsToPractice}
        onQuizComplete={handleQuizUpdate}
        wordProgress={wordProgress}
        isPracticeWrongMode={true}
        onPracticeWrongComplete={handlePracticeWrongComplete}
      />
      <Button onClick={onExitPractice} variant="secondary" className="mt-6 mb-4">
        Exit Practice
      </Button>
    </div>
  );
};

export default PracticeWrongMode;
