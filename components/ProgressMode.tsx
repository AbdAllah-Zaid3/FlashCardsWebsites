
import React, { useMemo } from 'react';
import { Flashcard, WordProgress } from '../types';
import { translations, Language } from '../localization';

interface ProgressModeProps {
  allWords: Flashcard[];
  wordProgress: WordProgress;
  language: Language; // Added language prop
}

const ProgressMode: React.FC<ProgressModeProps> = ({ allWords, wordProgress, language }) => {
  const stats = useMemo(() => {
    const totalWords = allWords.length;
    let attemptedWords = 0;
    let masteredWords = 0; // Defined as repetitions >= 3

    const detailedProgress = allWords.map((word) => {
      const status = wordProgress[word.id];
      const correctAttempts = status?.correctAttempts || 0;
      const incorrectAttempts = status?.incorrectAttempts || 0;
      const repetitions = status?.repetitions || 0;
      const interval = status?.interval || 0;
      const lastReviewed = status?.lastReviewed || 0;

      if (correctAttempts > 0 || incorrectAttempts > 0) {
        attemptedWords++;
      }
      if (repetitions >= 3) {
        masteredWords++;
      }

      const totalAttempts = correctAttempts + incorrectAttempts;
      const correctnessPercentage =
        totalAttempts > 0 ? ((correctAttempts / totalAttempts) * 100).toFixed(0) : 'N/A';

      const nextReviewDate = lastReviewed > 0 && interval > 0
        ? new Date(lastReviewed + interval * 24 * 60 * 60 * 1000).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')
        : translations.notYetReviewed[language];

      return {
        ...word,
        correctAttempts,
        incorrectAttempts,
        correctnessPercentage,
        mastered: repetitions >= 3,
        repetitions,
        nextReviewDate,
      };
    });

    const consistentlyWrongWords = detailedProgress.filter(
      (word) => word.incorrectAttempts > 0 && word.repetitions < 3
    ).sort((a, b) => b.incorrectAttempts - a.incorrectAttempts);

    return {
      totalWords,
      attemptedWords,
      masteredWords,
      detailedProgress,
      consistentlyWrongWords,
    };
  }, [allWords, wordProgress, language]);

  const currentDir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-white rounded-xl shadow-lg border border-indigo-200" dir={currentDir}>
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
        {translations.yourLearningProgress[language]}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
        <div className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100">
          <p className="text-lg text-gray-600">{translations.totalWords[language]}</p>
          <p className="text-4xl font-bold text-indigo-800">{stats.totalWords}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
          <p className="text-lg text-gray-600">{translations.attemptedWords[language]}</p>
          <p className="text-4xl font-bold text-blue-800">{stats.attemptedWords}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-100">
          <p className="text-lg text-gray-600">{translations.masteredWords[language]}</p>
          <p className="text-4xl font-bold text-green-800">{stats.masteredWords}</p>
        </div>
      </div>

      {stats.consistentlyWrongWords.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-red-600 mb-4">{translations.wordsToFocusOn[language]}</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.consistentlyWrongWords.map((word) => (
              <li key={word.id} className="bg-red-50 p-3 rounded-md shadow-sm border border-red-100 text-right" dir="rtl">
                <span className="font-semibold text-red-800">{word.hebrew}</span>: {word.arabic} ({word.incorrectAttempts} {translations.incorrectCount[language]})
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="text-2xl font-bold text-indigo-700 mb-4">{translations.detailedWordProgress[language]}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm md:text-base">
              <th className="py-3 px-4 text-right">{translations.hebrew[language]}</th>
              <th className="py-3 px-4 text-right">{translations.arabic[language]}</th>
              <th className="py-3 px-4 text-center">{translations.correctPercentage[language]}</th>
              <th className="py-3 px-4 text-center">{translations.mastered[language]}</th>
              <th className="py-3 px-4 text-center">{translations.nextReview[language]}</th>
            </tr>
          </thead>
          <tbody>
            {stats.detailedProgress.map((word) => (
              <tr key={word.id} className="border-b border-gray-100 hover:bg-gray-50 text-gray-800 text-sm md:text-base">
                <td className="py-3 px-4 text-right" dir="rtl">{word.hebrew}</td>
                <td className="py-3 px-4 text-right" dir="rtl">{word.arabic}</td>
                <td className="py-3 px-4 text-center">{word.correctnessPercentage !== 'N/A' ? `${word.correctnessPercentage}%` : 'N/A'}</td>
                <td className="py-3 px-4 text-center">
                  {word.mastered ? (
                    <span className="text-green-600 font-semibold" aria-label={translations.mastered[language]}>✓</span>
                  ) : (
                    <span className="text-red-400" aria-label={translations.notYetReviewed[language]}>✗</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">{word.nextReviewDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressMode;