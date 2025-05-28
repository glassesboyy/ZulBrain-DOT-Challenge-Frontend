import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QuizProvider } from "@/contexts/quiz-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quiz App - Test Your Knowledge",
  description: "A fun and interactive quiz application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QuizProvider>
          <div className="min-h-screen bg-black">{children}</div>
        </QuizProvider>
      </body>
    </html>
  );
}
