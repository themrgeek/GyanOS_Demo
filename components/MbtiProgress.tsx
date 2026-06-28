"use client";

interface MbtiProgressProps {
  current: number;
  total: number;
}

export function MbtiProgress({ current, total }: MbtiProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span style={{ color: "var(--muted)" }}>
          Question {current} of {total}
        </span>
        <span style={{ color: "var(--primary)" }} className="font-medium">
          {percentage}%
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--surface-light)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: "var(--accent)",
          }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Question ${current} of ${total}`}
        />
      </div>
    </div>
  );
}
