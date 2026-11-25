/** Normalize text to Unicode NFC without additional Thai-specific rewriting. */
export function normalizeThai(text: string): string {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }

  return text.normalize("NFC");
}
