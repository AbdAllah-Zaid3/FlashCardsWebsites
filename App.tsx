
import React, { useState, useCallback, useEffect } from 'react';
import { AppMode, WordProgress, Flashcard } from './types';
import { FLASHCARD_WORDS } from './constants';
import FlashcardMode from './components/FlashcardMode';
import QuizMode from './components/QuizMode';
import PracticeWrongMode from './components/PracticeWrongMode';
import Header from './components/Header';
import ProgressMode from './components/ProgressMode';
import YaelLandingPage from './components/YaelLandingPage'; // Import Yael landing
import YaelSentenceCompletion from './components/YaelSentenceCompletion'; // Import Yael Sentence Completion
import YaelRephrasing from './components/YaelRephrasing'; // Import Yael Rephrasing
import { translations, Language } from './localization';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.FLASHCARDS);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    return (savedLanguage === 'en' || savedLanguage === 'ar') ? savedLanguage : 'en';
  });
  const [wordProgress, setWordProgress] = useState<WordProgress>(() => {
    const savedProgress = localStorage.getItem('flashcardProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  // Save progress to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('flashcardProgress', JSON.stringify(wordProgress));
  }, [wordProgress]);

  // Save language to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('appLanguage', currentLanguage);
  }, [currentLanguage]);

  const handleModeChange = useCallback((mode: AppMode) => {
    setCurrentMode(mode);
  }, []);

  const handleLanguageToggle = useCallback(() => {
    setCurrentLanguage((prevLang) => (prevLang === 'en' ? 'ar' : 'en'));
  }, []);

  const handleUpdateWordProgress = useCallback((updatedProgress: WordProgress) => {
    setWordProgress(updatedProgress);
  }, []);

  // Update body direction when language changes
  useEffect(() => {
    document.body.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  const renderContent = () => {
    switch (currentMode) {
      case AppMode.FLASHCARDS:
        return <FlashcardMode words={FLASHCARD_WORDS} language={currentLanguage} />;
      case AppMode.QUIZ:
        return (
          <QuizMode
            words={FLASHCARD_WORDS}
            onQuizComplete={handleUpdateWordProgress}
            wordProgress={wordProgress}
            language={currentLanguage}
          />
        );
      case AppMode.PRACTICE_WRONG:
        // PracticeWrongMode will handle its own filtering based on the full wordProgress
        const wordsForPractice = FLASHCARD_WORDS.filter(
          (word) => {
            const status = wordProgress[word.id];
            return !status || status.repetitions < 3 || status.lastAttemptCorrect === false;
          }
        );

        if (wordsForPractice.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center p-6 text-center" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <p className="text-3xl font-bold text-green-700 mb-4">{translations.noWordsToPractice[currentLanguage]}</p>
              <p className="text-xl text-gray-700">{translations.noMistakesYet[currentLanguage]}</p>
              <p className="text-lg text-gray-600 mt-4">{translations.keepUpGoodWork[currentLanguage]}</p>
            </div>
          );
        }
        return (
          <PracticeWrongMode
            allWords={FLASHCARD_WORDS}
            wordProgress={wordProgress}
            onUpdateWordProgress={handleUpdateWordProgress}
            onExitPractice={() => setCurrentMode(AppMode.QUIZ)}
            language={currentLanguage}
          />
        );
      case AppMode.PROGRESS:
        return (
          <ProgressMode
            allWords={FLASHCARD_WORDS}
            wordProgress={wordProgress}
            language={currentLanguage}
          />
        );
      case AppMode.YAEL_LANDING:
        return (
          <YaelLandingPage
            onModeChange={handleModeChange}
            language={currentLanguage}
          />
        );
      case AppMode.YAEL_SENTENCE_COMPLETION:
        return (
          <YaelSentenceCompletion
            language={currentLanguage}
            onModeChange={handleModeChange}
          />
        );
      case AppMode.YAEL_REPHRASING:
        return (
          <YaelRephrasing
            language={currentLanguage}
            onModeChange={handleModeChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header
        currentMode={currentMode}
        onModeChange={handleModeChange}
        language={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      <main className="flex-grow w-full max-w-4xl p-4 md:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;