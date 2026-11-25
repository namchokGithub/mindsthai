import { lookupWord, type DictionaryOptions } from "../dictionary/index.js";
import { segmentWords } from "../segmentation/index.js";

export type SpellingOptions = DictionaryOptions;

export interface SpellingResult {
  word: string;
  start: number;
  end: number;
  status: "known" | "unknown";
}

/** Check Thai word segments against the limited dictionary, without suggestions. */
export function checkSpelling(text: string, options?: SpellingOptions): SpellingResult[] {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }
  // Validate options even when there are no word segments to check.
  lookupWord("", options);

  const results: SpellingResult[] = [];
  let start = 0;
  for (const word of segmentWords(text)) {
    const end = start + word.length;
    if (/[ก-ฮ]/u.test(word)) {
      results.push({ word, start, end, status: lookupWord(word, options) ? "known" : "unknown" });
    }
    start = end;
  }
  return results;
}
