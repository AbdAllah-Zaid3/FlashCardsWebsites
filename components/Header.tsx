
import React from 'react';
import Button from './Button';
import { AppMode } from '../types';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange }) => {
  return (
    <header className="w-full bg-white shadow-md p-4 md:p-6 flex flex-col md:flex-row items-center justify-between sticky top-0 z-10 border-b-2 border-indigo-200">
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
          Flashcards
        </Button>
        <Button
          onClick={() => onModeChange(AppMode.QUIZ)}
          variant={currentMode === AppMode.QUIZ ? 'primary' : 'secondary'}
          size="sm"
          className="min-w-[120px]"
        >
          Quiz
        </Button>
        <Button
          onClick={() => onModeChange(AppMode.PRACTICE_WRONG)}
          variant={currentMode === AppMode.PRACTICE_WRONG ? 'primary' : 'secondary'}
          size="sm"
          className="min-w-[120px]"
        >
          Practice Wrong
        </Button>
        <Button
          onClick={() => onModeChange(AppMode.PROGRESS)}
          variant={currentMode === AppMode.PROGRESS ? 'primary' : 'secondary'}
          size="sm"
          className="min-w-[120px]"
        >
          Progress
        </Button>
      </nav>
    </header>
  );
};

export default Header;
