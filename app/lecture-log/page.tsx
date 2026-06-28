"use client";

import { useState, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { NavBar } from "@/components/NavBar";
import { RecordButton } from "@/components/RecordButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { FlaggedTranscript } from "@/components/FlaggedTranscript";
import { FlagSummary } from "@/components/FlagSummary";

export default function LectureLogPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  const {
    transcript,
    interimTranscript,
    isRecording,
    error: speechError,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useSpeechRecognition(selectedLanguage);

  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = useCallback(
    (languageCode: string) => {
      if (isRecording) {
        setError("Stop recording before changing the language.");
        return;
      }
      setSelectedLanguage(languageCode);
      setError(null);
    },
    [isRecording]
  );

  const handleClear = useCallback(() => {
    clearTranscript();
    setError(null);
  }, [clearTranscript]);

  const displayError = speechError || error;

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
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="ml-4 font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      <main className="flex flex-1 gap-4 overflow-hidden p-6">
        <div className="flex-[2] min-w-0">
          <FlaggedTranscript transcript={transcript} interimTranscript={interimTranscript} />
        </div>
        <div className="w-72 shrink-0">
          <FlagSummary transcript={transcript} />
        </div>
      </main>

      <footer
        className="flex items-center justify-center gap-4 border-t px-6 py-4"
        style={{ borderColor: "var(--border)" }}
      >
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          disabled={isRecording}
        />

        <RecordButton
          isRecording={isRecording}
          onStart={startRecording}
          onStop={stopRecording}
          disabled={false}
        />

        <button
          onClick={handleClear}
          disabled={isRecording}
          className="rounded-full px-6 py-3 font-semibold transition-colors duration-200
            disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--surface-light)",
            color: "var(--foreground)",
          }}
          aria-label="Clear transcript and flags"
        >
          Clear
        </button>
      </footer>
    </div>
  );
}
