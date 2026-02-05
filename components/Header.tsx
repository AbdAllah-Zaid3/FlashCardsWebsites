
import React from 'react';
import Button from './Button';
import { AppMode } from '../types';
import { translations, Language } from '../localization';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  language: Language; // Added language prop
  onLanguageToggle: () => void; // Added language toggle handler
}

const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange, language, onLanguageToggle }) => {
  const currentDir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <header className="w-full bg-white shadow-md p-4 md:p-6 flex flex-col md:flex-row items-center justify-between sticky top-0 z-10 border-b-2 border-indigo-200" dir={currentDir}>
      <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4 md:mb-0">
        <span className="text-blue-500">Hebrew</span>{' '}
        <span className="text-gray-700">↔</span>{' '}
        <span className="text-green-600">Arabic</span> Flashcards
      </h1>
      <nav className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => onModeChange(AppMode.FLASHCARDS)}
          variant={currentMode === AppMode.FLASHCARDS ? 'primary' : 'secondary'}
          size="sm"
          className="min-w-[120px]"
        >
          {translations.flashcards[language]}
        </Button>
        <Button
          onClick={() => onModeChange(AppMode.QUIZ)}
          variant={currentMode === AppMode.QUIZ ? 'primary' : 'secondary'}
          size="sm"
          className="min-w-[120px]"
        >
          {translations.quiz[language]}
        </Button>
        <Button
          onClick={() => onModeChange(AppMode.PRACTICE_WRONG)}
          variant={currentMode === AppMode.PRACTICE_WRONG ? 'primary' : 'secondary'}
          size="sm"
          className="min-w-[120px]"
        >
          {translations.practiceWrong[language]}
        </Button>
        <Button
          onClick={() => onModeChange(AppMode.PROGRESS)}
          variant={currentMode === AppMode.PROGRESS ? 'primary' : 'secondary'}
          size="sm"
          className="min-w-[120px]"
        >
          {translations.progress[language]}
        </Button>
        <Button
          onClick={() => onModeChange(AppMode.YAEL_LANDING)}
          variant={currentMode === AppMode.YAEL_LANDING || currentMode === AppMode.YAEL_SENTENCE_COMPLETION || currentMode === AppMode.YAEL_REPHRASING ? 'primary' : 'secondary'}
          size="sm"
          className="min-w-[120px]"
        >
          {translations.yaelExams[language]}
        </Button>
        <Button
          onClick={onLanguageToggle}
          variant="transparent"
          size="sm"
          className="min-w-[80px]"
        >
          {translations.languageToggle[language]}
        </Button>
      </nav>
    </header>
  );
};

export default Header;