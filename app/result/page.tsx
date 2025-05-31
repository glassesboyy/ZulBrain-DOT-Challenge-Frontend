"use client";

import { StatCard } from "@/components/stat-card";
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
    if (results.percentage >= 80) return "text-emerald-300";
    if (results.percentage >= 60) return "text-amber-300";
    return "text-red-300";
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-lg bg-white border border-gray-100">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-indigo-600 shadow-lg"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-4xl font-bold text-gray-900">
              Quiz Complete!
            </CardTitle>
            <p
              className={`text-lg font-medium ${
                results.percentage >= 80
                  ? "text-green-600"
                  : results.percentage >= 60
                  ? "text-amber-600"
                  : "text-red-600"
              }`}
            >
              {getPerformanceMessage()}{" "}
              <span className="text-gray-700">{state.user}</span>
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-indigo-600">
                {results.percentage}%
              </div>
              <Progress
                value={results.percentage}
                className="w-full h-3"
                indicatorClassName={`${
                  results.percentage >= 80
                    ? "bg-green-500"
                    : results.percentage >= 60
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={<CheckCircle className="w-10 h-10 text-green-600" />}
                value={results.correct}
                label="Correct"
                bgColor="bg-green-50"
                textColor="text-green-600"
                borderColor="border-green-100"
              />
              <StatCard
                icon={<XCircle className="w-10 h-10 text-red-600" />}
                value={results.wrong}
                label="Wrong"
                bgColor="bg-red-50"
                textColor="text-red-600"
                borderColor="border-red-100"
              />
              <StatCard
                icon={<Clock className="w-10 h-10 text-indigo-600" />}
                value={results.attempted}
                label="Attempted"
                bgColor="bg-indigo-50"
                textColor="text-indigo-600"
                borderColor="border-indigo-100"
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                onClick={handleRestart}
                className="flex-1 h-12 text-lg bg-indigo-600 hover:bg-indigo-700"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Take Quiz Again
              </Button>
              <Button
                variant="outline"
                onClick={handleGoHome}
                className="flex-1 h-12 text-lg border-gray-200 hover:bg-gray-50"
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
