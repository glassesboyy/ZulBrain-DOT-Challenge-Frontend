"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuiz } from "@/contexts/quiz-context";
import {
  clearQuizState,
  loadFromLocalStorage,
} from "@/utils/local-storage-helpers";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Home,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Halaman hasil quiz
export default function ResultPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();
  const [results, setResults] = useState({
    correct: 0,
    wrong: 0,
    attempted: 0,
    percentage: 0,
  });

  // Hitung skor quiz
  useEffect(() => {
    const savedUser = loadFromLocalStorage("quiz_user", null);
    if (!savedUser || !state.isQuizCompleted) {
      router.push("/login");
      return;
    }

    let correct = 0;
    let attempted = 0;

    state.userAnswers.forEach((answer, index) => {
      if (answer) {
        attempted++;
        if (answer === state.questions[index]?.correct_answer) {
          correct++;
        }
      }
    });

    const wrong = attempted - correct;
    const percentage =
      attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    setResults({ correct, wrong, attempted, percentage });
  }, [state, router]);

  // Reset quiz baru
  const handleRestart = () => {
    clearQuizState();
    dispatch({ type: "RESTART_QUIZ" });
    router.push("/quiz");
  };

  // Kembali login
  const handleGoHome = () => {
    clearQuizState();
    dispatch({ type: "RESTART_QUIZ" });
    router.push("/login");
  };

  // Pesan performa
  const getPerformanceMessage = () => {
    if (results.percentage >= 90) return "Outstanding!";
    if (results.percentage >= 80) return "Excellent work!";
    if (results.percentage >= 70) return "Good job!";
    if (results.percentage >= 60) return "Not bad!";
    return "Keep practicing!";
  };

  // Warna performa
  const getPerformanceColor = () => {
    if (results.percentage >= 80) return "text-green-600";
    if (results.percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Cegah back browser
  useEffect(() => {
    const handlePopState = () => {
      router.push("/result");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl bg-gradient-to-br from-primary via-zinc-700 to-primary text-white border border-white/20">
          <CardHeader className="text-center space-y-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-primary border border-white/40"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-4xl font-bold">Quiz Complete!</CardTitle>
            <p className={`text-lg font-medium ${getPerformanceColor()}`}>
              {getPerformanceMessage()}{" "}
              <span className="text-white">{state.user}</span>
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-white">
                {results.percentage}%
              </div>
              <Progress value={results.percentage} className="w-full h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center p-4 bg-black text-white border-5 border-green-700 rounded-lg flex items-center"
              >
                <CheckCircle className="w-11 h-11 text-green-600 shrink-0" />
                <div className="ml-4 text-left">
                  <div className="text-2xl font-bold text-green-600">
                    {results.correct}
                  </div>
                  <div className="text-sm text-green-700">Correct</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center p-4 bg-black text-white border-5 border-red-700 rounded-lg flex items-center"
              >
                <XCircle className="w-11 h-11 text-red-600 shrink-0" />
                <div className="ml-4 text-left">
                  <div className="text-2xl font-bold text-red-600">
                    {results.wrong}
                  </div>
                  <div className="text-sm text-red-700">Wrong</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center p-4 bg-black text-white border-5 border-blue-700 rounded-lg flex items-center"
              >
                <Clock className="w-11 h-11 text-blue-600 shrink-0" />
                <div className="ml-4 text-left">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.attempted}
                  </div>
                  <div className="text-sm text-blue-700">Attempted</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                onClick={handleRestart}
                className="flex-1 text-md py-6 bg-black cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Take Quiz Again
              </Button>
              <Button
                variant={"secondary"}
                onClick={handleGoHome}
                className="flex-1 text-lg py-6 cursor-pointer"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
