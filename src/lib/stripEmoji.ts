/**
 * Strips Unicode emoji characters from a string.
 * Returns the cleaned string (trimmed).
 */
export function stripEmoji(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .replace(
      /[\u{1F300}-\u{1FAD6}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu,
      ""
    )
    .trim();
}

/**
 * Returns true if the string is ONLY emoji (no meaningful text).
 * Used to decide whether to hide an element entirely.
 */
export function isOnlyEmoji(text: string | undefined | null): boolean {
  if (!text) return true;
  return stripEmoji(text).length === 0;
}
