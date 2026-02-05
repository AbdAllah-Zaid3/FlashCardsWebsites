
interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  appName: { en: "Hebrew ↔ Arabic Flashcards", ar: "بطاقات فلاش عبرية ↔ عربية" },
  flashcards: { en: "Flashcards", ar: "بطاقات فلاش" },
  quiz: { en: "Quiz", ar: "اختبار" },
  practiceWrong: { en: "Practice Wrong", ar: "تدرب على الأخطاء" },
  progress: { en: "Progress", ar: "التقدم" },
  yaelExams: { en: "Yael Exams", ar: "امتحانات يا-عل" },
  languageToggle: { en: "العربية", ar: "English" }, // Button text to switch language
  revealAnswer: { en: "Reveal Answer", ar: "أظهر الإجابة" },
  hideAnswer: { en: "Hide Answer", ar: "أخفِ الإجابة" },
  previous: { en: "Previous", ar: "السابق" },
  next: { en: "Next", ar: "التالي" },
  noFlashcards: { en: "No flashcards available. Please add some words.", ar: "لا توجد بطاقات فلاش. الرجاء إضافة كلمات." },
  typeArabicTranslation: { en: "Type Arabic translation here", ar: "اكتب الترجمة العربية هنا" },
  checkAnswer: { en: "Check Answer", ar: "تحقق من الإجابة" },
  correct: { en: "Correct!", ar: "صحيح!" },
  incorrect: { en: "Incorrect. The correct answer is:", ar: "غير صحيح. الإجابة الصحيحة هي:" },
  nextWord: { en: "Next Word", ar: "الكلمة التالية" },
  quizFinished: { en: "Quiz Finished!", ar: "انتهى الاختبار!" },
  quizCompleted: { en: "You've completed all words in this round.", ar: "لقد أكملت جميع الكلمات في هذه الجولة." },
  continuePracticing: { en: "You can continue practicing incorrect words or switch modes.", ar: "يمكنك مواصلة التدرب على الكلمات الخاطئة أو تبديل الأوضاع." },
  restartQuiz: { en: "Start Another Round", ar: "ابدأ جولة أخرى" },
  loadingPracticeWords: { en: "Loading practice words...", ar: "جارٍ تحميل كلمات التدريب..." },
  greatJob: { en: "Great Job!", ar: "عمل رائع!" },
  masteredAllWrong: { en: "You've mastered all the words you got wrong!", ar: "لقد أتقنت جميع الكلمات التي أخطأت فيها!" },
  backToMainMenu: { en: "Back to Main Menu", ar: "العودة إلى القائمة الرئيسية" },
  exitPractice: { en: "Exit Practice", ar: "الخروج من التدريب" },
  practiceWrongWords: { en: "Practice Wrong Words", ar: "تدرب على الكلمات الخاطئة" },
  remaining: { en: "remaining", ar: "متبقية" },
  noWordsToPractice: { en: "No words to practice!", ar: "لا توجد كلمات للتدرب عليها!" },
  noMistakesYet: { en: "You haven't made any mistakes yet or have mastered them all.", ar: "لم ترتكب أي أخطاء بعد أو أتقنتها جميعًا." },
  keepUpGoodWork: { en: "Keep up the great work!", ar: "استمر في العمل الرائع!" },
  yourLearningProgress: { en: "Your Learning Progress", ar: "تقدم تعلمك" },
  totalWords: { en: "Total Words", ar: "إجمالي الكلمات" },
  attemptedWords: { en: "Attempted Words", ar: "الكلمات التي تمت محاولتها" },
  masteredWords: { en: "Mastered Words", ar: "الكلمات المتقنة" },
  wordsToFocusOn: { en: "Words to Focus On", ar: "كلمات للتركيز عليها" },
  incorrectCount: { en: "incorrect", ar: "خطأ" },
  detailedWordProgress: { en: "Detailed Word Progress", ar: "التقدم التفصيلي للكلمات" },
  hebrew: { en: "Hebrew", ar: "عبري" },
  arabic: { en: "Arabic", ar: "عربي" },
  correctPercentage: { en: "Correct %", ar: "نسبة الصحيح" },
  mastered: { en: "Mastered", ar: "متقنة" },
  nextReview: { en: "Next Review", ar: "المراجعة التالية" },
  notYetReviewed: { en: "Not yet reviewed", ar: "لم تتم مراجعتها بعد" },
  yaelLandingHeader: { en: "Choose Yael Exam Type", ar: "اختر نوع امتحان يا-عل" },
  sentenceCompletion: { en: "Sentence Completion", ar: "إكمال الجملة" },
  rephrasing: { en: "Rephrasing", ar: "إعادة الصياغة" },
  backToMain: { en: "Back to Main", ar: "العودة للرئيسية" },
  selectOption: { en: "Select the correct option:", ar: "اختر الخيار الصحيح:" },
  question: { en: "Question", ar: "سؤال" },
  submit: { en: "Submit", ar: "إرسال" },
  viewExplanation: { en: "View Explanation", ar: "عرض الشرح" },
  explanation: { en: "Explanation:", ar: "الشرح:" },
  originalSentence: { en: "Original Sentence:", ar: "الجملة الأصلية:" },
  chooseBestRephrasing: { en: "Choose the best rephrasing:", ar: "اختر أفضل إعادة صياغة:" },
  noYaelQuestions: { en: "No Yael questions available.", ar: "لا توجد أسئلة يا-عل متاحة." },
};

export type Language = 'en' | 'ar';
