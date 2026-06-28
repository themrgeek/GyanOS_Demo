"use client";

import Markdown from "react-markdown";

interface NotesPanelProps {
  notes: string;
  isGenerating: boolean;
}

export function NotesPanel({ notes, isGenerating }: NotesPanelProps) {
  const isEmpty = !notes && !isGenerating;

  return (
    <div
      className="flex h-full flex-col rounded-xl border p-5"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      aria-live="polite"
    >
      <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--primary)" }}>
        Generated Notes
      </h2>

      <div className="flex-1 overflow-y-auto text-sm leading-relaxed">
        {isEmpty ? (
          <p style={{ color: "var(--muted)" }}>
            Record a lecture, then click &quot;Generate Notes&quot; to create structured study notes
            from the transcript.
          </p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <Markdown>{notes}</Markdown>
            {isGenerating && (
              <span className="animate-blink inline-block h-4 w-1.5 align-text-bottom" style={{ backgroundColor: "var(--primary)" }} />
            )}
          </div>
        )}
      </div>

      {notes && !isGenerating && (
        <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
          Notes are not saved — for demo purposes only.
        </p>
      )}
    </div>
  );
}
