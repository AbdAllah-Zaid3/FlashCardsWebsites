
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
  PROGRESS = 'progress', // New mode
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
