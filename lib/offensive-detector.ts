import { OFFENSIVE_DICTIONARY, type OffensiveEntry, type Severity } from "./offensive-words";

export interface FlaggedMatch {
  startIndex: number;
  endIndex: number;
  matchedWord: string;
  entry: OffensiveEntry;
}

export interface TranscriptSegment {
  text: string;
  flag: FlaggedMatch | null;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function detectOffensiveWords(text: string): FlaggedMatch[] {
  const matches: FlaggedMatch[] = [];

  for (const entry of OFFENSIVE_DICTIONARY) {
    const variants = [entry.word];
    if (entry.romanized !== entry.word) {
      variants.push(entry.romanized);
    }

    for (const variant of variants) {
      const pattern = new RegExp(`(?:^|[\\s,;.!?।])${escapeRegex(variant)}(?=[\\s,;.!?।]|$)`, "gi");
      let match: RegExpExecArray | null;

      while ((match = pattern.exec(text)) !== null) {
        const leadingWhitespace = match[0].length - variant.length;
        const startIndex = match.index + leadingWhitespace;
        const endIndex = startIndex + variant.length;

        const alreadyMatched = matches.some(
          (existing) => startIndex >= existing.startIndex && startIndex < existing.endIndex
        );
        if (!alreadyMatched) {
          matches.push({ startIndex, endIndex, matchedWord: text.slice(startIndex, endIndex), entry });
        }
      }
    }
  }

  matches.sort((a, b) => a.startIndex - b.startIndex);
  return matches;
}

export function segmentTranscript(text: string): TranscriptSegment[] {
  const matches = detectOffensiveWords(text);
  if (matches.length === 0) {
    return [{ text, flag: null }];
  }

  const segments: TranscriptSegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.startIndex > cursor) {
      segments.push({ text: text.slice(cursor, match.startIndex), flag: null });
    }
    segments.push({ text: text.slice(match.startIndex, match.endIndex), flag: match });
    cursor = match.endIndex;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), flag: null });
  }

  return segments;
}

export interface FlagSummaryData {
  total: number;
  bySeverity: Record<Severity, number>;
  byLanguage: Record<string, number>;
}

export function summarizeFlags(matches: FlaggedMatch[]): FlagSummaryData {
  const bySeverity: Record<Severity, number> = { mild: 0, moderate: 0, severe: 0 };
  const byLanguage: Record<string, number> = {};

  for (const match of matches) {
    bySeverity[match.entry.severity]++;
    byLanguage[match.entry.language] = (byLanguage[match.entry.language] || 0) + 1;
  }

  return { total: matches.length, bySeverity, byLanguage };
}
