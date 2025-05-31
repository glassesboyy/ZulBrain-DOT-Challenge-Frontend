"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuiz } from "@/contexts/quiz-context";
import { saveToLocalStorage } from "@/utils/local-storage-helpers";
import { motion } from "framer-motion";
import { ArrowRight, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useQuiz();

  // Submit nama user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);

    saveToLocalStorage("quiz_user", name.trim());
    dispatch({ type: "SET_USER", payload: name.trim() });

    setTimeout(() => {
      router.push("/quiz");
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-indigo-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl bg-white border-none">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold text-indigo-600">
              ZulBrain
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Welcome to the Quiz Challenge! 🎯
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 text-center text-lg bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-300"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-lg"
                disabled={!name.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Preparing Quiz...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Start Quiz</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
