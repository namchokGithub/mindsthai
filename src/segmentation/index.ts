function segment(text: string, granularity: "word" | "sentence"): string[] {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }
  if (text === "") {
    return [];
  }
  if (typeof Intl === "undefined" || typeof Intl.Segmenter !== "function") {
    throw new Error("Intl.Segmenter is required for text segmentation");
  }

  return Array.from(new Intl.Segmenter("th", { granularity }).segment(text), (part) => part.segment);
}

/** Split text into word segments, preserving punctuation and whitespace. */
export function segmentWords(text: string): string[] {
  return segment(text, "word");
}

/** Split text into sentence segments while preserving the original text. */
export function segmentSentences(text: string): string[] {
  return segment(text, "sentence");
}
