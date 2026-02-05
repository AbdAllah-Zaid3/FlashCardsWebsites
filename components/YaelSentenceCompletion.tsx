
import React, { useState, useCallback } from 'react';
import { YaelSentenceCompletionQuestion, AppMode } from '../types';
import Button from './Button';
import { YAEL_SENTENCE_COMPLETION_QUESTIONS } from '../constants';
import { translations, Language } from '../localization';

interface YaelSentenceCompletionProps {
  language: Language;
  onModeChange: (mode: AppMode) => void;
}

const YaelSentenceCompletion: React.FC<YaelSentenceCompletionProps> = ({ language, onModeChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = YAEL_SENTENCE_COMPLETION_QUESTIONS[currentIndex];

  const handleSubmit = useCallback(() => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  }, [selectedOption, currentQuestion]);

  const handleNextQuestion = useCallback(() => {
    setSelectedOption(null);
    setFeedback('');
    setShowExplanation(false);
    if (currentIndex < YAEL_SENTENCE_COMPLETION_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      alert(translations.quizFinished[language]);
      onModeChange(AppMode.YAEL_LANDING); // Go back to Yael landing or main menu
    }
  }, [currentIndex, language, onModeChange]);

  const currentDir = language === 'ar' ? 'rtl' : 'ltr';

  if (YAEL_SENTENCE_COMPLETION_QUESTIONS.length === 0) {
    return (
      <div className="text-center text-gray-600 text-lg mt-8" dir={currentDir}>
        {translations.noYaelQuestions[language]}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4" dir={currentDir}>
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 md:p-8 border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {translations.question[language]} {currentIndex + 1} / {YAEL_SENTENCE_COMPLETION_QUESTIONS.length}
        </h3>
        <p className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6 text-right" dir="rtl">
          {currentQuestion.sentenceWithBlank}
        </p>

        <p className="text-xl text-gray-800 mb-4 text-right">
          {translations.selectOption[language]}
        </p>
        <div className="flex flex-col gap-3 mb-6">
          {currentQuestion.options.map((option) => (
            <Button
              key={option}
              onClick={() => !feedback && setSelectedOption(option)}
              variant={
                feedback
                  ? option === currentQuestion.correctAnswer
                    ? 'success'
                    : option === selectedOption
                      ? 'danger'
                      : 'secondary'
                  : selectedOption === option
                    ? 'primary'
                    : 'secondary'
              }
              className="text-right py-3 px-4"
              dir="rtl"
              disabled={!!feedback}
            >
              {option}
            </Button>
          ))}
        </div>

        {!feedback ? (
          <Button onClick={handleSubmit} className="w-full" disabled={!selectedOption}>
            {translations.submit[language]}
          </Button>
        ) : (
          <div className="mt-4 animate-fade-in">
            <p
              className={`text-xl font-semibold ${
                feedback === 'correct' ? 'text-green-600' : 'text-red-600'
              } mb-4 text-center`}
              dir={currentDir}
            >
              {feedback === 'correct' ? translations.correct[language] : translations.incorrect[language]}
            </p>
            {currentQuestion.explanation && (
              <Button onClick={() => setShowExplanation(true)} variant="transparent" className="w-full mb-4">
                {translations.viewExplanation[language]}
              </Button>
            )}
            {showExplanation && currentQuestion.explanation && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2 text-right" dir="rtl">
                <p className="font-semibold text-gray-800">{translations.explanation[language]}</p>
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </div>
            )}
            <Button onClick={handleNextQuestion} variant="primary" className="w-full mt-4">
              {translations.nextWord[language]}
            </Button>
          </div>
        )}
      </div>
      <Button onClick={() => onModeChange(AppMode.YAEL_LANDING)} variant="secondary" className="mt-6">
        {translations.backToMain[language]}
      </Button>
    </div>
  );
};

export default YaelSentenceCompletion;