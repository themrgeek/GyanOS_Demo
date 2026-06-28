"use client";

import { useState, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { RecordButton } from "@/components/RecordButton";
import { TranscriptPanel } from "@/components/TranscriptPanel";
import { NotesPanel } from "@/components/NotesPanel";
import { NavBar } from "@/components/NavBar";

export default function Home() {
  const {
    transcript,
    interimTranscript,
    isRecording,
    error: speechError,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useSpeechRecognition();

  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const handleGenerateNotes = useCallback(async () => {
    if (!transcript.trim()) {
      setGenerateError("Please record some speech first.");
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);
    setNotes("");

    try {
      const response = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || "Note generation failed.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response stream available.");
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setNotes((prev) => prev + decoder.decode(value));
      }
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Note generation failed. Please try again.";
      setGenerateError(message);
    } finally {
      setIsGenerating(false);
    }
  }, [transcript]);

  const handleClear = useCallback(() => {
    clearTranscript();
    setNotes("");
    setGenerateError(null);
  }, [clearTranscript]);

  const displayError = speechError || generateError;

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      {displayError && (
        <div
          className="mx-6 mt-4 flex items-center justify-between rounded-lg px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(192, 57, 43, 0.1)", color: "var(--error)" }}
          role="alert"
        >
          <span>{displayError}</span>
          <button
            onClick={() => setGenerateError(null)}
            aria-label="Dismiss error"
            className="ml-4 font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      <main className="flex flex-1 gap-4 overflow-hidden p-6">
        <div className="flex-1 min-w-0">
          <TranscriptPanel
            transcript={transcript}
            interimTranscript={interimTranscript}
            error={null}
          />
        </div>
        <div className="flex-1 min-w-0">
          <NotesPanel notes={notes} isGenerating={isGenerating} />
        </div>
      </main>

      <footer
        className="flex items-center justify-center gap-4 border-t px-6 py-4"
        style={{ borderColor: "var(--border)" }}
      >
        <RecordButton
          isRecording={isRecording}
          onStart={startRecording}
          onStop={stopRecording}
          disabled={isGenerating}
        />

        <button
          onClick={handleGenerateNotes}
          disabled={isRecording || isGenerating || !transcript.trim()}
          className="rounded-full px-6 py-3 font-semibold text-white transition-colors
            duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: "var(--primary)" }}
          aria-label="Generate notes from transcript"
        >
          {isGenerating ? "Generating..." : "Generate Notes"}
        </button>

        <button
          onClick={handleClear}
          disabled={isRecording || isGenerating}
          className="rounded-full px-6 py-3 font-semibold transition-colors duration-200
            disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--surface-light)",
            color: "var(--foreground)",
          }}
          aria-label="Clear transcript and notes"
        >
          Clear
        </button>
      </footer>
    </div>
  );
}
