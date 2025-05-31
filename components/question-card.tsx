"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuiz } from "@/contexts/quiz-context";
import { decodeHtmlEntities } from "@/utils/html-decoder";
import { motion } from "framer-motion";
import { useState } from "react";

export function QuestionCard() {
  const { state, dispatch } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const progress =
    ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

  if (!currentQuestion) {
    return null;
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    dispatch({ type: "ANSWER_QUESTION", payload: answer });

    setTimeout(() => {
      dispatch({ type: "NEXT_QUESTION" });
      setSelectedAnswer("");
    }, 500);
  };

  return (
    <motion.div
      key={state.currentQuestionIndex}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="shadow-lg bg-white border border-gray-100">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Question {state.currentQuestionIndex + 1} of{" "}
              {state.questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress
            value={progress}
            className="w-full"
            indicatorClassName="bg-indigo-600"
          />
          <CardTitle className="text-xl leading-relaxed text-gray-800">
            {decodeHtmlEntities(currentQuestion.question)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.shuffled_answers.map((answer, index) => (
            <Button
              key={index}
              variant={selectedAnswer === answer ? "default" : "outline"}
              className={`w-full p-4 h-auto text-left justify-start transition-all ${
                selectedAnswer === answer
                  ? "bg-indigo-600 text-white shadow-md scale-105"
                  : "hover:bg-indigo-50 hover:border-indigo-200 border-gray-200"
              }`}
              onClick={() => handleAnswerSelect(answer)}
              disabled={selectedAnswer !== ""}
            >
              <span className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-wrap">{decodeHtmlEntities(answer)}</span>
              </span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
