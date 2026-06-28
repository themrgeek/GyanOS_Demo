"use client";

interface TranscriptPanelProps {
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

export function TranscriptPanel({ transcript, interimTranscript, error }: TranscriptPanelProps) {
  const isEmpty = !transcript && !interimTranscript;

  return (
    <div
      className="flex h-full flex-col rounded-xl p-5"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--primary-light)" }}>
        Live Transcript
      </h2>

      {error && (
        <div
          className="mb-3 rounded-lg px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(231, 76, 60, 0.15)", color: "var(--error)" }}
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto text-sm leading-relaxed">
        {isEmpty ? (
          <p style={{ color: "var(--muted)" }}>
            Click &quot;Start Recording&quot; and begin speaking. Your speech will appear here in
            real time.
          </p>
        ) : (
          <p>
            {transcript}
            {interimTranscript && (
              <span style={{ color: "var(--muted)" }}>{interimTranscript}</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
