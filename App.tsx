
import React, { useState, useCallback } from 'react';
import { AppMode, WordProgress, Flashcard } from './types';
import { FLASHCARD_WORDS } from './constants';
import FlashcardMode from './components/FlashcardMode';
import QuizMode from './components/QuizMode';
import PracticeWrongMode from './components/PracticeWrongMode';
import Header from './components/Header';
import ProgressMode from './components/ProgressMode'; // Import new ProgressMode

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.FLASHCARDS);
  const [wordProgress, setWordProgress] = useState<WordProgress>(() => {
    // Initialize from localStorage if available
    const savedProgress = localStorage.getItem('flashcardProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  // Save progress to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('flashcardProgress', JSON.stringify(wordProgress));
  }, [wordProgress]);

  const handleModeChange = useCallback((mode: AppMode) => {
    setCurrentMode(mode);
  }, []);

  const handleUpdateWordProgress = useCallback((updatedProgress: WordProgress) => {
    setWordProgress(updatedProgress);
  }, []);

  // This function now specifically filters words for practice based on spaced repetition status
  const getWordsForPracticeWrong = useCallback((): Flashcard[] => {
    return FLASHCARD_WORDS.filter(
      (word) => {
        const status = wordProgress[word.id];
        // Consider a word "wrong" for practice if it hasn't been mastered (repetitions < 3)
        // or if the last attempt was incorrect.
        return !status || status.repetitions < 3 || status.lastAttemptCorrect === false;
      }
    );
  }, [wordProgress]);

  const renderContent = () => {
    switch (currentMode) {
      case AppMode.FLASHCARDS:
        return <FlashcardMode words={FLASHCARD_WORDS} />;
      case AppMode.QUIZ:
        return (
          <QuizMode
            words={FLASHCARD_WORDS}
            onQuizComplete={handleUpdateWordProgress}
            wordProgress={wordProgress}
          />
        );
      case AppMode.PRACTICE_WRONG:
        const wordsToPractice = getWordsForPracticeWrong();
        if (wordsToPractice.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-3xl font-bold text-green-700 mb-4">No words to practice!</p>
              <p className="text-xl text-gray-700">You haven't made any mistakes yet or have mastered them all.</p>
              <p className="text-lg text-gray-600 mt-4">Keep up the great work!</p>
            </div>
          );
        }
        return (
          <PracticeWrongMode
            allWords={FLASHCARD_WORDS} // Pass all words to PracticeWrongMode so it can manage its internal state
            wordProgress={wordProgress}
            onUpdateWordProgress={handleUpdateWordProgress}
            onExitPractice={() => setCurrentMode(AppMode.QUIZ)}
          />
        );
      case AppMode.PROGRESS: // New case for progress mode
        return (
          <ProgressMode
            allWords={FLASHCARD_WORDS}
            wordProgress={wordProgress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header currentMode={currentMode} onModeChange={handleModeChange} />
      <main className="flex-grow w-full max-w-4xl p-4 md:p-6 lg:p-8">
        {renderContent()}
      </main>
      {/* Optional footer or persistent elements */}
    </div>
  );
}

export default App;
