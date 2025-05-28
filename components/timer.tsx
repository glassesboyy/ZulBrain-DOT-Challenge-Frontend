"use client"

import { useEffect } from "react"
import { useQuiz } from "@/contexts/quiz-context"
import { formatTime } from "@/utils/time-formatter"
import { saveQuizState } from "@/utils/local-storage-helpers"
import { Clock } from "lucide-react"

export function Timer() {
  const { state, dispatch } = useQuiz()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (state.isTimerActive && state.timeRemaining > 0 && !state.isQuizCompleted) {
      interval = setInterval(() => {
        dispatch({ type: "SET_TIME_REMAINING", payload: state.timeRemaining - 1 })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [state.isTimerActive, state.timeRemaining, state.isQuizCompleted, dispatch])

  useEffect(() => {
    if (state.isTimerActive) {
      saveQuizState(state)
    }
  }, [state.timeRemaining, state])

  const isLowTime = state.timeRemaining <= 60
  const isVeryLowTime = state.timeRemaining <= 30

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold transition-colors ${
        isVeryLowTime
          ? "bg-red-100 text-red-700 border-2 border-red-300"
          : isLowTime
            ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
            : "bg-blue-100 text-blue-700 border-2 border-blue-300"
      }`}
    >
      <Clock className={`w-5 h-5 ${isVeryLowTime ? "animate-pulse" : ""}`} />
      {formatTime(state.timeRemaining)}
    </div>
  )
}
