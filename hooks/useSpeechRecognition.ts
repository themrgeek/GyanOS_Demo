"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionHook {
  transcript: string;
  interimTranscript: string;
  isRecording: boolean;
  error: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  clearTranscript: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getBrowserSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as Record<string, unknown>;
  return (win.SpeechRecognition ?? win.webkitSpeechRecognition) as
    | (new () => SpeechRecognitionInstance)
    | null;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const shouldRestartRef = useRef(false);

  const startRecording = useCallback(() => {
    const SpeechRecognitionClass = getBrowserSpeechRecognition();
    if (!SpeechRecognitionClass) {
      setError("This demo requires Chrome or Edge for speech recognition.");
      return;
    }

    setError(null);

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev + finalText);
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        setError("Microphone access was denied. Please allow it in your browser settings.");
        shouldRestartRef.current = false;
        setIsRecording(false);
      } else if (event.error === "no-speech") {
        // silence — will auto-restart via onend
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch {
          setIsRecording(false);
          shouldRestartRef.current = false;
        }
      } else {
        setIsRecording(false);
        setInterimTranscript("");
      }
    };

    recognitionRef.current = recognition;
    shouldRestartRef.current = true;
    setIsRecording(true);

    try {
      recognition.start();
    } catch {
      setError("Failed to start speech recognition.");
      setIsRecording(false);
      shouldRestartRef.current = false;
    }
  }, []);

  const stopRecording = useCallback(() => {
    shouldRestartRef.current = false;
    recognitionRef.current?.stop();
    setIsRecording(false);
    setInterimTranscript("");
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      recognitionRef.current?.abort();
    };
  }, []);

  return {
    transcript,
    interimTranscript,
    isRecording,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
  };
}
