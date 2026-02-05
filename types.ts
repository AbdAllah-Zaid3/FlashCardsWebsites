
export interface Flashcard {
  id: string;
  hebrew: string;
  arabic: string;
  example: string;
}

export enum AppMode {
  FLASHCARDS = 'flashcards',
  QUIZ = 'quiz',
  PRACTICE_WRONG = 'practice_wrong',
  PROGRESS = 'progress',
  YAEL_LANDING = 'yael_landing', // New mode for Yael selection
  YAEL_SENTENCE_COMPLETION = 'yael_sentence_completion',
  YAEL_REPHRASING = 'yael_rephrasing',
}

export interface WordStatus {
  correctAttempts: number;
  incorrectAttempts: number;
  lastAttemptCorrect: boolean | null;
  // Spaced Repetition fields
  repetitions: number;    // Consecutive correct repetitions
  interval: number;       // Interval in days for next review
  easeFactor: number;     // Factor to adjust interval growth (e.g., 1.3 to 2.5)
  lastReviewed: number;   // Unix timestamp of last review
}

export type WordProgress = { [id: string]: WordStatus };

export interface YaelSentenceCompletionQuestion {
  id: string;
  sentenceWithBlank: string; // "הוא אהב את הספר ___ לא מצא זמן לקרוא אותו."
  correctAnswer: string;
  options: string[]; // ['אבל', 'בגלל', 'לכן', 'אף על פי']
  explanation?: string;
}

export interface YaelRephrasingQuestion {
  id: string;
  originalSentence: string;
  rephrasedOptions: string[];
  correctOptionIndex: number;
  explanation?: string;
}
