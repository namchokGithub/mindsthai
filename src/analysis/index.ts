import { segmentSentences, segmentWords } from "../segmentation/index.js";

export interface ThaiTextAnalysis {
  codePointCount: number;
  thaiBlockCodePointCount: number;
  wordSegments: string[];
  sentenceSegments: string[];
}

/** Count Unicode code points and return existing word and sentence segments. */
export function analyzeThai(text: string): ThaiTextAnalysis {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }

  let codePointCount = 0;
  let thaiBlockCodePointCount = 0;
  for (const character of text) {
    codePointCount++;
    const code = character.charCodeAt(0);
    if (code >= 0x0e00 && code <= 0x0e7f) thaiBlockCodePointCount++;
  }

  return {
    codePointCount,
    thaiBlockCodePointCount,
    wordSegments: segmentWords(text),
    sentenceSegments: segmentSentences(text),
  };
}
