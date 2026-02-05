
import React from 'react';
import Button from './Button';
import { AppMode } from '../types';
import { translations, Language } from '../localization';

interface YaelLandingPageProps {
  onModeChange: (mode: AppMode) => void;
  language: Language;
}

const YaelLandingPage: React.FC<YaelLandingPageProps> = ({ onModeChange, language }) => {
  const currentDir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-white rounded-xl shadow-lg border border-indigo-200" dir={currentDir}>
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
        {translations.yaelLandingHeader[language]}
      </h2>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button onClick={() => onModeChange(AppMode.YAEL_SENTENCE_COMPLETION)}>
          {translations.sentenceCompletion[language]}
        </Button>
        <Button onClick={() => onModeChange(AppMode.YAEL_REPHRASING)}>
          {translations.rephrasing[language]}
        </Button>
        <Button onClick={() => onModeChange(AppMode.FLASHCARDS)} variant="secondary" className="mt-4">
          {translations.backToMain[language]}
        </Button>
      </div>
    </div>
  );
};

export default YaelLandingPage;