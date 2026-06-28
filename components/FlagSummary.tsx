"use client";

import { useMemo } from "react";
import { detectOffensiveWords, summarizeFlags } from "@/lib/offensive-detector";
import type { Severity } from "@/lib/offensive-words";

interface FlagSummaryProps {
  transcript: string;
}

const SEVERITY_LABELS: Record<Severity, { label: string; color: string }> = {
  mild: { label: "Mild", color: "#F1C40F" },
  moderate: { label: "Moderate", color: "#E67E22" },
  severe: { label: "Severe", color: "#C0392B" },
};

export function FlagSummary({ transcript }: FlagSummaryProps) {
  const summary = useMemo(() => {
    const matches = detectOffensiveWords(transcript);
    return summarizeFlags(matches);
  }, [transcript]);

  return (
    <div
      className="flex h-full flex-col rounded-xl border p-5"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      aria-live="polite"
    >
      <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--primary)" }}>
        Flag Summary
      </h2>

      {summary.total === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div
            className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--surface-light)" }}
          >
            <span className="text-xl">✓</span>
          </div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No flags yet. Offensive words will be counted here as they appear.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: "var(--error)" }}>
              {summary.total}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              total flags
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              By Severity
            </h3>
            <div className="flex flex-col gap-2">
              {(Object.keys(SEVERITY_LABELS) as Severity[]).map((severity) => (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: SEVERITY_LABELS[severity].color }}
                    />
                    <span className="text-sm" style={{ color: "var(--foreground)" }}>
                      {SEVERITY_LABELS[severity].label}
                    </span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {summary.bySeverity[severity]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {Object.keys(summary.byLanguage).length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                By Language
              </h3>
              <div className="flex flex-col gap-2">
                {Object.entries(summary.byLanguage)
                  .sort(([, a], [, b]) => b - a)
                  .map(([language, count]) => (
                    <div key={language} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--foreground)" }}>
                        {language}
                      </span>
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
