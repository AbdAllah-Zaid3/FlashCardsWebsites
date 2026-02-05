
import React, { useState, useCallback } from 'react';
import { Flashcard } from '../types';
import FlashcardView from './FlashcardView';
import Button from './Button';
import { translations, Language } from '../localization';

interface FlashcardModeProps {
  words: Flashcard[];
  language: Language; // Added language prop
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ words, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = words[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
  }, [words.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
  }, [words.length]);

  const currentDir = language === 'ar' ? 'rtl' : 'ltr';

  if (words.length === 0) {
    return (
      <div className="text-center text-gray-600 text-lg mt-8" dir={currentDir}>
        {translations.noFlashcards[language]}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4" dir={currentDir}>
      <div className="w-full max-w-md">
        <FlashcardView card={currentCard} language={language} />
      </div>

      <div className="flex justify-center items-center mt-6 w-full max-w-md">
        <Button onClick={handlePrevious} variant="secondary" className="mx-2 px-6 py-3">
          {translations.previous[language]}
        </Button>
        <span className="text-lg font-semibold text-gray-700 mx-4">
          {currentIndex + 1} / {words.length}
        </span>
        <Button onClick={handleNext} className="mx-2 px-6 py-3">
          {translations.next[language]}
        </Button>
      </div>
    </div>
  );
};

export default FlashcardMode;