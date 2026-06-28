"use client";

export interface LanguageOption {
  code: string;
  label: string;
  script: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en-US", label: "English", script: "Latin" },
  { code: "hi-IN", label: "Hindi", script: "Devanagari" },
  { code: "gu-IN", label: "Gujarati", script: "Gujarati" },
  { code: "ta-IN", label: "Tamil", script: "Tamil" },
  { code: "te-IN", label: "Telugu", script: "Telugu" },
  { code: "mr-IN", label: "Marathi", script: "Devanagari" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  disabled: boolean;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange, disabled }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="language-select"
        className="text-sm font-medium"
        style={{ color: "var(--muted)" }}
      >
        Language:
      </label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(event) => onLanguageChange(event.target.value)}
        disabled={disabled}
        className="rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-150
          disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        }}
        aria-label="Select recognition language"
      >
        {SUPPORTED_LANGUAGES.map(({ code, label, script }) => (
          <option key={code} value={code}>
            {label} ({script})
          </option>
        ))}
      </select>
    </div>
  );
}
