"use client";

import type { MbtiQuestion as MbtiQuestionType } from "@/lib/mbti-questions";

interface MbtiQuestionProps {
  question: MbtiQuestionType;
  onAnswer: (selectedPole: string) => void;
}

export function MbtiQuestion({ question, onAnswer }: MbtiQuestionProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>
        Which statement resonates with you more?
      </p>

      <button
        onClick={() => onAnswer(question.optionA.pole)}
        className="w-full cursor-pointer rounded-xl border-2 border-transparent p-5 text-left text-sm
          leading-relaxed transition-all duration-150 hover:scale-[1.01] hover:border-[var(--accent)]"
        style={{
          backgroundColor: "var(--surface-light)",
          color: "var(--foreground)",
        }}
        aria-label={`Option A: ${question.optionA.text}`}
      >
        <span className="mb-1 block text-xs font-semibold" style={{ color: "var(--primary)" }}>
          A
        </span>
        {question.optionA.text}
      </button>

      <button
        onClick={() => onAnswer(question.optionB.pole)}
        className="w-full cursor-pointer rounded-xl border-2 border-transparent p-5 text-left text-sm
          leading-relaxed transition-all duration-150 hover:scale-[1.01] hover:border-[var(--accent)]"
        style={{
          backgroundColor: "var(--surface-light)",
          color: "var(--foreground)",
        }}
        aria-label={`Option B: ${question.optionB.text}`}
      >
        <span className="mb-1 block text-xs font-semibold" style={{ color: "var(--primary)" }}>
          B
        </span>
        {question.optionB.text}
      </button>
    </div>
  );
}
