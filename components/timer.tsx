"use client";

import { useQuiz } from "@/contexts/quiz-context";
import { saveQuizState } from "@/utils/local-storage-helpers";
import { formatTime } from "@/utils/time-formatter";
import { Clock } from "lucide-react";
import { useEffect } from "react";

export function Timer() {
  const { state, dispatch } = useQuiz();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (
      state.isTimerActive &&
      state.timeRemaining > 0 &&
      !state.isQuizCompleted
    ) {
      interval = setInterval(() => {
        dispatch({
          type: "SET_TIME_REMAINING",
          payload: state.timeRemaining - 1,
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    state.isTimerActive,
    state.timeRemaining,
    state.isQuizCompleted,
    dispatch,
  ]);

  useEffect(() => {
    if (state.isTimerActive) {
      saveQuizState(state);
    }
  }, [state.timeRemaining, state]);

  const isLowTime = state.timeRemaining <= 60;
  const isVeryLowTime = state.timeRemaining <= 30;

  return (
    <div
      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-mono text-md font-bold transition-colors ${
        isVeryLowTime
          ? "bg-white text-red-700 border-1 border-red-300"
          : isLowTime
          ? "bg-white text-orange-700 border-1 border-orange-300"
          : "bg-white text-blue-700 border-1 border-blue-300"
      }`}
    >
      <Clock className={`w-4 h-4 ${isVeryLowTime ? "animate-pulse" : ""}`} />
      {formatTime(state.timeRemaining)}
    </div>
  );
}
