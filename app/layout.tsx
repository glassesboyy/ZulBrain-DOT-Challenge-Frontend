import { QuizProvider } from "@/contexts/quiz-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZulBrain - Quiz App",
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
          <div className="min-h-screen bg-white">{children}</div>
        </QuizProvider>
      </body>
    </html>
  );
}
