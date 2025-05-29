"use client";

import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";

// Struktur data soal
export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  shuffled_answers: string[];
}

// State quiz global
export interface QuizState {
  user: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: string[];
  timeRemaining: number;
  isLoading: boolean;
  isQuizCompleted: boolean;
  isTimerActive: boolean;
}

// Tipe aksi quiz
type QuizAction =
  | { type: "SET_USER"; payload: string }
  | { type: "SET_QUESTIONS"; payload: Question[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ANSWER_QUESTION"; payload: string }
  | { type: "NEXT_QUESTION" }
  | { type: "SET_TIME_REMAINING"; payload: number }
  | { type: "COMPLETE_QUIZ" }
  | { type: "RESTART_QUIZ" }
  | { type: "RESTORE_STATE"; payload: Partial<QuizState> }
  | { type: "START_TIMER" }
  | { type: "STOP_TIMER" };

// State awal quiz
const initialState: QuizState = {
  user: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  timeRemaining: 300, // 5 menit
  isLoading: false,
  isQuizCompleted: false,
  isTimerActive: false,
};

// Pengatur state quiz
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "ANSWER_QUESTION":
      const newAnswers = [...state.userAnswers];
      newAnswers[state.currentQuestionIndex] = action.payload;
      return { ...state, userAnswers: newAnswers };
    case "NEXT_QUESTION":
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, isQuizCompleted: true, isTimerActive: false };
      }
      return { ...state, currentQuestionIndex: nextIndex };
    case "SET_TIME_REMAINING":
      if (action.payload <= 0) {
        return {
          ...state,
          timeRemaining: 0,
          isQuizCompleted: true,
          isTimerActive: false,
        };
      }
      return { ...state, timeRemaining: action.payload };
    case "COMPLETE_QUIZ":
      return { ...state, isQuizCompleted: true, isTimerActive: false };
    case "START_TIMER":
      return { ...state, isTimerActive: true };
    case "STOP_TIMER":
      return { ...state, isTimerActive: false };
    case "RESTART_QUIZ":
      return {
        ...initialState,
        user: state.user,
      };
    case "RESTORE_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Context quiz
const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
} | null>(null);

// Provider quiz
export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

// Hook quiz
export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
