import type { QuizState } from "@/contexts/quiz-context";

// Keys localStorage quiz
const STORAGE_KEYS = {
  USER: "quiz_user",
  QUIZ_STATE: "quiz_state",
  QUESTIONS: "quiz_questions",
  ANSWERS: "quiz_answers",
  CURRENT_INDEX: "quiz_current_index",
  TIME_REMAINING: "quiz_time_remaining",
};

// Simpan ke localStorage
export function saveToLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

// Load dari localStorage
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
}

// Hapus dari localStorage
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

// Simpan state quiz
export function saveQuizState(state: Partial<QuizState>): void {
  saveToLocalStorage(STORAGE_KEYS.USER, state.user);
  saveToLocalStorage(STORAGE_KEYS.QUESTIONS, state.questions);
  saveToLocalStorage(STORAGE_KEYS.ANSWERS, state.userAnswers);
  saveToLocalStorage(STORAGE_KEYS.CURRENT_INDEX, state.currentQuestionIndex);
  saveToLocalStorage(STORAGE_KEYS.TIME_REMAINING, state.timeRemaining);
}

// Load state quiz
export function loadQuizState(): Partial<QuizState> {
  return {
    user: loadFromLocalStorage(STORAGE_KEYS.USER, null),
    questions: loadFromLocalStorage(STORAGE_KEYS.QUESTIONS, []),
    userAnswers: loadFromLocalStorage(STORAGE_KEYS.ANSWERS, []),
    currentQuestionIndex: loadFromLocalStorage(STORAGE_KEYS.CURRENT_INDEX, 0),
    timeRemaining: loadFromLocalStorage(STORAGE_KEYS.TIME_REMAINING, 300),
  };
}

// Reset quiz
export function clearQuizState(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeFromLocalStorage(key);
  });
}

export const storageKeys = STORAGE_KEYS;
