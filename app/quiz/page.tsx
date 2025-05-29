"use client";

import { LoadingSpinner } from "@/components/loading-spinner";
import { QuestionCard } from "@/components/question-card";
import { Timer } from "@/components/timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuiz } from "@/contexts/quiz-context";
import {
  clearQuizState,
  loadFromLocalStorage,
  loadQuizState,
  saveQuizState,
} from "@/utils/local-storage-helpers";
import { shuffleArray } from "@/utils/shuffle";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Tipe data API
interface ApiQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export default function QuizPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();

  // Cek login user
  useEffect(() => {
    const savedUser = loadFromLocalStorage("quiz_user", null);
    if (!savedUser) {
      router.push("/login");
      return;
    }

    if (!state.user) {
      dispatch({ type: "SET_USER", payload: savedUser });
    }

    const savedState = loadQuizState();
    if (savedState.questions && savedState.questions.length > 0) {
      dispatch({ type: "RESTORE_STATE", payload: savedState });
      dispatch({ type: "START_TIMER" });
    } else {
      fetchQuestions();
    }
  }, []);

  // Cek quiz selesai
  useEffect(() => {
    if (state.isQuizCompleted && state.questions.length > 0) {
      router.push("/result");
    }
  }, [state.isQuizCompleted, router]);

  // Simpan progres
  useEffect(() => {
    if (state.questions.length > 0) {
      saveQuizState(state);
    }
  }, [state]);

  // Ambil soal quiz
  const fetchQuestions = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple"
      );
      const data = await response.json();

      if (data.results) {
        const processedQuestions = data.results.map((q: ApiQuestion) => ({
          question: q.question,
          correct_answer: q.correct_answer,
          incorrect_answers: q.incorrect_answers,
          shuffled_answers: shuffleArray([
            q.correct_answer,
            ...q.incorrect_answers,
          ]),
        }));

        dispatch({ type: "SET_QUESTIONS", payload: processedQuestions });
        dispatch({ type: "START_TIMER" });
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Keluar quiz
  const handleLogout = () => {
    clearQuizState();
    dispatch({ type: "RESTART_QUIZ" });
    router.push("/login");
  };

  // Ulang quiz
  const handleRestart = () => {
    dispatch({ type: "RESTART_QUIZ" });
    fetchQuestions();
  };

  if (!state.user) {
    return <LoadingSpinner />;
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (state.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-gradient-to-br from-primary via-zinc-700 to-primary text-white border border-white/20">
          <CardContent className="text-center p-6 space-y-4">
            <h2 className="text-xl font-semibold">Failed to load questions</h2>
            <p className="text-muted-foreground">
              There was an error loading the quiz questions.
            </p>
            <Button onClick={fetchQuestions} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">
              ZulBrain - Quiz Challenge
            </h1>
            <p className="text-muted-foreground text-xs uppercase">
              Welcome back, {state.user}!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Timer />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <QuestionCard />
        </AnimatePresence>

        {/* Restart Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button variant="ghost" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart Quiz
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
