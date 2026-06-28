"use client";

import { useState, useCallback } from "react";
import Markdown from "react-markdown";
import { NavBar } from "@/components/NavBar";
import { MbtiProgress } from "@/components/MbtiProgress";
import { MbtiQuestion } from "@/components/MbtiQuestion";
import { MbtiResults } from "@/components/MbtiResults";
import {
  MBTI_QUESTIONS,
  scoreMbti,
  type MbtiAnswer,
  type MbtiResult,
} from "@/lib/mbti-questions";

type TestPhase = "intro" | "questions" | "results";

export default function MbtiPage() {
  const [phase, setPhase] = useState<TestPhase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<MbtiAnswer[]>([]);
  const [result, setResult] = useState<MbtiResult | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTest = useCallback(() => {
    setPhase("questions");
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
    setAnalysis("");
    setSummary("");
    setError(null);
  }, []);

  const fetchAnalysis = useCallback(async (mbtiResult: MbtiResult) => {
    setIsAnalyzing(true);
    setAnalysis("");
    setError(null);

    try {
      const response = await fetch("/api/analyze-personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mbtiType: mbtiResult.type,
          dimensions: mbtiResult.dimensions,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || "Analysis failed.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response stream available.");
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAnalysis((prev) => prev + decoder.decode(value));
      }
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Analysis failed. Please try again.";
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const fetchSummary = useCallback(async (mbtiResult: MbtiResult, answeredQuestions: MbtiAnswer[]) => {
    setIsSummarizing(true);
    setSummary("");

    try {
      const response = await fetch("/api/summarize-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mbtiType: mbtiResult.type,
          dimensions: mbtiResult.dimensions,
          answers: answeredQuestions,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || "Summary failed.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response stream available.");
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setSummary((prev) => prev + decoder.decode(value));
      }
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Summary failed.";
      setError(message);
    } finally {
      setIsSummarizing(false);
    }
  }, []);

  const handleAnswer = useCallback(
    (selectedPole: string) => {
      const question = MBTI_QUESTIONS[currentIndex];
      const newAnswer: MbtiAnswer = {
        questionId: question.id,
        dimension: question.dimension,
        selectedPole,
      };

      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      if (currentIndex < MBTI_QUESTIONS.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const mbtiResult = scoreMbti(updatedAnswers);
        setResult(mbtiResult);
        setPhase("results");
        fetchAnalysis(mbtiResult);
        fetchSummary(mbtiResult, updatedAnswers);
      }
    },
    [currentIndex, answers, fetchAnalysis, fetchSummary]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      {error && (
        <div
          className="mx-6 mt-4 flex items-center justify-between rounded-lg px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(192, 57, 43, 0.1)", color: "var(--error)" }}
          role="alert"
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="ml-4 font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      <main className="flex flex-1 flex-col items-center justify-center p-6">
        {phase === "intro" && (
          <div className="max-w-lg text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "var(--surface-light)" }}
            >
              <span className="text-2xl">🧠</span>
            </div>
            <h2 className="mb-3 text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Teacher Personality Assessment
            </h2>
            <p className="mb-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Discover your teaching personality type with this 20-question MBTI-based assessment.
            </p>
            <p className="mb-8 text-xs" style={{ color: "var(--muted)" }}>
              Takes about 3 minutes. You&apos;ll get a detailed personality analysis and a concise summary of your results.
            </p>
            <button
              onClick={startTest}
              className="rounded-full px-8 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: "var(--primary)" }}
              aria-label="Begin the MBTI personality test"
            >
              Begin Assessment
            </button>
          </div>
        )}

        {phase === "questions" && (
          <div className="w-full max-w-xl">
            <MbtiProgress current={currentIndex + 1} total={MBTI_QUESTIONS.length} />
            <div
              className="rounded-xl border p-6"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <MbtiQuestion
                key={MBTI_QUESTIONS[currentIndex].id}
                question={MBTI_QUESTIONS[currentIndex]}
                onAnswer={handleAnswer}
              />
            </div>
          </div>
        )}

        {phase === "results" && result && (
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                Your Results
              </h2>
              <button
                onClick={startTest}
                disabled={isAnalyzing || isSummarizing}
                className="rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200
                  disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor: "var(--surface-light)",
                  color: "var(--foreground)",
                }}
                aria-label="Retake the MBTI test"
              >
                Retake Test
              </button>
            </div>

            <MbtiResults result={result} analysis={analysis} isAnalyzing={isAnalyzing} />

            {/* Summary card */}
            <div
              className="rounded-xl border p-5"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              aria-live="polite"
            >
              <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--primary)" }}>
                Quick Summary
              </h2>
              <div className="text-sm leading-relaxed">
                {!summary && isSummarizing ? (
                  <p style={{ color: "var(--muted)" }}>Generating your summary...</p>
                ) : summary ? (
                  <div className="prose prose-sm max-w-none">
                    <Markdown>{summary}</Markdown>
                    {isSummarizing && (
                      <span
                        className="animate-blink inline-block h-4 w-1.5 align-text-bottom"
                        style={{ backgroundColor: "var(--primary)" }}
                      />
                    )}
                  </div>
                ) : (
                  <p style={{ color: "var(--muted)" }}>Summary will appear here after analysis.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
