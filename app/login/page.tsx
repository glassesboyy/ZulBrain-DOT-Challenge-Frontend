"use client";

import type React from "react";

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
import { useState } from "react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useQuiz();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);

    // Save user to localStorage and context
    saveToLocalStorage("quiz_user", name.trim());
    dispatch({ type: "SET_USER", payload: name.trim() });

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      router.push("/quiz");
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto w-17 h-17 bg-primary rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">
              ZulBrain - Quiz App
            </CardTitle>
            <CardDescription>
              Enter your name to start the quiz challenge!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-center text-lg"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="w-full text-lg py-6"
                disabled={!name.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Starting Quiz...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Start Quiz
                    <ArrowRight className="w-4 h-4" />
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
