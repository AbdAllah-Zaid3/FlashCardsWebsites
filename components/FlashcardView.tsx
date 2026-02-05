
import React, { useState } from 'react';
import { Flashcard } from '../types';
import Button from './Button';
import { translations, Language } from '../localization';

interface FlashcardViewProps {
  card: Flashcard;
  onReveal?: () => void;
  language: Language; // Added language prop
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ card, onReveal, language }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    onReveal?.();
  };

  const handleHide = () => {
    setIsRevealed(false);
  };

  const resetCard = () => {
    setIsRevealed(false);
  };

  React.useEffect(() => {
    resetCard();
  }, [card]);

  const currentDir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col items-center justify-center min-h-[250px] md:min-h-[300px] text-center transition-transform transform hover:scale-105 duration-300 border border-indigo-200" dir={currentDir}>
      <div className="mb-4">
        <p className="text-3xl md:text-4xl font-bold text-indigo-700 mb-2" dir="rtl">
          {card.hebrew}
        </p>
        {isRevealed && (
          <div className="mt-4 animate-fade-in" dir="rtl">
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 border-t pt-2 border-indigo-300">
              {card.arabic}
            </p>
            {card.example && (
              <p className="text-sm md:text-base text-gray-500 mt-3 italic max-w-sm mx-auto">
                "{card.example}"
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        {!isRevealed ? (
          <Button onClick={handleReveal} variant="secondary" size="sm">
            {translations.revealAnswer[language]}
          </Button>
        ) : (
          <Button onClick={handleHide} variant="secondary" size="sm">
            {translations.hideAnswer[language]}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FlashcardView;