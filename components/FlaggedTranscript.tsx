"use client";

import { useMemo } from "react";
import { segmentTranscript } from "@/lib/offensive-detector";
import type { Severity } from "@/lib/offensive-words";

interface FlaggedTranscriptProps {
  transcript: string;
  interimTranscript: string;
}

const SEVERITY_COLORS: Record<Severity, string> = {
  mild: "rgba(241, 196, 15, 0.25)",
  moderate: "rgba(230, 126, 34, 0.25)",
  severe: "rgba(192, 57, 43, 0.2)",
};

const SEVERITY_BORDER_COLORS: Record<Severity, string> = {
  mild: "rgba(241, 196, 15, 0.8)",
  moderate: "rgba(230, 126, 34, 0.8)",
  severe: "rgba(192, 57, 43, 0.7)",
};

export function FlaggedTranscript({ transcript, interimTranscript }: FlaggedTranscriptProps) {
  const segments = useMemo(() => segmentTranscript(transcript), [transcript]);
  const isEmpty = !transcript && !interimTranscript;

  return (
    <div
      className="flex h-full flex-col rounded-xl border p-5"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--primary)" }}>
        Live Transcript
      </h2>

      <div className="flex-1 overflow-y-auto text-sm leading-relaxed">
        {isEmpty ? (
          <p style={{ color: "var(--muted)" }}>
            Select a language, click &quot;Start Recording&quot; and begin speaking.
            Offensive words will be flagged in real time.
          </p>
        ) : (
          <p>
            {segments.map((segment, index) => {
              if (!segment.flag) {
                return <span key={index}>{segment.text}</span>;
              }

              const { severity, language } = segment.flag.entry;
              return (
                <span
                  key={index}
                  className="relative cursor-help rounded px-0.5"
                  style={{
                    backgroundColor: SEVERITY_COLORS[severity],
                    borderBottom: `2px solid ${SEVERITY_BORDER_COLORS[severity]}`,
                  }}
                  title={`${language} — ${severity} severity`}
                  role="mark"
                  aria-label={`Flagged word: ${severity} severity, ${language}`}
                >
                  {segment.text}
                </span>
              );
            })}
            {interimTranscript && (
              <span style={{ color: "var(--muted)" }}>{interimTranscript}</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
