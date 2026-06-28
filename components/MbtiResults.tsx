"use client";

import Markdown from "react-markdown";
import type { MbtiResult } from "@/lib/mbti-questions";

interface MbtiResultsProps {
  result: MbtiResult;
  analysis: string;
  isAnalyzing: boolean;
}

const DIMENSION_LABELS: Record<string, [string, string]> = {
  EI: ["Extraversion", "Introversion"],
  SN: ["Sensing", "Intuition"],
  TF: ["Thinking", "Feeling"],
  JP: ["Judging", "Perceiving"],
};

export function MbtiResults({ result, analysis, isAnalyzing }: MbtiResultsProps) {
  return (
    <div className="flex h-full gap-4">
      <div
        className="flex w-80 shrink-0 flex-col rounded-xl border p-5"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <h2 className="mb-2 text-lg font-semibold" style={{ color: "var(--primary)" }}>
          Your Type
        </h2>
        <p className="mb-6 text-5xl font-bold tracking-widest" style={{ color: "var(--primary)" }}>
          {result.type}
        </p>

        <div className="flex flex-col gap-4">
          {(Object.keys(result.dimensions) as Array<keyof typeof result.dimensions>).map((dim) => {
            const { label, percentage } = result.dimensions[dim];
            const [leftLabel, rightLabel] = DIMENSION_LABELS[dim];
            const isLeft = label === leftLabel[0];

            return (
              <div key={dim}>
                <div className="mb-1 flex justify-between text-xs" style={{ color: "var(--muted)" }}>
                  <span>{leftLabel}</span>
                  <span>{rightLabel}</span>
                </div>
                <div
                  className="relative h-3 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: "var(--surface-light)" }}
                >
                  <div
                    className="absolute h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: "var(--accent)",
                      width: `${percentage}%`,
                      left: isLeft ? 0 : undefined,
                      right: isLeft ? undefined : 0,
                    }}
                  />
                </div>
                <p className="mt-1 text-center text-xs font-medium" style={{ color: "var(--primary)" }}>
                  {label} — {percentage}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="flex flex-1 flex-col overflow-hidden rounded-xl border p-5"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        aria-live="polite"
      >
        <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--primary)" }}>
          Personality Analysis
        </h2>

        <div className="flex-1 overflow-y-auto text-sm leading-relaxed">
          {!analysis && isAnalyzing ? (
            <p style={{ color: "var(--muted)" }}>Generating your personality analysis...</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <Markdown>{analysis}</Markdown>
              {isAnalyzing && (
                <span
                  className="animate-blink inline-block h-4 w-1.5 align-text-bottom"
                  style={{ backgroundColor: "var(--primary)" }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
