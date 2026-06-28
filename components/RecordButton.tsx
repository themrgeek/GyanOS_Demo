"use client";

interface RecordButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}

export function RecordButton({ isRecording, onStart, onStop, disabled }: RecordButtonProps) {
  return (
    <button
      onClick={isRecording ? onStop : onStart}
      disabled={disabled}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      className="relative flex items-center gap-3 rounded-full px-6 py-3 font-semibold
        transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        backgroundColor: isRecording ? "var(--error)" : "var(--primary)",
        color: "white",
      }}
    >
      {isRecording && (
        <span
          className="animate-pulse-ring absolute inset-0 rounded-full"
          style={{ backgroundColor: "var(--error)", opacity: 0.4 }}
        />
      )}
      <span className="relative flex items-center gap-2">
        {isRecording ? (
          <>
            <span className="block h-3 w-3 rounded-sm bg-white" />
            Stop Recording
          </>
        ) : (
          <>
            <span className="block h-3 w-3 rounded-full bg-white" />
            Start Recording
          </>
        )}
      </span>
    </button>
  );
}
