import { normalizeThai } from "../normalization/index.js";
import { segmentWords } from "../segmentation/index.js";

export type RomanizationStyle = "rtgs" | "casual";

export interface RomanizationOptions {
  style: RomanizationStyle;
  overrides?: PronunciationOverride[];
}

export interface PronunciationOverride {
  word: string;
  rtgs?: string;
  casual?: string;
  pronunciation?: string;
}

export interface PronunciationOptions {
  overrides: PronunciationOverride[];
}

function indexOverrides(overrides: PronunciationOverride[]): Map<string, PronunciationOverride> {
  if (!Array.isArray(overrides)) throw new TypeError("overrides must be an array");
  const indexed = new Map<string, PronunciationOverride>();
  for (const entry of overrides) {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry) ||
        typeof entry.word !== "string" || entry.word === "") {
      throw new TypeError("override word must be a non-empty string");
    }
    const values = [entry.rtgs, entry.casual, entry.pronunciation];
    if (values.every((value) => value === undefined) ||
        values.some((value) => value !== undefined && (typeof value !== "string" || value === ""))) {
      throw new TypeError("override readings must be non-empty strings");
    }
    const word = normalizeThai(entry.word);
    if (indexed.has(word)) throw new TypeError("duplicate override word");
    indexed.set(word, entry);
  }
  return indexed;
}

// Limited vocabulary; unknown segments are preserved.
const readings = new Map<string, Record<RomanizationStyle, string>>([
  ["สวัสดี", { rtgs: "sawatdi", casual: "sawasdee" }],
  ["ครับ", { rtgs: "khrap", casual: "krap" }],
  ["ค่ะ", { rtgs: "kha", casual: "kha" }],
]);

/** Romanize supported whole words; preserve all other segments. */
export function romanize(text: string, options: RomanizationOptions): string {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }
  if (options === null || typeof options !== "object" ||
      (options.style !== "rtgs" && options.style !== "casual")) {
    throw new TypeError('style must be "rtgs" or "casual"');
  }

  const overrides = indexOverrides(options.overrides === undefined ? [] : options.overrides);
  return segmentWords(text).map((word) =>
    overrides.get(normalizeThai(word))?.[options.style] ?? readings.get(word)?.[options.style] ?? word,
  ).join("");
}

/** Find a caller-provided pronunciation without inferring a reading. */
export function lookupPronunciation(word: string, options: PronunciationOptions): string | undefined {
  if (typeof word !== "string") throw new TypeError("word must be a string");
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("options must contain overrides");
  }
  return indexOverrides(options.overrides).get(normalizeThai(word))?.pronunciation;
}
