"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuiz } from "@/contexts/quiz-context"
import { loadFromLocalStorage } from "@/utils/local-storage-helpers"

export default function HomePage() {
  const router = useRouter()
  const { dispatch } = useQuiz()

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = loadFromLocalStorage("quiz_user", null)
    if (savedUser) {
      dispatch({ type: "SET_USER", payload: savedUser })
      router.push("/quiz")
    } else {
      router.push("/login")
    }
  }, [dispatch, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
